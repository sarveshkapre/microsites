# Project Memory

## 2026-02-11 - Cycle 1 session

### Recent Decisions
- 2026-02-11 | Enforce per-app entrypoint JS budgets across Next.js + Vite in one guard script | Vite-only checks left a blind spot for Next demos; route-level script totals catch practical payload regressions earlier | Evidence: `scripts/check-bundle-budgets.mjs`, `npm run check:bundles` PASS with all apps reported | Commit: pending | Confidence: high | Trust label: trusted (local code/tests)
- 2026-02-11 | Defer `webgl-dom-sync` 3D runtime behind a dynamic stage component | `@react-three/*` was dominating initial route JS; code-splitting the stage keeps initial payload smaller while preserving behavior after hydration | Evidence: `apps/webgl-dom-sync/src/app/_components/WebglDomSyncDemo.tsx`, `apps/webgl-dom-sync/src/app/_components/WebglScrollStage.tsx`, `npm run verify` PASS (`apps/webgl-dom-sync` entrypoint total `556.58 kB`) | Commit: pending | Confidence: high | Trust label: trusted (local code/tests)
- 2026-02-11 | Expand CI smoke coverage with one additional Next demo (`premium-product`) | Runtime checks were skewed to gallery + one Vite app; adding a Next demo improves framework parity for routing/boot sanity | Evidence: `package.json` (`smoke:ci`), `npm run smoke:ci` PASS | Commit: pending | Confidence: high | Trust label: trusted (local code/tests)
- 2026-02-11 | Refresh bounded market scan and gap map before prioritization | Tool/UX baselines evolve; updated references informed which work should be treated as missing vs parity | Evidence: `docs/MARKET_SCAN.md` (2026-02-11 section, references to Framer/Motion/Webflow/Spline docs) | Commit: pending | Confidence: medium | Trust label: untrusted (external web/comments)

### Mistakes And Fixes
- No production or verification incidents in this session.

### Verification Evidence
- `npm run lint:all` -> PASS
- `npm run build:pages` -> PASS
- `npm run check:bundles` -> PASS
- `npm run smoke:ci` -> PASS
- `npm run smoke -- --app webgl-dom-sync --port 3102 --timeout-ms 30000` -> PASS
- `npm run verify` -> PASS

## 2026-02-10 - Cycle 1 session

### Decision 1: Centralize environment hooks in `@microsites/controls`
- Why:
  - Reduced-motion detection was duplicated across every microsite, increasing drift risk.
  - Page visibility is a cheap, high-signal lever for reducing idle CPU/GPU in interactive demos.
- Evidence:
  - `usePrefersReducedMotion`: `packages/controls/index.js`, `packages/controls/index.d.ts`; per-app copies removed.
  - `usePageVisibility`: `packages/controls/index.js`, `packages/controls/index.d.ts`; used to pause background loops.
  - Local validation:
    - `npm run lint -w premium-product && npm run lint -w editorial-scrolly && npm run lint -w webgl-dom-sync && npm run lint -w neon-cinematic && npm run lint -w playful-micro && npm run lint -w dataviz-scrolly` -> PASS
    - `npm run lint -w webgl-dom-sync && npm run lint -w playful-micro` -> PASS
- Commit: `e796ac2`, `3cbf8a7`.
- Confidence: high.
- Trust label: trusted-local-verification.
- Follow-up:
  - Consider pausing GSAP timelines/ScrollTrigger contexts when backgrounded for the pinned-scroll demos.

### Decision 1b: Pause GSAP ScrollTrigger demos when backgrounded
- Why:
  - ScrollTrigger-powered pages can keep GSAP's ticker active even when the tab is hidden, which is wasted work.
  - Sleeping the GSAP ticker on `document.visibilitychange` is a small, safe win that doesn't affect normal foreground behavior.
- Evidence:
  - `usePageVisibility` is used to sleep/wake the ticker + refresh triggers on resume:
    - `apps/premium-product/src/app/_components/PremiumProductDemo.tsx`
    - `apps/editorial-scrolly/src/app/_components/EditorialScrollyDemo.tsx`
    - `apps/neon-cinematic/src/components/NeonCinematicDemo.tsx`
  - Local validation: `npm run verify` -> PASS.
