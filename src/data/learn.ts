// Original practice questions written for CareerBridge Journey. They are study aids,
// not official exam items, and deliberately avoid medication dose calculations.

export interface Question {
  id: string
  topic: string
  q: string
  choices: string[]
  answer: number
  why: string
}

export const TOPICS = ['Anatomy & physiology', 'Infection control', 'Nursing fundamentals', 'Medical terminology', 'Study skills', 'Career readiness'] as const

export const QUESTIONS: Question[] = [
  { id: 'a1', topic: 'Anatomy & physiology', q: 'The left ventricle pumps blood primarily to which destination?', choices: ['The lungs', 'The body, through the aorta', 'The right atrium', 'The pulmonary veins'], answer: 1, why: 'The left ventricle ejects oxygenated blood into the aorta for circulation to the body. The right ventricle pumps to the lungs.' },
  { id: 'a2', topic: 'Anatomy & physiology', q: 'Where does gas exchange take place in the lungs?', choices: ['Trachea', 'Bronchi', 'Alveoli', 'Pleura'], answer: 2, why: 'Oxygen and carbon dioxide cross the thin walls of the alveoli into and out of the surrounding capillaries.' },
  { id: 'a3', topic: 'Anatomy & physiology', q: 'Which organ produces insulin?', choices: ['Liver', 'Pancreas', 'Kidney', 'Spleen'], answer: 1, why: 'Beta cells in the pancreas produce insulin, which helps move glucose from the blood into cells.' },
  { id: 'a4', topic: 'Anatomy & physiology', q: 'What is the main job of red blood cells?', choices: ['Fighting infection', 'Clotting blood', 'Carrying oxygen', 'Producing antibodies'], answer: 2, why: 'Red blood cells contain hemoglobin, which carries oxygen from the lungs to the tissues.' },
  { id: 'a5', topic: 'Anatomy & physiology', q: 'Which part of the nervous system includes the brain and spinal cord?', choices: ['Peripheral nervous system', 'Central nervous system', 'Autonomic nervous system', 'Somatic nervous system'], answer: 1, why: 'The central nervous system is the brain and spinal cord. The peripheral nervous system is the nerves outside them.' },
  { id: 'a6', topic: 'Anatomy & physiology', q: 'The kidneys help the body mainly by:', choices: ['Producing bile', 'Filtering blood and balancing fluid', 'Storing glucose', 'Making red blood cells directly'], answer: 1, why: 'Kidneys filter waste from the blood and regulate fluid and electrolyte balance, producing urine.' },

  { id: 'i1', topic: 'Infection control', q: 'What is the single most important way to prevent the spread of infection in healthcare settings?', choices: ['Wearing gloves at all times', 'Hand hygiene', 'Taking antibiotics', 'Wearing a gown'], answer: 1, why: 'Proper hand hygiene before and after patient contact is the foundation of infection prevention. Gloves do not replace it.' },
  { id: 'i2', topic: 'Infection control', q: 'Standard precautions should be used with:', choices: ['Only patients with a known infection', 'Only patients in isolation', 'Every patient, every time', 'Only patients who are coughing'], answer: 2, why: 'Standard precautions treat all blood and body fluids as potentially infectious, regardless of diagnosis.' },
  { id: 'i3', topic: 'Infection control', q: 'After removing gloves, you should:', choices: ['Put on a new pair right away', 'Perform hand hygiene', 'Rinse the gloves for reuse', 'Do nothing if the gloves were intact'], answer: 1, why: 'Hands can be contaminated during glove removal or through tiny defects, so hand hygiene always follows.' },
  { id: 'i4', topic: 'Infection control', q: 'When washing hands with soap and water, how long should you scrub?', choices: ['About 5 seconds', 'At least 20 seconds', 'Exactly 2 minutes', 'Until hands feel dry'], answer: 1, why: 'Public health guidance recommends scrubbing all hand surfaces for at least 20 seconds.' },
  { id: 'i5', topic: 'Infection control', q: 'Used needles should be:', choices: ['Recapped with two hands and thrown in the trash', 'Placed directly into a sharps container', 'Bent before disposal', 'Left on the bedside table for pickup'], answer: 1, why: 'Sharps go straight into a puncture-resistant sharps container without recapping, to prevent needlestick injuries.' },

  { id: 'f1', topic: 'Nursing fundamentals', q: 'Which set lists the four traditional vital signs?', choices: ['Height, weight, pulse, pain', 'Temperature, pulse, respirations, blood pressure', 'Pulse, oxygen, glucose, weight', 'Temperature, weight, reflexes, pulse'], answer: 1, why: 'Temperature, pulse, respirations and blood pressure are the classic vital signs. Oxygen saturation and pain are often assessed alongside them.' },
  { id: 'f2', topic: 'Nursing fundamentals', q: 'Before providing care, the best way to confirm a patient’s identity is to:', choices: ['Ask “Are you Mr. Lee?”', 'Check the room number', 'Use two identifiers, such as name and date of birth', 'Rely on recognizing the patient'], answer: 2, why: 'Two patient identifiers are a core safety practice. Room numbers and yes/no questions are not reliable.' },
  { id: 'f3', topic: 'Nursing fundamentals', q: 'A patient at risk for falls should have:', choices: ['The bed in the highest position', 'The call light within reach', 'All four side rails up at all times', 'Socks without grips'], answer: 1, why: 'Keeping the call light within reach, the bed low and the path clear are basic fall-prevention steps.' },
  { id: 'f4', topic: 'Nursing fundamentals', q: 'To help prevent pressure injuries in a patient who cannot move independently, you should:', choices: ['Reposition on a regular schedule', 'Keep the patient in one comfortable position', 'Massage reddened areas firmly', 'Limit fluids'], answer: 0, why: 'Regular repositioning relieves pressure on the skin. Reddened areas should not be massaged.' },
  { id: 'f5', topic: 'Nursing fundamentals', q: 'Protecting patient privacy means you should:', choices: ['Discuss patients only in the elevator', 'Share updates with any visitor who asks', 'Access and discuss information only as needed for care', 'Post about your day with initials only'], answer: 2, why: 'Patient information is shared only with those who need it for care. Public spaces and social media are never appropriate.' },
  { id: 'f6', topic: 'Nursing fundamentals', q: 'Good body mechanics when lifting include:', choices: ['Bending at the waist with straight legs', 'Keeping the load close and bending your knees', 'Twisting while lifting', 'Lifting quickly to finish sooner'], answer: 1, why: 'Bend your knees, keep the load close and avoid twisting. Use help or equipment when the load is heavy.' },

  { id: 't1', topic: 'Medical terminology', q: 'The suffix “-itis” means:', choices: ['Removal', 'Inflammation', 'Pain', 'Study of'], answer: 1, why: '“-itis” means inflammation, as in arthritis (inflammation of a joint).' },
  { id: 't2', topic: 'Medical terminology', q: 'The prefix “tachy-” means:', choices: ['Slow', 'Fast', 'Large', 'Below'], answer: 1, why: '“Tachy-” means fast, as in tachycardia (a fast heart rate). “Brady-” means slow.' },
  { id: 't3', topic: 'Medical terminology', q: 'The word root “hepat/o” refers to the:', choices: ['Heart', 'Kidney', 'Liver', 'Stomach'], answer: 2, why: '“Hepat/o” refers to the liver, as in hepatitis.' },
  { id: 't4', topic: 'Medical terminology', q: 'The abbreviation NPO means:', choices: ['Nothing by mouth', 'No pain observed', 'Normal post-operative', 'Needs physician order'], answer: 0, why: 'NPO comes from the Latin “nil per os,” meaning nothing by mouth.' },
  { id: 't5', topic: 'Medical terminology', q: 'The suffix “-ectomy” means:', choices: ['Looking into', 'Surgical removal', 'Making an opening', 'Abnormal condition'], answer: 1, why: '“-ectomy” means surgical removal, as in appendectomy.' },

  { id: 's1', topic: 'Study skills', q: 'Which technique best improves long-term recall?', choices: ['Rereading notes several times', 'Highlighting every key sentence', 'Testing yourself and spacing practice over days', 'Studying only the night before'], answer: 2, why: 'Active recall with spaced practice builds durable memory better than rereading or cramming.' },
  { id: 's2', topic: 'Study skills', q: 'You have 30 minutes after a long shift. The best use of that time is usually to:', choices: ['Skip it; 30 minutes is not enough', 'Do a short, focused review of one topic', 'Start a brand-new chapter', 'Reorganize your notes by color'], answer: 1, why: 'Short, focused, consistent sessions add up. One clear topic beats trying to cover everything.' },
  { id: 's3', topic: 'Study skills', q: 'After getting a practice question wrong, the most useful next step is to:', choices: ['Move on quickly', 'Memorize the correct letter', 'Understand why the right answer is right and yours was wrong', 'Stop studying that topic'], answer: 2, why: 'Reviewing the reasoning turns a wrong answer into learning you can use on a different question.' },
  { id: 's4', topic: 'Study skills', q: 'Which plan is most likely to work for a busy adult learner?', choices: ['Study whenever there is free time', 'Specific study blocks on the calendar each week', 'One long session every two weeks', 'Wait until motivation shows up'], answer: 1, why: 'Scheduled, specific study blocks protect the time and remove the daily decision.' },

  { id: 'c1', topic: 'Career readiness', q: 'In a STAR interview answer, the “R” stands for:', choices: ['Reason', 'Result', 'Role', 'Response'], answer: 1, why: 'STAR is Situation, Task, Action, Result. Always finish with what happened because of what you did.' },
  { id: 'c2', topic: 'Career readiness', q: 'Which resume bullet is strongest?', choices: ['Responsible for patient care', 'Hard worker and team player', 'Cared for 8 to 10 patients per shift and trained 4 new aides', 'Duties included various tasks'], answer: 2, why: 'Specific actions with numbers show your impact. Vague duties and adjectives do not.' },
  { id: 'c3', topic: 'Career readiness', q: 'Before choosing a college or training program, you should first verify its:', choices: ['Social media following', 'Accreditation or state approval', 'Campus size', 'Mascot'], answer: 1, why: 'Accreditation and state approval affect licensure eligibility, credit transfer and financial aid.' },
  { id: 'c4', topic: 'Career readiness', q: 'The best way to ask someone in your target field for help is to:', choices: ['Ask them for a job right away', 'Ask for 15 minutes of advice about their path', 'Send your resume with no message', 'Wait for them to contact you'], answer: 1, why: 'A short, specific request for advice is easy to say yes to and often leads to referrals later.' },
]

