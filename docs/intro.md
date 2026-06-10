---
sidebar_position: 1
slug: /
title: DIG Network Docs
---

# DIG Network

**DIG Network is a Proof-of-Stake Layer 2 on Chia** — a decentralized network for publishing, addressing, and serving content without trusting the host.

These docs cover the network and its **primitives**: the composable building blocks developers use to build on DIG. The network is still expanding, and more primitives will be documented here over time.

## Primitives

### 🗄️ DigStore

The first and most fundamental primitive: a **content-addressable, encrypted WASM store format**. You point it at a build directory, commit generations like Git, and get a single self-defending `.wasm` file that is both your data and the server that gates access to it. The URN *is* the key — it both locates and decrypts.

→ **[Explore DigStore](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[What is DigStore?](./digstore/what-is-digstore.md)** | The one-file idea, in a nutshell |
| **[The Format](./digstore/format/overview.md)** | Stores, generations, URNs, encryption, proofs |
| **[CLI Tutorial](./digstore/cli/quickstart.md)** | Install and use `digstore` in your project |

*More primitives — networking, settlement, and node operation — will get their own sections as they land.*

## Where to start

- **Building with content today?** Go straight to [DigStore](./digstore/what-is-digstore.md) — it's production-ready and has a full [CLI tutorial](./digstore/cli/quickstart.md).
- **Want the deep design?** Each primitive links to its specification and whitepaper.

:::note
DIG Network and its primitives are open source. DigStore is licensed under GPL-2.0; see the [digstore repository](https://github.com/DIG-Network/digstore).
:::
