---
sidebar_position: 15
title: "Conformance & parity"
description: "The cross-implementation parity discipline: frozen canonical()/retrieval_key() goldens, the C8 crypto fixtures, the shared URN conformance vectors, the OpenRPC-vs-server diff test, and what every reimplementation MUST pass."
keywords:
  - conformance
  - parity
  - golden vectors
  - C8 invariant
  - OpenRPC diff
tags:
  - dig-rpc
  - urn
  - retrieval-key
  - merkle-proof
  - encryption
---

# Conformance & parity

> The protocol is implemented several times — the Rust producer, the host, the `dig-client-wasm` verifier, the DIG Browser C++, the SDK/extension JS. They stay interchangeable only because of a **parity discipline**: every shared constant has **one** definition, and frozen goldens fail the build the moment any implementation drifts.

## The C8 parity invariant

Every cryptographic constant has **ONE** definition shared across producer, host, and verifier. There is no per-layer reimplementation of the [read-crypto](./cryptography.md): producer, host-serve, and the browser verifier all call `digstore_core::crypto` + `digstore_core::resource_leaf` (parity test `dig-client-wasm/tests/parity.rs`).

## What every reimplementation MUST pass

| Surface | Frozen by | What it pins |
|---|---|---|
| URN [`canonical()`](./urn-and-addressing.md) + `retrieval_key()` | `digstore-core/tests/urn.rs:107-126`; `dighub-core` recomputes SHA-256 independently | the exact canonical-string bytes and their hash, for all four parsers |
| [Crypto](./cryptography.md) (HKDF + GCM-SIV) | C8 KAT fixtures (`kdf_kat.rs`) | a distinct (URN, salt) ⇒ a distinct 32-byte key; tag failure on wrong key |
| [BLS](./bls-signatures.md) host↔guest | host-signed fixtures the guest must accept (`tests/bls_fixtures.rs`) | AugScheme cross-impl parity + the five role DSTs |
| [Merkle](./merkle-proofs.md) leaf/proof | `resource_leaf` shared by producer + verifier | D5 leaf = `SHA-256(ciphertext)`; D8 proof length ≤ `ceil(log2 n)` |
| [dig RPC](./dig-rpc.md) | OpenRPC documents generated from the implementation, CI-diffable against live server responses | the method set, the chunk object (incl. `chunk_lens`, no `decoy`), `-32004` |

## URN conformance vectors {#urn-conformance-vectors}

The single source of truth for all four URN parsers (core, SDK, extension, browser C++) is the frozen golden set pinning `canonical()` + `retrieval_key()`. A reimplementation conforms iff it reproduces these byte-for-byte. The `dig-client-wasm` SRI digest is pinned in the extension and the hub service worker, **fail-closed** — a mismatched client is refused.

## The OpenRPC-vs-server diff

The two OpenRPC documents ([network](https://docs.dig.net/openrpc.json) + [node](https://docs.dig.net/openrpc-node.json)) are generated from `scripts/dig-spec.mjs` and the [error catalog](../support/error-codes.md) is **drift-gated** against the prose tables on every build — so the JSON, the prose, and the source enums can never silently diverge. The intent is to CI-diff the documents against live `rpc.dig.net` / `dig-node` responses so an agent can drive the protocol without scraping prose.

## Related

- [Cryptography](./cryptography.md) — the one-crypto-impl invariant
- [URN & addressing](./urn-and-addressing.md) — the canonical form the vectors pin
- [The dig RPC](./dig-rpc.md) — the OpenRPC documents
- [Machine surfaces](../machine-surfaces.md) — every machine-readable artifact
- [Drift from the whitepapers](./drift-from-whitepapers.md) — the deviation catalogue
