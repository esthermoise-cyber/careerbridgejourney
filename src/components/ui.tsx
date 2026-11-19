import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1648A4" />
      <path d="M8 30C18 12 42 8 56 20" fill="none" stroke="#22A745" strokeWidth="4" strokeLinecap="round" />
      <circle cx="20" cy="27" r="4" fill="#22A745" /><circle cx="32" cy="22" r="5.5" fill="#fff" /><circle cx="44" cy="27" r="4" fill="#F0804A" />
      <path d="M8 44c14-12 34-12 48 0" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M20 38v10M32 35.500v12.500M44 38v10" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ size = 40, light = false }: { size?: number; light?: boolean }) {
  return (
    <span className={`logo${light ? ' light' : ''}`}>
      <LogoMark size={size} />
      <span className="logo-text"><b>CareerBridge</b><i>Journey</i></span>
    </span>
  )
}

export function Ring({ pct, size = 120, stroke = 11, children, color = 'var(--green)' }: { pct: number; size?: number; stroke?: number; children?: ReactNode; color?: string }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${pct}% complete`}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(pct, 100) / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div className="ring-in">{children}</div>
    </div>
  )
}

export function Bar({ pct, color }: { pct: number; color?: string }) {
  return <div className="bar" role="img" aria-label={`${pct}%`}><span style={{ width: `${Math.min(pct, 100)}%`, background: color }} /></div>
}

export function Avatar({ name, color, size = 38 }: { name: string; color: string; size?: number }) {
  return <span className="avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">{(name.trim()[0] ?? 'M').toUpperCase()}</span>
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="modal-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function PageHead({ eyebrow, title, sub, right }: { eyebrow?: string; title: string; sub?: string; right?: ReactNode }) {
  return (
    <header className="page-head">
      <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{sub && <p className="muted">{sub}</p>}</div>
      {right && <div className="page-head-right">{right}</div>}
    </header>
  )
}

export function Empty({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return <div className="empty"><h3>{title}</h3><p className="muted">{text}</p>{children}</div>
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span className="field-label">{label}</span>{children}{hint && <span className="hint">{hint}</span>}</label>
}

export function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return <label className="check"><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} /><span>{children}</span></label>
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return children ? <p className="error" role="alert">{children}</p> : null
}
