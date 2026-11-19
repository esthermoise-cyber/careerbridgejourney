export type Phase = 'Explore' | 'Learn' | 'Prepare' | 'Advance'
export const PHASES: Phase[] = ['Explore', 'Learn', 'Prepare', 'Advance']

export type Track = 'healthcare' | 'careers' | 'business'

export interface Pathway {
  id: string
  track: Track
  name: string
  blurb: string
  /** Honest planning range, not a promise. */
  typical: string
  /** Weekly hours most people need to keep steady momentum. */
  hours: number
  steps: Record<Phase, [string, string][]>
}

export const TRACKS: { id: Track; name: string; blurb: string }[] = [
  { id: 'healthcare', name: 'Healthcare & Nursing', blurb: 'Nurse Pathway: CNA, LVN/LPN, RN, BSN and allied health.' },
  { id: 'careers', name: 'Careers & Education', blurb: 'Change careers, earn a credential, go back to school or move up.' },
  { id: 'business', name: 'Business & Future Skills', blurb: 'Start or grow a business and build AI-ready skills.' },
]

export const PATHWAYS: Pathway[] = [
  {
    id: 'explore-nursing', track: 'healthcare', name: 'Explore Nursing',
    blurb: 'Not sure which nursing role fits? Compare CNA, LVN/LPN and RN before you commit.',
    typical: 'About 4–8 weeks of exploring', hours: 3,
    steps: {
      Explore: [
        ['Compare nursing roles', 'Read what CNAs, LVN/LPNs and RNs actually do day to day, and where they work.'],
        ['Talk to a working nurse', 'Ask one nurse what they love, what is hard, and what they wish they had known.'],
        ['Write down your why', 'One or two sentences on why nursing matters to you. You will come back to this.'],
      ],
      Learn: [
        ['Learn the education routes', 'Certificate (CNA), diploma/certificate (LVN/LPN), associate degree (ADN) and bachelor’s degree (BSN).'],
        ['Find your state board of nursing', 'Bookmark your board’s website. It is the official source for approved programs and licensing rules.'],
        ['Check programs near you', 'List two or three state-approved programs and note their accreditation (ACEN or CCNE for RN programs).'],
      ],
      Prepare: [
        ['Take stock of your time and money', 'Estimate weekly hours you can protect, and what you can afford. Complete the FAFSA if you are in the U.S.'],
        ['Gather your transcripts', 'Request high school and any college transcripts so you know which credits may count.'],
        ['Try a first step', 'Shadow, volunteer, or take a CPR/BLS class to see how healthcare feels in person.'],
      ],
      Advance: [
        ['Choose your starting route', 'Pick the route that fits your life right now. You can always bridge upward later.'],
        ['Set a start date goal', 'Choose a realistic application or enrollment date and add it to your goals.'],
      ],
    },
  },
  {
    id: 'become-cna', track: 'healthcare', name: 'Become a CNA',
    blurb: 'The fastest way into patient care. Train, pass your state competency exam and get on the registry.',
    typical: 'Often 4–12 weeks of training, depending on your state and program', hours: 8,
    steps: {
      Explore: [
        ['Understand the CNA role', 'CNAs help patients with daily care under nurse supervision. It is physical, people-centered work.'],
        ['Check your state’s requirements', 'Training hours and exam rules vary by state. Look them up on your state nurse aide registry.'],
      ],
      Learn: [
        ['Find a state-approved program', 'Community colleges, vocational schools, the Red Cross and some employers offer approved training.'],
        ['Ask about employer-paid training', 'Some nursing homes and hospitals pay for CNA training if you agree to work there.'],
        ['Enroll and plan your schedule', 'Block class, clinical and study time around work and family.'],
      ],
      Prepare: [
        ['Complete class and clinical hours', 'Attend every session. Clinical hours are required to sit for the exam.'],
        ['Practice the skills checklist', 'Rehearse hands-on skills such as handwashing, vital signs and safe transfers until they are automatic.'],
        ['Schedule your competency exam', 'Register for the written (or oral) and skills exam through your state’s testing provider.'],
      ],
      Advance: [
        ['Pass the exam and confirm your registry listing', 'Verify that you appear on your state nurse aide registry.'],
        ['Apply for CNA positions', 'Update your resume and apply. Ask about shift options and tuition help for future nursing school.'],
        ['Plan your next bridge', 'If nursing school is your goal, start the “CNA to Nursing” pathway next.'],
      ],
    },
  },
  {
    id: 'cna-to-nursing', track: 'healthcare', name: 'CNA to Nursing',
    blurb: 'Turn your patient-care experience into an LVN/LPN or RN license.',
    typical: 'About 1–2 years for LVN/LPN, 2–4 years for RN, plus any prerequisites', hours: 12,
    steps: {
      Explore: [
        ['Choose your target: LVN/LPN or RN', 'CNA experience is valuable, but it does not replace formal nursing-program requirements.'],
        ['Audit the credits you already have', 'List English, math and science courses you have completed and when.'],
        ['Shortlist approved programs', 'Use your state board of nursing’s approved-program list. Save three options.'],
      ],
      Learn: [
        ['Verify prerequisites with each school', 'Confirm required courses, GPA rules, how old science credits can be, and TEAS or HESI policies.'],
        ['Complete missing prerequisites', 'Anatomy & physiology, microbiology, English and math are common. Take them where credits transfer.'],
        ['Prepare for the entrance exam', 'Take a practice TEAS or HESI and study your weakest areas first.'],
      ],
      Prepare: [
        ['Build your funding plan', 'File the FAFSA, ask your employer about tuition assistance, and search for nursing scholarships.'],
        ['Complete applications', 'Track transcripts, test scores, immunizations, background check and deadlines for each school.'],
        ['Plan work around school', 'Talk to your manager early about per-diem, weekend or reduced schedules during clinicals.'],
      ],
      Advance: [
        ['Start and finish your program', 'Track each term, clinical rotation and requirement as milestones.'],
        ['Apply for licensure', 'Apply to your state board and register for the NCLEX-PN or NCLEX-RN.'],
        ['Pass the NCLEX and start your nursing role', 'Use a structured review plan in the weeks before your exam.'],
      ],
    },
  },
  {
    id: 'lvn-to-rn', track: 'healthcare', name: 'LVN/LPN to RN',
    blurb: 'Bridge from practical/vocational nursing to registered nursing.',
    typical: 'Bridge programs often take about 1–2 years after prerequisites', hours: 14,
    steps: {
      Explore: [
        ['Find eligible bridge programs', 'Compare LVN/LPN-to-ADN and LVN/LPN-to-BSN options approved by your state board.'],
        ['Check bridge eligibility', 'Verify license status, required work experience, prerequisites and credit for prior learning.'],
      ],
      Learn: [
        ['Request a transcript evaluation', 'Ask each school which of your credits transfer and what remains.'],
        ['Finish remaining prerequisites', 'Complete outstanding science and general-education courses.'],
        ['Compare schedules and total cost', 'Look at clinical schedules, tuition, fees, books and commute, not just the sticker price.'],
      ],
      Prepare: [
        ['Prepare application materials', 'Track entrance testing, transcripts, references and submission dates.'],
        ['Line up funding', 'FAFSA, employer tuition benefits, scholarships and payment plans.'],
        ['Arrange your work schedule', 'Plan shifts around class and clinical days before the term starts.'],
      ],
      Advance: [
        ['Complete RN coursework and clinicals', 'Monitor required courses, rotations and program milestones.'],
        ['Apply for RN licensure', 'Follow your board’s requirements and register for the NCLEX-RN.'],
        ['Pass the NCLEX-RN and transition to an RN role', 'Ask your employer about RN transition or residency programs.'],
      ],
    },
  },
  {
    id: 'rn-to-bsn', track: 'healthcare', name: 'RN to BSN',
    blurb: 'Earn your bachelor’s degree while you keep working your shifts.',
    typical: 'Commonly about 12–24 months part-time, depending on transfer credits', hours: 10,
    steps: {
      Explore: [
        ['Select an RN-to-BSN format', 'Identify online, hybrid or local programs that fit a shift-work schedule.'],
        ['Confirm accreditation', 'Check that the nursing program is accredited by CCNE or ACEN.'],
      ],
      Learn: [
        ['Request degree audits', 'Ask two or three schools to evaluate your ADN and general-education credits.'],
        ['Compare total cost', 'Include tuition, fees and any remaining general-education courses.'],
        ['Ask about employer tuition support', 'Find out what your employer pays, any annual cap, and any work commitment attached.'],
      ],
      Prepare: [
        ['Plan around your shifts', 'Build realistic weekly study blocks and account for rotating schedules.'],
        ['Apply and enroll', 'Submit applications, transcripts and license verification before the deadline.'],
        ['Set up your study system', 'Choose where and when you study, and tell the people who need to know.'],
      ],
      Advance: [
        ['Complete BSN courses', 'Track each course as you finish it.'],
        ['Finish your capstone or practicum', 'Plan this early. It often needs a preceptor or project site.'],
        ['Graduate and update your credentials', 'Update your resume, employer file and professional profiles.'],
        ['Choose your next growth goal', 'Leadership, specialty certification, education or graduate study.'],
      ],
    },
  },
  {
    id: 'allied-health', track: 'healthcare', name: 'Other Healthcare Careers',
    blurb: 'Allied health, health tech and healthcare administration, from medical assistant to sonographer.',
    typical: 'Certificates can take under a year; associate degrees about two years', hours: 8,
    steps: {
      Explore: [
        ['Take the career match quiz', 'See which healthcare roles match your interests, then save your top three.'],
        ['Compare roles side by side', 'Look at patient contact, schedule, physical demands and training length.'],
        ['Talk to someone in the role', 'Ask a working professional what a normal week looks like.'],
      ],
      Learn: [
        ['Find accredited programs', 'Many allied health fields have a specific accreditor (for example CAAHEP or JRCERT). Verify before enrolling.'],
        ['Understand certification and licensing', 'Find out which credential employers in your state expect and who issues it.'],
        ['Check prerequisites and costs', 'Note required courses, total cost and financial aid options.'],
      ],
      Prepare: [
        ['Apply and enroll', 'Track application materials and deadlines.'],
        ['Complete coursework and clinical training', 'Keep a simple log of hours and competencies.'],
        ['Prepare for your certification exam', 'Use the exam blueprint from the certifying body to guide your study plan.'],
      ],
      Advance: [
        ['Earn your credential', 'Pass your exam and complete any state registration.'],
        ['Launch your job search', 'Target employers, tailor your resume and practice interviews.'],
      ],
    },
  },
  {
    id: 'career-discovery', track: 'careers', name: 'Find My Direction',
    blurb: 'Not sure what is next? Get clear on your strengths and choose a direction worth pursuing.',
    typical: 'About 3–6 weeks of focused exploring', hours: 3,
    steps: {
      Explore: [
        ['Take the career match quiz', 'Five minutes to see which kinds of work fit your interests.'],
        ['List your strengths and must-haves', 'What are you good at? What do you need (schedule, pay floor, location)?'],
        ['Save three careers to look into', 'Use Explore Careers and save the ones that make you curious.'],
      ],
      Learn: [
        ['Research each saved career', 'Check typical duties, training and current pay and outlook from the Bureau of Labor Statistics.'],
        ['Have two real conversations', 'Talk with people doing the work. Ask how they got in.'],
        ['Try it in a small way', 'A free class, a volunteer shift, a short project or a job shadow.'],
      ],
      Prepare: [
        ['Choose one direction', 'Pick the option with the best mix of interest, fit and realistic entry.'],
        ['Map the entry requirements', 'Write down the training, credential or experience you need to get hired.'],
      ],
      Advance: [
        ['Start your next pathway', 'Switch to the pathway that matches your choice and build your plan.'],
      ],
    },
  },
  {
    id: 'career-change', track: 'careers', name: 'Change Careers',
    blurb: 'Move into a new field without starting from zero.',
    typical: 'Often 6–18 months, depending on the training gap', hours: 8,
    steps: {
      Explore: [
        ['Name your target role', 'Be specific: a job title you could search for today.'],
        ['Study ten real job postings', 'Highlight the skills, tools and credentials that repeat.'],
        ['List your transferable skills', 'Match what you already do to what the postings ask for.'],
      ],
      Learn: [
        ['Identify your gaps', 'Pick the two or three gaps that matter most to employers.'],
        ['Choose how to close them', 'Certificate, course, apprenticeship, degree or a hands-on project. Compare cost and time.'],
        ['Start learning', 'Enroll, schedule study blocks and track completion.'],
      ],
      Prepare: [
        ['Build proof', 'Create something you can show: a project, portfolio, volunteer work or a credential.'],
        ['Rewrite your resume for the new field', 'Lead with relevant skills and results, not your old job titles.'],
        ['Grow your network in the field', 'Reach out to five people. Ask for advice, not a job.'],
      ],
      Advance: [
        ['Apply with intention', 'Set a weekly number of tailored applications and track every one.'],
        ['Practice interviews', 'Prepare your “why I am changing careers” story and five STAR examples.'],
        ['Evaluate and accept an offer', 'Compare pay, growth, schedule and benefits before you decide.'],
      ],
    },
  },
  {
    id: 'credential', track: 'careers', name: 'Earn a Certification or Trade',
    blurb: 'Skilled trades, apprenticeships and industry certifications that lead straight to work.',
    typical: 'Certifications: weeks to months. Apprenticeships: commonly 1–5 years, paid', hours: 8,
    steps: {
      Explore: [
        ['Pick the credential or trade', 'Choose one that shows up in job postings where you want to work.'],
        ['Verify it is recognized', 'Confirm who issues it and that local employers or your state licensing board accept it.'],
      ],
      Learn: [
        ['Compare training options', 'Community college, union or employer apprenticeship, trade school or self-study.'],
        ['Check costs and funding', 'Ask about grants, workforce programs (American Job Centers in the U.S.) and paid apprenticeships.'],
        ['Enroll or apply', 'Submit your application and note your start date.'],
      ],
      Prepare: [
        ['Complete your training hours', 'Track classroom and on-the-job hours as you go.'],
        ['Study for the exam', 'Use the official exam outline and take timed practice tests.'],
        ['Schedule and pass the exam', 'Book the date. A deadline keeps you moving.'],
      ],
      Advance: [
        ['Complete licensing or registration', 'Finish any state or local requirements.'],
        ['Update your resume and apply', 'Add the credential at the top and target employers who require it.'],
        ['Plan your next level', 'Journey-level, master license, specialty or supervisor.'],
      ],
    },
  },
  {
    id: 'back-to-school', track: 'careers', name: 'Go Back to School',
    blurb: 'Start or finish a degree as a working adult.',
    typical: 'Associate: about 2 years full-time. Bachelor’s: about 4, less with transfer credits', hours: 12,
    steps: {
      Explore: [
        ['Decide what the degree is for', 'Name the job or goal it unlocks so you choose the right program.'],
        ['Shortlist three schools', 'Compare format (online, evening, hybrid), support for adult learners and graduation outcomes.'],
        ['Check accreditation', 'Confirm the school is accredited by a recognized accreditor.'],
      ],
      Learn: [
        ['Request transcript evaluations', 'Find out how many of your past credits transfer before you commit.'],
        ['File the FAFSA', 'Do this early at studentaid.gov, even if you think you will not qualify.'],
        ['Compare your real cost', 'Use each school’s net price calculator and include fees, books and commute.'],
      ],
      Prepare: [
        ['Apply', 'Track essays, transcripts, test requirements and deadlines.'],
        ['Meet an academic advisor', 'Map out your full course sequence and expected graduation term.'],
        ['Build your support plan', 'Childcare, work schedule, study space and who you will call when it gets hard.'],
      ],
      Advance: [
        ['Complete your first term', 'Start with a manageable load and learn your rhythm.'],
        ['Track progress each term', 'Add each term as a milestone and celebrate it.'],
        ['Graduate and put the degree to work', 'Update your resume and pursue the role you named at the start.'],
      ],
    },
  },
  {
    id: 'better-job', track: 'careers', name: 'Land a Better Job or Promotion',
    blurb: 'Raise your income and responsibility with the skills you already have.',
    typical: 'Often 2–6 months of consistent effort', hours: 5,
    steps: {
      Explore: [
        ['Define “better”', 'Pay, schedule, growth, respect, location. Rank what matters most.'],
        ['Research the market', 'Check current pay ranges for your role and area on BLS and job boards.'],
        ['Pick your target roles', 'Two or three titles, inside or outside your current employer.'],
      ],
      Learn: [
        ['Close one skill gap', 'Choose the single skill that would most raise your value and start learning it.'],
        ['Collect your results', 'Write down numbers and outcomes from your work: money saved, people helped, problems solved.'],
      ],
      Prepare: [
        ['Upgrade your resume', 'One page of results, tailored to the target role.'],
        ['Refresh your professional profile', 'Update LinkedIn or your industry profile with a clear headline.'],
        ['Practice interview stories', 'Prepare five STAR stories and your salary range.'],
      ],
      Advance: [
        ['Apply or ask', 'Send tailored applications weekly, or request a promotion conversation with your manager.'],
        ['Negotiate', 'Know your number, your walk-away point and what else matters (schedule, training, title).'],
        ['Start strong', 'Set 30-, 60- and 90-day goals in the new role.'],
      ],
    },
  },
  {
    id: 'start-business', track: 'business', name: 'Start a Business',
    blurb: 'Take an idea from a notebook to your first paying customers.',
    typical: 'Many people reach a first sale in 1–6 months; building steady income takes longer', hours: 8,
    steps: {
      Explore: [
        ['Define the problem you solve', 'Who has the problem, how do they solve it now, and why is that not good enough?'],
        ['Talk to ten potential customers', 'Listen more than you pitch. Ask what they would pay for.'],
        ['Study three competitors', 'Note their prices, strengths and the gap you could fill.'],
      ],
      Learn: [
        ['Write a one-page plan', 'Customer, offer, price, how you reach people, startup costs and first-year goal.'],
        ['Work out your numbers', 'Startup cost, monthly expenses, price and how many sales you need to break even.'],
        ['Learn the rules for your business', 'Check licenses, permits and insurance for your industry and location (in the U.S., start at sba.gov).'],
      ],
      Prepare: [
        ['Choose a structure and register', 'Sole proprietorship, LLC or corporation. Consider talking with an accountant or a free SCORE mentor.'],
        ['Separate your money', 'Open a business bank account and set up simple bookkeeping.'],
        ['Create a simple offer and presence', 'A clear offer, a price, and one place customers can find and pay you.'],
      ],
      Advance: [
        ['Make your first sale', 'Sell to one real customer before you perfect anything.'],
        ['Ask for feedback and referrals', 'Improve the offer using what your first customers tell you.'],
        ['Build a repeatable way to find customers', 'Pick one channel and work it every week.'],
        ['Set your next revenue milestone', 'Choose a monthly revenue goal and the actions that drive it.'],
      ],
    },
  },
  {
    id: 'ai-skills', track: 'business', name: 'Build AI & Digital Skills',
    blurb: 'Use AI tools responsibly to work smarter and stay in demand.',
    typical: 'About 4–10 weeks to become confidently productive', hours: 4,
    steps: {
      Explore: [
        ['Pick one task to improve', 'Choose a repetitive task from your real work: emails, notes, summaries, schedules.'],
        ['Learn what AI can and cannot do', 'AI tools can draft, summarize and brainstorm. They can also be confidently wrong.'],
      ],
      Learn: [
        ['Learn to write clear prompts', 'Give context, the goal, the format you want and an example.'],
        ['Practice checking the output', 'Verify facts, numbers and sources before you rely on anything.'],
        ['Learn the privacy rules', 'Never paste patient, customer or confidential employer information into public AI tools.'],
      ],
      Prepare: [
        ['Build one useful workflow', 'Create a repeatable prompt or template that saves you time every week.'],
        ['Measure the time saved', 'Track before and after so you can show the result.'],
        ['Check your employer’s AI policy', 'Know what is allowed before you use AI on the job.'],
      ],
      Advance: [
        ['Add the skill to your resume', 'Describe what you did and the result, not just the tool name.'],
        ['Teach one coworker', 'Teaching is the fastest way to deepen a skill and get noticed.'],
        ['Choose a next course or credential', 'Pick structured training that matches your field.'],
      ],
    },
  },
]

export const pathwayById = (id: string) => PATHWAYS.find(p => p.id === id)
