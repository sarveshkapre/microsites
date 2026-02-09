# Clone Feature Tracker

## Context Sources
- README and docs
- TODO/FIXME markers in code
- Test and build failures
- Gaps found during codebase exploration

## Candidate Features To Do
- [ ] (P1) [Selected] Add an explicit “Use system default” reset control for reduced-motion overrides in each demo (current UI supports persisted manual override but not one-click reset to system preference).
  - Score: impact high | effort low | strategic fit high | differentiation medium | risk low | confidence high
- [ ] (P1) [Selected] Add stable page markers for smoke checks (e.g. `data-microsite="<id>"`) across all demos.
  - Score: impact high | effort low | strategic fit high | differentiation low | risk low | confidence high
- [ ] (P1) [Selected] Enforce the Vite bundle budget gate in CI (separate job that builds Vite workspaces then runs `npm run check:bundles`).
  - Score: impact high | effort low | strategic fit high | differentiation low | risk low | confidence high
- [ ] (P2) [Selected] Add a lightweight local smoke-test script that boots one demo server and validates key page markers (to standardize runtime checks in automation runs).
  - Score: impact medium | effort medium | strategic fit high | differentiation low | risk medium | confidence medium
- [ ] (P2) Remove duplicate build work in `npm run verify` (currently both `build:all` and `build:pages`) while preserving deployment safety.
  - Score: impact medium | effort low | strategic fit medium | differentiation low | risk low | confidence medium
- [ ] (P3) Deduplicate per-app `usePrefersReducedMotion` hooks into `packages/controls` (or `packages/motion`) to reduce drift.
  - Score: impact medium | effort medium | strategic fit medium | differentiation low | risk medium | confidence medium
- [ ] (P3) Add gallery thumbnails for each microsite (generated + committed or built-time) to make the index feel less “listy”.
  - Score: impact medium | effort high | strategic fit medium | differentiation medium | risk medium | confidence low
- [ ] (P3) Add `visibilitychange` / offscreen pausing for always-on effects (cursor spotlight, GSAP pinned stages, etc.) to cut idle CPU/GPU.
  - Score: impact medium | effort medium | strategic fit high | differentiation low | risk medium | confidence medium

## Implemented
- [x] (2026-02-09) Replaced `apps/dataviz-scrolly` Recharts runtime with a lightweight SVG chart implementation and removed `recharts` dependency.
  Evidence: `npm run build -w dataviz-scrolly` -> `dist/assets/index-C2iBELS0.js   205.27 kB` (no `>500 kB` warning); files: `apps/dataviz-scrolly/src/components/DataVizScrollyDemo.tsx`, `apps/dataviz-scrolly/package.json`.
- [x] (2026-02-09) Persisted `Reduced motion` and `Perf mode` toggles across all demos via shared workspace controls hooks.
  Evidence: `npm run lint -w premium-product && npm run lint -w editorial-scrolly && npm run lint -w webgl-dom-sync && npm run lint -w neon-cinematic && npm run lint -w playful-micro && npm run lint -w dataviz-scrolly` (pass); files: `packages/controls/index.js`, `packages/controls/index.d.ts` + six demo components.
- [x] (2026-02-09) Added bundle budget enforcement (`500 kB` max per Vite JS asset) and wired it into root verification.
  Evidence: `npm run check:bundles` (all PASS); files: `scripts/check-bundle-budgets.mjs`, `package.json`, `README.md`, `docs/PERF.md`.
- [x] (2026-02-09) Bootstrapped session memory and incident logs for autonomous maintenance workflow.
  Evidence: files `PROJECT_MEMORY.md`, `INCIDENTS.md`; linked in changelog entry `CHANGELOG.md`.
- [x] (2026-02-08) Added perf-mode toggles to all remaining demos: `apps/premium-product/src/app/_components/PremiumProductDemo.tsx`, `apps/editorial-scrolly/src/app/_components/EditorialScrollyDemo.tsx`, `apps/playful-micro/src/components/PlayfulMicroDemo.tsx`, `apps/dataviz-scrolly/src/components/DataVizScrollyDemo.tsx`.
  Evidence: `npm run lint -w premium-product && npm run lint -w editorial-scrolly && npm run lint -w playful-micro && npm run lint -w dataviz-scrolly` (pass).
- [x] (2026-02-08) Surfaced production-readiness capability badges in gallery using explicit metadata (`reducedMotion`, `perfMode`): `apps/gallery/src/lib/microsites.ts`, `apps/gallery/src/app/page.tsx`.
  Evidence: `npm run lint -w gallery && npm run build -w gallery` (pass).
- [x] (2026-02-08) Normalized demo README docs to reflect current behavior and removed stale scaffold text: `apps/premium-product/README.md`, `apps/editorial-scrolly/README.md`, `apps/playful-micro/README.md`, `apps/dataviz-scrolly/README.md`, `apps/gallery/README.md`.
- [x] (2026-02-08) Added root verification workflow scripts and documentation: `package.json`, `README.md`, `docs/PERF.md`.
  Evidence: `npm run verify` (pass).
- [x] (2026-02-08) Updated project memory/logging for this cycle: `CHANGELOG.md`, `CLONE_FEATURES.md`.

## Insights
- `Deploy GitHub Pages` cancellations on older commits are expected due workflow concurrency (`cancel-in-progress: true`), not build failures.
- `npm run verify` currently runs both `build:all` and `build:pages`, which duplicates builds; this is acceptable for safety but can be optimized later for speed.
- `apps/dataviz-scrolly` JS payload dropped from `540.24 kB` to `205.27 kB` after replacing Recharts with SVG primitives.
- Shared `@microsites/controls` hooks reduced repeated toggle state logic and made persisted control behavior consistent across all demos.

## Notes
- This file is maintained by the autonomous clone loop.
