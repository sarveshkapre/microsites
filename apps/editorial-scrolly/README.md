`apps/editorial-scrolly` is an editorial scrollytelling demo:
- Sticky media panel (left)
- Chapter-based narrative sections (right)
- Chapter boundaries update media state (GSAP ScrollTrigger)
- Respects `prefers-reduced-motion` (plus a manual toggle)

## Getting Started

From the repo root:

```bash
npm install
npm run dev:editorial-scrolly
```

Open the printed local URL (defaults to `http://localhost:3000` if run standalone).

## Key files
- `src/app/_components/EditorialScrollyDemo.tsx` — main demo
- `src/lib/usePrefersReducedMotion.ts` — reduced-motion hook
