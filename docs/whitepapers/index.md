---
sidebar_position: 1
title: Whitepapers
description: "The DIG Network technical specifications — Consensus, DFSP, and Digstore. Reference reading for protocol developers."
keywords:
  - DIG Network whitepapers
  - Consensus
  - DFSP
  - Digstore specification
  - Proof-of-Stake Layer 2
  - capsule
tags:
  - whitepaper
  - capsule
  - chip-0035
  - store
---

# Whitepapers

:::warning Historical — the Protocol section is now authoritative
These whitepapers are the **original design**. The protocol shipped and **drifted** from them. The [**Protocol section**](../protocol-deep-dive.md) — defined against the implementation, with `file:line` citations — is now the **source of truth**; every deviation is catalogued in [Drift from the whitepapers](../protocol/drift-from-whitepapers.md). Read these for history and intent; read the Protocol section for what the network actually does. They will be reconciled later.
:::

The full technical specifications behind DIG Network, in three parts. These are the deep,
protocol-level references — **most builders won't need them to ship.** If you're publishing a site or
integrating the SDK, start with the [DIG Network overview](/docs/) and the
[DigStore docs](/docs/digstore/what-is-digstore); come here when you want the protocol-level detail.

The shared unit throughout is the **[capsule](../concepts.md#capsule)**: one immutable store
generation, compiled to a fixed-size WASM, that is hosted, priced, and retrieved as a whole.

| Part | Paper | What it covers |
| --- | --- | --- |
| 1 | [Consensus](./consensus.md) | A Proof-of-Stake Layer 2 on Chia — finality, L1 anchoring, the validator lifecycle |
| 2 | [DFSP](./dfsp.md) | The Decentralized File Storage Protocol — availability-audited capsule hosting |
| 3 | [Digstore](./digstore.md) | The content-addressable WASM store format — capsules, URN-derived keys, ZK proofs |

Each part is a complete v1.0 specification, available as a PDF.

## Related

- [Consensus](./consensus.md) — the Proof-of-Stake Layer 2 on Chia
- [DFSP](./dfsp.md) — availability-audited capsule hosting
- [Digstore](./digstore.md) — the content-addressable WASM store format
- [What is DigStore?](../digstore/what-is-digstore.md) — the practical store format docs
- [Concepts & glossary](../concepts.md) — the capsule and other core entities defined
