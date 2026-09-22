export const PROPOSAL_META = {
  title: 'China Business Trip Proposal 2026',
  subtitle:
    'Industry fair tech scouting + LRVTC campus review + Wuhan CRRC / rail ops (ECRL)',
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
    body: 'At LRVTC (Liuzhou), review campus facilities and training approaches; in Wuhan, deepen practical learning at CRRC Yangtze (car carrier wagons) and automotive rail day/night operations relevant to ECRL.',
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
      'At LRVTC and Wuhan: confirm and document railway / wagon ops processes relevant to our work',
    ],
  },
  {
    owner: 'DDE',
    items: [
      'Documented railway process observations mapped to ECRL context',
      'Notes from LRVTC facility review plus Wuhan CRRC and day/night rail ops',
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
  college: 'Liuzhou Railway Vocational & Technical College (LRVTC) + CRRC Yangtze Wuhan',
  blocks: [
    {
      days: '1.0 day',
      title: 'LRVTC campus & facility review',
      detail:
        'Campus tour; observe classroom and practical training; review facilities, equipment, syllabus, safety and competency development.',
    },
    {
      days: '1.0 day',
      title: 'CRRC Yangtze Wuhan',
      detail:
        'Car carrier wagon requirements for Perodua; inspect double-deck wagon configuration, loading/securing, and modification discussion.',
    },
    {
      days: '2.0 days',
      title: 'Automotive rail operations (day + night)',
      detail:
        'Daytime loading/unloading, lashing, ramp and workforce workflow; night observation with mandatory safety briefing.',
    },
  ],
  draftEmail: `Subject: Request for study visit — ITaLI & DDE (Malaysia) | Railway process learning related to ECRL

Dear LRVTC International / Training Office,

We represent a joint team from ITaLI and DDE (Malaysia). We respectfully request a study visit to Liuzhou Railway Vocational & Technical College to review campus facilities and training approaches relevant to the East Coast Rail Link (ECRL). Practical automotive rail observation is planned separately in Wuhan (CRRC Yangtze).

Proposed LRVTC programme (flexible to your advice):
1. Campus / facility review and training observation — 1 day
   (classroom & practical training observation; syllabus, equipment, safety arrangements)

Proposed group size: 6–8 participants (3 from ITaLI; 3–5 from DDE).
Preferred window: around our attendance at [CIIF 12–16 Oct 2026 / CIIE 5–10 Nov 2026] in Shanghai, or a dedicated Liuzhou+Wuhan window (exact dates subject to your availability).

We will cover our own travel, lodging, and insurance, and will follow all campus and site safety rules. Kindly advise available dates, any fees, language support, PPE requirements, and a point of contact.

Thank you for considering this request. We look forward to learning from your institution.

Respectfully,
[Name], ITaLI
on behalf of the ITaLI–DDE delegation

———
尊敬的柳州铁道职业技术学院相关负责人：
我们是马来西亚 ITaLI 与 DDE 联合代表团，希望赴贵校开展约 1 天的校园与培训设施观摩交流，并联系东海岸铁路（ECRL）背景；实操观摩拟另行安排在武汉。详情见上文英文函。谢谢！`,
}

export const LOGISTICS = [
  {
    title: 'Routing',
    items: [
      'Shanghai-first: KLIA → Shanghai (fair) → Liuzhou (LRVTC) → Wuhan (CRRC/ops) → KLIA via hub',
      'Liuzhou-first: KLIA → Liuzhou → Wuhan → Shanghai (fair) → KLIA',
      'No fair: KLIA → Liuzhou → Wuhan → KLIA via hub',
      'Liuzhou → Wuhan by high-speed rail (~5 hours); return flights from Wuhan (not Liuzhou)',
      'Book group seats early — 6–8 pax on the same sectors where possible',
    ],
  },
  {
    title: 'Visa & entry',
    items: [
      'Confirm China visa / visa-free eligibility for each passport held',
      'Carry invitation / fair registration / LRVTC / CRRC correspondence hard copies',
      'Allow buffer on first arrival day for immigration and transfers',
    ],
  },
  {
    title: 'Fair registration',
    items: [
      'CIIF: pre-register professional visitors via official channels before travel',
      'CIIE: buyer/visitor registration via ciie.org / official app as required',
      'Print badges / QR codes; carry passport copies daily',
    ],
  },
  {
    title: 'Risks & controls',
    items: [
      'Night rail observation: PPE, buddy system, host escort, opt-out without penalty',
      'Language: arrange interpreter or bilingual colleague for LRVTC / CRRC technical sessions',
      'Health: travel insurance covering all pax; shared emergency contact card',
      'Schedule: protect 1 buffer night on full-depth options against flight / HSR disruption',
    ],
  },
]

export const DEPTH_LABELS: Record<string, string> = {
  A: 'Protect tech (LZH+Wuhan)',
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
