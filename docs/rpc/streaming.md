---
sidebar_position: 3
title: Streaming
description: "Streaming chunk model for byte methods: chunk object structure, 64 KiB alignment, reassembly, proof verification, and reference client loop."
keywords:
  - dig RPC streaming
  - chunk object
  - 64 KiB blocks
  - inclusion proof
  - reassembly
tags:
  - streaming
  - dig-rpc
  - merkle-proof
  - retrieval-key
  - capsule
---

# Streaming

:::info Normative spec
The authoritative wire contract for the chunk object and the streaming/window math is [Protocol · The dig RPC](../protocol/dig-rpc.md#the-chunk-wire-object).
:::

Every byte-bearing method — [`dig.getContent`](./methods.md#diggetcontent), [`dig.getCapsule`](./methods.md#diggetcapsule), [`dig.getManifest`](./methods.md#diggetmanifest) — returns the same **chunk object**. One call returns one chunk; the client continues until the chunk that completes the object.

## The chunk object

| Field | Type | Meaning |
|---|---|---|
| `ciphertext` | string | The chunk's bytes, standard base64. Decode before use. |
| `total_length` | uint | The full object's byte length (before chunking). Constant across a stream — size your buffer once. |
| `offset` | uint | Byte offset at which this chunk's bytes begin in the full object. |
| `length` | uint | This chunk's byte length (= decoded `ciphertext` length). |
| `complete` | bool | `true` when `offset + length ≥ total_length` — this chunk finishes the object. |
| `next_offset` | uint or `null` | The `offset` to request next, or `null` when `complete`. |
| `inclusion_proof` | string or `null` | Base64 merkle inclusion proof for the **whole** resource (present on every window of `dig.getContent`/`dig.getManifest`; empty/`null` for capsules). |
| `chunk_lens` | uint[] | Per-chunk **ciphertext** byte lengths of the full resource, in order. **First window only** (`offset == 0`); empty ⇒ a single chunk. Required to split + decrypt a multi-chunk resource. |
| `root` | string | The resolved generation root (hex). Pin subsequent chunks to it. |

There is **no `decoy` field** on the wire: a miss is the capsule's own indistinguishable, non-verifying response, discovered client-side by inclusion-proof and/or decryption failure (see [the blind host model](../protocol/blind-host-model.md)).

## Alignment and bounds

A node snaps the requested window to fixed **64 KiB blocks** (`RANGE_BLOCK_BYTES = 65536`) and caps a single chunk at **3 MiB** (`RPC_MAX_CHUNK = 3 × 1024 × 1024 = 3145728` bytes), keeping each response under the serving tier's response ceiling.

The requested `offset` is snapped down to a block boundary and the span is bounded; the returned `offset` reflects the snap. Because every non-final chunk is a whole number of 64 KiB blocks, a client that always requests the returned `next_offset` receives block-aligned, gap-free, non-overlapping chunks. `length` defaults to the node's max chunk when omitted; a larger request is clamped, not rejected.

## Reassembly and proof verification

The inclusion proof authenticates the **entire resource** against the generation root, not an individual chunk. So a client:

1. allocates a buffer of `total_length` on the first chunk;
2. copies each chunk's decoded bytes to its `offset`;
3. retains the `inclusion_proof` from the chunk that returns a non-null one;
4. once `complete`, verifies the proof over the fully reassembled ciphertext against the trusted `root`;
5. only then decrypts with the URN-derived key.

A miss is **not** flagged — the capsule returns an indistinguishable, non-verifying response, so the client learns not-found only when step 4 (proof) or step 5 (decryption tag) fails. Split the reassembled ciphertext by `chunk_lens` and AES-256-GCM-SIV-open each chunk; empty/absent `chunk_lens` ⇒ a single chunk = the whole ciphertext. For `dig.getCapsule` there is no per-resource proof; the reassembled capsule self-verifies on install (store id + signed root + on-chain root) per DigStore.

:::tip Pin "latest"
When you read with `root: "latest"`, the first chunk's `root` field is the head the node resolved. Pin every subsequent chunk to that exact root so a head change mid-stream can't splice two generations together.
:::

## Reference client loop

A fully blind, trustless read of a resource by URN (the client supplies a chain-verified `root`):

```js
async function readByUrn(urn, root) {
  const [store_id, path, salt] = parseUrn(urn);
  const rk = sha256(urn);                 // retrieval key — the only id sent to the node
  let total = null, buf = null, proof = "", offset = 0, lens = [];

  for (;;) {
    const r = (await rpc("dig.getContent", {
      store_id, root, retrieval_key: rk, offset, length: 3 * 1024 * 1024,
    })).result;

    if (!r) throw new NotFound();                 // genuine infra miss (-32004)
    if (total === null) {
      total = r.total_length;
      buf   = new Uint8Array(total);
      root  = r.root;                              // pin "latest" to the resolved head
      lens  = r.chunk_lens || [];                  // per-chunk ciphertext lengths (first window)
    }
    const chunk = base64decode(r.ciphertext);
    buf.set(chunk.subarray(0, total - r.offset), r.offset);
    if (r.inclusion_proof) proof = r.inclusion_proof;
    if (r.complete || r.next_offset == null) break;
    offset = r.next_offset;
  }

  if (!verifyInclusion(buf, proof, root)) throw new NotFound();   // unverifiable = a miss/decoy
  return decrypt(store_id, path, buf, salt, lens); // URN-derived AES-256-GCM-SIV key, split by chunk_lens
}
```

Downloading a whole capsule is the same loop against `dig.getCapsule` with no proof step.

## Related

- [Methods](./methods.md) — the byte methods that return the chunk object
- [Conformance & Security](./conformance.md) — alignment, decoys, and root resolution rules
- [Proofs & Security](../digstore/format/proofs-and-security.md) — what the inclusion proof verifies
- [Using the public network RPC](./public-network-rpc.md) — point a client at a node
- [Concepts & glossary](../concepts.md) — the dig RPC, capsule, and Merkle proof defined
