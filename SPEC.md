# docs.dig.net — normative specification

This is the authoritative contract for the DIG Network documentation site: the
build pipeline, the machine-readable artifacts it publishes, and the invariants
those artifacts and the drift gates guarantee. It is normative — it states what
IS and what an implementation MUST uphold, not history or roadmap.

docs.dig.net is a [Docusaurus](https://docusaurus.io) v3 static site built with
npm and deployed as static assets to S3 + CloudFront. It carries the ecosystem's
user-facing documentation across 14 locales, plus a set of committed
machine-readable artifacts that other repositories consume.

## 1. Locales

The site ships **14 locales**. The default locale is `en`, served unprefixed at
the site root; every other locale is served under `/<locale>/…`.

```
en (default), zh-CN, zh-TW, ko, ja, ru, es, pt-BR, fr, de, tr, vi, id, hi
```

The locale list MUST be identical in every place that enumerates it:
`docusaurus.config.ts` `i18n.locales`, `scripts/gen-hreflang-sitemaps.mjs`
(`LOCALES`), and `src/localeResolver.mjs` (`DEFAULT_LOCALE` + `NON_DEFAULT_LOCALES`).
A change to the shipped set MUST update all three in the same unit of work.

### 1.1 Browser-locale resolution

`src/localeResolver.mjs` resolves a raw BCP-47 tag to a shipped locale. It mirrors
hub.dig.net's `detectBrowserLocale` contract so both products resolve a tag to the
SAME locale. Resolution order for a single tag (`resolveOne`):

1. **Exact canonical match** against a shipped locale (case- and separator-insensitive).
2. **Region/script override** — Traditional-script Chinese tags (`zh-TW`, `zh-HK`,
   `zh-MO`, `zh-Hant`) MUST resolve to `zh-TW` and never collapse to the language
   default.
3. **Primary-language fallback** (e.g. `pt-PT` → `pt-BR`, `es-419` → `es`, any other
   `zh-*` → `zh-CN`).
4. Otherwise `null` (unsupported).

`detectBrowserLocale(langs)` returns the first tag that resolves, else the default
locale. The client redirect (`src/clientLocaleRedirect.ts`) applies this once per
browser, only from the default-locale path, and never overrides a manual choice.

### 1.2 hreflang sitemaps

`scripts/gen-hreflang-sitemaps.mjs` runs as `postbuild` and annotates every locale's
`sitemap.xml` with `<xhtml:link rel="alternate" hreflang="…">` entries for all 14
locales plus `x-default`. A page's logical (locale-free) path is recovered by
stripping the current locale's prefix (`stripLocalePrefix`) and each alternate URL is
that logical path re-prefixed (`buildAlternateUrl`); the two are inverses within a
locale. This is deterministic from the locale list and MUST NOT drift from the URL
structure Docusaurus generates.

## 2. Build pipeline

The generation scripts are wired as npm lifecycle hooks and MUST run before a build
or dev start:

- `prebuild` / `prestart` → `npm run gen` = `gen-knowledge-graph.mjs` then
  `gen-machine-specs.mjs`.
- `build` → `docusaurus build --out-dir dist`. `onBrokenLinks` and
  `onBrokenAnchors` are `"throw"`, so a broken link or anchor in any locale FAILS the
  build.
- `postbuild` → `gen-hreflang-sitemaps.mjs` (sitemap hreflang annotation).

The generation scripts are idempotent: re-running them on an unchanged docs tree
produces byte-identical output. Their pure helpers are exported for unit testing and
their file-writing `main()` runs only when the script is invoked directly.

## 3. Machine-readable artifacts (consumed by other repos)

The site publishes these committed artifacts at the site root. They are stable
machine surfaces; other repositories depend on them, so their schemas are
**additive-only** — fields are added, never renamed, removed, or repurposed.

### 3.1 `static/llms.txt`

The `llms.txt`-convention entry point for AI/LLM agents: a curated Markdown index of
the documentation with absolute `https://docs.dig.net` links. Committed (hand-authored),
verified present and non-empty in `dist/` by the CI build gate.

### 3.2 `static/knowledge-graph.json`

Derived by `gen-knowledge-graph.mjs` from the docs themselves, so it cannot drift from
the prose. Schema:

```
{ generatedFrom, site, nodes: [...], edges: [...] }
node: { id, type: "concept" | "doc", title, url, [tags], [tag] }
edge: { from, to, type: "defines" | "part-of" | "requires" | "see-also" }
```

Nodes and edges come from each page's frontmatter and its `## Related` section. The
**frontmatter schema** the generator depends on:

- `title:` — optional; a quoted or unquoted string. Falls back to the filename.
- `slug:` — optional; when `/` the page maps to `/docs`.
- `tags:` — optional; a YAML block-sequence (`  - <tag>` lines). Each tag that is in
  the controlled vocabulary (`CONCEPT_TITLES`) becomes a `part-of` edge to that
  concept node.

The `## Related` section is a Markdown list; each relative `.md` link (optionally with
a `#anchor`) becomes a typed `doc → doc` edge. Links outside the `docs/` tree, and
non-`.md` links, are ignored.

### 3.3 `static/openrpc.json` and `static/openrpc-node.json`

OpenRPC 1.2.6 documents for the dig JSON-RPC, rendered by `gen-machine-specs.mjs` from
the single source of truth `scripts/dig-spec.mjs`. `openrpc.json` is the network
read interface; `openrpc-node.json` is the node method set. These are the canonical
dig-RPC specifications referenced by other modules; the request/response JSON Schemas
and catalogued error responses MUST match the implementing repos.

### 3.4 `static/error-codes.json`

The ecosystem cross-surface error catalog rendered from `dig-spec.mjs`: dig RPC
`-32xxx` codes, dig-store CLI exit codes, DIGHUb user-facing codes, and the `chia://`
loader codes, as a flat `[{surface, code, http_or_exit, description}]` list plus a
`bySurface` index.

## 4. Drift gates (build-time guarantees)

The build FAILS if any of these diverge — they keep the prose, the JSON, and the
source enums in lockstep:

- **Prose ↔ error-codes JSON.** `gen-machine-specs.mjs` parses the error tables in
  `docs/support/error-codes.md` and fails the build if the JSON catalog and the prose
  tables disagree on the set of codes for any surface. The prose page and
  `error-codes.json` are therefore always consistent.
- **URN format.** `tests/unit/urn-format-lint.test.mjs` fails if a malformed
  scheme-wrapped URN (`dig://urn:dig:…` or `chia://urn:…`) appears anywhere in the
  authored docs, any locale, or the generated artifacts.
- **Broken links/anchors.** The Docusaurus build itself (`onBrokenLinks`/
  `onBrokenAnchors: "throw"`) fails on any broken internal link or anchor.

## 5. Quality gates (§2.4a)

Every change is gated in CI before merge:

- **Typecheck** — `npm run typecheck` (`tsc`) clean.
- **Lint** — `npm run lint` (`eslint .`) with zero errors.
- **Unit tests** — `npm run test:unit` (`node --test`) green.
- **Build** — the multi-locale `npm run build` succeeds and emits `llms.txt`,
  `sitemap.xml`, and `robots.txt` into `dist/`.
- **Accessibility / SEO / e2e** — the Playwright suites (`test:a11y`, `test:e2e`):
  axe-core, ARIA-tree snapshots, keyboard navigation, mobile nav, and SEO metadata.

## 6. Content rules

User-facing docs are self-contained and authoritative. They MUST NOT reference
internal project files, narrate drift versus prior designs, or expose internal task
numbers or process meta-commentary. Pricing copy is neutral and amount-agnostic:
capsule pricing is dynamic and USD-pegged; prose says "the capsule price" (paid in
`$DIG` at the live rate) and never a flat numeric amount.
