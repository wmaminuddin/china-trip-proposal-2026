export type FairId = 'CIIF' | 'CIIE' | 'NONE'
export type DepthId = 'A' | 'B' | 'C'
export type RouteOrder = 'shanghai-first' | 'liuzhou-first' | 'liuzhou-only'
export type DayKind =
  | 'travel'
  | 'fair'
  | 'transfer'
  | 'LRVTC'
  | 'site'
  | 'ops'
  | 'buffer'
  | 'debrief'

export interface ItineraryDay {
  dayIndex: number
  dateLabel: string
  title: string
  kind: DayKind
  location: string
  blocks: string[]
}

export interface CostAssumptions {
  intlFlightPerPax: number
  domesticFlightsPerPax: number
  hotelShanghaiPerNight: number
  hotelLiuzhouPerNight: number
  hotelWuhanPerNight: number
  shanghaiNights: number
  liuzhouNights: number
  wuhanNights: number
  fairFeesPerPax: number
  localTransportPerDay: number
  mealsPerDay: number
  contingencyRate: number
}

export interface TripOption {
  id: string
  fair: FairId
  depth: DepthId
  routeOrder: RouteOrder
  name: string
  tagline: string
  recommended?: boolean
  durationDays: number
  durationLabel: string
  fairDays: number
  LRVTCDays: number
  wuhanDays: number
  LRVTCMode: 'full' | 'compressed'
  windowLabel: string
  highlights: string[]
  tradeoffs: string[]
  days: ItineraryDay[]
  costs: CostAssumptions
}

type DayDraft = Omit<ItineraryDay, 'dayIndex'>

function withIndices(days: DayDraft[]): ItineraryDay[] {
  return days.map((d, i) => ({ ...d, dayIndex: i }))
}

/** LRVTC campus day — facility / training review (practical ops move to Wuhan). */
const LRVTCCampusBlocks = [
  'Overview of LRVTC campus and facility tour',
  'Observe classroom and practical training activities',
  'Review training facilities, equipment and learning environment',
  'Discuss trainer development, training syllabus and schedule',
  'Review practical training areas, wagon positioning, and safety arrangements',
  'Discuss training materials and competency development',
]

const WuhanCrrcBlocks = [
  'Discuss car carrier wagon requirements for PERODUA',
  'Inspect the double deck car carrier wagon',
  'Review wagon configuration and technical features',
  'Discuss potential modifications for Perodua requirements',
  'Discuss relevant technical information and specifications',
  'Review vehicle loading and securing arrangements',
]

const WuhanDayOpsBlocks = [
  'Observe actual vehicle loading and unloading activities',
  'Review vehicle securing and lashing process',
  'Observe mobile ramp and equipment utilization',
  'Review workforce deployment and operational workflow',
  'Observe safety practices, traffic flow and operational controls',
]

const WuhanNightOpsBlocks = [
  'Night observation of automotive rail operations (safety briefing mandatory)',
  'Compare night vs daytime loading / securing practices',
  'Capture notes for ECRL-relevant SOP ideas',
]

const WuhanWrapBlocks = [
  'Review key findings from LRVTC and CRRC Yangtze engagements',
  'Group discussion and knowledge sharing',
  'Identify follow-up actions and training development requirements',
  'Agree key points for further engagement',
]

const fairFocusCiif = [
  'Priority halls: Robotics, Industrial Automation, Industrial Communication & IT',
  'Scout: digital twin platforms, AGV/AMR, warehouse sensors, predictive maintenance',
  'Collect vendor contacts + capability notes for logistics use cases',
]

const fairFocusCiie = [
  'Priority areas: Intelligent Industry & Information Technology; Trade in Services',
  'Scout: importable logistics tech, sensors, digital twin / software platforms',
  'Note trade/partnership pathways relevant to Malaysia–China logistics',
]

/** Full tech engagement after arrival in Liuzhou: LRVTC → HSR → CRRC → day → night → wrap */
function fullTechDays(dates: {
  lrvtc: string
  hsr: string
  crrc: string
  dayOps: string
  nightOps: string
  wrap: string
}): DayDraft[] {
  return [
    {
      dateLabel: dates.lrvtc,
      title: 'LRVTC — training & facility review',
      kind: 'LRVTC',
      location: 'LRVTC · Liuzhou',
      blocks: LRVTCCampusBlocks,
    },
    {
      dateLabel: dates.hsr,
      title: 'Travel Liuzhou → Wuhan',
      kind: 'transfer',
      location: 'LZH → Wuhan (HSR)',
      blocks: [
        'High-speed train Liuzhou → Wuhan (~5 hours)',
        'Hotel check-in Wuhan; confirm CRRC Yangtze visit logistics',
      ],
    },
    {
      dateLabel: dates.crrc,
      title: 'CRRC Yangtze Wuhan',
      kind: 'site',
      location: 'CRRC Yangtze · Wuhan',
      blocks: WuhanCrrcBlocks,
    },
    {
      dateLabel: dates.dayOps,
      title: 'Automotive rail ops — daytime',
      kind: 'ops',
      location: 'Wuhan rail / automotive loading site',
      blocks: WuhanDayOpsBlocks,
    },
    {
      dateLabel: dates.nightOps,
      title: 'Automotive rail ops — night',
      kind: 'ops',
      location: 'Wuhan rail / automotive loading site',
      blocks: WuhanNightOpsBlocks,
    },
    {
      dateLabel: dates.wrap,
      title: 'Review and wrap-up',
      kind: 'debrief',
      location: 'Wuhan',
      blocks: WuhanWrapBlocks,
    },
  ]
}