export interface Guide {
  id: string
  title: string
  minutes: number
  summary: string
  points: [string, string][]
  actions: string[]
  links?: [string, string][]
}

export const GUIDES: Guide[] = [
  {
    id: 'resume', title: 'A resume that gets interviews', minutes: 6,
    summary: 'Hiring managers skim. Make your value obvious in the top third of one page.',
    points: [
      ['Lead with a short summary', 'Two lines: who you are, what you do well and the role you want.'],
      ['Write results, not duties', 'Start each bullet with an action verb and add a number wherever you honestly can.'],
      ['Match the posting', 'Use the same words the job posting uses for skills you truly have.'],
      ['Keep it clean', 'One page for most people, one simple font, no photos, saved as a PDF.'],
    ],
    actions: ['List five results from my current or last role', 'Write a two-line summary', 'Tailor my resume to one real job posting', 'Ask one person to proofread it'],
  },
  {
    id: 'interview', title: 'Interview with confidence (STAR)', minutes: 7,
    summary: 'Most interview questions ask for a story. Prepare five and you can answer almost anything.',
    points: [
      ['Situation and Task', 'Set the scene in one or two sentences. What was happening and what was your responsibility?'],
      ['Action', 'What you did, step by step. Say “I,” not “we.”'],
      ['Result', 'What changed because of you. Use numbers or feedback if you have them.'],
      ['Prepare your questions', 'Ask about training, what success looks like in 90 days, and the team.'],
    ],
    actions: ['Write a STAR story about solving a problem', 'Write a STAR story about a difficult person', 'Write a STAR story about a mistake and what I learned', 'Practice out loud with a timer', 'Prepare three questions to ask the interviewer'],
  },
  {
    id: 'paying', title: 'Paying for school', minutes: 6,
    summary: 'Find free money first, then low-cost options, and borrow last.',
    points: [
      ['File the FAFSA early', 'It unlocks federal grants, work-study and loans, and many schools and states use it for their own aid.'],
      ['Ask your employer', 'Many employers, especially in healthcare, offer tuition assistance or reimbursement.'],
      ['Search scholarships locally', 'Community foundations, professional associations, unions and your school often have less competition.'],
      ['Compare net price', 'Look at what you will actually pay after grants, not the published tuition.'],
    ],
    actions: ['Create my FSA ID and file the FAFSA', 'Ask HR about tuition assistance', 'Apply for two scholarships', 'Run the net price calculator for my top school'],
    links: [['Federal Student Aid (FAFSA)', 'https://studentaid.gov/'], ['College Scorecard', 'https://collegescorecard.ed.gov/'], ['CareerOneStop scholarship search', 'https://www.careeronestop.org/toolkit/training/find-scholarships.aspx']],
  },
  {
    id: 'program', title: 'Choosing a program you can trust', minutes: 5,
    summary: 'The right program is approved, affordable and fits your life.',
    points: [
      ['Verify approval and accreditation yourself', 'Check the accreditor’s or state board’s own website. Do not rely on the school’s marketing.'],
      ['Ask about outcomes', 'Completion rate, licensure or certification pass rate, and job placement.'],
      ['Confirm credits transfer', 'Ask the school you might attend next whether they accept these credits.'],
      ['Get the full cost in writing', 'Tuition, fees, books, uniforms, testing and anything else.'],
    ],
    actions: ['Verify accreditation or state approval for my top program', 'Ask for pass rates and completion rates', 'Get a written cost breakdown', 'Talk to a current student or recent graduate'],
    links: [['ACEN accredited nursing programs', 'https://www.acenursing.org/search-programs'], ['CCNE accredited programs', 'https://www.aacnnursing.org/ccne-accreditation'], ['U.S. Dept. of Education accreditation database', 'https://ope.ed.gov/dapip/']],
  },
  {
    id: 'time', title: 'Making time when you have none', minutes: 5,
    summary: 'You do not need more hours. You need protected ones.',
    points: [
      ['Find your real hours', 'Track one normal week. Most people find three to six hours they can redirect.'],
      ['Schedule the blocks', 'Put them on the calendar with a specific task, like “Tue 8:30 pm: A&P chapter 4 questions.”'],
      ['Shrink the start', 'Commit to ten minutes. Starting is the hard part.'],
      ['Plan for bad weeks', 'Decide in advance what your minimum is, so one rough week does not become a lost month.'],
    ],
    actions: ['Track my time for one week', 'Schedule three study or action blocks', 'Tell someone at home about my schedule', 'Set my “minimum week” plan'],
  },
  {
    id: 'network', title: 'Networking without feeling awkward', minutes: 5,
    summary: 'Networking is asking good questions and staying in touch.',
    points: [
      ['Start with people you know', 'Coworkers, classmates, instructors, family friends and people from your community or congregation.'],
      ['Ask for advice, not a job', '“Could I ask you three questions about how you got into this field?”'],
      ['Follow up', 'Send a thank-you within a day and share what you did with their advice.'],
      ['Give back', 'Share opportunities, encourage others and celebrate their wins.'],
    ],
    actions: ['List ten people I could learn from', 'Send two advice requests this week', 'Post an encouragement or a win in a circle', 'Send one thank-you message'],
  },
  {
    id: 'business', title: 'Business basics before you spend money', minutes: 7,
    summary: 'Prove people will pay before you invest in logos, websites or inventory.',
    points: [
      ['Sell first', 'A pre-order, a deposit or a first paying client is stronger proof than any survey.'],
      ['Know your numbers', 'Price minus cost is your margin. Fixed monthly costs divided by margin is your break-even sales count.'],
      ['Keep business money separate', 'A separate account makes taxes and decisions far easier.'],
      ['Get free expert help', 'In the U.S., SCORE mentors and Small Business Development Centers offer free advising.'],
    ],
    actions: ['Describe my customer and their problem in two sentences', 'Calculate my break-even number', 'Get one paying customer or pre-order', 'Book a free mentoring session'],
    links: [['SBA: plan your business', 'https://www.sba.gov/business-guide/plan-your-business'], ['SCORE free mentoring', 'https://www.score.org/'], ['IRS: starting a business', 'https://www.irs.gov/businesses/small-businesses-self-employed/starting-a-business']],
  },
  {
    id: 'ai', title: 'Using AI at work, responsibly', minutes: 5,
    summary: 'AI is a capable assistant that still needs a careful supervisor: you.',
    points: [
      ['Give it context', 'Say who you are, what you need, who it is for and the format you want.'],
      ['Check everything', 'AI can state wrong facts confidently. Verify numbers, names, citations and clinical information.'],
      ['Protect private information', 'Never enter patient, customer or confidential employer details into public AI tools.'],
      ['Stay the author', 'You are responsible for anything you send or submit, whoever drafted it.'],
    ],
    actions: ['Use AI to draft one routine message, then edit it', 'Find and correct one AI mistake', 'Read my employer’s or school’s AI policy', 'Save one prompt that works well for me'],
  },
]
