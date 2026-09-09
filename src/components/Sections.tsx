import {
  FAIR_FACTS,
  LOGISTICS,
  LRVTC_AGENDA,
  OBJECTIVES,
  OUTCOMES,
  PROPOSAL_META,
  TECH_CHECKLIST,
} from '../data/content'
import { FLIGHT_LEGS, FLIGHT_NOTES } from '../data/flights'
import { HOTEL_BLOCKS, HOTEL_NOTES } from '../data/hotels'
import { HotelMap } from './HotelMap'
import {
  formatMyr,
  calcBudget,
  ITALI_BUDGET_PAX,
  routeStripLabel,
  type FairId,
  type TripOption,
} from '../data/options'

export function ExecSummary({
  option,
  onSelectFair,
  onBuildPackage,
}: {
  option: TripOption
  onSelectFair: (fair: Exclude<FairId, 'NONE'>) => void
  onBuildPackage: () => void
}) {
  const budget = calcBudget(option)
  const fair = option.fair !== 'NONE' ? FAIR_FACTS[option.fair] : null

  return (
    <section id="summary" className="section hero-section">
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Business travel proposal</p>
          <h1>{PROPOSAL_META.title}</h1>
          <p className="hero-sub">{PROPOSAL_META.subtitle}</p>
          <ul className="hero-meta">
            <li>{PROPOSAL_META.departments}</li>
            <li>{PROPOSAL_META.origin}</li>
            <li>Indicative window: {option.windowLabel}</li>
          </ul>
          <div className="ask-box">
            <p className="ask-label">Decision ask</p>
            <p>
              Approve <strong>{option.name}</strong> as the working package (or select an alternate
              in Options), authorize indicative <strong>ITaLI</strong> budget of{' '}
              <strong>{formatMyr(budget.total)}</strong> for {ITALI_BUDGET_PAX} pax (DDE to arrange
              its own costing), and endorse outreach to LRVTC to confirm the study programme.
            </p>
          </div>
          <div className="hero-actions no-print">
            <button type="button" className="btn primary" onClick={onBuildPackage}>
              Build package
            </button>
            <a className="btn ghost" href="#options">
              Review all options
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="map-card">
            <p className="map-kicker">Route</p>
            <p className="map-title">{routeStripLabel(option.routeOrder)}</p>
            <div className="map-path">
              <div className="node">
                <span>KUL</span>
                <small>Depart</small>
              </div>
              <div className="arc" />
              {option.routeOrder === 'liuzhou-only' ? (
                <div className="node accent">
                  <span>LZH</span>
                  <small>LRVTC</small>
                </div>
              ) : option.routeOrder === 'liuzhou-first' ? (
                <>
                  <div className="node accent">
                    <span>LZH</span>
                    <small>LRVTC</small>
                  </div>
                  <div className="arc" />
                  <div className="node accent">
                    <span>SHA</span>
                    <small>{option.fair}</small>
                  </div>
                </>
              ) : (
                <>
                  <div className="node accent">
                    <span>SHA</span>
                    <small>{option.fair}</small>
                  </div>
                  <div className="arc" />
                  <div className="node accent">
                    <span>LZH</span>
                    <small>LRVTC</small>
                  </div>
                </>
              )}
              <div className="arc" />
              <div className="node">
                <span>KUL</span>
                <small>Return</small>
              </div>
            </div>
            <p className="map-note">
              {fair
                ? `Fair: ${fair.dates} · ${fair.venue}`
                : 'No Shanghai fair · LRVTC dates lock with host'}
            </p>
          </div>
        </div>
      </div>

      <div className="objective-grid">
        {OBJECTIVES.map((o) => (
          <article key={o.title}>
            <h3>{o.title}</h3>
            <p>{o.body}</p>
          </article>
        ))}
      </div>

      <div className="fair-pair" role="radiogroup" aria-label="Fair track">
        {(Object.keys(FAIR_FACTS) as Array<keyof typeof FAIR_FACTS>).map((key) => {
          const f = FAIR_FACTS[key]
          const active = option.fair === key
          return (
            <article
              key={key}
              role="radio"
              tabIndex={0}
              aria-checked={active}
              className={active ? 'fair-card active' : 'fair-card'}
              onClick={() => onSelectFair(key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectFair(key)
                }
              }}
            >
              <p className="eyebrow">{key}</p>
              <h3>{f.name}</h3>
              <p>
                <strong>{f.dates}</strong>
              </p>
              <p>{f.venue}</p>
              <p>{f.why}</p>
              <div className="fair-card-actions">
                <span className={active ? 'badge inline' : 'badge inline muted'}>
                  {active ? 'Selected track' : 'Select this track'}
                </span>
                <a
                  className="btn ghost compact fair-site-link"
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Official English site
                </a>
              </div>
            </article>
          )
        })}
      </div>

      <div className="outcomes">
        <h3>Expected outcomes</h3>
        <div className="outcome-grid">
          {OUTCOMES.map((block) => (
            <article key={block.owner}>
              <h4>{block.owner}</h4>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BudgetSection({ option }: { option: TripOption }) {
  const b = calcBudget(option)
  const rows = [
    { label: 'Flights (intl + domestic)', value: b.flights },
    { label: 'Hotels (Shanghai + Liuzhou)', value: b.lodging },
    { label: 'Fair / registration fees', value: b.fair },
    { label: 'Local transport', value: b.local },
    { label: 'Meals', value: b.meals },
    { label: 'Contingency', value: b.contingency },
  ]

  return (
    <section id="budget" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex C · {option.id}</p>
        <h2>Indicative ITaLI budget (MYR)</h2>
        <p className="lede">
          Totals cover <strong>ITaLI only ({ITALI_BUDGET_PAX} pax)</strong>. DDE travellers (3–5)
          arrange their own costing separately. Figures are planning bands — not quotations.
        </p>
      </div>

      <div className="budget-note">
        <p>
          <strong>Scope:</strong> ITaLI {ITALI_BUDGET_PAX} pax ·{' '}
          <strong>Excluded:</strong> DDE travel, lodging, meals, and fees (self-arranged)
        </p>
      </div>

      <div className="budget-summary">
        <div>
          <p className="eyebrow">ITaLI total</p>
          <p className="big-num">{formatMyr(b.total)}</p>
        </div>
        <div>
          <p className="eyebrow">Per ITaLI pax</p>
          <p className="big-num">{formatMyr(b.perPax)}</p>
        </div>
        <div>
          <p className="eyebrow">Nights / pax</p>
          <p className="big-num">
            {option.costs.shanghaiNights + option.costs.liuzhouNights}
          </p>
        </div>
      </div>

      <table className="budget-table">
        <thead>
          <tr>
            <th>Line item (ITaLI × {ITALI_BUDGET_PAX})</th>
            <th>Amount (MYR)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              <td>{formatMyr(r.value)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td>ITaLI total incl. contingency</td>
            <td>{formatMyr(b.total)}</td>
          </tr>
        </tbody>
      </table>

      <p className="fineprint">
        Assumptions for {option.id} (ITaLI only): intl ~
        {formatMyr(option.costs.intlFlightPerPax)}/pax; domestic ~
        {formatMyr(option.costs.domesticFlightsPerPax)}/pax; Shanghai hotel ~
        {formatMyr(option.costs.hotelShanghaiPerNight)}/night; Liuzhou ~
        {formatMyr(option.costs.hotelLiuzhouPerNight)}/night; contingency{' '}
        {Math.round(option.costs.contingencyRate * 100)}%. DDE budget not included.
      </p>
    </section>
  )
}

export function LRVTCSection() {
  return (
    <section id="lrvtc" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex D</p>
        <h2>LRVTC visit request</h2>
        <p className="lede">{LRVTC_AGENDA.status}</p>
      </div>

      <p className="college-name">{LRVTC_AGENDA.college}</p>

      <div className="LRVTC-blocks">
        {LRVTC_AGENDA.blocks.map((b) => (
          <article key={b.title}>
            <p className="eyebrow">{b.days}</p>
            <h3>{b.title}</h3>
            <p>{b.detail}</p>
          </article>
        ))}
      </div>

      <div className="draft-letter">
        <div className="draft-head">
          <h3>Draft outreach</h3>
          <button
            type="button"
            className="btn ghost no-print"
            onClick={() => navigator.clipboard.writeText(LRVTC_AGENDA.draftEmail)}
          >
            Copy draft
          </button>
        </div>
        <pre>{LRVTC_AGENDA.draftEmail}</pre>
      </div>
    </section>
  )
}

function priceLabel(min?: number, max?: number): string {
  if (min == null && max == null) return 'Price TBC'
  if (min != null && max != null) return `${formatMyr(min)} – ${formatMyr(max)}`
  if (min != null) return `from ${formatMyr(min)}`
  return `up to ${formatMyr(max!)}`
}

export function FlightsSection() {
  return (
    <section id="flights" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex B2</p>
        <h2>Possible flights for all sectors</h2>
        <p className="lede">
          Published options for KLIA ↔ Shanghai ↔ Liuzhou (Shanghai-first and Liuzhou-first, plus
          Guangzhou hub legs). Times and MYR
          bands are indicative one-way economy estimates — reconfirm before booking.
        </p>
      </div>

      <ul className="flight-notes">
        {FLIGHT_NOTES.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      {FLIGHT_LEGS.map((leg) => (
        <div key={leg.id} className="flight-leg">
          <h3>{leg.title}</h3>
          <p className="flight-leg-summary">{leg.summary}</p>
          <div className="flight-table-wrap">
            <table className="flight-table">
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Flight</th>
                  <th>Route</th>
                  <th>Depart</th>
                  <th>Arrive</th>
                  <th>Duration</th>
                  <th>Indicative fare (MYR)</th>
                </tr>
              </thead>
              <tbody>
                {leg.options.map((f) => (
                  <tr key={`${leg.id}-${f.code}-${f.depart}`}>
                    <td>
                      <strong>{f.airline}</strong>
                      {f.aircraft && <div className="flight-sub">{f.aircraft}</div>}
                      {f.notes && <div className="flight-sub">{f.notes}</div>}
                    </td>
                    <td>
                      <code className="flight-code">{f.code}</code>
                    </td>
                    <td>
                      {f.from} → {f.to}
                    </td>
                    <td>{f.depart}</td>
                    <td>{f.arrive}</td>
                    <td>{f.duration}</td>
                    <td>{priceLabel(f.priceMyrMin, f.priceMyrMax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  )
}

export function HotelsSection() {
  return (
    <section id="hotels" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex B3</p>
        <h2>Possible accommodation</h2>
        <p className="lede">
          International 4–5★ hotels within ~40 minutes of NECC (Shanghai) and LRVTC (Liuzhou). Prefer
          ~USD 120 / night when available; otherwise no upper limit for suitable 4–5★ inventory.
        </p>
      </div>

      <ul className="flight-notes">
        {HOTEL_NOTES.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      {HOTEL_BLOCKS.map((block) => (
        <div key={block.id} className="hotel-city">
          <h3>
            {block.city} · near {block.venue.split('—')[0].trim()}
          </h3>
          <p className="flight-leg-summary">
            <strong>Venue:</strong> {block.venue}
          </p>
          <p className="flight-leg-summary">{block.summary}</p>
          <HotelMap block={block} />
          <div className="hotel-grid">
            {block.hotels.map((h) => (
              <article key={h.name} className="hotel-card">
                <div className="hotel-card-top">
                  <p className="eyebrow">
                    {h.stars}★ · {h.brand}
                  </p>
                  {h.withinUsd120 && <span className="badge">~USD 120 target</span>}
                </div>
                <h4>{h.name}</h4>
                <p className="hotel-address">{h.address}</p>
                <p>
                  <strong>To venue:</strong> {h.travelToVenue}
                </p>
                <p className="hotel-price">
                  {h.usdMin != null && h.usdMax != null ? (
                    <>
                      Indicative: USD {h.usdMin}–{h.usdMax} / night
                      {h.myrMin != null && h.myrMax != null && (
                        <>
                          {' '}
                          (~{formatMyr(h.myrMin)}–{formatMyr(h.myrMax)})
                        </>
                      )}
                    </>
                  ) : (
                    'Rate TBC'
                  )}
                </p>
                {h.notes && <p className="flight-sub">{h.notes}</p>}
                {h.url && (
                  <a
                    className="btn ghost compact fair-site-link"
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Hotel site
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export function ChecklistSection() {
  return (
    <section id="checklist" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex E</p>
        <h2>Fair tech scout checklist</h2>
        <p className="lede">
          Use on the floor. Score each theme; capture vendor, booth, and follow-up owner.
        </p>
      </div>
      <div className="checklist-grid">
        {TECH_CHECKLIST.map((block) => (
          <article key={block.theme}>
            <h3>{block.theme}</h3>
            <ul>
              {block.prompts.map((p) => (
                <li key={p}>
                  <label>
                    <input type="checkbox" className="no-print" /> {p}
                  </label>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export function LogisticsSection() {
  return (
    <section id="logistics" className="section">
      <div className="section-head">
        <p className="eyebrow">Annex F</p>
        <h2>Travel logistics & risks</h2>
        <p className="lede">Admin checklist before tickets are issued.</p>
      </div>
      <div className="logistics-grid">
        {LOGISTICS.map((block) => (
          <article key={block.title}>
            <h3>{block.title}</h3>
            <ul>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
