import { useState } from 'react'
import { ArrowLeft, ArrowRight, Briefcase, HeartPulse, Rocket } from 'lucide-react'
import { useApp } from '../lib/store'
import { PATHWAYS, TRACKS, pathwayById, type Track } from '../data/pathways'
import { buildMilestones, feasibility } from '../lib/progress'
import { Field, Logo } from '../components/ui'

const ICON = { healthcare: HeartPulse, careers: Briefcase, business: Rocket }

export default function Onboarding() {
  const { profile, update, setProfile, signOut } = useApp()
  const [step, setStep] = useState(0)
  const [track, setTrack] = useState<Track | ''>('')
  const [pid, setPid] = useState('')
  const [goal, setGoal] = useState('')
  const [why, setWhy] = useState('')
  const [date, setDate] = useState('')
  const [hours, setHours] = useState(5)
  const p = pathwayById(pid)
  const fz = pid ? feasibility(hours, pid) : null

  function finish() {
    if (!p) return
    update(w => {
      w.onboarded = true; w.pathwayId = p.id; w.goalTitle = goal.trim() || p.name; w.why = why.trim()
      w.targetDate = date; w.hoursPerWeek = hours; w.milestones = buildMilestones(p)
    })
    void setProfile({ track: p.track, pathway: p.id }).catch(() => {})
  }

  return (
    <div className="onb">
      <header className="onb-top"><Logo size={34} /><button className="link" onClick={() => void signOut()}>Sign out</button></header>
      <div className="onb-steps" aria-hidden="true">{[0, 1, 2, 3].map(i => <span key={i} className={i <= step ? 'on' : ''} />)}</div>
      <div className="onb-body">
        {step === 0 && <>
          <p className="eyebrow">Welcome, {profile.display_name || 'friend'}</p>
          <h1>Where do you want to go?</h1><p className="muted">Pick the area closest to your goal. You can change it any time.</p>
          <div className="choice-grid">
            {TRACKS.map(t => { const I = ICON[t.id]; return (
              <button key={t.id} className={`choice big${track === t.id ? ' on' : ''}`} onClick={() => { setTrack(t.id); setPid(''); setStep(1) }}>
                <span className={`ficon ${t.id}`}><I size={24} /></span><b>{t.name}</b><span>{t.blurb}</span></button>) })}
          </div></>}
        {step === 1 && <>
          <h1>Choose your pathway</h1><p className="muted">Each one comes with a step-by-step roadmap you can edit.</p>
          <div className="choice-list">
            {PATHWAYS.filter(x => x.track === track).map(x => (
              <button key={x.id} className={`choice${pid === x.id ? ' on' : ''}`} onClick={() => setPid(x.id)}>
                <b>{x.name}</b><span>{x.blurb}</span><em>{x.typical}</em></button>))}
          </div></>}
        {step === 2 && p && <>
          <h1>Make it yours</h1><p className="muted">A clear goal and an honest look at your time make the plan real.</p>
          <div className="card pad form">
            <Field label="My goal, in my own words" hint="Example: Become an RN so I can give my kids a better life."><input value={goal} onChange={e => setGoal(e.target.value)} placeholder={p.name} maxLength={120} /></Field>
            <Field label="Why this matters to me (optional)"><textarea rows={2} value={why} onChange={e => setWhy(e.target.value)} maxLength={400} /></Field>
            <Field label="Target date (optional)"><input type="date" value={date} onChange={e => setDate(e.target.value)} /></Field>
            <Field label={`Hours I can protect each week: ${hours}`}><input type="range" min={1} max={30} value={hours} onChange={e => setHours(+e.target.value)} /></Field>
          </div></>}
        {step === 3 && p && fz && <>
          <p className="eyebrow">Your plan is ready</p><h1>{goal.trim() || p.name}</h1>
          <div className={`card pad fz ${fz.tone}`}><span className="pill">{fz.label}</span><p>{fz.text}</p><p className="tiny muted">Typical timeline: {p.typical}. Everyone’s timeline is different, and this is a planning estimate only.</p></div>
          <div className="card pad"><h3>Your roadmap: {p.name}</h3>
            <ol className="mini-road">{(['Explore', 'Learn', 'Prepare', 'Advance'] as const).map(ph => <li key={ph}><b>{ph}</b><span>{p.steps[ph].length} steps · starts with “{p.steps[ph][0][0]}”</span></li>)}</ol></div></>}
      </div>
      <footer className="onb-foot">
        {step > 0 ? <button className="btn ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={18} /> Back</button> : <span />}
        {step === 1 && <button className="btn" disabled={!pid} onClick={() => setStep(2)}>Continue <ArrowRight size={18} /></button>}
        {step === 2 && <button className="btn" onClick={() => setStep(3)}>See my plan <ArrowRight size={18} /></button>}
        {step === 3 && <button className="btn lg" onClick={finish}>Start my journey <ArrowRight size={18} /></button>}
      </footer>
    </div>
  )
}
