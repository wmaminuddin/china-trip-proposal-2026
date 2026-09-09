import { useEffect, useMemo, useState } from 'react'
import { NAV_ITEMS, PROPOSAL_META } from './data/content'
import {
  DEFAULT_OPTION_ID,
  OPTIONS,
  getOption,
  type FairId,
  type RouteOrder,
} from './data/options'
import type { FlightSlotId, ReturnHub } from './data/composer'
import { MAX_COMPARE, OptionMatrix, ItinerarySection } from './components/Options'
import { ComposerSection } from './components/Composer'
import {
  BudgetSection,
  ChecklistSection,
  ExecSummary,
  FlightsSection,
  HotelsSection,
  LogisticsSection,
  LRVTCSection,
} from './components/Sections'
import {
  type AppRoute,
  DEFAULT_ROUTE,
  navigate,
  parseHash,
  syncHashFromLocation,
} from './nav'
import './App.css'

type FairFilter = 'ALL' | FairId
type DepthFilter = 'ALL' | 'A' | 'B' | 'C'
type RouteFilter = 'ALL' | RouteOrder

const emptyFlights: Record<FlightSlotId, string | null> = {
  outbound: null,
  toLiuzhou: null,
  returnDomestic: null,
  returnIntl: null,
}

function App() {
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? syncHashFromLocation() : DEFAULT_ROUTE,
  )
  const [printAll, setPrintAll] = useState(false)
  const [selectedId, setSelectedId] = useState(DEFAULT_OPTION_ID)
  const [fairFilter, setFairFilter] = useState<FairFilter>('ALL')
  const [depthFilter, setDepthFilter] = useState<DepthFilter>('ALL')
  const [routeFilter, setRouteFilter] = useState<RouteFilter>('ALL')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [hub, setHub] = useState<ReturnHub>('shanghai')
  const [flightKeys, setFlightKeys] = useState(emptyFlights)
  const [shanghaiHotelName, setShanghaiHotelName] = useState<string | null>(null)
  const [liuzhouHotelName, setLiuzhouHotelName] = useState<string | null>(null)

  const selected = useMemo(() => getOption(selectedId), [selectedId])

  useEffect(() => {
    syncHashFromLocation()
    const onHash = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!printAll) return
    const after = () => setPrintAll(false)
    window.addEventListener('afterprint', after)
    const t = window.setTimeout(() => window.print(), 100)
    const fallback = window.setTimeout(() => setPrintAll(false), 2000)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(fallback)
      window.removeEventListener('afterprint', after)
    }
  }, [printAll])

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  function selectOption(id: string) {
    const next = getOption(id)
    const prev = getOption(selectedId)
    setSelectedId(id)
    if (next.routeOrder !== prev.routeOrder) {
      setFlightKeys(emptyFlights)
    }
    navigate('package')
    setRoute('package')
  }

  function openOptionDetails(id: string) {
    setSelectedId(id)
    navigate('options')
    setRoute('options')
  }

  function selectFair(fair: FairId) {
    if (fair === 'NONE') {
      const only = OPTIONS.find((o) => o.id === 'L1')
      if (only) {
        const prev = selected
        setSelectedId(only.id)
        setFairFilter('NONE')
        if (only.routeOrder !== prev.routeOrder) {
          setFlightKeys(emptyFlights)
        }
      }
      return
    }

    const preferOrder =
      selected.routeOrder === 'liuzhou-only' ? 'shanghai-first' : selected.routeOrder
    const match =
      OPTIONS.find(
        (o) =>
          o.fair === fair &&
          o.depth === selected.depth &&
          o.routeOrder === preferOrder,
      ) ??
      OPTIONS.find((o) => o.fair === fair && o.depth === selected.depth) ??
      OPTIONS.find((o) => o.fair === fair && o.depth === 'C' && o.routeOrder === preferOrder) ??
      OPTIONS.find((o) => o.fair === fair && o.depth === 'C') ??
      OPTIONS.find((o) => o.fair === fair)
    if (match) {
      const prev = selected
      setSelectedId(match.id)
      setFairFilter(fair)
      if (match.routeOrder !== prev.routeOrder) {
        setFlightKeys(emptyFlights)
      }
    }
  }

  function pickFlight(slot: FlightSlotId, key: string) {
    setFlightKeys((prev) => ({ ...prev, [slot]: key }))
  }

  function changeHub(next: ReturnHub) {
    setHub(next)
    if (selected.routeOrder === 'liuzhou-only') {
      setFlightKeys(emptyFlights)
    } else if (selected.routeOrder === 'liuzhou-first') {
      setFlightKeys((prev) => ({
        ...prev,
        outbound: null,
        toLiuzhou: null,
      }))
    } else {
      setFlightKeys((prev) => ({
        ...prev,
        returnDomestic: null,
        returnIntl: null,
      }))
    }
  }

  const show = (r: AppRoute) => printAll || route === r

  const packageProps = {
    option: selected,
    onOptionChange: selectOption,
    hub,
    onHubChange: changeHub,
    flightKeys,
    onFlightPick: pickFlight,
    shanghaiHotelName,
    liuzhouHotelName,
    onShanghaiHotel: setShanghaiHotelName,
    onLiuzhouHotel: setLiuzhouHotelName,
  }

  return (
    <div className={`app${printAll ? ' print-all' : ''}`}>
      <header className="topbar no-print-offset">
        <div className="brand">
          <span className="brand-mark">CTP26</span>
          <div>
            <strong>{PROPOSAL_META.title}</strong>
            <small>ITaLI · DDE joint proposal</small>
          </div>
        </div>
        <nav className="nav no-print" aria-label="Section">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={route === item.id ? 'active' : undefined}
              onClick={() => setRoute(item.id as AppRoute)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions no-print">
          <button type="button" className="btn ghost compact" onClick={() => window.print()}>
            Print
          </button>
          <button type="button" className="btn primary compact" onClick={() => setPrintAll(true)}>
            Print full
          </button>
        </div>
      </header>

      <main>
        {show('summary') && (
          <ExecSummary
            option={selected}
            onSelectFair={selectFair}
            onBuildPackage={() => {
              navigate('package')
              setRoute('package')
            }}
          />
        )}
        {show('package') && <ComposerSection {...packageProps} />}
        {show('options') && (
          <>
            <OptionMatrix
              options={OPTIONS}
              selectedId={selectedId}
              compareIds={compareIds}
              fairFilter={fairFilter}
              depthFilter={depthFilter}
              routeFilter={routeFilter}
              onSelect={openOptionDetails}
              onUseInPackage={selectOption}
              onFairFilter={setFairFilter}
              onDepthFilter={setDepthFilter}
              onRouteFilter={setRouteFilter}
              onToggleCompare={toggleCompare}
              onClearCompare={() => setCompareIds([])}
            />
            <ItinerarySection option={selected} />
          </>
        )}
        {show('flights') && <FlightsSection />}
        {show('hotels') && <HotelsSection />}
        {show('budget') && <BudgetSection option={selected} />}
        {show('lrvtc') && <LRVTCSection />}
        {show('admin') && (
          <div id="admin" className="admin-page">
            <ChecklistSection />
            <LogisticsSection />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Indicative planning document · Fair dates per official CIIF / CIIE announcements · LRVTC
          programme subject to host confirmation · Flight times TBC
        </p>
      </footer>
    </div>
  )
}

export default App
