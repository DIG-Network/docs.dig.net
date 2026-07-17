---
sidebar_position: 5
title: Changelog
description: "What changed across the DIG developer surfaces — the dig-store CLI, the dig RPC, and the window.chia provider — including breaking changes and the versioning rules for each."
keywords:
  - DIG changelog
  - breaking changes
  - CLI version
  - RPC versioning
  - window.chia version
  - release notes
tags:
  - digstore-cli
  - dig-rpc
  - window-chia
  - dighub
---

# Changelog

What changed across the surfaces you build against — the **`dig-store` CLI**, the **dig RPC**, and the **`window.chia`** provider. This page tracks the developer-facing contract: new capabilities, behavior changes, and anything that could break existing code.

:::note Pre-release — the contract is still settling
DIG is pre-release. Until a `1.0`, surfaces may change between releases; breaking changes are called out here. For the full, commit-level history see each repo's GitHub releases, linked below.
:::

## How each surface is versioned

| Surface | Version source | Where to read it |
|---|---|---|
| **`dig-store` CLI** | semver tags on the `dig-store` repo (`vX.Y.Z`) | `dig-store --version` · [Releases ↗](https://github.com/DIG-Network/dig-store/releases) |
| **dig RPC** | the JSON-RPC method set; a node advertises what it implements via `dig.methods` | [dig RPC methods](../rpc/methods.md) |
| **`window.chia`** | the injected provider's capability/version surface (the DIG Browser is the reference implementation) | [Using window.chia](../browser/using-window-chia.md) |
| **`@dignetwork/dig-sdk`** | semver on npm | [npm ↗](https://www.npmjs.com/package/@dignetwork/dig-sdk) |
| **`@dignetwork/chip35-dl-coin-wasm`** | semver on npm (the canonical spend builder) | [npm ↗](https://www.npmjs.com/package/@dignetwork/chip35-dl-coin-wasm) |

The **dig RPC chunk wire format and the read-crypto contract** (URN scheme, retrieval key, encryption, Merkle proofs) are shared byte-for-byte across every client. A change to any of them is a coordinated, breaking change and will be flagged here.

## Current state (pre-release baseline)

This is the starting point the changelog tracks forward from.

### `dig-store` CLI

- **Free pre-publish loop:** `dig-store new <template>` (scaffold), `dig-store dev` (local preview on the real `chia://` read path with an injected `window.chia` shim), and `dig-store doctor` (preflight) — all free, no chain, no spend. Also scaffold from npm with [`npm create dig-app`](../build-a-dapp/scaffold.md).
- **Single-shot deploy:** `dig-store deploy` (build → stage → advance the on-chain root → publish), non-interactive and CI-safe; `commit --dry-run` previews cost without spending.
- **CI deploy:** the [GitHub Action](../digstore/cli/deploy-from-github-actions.md) (`uses: DIG-Network/deploy-action@v1`, requires dig-store ≥ `v0.6.0`) — git-push-to-deploy with **free per-PR previews** and a PR comment + GitHub deployment status. **Keyless** by default (GitHub OIDC → a store-scoped session, no long-lived hub secret); a revocable `writer-key` advances the on-chain root and a dedicated funding wallet pays the fee, all driven from a committable [`dig.toml`](../digstore/cli/configuration.md).
- **Distinct exit codes** per error kind for scripting/CI — see [Error codes](./error-codes.md#digstore-cli-exit-codes).

### dig RPC

- JSON-RPC 2.0 read methods — the core set is `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, `dig.getProof`, `dig.getProofStatus`, plus discovery/metadata helpers (`dig.getMetadata`, `dig.health`, `dig.methods`). A node advertises exactly what it implements via `dig.methods`. See [Methods](../rpc/methods.md) for the full reference.
- **Blind/oblivious model:** a content miss is **not an error** — it returns a `decoy` result, never a `-32xxx`. See [the blind serving model](../rpc/conformance.md).
- Standard JSON-RPC error codes for malformed calls — see [Error codes](./error-codes.md#dig-rpc-json-rpc).

### `window.chia` provider

- CHIP-0002 provider injected by the DIG Browser: `connect()`, `request({ method, params })`, and the supported method set (`chip0002_*`, `chia_*`), with per-origin consent. See [Using window.chia](../browser/using-window-chia.md).
- **No key-export / seed-reveal method** on the surface — by design.

### Uniform per-capsule pricing (structural)

A **uniform price per [capsule](../concepts.md#capsule)** (mint or commit), paid in $DIG at the live rate. The price is uniform across capsules by design — see [why the price is uniform](../digstore/cli/onchain-anchoring.md#why-the-price-is-uniform). The price targets a roughly steady real-world cost, so the $DIG amount floats with the market while the per-capsule price stays uniform.

## Breaking changes

_None recorded yet (pre-release baseline)._ Breaking changes to the CLI flags/output, the RPC method set or chunk format, the read-crypto contract, or the `window.chia` surface will be listed here with the version they land in and a migration note.

## Related

- [Status](./status.md) — live health of the DIG services
- [dig-store releases ↗](https://github.com/DIG-Network/dig-store/releases) — commit-level CLI history
- [dig RPC methods](../rpc/methods.md) — the read method set this tracks
- [Using window.chia](../browser/using-window-chia.md) — the provider surface this tracks
- [Concepts & glossary](../concepts.md) — the vocabulary, defined once
