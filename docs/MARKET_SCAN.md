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
