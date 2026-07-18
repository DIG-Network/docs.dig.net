# Runbook — run docs.dig.net locally

## Prerequisites

- Node.js >= 18
- npm (npm-only repo — use `package-lock.json`, not yarn)

## Install

```
npm ci
```

## Run the dev server

```
npm start
```

- `prestart` runs `npm run gen` first, generating `static/knowledge-graph.json` and
  the OpenRPC/error-code artifacts from the docs + `scripts/dig-spec.mjs`.
- Docusaurus serves the **default (`en`) locale** with live reload at
  `http://localhost:3000`.

### Preview a non-default locale

The dev server serves one locale at a time. To preview e.g. Spanish:

```
npm run docusaurus -- start --locale es
```

## Production build + local preview

```
npm run build     # generates dist/ across all 14 locales; postbuild adds hreflang
npm run serve     # serves dist/ locally
```

`npm run build` fails on any broken internal link or anchor
(`onBrokenLinks`/`onBrokenAnchors: "throw"`).

## Regenerate machine artifacts only

```
npm run gen              # knowledge-graph.json + openrpc.json + error-codes.json
npm run knowledge-graph  # just the knowledge graph
npm run machine-specs    # just the OpenRPC + error-code artifacts (runs the drift gate)
```

## Run the checks

```
npm run typecheck
npm run lint
npm run test:unit
npm run build && npm run test:a11y && npm run test:e2e   # Playwright needs a build first
```

The Playwright suites install their browser once with
`npx playwright install --with-deps chromium`.
