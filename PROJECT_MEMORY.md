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
