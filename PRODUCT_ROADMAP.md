# Product Roadmap

## Product Goal
- Keep microsites production-ready. Current focus: microsites. Find the highest-impact pending work, implement it, test it, and push to main.

## Definition Of Done
- Core feature set delivered for primary workflows.
- UI/UX polished for repeated real usage.
- No open critical reliability issues.
- Verification commands pass and are documented.
- Documentation is current and complete.

## Milestones
- M1 Foundation
- M2 Core Features
- M3 Bug Fixing And Refactor
- M4 UI/UX Improvement
- M5 Stabilization And Release Readiness

## Current Milestone
- M4 UI/UX Improvement

## Brainstorming Queue
- Keep a broad queue of aligned candidates across features, bugs, refactor, UI/UX, docs, and test hardening.

## Pending Features
- (P1) Add CI bundle trend reporting (`current` vs `previous`) for all apps.
- (P2) Add reduced-motion visual snapshot checks (one Next app + one Vite app).
- (P2) Tighten `webgl-dom-sync` JS entry budget from `720 kB` to `620 kB` after two stable cycles.
- (P3) Explore build-time gallery screenshot generation (Playwright) with cache strategy.

## Delivered Features
- (2026-02-17) Unified demo header controls via shared `DemoControlBar` primitive.
- (2026-02-17) Expanded accessibility baseline to `premium-product` (skip-link + focus-visible checks).
- (2026-02-17) Expanded smoke runtime coverage with `editorial-scrolly`.
- (2026-02-17) Added dataviz annotations/callouts with perf-mode fallback.
- (2026-02-17) Added WebGL stage idle-prefetch for faster first interaction.
- (2026-02-17) Added verification gates for motion contract + deploy URL health.

## Risks And Blockers
- Track blockers and mitigation plans.
