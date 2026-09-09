# China Business Trip Proposal 2026

Interactive web proposal for a joint **ITaLI + DDE** business trip from **KLIA** to China and back.

**Purpose:** help leadership compare itinerary packages that combine:

1. **Technology scouting** at a Shanghai industry fair — **CIIF 2026** (12–16 Oct) or **CIIE 2026** (5–10 Nov)
2. **Railway process learning** at **Liuzhou Railway Vocational & Technical College (LRVTC)** (ECRL-related; programme not yet confirmed with the host)

Default recommended package: **C1 · CIIF + Full Depth** (Shanghai-first).

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # typecheck + production bundle → dist/
npm run preview  # serve dist locally
npm run lint     # oxlint
```

**Requirements:** Node.js 20+ recommended.

---

## What’s in the app

| Section | Hash | Description |
|---------|------|-------------|
| Summary | `#summary` | Decision ask, objectives, fair track cards, outcomes |
| Package | `#package` | Composer: pick option + flights + hotels → live ITaLI budget |
| Options | `#options` | Filter / compare up to 3 packages; day-by-day annex |
| Flights | `#flights` | Indicative flight catalog by leg |
| Hotels | `#hotels` | 4–5★ candidates + Leaflet maps (Shanghai / Liuzhou) |
| Budget | `#budget` | Planning-band budget for selected option |
| LRVTC | `#lrvtc` | Draft invitation (EN + short CN courtesy) |
| Admin | `#admin` | Checklist + logistics |

**Print:** use **Print** (current view) or **Print full** (all sections). Prefer browser “Save as PDF”.

---

## Itinerary options (13)

Options are defined in [`src/data/options.ts`](src/data/options.ts).

### Dimensions

| Dimension | Values |
|-----------|--------|
| **Fair** | `CIIF`, `CIIE`, or `NONE` (Liuzhou-only) |
| **Depth** | `A` Protect Liuzhou · `B` Protect Fair · `C` Full Depth |
| **Route order** | `shanghai-first` · `liuzhou-first` · `liuzhou-only` |

### Matrix

| ID | Fair | Depth | Route | Notes |
|----|------|-------|-------|--------|
| A1 / A2 | CIIF / CIIE | A | Shanghai first | Full LRVTC, compressed fair |
| B1 / B2 | CIIF / CIIE | B | Shanghai first | Compressed LRVTC, stronger fair |
| **C1** / C2 | CIIF / CIIE | C | Shanghai first | **C1 recommended** |
| A1L / A2L | CIIF / CIIE | A | Liuzhou first | LRVTC then fair |
| B1L / B2L | CIIF / CIIE | B | Liuzhou first | |
| C1L / C2L | CIIF / CIIE | C | Liuzhou first | |
| **L1** | NONE | C | Liuzhou only | Full LRVTC, no Shanghai fair |

`DEFAULT_OPTION_ID = 'C1'`.

### Routing patterns

- **Shanghai-first:** KLIA → Shanghai (fair) → Liuzhou (LRVTC) → KLIA  
- **Liuzhou-first:** KLIA → Liuzhou (LRVTC) → Shanghai (fair) → KLIA  
- **Liuzhou-only:** KLIA → Liuzhou (LRVTC) → KLIA  

---

## Budget rules

- Budgets cover **ITaLI only (`ITALI_BUDGET_PAX = 3`)**.
- **DDE** arranges its own costing (excluded from MYR totals).
- Option costs live on each `TripOption.costs` (hotels nights, flights bands, fair fees, contingency).
- Package builder ([`src/data/composer.ts`](src/data/composer.ts)) can replace planning bands with midpoints of **selected** flight/hotel price ranges when complete.
- Liuzhou-only (`L1`): `shanghaiNights = 0`, `fairFeesPerPax = 0` — Shanghai hotel not required in the composer.

All figures are **indicative** for planning; reconfirm before ticketing.

---

## Architecture

```
src/
  App.tsx                 # State: selected option, filters, composer picks, hash routing
  nav.ts                  # Hash SPA routes
  App.css                 # Layout & print styles
  components/
    Options.tsx           # Option matrix, compare, itinerary strip
    Composer.tsx          # Package builder UI
    HotelMap.tsx          # Leaflet maps per hotel city
    Sections.tsx          # Summary, flights, hotels, budget, LRVTC, admin
    timelineKinds.ts      # Day-kind CSS class map
  data/
    options.ts            # Trip options + budget helpers
    flights.ts            # Flight legs & options
    hotels.ts             # Hotels + lat/lng for maps
    composer.ts           # Flight slots by routeOrder, selected budget
    content.ts            # Copy: objectives, fairs, logistics, invitation
```

**Stack:** Vite 8 · React 19 · TypeScript · Leaflet (OSM tiles)

---

## Customising content

### Add or edit an itinerary

1. Edit builders in [`src/data/options.ts`](src/data/options.ts) (or add a new builder).
2. Ensure `routeOrder`, `fair`, `depth`, `days`, and `costs` are set.
3. Append to the `OPTIONS` array.
4. Update filters/labels if you add new enum values (`FairId`, `RouteOrder`).

### Flights

- Catalog: [`src/data/flights.ts`](src/data/flights.ts) (`FLIGHT_LEGS`).
- Composer slot → leg mapping: [`src/data/composer.ts`](src/data/composer.ts) (`getSlotLegId`, `slotLabel`).
- Changing `routeOrder` clears incompatible flight picks in the UI.

### Hotels & maps

- Catalog + coordinates: [`src/data/hotels.ts`](src/data/hotels.ts).
- Each hotel needs `lat` / `lng`; use `approx: true` when the pin is rough.
- City blocks can set `venueLat` / `venueLng` (NECC, LRVTC).
- Map UI: [`src/components/HotelMap.tsx`](src/components/HotelMap.tsx) (OpenStreetMap tiles; no API key).

### Copy & logistics

- Fairs, objectives, invitation letter, logistics: [`src/data/content.ts`](src/data/content.ts).

---

## Package composer behaviour

1. Choose an itinerary option (all 13 appear in the dropdown).
2. Choose a **hub** (Shanghai PVG or Guangzhou CAN):
   - Shanghai-first → hub is **return** path from Liuzhou  
   - Liuzhou-first → hub is **outbound** into Liuzhou; return after fair is via PVG  
   - Liuzhou-only → hub is used for **both** outbound and return  
3. Pick four flight slots + hotels (Shanghai hotel skipped when nights = 0).
4. Final package shows day-by-day + selected items + ITaLI budget.

---

## Fair track (summary)

Clicking CIIF / CIIE on the summary page switches to a matching option, preferring the same **depth** and **routeOrder**. If the current package is Liuzhou-only, it switches to the Shanghai-first twin (typically depth C).

---

## Documentation index

| Doc | Contents |
|-----|----------|
| [README.md](README.md) | This file — overview, run, customise |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Types, option IDs, flight slots, hotel fields |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Static build, **GitHub Pages**, hosting |

**Live site (GitHub Pages):** https://wmaminuddin.github.io/china-trip-proposal-2026/

---

## Disclaimer

Indicative planning document only. Fair dates follow official CIIF / CIIE announcements. LRVTC programme is subject to host confirmation. Flight times, fares, and hotel rates change — reconfirm before booking.
