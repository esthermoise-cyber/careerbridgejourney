-- CareerBridge Journey — database setup
-- Safe to run more than once. All objects are prefixed cbj_ so nothing from the
-- earlier Moving Forward Pathways build is touched. Existing sign-in accounts
-- (auth.users) keep working.

-- ───────────────────────── Tables ─────────────────────────

create table if not exists public.cbj_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.cbj_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  display_name text not null default '' check (char_length(display_name) <= 40),
  phone text not null default '' check (char_length(phone) <= 30),
  track text not null default '' check (char_length(track) <= 40),
  pathway text not null default '' check (char_length(pathway) <= 60),
  avatar_color text not null default '#1648A4' check (avatar_color ~ '^#[0-9A-Fa-f]{6}$'),
  points integer not null default 0 check (points between 0 and 100000),
  show_on_leaderboard boolean not null default false,
  consent jsonb not null default '{}'::jsonb check (pg_column_size(consent) < 4000),
  consent_updated_at timestamptz,
  suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cbj_workspaces (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 500000),
  updated_at timestamptz not null default now()
);

create table if not exists public.cbj_circle_members (
  circle_id text not null check (char_length(circle_id) <= 40),
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);

create table if not exists public.cbj_posts (
  id uuid primary key default gen_random_uuid(),
  circle_id text not null check (char_length(circle_id) <= 40),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null default 'Member',
  author_color text not null default '#1648A4',
  kind text not null default 'update' check (kind in ('update', 'win', 'question', 'encouragement')),
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists cbj_posts_circle_idx on public.cbj_posts (circle_id, created_at desc);
create index if not exists cbj_posts_user_idx on public.cbj_posts (user_id, created_at desc);

create table if not exists public.cbj_cheers (
  post_id uuid not null references public.cbj_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.cbj_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.cbj_posts (id) on delete cascade,
  reporter uuid not null references auth.users (id) on delete cascade,
  reason text not null default '' check (char_length(reason) <= 500),
  created_at timestamptz not null default now(),
  unique (post_id, reporter)
);

create table if not exists public.cbj_blocks (
  blocker uuid not null references auth.users (id) on delete cascade,
  blocked uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked)
);

create table if not exists public.cbj_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic text not null default 'support' check (char_length(topic) <= 40),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Helper functions ─────────────────────────

create or replace function public.cbj_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.cbj_admins a where a.user_id = auth.uid());
$$;

create or replace function public.cbj_is_suspended()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select p.suspended from public.cbj_profiles p where p.id = auth.uid()), false);
$$;

-- Keep updated_at fresh and stop members from changing protected fields.
create or replace function public.cbj_profiles_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    if not public.cbj_is_admin() then new.suspended := false; end if;
  else
    new.id := old.id;
    new.created_at := old.created_at;
    if not public.cbj_is_admin() and auth.uid() is not null then new.suspended := old.suspended; end if;
    if new.consent is distinct from old.consent then new.consent_updated_at := now(); end if;
  end if;
  return new;
end $$;

drop trigger if exists cbj_profiles_guard on public.cbj_profiles;
create trigger cbj_profiles_guard before insert or update on public.cbj_profiles
for each row execute function public.cbj_profiles_guard();

create or replace function public.cbj_workspaces_touch()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists cbj_workspaces_touch on public.cbj_workspaces;
create trigger cbj_workspaces_touch before insert or update on public.cbj_workspaces
for each row execute function public.cbj_workspaces_touch();

-- Posts: author name comes from the profile (cannot be spoofed) and posting is rate limited.
create or replace function public.cbj_posts_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  p public.cbj_profiles%rowtype;
  recent integer;
begin
  select * into p from public.cbj_profiles where id = new.user_id;
  if p.id is null then raise exception 'Finish setting up your profile before posting.'; end if;
  if p.suspended then raise exception 'Posting is paused on this account.'; end if;
  select count(*) into recent from public.cbj_posts
    where user_id = new.user_id and created_at > now() - interval '1 hour';
  if recent >= 12 then raise exception 'You are posting very quickly. Please try again a little later.'; end if;
  new.author_name := coalesce(nullif(btrim(p.display_name), ''), 'Member');
  new.author_color := p.avatar_color;
  new.body := btrim(new.body);
  new.created_at := now();
  return new;
end $$;

drop trigger if exists cbj_posts_guard on public.cbj_posts;
create trigger cbj_posts_guard before insert on public.cbj_posts
for each row execute function public.cbj_posts_guard();

-- ───────────────────────── Row level security ─────────────────────────

alter table public.cbj_admins enable row level security;
alter table public.cbj_profiles enable row level security;
alter table public.cbj_workspaces enable row level security;
alter table public.cbj_circle_members enable row level security;
alter table public.cbj_posts enable row level security;
alter table public.cbj_cheers enable row level security;
alter table public.cbj_reports enable row level security;
alter table public.cbj_blocks enable row level security;
alter table public.cbj_messages enable row level security;

