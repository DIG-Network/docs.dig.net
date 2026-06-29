---
sidebar_position: 1
title: "Protocol: Overview"
description: "The DIG Protocol as seven bottom-up layers, normative and implementation-defined. The capsule (storeId:rootHash) is the fundamental unit; the host is blind and the reader verifies against the chain. This section supersedes the whitepapers."
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
  - whitepaper
---

# Protocol: Overview

This is the **normative specification** of the DIG Protocol, defined as **seven layers, bottom-up**. Each layer names its **canonical crate/file** as the normative reference.

:::warning This section supersedes the whitepapers — the implementation is the source of truth
The protocol shipped, and **drifted** from the original whitepapers as it met reality (endianness, the AEAD cipher, deterministic filler, per-resource merkle, a free mint, a no-CDN read path, and more). Where this section and a [whitepaper](./whitepapers/index.md) disagree, **this section is authoritative**: it documents the code as it actually runs, with `file:line` citations. The whitepapers will be reconciled to this spec later. Every documented deviation is catalogued in [Drift from the whitepapers](./protocol/drift-from-whitepapers.md).
:::

## The fundamental unit: the capsule

One concept runs through every layer: the **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, canonically `storeId:rootHash`. A **store** is an ordered sequence of capsules (oldest→newest), one per commit; its identity `store_id` *is* a CHIP-0035 DataLayer singleton launcher id on Chia. Identity, compilation, pricing, retrieval, caching, and provenance are all defined **per capsule**.

## The thesis: blind host, client-side verify, chain-anchored root

- **Blind host.** A host holds only opaque ciphertext keyed by hashes. It holds no URN and no key, relays the capsule's own output verbatim, and cannot tell a hit from a miss. There is no `decoy` field on the wire and no CDN — content is served only through the [dig RPC](./protocol/dig-rpc.md).
- **Client-side verify.** Every byte is checked on the reader's device against an on-chain root with a per-resource merkle inclusion proof, then authenticated-decrypted. Trust never rests on the serving origin.
- **Chain-anchored root.** The trusted root comes **only** from the CHIP-0035 singleton on Chia (resolved via coinset.org), never from the served "latest".

## The seven layers

| # | Layer | What it defines | Canonical reference |
|---|---|---|---|
| 0 | [Identity & naming](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN & addressing](./protocol/urn-and-addressing.md) | `urn:dig:chia:…` grammar; rootless `retrieval_key` | `digstore-core::urn`, `lib.rs` |
| 1 | [Cryptography](./protocol/cryptography.md) | HKDF KDF; AES-256-GCM-SIV seal | `digstore-core::crypto` |
| 1 | [Merkle inclusion proofs](./protocol/merkle-proofs.md) | D5 per-resource leaf; NODE_TAG fold | `digstore-core::merkle` |
| 1 | [BLS signatures & DSTs](./protocol/bls-signatures.md) | Chia AugScheme; five role DSTs | `digstore-crypto::bls` |
| 2 | [Capsule format](./protocol/capsule-format.md) | the DIGS data section (BINDING D1) | `digstore-core::datasection` |
| 2 | [The self-defending module](./protocol/self-defending-module.md) | fixed-size obfuscation; the serving guest | `digstore-compiler`, `digstore-guest` |
| 4 | [On-chain anchoring](./protocol/on-chain-anchoring.md) | store = singleton; capsule = root-advance | `chip35_dl_coin`, `digstore-chain` |
| 4 | [DIG CAT payment & pricing](./protocol/dig-cat-payment.md) | per-capsule, dynamic, USD-pegged | `chip35_dl_coin::dig` |
| 6 | [The dig RPC](./protocol/dig-rpc.md) | the machine interface (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [§21 transport & push](./protocol/transport-and-push.md) | `dig://` locator, REST, push v1 | `digstore-remote` |
| 6 | [Verification & provenance](./protocol/verification-and-provenance.md) | the four ordered integrity gates | `digstore-core::merkle`, `dig-node` |
| 6 | [The blind host model](./protocol/blind-host-model.md) | provider-blindness; resolver; `/v1` control plane | hub `retrieval`/`resolver`/`api` |
| — | [Conformance & parity](./protocol/conformance-and-parity.md) | the cross-impl parity discipline | frozen goldens, OpenRPC diff |
| — | [Drift from the whitepapers](./protocol/drift-from-whitepapers.md) | the catalogued deviations | per-row citations |

(Layers 3 and the §21 transport interleave with the read path; the table groups them where a reader meets them. The full layer numbering is given on each page.)

## How a capsule flows through the layers

A publisher **chunks + encrypts** (L1) content into a **capsule format** (L2) that **self-serves** (L3), **anchors** it on-chain (L4), and **pushes** it over §21 transport (L5). Any client **reads** it through the dig RPC and **verifies** it against the chain-anchored root entirely client-side (L6). Every cryptographic constant has **one** definition shared across producer, host, and verifier — the [C8 parity invariant](./protocol/conformance-and-parity.md).

## Terminology (per SYSTEM.md)

- **`chia://`** — the network **content** address (what a browser opens).
- **`dig://`** — the §21 **transport** locator (CLI/peer plane) *and* the DIG Browser's internal page scheme — two distinct uses, never the content address.
- **`urn:dig:`** — the URN namespace both derive from.
- **store / capsule** — the identity and its immutable generation.
- **$DIG** — the CAT paid per capsule; **DigStore** — the store format.

## Related

- [Concepts & glossary](./concepts.md) — every entity defined once
- [Identity & naming](./protocol/identity-and-naming.md) — Layer 0, where the spec begins
- [The dig RPC](./protocol/dig-rpc.md) — the protocol's machine interface
- [Drift from the whitepapers](./protocol/drift-from-whitepapers.md) — the deviation catalogue
- [Whitepapers](./whitepapers/index.md) — the historical design (being reconciled to this spec)
