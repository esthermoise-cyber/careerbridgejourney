// Career library. Education notes reflect typical entry routes in the United States and
// vary by state and employer. Pay and outlook are deliberately NOT hard-coded: each card
// links to the current Bureau of Labor Statistics Occupational Outlook Handbook page.

export type Interest = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

export const INTERESTS: Record<Interest, { name: string; short: string; color: string }> = {
  R: { name: 'Hands-on', short: 'Building, fixing, working with tools or outdoors', color: '#F0804A' },
  I: { name: 'Investigative', short: 'Science, analysis and solving puzzles', color: '#1648A4' },
  A: { name: 'Creative', short: 'Design, writing, making original things', color: '#8B5CF6' },
  S: { name: 'Helping', short: 'Caring for, teaching and supporting people', color: '#22A745' },
  E: { name: 'Leading', short: 'Persuading, selling, starting and running things', color: '#D97706' },
  C: { name: 'Organizing', short: 'Details, systems, numbers and order', color: '#0E7490' },
}

export interface Career {
  id: string
  name: string
  field: 'Healthcare' | 'Technology' | 'Skilled trades' | 'Business' | 'Education & service' | 'Creative & other'
  codes: Interest[]
  what: string
  entry: string
  bls: string
  pathway: string
}

const ooh = (p: string) => `https://www.bls.gov/ooh/${p}.htm`

