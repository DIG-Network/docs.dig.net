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

### Editing docs — three CI gotchas

When editing the documentation, be aware of these three pitfalls that fail the build or the test suite:

1. **Install pages are mirrored across all 14 locales and must stay byte-identical.** The four install pages under `docs/run-a-node/` — `index.md`, `universal-installer.md`, `apt.md`, `configure.md` — are materialized as byte-identical English copies in every `i18n/<locale>/docusaurus-plugin-content-docs/current/run-a-node/` tree, and `tests/unit/install-path-lint.test.mjs` fails the build if any mirror drifts. When you edit one of these four English pages, you MUST copy the change byte-for-byte into all 13 locale mirrors (same relative path under each `i18n/<locale>/…`).

2. **A new English-only page needs site-absolute links.** A docs page that has no per-locale translation is served as an English fallback in every locale. Its outgoing internal links must be **site-absolute** (`/docs/run-a-node/local-https`), not relative (`./local-https.md`) — a relative link from an English-only fallback page, or a relative link *to* an English-only page from a physical locale mirror, fails the localized Docusaurus broken-link check (`onBrokenLinks: 'throw'`).

3. **Run `npm run test:unit` locally before opening or finishing a PR.** The unit tests (including `install-path-lint` and other drift lints) are separate from `npm run build` — the build alone will NOT catch install-page mirror drift or other linting failures. Always run `npm run test:unit` locally in addition to `npm run build` before pushing your changes.

## Deployment

Tag-triggered: pushing a `v*` tag runs `.github/workflows/deploy.yml`, which builds
and syncs `dist/` to the S3 bucket `docs-dig-net` and invalidates CloudFront
distribution `E1G7CFG1FDYG9Y`. See [`runbooks/deploy.md`](./runbooks/deploy.md).