/** Compressed tech: LRVTC + HSR + CRRC + one ops day (night omitted; wrap on departure). */
function compressedTechDays(dates: {
  lrvtc: string
  hsr: string
  crrc: string
  ops: string
}): DayDraft[] {
  return [
    {
      dateLabel: dates.lrvtc,
      title: 'LRVTC — training & facility review',
      kind: 'LRVTC',
      location: 'LRVTC · Liuzhou',
      blocks: LRVTCCampusBlocks,
    },
    {
      dateLabel: dates.hsr,
      title: 'Travel Liuzhou → Wuhan',
      kind: 'transfer',
      location: 'LZH → Wuhan (HSR)',
      blocks: [
        'High-speed train Liuzhou → Wuhan (~5 hours)',
        'Hotel check-in Wuhan; confirm CRRC visit logistics',
      ],
    },
    {
      dateLabel: dates.crrc,
      title: 'CRRC Yangtze Wuhan',
      kind: 'site',
      location: 'CRRC Yangtze · Wuhan',
      blocks: WuhanCrrcBlocks,
    },
    {
      dateLabel: dates.ops,
      title: 'Automotive rail ops — daytime',
      kind: 'ops',
      location: 'Wuhan rail / automotive loading site',
      blocks: [
        ...WuhanDayOpsBlocks,
        'Night observation omitted in this compressed option',
      ],
    },
  ]
}

const baseLodging = {
  hotelShanghaiPerNight: 450,
  hotelLiuzhouPerNight: 280,
  hotelWuhanPerNight: 320,
}

function buildCiifA(): TripOption {
  return {
    id: 'A1',
    fair: 'CIIF',
    depth: 'A',
    routeOrder: 'shanghai-first',
    name: 'A1 · CIIF + Protect tech (LZH+Wuhan)',
    tagline: 'Compressed fair, then full LRVTC campus day + Wuhan CRRC / rail ops.',
    durationDays: 12,
    durationLabel: '~11–12 days',
    fairDays: 1.5,
    LRVTCDays: 1,
    wuhanDays: 4,
    LRVTCMode: 'full',
    windowLabel: '11–22 Oct 2026 (CIIF then LZH+Wuhan)',
    highlights: [
      'Full Wuhan practical block (CRRC + day/night rail ops)',
      'Dedicated LRVTC campus / facility review day',
      'Best when ECRL + wagon ops learning is the primary driver',
    ],
    tradeoffs: [
      'Limited fair depth — may miss parallel sessions',
      'Longer trip after adding Wuhan',
    ],
    days: withIndices([
      {
        dateLabel: 'Sat 10 Oct',
        title: 'Depart KLIA → Shanghai',
        kind: 'travel',
        location: 'KLIA → PVG',
        blocks: [
          'Evening group check-in at KLIA',
          'Overnight / late flight to Shanghai Pudong (PVG) — times TBC',
        ],
      },
      {
        dateLabel: 'Sun 11 Oct',
        title: 'Arrive Shanghai · settle',
        kind: 'buffer',
        location: 'Shanghai (NECC area)',
        blocks: [
          'Immigration, hotel check-in near NECC / Hongqiao corridor',
          'Team briefing: fair scout matrix + LRVTC / Wuhan etiquette',
          'Confirm PVG→LZH tickets and host contacts',
        ],
      },
      {
        dateLabel: 'Mon 12 Oct',
        title: 'CIIF — focused scouting',
        kind: 'fair',
        location: 'NECC Shanghai · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dateLabel: 'Tue 13 Oct',
        title: 'CIIF morning · transfer to Liuzhou',
        kind: 'transfer',
        location: 'NECC → PVG → LZH',
        blocks: [
          'Half-day follow-up booths / vendor meetings',
          'Afternoon flight Shanghai → Liuzhou (LZH)',
          'Hotel check-in Liuzhou; evening prep for LRVTC',
        ],
      },
      ...fullTechDays({
        lrvtc: 'Wed 14 Oct',
        hsr: 'Thu 15 Oct',
        crrc: 'Fri 16 Oct',
        dayOps: 'Sat 17 Oct',
        nightOps: 'Sun 18 Oct',
        wrap: 'Mon 19 Oct',
      }),
      {
        dateLabel: 'Tue 20 Oct',
        title: 'Return to KLIA',
        kind: 'travel',
        location: 'WUH → KLIA (via CAN or PVG)',
        blocks: [
          'Depart Wuhan via hub connection',
          'Arrive KLIA; trip report kickoff within 5 working days',
        ],
      },
    ]),
    costs: {
      intlFlightPerPax: 2400,
      domesticFlightsPerPax: 1600,
      ...baseLodging,
      shanghaiNights: 3,
      liuzhouNights: 1,
      wuhanNights: 5,
      fairFeesPerPax: 150,
      localTransportPerDay: 120,
      mealsPerDay: 160,
      contingencyRate: 0.1,
    },
  }
}

