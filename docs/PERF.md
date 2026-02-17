# Performance guidelines

## Baselines
- Ship a reduced-motion path for every demo (`prefers-reduced-motion`).
- Provide a “perf mode” switch in every demo (cap DPR, disable expensive layers, lower animation complexity).
- Avoid running expensive animations when offscreen.

## Common checks
- Test on a mid-range laptop in Chrome and Safari.
- Watch main-thread time, layout thrash, and GPU overdraw.
- Run `npm run check:bundles` after builds to enforce per-app entrypoint JS budgets.
- Keep the strict default at `500 kB` and use explicit per-app overrides only when justified by the demo type (for example WebGL-heavy routes).

## App JS budgets

Entrypoint bundle budgets are enforced by `scripts/check-bundle-budgets.mjs`.

| App | Runtime | Entrypoint JS budget | Why |
| --- | --- | --- | --- |
| `gallery` | Next.js | `600 kB` | Gallery has more navigation metadata and card chrome than single-demo apps. |
| `premium-product` | Next.js | `720 kB` | GSAP-heavy pinned layout with richer narrative sections. |
| `editorial-scrolly` | Next.js | `720 kB` | Sticky media + chapter transitions with GSAP timelines. |
| `webgl-dom-sync` | Next.js | `720 kB` | WebGL stack (`three`, `@react-three/*`) needs a larger but capped budget. |
| `neon-cinematic` | Vite | `360 kB` | Visual layering + GSAP, but no charting or 3D runtime. |
| `playful-micro` | Vite | `360 kB` | Framer Motion interactions with a constrained visual footprint. |
| `dataviz-scrolly` | Vite | `260 kB` | Lightweight SVG charting should stay the smallest narrative payload. |

When adjusting a budget, update both this table and `scripts/check-bundle-budgets.mjs` in the same change.
