# VSBL

A content planning board that crawls your website with Firecrawl, infers your business vertical, and recommends which platforms and content types you should prioritize — then highlights gaps against what you have planned on the board.

## Setup

```bash
npm install
cp .env.example .env
```

Add your Firecrawl API key to `.env`:

```env
FIRECRAWL_API_KEY=fc-YOUR_API_KEY
```

Then start the app:

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

1. Enter a website URL in **Add your website context** to crawl pages into a downloadable markdown ZIP.
2. Coverage recommendations refresh from the crawled content (vertical + company profile).
3. Optionally click the header business chip for a faster single-URL scrape + extract.

## Security

The API key is read only by the Vite development server and is never included in the browser bundle. `.env` and other environment variants are ignored by git; `.env.example` is safe to commit.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui-compatible component structure
- Radix Dialog + Lucide icons
- Firecrawl crawl/scrape via Vite middleware
- Browser localStorage for board + profile persistence
- JSZip for packaging crawled markdown

## Architecture

- `src/App.tsx` — board state, coverage wiring, website-onboarding callback
- `src/components/WebsiteContext.tsx` — Firecrawl crawl, progress, ZIP download
- `src/components/CoveragePanel.tsx` — vertical platform/content recommendations + gaps
- `src/components/BusinessChip.tsx` — profile display + single-URL analyze
- `src/components/PostCard.tsx` / `PostDialog.tsx` — board cards and create flow (content type + dynamic platforms)
- `src/data/platforms.ts` — board swimlanes, best-practice copy, add-platform helpers
- `src/data/playbooks.ts` — curated per-vertical platform/content scores
- `src/data/profile.ts` — `BusinessProfile` storage contract
- `src/lib/coverage.ts` — pure coverage/gap engine
- `src/lib/profileFromCrawl.ts` — derive profile from crawl pages
- `src/lib/analyzeBusiness.ts` — client helper for `/api/analyze-business`
- `server/analyzeBusiness.ts` — Firecrawl scrape + vertical extraction
- `vite.config.ts` — `/api/firecrawl/crawl*` proxy + `/api/analyze-business`

The crawl/analyze proxies run with the Vite development server. For production, move the same proxy logic into your hosting provider's serverless function or backend so the key remains private.

## Vertical coverage

1. `playbooks.ts` scores platforms, content types, and high-value pairs per vertical (0–3).
2. `computeCoverage` diffs that playbook against board posts (`covered` / `thin` / `missing`).
3. Gap CTAs pre-fill the create dialog and can add recommended platforms as swimlanes.

### Business profile contract

- Key: `postflow-profile-v1`
- Shape:

```ts
type BusinessProfile = {
  vertical: "ecommerce" | "saas" | "fintech" | "agency" | "local_services"
  companyName: string
  url: string
  summary?: string
  audience?: string
  source: "url_onboarding" | "manual" | "mock"
}
```

Website crawl onboarding writes this profile via `profileFromCrawl`. A mock e-commerce profile is used until a site is loaded.
