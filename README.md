# SeekBrain Project Page

Static project page for **SeekBrain**, built with Vite + React, ready for GitHub Pages.

## Setup

```bash
bun install
bun run dev
```

## Build

```bash
# local / custom domain (site root)
bun run build

# GitHub project pages (https://<user>.github.io/<repo>/)
BASE_PATH=/SeekBrain-Project-Page bun run build
```

Output goes to `dist/`.

## Deploy

Push to `main` (or `master`). GitHub Actions builds and deploys to Pages.

In the repo: **Settings → Pages → Source → GitHub Actions**.

## Content updates

- **CLI demo replays** (`public/cli-demos/*`): rebuilt from real SeekBrain 0.1.4 runs by a
  local build script (not in this repo; it reads the run folders on the lab server).
  Tab titles and credits live in `DEMOS` in `src/components/CliDemo.tsx`.
- **WebUI sessions** (`public/webui-sessions/*`): the 12 zebrafish FC-individuality panels, one
  session each, rebuilt by a local build script (not in this repo);
  the caption is read from `fig:discovery_individuality` in the paper sources.
- **Install commands**: `src/content/release.ts`.
