import type { FairId, RouteOrder, TripOption } from '../data/options'
import { DEPTH_LABELS } from '../data/content'
import {
  formatMyr,
  calcBudget,
  ITALI_BUDGET_PAX,
  ROUTE_ORDER_LABELS,
  routeStripLabel,
} from '../data/options'
import { kindClassMap } from './timelineKinds'

const kindClass = kindClassMap


export const MAX_COMPARE = 3

interface Props {
  options: TripOption[]
  selectedId: string
  compareIds: string[]
  fairFilter: 'ALL' | FairId
  depthFilter: 'ALL' | 'A' | 'B' | 'C'
  routeFilter: 'ALL' | RouteOrder
  onSelect: (id: string) => void
  onUseInPackage: (id: string) => void
  onFairFilter: (v: 'ALL' | FairId) => void
  onDepthFilter: (v: 'ALL' | 'A' | 'B' | 'C') => void
  onRouteFilter: (v: 'ALL' | RouteOrder) => void
  onToggleCompare: (id: string) => void
  onClearCompare: () => void
}

export function OptionMatrix({
  options,
  selectedId,
  compareIds,
  fairFilter,
  depthFilter,
  routeFilter,
  onSelect,
  onUseInPackage,
  onFairFilter,
  onDepthFilter,
  onRouteFilter,
  onToggleCompare,
  onClearCompare,
}: Props) {
  const filtered = options.filter((o) => {
    if (fairFilter !== 'ALL' && o.fair !== fairFilter) return false
    if (depthFilter !== 'ALL' && o.depth !== depthFilter) return false
    if (routeFilter !== 'ALL' && o.routeOrder !== routeFilter) return false
    return true
  })

  const compared = compareIds
    .map((id) => options.find((o) => o.id === id))
    .filter((o): o is TripOption => Boolean(o))

  const maxDayIndex = compared.reduce((max, o) => Math.max(max, o.days.length - 1), 0)

  return (
    <section id="options" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex A</p>
        <h2>Thirteen itinerary options</h2>
        <p className="lede">
          Filter by fair, depth, and route order. Select one package for the detailed annex, or
          compare up to {MAX_COMPARE} options (summary + day-by-day). Budget figures are{' '}
          <strong>ITaLI only ({ITALI_BUDGET_PAX} pax)</strong>; DDE costs excluded.
        </p>
      </div>

      <div className="filters no-print">
        <div className="filter-group">
          <span>Fair</span>
          {(['ALL', 'CIIF', 'CIIE', 'NONE'] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={fairFilter === v ? 'chip active' : 'chip'}
              onClick={() => onFairFilter(v)}
            >
              {v === 'ALL' ? 'All' : v === 'NONE' ? 'None' : v}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span>Depth</span>
          {(['ALL', 'A', 'B', 'C'] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={depthFilter === v ? 'chip active' : 'chip'}
              onClick={() => onDepthFilter(v)}
            >
              {v === 'ALL' ? 'All' : DEPTH_LABELS[v]}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span>Route</span>
          {(
            [
              'ALL',
              'shanghai-first',
              'liuzhou-first',
              'liuzhou-only',
            ] as const
          ).map((v) => (
            <button
              key={v}
              type="button"
              className={routeFilter === v ? 'chip active' : 'chip'}
              onClick={() => onRouteFilter(v)}
            >
              {v === 'ALL' ? 'All' : ROUTE_ORDER_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="option-grid">
        {filtered.map((o) => {
          const budget = calcBudget(o)
          const inCompare = compareIds.includes(o.id)
          const compareFull = !inCompare && compareIds.length >= MAX_COMPARE
          return (
            <article
              key={o.id}
              className={`option-card ${selectedId === o.id ? 'selected' : ''} ${o.recommended ? 'recommended' : ''}`}
            >
              {o.recommended && <span className="badge">Recommended</span>}
              <h3>{o.name}</h3>
              <p className="tagline">{o.tagline}</p>
              <dl className="meta-grid">
                <div>
                  <dt>Duration</dt>
                  <dd>{o.durationLabel}</dd>
                </div>
                <div>
                  <dt>Route</dt>
                  <dd>{ROUTE_ORDER_LABELS[o.routeOrder]}</dd>
                </div>
                <div>
                  <dt>Fair days</dt>
                  <dd>{o.fairDays}</dd>
                </div>
                <div>
                  <dt>LRVTC</dt>
                  <dd>
                    {o.LRVTCDays}d · {o.LRVTCMode}
                  </dd>
                </div>
                <div>
                  <dt>ITaLI budget</dt>
                  <dd>{formatMyr(budget.total)}</dd>
                </div>
              </dl>
              <p className="window">{o.windowLabel}</p>
              <div className="card-actions no-print">
                <button type="button" className="btn primary" onClick={() => onUseInPackage(o.id)}>
                  Use in package
                </button>
                <button type="button" className="btn ghost" onClick={() => onSelect(o.id)}>
                  View itinerary
                </button>
                <button
                  type="button"
                  className={inCompare ? 'btn ghost active' : 'btn ghost'}
                  onClick={() => onToggleCompare(o.id)}
                  disabled={compareFull}
                  title={compareFull ? `Compare up to ${MAX_COMPARE} options` : undefined}
                >
                  {inCompare ? 'In compare' : 'Compare'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {compared.length > 0 && (
        <div className="compare-panel no-print">
          <div className="compare-head">
            <h3>
              Compare ({compared.length}/{MAX_COMPARE})
            </h3>
            <button type="button" className="btn ghost" onClick={onClearCompare}>
              Clear
            </button>
          </div>

          <div className={`compare-grid cols-${compared.length}`}>
            {compared.map((o) => (
              <div key={o.id} className="compare-col">
                <h4>{o.name}</h4>
                <ul>
                  <li>
                    <strong>Duration:</strong> {o.durationLabel}
                  </li>
                  <li>
                    <strong>Route:</strong> {ROUTE_ORDER_LABELS[o.routeOrder]}
                  </li>
                  <li>
                    <strong>Fair:</strong>{' '}
                    {o.fair === 'NONE' ? 'None' : `${o.fair} · ${o.fairDays} days`}
                  </li>
                  <li>
                    <strong>LRVTC:</strong> {o.LRVTCDays} days ({o.LRVTCMode})
                  </li>
                  <li>
                    <strong>ITaLI budget ({ITALI_BUDGET_PAX} pax):</strong>{' '}
                    {formatMyr(calcBudget(o).total)}
                  </li>
                  <li>
                    <strong>Depth:</strong> {DEPTH_LABELS[o.depth]}
                  </li>
                  <li>
                    <strong>Window:</strong> {o.windowLabel}
                  </li>
                </ul>
                <p>{o.highlights[0]}</p>
              </div>
            ))}
            {compared.length < 2 && (
              <div className="compare-col empty">
                <p>Add at least one more option to compare side by side.</p>
              </div>
            )}
          </div>

          {compared.length >= 2 && (
            <div className="compare-itineraries">
              <h4>Day-by-day itinerary</h4>
              <div className={`compare-itin-table cols-${compared.length}`}>
                <div className="compare-itin-header-row">
                  {compared.map((o) => (
                    <div key={`head-${o.id}`} className="compare-itin-label">
                      {o.id}
                    </div>
                  ))}
                </div>
                {Array.from({ length: maxDayIndex + 1 }, (_, dayIndex) => (
                  <div key={`row-${dayIndex}`} className="compare-itin-row">
                    {compared.map((o) => {
                      const d = o.days.find((day) => day.dayIndex === dayIndex)
                      if (!d) {
                        return (
                          <div
                            key={`${o.id}-empty-${dayIndex}`}
                            className="compare-day empty-day"
                          >
                            <span className="day-num">D{dayIndex}</span>
                            <span className="muted">—</span>
                          </div>
                        )
                      }
                      return (
                        <div
                          key={`${o.id}-${d.dayIndex}`}
                          className={`compare-day ${kindClass[d.kind]}`}
                        >
                          <div className="compare-day-head">
                            <span className="day-num">D{d.dayIndex}</span>
                            <time>{d.dateLabel}</time>
                          </div>
                          <strong>{d.title}</strong>
                          <p className="location">{d.location}</p>
                          <ul>
                            {d.blocks.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="print-only print-option-list">
        {options.map((o) => (
          <p key={o.id}>
            <strong>{o.name}</strong> — {o.durationLabel}; fair {o.fairDays}d; LRVTC {o.LRVTCDays}d (
            {o.LRVTCMode}); ITaLI est. {formatMyr(calcBudget(o).total)} for {ITALI_BUDGET_PAX} pax
            (DDE excluded). {o.windowLabel}
          </p>
        ))}
      </div>
    </section>
  )
}

export function ItinerarySection({ option }: { option: TripOption }) {
  return (
    <section id="itinerary" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex B · {option.id}</p>
        <h2>Day-by-day itinerary</h2>
        <p className="lede">
          {option.name}. Flight times marked TBC. {option.windowLabel}.
        </p>
      </div>

      <div className="route-strip" aria-hidden="true">
        {option.routeOrder === 'liuzhou-only' ? (
          <>
            <span>KLIA</span>
            <span className="line" />
            <span>Liuzhou LRVTC</span>
            <span className="line" />
            <span>KLIA</span>
          </>
        ) : option.routeOrder === 'liuzhou-first' ? (
          <>
            <span>KLIA</span>
            <span className="line" />
            <span>Liuzhou LRVTC</span>
            <span className="line" />
            <span>Shanghai NECC</span>
            <span className="line" />
            <span>KLIA</span>
          </>
        ) : (
          <>
            <span>KLIA</span>
            <span className="line" />
            <span>Shanghai NECC</span>
            <span className="line" />
            <span>Liuzhou LRVTC</span>
            <span className="line" />
            <span>KLIA</span>
          </>
        )}
      </div>
      <p className="flight-sub">
        {routeStripLabel(option.routeOrder)}
      </p>

      <ol className="timeline">
        {option.days.map((d) => (
          <li key={`${option.id}-${d.dayIndex}`} className={`timeline-item ${kindClass[d.kind]}`}>
            <div className="timeline-marker">
              <span className="day-num">D{d.dayIndex}</span>
            </div>
            <div className="timeline-body">
              <div className="timeline-top">
                <h3>{d.title}</h3>
                <time>{d.dateLabel}</time>
              </div>
              <p className="location">{d.location}</p>
              <ul>
                {d.blocks.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="two-col notes">
        <div>
          <h4>Why this shape</h4>
          <ul>
            {option.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Trade-offs</h4>
          <ul>
            {option.tradeoffs.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
