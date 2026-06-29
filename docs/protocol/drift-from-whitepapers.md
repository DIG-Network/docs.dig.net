---
sidebar_position: 16
title: "Drift from the whitepapers (appendix)"
description: "A single catalogued table of every documented deviation between the implementation and the original whitepapers — endianness, GCM-SIV, deterministic filler, per-resource merkle, disabled attestation, store_id = launcher_id, inverted pricing, deploy-token = writer-delegate, push DST, 2-leg push, no-CDN, mock proofs — each with its implementation citation."
keywords:
  - drift
  - whitepaper deviation
  - implementation source of truth
  - gaps
tags:
  - whitepaper
  - capsule
  - dig-rpc
  - anchoring
---

# Drift from the whitepapers (appendix)

The [Protocol section](../protocol-deep-dive.md) is authoritative; the [whitepapers](../whitepapers/index.md) are historical and will be reconciled to it. This appendix is the **single catalogue** of every documented deviation, so the historical whitepaper pages can be retired without losing the record of *what changed and why*.

Two kinds of entry: **DRIFT** (the implementation deliberately diverges from the whitepaper) and **GAP** (underspecified / inconsistent / latent risk in the implementation itself).

## DRIFT — implementation diverges from the design

| # | What changed | From → To | Why | Citation |
|---|---|---|---|---|
| 1 | **Endianness** | little-endian → **big-endian** | Chia-streamable framing won | [datasection.rs:9-18](./capsule-format.md) |
| 2 | **AEAD cipher** | AES-256-GCM → **AES-256-GCM-SIV** | nonce-misuse-resistance + deterministic ciphertext (reproducible merkle root) | [crypto.rs:28-36](./cryptography.md) |
| 3 | **Filler** | random → **deterministic ChaCha20** | byte-identical compilation | [filler.rs:7-28](./self-defending-module.md#fixed-size-obfuscation) |
| 4 | **Merkle tree** | per-chunk → **per-resource** (one leaf/resource; D5 leaf UNTAGGED) | the read-path content→leaf binding | [merkle.rs:131-142](./merkle-proofs.md) |
| 5 | **Host-attestation gate** | enabled (§12.2) → **DISABLED by default** | any anonymous node serves; program hash stays network-stable | [content.rs:39-65](./self-defending-module.md#the-gate-chain) |
| 6 | **store_id** | `SHA-256(pk)` → **CHIP-0035 launcher id** | the chain singleton is the identity | [data_section.rs:209-213](./identity-and-naming.md) |
| 7 | **Pricing** | charge at INIT → **per-capsule, dynamic, USD-pegged** (mint free; no protocol constant) | free mint (#111); $1/yr-hosting peg | [dig.rs:43-149](./dig-cat-payment.md) |
| 8 | **Deploy token** | bespoke puzzle → **a Writer delegate** | reuse the DataLayer delegation primitive | [store.rs:81-95](./on-chain-anchoring.md) |
| 9 | **Push auth message** | `SHA256(root\|\|store_id)` → **`SHA-256(PUSH_DST\|\|root\|\|store_id)`** | role domain-separation | [bls.rs:194-200](./transport-and-push.md#authenticated-head) |
| 10 | **Push protocol** | single PUT → **2-leg push v1** (inline \| presigned) | HTTPS edge body cap below capsule size | [client.rs:352-549](./transport-and-push.md) |
| 11 | **Read path** | CDN → **no CDN; dig RPC only** (JSON-RPC 2.0 POST) | blind, verifiable, single agent surface | [bootstrap.rs:264-303](./dig-rpc.md) |
| 12 | **Execution proofs** | enforced ZK → **MOCK/forgeable by default** (real risc0 behind a feature, not in CI) | not yet built/tested | [prover.rs:36-110](./verification-and-provenance.md) |
| 13 | **Push trust** | on-chain finality → **accept-on-signature** (TOFU auto-create; anchor-watcher reconciles) | safe because readers verify against the chain root | [bootstrap.rs:1927-2074](./blind-host-model.md#push-trust) |
| 14 | **No `decoy` field on the wire** | flag → **none** (regression-locked); a miss is the capsule's own indistinguishable response | discovered client-side by proof/decrypt failure | [bootstrap.rs:2830](./dig-rpc.md#the-chunk-wire-object) |

## GAP — underspecified / inconsistent / latent in the implementation

| Area | Gap | Citation |
|---|---|---|
| **URN chain** | producers lock `chia`, but the core parser is still chain-generic | [lib.rs:68](./urn-and-addressing.md) |
| **URN salt** | `?salt=` is carried by every edge parser but absent from the canonical core `Urn` struct | [lib.rs](./urn-and-addressing.md#the-salthex-addressing-extension) |
| **BLS / merkle DST collision** | `NODE_DST` == merkle `NODE_TAG` byte-for-byte; safe by disjoint preimage shape today, a latent footgun | [bls.rs:152-167](./bls-signatures.md) |
| **Capsule-size figure** | stated 3 ways: SYSTEM.md "100 MB" vs `MAX_STORE_BYTES=128_000_000` vs `FIXED_BLOB_LEN=128 MiB` | [config.rs](./self-defending-module.md#fixed-size-obfuscation) |
| **Commit atomicity** | the root-advance ++ DIG-payment bundle is a client-side convention — no on-chain enforcement of payment | [anchor.rs:332-389](./dig-cat-payment.md) |
| **§21.9 nonce replay** | nonces are not recorded server-side → replayable within the 300s freshness window | [server.rs:171-228](./transport-and-push.md#per-request-auth) |
| **Production freshness gate** | live rpc.dig.net `serve_blind` uses default deps (MockProver + MockChainSource + FixedClock) — the §12/§13 attestation-freshness gate is not enforced in prod | [bootstrap.rs:1556-1575](./verification-and-provenance.md) |
| **Pre-Phase-A ChainState** | a module with no embedded ChainState makes the chain-root gate a no-op (head-sig is then the only authority) | [verification](./verification-and-provenance.md#gate-3) |

## Related

- [Protocol: Overview](../protocol-deep-dive.md) — the authoritative seven-layer spec
- [Whitepapers](../whitepapers/index.md) — the historical design being reconciled
- [Conformance & parity](./conformance-and-parity.md) — how the implementations stay in lockstep
