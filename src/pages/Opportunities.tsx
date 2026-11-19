import { useState } from 'react'
import { Check, Mail } from 'lucide-react'
import { useApp } from '../lib/store'
import { PageHead } from '../components/ui'
import { CONSENT_VERSION, OPPORTUNITIES } from '../data/community'

export default function Opportunities() {
  const { ws, update, profile, setProfile, toast } = useApp()
  const [busy, setBusy] = useState('')
  async function express(id: string, consent: string, provider: string) {
    const on = !ws.interests.includes(id)
    const needs = on && !profile.consent[consent]
    if (needs && !confirm(`To follow up, ${provider} needs permission to email you. Allow ${provider} to contact you about this? You can turn this off any time in Profile.`)) return
    const interests = on ? [...ws.interests, id] : ws.interests.filter(x => x !== id)
    setBusy(id)
    try {
      await setProfile({ consent: { ...profile.consent, interests, ...(needs ? { [consent]: true, version: CONSENT_VERSION, at: new Date().toISOString(), source: 'opportunities' } : {}) } })
    } catch (e) { setBusy(''); return toast((e as Error).message) }
    setBusy('')
    update(w => { w.interests = interests })
    toast(on ? 'Interest saved. We will be in touch.' : 'Interest removed')
  }
  return (
    <>
      <PageHead eyebrow="Connect" title="Opportunities" sub="Optional next steps from our partner organizations. Nothing here is required to use CareerBridge Journey." />
      <div className="grid2">{OPPORTUNITIES.map(o => { const on = ws.interests.includes(o.id); return (
        <article key={o.id} className={`card pad opp${on ? ' on' : ''}`}>
          <p className="eyebrow">{o.provider}</p><span className="pill soft">{o.tag}</span>
          <h3>{o.title}</h3><p className="muted">{o.desc}</p>
          <button className={`btn${on ? ' ghost' : ''}`} disabled={busy === o.id} onClick={() => void express(o.id, o.consent, o.provider)}>{on ? <><Check size={17} /> Interested · tap to undo</> : <><Mail size={17} /> I am interested</>}</button>
        </article>) })}</div>
      <p className="tiny muted">Expressing interest shares your name and email with the organization named on the card so it can contact you. It is not an application, an offer or a guarantee of a job or a place in a program. Your plan, goals and study activity are never shared.</p>
    </>
  )
}
