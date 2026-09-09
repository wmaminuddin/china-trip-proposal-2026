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
  if (routeOrder === 'liuzhou-only' || routeOrder === 'liuzhou-first') {
    const hubCode = hub === 'guangzhou' ? 'CAN' : 'PVG'
    switch (slot) {
      case 'outbound':
        return `Outbound · KLIA → ${hubCode}`
      case 'toLiuzhou':
        return `Connect · ${hubCode} → Liuzhou`
      case 'returnDomestic':
        return routeOrder === 'liuzhou-only'
          ? `Return domestic · Liuzhou → ${hubCode}`
          : 'Transfer · Liuzhou → Shanghai'
      case 'returnIntl':
        return routeOrder === 'liuzhou-only'
          ? `Return international · ${hubCode} → KLIA`
          : 'Return · Shanghai → KLIA'
    }
  }

  switch (slot) {
    case 'outbound':
      return 'Outbound · KLIA → Shanghai'
    case 'toLiuzhou':
      return 'Transfer · Shanghai → Liuzhou'
    case 'returnDomestic':
      return hub === 'guangzhou'
        ? 'Return domestic · Liuzhou → Guangzhou'
        : 'Return domestic · Liuzhou → Shanghai'
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
    label: 'Return domestic · Liuzhou → hub',
    legIds: { shanghai: 'lzh-pvg', guangzhou: 'lzh-can-kul' },
  },
  returnIntl: {
    label: 'Return international · hub → KLIA',
    legIds: { shanghai: 'pvg-kul', guangzhou: 'lzh-can-kul' },
  },
}

export function getSlotLegId(
  slot: FlightSlotId,
  hub: ReturnHub,
  routeOrder: RouteOrder,
): string {
  if (routeOrder === 'liuzhou-only') {
    // Hub for both outbound into LZH and return home.
    switch (slot) {
      case 'outbound':
        return hub === 'guangzhou' ? 'kul-can' : 'kul-pvg'
      case 'toLiuzhou':
        return hub === 'guangzhou' ? 'can-lzh' : 'pvg-lzh'
      case 'returnDomestic':
        return hub === 'guangzhou' ? 'lzh-can-kul' : 'lzh-pvg'
      case 'returnIntl':
        return hub === 'guangzhou' ? 'lzh-can-kul' : 'pvg-kul'
    }
  }

  if (routeOrder === 'liuzhou-first') {
    // Hub chooses outbound path into LZH; return after fair is always via Shanghai.
    switch (slot) {
      case 'outbound':
        return hub === 'guangzhou' ? 'kul-can' : 'kul-pvg'
      case 'toLiuzhou':
        return hub === 'guangzhou' ? 'can-lzh' : 'pvg-lzh'
      case 'returnDomestic':
        return 'lzh-pvg'
      case 'returnIntl':
        return 'pvg-kul'
    }
  }

  switch (slot) {
    case 'outbound':
      return 'kul-pvg'
    case 'toLiuzhou':
      return 'pvg-lzh'
    case 'returnDomestic':
      return hub === 'guangzhou' ? 'lzh-can-kul' : 'lzh-pvg'
    case 'returnIntl':
      return hub === 'guangzhou' ? 'lzh-can-kul' : 'pvg-kul'
  }
}

export function flightSummaryTitle(
  slot: FlightSlotId,
  hub: ReturnHub,
  routeOrder: RouteOrder,
): string {
  if (routeOrder === 'liuzhou-only' || routeOrder === 'liuzhou-first') {
    const hubCode = hub === 'guangzhou' ? 'CAN' : 'PVG'
    switch (slot) {
      case 'outbound':
        return `Outbound KUL → ${hubCode}`
      case 'toLiuzhou':
        return `${hubCode} → LZH`
      case 'returnDomestic':
        return routeOrder === 'liuzhou-only'
          ? hub === 'shanghai'
            ? 'LZH → PVG'
            : 'LZH → CAN'
          : 'LZH → PVG'
      case 'returnIntl':
        return routeOrder === 'liuzhou-only'
          ? hub === 'shanghai'
            ? 'PVG → KUL'
            : 'CAN → KUL'
          : 'PVG → KUL'
    }
  }

  switch (slot) {
    case 'outbound':
      return 'Outbound KUL → PVG'
    case 'toLiuzhou':
      return 'PVG → LZH'
    case 'returnDomestic':
      return hub === 'shanghai' ? 'LZH → PVG' : 'LZH → CAN'
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

/** For Guangzhou hub, domestic = LZH→CAN only; intl = CAN→KUL only */
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
    legId === 'lzh-can-kul'
  ) {
    if (slot === 'returnDomestic') {
      options = options.filter(
        (f) =>
          f.from.toUpperCase().includes('LZH') ||
          f.code.includes('CZ8264') ||
          f.to.toUpperCase().includes('CAN'),
      )
      const domestic = options.filter(
        (f) => f.from.includes('LZH') && f.to.includes('CAN'),
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
  const lodging =
    (shRate * c.shanghaiNights + lzRate * c.liuzhouNights) * pax

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
      order === 'liuzhou-first' ? 'Liuzhou → Shanghai flight' : 'Return domestic flight',
    )
  }
  if (!sel.returnIntl) missing.push('Return to KLIA flight')
  if (c.shanghaiNights > 0 && !sel.shanghaiHotel) missing.push('Shanghai hotel')
  if (!sel.liuzhouHotel) missing.push('Liuzhou hotel')

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
    shanghaiNights: c.shanghaiNights,
    liuzhouNights: c.liuzhouNights,
    missing,
    complete: missing.length === 0,
    usedFlightFallback: !flightsComplete || flightOneWays.some((f) => !f),
  }
}
