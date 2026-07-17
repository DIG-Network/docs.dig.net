---
sidebar_position: 7
title: "L2 · Capsule format (the DIGS data section)"
description: "BINDING contract D1: the DIGS blob byte layout (big-endian, self-describing), all 13 SectionIds and their body formats (KeyTable D3, ChunkPool D4, MerkleNodes D5, ChainState, PublicManifest, Filler), and the big-endian rationale."
keywords:
  - DIGS data section
  - capsule format
  - SectionId
  - KeyTable
  - ChunkPool
  - PublicManifest
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

`SectionId` is a `u16` (`datasection.rs:60-75`). The compiler emits the fixed sections in **ascending id order**, then pushes the optional ChainState (12) and PublicManifest (13) **before** Filler (11) so Filler stays the trailing / highest-offset body (`data_section.rs:92-124`).

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
| 12 | ChainState | on-chain anchor pointer (see below) — **optional** |
| 13 | PublicManifest | normalized public file set, latest version per path (see below) — **optional** |

### Reading unknown sections {#forward-compatible}

A reader looks each section up by id and **ignores** any id it does not recognize; the offset table is not order-sensitive on read. Section ids are **only ever added**, never removed, renumbered, or repurposed, and the blob `version` stays `1` — so a newer writer's blob still parses in an older reader (it simply sees fewer sections), and a newer reader treats an absent optional section as "not present". `ChainState` (12) and `PublicManifest` (13) are optional: an older capsule, or one from a producer that does not emit them, omits the section entirely.

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

## PublicManifest (13) — the normalized public file set {#public-manifest}

The public manifest is the store's **complete public file surface**, flattened across every published capsule (generation): one entry per public file **path**, holding that path's **latest** version and its provenance. Where the KeyTable (8) lists one capsule's resources by their hashed `static_key`, the public manifest exposes the human path and, for each path, which capsule and version index hold its latest content — **including files whose latest version lives in an earlier capsule**. A consumer reads the whole public surface, with version-history depth, from the module alone.

The section is present **only for public stores**. A private store's file paths stay opaque, so it carries **no** PublicManifest section.

Body layout (big-endian [codec](./cryptography.md) framing):

```text
schema_version : u32 BE
entries        : u32 BE count, per entry:
  path             : String  (u32 BE len + utf8 bytes)
  latest_root      : 32 raw bytes
  generation_index : u64 BE
  sha256_latest    : 32 raw bytes
  version_count    : u32 BE
```

Entries are ordered **ascending by `path`** (UTF-8 byte order), so the encoding is deterministic. Per entry:

| Field | Type | Meaning |
|---|---|---|
| `path` | string | The public file path (resource key), e.g. `index.html`, `assets/app.js`. |
| `latest_root` | 32 bytes | The capsule **root** holding this path's latest version. |
| `generation_index` | u64 | The **version index** (generation id) of that latest version — the ordinal of the commit that last wrote the path. |
| `sha256_latest` | 32 bytes | SHA-256 of the latest version's content — the per-resource [merkle leaf, D5](./merkle-proofs.md): `SHA-256` over the concatenated ordered chunk ciphertext bodies of the latest version (the same leaf the verifier checks). |
| `version_count` | u32 | How many versions of this path exist across the whole store history (the number of capsules whose file set includes the path). |

`schema_version` starts at `1`; future fields are only appended, so a reader dispatches on the version and older bodies stay readable. In JSON (the CLI `dig-store manifest --json`, the JSON-RPC `dig.getManifest`, and the browser reader `readPublicManifest`) the byte fields are 64-char lowercase hex and the shape is `{ "schema_version", "entries": [ { "path", "latest_root", "generation_index", "sha256_latest", "version_count" } ] }`.

## Body codec note

The compiler carries a local codec for `TrustedKeys` because the core `TrustedHostKey` has no `Encode/Decode` (`data_section.rs:58-73`; guest decode `content.rs:108-133`). `Metadata` is the plaintext `MetadataManifest`; `AuthInfo` gates the [serving guest](./self-defending-module.md#the-gate-chain).

## Related

- [The self-defending module](./self-defending-module.md) — fixed-size padding + WASM injection
- [Merkle inclusion proofs](./merkle-proofs.md) — what MerkleNodes (D5) commits to
- [Cryptography](./cryptography.md) — the ChunkPool ciphertext
- [On-chain anchoring](./on-chain-anchoring.md) — what ChainState points at
