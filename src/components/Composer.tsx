import {
  OPTIONS,
  ROUTE_ORDER_LABELS,
  formatMyr,
  routeStripLabel,
  type DepthId,
  type FairId,
  type RouteOrder,
  type TripOption,
} from '../data/options'
import {
  type FlightSlotId,
  type ReturnHub,
  calcSelectedBudget,
  flightKey,
  flightSummaryTitle,
  optionsForSlot,
  resolveFlight,
  getShanghaiHotels,
  getLiuzhouHotels,
  getWuhanHotels,
  slotLabel,
  type ComposerSelections,
} from '../data/composer'
import type { FlightOption } from '../data/flights'
import type { HotelOption } from '../data/hotels'
import { DEPTH_LABELS } from '../data/content'
import { kindClassMap } from './timelineKinds'

interface Props {
  option: TripOption
  onOptionChange: (id: string) => void
  hub: ReturnHub
  onHubChange: (hub: ReturnHub) => void
  flightKeys: Record<FlightSlotId, string | null>
  onFlightPick: (slot: FlightSlotId, key: string) => void
  shanghaiHotelName: string | null
  liuzhouHotelName: string | null
  wuhanHotelName: string | null
  onShanghaiHotel: (name: string) => void
  onLiuzhouHotel: (name: string) => void
  onWuhanHotel: (name: string) => void
}

function findPackage(
  fair: FairId,
  depth: DepthId,
  routeOrder: RouteOrder,
  liuzhouSchedule: 'flexible' | 'weekdays' = 'flexible',
): TripOption | undefined {
  if (fair === 'NONE' || routeOrder === 'liuzhou-only') {
    return OPTIONS.find((o) => o.id === (liuzhouSchedule === 'weekdays' ? 'L2' : 'L1'))
  }
  return OPTIONS.find(
    (o) => o.fair === fair && o.depth === depth && o.routeOrder === routeOrder,
  )
}

