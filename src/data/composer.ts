import { FLIGHT_LEGS, type FlightOption } from './flights'
import { HOTEL_BLOCKS, type HotelOption } from './hotels'
import {
  ITALI_BUDGET_PAX,
  type RouteOrder,
  type TripOption,
} from './options'

export type ReturnHub = 'shanghai' | 'guangzhou'

export type FlightSlotId =
  | 'outbound'
  | 'toLiuzhou'
  | 'returnDomestic'
  | 'returnIntl'

export const FLIGHT_SLOT_IDS: FlightSlotId[] = [
  'outbound',
  'toLiuzhou',
  'returnDomestic',
  'returnIntl',
]

export function slotLabel(
  slot: FlightSlotId,
  hub: ReturnHub,
  routeOrder: RouteOrder,
): string {
  const hubCode = hub === 'guangzhou' ? 'CAN' : 'PVG'

  if (routeOrder === 'liuzhou-only') {
    switch (slot) {
      case 'outbound':
        return `Outbound · KLIA → ${hubCode}`
      case 'toLiuzhou':
        return `Connect · ${hubCode} → Liuzhou`
      case 'returnDomestic':
        return `Return domestic · Wuhan → ${hubCode}`
      case 'returnIntl':
        return `Return international · ${hubCode} → KLIA`
    }
  }

  if (routeOrder === 'liuzhou-first') {
    switch (slot) {
      case 'outbound':
        return `Outbound · KLIA → ${hubCode}`
      case 'toLiuzhou':
        return `Connect · ${hubCode} → Liuzhou`
      case 'returnDomestic':
        return 'Transfer · Wuhan → Shanghai'
      case 'returnIntl':
        return 'Return · Shanghai → KLIA'
    }
  }

  switch (slot) {
    case 'outbound':
      return 'Outbound · KLIA → Shanghai'
    case 'toLiuzhou':
      return 'Transfer · Shanghai → Liuzhou'
    case 'returnDomestic':
      return hub === 'guangzhou'
        ? 'Return domestic · Wuhan → Guangzhou'
        : 'Return domestic · Wuhan → Shanghai'
    case 'returnIntl':
      return hub === 'guangzhou'
        ? 'Return international · Guangzhou → KLIA'
        : 'Return international · Shanghai → KLIA'
  }
}

/** @deprecated Prefer slotLabel(slot, hub, routeOrder) */
export const FLIGHT_SLOT_META: Record<
  FlightSlotId,
  { label: string; legIds: Record<ReturnHub, string> | string }
> = {
  outbound: { label: 'Outbound · KLIA → Shanghai', legIds: 'kul-pvg' },
  toLiuzhou: { label: 'Transfer · Shanghai → Liuzhou', legIds: 'pvg-lzh' },
  returnDomestic: {
    label: 'Return domestic · Wuhan → hub',
    legIds: { shanghai: 'wuh-pvg', guangzhou: 'wuh-can-kul' },
  },
  returnIntl: {
    label: 'Return international · hub → KLIA',
    legIds: { shanghai: 'pvg-kul', guangzhou: 'wuh-can-kul' },
  },
}

export function getSlotLegId(
  slot: FlightSlotId,
  hub: ReturnHub,
  routeOrder: RouteOrder,
): string {
  if (routeOrder === 'liuzhou-only') {
    // Hub for outbound into LZH; return home from Wuhan via same hub.
    switch (slot) {
      case 'outbound':
        return hub === 'guangzhou' ? 'kul-can' : 'kul-pvg'
      case 'toLiuzhou':
        return hub === 'guangzhou' ? 'can-lzh' : 'pvg-lzh'
      case 'returnDomestic':
        return hub === 'guangzhou' ? 'wuh-can-kul' : 'wuh-pvg'
      case 'returnIntl':
        return hub === 'guangzhou' ? 'wuh-can-kul' : 'pvg-kul'
    }
  }

  if (routeOrder === 'liuzhou-first') {
    // Hub chooses outbound into LZH; after Wuhan, transfer WUH→PVG for fair; home PVG→KUL.
    switch (slot) {
      case 'outbound':
        return hub === 'guangzhou' ? 'kul-can' : 'kul-pvg'
      case 'toLiuzhou':
        return hub === 'guangzhou' ? 'can-lzh' : 'pvg-lzh'
      case 'returnDomestic':
        return 'wuh-pvg'
      case 'returnIntl':
        return 'pvg-kul'
    }
  }

  // shanghai-first: end in Wuhan
  switch (slot) {
    case 'outbound':
      return 'kul-pvg'
    case 'toLiuzhou':
      return 'pvg-lzh'
    case 'returnDomestic':
      return hub === 'guangzhou' ? 'wuh-can-kul' : 'wuh-pvg'
    case 'returnIntl':
      return hub === 'guangzhou' ? 'wuh-can-kul' : 'pvg-kul'
  }
}

