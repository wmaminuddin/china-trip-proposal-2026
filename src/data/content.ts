export const PROPOSAL_META = {
  title: 'China Business Trip Proposal 2026',
  subtitle: 'Industry fair tech scouting + Liuzhou railway process learning (ECRL)',
  departments: 'ITaLI (3) · DDE (3–5) · Total 6–8 pax · Budget: ITaLI only',
  origin: 'KLIA → China → KLIA',
  recommendedId: 'C1',
}

export const OBJECTIVES = [
  {
    title: 'Technology scouting',
    body: 'Survey digital twin, robotics, sensors, and cross-field technologies applicable to logistics operations, with structured vendor notes and shortlists.',
  },
  {
    title: 'Railway process learning',
    body: 'At Liuzhou Railway Vocational & Technical College (LRVTC), study how China trains and operates railway processes relevant to ECRL — classroom, hands-on, and day/night shift observation.',
  },
  {
    title: 'Cross-department capability',
    body: 'ITaLI leads tech evaluation; DDE leads process/ops learning. Shared debrief produces one joint trip report and recommended next actions.',
  },
]

export const OUTCOMES = [
  {
    owner: 'ITaLI',
    items: [
      'Explore and evaluate new tech (digital twin, robotics, sensors, logistics-adjacent)',
      'Vendor contact list + capability notes (what solves which ops pain)',
      'At LRVTC: confirm and document railway operations processes relevant to our work',
    ],
  },
  {
    owner: 'DDE',
    items: [
      'Documented railway process observations mapped to ECRL context',
      'Notes from classroom, hands-on, and (where included) day/night shifts',
      'Training / SOP ideas transferable to local railway logistics workflows',
    ],
  },
  {
    owner: 'Joint',
    items: [
      'Deliver a joint trip report within 10 working days of return, with clear owners and next steps',
      'Present findings and recommended next actions to management',
      'Set up a Train-the-Trainer (TTT) module on ECRL-related railway operations processes',
    ],
  },
]

export const FAIR_FACTS = {
  CIIF: {
    name: 'China International Industry Fair 2026',
    dates: '12–16 October 2026',
    venue: 'National Exhibition and Convention Center (NECC), Shanghai',
    why: 'Strongest match for industrial robotics, automation, digital twin, and sensor technologies relevant to logistics.',
    url: 'https://www.ciif-expo.com/en',
  },
  CIIE: {
    name: 'China International Import Expo 2026',
    dates: '5–10 November 2026',
    venue: 'National Exhibition and Convention Center (NECC), Shanghai',
    why: 'Broader import/trade platform; useful for Intelligent Industry & IT and services-linked logistics offerings.',
    url: 'https://www.ciie.org/zbh/en/',
  },
}

export const TECH_CHECKLIST = [
  {
    theme: 'Digital twin',
    prompts: [
      'Yard / warehouse / terminal twin — real-time vs planning-only?',
      'Integration with WMS/TMS/railway systems?',
      'Data requirements, latency, and local deployment options?',
    ],
  },
  {
    theme: 'Robotics',
    prompts: [
      'AMR/AGV maturity for mixed human environments?',
      'Payload, aisle width, outdoor / rail-adjacent use?',
      'Maintenance model and local support in SEA?',
    ],
  },
  {
    theme: 'Sensors',
    prompts: [
      'Condition monitoring for assets, cargo, environment?',
      'Computer vision for safety / inventory / inspection?',
      'Edge vs cloud processing; cybersecurity posture?',
    ],
  },
  {
    theme: 'Cross-field / logistics-adjacent',
    prompts: [
      'Energy, materials, or industrial networks that unlock logistics efficiency?',
      'Partnership or import pathway (especially at CIIE)?',
      'Pilot cost band and reference customers?',
    ],
  },
]