function ItineraryChooser({
  option,
  onOptionChange,
}: {
  option: TripOption
  onOptionChange: (id: string) => void
}) {
  const liuzhouOnly = option.routeOrder === 'liuzhou-only' || option.fair === 'NONE'
  const liuzhouSchedule: 'flexible' | 'weekdays' = option.id === 'L2' ? 'weekdays' : 'flexible'

  function apply(next: {
    fair?: FairId
    depth?: DepthId
    routeOrder?: RouteOrder
    liuzhouSchedule?: 'flexible' | 'weekdays'
  }) {
    const fair = next.fair ?? option.fair
    const depth = next.depth ?? option.depth
    let routeOrder = next.routeOrder ?? option.routeOrder
    const schedule = next.liuzhouSchedule ?? liuzhouSchedule

    if (fair === 'NONE') {
      const match = findPackage('NONE', 'C', 'liuzhou-only', schedule)
      if (match) onOptionChange(match.id)
      return
    }

    if (routeOrder === 'liuzhou-only') {
      routeOrder = 'shanghai-first'
    }

    const match =
      findPackage(fair, depth, routeOrder) ??
      findPackage(fair, depth, 'shanghai-first') ??
      findPackage(fair, 'C', 'shanghai-first')
    if (match) onOptionChange(match.id)
  }

  return (
    <div className="itinerary-chooser">
      <div className="chooser-filters">
        <div className="filter-group">
          <span className="composer-label">Fair</span>
          {(
            [
              { id: 'CIIF' as const, label: 'CIIF' },
              { id: 'CIIE' as const, label: 'CIIE' },
              { id: 'NONE' as const, label: 'None (Liuzhou + Wuhan)' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              className={option.fair === f.id ? 'chip active' : 'chip'}
              onClick={() => apply({ fair: f.id })}
            >
              {f.label}
            </button>
          ))}
        </div>

        {liuzhouOnly ? (
          <div className="filter-group">
            <span className="composer-label">Schedule</span>
            <button
              type="button"
              className={liuzhouSchedule === 'flexible' ? 'chip active' : 'chip'}
              onClick={() => apply({ fair: 'NONE', liuzhouSchedule: 'flexible' })}
            >
              Flexible (TBC)
            </button>
            <button
              type="button"
              className={liuzhouSchedule === 'weekdays' ? 'chip active' : 'chip'}
              onClick={() => apply({ fair: 'NONE', liuzhouSchedule: 'weekdays' })}
            >
              Weekdays only
            </button>
          </div>
        ) : (
          <>
            <div className="filter-group">
              <span className="composer-label">Depth</span>
              {(['A', 'B', 'C'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={option.depth === d ? 'chip active' : 'chip'}
                  onClick={() => apply({ depth: d })}
                  title={DEPTH_LABELS[d]}
                >
                  {d} · {DEPTH_LABELS[d]}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <span className="composer-label">Route order</span>
              {(
                [
                  { id: 'shanghai-first' as const, label: 'Shanghai first' },
                  { id: 'liuzhou-first' as const, label: 'Liuzhou first' },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={option.routeOrder === r.id ? 'chip active' : 'chip'}
                  onClick={() => apply({ routeOrder: r.id })}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={`chooser-summary${option.recommended ? ' recommended' : ''}`}>
        <div className="chooser-summary-top">
          <span className="chooser-id">{option.id}</span>
          {option.recommended && <span className="badge">Recommended</span>}
        </div>
        <h4>{option.name}</h4>
        <p className="tagline">{option.tagline}</p>
        <dl className="chooser-meta">
          <div>
            <dt>Route</dt>
            <dd>{routeStripLabel(option.routeOrder)}</dd>
          </div>
          <div>
            <dt>Window</dt>
            <dd>{option.windowLabel}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{option.durationLabel}</dd>
          </div>
          <div>
            <dt>Fair / tech</dt>
            <dd>
              {option.fairDays}d fair · {option.LRVTCDays}d LRVTC · {option.wuhanDays}d Wuhan (
              {option.LRVTCMode})
            </dd>
          </div>
        </dl>
        {!liuzhouOnly && (
          <p className="flight-sub">
            {option.fair} · {DEPTH_LABELS[option.depth]} · {ROUTE_ORDER_LABELS[option.routeOrder]}
          </p>
        )}
        {liuzhouOnly && (
          <p className="flight-sub">
            {liuzhouSchedule === 'weekdays'
              ? 'LRVTC campus sessions on weekdays only'
              : 'Dates flexible — lock with LRVTC host'}
          </p>
        )}
      </div>
    </div>
  )
}

function FlightPicker({
  slot,
  hub,
  routeOrder,
  selectedKey,
  onPick,
}: {
  slot: FlightSlotId
  hub: ReturnHub
  routeOrder: TripOption['routeOrder']
  selectedKey: string | null
  onPick: (key: string) => void
}) {
  const { legId, options } = optionsForSlot(slot, hub, routeOrder)
  return (
    <div className="composer-picker">
      <label className="composer-label" htmlFor={`flight-${slot}`}>
        {slotLabel(slot, hub, routeOrder)}
      </label>
      <select
        id={`flight-${slot}`}
        value={selectedKey ?? ''}
        onChange={(e) => {
          if (e.target.value) onPick(e.target.value)
        }}
      >
        <option value="">Select flight…</option>
        {options.map((f) => {
          const key = flightKey(legId, f)
          const price =
            f.priceMyrMin != null && f.priceMyrMax != null
              ? ` · ${formatMyr(f.priceMyrMin)}–${formatMyr(f.priceMyrMax)}`
              : ''
          return (
            <option key={key} value={key}>
              {f.code} · {f.airline} · {f.depart} → {f.arrive}
              {price}
            </option>
          )
        })}
      </select>
    </div>
  )
}

function HotelPicker({
  id,
  label,
  hotels,
  selectedName,
  onPick,
}: {
  id: string
  label: string
  hotels: HotelOption[]
  selectedName: string | null
  onPick: (name: string) => void
}) {
  return (
    <div className="composer-picker">
      <label className="composer-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={selectedName ?? ''}
        onChange={(e) => {
          if (e.target.value) onPick(e.target.value)
        }}
      >
        <option value="">Select hotel…</option>
        {hotels.map((h) => {
          const price =
            h.usdMin != null && h.usdMax != null
              ? ` · USD ${h.usdMin}–${h.usdMax}/night`
              : ''
          return (
            <option key={h.name} value={h.name}>
              {h.stars}★ {h.name}
              {price}
            </option>
          )
        })}
      </select>
    </div>
  )
}

function FlightSummaryCard({
  title,
  flight,
}: {
  title: string
  flight: (FlightOption & { legId: string }) | null
}) {
  if (!flight) {
    return (
      <div className="package-card muted-card">
        <p className="eyebrow">{title}</p>
        <p>Not selected</p>
      </div>
    )
  }
  return (
    <div className="package-card">
      <p className="eyebrow">{title}</p>
      <h4>
        <code className="flight-code">{flight.code}</code> {flight.airline}
      </h4>
      <p>
        {flight.from} → {flight.to}
      </p>
      <p>
        {flight.depart} → {flight.arrive} · {flight.duration}
      </p>
      {flight.priceMyrMin != null && flight.priceMyrMax != null && (
        <p className="hotel-price">
          {formatMyr(flight.priceMyrMin)}–{formatMyr(flight.priceMyrMax)} / pax (one-way est.)
        </p>
      )}
    </div>
  )
}

function HotelSummaryCard({
  title,
  hotel,
  nights,
}: {
  title: string
  hotel: HotelOption | null
  nights: number
}) {
  if (!hotel) {
    return (
      <div className="package-card muted-card">
        <p className="eyebrow">{title}</p>
        <p>Not selected</p>
      </div>
    )
  }
  return (
    <div className="package-card">
      <p className="eyebrow">
        {title} · {hotel.stars}★ · {nights} night{nights === 1 ? '' : 's'}
      </p>
      <h4>{hotel.name}</h4>
      <p className="hotel-address">{hotel.address}</p>
      <p>
        <strong>To venue:</strong> {hotel.travelToVenue}
      </p>
      {hotel.usdMin != null && hotel.usdMax != null && (
        <p className="hotel-price">
          USD {hotel.usdMin}–{hotel.usdMax}/night
          {hotel.myrMin != null && hotel.myrMax != null && (
            <>
              {' '}
              (~{formatMyr(hotel.myrMin)}–{formatMyr(hotel.myrMax)})
            </>
          )}
        </p>
      )}
    </div>
  )
}

export function ComposerSection({
  option,
  onOptionChange,
  hub,
  onHubChange,
  flightKeys,
  onFlightPick,
  shanghaiHotelName,
  liuzhouHotelName,
  wuhanHotelName,
  onShanghaiHotel,
  onLiuzhouHotel,
  onWuhanHotel,
}: Props) {
  const shanghaiHotels = getShanghaiHotels()
  const liuzhouHotels = getLiuzhouHotels()
  const wuhanHotels = getWuhanHotels()

  const selections: ComposerSelections = {
    option,
    hub,
    outbound: resolveFlight(flightKeys.outbound),
    toLiuzhou: resolveFlight(flightKeys.toLiuzhou),
    returnDomestic: resolveFlight(flightKeys.returnDomestic),
    returnIntl: resolveFlight(flightKeys.returnIntl),
    shanghaiHotel: shanghaiHotels.find((h) => h.name === shanghaiHotelName) ?? null,
    liuzhouHotel: liuzhouHotels.find((h) => h.name === liuzhouHotelName) ?? null,
    wuhanHotel: wuhanHotels.find((h) => h.name === wuhanHotelName) ?? null,
  }

  const budget = calcSelectedBudget(selections)

  return (
    <section id="package" className="section">
      <div className="section-head">
        <p className="eyebrow">Build your package</p>
        <h2>Select itinerary, flights &amp; hotels</h2>
        <p className="lede">
          Choose one trip option, then lock flights and accommodation. The final package and ITaLI
          budget update live below.
        </p>
      </div>

      <div className="composer-panel no-print">
        <div className="composer-step">
          <h3>1 · Itinerary option</h3>
          <p className="flight-sub">
            Pick fair, depth, and route order — the matching package appears below.
          </p>
          <ItineraryChooser option={option} onOptionChange={onOptionChange} />
        </div>

        <div className="composer-step">
          <h3>2 · Flights</h3>
          <div className="hub-toggle">
            <span className="composer-label">
              {option.routeOrder === 'liuzhou-only'
                ? 'Travel hub'
                : option.routeOrder === 'liuzhou-first'
                  ? 'Outbound hub to Liuzhou'
                  : 'Return hub'}
            </span>
            <button
              type="button"
              className={hub === 'shanghai' ? 'chip active' : 'chip'}
              onClick={() => onHubChange('shanghai')}
            >
              Via Shanghai (PVG)
            </button>
            <button
              type="button"
              className={hub === 'guangzhou' ? 'chip active' : 'chip'}
              onClick={() => onHubChange('guangzhou')}
            >
              Via Guangzhou (CAN)
            </button>
          </div>
          {option.routeOrder === 'liuzhou-first' && (
            <p className="flight-sub">
              After Liuzhou + Wuhan, transfer WUH→PVG for the fair, then PVG→KUL home (return always
              via Shanghai). Liuzhou→Wuhan is HSR (~5h), not a flight slot.
            </p>
          )}
          {option.routeOrder === 'liuzhou-only' && (
            <p className="flight-sub">
              Outbound uses the selected hub into Liuzhou; return from Wuhan via the same hub. HSR
              Liuzhou→Wuhan (~5h) is included in planning bands, not a flight picker.
            </p>
          )}
          {option.routeOrder === 'shanghai-first' && (
            <p className="flight-sub">
              After the fair: Shanghai→Liuzhou flight, then HSR to Wuhan; return from Wuhan via the
              selected hub.
            </p>
          )}
          <div className="composer-grid">
            <FlightPicker
              slot="outbound"
              hub={hub}
              routeOrder={option.routeOrder}
              selectedKey={flightKeys.outbound}
              onPick={(k) => onFlightPick('outbound', k)}
            />
            <FlightPicker
              slot="toLiuzhou"
              hub={hub}
              routeOrder={option.routeOrder}
              selectedKey={flightKeys.toLiuzhou}
              onPick={(k) => onFlightPick('toLiuzhou', k)}
            />
            <FlightPicker
              slot="returnDomestic"
              hub={hub}
              routeOrder={option.routeOrder}
              selectedKey={flightKeys.returnDomestic}
              onPick={(k) => onFlightPick('returnDomestic', k)}
            />
            <FlightPicker
              slot="returnIntl"
              hub={hub}
              routeOrder={option.routeOrder}
              selectedKey={flightKeys.returnIntl}
              onPick={(k) => onFlightPick('returnIntl', k)}
            />
          </div>
        </div>

        <div className="composer-step">
          <h3>3 · Accommodation</h3>
          <div className="composer-grid">
            {option.costs.shanghaiNights > 0 && (
              <HotelPicker
                id="hotel-shanghai"
                label={`Shanghai · ${option.costs.shanghaiNights} nights`}
                hotels={shanghaiHotels}
                selectedName={shanghaiHotelName}
                onPick={onShanghaiHotel}
              />
            )}
            {option.costs.liuzhouNights > 0 && (
              <HotelPicker
                id="hotel-liuzhou"
                label={`Liuzhou · ${option.costs.liuzhouNights} nights`}
                hotels={liuzhouHotels}
                selectedName={liuzhouHotelName}
                onPick={onLiuzhouHotel}
              />
            )}
            {option.costs.wuhanNights > 0 && (
              <HotelPicker
                id="hotel-wuhan"
                label={`Wuhan · ${option.costs.wuhanNights} nights`}
                hotels={wuhanHotels}
                selectedName={wuhanHotelName}
                onPick={onWuhanHotel}
              />
            )}
          </div>
        </div>
      </div>

      <div id="final-package" className="final-package">
        <div className="final-package-head">
          <div>
            <p className="eyebrow">Final package</p>
            <h3>
              {option.name}
              {budget.complete ? '' : ' · incomplete'}
            </h3>
            <p className="lede">{option.windowLabel}</p>
          </div>
          {budget.complete ? (
            <span className="badge">Ready for approval</span>
          ) : (
            <span className="badge inline muted">Select all items</span>
          )}
        </div>

        {!budget.complete && (
          <p className="package-missing">
            Still needed:{' '}
            {budget.missing.map((item, i) => {
              const href =
                item.includes('flight') || item.includes('Flight') || item.includes('Outbound')
                  ? '#flights'
                  : item.includes('hotel') ||
                      item.includes('Hotel') ||
                      item.includes('Shanghai hotel') ||
                      item.includes('Liuzhou hotel') ||
                      item.includes('Wuhan hotel')
                    ? '#hotels'
                    : '#package'
              return (
                <span key={item}>
                  {i > 0 ? ' · ' : ''}
                  <a href={href}>{item}</a>
                </span>
              )
            })}
          </p>
        )}

        <h4>Day-by-day</h4>
        <ol className="timeline package-timeline">
          {option.days.map((d) => (
            <li
              key={`pkg-${option.id}-${d.dayIndex}`}
              className={`timeline-item ${kindClassMap[d.kind]}`}
            >
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

        <h4>Selected flights</h4>
        <div className="package-grid">
          <FlightSummaryCard
            title={flightSummaryTitle('outbound', hub, option.routeOrder)}
            flight={selections.outbound}
          />
          <FlightSummaryCard
            title={flightSummaryTitle('toLiuzhou', hub, option.routeOrder)}
            flight={selections.toLiuzhou}
          />
          <FlightSummaryCard
            title={flightSummaryTitle('returnDomestic', hub, option.routeOrder)}
            flight={selections.returnDomestic}
          />
          <FlightSummaryCard
            title={flightSummaryTitle('returnIntl', hub, option.routeOrder)}
            flight={selections.returnIntl}
          />
        </div>

        <h4>Selected accommodation</h4>
        <div className="package-grid cols-2">
          {option.costs.shanghaiNights > 0 && (
            <HotelSummaryCard
              title="Shanghai"
              hotel={selections.shanghaiHotel}
              nights={option.costs.shanghaiNights}
            />
          )}
          {option.costs.liuzhouNights > 0 && (
            <HotelSummaryCard
              title="Liuzhou"
              hotel={selections.liuzhouHotel}
              nights={option.costs.liuzhouNights}
            />
          )}
          {option.costs.wuhanNights > 0 && (
            <HotelSummaryCard
              title="Wuhan"
              hotel={selections.wuhanHotel}
              nights={option.costs.wuhanNights}
            />
          )}
        </div>

        <h4>ITaLI budget for this package ({budget.pax} pax)</h4>
        <div className="budget-summary">
          <div>
            <p className="eyebrow">ITaLI total</p>
            <p className="big-num">{formatMyr(budget.total)}</p>
          </div>
          <div>
            <p className="eyebrow">Per ITaLI pax</p>
            <p className="big-num">{formatMyr(budget.perPax)}</p>
          </div>
          <div>
            <p className="eyebrow">Air (est.)</p>
            <p className="big-num">{formatMyr(budget.flights)}</p>
          </div>
        </div>

        <table className="budget-table">
          <thead>
            <tr>
              <th>Line item</th>
              <th>Amount (MYR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Flights (selected one-ways × {budget.pax}
                {budget.usedFlightFallback ? '; planning-band fallback used' : ''})
              </td>
              <td>{formatMyr(budget.flights)}</td>
            </tr>
            <tr>
              <td>
                Hotels —{' '}
                {budget.shanghaiNights > 0 && (
                  <>
                    Shanghai {budget.shanghaiNights}n @ ~{formatMyr(budget.shanghaiRateUsed)}
                    /night
                    {(budget.liuzhouNights > 0 || budget.wuhanNights > 0) && ' + '}
                  </>
                )}
                {budget.liuzhouNights > 0 && (
                  <>
                    Liuzhou {budget.liuzhouNights}n @ ~{formatMyr(budget.liuzhouRateUsed)}/night
                    {budget.wuhanNights > 0 && ' + '}
                  </>
                )}
                {budget.wuhanNights > 0 && (
                  <>
                    Wuhan {budget.wuhanNights}n @ ~{formatMyr(budget.wuhanRateUsed)}/night
                  </>
                )}{' '}
                × {budget.pax}
              </td>
              <td>{formatMyr(budget.lodging)}</td>
            </tr>
            <tr>
              <td>Fair / registration</td>
              <td>{formatMyr(budget.fair)}</td>
            </tr>
            <tr>
              <td>Local transport</td>
              <td>{formatMyr(budget.local)}</td>
            </tr>
            <tr>
              <td>Meals</td>
              <td>{formatMyr(budget.meals)}</td>
            </tr>
            <tr>
              <td>Contingency</td>
              <td>{formatMyr(budget.contingency)}</td>
            </tr>
            <tr className="total-row">
              <td>ITaLI total incl. contingency</td>
              <td>{formatMyr(budget.total)}</td>
            </tr>
          </tbody>
        </table>
        <p className="fineprint">
          DDE costing excluded. Flight and hotel figures use midpoints of indicative bands where
          selected; reconfirm quotes before ticketing.
        </p>
      </div>
    </section>
  )
}
