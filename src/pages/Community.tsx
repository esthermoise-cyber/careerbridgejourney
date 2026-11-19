import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Flag, Heart, MoreHorizontal, Send, Trash2, UserX, Users } from 'lucide-react'
import { useApp } from '../lib/store'
import { Avatar, Empty, ErrorNote, Modal, PageHead } from '../components/ui'
import { CIRCLES, POST_KINDS, languageIssue, type PostKind } from '../data/community'
import { ago } from '../lib/progress'
import type { Post } from '../lib/types'

export default function Community() {
  const { api, profile, toast, admin } = useApp()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [mine, setMine] = useState<string[] | null>(null)
  const [cid, setCid] = useState('')
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [more, setMore] = useState(false)
  const [body, setBody] = useState(''), [kind, setKind] = useState<PostKind>('update')
  const [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const [menu, setMenu] = useState(''), [reporting, setReporting] = useState<Post | null>(null), [reason, setReason] = useState('')
  const circle = CIRCLES.find(c => c.id === cid)
  const joined = !!mine?.includes(cid)

  const loadLists = useCallback(() => { api.circleCounts().then(setCounts).catch(() => {}); api.myCircles().then(setMine).catch(e => { setMine([]); setErr(e.message) }) }, [api])
  useEffect(loadLists, [loadLists])
  const loadFeed = useCallback(async (id: string) => { try { const f = await api.feed(id); setPosts(f); setMore(f.length >= 30) } catch (e) { setPosts([]); setErr((e as Error).message) } }, [api])
  useEffect(() => { if (cid) { setPosts(null); setErr(''); void loadFeed(cid) } }, [cid, loadFeed])

  async function toggleJoin(id: string, on: boolean) {
    try { await (on ? api.joinCircle(id) : api.leaveCircle(id)); setMine(m => (on ? [...(m ?? []), id] : (m ?? []).filter(x => x !== id))); setCounts(c => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + (on ? 1 : -1)) })); toast(on ? 'You joined the circle' : 'You left the circle') }
    catch (e) { toast((e as Error).message) }
  }
  async function submit() {
    const text = body.trim(); setErr('')
    if (!text) return
    const issue = languageIssue(text); if (issue) return setErr(issue)
    setBusy(true)
    try { await api.post(cid, kind, text); setBody(''); await loadFeed(cid) } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }
  async function cheer(p: Post) {
    setPosts(l => l!.map(x => (x.id === p.id ? { ...x, cheered: !p.cheered, cheers: x.cheers + (p.cheered ? -1 : 1) } : x)))
    try { await api.cheer(p.id, !p.cheered) } catch (e) { toast((e as Error).message); void loadFeed(cid) }
  }
  async function loadMore() {
    const last = posts?.[posts.length - 1]; if (!last) return
    try { const f = await api.feed(cid, last.created_at); setPosts([...(posts ?? []), ...f]); setMore(f.length >= 30) } catch (e) { toast((e as Error).message) }
  }

  if (!circle) return (
    <>
      <PageHead eyebrow="Connect" title="Community Circles" sub="You are not doing this alone. Join the circles that match your journey." />
      <ErrorNote>{err}</ErrorNote>
      <div className="grid2">{CIRCLES.map(c => { const j = mine?.includes(c.id); return (
        <article key={c.id} className="card pad circle" style={{ borderTopColor: c.color }}>
          <div className="card-head"><h3>{c.name}</h3>{j && <span className="pill good">Joined</span>}</div>
          <p className="muted">{c.blurb}</p>
          <div className="row between"><span className="muted tiny"><Users size={14} /> {counts[c.id] ?? 0} member{(counts[c.id] ?? 0) === 1 ? '' : 's'}</span>
            <div className="row">{!j && <button className="btn ghost sm" disabled={mine === null} onClick={() => void toggleJoin(c.id, true)}>Join</button>}<button className="btn sm" onClick={() => setCid(c.id)}>Open</button></div></div>
        </article>) })}</div>
      <section className="card pad rules"><h3>Circle guidelines</h3><ul><li>Encourage first. Everyone here is working toward something hard.</li><li>Keep it respectful. No harassment, hate or spam.</li><li>Never share patient information or anyone’s private details.</li><li>Posts show your display name (<b>{profile.display_name}</b>). Change it in Profile.</li></ul></section>
    </>
  )

  return (
    <>
      <button className="link back" onClick={() => { setCid(''); loadLists() }}><ArrowLeft size={16} /> All circles</button>
      <PageHead title={circle.name} sub={circle.blurb} right={joined ? <button className="btn ghost sm" onClick={() => void toggleJoin(cid, false)}>Leave circle</button> : <button className="btn sm" onClick={() => void toggleJoin(cid, true)}>Join circle</button>} />
      {joined && !profile.suspended ? <section className="card pad composer">
        <div className="chips pick">{POST_KINDS.map(k => <button key={k.id} className={`chip-btn${kind === k.id ? ' on' : ''}`} onClick={() => setKind(k.id)}>{k.label}</button>)}</div>
        <textarea rows={3} maxLength={1000} value={body} onChange={e => setBody(e.target.value)} placeholder={kind === 'win' ? 'Share your win, big or small…' : kind === 'question' ? 'Ask the circle a question…' : kind === 'encouragement' ? 'Encourage someone today…' : 'Share an update on your journey…'} aria-label="Write a post" />
        <ErrorNote>{err}</ErrorNote>
        <div className="row between"><span className="muted tiny">Posting as {profile.display_name} · {body.length}/1000</span><button className="btn" disabled={busy || !body.trim()} onClick={() => void submit()}><Send size={16} /> {busy ? 'Posting…' : 'Post'}</button></div>
      </section> : !joined ? <section className="card pad center"><p>Join this circle to post and cheer others on.</p><button className="btn" onClick={() => void toggleJoin(cid, true)}>Join circle</button></section> : null}

      {posts === null ? <div className="spinner sm" /> : posts.length === 0 ? <Empty title="Be the first to post" text="Introduce yourself and share what you are working toward." /> :
        <ul className="feed">{posts.map(p => <li key={p.id} className="card pad post">
          <div className="post-head"><Avatar name={p.author_name} color={p.author_color} /><div><b>{p.author_name}{p.mine && <span className="muted"> (you)</span>}</b><span className="muted tiny">{ago(p.created_at)}</span></div>
            <span className={`pill kind ${p.kind}`}>{POST_KINDS.find(k => k.id === p.kind)?.label}</span>
            <div className="menu-wrap"><button className="icon-btn" aria-label="Post options" onClick={() => setMenu(menu === p.id ? '' : p.id)}><MoreHorizontal size={19} /></button>
              {menu === p.id && <div className="menu" onMouseLeave={() => setMenu('')}>
                {(p.mine || admin) && <button onClick={async () => { setMenu(''); if (!confirm('Delete this post?')) return; try { await api.deletePost(p.id); setPosts(l => l!.filter(x => x.id !== p.id)) } catch (e) { toast((e as Error).message) } }}><Trash2 size={15} /> Delete</button>}
                {!p.mine && <button onClick={() => { setMenu(''); setReason(''); setReporting(p) }}><Flag size={15} /> Report</button>}
                {!p.mine && <button onClick={async () => { setMenu(''); if (!confirm(`Block ${p.author_name}? You will no longer see their posts.`)) return; try { await api.block(p.user_id); setPosts(l => l!.filter(x => x.user_id !== p.user_id)); toast('Blocked. Manage blocks in Profile.') } catch (e) { toast((e as Error).message) } }}><UserX size={15} /> Block member</button>}
              </div>}</div></div>
          <p className="post-body">{p.body}</p>
          <button className={`cheer${p.cheered ? ' on' : ''}`} onClick={() => void cheer(p)} aria-pressed={p.cheered}><Heart size={17} fill={p.cheered ? 'currentColor' : 'none'} /> {p.cheers > 0 ? p.cheers : ''} Cheer</button>
        </li>)}</ul>}
      {more && <div className="center"><button className="btn ghost" onClick={() => void loadMore()}>Load more</button></div>}

      {reporting && <Modal title="Report this post" onClose={() => setReporting(null)}>
        <p className="muted">Reports go privately to the CareerBridge Journey team for review.</p>
        <blockquote className="quote">{reporting.body}</blockquote>
        <textarea rows={3} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} placeholder="What is wrong with this post? (optional)" aria-label="Reason" />
        <button className="btn block" onClick={async () => { try { await api.report(reporting.id, reason.trim()); toast('Thank you. We will review it.') } catch (e) { toast((e as Error).message) } setReporting(null) }}>Send report</button>
      </Modal>}
    </>
  )
}
