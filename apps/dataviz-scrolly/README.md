# dataviz-scrolly

`apps/dataviz-scrolly` is a data-viz scrollytelling demo:
- Sticky line chart (custom lightweight SVG renderer)
- Chapter-based narrative sections
- Chapter boundaries swap datasets and highlight color
- `prefers-reduced-motion` support + manual toggle (persisted per device)
- Perf mode toggle for lower-cost chart transitions (persisted per device)

## Getting started
From the repo root:

```bash
npm install
npm run dev:dataviz-scrolly
```

## Key files
- `src/components/DataVizScrollyDemo.tsx` - main demo + motion/perf controls
- Reduced-motion hook: `@microsites/controls` (`usePrefersReducedMotion`)
