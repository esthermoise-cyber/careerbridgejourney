import type { Phase } from '../data/pathways'
import type { PostKind } from '../data/community'

export interface Milestone {
  id: string
  phase: Phase
  title: string
  detail: string
  done: boolean
  doneAt?: string
  due?: string
  note?: string
  custom?: boolean
}

export interface Goal { id: string; text: string; week: string; done: boolean; doneAt?: string }
export interface Reflection { id: string; at: string; mood: number; text: string }
export interface School { id: string; name: string; program: string; cost: string; deadline: string; verified: boolean; notes: string }

export interface Workspace {
  v: 1
  onboarded: boolean
  pathwayId: string
  goalTitle: string
  why: string
  targetDate: string
  hoursPerWeek: number
  milestones: Milestone[]
  goals: Goal[]
  reflections: Reflection[]
  quiz: Record<string, number>
  quizDone: boolean
  savedCareers: string[]
  study: Record<string, boolean>
  guides: Record<string, string[]>
  challenges: Record<string, { joinedAt: string; done: string[] }>
  schools: School[]
  interests: string[]
}

export const emptyWorkspace = (): Workspace => ({
  v: 1, onboarded: false, pathwayId: '', goalTitle: '', why: '', targetDate: '', hoursPerWeek: 5,
  milestones: [], goals: [], reflections: [], quiz: {}, quizDone: false, savedCareers: [],
  study: {}, guides: {}, challenges: {}, schools: [], interests: [],
})

export interface Profile {
  id: string
  full_name: string
  display_name: string
  phone: string
  track: string
  pathway: string
  avatar_color: string
  points: number
  show_on_leaderboard: boolean
  consent: Record<string, unknown>
  suspended: boolean
}

export interface SessionUser { id: string; email: string; fullName: string }

export interface Post {
  id: string
  circle_id: string
  user_id: string
  author_name: string
  author_color: string
  kind: PostKind
  body: string
  created_at: string
  cheers: number
  cheered: boolean
  mine: boolean
}

export interface LeaderRow { display_name: string; avatar_color: string; points: number; is_me: boolean }

export interface AdminMember {
  id: string; email: string; full_name: string; display_name: string; phone: string; track: string; pathway: string
  points: number; consent: Record<string, unknown>; consent_updated_at: string | null; suspended: boolean; created_at: string
}
export interface AdminReport {
  report_id: string; reason: string; reported_at: string; post_id: string; circle_id: string
  author_id: string; author_name: string; body: string; posted_at: string
}
export interface AdminMessage { id: string; email: string; full_name: string; topic: string; body: string; resolved: boolean; created_at: string }

export interface SignUpInput { email: string; password: string; fullName: string; phone: string; consent: Record<string, boolean> }

export interface Backend {
  mode: 'live' | 'local'
  getUser(): Promise<SessionUser | null>
  onAuth(cb: (event: 'in' | 'out' | 'recovery', user: SessionUser | null) => void): () => void
  signUp(input: SignUpInput): Promise<{ needsConfirm: boolean }>
  signIn(email: string, password: string): Promise<void>
  signOut(): Promise<void>
  sendReset(email: string): Promise<void>
  updatePassword(password: string): Promise<void>

  loadProfile(user: SessionUser, seed?: Partial<Profile>): Promise<Profile>
  saveProfile(id: string, patch: Partial<Profile>): Promise<void>
  loadWorkspace(id: string): Promise<Workspace | null>
  saveWorkspace(id: string, ws: Workspace): Promise<void>
  /** Fire-and-forget save that survives the page closing. Returns false if it could not be sent. */
  saveWorkspaceOnExit(id: string, ws: Workspace): boolean

  circleCounts(): Promise<Record<string, number>>
  myCircles(): Promise<string[]>
  joinCircle(id: string): Promise<void>
  leaveCircle(id: string): Promise<void>
  feed(circle: string, before?: string): Promise<Post[]>
  post(circle: string, kind: PostKind, body: string): Promise<void>
  deletePost(id: string): Promise<void>
  cheer(postId: string, on: boolean): Promise<void>
  report(postId: string, reason: string): Promise<void>
  block(userId: string): Promise<void>
  unblockAll(): Promise<void>
  blockedCount(): Promise<number>
  leaderboard(): Promise<LeaderRow[]>

  sendMessage(topic: string, body: string): Promise<void>
  deleteAccount(): Promise<void>

  isAdmin(): Promise<boolean>
  adminMembers(): Promise<AdminMember[]>
  adminReports(): Promise<AdminReport[]>
  adminDismissReport(id: string): Promise<void>
  adminSetSuspended(userId: string, on: boolean): Promise<void>
  adminMessages(): Promise<AdminMessage[]>
  adminResolveMessage(id: string, on: boolean): Promise<void>
}
