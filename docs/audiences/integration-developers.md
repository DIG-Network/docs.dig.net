---
sidebar_position: 3
title: For integration developers
description: "A fully machine-readable platform — OpenAPI/OpenRPC, a catalogued error taxonomy, live pricing, JWKS, per-page JSON, and a typed @dignetwork/dig-sdk — so you wire a wallet + verified reads into your app without scraping a single line of human prose."
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# For integration developers

> **A fully machine-readable platform** — OpenAPI/OpenRPC, a catalogued error taxonomy, live pricing, JWKS, per-page JSON, and a typed `@dignetwork/dig-sdk` — so you wire a wallet + verified reads into your app **without scraping a single line of human prose**.

## The mental model — two surfaces, kept separate

1. **A REST control plane** — `hub.dig.net/v1`, bearer-JWT — for managing stores, domains, teams, and NFTs.
2. **A node-agnostic dig JSON-RPC 2.0 READ path** — `rpc.dig.net` — that streams **verified ciphertext**.

One **wallet** surface ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) over two transports — injected (DIG Browser) or WalletConnect → Sage — unified by the SDK's `ChiaProvider`. Spends are always built by the canonical CHIP-0035 wasm and signed by the user's wallet — **never hand-rolled**. Branch on **stable error codes**, never prose.

## Build a dapp — end-to-end

The single thread from scaffold to a wallet-aware app live on your own domain.

→ [Build a dapp on Chia](../build-a-dapp/tutorial.md)

## The DIG SDK

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, and the canonical spends re-exported at the `/spend` subpath. Install, subpaths, and `capabilities()`.

→ [The DIG SDK](../sdk.md)

## Connect a wallet — `window.chia`

Detect the injected provider, call `connect()` (per-origin consent), and use the CHIP-0002 methods.

→ [Using window.chia](../browser/using-window-chia.md) · [provider reference](../browser/window-chia-reference.md) · spec: [the window.chia provider](../protocol/window-chia-provider.md)

## Read verified content — `DigClient` + the dig RPC methods

`DigClient` streams ciphertext + inclusion proofs and **verifies-then-decrypts** client-side. Call the methods directly when you need to.

→ [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Methods](../rpc/methods.md)

## Streaming & reassembly

The chunk model, the [retrieval key](../concepts.md#retrieval-key), and the verify-then-decrypt order.

→ [Streaming](../rpc/streaming.md)

## Building spends — the canonical CHIP-0035 builder

The **build → sign → broadcast** split: the wasm builds the spend bundle, the wallet signs, you broadcast. The hub never hand-rolls a spend, and neither should you.

→ [Building spends](../spends.md)

## The hub `/v1` control plane

Auth (JWT / OIDC / device pairing), stores, domains, analytics, and webhooks over REST.

→ [Machine-readable surfaces](../machine-surfaces.md#openapi) for the OpenAPI document.

## CI deploy — `dig-network/deploy-action`

Modes, keyless OIDC, the outcome enum, and the `--json` output for downstream steps.

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Machine-readable surfaces

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — discover and integrate without scraping prose.

→ [Machine-readable surfaces](../machine-surfaces.md)

## Error codes — branch on the code

One consolidated reference across the dig RPC, the CLI, DIGHUb, the dig loader, and the SDK.

→ [Error codes](../support/error-codes.md)

---

## Go deeper: the protocol

- **"verified reads"** → [The dig RPC (Network Content Interface)](../rpc/what-is-the-dig-rpc.md) · [Inclusion vs execution proofs](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [the normative provider spec](../protocol/window-chia-provider.md)
- **"retrieval_key & streaming"** → [URNs & encryption](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **"a deploy token is a revocable writer key"** → [CHIP-0035 spends & delegation](../chip-0035-spends-and-delegation.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