export const CAREERS: Career[] = [
  { id: 'rn', name: 'Registered Nurse', field: 'Healthcare', codes: ['S', 'I', 'C'], what: 'Provide and coordinate patient care, educate patients and families, and work with the whole care team.', entry: 'Associate (ADN) or bachelor’s (BSN) degree from an approved program, then the NCLEX-RN and a state license.', bls: ooh('healthcare/registered-nurses'), pathway: 'cna-to-nursing' },
  { id: 'lpn', name: 'Licensed Practical / Vocational Nurse', field: 'Healthcare', codes: ['S', 'R', 'C'], what: 'Provide basic nursing care under the direction of RNs and doctors.', entry: 'State-approved certificate or diploma program (often about a year), then the NCLEX-PN and a state license.', bls: ooh('healthcare/licensed-practical-and-licensed-vocational-nurses'), pathway: 'cna-to-nursing' },
  { id: 'cna', name: 'Nursing Assistant (CNA)', field: 'Healthcare', codes: ['S', 'R', 'C'], what: 'Help patients with daily living and basic care in hospitals, nursing homes and home settings.', entry: 'State-approved training program and a competency exam.', bls: ooh('healthcare/nursing-assistants'), pathway: 'become-cna' },
  { id: 'np', name: 'Nurse Practitioner', field: 'Healthcare', codes: ['S', 'I', 'E'], what: 'Advanced practice nurses who assess, diagnose and manage patient care; scope varies by state.', entry: 'RN license, then a master’s or doctoral degree and national certification.', bls: ooh('healthcare/nurse-anesthetists-nurse-midwives-and-nurse-practitioners'), pathway: 'rn-to-bsn' },
  { id: 'ma', name: 'Medical Assistant', field: 'Healthcare', codes: ['S', 'C', 'R'], what: 'Handle clinical and administrative tasks in clinics and physician offices.', entry: 'Postsecondary certificate is common; some learn on the job. Certification is often preferred.', bls: ooh('healthcare/medical-assistants'), pathway: 'allied-health' },
  { id: 'phleb', name: 'Phlebotomist', field: 'Healthcare', codes: ['R', 'S', 'C'], what: 'Draw blood for tests, transfusions and donations, and help patients feel at ease.', entry: 'Short postsecondary program; certification is commonly expected.', bls: ooh('healthcare/phlebotomists'), pathway: 'allied-health' },
  { id: 'pharmtech', name: 'Pharmacy Technician', field: 'Healthcare', codes: ['C', 'R', 'S'], what: 'Help pharmacists prepare and dispense prescriptions and serve customers.', entry: 'High school diploma plus on-the-job training or a certificate; most states regulate the role.', bls: ooh('healthcare/pharmacy-technicians'), pathway: 'allied-health' },
  { id: 'emt', name: 'EMT / Paramedic', field: 'Healthcare', codes: ['S', 'R', 'I'], what: 'Respond to emergencies, assess patients and provide urgent medical care.', entry: 'Postsecondary EMT or paramedic program, certification and a state license.', bls: ooh('healthcare/emts-and-paramedics'), pathway: 'allied-health' },
  { id: 'radtech', name: 'Radiologic Technologist', field: 'Healthcare', codes: ['R', 'I', 'S'], what: 'Perform X-rays and other diagnostic imaging and position patients safely.', entry: 'Associate degree is typical; most states require licensure or certification.', bls: ooh('healthcare/radiologic-technologists'), pathway: 'allied-health' },
  { id: 'sono', name: 'Diagnostic Medical Sonographer', field: 'Healthcare', codes: ['I', 'R', 'S'], what: 'Use ultrasound equipment to create images that help diagnose conditions.', entry: 'Associate degree or postsecondary certificate; professional certification is widely expected.', bls: ooh('healthcare/diagnostic-medical-sonographers'), pathway: 'allied-health' },
  { id: 'resp', name: 'Respiratory Therapist', field: 'Healthcare', codes: ['S', 'I', 'R'], what: 'Care for patients who have trouble breathing, from newborns to older adults.', entry: 'Associate degree at minimum; licensed in nearly all states.', bls: ooh('healthcare/respiratory-therapists'), pathway: 'allied-health' },
  { id: 'surgtech', name: 'Surgical Technologist', field: 'Healthcare', codes: ['R', 'C', 'S'], what: 'Prepare operating rooms, arrange equipment and assist during surgeries.', entry: 'Postsecondary certificate or associate degree; certification is often preferred.', bls: ooh('healthcare/surgical-technologists'), pathway: 'allied-health' },
  { id: 'dh', name: 'Dental Hygienist', field: 'Healthcare', codes: ['S', 'R', 'C'], what: 'Clean teeth, examine patients for oral disease and teach preventive care.', entry: 'Associate degree in dental hygiene and a state license.', bls: ooh('healthcare/dental-hygienists'), pathway: 'allied-health' },
  { id: 'him', name: 'Medical Records Specialist', field: 'Healthcare', codes: ['C', 'I', 'E'], what: 'Organize and code health information for records, billing and reporting.', entry: 'Postsecondary certificate is common; coding certification is often expected.', bls: ooh('healthcare/medical-records-and-health-information-technicians'), pathway: 'allied-health' },
  { id: 'hsm', name: 'Health Services Manager', field: 'Healthcare', codes: ['E', 'C', 'S'], what: 'Plan and direct the business side of clinics, departments or facilities.', entry: 'Bachelor’s degree is typical; many have clinical or administrative experience first.', bls: ooh('management/medical-and-health-services-managers'), pathway: 'better-job' },

  { id: 'support', name: 'Computer Support Specialist', field: 'Technology', codes: ['R', 'I', 'C'], what: 'Help people and organizations solve computer, software and network problems.', entry: 'Varies: some college, an associate degree, or industry certifications plus hands-on skill.', bls: ooh('computer-and-information-technology/computer-support-specialists'), pathway: 'credential' },
  { id: 'cyber', name: 'Information Security Analyst', field: 'Technology', codes: ['I', 'C', 'R'], what: 'Protect computer systems and networks and investigate security incidents.', entry: 'Bachelor’s degree is typical; experience and security certifications matter a great deal.', bls: ooh('computer-and-information-technology/information-security-analysts'), pathway: 'career-change' },
  { id: 'dev', name: 'Software Developer', field: 'Technology', codes: ['I', 'A', 'C'], what: 'Design, build and test applications and systems.', entry: 'Bachelor’s degree is typical; a strong portfolio of real projects is essential.', bls: ooh('computer-and-information-technology/software-developers'), pathway: 'career-change' },
  { id: 'data', name: 'Data Scientist', field: 'Technology', codes: ['I', 'C', 'E'], what: 'Use data, statistics and programming to answer questions and guide decisions.', entry: 'Bachelor’s degree at minimum; many roles prefer a master’s degree.', bls: ooh('math/data-scientists'), pathway: 'back-to-school' },

  { id: 'electrician', name: 'Electrician', field: 'Skilled trades', codes: ['R', 'I', 'C'], what: 'Install, maintain and repair electrical power, lighting and control systems.', entry: 'Paid apprenticeship (commonly 4 to 5 years); most states require a license.', bls: ooh('construction-and-extraction/electricians'), pathway: 'credential' },
  { id: 'plumber', name: 'Plumber / Pipefitter', field: 'Skilled trades', codes: ['R', 'C', 'I'], what: 'Install and repair piping systems for water, gas and other uses.', entry: 'Paid apprenticeship; most states require a license.', bls: ooh('construction-and-extraction/plumbers-pipefitters-and-steamfitters'), pathway: 'credential' },
  { id: 'hvac', name: 'HVAC Technician', field: 'Skilled trades', codes: ['R', 'I', 'C'], what: 'Install and service heating, cooling and refrigeration systems.', entry: 'Postsecondary program or apprenticeship; EPA certification is required to handle refrigerants.', bls: ooh('installation-maintenance-and-repair/heating-air-conditioning-and-refrigeration-mechanics-and-installers'), pathway: 'credential' },
  { id: 'welder', name: 'Welder', field: 'Skilled trades', codes: ['R', 'C', 'A'], what: 'Join and cut metal parts for buildings, vehicles, pipelines and products.', entry: 'High school diploma plus technical training or on-the-job learning; certifications help.', bls: ooh('production/welders-cutters-solderers-and-brazers'), pathway: 'credential' },
  { id: 'solar', name: 'Solar Installer', field: 'Skilled trades', codes: ['R', 'C', 'I'], what: 'Assemble, install and maintain rooftop and ground solar panel systems.', entry: 'High school diploma with on-the-job training; some take a technical course first.', bls: ooh('construction-and-extraction/solar-photovoltaic-installers'), pathway: 'credential' },
  { id: 'cdl', name: 'Commercial Truck Driver', field: 'Skilled trades', codes: ['R', 'C', 'E'], what: 'Transport goods over long distances or regional routes.', entry: 'Professional truck-driving training and a commercial driver’s license (CDL).', bls: ooh('transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers'), pathway: 'credential' },

  { id: 'acct', name: 'Accountant', field: 'Business', codes: ['C', 'E', 'I'], what: 'Prepare and examine financial records and help people and businesses make money decisions.', entry: 'Bachelor’s degree in accounting or a related field; the CPA license opens more doors.', bls: ooh('business-and-financial/accountants-and-auditors'), pathway: 'back-to-school' },
  { id: 'pm', name: 'Project Management Specialist', field: 'Business', codes: ['E', 'C', 'S'], what: 'Coordinate the budget, schedule, people and details of projects.', entry: 'Bachelor’s degree is typical; certifications such as CAPM or PMP are valued.', bls: ooh('business-and-financial/project-management-specialists'), pathway: 'better-job' },
  { id: 'hr', name: 'Human Resources Specialist', field: 'Business', codes: ['S', 'E', 'C'], what: 'Recruit, interview and support employees, and handle pay, benefits and training.', entry: 'Bachelor’s degree is typical.', bls: ooh('business-and-financial/human-resources-specialists'), pathway: 'better-job' },
  { id: 'analyst', name: 'Management Analyst / Consultant', field: 'Business', codes: ['E', 'I', 'C'], what: 'Study how organizations work and recommend ways to improve them.', entry: 'Bachelor’s degree plus several years of relevant experience.', bls: ooh('business-and-financial/management-analysts'), pathway: 'start-business' },
  { id: 'realestate', name: 'Real Estate Agent', field: 'Business', codes: ['E', 'S', 'C'], what: 'Help clients buy, sell and rent properties.', entry: 'State-approved pre-licensing courses and a state license exam.', bls: ooh('sales/real-estate-brokers-and-sales-agents'), pathway: 'credential' },

  { id: 'teacher', name: 'Elementary School Teacher', field: 'Education & service', codes: ['S', 'A', 'C'], what: 'Teach foundational subjects and help children grow academically and socially.', entry: 'Bachelor’s degree and a state teaching license or certification for public schools.', bls: ooh('education-training-and-library/kindergarten-and-elementary-school-teachers'), pathway: 'back-to-school' },
  { id: 'sw', name: 'Social Worker', field: 'Education & service', codes: ['S', 'E', 'I'], what: 'Help individuals and families cope with challenges and connect to resources.', entry: 'Bachelor’s degree for many roles; clinical social work requires a master’s degree and license.', bls: ooh('community-and-social-service/social-workers'), pathway: 'back-to-school' },
  { id: 'paralegal', name: 'Paralegal', field: 'Education & service', codes: ['C', 'I', 'E'], what: 'Support lawyers by researching, organizing files and drafting documents.', entry: 'Associate degree or a certificate in paralegal studies is common.', bls: ooh('legal/paralegals-and-legal-assistants'), pathway: 'credential' },
  { id: 'police', name: 'Police Officer', field: 'Education & service', codes: ['R', 'S', 'E'], what: 'Protect lives and property, respond to calls and work with the community.', entry: 'High school diploma or college coursework, then a training academy; requirements vary by agency.', bls: ooh('protective-service/police-and-detectives'), pathway: 'credential' },

  { id: 'chef', name: 'Chef / Head Cook', field: 'Creative & other', codes: ['A', 'R', 'E'], what: 'Plan menus, lead kitchen staff and prepare food in restaurants and other settings.', entry: 'Work experience is the main route; culinary school or apprenticeship can help.', bls: ooh('food-preparation-and-serving/chefs-and-head-cooks'), pathway: 'credential' },
  { id: 'design', name: 'Graphic Designer', field: 'Creative & other', codes: ['A', 'E', 'R'], what: 'Create visual concepts for brands, advertising, websites and publications.', entry: 'Bachelor’s degree is common; a strong portfolio matters most.', bls: ooh('arts-and-design/graphic-designers'), pathway: 'career-change' },
]