-- cbj_admins: no client policies on purpose. Only the SQL editor can change admins.

drop policy if exists cbj_profiles_select on public.cbj_profiles;
create policy cbj_profiles_select on public.cbj_profiles for select to authenticated
  using (id = auth.uid() or public.cbj_is_admin());
drop policy if exists cbj_profiles_insert on public.cbj_profiles;
create policy cbj_profiles_insert on public.cbj_profiles for insert to authenticated
  with check (id = auth.uid());
drop policy if exists cbj_profiles_update on public.cbj_profiles;
create policy cbj_profiles_update on public.cbj_profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists cbj_workspaces_all on public.cbj_workspaces;
create policy cbj_workspaces_all on public.cbj_workspaces for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists cbj_members_select on public.cbj_circle_members;
create policy cbj_members_select on public.cbj_circle_members for select to authenticated
  using (user_id = auth.uid());
drop policy if exists cbj_members_insert on public.cbj_circle_members;
create policy cbj_members_insert on public.cbj_circle_members for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists cbj_members_delete on public.cbj_circle_members;
create policy cbj_members_delete on public.cbj_circle_members for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists cbj_posts_select on public.cbj_posts;
create policy cbj_posts_select on public.cbj_posts for select to authenticated
  using (
    user_id = auth.uid()
    or public.cbj_is_admin()
    or not exists (
      select 1 from public.cbj_blocks b
      where b.blocker = auth.uid() and b.blocked = cbj_posts.user_id
    )
  );
drop policy if exists cbj_posts_insert on public.cbj_posts;
create policy cbj_posts_insert on public.cbj_posts for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.cbj_circle_members m
      where m.user_id = auth.uid() and m.circle_id = cbj_posts.circle_id
    )
  );
drop policy if exists cbj_posts_delete on public.cbj_posts;
create policy cbj_posts_delete on public.cbj_posts for delete to authenticated
  using (user_id = auth.uid() or public.cbj_is_admin());

drop policy if exists cbj_cheers_select on public.cbj_cheers;
create policy cbj_cheers_select on public.cbj_cheers for select to authenticated using (true);
drop policy if exists cbj_cheers_insert on public.cbj_cheers;
create policy cbj_cheers_insert on public.cbj_cheers for insert to authenticated
  with check (user_id = auth.uid() and not public.cbj_is_suspended());
drop policy if exists cbj_cheers_delete on public.cbj_cheers;
create policy cbj_cheers_delete on public.cbj_cheers for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists cbj_reports_insert on public.cbj_reports;
create policy cbj_reports_insert on public.cbj_reports for insert to authenticated
  with check (reporter = auth.uid());
drop policy if exists cbj_reports_select on public.cbj_reports;
create policy cbj_reports_select on public.cbj_reports for select to authenticated
  using (reporter = auth.uid() or public.cbj_is_admin());
drop policy if exists cbj_reports_delete on public.cbj_reports;
create policy cbj_reports_delete on public.cbj_reports for delete to authenticated
  using (public.cbj_is_admin());

drop policy if exists cbj_blocks_all on public.cbj_blocks;
create policy cbj_blocks_all on public.cbj_blocks for all to authenticated
  using (blocker = auth.uid()) with check (blocker = auth.uid());

drop policy if exists cbj_messages_insert on public.cbj_messages;
create policy cbj_messages_insert on public.cbj_messages for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists cbj_messages_select on public.cbj_messages;
create policy cbj_messages_select on public.cbj_messages for select to authenticated
  using (user_id = auth.uid() or public.cbj_is_admin());
drop policy if exists cbj_messages_update on public.cbj_messages;
create policy cbj_messages_update on public.cbj_messages for update to authenticated
  using (public.cbj_is_admin()) with check (public.cbj_is_admin());

-- Signed-out visitors get nothing.
revoke all on public.cbj_admins, public.cbj_profiles, public.cbj_workspaces, public.cbj_circle_members,
  public.cbj_posts, public.cbj_cheers, public.cbj_reports, public.cbj_blocks, public.cbj_messages from anon;
grant select, insert, update on public.cbj_profiles to authenticated;
grant select, insert, update, delete on public.cbj_workspaces to authenticated;
grant select, insert, delete on public.cbj_circle_members to authenticated;
grant select, insert, delete on public.cbj_posts to authenticated;
grant select, insert, delete on public.cbj_cheers to authenticated;
grant select, insert, delete on public.cbj_reports to authenticated;
grant select, insert, delete on public.cbj_blocks to authenticated;
grant select, insert, update on public.cbj_messages to authenticated;

-- ───────────────────────── Functions the app calls ─────────────────────────