function buildCiifB(): TripOption {
  return {
    id: 'B1',
    fair: 'CIIF',
    depth: 'B',
    routeOrder: 'shanghai-first',
    name: 'B1 · CIIF + Protect Fair',
    tagline: 'Stronger fair days, then compressed LZH campus + Wuhan (no night ops).',
    durationDays: 11,
    durationLabel: '~10–11 days',
    fairDays: 2.5,
    LRVTCDays: 1,
    wuhanDays: 2,
    LRVTCMode: 'compressed',
    windowLabel: '10–20 Oct 2026 (CIIF then compressed LZH+Wuhan)',
    highlights: [
      'Strongest CIIF coverage among shorter tech packages',
      'Still includes LRVTC campus day + CRRC Yangtze + daytime rail ops',
      'Returns from Wuhan after a tighter tech envelope',
    ],
    tradeoffs: [
      'Drops night rail observation and separate wrap day',
      'Less depth for ECRL / wagon ops immersion',
    ],
    days: withIndices([
      {
        dateLabel: 'Sat 10 Oct',
        title: 'Depart KLIA → Shanghai',
        kind: 'travel',
        location: 'KLIA → PVG',
        blocks: ['Evening departure from KLIA; group travel protocol'],
      },
      {
        dateLabel: 'Sun 11 Oct',
        title: 'Arrive Shanghai · settle',
        kind: 'buffer',
        location: 'Shanghai',
        blocks: [
          'Hotel near NECC',
          'Register / badge pickup if required',
          'Assign scout roles by tech theme (twin / robotics / sensors)',
        ],
      },
      {
        dateLabel: 'Mon 12 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dateLabel: 'Tue 13 Oct',
        title: 'CIIF Day 2',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Deep-dive booths shortlisted on Day 1',
          'Vendor demos: digital twin + sensor fusion for logistics',
          'Optional forum session if relevant to ops tech',
        ],
      },
      {
        dateLabel: 'Wed 14 Oct',
        title: 'CIIF morning · fly to Liuzhou',
        kind: 'transfer',
        location: 'NECC → LZH',
        blocks: [
          'Final vendor meetings / materials pickup',
          'Afternoon Shanghai → Liuzhou',
          'Evening LRVTC orientation with host',
        ],
      },
      ...compressedTechDays({
        lrvtc: 'Thu 15 Oct',
        hsr: 'Fri 16 Oct',
        crrc: 'Sat 17 Oct',
        ops: 'Sun 18 Oct',
      }),
      {
        dateLabel: 'Mon 19 Oct',
        title: 'Wrap · return to KLIA',
        kind: 'travel',
        location: 'WUH → KLIA (via CAN or PVG)',
        blocks: [
          'Morning wrap notes from LRVTC + Wuhan engagements',
          'Depart Wuhan via hub connection',
          'Arrive KLIA; schedule internal readout',
        ],
      },
    ]),
    costs: {
      intlFlightPerPax: 2300,
      domesticFlightsPerPax: 1500,
      ...baseLodging,
      shanghaiNights: 4,
      liuzhouNights: 1,
      wuhanNights: 3,
      fairFeesPerPax: 150,
      localTransportPerDay: 120,
      mealsPerDay: 160,
      contingencyRate: 0.1,
    },
  }
}

function buildCiifC(): TripOption {
  return {
    id: 'C1',
    fair: 'CIIF',
    depth: 'C',
    routeOrder: 'shanghai-first',
    name: 'C1 · CIIF + Full Depth',
    tagline: 'Full fair + LRVTC campus day + full Wuhan CRRC / rail ops. Recommended.',
    recommended: true,
    durationDays: 12,
    durationLabel: '~11–12 days',
    fairDays: 2.5,
    LRVTCDays: 1,
    wuhanDays: 4,
    LRVTCMode: 'full',
    windowLabel: '10–21 Oct 2026 (CIIF 12–16 Oct then LZH+Wuhan)',
    highlights: [
      'Best fit for digital twin / robotics / sensors scouting at CIIF',
      'Full Wuhan practical learning (CRRC + day/night ops + wrap)',
      'Buffers reduce flight-miss and fatigue risk for 6–8 pax',
    ],
    tradeoffs: [
      'Longer absence and higher total cost',
      'Requires earlier management approval for calendar',
    ],
    days: withIndices([
      {
        dateLabel: 'Sat 10 Oct',
        title: 'Depart KLIA → Shanghai',
        kind: 'travel',
        location: 'KLIA → PVG',
        blocks: ['Group departure from KLIA (prefer daytime/evening with buffer)'],
      },
      {
        dateLabel: 'Sun 11 Oct',
        title: 'Arrive Shanghai · settle',
        kind: 'buffer',
        location: 'Shanghai',
        blocks: [
          'Hotel check-in; SIM / payment / transport setup',
          'NECC access dry-run / badge if available',
          'Finalize fair walking plan by hall; ITaLI vs DDE note-taking roles',
          'Confirm LRVTC and CRRC Yangtze programmes with hosts',
        ],
      },
      {
        dateLabel: 'Mon 12 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dateLabel: 'Tue 13 Oct',
        title: 'CIIF Day 2',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Robotics & automation deep dive',
          'Sensor / IoT / industrial networks for logistics yards',
          'Book follow-up demos for Day 3 morning',
        ],
      },
      {
        dateLabel: 'Wed 14 Oct',
        title: 'CIIF morning · transfer to Liuzhou',
        kind: 'transfer',
        location: 'NECC → LZH',
        blocks: [
          'Priority vendor close-outs',
          'Afternoon flight to Liuzhou',
          'Light team dinner; early rest before LRVTC',
        ],
      },
      ...fullTechDays({
        lrvtc: 'Thu 15 Oct',
        hsr: 'Fri 16 Oct',
        crrc: 'Sat 17 Oct',
        dayOps: 'Sun 18 Oct',
        nightOps: 'Mon 19 Oct',
        wrap: 'Tue 20 Oct',
      }),
      {
        dateLabel: 'Wed 21 Oct',
        title: 'Return to KLIA',
        kind: 'travel',
        location: 'WUH → KLIA (via CAN or PVG)',
        blocks: [
          'Depart Wuhan for KLIA (via CAN or PVG — TBC)',
          'Post-trip report owners assigned before landing',
        ],
      },
    ]),
    costs: {
      intlFlightPerPax: 2500,
      domesticFlightsPerPax: 1700,
      ...baseLodging,
      shanghaiNights: 4,
      liuzhouNights: 1,
      wuhanNights: 5,
      fairFeesPerPax: 150,
      localTransportPerDay: 120,
      mealsPerDay: 160,
      contingencyRate: 0.12,
    },
  }
}

