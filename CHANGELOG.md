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
- `apps/dataviz-scrolly`: sticky chart + chapter scrollytelling demo (Recharts).
- GitHub Pages deployment workflow + static build script.
- Gallery capability badges for `Reduced motion` and `Perf mode`.
- Root verification scripts: `lint:all`, `build:all`, `verify`.
- Shared controls workspace package: `packages/controls` with persisted boolean hooks for demo toggles.
- Bundle budget guard script: `scripts/check-bundle-budgets.mjs` + root `check:bundles`.
- Session memory/incident logs: `PROJECT_MEMORY.md`, `INCIDENTS.md`.

### Changed
- Added perf mode toggles to `premium-product`, `editorial-scrolly`, `playful-micro`, and `dataviz-scrolly`.
- Normalized README docs for touched apps and removed stale scaffold boilerplate.
- Updated perf guidance docs and root README verification instructions.
- `apps/dataviz-scrolly` replaced Recharts with a lightweight SVG chart renderer to remove the `>500 kB` chunk warning.
- Persisted `Reduced motion` and `Perf mode` toggle states across all demo apps.
- Added a one-click `System` reset control for reduced-motion overrides across all demos.
- Added stable `data-microsite` page markers to all demos to enable lightweight smoke checks.
- `npm run verify` now includes `npm run check:bundles` before the Pages build stage.

## [0.1.0] - 2026-02-01
### Added
- Initial repository scaffold and documentation (`README.md`, `AGENTS.md`, `docs/`).
