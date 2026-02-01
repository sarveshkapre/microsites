# microsites

A public monorepo of small, production-grade demo “microsites” showcasing modern web interaction patterns (scroll-driven narratives, parallax, pinned sections, WebGL+DOM sync, data-viz scrollytelling, playful micro-interactions).

This repo intentionally **does not clone** real websites. Each demo is an original implementation inspired by interaction patterns, using original/properly-licensed assets.

## Planned apps
- `apps/gallery` — index + previews + links to deployed demos
- `apps/premium-product` — pinned sections, subtle parallax, scroll reveals
- `apps/editorial-scrolly` — chapter-based scrollytelling with sticky media
- `apps/neon-cinematic` — dramatic long-scroll motion layers
- `apps/playful-micro` — micro-interactions (cursor/magnetic/hover toys)
- `apps/webgl-dom-sync` — scroll-driven 3D scene + readable DOM
- `apps/dataviz-scrolly` — scroll chapters that morph charts

## Repo layout
- `apps/` — standalone microsites (deploy independently)
- `packages/` — shared UI/utilities/config (as needed)
- `docs/` — effect catalog, perf notes, asset/license tracking

## Getting started
```bash
npm install
npm run dev
```

The default dev script runs the gallery app. For explicit targeting:
```bash
npm run dev:gallery
npm run dev:premium-product
```

## Rules of the road
- Respect `prefers-reduced-motion` in every demo.
- Keep performance budgets tight (no always-on heavy effects).
- Use your own assets or properly licensed ones; document them.
