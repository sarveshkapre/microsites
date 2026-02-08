# editorial-scrolly

`apps/editorial-scrolly` is an editorial scrollytelling demo:
- Sticky media panel (left)
- Chapter-based narrative sections (right)
- Chapter boundaries update media state (GSAP ScrollTrigger)
- `prefers-reduced-motion` support + manual toggle
- Perf mode toggle to simplify overlays and transition cost

## Getting started
From the repo root:

```bash
npm install
npm run dev:editorial-scrolly
```

Open the printed local URL (defaults to `http://localhost:3000` when run standalone).

## Key files
- `src/app/_components/EditorialScrollyDemo.tsx` - main demo + motion/perf controls
- `src/lib/usePrefersReducedMotion.ts` - reduced-motion hook
