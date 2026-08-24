---
sidebar_position: 14
title: "L7 · Content replication (the flywheel)"
description: "The normative content-replication flywheel: how a DIG Node turns every read into a new holder — connect over mTLS, discover holders through the Kademlia provider DHT (find_providers) and the real-time signed holdings-announce (gossip opcode 222), fetch and merkle-verify the bytes against the chain-anchored root, admit the capsule into the bounded on-disk LRU cache (1 GiB default, pins exempt), then announce the gain so the reader becomes a discoverable holder — plus the eviction retract that keeps the holder map honest, the first-party landing gate that stops a stranger deciding what this node stores, and the untrusted-peer property that makes the loop safe: content is accepted because it verifies, never because of who served it."
keywords:
  - content replication
  - flywheel
  - resharing
  - reader becomes holder
  - provider record
  - find_providers
  - holdings announce
  - opcode 222
  - capsule cache
  - LRU eviction
  - retract
  - merkle verification
  - chain-anchored root
  - untrusted peers
  - no central CDN
tags:
  - dig-node
  - dig-dht
  - dig-download
  - dig-store-cache
  - peer network
---

# Layer 7 · Content replication — the flywheel

> **Canonical references:** `dig-node` (the composition root that wires the loop), `dig-dht` (the Kademlia provider DHT and `find_providers`), `dig-gossip` (the signed holdings-announce wire, opcode 222), `dig-download` (the multi-source, merkle-verified fetch), `dig-store-cache` (the bounded on-disk capsule cache), and `dig-store` (the `.dig` capsule format). This page is the ecosystem-wide spec for **how content spreads**; the [peer network](./peer-network.md) is the transport it rides, and [verification & provenance](./verification-and-provenance.md) is the integrity gate every stage defers to.

DIG has **no origin server and no CDN**. A capsule is available because some set of nodes holds it, and that set is not curated by anyone — it grows wherever the content is actually read. This page specifies that mechanism.

## The thesis: a read makes a holder

Every stage below feeds the next, and the last stage feeds the first:

**connect → discover → fetch + verify → cache → announce → (someone else discovers you) → …**

The consequence is that **availability tracks demand**. A capsule nobody reads is held by its publisher. A capsule read widely is held widely, close to where it is read, with no operator deciding so and no coordination step. Churn heals the same way: a departed holder's provider record expires and is retracted, while every fresh read mints a new holder.

Two properties make the loop safe rather than a rumour mill, and both are enforced, not assumed:

- **Every peer is untrusted.** A holder claim is a claim. Content is accepted because it **verifies against the merkle root and the chain-anchored generation**, never because of who served it. A false claim buys the liar one failed dial.
- **A stranger cannot decide what this node stores.** Caching and announcing are side effects of a node's **own** reads. Serving another peer causes neither.

## Stage 1 · Connect

A node opens mutually-authenticated links to peers before it can discover or fetch anything. Peer identity is the hash of the TLS public key — `peer_id = SHA-256(TLS SubjectPublicKeyInfo DER)` — and the dial follows the ordered NAT-traversal ladder, preferring a direct path and relaying only as a last resort.

This stage is specified in full on the [peer network](./peer-network.md) page. Everything below rides that same authenticated transport; there is no unauthenticated discovery or fetch traffic.

## Stage 2 · Discover — who holds this capsule

Discovery answers one question: **which peers hold content key X?** It has two halves, a durable one and a real-time one, and they carry different guarantees.

### 2a · The provider DHT — durable, network-wide

`dig-dht` is a Kademlia DHT whose values are **provider records**: "peer P holds content key K, reachable at these addresses, until `expires_at`". The content key is derived from the store id, generation root, and (for a resource) the retrieval key — the derivation and the four DHT methods are specified under [the DHT](./peer-network.md#dht).

`find_providers(content)` is a **distributed iterative lookup**: the node queries the α closest contacts it knows, recurses toward peers closer to the key, converges on the k closest, and returns the union of the holder records it collected. A locally-held record is a fast path, never the whole answer.

Two properties are load-bearing:

- **Discovered records are hearsay.** A record learned during a lookup was asserted by some peer about some other peer, and nothing authenticated it. Such records are used on the **fetch** path — where a wrong candidate costs one failed dial, because the merkle bind catches it — and are **never re-served** in answer to another node's lookup and never republished. Only records this node holds authoritatively (the mTLS-verified announcer's own, or a signature-checked ingest) are served or published.
- **Records are TTL'd and republished.** A holder refreshes its records before they expire; a holder that stops refreshing drops out of discovery on its own. That is how the network forgets a node that went away without saying so.

### 2b · The holdings announce — real time

