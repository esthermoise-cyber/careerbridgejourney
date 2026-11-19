// Development-only stand-in for the live database. It keeps everything in this browser's
// localStorage so the interface can be built and tested offline. It is never used in a
// production build (see backend.ts).
import type { Backend, Post, Profile, SessionUser, Workspace } from './types'
import { firstName, pickColor } from './supabaseBackend'

const K = 'cbj-dev'
type DB = {
  users: Record<string, { id: string; email: string; password: string; fullName: string }>
  session: string | null
  profiles: Record<string, Profile>
  workspaces: Record<string, Workspace>
  members: [string, string][]
  posts: Omit<Post, 'cheers' | 'cheered' | 'mine'>[]
  cheers: [string, string][]
  blocks: [string, string][]
  reports: { id: string; post_id: string; reason: string; at: string }[]
  messages: { id: string; user_id: string; topic: string; body: string; resolved: boolean; created_at: string }[]
}
const load = (): DB => {
  try { const v = JSON.parse(localStorage.getItem(K) || 'null'); if (v) return v } catch { /* fresh */ }
  return { users: {}, session: null, profiles: {}, workspaces: {}, members: [], posts: [], cheers: [], blocks: [], reports: [], messages: [] }
}
const id = () => crypto.randomUUID()

export function createLocalBackend(): Backend {
  let db = load()
  const save = () => localStorage.setItem(K, JSON.stringify(db))
  const listeners = new Set<(e: 'in' | 'out' | 'recovery', u: SessionUser | null) => void>()
  const me = (): SessionUser | null => {
    const u = db.session ? db.users[db.session] : null
    return u ? { id: u.id, email: u.email, fullName: u.fullName } : null
  }
  const need = () => { const u = me(); if (!u) throw new Error('Your session ended. Please sign in again.'); return u }
  const emit = (e: 'in' | 'out') => listeners.forEach(l => l(e, me()))
  const isAdmin = () => me()?.email.startsWith('owner@') ?? false

  return {
    mode: 'local',
    async getUser() { return me() },
    onAuth(cb) { listeners.add(cb); return () => listeners.delete(cb) },
    async signUp(input) {
      if (Object.values(db.users).some(u => u.email === input.email.toLowerCase())) throw new Error('An account with this email already exists. Sign in instead, or reset your password.')
      const u = { id: id(), email: input.email.toLowerCase(), password: input.password, fullName: input.fullName }
      db.users[u.id] = u; db.session = u.id
      db.profiles[u.id] = { id: u.id, full_name: u.fullName, display_name: firstName(u.fullName), phone: input.phone, track: '', pathway: '', avatar_color: pickColor(u.id), points: 0, show_on_leaderboard: false, consent: { ...input.consent, source: 'signup' }, suspended: false }
      save(); emit('in')
      return { needsConfirm: false }
    },
    async signIn(email, password) {
      const u = Object.values(db.users).find(x => x.email === email.toLowerCase() && x.password === password)
      if (!u) throw new Error('That email and password do not match. Please try again.')
      db.session = u.id; save(); emit('in')
    },
    async signOut() { db.session = null; save(); emit('out') },
    async sendReset() { /* no email in dev */ },
    async updatePassword(password) { db.users[need().id].password = password; save() },

    async loadProfile(user) { return db.profiles[user.id] },
    async saveProfile(pid, patch) { db.profiles[pid] = { ...db.profiles[pid], ...patch }; save() },
    async loadWorkspace(wid) { return db.workspaces[wid] ?? null },
    async saveWorkspace(wid, ws) { db.workspaces[wid] = ws; save() },
    saveWorkspaceOnExit(wid, ws) { db.workspaces[wid] = ws; save(); return true },

    async circleCounts() { const c: Record<string, number> = {}; db.members.forEach(([cid]) => { c[cid] = (c[cid] ?? 0) + 1 }); return c },
    async myCircles() { const u = need(); return db.members.filter(m => m[1] === u.id).map(m => m[0]) },
    async joinCircle(cid) { const u = need(); if (!db.members.some(m => m[0] === cid && m[1] === u.id)) db.members.push([cid, u.id]); save() },
    async leaveCircle(cid) { const u = need(); db.members = db.members.filter(m => !(m[0] === cid && m[1] === u.id)); save() },
    async feed(circle) {
      const u = need()
      const blocked = new Set(db.blocks.filter(b => b[0] === u.id).map(b => b[1]))
      return db.posts.filter(p => p.circle_id === circle && !blocked.has(p.user_id))
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map(p => ({ ...p, cheers: db.cheers.filter(c => c[0] === p.id).length, cheered: db.cheers.some(c => c[0] === p.id && c[1] === u.id), mine: p.user_id === u.id }))
    },
    async post(circle, kind, body) {
      const u = need(); const p = db.profiles[u.id]
      db.posts.push({ id: id(), circle_id: circle, user_id: u.id, author_name: p.display_name || 'Member', author_color: p.avatar_color, kind, body, created_at: new Date().toISOString() }); save()
    },
    async deletePost(pid) { db.posts = db.posts.filter(p => p.id !== pid); db.reports = db.reports.filter(r => r.post_id !== pid); save() },
    async cheer(pid, on) { const u = need(); db.cheers = db.cheers.filter(c => !(c[0] === pid && c[1] === u.id)); if (on) db.cheers.push([pid, u.id]); save() },
    async report(pid, reason) { db.reports.push({ id: id(), post_id: pid, reason, at: new Date().toISOString() }); save() },
    async block(userId) { db.blocks.push([need().id, userId]); save() },
    async unblockAll() { const u = need(); db.blocks = db.blocks.filter(b => b[0] !== u.id); save() },
    async blockedCount() { const u = need(); return db.blocks.filter(b => b[0] === u.id).length },
    async leaderboard() {
      const u = need()
      return Object.values(db.profiles).filter(p => p.show_on_leaderboard && p.points > 0).sort((a, b) => b.points - a.points)
        .map(p => ({ display_name: p.display_name, avatar_color: p.avatar_color, points: p.points, is_me: p.id === u.id }))
    },
    async sendMessage(topic, body) { db.messages.push({ id: id(), user_id: need().id, topic, body, resolved: false, created_at: new Date().toISOString() }); save() },
    async deleteAccount() {
      const u = need()
      delete db.users[u.id]; delete db.profiles[u.id]; delete db.workspaces[u.id]
      db.posts = db.posts.filter(p => p.user_id !== u.id); db.members = db.members.filter(m => m[1] !== u.id)
      db.session = null; save(); emit('out')
    },

    async isAdmin() { return isAdmin() },
    async adminMembers() {
      return Object.values(db.profiles).map(p => ({ ...p, email: db.users[p.id]?.email ?? '', consent_updated_at: null, created_at: new Date().toISOString() }))
    },
    async adminReports() {
      return db.reports.flatMap(r => {
        const p = db.posts.find(x => x.id === r.post_id)
        return p ? [{ report_id: r.id, reason: r.reason, reported_at: r.at, post_id: p.id, circle_id: p.circle_id, author_id: p.user_id, author_name: p.author_name, body: p.body, posted_at: p.created_at }] : []
      })
    },
    async adminDismissReport(rid) { db.reports = db.reports.filter(r => r.id !== rid); save() },
    async adminSetSuspended(userId, on) { db.profiles[userId].suspended = on; save() },
    async adminMessages() {
      return db.messages.map(m => ({ id: m.id, email: db.users[m.user_id]?.email ?? '', full_name: db.profiles[m.user_id]?.full_name ?? '', topic: m.topic, body: m.body, resolved: m.resolved, created_at: m.created_at }))
    },
    async adminResolveMessage(mid, on) { const m = db.messages.find(x => x.id === mid); if (m) m.resolved = on; save() },
  }
}
