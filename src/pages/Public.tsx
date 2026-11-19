import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, CalendarCheck, Compass, GraduationCap, Route, ShieldCheck, Trophy, Users } from 'lucide-react'
import { backend } from '../lib/backend'
import { Link, navigate } from '../lib/router'
import { Check, ErrorNote, Field, Logo } from '../components/ui'
import { CONSENTS } from '../data/community'

function Shell({ children, cta = true }: { children: ReactNode; cta?: boolean }) {
  return (
    <div className="public">
      <header className="pub-nav">
        <Link to="/" aria-label="CareerBridge Journey home"><Logo /></Link>
        {cta && <nav><Link to="/signin" className="btn ghost sm">Sign in</Link><Link to="/join" className="btn sm">Join free</Link></nav>}
      </header>
      {children}
      <footer className="pub-foot">
        <Logo size={30} />
        <p>Explore &nbsp;|&nbsp; Learn &nbsp;|&nbsp; Prepare &nbsp;|&nbsp; Advance</p>
        <nav><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/signin">Sign in</Link></nav>
        <p className="tiny">© {new Date().getFullYear()} CareerBridge Journey. Free to use. Educational planning tool; not an admission, licensing or employment guarantee.</p>
      </footer>
    </div>
  )
}

const FEATURES = [
  [Route, 'A personal pathway', 'Tell us where you are and where you want to be. Get a clear, step-by-step roadmap you can edit.'],
  [Compass, 'Career match', 'A five-minute quiz points you to careers that fit, with links to current official pay and outlook data.'],
  [CalendarCheck, 'Weekly goals', 'Break big dreams into this week’s actions and check in on how it is going.'],
  [GraduationCap, 'Learn & practice', 'Practice questions with clear explanations, plus guides for resumes, interviews and paying for school.'],
  [Users, 'Community circles', 'Join people on the same road. Share wins, ask questions and cheer each other on.'],
  [Trophy, 'Challenges & rewards', 'Earn points, levels and badges for real progress. Join challenges to build momentum.'],
] as const

export function SignUpForm() {
  const [f, setF] = useState({ fullName: '', email: '', password: '', phone: '' })
  const [consent, setConsent] = useState<Record<string, boolean>>({})
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr('')
    if (!backend) return setErr('Sign-up is not available yet. Please try again shortly.')
    if (f.fullName.trim().length < 2) return setErr('Please enter your full name.')
    if (f.password.length < 8) return setErr('Please choose a password with at least 8 characters.')
    if (!agree) return setErr('Please agree to the Terms and Privacy Policy to create your account.')
    setBusy(true)
    try {
      const r = await backend.signUp({ email: f.email.trim(), password: f.password, fullName: f.fullName.trim(), phone: f.phone.trim(), consent })
      if (r.needsConfirm) setSent(true); else navigate('/app')
    } catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }

  if (sent) return (
    <div className="card pad auth-card"><h2>Check your email</h2>
      <p className="muted">We sent a confirmation link to <b>{f.email}</b>. Open it to finish creating your account. If you do not see it, check your spam folder.</p>
      <Link to="/signin" className="btn block">Go to sign in</Link></div>
  )
  return (
    <form className="card pad auth-card" onSubmit={submit} id="join">
      <h2>Create your free account</h2>
      <p className="muted">It takes less than a minute.</p>
      <Field label="Full name"><input required autoComplete="name" value={f.fullName} onChange={set('fullName')} maxLength={120} /></Field>
      <Field label="Email"><input required type="email" autoComplete="email" inputMode="email" value={f.email} onChange={set('email')} maxLength={200} /></Field>
      <Field label="Password" hint="At least 8 characters."><input required type="password" autoComplete="new-password" value={f.password} onChange={set('password')} minLength={8} maxLength={72} /></Field>
      <Field label="Phone (optional)"><input type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} maxLength={30} /></Field>
      <fieldset className="consents">
        <legend>Stay in the loop, only if you choose</legend>
        {CONSENTS.map(c => <Check key={c.id} checked={!!consent[c.id]} onChange={v => setConsent({ ...consent, [c.id]: v })}><b>{c.label}.</b> {c.desc}</Check>)}
      </fieldset>
      <Check checked={agree} onChange={setAgree}>I agree to the <Link to="/terms" target="_blank">Terms</Link> and <Link to="/privacy" target="_blank">Privacy Policy</Link>.</Check>
      <ErrorNote>{err}</ErrorNote>
      <button className="btn block lg" disabled={busy}>{busy ? 'Creating your account…' : <>Create my account <ArrowRight size={18} /></>}</button>
      <p className="center tiny">Already a member? <Link to="/signin">Sign in</Link></p>
    </form>
  )
}