The DHT alone converges only as fast as the next PUT and the next TTL. `dig-gossip` **opcode 222, `HoldingsAnnounce`**, adds the real-time half: a **signed, batched** statement of add/remove deltas to a peer's holdings, flooded across the gossip pool, which upserts and removes provider records at receiving nodes within seconds.

The announce is signed with the announcer's TLS leaf key over the `dig:holdings:v1` preimage, and acceptance is **fail-closed**. The wire contract — the preimage, the batch cap, and the five acceptance checks — is normative and specified on the [peer network](./peer-network.md) page.

Because an inbound announce mutates another node's view of who holds what, the ingress is guarded over threat *classes* rather than individual attacks:

| Class | What stops it |
|---|---|
| **Forged attribution** — naming another peer as a holder, or as *not* a holder | The provider identity is taken from the signature alone. No code path accepts a caller-supplied provider id, so an announcer can only ever speak about itself. |
| **Identity re-spelling** — one signer wearing many names | The peer id is canonicalized once, up front; every later comparison, map key and sink argument uses that single form. |
| **Amplification** — one cheap message causing expensive work | The ingress performs **no** egress: it never re-broadcasts, dials, probes, or fetches. Its cost is bounded local map work. |
| **Flood and Sybil eviction** — pushing an honest holder out of a full provider set | Two token buckets at one chokepoint, keyed differently (per announcing provider, and per transport sender). A rejected announcement charges neither, so the limiter cannot itself be weaponised. |
| **Replay** — resurrecting a retracted record | Two independent barriers: a per-provider monotonic sequence watermark, and a bounded-freshness check on the signed timestamp. Either alone is escapable; a removal in particular carries no expiry of its own. |
| **Self-poisoning** — replaying a node's own announce back at it | An announce attributed to the receiving node's own peer id is dropped. Only a node decides what it holds. |
| **Unbounded state** — the guard tables becoming the denial of service | A rejected announcement allocates nothing; admitted entries are capacity-bounded and evicted LRU. |

### 2c · This is not the hop-by-hop ask

Two different discovery mechanisms exist and they must not be confused.

| | Provider DHT + holdings announce (this page) | Recursive hop-by-hop ask |
|---|---|---|
| **Shape** | An **iterative** Kademlia lookup: the seeker itself queries progressively closer peers and collects records. | A **transitive** ask: a peer that lacks the content asks its own peers, holding each hop's request open until its subtree answers. |
| **What comes back** | Provider *records* — holder identities and addresses. The seeker then dials a holder itself. | An answer routed back along the hops, either the bytes or the holder's dial address. |
| **Who carries the bytes** | Never the discovery path. The fetch is a separate, direct connection to a holder. | Optionally the hops themselves. |
| **Cost borne by** | The seeker. | The relaying intermediaries, which is why it needs its own bounds. |

They have different trust and topology properties. A statement about one is not a statement about the other.

## Stage 3 · Fetch and verify

With a holder set in hand, `dig-download` fetches the content — from **multiple sources** where they exist, by byte range, resumable — and verifies as it goes. The [client-to-node resolution ladder](../run-a-node/point-a-consumer.md) governs which node a client asks in the first place; this stage governs what happens once bytes are moving.

Verification is not a post-hoc check on the assembled result:

- **Per-range integrity.** Each fetched range carries a merkle proof; a reassembly drawn from several peers is bound to one committed generation root, so no mixture of sources can forge a resource.
- **The proof must be complete.** The verifier requires that the named resource leaf **is** the proof's leaf, that the proof folds to its root, and that the root **is** the download's committed generation root. A half-specified binding — a proof with no root, or a root with no proof — **fails closed**.
- **A whole capsule self-verifies on install.** A capsule fetch carries no per-resource proof; its integrity comes from the capsule format's own structure.
- **The root is anchored on chain.** A generation is only ever *served as current* when its root equals the chain-anchored tip. The worst a stale or attacker-chosen root can achieve is caching a real but **older** generation — never fabricated content.

**Verified is not the same as safe.** A capsule that verifies is exactly the bytes its publisher committed; it is still content from a stranger, and it is treated as untrusted input by everything that renders or executes it. Integrity is a statement about authorship, not about intent — see [the self-defending module](./self-defending-module.md) for how served content is confined.

## Stage 4 · Cache — keep what you fetched

A verified capsule is admitted to the node's **on-disk capsule cache** (`dig-store-cache`):

- **Bounded, with LRU eviction.** The default capacity is **1 GiB**; it is configurable. When admitting a capsule would exceed the bound, least-recently-used capsules are evicted.
- **Pins are exempt.** A pinned capsule — a node's own published content, or one an operator chose to keep — is never reclaimed by eviction, and pins may push the cache over its nominal bound.
- **Path-based, never slurped.** A capsule can be around a gibibyte, so the cache hands out a path and consumers stream from it.
- **Admission is gated on verification.** Nothing enters the cache that did not pass stage 3.

