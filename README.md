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
