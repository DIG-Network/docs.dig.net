---
sidebar_position: 1
title: Whitepapers
description: "The DIG Network technical specifications — Consensus, DFSP, and Digstore. Reference reading for protocol developers."
---

# Whitepapers

The full technical specifications behind DIG Network, in three parts. These are the deep,
protocol-level references — **most builders won't need them to ship.** If you're publishing a site or
integrating the SDK, start with the [DIG Network overview](/docs/) and the
[DigStore docs](/docs/digstore/what-is-digstore); come here when you want the protocol-level detail.

The shared unit throughout is the **capsule**: one immutable store generation, compiled to a
fixed-size WASM, that is hosted, priced, and retrieved as a whole.

| Part | Paper | What it covers |
| --- | --- | --- |
| 1 | [Consensus](./consensus.md) | A Proof-of-Stake Layer 2 on Chia — finality, L1 anchoring, the validator lifecycle |
| 2 | [DFSP](./dfsp.md) | The Decentralized File Storage Protocol — availability-audited capsule hosting |
| 3 | [Digstore](./digstore.md) | The content-addressable WASM store format — capsules, URN-derived keys, ZK proofs |

Each part is a complete v1.0 specification, available as a PDF.