function shiftCiie(
  base: TripOption,
  id: string,
  name: string,
  windowLabel: string,
  dayLabels: { dateLabel: string; title?: string }[],
): TripOption {
  const fairBlocks = (day: ItineraryDay): ItineraryDay => {
    if (day.kind !== 'fair') return day
    return {
      ...day,
      location: day.location.replace('CIIF', 'CIIE'),
      blocks: fairFocusCiie,
    }
  }

  return {
    ...base,
    id,
    fair: 'CIIE',
    name,
    windowLabel,
    recommended: false,
    routeOrder: base.routeOrder,
    days: base.days.map((d, i) => ({
      ...fairBlocks(d),
      dateLabel: dayLabels[i]?.dateLabel ?? d.dateLabel,
      title: dayLabels[i]?.title ?? d.title.replace('CIIF', 'CIIE'),
      blocks: d.kind === 'fair' ? fairFocusCiie : d.blocks.map((b) => b.replace(/CIIF/g, 'CIIE')),
    })),
  }
}

const ciieALabels = [
  { dateLabel: 'Tue 3 Nov' },
  { dateLabel: 'Wed 4 Nov' },
  { dateLabel: 'Thu 5 Nov', title: 'CIIE — focused scouting' },
  { dateLabel: 'Fri 6 Nov', title: 'CIIE morning · transfer to Liuzhou' },
  { dateLabel: 'Sat 7 Nov' },
  { dateLabel: 'Sun 8 Nov' },
  { dateLabel: 'Mon 9 Nov' },
  { dateLabel: 'Tue 10 Nov' },
  { dateLabel: 'Wed 11 Nov' },
  { dateLabel: 'Thu 12 Nov' },
  { dateLabel: 'Fri 13 Nov' },
  { dateLabel: 'Sat 14 Nov' },
]

const ciieBLabels = [
  { dateLabel: 'Tue 3 Nov' },
  { dateLabel: 'Wed 4 Nov' },
  { dateLabel: 'Thu 5 Nov', title: 'CIIE Day 1' },
  { dateLabel: 'Fri 6 Nov', title: 'CIIE Day 2' },
  { dateLabel: 'Sat 7 Nov', title: 'CIIE morning · fly to Liuzhou' },
  { dateLabel: 'Sun 8 Nov' },
  { dateLabel: 'Mon 9 Nov' },
  { dateLabel: 'Tue 10 Nov' },
  { dateLabel: 'Wed 11 Nov' },
  { dateLabel: 'Thu 12 Nov' },
  { dateLabel: 'Fri 13 Nov' },
]

const ciieCLabels = [
  { dateLabel: 'Tue 3 Nov' },
  { dateLabel: 'Wed 4 Nov', title: 'Arrive Shanghai · settle' },
  { dateLabel: 'Thu 5 Nov', title: 'CIIE Day 1' },
  { dateLabel: 'Fri 6 Nov', title: 'CIIE Day 2' },
  { dateLabel: 'Sat 7 Nov', title: 'CIIE morning · transfer to Liuzhou' },
  { dateLabel: 'Sun 8 Nov' },
  { dateLabel: 'Mon 9 Nov' },
  { dateLabel: 'Tue 10 Nov' },
  { dateLabel: 'Wed 11 Nov' },
  { dateLabel: 'Thu 12 Nov' },
  { dateLabel: 'Fri 13 Nov' },
  { dateLabel: 'Sat 14 Nov' },
]

