# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- `apps/gallery`: Next.js gallery app scaffold + initial UI.
- `apps/premium-product`: first demo app (pinned product layout + ScrollTrigger steps).
- `apps/editorial-scrolly`: sticky media + chapter scrollytelling demo.
- `apps/neon-cinematic`: Vite long-scroll “neon cinematic” demo.
- `apps/playful-micro`: Framer Motion micro-interactions demo.
- `apps/webgl-dom-sync`: react-three-fiber scroll-synced 3D + readable DOM demo.
- `apps/dataviz-scrolly`: sticky chart + chapter scrollytelling demo.
- GitHub Pages deployment workflow + static build script.
- CI smoke job to boot a dev server and validate `data-microsite` markers (`npm run smoke:ci`).
- Gallery capability badges for `Reduced motion` and `Perf mode`.
- Root verification scripts: `lint:all`, `build:all`, `verify`.
- Shared controls workspace package: `packages/controls` with persisted boolean hooks for demo toggles.
- Bundle budget guard script: `scripts/check-bundle-budgets.mjs` + root `check:bundles`.
- Local smoke script that boots a dev server and validates `data-microsite` markers: `scripts/smoke.mjs` + root `smoke`.
- `docs/MARKET_SCAN.md` with bounded UX baseline expectations and reference links.
- Session memory/incident logs: `PROJECT_MEMORY.md`, `INCIDENTS.md`.
- `apps/webgl-dom-sync`: split heavy `Canvas` stage into a dynamically-loaded component (`WebglScrollStage`) to defer 3D runtime on initial route load.

### Changed
- Added a shared `DemoControlBar` primitive in `@microsites/controls` and refactored all demos to use one consistent reduced-motion/perf control pattern.
- Expanded the a11y baseline to `premium-product` by adding skip-link + focus-visible support and enforcing it in `scripts/check-a11y-bar.mjs`.
- Expanded `smoke:ci` runtime coverage with `editorial-scrolly` (additional Next.js route sanity check).
- `apps/dataviz-scrolly` now renders chapter-aware chart annotations/callouts, with perf-mode fallback to fewer markers.
- Added perf mode toggles to `premium-product`, `editorial-scrolly`, `playful-micro`, and `dataviz-scrolly`.
- Normalized README docs for touched apps and removed stale scaffold boilerplate.
- Updated perf guidance docs and root README verification instructions.
- `apps/dataviz-scrolly` replaced Recharts with a lightweight SVG chart renderer to remove the `>500 kB` chunk warning.
- Expanded `docs/MARKET_SCAN.md` with modern platform primitives (CSS scroll-driven animations, View Transitions).
- Centralized `usePrefersReducedMotion` into `@microsites/controls` and removed per-app duplicates.
- Added `usePageVisibility` and paused expensive listeners/render loops when the page is backgrounded (where applicable).
- Paused GSAP ScrollTrigger demos when backgrounded by sleeping the GSAP ticker (`premium-product`, `editorial-scrolly`, `neon-cinematic`).
- `apps/gallery` cards now include lightweight poster thumbnails (pure CSS) for faster scanning.
- `apps/gallery` now ships a skip-link + focus-visible baseline; CI enforces via `npm run check:a11y`.
- Enabled View Transitions (progressive enhancement) across the Pages site; reduced-motion disables animations.
- Persisted `Reduced motion` and `Perf mode` toggle states across all demo apps.
- Added a one-click `System` reset control for reduced-motion overrides across all demos.
- Added stable `data-microsite` page markers to all demos to enable lightweight smoke checks.
- `npm run verify` now includes `npm run check:bundles` before the Pages build stage.
- Added `data-microsite` markers to gallery and Vite HTML entrypoints for pre-hydration smoke checks.
- CI now runs the Pages build plus bundle budgets gate; Pages deploy also enforces bundle budgets.
- Replaced the bundle budget checker with per-app entrypoint JS budgets across both Next.js (`out/index.html` script graph) and Vite (`dist/index.html` script graph).
- Tightened budget policy with explicit app-level thresholds (`scripts/check-bundle-budgets.mjs`) while keeping a strict default budget.
- `smoke:ci` now includes a Next microsite runtime check (`premium-product`) in addition to gallery + Vite coverage.
- Expanded `docs/MARKET_SCAN.md` with a 2026-02-11 bounded tool scan and updated gap map.

## [0.1.0] - 2026-02-01
### Added
- Initial repository scaffold and documentation (`README.md`, `AGENTS.md`, `docs/`).
