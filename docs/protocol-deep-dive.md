---
sidebar_position: 1
title: Protocol deep-dive
description: "The one idea — the capsule — running through the whole network: blind, verified, and client-side. How the three whitepapers fit, and where to read each layer in full. Most builders won't need this to ship."
keywords:
  - DIG protocol
  - capsule
  - blind hosting
  - client-side verification
  - whitepapers
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - whitepaper
---

# Protocol deep-dive

This section is the **full design** behind the network — for protocol developers who want every layer. **Most builders won't need it to ship**: the [Using DIG](./audiences/app-developers.md) tracks cover the day-to-day with plain-language concepts. Read on when you want the why.

## The one idea: the capsule

A single concept runs through everything: the **[capsule](./concepts.md#capsule)** = `(storeId, rootHash)`. A [store](./digstore/format/store-structure.md) is a sequence of capsules; each is an immutable, on-chain-anchored generation. Compilation, pricing, retrieval, caching, and provenance are all defined per capsule.

## Three properties, end to end

- **Blind** — hosts only ever see indistinguishable ciphertext keyed by hashes; a miss returns a decoy, never a 404.
- **Verified** — every byte is checked against an on-chain root with a Merkle inclusion proof before it is trusted.
- **Client-side** — verification and decryption happen on the reader's device; trust never rests on the host.

## How the three whitepapers fit

The network is specified by [three normative whitepapers](./whitepapers/index.md), each a layer:

1. **[Consensus](./whitepapers/consensus.md)** — the Proof-of-Stake Layer-2 on Chia: finality, L1 anchoring, validator lifecycle.
2. **[DFSP](./whitepapers/dfsp.md)** — the Decentralized File Storage Protocol: availability-audited capsule hosting.
3. **[Digstore](./whitepapers/digstore.md)** — the content-addressable WASM store format the capsule is built from.

## Read each layer in full

- **The capsule & store model** → [Store structure](./digstore/format/store-structure.md)
- **The `.wasm` store format** → [What is DigStore?](./digstore/what-is-digstore.md) · [Format overview](./digstore/format/overview.md)
- **URNs & encryption** → [URNs & encryption](./digstore/format/urns-and-encryption.md)
- **Proofs & security** → [Proofs & security](./digstore/format/proofs-and-security.md)
- **On-chain anchoring as trust root** → [On-chain anchoring](./digstore/cli/onchain-anchoring.md)
- **The dig RPC (Network Content Interface)** → [What is the dig RPC?](./rpc/what-is-the-dig-rpc.md) · [Methods](./rpc/methods.md) · [Conformance](./rpc/conformance.md) · [Streaming](./rpc/streaming.md)
- **Inclusion vs execution proofs** → [Inclusion vs execution proofs](./inclusion-vs-execution-proofs.md)
- **The §21/§22 `dig://` remote** → [The dig:// remote](./rpc/dig-remote.md)
- **The `window.chia` provider (normative)** → [Provider spec](./protocol/window-chia-provider.md)
- **CHIP-0035 spends & delegation** → [CHIP-0035 store-coin spends & delegation](./chip-0035-spends-and-delegation.md)
- **The whitepapers** → [Whitepapers](./whitepapers/index.md)

## Related

- [Concepts & glossary](./concepts.md) — the shared spine: every entity defined once
- [Using DIG](./audiences/app-developers.md) — the task-oriented tracks
