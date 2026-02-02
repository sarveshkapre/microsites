# Deploying

This repo is organized as a monorepo. Each microsite under `apps/<name>` is designed to be deployed independently.

## Vercel (recommended)
Create one Vercel project per app.

For each project:
- **Root Directory**: `apps/<app-name>`
- Build command: `npm run build`
- Install command: `npm install`
- Output: Next.js default

### Suggested project list
- `apps/gallery`
- `apps/premium-product`
- `apps/editorial-scrolly`

After you deploy, add the public URL to the gallery in `apps/gallery/src/lib/microsites.ts`.

## Netlify / Cloudflare Pages
Same idea: one project per app, with the project root set to `apps/<app-name>`.

