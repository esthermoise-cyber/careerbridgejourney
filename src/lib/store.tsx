import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { backend } from './backend'
import { emptyWorkspace, type Backend, type Profile, type SessionUser, type Workspace } from './types'
import { points } from './progress'

type SaveState = 'saved' | 'saving' | 'error'
interface Ctx {
  api: Backend
  user: SessionUser
  profile: Profile
  ws: Workspace
  admin: boolean
  saveState: SaveState
  update: (fn: (w: Workspace) => void) => void
  setProfile: (patch: Partial<Profile>) => Promise<void>
  toast: (msg: string) => void
  signOut: () => Promise<void>
}
const C = createContext<Ctx | null>(null)
export const useApp = () => { const c = useContext(C); if (!c) throw new Error('outside app'); return c }

export function AppProvider({ user, children, onSignedOut }: { user: SessionUser; children: ReactNode; onSignedOut: () => void }) {
  const api = backend!
  const [profile, setP] = useState<Profile | null>(null)
  const [ws, setWs] = useState<Workspace | null>(null)
  const [admin, setAdmin] = useState(false)
  const [saveState, setSave] = useState<SaveState>('saved')
  const [err, setErr] = useState('')
  const [toastMsg, setToast] = useState('')
  const latest = useRef<Workspace | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const dirty = useRef(false)
  const lastPts = useRef(-1)

  useEffect(() => {
    let live = true
    ;(async () => {
      try {
        const [p, w] = await Promise.all([api.loadProfile(user), api.loadWorkspace(user.id)])
        if (!live) return
        const merged = { ...emptyWorkspace(), ...(w ?? {}) }
        latest.current = merged; lastPts.current = p.points
        setP(p); setWs(merged)
        api.isAdmin().then(a => live && setAdmin(a)).catch(() => {})
      } catch (e) { if (live) setErr((e as Error).message) }
    })()
    return () => { live = false }
  }, [api, user])

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current)
    if (!dirty.current || !latest.current) return
    dirty.current = false
    const snap = latest.current
    try {
      await api.saveWorkspace(user.id, snap)
      const pts = points(snap)
      if (pts !== lastPts.current) {
        lastPts.current = pts
        await api.saveProfile(user.id, { points: pts, pathway: snap.pathwayId })
        setP(p => (p ? { ...p, points: pts, pathway: snap.pathwayId } : p))
      }
      if (!dirty.current) setSave('saved')
    } catch { dirty.current = true; setSave('error') }
  }, [api, user.id])

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') void flush() }
    const onOnline = () => void flush()
    // Closing, reloading or leaving the page: send any unsaved change in a request that outlives the page.
    const onExit = () => {
      if (!dirty.current || !latest.current) return
      window.clearTimeout(timer.current)
      if (api.saveWorkspaceOnExit(user.id, latest.current)) dirty.current = false
    }
    document.addEventListener('visibilitychange', onHide); window.addEventListener('online', onOnline); window.addEventListener('pagehide', onExit)
    return () => { document.removeEventListener('visibilitychange', onHide); window.removeEventListener('online', onOnline); window.removeEventListener('pagehide', onExit) }
  }, [flush, api, user.id])

  const update = useCallback((fn: (w: Workspace) => void) => {
    if (!latest.current) return
    const next = structuredClone(latest.current)
    fn(next)
    latest.current = next; dirty.current = true
    setWs(next); setSave('saving')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => void flush(), 500)
  }, [flush])

  const setProfile = useCallback(async (patch: Partial<Profile>) => {
    await api.saveProfile(user.id, patch)
    setP(p => (p ? { ...p, ...patch } : p))
  }, [api, user.id])

  const toast = useCallback((m: string) => { setToast(m); window.setTimeout(() => setToast(t => (t === m ? '' : t)), 3200) }, [])
  const signOut = useCallback(async () => { await flush(); await api.signOut(); onSignedOut() }, [api, flush, onSignedOut])

  if (err) return (
    <div className="center-screen"><div className="card pad narrow">
      <h2>We could not load your account</h2><p className="muted">{err}</p>
      <div className="row"><button className="btn" onClick={() => location.reload()}>Try again</button>
        <button className="btn ghost" onClick={() => void api.signOut().then(onSignedOut)}>Sign out</button></div>
    </div></div>
  )
  if (!profile || !ws) return <div className="center-screen"><div className="spinner" aria-label="Loading" /></div>

  return (
    <C.Provider value={{ api, user, profile, ws, admin, saveState, update, setProfile, toast, signOut }}>
      {children}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </C.Provider>
  )
}
