# Data model

Primary sources of truth live under `src/data/`.

## Trip options (`options.ts`)

### Types

```ts
type FairId = 'CIIF' | 'CIIE' | 'NONE'
type DepthId = 'A' | 'B' | 'C'
type RouteOrder = 'shanghai-first' | 'liuzhou-first' | 'liuzhou-only'
```

### `TripOption` (main fields)

| Field | Role |
|-------|------|
| `id` | Stable key (`C1`, `A1L`, `L1`, `L2`, …) |
| `fair` / `depth` / `routeOrder` | Filter & twin matching |
| `name` / `tagline` | Card / dropdown copy |
| `recommended` | Badge (only `C1`) |
| `durationDays` / `durationLabel` | Length |
| `fairDays` / `LRVTCDays` / `wuhanDays` / `LRVTCMode` | Depth summary |
| `windowLabel` | Calendar window string |
| `highlights` / `tradeoffs` | Pros / cons |
| `days[]` | Day-by-day itinerary |
| `costs` | Planning-band cost assumptions |

### `ItineraryDay`

| Field | Role |
|-------|------|
| `dayIndex` | Order (0-based) |
| `dateLabel` | Display date |
| `title` | Day title |
| `kind` | `travel` \| `fair` \| `transfer` \| `LRVTC` \| `site` \| `ops` \| `buffer` \| `debrief` |
| `location` | Place string |
| `blocks[]` | Bullet activities |

### `CostAssumptions`

| Field | Notes |
|-------|--------|
| `intlFlightPerPax` / `domesticFlightsPerPax` | MYR planning bands (includes HSR LZH–WUH allowance) |
| `hotelShanghaiPerNight` / `hotelLiuzhouPerNight` / `hotelWuhanPerNight` | Per night MYR |
| `shanghaiNights` / `liuzhouNights` / `wuhanNights` | Night counts (0 OK for Shanghai on L1 / L2) |
| `fairFeesPerPax` | 0 for no-fair packages |
| `localTransportPerDay` / `mealsPerDay` | × trip days × pax |
| `contingencyRate` | Fraction of subtotal |

### Helpers

- `getOption(id)` — resolve option or fall back to `DEFAULT_OPTION_ID`
- `findTwin(option, routeOrder)` — same fair + depth, different route
- `calcBudget(option, pax?)` — ITaLI planning total (includes Wuhan lodging)
- `routeStripLabel(order)` — human route string
- `formatMyr(n)` — `en-MY` currency format

### CIIE generation

Shanghai CIIF builders are shifted to CIIE via `shiftCiie(...)`, which remaps dates/titles/blocks and sets `fair: 'CIIE'`.

### Tech programme (all packages)

Shared builders `fullTechDays` / `compressedTechDays`:

1. **LRVTC** campus / facility review (Liuzhou) — ~1 day  
2. **HSR** Liuzhou → Wuhan (~5h)  
3. **CRRC Yangtze** site visit  
4. Automotive rail **ops** (day; night on full mode)  
5. Wrap / debrief (full mode)

Depth **A** keeps full tech + compressed fair; **B** compresses Wuhan (no night); **C** keeps both full.

### No-fair packages

| ID | Builder | Role |
|----|---------|------|
| `L1` | `buildLiuzhouOnly()` | Flexible dates (TBC with hosts) |
| `L2` | `buildLiuzhouOnlyWeekdays()` | Indicative mid-Oct 2026; weekday engagement days |

Both use `fair: 'NONE'`, `depth: 'C'`, `routeOrder: 'liuzhou-only'`. Composer Schedule chips pick between them when Fair = None.

---

## Flights (`flights.ts` + `composer.ts`)

### `FlightLeg`

Grouped catalog rows: `id`, `title`, `summary`, `options[]`.

Current leg IDs include:

| ID | Typical use |
|----|-------------|
| `kul-pvg` | Outbound / hub into Shanghai |
| `kul-can` | Outbound hub Guangzhou (LZH-first / no-fair) |
| `pvg-lzh` / `lzh-pvg` | Domestic Shanghai ↔ Liuzhou |
| `can-lzh` | Guangzhou → Liuzhou connect |
| `wuh-pvg` | Return / transfer Wuhan → Shanghai |
| `wuh-can-kul` | Mixed WUH→CAN and CAN→KUL (filtered by slot) |
| `pvg-kul` | Return international via PVG |
| `lzh-can-kul` | Legacy LZH→CAN / CAN→KUL catalog (outbound paths still use CAN→LZH) |

### Composer slots

```ts
type FlightSlotId = 'outbound' | 'toLiuzhou' | 'returnDomestic' | 'returnIntl'
type ReturnHub = 'shanghai' | 'guangzhou'
```

`getSlotLegId(slot, hub, routeOrder)` selects which catalog leg feeds each dropdown.

- **shanghai-first / liuzhou-only:** `returnDomestic` = Wuhan → hub (`wuh-pvg` / `wuh-can-kul`); `returnIntl` = hub → KLIA.
- **liuzhou-first:** `returnDomestic` = Wuhan → Shanghai (`wuh-pvg`); `returnIntl` = PVG → KLIA.
- Liuzhou → Wuhan HSR is **not** a flight slot.

Selection keys: `legId::flightCode::depart` via `flightKey` / `resolveFlight`.

---

## Hotels (`hotels.ts`)

### `HotelOption`

| Field | Required | Notes |
|-------|----------|--------|
| `name`, `brand`, `stars`, `address`, `travelToVenue` | yes | Display |
| `lat`, `lng` | yes | Map pin (WGS84) |
| `approx` | no | Vague address |
| `usdMin`/`usdMax`, `myrMin`/`myrMax` | no | Indicative rates |
| `withinUsd120` | no | Target badge |
| `url` | no | Hotel site |

### `HotelCityBlock`

| Field | Notes |
|-------|--------|
| `id` | e.g. `shanghai-necc`, `liuzhou-lrvtc`, `wuhan-crrc` |
| `city`, `venue`, `summary` | Copy |
| `venueLat` / `venueLng` | Venue marker |
| `hotels[]` | List |

---

## App state (`App.tsx`)

| State | Purpose |
|-------|---------|
| `selectedId` | Active option |
| `fairFilter` / `depthFilter` / `routeFilter` | Options annex |
| `compareIds` | Up to 3 for compare |
| `hub` | Composer hub |
| `flightKeys` | Selected flights per slot |
| `shanghaiHotelName` / `liuzhouHotelName` | Selected hotels |

Hash navigation is driven by `src/nav.ts` (`#summary`, `#package`, …).