Two distinct paths land a capsule in the cache, and both reuse the same verified whole-store sync:

1. **Backfill on a miss.** When a resource read is satisfied from another node, the node also pulls the **whole** capsule for that generation in the background, so the next read of that store is served locally. It is fire-and-forget — the in-flight read is never delayed — and deduplicated, so a burst of reads for the same not-yet-held store triggers one pull, not one per read.
2. **Reshare after serving.** The same landing primitive runs on the peer-serving path, subject to the gate below.

### The first-party landing gate

Caching and announcing are **durable side effects**, so who asked matters:

- A **first-party** read — an operator at the local node, a CLI or SDK client — lands: it caches, and it announces.
- A read this node is performing **on behalf of a remote peer**, or one a browser reports was driven by another origin's page, **does not land**: the bytes are served, and there is no cache write, no announce, and no reshare.

Without this gate, any stranger could choose what a node stores and what it advertises holding, by asking for it. Where a node does pull on inbound demand, that is an explicit operator opt-in and is additionally confined to the node's own keyspace neighbourhood, so it can only ever pull content near the id it already serves.

## Stage 5 · Announce — become a holder, and stop being one honestly

On an inventory **gain** — by whichever path put the capsule on disk — the node reconciles its provider records: it PUTs records at store and capsule granularity into the DHT and emits an opcode-222 **add** announce. It is now discoverable, and it serves the capsule over the peer RPC like any other holder. The loop is closed: the next seeker's `find_providers` returns this node.

On an inventory **loss** — an eviction, a deletion — the node **actively retracts**. This is stronger than letting the record lapse: an active retract removes the local record immediately so this node stops asserting a holding it no longer has, rather than continuing to answer with it until a TTL elapses. A **remove** announce propagates the same fact in real time. Copies already PUT at distant peers still age out by TTL; the point of the active retract is that the node itself never lies about its own inventory.

The advertised lifetime of an add is deliberately aligned with the DHT's own provider TTL and republish interval rather than chosen as a round number: claiming longer than the TTL is silently truncated, and claiming shorter than the republish interval would drop a still-serving holder out of discovery between refreshes.

## Why this self-scales

| Situation | What the flywheel does |
|---|---|
| A capsule becomes popular | Every reader that fetches it becomes a holder, so the holder set grows with demand and the publisher stops being a bottleneck. |
| Readers cluster in one region | Holders appear where the reads are, so later reads there are local. |
| A holder goes offline | Its records expire and are no longer refreshed; seekers converge on the remaining holders. |
| A holder evicts a capsule | It retracts immediately and stops advertising, so seekers are not sent to a node that will answer "no". |
| A peer lies about holding content | The seeker wastes one dial; the merkle bind means it can never receive wrong bytes, and the peer selector deranks the liar. |
| Nobody reads a capsule | It stays with its publisher, which is where a pin keeps it. Unread content costs the network nothing. |

## Conformance

An implementation conforms to this layer when all of the following hold:

1. Holder discovery is a **distributed iterative** provider lookup, not a local-store read; a local hit is a fast path only.
2. Records learned during a lookup are **never re-served** in answer to another node's lookup and never republished.
3. An inbound holdings announce is accepted only on a valid signature whose derived peer id **is** the provider it speaks for, with monotonic-sequence and freshness replay barriers, per-provider and per-sender rate limits, and no egress of any kind.
4. Fetched ranges are merkle-verified against a committed generation root, with a half-specified proof-and-root binding failing closed.
5. A generation is served as current only when its root equals the chain-anchored tip.
6. The capsule cache is bounded with an eviction policy, admits only verified capsules, and exempts pins.
7. An inventory gain announces at store and capsule granularity; an inventory loss **actively retracts** rather than waiting for a TTL.
8. Cache-write, announce, and reshare occur only for first-party reads, never as a side effect of serving a remote peer.

## Related

- [DIG Node peer network](./peer-network.md) — the transport, the DHT wire, and the holdings-announce byte contract
- [Verification & provenance](./verification-and-provenance.md) — the ordered integrity gates every fetch defers to
- [Merkle inclusion proofs](./merkle-proofs.md) — the proof format the range verifier folds
- [On-chain anchoring](./on-chain-anchoring.md) — where the chain-anchored root comes from
- [Private retrieval (onion routing)](./onion-routing.md) — reading without revealing what you read
- [The dig RPC](./dig-rpc.md) — the availability, inventory, and range-fetch methods this layer uses
