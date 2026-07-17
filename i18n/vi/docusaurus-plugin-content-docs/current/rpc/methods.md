---
sidebar_position: 2
title: Methods
description: "Complete dig RPC method set: dig.getContent, dig.getProof, dig.getCapsule, dig.getManifest, dig.listCapsules, dig.listCollectionItems, dig.getCollection, and service discovery methods."
keywords:
  - dig RPC methods
  - dig.getContent
  - dig.getCapsule
  - dig.getProof
  - dig.listCapsules
  - dig.getCollection
  - dig.listCollectionItems
  - NFT collection
  - JSON-RPC
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - chip-0035
---

# Methods

:::info Normative spec
This is the task-oriented method reference. The **authoritative** machine-interface spec — the chunk wire object (`chunk_lens`, no `decoy` field), `-32004`, the node profile, and the regenerated OpenRPC — is [Protocol · The dig RPC](../protocol/dig-rpc.md).
:::

See [What is the dig RPC?](./what-is-the-dig-rpc.md) for an overview.

The dig RPC is a single `POST` endpoint speaking [JSON-RPC 2.0](https://www.jsonrpc.org/specification). A request is a request object or a batch (a non-empty array of request objects); `params` is always a by-name object.

```
POST https://rpc.dig.net
Content-Type: application/json
{ "jsonrpc": "2.0", "id": <id>, "method": "<name>", "params": { … } }
```

For any well-formed JSON body the HTTP status is `200`; success or a JSON-RPC `error` is carried in the envelope. Every method is a pure, idempotent read.

:::tip Machine-readable spec
This method set is also published as an [OpenRPC document](https://docs.dig.net/openrpc.json) — every method, its request/response JSON Schemas, and the catalogued error responses, against server `https://rpc.dig.net`. Point an OpenRPC client generator at it to get a typed client without reading this page.
:::

## Identifiers

All identifiers are lower-case hex on the wire.

| Identifier | Form | Meaning |
|---|---|---|
| `store_id` | 64 hex (32 bytes) | The store's identity — the launcher id of its CHIP-0035 DataLayer singleton. The same value appears in the URN and every RPC call. |
| `root` | 64 hex, or `"latest"` | A **generation root** — the on-chain content root of one capsule in the store's lineage. `"latest"` (or an absent `root`) resolves to the newest confirmed generation. |
| `retrieval_key` | 64 hex (32 bytes) | The address of one resource: `retrieval_key = sha256(urn)`. A one-way hash of the URN, so it locates a resource without revealing its path. |
| capsule identity | `<store_id>:<root>` | The canonical identity of one immutable store generation — the pair `(store_id, root)`, written `store_id:root`. The byte methods address a capsule by this pair. |

The **URN** is `urn:dig:chia:<store_id>/<path>` (optionally `?salt=<hex>`). The client derives the retrieval key (`sha256` of the URN) and the AES-256-GCM-SIV decryption key (URN-derived, HKDF). **Only the retrieval key is ever sent to a node.**

---

## dig.getContent

Stream one resource's ciphertext by retrieval key. This is the method behind every content view and public store link.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `store_id` | hex(32) | yes | The store. |
| `retrieval_key` | hex(32) | yes | `sha256(urn)` of the target resource. |
| `root` | hex(32) or `"latest"` | no | Generation to read. Absent ≡ `"latest"`. |
| `offset` | uint | no | Byte offset for this chunk (default `0`). See [Streaming](./streaming.md). |
| `length` | uint | no | Requested chunk length; clamped to the node's max chunk. |

**Result** — a [chunk object](./streaming.md#the-chunk-object): `ciphertext` (base64), `total_length`, `offset`, `length`, `complete`, `next_offset`, `inclusion_proof` (base64 or `null`), `chunk_lens` (per-chunk ciphertext lengths, first window only), `root` (the resolved generation, hex), and `program_hash` (the served `.dig`'s `sha256`, hex). Reassemble until `complete`, verify the proof over the whole ciphertext against `root`, split by `chunk_lens`, then decrypt. There is **no `decoy` field** — a miss is the capsule's own indistinguishable, non-verifying response (see [the blind host model](../protocol/blind-host-model.md)).

---

## dig.getProof

Both proofs for a resource read by retrieval key:

- **Inclusion proof** (merkle) — REAL and SYNCHRONOUS: proves the served ciphertext is committed under the generation root. Returned immediately.
- **Execution proof** (ZK / risc0) — proves a node faithfully *executed* the serving computation. A real ZK proof takes far longer than a request, so it is produced **asynchronously** by the prover on Fargate; a forgeable mock is **never** served. This public method is **read-only**: it returns a real execution receipt when you pass a `proof_id` you already requested, and otherwise points you at the gated control plane that produces them.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `store_id` | hex(32) | yes | The store. |
| `retrieval_key` | hex(32) | yes | `sha256(urn)` of the resource. |
| `root` | hex(32) or `"latest"` | no | Generation to prove. |
| `proof_id` | string | no | An execution-proof job id (from the control plane) to return the real receipt for. |

**Result**

```json
{ "inclusion_proof": "<base64 merkle proof>",
  "program_hash": "23b491…",
  "root": "a07c…4d",
  "execution_proof": "<risc0 receipt | null>",
  "execution_proof_status": "succeeded | running | queued | not_found | request_via_control_plane",
  "node_pubkey": "…", "block_header": "…" }
```

The client verifies the inclusion proof over the reassembled ciphertext against the chain root (see [Streaming](./streaming.md#reassembly-and-proof-verification)). To obtain an execution proof, request one via the gated control plane (`POST https://hub.dig.net/v1/stores/<store_id>/proof` with `kind=execution`, which budgets/PoW-gates the expensive proving and drives the prover), then poll it here or via `dig.getProofStatus`.

---

## dig.getProofStatus

Poll a REAL execution-proof job by id. Returns the job status and, when terminal, the real risc0 `receipt` + `node_pubkey` + `block_header`. Never a mock receipt.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `store_id` | hex(32) | yes | The store. |
| `proof_id` | string | yes | The job id returned when the proof was requested. |

**Result** — `{ "proof_id", "status": "queued|running|succeeded|failed", "receipt", "node_pubkey", "block_header", "root" }`.

---

## dig.getCapsule

Stream an **entire compiled capsule** — the whole `.dig` module for one generation — by `(store_id, root)`. A capsule *is* that `(store_id, root)` pair: one immutable generation. This is how a client or peer node mirrors, verifies, or installs a capsule in full. The alias `dig.getModule` is accepted for identical behavior.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `store_id` | hex(32) | yes | The store. |
| `root` | hex(32) or `"latest"` | no | The generation (capsule) to download. Absent ≡ `"latest"`. |
| `offset`, `length` | uint | no | Chunk window. See [Streaming](./streaming.md). |

**Result** — a chunk object carrying capsule bytes. The capsule is the public, self-verifying module (its own store id and signed root are checked on install per dig-store), so `inclusion_proof` is `null`/empty here; integrity comes from the capsule's structure and the on-chain root. A module genuinely absent at the requested root yields [`-32004`](#errors).

---

## dig.getManifest

A convenience over `dig.getContent` for the store's **public discovery manifest**. The node derives the canonical retrieval key for `.well-known/dig/manifest.json` itself.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `store_id` | hex(32) | yes | The store. |
| `root` | hex(32) or `"latest"` | no | Generation to read the manifest from. |
| `offset`, `length` | uint | no | Chunk window. |

**Result** — a chunk object for the manifest resource, plus the derived `retrieval_key` (hex) it was served under. The manifest body is itself ciphertext — verify and decrypt it exactly as any resource. A store with no public manifest yields an indistinguishable, non-verifying response (nothing to browse) — discovered client-side, not via a flag.

---

## dig.getMetadata

Read the store's **metadata manifest** (name, version, description, authors, license, links, …) directly from the `.dig`. Unlike content, the metadata manifest is **plaintext, ungated public discovery info** embedded in the compiled module's data section (dig-store §8.4) — it is *not* a content resource, carries *no* inclusion proof, and is never encrypted. Its on-chain binding is the module's **`program_hash`** (= `sha256` of the `.dig` bytes), which the node returns so the caller can verify the served capsule against the chain. `program_hash` is **capsule-bound** — one program per capsule, since each `(store_id, root)` compiles to exactly one module.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `store_id` | hex(32) | yes | The store. |
| `root` | hex(32) or `"latest"` | no | Generation to read metadata from. Absent ≡ `"latest"`. |

**Result**

```json
{ "manifest": {
    "schema_version": 1, "name": "…", "version": "…", "description": "…",
    "authors": [ { "name": "…", "handle": "…", "contact": "…" } ],
    "license": "…", "homepage": "…", "repository": "…",
    "keywords": [], "categories": [], "icon": "…", "content_type": "…",
    "links": {}, "custom": {} },
  "program_hash": "23b491…dddf72",
  "root": "a07c…4d" }
```

`manifest` is `null` when the module embeds no metadata; a module genuinely absent at the root yields [`-32004`](#errors) (there is no `decoy` field). **Verification:** a client compares the returned `program_hash` and `root` against the values it reads from the on-chain singleton (e.g. via its own lineage walk, or [`dig.listCapsules`](#diglistcapsules)). A mismatch means the served `.dig` is not the on-chain-anchored generation — the metadata must not be trusted.

---

## dig.listCapsules

Return the store's **confirmed capsules** — one entry per anchored generation, i.e. one per `(store_id, root)` pair. A store is a sequence of these capsules. This is discovery metadata, not content: it reveals only the public on-chain generation list.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `store_id` | hex(32) | yes | The store. |

**Result**

```json
{ "store_id": "5b1f…e9",
  "capsules": [
    { "seq": 0, "root": "11aa…", "program_hash": "…", "coin_id": "…", "anchored_at": 1750000000 },
    { "seq": 1, "root": "a07c…4d", "program_hash": "…", "coin_id": "…", "anchored_at": 1750500000 }
  ] }
```

Entries are ordered by `seq` (the monotonic generation number). `root` is the value passed to the byte methods; `coin_id` is the anchoring spend. This list is the source of truth for which roots a node can serve.

---

## dig.listCollectionItems

List an NFT collection's items, each resolved to its **current** on-chain state. The collection is addressed by its **item set** — the NFT `launcher_ids` the collection mint produced (the stable identity of each NFT, what its `nft1…` id encodes). For every launcher the node walks the NFT singleton's lineage forward to the live coin, so the reported owner is the **current** holder, not the mint-time owner — owner-independent, computed from on-chain coin data with no third-party indexer.

This is a pure read; it never builds or pushes a spend.

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `launcher_ids` | array of hex(32) | yes | The NFT launcher ids that make up the collection (the authoritative item set; mint returns these). |
| `offset` | uint | no | Page start over `launcher_ids` (default `0`). |
| `limit` | uint | no | Page size (default `50`, capped at `200`). |

Pagination is applied over `launcher_ids` **before** resolution, so a page only reads the chain for the items it returns. Order is the input order (stable).

**Result**

```json
{ "items": [
    { "launcher_id": "ab…", "coin_id": "11…", "owner_did": "ef…",
      "royalty_puzzle_hash": "22…", "royalty_basis_points": 300,
      "owner_puzzle_hash": "33…",
      "metadata": {
        "edition_number": 1, "edition_total": 100,
        "data_uris": ["urn:dig:chia:<storeId>:<root>/<key>", "https://…"], "data_hash": "44…",
        "metadata_uris": ["urn:dig:chia:<storeId>:<root>/<key>"], "metadata_hash": "55…",
        "license_uris": [], "license_hash": null } }
  ],
  "offset": 0, "limit": 50, "total": 2, "next_offset": 1 }
```

`owner_did` is the assigned creator DID (or `null` once an NFT is held by a plain wallet after a transfer/offer). `owner_puzzle_hash` is the **current** owner. `metadata` is the decoded on-chain CHIP-0007 metadata (or `null` when it does not decode). A launcher that does not resolve to a live NFT (never minted / not yet confirmed) is simply omitted from `items`. `next_offset` is `null` on the last page.

---

## dig.getCollection

Collection-level facts derived from the same resolved item set: the creator DID the items agree on, how many resolved, and the shared royalty. Use it for a one-call summary before paging the items with [`dig.listCollectionItems`](#diglistcollectionitems).

**Params**

| Field | Type | Required | Meaning |
|---|---|---|---|
| `launcher_ids` | array of hex(32) | yes | The collection's NFT launcher ids. |
| `did` | hex(32) | no | The declared creator DID — echoed back as `declared_did`. The authoritative `did` is derived from the items' on-chain attribution. |

**Result**

```json
{ "did": "ef…", "declared_did": "ef…",
  "item_count": 2, "resolved_count": 2, "royalty_basis_points": 300 }
```

`did` is the creator DID **every** resolved item is attributed to (or `null` when items disagree or none are attributed). `item_count` is how many launcher ids were requested; `resolved_count` is how many resolved to a live NFT. `royalty_basis_points` is the royalty every item agrees on (or `null` when they differ).

---

## dig.health and dig.methods

Service discovery. Neither takes parameters.

```json
// dig.health
{ "ok": true, "service": "dig-rpc",
  "methods": ["dig.getContent","dig.getProof","dig.getProofStatus","dig.getCapsule",
              "dig.getManifest","dig.getMetadata","dig.listCapsules",
              "dig.listCollectionItems","dig.getCollection","dig.health","dig.methods"] }

// dig.methods
{ "methods": [ … ] }
```

A client should use `dig.methods` to confirm a third-party node implements the methods it needs before relying on it.

---

## Errors

A malformed or unroutable **call** uses the standard JSON-RPC codes. A content **miss** is never an error — the capsule returns its own indistinguishable, non-verifying response (there is **no `decoy` field** on the wire), discovered client-side by proof/decryption failure (see [the blind host model](../protocol/blind-host-model.md)).

| Code | Meaning | When |
|---|---|---|
| `-32700` | Parse error | The body is not valid JSON (`id` is `null`). |
| `-32600` | Invalid request | Not a request object/array, an empty batch, or a missing `method`. |
| `-32601` | Method not found | The method is not implemented by this node. |
| `-32602` | Invalid params | Missing/malformed `store_id`, `root`, or `retrieval_key`; or `"latest"` on a store with no confirmed generation. |
| `-32603` | Internal error | The node failed to satisfy a well-formed call. |
| `-32004` | Resource not available at the requested root | A genuine infra miss (no host seed, module absent, bad magic/oversize, a trap, an undecodable envelope). Distinct from a content miss (which is an indistinguishable decoy, never an error). |

## Related

- [Streaming](./streaming.md) — the chunk object every byte method returns
- [Conformance & Security](./conformance.md) — the blind model, decoys, and CORS
- [Using the public network RPC](./public-network-rpc.md) — call `rpc.dig.net` from any client
- [URNs & Encryption](../digstore/format/urns-and-encryption.md) — how the retrieval key is derived
- [Error codes](../support/error-codes.md) — the JSON-RPC codes (and every other surface)
- [Concepts & glossary](../concepts.md) — the dig RPC, capsule, and retrieval key defined
- [OpenRPC document](https://docs.dig.net/openrpc.json) — the machine-readable spec for this method set
