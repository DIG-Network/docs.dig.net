# docs.dig.net

The DIG Network documentation site — a [Docusaurus](https://docusaurus.io/) v3
static site built with **npm** and deployed to S3 + CloudFront. It carries the
ecosystem's user-facing docs across 14 locales plus committed machine-readable
artifacts (`llms.txt`, `knowledge-graph.json`, `openrpc.json`, `error-codes.json`)
that other repositories consume.

The normative contract for the build pipeline, the machine artifacts, and the drift
gates is [`SPEC.md`](./SPEC.md). Operational procedures (deploy + local run) live in
[`runbooks/`](./runbooks).

## Prerequisites

- Node.js >= 18
- npm (the repo is npm-only — `package-lock.json` is the lockfile; do not use yarn)

## Install

```
npm ci
```

## Local development

```
npm start
```

Runs `npm run gen` first (generates `knowledge-graph.json` + the OpenRPC/error-code
artifacts), then starts the Docusaurus dev server with live reload.

## Build

```
npm run build
```

Generates the static site into `dist/`. `onBrokenLinks`/`onBrokenAnchors` are set to
`throw`, so a broken internal link or anchor in any locale fails the build. The
`postbuild` step annotates each locale's `sitemap.xml` with hreflang alternates.

## Quality gates

```
npm run typecheck   # tsc
npm run lint        # eslint . — zero errors
npm run test:unit   # node --test (pure logic + drift lints)
npm run test:a11y   # Playwright: axe-core, ARIA tree, keyboard, mobile nav
npm run test:e2e    # Playwright: full a11y/SEO suite (needs a build first)
```

## Deployment

Tag-triggered: pushing a `v*` tag runs `.github/workflows/deploy.yml`, which builds
and syncs `dist/` to the S3 bucket `docs-dig-net` and invalidates CloudFront
distribution `E1G7CFG1FDYG9Y`. See [`runbooks/deploy.md`](./runbooks/deploy.md).