export const LRVTC_AGENDA = {
  status: 'Not confirmed — proposed programme for host approval',
  college: 'Liuzhou Railway Vocational & Technical College (LRVTC)',
  blocks: [
    { days: '1.0 day', title: 'Classroom briefing', detail: 'China railway operations overview; ECRL-relevant process themes; instructor Q&A.' },
    { days: '1.0 day', title: 'Hands-on learning', detail: 'Labs / simulators / workshops as hosted by LRVTC.' },
    { days: '1.5 days', title: 'Day & night shift learning', detail: 'Supervised day observation plus night-shift learning with mandatory safety briefing.' },
  ],
  draftEmail: `Subject: Request for study visit — ITaLI & DDE (Malaysia) | Railway process learning related to ECRL

Dear LRVTC International / Training Office,

We represent a joint team from ITaLI and DDE (Malaysia). We respectfully request a study visit to Liuzhou Railway Vocational & Technical College to learn how China approaches railway operations training and processes, with relevance to the East Coast Rail Link (ECRL).

Proposed programme (flexible to your advice):
1. Classroom briefing — 1 day
2. Hands-on / laboratory learning — 1 day
3. Day and night shift supervised learning — 1.5 days

Proposed group size: 6–8 participants (3 from ITaLI; 3–5 from DDE).
Preferred window: immediately after our attendance at [CIIF 12–16 Oct 2026 / CIIE 5–10 Nov 2026] in Shanghai (exact dates subject to your availability).

We will cover our own travel, lodging, and insurance, and will follow all campus and site safety rules. Kindly advise available dates, any fees, language support, PPE requirements, and a point of contact.

Thank you for considering this request. We look forward to learning from your institution.

Respectfully,
[Name], ITaLI
on behalf of the ITaLI–DDE delegation

———
尊敬的柳州铁道职业技术学院相关负责人：
我们是马来西亚 ITaLI 与 DDE 联合代表团，希望赴贵校开展铁路运营与培训相关学习交流，并联系东海岸铁路（ECRL）背景。恳请协助安排约 3.5 天的课堂、实训及日/夜班观摩学习。详情见上文英文函。谢谢！`,
}

export const LOGISTICS = [
  {
    title: 'Routing',
    items: [
      'Shanghai-first: KLIA → PVG → LZH → (PVG or CAN) → KLIA',
      'Liuzhou-first: KLIA → LZH (via CAN or PVG) → PVG (fair) → KLIA',
      'Liuzhou-only: KLIA → LZH (via CAN or PVG) → KLIA — no Shanghai fair',
      'Book group seats early — 6–8 pax on the same sectors where possible',
    ],
  },
  {
    title: 'Visa & entry',
    items: [
      'Confirm China visa / visa-free eligibility for each passport held',
      'Carry invitation / fair registration / LRVTC correspondence hard copies',
      'Allow buffer on first arrival day for immigration and transfers',
    ],
  },
  {
    title: 'Fair registration',
    items: [
      'CIIF: pre-register professional visitors via official channels before travel',
      'CIIE: buyer/visitor registration via ciie.org / official app as required',
      'Assign one admin owner for badges and group meeting point at NECC',
    ],
  },
  {
    title: 'Hotels & local transport',
    items: [
      'Shanghai: hotel near NECC / metro for exhibition days',
      'Liuzhou: hotel near LRVTC or with reliable van transfer',
      'Prefer pre-booked airport vans for group moves; DiDi as backup',
    ],
  },
  {
    title: 'Risks & controls',
    items: [
      'Night-shift learning: PPE, buddy system, host escort, opt-out without penalty',
      'Language: arrange interpreter or bilingual colleague for LRVTC technical sessions',
      'Health: travel insurance covering all pax; shared emergency contact card',
      'Schedule: protect 1 buffer night on full-depth options against flight disruption',
    ],
  },
]

export const DEPTH_LABELS: Record<string, string> = {
  A: 'Protect Liuzhou',
  B: 'Protect Fair',
  C: 'Full Depth',
}

export const NAV_ITEMS = [
  { id: 'summary', label: 'Summary' },
  { id: 'package', label: 'Package' },
  { id: 'options', label: 'Options' },
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'budget', label: 'Budget' },
  { id: 'lrvtc', label: 'LRVTC' },
  { id: 'admin', label: 'Admin' },
] as const