export function Landing() {
  return (
    <Shell>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Free for everyone</p>
          <h1>Your pathway to meaningful careers <span>and opportunities.</span></h1>
          <p className="lead">Know your next step. Whether you are starting out, changing careers, going back to school or building a business, CareerBridge Journey turns your goal into a plan and keeps you moving.</p>
          <ul className="ticks">
            <li>A roadmap built around your real life</li>
            <li>Progress you can see, one step at a time</li>
            <li>A community that wants you to win</li>
          </ul>
          <img className="hero-img" src="/people.jpg" alt="People from many careers: construction, business, culinary, technology and nursing" width={1080} height={364} />
        </div>
        <SignUpForm />
      </section>
      <section className="section">
        <p className="eyebrow center">Everything in one place</p>
        <h2 className="center">From “where do I start?” to “I did it.”</h2>
        <div className="grid3">
          {FEATURES.map(([Icon, t, d]) => <div className="card pad feature" key={t}><span className="ficon"><Icon size={22} /></span><h3>{t}</h3><p className="muted">{d}</p></div>)}
        </div>
      </section>
      <section className="section band">
        <h2 className="center">Three ways forward</h2>
        <div className="grid3">
          <div className="card pad track t-blue"><h3>Healthcare & Nursing</h3><p>Explore Nursing · Become a CNA · CNA to Nursing · LVN/LPN to RN · RN to BSN · Allied health</p></div>
          <div className="card pad track t-green"><h3>Careers & Education</h3><p>Find your direction · Change careers · Certifications and trades · Go back to school · Land a better job</p></div>
          <div className="card pad track t-coral"><h3>Business & Future Skills</h3><p>Start a business · Build AI and digital skills</p></div>
        </div>
        <div className="center"><a className="btn lg" href="#join" onClick={e => { e.preventDefault(); document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' }) }}>Start my journey <ArrowRight size={18} /></a></div>
      </section>
      <section className="section trust">
        <ShieldCheck size={28} />
        <div><h3>Your information stays yours</h3>
          <p className="muted">Your plan is private to your account. We never sell your data, marketing emails are opt-in only, and you can export or delete everything at any time.</p></div>
      </section>
    </Shell>
  )
}

export function Join() { return <Shell cta={false}><section className="auth-wrap"><SignUpForm /></section></Shell> }

export function SignIn() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false), [err, setErr] = useState('')
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true)
    try { if (!backend) throw new Error('Sign-in is not available yet.'); await backend.signIn(email.trim(), password); navigate('/app') }
    catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }
  return (
    <Shell cta={false}><section className="auth-wrap">
      <form className="card pad auth-card" onSubmit={submit}>
        <h2>Welcome back</h2><p className="muted">Sign in to continue your journey.</p>
        <Field label="Email"><input required type="email" autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Password"><input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></Field>
        <ErrorNote>{err}</ErrorNote>
        <button className="btn block lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="center tiny"><Link to="/recover">Forgot your password?</Link> &nbsp;·&nbsp; New here? <Link to="/join">Create a free account</Link></p>
      </form>
    </section></Shell>
  )
}

export function Recover() {
  const [email, setEmail] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState(''), [sent, setSent] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true)
    try { if (!backend) throw new Error('Not available yet.'); await backend.sendReset(email.trim()); setSent(true) }
    catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }
  return (
    <Shell cta={false}><section className="auth-wrap">
      {sent ? <div className="card pad auth-card"><h2>Check your email</h2><p className="muted">If an account exists for <b>{email}</b>, a password reset link is on its way. It can take a few minutes.</p><Link to="/signin" className="btn block">Back to sign in</Link></div> :
        <form className="card pad auth-card" onSubmit={submit}>
          <h2>Reset your password</h2><p className="muted">Enter your email and we will send you a reset link.</p>
          <Field label="Email"><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
          <ErrorNote>{err}</ErrorNote>
          <button className="btn block lg" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
          <p className="center tiny"><Link to="/signin">Back to sign in</Link></p>
        </form>}
    </section></Shell>
  )
}

