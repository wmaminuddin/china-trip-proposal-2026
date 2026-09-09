# Deployment

This project builds to a **static site** (no server runtime).

## Production build

```bash
npm ci
npm run build
```

Output directory: `dist/`.

Smoke-test locally:

```bash
npm run preview
```

## Hosting options

Any static host works. Examples:

### GitHub Pages

1. In the repo: **Settings → Pages**.
2. Source: GitHub Actions or deploy `dist/` from the `main` branch (or `gh-pages`).
3. If deploying to a project pages URL (`https://<user>.github.io/<repo>/`), set Vite `base` in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/china-trip-proposal-2026/',
  // ...
})
```

Hash routing (`#summary`, etc.) works well with GitHub Pages (no server rewrite needed).

### Netlify / Cloudflare Pages / Vercel

- Build command: `npm run build`
- Publish directory: `dist`
- No special redirects required for hash routes

## Environment

No API keys or `.env` files are required for the default setup.

- Maps use public **OpenStreetMap** tiles (Leaflet).
- Flight/hotel prices are static indicative data in TypeScript modules.

## Print / PDF

Use the in-app **Print** or **Print full** buttons, then the browser’s print dialog → **Save as PDF**. Map tiles are hidden in print (`no-print`) to avoid blank tile boxes.

## Security note

This repo may contain **indicative budgets and internal planning copy**. Prefer a **private** GitHub repository unless you intentionally want public sharing. Do not commit secrets (none are used by default).
