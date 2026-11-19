import { useEffect, useState } from 'react'
import { backend } from './lib/backend'
import { navigate, usePath } from './lib/router'
import { AppProvider } from './lib/store'
import type { SessionUser } from './lib/types'
import { Join, Landing, Legal, Recover, ResetPassword, SignIn } from './pages/Public'
import Member from './pages/Member'
import { Logo } from './components/ui'

export default function App() {
  const path = usePath()
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    if (!backend) { setUser(null); return }
    let live = true
    const off = backend.onAuth((event, u) => {
      if (!live) return
      if (event === 'recovery') { setRecovery(true); setUser(u); navigate('/reset', true) }
      else if (event === 'out') setUser(null)
      else setUser(prev => (prev && u && prev.id === u.id ? prev : u))
    })
    backend.getUser().then(u => live && setUser(prev => prev ?? u)).catch(() => live && setUser(null))
    return () => { live = false; off() }
  }, [])

  const inApp = path === '/app' || path.startsWith('/app/')
  const authPage = ['/', '/join', '/signin', '/recover'].includes(path)

  useEffect(() => {
    if (user === undefined) return
    if (!user && inApp) navigate('/signin', true)
    else if (user && authPage && !recovery) navigate('/app', true)
    else if (['/nursing', '/explore', '/business', '/discover'].includes(path)) navigate(user ? '/app' : '/join', true)
  }, [user, inApp, authPage, path, recovery])

  if (!backend && path !== '/privacy' && path !== '/terms') return (
    <div className="center-screen"><div className="card pad narrow center"><Logo />
      <h2>Almost ready</h2><p className="muted">CareerBridge Journey is being connected to its secure database. Please check back shortly.</p></div></div>
  )
  if (path === '/privacy') return <Legal kind="privacy" />
  if (path === '/terms') return <Legal kind="terms" />
  if (user === undefined) return <div className="center-screen"><div className="spinner" aria-label="Loading" /></div>
  if (path === '/reset') return <ResetPassword ready={!!user} />
  if (user && inApp) return <AppProvider key={user.id} user={user} onSignedOut={() => { setUser(null); navigate('/signin', true) }}><Member /></AppProvider>
  if (user) return <div className="center-screen"><div className="spinner" /></div>
  if (path === '/signin') return <SignIn />
  if (path === '/recover') return <Recover />
  if (path === '/join') return <Join />
  if (path === '/') return <Landing />
  return <Landing />
}
