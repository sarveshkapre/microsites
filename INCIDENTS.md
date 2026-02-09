# Incidents

## 2026-02-09
- Incident status: no production/runtime incident observed in this session.
- Observation (non-incident): older `Deploy GitHub Pages` runs were cancelled due configured workflow concurrency (`cancel-in-progress: true`), while latest runs completed successfully.
- Prevention rules:
  - Treat cancelled superseded deploy runs as expected unless latest run fails.
  - Keep `npm run verify` and bundle-budget checks green before pushing to `main`.
