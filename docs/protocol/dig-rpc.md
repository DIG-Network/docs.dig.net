---
sidebar_position: 11
title: "L6 · The dig RPC (machine interface)"
description: "The dig RPC is THE machine interface of the protocol: JSON-RPC 2.0 over HTTP POST, the full method catalogue, the chunk wire object (chunk_lens first-window-only, NO decoy field), range/window math, error codes incl. -32004, and the node profile vs the network profile."
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - getContent
  - chunk_lens
  - node profile
  - OpenRPC
  - -32004
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - chip-0035
---

# Layer 6 · The dig RPC — the machine interface

> **Canonical reference:** hub `services/retrieval/src/bin/bootstrap.rs` (the canonical `rpc.dig.net` server); `dig-node/src/lib.rs` (the node profile). The §21 REST routes are its [transport sibling](./transport-and-push.md).

**The dig RPC is the single, agent-consumable network surface of the protocol** — the only way content is read. JSON-RPC 2.0 over HTTPS `POST` to a single endpoint. There is **no CDN**.

:::tip Machine-readable specs (regenerated from the implementation)
- Network profile: [`openrpc.json`](https://docs.dig.net/openrpc.json)
- Node profile: [`openrpc-node.json`](https://docs.dig.net/openrpc-node.json)
- Cross-surface error catalog: [`error-codes.json`](https://docs.dig.net/error-codes.json)

Both OpenRPC documents are generated from one source of truth and are intended to be CI-diffed against live server responses, so an agent can drive the protocol without scraping prose. The verified browser client `dig-client-wasm` is pinned by an SRI digest.
:::

## 1 · Transport envelope

```
POST https://rpc.dig.net
Content-Type: application/json
{ "jsonrpc": "2.0", "id": <id>, "method": "<name>", "params": { … } }
```

- A single request **object** OR a non-empty **batch** array (each element dispatched independently, re-collected into a response array) — `bootstrap.rs:515-525`.
- `params` is **always by-name**; `id` is echoed.
- Any well-formed JSON body → **HTTP 200**; success/error rides in the JSON-RPC envelope.
- CORS `*`, **no credentials** (content is public ciphertext); `OPTIONS` → 204 (`bootstrap.rs:468`).

## 2 · Method catalogue (network profile)

The canonical server implements (`bootstrap.rs:453-461`):

| Method | Returns |
|---|---|
| `dig.getContent` | a [chunk object](#the-chunk-wire-object) of one resource's ciphertext |
| `dig.getProof` | the REAL sync inclusion proof + execution-proof status |
| `dig.getProofStatus` | a REAL execution-proof job by id |
| `dig.getCapsule` (alias `dig.getModule`) | the whole `.dig` for `(store, root)` |
| `dig.getManifest` | the public discovery manifest resource |
| `dig.getMetadata` | the plaintext metadata manifest (no proof, never encrypted) |
| `dig.listCapsules` | the confirmed capsule list (discovery metadata) |
| `dig.listCollectionItems` | an NFT collection's items resolved to their current on-chain owner + royalty + CHIP-0007 metadata (paginated) |
| `dig.getCollection` | collection-level facts (creator DID, item count, uniform royalty) for a set of NFT launcher ids |
| `dig.health`, `dig.methods` | service / capability discovery (authoritative for agent self-describe) |

Unknown method → `-32601`.

## Identifiers

All lower-case hex on the wire.

| Identifier | Form | Meaning |
|---|---|---|
| `store_id` | 64 hex | the CHIP-0035 singleton launcher id |
| `retrieval_key` | 64 hex | `SHA-256(urn)` — the [only URN-derived value sent to a node](./urn-and-addressing.md#the-retrieval-key--the-only-address-on-the-wire); the AES key is derived client-side and never transmitted |
| `root` | 64 hex \| `"latest"` \| absent | a generation root; `"latest"`/absent → newest confirmed generation. `root_is_pinned` gates caching — only an explicit concrete root is immutable/cacheable |
| capsule identity | `<store_id>:<root>` | one immutable generation |

## 3 · The chunk wire object {#the-chunk-wire-object}

Every byte method returns this object (`rpc_chunk_result`, `bootstrap.rs:650-675`):

| Field | Type | Meaning |
|---|---|---|
| `ciphertext` | b64 string | this window's bytes |
| `total_length` | uint | full resource ciphertext length (pre-windowing) |
| `offset` | uint | window start |
| `length` | uint | this window's byte length |
| `complete` | bool | `offset + len >= total_length` |
| `next_offset` | uint \| `null` | next offset, or `null` when complete |
| `inclusion_proof` | b64 \| `null` | merkle proof of the **whole resource**, relayed verbatim. Present every window on getContent/getManifest; empty/`null` on getCapsule |
| `chunk_lens` | `uint[]` | per-chunk **ciphertext** lengths of the full resource. **First window only** (`offset == 0`); empty ⇒ single chunk |
| `program_hash` | 64 hex | `SHA-256(.dig bytes)` — the on-chain program identity |
| `root` | 64 hex | the resolved generation root |

:::danger There is NO `decoy` field on the wire
A non-present resource yields the `.dig`'s **own** indistinguishable, non-verifying response (the [decoy](./blind-host-model.md), same shape) — the client discovers non-presence **only** by inclusion-proof failure and/or decryption failure. The absence of a `decoy` field is **regression-locked** (`bootstrap.rs:2830`); the in-process node additively tags `source` (`"local"`/`"remote"`) but never a `decoy`.
:::

## 4 · Streaming + client contract {#streaming}

1. Loop `dig.getContent` with `offset`, `length = 3 MiB` until `complete || next_offset == null`; reassemble by `total_length`.
2. Keep the **first** `inclusion_proof` and the **first** `chunk_lens`.
3. `verifyInclusion(ciphertext, proof, root)` against the **CALLER-supplied chain-anchored root** — the host is never the trust anchor (see [Verification](./verification-and-provenance.md)).
4. Split the reassembled ciphertext by `chunk_lens` and AES-256-GCM-SIV-open each chunk.

### Range / window math

`length` is clamped to **3 MiB** (`RPC_MAX_CHUNK`), **then** the requested range is **64-KiB up-aligned** (`align_range`): start rounded down to 64 KiB, end up to the next 64-KiB boundary − 1; rejected if the aligned span > **16 MiB**. So a window may be up to **3 MiB + ~64 KiB** — document the **effective** size, not the imprecise "3 MiB" cap (`range.rs:38-61`). Alignment bounds the cache-key range cardinality (anti-amplification). Full-200 slice semantics (no HTTP 206).

## 5 · Error model {#error-model}

Standard JSON-RPC `-32700 / -32600 / -32601 / -32602 / -32603`, **plus** the protocol-specific:

| Code | Meaning |
|---|---|
| `-32004` | **Resource not available at the requested root** — a genuine infra miss (no host seed, module absent in both buckets, bad magic, oversize, a wasmtime trap, an undecodable envelope). Returned by getContent/getProof/getCapsule/getManifest/getMetadata. **Distinct from a content miss**, which is an indistinguishable decoy and never an error. |

See the full [error catalog](../support/error-codes.md).

## 6 · Proof surface

`dig.getProof` always returns the **REAL synchronous** `inclusion_proof` + `program_hash` + `root`. The `execution_proof` (risc0) is **read-only / job-based**: `null` with `execution_proof_status = "request_via_control_plane"` unless a `proof_id` (requested via the gated hub `/v1` [control plane](./blind-host-model.md#v1-control-plane)) resolves a job. `dig.getProofStatus` polls the **real** job. **Never a mock receipt on the wire.** See [inclusion vs execution proofs](../inclusion-vs-execution-proofs.md).

## 7 · Node profile {#node-profile}

The local **dig-node** / **dig-companion** that the DIG Browser runs in-process (FFI) is `rpc.dig.net`-compatible but implements a **different, smaller** subset (`dig-node/src/lib.rs:1121-1297`):

- Of the byte methods, **only `dig.getContent`** (local-first: cached `.dig` → §21.9 whole-store sync → proxy upstream). Everything else proxies or returns `-32601`.
- **Plus node-only methods the security model depends on:**
  - `dig.getAnchoredRoot` — resolves the [CHIP-0035 on-chain head](./verification-and-provenance.md#gate-3) via coinset.org (`lib.rs:721-743`); the **trusted root** for mandatory root-pinning.
  - `dig.stage` — compiles a local folder into a capsule `.dig` in-process (`lib.rs:768-904`).
  - `cache.*` — `getConfig`/`setCapBytes`/`clear`/`listCached`/`removeCached`/`fetchAndCache` (`lib.rs:1143-1231`).

An agent **gates on `dig.methods`** rather than assuming one uniform surface — hence two OpenRPC documents (network + node).

## Related

- [Protocol: Overview](../protocol-deep-dive.md) — the seven-layer model
- [Streaming](../rpc/streaming.md) — the chunk object, in task-oriented form
- [§21 transport & push](./transport-and-push.md) — the REST / CLI-peer sibling
- [Verification & provenance](./verification-and-provenance.md) — verify against the chain root
- [The blind host model](./blind-host-model.md) — serve_blind, the resolver, the control plane
- [Error codes](../support/error-codes.md) — the full catalog incl. `-32004`
