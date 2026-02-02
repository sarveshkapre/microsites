# dataviz-scrolly

`apps/dataviz-scrolly` is a data-viz scrollytelling demo:
- Sticky line chart (Recharts)
- Chapter-based narrative sections
- Chapter boundaries swap datasets and highlight color
- `prefers-reduced-motion` support + manual toggle

## Getting started
From the repo root:
```bash
npm install
npm run dev:dataviz-scrolly
```

## Key files
- `src/components/DataVizScrollyDemo.tsx` — main demo
- `src/lib/usePrefersReducedMotion.ts` — reduced-motion hook

