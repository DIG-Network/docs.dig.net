---
sidebar_position: 4
title: Conformance & Security
description: "Blind serving model, decoy streams, CORS, caching, rate limiting, and conformance checklist for dig RPC endpoints."
---

# Conformance & Security

The dig RPC is designed so that **any** node can join the network's read path by implementing one interface exactly. This page is the contract.

## The blind serving model

A node stores, per hosted generation, the compiled `.dig` capsule — a self-defending WebAssembly module that *is* both the data and the code that gates access to it. To serve a resource, the node runs the capsule's own serve flow for the requested retrieval key inside a bounded host runtime. The capsule returns a `ContentResponse` envelope carrying the resource's **ciphertext** and a **merkle inclusion proof** rooted at the generation's content root. The node decodes the envelope framing host-side to split the two — which is *not* decryption, the ciphertext stays sealed — and returns ciphertext (base64) + proof (base64). **The host runtime holds no URN and no key, so it never reads what it serves.**

### Decoys: no existence oracle

On **any** content miss — unknown store, unknown retrieval key, a root with no hosted capsule, a runtime trap, or an envelope whose proof does not verify — a byte-bearing method returns a normal `result` whose `decoy` flag is `true` and whose `ciphertext` is a deterministic pseudo-random stream seeded by the requested key. The decoy has a plausible, key-derived length and streams through the identical chunk machinery, so a passive observer (and the operator) cannot distinguish a hit from a miss by status, shape, or size. A client treats `decoy: true` as not-found, never as an error.

### Root resolution

When `root` is an explicit 64-hex value, the node serves that exact generation. When `root` is `"latest"` or absent, the node resolves the store's **newest confirmed generation** from its capsule index and serves that; the resolved root is echoed back as `root`. Because a store's existence and its generation list are already public on-chain (and via [`dig.listCapsules`](./methods.md#diglistcapsules)), a `"latest"` request against a store with no confirmed generation returns an *error*, not a decoy — that is store-level discovery, not a private-resource oracle.

A trustless client pins an explicitly chain-verified `root` rather than relying on the node's `"latest"` resolution.

## CORS and cross-origin use

The RPC is a public, credential-free service over public ciphertext, so it is fully cross-origin. A node **must** answer `OPTIONS` with `204` and set, on every response:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: content-type
Access-Control-Max-Age: 86400
```

Cookies and credentials are never used or honored. This lets any web app, a sandboxed preview origin, or any third-party site call any node directly from the browser. A node must send a strict content-security and `nosniff` posture so its opaque JSON is never interpreted as an executable document.

## Caching and immutability

RPC responses are **not** edge-cached: the body is a `POST` result and a single chunk request is cheap. Content is nonetheless effectively immutable when addressed by an explicit `(store_id, root, retrieval_key, offset)` tuple — the generation root pins the exact bytes — so a client **may** cache a verified, decrypted resource keyed by that tuple. A `"latest"` read is mutable by definition; clients that need stability pin the `root` echoed in the first chunk.

## Rate limits and abuse

Rate limiting and request shaping are node-operator policy, not part of the wire contract. A node may reject or throttle abusive callers by IP or volume, and should do so without revealing content state (a throttle is an HTTP-level rejection, never a JSON-RPC error tied to a specific store or key). Because the interface is blind and read-only, the abuse surface is bandwidth, not data exposure.

## Conformance checklist

A node is a conformant dig RPC endpoint if and only if it:

- accepts JSON-RPC 2.0 single and batch requests over HTTPS `POST` at a single origin, and answers `OPTIONS` per the CORS rules above;
- implements `dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule` (and the `dig.getModule` alias), `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, and `dig.methods` with the documented parameters and results;
- returns the REAL merkle inclusion proof synchronously and serves only REAL execution-proof receipts (a forgeable mock is never published as a proof);
- streams byte methods with the [chunk object](./streaming.md#the-chunk-object), snapping to 64 KiB blocks and capping at the declared max chunk, with correct `total_length`, `complete`, and `next_offset`;
- returns sealed ciphertext plus a root-anchored inclusion proof for real `dig.getContent`/`dig.getManifest` hits, and **never** returns a URN, a key, or plaintext;
- answers every miss with an indistinguishable `decoy` stream, never a `404` or a distinguishing error, and never exposes an existence oracle for a private resource;
- resolves `"latest"` to the newest confirmed generation and echoes the resolved `root`; and
- uses the JSON-RPC error codes only for malformed or unroutable calls.

:::note
The full normative text is the *dig RPC: Network Content Interface* specification, a companion to the DigStore whitepaper and the dighub API Interface.
:::
