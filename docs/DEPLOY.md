# Deploying

This repo is organized as a monorepo. Each microsite under `apps/<name>` is designed to be deployed independently.

## GitHub Pages (current)
This repo deploys a combined static site to GitHub Pages via `.github/workflows/pages.yml`.

- Build script: `scripts/build-pages.mjs`
- Live URL: `https://sarveshkapre.github.io/microsites/`
- Workflow runner: self-hosted GitHub Actions runner (`runs-on: self-hosted`)
- Runner setup instructions: `docs/SELF_HOSTED_RUNNER.md`

## Vercel (recommended)
Create one Vercel project per app.

For each project:
- **Root Directory**: `apps/<app-name>`
- Build command: `npm run build`
- Install command: `npm install`

### Output notes
- Next.js apps: use the default Next.js settings.
- Vite apps: output directory is `dist`.

### Suggested project list
- `apps/gallery`
- `apps/premium-product`
- `apps/editorial-scrolly`
- `apps/neon-cinematic`
- `apps/playful-micro`
- `apps/webgl-dom-sync`
- `apps/dataviz-scrolly`

After you deploy, add the public URL to the gallery in `apps/gallery/src/lib/microsites.ts`.

## Netlify / Cloudflare Pages
Same idea: one project per app, with the project root set to `apps/<app-name>`.
