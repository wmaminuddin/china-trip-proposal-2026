export interface HotelOption {
  name: string
  brand: string
  stars: '4' | '4.5' | '5'
  address: string
  travelToVenue: string
  /** WGS84 latitude for map pin */
  lat: number
  /** WGS84 longitude for map pin */
  lng: number
  /** True when address is vague and pin is approximate */
  approx?: boolean
  /** Indicative nightly rate USD (economy/standard room, non-expo nights) */
  usdMin?: number
  usdMax?: number
  /** Rough MYR equivalent for planning (~USD 1 = MYR 4.45) */
  myrMin?: number
  myrMax?: number
  withinUsd120?: boolean
  notes?: string
  url?: string
}

export interface HotelCityBlock {
  id: string
  city: string
  venue: string
  summary: string
  venueLat?: number
  venueLng?: number
  hotels: HotelOption[]
}

const usdToMyr = (n: number) => Math.round(n * 4.45)

export const HOTEL_BLOCKS: HotelCityBlock[] = [
  {
    id: 'shanghai-necc',
    city: 'Shanghai',
    venue: 'NECC (CIIF / CIIE) — No. 333 Songze Avenue, Qingpu',
    venueLat: 31.1886,
    venueLng: 121.3037,
    summary:
      'Prefer Hongqiao / NECC-side hotels so commute stays under ~40 minutes by walk, metro, or taxi. Book early for fair weeks — rates spike and 4–5★ inventory fills fast.',
    hotels: [
      {
        name: 'InterContinental Shanghai Hongqiao NECC',
        brand: 'IHG · InterContinental',
        stars: '5',
        address: 'Gate 3, No. 1700 Zhuguang Road, Qingpu',
        travelToVenue: 'On-site / indoor link to NECC (~0–10 min walk)',
        lat: 31.1892,
        lng: 121.3058,
        usdMin: 110,
        usdMax: 280,
        myrMin: usdToMyr(110),
        myrMax: usdToMyr(280),
        withinUsd120: true,
        notes:
          'Best location for exhibition days. Published deals sometimes near ~USD 70–120 off-peak; expo weeks often exceed USD 120 (no upper limit applied).',
        url: 'https://www.ihg.com/intercontinental/hotels/gb/en/shanghai/shgic/hoteldetail',
      },
      {
        name: 'Mercure Shanghai NECC',
        brand: 'Accor · Mercure',
        stars: '4',
        address: 'No. 666 Panlong Road, Qingpu',
        travelToVenue: '~10–20 min walk / short taxi or metro (~15–25 min door-to-door)',
        lat: 31.1848,
        lng: 121.2965,
        usdMin: 55,
        usdMax: 140,
        myrMin: usdToMyr(55),
        myrMax: usdToMyr(140),
        withinUsd120: true,
        notes: 'Strong USD ~120 target fit on many non-peak dates; international 4★ brand.',
        url: 'https://all.accor.com/hotel/B158/index.en.shtml',
      },
      {
        name: 'Holiday Inn Express Shanghai Hongqiao NECC',
        brand: 'IHG · Holiday Inn Express',
        stars: '4',
        address: 'Lane 88, Lianyou Road, Minhang (Hongqiao / NECC corridor)',
        travelToVenue: '~8–15 min by car / taxi to NECC (within 40 min)',
        lat: 31.1755,
        lng: 121.3182,
        usdMin: 50,
        usdMax: 130,
        myrMin: usdToMyr(50),
        myrMax: usdToMyr(130),
        withinUsd120: true,
        notes: 'Practical group option; confirm shuttle / taxi plan for morning fair entry.',
        url: 'https://www.ihg.com/holidayinnexpress/hotels/gb/en/shanghai/shgex/hoteldetail',
      },
      {
        name: 'Cordis Shanghai Hongqiao',
        brand: 'Langham / Cordis',
        stars: '5',
        address: 'Hongqiao Hub / business district',
        travelToVenue: '~15–30 min by Metro Line 2 or taxi to NECC',
        lat: 31.1975,
        lng: 121.3205,
        approx: true,
        usdMin: 100,
        usdMax: 250,
        myrMin: usdToMyr(100),
        myrMax: usdToMyr(250),
        withinUsd120: true,
        notes: 'Excellent for SHA airport / HSR links; still inside 40 min to NECC in normal traffic.',
        url: 'https://www.cordishotels.com/en/shanghai-hongqiao',
      },
      {
        name: 'Grand Mercure Shanghai Hongqiao',
        brand: 'Accor · Grand Mercure',
        stars: '5',
        address: 'Hongqiao business district',
        travelToVenue: '~20–35 min taxi / metro to NECC',
        lat: 31.1958,
        lng: 121.3172,
        approx: true,
        usdMin: 90,
        usdMax: 220,
        myrMin: usdToMyr(90),
        myrMax: usdToMyr(220),
        withinUsd120: true,
        notes: 'International 5★; often near target midweek outside mega-events.',
      },
      {
        name: 'Crowne Plaza Shanghai (Hongqiao / city options)',
        brand: 'IHG · Crowne Plaza',
        stars: '5',
        address: 'Confirm Hongqiao-area property when booking',
        travelToVenue: 'Select a Hongqiao-side CP so taxi/metro ≤40 min to NECC',
        lat: 31.1942,
        lng: 121.3248,
        approx: true,
        usdMin: 100,
        usdMax: 220,
        myrMin: usdToMyr(100),
        myrMax: usdToMyr(220),
        withinUsd120: true,
        notes: 'Multiple Crowne Plaza properties in Shanghai — filter by distance to NECC before locking.',
        url: 'https://www.ihg.com/crowneplaza/hotels/gb/en/reservation',
      },
    ],
  },
  {
    id: 'liuzhou-lrvtc',
    city: 'Liuzhou',
    venue: 'LRVTC — primary campus often cited at No. 2 Wenyuan Rd, Guantang / Yufeng (confirm host campus)',
    venueLat: 24.3655,
    venueLng: 109.4852,
    summary:
      'International 4–5★ inventory is concentrated in the city / riverside CBD. Guantang (new) campus is typically ~20–40 min by car from CBD hotels — book vans for the group and confirm which LRVTC campus hosts the programme.',
    hotels: [
      {
        name: 'Radisson Blu Hotel, Liuzhou',
        brand: 'Radisson Blu',
        stars: '5',
        address: 'Riverside / business district, Liuzhou',
        travelToVenue: '~25–40 min by car to Guantang campus (traffic dependent); closer to Heping Rd campus if used',
        lat: 24.3258,
        lng: 109.4155,
        approx: true,
        usdMin: 70,
        usdMax: 160,
        myrMin: usdToMyr(70),
        myrMax: usdToMyr(160),
        withinUsd120: true,
        notes: 'International brand; strong default for ITaLI+DDE group stay.',
        url: 'https://www.radissonhotels.com/en-us/hotels/radisson-blu-liuzhou',
      },
      {
        name: 'Wanda Realm Liuzhou',
        brand: 'Wanda Realm',
        stars: '5',
        address: 'No. 256 East Ring Avenue, Chengzhong District',
        travelToVenue: '~25–40 min by car to Guantang / Liudong area',
        lat: 24.3285,
        lng: 109.4288,
        usdMin: 65,
        usdMax: 150,
        myrMin: usdToMyr(65),
        myrMax: usdToMyr(150),
        withinUsd120: true,
        notes: 'Next to Wanda Plaza; good dining / meeting rooms for evening debriefs.',
        url: 'https://www.wandarealmliuzhou.cn/',
      },
      {
        name: 'Hyatt Place Liuzhou',
        brand: 'Hyatt Place',
        stars: '4',
        address: 'Liuzhou city',
        travelToVenue: '~25–40 min by car to Guantang campus',
        lat: 24.3212,
        lng: 109.4085,
        approx: true,
        usdMin: 60,
        usdMax: 140,
        myrMin: usdToMyr(60),
        myrMax: usdToMyr(140),
        withinUsd120: true,
        notes: 'International select-service 4★; usually fits ~USD 120 band.',
        url: 'https://www.hyatt.com/hyatt-place',
      },
      {
        name: 'LiuZhou Imperial Dragon Bay Purejoy Hotel',
        brand: 'Purejoy / local 5★',
        stars: '5',
        address: 'Liuzhou city',
        travelToVenue: '~20–40 min by car depending on campus',
        lat: 24.3482,
        lng: 109.4225,
        approx: true,
        usdMin: 55,
        usdMax: 130,
        myrMin: usdToMyr(55),
        myrMax: usdToMyr(130),
        withinUsd120: true,
        notes: 'Local 5★; verify English-speaking front desk for group check-in.',
      },
    ],
  },
]

export const HOTEL_NOTES = [
  'Target: international 4–5★, ≤40 minutes to venue, prefer ~USD 120 / night when available; if unavailable (esp. fair weeks), book next best 4–5★ with no upper limit.',
  'Rates below are indicative standard-room bands in USD (and approx. MYR at 4.45). Taxes, breakfast, and expo surcharges not included.',
  'Shanghai: stay Hongqiao / NECC side — do not book Bund / Lujiazui hotels (often >40–60 min to NECC).',
  'Liuzhou: confirm LRVTC campus (Guantang vs Heping Road) with the host before final hotel choice; arrange daily group transfer.',
  'ITaLI hotel cost in Annex C uses planning bands; pick concrete properties here then refresh the budget.',
  'Map pins are indicative planning aids — confirm exact property location before booking.',
]
