---
sidebar_position: 12
title: "L5 · §21 transport & push"
description: "The §21 transport: dig:// locator resolution, the REST surface, the JSON-outer / Chia-codec-inner envelope, 2-leg push v1 (inline | presigned), the authenticated head (PUSH_DST), per-request §21.9 auth with exact signing messages, ETag/delta/pull, tombstone revocation, and decoy indistinguishability."
keywords:
  - §21 remote
  - dig:// transport
  - push
  - authenticated head
  - per-request auth
  - tombstone
tags:
  - dig-rpc
  - digstore-cli
  - store
  - anchoring
---

# Layer 5 · §21 transport & push

> **Canonical reference:** `digstore-remote` (axum server + reqwest `DigClient`) and its crypto/codec in `digstore-core` / `digstore-crypto`. This is the **transport** half of the [scheme split](./urn-and-addressing.md#the-three-way-scheme-split): `chia://` = content addressing; `dig://` here = the §21 transport locator. **Browser/agent reads use the [POST JSON-RPC](./dig-rpc.md); CLI/peer sync + publishing use these authenticated REST routes.**

:::note These routes span both RPC tiers
Under the [dual-transport tier model](./peer-network.md#dual-transport): the §21 **GET** content routes (`content` / `proof` / `roots` / `descriptor`) are on the **PUBLIC READ tier** — anonymous, CORS-enabled, browser-reachable, client-verified, decoy-on-miss. The §21 **PUSH / WRITE** routes (`module/upload`, `module` PUT, `module/complete`, `tombstone`) are on the **PEER / CONTROL tier** — mTLS-authenticated plus the [per-request BLS signature](#per-request-auth) below, and never reachable anonymously. See the [tier map](./peer-network.md#tier-map).
:::

## The `dig://` transport locator

`dig://` is **not spoken on the wire** — it resolves client-side to `https://<host>/stores/<id>` (`config.rs:89`). The 32-byte store id is the wire address.

| You write… | Resolves to… |
|---|---|
| `dig://<64hex>` | `https://rpc.dig.net/stores/<64hex>` |
| `dig://<user>@<64hex>` | same (user stripped — informational only) |
| `dig://<host>[:port]/<64hex>` | `https://<host>[:port]/stores/<64hex>` |
| `dig://<host>/stores/<64hex>` | passthrough |

## The REST surface (under `/stores/:id`)

`descriptor`, `roots`, `module` (GET/HEAD/PUT), `module/upload` + `module/complete` (the 2-leg push), `content`, `proof`, `delta`, `tombstone` (router `server.rs:66-117`). Middleware order: **auth THEN rate-limit** (an unauthenticated request is rejected before consuming a token). Status mapping (§21.8): UnknownStore/Root = 404, Unauthorized = 403, AuthFailed/MissingBearer = 401, NonFastForward = 409, TooLarge = 413, Validation = 422, RateLimited = 429. A content miss is **never** 404 — 200 + decoy.

## Wire envelope: JSON outer / Chia-codec inner

REST metadata (descriptor/roots/delta) is JSON for ergonomics; all content/proof/key-table blobs stay **Chia-custom-streamable-codec** encoded and base64-wrapped inside the JSON (`lib.rs:3-7`). The codec is **big-endian** fixed-width (`codec/mod.rs:3-4`), matching Chia framing: `uintN` BE; `Option<T>` = 1 tag byte + T; `Vec<T>` = u32 BE count + items; `String` = u32 BE byte-length + utf8; `Bytes32/48/96` raw, no length prefix. The same codec frames the [MerkleProof](./merkle-proofs.md#wire-layout-chia-big-endian-streamable-codec) on the wire.

## Authenticated head (PUSH_DST) {#authenticated-head}

```text
push_signing_message(root, store_id) = SHA-256( PUSH_DST || root(32) || store_id(32) )   // bls.rs:194-200
PUSH_DST = b"digstore:push:v1"
```

The signing message is domain-separated with `PUSH_DST` (`bls.rs:194-200`). The push signature **authorizes the head** and is persisted on accept, so a later clone/pull re-verifies the served head's authorization (`StoreDescriptor.push_sig`).

## Push protocol v1 (2-leg)

Two-leg because an HTTPS edge (Lambda) caps bodies below capsule size:

1. **push-init** — `POST /stores/:id/module/upload` `{ parent_root, new_root, program_hash, size_bytes, store_pubkey }` + header `X-Dig-Signature` (the authenticated head). The **first push sends `parent_root=""`** (empty), NOT the all-zero genesis root — the server matches empty parent iff `served_root == Bytes32::default()` (impl fast-forward rule). Up-front gates **before any bytes**: verify push sig (403) → fast-forward `parent == served head` (409). Reply `{ mode: "inline"|"presigned", upload_id, url? }`.
2a. **inline** — `PUT /stores/:id/module?root=<new_root>`, streamed 256-KiB chunks.
2b. **presigned (S3)** — PUT the bytes as a single buffered body (fixed Content-Length; chunked TE breaks S3 SigV4), then `POST /module/complete { upload_id, new_root }`.

Client redirects are **disabled** (anti-SSRF of the signed push); an explicit `User-Agent: digstore/<ver>` is required or the WAF 403s.

## Per-request auth (§21.9) {#per-request-auth}

Every guarded request is signed:

- `X-Dig-Identity` — 48-byte BLS G1 identity pubkey hex
- `X-Dig-Timestamp` — unix seconds
- `X-Dig-Nonce` — 32 random bytes hex
- `X-Dig-Auth` — 96-byte BLS sig over the [request message](./bls-signatures.md#the-five-role-dsts):

```text
SHA-256( REQ_DST || u32be(len(method)) || method || store_id(32) || u64be(ts) || nonce(32) )
```

Method tags: `fetch`/`roots`/`module`/`push`/`push-init`/`push-complete`/`content`/`proof`/`delta`/`tombstone`. Binding the method stops a read-auth sig replaying as a write. The freshness window is **300s**: a request is accepted only while its timestamp is within 300s of now, which bounds the window in which a captured request could be re-presented.

## Fetch / clone / pull, ETag & delta

- ETag = strong quoted hex of the generation root: `"<64hex>"`; `HEAD` returns ETag + Content-Length + `application/wasm`.
- `pull`: if local == remote → UpToDate; else (prefer-delta) `GET /delta?from=&to=` with per-chunk SHA-256 integrity, else `GET /module` with `If-None-Match` → 304 or full module.
- A server/MITM cannot substitute delta chunk bytes — each must hash to its advertised content id.

## Tombstones (revocation)

`POST /stores/:id/tombstone { record = hex(canonical(Tombstone)), signature }`; message = `SHA-256(TOMB_DST || canonical(Tombstone))`. Verified **fail-closed** against the store's published key; served in `StoreDescriptor.tombstones`; clients refuse to advance to a Root-revoked root (or refuse the whole store on a Store-scope tombstone).

## Rate limiting & decoy indistinguishability

Per-store token bucket (default 10,000 tokens, 60s refill, idle-eviction). `serve_content` **never 404s** on a miss — it returns a **deterministic decoy** keyed by `retrieval_key` (`bucket = retrieval_key[0] % 8; len = 256 << bucket`, 256 B..32 KiB, filled with `SHA-256(retrieval_key || counter_be)` blocks), byte-shaped identically to a hit.

## Related

- [The dig RPC](./dig-rpc.md) — the browser/agent read sibling (POST JSON-RPC)
- [BLS signatures & DSTs](./bls-signatures.md) — PUSH_DST / REQ_DST / TOMB_DST messages
- [The blind host model](./blind-host-model.md) — accept-on-signature push trust
- [The dig:// remote (clone/pull/push)](../rpc/dig-remote.md) — the CLI task guide
