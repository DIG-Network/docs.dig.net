---
sidebar_position: 8
title: Inclusion vs execution proofs
description: "Two proof types: synchronous Merkle inclusion proofs that pin served bytes to an on-chain root, and asynchronous ZK / risc0 execution receipts that attest faithful serving — gated on the control plane."
keywords:
  - inclusion proof
  - execution proof
  - risc0
  - ZK receipt
  - Merkle proof
  - host attestation
tags:
  - merkle-proof
  - dig-rpc
  - dighub
---

# Inclusion vs execution proofs

DIG uses **two distinct kinds of proof**. They answer different questions, run on different timescales, and you'll meet them in different places.

## Inclusion proofs — synchronous, per read

An **inclusion proof** is a Merkle proof that accompanies every served resource. It proves the exact **ciphertext bytes** you received belong to a specific [generation](./digstore/format/store-structure.md#generations-and-root-hashes)'s root — the root that is [anchored on-chain](./digstore/cli/onchain-anchoring.md). The client checks it **synchronously, on every read, before decrypting** — so a host can never substitute or tamper with content without detection.

- **Question answered:** "are these the genuine bytes for this root?"
- **Where:** every dig RPC content read carries one. → [Proofs & security](./digstore/format/proofs-and-security.md) · [Streaming](./rpc/streaming.md)
- **Cost:** free, instant, client-side.

## Execution proofs — asynchronous, attesting faithful serving

An **execution proof** is a ZK / risc0 **execution receipt** that attests a node faithfully ran the serving logic over a period — a stronger, aggregate guarantee about a node's behaviour than any single read can give. These are **expensive to produce**, so they are **asynchronous** and **gated on the hub control plane**, which budgets the prover jobs.

- **Question answered:** "did this node serve honestly over time?"
- **Where:** requested/budgeted via the hub `/v1` control plane; produced by the risc0 prover backend.
- **Cost:** expensive; rate-limited and gated.

## Why both

Inclusion proofs make **each read** trustless without trusting the host. Execution proofs let the network **audit a node's overall conduct** — the basis for node attestation and the consensus/DFSP availability guarantees — without making every read pay that cost.

## Related

- [Proofs & security](./digstore/format/proofs-and-security.md) — inclusion proofs, signed roots, decoys
- [Node conformance](./rpc/conformance.md) — the blind serving contract
- [DFSP whitepaper](./whitepapers/dfsp.md) — availability-audited hosting
- [Consensus whitepaper](./whitepapers/consensus.md) — finality + validator lifecycle
