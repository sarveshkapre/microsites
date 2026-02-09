# Project Memory

## 2026-02-09 - Cycle 2 session

### Decision 1: Replace `dataviz-scrolly` Recharts runtime with a custom SVG chart renderer
- Why:
  - `apps/dataviz-scrolly` produced a `>500 kB` Vite chunk warning (`540.24 kB`), which was the biggest current performance risk.
  - The demo only needed one line-series pattern, so a purpose-built renderer was lower complexity and lower payload.
- Evidence:
  - Before: `npm run build -w dataviz-scrolly` -> `dist/assets/index-BP5VZmIw.js   540.24 kB` with Vite warning.
  - After: `npm run build -w dataviz-scrolly` -> `dist/assets/index-C2iBELS0.js   205.27 kB` with no warning.
  - Files: `apps/dataviz-scrolly/src/components/DataVizScrollyDemo.tsx`, `apps/dataviz-scrolly/package.json`.
- Commit: main (cycle 2 autonomous maintainer session, 2026-02-09).
- Confidence: high.
- Trust label: trusted-local-build-signal.
- Follow-up:
  - Add annotation overlays and multi-series support while keeping bundle budget green.

### Decision 2: Persist demo control toggles and centralize control-state logic
- Why:
  - Manual `Reduced motion` / `Perf mode` toggles reset on refresh across demos, which hurt UX and made testing inconsistent.
  - Control-state logic was duplicated in each app component.
- Evidence:
  - Shared hooks package added: `packages/controls/index.js`, `packages/controls/index.d.ts`.
  - Wired in demos: `apps/premium-product/src/app/_components/PremiumProductDemo.tsx`, `apps/editorial-scrolly/src/app/_components/EditorialScrollyDemo.tsx`, `apps/webgl-dom-sync/src/app/_components/WebglDomSyncDemo.tsx`, `apps/neon-cinematic/src/components/NeonCinematicDemo.tsx`, `apps/playful-micro/src/components/PlayfulMicroDemo.tsx`, `apps/dataviz-scrolly/src/components/DataVizScrollyDemo.tsx`.
  - Validation: lint/build passed for touched apps.
- Commit: main (cycle 2 autonomous maintainer session, 2026-02-09).
- Confidence: high.
- Trust label: trusted-local-verification.
- Follow-up:
  - Optionally add a visible "Use system default" reset control for reduced-motion overrides.

### Decision 3: Enforce Vite bundle budgets in verification workflow
- Why:
  - Regression prevention is stronger when payload budgets fail fast in local/CI verification.
- Evidence:
  - Added `scripts/check-bundle-budgets.mjs` and `npm run check:bundles`.
  - Updated `verify` pipeline in `package.json`.
  - Output: all Vite apps pass under 500 kB.
- Commit: main (cycle 2 autonomous maintainer session, 2026-02-09).
- Confidence: high.
- Trust label: trusted-local-check-automation.
- Follow-up:
  - Add per-app budget thresholds when demos become more differentiated.

### Decision 4: Enforce bundle budgets in CI and on GitHub Pages deploy
- Why:
  - Local gates are useful, but CI enforcement is what prevents regressions from landing on `main`.
  - Pages deploy should never publish a bundle that violates the repo’s stated performance budget.
- Evidence:
  - CI now runs Pages build + `npm run check:bundles`: `.github/workflows/ci.yml`.
  - Pages deploy now runs `npm run check:bundles`: `.github/workflows/pages.yml`.
  - Local check: `npm run check:bundles` -> all PASS.
- Commit: main (cycle 2 autonomous maintainer session, 2026-02-09).
- Confidence: high.
- Trust label: trusted-local-check-automation.

### Decision 5: Add a lightweight smoke script + static page markers for runtime checks
- Why:
  - A cheap runtime sanity check catches regressions that lint/build can’t (routing, base paths, missing critical DOM markers).
  - Adding `data-microsite` in HTML entrypoints enables pre-hydration checks (no headless browser needed).
- Evidence:
  - Added `scripts/smoke.mjs` and root `npm run smoke`.
  - Added `data-microsite="gallery"` to gallery page wrapper.
  - Added `data-microsite` markers to Vite `index.html` root mounts.
  - Local: `npm run smoke -- --app gallery --port 3100` -> PASS.
  - Local: `npm run smoke -- --app neon-cinematic --port 5201` -> PASS.
- Commit: main (cycle 2 autonomous maintainer session, 2026-02-09).
- Confidence: high.
- Trust label: trusted-local-runtime-signal.

### Mistakes And Fixes
- Smoke script initially targeted `127.0.0.1`, which can fail when dev servers bind to `localhost` (IPv6) only on some environments.
  - Fix: default to `localhost` and add a `--host` option.
  - Prevention rule: avoid hardcoding IPv4 loopback in local dev smoke checks.

### Verification Evidence
- `npm run lint:all` -> PASS
- `npm run build:all` -> PASS
- `npm run check:bundles` -> PASS (all Vite apps under `500 kB` per JS asset)
- `node scripts/build-pages.mjs` -> PASS
- `npm run smoke -- --app gallery --port 3100 --timeout-ms 30000` -> PASS
- `npm run smoke -- --app neon-cinematic --port 5201 --timeout-ms 30000` -> PASS
