---
sidebar_position: 6
title: The dig:// remote (clone/pull/push)
description: "Git-style remote protocol via dig:// URLs, per-request BLS signing, clone/pull/push operations, and self-hosted node setup."
keywords:
  - dig:// remote
  - clone
  - pull
  - push
  - identity key
  - self-hosted node
tags:
  - dig-rpc
  - digstore-cli
  - store
  - anchoring
  - dighub
---

# The dig:// remote (clone/pull/push)

On top of the read interface, DigStore has a **git-style remote**. You `clone` a store to disk, `pull` new generations, and `push` a new generation — over the same routes a node already serves. The transport is named by a `dig://` URL, and **every request is signed** by your identity key.

```bash
digstore clone dig://5b1f…e9             # default network node (rpc.dig.net)
digstore pull                            # sync new generations
digstore push                            # publish a new generation
```

:::note `dig://` is the CLI/remote scheme; `chia://` is the browser address bar
`dig://` names a remote *origin* for the `digstore` CLI (clone/pull/push). The DIG Browser's typeable content address is [`chia://`](../browser/chia-protocol.md) — the same store identity in a form you paste into the address bar. The underlying `urn:dig:` URN namespace is unchanged.
:::

## The `dig://` scheme

A `dig://` URL names the store's **owner** (an informational namespace, like GitHub's `user/`) and the **node host** that serves it — a store can have many origins — and resolves to `https://<host>/stores/<storeId>` under the hood.

| You write… | It resolves to… | Notes |
|---|---|---|
| `dig://<storeId>` | `https://rpc.dig.net/stores/<storeId>` | Bare 64-hex store id; default network node. |
| `dig://<user>@<storeId>` | `https://rpc.dig.net/stores/<storeId>` | `<user>` is the owner handle — display only. |
| `dig://[<user>@]<host>[:port]/<storeId>` | `https://<host>[:port]/stores/<storeId>` | Any node: the reference node, a third party, or one you run. |

The owner segment never changes which bytes you fetch — content is addressed by the chain-anchored `storeId` and verified against the on-chain root, so **any origin returns the same store**. DIGHUb shows a store's canonical origin in a GitHub-style clone box as `dig://<handle>@rpc.dig.net/<storeId>`.

## Every request is signed (per-request auth)

Even an anonymous `clone` is signed. Each request carries a signed message from your **identity key** — a user-global BLS key, distinct from a store's signing key, stable per user/machine like an SSH key. (A store's signing key authorizes *writes* to that store; the identity key authenticates the *caller*.) Four headers carry it:

| Header | Value |
|---|---|
| `X-Dig-Identity` | 48-byte-hex BLS G1 identity public key |
| `X-Dig-Timestamp` | unix seconds |
| `X-Dig-Nonce` | 32-byte hex, fresh per request |
| `X-Dig-Auth` | 96-byte-hex BLS signature over the canonical message |

The canonical message binds the route's logical op, the store, and the freshness fields:

```
msg = SHA-256( REQ_DST || len(method) || method || store_id(32) || timestamp_be(8) || nonce(32) )

  REQ_DST  = "digstore:req:v1"
  method   = one of { fetch, roots, module, content, proof, push, tombstone, delta }
  len(...) = big-endian u32 length of the method string
```

Binding `method` stops a signature for one route being replayed against another. The server returns **`401`** on a missing/malformed header, a timestamp outside the **±300 s** freshness window, or a signature that does not verify. The freshness window plus the per-request nonce defeat replay.

The identity key is created once and reused for every request from that machine. It lives at `<OS config dir>/dig/identity_key.bin` (override with `DIG_IDENTITY_DIR`).

## The remote routes

These are the routes a node serves under `/stores/{id}` — the same surface `rpc.dig.net` exposes. Every request is authenticated as above.

| Route | Returns / Body |
|---|---|
| `GET /stores/{id}` | **StoreDescriptor** — `{ current_root, size, public_key, push_sig, tombstones[] }` |
| `GET /stores/{id}/roots` | **RootHistory** — `{ roots: [ { generation, root, timestamp } ] }`, oldest→newest |
| `GET\|HEAD /stores/{id}/module?root=<hex>` | Raw `.dig` module bytes; `ETag = root`, `If-None-Match` → `304`. This is the clone/pull download. |
| `PUT /stores/{id}/module` | Push a new generation (self-hosted nodes). Body = module; headers below. |
| `POST /stores/{id}/tombstone` | A signed revocation. |

A `PUT` push also carries the store-write headers: `X-Dig-Parent` (the root it extends), `X-Dig-Root` (the new root), `X-Dig-Signature` (a BLS signature by the **store signing key** over `SHA-256(root || store_id)`), and `X-Dig-Push-Mode` (`advance` to move the head, or `pending` to stage).

## clone and pull

A `clone` is a sequence of authenticated reads of **public ciphertext** and metadata: the descriptor (`GET /stores/{id}`), the generation history (`GET /stores/{id}/roots`), and the module bytes for each wanted generation (`GET /stores/{id}/module?root=<hex>`). A `pull` re-reads descriptor + roots and downloads only the modules you lack; an unchanged head answers `304`. Each module is verified against its on-chain `root` client-side, so the node is never trusted to have returned genuine bytes.

## push: DIGHUb vs. self-hosted

Publishing a generation is an on-chain event with a fee, so where it lands depends on the origin:

- **Push to DIGHUb (`rpc.dig.net`)** does **not** use the `PUT` route. DIGHUb anchors every generation on-chain and each generation pays an on-chain DIG fee; DIGHUb holds no keys, so the push goes through its authenticated, **wallet-signed `/v1` flow**, where you sign the on-chain spend. DIGHUb accepts only stores already **registered on-chain with the 100 DIG launch fee paid** — that registration is the launch gate.
- **Push to a self-hosted node** uses `PUT /stores/{id}/module` directly: the node accepts the module on a valid store-key signature and advances (or stages) its head.

In both cases the store-key signature over `SHA-256(root || store_id)` authorizes the write; only the on-chain settlement differs.

## Run your own node

Because reads are blind and client-verified, anyone can host an origin:

```bash
digstore serve --bind 0.0.0.0:8443
```

This serves the full remote protocol — descriptor, roots, module download, and `PUT` push — for a store straight from disk. Others clone it by pointing a `dig://` URL at your host:

```bash
digstore clone dig://yourhost:8443/<storeId>
```

A self-hosted node speaks the identical routes and the identical per-request auth as the reference node, so a store is portable across origins with no client change.

## CLI summary

| Command | Does |
|---|---|
| `digstore remote add origin dig://…` | Register a remote origin for the local store. |
| `digstore clone dig://…` | Fetch descriptor, roots, and module(s) into a new local store. |
| `digstore pull` | Sync new generations from the origin. |
| `digstore push` | Publish a new generation (DIGHUb `/v1` or self-hosted `PUT`). |
| `digstore serve --bind 0.0.0.0:8443` | Serve the remote protocol for a local store. |

## Related

- [Using the public network RPC](./public-network-rpc.md) — the read interface these routes sit on
- [Sharing over a remote](../digstore/cli/sharing.md) — the CLI publish/consume flow
- [The chia:// protocol](../browser/chia-protocol.md) — the same scheme, for opening content in the browser
- [Proofs & Security](../digstore/format/proofs-and-security.md) — what clone/pull verify before installing
- [Concepts & glossary](../concepts.md) — the chia:// protocol and dig RPC defined

:::note
The `chia://` remote and the [public read RPC](./public-network-rpc.md) speak the same routes against the same nodes. The full normative specification is Part 5 (§22) of the *dig RPC: Network Content Interface* document.
:::