export const FIELDS = ['Healthcare', 'Technology', 'Skilled trades', 'Business', 'Education & service', 'Creative & other'] as const

// Interest quiz: rate each statement 0 (not me) to 3 (very much me). Original items.
export const QUIZ: { id: string; code: Interest; text: string }[] = [
  { id: 'r1', code: 'R', text: 'I like fixing, building or working with my hands.' },
  { id: 'r2', code: 'R', text: 'I would rather be moving around than sitting at a desk.' },
  { id: 'i1', code: 'I', text: 'I enjoy figuring out why something happens.' },
  { id: 'i2', code: 'I', text: 'Science, health or technology topics pull me in.' },
  { id: 'a1', code: 'A', text: 'I like creating things that did not exist before.' },
  { id: 'a2', code: 'A', text: 'I notice design, words, music or style more than most people.' },
  { id: 's1', code: 'S', text: 'People come to me for help, care or advice.' },
  { id: 's2', code: 'S', text: 'I feel most useful when I am teaching or caring for someone.' },
  { id: 'e1', code: 'E', text: 'I like taking the lead and getting people on board.' },
  { id: 'e2', code: 'E', text: 'I get excited about starting things, selling or negotiating.' },
  { id: 'c1', code: 'C', text: 'I like clear steps, checklists and things in order.' },
  { id: 'c2', code: 'C', text: 'I am careful with details, numbers and records.' },
]

