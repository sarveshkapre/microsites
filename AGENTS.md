# microsites — agent notes

## What this repo is
- A public monorepo of small “microsites” that demonstrate modern web interaction patterns (scroll-driven storytelling, parallax, pinned sections, WebGL+DOM sync, data-viz scrollytelling, playful micro-interactions).
- These are **original demos** inspired by reference sites/patterns — **not** copies of real sites (no scraped code/assets/branding).

## How we’re building it
- Structure: monorepo with multiple apps under `apps/` + shared code under `packages/`.
- A `gallery` app links to each microsite; each microsite builds/deploys independently.
- Each microsite should ship:
  - `prefers-reduced-motion` support (and ideally a manual toggle)
  - a simple “perf mode” switch (cap DPR / disable heavy layers / pause offscreen)
  - its own `README.md` explaining the effect and key implementation ideas

## Repo conventions
- Keep `README.md` current (what exists, how to run).
- Keep `CHANGELOG.md` updated for every meaningful change.
- Keep `chat_context.md` as a lightweight conversation log / requirements history.
- Prefer adding new microsites as `apps/<name>/`.
- Use properly-licensed assets only; track third‑party licenses in `docs/LICENSES.md`.

