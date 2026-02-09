# Incidents

## 2026-02-09
- Incident status: maintenance-tooling incident (resolved).
- What happened:
  - `scripts/smoke.mjs` initially targeted `http://127.0.0.1:<port>` and timed out against Vite dev servers that bound to `localhost` (IPv6) only on this machine.
- Root cause:
  - Assumed `localhost` implied IPv4 loopback; on some environments it resolves to IPv6 and servers may not bind to `127.0.0.1`.
- Fix:
  - Default smoke checks to `http://localhost:<port>` and add `--host` override.
- Prevention rules:
  - Prefer `localhost` (or an explicit host param) for local dev-server smoke checks; do not hardcode `127.0.0.1`.
  - Treat cancelled superseded deploy runs as expected unless latest run fails.
  - Keep `npm run verify` and bundle-budget checks green before pushing to `main`.