export function flightSummaryTitle(
  slot: FlightSlotId,
  hub: ReturnHub,
  routeOrder: RouteOrder,
): string {
  const hubCode = hub === 'guangzhou' ? 'CAN' : 'PVG'

  if (routeOrder === 'liuzhou-only') {
    switch (slot) {
      case 'outbound':
        return `Outbound KUL → ${hubCode}`
      case 'toLiuzhou':
        return `${hubCode} → LZH`
      case 'returnDomestic':
        return hub === 'shanghai' ? 'WUH → PVG' : 'WUH → CAN'
      case 'returnIntl':
        return hub === 'shanghai' ? 'PVG → KUL' : 'CAN → KUL'
    }
  }

  if (routeOrder === 'liuzhou-first') {
    switch (slot) {
      case 'outbound':
        return `Outbound KUL → ${hubCode}`
      case 'toLiuzhou':
        return `${hubCode} → LZH`
      case 'returnDomestic':
        return 'WUH → PVG'
      case 'returnIntl':
        return 'PVG → KUL'
    }
  }

  switch (slot) {
    case 'outbound':
      return 'Outbound KUL → PVG'
    case 'toLiuzhou':
      return 'PVG → LZH'
    case 'returnDomestic':
      return hub === 'shanghai' ? 'WUH → PVG' : 'WUH → CAN'
    case 'returnIntl':
      return hub === 'shanghai' ? 'PVG → KUL' : 'CAN → KUL'
  }
}

export function flightKey(legId: string, flight: FlightOption): string {
  return `${legId}::${flight.code}::${flight.depart}`
}

export function parseFlightKey(key: string): { legId: string; code: string; depart: string } | null {
  const parts = key.split('::')
  if (parts.length < 3) return null
  return { legId: parts[0], code: parts[1], depart: parts.slice(2).join('::') }
}

export function getLegOptions(legId: string): FlightOption[] {
  return FLIGHT_LEGS.find((l) => l.id === legId)?.options ?? []
}

export function resolveFlight(key: string | null): (FlightOption & { legId: string }) | null {
  if (!key) return null
  const parsed = parseFlightKey(key)
  if (!parsed) return null
  const flight = getLegOptions(parsed.legId).find(
    (f) => f.code === parsed.code && f.depart === parsed.depart,
  )
  if (!flight) return null
  return { ...flight, legId: parsed.legId }
}

/** For Guangzhou hub, domestic = WUH→CAN only; intl = CAN→KUL only */
export function optionsForSlot(
  slot: FlightSlotId,
  hub: ReturnHub,
  routeOrder: RouteOrder = 'shanghai-first',
): { legId: string; options: FlightOption[] } {
  const legId = getSlotLegId(slot, hub, routeOrder)
  let options = getLegOptions(legId)

  if (
    (routeOrder === 'shanghai-first' || routeOrder === 'liuzhou-only') &&
    hub === 'guangzhou' &&
    legId === 'wuh-can-kul'
  ) {
    if (slot === 'returnDomestic') {
      const domestic = options.filter(
        (f) => f.from.includes('WUH') && f.to.includes('CAN'),
      )
      if (domestic.length) options = domestic
    }
    if (slot === 'returnIntl') {
      options = options.filter(
        (f) => f.from.includes('CAN') && f.to.includes('KUL'),
      )
    }
  }

  return { legId, options }
}

export function getShanghaiHotels(): HotelOption[] {
  return HOTEL_BLOCKS.find((b) => b.id === 'shanghai-necc')?.hotels ?? []
}

export function getLiuzhouHotels(): HotelOption[] {
  return HOTEL_BLOCKS.find((b) => b.id === 'liuzhou-lrvtc')?.hotels ?? []
}

