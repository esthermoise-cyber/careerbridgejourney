import { Award, Check, Lock, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../lib/store'
import { Avatar, Bar, Check as CheckBox, PageHead } from '../components/ui'
import { CHALLENGES } from '../data/community'
import { LEVELS, badges, challengeDone, level, points } from '../lib/progress'
import type { LeaderRow } from '../lib/types'

export default function Challenges() {
  const { ws, update, toast, api, profile, setProfile } = useApp()
  const [tab, setTab] = useState<'challenges' | 'badges' | 'board'>('challenges')
  const [board, setBoard] = useState<LeaderRow[] | null>(null)
  const pts = points(ws), lv = level(pts), bs = badges(ws)

  useEffect(() => { if (tab === 'board') api.leaderboard().then(setBoard).catch(() => setBoard([])) }, [tab, api, profile.show_on_leaderboard, profile.points])

  return (
    <>
      <PageHead eyebrow="Grow" title="Challenges & Rewards" sub="Points come only from real progress. No streak penalties, ever." />
      <section className="card pad level-card">
        <div className="lv-badge"><Award size={30} /><b>{lv.index}</b></div>
        <div className="grow"><h2>{lv.name}</h2><p className="muted">{pts} points{lv.next && <> · {lv.next.at - pts} to {lv.next.name}</>}</p><Bar pct={lv.pct} />
          <div className="lv-track">{LEVELS.map((l, i) => <span key={l.name} className={i < lv.index ? 'on' : ''} title={`${l.name}: ${l.at} points`} />)}</div></div>
      </section>
      <div className="tabbar" role="tablist">
        {(['challenges', 'badges', 'board'] as const).map(t => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'challenges' ? 'Challenges' : t === 'badges' ? `Badges (${bs.filter(b => b.earned).length}/${bs.length})` : 'Leaderboard'}</button>)}
      </div>

      {tab === 'challenges' && <div className="grid2">{CHALLENGES.map(c => {
        const st = ws.challenges[c.id], d = st ? st.done.filter(t => c.tasks.includes(t)).length : 0, complete = challengeDone(ws, c.id)
        return <article key={c.id} className={`card pad challenge${complete ? ' complete' : ''}`}>
          <div className="card-head"><span className="pill soft">{c.cat}</span><span className="muted tiny">{c.days} days · up to {c.tasks.length * 10 + c.bonus} pts</span></div>
          <h3>{c.name}</h3><p className="muted">{c.desc}</p>
          {!st ? <button className="btn" onClick={() => { update(w => { w.challenges[c.id] = { joinedAt: new Date().toISOString(), done: [] } }); toast(`You joined ${c.name}`) }}>Join challenge</button> : <>
            <div className="match"><Bar pct={Math.round((d / c.tasks.length) * 100)} /><b>{d}/{c.tasks.length}</b></div>
            {c.tasks.map(t => <CheckBox key={t} checked={st.done.includes(t)} onChange={v => {
              update(w => { const s = w.challenges[c.id]; s.done = v ? [...s.done, t] : s.done.filter(x => x !== t) })
              if (v) toast(d + 1 === c.tasks.length ? `Challenge complete! +${c.bonus + 10} points` : 'Nice work. +10 points')
            }}>{t}</CheckBox>)}
            {complete ? <p className="done-note"><Trophy size={17} /> Challenge complete</p> : <button className="link danger" onClick={() => { if (confirm('Leave this challenge? Your progress in it will be cleared.')) update(w => { delete w.challenges[c.id] }) }}>Leave challenge</button>}
          </>}
        </article> })}</div>}

      {tab === 'badges' && <div className="badges">{bs.map(b => <div key={b.id} className={`badge${b.earned ? ' earned' : ''}`}><span>{b.earned ? <Check size={22} /> : <Lock size={18} />}</span><b>{b.name}</b><small>{b.desc}</small></div>)}</div>}

      {tab === 'board' && <section className="card pad">
        <CheckBox checked={profile.show_on_leaderboard} onChange={v => void setProfile({ show_on_leaderboard: v }).then(() => toast(v ? 'You are on the leaderboard' : 'You are hidden from the leaderboard')).catch(e => toast(e.message))}>
          Show my display name (<b>{profile.display_name}</b>) and points on the leaderboard. Off by default.</CheckBox>
        {board === null ? <div className="spinner sm" /> : board.length === 0 ? <p className="muted">No one is on the leaderboard yet. Be the first!</p> :
          <ol className="board">{board.map((r, i) => <li key={i} className={r.is_me ? 'me' : ''}><span className="rank">{i + 1}</span><Avatar name={r.display_name} color={r.avatar_color} size={34} /><b>{r.display_name}{r.is_me && ' (you)'}</b><span>{r.points} pts</span></li>)}</ol>}
      </section>}
    </>
  )
}
