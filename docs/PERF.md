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
