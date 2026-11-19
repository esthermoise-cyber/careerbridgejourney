import { createClient, type User } from '@supabase/supabase-js'
import type { Backend, Profile, SessionUser, Workspace } from './types'
import { CONSENT_VERSION } from '../data/community'

const COLORS = ['#1648A4', '#22A745', '#F0804A', '#0E7490', '#8B5CF6', '#DB2777', '#D97706', '#102A4A']
export const pickColor = (seed: string) => COLORS[[...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]
export const firstName = (full: string) => full.trim().split(/\s+/)[0]?.slice(0, 40) || 'Member'

/** Turn low-level errors into something a person can act on. */
function friendly(e: unknown): Error {
  const raw = (e as { message?: string })?.message ?? String(e)
  const m = raw.toLowerCase()
  if (m.includes('invalid login')) return new Error('That email and password do not match. Please try again.')
  if (m.includes('already registered') || m.includes('already been registered')) return new Error('An account with this email already exists. Sign in instead, or reset your password.')
  if (m.includes('email not confirmed')) return new Error('Please confirm your email first. Check your inbox for the link.')
  if (m.includes('rate limit') || m.includes('too many')) return new Error('Too many attempts right now. Please wait a minute and try again.')
  if (m.includes('failed to fetch') || m.includes('networkerror') || m.includes('load failed')) return new Error('We could not reach the server. Check your connection and try again.')
  if (m.includes('duplicate key')) return new Error('That is already saved.')
  return new Error(raw)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ok = (r: { data: any; error: unknown }): any => { if (r.error) throw friendly(r.error); return r.data }

export function createSupabaseBackend(url: string, key: string): Backend {
  const sb = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  const toUser = (u: User | null | undefined): SessionUser | null =>
    u ? { id: u.id, email: u.email ?? '', fullName: String(u.user_metadata?.full_name ?? u.user_metadata?.name ?? '') } : null
  const uid = async () => {
    const { data } = await sb.auth.getSession()
    const id = data.session?.user.id
    if (!id) throw new Error('Your session ended. Please sign in again.')
    return id
  }

  return {
    mode: 'live',
    async getUser() { const { data } = await sb.auth.getSession(); return toUser(data.session?.user) },
    onAuth(cb) {
      const { data } = sb.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') cb('recovery', toUser(session?.user))
        else if (event === 'SIGNED_OUT') cb('out', null)
        else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') cb('in', toUser(session?.user))
      })
      return () => data.subscription.unsubscribe()
    },
    async signUp(input) {
      const { data, error } = await sb.auth.signUp({
        email: input.email, password: input.password,
        options: {
          emailRedirectTo: `${location.origin}/app`,
          data: {
            full_name: input.fullName, phone: input.phone,
            signup_consent: { ...input.consent, version: CONSENT_VERSION, at: new Date().toISOString(), source: 'signup' },
          },
        },
      })
      if (error) throw friendly(error)
      // Supabase hides duplicate sign-ups when confirmation is on: the user comes back with no identities.
      if (data.user && !data.session && (data.user.identities?.length ?? 0) === 0)
        throw new Error('An account with this email already exists. Sign in instead, or reset your password.')
      return { needsConfirm: !data.session }
    },
    async signIn(email, password) { ok(await sb.auth.signInWithPassword({ email, password })) },
    async signOut() { await sb.auth.signOut() },
    async sendReset(email) { ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/reset` })) },
    async updatePassword(password) { ok(await sb.auth.updateUser({ password })) },

    async loadProfile(user, seed) {
      const found = ok(await sb.from('cbj_profiles').select('*').eq('id', user.id).maybeSingle()) as Profile | null
      if (found) return found
      const { data } = await sb.auth.getUser()
      const meta = data.user?.user_metadata ?? {}
      const full = String(seed?.full_name ?? meta.full_name ?? user.fullName ?? '').slice(0, 120)
      const row = {
        id: user.id, full_name: full, display_name: firstName(full), phone: String(seed?.phone ?? meta.phone ?? '').slice(0, 30),
        avatar_color: pickColor(user.id), consent: (seed?.consent ?? meta.signup_consent ?? {}) as Record<string, unknown>,
        consent_updated_at: new Date().toISOString(),
      }
      return ok(await sb.from('cbj_profiles').upsert(row).select('*').single()) as Profile
    },
    async saveProfile(id, patch) {
      const { id: _i, suspended: _s, ...safe } = patch as Profile
      ok(await sb.from('cbj_profiles').update(safe).eq('id', id))
    },
    async loadWorkspace(id) {
      const row = ok(await sb.from('cbj_workspaces').select('data').eq('user_id', id).maybeSingle()) as { data: Workspace } | null
      return row?.data ?? null
    },
    async saveWorkspace(id, ws) { ok(await sb.from('cbj_workspaces').upsert({ user_id: id, data: ws })) },

    async circleCounts() {
      const rows = ok(await sb.rpc('cbj_circle_counts')) as { circle_id: string; members: number }[]
      return Object.fromEntries((rows ?? []).map(r => [r.circle_id, Number(r.members)]))
    },
    async myCircles() {
      const rows = ok(await sb.from('cbj_circle_members').select('circle_id').eq('user_id', await uid())) as { circle_id: string }[]
      return rows.map(r => r.circle_id)
    },
    async joinCircle(id) { ok(await sb.from('cbj_circle_members').upsert({ circle_id: id, user_id: await uid() })) },
    async leaveCircle(id) { ok(await sb.from('cbj_circle_members').delete().eq('circle_id', id).eq('user_id', await uid())) },
    async feed(circle, before) {
      const rows = ok(await sb.rpc('cbj_feed', { p_circle: circle, p_before: before ?? null, p_limit: 30 }))
      return (rows ?? []).map((r: Record<string, unknown>) => ({ ...r, cheers: Number(r.cheers) }))
    },
    async post(circle, kind, body) { ok(await sb.from('cbj_posts').insert({ circle_id: circle, kind, body, user_id: await uid() })) },
    async deletePost(id) { ok(await sb.from('cbj_posts').delete().eq('id', id)) },
    async cheer(postId, on) {
      const me = await uid()
      if (on) ok(await sb.from('cbj_cheers').upsert({ post_id: postId, user_id: me }))
      else ok(await sb.from('cbj_cheers').delete().eq('post_id', postId).eq('user_id', me))
    },
    async report(postId, reason) {
      const r = await sb.from('cbj_reports').insert({ post_id: postId, reporter: await uid(), reason })
      if (r.error && !String(r.error.message).includes('duplicate')) throw friendly(r.error)
    },
    async block(userId) { ok(await sb.from('cbj_blocks').upsert({ blocker: await uid(), blocked: userId })) },
    async unblockAll() { ok(await sb.from('cbj_blocks').delete().eq('blocker', await uid())) },
    async blockedCount() {
      const r = await sb.from('cbj_blocks').select('blocked', { count: 'exact', head: true }).eq('blocker', await uid())
      if (r.error) throw friendly(r.error)
      return r.count ?? 0
    },
    async leaderboard() { return (ok(await sb.rpc('cbj_leaderboard')) ?? []) },

    async sendMessage(topic, body) { ok(await sb.from('cbj_messages').insert({ topic, body, user_id: await uid() })) },
    async deleteAccount() { ok(await sb.rpc('cbj_delete_my_account')); await sb.auth.signOut({ scope: 'local' }) },

    async isAdmin() { const r = await sb.rpc('cbj_is_admin'); return !r.error && r.data === true },
    async adminMembers() { return ok(await sb.rpc('cbj_admin_members')) ?? [] },
    async adminReports() { return ok(await sb.rpc('cbj_admin_reports')) ?? [] },
    async adminDismissReport(id) { ok(await sb.from('cbj_reports').delete().eq('id', id)) },
    async adminSetSuspended(userId, on) { ok(await sb.rpc('cbj_admin_set_suspended', { p_user: userId, p_suspended: on })) },
    async adminMessages() { return ok(await sb.rpc('cbj_admin_messages')) ?? [] },
    async adminResolveMessage(id, on) { ok(await sb.from('cbj_messages').update({ resolved: on }).eq('id', id)) },
  }
}