/** KLIA → Liuzhou → Wuhan → Shanghai (fair) → KLIA */
function buildCiifAL(): TripOption {
  return {
    id: 'A1L',
    fair: 'CIIF',
    depth: 'A',
    routeOrder: 'liuzhou-first',
    name: 'A1L · CIIF + Protect tech (LZH first)',
    tagline: 'Full LZH+Wuhan tech first, then compressed fair in Shanghai.',
    durationDays: 11,
    durationLabel: '~10–11 days',
    fairDays: 1.5,
    LRVTCDays: 1,
    wuhanDays: 4,
    LRVTCMode: 'full',
    windowLabel: '2–13 Oct 2026 (LZH+Wuhan then CIIF 12–13 Oct)',
    highlights: [
      'Tech programme completed before fair fatigue',
      'Still samples CIIF robotics / automation exhibits',
      'Return from Shanghai simplifies PVG→KUL ticketing',
    ],
    tradeoffs: [
      'Limited fair depth after a heavy tech block',
      'Must reach Shanghai before fair closes (plan Wuhan→PVG carefully)',
    ],
    days: withIndices([
      {
        dateLabel: 'Fri 2 Oct',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: [
          'Group departure from KLIA toward Liuzhou',
          'Typical path: KUL→CAN→LZH or KUL→PVG→LZH — times TBC',
        ],
      },
      {
        dateLabel: 'Sat 3 Oct',
        title: 'Arrive Liuzhou · LRVTC prep',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: [
          'Hotel check-in; confirm LRVTC host and transport',
          'Safety / etiquette briefing for campus programme',
        ],
      },
      ...fullTechDays({
        lrvtc: 'Sun 4 Oct',
        hsr: 'Mon 5 Oct',
        crrc: 'Tue 6 Oct',
        dayOps: 'Wed 7 Oct',
        nightOps: 'Thu 8 Oct',
        wrap: 'Fri 9 Oct',
      }),
      {
        dateLabel: 'Sun 11 Oct',
        title: 'Wuhan → Shanghai · fair prep',
        kind: 'transfer',
        location: 'WUH → PVG',
        blocks: [
          'Flight Wuhan → Shanghai',
          'Hotel check-in near NECC',
          'Same-day fair prep: scout matrix, badge / NECC dry-run if available',
        ],
      },
      {
        dateLabel: 'Mon 12 Oct',
        title: 'CIIF — focused scouting',
        kind: 'fair',
        location: 'NECC Shanghai · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dateLabel: 'Tue 13 Oct',
        title: 'CIIF half-day · depart KLIA',
        kind: 'debrief',
        location: 'NECC → PVG → KLIA',
        blocks: [
          'Morning follow-up booths / vendor close-outs (CIIF still open)',
          'Joint debrief notes',
          'Evening departure PVG → KLIA',
        ],
      },
    ]),
    costs: {
      intlFlightPerPax: 2400,
      domesticFlightsPerPax: 1800,
      ...baseLodging,
      shanghaiNights: 2,
      liuzhouNights: 2,
      wuhanNights: 6,
      fairFeesPerPax: 150,
      localTransportPerDay: 120,
      mealsPerDay: 160,
      contingencyRate: 0.1,
    },
  }
}

function buildCiifBL(): TripOption {
  return {
    id: 'B1L',
    fair: 'CIIF',
    depth: 'B',
    routeOrder: 'liuzhou-first',
    name: 'B1L · CIIF + Protect Fair (LZH first)',
    tagline: 'Compressed LZH+Wuhan first, then 2–3 solid fair days in Shanghai.',
    durationDays: 10,
    durationLabel: '~9–10 days',
    fairDays: 2.5,
    LRVTCDays: 1,
    wuhanDays: 2,
    LRVTCMode: 'compressed',
    windowLabel: '4–14 Oct 2026 (compressed tech then CIIF 12–14 Oct)',
    highlights: [
      'Protects fair coverage after a shorter tech block',
      'Includes LRVTC campus + CRRC + daytime rail ops',
      'Return from PVG after the fair',
    ],
    tradeoffs: [
      'Night rail observation omitted',
      'Less ECRL / wagon ops immersion than full tech options',
    ],
    days: withIndices([
      {
        dateLabel: 'Sun 4 Oct',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: ['Evening departure toward Liuzhou; group travel protocol'],
      },
      {
        dateLabel: 'Mon 5 Oct',
        title: 'Arrive Liuzhou · LRVTC orientation',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: ['Hotel check-in', 'Host orientation call / campus map'],
      },
      ...compressedTechDays({
        lrvtc: 'Tue 6 Oct',
        hsr: 'Wed 7 Oct',
        crrc: 'Thu 8 Oct',
        ops: 'Fri 9 Oct',
      }),
      {
        dateLabel: 'Sun 11 Oct',
        title: 'Wuhan → Shanghai · fair prep',
        kind: 'transfer',
        location: 'WUH → PVG',
        blocks: [
          'Morning wrap notes',
          'Flight to Shanghai',
          'Hotel near NECC; same-day scout roles / badge prep',
        ],
      },
      {
        dateLabel: 'Mon 12 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dateLabel: 'Tue 13 Oct',
        title: 'CIIF Day 2',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Deep-dive booths shortlisted on Day 1',
          'Vendor demos: digital twin + sensor fusion for logistics',
        ],
      },
      {
        dateLabel: 'Wed 14 Oct',
        title: 'CIIF morning · depart KLIA',
        kind: 'debrief',
        location: 'NECC → PVG → KLIA',
        blocks: [
          'Final vendor meetings (CIIF still open)',
          'Team debrief notes',
          'Afternoon/evening PVG → KLIA',
        ],
      },
    ]),
    costs: {
      intlFlightPerPax: 2300,
      domesticFlightsPerPax: 1700,
      ...baseLodging,
      shanghaiNights: 3,
      liuzhouNights: 2,
      wuhanNights: 4,
      fairFeesPerPax: 150,
      localTransportPerDay: 120,
      mealsPerDay: 160,
      contingencyRate: 0.1,
    },
  }
}

