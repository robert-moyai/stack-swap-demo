# Contextly website onboarding

An onboarding flow that crawls a website with Firecrawl, converts its pages to markdown, and creates a downloadable ZIP in the browser.

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

Open the local URL printed by Vite (usually `http://localhost:5173`). Enter a website URL, wait for the crawl to complete, and download the generated markdown ZIP.

## Security

The API key is read only by the Vite development server and is never included in the browser bundle. `.env` and other environment variants are ignored by git; `.env.example` is safe to commit.

## Architecture

- `src/App.tsx` — onboarding, crawl polling, progress, and client-side ZIP creation
- `vite.config.ts` — server-only Firecrawl proxy powered by Vite middleware
- `JSZip` — packages each crawled page as a separate markdown file

The included API proxy runs with the Vite development server. For a production deployment, move the same proxy logic into your hosting provider's serverless function or backend service so the key remains private.
