import { useMemo, useState } from 'react'
import { Bookmark, BookmarkCheck, ExternalLink, RotateCcw, Search } from 'lucide-react'
import { useApp } from '../lib/store'
import { Bar, Empty, Modal, PageHead } from '../components/ui'
import { CAREERS, FIELDS, INTERESTS, QUIZ, SOURCES, matchCareer, scoreQuiz, type Career, type Interest } from '../data/careers'
import { pathwayById } from '../data/pathways'

const SCALE = ['Not me', 'A little', 'Mostly', 'Very much me']

export default function Explore() {
  const { ws, update, toast } = useApp()
  const [tab, setTab] = useState<'match' | 'all' | 'saved' | 'sources'>(ws.quizDone ? 'match' : 'all')
  const [quiz, setQuiz] = useState(false)
  const [ans, setAns] = useState<Record<string, number>>(ws.quiz)
  const [q, setQ] = useState(''), [field, setField] = useState('')
  const [open, setOpen] = useState<Career | null>(null)
  const scores = useMemo(() => scoreQuiz(ws.quiz), [ws.quiz])
  const ranked = useMemo(() => [...CAREERS].map(c => ({ c, m: matchCareer(scores, c) })).sort((a, b) => b.m - a.m), [scores])
  const top = (Object.keys(scores) as Interest[]).sort((a, b) => scores[b] - scores[a]).slice(0, 3)
  const save = (id: string) => update(w => { w.savedCareers = w.savedCareers.includes(id) ? w.savedCareers.filter(x => x !== id) : [...w.savedCareers, id] })
  const list = tab === 'saved' ? ranked.filter(r => ws.savedCareers.includes(r.c.id)) : tab === 'match' ? ranked.slice(0, 9) :
    ranked.filter(r => (!field || r.c.field === field) && (!q || (r.c.name + r.c.what).toLowerCase().includes(q.toLowerCase()))).sort((a, b) => (ws.quizDone ? b.m - a.m : FIELDS.indexOf(a.c.field) - FIELDS.indexOf(b.c.field)))

  const Card = ({ c, m }: { c: Career; m: number }) => (
    <article className="career">
      <div className="career-top"><span className="pill soft">{c.field}</span>
        <button className="icon-btn" onClick={() => save(c.id)} aria-label={ws.savedCareers.includes(c.id) ? 'Remove from saved' : 'Save career'}>{ws.savedCareers.includes(c.id) ? <BookmarkCheck size={20} className="saved" /> : <Bookmark size={20} />}</button></div>
      <h3>{c.name}</h3><p className="muted">{c.what}</p>
      {ws.quizDone && <div className="match"><Bar pct={m} /><b>{m}% interest match</b></div>}
      <button className="btn ghost sm" onClick={() => setOpen(c)}>View details</button>
    </article>)

  return (
    <>
      <PageHead eyebrow="Discover" title="Explore Careers" sub="Find work that fits who you are, then see what it takes to get there." />
      {!ws.quizDone ? <section className="card pad cta-card"><div><h2>Take the career match quiz</h2><p>Twelve quick statements, about five minutes. See which careers line up with your interests.</p></div><button className="btn lg" onClick={() => setQuiz(true)}>Start the quiz</button></section>
        : <section className="card pad"><div className="card-head"><h2>Your top interests</h2><button className="link" onClick={() => { setAns(ws.quiz); setQuiz(true) }}><RotateCcw size={15} /> Retake quiz</button></div>
          <div className="interests">{top.map(k => <div key={k} style={{ borderColor: INTERESTS[k].color }}><b style={{ color: INTERESTS[k].color }}>{INTERESTS[k].name}</b><span>{INTERESTS[k].short}</span></div>)}</div></section>}

      <div className="tabbar" role="tablist">
        {ws.quizDone && <button role="tab" aria-selected={tab === 'match'} className={tab === 'match' ? 'on' : ''} onClick={() => setTab('match')}>Best matches</button>}
        <button role="tab" aria-selected={tab === 'all'} className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>All careers</button>
        <button role="tab" aria-selected={tab === 'saved'} className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')}>Saved ({ws.savedCareers.length})</button>
        <button role="tab" aria-selected={tab === 'sources'} className={tab === 'sources' ? 'on' : ''} onClick={() => setTab('sources')}>Trusted sources</button>
      </div>

      {tab === 'all' && <div className="filters"><label className="search"><Search size={17} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search careers" aria-label="Search careers" /></label>
        <select value={field} onChange={e => setField(e.target.value)} aria-label="Filter by field"><option value="">All fields</option>{FIELDS.map(f => <option key={f}>{f}</option>)}</select></div>}

      {tab === 'sources' ? <section className="card pad"><p className="muted">These free, official sources have the current numbers. We link to them instead of copying figures that go out of date.</p>
        <ul className="sources">{SOURCES.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} <ExternalLink size={14} /></a><span>{s.use}</span></li>)}</ul></section>
        : list.length === 0 ? <Empty title={tab === 'saved' ? 'No saved careers yet' : 'No careers match that search'} text={tab === 'saved' ? 'Tap the bookmark on any career to keep it here.' : 'Try a different word or field.'} />
          : <div className="grid3">{list.map(r => <Card key={r.c.id} {...r} />)}</div>}

      {open && <Modal title={open.name} onClose={() => setOpen(null)}>
        <span className="pill soft">{open.field}</span>
        <h4>What you would do</h4><p>{open.what}</p>
        <h4>Typical way in</h4><p>{open.entry}</p>
        <h4>Interest profile</h4><div className="chips">{open.codes.map(k => <span key={k} className="chip" style={{ background: INTERESTS[k].color }}>{INTERESTS[k].name}</span>)}</div>
        <h4>Pay and job outlook</h4><p className="muted">Pay and demand change every year and vary by location, so we send you to the official source.</p>
        <a className="btn ghost block" href={open.bls} target="_blank" rel="noopener noreferrer">See current pay & outlook at BLS.gov <ExternalLink size={16} /></a>
        <p className="tiny muted">Suggested pathway: {pathwayById(open.pathway)?.name}. Requirements vary by state and employer. Always confirm with your state licensing board or the program itself.</p>
        <button className="btn block" onClick={() => { save(open.id); toast(ws.savedCareers.includes(open.id) ? 'Removed from saved' : 'Saved') }}>{ws.savedCareers.includes(open.id) ? 'Remove from saved' : 'Save this career'}</button>
      </Modal>}

      {quiz && <Modal title="Career match quiz" onClose={() => setQuiz(false)} wide>
        <p className="muted">How much does each statement sound like you? There are no wrong answers.</p>
        <ol className="quiz">{QUIZ.map(it => <li key={it.id}><p>{it.text}</p><div className="scale" role="radiogroup" aria-label={it.text}>{SCALE.map((s, i) => <button key={s} role="radio" aria-checked={ans[it.id] === i} className={ans[it.id] === i ? 'on' : ''} onClick={() => setAns({ ...ans, [it.id]: i })}>{s}</button>)}</div></li>)}</ol>
        <button className="btn block lg" disabled={QUIZ.some(it => ans[it.id] === undefined)} onClick={() => { update(w => { w.quiz = ans; w.quizDone = true }); setQuiz(false); setTab('match'); toast(ws.quizDone ? 'Results updated' : 'Quiz complete. +15 points') }}>
          {QUIZ.some(it => ans[it.id] === undefined) ? `Answer all ${QUIZ.length} to see results (${Object.keys(ans).length}/${QUIZ.length})` : 'See my matches'}</button>
        <p className="tiny muted center">This is a short interest check based on the widely used Holland interest themes, not a professional assessment. For a full free assessment, try the O*NET Interest Profiler at mynextmove.org.</p>
      </Modal>}
    </>
  )
}