export function ResetPassword({ ready }: { ready: boolean }) {
  const [pw, setPw] = useState(''), [busy, setBusy] = useState(false), [err, setErr] = useState('')
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr('')
    if (pw.length < 8) return setErr('Please choose a password with at least 8 characters.')
    setBusy(true)
    try { await backend!.updatePassword(pw); navigate('/app') } catch (x) { setErr((x as Error).message) } finally { setBusy(false) }
  }
  return (
    <Shell cta={false}><section className="auth-wrap">
      {!ready ? <div className="card pad auth-card"><h2>This link has expired</h2><p className="muted">Password reset links work once and expire after a short time. Request a new one.</p><Link to="/recover" className="btn block">Send a new link</Link></div> :
        <form className="card pad auth-card" onSubmit={submit}>
          <h2>Choose a new password</h2>
          <Field label="New password" hint="At least 8 characters."><input required type="password" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} minLength={8} maxLength={72} /></Field>
          <ErrorNote>{err}</ErrorNote>
          <button className="btn block lg" disabled={busy}>{busy ? 'Saving…' : 'Save and continue'}</button>
        </form>}
    </section></Shell>
  )
}

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  return (
    <Shell><article className="legal">
      {kind === 'privacy' ? <>
        <h1>Privacy Policy</h1><p className="muted">Effective November 19, 2026</p>
        <p>CareerBridge Journey is a free career and education planning tool. This page explains, in plain language, what we collect and what we do with it.</p>
        <h2>What we collect</h2>
        <ul><li><b>Account details:</b> your name, email address, password (stored only in encrypted, hashed form by our authentication provider) and, if you choose to add it, your phone number.</li>
          <li><b>Your plan:</b> the pathway you choose, milestones, goals, check-ins, quiz answers, saved careers, school notes and challenge progress.</li>
          <li><b>Community activity:</b> the circles you join and anything you post. Posts show your display name to other signed-in members.</li>
          <li><b>Your choices:</b> which optional emails you opted into, and when.</li></ul>
        <h2>How we use it</h2>
        <ul><li>To run your account and save your progress across devices.</li><li>To show community posts and, only if you turn it on, your display name and points on the leaderboard.</li>
          <li>To contact you about opportunities <b>only</b> where you opted in. Creating an account is not consent to marketing.</li><li>To keep the community safe, including reviewing reported posts.</li></ul>
        <h2>What we do not do</h2>
        <ul><li>We do not sell your personal information.</li><li>We do not share your plan, goals, check-ins or study activity with employers, schools or recruiters.</li><li>We do not use advertising trackers.</li></ul>
        <h2>Partners you can opt into</h2>
        <p>If you opt in to Frontline Nurse Staffing or NJN Training & Consulting communications, the CareerBridge Journey owner may share your name and contact details with that organization so it can contact you. You can withdraw at any time in Profile → Email preferences.</p>
        <h2>Where your data lives</h2>
        <p>Data is stored with our hosting and database providers (Netlify and Supabase), protected by encryption in transit and by access rules that limit each member to their own records.</p>
        <h2>Your controls</h2>
        <ul><li><b>Export:</b> download everything in your plan from Profile → Your data.</li><li><b>Delete:</b> permanently delete your account and data from Profile → Your data.</li><li><b>Preferences:</b> change email choices and leaderboard visibility at any time.</li></ul>
        <h2>Important</h2>
        <p>Do not enter patient information or other people’s confidential information anywhere in the app. CareerBridge Journey is intended for adults and for students aged 16 and over.</p>
        <h2>Contact</h2><p>Questions or requests: signed-in members can use Profile → Contact us.</p>
      </> : <>
        <h1>Terms of Use</h1><p className="muted">Effective November 19, 2026</p>
        <p>By creating an account you agree to these terms.</p>
        <h2>What this is</h2>
        <p>CareerBridge Journey provides planning tools, educational content and a member community. It is general information to help you plan. It is not professional, legal, financial, medical or academic advising, and it does not guarantee admission, licensure, employment, income or any other outcome. Always confirm requirements, costs and deadlines directly with schools, licensing boards and employers.</p>
        <h2>Your account</h2><p>Give accurate information, keep your password private, and use one account per person. You must be at least 16.</p>
        <h2>Community rules</h2>
        <ul><li>Be respectful and encouraging. No harassment, hate, threats or sexual content.</li><li>No spam, selling or recruiting in circles.</li><li>Never share patient information or anyone’s private details.</li><li>Do not post exam questions or other copyrighted material.</li></ul>
        <p>We may remove posts and pause or close accounts that break these rules. Use the report button if you see something that does not belong.</p>
        <h2>Practice questions</h2><p>Practice questions are original study aids. They are not official exam content and do not predict exam results.</p>
        <h2>Points and rewards</h2><p>Points, levels and badges are for motivation and have no cash value.</p>
        <h2>Changes and availability</h2><p>The service is provided free, as is, and may change. We will post updates to these terms here.</p>
      </>}
    </article></Shell>
  )
}