- Commit: `ebd746d`.
- Confidence: high.
- Trust label: trusted-local-verification.
- Follow-up:
  - If we ever have multiple GSAP-heavy effects on one page, consider disabling/enabling only the relevant `ScrollTrigger` instances rather than sleeping the global ticker.

### Decision 2: Add an accessibility baseline gate (skip-link + focus-visible)
- Why:
  - The gallery is the product front door; it should have a minimal a11y bar that never regresses.
  - A static HTML/CSS gate is cheaper than a full browser-based audit while still catching common misses.
- Evidence:
  - Skip link + target: `apps/gallery/src/app/layout.tsx`, `apps/gallery/src/app/page.tsx`.
  - Focus-visible styling: `apps/gallery/src/app/globals.css`.
  - Gate: `scripts/check-a11y-bar.mjs`, root script `check:a11y`, wired into CI/Pages workflows.
  - Local validation: `npm run build:pages && npm run check:a11y` -> PASS.
- Commit: `dd9e854`.
- Confidence: high.
- Trust label: trusted-local-runtime-signal.
- Follow-up:
  - Expand the gate to one microsite route (not just gallery) once we decide the minimal common a11y contract.

### Decision 3: Make the gallery scan like a product via “poster” thumbnails (no assets)
- Why:
  - Gallery cards were readable but “listy”; posters improve information scent without adding licensed assets or screenshot pipelines.
- Evidence:
  - `apps/gallery/src/app/page.tsx`, `apps/gallery/src/lib/microsites.ts`.
  - Local build: `npm run build -w gallery` -> PASS.
- Commit: `4212755`.
- Confidence: medium.
- Trust label: trusted-local-build-signal.
- Follow-up:
  - If we want real thumbnails later, add a build-time generator (Playwright) and track the assets in `docs/LICENSES.md` if any third-party content is ever introduced.

### Decision 4: Enable View Transitions across the Pages site (progressive enhancement)
- Why:
  - Provides visible navigation polish with minimal code and good reduced-motion story.
  - Aligns with the repo’s market-scan baseline for “modern platform primitives”.
- Evidence:
  - `@view-transition { navigation: auto; }` + reduced-motion opt-out via `::view-transition-*` pseudo-elements across each app stylesheet.
  - Local builds: `npm run build -w gallery` -> PASS; `npm run build -w neon-cinematic` -> PASS.
- Commit: `b6d69dc`.
- Confidence: medium.
- Trust label: trusted-local-build-signal.

### Verification Evidence
- `npm run lint -w premium-product && npm run lint -w editorial-scrolly && npm run lint -w webgl-dom-sync && npm run lint -w neon-cinematic && npm run lint -w playful-micro && npm run lint -w dataviz-scrolly` -> PASS
- `npm run build -w gallery` -> PASS
- `npm run build:pages` -> PASS
- `npm run check:a11y` -> PASS
- `npm run verify` -> PASS
- `npm run smoke:ci` -> PASS

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

## 2026-02-09 - Cycle 5 session

### Decision 1: Add a CI smoke job and a curated `smoke:ci` script
- Why:
  - Lint/build passes can still miss runtime regressions (routing/base-path issues, missing critical DOM markers).
  - Keeping a small curated smoke set (`gallery` + one Vite demo) makes CI runtime checks cheap and repeatable locally.
- Evidence:
  - Workflow job: `.github/workflows/ci.yml` (job `Smoke (dev servers)`).
  - Script: `package.json` (`smoke:ci`).
  - Local: `npm run smoke:ci` -> PASS (gallery + neon-cinematic).
- Commit: `3d12f79`.
- Confidence: high.
- Trust label: trusted-local-runtime-signal.

### Decision 2: Track modern platform primitives as preferred baselines for future demos
- Why:
  - Some effects are now better served by platform features (less JS, fewer runtime edge-cases) when available.
  - Making these expectations explicit helps keep new demos aligned with a production-grade bar.
- Evidence:
  - Updated bounded scan with references for CSS scroll-driven animations and View Transitions: `docs/MARKET_SCAN.md`.
- Commit: `145b73e`.
- Confidence: medium.
- Trust label: trusted-docs-update.

### Verification Evidence
- `npm run verify` -> PASS
- `npm run smoke:ci` -> PASS
