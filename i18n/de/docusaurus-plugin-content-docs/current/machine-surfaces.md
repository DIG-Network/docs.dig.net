---
sidebar_position: 9
title: Machine-readable surfaces
description: "Every machine-readable entry point: /openrpc.json, /error-codes.json, /llms.txt, /knowledge-graph.json, the sitemap, and per-page schema.org JSON-LD — so an agent integrates DIG without scraping a single line of human prose."
keywords:
  - openrpc.json
  - error-codes.json
  - llms.txt
  - knowledge-graph.json
  - machine-readable
  - agent-friendly
tags:
  - dig-rpc
  - dig-sdk
---

# Machine-readable surfaces

DIG is built to be driven by agents and tools, not just read by humans. Every contract has a stable, documented, machine-readable form so you can integrate without scraping prose.

## At the docs site root

| Surface | What it is |
|---|---|
| [`/openrpc.json`](pathname:///openrpc.json) | OpenRPC 1.2.6 document for the dig JSON-RPC read interface — the **network profile** (rpc.dig.net): methods, request/response JSON Schemas (incl. the chunk object with `chunk_lens` and no `decoy` field), and catalogued error responses (incl. `-32004`). Generated from the same source as [Protocol · The dig RPC](./protocol/dig-rpc.md). |
| [`/openrpc-node.json`](pathname:///openrpc-node.json) | OpenRPC 1.2.6 document for the **node profile** — the local dig-node / in-process DIG Browser node: `dig.getContent` plus the node-only `dig.getAnchoredRoot` / `dig.stage` / `cache.*`. Gate on `dig.methods`. |
| [`/error-codes.json`](pathname:///error-codes.json) | The cross-surface [error catalog](./support/error-codes.md): dig RPC `-32xxx` codes, digstore CLI exit codes, DIGHUb codes, and dig-loader codes, as `[{surface, code, http_or_exit, description}]`. |
| [`/llms.txt`](pathname:///llms.txt) | A link-rich markdown map of the docs ([llms.txt convention](https://llmstxt.org/)). |
| [`/knowledge-graph.json`](pathname:///knowledge-graph.json) | Entities (concepts + docs) and typed edges (`defines`, `part-of`, `requires`, `see-also`). |
| [`/sitemap.xml`](pathname:///sitemap.xml) | Every public route. |
| [`/robots.txt`](pathname:///robots.txt) | Indexing policy (public docs — indexing invited). |

Every doc page also carries schema.org JSON-LD (`TechArticle` / `DefinedTerm`), and the site emits an `Organization` + `WebSite` `@graph` with a `SearchAction` and `Dataset` pointers to `/openrpc.json` and `/error-codes.json`.

## The hub `/v1` control plane {#openapi}

The REST control plane (`hub.dig.net/v1`, bearer-JWT) — accounts, stores, domains, teams, analytics, webhooks — is described by **OpenAPI** served by the hub itself, with a **JWKS** endpoint for verifying tokens and a **live pricing** endpoint for the current uniform capsule price (USD-pegged $DIG). Use those endpoints to manage stores programmatically; the read path is the separate dig RPC above.

## Discovery affordances

- The `digstore` CLI ships `--help-json`, `completion <shell>`, and catalogued exit codes — introspect it without out-of-band knowledge.
- The dig RPC is self-describing via the OpenRPC document (method listing + schemas).
- `@dignetwork/dig-sdk` exposes `capabilities()` so you can branch on what's available. → [The DIG SDK](./sdk.md)

## Related

- [Error codes](./support/error-codes.md) — branch on the code, never the prose
- [Methods](./rpc/methods.md) — the dig RPC method set
- [The DIG SDK](./sdk.md) — the typed integration surface
