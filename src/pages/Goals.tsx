import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../lib/store'
import { Empty, Field, PageHead } from '../components/ui'
import { fmtDate, uid, weekKey } from '../lib/progress'

const MOODS = ['Struggling', 'Tired', 'Steady', 'Good', 'Thriving']

export default function Goals() {
  const { ws, update, toast } = useApp()
  const wk = weekKey()
  const [text, setText] = useState(''), [mood, setMood] = useState(2), [note, setNote] = useState('')
  const goals = ws.goals.filter(g => g.week === wk)
  const past = [...new Set(ws.goals.filter(g => g.week !== wk).map(g => g.week))].sort().reverse().slice(0, 8)
  const open = ws.goals.filter(g => g.week < wk && !g.done)

  return (
    <>
      <PageHead eyebrow={`Week of ${fmtDate(wk)}`} title="Weekly Goals" sub="Small, specific actions add up. Aim for two to five goals a week." />
      <section className="card pad">
        <form className="add-row" onSubmit={e => { e.preventDefault(); const t = text.trim(); if (!t) return; if (goals.length >= 10) return toast('Ten goals is plenty for one week.'); update(w => { w.goals.push({ id: uid(), text: t.slice(0, 160), week: wk, done: false }) }); setText('') }}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Example: Request my transcript by Friday" maxLength={160} aria-label="New goal" />
          <button className="btn"><Plus size={18} /> Add goal</button>
        </form>
        {goals.length === 0 ? <Empty title="No goals yet this week" text="What is one thing you can finish in the next seven days?" /> :
          <ul className="todo lg">{goals.map(g => <li key={g.id} className={g.done ? 'done' : ''}>
            <button className="tick" aria-label={g.done ? 'Mark not done' : 'Mark done'} onClick={() => { update(w => { const x = w.goals.find(y => y.id === g.id)!; x.done = !x.done; x.doneAt = x.done ? new Date().toISOString() : undefined }); if (!g.done) toast('Goal complete. +10 points') }}>{g.done && <Check size={15} />}</button>
            <span>{g.text}</span>
            <button className="icon-btn" aria-label="Delete goal" onClick={() => update(w => { w.goals = w.goals.filter(y => y.id !== g.id) })}><Trash2 size={16} /></button></li>)}</ul>}
        {open.length > 0 && <div className="carry"><span>{open.length} unfinished goal{open.length > 1 ? 's' : ''} from earlier weeks.</span>
          <button className="btn ghost sm" onClick={() => update(w => { w.goals.forEach(g => { if (g.week < wk && !g.done) g.week = wk }) })}>Move to this week</button></div>}
      </section>

      <section className="card pad">
        <h2>Weekly check-in</h2><p className="muted">A quick, private reflection. No one else sees this.</p>
        <div className="moods" role="radiogroup" aria-label="How is your journey feeling?">{MOODS.map((m, i) => <button key={m} role="radio" aria-checked={mood === i} className={mood === i ? 'on' : ''} onClick={() => setMood(i)}>{m}</button>)}</div>
        <Field label="What went well, what got in the way, and what will I do next?"><textarea rows={3} maxLength={800} value={note} onChange={e => setNote(e.target.value)} /></Field>
        <button className="btn" disabled={!note.trim()} onClick={() => { update(w => { w.reflections.unshift({ id: uid(), at: new Date().toISOString(), mood, text: note.trim() }); w.reflections = w.reflections.slice(0, 200) }); setNote(''); toast('Check-in saved. +5 points') }}>Save check-in</button>
        {ws.reflections.length > 0 && <ul className="reflections">{ws.reflections.slice(0, 6).map(r => <li key={r.id}><div><b>{fmtDate(r.at)}</b><span className="pill soft">{MOODS[r.mood]}</span>
          <button className="icon-btn" aria-label="Delete check-in" onClick={() => update(w => { w.reflections = w.reflections.filter(x => x.id !== r.id) })}><Trash2 size={15} /></button></div><p>{r.text}</p></li>)}</ul>}
      </section>

      {past.length > 0 && <section className="card pad"><h2>Earlier weeks</h2>
        {past.map(w => { const l = ws.goals.filter(g => g.week === w); return <details key={w} className="week"><summary>Week of {fmtDate(w)} <span className="muted">{l.filter(g => g.done).length} of {l.length} done</span></summary>
          <ul className="todo">{l.map(g => <li key={g.id} className={g.done ? 'done' : ''}><span className="tick static">{g.done && <Check size={15} />}</span><span>{g.text}</span></li>)}</ul></details> })}
      </section>}
    </>
  )
}