export function scoreQuiz(answers: Record<string, number>): Record<Interest, number> {
  const s: Record<Interest, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  for (const q of QUIZ) s[q.code] += answers[q.id] ?? 0
  return s
}

/** Match percentage: weighted overlap between a person's interest scores and a career's top three codes. */
export function matchCareer(scores: Record<Interest, number>, c: Career): number {
  const w = [0.5, 0.3, 0.2]
  let got = 0
  c.codes.forEach((code, i) => { got += (scores[code] / 6) * w[i] })
  return Math.round(got * 100)
}

export const SOURCES = [
  { name: 'BLS Occupational Outlook Handbook', use: 'Current pay, job outlook and how to enter each occupation', url: 'https://www.bls.gov/ooh/' },
  { name: 'O*NET / My Next Move', use: 'Detailed career profiles and a full interest assessment', url: 'https://www.mynextmove.org/' },
  { name: 'CareerOneStop', use: 'Training programs, credentials and local job centers', url: 'https://www.careeronestop.org/' },
  { name: 'College Scorecard', use: 'College costs, graduation rates and earnings by school', url: 'https://collegescorecard.ed.gov/' },
  { name: 'Federal Student Aid', use: 'FAFSA, grants and loan information', url: 'https://studentaid.gov/' },
  { name: 'NCSBN', use: 'Nursing licensure and state boards of nursing', url: 'https://www.ncsbn.org/' },
  { name: 'Apprenticeship.gov', use: 'Find registered, paid apprenticeships', url: 'https://www.apprenticeship.gov/' },
  { name: 'U.S. Small Business Administration', use: 'Planning, registering and funding a business', url: 'https://www.sba.gov/' },
]
