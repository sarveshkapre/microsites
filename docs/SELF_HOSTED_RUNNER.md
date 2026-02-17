# Self-Hosted GitHub Actions Runner

This repository is configured to run workflows on `runs-on: self-hosted`.

## Runner host requirements

Recommended host:
- Linux x64 (Ubuntu 22.04+), or macOS 13+.

Required tools:
- `git`
- `bash`
- `curl`
- `tar` and `gzip`
- Node.js 20+ and npm (the workflow also uses `actions/setup-node@v4`)

Network access required:
- `github.com`
- `api.github.com`
- `*.actions.githubusercontent.com`
- `objects.githubusercontent.com`
- `codeload.github.com`

Local ports used by smoke checks:
- `3100`, `3101`, `3102`, `5201`

## Register runner (repo scope)

1. Open this repository on GitHub.
2. Go to `Settings` -> `Actions` -> `Runners`.
3. Click `New self-hosted runner`.
4. Pick your OS/arch and copy the commands GitHub provides.
5. On the runner machine, run the downloaded setup commands:
   - create runner directory
   - download runner package
   - `./config.sh --url <repo-url> --token <token>`
6. Start the runner:
   - interactive: `./run.sh`
   - service (recommended): `sudo ./svc.sh install && sudo ./svc.sh start`

## Suggested labels

The workflows use only `self-hosted` in `runs-on`, but adding labels improves filtering and future routing:
- `linux` or `macos`
- `x64` or `arm64`
- `microsites-ci`

## Validate on the runner machine

From the repository root:

```bash
npm run ci:self-hosted-local
```

This script mirrors workflow job commands:
- matrix lint/build for all workspaces
- smoke checks
- pages build + bundle budgets + a11y + motion contract + deploy URL checks

If this script passes, the CI command path is valid for the self-hosted environment.
