# webgl-dom-sync

`apps/webgl-dom-sync` demonstrates “WebGL + DOM sync”:
- A `react-three-fiber` scene reacts to scroll
- DOM narrative stays readable and scrolls normally (via `@react-three/drei` ScrollControls)
- `prefers-reduced-motion` support + manual toggle
- Optional perf mode (caps DPR / disables antialias)
- Deferred loading for the heavy 3D stage to keep the initial route payload lighter
- Idle-prefetch for the deferred 3D stage to reduce first-interaction latency after initial paint

## Getting started
From the repo root:
```bash
npm install
npm run dev:webgl-dom-sync
```

## Key files
- `src/app/_components/WebglDomSyncDemo.tsx` — shell UI + controls + dynamic stage loader
- `src/app/_components/WebglScrollStage.tsx` — 3D stage (`Canvas`, `ScrollControls`, scene)
- Reduced-motion hook: `@microsites/controls` (`usePrefersReducedMotion`)
