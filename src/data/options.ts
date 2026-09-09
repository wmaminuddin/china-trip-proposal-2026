export type FairId = 'CIIF' | 'CIIE' | 'NONE'
export type DepthId = 'A' | 'B' | 'C'
export type RouteOrder = 'shanghai-first' | 'liuzhou-first' | 'liuzhou-only'
export type DayKind =
  | 'travel'
  | 'fair'
  | 'transfer'
  | 'LRVTC'
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
  shanghaiNights: number
  liuzhouNights: number
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
  LRVTCMode: 'full' | 'compressed'
  windowLabel: string
  highlights: string[]
  tradeoffs: string[]
  days: ItineraryDay[]
  costs: CostAssumptions
}

const LRVTCFullBlocks = {
  classroom: [
    'Classroom briefing: China railway operations overview',
    'ECRL-relevant process mapping (scheduling, maintenance, safety culture)',
    'Q&A with LRVTC instructors (ITaLI + DDE)',
  ],
  handsOn: [
    'Hands-on lab / simulator sessions',
    'Workshop on signalling, rolling-stock interfaces, or ops tooling (as hosted)',
    'Team capture: photos, notes, process diagrams for post-trip report',
  ],
  dayNight: [
    'Day shift observation / supervised learning',
    'Night shift observation (safety briefing mandatory)',
    'Debrief: differences between day vs night railway processes',
  ],
}

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

