---
sidebar_position: 6
title: "L1 · BLS signatures & domain separation"
description: "Chia AugScheme (G1 48B / G2 96B), the five mutually-distinct role DSTs (PUSH/NODE/TOMB/REQ/ATTEST) with their exact signing-message preimages, rogue-key rejection, and the host↔guest parity fixtures."
keywords:
  - BLS
  - AugScheme
  - domain separation
  - DST
  - rogue key
  - attestation
tags:
  - capsule
  - dig-rpc
  - anchoring
---

# Layer 1 · BLS signatures & domain separation

> **Canonical reference:** `digstore-crypto::bls` (host/producer, Chia AugScheme via `chia-bls`→`blst`) and `digstore-guest::attestation` (verifier, pure-Rust `bls12_381`, wasm/zk-clean). The two are **parity-locked** by host-signed fixtures the guest must accept (`tests/bls_fixtures.rs`).

## Scheme

Chia **AugScheme** over BLS12-381: G1 public key = **48 bytes**, G2 signature = **96 bytes** (`bls.rs:14-29`). `aug_sign` prepends the signer's public key + the Chia DST and hashes to G2. AugScheme's pubkey-binding is the base defense; the role DSTs below are **defense-in-depth on top of it**.

`validate_public_key` rejects the canonical G1 identity / point-at-infinity (`0xc0 || 0…`, 48 bytes) **and** non-canonical bytes — the rogue-key defense (`bls.rs:117-138`).

## The five role DSTs

Every signing message **prepends a distinct role tag** so a signature for one role can never replay as another (`bls.rs:152-185`).

| Role | DST | Signing message | Reference |
|---|---|---|---|
| **push** | `b"digstore:push:v1"` | `SHA-256(PUSH_DST \|\| root(32) \|\| store_id(32))` → 32B | `bls.rs:194-200` |
| **request** | `b"digstore:req:v1"` | `SHA-256(REQ_DST \|\| u32be(len(method)) \|\| method \|\| store_id(32) \|\| u64be(ts) \|\| nonce(32))` → 32B | `bls.rs:267-281` |
| **node** | `b"digstore:node:v1"` | `NODE_DST \|\| program_hash(32) \|\| public_output(32) \|\| chia_header_hash(32) \|\| u32be(height) \|\| public_input` (**variable**, NOT pre-hashed) | `bls.rs:209-224` |
| **attest** | `b"digstore:attest:v1"` | `ATTEST_DST \|\| nonce(32) \|\| store_id(32) \|\| u64be(ts)` (**variable**) | `bls.rs:232-243` |
| **tomb** | `b"digstore:tomb:v1"` | `SHA-256(TOMB_DST \|\| canonical(Tombstone))` → 32B | `bls.rs:250-256` |

- **push** authorizes the [authenticated head](./transport-and-push.md#authenticated-head); arg order is canonically `(root, store_id)`.
- **request** binds the method (a read-auth signature cannot replay as a write), the timestamp (freshness), and the nonce (uniqueness) — the [§21.9 per-request auth](./transport-and-push.md#per-request-auth).
- **attest** is byte-identical to the guest's `build_challenge` (`guest/attestation.rs:53-61`).

:::note `NODE_DST` and the merkle `NODE_TAG` share the same bytes
`NODE_DST = b"digstore:node:v1"` is the same byte string as the [merkle `NODE_TAG`](./merkle-proofs.md#domain-separation). The two are domain-distinct in practice because they are consumed in disjoint preimage shapes: a BLS node-attestation message versus a fixed 65-byte merkle pair.
:::

## Attestation verify (guest)

```text
hash-to-curve DST = b"BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_AUG_"   // guest/attestation.rs:20
aug_message       = pubkey(48) || message
verify            = pairing check  e(pk, H(aug)) == e(g1, sig)         // attestation.rs:63-94
```

Order: trusted-key membership → **freshness** (`now − signed_time ≤ 300s` AND `now ≥ signed_time`) → point-encoding validity → AugScheme pairing verify; any failure → the content path returns [decoys](./blind-host-model.md) (`attestation.rs:97-122`).

## Related

- [Merkle inclusion proofs](./merkle-proofs.md) — the `NODE_TAG` the node DST collides with
- [§21 transport & push](./transport-and-push.md) — where PUSH/REQ DSTs are used on the wire
- [Verification & provenance](./verification-and-provenance.md) — the authenticated head + tombstones
- [The self-defending module](./self-defending-module.md) — the (disabled) attestation gate
- [Conformance & parity](./conformance-and-parity.md) — the host↔guest BLS fixtures
