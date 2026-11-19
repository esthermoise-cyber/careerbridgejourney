import { useState } from 'react'
import { BookOpen, Briefcase, CalendarCheck, Compass, Home as HomeIcon, LogOut, Menu, Route, Shield, Trophy, User, Users, X, Cloud, CloudOff, Loader } from 'lucide-react'
import { Link, usePath } from '../lib/router'
import { useApp } from '../lib/store'
import { Avatar, Logo } from '../components/ui'
import { level, points } from '../lib/progress'
import Onboarding from './Onboarding'
import Home from './Home'
import Pathway from './Pathway'
import Goals from './Goals'
import Explore from './Explore'
import Learn from './Learn'
import Challenges from './Challenges'
import Community from './Community'
import Opportunities from './Opportunities'
import Profile from './Profile'
import Admin from './Admin'

const NAV = [
  { to: '/app', label: 'Home', icon: HomeIcon },
  { to: '/app/pathway', label: 'My Pathway', icon: Route },
  { to: '/app/goals', label: 'Weekly Goals', icon: CalendarCheck },
  { to: '/app/explore', label: 'Explore Careers', icon: Compass },
  { to: '/app/learn', label: 'Learn & Practice', icon: BookOpen },
  { to: '/app/challenges', label: 'Challenges & Rewards', icon: Trophy },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/app/profile', label: 'Profile', icon: User },
]
const TABS = [NAV[0], NAV[1], NAV[2], NAV[6]]

export default function Member() {
  const { ws, profile, admin, saveState, signOut } = useApp()
  const path = usePath()
  const [open, setOpen] = useState(false)
  if (!ws.onboarded) return <Onboarding />

  const pts = points(ws), lv = level(pts)
  const items = admin ? [...NAV, { to: '/app/admin', label: 'Owner Tools', icon: Shield }] : NAV
  const active = (to: string) => (to === '/app' ? path === '/app' : path.startsWith(to))
  const page =
    path.startsWith('/app/pathway') ? <Pathway /> : path.startsWith('/app/goals') ? <Goals /> :
    path.startsWith('/app/explore') ? <Explore /> : path.startsWith('/app/learn') ? <Learn /> :
    path.startsWith('/app/challenges') ? <Challenges /> : path.startsWith('/app/community') ? <Community /> :
    path.startsWith('/app/opportunities') ? <Opportunities /> : path.startsWith('/app/profile') ? <Profile /> :
    path.startsWith('/app/admin') && admin ? <Admin /> : <Home />

  const SaveIcon = saveState === 'saved' ? Cloud : saveState === 'saving' ? Loader : CloudOff
  const saveText = saveState === 'saved' ? 'Saved to your account' : saveState === 'saving' ? 'Saving…' : 'Not saved. Check your connection'
  const saveShort = saveState === 'saved' ? 'Saved' : saveState === 'saving' ? 'Saving…' : 'Not saved'

  return (
    <div className="shell">
      <aside className={`side${open ? ' open' : ''}`}>
        <div className="side-top"><Link to="/app" onClick={() => setOpen(false)}><Logo size={36} light /></Link>
          <button className="icon-btn only-mobile light" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button></div>
        <nav aria-label="Main">
          {items.map(n => <Link key={n.to} to={n.to} className={active(n.to) ? 'on' : ''} aria-current={active(n.to) ? 'page' : undefined} onClick={() => setOpen(false)}><n.icon size={19} />{n.label}</Link>)}
        </nav>
        <div className="side-foot">
          <div className="side-user"><Avatar name={profile.display_name} color={profile.avatar_color} size={34} />
            <div><b>{profile.display_name || 'Member'}</b><span>Level {lv.index} · {pts} pts</span></div></div>
          <button className="side-out" onClick={() => void signOut()}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <div className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <span className="only-mobile"><Logo size={30} /></span>
          <span className={`save ${saveState}`} role="status"><SaveIcon size={15} className={saveState === 'saving' ? 'spin' : ''} /><span className="only-desktop">{saveText}</span><span className="only-mobile">{saveShort}</span></span>
        </div>
        {profile.suspended && <div className="banner alert">Community posting is paused on your account. Contact us from your profile if you think this is a mistake.</div>}
        <main className="content" key={path}>{page}</main>
      </div>
      <nav className="tabs" aria-label="Quick navigation">
        {TABS.map(n => <Link key={n.to} to={n.to} className={active(n.to) ? 'on' : ''}><n.icon size={21} /><span>{n.label.replace('My ', '').replace('Weekly ', '')}</span></Link>)}
        <button onClick={() => setOpen(true)}><Menu size={21} /><span>More</span></button>
      </nav>
    </div>
  )
}
