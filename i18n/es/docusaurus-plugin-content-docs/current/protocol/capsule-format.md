---
sidebar_position: 7
title: "L2 · Capsule format (the DIGS data section)"
description: "BINDING contract D1: the DIGS blob byte layout (big-endian, self-describing), all 12 SectionIds and their body formats (KeyTable D3, ChunkPool D4, MerkleNodes D5, ChainState, Filler), and the big-endian rationale."
keywords:
  - DIGS data section
  - capsule format
  - SectionId
  - KeyTable
  - ChunkPool
  - big-endian
tags:
  - capsule
  - merkle-proof
  - anchoring
---

# Layer 2 · Capsule format — the DIGS data section

> **Canonical reference:** `digstore-core::datasection` (BINDING contract **D1**, the single source of truth). The module that carries this blob is described in [The self-defending module](./self-defending-module.md).

## The DIGS blob byte layout

All multi-byte integers are **BIG-ENDIAN** (`datasection.rs:9-18`):

```text
magic    "DIGS"              (4 bytes)
version  u8 = 1              (1 byte)
count    u32 BE              (4 bytes)
rows     count × 10 bytes:   id:u16 BE | offset:u32 BE | len:u32 BE   (offset/len relative to byte 0)
bodies   concatenated section bodies
```

`total_len = max(offset+len)` — **self-describing, no terminator**. `HEADER_LEN = 9`, `ROW_LEN = 10`. `DataView::parse` validates the magic, `version == 1`, and that every row lies within `raw` (`datasection.rs:127-181`).

:::note Big-endian framing
All multi-byte integers are big-endian, matching Chia's streamable framing so the capsule shares one codec with the rest of the Chia-side wire formats.
:::

## SectionIds {#sectionids}

`SectionId` is a `u16` (`datasection.rs:60-75`). The compiler emits sections in **ascending id order**, and pushes ChainState (12) **before** Filler (11) so Filler stays the trailing / highest-offset body (`data_section.rs:92-124`).

| id | Section | Body |
|---|---|---|
| 1 | StoreId | 32 raw bytes |
| 2 | CurrentRoot | 32 raw bytes (the per-resource [merkle root, D5](./merkle-proofs.md)) |
| 3 | RootHistory | `Vec<Bytes32>` = u32 BE count + raw 32B each |
| 4 | PublicKey | 48 raw bytes (BLS G1) |
| 5 | TrustedKeys | u32 BE count, per entry `[u8;48] pubkey` + `String label` (u32 BE len + utf8) |
| 6 | Metadata | MetadataManifest (plaintext) |
| 7 | AuthInfo | `AuthenticationInfo { requires_session, requires_jwt, jwks_url, accepted_algorithms }` |
| 8 | **KeyTable (D3)** | see below |
| 9 | **ChunkPool (D4)** | see below |
| 10 | **MerkleNodes (D5)** | u32 BE count + count×32 raw — the per-resource leaves, ascending by `static_key` |
| 11 | Filler | unreferenced ChaCha20 padding ([self-defending module](./self-defending-module.md#fixed-size-obfuscation)) |
| 12 | ChainState | on-chain anchor pointer (see below) |

## KeyTable (8, D3)

```text
u32 BE count, per entry:
  static_key(32) | generation(32) | chunk_indices(Vec<u32>: u32 BE count + u32 BE each) | total_size(u64 BE)
```

`lookup_key` linear-scans for `static_key == retrieval_key` (`keytable.rs:9-34`, `datasection.rs:200-227`).

## ChunkPool (9, D4)

```text
u32 BE count, per chunk:  len:u32 BE | ciphertext
```

Chunks are in **global index order** (the order `chunk_indices` address into). Filler is **NOT** interleaved, so indexing stays exact (`datasection.rs:229-282`).

## ChainState (12) — the on-chain anchor pointer

```text
version:u8 | network(u32 len+utf8) | launcher_id(32) | coin_id(32)
          | confirmed_height:u32 BE | tx_id(u32 len+utf8) | coinset_url(u32 len+utf8)
```

`coinset_url` is a **hint only** (callers override). `VERSION = 1` (`datasection.rs:323-422`). This pointer lets a client resolve the on-chain head for [anchored-root pinning](./verification-and-provenance.md#gate-3).

## Body codec note

The compiler carries a local codec for `TrustedKeys` because the core `TrustedHostKey` has no `Encode/Decode` (`data_section.rs:58-73`; guest decode `content.rs:108-133`). `Metadata` is the plaintext `MetadataManifest`; `AuthInfo` gates the [serving guest](./self-defending-module.md#the-gate-chain).

## Related

- [The self-defending module](./self-defending-module.md) — fixed-size padding + WASM injection
- [Merkle inclusion proofs](./merkle-proofs.md) — what MerkleNodes (D5) commits to
- [Cryptography](./cryptography.md) — the ChunkPool ciphertext
- [On-chain anchoring](./on-chain-anchoring.md) — what ChainState points at
