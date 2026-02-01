`apps/premium-product` is a “premium product page” scroll demo:
- Pinned layout (sticky product card)
- Scroll-driven narrative steps (GSAP ScrollTrigger)
- Respects `prefers-reduced-motion` (plus a manual toggle)

## Getting Started

From the repo root:

```bash
npm install
npm run dev:premium-product
```

Open the printed local URL (defaults to `http://localhost:3000` if run standalone).

## Key files
- `src/app/_components/PremiumProductDemo.tsx` — main demo
- `src/lib/usePrefersReducedMotion.ts` — reduced-motion hook

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
