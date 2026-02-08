# Clone Feature Tracker

## Context Sources
- README and docs
- TODO/FIXME markers in code
- Test and build failures
- Gaps found during codebase exploration

## Candidate Features To Do
- [ ] (P1) Split `apps/dataviz-scrolly` chart bundle to address the current `>500 kB` Vite warning (lazy-load heavy charting pieces or tune manual chunks).
- [ ] (P1) Persist `Reduced motion` and `Perf mode` user toggles across refreshes for each demo via local storage.
- [ ] (P2) Extract a shared control bar component for motion/perf toggles to reduce duplicated UI logic across apps.

## Implemented
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
- `apps/dataviz-scrolly` remains the heaviest artifact (`~540 kB` JS bundle), making chunk-splitting the next highest-impact perf task.

## Notes
- This file is maintained by the autonomous clone loop.