export function getWuhanHotels(): HotelOption[] {
  return HOTEL_BLOCKS.find((b) => b.id === 'wuhan-crrc')?.hotels ?? []
}

export function mid(min?: number, max?: number): number | null {
  if (min == null && max == null) return null
  if (min != null && max != null) return Math.round((min + max) / 2)
  return min ?? max ?? null
}

export interface ComposerSelections {
  option: TripOption
  hub: ReturnHub
  outbound: (FlightOption & { legId: string }) | null
  toLiuzhou: (FlightOption & { legId: string }) | null
  returnDomestic: (FlightOption & { legId: string }) | null
  returnIntl: (FlightOption & { legId: string }) | null
  shanghaiHotel: HotelOption | null
  liuzhouHotel: HotelOption | null
  wuhanHotel: HotelOption | null
}

export function calcSelectedBudget(sel: ComposerSelections, pax: number = ITALI_BUDGET_PAX) {
  const c = sel.option.costs
  const tripDays = sel.option.durationDays
  const order = sel.option.routeOrder

  const flightOneWays = [sel.outbound, sel.toLiuzhou, sel.returnDomestic, sel.returnIntl]
  let flightsPerPax = 0
  let flightsComplete = true
  for (const f of flightOneWays) {
    if (!f) {
      flightsComplete = false
      continue
    }
    const m = mid(f.priceMyrMin, f.priceMyrMax)
    if (m == null) {
      flightsComplete = false
    } else {
      flightsPerPax += m
    }
  }
  // Fallback to option planning bands for any missing flight prices
  if (!flightsComplete || flightOneWays.some((f) => !f)) {
    flightsPerPax = c.intlFlightPerPax + c.domesticFlightsPerPax
  }
  const flights = flightsPerPax * pax

  const shRate = mid(sel.shanghaiHotel?.myrMin, sel.shanghaiHotel?.myrMax) ?? c.hotelShanghaiPerNight
  const lzRate = mid(sel.liuzhouHotel?.myrMin, sel.liuzhouHotel?.myrMax) ?? c.hotelLiuzhouPerNight
  const whRate = mid(sel.wuhanHotel?.myrMin, sel.wuhanHotel?.myrMax) ?? c.hotelWuhanPerNight
  const lodging =
    (shRate * c.shanghaiNights + lzRate * c.liuzhouNights + whRate * c.wuhanNights) * pax

  const fair = c.fairFeesPerPax * pax
  const local = c.localTransportPerDay * tripDays * pax
  const meals = c.mealsPerDay * tripDays * pax
  const subtotal = lodging + flights + fair + local + meals
  const contingency = Math.round(subtotal * c.contingencyRate)
  const total = subtotal + contingency

  const missing: string[] = []
  if (!sel.outbound) missing.push('Outbound flight')
  if (!sel.toLiuzhou) {
    missing.push(
      order === 'shanghai-first' ? 'Shanghai → Liuzhou flight' : 'Hub → Liuzhou flight',
    )
  }
  if (!sel.returnDomestic) {
    missing.push(
      order === 'liuzhou-first' ? 'Wuhan → Shanghai flight' : 'Return domestic flight',
    )
  }
  if (!sel.returnIntl) missing.push('Return to KLIA flight')
  if (c.shanghaiNights > 0 && !sel.shanghaiHotel) missing.push('Shanghai hotel')
  if (c.liuzhouNights > 0 && !sel.liuzhouHotel) missing.push('Liuzhou hotel')
  if (c.wuhanNights > 0 && !sel.wuhanHotel) missing.push('Wuhan hotel')

  return {
    lodging,
    flights,
    flightsPerPax,
    fair,
    local,
    meals,
    subtotal,
    contingency,
    total,
    perPax: Math.round(total / pax),
    pax,
    shanghaiRateUsed: shRate,
    liuzhouRateUsed: lzRate,
    wuhanRateUsed: whRate,
    shanghaiNights: c.shanghaiNights,
    liuzhouNights: c.liuzhouNights,
    wuhanNights: c.wuhanNights,
    missing,
    complete: missing.length === 0,
    usedFlightFallback: !flightsComplete || flightOneWays.some((f) => !f),
  }
}
