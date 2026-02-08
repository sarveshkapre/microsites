# premium-product

`apps/premium-product` is a premium product-page scroll demo:
- Pinned layout (sticky product card)
- Scroll-driven narrative steps (GSAP ScrollTrigger)
- `prefers-reduced-motion` support + manual toggle
- Perf mode toggle to reduce blur intensity and parallax movement

## Getting started
From the repo root:

```bash
npm install
npm run dev:premium-product
```

Open the printed local URL (defaults to `http://localhost:3000` when run standalone).

## Key files
- `src/app/_components/PremiumProductDemo.tsx` - main demo + motion/perf controls
- `src/lib/usePrefersReducedMotion.ts` - reduced-motion hook
