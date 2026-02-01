# Performance guidelines

## Baselines
- Ship a reduced-motion path for every demo (`prefers-reduced-motion`).
- Provide a “perf mode” switch where applicable (cap DPR, disable expensive layers).
- Avoid running expensive animations when offscreen.

## Common checks
- Test on a mid-range laptop in Chrome and Safari.
- Watch main-thread time, layout thrash, and GPU overdraw.