function buildCiifCL(): TripOption {
  return {
    id: 'C1L',
    fair: 'CIIF',
    depth: 'C',
    routeOrder: 'liuzhou-first',
    name: 'C1L · CIIF + Full Depth (LZH first)',
    tagline: 'Full LZH+Wuhan first, then 2–3 fair days + buffers in Shanghai.',
    durationDays: 13,
    durationLabel: '~12–13 days',
    fairDays: 2.5,
    LRVTCDays: 1,
    wuhanDays: 4,
    LRVTCMode: 'full',
    windowLabel: '1–15 Oct 2026 (LZH+Wuhan then CIIF 12–16 Oct)',
    highlights: [
      'Full Wuhan practical learning before fair days',
      'Solid CIIF robotics / digital twin / sensors coverage inside 12–16 Oct',
      'Buffers on both city legs for a 6–8 person group',
    ],
    tradeoffs: [
      'Longer trip and higher cost',
      'Fair starts after an intensive tech block',
    ],
    days: withIndices([
      {
        dateLabel: 'Thu 1 Oct',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: ['Group departure with connection buffer'],
      },
      {
        dateLabel: 'Fri 2 Oct',
        title: 'Arrive Liuzhou · settle',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: ['Hotel check-in', 'Confirm LRVTC programme with host'],
      },
      ...fullTechDays({
        lrvtc: 'Sat 3 Oct',
        hsr: 'Sun 4 Oct',
        crrc: 'Mon 5 Oct',
        dayOps: 'Tue 6 Oct',
        nightOps: 'Wed 7 Oct',
        wrap: 'Thu 8 Oct',
      }),
      {
        dateLabel: 'Sun 11 Oct',
        title: 'Wuhan → Shanghai · fair prep',
        kind: 'transfer',
        location: 'WUH → PVG',
        blocks: [
          'Flight to Shanghai',
          'Hotel check-in near NECC',
          'Same-day prep: walking plan by hall, ITaLI vs DDE note-taking roles, badge if available',
        ],
      },
      {
        dateLabel: 'Mon 12 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dateLabel: 'Tue 13 Oct',
        title: 'CIIF Day 2',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Robotics & automation deep dive',
          'Sensor / IoT for logistics yards',
        ],
      },
      {
        dateLabel: 'Wed 14 Oct',
        title: 'CIIF morning · buffer',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Priority vendor close-outs',
          'Afternoon buffer / materials consolidation',
        ],
      },
      {
        dateLabel: 'Thu 15 Oct',
        title: 'Return to KLIA',
        kind: 'travel',
        location: 'PVG → KLIA',
        blocks: ['Depart Shanghai for KLIA'],
      },
    ]),
    costs: {
      intlFlightPerPax: 2500,
      domesticFlightsPerPax: 1900,
      ...baseLodging,
      shanghaiNights: 4,
      liuzhouNights: 2,
      wuhanNights: 7,
      fairFeesPerPax: 150,
      localTransportPerDay: 120,
      mealsPerDay: 160,
      contingencyRate: 0.12,
    },
  }
}

const ciieALLabels = [
  { dateLabel: 'Mon 26 Oct' },
  { dateLabel: 'Tue 27 Oct' },
  { dateLabel: 'Wed 28 Oct' },
  { dateLabel: 'Thu 29 Oct' },
  { dateLabel: 'Fri 30 Oct' },
  { dateLabel: 'Sat 31 Oct' },
  { dateLabel: 'Sun 1 Nov' },
  { dateLabel: 'Mon 2 Nov' },
  { dateLabel: 'Wed 4 Nov', title: 'Wuhan → Shanghai · fair prep' },
  { dateLabel: 'Thu 5 Nov', title: 'CIIE — focused scouting' },
  { dateLabel: 'Fri 6 Nov', title: 'CIIE half-day · depart KLIA' },
]

const ciieBLLabels = [
  { dateLabel: 'Wed 28 Oct' },
  { dateLabel: 'Thu 29 Oct' },
  { dateLabel: 'Fri 30 Oct' },
  { dateLabel: 'Sat 31 Oct' },
  { dateLabel: 'Sun 1 Nov' },
  { dateLabel: 'Mon 2 Nov' },
  { dateLabel: 'Wed 4 Nov', title: 'Wuhan → Shanghai · fair prep' },
  { dateLabel: 'Thu 5 Nov', title: 'CIIE Day 1' },
  { dateLabel: 'Fri 6 Nov', title: 'CIIE Day 2' },
  { dateLabel: 'Sat 7 Nov', title: 'CIIE morning · depart KLIA' },
]

const ciieCLLabels = [
  { dateLabel: 'Sun 25 Oct' },
  { dateLabel: 'Mon 26 Oct' },
  { dateLabel: 'Tue 27 Oct' },
  { dateLabel: 'Wed 28 Oct' },
  { dateLabel: 'Thu 29 Oct' },
  { dateLabel: 'Fri 30 Oct' },
  { dateLabel: 'Sat 31 Oct' },
  { dateLabel: 'Sun 1 Nov' },
  { dateLabel: 'Wed 4 Nov', title: 'Wuhan → Shanghai · fair prep' },
  { dateLabel: 'Thu 5 Nov', title: 'CIIE Day 1' },
  { dateLabel: 'Fri 6 Nov', title: 'CIIE Day 2' },
  { dateLabel: 'Sat 7 Nov', title: 'CIIE morning · buffer' },
  { dateLabel: 'Sun 8 Nov', title: 'Return to KLIA' },
]

