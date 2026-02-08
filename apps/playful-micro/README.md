# playful-micro

`apps/playful-micro` is a micro-interactions demo built with React + Vite + Framer Motion:
- Magnetic CTA button
- Soft cursor spotlight
- Hover/press feedback
- `prefers-reduced-motion` support + manual toggle
- Perf mode toggle to disable decorative spotlight and tone down motion intensity

## Getting started
From the repo root:

```bash
npm install
npm run dev:playful-micro
```

## Key files
- `src/components/PlayfulMicroDemo.tsx` - main demo + motion/perf controls
- `src/lib/usePrefersReducedMotion.ts` - reduced-motion hook
