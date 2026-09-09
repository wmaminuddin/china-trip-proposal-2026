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

## GitHub Pages (this repo)

Site URL after deploy:

**https://wmaminuddin.github.io/china-trip-proposal-2026/**

- Vite `base` is set to `/china-trip-proposal-2026/` in `vite.config.ts`
- Workflow: [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) builds on every push to `main` and publishes the `dist/` artifact
- Hash routes (`#summary`, `#package`, …) work without server rewrites

Manual re-run: **Actions → Deploy GitHub Pages → Run workflow**.

> Free GitHub accounts need a **public** repository for GitHub Pages. Visibility can be changed under repo Settings if needed.

## Other hosts

### Netlify / Cloudflare Pages / Vercel

- Build command: `npm run build`
- Publish directory: `dist`
- If hosting at the site root, set `base: '/'` in `vite.config.ts` (or remove the `base` option)

## Environment

No API keys or `.env` files are required for the default setup.

- Maps use public **OpenStreetMap** tiles (Leaflet).
- Flight/hotel prices are static indicative data in TypeScript modules.

## Print / PDF

Use the in-app **Print** or **Print full** buttons, then the browser’s print dialog → **Save as PDF**. Map tiles are hidden in print (`no-print`) to avoid blank tile boxes.

## Security note

This site may show **indicative budgets and internal planning copy**. Publishing on GitHub Pages makes that content reachable by anyone with the URL once the repo (or Pages site) is public.
