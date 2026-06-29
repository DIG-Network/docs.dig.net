---
sidebar_position: 5
title: "L1 · Merkle inclusion proofs"
description: "The D5 per-resource UNTAGGED leaf = SHA-256(ciphertext), the NODE_TAG fold, odd-node carry-up, the proof-length ≤ ceil(log2 n) binding contract (D8), and the base64 X-Dig-Inclusion-Proof wire layout."
keywords:
  - merkle proof
  - inclusion proof
  - NODE_TAG
  - per-resource leaf
  - D5
  - D8
tags:
  - merkle-proof
  - capsule
  - encryption
---

# Layer 1 · Merkle inclusion proofs

> **Canonical reference:** `digstore-core::merkle`, codec in `digstore-core::codec/primitives.rs`. This is the always-on, fail-closed [integrity gate 1](./verification-and-provenance.md).

## Domain separation

```text
LEAF_TAG = b"digstore:leaf:v1"     // merkle.rs:34  (raw-chunk build path only)
NODE_TAG = b"digstore:node:v1"     // merkle.rs:39
node     = SHA-256( NODE_TAG || left(32) || right(32) )   // hash_pair, merkle.rs:113-119
```

## The D5 per-resource leaf

```text
resource_leaf(ciphertext) = SHA-256(ciphertext)    // UNTAGGED — merkle.rs:140-142
```

:::warning DRIFT — the committed tree is PER-RESOURCE, not per-chunk
The committed generation tree has **one leaf per resource** (`resource_leaf(concat_output(ordered chunk ciphertexts))`), not one per chunk. These D5 leaves are fed to `MerkleTree::from_leaves` **already hashed and NOT re-tagged** — so leaf↔node separation rests **solely on `NODE_TAG`**. (The raw-chunk `LEAF_TAG` path exists in `MerkleTree::build` but is not the production read-path leaf.) Catalogued in [Drift](./drift-from-whitepapers.md).
:::

The single content→leaf binding is shared byte-for-byte by the producer (`store.rs:209`), the compiler (`pipeline.rs:210-230`), and the browser verifier (`dig-client-wasm lib.rs:101-103`).

## Tree shape

- Leaves ordered **ascending by raw 32-byte `static_key`**.
- `CurrentRoot = MerkleTree::from_leaves(leaves).root()`.
- An **odd node is carried up UNCHANGED** (no re-hash) — so a carried-up leaf skips a level.
- Empty-tree root = `SHA-256(&[])` (`merkle.rs:161-167`).

:::note BINDING CONTRACT D8 — proof length ≤ ceil(log2 n)
Because an odd node is carried up unchanged, a proof path is **≤ `ceil(log2 n)`** siblings. The `≤` (not `=`) is the binding contract D8 (`merkle.rs:20-25`).
:::

## Verify

```text
acc = leaf
for ProofStep { hash, is_left } in path:
    acc = is_left ? hash_pair(sibling, acc) : hash_pair(acc, sibling)
accept iff acc == root                          // MerkleProof::verify, merkle.rs:79-89
```

The guest leaf index is the rank of the served key among KeyTable entries by raw `static_key` order (`resource_leaf_index`, `content.rs:434-456`); `build_real_proof` rebuilds the tree from the embedded MerkleNodes and emits `tree.prove(index)` (`content.rs:396-428`).

## Wire layout (Chia big-endian streamable codec)

```text
MerkleProof = leaf(32) || path_count:u32(BE) || ( sibling(32) || is_left:u8 ){path_count} || root(32)
```

- `is_left` MUST be `0` or `1` (any other byte → `InvalidTag`) — `merkle.rs:49-67`.
- On the wire: **base64** of `MerkleProof::to_bytes`, carried as the `X-Dig-Inclusion-Proof` header / the `inclusion_proof` / `merkle_proof_b64` field.

## A limitation worth stating

`verify_module_root` recomputes `from_leaves(MerkleNodes).root()` and requires it `==` the embedded `CurrentRoot`, plus embedded `StoreId == expected` (`data_section.rs:253-314`). This proves **self-consistency for the requested store identity**, NOT that the root is the latest authorized on-chain root — that is the job of [anchored-root pinning](./verification-and-provenance.md#gate-3) (`data_section.rs:238-243`).

## Related

- [Cryptography](./cryptography.md) — the deterministic ciphertext the leaf commits to
- [Capsule format](./capsule-format.md) — the MerkleNodes (D5) section
- [The self-defending module](./self-defending-module.md) — how the guest builds the proof
- [Verification & provenance](./verification-and-provenance.md) — the four ordered gates
- [Conformance & parity](./conformance-and-parity.md) — the parity goldens
- [Drift from the whitepapers](./drift-from-whitepapers.md) — per-resource merkle
