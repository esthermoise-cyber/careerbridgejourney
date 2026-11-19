export interface Circle { id: string; name: string; blurb: string; color: string }

export const CIRCLES: Circle[] = [
  { id: 'wins', name: 'Wins & Encouragement', blurb: 'Share a win, big or small, and cheer someone else on.', color: '#F0804A' },
  { id: 'cna-nursing', name: 'CNA to Nursing', blurb: 'For CNAs and PCTs working toward a nursing license.', color: '#1648A4' },
  { id: 'lvn-rn', name: 'LVN/LPN to RN', blurb: 'Bridge programs, prerequisites and balancing shifts.', color: '#0E7490' },
  { id: 'rn-bsn', name: 'RN to BSN', blurb: 'Working nurses finishing the bachelor’s degree.', color: '#22A745' },
  { id: 'study', name: 'Study & Exam Prep', blurb: 'Study plans, accountability and exam tips.', color: '#8B5CF6' },
  { id: 'changers', name: 'Career Changers', blurb: 'Moving into a new field at any age.', color: '#D97706' },
  { id: 'trades', name: 'Trades & Certifications', blurb: 'Apprenticeships, licenses and industry credentials.', color: '#B45309' },
  { id: 'business', name: 'Business Builders', blurb: 'Starting and growing a business, one customer at a time.', color: '#102A4A' },
  { id: 'parents', name: 'Working Parents', blurb: 'Reaching goals while raising a family.', color: '#DB2777' },
]

export const POST_KINDS = [
  { id: 'update', label: 'Update' },
  { id: 'win', label: 'Win' },
  { id: 'question', label: 'Question' },
  { id: 'encouragement', label: 'Encouragement' },
] as const
export type PostKind = (typeof POST_KINDS)[number]['id']

export interface Challenge {
  id: string
  name: string
  cat: string
  days: number
  bonus: number
  desc: string
  tasks: string[]
}

export const CHALLENGES: Challenge[] = [
  { id: 'clarity', cat: 'Career discovery', name: '7-Day Career Clarity', days: 7, bonus: 60, desc: 'Name your strengths, explore real options and choose a direction.', tasks: ['Take the career match quiz', 'Save three careers that interest me', 'Read the BLS page for my top career', 'Write my three non-negotiables for work', 'Talk to one person in a field I like', 'Choose my pathway and set a target date'] },
  { id: 'momentum', cat: 'Getting started', name: 'First Steps Sprint', days: 5, bonus: 40, desc: 'Build early momentum in your first week.', tasks: ['Complete my first milestone', 'Set three goals for this week', 'Join a circle and introduce myself', 'Write a reflection on my why', 'Cheer on another member'] },
  { id: 'study', cat: 'Student success', name: '14-Day Study Habit', days: 14, bonus: 80, desc: 'Build a study routine that fits the life you actually have.', tasks: ['Schedule three study blocks this week', 'Answer ten practice questions', 'Review the reasoning for every question I missed', 'Study on three different days', 'Schedule next week’s blocks', 'Answer twenty practice questions in total', 'Share what is working in the Study circle'] },
  { id: 'program', cat: 'School search', name: '30-Day Program Quest', days: 30, bonus: 100, desc: 'Build a verified school shortlist and an application checklist.', tasks: ['Add three programs to my shortlist', 'Verify accreditation or state approval for each', 'Record prerequisites for each', 'Get the full cost for each', 'File the FAFSA or review my funding options', 'Contact an admissions advisor', 'Choose my first-choice program'] },
  { id: 'jobready', cat: 'Job search', name: 'Job-Ready in 10 Days', days: 10, bonus: 80, desc: 'Resume, stories and applications, done.', tasks: ['Finish the resume guide checklist', 'Tailor my resume to one posting', 'Write three STAR stories', 'Practice interview answers out loud', 'Send two advice requests', 'Submit three tailored applications'] },
  { id: 'bsn', cat: 'RN to BSN', name: 'BSN Momentum Month', days: 28, bonus: 100, desc: 'Make measurable progress on your BSN plan this month.', tasks: ['Request a transcript or degree audit', 'Identify two RN-to-BSN programs', 'Ask about employer tuition support', 'Compare total cost and schedule', 'Set my start-date goal'] },
  { id: 'founder', cat: 'Business', name: 'First Customer Challenge', days: 21, bonus: 100, desc: 'Go from idea to a real paying customer.', tasks: ['Describe my customer and their problem', 'Talk to five potential customers', 'Set my price and break-even number', 'Make a simple one-page offer', 'Ask ten people to buy or pre-order', 'Get my first paying customer'] },
  { id: 'ai', cat: 'Future skills', name: '10-Day AI Skill Builder', days: 10, bonus: 60, desc: 'Learn to use AI responsibly for real work.', tasks: ['Pick one task to improve with AI', 'Write a clear prompt with context and format', 'Find and fix one AI mistake', 'Read the AI privacy guidance', 'Save a reusable prompt or template'] },
]

export interface Opportunity { id: string; provider: string; tag: string; title: string; desc: string; consent: 'frontline' | 'njn' }

export const OPPORTUNITIES: Opportunity[] = [
  { id: 'jobs', provider: 'Frontline Nurse Staffing', tag: 'Career opportunities', title: 'Healthcare job opportunities', desc: 'Tell us you are interested in nursing and healthcare staffing opportunities so you can hear about openings when you are eligible.', consent: 'frontline' },
  { id: 'clinical', provider: 'NJN Training & Consulting', tag: 'Professional training', title: 'Hands-on healthcare training', desc: 'Ask about available CPR/BLS and other hands-on healthcare training programs.', consent: 'njn' },
  { id: 'ai', provider: 'NJN Training & Consulting', tag: 'AI education', title: 'AI and workplace automation', desc: 'Courses and practical training on using AI tools in your work or business.', consent: 'njn' },
  { id: 'business', provider: 'NJN Training & Consulting', tag: 'Entrepreneurship', title: 'Start or strengthen a business', desc: 'Business training, coaching and consulting, including staffing-business development.', consent: 'njn' },
]

export const CONSENT_VERSION = '2026-11-19'
export const CONSENTS = [
  { id: 'updates', label: 'CareerBridge Journey updates', desc: 'Occasional emails about new features, challenges and career and education resources.' },
  { id: 'frontline', label: 'Frontline Nurse Staffing', desc: 'Emails about healthcare job and staffing opportunities.' },
  { id: 'njn', label: 'NJN Training & Consulting', desc: 'Emails about training, AI and business programs and offers.' },
] as const
export type ConsentId = (typeof CONSENTS)[number]['id']

// Light client-side language filter. The owner moderation tools are the real safeguard.
const BLOCKED = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'nigg', 'faggot', 'retard', 'whore', 'slut', 'dick', 'pussy', 'kill yourself', 'kys']
export function languageIssue(text: string): string | null {
  const t = text.toLowerCase().replace(/[^a-z\s]/g, '')
  if (BLOCKED.some(w => new RegExp(`(^|\\s)${w}`).test(t))) return 'Please keep it respectful. Remove the offensive language to post.'
  if (/(https?:\/\/|www\.)/i.test(text)) return 'Links are not allowed in circle posts, to keep everyone safe from spam.'
  return null
}
