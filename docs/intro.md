---
sidebar_position: 1
slug: /
title: DIG Network
description: "Overview of the DIG Network primitives: DigStore for content-addressable publishing, dig RPC for blind hosting and retrieval, and the DIG Browser for content access."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - DigStore
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network

**DIG Network is a Proof-of-Stake Layer 2 on Chia** — a decentralized network for publishing, addressing, and serving content without trusting the host.

These docs cover the network and its **primitives**: the composable building blocks developers use to build on DIG. The network is still expanding, and more primitives will be documented here over time.

## The capsule

One concept runs through every primitive. A **capsule** is a single immutable store generation — the pair `(storeId, rootHash)`, written canonically as `storeId:rootHash`. A **store is a sequence of capsules**, one per commit (each commit advances the on-chain root and produces a new capsule).

The capsule is the network's unit of:

- **Compilation** — each capsule compiles to one fixed-size WASM module (padded so its length leaks nothing about content size).
- **Pricing** — a **uniform per-capsule price** (mint or commit), paid in $DIG at the live rate; a store's lifetime cost is the uniform per-capsule price × the number of capsules.
- **Retrieval** — a URN names one capsule (plus an optional resource within it).
- **Caching** — a host or browser caches a capsule keyed by `storeId:rootHash`; the local cache is a set of capsules.
- **Provenance** — each capsule's root carries the publisher's BLS signature and a Merkle root.

This is the ecosystem-wide definition: "capsule = `(storeId, rootHash)`" means the same thing in DigStore, the dig RPC, and the DIG Browser.

:::tip Try it
[**Create your first capsule in DIGHUb ↗**](https://hub.dig.net/new) — publish a site in the browser, no CLI required. Each capsule (mint or commit) costs the **uniform capsule price in $DIG**.
:::

## Primitives

### 🗄️ DigStore

The first and most fundamental primitive: a **content-addressable, encrypted WASM project format**. You point it at a build directory, commit deployments like Git, and get a single self-defending `.wasm` file that is both your data and the server that gates access to it. The URN *is* the key — it both locates and decrypts.

→ **[Explore DigStore](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[What is DigStore?](./digstore/what-is-digstore.md)** | The one-file idea, in a nutshell |
| **[The Format](./digstore/format/overview.md)** | Projects, deployments, URNs, encryption, proofs |
| **[CLI Tutorial](./digstore/cli/quickstart.md)** | Install and use `digstore` in your project |

### 🛰️ dig RPC

The networking primitive: a **standard interface for reading content from hosted DigStore deployments**. JSON-RPC 2.0 over HTTPS `POST` — every hosting node speaks it identically, so content is portable and clients are node-agnostic. It serves ciphertext + inclusion proofs by retrieval key, whole deployments by `(store_id, root)`, and the public discovery manifest — streamed in chunks, blind by construction, verified and decrypted entirely client-side.

→ **[Explore the dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[What is the dig RPC?](./rpc/what-is-the-dig-rpc.md)** | One endpoint for the whole network's read path |
| **[Methods](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | The chunk model, reassembly, and proof verification |
| **[Conformance & Security](./rpc/conformance.md)** | The blind model, CORS, and what a node must implement |

### 🌐 DIG Browser

The client primitive: a **browser with a built-in Chia wallet**. It injects a `window.chia` provider on every page, so any web app can request the user's address, signatures, and spends with no WalletConnect setup — a drop-in alternative for apps that already speak CHIP-0002. It also resolves `chia://` content addresses directly.

→ **[Build against the DIG Browser](./browser/using-window-chia.md)**

| | |
|---|---|
| **[Using `window.chia` in your app](./browser/using-window-chia.md)** | Detect the injected wallet, connect, and call CHIP-0002 methods |

:::tip Try it
[**Get the DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — download the browser to open `chia://` content and use the built-in wallet.
:::

*More primitives — settlement and node operation — will get their own sections as they land.*

## Pick your path

The docs are organized around **what you're doing**. Each track opens with a ten-second "why", the mental model you need, and the high-signal how-to — then links into the protocol when you want to go deeper.

- **[Publish a site or app you own](./audiences/app-developers.md)** — ship a website/app as your own on-chain asset; build free, publish a capsule.
- **[Mint NFTs & collections](./audiences/nft-developers.md)** — CHIP-0007 drops backed by permanent, tamper-evident capsules.
- **[Integrate DIG into your app](./audiences/integration-developers.md)** — a typed SDK + a fully machine-readable platform.
- **[Run a node](./run-a-node/index.md)** — serve content provably and provider-blind.
- **[Open chia:// content](./audiences/content-consumers.md)** — read content your own browser verifies against the chain.
- **[Get unstuck](./audiences/troubleshooting.md)** — find your failure by its stable code.

New to the vocabulary? Skim [Concepts & glossary](./concepts.md). Want the full design? Read the [Protocol deep-dive](./protocol-deep-dive.md).

:::note
DIG Network and its primitives are open source. DigStore is licensed under GPL-2.0; see the [digstore repository](https://github.com/DIG-Network/digstore).
:::

## Related

- [Quickstart](./quickstart.md) — ship your first site; free to build and preview
- [Build a dapp on Chia](./build-a-dapp/tutorial.md) — every primitive in one end-to-end tutorial
- [Concepts & glossary](./concepts.md) — the core DIG entities, defined and linked
- [What is DigStore?](./digstore/what-is-digstore.md) — the content-addressable store format
- [What is the dig RPC?](./rpc/what-is-the-dig-rpc.md) — the network-wide read interface
- [The chia:// protocol](./browser/chia-protocol.md) — opening content in the DIG Browser
- [Get help](./support/get-help.md) — community, troubleshooting, and error codes
