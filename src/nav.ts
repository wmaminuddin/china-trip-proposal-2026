export const ROUTES = [
  'summary',
  'package',
  'options',
  'flights',
  'hotels',
  'budget',
  'lrvtc',
  'admin',
] as const

export type AppRoute = (typeof ROUTES)[number]

export const DEFAULT_ROUTE: AppRoute = 'summary'

const LEGACY: Record<string, AppRoute> = {
  itinerary: 'options',
  checklist: 'admin',
  logistics: 'admin',
  LRVTC: 'lrvtc',
}

export function parseHash(hash: string): AppRoute {
  const raw = hash.replace(/^#/, '').trim()
  if (!raw) return DEFAULT_ROUTE
  if (LEGACY[raw]) return LEGACY[raw]
  const lower = raw.toLowerCase()
  if (LEGACY[lower]) return LEGACY[lower]
  if ((ROUTES as readonly string[]).includes(lower)) return lower as AppRoute
  return DEFAULT_ROUTE
}

export function routeHash(route: AppRoute): string {
  return `#${route}`
}

/** Normalize empty/invalid hash; return current route. */
export function syncHashFromLocation(): AppRoute {
  const parsed = parseHash(window.location.hash)
  const current = window.location.hash.replace(/^#/, '')
  if (!window.location.hash || current.toLowerCase() !== parsed) {
    window.history.replaceState(null, '', routeHash(parsed))
  }
  return parsed
}

export function navigate(route: AppRoute) {
  if (parseHash(window.location.hash) === route && window.location.hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.location.hash = route
}
