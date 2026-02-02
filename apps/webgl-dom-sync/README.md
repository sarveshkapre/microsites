# webgl-dom-sync

`apps/webgl-dom-sync` demonstrates “WebGL + DOM sync”:
- A `react-three-fiber` scene reacts to scroll
- DOM narrative stays readable and scrolls normally (via `@react-three/drei` ScrollControls)
- `prefers-reduced-motion` support + manual toggle
- Optional perf mode (caps DPR / disables antialias)

## Getting started
From the repo root:
```bash
npm install
npm run dev:webgl-dom-sync
```

## Key files
- `src/app/_components/WebglDomSyncDemo.tsx` — main demo
- `src/lib/usePrefersReducedMotion.ts` — reduced-motion hook