create or replace function public.cbj_feed(p_circle text, p_before timestamptz default null, p_limit integer default 30)
returns table (
  id uuid, circle_id text, user_id uuid, author_name text, author_color text, kind text,
  body text, created_at timestamptz, cheers bigint, cheered boolean, mine boolean
) language sql stable security invoker set search_path = public as $$
  select p.id, p.circle_id, p.user_id, p.author_name, p.author_color, p.kind, p.body, p.created_at,
    (select count(*) from public.cbj_cheers c where c.post_id = p.id),
    exists (select 1 from public.cbj_cheers c where c.post_id = p.id and c.user_id = auth.uid()),
    p.user_id = auth.uid()
  from public.cbj_posts p
  where p.circle_id = p_circle and (p_before is null or p.created_at < p_before)
  order by p.created_at desc
  limit least(greatest(coalesce(p_limit, 30), 1), 50);
$$;

create or replace function public.cbj_circle_counts()
returns table (circle_id text, members bigint)
language sql stable security definer set search_path = public as $$
  select m.circle_id, count(*) from public.cbj_circle_members m
  where auth.uid() is not null group by m.circle_id;
$$;

create or replace function public.cbj_leaderboard()
returns table (display_name text, avatar_color text, points integer, is_me boolean)
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(btrim(p.display_name), ''), 'Member'), p.avatar_color, p.points, p.id = auth.uid()
  from public.cbj_profiles p
  where auth.uid() is not null and p.show_on_leaderboard and not p.suspended and p.points > 0
  order by p.points desc, p.created_at asc
  limit 25;
$$;

-- Permanently deletes the caller's account and everything attached to it.
create or replace function public.cbj_delete_my_account()
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  delete from auth.users where id = auth.uid();
end $$;

-- Owner tools.
create or replace function public.cbj_admin_members()
returns table (
  id uuid, email text, full_name text, display_name text, phone text, track text, pathway text,
  points integer, consent jsonb, consent_updated_at timestamptz, suspended boolean, created_at timestamptz
) language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public.cbj_is_admin() then raise exception 'Owner access only'; end if;
  return query
    select p.id, u.email::text, p.full_name, p.display_name, p.phone, p.track, p.pathway,
      p.points, p.consent, p.consent_updated_at, p.suspended, p.created_at
    from public.cbj_profiles p join auth.users u on u.id = p.id
    order by p.created_at desc limit 5000;
end $$;

create or replace function public.cbj_admin_set_suspended(p_user uuid, p_suspended boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.cbj_is_admin() then raise exception 'Owner access only'; end if;
  update public.cbj_profiles set suspended = p_suspended where id = p_user;
end $$;

create or replace function public.cbj_admin_reports()
returns table (
  report_id uuid, reason text, reported_at timestamptz, post_id uuid, circle_id text,
  author_id uuid, author_name text, body text, posted_at timestamptz
) language plpgsql stable security definer set search_path = public as $$
begin
  if not public.cbj_is_admin() then raise exception 'Owner access only'; end if;
  return query
    select r.id, r.reason, r.created_at, p.id, p.circle_id, p.user_id, p.author_name, p.body, p.created_at
    from public.cbj_reports r join public.cbj_posts p on p.id = r.post_id
    order by r.created_at desc limit 500;
end $$;

create or replace function public.cbj_admin_messages()
returns table (id uuid, email text, full_name text, topic text, body text, resolved boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public.cbj_is_admin() then raise exception 'Owner access only'; end if;
  return query
    select m.id, u.email::text, coalesce(p.full_name, ''), m.topic, m.body, m.resolved, m.created_at
    from public.cbj_messages m join auth.users u on u.id = m.user_id
    left join public.cbj_profiles p on p.id = m.user_id
    order by m.created_at desc limit 1000;
end $$;

revoke all on function public.cbj_is_admin(), public.cbj_is_suspended(), public.cbj_feed(text, timestamptz, integer),
  public.cbj_circle_counts(), public.cbj_leaderboard(), public.cbj_delete_my_account(), public.cbj_admin_members(),
  public.cbj_admin_set_suspended(uuid, boolean), public.cbj_admin_reports(), public.cbj_admin_messages() from public, anon;
grant execute on function public.cbj_is_admin(), public.cbj_is_suspended(), public.cbj_feed(text, timestamptz, integer),
  public.cbj_circle_counts(), public.cbj_leaderboard(), public.cbj_delete_my_account(), public.cbj_admin_members(),
  public.cbj_admin_set_suspended(uuid, boolean), public.cbj_admin_reports(), public.cbj_admin_messages() to authenticated;

-- ───────────────────────── Make yourself the owner ─────────────────────────
-- After you have signed up in the app, run this once with your own sign-in email:
--
--   insert into public.cbj_admins (user_id)
--   select id from auth.users where lower(email) = lower('you@example.com')
--   on conflict do nothing;
