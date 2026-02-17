#!/usr/bin/env bash
set -euo pipefail

workspaces=(
  gallery
  premium-product
  editorial-scrolly
  neon-cinematic
  playful-micro
  webgl-dom-sync
  dataviz-scrolly
)

echo "[ci-local] npm ci"
npm ci

echo "[ci-local] matrix build job (lint + build per workspace)"
for workspace in "${workspaces[@]}"; do
  echo "[ci-local] lint: ${workspace}"
  npm run lint -w "${workspace}"
  echo "[ci-local] build: ${workspace}"
  npm run build -w "${workspace}"
done

echo "[ci-local] smoke job"
npm run smoke:ci

echo "[ci-local] pages build job"
node scripts/build-pages.mjs
npm run check:bundles
npm run check:a11y
npm run check:motion-contract
npm run check:deploy-urls

echo "[ci-local] all workflow-equivalent checks passed"
