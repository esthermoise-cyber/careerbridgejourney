import type { Workspace, Milestone } from './types'
import { CHALLENGES } from '../data/community'
import { GUIDES, QUESTIONS } from '../data/learn'
import { PHASES, pathwayById, type Pathway } from '../data/pathways'

export const LEVELS = [
  { at: 0, name: 'Starter' }, { at: 100, name: 'Explorer' }, { at: 250, name: 'Learner' }, { at: 500, name: 'Builder' },
  { at: 900, name: 'Achiever' }, { at: 1400, name: 'Trailblazer' }, { at: 2000, name: 'Leader' }, { at: 3000, name: 'Champion' },
]

export function challengeDone(ws: Workspace, id: string) {
  const c = CHALLENGES.find(x => x.id === id), st = ws.challenges[id]
  return !!c && !!st && c.tasks.every(t => st.done.includes(t))
}

/** Points are always calculated from what a member has actually done, never stored separately. */
export function points(ws: Workspace): number {
  let p = ws.onboarded ? 25 : 0
  p += ws.milestones.filter(m => m.done).length * 20
  p += ws.goals.filter(g => g.done).length * 10
  p += Math.min(ws.reflections.length, 60) * 5
  p += ws.quizDone ? 15 : 0
  p += Object.values(ws.study).filter(Boolean).length * 5
  p += GUIDES.reduce((a, g) => a + (ws.guides[g.id]?.filter(x => g.actions.includes(x)).length ?? 0), 0) * 5
  for (const c of CHALLENGES) {
    const st = ws.challenges[c.id]; if (!st) continue
    p += st.done.filter(t => c.tasks.includes(t)).length * 10
    if (challengeDone(ws, c.id)) p += c.bonus
  }
  return p
}

export function level(pts: number) {
  let i = 0
  LEVELS.forEach((l, n) => { if (pts >= l.at) i = n })
  const next = LEVELS[i + 1]
  return { index: i + 1, name: LEVELS[i].name, next, pct: next ? Math.round(((pts - LEVELS[i].at) / (next.at - LEVELS[i].at)) * 100) : 100 }
}

export function pathProgress(ws: Workspace) {
  const total = ws.milestones.length, done = ws.milestones.filter(m => m.done).length
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }
}

export const nextMilestone = (ws: Workspace): Milestone | undefined =>
  PHASES.flatMap(ph => ws.milestones.filter(m => m.phase === ph)).find(m => !m.done)

export function buildMilestones(p: Pathway): Milestone[] {
  return PHASES.flatMap(phase => p.steps[phase].map(([title, detail], i) => ({ id: `${p.id}-${phase}-${i}`, phase, title, detail, done: false })))
}

export interface Badge { id: string; name: string; desc: string; earned: boolean }
export function badges(ws: Workspace): Badge[] {
  const ms = ws.milestones.filter(m => m.done).length
  const correct = Object.values(ws.study).filter(Boolean).length
  const phaseDone = (ph: string) => { const l = ws.milestones.filter(m => m.phase === ph); return l.length > 0 && l.every(m => m.done) }
  const pp = pathProgress(ws)
  return [
    { id: 'start', name: 'Journey Started', desc: 'Built your personal pathway', earned: ws.onboarded },
    { id: 'first', name: 'First Step', desc: 'Completed your first milestone', earned: ms >= 1 },
    { id: 'five', name: 'Momentum', desc: 'Completed five milestones', earned: ms >= 5 },
    { id: 'explore', name: 'Explorer', desc: 'Finished the Explore phase', earned: phaseDone('Explore') },
    { id: 'half', name: 'Halfway There', desc: 'Reached 50% of your pathway', earned: pp.total > 0 && pp.pct >= 50 },
    { id: 'finish', name: 'Pathway Complete', desc: 'Completed every milestone', earned: pp.total > 0 && pp.pct === 100 },
    { id: 'goals', name: 'Goal Getter', desc: 'Completed ten weekly goals', earned: ws.goals.filter(g => g.done).length >= 10 },
    { id: 'match', name: 'Self-Aware', desc: 'Completed the career match quiz', earned: ws.quizDone },
    { id: 'study', name: 'Sharp Mind', desc: `Answered 15 of ${QUESTIONS.length} practice questions correctly`, earned: correct >= 15 },
    { id: 'reflect', name: 'Reflective', desc: 'Wrote five check-ins', earned: ws.reflections.length >= 5 },
    { id: 'challenge', name: 'Challenger', desc: 'Completed a challenge', earned: CHALLENGES.some(c => challengeDone(ws, c.id)) },
    { id: 'guide', name: 'Prepared', desc: 'Finished every action in a guide', earned: GUIDES.some(g => g.actions.every(a => ws.guides[g.id]?.includes(a))) },
  ]
}

/** Transparent work-life check: compares the hours a member can protect with what the pathway usually needs. */
export function feasibility(hours: number, pathwayId: string) {
  const need = pathwayById(pathwayId)?.hours ?? 5
  const r = hours / need
  if (r >= 1) return { label: 'Doable', tone: 'good', text: `You can protect about ${hours} hours a week and this pathway usually needs around ${need}. That is a solid fit.` }
  if (r >= 0.6) return { label: 'Doable with adjustments', tone: 'warn', text: `This pathway usually needs around ${need} hours a week and you have about ${hours}. It can work if you extend your timeline or free up a little more time.` }
  return { label: 'A stretch right now', tone: 'alert', text: `This pathway usually needs around ${need} hours a week and you have about ${hours}. Plan a longer timeline, or start with the early steps while you make room.` }
}

export const weekKey = (d = new Date()) => {
  const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36))
export const fmtDate = (iso: string) => { const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso); return isNaN(+d) ? '' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }
export function ago(iso: string) {
  const s = (Date.now() - +new Date(iso)) / 1000
  if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`; if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return fmtDate(iso)
}
export function download(name: string, text: string, type = 'text/plain') {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
