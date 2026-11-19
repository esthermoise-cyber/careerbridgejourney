import { useEffect, useState } from 'react'
import { Download, LogOut, Trash2 } from 'lucide-react'
import { useApp } from '../lib/store'
import { Link } from '../lib/router'
import { Avatar, Check, ErrorNote, Field, Modal, PageHead } from '../components/ui'
import { CONSENTS, CONSENT_VERSION } from '../data/community'
import { download } from '../lib/progress'

const COLORS = ['#1648A4', '#22A745', '#F0804A', '#0E7490', '#8B5CF6', '#DB2777', '#D97706', '#102A4A']

export default function Profile() {
  const { api, user, profile, ws, setProfile, toast, signOut } = useApp()
  const [f, setF] = useState({ full_name: profile.full_name, display_name: profile.display_name, phone: profile.phone, avatar_color: profile.avatar_color })
  const [busy, setBusy] = useState(false), [err, setErr] = useState('')
  const [pw, setPw] = useState(''), [msg, setMsg] = useState(''), [topic, setTopic] = useState('support')
  const [blocked, setBlocked] = useState(0)
  const [del, setDel] = useState(false), [confirmText, setConfirmText] = useState('')
  useEffect(() => { api.blockedCount().then(setBlocked).catch(() => {}) }, [api])

  async function save() {
    setErr(''); if (f.display_name.trim().length < 2) return setErr('Please enter a display name of at least 2 characters.')
    setBusy(true)
    try { await setProfile({ full_name: f.full_name.trim(), display_name: f.display_name.trim(), phone: f.phone.trim(), avatar_color: f.avatar_color }); toast('Profile saved') }
    catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }
  const setConsent = (id: string, v: boolean) =>
    void setProfile({ consent: { ...profile.consent, [id]: v, version: CONSENT_VERSION, at: new Date().toISOString(), source: 'profile' } }).then(() => toast('Preference saved')).catch(e => toast(e.message))

  return (
    <>
      <PageHead title="Profile" sub={user.email} right={<button className="btn ghost sm" onClick={() => void signOut()}><LogOut size={16} /> Sign out</button>} />
      <section className="card pad form">
        <h2>About you</h2>
        <div className="row"><Avatar name={f.display_name} color={f.avatar_color} size={56} /><div className="swatches" role="radiogroup" aria-label="Avatar color">{COLORS.map(c => <button key={c} role="radio" aria-checked={f.avatar_color === c} aria-label={`Color ${c}`} className={f.avatar_color === c ? 'on' : ''} style={{ background: c }} onClick={() => setF({ ...f, avatar_color: c })} />)}</div></div>
        <Field label="Full name" hint="Private. Only you and the CareerBridge Journey team can see it."><input value={f.full_name} maxLength={120} onChange={e => setF({ ...f, full_name: e.target.value })} /></Field>
        <Field label="Display name" hint="Shown on your community posts and, if you opt in, the leaderboard."><input value={f.display_name} maxLength={40} onChange={e => setF({ ...f, display_name: e.target.value })} /></Field>
        <Field label="Phone (optional)"><input type="tel" value={f.phone} maxLength={30} onChange={e => setF({ ...f, phone: e.target.value })} /></Field>
        <ErrorNote>{err}</ErrorNote>
        <button className="btn" disabled={busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Save profile'}</button>
      </section>

      <section className="card pad">
        <h2>Email preferences</h2><p className="muted">All optional. Change them whenever you like.</p>
        {CONSENTS.map(c => <Check key={c.id} checked={!!profile.consent[c.id]} onChange={v => setConsent(c.id, v)}><b>{c.label}.</b> {c.desc}</Check>)}
      </section>

      <section className="card pad">
        <h2>Community</h2>
        <Check checked={profile.show_on_leaderboard} onChange={v => void setProfile({ show_on_leaderboard: v }).then(() => toast('Saved')).catch(e => toast(e.message))}>Show my display name and points on the leaderboard.</Check>
        <div className="row between"><span className="muted">You have blocked {blocked} member{blocked === 1 ? '' : 's'}.</span>{blocked > 0 && <button className="btn ghost sm" onClick={() => void api.unblockAll().then(() => { setBlocked(0); toast('All members unblocked') })}>Unblock all</button>}</div>
      </section>

      <section className="card pad form">
        <h2>Password</h2>
        <Field label="New password" hint="At least 8 characters."><input type="password" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} maxLength={72} /></Field>
        <button className="btn ghost" disabled={pw.length < 8} onClick={() => void api.updatePassword(pw).then(() => { setPw(''); toast('Password updated') }).catch(e => toast(e.message))}>Update password</button>
      </section>

      <section className="card pad form">
        <h2>Contact us</h2><p className="muted">Questions, feedback or a privacy request? Send us a note and we will reply by email.</p>
        <Field label="Topic"><select value={topic} onChange={e => setTopic(e.target.value)}><option value="support">Help using the app</option><option value="feedback">Feedback or idea</option><option value="privacy">Privacy request</option><option value="community">Community concern</option></select></Field>
        <Field label="Message"><textarea rows={3} maxLength={2000} value={msg} onChange={e => setMsg(e.target.value)} /></Field>
        <button className="btn ghost" disabled={!msg.trim()} onClick={() => void api.sendMessage(topic, msg.trim()).then(() => { setMsg(''); toast('Message sent. Thank you!') }).catch(e => toast(e.message))}>Send message</button>
      </section>

      <section className="card pad">
        <h2>Your data</h2><p className="muted">Your plan belongs to you. <Link to="/privacy">Privacy Policy</Link> · <Link to="/terms">Terms</Link></p>
        <div className="row wrap">
          <button className="btn ghost" onClick={() => download('careerbridge-journey-export.json', JSON.stringify({ exportedAt: new Date().toISOString(), account: { email: user.email }, profile, plan: ws }, null, 2), 'application/json')}><Download size={16} /> Download my data</button>
          <button className="btn ghost danger" onClick={() => { setConfirmText(''); setDel(true) }}><Trash2 size={16} /> Delete my account</button>
        </div>
      </section>

      {del && <Modal title="Delete my account" onClose={() => setDel(false)}>
        <p>This permanently deletes your account, plan, goals, check-ins and community posts. It cannot be undone.</p>
        <Field label="Type DELETE to confirm"><input value={confirmText} onChange={e => setConfirmText(e.target.value)} autoCapitalize="characters" /></Field>
        <button className="btn block dangerbg" disabled={confirmText.trim().toUpperCase() !== 'DELETE'} onClick={() => void api.deleteAccount().then(() => { location.href = '/' }).catch(e => toast(e.message))}>Permanently delete my account</button>
      </Modal>}
    </>
  )
}
