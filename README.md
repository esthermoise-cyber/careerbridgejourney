# CareerBridge Journey

**Your Pathway to Meaningful Careers and Opportunities** · Explore | Learn | Prepare | Advance

A free web app that helps people move from where they are to where they want to be in their
career, education or business: a personal roadmap, weekly goals, career matching, practice
questions and guides, challenges and rewards, and community circles.

## How it is built

| Piece | What | Cost |
| --- | --- | --- |
| Front end | React + TypeScript + Vite, a static single-page app (`src/`) | Netlify free tier |
| Accounts and data | Supabase (Postgres + Auth) with row level security (`supabase/schema.sql`) | Supabase free tier |

There are no paid APIs and no server code to run. Every table is protected so a member can read
and change only their own records; community posts are visible to signed-in members only.

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Without a `.env` file the dev server uses a browser-only practice database (never used in a
production build). To use the real database, copy `.env.example` to `.env` and fill in the two
public values from Supabase → Project Settings → API.

## Deploy

1. **Database:** run `supabase/schema.sql` in the Supabase SQL editor. It is safe to re-run and
   only creates objects prefixed `cbj_`.
2. **Site:** set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify → Site configuration
   → Environment variables, then deploy. Build command `npm run build`, publish directory `dist`
   (already in `netlify.toml`).
3. **Auth settings (Supabase → Authentication → URL Configuration):** set the Site URL to
   `https://careerbridgejourney.com` and add `https://careerbridgejourney.com/**` and
   `https://moving-forward-pathways-demo.netlify.app/**` as redirect URLs.
4. **Owner access:** sign up in the app, then run the snippet at the bottom of
   `supabase/schema.sql` with your email to unlock Owner Tools (members, opt-in export,
   reported posts, messages).

## Content rules

- Pay and job-outlook figures are never hard-coded; career cards link to the current Bureau of
  Labor Statistics page.
- Practice questions are original study aids, not official exam items.
- Marketing consent is opt-in, separate from sign-up, and recorded with a version and timestamp.