function buildCiifA(): TripOption {
  return {
    id: 'A1',
    fair: 'CIIF',
    depth: 'A',
    routeOrder: 'shanghai-first',
    name: 'A1 · CIIF + Protect Liuzhou',
    tagline: 'Shanghai fair first, then full ~3.5-day LRVTC block.',
    durationDays: 9,
    durationLabel: '~8–9 days',
    fairDays: 1.5,
    LRVTCDays: 3.5,
    LRVTCMode: 'full',
    windowLabel: '11–18 Oct 2026 (around CIIF 12–16 Oct)',
    highlights: [
      'Preserves full classroom + hands-on + day/night shift at LRVTC',
      'Still samples CIIF robotics / automation exhibits',
      'Best when ECRL process learning is the primary approval driver',
    ],
    tradeoffs: [
      'Limited fair depth — may miss parallel sessions',
      'Tight Shanghai→Liuzhou transfer day',
    ],
    days: [
      {
        dayIndex: 0,
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
        dayIndex: 1,
        dateLabel: 'Sun 11 Oct',
        title: 'Arrive Shanghai · prep',
        kind: 'buffer',
        location: 'Shanghai (NECC area)',
        blocks: [
          'Immigration, hotel check-in near NECC / Hongqiao corridor',
          'Team briefing: fair scout matrix + LRVTC etiquette',
          'Confirm domestic PVG→LZH tickets and LRVTC host contact',
        ],
      },
      {
        dayIndex: 2,
        dateLabel: 'Mon 12 Oct',
        title: 'CIIF — focused scouting',
        kind: 'fair',
        location: 'NECC Shanghai · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dayIndex: 3,
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
      {
        dayIndex: 4,
        dateLabel: 'Wed 14 Oct',
        title: 'LRVTC — classroom briefing',
        kind: 'LRVTC',
        location: 'Liuzhou Railway Vocational & Technical College',
        blocks: LRVTCFullBlocks.classroom,
      },
      {
        dayIndex: 5,
        dateLabel: 'Thu 15 Oct',
        title: 'LRVTC — hands-on learning',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.handsOn,
      },
      {
        dayIndex: 6,
        dateLabel: 'Fri 16 Oct',
        title: 'LRVTC — day & night shift (start)',
        kind: 'LRVTC',
        location: 'LRVTC / partner site',
        blocks: [
          'Day shift supervised learning',
          'Safety induction for night observation',
          'Night shift learning begins (split team if needed)',
        ],
      },
      {
        dayIndex: 7,
        dateLabel: 'Sat 17 Oct',
        title: 'Night shift wrap · debrief · depart',
        kind: 'debrief',
        location: 'Liuzhou → KLIA (via LZH / CAN / PVG)',
        blocks: [
          'Morning wrap of night-shift learning (~0.5 day)',
          'Joint ITaLI–DDE debrief and action list',
          'Evening departure toward KLIA — routing TBC',
        ],
      },
      {
        dayIndex: 8,
        dateLabel: 'Sun 18 Oct',
        title: 'Arrive KLIA',
        kind: 'travel',
        location: 'KLIA',
        blocks: ['Arrival KLIA; team disperse; trip report kickoff within 5 working days'],
      },
    ],
    costs: {
      intlFlightPerPax: 2200,
      domesticFlightsPerPax: 1100,
      hotelShanghaiPerNight: 450,
      hotelLiuzhouPerNight: 280,
      shanghaiNights: 3,
      liuzhouNights: 4,
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
    tagline: 'Shanghai first: 2–3 fair days, then compressed LRVTC ~2 days.',
    durationDays: 8,
    durationLabel: '~7–8 days',
    fairDays: 2.5,
    LRVTCDays: 2,
    LRVTCMode: 'compressed',
    windowLabel: '10–17 Oct 2026 (CIIF 12–16 Oct)',
    highlights: [
      'Strongest CIIF coverage among short trips',
      'Closest to the ideal ~7-day envelope',
      'Still includes a meaningful LRVTC classroom + condensed practical',
    ],
    tradeoffs: [
      'Drops full night-shift learning (or shortens hands-on)',
      'Less depth for ECRL process immersion',
    ],
    days: [
      {
        dayIndex: 0,
        dateLabel: 'Fri 10 Oct',
        title: 'Depart KLIA → Shanghai',
        kind: 'travel',
        location: 'KLIA → PVG',
        blocks: ['Evening departure from KLIA; group travel protocol'],
      },
      {
        dayIndex: 1,
        dateLabel: 'Sat 11 Oct',
        title: 'Arrive Shanghai · prep',
        kind: 'buffer',
        location: 'Shanghai',
        blocks: [
          'Hotel near NECC',
          'Register / badge pickup if required',
          'Assign scout roles by tech theme (twin / robotics / sensors)',
        ],
      },
      {
        dayIndex: 2,
        dateLabel: 'Sun 12 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dayIndex: 3,
        dateLabel: 'Mon 13 Oct',
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
        dayIndex: 4,
        dateLabel: 'Tue 14 Oct',
        title: 'CIIF morning · fly to Liuzhou',
        kind: 'transfer',
        location: 'NECC → LZH',
        blocks: [
          'Final vendor meetings / materials pickup',
          'Afternoon Shanghai → Liuzhou',
          'Evening LRVTC orientation call with host',
        ],
      },
      {
        dayIndex: 5,
        dateLabel: 'Wed 15 Oct',
        title: 'LRVTC compressed — briefing + hands-on',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: [
          'Morning: classroom briefing (railway processes / ECRL lens)',
          'Afternoon: condensed hands-on / lab',
          'Night shift omitted in this option',
        ],
      },
      {
        dayIndex: 6,
        dateLabel: 'Thu 16 Oct',
        title: 'LRVTC wrap · depart',
        kind: 'debrief',
        location: 'Liuzhou → KLIA',
        blocks: [
          'Half-day site walk / Q&A close-out',
          'Team debrief notes',
          'Afternoon/evening departure to KLIA',
        ],
      },
      {
        dayIndex: 7,
        dateLabel: 'Fri 17 Oct',
        title: 'Arrive KLIA',
        kind: 'travel',
        location: 'KLIA',
        blocks: ['Arrival; schedule internal readout'],
      },
    ],
    costs: {
      intlFlightPerPax: 2200,
      domesticFlightsPerPax: 1100,
      hotelShanghaiPerNight: 450,
      hotelLiuzhouPerNight: 280,
      shanghaiNights: 4,
      liuzhouNights: 2,
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
    tagline: 'Shanghai first: 2–3 fair days + full LRVTC + buffers. Recommended.',
    recommended: true,
    durationDays: 11,
    durationLabel: '~10–12 days',
    fairDays: 2.5,
    LRVTCDays: 3.5,
    LRVTCMode: 'full',
    windowLabel: '9–19 Oct 2026 (CIIF 12–16 Oct)',
    highlights: [
      'Best fit for digital twin / robotics / sensors scouting at CIIF',
      'Full LRVTC classroom, hands-on, and day/night shift learning',
      'Built-in buffers reduce flight-miss and fatigue risk for 6–8 pax',
    ],
    tradeoffs: [
      'Longer absence and higher total cost',
      'Requires earlier management approval for calendar',
    ],
    days: [
      {
        dayIndex: 0,
        dateLabel: 'Thu 9 Oct',
        title: 'Depart KLIA → Shanghai',
        kind: 'travel',
        location: 'KLIA → PVG',
        blocks: ['Group departure from KLIA (prefer daytime/evening with buffer)'],
      },
      {
        dayIndex: 1,
        dateLabel: 'Fri 10 Oct',
        title: 'Arrive Shanghai · settle',
        kind: 'buffer',
        location: 'Shanghai',
        blocks: [
          'Hotel check-in; SIM / payment / transport setup',
          'NECC access dry-run / badge if available',
        ],
      },
      {
        dayIndex: 2,
        dateLabel: 'Sat 11 Oct',
        title: 'Prep day · vendor shortlist',
        kind: 'buffer',
        location: 'Shanghai',
        blocks: [
          'Finalize fair walking plan by hall',
          'ITaLI vs DDE role split for note-taking',
          'Confirm LRVTC programme with host',
        ],
      },
      {
        dayIndex: 3,
        dateLabel: 'Sun 12 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dayIndex: 4,
        dateLabel: 'Mon 13 Oct',
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
        dayIndex: 5,
        dateLabel: 'Tue 14 Oct',
        title: 'CIIF morning · transfer to Liuzhou',
        kind: 'transfer',
        location: 'NECC → LZH',
        blocks: [
          'Priority vendor close-outs',
          'Afternoon flight to Liuzhou',
          'Light team dinner; early rest before LRVTC',
        ],
      },
      {
        dayIndex: 6,
        dateLabel: 'Wed 15 Oct',
        title: 'LRVTC — classroom',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.classroom,
      },
      {
        dayIndex: 7,
        dateLabel: 'Thu 16 Oct',
        title: 'LRVTC — hands-on',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.handsOn,
      },
      {
        dayIndex: 8,
        dateLabel: 'Fri 17 Oct',
        title: 'LRVTC — day & night shift',
        kind: 'LRVTC',
        location: 'LRVTC / partner site',
        blocks: LRVTCFullBlocks.dayNight,
      },
      {
        dayIndex: 9,
        dateLabel: 'Sat 18 Oct',
        title: 'Wrap · documentation buffer',
        kind: 'debrief',
        location: 'Liuzhou',
        blocks: [
          'Morning: complete night-shift learning / host thanks',
          'Structured capture: process maps, tech findings, open questions',
          'Optional cultural / city buffer (low key) or spare for delays',
        ],
      },
      {
        dayIndex: 10,
        dateLabel: 'Sun 19 Oct',
        title: 'Return to KLIA',
        kind: 'travel',
        location: 'LZH → KLIA',
        blocks: [
          'Depart Liuzhou for KLIA (direct or via CAN/PVG — TBC)',
          'Post-trip report owners assigned before landing',
        ],
      },
    ],
    costs: {
      intlFlightPerPax: 2400,
      domesticFlightsPerPax: 1200,
      hotelShanghaiPerNight: 450,
      hotelLiuzhouPerNight: 280,
      shanghaiNights: 5,
      liuzhouNights: 5,
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
]

const ciieCLabels = [
  { dateLabel: 'Mon 2 Nov' },
  { dateLabel: 'Tue 3 Nov' },
  { dateLabel: 'Wed 4 Nov' },
  { dateLabel: 'Thu 5 Nov', title: 'CIIE Day 1' },
  { dateLabel: 'Fri 6 Nov', title: 'CIIE Day 2' },
  { dateLabel: 'Sat 7 Nov', title: 'CIIE morning · transfer to Liuzhou' },
  { dateLabel: 'Sun 8 Nov' },
  { dateLabel: 'Mon 9 Nov' },
  { dateLabel: 'Tue 10 Nov' },
  { dateLabel: 'Wed 11 Nov' },
  { dateLabel: 'Thu 12 Nov' },
]

/** KLIA → Liuzhou (LRVTC) → Shanghai (fair) → KLIA */
function buildCiifAL(): TripOption {
  return {
    id: 'A1L',
    fair: 'CIIF',
    depth: 'A',
    routeOrder: 'liuzhou-first',
    name: 'A1L · CIIF + Protect Liuzhou (LZH first)',
    tagline: 'Full ~3.5-day LRVTC first, then compressed fair in Shanghai.',
    durationDays: 9,
    durationLabel: '~8–9 days',
    fairDays: 1.5,
    LRVTCDays: 3.5,
    LRVTCMode: 'full',
    windowLabel: '9–17 Oct 2026 (LRVTC then CIIF 12–16 Oct)',
    highlights: [
      'LRVTC completed before fair fatigue sets in',
      'Still samples CIIF robotics / automation exhibits',
      'Return from Shanghai simplifies PVG→KUL ticketing',
    ],
    tradeoffs: [
      'Limited fair depth after a heavy LRVTC block',
      'Must reach Shanghai before fair closes (plan transfer carefully)',
    ],
    days: [
      {
        dayIndex: 0,
        dateLabel: 'Thu 9 Oct',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: [
          'Group departure from KLIA toward Liuzhou',
          'Typical path: KUL→CAN→LZH or KUL→PVG→LZH — times TBC',
        ],
      },
      {
        dayIndex: 1,
        dateLabel: 'Fri 10 Oct',
        title: 'Arrive Liuzhou · LRVTC prep',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: [
          'Hotel check-in; confirm LRVTC host and transport',
          'Safety / etiquette briefing for campus programme',
        ],
      },
      {
        dayIndex: 2,
        dateLabel: 'Sat 11 Oct',
        title: 'LRVTC — classroom briefing',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.classroom,
      },
      {
        dayIndex: 3,
        dateLabel: 'Sun 12 Oct',
        title: 'LRVTC — hands-on learning',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.handsOn,
      },
      {
        dayIndex: 4,
        dateLabel: 'Mon 13 Oct',
        title: 'LRVTC — day & night shift (start)',
        kind: 'LRVTC',
        location: 'LRVTC / partner site',
        blocks: [
          'Day shift supervised learning',
          'Safety induction for night observation',
          'Night shift learning begins',
        ],
      },
      {
        dayIndex: 5,
        dateLabel: 'Tue 14 Oct',
        title: 'Night shift wrap · fly to Shanghai',
        kind: 'transfer',
        location: 'LZH → PVG',
        blocks: [
          'Morning wrap of night-shift learning (~0.5 day)',
          'Afternoon/evening flight Liuzhou → Shanghai',
          'Hotel near NECC',
        ],
      },
      {
        dayIndex: 6,
        dateLabel: 'Wed 15 Oct',
        title: 'CIIF — focused scouting',
        kind: 'fair',
        location: 'NECC Shanghai · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dayIndex: 7,
        dateLabel: 'Thu 16 Oct',
        title: 'CIIF half-day · depart KLIA',
        kind: 'debrief',
        location: 'NECC → PVG → KLIA',
        blocks: [
          'Morning follow-up booths / vendor close-outs',
          'Joint debrief notes',
          'Evening departure PVG → KLIA',
        ],
      },
      {
        dayIndex: 8,
        dateLabel: 'Fri 17 Oct',
        title: 'Arrive KLIA',
        kind: 'travel',
        location: 'KLIA',
        blocks: ['Arrival KLIA; trip report kickoff within 5 working days'],
      },
    ],
    costs: {
      intlFlightPerPax: 2200,
      domesticFlightsPerPax: 1200,
      hotelShanghaiPerNight: 450,
      hotelLiuzhouPerNight: 280,
      shanghaiNights: 2,
      liuzhouNights: 5,
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
    tagline: 'Compressed LRVTC first, then 2–3 solid fair days in Shanghai.',
    durationDays: 8,
    durationLabel: '~7–8 days',
    fairDays: 2.5,
    LRVTCDays: 2,
    LRVTCMode: 'compressed',
    windowLabel: '10–17 Oct 2026 (LRVTC then CIIF 12–16 Oct)',
    highlights: [
      'Protects fair coverage after a short LRVTC block',
      'Closest to ~7-day envelope with Liuzhou-first order',
      'Return from PVG after the fair',
    ],
    tradeoffs: [
      'Night-shift learning omitted or shortened',
      'Less ECRL process immersion than full LRVTC options',
    ],
    days: [
      {
        dayIndex: 0,
        dateLabel: 'Fri 10 Oct',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: ['Evening departure toward Liuzhou; group travel protocol'],
      },
      {
        dayIndex: 1,
        dateLabel: 'Sat 11 Oct',
        title: 'Arrive Liuzhou · LRVTC orientation',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: ['Hotel check-in', 'Host orientation call / campus map'],
      },
      {
        dayIndex: 2,
        dateLabel: 'Sun 12 Oct',
        title: 'LRVTC compressed — briefing + hands-on',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: [
          'Morning: classroom briefing (railway processes / ECRL lens)',
          'Afternoon: condensed hands-on / lab',
          'Night shift omitted in this option',
        ],
      },
      {
        dayIndex: 3,
        dateLabel: 'Mon 13 Oct',
        title: 'LRVTC wrap · fly to Shanghai',
        kind: 'transfer',
        location: 'LZH → PVG',
        blocks: [
          'Half-day site walk / Q&A close-out',
          'Afternoon flight to Shanghai',
          'Hotel near NECC; assign fair scout roles',
        ],
      },
      {
        dayIndex: 4,
        dateLabel: 'Tue 14 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dayIndex: 5,
        dateLabel: 'Wed 15 Oct',
        title: 'CIIF Day 2',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Deep-dive booths shortlisted on Day 1',
          'Vendor demos: digital twin + sensor fusion for logistics',
        ],
      },
      {
        dayIndex: 6,
        dateLabel: 'Thu 16 Oct',
        title: 'CIIF morning · depart KLIA',
        kind: 'debrief',
        location: 'NECC → PVG → KLIA',
        blocks: [
          'Final vendor meetings',
          'Team debrief notes',
          'Afternoon/evening PVG → KLIA',
        ],
      },
      {
        dayIndex: 7,
        dateLabel: 'Fri 17 Oct',
        title: 'Arrive KLIA',
        kind: 'travel',
        location: 'KLIA',
        blocks: ['Arrival; schedule internal readout'],
      },
    ],
    costs: {
      intlFlightPerPax: 2200,
      domesticFlightsPerPax: 1200,
      hotelShanghaiPerNight: 450,
      hotelLiuzhouPerNight: 280,
      shanghaiNights: 3,
      liuzhouNights: 3,
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
    tagline: 'Full LRVTC first, then 2–3 fair days + buffers in Shanghai.',
    durationDays: 11,
    durationLabel: '~10–12 days',
    fairDays: 2.5,
    LRVTCDays: 3.5,
    LRVTCMode: 'full',
    windowLabel: '7–18 Oct 2026 (LRVTC then CIIF 12–16 Oct)',
    highlights: [
      'Full LRVTC before fair days',
      'Solid CIIF robotics / digital twin / sensors coverage',
      'Buffers on both city legs for a 6–8 person group',
    ],
    tradeoffs: [
      'Longer trip and higher cost',
      'Fair starts after several intensive LRVTC days',
    ],
    days: [
      {
        dayIndex: 0,
        dateLabel: 'Tue 7 Oct',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: ['Group departure with connection buffer'],
      },
      {
        dayIndex: 1,
        dateLabel: 'Wed 8 Oct',
        title: 'Arrive Liuzhou · settle',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: ['Hotel check-in', 'Confirm LRVTC programme with host'],
      },
      {
        dayIndex: 2,
        dateLabel: 'Thu 9 Oct',
        title: 'LRVTC — classroom',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.classroom,
      },
      {
        dayIndex: 3,
        dateLabel: 'Fri 10 Oct',
        title: 'LRVTC — hands-on',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.handsOn,
      },
      {
        dayIndex: 4,
        dateLabel: 'Sat 11 Oct',
        title: 'LRVTC — day & night shift',
        kind: 'LRVTC',
        location: 'LRVTC / partner site',
        blocks: LRVTCFullBlocks.dayNight,
      },
      {
        dayIndex: 5,
        dateLabel: 'Sun 12 Oct',
        title: 'Wrap LRVTC · fly to Shanghai',
        kind: 'transfer',
        location: 'LZH → PVG',
        blocks: [
          'Morning host thanks / documentation buffer',
          'Afternoon flight to Shanghai',
          'NECC area hotel; fair walking plan',
        ],
      },
      {
        dayIndex: 6,
        dateLabel: 'Mon 13 Oct',
        title: 'CIIF Day 1',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: fairFocusCiif,
      },
      {
        dayIndex: 7,
        dateLabel: 'Tue 14 Oct',
        title: 'CIIF Day 2',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Robotics & automation deep dive',
          'Sensor / IoT for logistics yards',
        ],
      },
      {
        dayIndex: 8,
        dateLabel: 'Wed 15 Oct',
        title: 'CIIF morning · buffer',
        kind: 'fair',
        location: 'NECC · CIIF',
        blocks: [
          'Priority vendor close-outs',
          'Afternoon buffer / materials consolidation',
        ],
      },
      {
        dayIndex: 9,
        dateLabel: 'Thu 16 Oct',
        title: 'Documentation · prep departure',
        kind: 'debrief',
        location: 'Shanghai',
        blocks: [
          'Structured capture: tech findings + process maps',
          'Assign post-trip report owners',
        ],
      },
      {
        dayIndex: 10,
        dateLabel: 'Fri 17 Oct',
        title: 'Return to KLIA',
        kind: 'travel',
        location: 'PVG → KLIA',
        blocks: ['Depart Shanghai for KLIA'],
      },
    ],
    costs: {
      intlFlightPerPax: 2400,
      domesticFlightsPerPax: 1300,
      hotelShanghaiPerNight: 450,
      hotelLiuzhouPerNight: 280,
      shanghaiNights: 5,
      liuzhouNights: 5,
      fairFeesPerPax: 150,
      localTransportPerDay: 120,
      mealsPerDay: 160,
      contingencyRate: 0.12,
    },
  }
}

const ciieALLabels = [
  { dateLabel: 'Sat 1 Nov' },
  { dateLabel: 'Sun 2 Nov' },
  { dateLabel: 'Mon 3 Nov' },
  { dateLabel: 'Tue 4 Nov' },
  { dateLabel: 'Wed 5 Nov' },
  { dateLabel: 'Thu 6 Nov', title: 'Night shift wrap · fly to Shanghai' },
  { dateLabel: 'Fri 7 Nov', title: 'CIIE — focused scouting' },
  { dateLabel: 'Sat 8 Nov', title: 'CIIE half-day · depart KLIA' },
  { dateLabel: 'Sun 9 Nov' },
]

const ciieBLLabels = [
  { dateLabel: 'Sun 2 Nov' },
  { dateLabel: 'Mon 3 Nov' },
  { dateLabel: 'Tue 4 Nov' },
  { dateLabel: 'Wed 5 Nov', title: 'LRVTC wrap · fly to Shanghai' },
  { dateLabel: 'Thu 6 Nov', title: 'CIIE Day 1' },
  { dateLabel: 'Fri 7 Nov', title: 'CIIE Day 2' },
  { dateLabel: 'Sat 8 Nov', title: 'CIIE morning · depart KLIA' },
  { dateLabel: 'Sun 9 Nov' },
]

const ciieCLLabels = [
  { dateLabel: 'Fri 31 Oct' },
  { dateLabel: 'Sat 1 Nov' },
  { dateLabel: 'Sun 2 Nov' },
  { dateLabel: 'Mon 3 Nov' },
  { dateLabel: 'Tue 4 Nov' },
  { dateLabel: 'Wed 5 Nov', title: 'Wrap LRVTC · fly to Shanghai' },
  { dateLabel: 'Thu 6 Nov', title: 'CIIE Day 1' },
  { dateLabel: 'Fri 7 Nov', title: 'CIIE Day 2' },
  { dateLabel: 'Sat 8 Nov', title: 'CIIE morning · buffer' },
  { dateLabel: 'Sun 9 Nov' },
  { dateLabel: 'Mon 10 Nov' },
]

/** KLIA → Liuzhou (LRVTC) → KLIA — no Shanghai fair */
function buildLiuzhouOnly(): TripOption {
  return {
    id: 'L1',
    fair: 'NONE',
    depth: 'C',
    routeOrder: 'liuzhou-only',
    name: 'L1 · Liuzhou only · Full LRVTC',
    tagline: 'Full ~3.5-day LRVTC programme with no Shanghai fair leg.',
    durationDays: 7,
    durationLabel: '~6–7 days',
    fairDays: 0,
    LRVTCDays: 3.5,
    LRVTCMode: 'full',
    windowLabel: 'Indicative mid-Oct 2026 (dates lock with LRVTC host)',
    highlights: [
      'Dedicated ECRL process immersion without fair travel fatigue',
      'Shorter trip and lower cost than dual-city packages',
      'Return via CAN or PVG hub with flexible connection buffers',
    ],
    tradeoffs: [
      'No CIIF / CIIE tech scouting on this trip',
      'Window depends entirely on LRVTC host confirmation',
    ],
    days: [
      {
        dayIndex: 0,
        dateLabel: 'Day 0 (TBC)',
        title: 'Depart KLIA → Liuzhou',
        kind: 'travel',
        location: 'KLIA → LZH (via CAN or PVG)',
        blocks: [
          'Group departure from KLIA toward Liuzhou',
          'Typical path: KUL→CAN→LZH or KUL→PVG→LZH — times TBC',
        ],
      },
      {
        dayIndex: 1,
        dateLabel: 'Day 1 (TBC)',
        title: 'Arrive Liuzhou · settle',
        kind: 'buffer',
        location: 'Liuzhou',
        blocks: [
          'Hotel check-in; confirm LRVTC host and transport',
          'Safety / etiquette briefing for campus programme',
        ],
      },
      {
        dayIndex: 2,
        dateLabel: 'Day 2 (TBC)',
        title: 'LRVTC — classroom briefing',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.classroom,
      },
      {
        dayIndex: 3,
        dateLabel: 'Day 3 (TBC)',
        title: 'LRVTC — hands-on learning',
        kind: 'LRVTC',
        location: 'LRVTC',
        blocks: LRVTCFullBlocks.handsOn,
      },
      {
        dayIndex: 4,
        dateLabel: 'Day 4 (TBC)',
        title: 'LRVTC — day & night shift',
        kind: 'LRVTC',
        location: 'LRVTC / partner site',
        blocks: LRVTCFullBlocks.dayNight,
      },
      {
        dayIndex: 5,
        dateLabel: 'Day 5 (TBC)',
        title: 'Wrap LRVTC · documentation',
        kind: 'debrief',
        location: 'Liuzhou',
        blocks: [
          'Morning host thanks / documentation buffer',
          'Structured capture: process maps and learning notes',
          'Assign post-trip report owners',
        ],
      },
      {
        dayIndex: 6,
        dateLabel: 'Day 6 (TBC)',
        title: 'Return to KLIA',
        kind: 'travel',
        location: 'LZH → KLIA (via CAN or PVG)',
        blocks: [
          'Depart Liuzhou via hub connection',
          'Arrive KLIA; trip report kickoff within 5 working days',
        ],
      },
    ],
    costs: {
      intlFlightPerPax: 2000,
      domesticFlightsPerPax: 900,
      hotelShanghaiPerNight: 450,
      hotelLiuzhouPerNight: 280,
      shanghaiNights: 0,
      liuzhouNights: 5,
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
  'liuzhou-only': 'Liuzhou only',
}

export const OPTIONS: TripOption[] = [
  buildCiifA(),
  shiftCiie(
    buildCiifA(),
    'A2',
    'A2 · CIIE + Protect Liuzhou',
    '3–11 Nov 2026 (around CIIE 5–10 Nov)',
    ciieALabels,
  ),
  buildCiifB(),
  shiftCiie(
    buildCiifB(),
    'B2',
    'B2 · CIIE + Protect Fair',
    '3–10 Nov 2026 (CIIE 5–10 Nov)',
    ciieBLabels,
  ),
  buildCiifC(),
  {
    ...shiftCiie(
      buildCiifC(),
      'C2',
      'C2 · CIIE + Full Depth',
      '2–12 Nov 2026 (CIIE 5–10 Nov)',
      ciieCLabels,
    ),
    recommended: false,
    tagline: 'Shanghai first: 2–3 CIIE days + full LRVTC + buffers.',
    highlights: [
      'Full LRVTC programme preserved',
      'CIIE coverage for Intelligent Industry & services-linked logistics tech',
      'Buffers for a 6–8 person group',
    ],
  },
  buildCiifAL(),
  {
    ...shiftCiie(
      buildCiifAL(),
      'A2L',
      'A2L · CIIE + Protect Liuzhou (LZH first)',
      '1–9 Nov 2026 (LRVTC then CIIE 5–10 Nov)',
      ciieALLabels,
    ),
    tagline: 'Full ~3.5-day LRVTC first, then compressed CIIE in Shanghai.',
  },
  buildCiifBL(),
  {
    ...shiftCiie(
      buildCiifBL(),
      'B2L',
      'B2L · CIIE + Protect Fair (LZH first)',
      '2–9 Nov 2026 (LRVTC then CIIE 5–10 Nov)',
      ciieBLLabels,
    ),
    tagline: 'Compressed LRVTC first, then 2–3 solid CIIE days.',
  },
  buildCiifCL(),
  {
    ...shiftCiie(
      buildCiifCL(),
      'C2L',
      'C2L · CIIE + Full Depth (LZH first)',
      '31 Oct–10 Nov 2026 (LRVTC then CIIE 5–10 Nov)',
      ciieCLLabels,
    ),
    tagline: 'Full LRVTC first, then 2–3 CIIE days + buffers in Shanghai.',
    highlights: [
      'Full LRVTC before CIIE',
      'CIIE Intelligent Industry & services-linked logistics tech',
      'Buffers for a 6–8 person group',
    ],
  },
  buildLiuzhouOnly(),
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
      c.hotelLiuzhouPerNight * c.liuzhouNights) *
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
  if (order === 'liuzhou-only') return 'KLIA → Liuzhou → KLIA'
  if (order === 'liuzhou-first') return 'KLIA → Liuzhou → Shanghai → KLIA'
  return 'KLIA → Shanghai → Liuzhou → KLIA'
}
