import { useCallback, useEffect, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { useApp } from '../lib/store'
import { Empty, PageHead } from '../components/ui'
import { CIRCLES, CONSENTS, OPPORTUNITIES } from '../data/community'
import { pathwayById } from '../data/pathways'
import { download, fmtDate } from '../lib/progress'
import type { AdminMember, AdminMessage, AdminReport } from '../lib/types'

const csv = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`

export default function Admin() {
  const { api, toast } = useApp()
  const [tab, setTab] = useState<'members' | 'reports' | 'messages'>('members')
  const [members, setMembers] = useState<AdminMember[] | null>(null)
  const [reports, setReports] = useState<AdminReport[] | null>(null)
  const [messages, setMessages] = useState<AdminMessage[] | null>(null)
  const [q, setQ] = useState('')
  const load = useCallback(() => {
    api.adminMembers().then(setMembers).catch(e => { setMembers([]); toast(e.message) })
    api.adminReports().then(setReports).catch(() => setReports([]))
    api.adminMessages().then(setMessages).catch(() => setMessages([]))
  }, [api, toast])
  useEffect(load, [load])

  const interestNames = (m: AdminMember) => ((m.consent.interests as string[] | undefined) ?? []).map(i => OPPORTUNITIES.find(o => o.id === i)?.title ?? i).join('; ')
  function exportCsv() {
    const head = ['Full name', 'Email', 'Phone', 'Pathway', 'Points', 'Joined', ...CONSENTS.map(c => `Opt-in: ${c.label}`), 'Opportunity interests', 'Consent updated']
    const rows = (members ?? []).map(m => [m.full_name, m.email, m.phone, pathwayById(m.pathway)?.name ?? '', m.points, m.created_at.slice(0, 10), ...CONSENTS.map(c => (m.consent[c.id] ? 'Yes' : 'No')), interestNames(m), m.consent_updated_at ?? ''].map(csv).join(','))
    download(`careerbridge-members-${new Date().toISOString().slice(0, 10)}.csv`, [head.map(csv).join(','), ...rows].join('\r\n'), 'text/csv')
  }
  const shown = (members ?? []).filter(m => !q || (m.full_name + m.email).toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <PageHead eyebrow="Owner" title="Owner Tools" sub="Only you and other owners can see this page." right={<button className="btn ghost sm" onClick={load}><RefreshCw size={16} /> Refresh</button>} />
      <div className="stats">
        <div><b>{members?.length ?? '…'}</b><span>Members</span></div>
        <div><b>{members ? members.filter(m => +new Date(m.created_at) > Date.now() - 86400000).length : '…'}</b><span>Joined in last 24h</span></div>
        <div><b>{members ? members.filter(m => m.pathway).length : '…'}</b><span>Built a pathway</span></div>
        <div><b>{reports?.length ?? '…'}</b><span>Open reports</span></div>
      </div>
      <div className="tabbar" role="tablist">
        <button role="tab" aria-selected={tab === 'members'} className={tab === 'members' ? 'on' : ''} onClick={() => setTab('members')}>Members</button>
        <button role="tab" aria-selected={tab === 'reports'} className={tab === 'reports' ? 'on' : ''} onClick={() => setTab('reports')}>Reported posts ({reports?.length ?? 0})</button>
        <button role="tab" aria-selected={tab === 'messages'} className={tab === 'messages' ? 'on' : ''} onClick={() => setTab('messages')}>Messages ({messages?.filter(m => !m.resolved).length ?? 0})</button>
      </div>

      {tab === 'members' && <section className="card pad">
        <div className="row between wrap"><input className="grow" value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or email" aria-label="Search members" /><button className="btn sm" onClick={exportCsv}><Download size={16} /> Export CSV</button></div>
        <p className="tiny muted">Only contact members about the topics they opted into. The export includes each opt-in.</p>
        <div className="table-wrap"><table><thead><tr><th>Member</th><th>Pathway</th><th>Points</th><th>Opt-ins</th><th>Joined</th><th /></tr></thead>
          <tbody>{shown.map(m => <tr key={m.id} className={m.suspended ? 'susp' : ''}>
            <td><b>{m.full_name || m.display_name || 'Not set'}</b><span>{m.email}</span>{m.phone && <span>{m.phone}</span>}</td>
            <td>{pathwayById(m.pathway)?.name ?? 'Not set'}</td><td>{m.points}</td>
            <td>{CONSENTS.filter(c => m.consent[c.id]).map(c => c.label).join(', ') || 'None'}{interestNames(m) && <span>Interested: {interestNames(m)}</span>}</td>
            <td>{fmtDate(m.created_at)}</td>
            <td><button className={`btn ghost sm${m.suspended ? '' : ' danger'}`} onClick={() => { if (!confirm(m.suspended ? 'Restore posting for this member?' : 'Pause community posting for this member?')) return; void api.adminSetSuspended(m.id, !m.suspended).then(load).catch(e => toast(e.message)) }}>{m.suspended ? 'Restore' : 'Pause posting'}</button></td>
          </tr>)}</tbody></table></div>
      </section>}

      {tab === 'reports' && (reports?.length ? <ul className="feed">{reports.map(r => <li key={r.report_id} className="card pad">
        <p className="tiny muted">{CIRCLES.find(c => c.id === r.circle_id)?.name} · posted by <b>{r.author_name}</b> {fmtDate(r.posted_at)} · reported {fmtDate(r.reported_at)}</p>
        <blockquote className="quote">{r.body}</blockquote>{r.reason && <p><b>Reason:</b> {r.reason}</p>}
        <div className="row wrap"><button className="btn sm dangerbg" onClick={() => void api.deletePost(r.post_id).then(load).catch(e => toast(e.message))}>Remove post</button>
          <button className="btn ghost sm" onClick={() => void api.adminDismissReport(r.report_id).then(load).catch(e => toast(e.message))}>Keep post, dismiss report</button>
          <button className="btn ghost sm danger" onClick={() => void api.adminSetSuspended(r.author_id, true).then(() => toast('Posting paused for this member')).catch(e => toast(e.message))}>Pause author’s posting</button></div>
      </li>)}</ul> : <Empty title="No reported posts" text="When a member reports a post, it appears here for your review." />)}

      {tab === 'messages' && (messages?.length ? <ul className="feed">{messages.map(m => <li key={m.id} className={`card pad${m.resolved ? ' dimmed' : ''}`}>
        <p className="tiny muted"><span className="pill soft">{m.topic}</span> {m.full_name} · <a href={`mailto:${m.email}`}>{m.email}</a> · {fmtDate(m.created_at)}</p>
        <p className="post-body">{m.body}</p>
        <button className="btn ghost sm" onClick={() => void api.adminResolveMessage(m.id, !m.resolved).then(load).catch(e => toast(e.message))}>{m.resolved ? 'Reopen' : 'Mark resolved'}</button>
      </li>)}</ul> : <Empty title="No messages yet" text="Messages from the Contact us form appear here." />)}
    </>
  )
}
