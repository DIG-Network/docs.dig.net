---
sidebar_position: 1
title: What is the dig RPC?
---

# What is the dig RPC?

**The dig RPC is the network-wide interface for reading content directly from hosted DigStore `.dig` capsules.** It is a [JSON-RPC 2.0](https://www.jsonrpc.org/specification) service spoken over HTTPS `POST`.

Every node that hosts capsules — the reference node at `https://rpc.dig.net`, or any third-party node — exposes the **same methods with the same semantics**. A client written against this interface reads from the whole network through one endpoint. There is no CDN; all content serving on DIG is via the dig RPC.

It serves three things:

| You have… | You call… | You get back… |
|---|---|---|
| A resource's **retrieval key** (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | The resource's ciphertext + a merkle inclusion proof (and the ZK execution proof), streamed in chunks |
| A **store id + generation root** | [`dig.getCapsule`](./methods.md#diggetcapsule) | The entire `.dig` capsule for that generation, streamed in chunks |
| A **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | The public discovery manifest / the store metadata manifest / the store's confirmed generation list |

## Three properties that define it

- **Blind by construction.** A node serves opaque ciphertext keyed by a hash. It never sees a URN, a decryption key, or plaintext. A request that misses is answered with a deterministic, indistinguishable **decoy** stream — never a `404` — so the read path is never an existence oracle. All decryption and all proof verification happen in the client.
- **Verifiable without trust.** Every real byte arrives with a merkle **inclusion proof** rooted at the on-chain generation root. The client folds the proof to the root and accepts only if it matches a root it trusts. The node is never trusted to have returned genuine bytes.
- **Streamable at any size.** Content is read in bounded, 64 KiB-aligned chunks with explicit continuation. A one-kilobyte resource and a hundred-megabyte capsule are read by the same loop, and no single response is unbounded.

## How it fits with DigStore

DigStore gives you the **format**: a content-addressable, encrypted store that compiles to a single self-defending `.wasm` capsule, addressed by a URN where *the URN is the key*. The dig RPC is how that capsule is **served on the network** without trusting the host:

1. You compile a store and anchor a generation on-chain (a CHIP-0035 DataLayer singleton). Its **content root** is the trust anchor.
2. A node hosts the capsule and exposes it over the dig RPC.
3. A reader derives `retrieval_key = sha256(urn)`, calls `dig.getContent`, reassembles the streamed ciphertext, **verifies the inclusion proof against the on-chain root**, and **decrypts with the URN-derived key** — entirely client-side.

The node learned only a hash; it never learned what it served.

## A read in one call

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

The client loops on `next_offset` until `complete`, verifies `inclusion_proof` over the reassembled bytes against `root`, then decrypts. A result with `"decoy": true` means *not found* — stop and report it as such.

## How to read these docs

- **[Methods](./methods.md)** — the full method set (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), their parameters, and results.
- **[Using the public network RPC](./public-network-rpc.md)** — point your client at `rpc.dig.net` (or any node), endpoints, and operating one yourself.
- **[Streaming](./streaming.md)** — the chunk model, reassembly, proof verification, and a reference client loop.
- **[Conformance](./conformance.md)** — what a node MUST implement to be a member of the network read path, plus CORS, errors, and the blind model in full.

:::note
The dig RPC is part of the [DIG Network](https://dig.net). The full normative specification is the *dig RPC: Network Content Interface* document, a companion to the DigStore whitepaper.
:::
