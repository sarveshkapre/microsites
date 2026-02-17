# Market Scan (Bounded)

This repo targets production-grade interaction demos (scrollytelling, pinned sections, WebGL+DOM sync, micro-interactions). This note captures baseline UX expectations and references (patterns, not code) to keep the bar high.

## 2026-02-09

### Baseline expectations (parity)
- Respect `prefers-reduced-motion` and provide a simple manual override for testing.
- Use runtime media-query switching (`matchMedia`) for motion-heavy timelines, so behavior adapts live when the setting changes.
- Avoid accidental GPU/CPU burn: cap DPR in perf mode, reduce always-on effects, and pause when tab is backgrounded.
- Keep JS payloads small and measurable (budget gates that fail CI are ideal).

### Modern platform primitives (preferred when they fit)
- Prefer native CSS scroll-driven animation primitives for simple parallax/reveal/pin-adjacent effects.
  - Treat this as progressive enhancement: gate behind `@supports (animation-timeline: scroll())` or feature-detect and keep a JS fallback.
  - Still respect `prefers-reduced-motion` (skip the timeline or collapse to static states).
- Prefer the View Transitions API for “page swap” polish in the gallery and any internal navigation patterns.
  - Treat as progressive enhancement: feature-detect (`document.startViewTransition`) and fall back to normal navigation.
  - Respect `prefers-reduced-motion` by disabling transitions (or collapsing to opacity-only, short duration).

### References
```text
MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
Web.dev on prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
GSAP matchMedia (responsive + reduced motion patterns): https://gsap.com/docs/v3/GSAP/gsap.matchMedia/
three.js WebGLRenderer.setPixelRatio (DPR cap lever): https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setPixelRatio
MDN scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
MDN View Transitions API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
Chrome Developers View Transitions: https://developer.chrome.com/docs/web-platform/view-transitions/
```

## 2026-02-10

### Notes (bounded)
- Cross-document View Transitions are opt-in on both pages. The simplest Pages-wide enablement is `@view-transition { navigation: auto; }`.
- Treat this as progressive enhancement and keep reduced-motion safe:
  Under `prefers-reduced-motion`, disable View Transition animations via the `::view-transition-*` pseudo-elements.

### References
```text
Chrome Developers: cross-document view transitions: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
```

## 2026-02-11

### Bounded competitor/tool scan (product baseline)
- Visual builders (Framer/Webflow) continue to set expectation that teams can ship high-polish scroll scenes quickly, with layered parallax, pinned storytelling, and text/visual sync.
- Motion toolkits continue to treat reduced-motion as a first-class API, not an afterthought.
- 3D tooling now exposes explicit performance diagnostics (frame time + memory style signals), reinforcing that WebGL demos need measurable perf controls, not just visual effects.

### Gap map vs this repo
- Missing:
  - No critical missing items in the current baseline set after adding Next.js + Vite bundle gates.
- Weak:
  - Runtime smoke coverage still samples only a subset of demos (currently gallery + one Next demo + one Vite demo).
- Parity:
  - Reduced-motion + manual overrides are implemented across all demos.
  - Perf-mode toggles are implemented across all demos.
- Differentiator opportunities:
  - Keep shipping lightweight, documented patterns with explicit fallback/perf knobs rather than visual-only demos.

### References
```text
Framer University (scroll effect baseline examples): https://framer.university/blog/11-scroll-effects-you-can-create-with-framer
Motion docs (`useReducedMotion`): https://motion.dev/docs/react-use-reduced-motion
Webflow Accessibility checklist (reduced motion): https://webflow.com/accessibility/checklist/task/reduced-motion
Spline docs (Performance Panel): https://docs.spline.design/doc/performance-panel/docQvB0W7fJm
```

## 2026-02-17

### Current-world stack snapshot (official sources)
- Next.js 16 is the current major and ships stronger defaults around App Router ergonomics and Turbopack workflows.
- React 19 remains the active major baseline for modern app stacks in this repo.
- Tailwind CSS v4 emphasizes lower rebuild latency and native cascade-layer usage, which supports our multi-app workspace ergonomics.
- Vite 7.x is now the expected baseline for lightweight React microsite builds.

### Browser/platform support snapshot
- View Transitions API support is broad enough to keep as progressive enhancement (`~89%` global usage support).
- `@view-transition` rule support trails slightly (`~81%` global), so CSS guardrails are still necessary.
- CSS Scroll-driven Animations support is significant but not universal (`~78%` global), so JS fallback patterns remain required.

### Implications for this repo
- Keep View Transitions and scroll-driven effects as optional enhancements with explicit fallbacks.
- Continue shipping reduced-motion and perf-mode controls as first-class UX requirements.
- Keep bundle + runtime gates in CI because payload/perf regressions are still the fastest way microsites degrade.

### Improvement queue update
- Priority next:
  - CI bundle trend deltas (`current` vs `previous`) in `check:bundles` logs.
  - Reduced-motion visual snapshots for one Next app + one Vite app.
  - Tighten `webgl-dom-sync` entry budget toward `620 kB` after two stable runs.

### References
```text
Next.js 16 release: https://nextjs.org/blog/next-16
React 19 announcement: https://react.dev/blog/2024/12/05/react-19
Tailwind CSS v4 release: https://tailwindcss.com/blog/tailwindcss-v4
Vite 7 release: https://vite.dev/blog/announcing-vite7
View Transitions API support: https://caniuse.com/view-transitions
@view-transition support: https://caniuse.com/mdn-css_at-rules_view-transition
CSS scroll-driven animations support: https://caniuse.com/wf-scroll-driven-animations
MDN Scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
```