/** KLIA → Liuzhou → Wuhan → KLIA — no Shanghai fair */
function buildLiuzhouOnly(): TripOption {
  return {
    id: 'L1',
    fair: 'NONE',
    depth: 'C',
    routeOrder: 'liuzhou-only',
    name: 'L1 · Liuzhou + Wuhan · Flexible dates',
    tagline: 'LRVTC campus day + full Wuhan CRRC / rail ops; dates TBC with hosts.',
    durationDays: 8,
    durationLabel: '~7–8 days',
    fairDays: 0,
    LRVTCDays: 1,
    wuhanDays: 4,
    LRVTCMode: 'full',
    windowLabel: 'Indicative mid-Oct 2026 (dates lock with LRVTC / CRRC hosts)',
    highlights: [
      'Dedicated ECRL + wagon ops immersion without fair travel fatigue',
      'Practical learning at CRRC Yangtze and Wuhan rail operations',
      'Return from Wuhan via CAN or PVG hub',
    ],
    tradeoffs: [
      'No CIIF / CIIE tech scouting on this trip',
      'Window depends on LRVTC and CRRC host confirmation',
    ],
    days: withIndices([
      {
        dateLabel: 'Day 0 (TBC)',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: [
          'Departure from Kuala Lumpur',
          'Arrival in Liuzhou and transfer to hotel',
          'Typical path: KUL→CAN→LZH or KUL→PVG→LZH — times TBC',
        ],
      },
      ...fullTechDays({
        lrvtc: 'Day 1 (TBC)',
        hsr: 'Day 2 (TBC)',
        crrc: 'Day 3 (TBC)',
        dayOps: 'Day 4 (TBC)',
        nightOps: 'Day 5 (TBC)',
        wrap: 'Day 6 (TBC)',
      }),
      {
        dateLabel: 'Day 7 (TBC)',
        title: 'Return to Malaysia',
        kind: 'travel',
        location: 'WUH → KLIA (via CAN or PVG)',
        blocks: [
          'Departure from Wuhan',
          'Arrival in Kuala Lumpur; trip report kickoff within 5 working days',
        ],
      },
    ]),
    costs: {
      intlFlightPerPax: 2200,
      domesticFlightsPerPax: 1400,
      ...baseLodging,
      shanghaiNights: 0,
      liuzhouNights: 1,
      wuhanNights: 5,
      fairFeesPerPax: 0,
      localTransportPerDay: 100,
      mealsPerDay: 150,
      contingencyRate: 0.1,
    },
  }
}

/** Weekday engagement calendar — Mon LRVTC through Fri night; weekend edges for travel/wrap */
function buildLiuzhouOnlyWeekdays(): TripOption {
  return {
    id: 'L2',
    fair: 'NONE',
    depth: 'C',
    routeOrder: 'liuzhou-only',
    name: 'L2 · Liuzhou + Wuhan · Weekday programme',
    tagline: 'Indicative mid-Oct calendar; LRVTC + Wuhan engagements Mon–Fri.',
    durationDays: 10,
    durationLabel: '~9–10 days',
    fairDays: 0,
    LRVTCDays: 1,
    wuhanDays: 4,
    LRVTCMode: 'full',
    windowLabel: '9–18 Oct 2026 (LRVTC Mon; Wuhan Wed–Fri weekdays)',
    highlights: [
      'Campus and Wuhan site days locked to weekdays where possible',
      'Clear indicative calendar for host confirmation',
      'Full CRRC + day/night rail ops after LRVTC facility review',
    ],
    tradeoffs: [
      'No CIIF / CIIE tech scouting on this trip',
      'Slightly longer envelope than flexible L1 to protect weekday sessions',
    ],
    days: withIndices([
      {
        dateLabel: 'Fri 9 Oct',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: [
          'Group departure from KLIA toward Liuzhou',
          'Typical path: KUL→CAN→LZH or KUL→PVG→LZH — times TBC',
        ],
      },
      {
        dateLabel: 'Sat 10 Oct',
        title: 'Arrive Liuzhou · settle',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: [
          'Hotel check-in; confirm LRVTC host and transport',
          'Safety / etiquette briefing for campus programme',
        ],
      },
      {
        dateLabel: 'Sun 11 Oct',
        title: 'Prep day · no campus session',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: [
          'Rest / materials prep ahead of weekday LRVTC',
          'Confirm Mon–Fri host schedule and Wuhan transfer plan',
        ],
      },
      ...fullTechDays({
        lrvtc: 'Mon 12 Oct',
        hsr: 'Tue 13 Oct',
        crrc: 'Wed 14 Oct',
        dayOps: 'Thu 15 Oct',
        nightOps: 'Fri 16 Oct',
        wrap: 'Sat 17 Oct',
      }),
      {
        dateLabel: 'Sun 18 Oct',
        title: 'Return to KLIA',
        kind: 'travel',
        location: 'WUH → KLIA (via CAN or PVG)',
        blocks: [
          'Depart Wuhan via hub connection',
          'Arrive KLIA; trip report kickoff within 5 working days',
        ],
      },
    ]),
    costs: {
      intlFlightPerPax: 2200,
      domesticFlightsPerPax: 1400,
      ...baseLodging,
      shanghaiNights: 0,
      liuzhouNights: 3,
      wuhanNights: 5,
      fairFeesPerPax: 0,
      localTransportPerDay: 100,
      mealsPerDay: 150,
      contingencyRate: 0.1,
    },
  }
}

