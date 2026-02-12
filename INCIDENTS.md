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

### 2026-02-12T20:01:19Z | Codex execution failure
- Date: 2026-02-12T20:01:19Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-2.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:04:46Z | Codex execution failure
- Date: 2026-02-12T20:04:46Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-3.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:08:15Z | Codex execution failure
- Date: 2026-02-12T20:08:15Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-4.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:11:42Z | Codex execution failure
- Date: 2026-02-12T20:11:42Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-5.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:15:13Z | Codex execution failure
- Date: 2026-02-12T20:15:13Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-6.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:18:43Z | Codex execution failure
- Date: 2026-02-12T20:18:43Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-7.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:22:09Z | Codex execution failure
- Date: 2026-02-12T20:22:09Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-8.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:25:38Z | Codex execution failure
- Date: 2026-02-12T20:25:38Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-9.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:29:20Z | Codex execution failure
- Date: 2026-02-12T20:29:20Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-10.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:32:46Z | Codex execution failure
- Date: 2026-02-12T20:32:46Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-11.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:36:15Z | Codex execution failure
- Date: 2026-02-12T20:36:15Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-12.log
- Commit: pending
- Confidence: medium

### 2026-02-12T20:39:43Z | Codex execution failure
- Date: 2026-02-12T20:39:43Z
- Trigger: Codex execution failure
- Impact: Repo session did not complete cleanly
- Root Cause: codex exec returned a non-zero status
- Fix: Captured failure logs and kept repository in a recoverable state
- Prevention Rule: Re-run with same pass context and inspect pass log before retrying
- Evidence: pass_log=logs/20260212-101456-microsites-cycle-13.log
- Commit: pending
- Confidence: medium
