---
sidebar_position: 5
title: Using the public network RPC
description: "Public RPC endpoint usage, portability across nodes, operating your own node, and rate limiting policies."
keywords:
  - rpc.dig.net
  - public RPC
  - node portability
  - run your own node
  - rate limits
tags:
  - dig-rpc
  - retrieval-key
  - capsule
  - merkle-proof
  - dighub
---

# Using the public network RPC

The dig RPC is the **public read interface for the whole DIG Network**. The reference node is:

```
https://rpc.dig.net
```

It is open, credential-free, and CORS-enabled (`*`) — any client, from a browser page to a CLI to another node, can call it directly. There is no API key and no account. Visiting it in a browser (`GET https://rpc.dig.net/`) returns a short intro page linking back to these docs; the interface itself is **JSON-RPC 2.0 over `POST`** (see [Methods](./methods.md)).

## Point a client at it

Any read is one `POST`:

```bash
# liveness + advertised methods
curl -s https://rpc.dig.net -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"dig.health"}'

# read a resource by retrieval key (sha256 of the URN), pinned to a generation root
curl -s https://rpc.dig.net -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"dig.getContent",
       "params":{"store_id":"5b1f…e9","root":"latest","retrieval_key":"9f23…c1"}}'
```

In JavaScript, the DIG read-crypto client derives the retrieval + decryption keys from a URN and talks to the RPC for you — set the endpoint with `VITE_RPC` to point at your own node, or leave it unset to resolve one automatically (a reachable local dig-node first, `https://rpc.dig.net` only as the final fallback), then call `readByUrn(...)`. Every read is verified against the on-chain root and decrypted in your process; the node only ever sees a hash.

## What it serves

| Endpoint role | Method(s) |
|---|---|
| Resource ciphertext + inclusion/execution proofs | [`dig.getContent`](./methods.md#diggetcontent), [`dig.getProof`](./methods.md#diggetproof), [`dig.getProofStatus`](./methods.md#diggetproofstatus) |
| Whole capsule (`.dig`) | [`dig.getCapsule`](./methods.md#diggetcapsule) |
| Public discovery manifest / store metadata | [`dig.getManifest`](./methods.md#diggetmanifest), [`dig.getMetadata`](./methods.md#diggetmetadata) |
| Generation list | [`dig.listCapsules`](./methods.md#diglistcapsules) |
| Service discovery | [`dig.health`](./methods.md#dighealth-and-digmethods), `dig.methods` |

## Portability: any node, same answer

Content is addressed by chain-anchored identifiers (`store_id`, `root`, `retrieval_key`), not by host. A URN resolves to the **same bytes at any node that hosts the capsule**, and every byte is verified against the on-chain root client-side — so the node is never trusted and you can switch nodes freely. Use [`dig.methods`](./methods.md#dighealth-and-digmethods) to confirm a third-party node implements what you need before relying on it.

:::tip
To `clone`, `pull`, or `push` a whole store (not just read resources), use the git-style **[`dig://` remote](./dig-remote.md)** — the same nodes, addressed as `dig://[<user>@]<host>/<storeId>`, with per-request identity-key auth. You can also self-host an origin with `digstore serve`.
:::

## Operating your own node

Because reads are blind and verified client-side, anyone can run a conformant node and join the network's read path. A node:

- speaks JSON-RPC 2.0 over `POST` at a single HTTPS origin and answers CORS preflight;
- implements the method set above with the documented semantics;
- serves sealed ciphertext + a root-anchored inclusion proof, and only real execution receipts;
- answers every miss with an indistinguishable decoy (never an existence oracle).

See [Conformance & Security](./conformance.md) for the full contract.

## Rate limits and fair use

Reads are cheap and uncached at the RPC layer; a node operator may throttle abusive callers by IP or volume (a throttle is an HTTP-level rejection, never a JSON-RPC error tied to a store or key). Generating a ZK **execution** proof is expensive and is gated on the control plane (`hub.dig.net/v1`), not triggered from the public RPC — the RPC serves the resulting receipts read-only.

:::note
`rpc.dig.net` is operated by DIG Network as the reference node. The protocol is open: the same client works against any conformant node.
:::

## Related

- [Methods](./methods.md) — what to POST and what comes back
- [The dig:// remote](./dig-remote.md) — git-style clone/pull/push over the same nodes
- [Conformance & Security](./conformance.md) — the contract a node must meet
- [What is the dig RPC?](./what-is-the-dig-rpc.md) — the read interface in overview
- [Concepts & glossary](../concepts.md) — the dig RPC and capsule defined