export const ROUTE_ORDER_LABELS: Record<RouteOrder, string> = {
  'shanghai-first': 'Shanghai first',
  'liuzhou-first': 'Liuzhou first',
  'liuzhou-only': 'No fair (Liuzhou + Wuhan)',
}

export const OPTIONS: TripOption[] = [
  buildCiifA(),
  {
    ...shiftCiie(
      buildCiifA(),
      'A2',
      'A2 · CIIE + Protect tech (LZH+Wuhan)',
      '3–14 Nov 2026 (CIIE then LZH+Wuhan)',
      ciieALabels,
    ),
    tagline: 'Compressed fair, then full LRVTC campus day + Wuhan CRRC / rail ops.',
  },
  buildCiifB(),
  {
    ...shiftCiie(
      buildCiifB(),
      'B2',
      'B2 · CIIE + Protect Fair',
      '3–13 Nov 2026 (CIIE then compressed LZH+Wuhan)',
      ciieBLabels,
    ),
    tagline: 'Stronger fair days, then compressed LZH campus + Wuhan (no night ops).',
  },
  buildCiifC(),
  {
    ...shiftCiie(
      buildCiifC(),
      'C2',
      'C2 · CIIE + Full Depth',
      '3–14 Nov 2026 (CIIE then LZH+Wuhan)',
      ciieCLabels,
    ),
    tagline: 'Full fair + LRVTC campus day + full Wuhan CRRC / rail ops.',
    highlights: [
      'Best fit for CIIE Intelligent Industry & services-linked logistics tech',
      'Full Wuhan practical learning (CRRC + day/night ops + wrap)',
      'Buffers for a 6–8 person group',
    ],
  },
  buildCiifAL(),
  {
    ...shiftCiie(
      buildCiifAL(),
      'A2L',
      'A2L · CIIE + Protect tech (LZH first)',
      '26 Oct–6 Nov 2026 (LZH+Wuhan then CIIE 5–6 Nov)',
      ciieALLabels,
    ),
    tagline: 'Full LZH+Wuhan tech first, then compressed fair in Shanghai.',
  },
  buildCiifBL(),
  {
    ...shiftCiie(
      buildCiifBL(),
      'B2L',
      'B2L · CIIE + Protect Fair (LZH first)',
      '28 Oct–7 Nov 2026 (compressed tech then CIIE 5–7 Nov)',
      ciieBLLabels,
    ),
    tagline: 'Compressed LZH+Wuhan first, then 2–3 solid fair days in Shanghai.',
  },
  buildCiifCL(),
  {
    ...shiftCiie(
      buildCiifCL(),
      'C2L',
      'C2L · CIIE + Full Depth (LZH first)',
      '25 Oct–8 Nov 2026 (LZH+Wuhan then CIIE 5–9 Nov)',
      ciieCLLabels,
    ),
    tagline: 'Full LZH+Wuhan first, then 2–3 CIIE days + buffers in Shanghai.',
    highlights: [
      'Full Wuhan practical learning before CIIE',
      'CIIE Intelligent Industry & services-linked logistics tech',
      'Buffers for a 6–8 person group',
    ],
  },
  buildLiuzhouOnly(),
  buildLiuzhouOnlyWeekdays(),
]

export const DEFAULT_OPTION_ID = 'C1'

/** Budget in this proposal covers ITaLI travellers only. DDE arranges its own costing. */
export const ITALI_BUDGET_PAX = 3

export function getOption(id: string): TripOption {
  return OPTIONS.find((o) => o.id === id) ?? OPTIONS.find((o) => o.id === DEFAULT_OPTION_ID)!
}

export function findTwin(option: TripOption, routeOrder: RouteOrder): TripOption | undefined {
  return OPTIONS.find(
    (o) => o.fair === option.fair && o.depth === option.depth && o.routeOrder === routeOrder,
  )
}

export function calcBudget(option: TripOption, pax: number = ITALI_BUDGET_PAX) {
  const c = option.costs
  const tripDays = option.durationDays
  const lodging =
    (c.hotelShanghaiPerNight * c.shanghaiNights +
      c.hotelLiuzhouPerNight * c.liuzhouNights +
      c.hotelWuhanPerNight * c.wuhanNights) *
    pax
  const flights = (c.intlFlightPerPax + c.domesticFlightsPerPax) * pax
  const fair = c.fairFeesPerPax * pax
  const local = c.localTransportPerDay * tripDays * pax
  const meals = c.mealsPerDay * tripDays * pax
  const subtotal = lodging + flights + fair + local + meals
  const contingency = Math.round(subtotal * c.contingencyRate)
  const total = subtotal + contingency
  return {
    lodging,
    flights,
    fair,
    local,
    meals,
    subtotal,
    contingency,
    total,
    perPax: Math.round(total / pax),
    pax,
  }
}

export function formatMyr(n: number): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function routeStripLabel(order: RouteOrder): string {
  if (order === 'liuzhou-only') return 'KLIA → Liuzhou → Wuhan → KLIA'
  if (order === 'liuzhou-first') return 'KLIA → Liuzhou → Wuhan → Shanghai → KLIA'
  return 'KLIA → Shanghai → Liuzhou → Wuhan → KLIA'
}
