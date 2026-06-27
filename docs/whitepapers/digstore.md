---
sidebar_position: 4
title: "Part 3 · Digstore"
description: "DIG Network Part 3 — the content-addressable WASM store format: immutable capsules, URN-derived keys, ZK execution proofs, and a Git workflow."
keywords:
  - Digstore specification
  - content-addressable WASM
  - immutable capsule
  - URN-derived keys
  - ZK execution proof
  - Git workflow
tags:
  - whitepaper
  - capsule
  - store
  - urn
  - encryption
---

# The Content-Addressable WASM Store Format

*Part 3 · Digstore*

Every store is a sequence of immutable capsules — one per commit. Each capsule compiles to one
fixed-size WebAssembly module — content and the logic that serves it in a single binary — costs a
flat 100 DIG to mint or commit, and is retrieved and cached atomically. Keys derive from the URN, so
a host serves blind; every response can carry a zero-knowledge proof of execution. The developer
workflow is Git — init, add, commit, push.

**Covers:** Immutable capsules · Fixed-size WASM · URN-derived keys · ZK execution proofs · Git workflow

[📄 Read the full paper (PDF)](pathname:///whitepapers/DIG-Network-Part3-Digstore.pdf)

:::tip Using DigStore?
The [DigStore docs](/docs/digstore/what-is-digstore) cover the practical CLI workflow and format
details — start there to actually publish a store.
:::

## Related

- [What is DigStore?](../digstore/what-is-digstore.md) — the practical store format docs
- [URNs & Encryption](../digstore/format/urns-and-encryption.md) — the URN-derived keys in practice
- [Consensus](./consensus.md) — Part 1: the Proof-of-Stake Layer 2 on Chia
- [DFSP](./dfsp.md) — Part 2: availability-audited capsule hosting
- [Concepts & glossary](../concepts.md) — the capsule, store, and URN defined
