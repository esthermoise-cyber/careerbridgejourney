import { useMemo, useState } from 'react'
import { ArrowRight, Check, CheckCircle2, Clock, ExternalLink, Plus, Trash2, XCircle } from 'lucide-react'
import { useApp } from '../lib/store'
import { Bar, Check as CheckBox, Empty, Field, Modal, PageHead } from '../components/ui'
import { GUIDES, QUESTIONS, TOPICS, type Guide } from '../data/learn'
import { uid } from '../lib/progress'
import type { School } from '../lib/types'

export default function Learn() {
  const { ws, update, toast } = useApp()
  const [tab, setTab] = useState<'practice' | 'guides' | 'schools'>('practice')
  const [topic, setTopic] = useState<string>('')
  const [qi, setQi] = useState(0), [picked, setPicked] = useState<number | null>(null)
  const [guide, setGuide] = useState<Guide | null>(null)
  const [school, setSchool] = useState<School | null>(null)

  const pool = useMemo(() => {
    const l = QUESTIONS.filter(q => !topic || q.topic === topic)
    return [...l.filter(q => ws.study[q.id] !== true), ...l.filter(q => ws.study[q.id] === true)]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic])
  const cur = pool[qi % Math.max(pool.length, 1)]
  const correct = Object.values(ws.study).filter(Boolean).length

  function answer(i: number) {
    if (picked !== null || !cur) return
    setPicked(i)
    const right = i === cur.answer, had = ws.study[cur.id] === true
    update(w => { w.study[cur.id] = had || right })
    if (right && !had) toast('Correct. +5 points')
  }

  return (
    <>
      <PageHead eyebrow="Grow" title="Learn & Practice" sub="Practice questions with clear explanations, practical guides, and your own school shortlist." />
      <div className="tabbar" role="tablist">
        {(['practice', 'guides', 'schools'] as const).map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'practice' ? 'Practice questions' : t === 'guides' ? 'Guides' : 'My school shortlist'}</button>)}
      </div>

      {tab === 'practice' && <>
        <section className="card pad"><div className="progress-line"><b>{correct} of {QUESTIONS.length} mastered</b><span className="muted">{Object.keys(ws.study).length} attempted</span></div><Bar pct={Math.round((correct / QUESTIONS.length) * 100)} />
          <div className="chips pick">{['', ...TOPICS].map(t => <button key={t} className={`chip-btn${topic === t ? ' on' : ''}`} onClick={() => { setTopic(t); setQi(0); setPicked(null) }}>{t || 'All topics'}</button>)}</div></section>
        {cur && <section className="card pad question">
          <div className="card-head"><span className="pill soft">{cur.topic}</span><span className="muted tiny">Question {(qi % pool.length) + 1} of {pool.length}{ws.study[cur.id] === true && picked === null ? ' · mastered' : ''}</span></div>
          <h2>{cur.q}</h2>
          <div className="answers">{cur.choices.map((c, i) => {
            const state = picked === null ? '' : i === cur.answer ? ' right' : i === picked ? ' wrong' : ' dim'
            return <button key={c} className={`answer${state}`} onClick={() => answer(i)} disabled={picked !== null}><span className="letter">{'ABCD'[i]}</span><span>{c}</span>{picked !== null && i === cur.answer && <CheckCircle2 size={20} />}{picked === i && i !== cur.answer && <XCircle size={20} />}</button>
          })}</div>
          {picked !== null && <div className={`why-box ${picked === cur.answer ? 'good' : 'warn'}`}><b>{picked === cur.answer ? 'Correct.' : 'Not quite.'}</b> {cur.why}</div>}
          {picked !== null && <button className="btn" onClick={() => { setQi(qi + 1); setPicked(null) }}>Next question <ArrowRight size={18} /></button>}
        </section>}
        <p className="tiny muted">Original study questions for practice. They are not official exam items and do not predict exam results. Use them alongside your instructors and course materials.</p>
      </>}

      {tab === 'guides' && <div className="grid2">{GUIDES.map(g => { const d = ws.guides[g.id]?.filter(a => g.actions.includes(a)).length ?? 0; return (
        <button key={g.id} className="card pad guide" onClick={() => setGuide(g)}><span className="muted tiny"><Clock size={13} /> {g.minutes} min read</span><h3>{g.title}</h3><p className="muted">{g.summary}</p>
          <div className="match"><Bar pct={Math.round((d / g.actions.length) * 100)} /><b>{d}/{g.actions.length} actions</b></div></button>) })}</div>}

      {tab === 'schools' && <>
        <section className="card pad"><div className="card-head"><h2>Programs I am considering</h2><button className="btn sm" onClick={() => setSchool({ id: '', name: '', program: '', cost: '', deadline: '', verified: false, notes: '' })}><Plus size={16} /> Add a program</button></div>
          <p className="muted">Keep your own notes here. Enter only details you have confirmed with the school; costs and deadlines change.</p>
          {ws.schools.length === 0 ? <Empty title="Your shortlist is empty" text="Add two or three programs so you can compare them side by side." /> :
            <div className="schools">{ws.schools.map(s => <article key={s.id} className="school"><div className="card-head"><h3>{s.name}</h3>{s.verified ? <span className="pill good"><Check size={13} /> Approval verified</span> : <span className="pill warn">Approval not verified yet</span>}</div>
              <dl><div><dt>Program</dt><dd>{s.program || '—'}</dd></div><div><dt>Total cost</dt><dd>{s.cost || '—'}</dd></div><div><dt>Deadline</dt><dd>{s.deadline || '—'}</dd></div></dl>
              {s.notes && <p className="muted">{s.notes}</p>}
              <div className="row"><button className="btn ghost sm" onClick={() => setSchool(s)}>Edit</button><button className="btn ghost sm danger" onClick={() => { if (confirm(`Remove ${s.name}?`)) update(w => { w.schools = w.schools.filter(x => x.id !== s.id) }) }}><Trash2 size={15} /> Remove</button></div></article>)}</div>}
        </section>
      </>}

      {guide && <Modal title={guide.title} onClose={() => setGuide(null)} wide>
        <p className="lead-sm">{guide.summary}</p>
        {guide.points.map(([t, d]) => <div key={t} className="point"><b>{t}</b><p>{d}</p></div>)}
        <h4>Put it into action</h4>
        {guide.actions.map(a => <CheckBox key={a} checked={!!ws.guides[guide.id]?.includes(a)} onChange={v => update(w => { const l = w.guides[guide.id] ?? []; w.guides[guide.id] = v ? [...l, a] : l.filter(x => x !== a) })}>{a}</CheckBox>)}
        {guide.links && <><h4>Official resources</h4><ul className="sources">{guide.links.map(([n, u]) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer">{n} <ExternalLink size={14} /></a></li>)}</ul></>}
      </Modal>}

      {school && <Modal title={school.id ? 'Edit program' : 'Add a program'} onClose={() => setSchool(null)}>
        <Field label="School name"><input value={school.name} maxLength={120} onChange={e => setSchool({ ...school, name: e.target.value })} /></Field>
        <Field label="Program"><input value={school.program} maxLength={120} placeholder="Example: ADN, evening cohort" onChange={e => setSchool({ ...school, program: e.target.value })} /></Field>
        <Field label="Total cost (as quoted by the school)"><input value={school.cost} maxLength={60} onChange={e => setSchool({ ...school, cost: e.target.value })} /></Field>
        <Field label="Application deadline"><input type="date" value={school.deadline} onChange={e => setSchool({ ...school, deadline: e.target.value })} /></Field>
        <CheckBox checked={school.verified} onChange={v => setSchool({ ...school, verified: v })}>I verified accreditation or state approval on the accreditor’s or board’s own website.</CheckBox>
        <Field label="Notes"><textarea rows={3} maxLength={600} value={school.notes} onChange={e => setSchool({ ...school, notes: e.target.value })} /></Field>
        <button className="btn block" disabled={!school.name.trim()} onClick={() => { update(w => { if (school.id) w.schools = w.schools.map(x => (x.id === school.id ? school : x)); else if (w.schools.length < 20) w.schools.push({ ...school, id: uid() }) }); setSchool(null) }}>Save</button>
      </Modal>}
    </>
  )
}
