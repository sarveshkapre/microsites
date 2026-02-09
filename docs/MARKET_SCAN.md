# Market Scan (Bounded)

This repo targets production-grade interaction demos (scrollytelling, pinned sections, WebGL+DOM sync, micro-interactions). This note captures baseline UX expectations and references (patterns, not code) to keep the bar high.

## 2026-02-09

### Baseline expectations (parity)
- Respect `prefers-reduced-motion` and provide a simple manual override for testing.
- Use runtime media-query switching (`matchMedia`) for motion-heavy timelines, so behavior adapts live when the setting changes.
- Avoid accidental GPU/CPU burn: cap DPR in perf mode, reduce always-on effects, and pause when tab is backgrounded.
- Keep JS payloads small and measurable (budget gates that fail CI are ideal).

### References
```text
MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
Web.dev on prefers-reduced-motion: https://web.dev/articles/prefers-reduced-motion
GSAP matchMedia (responsive + reduced motion patterns): https://gsap.com/docs/v3/GSAP/gsap.matchMedia/
three.js WebGLRenderer.setPixelRatio (DPR cap lever): https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setPixelRatio
```

