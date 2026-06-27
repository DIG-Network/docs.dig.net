---
sidebar_position: 3
title: "Part 2 · DFSP"
description: "DIG Network Part 2 — the Decentralized File Storage Protocol: availability-audited capsule hosting, paid to serve rather than merely to store."
keywords:
  - DFSP
  - Decentralized File Storage Protocol
  - availability audit
  - capsule hosting
  - full replication
  - mirror
tags:
  - whitepaper
  - capsule
  - dig-rpc
---

# The Decentralized File Storage Protocol

*Part 2 · DFSP*

Availability-audited capsule hosting on DIG Layer 2. A capsule is one immutable store generation —
a fixed-size WASM, retrieved and cached atomically. Mirrors hold full-replica capsules and are paid
for proven availability: each block's proposer audits a seed-forced sample, and sustained failure
slashes the bond. Inverts the storage model — paid to serve, not merely to store.

**Covers:** Immutable capsules · Availability audits · Full replication

[📄 Read the full paper (PDF)](pathname:///whitepapers/DIG-Network-Part2-DFSP.pdf)

## Related

- [Consensus](./consensus.md) — Part 1: the Proof-of-Stake Layer 2 on Chia
- [Digstore](./digstore.md) — Part 3: the content-addressable WASM store format
- [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) — how hosted capsules are served and read
- [Whitepapers](./index.md) — all three specifications in one place
- [Concepts & glossary](../concepts.md) — the capsule and core entities defined
