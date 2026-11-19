import { useState } from 'react'
import { CalendarPlus, Check, ChevronDown, Download, Pencil, Plus, Repeat, Trash2 } from 'lucide-react'
import { useApp } from '../lib/store'
import { Bar, Field, Modal, PageHead } from '../components/ui'
import { PATHWAYS, PHASES, TRACKS, pathwayById, type Phase } from '../data/pathways'
import { buildMilestones, download, feasibility, fmtDate, pathProgress, uid } from '../lib/progress'
import type { Milestone } from '../lib/types'

export default function Pathway() {
  const { ws, update, toast, setProfile } = useApp()
  const [openId, setOpenId] = useState('')
  const [adding, setAdding] = useState<Phase | null>(null)
  const [title, setTitle] = useState('')
  const [switching, setSwitching] = useState(false)
  const [editing, setEditing] = useState(false)
  const [plan, setPlan] = useState({ goalTitle: ws.goalTitle, why: ws.why, targetDate: ws.targetDate, hoursPerWeek: ws.hoursPerWeek })
  const p = pathwayById(ws.pathwayId), pp = pathProgress(ws), fz = feasibility(ws.hoursPerWeek, ws.pathwayId)
  const patch = (id: string, fn: (m: Milestone) => void) => update(w => { const m = w.milestones.find(x => x.id === id); if (m) fn(m) })

  function exportText() {
    const lines = [`CareerBridge Journey: ${ws.goalTitle}`, `Pathway: ${p?.name ?? ''}`, ws.targetDate ? `Target date: ${fmtDate(ws.targetDate)}` : '', `Progress: ${pp.done} of ${pp.total} steps`, '']
    PHASES.forEach(ph => { lines.push(ph.toUpperCase()); ws.milestones.filter(m => m.phase === ph).forEach(m => lines.push(`  [${m.done ? 'x' : ' '}] ${m.title}${m.due ? ` (due ${fmtDate(m.due)})` : ''}${m.note ? `\n      Note: ${m.note}` : ''}`)); lines.push('') })
    download('my-careerbridge-pathway.txt', lines.filter(l => l !== undefined).join('\n'))
  }
  function exportIcs() {
    const due = ws.milestones.filter(m => m.due && !m.done)
    if (!due.length) return toast('Add a due date to a step first.')
    const esc = (s: string) => s.replace(/[\;,]/g, x => '\\' + x).replace(/\n/g, '\\n')
    const ev = due.map(m => `BEGIN:VEVENT\r\nUID:${m.id}@careerbridgejourney\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')}\r\nDTSTART;VALUE=DATE:${m.due!.replace(/-/g, '')}\r\nSUMMARY:${esc(m.title)}\r\nDESCRIPTION:${esc(m.detail)}\r\nEND:VEVENT`).join('\r\n')
    download('careerbridge-dates.ics', `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//CareerBridge Journey//EN\r\n${ev}\r\nEND:VCALENDAR\r\n`, 'text/calendar')
  }
  function switchTo(id: string) {
    const np = pathwayById(id); if (!np) return
    update(w => { w.pathwayId = np.id; w.goalTitle = np.name; w.milestones = [...buildMilestones(np), ...w.milestones.filter(m => m.custom)] })
    void setProfile({ track: np.track, pathway: np.id }).catch(() => {})
    setSwitching(false); setPlan(x => ({ ...x, goalTitle: np.name })); toast(`Switched to ${np.name}`)
  }

  return (
    <>
      <PageHead eyebrow={p?.name} title={ws.goalTitle} sub={ws.targetDate ? `Target date: ${fmtDate(ws.targetDate)}` : 'No target date set'}
        right={<><button className="btn ghost sm" onClick={() => setEditing(true)}><Pencil size={16} /> Edit plan</button><button className="btn ghost sm" onClick={() => setSwitching(true)}><Repeat size={16} /> Change pathway</button></>} />
      <section className="card pad">
        <div className="progress-line"><b>{pp.pct}% complete</b><span className="muted">{pp.done} of {pp.total} steps</span></div>
        <Bar pct={pp.pct} />
        <div className={`fz inline ${fz.tone}`}><span className="pill">{fz.label}</span><span>{fz.text}</span></div>
        <div className="row wrap"><button className="btn ghost sm" onClick={exportText}><Download size={16} /> Download plan</button><button className="btn ghost sm" onClick={exportIcs}><CalendarPlus size={16} /> Add due dates to calendar</button></div>
      </section>

      {PHASES.map((ph, pi) => {
        const list = ws.milestones.filter(m => m.phase === ph), d = list.filter(m => m.done).length
        return (
          <section className="phase" key={ph}>
            <div className="phase-head"><span className={`phase-num${list.length > 0 && d === list.length ? ' done' : ''}`}>{list.length > 0 && d === list.length ? <Check size={18} /> : pi + 1}</span><div><h2>{ph}</h2><span className="muted tiny">{d} of {list.length} complete</span></div></div>
            <ul className="steps">
              {list.map(m => (
                <li key={m.id} className={`step${m.done ? ' done' : ''}`}>
                  <div className="step-row">
                    <button className="tick" aria-label={m.done ? `Mark “${m.title}” not done` : `Mark “${m.title}” done`} onClick={() => { patch(m.id, x => { x.done = !x.done; x.doneAt = x.done ? new Date().toISOString() : undefined }); if (!m.done) toast('Step complete. +20 points') }}>{m.done && <Check size={15} />}</button>
                    <button className="step-main" onClick={() => setOpenId(openId === m.id ? '' : m.id)} aria-expanded={openId === m.id}>
                      <b>{m.title}</b>{m.due && !m.done && <span className="due">Due {fmtDate(m.due)}</span>}{m.done && m.doneAt && <span className="due ok">Done {fmtDate(m.doneAt)}</span>}
                    </button>
                    <ChevronDown size={18} className={`chev${openId === m.id ? ' up' : ''}`} />
                  </div>
                  {openId === m.id && <div className="step-more">
                    {m.detail && <p className="muted">{m.detail}</p>}
                    <div className="row wrap">
                      <Field label="Due date"><input type="date" value={m.due ?? ''} onChange={e => patch(m.id, x => { x.due = e.target.value || undefined })} /></Field>
                      {m.custom && <button className="btn ghost sm danger" onClick={() => update(w => { w.milestones = w.milestones.filter(x => x.id !== m.id) })}><Trash2 size={16} /> Remove</button>}
                    </div>
                    <Field label="My notes"><textarea rows={2} maxLength={600} value={m.note ?? ''} onChange={e => patch(m.id, x => { x.note = e.target.value })} placeholder="Names, links, what I found out…" /></Field>
                  </div>}
                </li>))}
            </ul>
            {adding === ph ? <form className="add-row" onSubmit={e => { e.preventDefault(); const t = title.trim(); if (!t) return; update(w => { w.milestones.push({ id: uid(), phase: ph, title: t.slice(0, 120), detail: '', done: false, custom: true }) }); setTitle(''); setAdding(null) }}>
              <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Describe your step" maxLength={120} /><button className="btn sm">Add</button><button type="button" className="btn ghost sm" onClick={() => setAdding(null)}>Cancel</button></form>
              : <button className="link add" onClick={() => { setAdding(ph); setTitle('') }}><Plus size={16} /> Add my own step</button>}
          </section>)
      })}

      {editing && <Modal title="Edit my plan" onClose={() => setEditing(false)}>
        <Field label="My goal"><input value={plan.goalTitle} maxLength={120} onChange={e => setPlan({ ...plan, goalTitle: e.target.value })} /></Field>
        <Field label="Why this matters to me"><textarea rows={2} maxLength={400} value={plan.why} onChange={e => setPlan({ ...plan, why: e.target.value })} /></Field>
        <Field label="Target date"><input type="date" value={plan.targetDate} onChange={e => setPlan({ ...plan, targetDate: e.target.value })} /></Field>
        <Field label={`Hours I can protect each week: ${plan.hoursPerWeek}`}><input type="range" min={1} max={30} value={plan.hoursPerWeek} onChange={e => setPlan({ ...plan, hoursPerWeek: +e.target.value })} /></Field>
        <button className="btn block" onClick={() => { update(w => { w.goalTitle = plan.goalTitle.trim() || p?.name || 'My goal'; w.why = plan.why.trim(); w.targetDate = plan.targetDate; w.hoursPerWeek = plan.hoursPerWeek }); setEditing(false) }}>Save</button>
      </Modal>}
      {switching && <Modal title="Change pathway" onClose={() => setSwitching(false)} wide>
        <p className="muted">Switching replaces the standard steps with the new pathway’s steps. Steps you added yourself are kept. Points you already earned from other activities stay.</p>
        {TRACKS.map(t => <div key={t.id}><h4 className="group">{t.name}</h4><div className="choice-list">
          {PATHWAYS.filter(x => x.track === t.id).map(x => <button key={x.id} className={`choice${x.id === ws.pathwayId ? ' on' : ''}`} disabled={x.id === ws.pathwayId} onClick={() => { if (confirm(`Switch to “${x.name}”? Your current standard steps will be replaced.`)) switchTo(x.id) }}><b>{x.name}</b><span>{x.blurb}</span></button>)}</div></div>)}
      </Modal>}
    </>
  )
}
