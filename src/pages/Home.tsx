import { ArrowRight, BookOpen, Check, Compass, Flag, Sparkles, Trophy, Users } from 'lucide-react'
import { useApp } from '../lib/store'
import { Link } from '../lib/router'
import { Bar, Ring } from '../components/ui'
import { badges, fmtDate, level, nextMilestone, pathProgress, points, weekKey } from '../lib/progress'
import { pathwayById } from '../data/pathways'

export default function Home() {
  const { ws, profile, update, toast } = useApp()
  const pp = pathProgress(ws), pts = points(ws), lv = level(pts), next = nextMilestone(ws)
  const p = pathwayById(ws.pathwayId)
  const wk = weekKey(), goals = ws.goals.filter(g => g.week === wk)
  const earned = badges(ws).filter(b => b.earned)
  const hour = new Date().getHours()
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const days = ws.targetDate ? Math.ceil((+new Date(ws.targetDate + 'T12:00:00') - Date.now()) / 86400000) : null

  return (
    <>
      <section className="hero-card">
        <div>
          <p className="eyebrow light">{hello}, {profile.display_name || 'friend'}</p>
          <h1>{ws.goalTitle}</h1>
          <p>{p?.name}{ws.targetDate && <> · Target {fmtDate(ws.targetDate)}{days !== null && days > 0 && <> ({days} days)</>}</>}</p>
          {ws.why && <p className="why">“{ws.why}”</p>}
        </div>
        <Ring pct={pp.pct} size={128} color="#7BE495"><b>{pp.pct}%</b><span>{pp.done} of {pp.total} steps</span></Ring>
      </section>

      <div className="grid2">
        <section className="card pad">
          <div className="card-head"><h2><Flag size={18} /> Your next step</h2><Link to="/app/pathway" className="link">Full pathway <ArrowRight size={15} /></Link></div>
          {next ? <>
            <span className="pill soft">{next.phase}</span>
            <h3 className="next-title">{next.title}</h3><p className="muted">{next.detail}</p>
            <button className="btn" onClick={() => { update(w => { const m = w.milestones.find(x => x.id === next.id)!; m.done = true; m.doneAt = new Date().toISOString() }); toast('Step complete. +20 points') }}><Check size={18} /> Mark complete</button>
          </> : <><h3 className="next-title">You completed your pathway!</h3><p className="muted">That is a real achievement. Choose your next pathway from My Pathway, and share your win with the community.</p><Link to="/app/community" className="btn">Share my win</Link></>}
        </section>

        <section className="card pad">
          <div className="card-head"><h2><Sparkles size={18} /> Level {lv.index}: {lv.name}</h2><Link to="/app/challenges" className="link">Rewards <ArrowRight size={15} /></Link></div>
          <p className="big-num">{pts}<span> points</span></p>
          <Bar pct={lv.pct} />
          <p className="tiny muted">{lv.next ? `${lv.next.at - pts} points to ${lv.next.name}` : 'Top level reached'}</p>
          <div className="badge-row">{earned.slice(-4).map(b => <span key={b.id} className="badge-chip" title={b.desc}><Trophy size={14} /> {b.name}</span>)}{earned.length === 0 && <span className="muted tiny">Complete a step to earn your first badge.</span>}</div>
        </section>
      </div>

      <section className="card pad">
        <div className="card-head"><h2>This week’s goals</h2><Link to="/app/goals" className="link">{goals.length ? 'Manage' : 'Set goals'} <ArrowRight size={15} /></Link></div>
        {goals.length === 0 ? <p className="muted">No goals yet this week. Two or three small, specific goals are enough to keep moving.</p> :
          <ul className="todo">{goals.map(g => <li key={g.id} className={g.done ? 'done' : ''}>
            <button className="tick" aria-label={g.done ? 'Mark not done' : 'Mark done'} onClick={() => update(w => { const x = w.goals.find(y => y.id === g.id)!; x.done = !x.done; x.doneAt = x.done ? new Date().toISOString() : undefined })}>{g.done && <Check size={15} />}</button><span>{g.text}</span></li>)}</ul>}
      </section>

      <div className="tiles">
        <Link to="/app/explore" className="tile"><Compass size={22} /><b>{ws.quizDone ? 'Explore careers' : 'Take the career match quiz'}</b><span>{ws.quizDone ? `${ws.savedCareers.length} saved` : '5 minutes'}</span></Link>
        <Link to="/app/learn" className="tile"><BookOpen size={22} /><b>Practice & guides</b><span>{Object.keys(ws.study).length} questions answered</span></Link>
        <Link to="/app/challenges" className="tile"><Trophy size={22} /><b>Challenges</b><span>{Object.keys(ws.challenges).length} joined</span></Link>
        <Link to="/app/community" className="tile"><Users size={22} /><b>Community circles</b><span>Share a win today</span></Link>
      </div>
    </>
  )
}
