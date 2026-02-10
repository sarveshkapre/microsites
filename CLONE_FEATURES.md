# Clone Feature Tracker

## Context Sources
- README and docs
- TODO/FIXME markers in code
- Test and build failures
- Gaps found during codebase exploration

## Candidate Features To Do
- [ ] (P2) Add per-app bundle budgets (thresholds differ by demo) while keeping a strict default.
  - Score: impact medium | effort medium | strategic fit medium | differentiation low | risk low | confidence medium
- [ ] (P3) Add a Next.js bundle size / report gate for the Next demos (keep Vite budgets strict, add a lighter Next guard).
  - Score: impact medium | effort medium | strategic fit medium | differentiation low | risk low | confidence medium
- [ ] (P3) Add gallery thumbnails for each microsite (generated + committed or built-time) to make the index feel less “listy”.
  - Score: impact medium | effort high | strategic fit medium | differentiation medium | risk medium | confidence low
- [ ] (P3) Add `visibilitychange` / offscreen pausing for always-on effects (cursor spotlight, GSAP pinned stages, etc.) to cut idle CPU/GPU.
  - Score: impact medium | effort medium | strategic fit high | differentiation low | risk medium | confidence medium

## Implemented
- [x] (2026-02-10) Centralized `usePrefersReducedMotion` into `@microsites/controls` and deleted per-app hook copies.
  Evidence: `packages/controls/index.js`, `packages/controls/index.d.ts`; local lint: `npm run lint -w premium-product && npm run lint -w editorial-scrolly && npm run lint -w webgl-dom-sync && npm run lint -w neon-cinematic && npm run lint -w playful-micro && npm run lint -w dataviz-scrolly` (PASS).
- [x] (2026-02-10) Added `usePageVisibility` and used it to pause backgrounded loops (WebGL `frameloop`, cursor spotlight listener).
  Evidence: `packages/controls/index.js`, `apps/webgl-dom-sync/src/app/_components/WebglDomSyncDemo.tsx`, `apps/playful-micro/src/components/PlayfulMicroDemo.tsx`; local lint: `npm run lint -w webgl-dom-sync && npm run lint -w playful-micro` (PASS).
- [x] (2026-02-10) Gallery cards now include lightweight poster thumbnails (pure CSS) to improve scanability.
  Evidence: `apps/gallery/src/app/page.tsx`, `apps/gallery/src/lib/microsites.ts`; local build: `npm run build -w gallery` (PASS).
- [x] (2026-02-10) Added skip-link + focus-visible baseline checks and enforced them in CI/Pages builds.
  Evidence: `scripts/check-a11y-bar.mjs`, `package.json` (`check:a11y`), workflows `/.github/workflows/ci.yml`, `/.github/workflows/pages.yml`; local: `npm run build:pages && npm run check:a11y` (PASS).
- [x] (2026-02-10) Enabled View Transitions (progressive enhancement) across the Pages site and disabled animations under `prefers-reduced-motion`.
  Evidence: `apps/gallery/src/app/globals.css`, `apps/premium-product/src/app/globals.css`, `apps/editorial-scrolly/src/app/globals.css`, `apps/webgl-dom-sync/src/app/globals.css`, `apps/neon-cinematic/src/index.css`, `apps/playful-micro/src/index.css`, `apps/dataviz-scrolly/src/index.css`.
- [x] (2026-02-09) Expanded the bounded market scan with modern platform primitives (CSS scroll-driven animations, View Transitions).
  Evidence: `docs/MARKET_SCAN.md`.
- [x] (2026-02-09) Added a fast CI smoke job plus a curated `smoke:ci` script (gallery + one Vite demo).
  Evidence: `npm run smoke:ci` (PASS); workflow: `/.github/workflows/ci.yml`; script: `package.json`.
- [x] (2026-02-09) Enforced bundle budgets in CI and GitHub Pages deploy (Pages build job + `npm run check:bundles`).
  Evidence: workflow updates `/.github/workflows/ci.yml`, `/.github/workflows/pages.yml`; local: `npm run check:bundles` (PASS).
- [x] (2026-02-09) Added a local smoke script (`npm run smoke`) that boots a dev server and asserts `data-microsite="<id>"` exists.
  Evidence: `npm run smoke -- --app gallery --port 3100` (PASS); file: `scripts/smoke.mjs`, `package.json`.
- [x] (2026-02-09) Added `data-microsite` markers to gallery and Vite HTML entrypoints to enable pre-hydration smoke checks.
  Evidence: `npm run smoke -- --app neon-cinematic --port 5201` (PASS); files: `apps/gallery/src/app/page.tsx`, `apps/neon-cinematic/index.html`, `apps/playful-micro/index.html`, `apps/dataviz-scrolly/index.html`.
- [x] (2026-02-09) Added an explicit `System` reset control for reduced-motion overrides across demos.
  Evidence: components `apps/premium-product/src/app/_components/PremiumProductDemo.tsx`, `apps/editorial-scrolly/src/app/_components/EditorialScrollyDemo.tsx`, `apps/webgl-dom-sync/src/app/_components/WebglDomSyncDemo.tsx`, `apps/neon-cinematic/src/components/NeonCinematicDemo.tsx`, `apps/playful-micro/src/components/PlayfulMicroDemo.tsx`, `apps/dataviz-scrolly/src/components/DataVizScrollyDemo.tsx`.
- [x] (2026-02-09) Added bounded market scan notes to keep UX baseline expectations explicit.
  Evidence: `docs/MARKET_SCAN.md`.
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
- `npm run verify` runs `lint:all`, then `build:pages`, then `check:bundles`, then `check:a11y`.
- `apps/dataviz-scrolly` JS payload dropped from `540.24 kB` to `205.27 kB` after replacing Recharts with SVG primitives.
- Shared `@microsites/controls` hooks reduced repeated toggle state logic and made persisted control behavior consistent across all demos.
- Vite dev servers may bind to `localhost` (IPv6) only on some machines; smoke checks should default to `http://localhost:<port>` instead of `127.0.0.1`.
- Adding `@view-transition { navigation: auto; }` across the Pages site gives a low-effort polish win, while the reduced-motion CSS keeps it safe.

## Notes
- This file is maintained by the autonomous clone loop.
