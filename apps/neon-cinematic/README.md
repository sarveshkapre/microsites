# neon-cinematic

`apps/neon-cinematic` is a “neon cinematic long-scroll” demo:
- Layered glow + grid depth cues
- Scroll-driven cinematic pacing (GSAP ScrollTrigger)
- `prefers-reduced-motion` support + manual toggle
- Optional “perf mode” to reduce blur/overdraw

## Getting started
From the repo root:
```bash
npm install
npm run dev:neon-cinematic
```

## Key files
- `src/components/NeonCinematicDemo.tsx` — main demo
- `src/lib/usePrefersReducedMotion.ts` — reduced-motion hook
