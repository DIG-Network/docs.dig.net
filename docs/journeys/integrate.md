---
sidebar_position: 2
title: "How do I… integrate DIG into my app?"
description: "The shortest path for integrating developers: connect a wallet, read verified content, build a spend the right way, and deploy from CI — using the typed @dignetwork/dig-sdk and the dig RPC, no prose-scraping required."
keywords:
  - integrate DIG
  - dig-sdk
  - dig RPC
  - window.chia
  - build a spend
  - SDK how-to
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - deploy-action
---

# How do I… integrate DIG into my app?

> **Wire a wallet + verified reads into your own app.** One typed package — [`@dignetwork/dig-sdk`](../sdk.md) — plus a node-agnostic JSON-RPC read path gives you everything: connect a wallet, read verified content, build and broadcast spends, and deploy from CI. This page maps each task to the page that does it.

## The mental model — two surfaces, kept separate

1. A **REST control plane** — `hub.dig.net/v1`, bearer-JWT — for managing stores, domains, teams, and webhooks.
2. A **dig JSON-RPC 2.0 read path** — `rpc.dig.net`, spoken identically by every node — that streams **verified ciphertext** you decrypt client-side.

One wallet surface ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) over two transports (injected, or WalletConnect → Sage), unified by the SDK's `ChiaProvider`. Spends are always built by the canonical CHIP-0035 wasm and signed by the user's wallet — **never hand-rolled**.

## How do I connect a wallet?

Use `ChiaProvider.connect()` — it prefers the injected [`window.chia`](../browser/using-window-chia.md) (DIG Browser) and falls back to WalletConnect → Sage, with the same method names and result shapes either way. To offer the user an explicit **Browser Wallet vs WalletConnect** choice instead of the silent default, enumerate `ChiaProvider.listConnectors()` and connect with the picked connector's `id` as `mode`.

→ [The DIG SDK → ChiaProvider](../sdk.md) · [Using window.chia](../browser/using-window-chia.md)

## How do I read verified content?

Use `DigClient` — it streams ciphertext + inclusion proofs over the dig RPC and **verifies, then decrypts** client-side. Pass the on-chain root as the trust anchor; the SDK does the rest.

→ [The DIG SDK → DigClient](../sdk.md) · [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Methods](../rpc/methods.md)

## How do I build and broadcast a spend?

Build the spend bundle with the canonical CHIP-0035 wasm (re-exported by the SDK at the `/spend` subpath), have the wallet sign it, then broadcast. **Build → sign → broadcast** — never assemble a coin spend by hand.

→ [Building spends](../spends.md) · [CHIP-0035 store-coin spends & delegation](../chip-0035-spends-and-delegation.md)

## How do I gate content behind a payment or an NFT?

Use the SDK's `Paywall` — a high-level pay-to-unlock / NFT-or-collection-ownership gate that composes the provider with the spend builder.

→ [The DIG SDK → Paywall](../sdk.md) · [Build a dapp on Chia](../build-a-dapp/tutorial.md)

## How do I deploy from CI?

Wire `dig-network/deploy-action` for push-to-publish with free PR previews, or drive `dig-store deploy` yourself. Authorize CI with a revocable **deploy key**, not your wallet seed.

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [Deploy keys](../automation/deploy-keys.md)

## How do I get notified about deploys?

Register a **webhook** to receive a signed event when a deployment changes state — for a bot, a dashboard, or follow-on work.

→ [Webhooks](../automation/webhooks.md)

## How do I integrate without reading prose?

Every surface is machine-readable: `/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, and a knowledge graph. Branch on **stable error codes**, never on message text.

→ [Machine-readable surfaces](../machine-surfaces.md) · [Error codes](../support/error-codes.md)

## Build the whole thing end-to-end

The single thread from scaffold to a wallet-aware app live on your own domain.

→ [Build a dapp on Chia](../build-a-dapp/tutorial.md) · [Example gallery](../build-a-dapp/example-gallery.md)

---

## Go deeper

- **The full integration overview** → [For integration developers](../audiences/integration-developers.md)
- **Verified reads & proofs** → [Inclusion vs execution proofs](../inclusion-vs-execution-proofs.md) · [Streaming](../rpc/streaming.md)
- **The normative wallet contract** → [The window.chia provider spec](../protocol/window-chia-provider.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
