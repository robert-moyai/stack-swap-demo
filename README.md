# VSBL MVP

A lightweight content planning board with one swimlane per social platform. Posts move from **Idea** to **Ready to post** and persist in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- shadcn/ui-compatible component structure
- Radix Dialog + Lucide icons
- Browser localStorage (no backend required)

## MVP architecture

- `src/App.tsx` — board state and layout
- `src/components/PostCard.tsx` — post card and stage controls
- `src/components/PostDialog.tsx` — create-post dialog
- `src/components/ui/` — reusable shadcn-style primitives
- `src/types.ts` — platform and post domain model
- `src/data/seed.ts` — initial demo content

The data layer is intentionally local for the first demo. It can later be swapped for an API/database without changing the board components.
