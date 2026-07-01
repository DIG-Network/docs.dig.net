---
sidebar_position: 13
title: "L7 · DIG Node peer network"
description: "The normative node↔node protocol: mTLS peer identity (peer_id = SHA-256(TLS SPKI DER)), the two RPC tiers (mTLS-authenticated PEER/CONTROL vs anonymous PUBLIC-READ so browsers can retrieve content), the ordered NAT-traversal ladder (direct → UPnP → NAT-PMP → PCP → relay-coordinated hole-punch (signalling only) → relayed/TURN transport), the relay's four roles (STUN, introducer, hole-punch signalling, relayed transport), STUN reflexive-address discovery, introducer + gossip peer discovery, PEX peer-exchange (node↔node stream + the RLY-008 relay introducer binding), the Kademlia DHT with provider records that locate which peers hold content (find_node/find_providers/add_provider/ping over a framed dig-nat mTLS stream; content-key = SHA-256(domain-tag ‖ store_id[‖root[‖retrieval_key]])), the relay RelayMessage wire (RLY-001..RLY-008), the peer RPC methods (dig.getPeers/dig.announce/dig.getNetworkInfo/dig.getAvailability/dig.listInventory/dig.fetchRange), and the relay-last-fallback invariant (prefer hole-punch signalling over full relaying)."
keywords:
  - peer network
  - peer_id
  - mTLS
  - dual transport
  - public read tier
  - CORS
  - NAT traversal
  - STUN
  - hole punching
  - relay
  - introducer
  - PEX
  - peer exchange
  - dig.getPeers
  - DHT
  - Kademlia
  - provider record
  - content discovery
tags:
  - dig-node
  - relay
  - dig-rpc
  - chia-protocol
---

# Layer 7 · The DIG Node peer network

> **Canonical references:** `dig-gossip` (the peer transport, discovery, and gossip layer — TLS-WebSocket peers, `peer_id = SHA-256(TLS SPKI DER)`, address manager, introducer + peer-exchange), `dig-relay` (the rendezvous / hole-punch coordinator / circuit relay serving the `RelayMessage` wire), `dig-nat` (the `connect(peer)` NAT-traversal ladder), `dig-dht` (the Kademlia DHT with provider records that locate which peers hold content), and `dig-constants` (`DIG_RELAY_URL`). This layer is how DIG Nodes find and reach each other; the [dig RPC](./dig-rpc.md) is what they speak once connected.

This is the **normative anchor** for DIG Node ↔ Node communication. Every peer-facing crate — `dig-nat`, `dig-relay`, `dig-gossip`, `dig-dht`, and `dig-node` — conforms to the contracts below. Where a statement is a wire contract it is fixed at the field/byte level; a conforming reimplementation must reproduce it exactly.

## The thesis: authenticated peers, direct when possible, relay only as a last resort

- **Every peer link is mutually authenticated.** All node↔node traffic runs over mutual-TLS (mTLS). A peer's identity is the hash of its TLS public key; there is no unauthenticated peer channel.
- **Direct paths are preferred.** A node tries, in a fixed order, to open a direct connection (already reachable → UPnP → NAT-PMP → PCP → relay-coordinated hole-punch) before it ever relays. When any direct path succeeds, no relay is used.
- **The relay is the last resort, never the trust anchor.** `relay.dig.net` bridges bytes only when every direct strategy fails. It forwards opaque, end-to-end-authenticated payloads by peer id and can read none of them.

### The relay has four distinct roles

`relay.dig.net` is not a single service — it fills **four separate roles**, three of which are low-bandwidth signalling. Keeping them distinct matters because only the fourth carries a peer's data stream:

| # | Role | Bandwidth | What the relay does | Where |
|---|---|---|---|---|
| 1 | **STUN server** | tiny | Answers a Binding request so a node learns its public reflexive `IP:port` (RFC 5389). | [§3](#stun) |
| 2 | **Introducer** | small | Registers a node's presence and returns known-peer lists for rendezvous/discovery. | [§4a](#discovery) |
| 3 | **Hole-punch signalling** | small | Brokers a hole punch between two NAT'd peers — relays their candidate-address exchange and coordinates the simultaneous-open timing — after which the peers connect **directly**. The relay carries **only the coordination messages, never the data**. | [§5](#hole-punch) |
| 4 | **Relayed (TURN-like) transport** | full | Proxies **all** of a peer connection's data when no direct path exists. High-bandwidth, **last resort only**. | [§6](#relayed) |

Roles 1–3 are how the relay *helps two peers connect directly*; role 4 is the only one where the peer's stream flows through the relay. A node always prefers role 3 (broker a direct link) over role 4 (proxy the whole stream), because role 3 costs the relay almost nothing while role 4 consumes real bandwidth. Whatever the tier, once connected the link is mTLS with `peer_id = SHA-256(SPKI)` ([§1](#peer-identity)) — the relay is never the trust anchor.

## 0 · The two RPC tiers — mTLS peer/control vs anonymous public read {#dual-transport}

A DIG Node's RPC is served on **two distinct tiers with two distinct authentication models**, because two different callers need it: **other nodes** (which present a client certificate) and **browsers/agents** (which cannot present a client certificate but must still be able to READ content). One `dig-node` process serves both; the tier a method lives on is a **frozen contract** every serve-layer and every RPC client conforms to.

| | **PEER / CONTROL tier** | **PUBLIC READ tier** |
|---|---|---|
| **Purpose** | node↔node: discovery, DHT, PEX, availability-for-sync, PUSH/WRITE, config/control | browser/agent **content retrieval only** |
| **Auth** | **mutual TLS** — client cert REQUIRED; `peer_id = SHA-256(TLS SPKI DER)` ([§1](#peer-identity)); write routes additionally per-request BLS-signed ([§21.9](./transport-and-push.md#per-request-auth)) | **none** — anonymous, no client cert, no bearer for reads |
| **Transport** | dig-nat mTLS mux (peer RPC + DHT + PEX streams) on the P2P port `DIG_PEER_PORT` (default **9444**); the §21 authenticated HTTPS write routes | plain **HTTPS** JSON-RPC, **CORS-enabled**, on the public read listener (network-wide: `rpc.dig.net`) |
| **Browser-reachable** | **No** — an anonymous caller cannot open it | **Yes** — this is the browser/agent read path |
| **Mutation / identity** | write, peer, config, control all live here | **read-only** — no mutation, no peer/config method reachable |
| **Integrity trust** | mTLS peer identity | **client-side self-verification** (merkle inclusion proof + chain-anchored root pin) — the server is untrusted ([Verification & provenance](./verification-and-provenance.md)) |
| **Miss behavior** | method-specific error | **decoy-on-miss, never 404** ([blind host](./blind-host-model.md)) |

### The boundary invariant

**Two rules, jointly, are the contract:**

1. **No peer / write / config / control method is reachable without mTLS.** Every method that mutates state, exchanges peer information, moves the DHT/PEX, or reconfigures the node is served **only** on the mTLS peer/control tier. On the anonymous public-read listener these methods **do not exist** — an anonymous caller that names one receives [`-32601`](./dig-rpc.md#error-model) (method not found), the same as any unimplemented method. A node MUST NOT honor a write/peer/control method on a connection that did not complete the mTLS handshake.
2. **Content read requires no mTLS.** The read methods — `dig.getContent` and the read side of `dig.getProof` / `dig.getCapsule` / `dig.getManifest` / `dig.getMetadata`, plus the §21 GET routes (`content` / `proof` / `roots` / `descriptor`) — are served anonymously so a browser works. They are **read-only**: they never mutate, never reveal peer/config state, and never accept a write.

Which tier every method sits on is enumerated in [§7a](#tier-map).

### Why this is secure

Splitting authentication by tier does **not** weaken the network, because the public tier is **read-only and client-verified**:

- **The read server is already untrusted.** Every read is verified client-side against the CHIP-0035 chain-anchored root ([`dig.getContent` streaming contract](./dig-rpc.md#streaming)) — a merkle inclusion proof under the on-chain root plus per-chunk AES-256-GCM-SIV authentication. A malicious or anonymous read server can only serve bytes that either verify (correct content) or fail the proof/tag (detected, discarded). Anonymity of the *reader* changes nothing: the content is public ciphertext, keyed by `retrieval_key = SHA-256(URN)`, and the AES key is derived client-side and never sent. There is nothing to authenticate a reader *for*.
- **A miss is indistinguishable.** A content miss returns a deterministic [decoy](./blind-host-model.md), byte-shaped like a hit, never a 404 — so anonymous access leaks no presence/absence oracle.
- **Everything that could harm the network stays mTLS-gated.** Advancing a root (PUSH/WRITE), announcing a provider record, injecting peers, or reconfiguring the node all require the client certificate (and, for writes, a per-request BLS signature). An attacker with no certificate can *read public ciphertext* and nothing more — exactly the capability a browser needs and no more.
- **The two never blur.** Because the anonymous listener simply does not implement the peer/write/control methods, there is no "forgot to check auth" path: an unauthenticated write is not a rejected request, it is a nonexistent method.

### How one process serves both

A `dig-node` runs **two listeners**:

- **The mTLS peer/control listener** binds the P2P port (`DIG_PEER_PORT`, default **9444**) with rustls `CERT_REQUIRED`; it carries the dig-nat mux (peer RPC, DHT, PEX). The §21 authenticated write/push routes ([transport & push](./transport-and-push.md)) are the control tier's HTTPS face (per-request BLS auth, [middleware order auth-THEN-rate-limit](./transport-and-push.md#the-rest-surface-under-storesid)).
- **The public read listener** serves the anonymous JSON-RPC read subset over plain HTTPS with `Access-Control-Allow-Origin: *`, no credentials, `OPTIONS` → 204. On the public network this listener is `rpc.dig.net`. A dig-node run purely for a local consumer keeps this listener on loopback (`127.0.0.1`, default read port **9778**); a node that wants to serve the wider network exposes the read listener on its public interface (TLS-fronted, as `rpc.dig.net` is).

The **recommended endpoint split** (design-first call): the public read tier is the **same JSON-RPC endpoint shape** as the network profile — one `POST` endpoint speaking JSON-RPC 2.0 — but the anonymous serve layer answers **only the read subset**; the peer/write/control methods return `-32601` there. This reuses the existing [node-profile / `dig.methods` gating](./dig-rpc.md#node-profile) (an agent already gates on `dig.methods` rather than assuming one uniform surface) instead of inventing a parallel protocol, and it is exactly what a browser already speaks to `rpc.dig.net`. The peer/control tier is **not** a JSON-RPC-over-HTTPS surface at all — it is the dig-nat mTLS mux — so it cannot be reached by an anonymous HTTP client even by accident.

:::note `rpc.dig.net` IS the public read tier
Today `rpc.dig.net` ([the dig RPC network profile](./dig-rpc.md)) is exactly this anonymous, CORS-enabled, decoy-on-miss, client-verified public read tier. This section names the tier the browser has always used and states the invariant that keeps the peer/write/control surface off it.
:::

### Browser specifics — fetch + verify without mTLS

A browser (or an agent with no client certificate) reads content like this, needing no mTLS at any step:

1. **CORS.** The public read listener answers a cross-origin `POST` with `Access-Control-Allow-Origin: *` and **no credentials** (`Access-Control-Allow-Credentials` is never set — the content is public ciphertext, there is nothing to send credentials for), and answers the `OPTIONS` preflight with `204`. So a page on any origin can `fetch()` the read endpoint directly.
2. **Read.** `POST` JSON-RPC `dig.getContent` (windowed by `offset`/`length`) to the public read endpoint; reassemble the ciphertext by `total_length` ([streaming contract](./dig-rpc.md#streaming)). No client certificate, no bearer token.
3. **Verify — the server is untrusted.** Verify the first window's `inclusion_proof` against the **caller-supplied chain-anchored root** (the CHIP-0035 singleton's current on-chain `metadata.root_hash`, resolved independently of the serving node), then split by `chunk_lens` and AES-256-GCM-SIV-open each chunk with the client-derived key. A wrong/forged byte fails the proof or the authentication tag and is rejected. This is the same read-crypto every DIG read client runs; the anonymity of the transport does not relax it.

Because the read tier is CORS-`*` + anonymous, the exact same fetch works from a web page, a service worker, the extension, the SDK, or a headless agent — none of which can present a client certificate.

## 1 · Peer identity + mTLS {#peer-identity}

A peer is identified by the SHA-256 of the DER-encoded `SubjectPublicKeyInfo` of the certificate it presents in the TLS handshake:

```text
peer_id = SHA-256( SubjectPublicKeyInfo DER )        // 32 bytes
```

- `peer_id` is a **`Bytes32`** — 32 raw bytes, rendered as 64 lower-case hex on any text surface (`dig-gossip` `types/peer.rs`: `pub type PeerId = Bytes32`, `peer_id_from_tls_spki_der`).
- The hashed input is the **full `SubjectPublicKeyInfo` ASN.1 sequence** (algorithm identifier + subject public-key bit string) lifted from the peer's X.509 leaf certificate — **not** the bare public-key bit string. Both sides recover the other's `peer_id` from the certificate exchanged during the handshake, so identity is bound to key material: impersonation requires the private key.

### mTLS is mandatory

**All peer-to-peer connections use mutual TLS over a WebSocket (`wss://`).** This is a hard requirement — plaintext and server-only TLS are never accepted for a peer link.

- **Both endpoints present a certificate.** The dialing peer presents its cert to the listener; the listener presents its cert to the dialer. Each derives the other's `peer_id` from the presented cert.
- **Self-signed node certificates are expected.** Peer identity is verified by the `peer_id` hash, not by a certificate authority — the CA chain is not the trust root here, the key hash is. A node generates its certificate on first run and reuses it thereafter.
- **The listener requires a client certificate** (`CERT_REQUIRED`). A peer that presents no certificate, or whose TLS handshake fails, is dropped — there is no fallback to a weaker transport.
- **After the TLS handshake, peers exchange a `Handshake`** carrying the `network_id` (the network genesis challenge as lower-case hex), the protocol version, the node's declared listen port, and its node type + capabilities. A `network_id` mismatch, or a protocol version below the minimum-compatible floor, ends the connection. The `Handshake` is the Chia-streamable message (big-endian) — this layer speaks the Chia peer protocol, not a bespoke framing.
- **Unauthenticated peer traffic is rejected.** A message received before a completed mTLS handshake + `Handshake` exchange is not processed.

:::note The relay link is authenticated differently
A node's link *to the relay* is a standard server-authenticated `wss://` connection (the relay presents a TLS certificate; the node does not present one to the relay). Peer↔peer identity is never delegated to the relay — end-to-end payloads carried over the relay remain authenticated by the peer protocol itself, so a relay cannot forge a peer.
:::

### Identity rotation

A node MAY rotate its network identity (regenerate its certificate, hence its `peer_id`) on an interval to reduce long-term linkability. Rotation is a network-layer concern only — it is independent of any consensus/validator identity and does not disturb address-book entries, which are keyed by `IP:port`, not by `peer_id`.

## 2 · Connection establishment — the NAT-traversal ladder {#nat-traversal}

A node reaches a peer through a single abstract operation — `connect(peer)` — which attempts the strategies below **in order** and returns the first that yields a working, mTLS-authenticated link. This ordered ladder is the contract `dig-nat` implements; every strategy above "relayed" produces a **direct** peer link (no relay in the data path).

| # | Strategy | What it is | Relay's role | Result |
|---|---|---|---|---|
| a | **DIRECT** | The peer is already reachable — publicly routable, or a port is forwarded to it. Dial its advertised address. | none | Direct link |
| b | **UPnP / IGD** | Ask the local gateway (Internet Gateway Device) to map an external port to the node via UPnP, then advertise the mapped address. | none | Direct link |
| c | **NAT-PMP** | Request a port mapping from the gateway via NAT Port Mapping Protocol. | none | Direct link |
| d | **PCP** | Request a mapping via the Port Control Protocol (RFC 6887), NAT-PMP's successor. | none | Direct link |
| e | **RELAY-COORDINATED HOLE PUNCH** | Neither peer is directly reachable: the relay **signals only** — it relays the candidate-address exchange and coordinates a **simultaneous open** so both sides punch through their NATs. The data stream then flows **peer-to-peer** (see [§5](#hole-punch)). | **signalling only** (low bandwidth) | Direct link |
| f | **RELAYED / TURN transport** | Every direct strategy failed: the relay proxies **all** of the connection's data as an untrusted bridge (see [§6](#relayed)). | **carries the data** (high bandwidth) | Relayed link |

Rules:

- **Attempt in order; stop at the first success.** A node does not skip ahead to the relay while an earlier, cheaper strategy can still yield a direct path.
- **Prefer hole-punch signalling (e) over full relaying (f).** Both involve the relay, but they are not the same tier: in (e) the relay only *brokers the introduction* and the stream goes peer-to-peer, whereas in (f) the relay *carries every byte*. A node falls to (f) **only** when the hole punch of (e) fails — this saves relay bandwidth, since a brokered direct link costs the relay almost nothing. A successful (e) is a **direct** link (strategy result "Direct"), authenticated by the same mTLS `peer_id` as every other tier.
- **Strategies (b)–(d) run once at startup / on address change**, not per connection: they establish inbound reachability so future dials land as (a) DIRECT for peers dialing *this* node. A node that obtains a stable external mapping via UPnP/NAT-PMP/PCP advertises it as a candidate address so peers dial it directly.
- **Candidate addresses.** A node advertises the set of addresses at which it may be reachable — its configured/observed listen address, any UPnP/NAT-PMP/PCP-mapped external address, and its STUN-derived reflexive address ([§3](#stun)). Peers dial candidates in most-direct-first order.
- **Reflexive discovery precedes hole-punch.** Before requesting a hole-punch a node learns its public reflexive `IP:port` via STUN ([§3](#stun)) and supplies it as the `external_addr` in the coordination exchange.

## 3 · STUN — reflexive address discovery {#stun}

`relay.dig.net` also serves as a **STUN server** (RFC 5389 Binding request/response) so a node behind NAT learns the public `IP:port` its traffic appears to originate from — its **reflexive address**.

- **Endpoint.** The STUN Binding service is co-located with the relay at `relay.dig.net`, served on the standard STUN port `3478` (RFC 5389). A node sends a STUN Binding request and reads its reflexive transport address from the `XOR-MAPPED-ADDRESS` attribute of the Binding success response. A node derives the STUN host from its configured relay endpoint (`DIG_RELAY_URL`), so pointing a node at a private relay also points its STUN at that host.
- **Feeds candidate advertisement.** The reflexive address discovered here is added to the node's candidate-address set ([§2](#nat-traversal)) and supplied as the `external_addr` in a hole-punch request ([§5](#hole-punch)). It is how a NAT'd node tells a peer where to punch to.
- **Advisory, not authenticated.** A reflexive address is a hint used to *attempt* a direct path; a peer link is trusted only after the mTLS handshake over it succeeds ([§1](#peer-identity)). STUN never grants trust — it only tells a node where it appears to live.

## 4 · Peer discovery — introducer + gossip {#discovery}

A node fills its address book from two complementary sources. Both yield candidate peers to dial; neither is a trust anchor (every dialed peer is authenticated by mTLS).

### 4a · Introducer (via the relay)

`relay.dig.net` acts as an **introducer**: nodes connected to the same relay can enumerate each other, and a node can register itself so others discover it. This uses the relay `RelayMessage` wire ([§6](#relayed)):

- **Ask for peers.** Send `get_peers` (optionally scoped to a `network_id`); the relay replies with `peers`, a list of `RelayPeerInfo` (each: `peer_id`, `network_id`, `protocol_version`, `connected_at`, `last_seen`).
- **Register presence.** A node that holds a relay reservation (`register`, [§6](#relayed)) is itself returned to other nodes' `get_peers` — registration *is* the introducer advertisement.
- **Live notifications.** While registered, a node receives `peer_connected` / `peer_disconnected` for same-network peers, so its view stays fresh without polling.

A node MAY additionally use a **dedicated introducer** over the peer protocol (`RequestPeersIntroducer` → `RespondPeersIntroducer`, a `peer_list` of `TimestampedPeerInfo{host, port, timestamp}`), and register with it via `register_peer{ip, port, node_type}` → `register_ack{success}`.

### 4b · Gossip peer-exchange (node ↔ node)

Nodes also ask **each other** for peers, so discovery does not depend on any single rendezvous. Over an established peer link a node exchanges:

- **`RequestPeers`** (no fields) → **`RespondPeers`** carrying a `peer_list` of `TimestampedPeerInfo{host, port, timestamp}` (Chia-streamable, big-endian). Received lists are bounded (per-response and lifetime caps) and merged into the address book.

The **[peer RPC methods](#peer-rpc)** in [§7](#peer-rpc) expose this same peer-exchange over the node's JSON-RPC surface, so an agent or a non-gossip client can drive discovery through the documented [node profile](./dig-rpc.md#node-profile). The continuous, incremental, first-hand peer gossip that keeps address books fresh is **[PEX](#pex)** ([§4d](#pex)) — it generalizes this snapshot exchange with an anti-flood, delta-based model over both an mTLS mux stream and the relay ([RLY-008](#relayed)).

### 4c · Content discovery — the DHT {#dht}

§4a and §4b find **peers**; the DHT finds **which peers hold a specific piece of content**. It is a Kademlia distributed hash table whose **provider records** map a content key to the `peer_id`s that hold that content. A node consults the DHT to **locate holders before it fetches**: it looks up the content, gets back the holders' `peer_id`s and candidate addresses, then confirms and fetches from them with [`dig.getAvailability`](#availability) + [`dig.fetchRange`](#range). **The DHT locates peers; the [NAT ladder](#nat-traversal) reaches them and the [peer RPC](#range) moves the bytes.**

Every node both **serves the DHT** (holds a slice of the routing table and of the global provider records, and answers lookups) and **advertises its own held inventory** as provider records, so content is findable without any central index.

#### The keyspace — one 256-bit XOR metric for nodes and content

Kademlia places nodes and content in a **single 256-bit keyspace** and measures closeness by **XOR distance** (Maymounkov & Mazières). DIG maps into it as follows — a frozen contract every implementation reproduces:

- **A node's key IS its `peer_id`.** `peer_id = SHA-256(TLS SubjectPublicKeyInfo DER)` ([§1](#peer-identity)) is already a uniform 256-bit value, so the DHT node id and the peer id are one and the same.
- **A content key is `SHA-256(domain-tag ‖ canonical bytes)`** over a fixed, domain-separated byte encoding. The one-byte domain tag makes the three granularities distinct points even when they share a `store_id`, so a store-level record and a resource-level record never collide:

  | Content | Tag | Canonical bytes hashed | Answers |
  |---|---|---|---|
  | **store** | `0x01` | `store_id` (32 B) | does a peer serve this store? |
  | **root / capsule** | `0x02` | `store_id ‖ root` (64 B) | does a peer have this generation `store_id:root`? |
  | **resource** | `0x03` | `store_id ‖ root ‖ retrieval_key` (96 B) | does a peer have this resource in the capsule? |

  All hashes are the raw 32-byte forms in the fixed field order shown; the leading tag byte is part of the frozen key derivation and is never renumbered. These granularities match the [`dig.getAvailability`](#availability) has_store / has_root / has_resource shapes, so a lookup and an availability check speak of the same content.
- **Distance is XOR.** `d(a, b) = a XOR b`, compared big-endian (smaller = closer). A key's **routing-table bucket index** is `255 − leading_zeros(distance)` — the position of the most-significant set bit, i.e. the length of the shared prefix with this node's id. This gives 256 k-buckets, least-recently-seen ordered with the standard ping-and-replace eviction (long-lived nodes resist eviction). One iterative lookup engine (α-parallel, converging on the `k` closest peers) serves both `find_node` and `find_providers`.

#### The DHT RPC — a distinct framed wire {#dht-wire}

The DHT RPC is **not** a `dig.*` JSON-RPC 2.0 method. It rides an **authenticated dig-nat mTLS stream** ([§1](#peer-identity)): each RPC opens a logical stream and writes a **`u32` big-endian length prefix + a `type`-tagged JSON body** — **byte-identical framing to the dig-nat / relay control messages** ([§6](#relayed)), so a node speaks one framing across the whole peer network. The framed body is bounded (a length prefix over the cap is rejected, never allocated). There are exactly **four methods**:

| Method | Request | Response |
|---|---|---|
| **`find_node`** | `{ "type":"find_node", "target":"<64hex>" }` | `{ "type":"nodes", "nodes":[Contact] }` — the `k` peers the responder knows closest to `target` |
| **`find_providers`** | `{ "type":"find_providers", "content_key":"<64hex>" }` | `{ "type":"providers", "providers":[ProviderRecord], "closer":[Contact] }` — providers held locally **plus** the `k` closer peers |
| **`add_provider`** | `{ "type":"add_provider", "record":ProviderRecord }` | `{ "type":"add_provider_ok" }` — the record was accepted + stored |
| **`ping`** | `{ "type":"ping", "nonce":<uint> }` | `{ "type":"pong", "nonce":<uint> }` — liveness; the responder echoes the nonce |

A responder that cannot answer returns the error envelope `{ "type":"error", "code":<uint>, "message":<str> }` — **advisory**: a lookup treats it like an unreachable peer and walks on. `find_providers` **always** returns `closer` contacts (even when providers are already found), because more providers may live nearer the key — this is what lets an iterative lookup keep converging.

The two wire shapes:

```text
Contact        = { "peer_id":"<64hex>",
                   "addresses":[ { "host":str, "port":uint,
                                   "kind":"direct"|"mapped"|"reflexive"|"relay" } ] }

ProviderRecord = { "content_key":"<64hex>",
                   "provider_peer_id":"<64hex>",
                   "addresses":[ { "host":str, "port":uint, "kind":… } ],
                   "expires_at":<unix-seconds> }
```

The `addresses[]` shape (and the `kind` tokens `direct`/`mapped`/`reflexive`/`relay`, most-direct-first) is **byte-compatible with the L7 [`dig.getPeers`](#peer-rpc) addresses** ([§7](#peer-rpc)), so a returned `Contact` or `ProviderRecord` drops straight into a dial target for the [NAT ladder](#nat-traversal). `content_key` is the 64-hex content key derived above; `provider_peer_id` is the holder's `peer_id`.

#### Provider-record lifecycle — soft state, TTL'd + republished

A provider record is **soft state**, not a permanent entry, so an offline holder ages out automatically. These rules are normative:

- **Announce on hold.** When a node gains content it serves, it PUTs a `ProviderRecord` (via `add_provider`) at the `k` nodes closest to that content key — binding the content key to its own `peer_id` and candidate addresses.
- **Absolute expiry.** `expires_at` is set to `now + TTL` in absolute Unix seconds. A record at or after its `expires_at` is treated as **absent**.
- **Republish before expiry.** The holder re-announces (a fresh record with a new `expires_at`) on an interval strictly shorter than the TTL, so its records never expire while it is online.
- **Withdraw on removal.** A node that no longer holds content stops announcing it; the record then ages out on its TTL (no explicit delete is required).
- **GC drops the expired.** A responder discards expired records on read and does not return them.
- **Inbound RPC populates the routing table bidirectionally.** On **every** inbound DHT RPC, the responder folds the **mTLS-verified caller** (its `Contact`) into its own routing table — every request is evidence the caller is alive, so a node that queries you teaches you about itself. The caller identity MUST come from the authenticated transport, never from a field the caller sets.

#### How a node uses the DHT

- **On content-want** (a user asks for `store_id`, `store_id:root`, or a specific resource): derive the matching content key, run `find_providers`, then reach each returned provider over the [NAT ladder](#nat-traversal) and fetch via [`dig.getAvailability`](#availability) + [`dig.fetchRange`](#range). The DHT is **step 1 of the [multi-source download](#multi-source)** — it finds the candidate holders the download then fans out across.
- **On inventory-change** (the node gains or loses content it serves): `add_provider` for each new content key, and stop announcing what it no longer holds. Run republish on the configured interval.
- **Bootstrap** the routing table from existing discovery — the gossip peer pool ([§4b](#discovery)) or the relay introducer ([§4a](#discovery)) — then a self-lookup (`find_node` on the node's own id) fills the table. The DHT never hard-depends on a live relay.

### 4d · PEX — peer exchange {#pex}

**PEX (Peer Exchange)** is the continuous, low-overhead peer-discovery gossip that keeps every node's address book fresh: a node advertises the peers it has **first-hand** knowledge of, and receives the same from its links. It is on the [PEER/CONTROL tier](#dual-transport) — it runs **only over authenticated links** (node↔node mTLS, or the node's registered relay connection) — and every received entry is a **hint the receiver independently verifies**, never an authenticated fact: the only proof a peer exists is a completed mTLS handshake with it. PEX generalizes and supersedes the §4b `RequestPeers`/`RespondPeers` snapshot exchange with an incremental, first-hand, anti-flood model. The normative contract is the dig-pex specification (`dig-pex/SPEC.md`); this section pins its wire and its two transport bindings.

#### The four messages

All four are `type`-tagged JSON, sharing the uniform DIG peer-network convention. Unknown fields are ignored on receive.

| Message | Shape | Role |
|---|---|---|
| `pex_handshake` | `{ "type":"pex_handshake", "version":1, "network_id":str, "interval":uint, "flags":[str] }` | First message per direction; declares wire version, network, the sender's minimum data-message spacing, and its capability flags. |
| `pex_snapshot` | `{ "type":"pex_snapshot", "peers":[PeerEntry] }` | The first **data** message per direction — a capped (≤ 200) first-hand known-peer set so a fresh link warms up in one message. Exactly one per direction. |
| `pex_delta` | `{ "type":"pex_delta", "added":[PeerEntry], "dropped":["<64hex>"] }` | The periodic change message relative to what this link was already told (≤ 50 `added`, ≤ 50 `dropped`). Empty deltas are never sent. |
| `pex_error` | `{ "type":"pex_error", "code":uint, "message":str }` | Advisory error envelope, either direction. Named `pex_error` (not `error`) on **both** bindings so it never collides with the relay's RLY `error` code space. |

A `PeerEntry`'s `addresses[]` is **byte-compatible with the [`dig.getPeers`](#peer-rpc) / DHT [`Contact`](#dht-wire) addresses** (`host` / `port` / `kind` ∈ `direct`\|`mapped`\|`reflexive`\|`relay`), so a PEX-learned entry drops straight into a dial target. The identity attributed to a PEX entry's *source* is always the transport identity (mTLS `peer_id` or the registered relay identity) — never a wire field. The `pex_error` code space: `1` `PEX_BAD_MESSAGE`, `2` `PEX_UNSUPPORTED_VERSION`, `3` `PEX_RATE_VIOLATION`, `4` `PEX_OVERSIZED`, `5` `PEX_NETWORK_MISMATCH`, `6` `PEX_PROTOCOL_VIOLATION` (distinct from the relay's `error` codes `1..4`).

#### Two transport bindings

- **Node ↔ Node — a dig-nat mux stream.** PEX rides one self-identifying logical stream per advertising direction on the established dig-nat mTLS session, framed `u32`-BE length prefix + JSON body (byte-identical to the [DHT wire](#dht-wire)), bounded by `PEX_MAX_FRAME` = 262144 (256 KiB) — a length prefix over the cap is rejected before allocation. The stream's identity is the connection's mTLS `peer_id`.
- **Relay → Node — the RLY-008 binding.** PEX rides the relay [`RelayMessage` WebSocket](#relayed) as additive bare-JSON text frames (no length prefix — the WebSocket delimits messages; the same 256 KiB payload bound applies). The relay is the **introducer**: after `register`/`register_ack` (RLY-001), a PEX-capable node sends its `pex_handshake`; the relay then sends its own handshake, a `pex_snapshot` of its registered same-network peers, and periodic `pex_delta`s as registrations come and go. The relay's entries carry `via: "introducer"`, the registrant's observed public address (`kind: "reflexive"`) when known, and a `relay-only` flag when the relay knows no direct path — **registration IS the relay's first-hand evidence**. The relay is **introducer-only**: it MUST NOT fold node-sent PEX entries into its registry (a PEX hint must never impersonate a registration), and a `pex_handshake` from an unregistered connection is answered with the relay's `error` code `1` (`NOT_REGISTERED`). All relay PEX is scoped to the node's registered `network_id`.

#### Why PEX is safe on both tiers

PEX only runs over already-authenticated links, and its entries are hints, so a malicious source can at worst *suggest* peers — never inject a trusted or reachable one (the receiver only trusts a peer after its own mTLS handshake). A first-hand rule (a node advertises only peers it directly knows, `via` ∈ `direct`\|`relay`\|`introducer`) stops re-gossip amplification; per-source attribution + a strike-based mute (3 violations → mute the direction) bound a chatty or lying source; every inbound frame is size- and rate-capped before allocation. This is why PEX sits comfortably on the mTLS peer/control tier: the relay link is server-authenticated `wss://`, but a node treats even the relay's introductions as hints it verifies before trusting.

## 5 · Relay-coordinated hole-punching (signalling only) {#hole-punch}

This is the relay's **third role** ([above](#the-relay-has-four-distinct-roles)) and a **distinct message flow** from the relayed/TURN data path of [§6](#relayed). When two nodes are both behind NAT, the relay **signals only**: it relays their candidate-address exchange and coordinates a **simultaneous open** — each side learns the other's reflexive address and dials it at the same moment, so both NATs see the outbound connection as solicited and let the peer's packets in. **The relay carries only these small coordination messages; the data stream then flows peer-to-peer.** The resulting link is **direct** (and mTLS, exactly like every other tier).

This is why the ladder prefers strategy (e) over (f): the hole-punch flow is a low-bandwidth *introduction*, not a data proxy. A node falls to full relayed transport ([§6](#relayed)) only after the hole punch fails.

Ordered procedure — the hole-punch signalling wire, aligned to the relay `RelayMessage` hole-punch messages (RLY-007). Both peers already hold a relay reservation ([§6](#relayed)):

```text
1. A and B are each connected to the relay (reservations held).
2. A learns its reflexive IP:port via STUN (§3)  — its candidate to punch to.
3. A → relay:  hole_punch_request     { peer_id: A, target_peer_id: B, external_addr: A_reflexive }
4. relay → B:  hole_punch_coordinate  { peer_id: A, external_addr: A_reflexive }   // candidate carried to B
5. B learns its own reflexive IP:port (§3) and both sides SIMULTANEOUSLY dial:
      A dials B_reflexive,  B dials A_reflexive.                                   // the punch (peer-to-peer)
6. On the first direct link to complete: run the mTLS handshake (§1),
   migrate the data stream to the DIRECT link, and drop the relay path for this pair.
7. If both dials fail: keep any relay data path and retry after the hole-punch backoff.
   A → relay:  hole_punch_result      { peer_id, success }   // informational
```

Only the three `hole_punch_*` messages (steps 3, 4, 7) cross the relay — the candidate-address exchange and the coordinated-punch trigger. The peer's actual traffic (step 5 onward) never touches the relay. `external_addr` is serialized as the canonical `"IP:port"` string. A successful hole-punch is a **direct** connection — it satisfies strategy (e) of the ladder and keeps the data stream off the relay entirely.

## 6 · The relay wire (RelayMessage) + relayed / TURN transport {#relayed}

This section defines the relay's full `RelayMessage` wire, including its **fourth role** ([above](#the-relay-has-four-distinct-roles)): **relayed (TURN-like) transport**, in which the relay proxies **all** of a peer connection's data. This is the **high-bandwidth, last-resort** tier (strategy (f) of the [ladder](#nat-traversal)) — entered only after direct, UPnP/NAT-PMP/PCP, and the hole-punch signalling of [§5](#hole-punch) have all failed. It is a **distinct flow** from the low-bandwidth signalling roles: here the peer's bytes flow through the relay (`relay_message` / `broadcast`), whereas STUN, introducer, and hole-punch carry only control messages.

The relay is a stateless rendezvous / circuit bridge speaking **JSON messages over a secure WebSocket** (`wss://`). The default endpoint is `DIG_RELAY_URL = wss://relay.dig.net:9450` (override with the `DIG_RELAY_URL` environment variable; `off` disables the reservation). It exposes a plaintext health check at `GET /health` on port `9451`.

Every message is a JSON object with a `type` discriminator. The message family is **RLY-001..RLY-007**:

| ID | Message(s) | Direction | Shape |
|---|---|---|---|
| **RLY-001** | `register` | node → relay | `{ "type":"register", "peer_id":str, "network_id":str, "protocol_version":uint }` |
| | `register_ack` | relay → node | `{ "type":"register_ack", "success":bool, "message":str, "connected_peers":uint }` |
| | `unregister` | node → relay | `{ "type":"unregister", "peer_id":str }` |
| **RLY-002** | `relay_message` | node → relay → node | `{ "type":"relay_message", "from":str, "to":str, "payload":[uint], "seq":uint }` |
| **RLY-003** | `broadcast` | node → relay → nodes | `{ "type":"broadcast", "from":str, "payload":[uint], "exclude":[str] }` |
| **RLY-005** | `get_peers` | node → relay | `{ "type":"get_peers", "network_id":str\|null }` |
| | `peers` | relay → node | `{ "type":"peers", "peers":[RelayPeerInfo] }` |
| | `peer_connected` | relay → node | `{ "type":"peer_connected", "peer":RelayPeerInfo }` |
| | `peer_disconnected` | relay → node | `{ "type":"peer_disconnected", "peer_id":str }` |
| **RLY-006** | `ping` / `pong` | either way | `{ "type":"ping", "timestamp":uint }` / `{ "type":"pong", "timestamp":uint }` |
| **RLY-007** | `hole_punch_request` | node → relay | `{ "type":"hole_punch_request", "peer_id":str, "target_peer_id":str, "external_addr":"IP:port" }` |
| | `hole_punch_coordinate` | relay → node | `{ "type":"hole_punch_coordinate", "peer_id":str, "external_addr":"IP:port" }` |
| | `hole_punch_result` | node → relay | `{ "type":"hole_punch_result", "peer_id":str, "success":bool }` |
| **RLY-008** | `pex_handshake` / `pex_snapshot` / `pex_delta` / `pex_error` | either way | The [PEX](#pex) messages, carried as **additive** WebSocket text frames beside RLY-001..RLY-007 (§4d). |
| — | `error` | relay → node | `{ "type":"error", "code":uint, "message":str }` |

where `RelayPeerInfo = { "peer_id":str, "network_id":str, "protocol_version":uint, "connected_at":uint, "last_seen":uint }` (`connected_at`/`last_seen` are unix seconds). `peer_id` fields are the 64-hex rendering of the [`peer_id`](#peer-identity). `payload` is a JSON array of byte values (`0..255`).

**PEX binding (RLY-008).** The relay is also the **PEX introducer**: PEX messages ([§4d](#pex)) ride this same WebSocket as additive top-level frames whose `pex_*` `type` tags do not collide with any RLY-001..RLY-007 tag — so the binding is **purely additive** and no existing RLY message changes shape. A frame is classified by peeking its `"type"` for the `pex_` prefix before the RLY parse. PEX on the relay is gated on the node's `pex_handshake` after `register` (a legacy node sees the wire exactly as before), scoped to the node's registered `network_id`, and the relay's entries are **registration-backed** (`via: "introducer"`) — node-sent PEX data is anti-flood-checked but **never** enters the introducer registry. PEX-level errors use `pex_error` (its own code space, §4d), keeping the relay's `error` envelope's RLY codes distinct. Full contract: [§4d](#pex) and the dig-pex specification (`dig-pex/SPEC.md` §10.2).

**Reservation (RLY-001).** A node opens the WebSocket and sends `register`; the relay records the reservation and replies `register_ack`. The reservation is held for the life of the connection — there is no fixed TTL — but a connection idle past the relay's idle timeout is reaped, so a node sends periodic `ping` (RLY-006) to keep it alive and reconnects on drop.

**Relayed transport (RLY-002 / RLY-003).** `relay_message` forwards `payload` to the single peer `to`; `broadcast` fans out to every same-network peer except `from` and any id in `exclude`. The relay **re-stamps `from` to the sender's registered `peer_id`** (a node cannot spoof another's id) and forwards the `payload` verbatim without inspecting it. Routing is **scoped to the sender's `network_id`** — the relay never bridges across networks. This is the last-resort data path when [strategies (a)–(e)](#nat-traversal) all fail.

**Relay error codes (RLY `error`).**

| `code` | Name | Meaning |
|---|---|---|
| `1` | `NOT_REGISTERED` | A message arrived before the connection completed `register`. |
| `2` | `BAD_MESSAGE` | The frame was not valid relay JSON. |
| `3` | `PEER_NOT_FOUND` | A `relay_message` / hole-punch named a `to` / `target_peer_id` not registered on this network. |
| `4` | `CAPACITY` | The relay is at its connection cap; the registration was refused. |

**Health.** `GET http://<relay>:9451/health` returns `{ "status":"ok", "connected_peers":uint, "uptime_secs":uint, "version":str }` with HTTP `200` while serving — the reachability probe for the relay itself.

## 7a · Tier map — which method is on which tier {#tier-map}

The implementers' contract for the [dual-transport tiers](#dual-transport). The dig-node serve layer and every RPC client build to this: a method's tier is frozen. **Anonymous callers reach only the PUBLIC-READ column; everything in the PEER/CONTROL column returns [`-32601`](./dig-rpc.md#error-model) on the anonymous listener and is served only over the mTLS peer/control transport.**

| Surface / method | Tier | Auth | Transport |
|---|---|---|---|
| `dig.getContent` (read) | **PUBLIC READ** | none (anonymous, CORS-`*`) | plain HTTPS JSON-RPC |
| `dig.getProof` / `dig.getProofStatus` (read) | **PUBLIC READ** | none | plain HTTPS JSON-RPC |
| `dig.getCapsule` (alias `dig.getModule`) (read) | **PUBLIC READ** | none | plain HTTPS JSON-RPC |
| `dig.getManifest` / `dig.getMetadata` / `dig.listCapsules` (read) | **PUBLIC READ** | none | plain HTTPS JSON-RPC |
| `dig.health` / `dig.methods` (discovery) | **PUBLIC READ** | none | plain HTTPS JSON-RPC |
| §21 GET `content` / `proof` / `roots` / `descriptor` | **PUBLIC READ** | none | plain HTTPS REST |
| `dig.getPeers` / `dig.announce` / `dig.getNetworkInfo` | **PEER / CONTROL** | mTLS | dig-nat mTLS |
| `dig.getAvailability` / `dig.listInventory` | **PEER / CONTROL** | mTLS | dig-nat mTLS |
| `dig.fetchRange` (peer sync / multi-source) | **PEER / CONTROL** | mTLS | dig-nat mTLS |
| DHT `find_node` / `find_providers` / `add_provider` / `ping` ([§4c](#dht)) | **PEER / CONTROL** | mTLS | dig-nat mTLS stream |
| PEX `pex_handshake` / `pex_snapshot` / `pex_delta` / `pex_error` ([§4d](#pex)) | **PEER / CONTROL** | mTLS (node↔node) or registered relay identity (RLY-008) | dig-nat mTLS stream / relay WebSocket |
| §21 PUSH / WRITE: `module/upload` · `module` PUT · `module/complete` · `tombstone` | **PEER / CONTROL** | mTLS + per-request BLS ([§21.9](./transport-and-push.md#per-request-auth)) | authenticated HTTPS |
| node config / control (`cache.*`, `control.*`, `dig.stage`, `dig.getAnchoredRoot`) | **CONTROL (loopback)** | local authorization (loopback-only) | local FFI / loopback HTTP |

Notes:

- **`dig.getAvailability` / `dig.fetchRange` are PEER/CONTROL**, not public read: they are the node↔node **sync/multi-source** surface, ridden over the mTLS mux. The browser/agent public read path is the [dig RPC](./dig-rpc.md) (`dig.getContent` et al.) — a browser does not fan byte-ranges across peers; that is a node-side operation ([multi-source download](#multi-source)).
- **`dig.getAnchoredRoot` and `cache.*` are local control** (loopback / in-process FFI, [node profile](./dig-rpc.md#node-profile)), not exposed on the public read listener. A browser resolves the anchored root from its own chain source, not from the serving node.
- **The read subset is identical in shape to the [network profile](./dig-rpc.md)** — this is why one JSON-RPC endpoint serves both a browser and the local consumer; only the *set of methods the anonymous listener answers* differs.

## 7 · Peer RPC methods (node profile) {#peer-rpc}

The [node profile](./dig-rpc.md#node-profile) of the dig RPC exposes the peer network over JSON-RPC 2.0, so an agent can inspect and drive discovery without speaking the binary peer protocol. These are **additive** to the existing node methods; they appear in the node's `dig.methods` catalogue and in [`openrpc-node.json`](https://docs.dig.net/openrpc-node.json). All are **node-profile only** (absent from the network profile) and, like every dig RPC method, are `POST` JSON-RPC 2.0 with by-name params.

### `dig.getPeers`

Return the peers this node currently knows, each with its `peer_id` and candidate addresses — the peer-exchange of [§4b](#discovery) over RPC.

- **params:** `{ "network_id"?: str, "limit"?: uint }` — optional network filter; `limit` caps the returned list.
- **result:**

```json
{
  "peers": [
    {
      "peer_id": "<64hex>",
      "addresses": [ { "host": "203.0.113.7", "port": 9444, "kind": "direct" } ],
      "network_id": "DIG_MAINNET",
      "last_seen": 1719763200,
      "via": "direct"
    }
  ]
}
```

Each `addresses[]` entry is a **candidate address**: `{ host: str, port: uint, kind: "direct"|"reflexive"|"mapped"|"relay" }` where `kind` records how the address was learned (advertised/observed direct, STUN reflexive, UPnP/NAT-PMP/PCP mapped, or relay-reachable). `via` is how this node currently reaches the peer (`"direct"` or `"relay"`).

### `dig.announce`

Advertise this node (its `peer_id` + candidate addresses) to a target peer, and offer to establish or upgrade a connection — the RPC face of the introducer/announce path in [§4](#discovery).

- **params:**

```json
{
  "peer_id": "<64hex>",
  "addresses": [ { "host": "198.51.100.4", "port": 9444, "kind": "mapped" } ],
  "network_id": "DIG_MAINNET",
  "target"?: "<64hex>"
}
```

`peer_id` + `addresses` describe the announcing node; the optional `target` is a specific peer to announce to (omit to announce to the relay/introducer as a general registration).

- **result:** `{ "accepted": bool, "known_peers": uint }` — whether the announcement was accepted and the resulting size of the recipient's peer view.

### `dig.getNetworkInfo`

Report this node's own network posture — its identity, reachability, candidate addresses, and relay-reservation state. This is the self-describe surface for discovery and the STUN-derived reflexive address.

- **params:** none.
- **result:**

```json
{
  "peer_id": "<64hex>",
  "network_id": "DIG_MAINNET",
  "listen_addr": "0.0.0.0:9444",
  "reflexive_addr": "203.0.113.1:9444",
  "candidate_addresses": [ { "host": "203.0.113.1", "port": 9444, "kind": "reflexive" } ],
  "reachability": "direct",
  "relay": { "url": "wss://relay.dig.net:9450", "reserved": true, "connected_peers": 42 }
}
```

`reflexive_addr` is the STUN-discovered public address ([§3](#stun)) or `null` if not yet learned; `reachability` is `"direct"` (a direct inbound path exists — publicly reachable or a working UPnP/NAT-PMP/PCP mapping) or `"relayed"` (only reachable through the relay); `relay.reserved` reflects the RLY-001 reservation state.

### Peer RPC error codes

Alongside the standard JSON-RPC codes and the shared `-32004` (resource unavailable), the peer methods add one node-profile code:

| Code | Name | Meaning |
|---|---|---|
| `-32006` | `PEER_UNREACHABLE` | No connection to the named peer could be established — every [traversal strategy](#nat-traversal) (direct, UPnP/NAT-PMP/PCP mapping, relay-coordinated hole-punch, and relayed fallback) failed, or the peer is not registered on this network. |

See the full [error catalog](../support/error-codes.md).

## 8 · Streaming-first content transport {#streaming}

Peer RPC is **streaming-first for data**, not buffer-the-whole-payload. A `connect(peer)` link ([§2](#nat-traversal)) is a **multiplexed stream transport**: it carries many concurrent, independent logical streams over the single mTLS connection, so a node can run several content transfers (and control calls) in parallel without head-of-line blocking between them.

- **Control methods are message-style.** The small methods — `dig.getPeers`, `dig.announce`, `dig.getNetworkInfo` — request and return a single JSON object. They fit one logical message; no streaming needed.
- **Data methods are chunk-streamed.** Any method that returns a large or content-bearing payload (`dig.fetchRange`, [§9](#range)) delivers it as an ordered **stream of chunk frames** on its own logical stream. The caller reads frames incrementally and reassembles — it never has to hold the whole resource in memory to begin using it.
- **Backpressure.** The stream transport applies flow control: a slow reader slows the sender rather than forcing the sender to buffer unboundedly. A caller that stops reading pauses the transfer; a caller that reads faster receives faster.
- **Framing.** Each data frame carries `{ offset, length, bytes, complete }` — the frame's start offset within the requested range, its byte length, the raw ciphertext bytes, and whether it is the final frame. Frames arrive in ascending `offset` order and tile the requested range exactly. A caller reassembles by `offset` and stops on `complete`.
- **Cancellation.** Closing the logical stream cancels just that transfer; the connection and any sibling streams are unaffected.

This mirrors the [dig RPC streaming contract](./dig-rpc.md#streaming) (window/offset/`next_offset` reassembly) but over the peer stream transport rather than repeated JSON-RPC POSTs — the same incremental, verify-as-you-go model.

## 9 · Byte-range content fetch + multi-source download {#range}

A node can request a specific **byte range** `[offset, offset+length)` of a content resource or an entire `.dig` capsule, and receive **only those bytes**, streamed. This is the primitive behind **multi-source download**: a client splits a resource into ranges and fetches **different ranges from different peers simultaneously**, verifies each independently, and reassembles — the same multisource + range + integrity + resume model implemented by the `dig-download-utility` reference.

### Availability first — ask before you fetch {#availability}

Before requesting any content, a client asks candidate peers **whether they actually hold it**, so it fans ranges only at peers that can serve them. Availability is a small **control RPC** (message-style, not streamed), and it is **batchable** — a downloader checks several peers × several items in one call each — at all three granularities:

- **store** — does the peer serve this `store_id` at all (and which roots does it hold)?
- **root** — does the peer have this specific generation `(store_id, root)`?
- **capsule / resource** — does the peer have this specific immutable capsule `store_id:root`, or a specific resource within it?

#### `dig.getAvailability`

Ask one peer about many items at once. The granularity of each item is inferred from which fields it carries.

- **params:**

```json
{
  "items": [
    { "store_id": "<64hex>" },
    { "store_id": "<64hex>", "root": "<64hex>" },
    { "store_id": "<64hex>", "root": "<64hex>", "retrieval_key": "<64hex>" }
  ]
}
```

  - `store_id` only → **has_store**: does the peer serve the store.
  - `store_id` + `root` → **has_root**: does the peer have that generation (the capsule `store_id:root`).
  - `store_id` + `root` + `retrieval_key` → **has_resource**: does the peer have that resource within the capsule.

- **result:** one answer per item, positionally aligned with `items`:

```json
{
  "items": [
    { "available": true, "roots": ["<64hex>", "<64hex>"] },
    { "available": true, "chunk_count": 40, "total_length": 10485760, "complete": true },
    { "available": true, "total_length": 262144, "chunk_count": 1, "complete": true }
  ]
}
```

  Per-item fields (present where cheap for the peer to answer):
  - `available` (bool, always) — whether the peer holds the queried item.
  - `roots` (store granularity) — the generation roots the peer currently holds for the store, newest-first.
  - `total_length` + `chunk_count` (root/resource granularity) — the resource/capsule ciphertext length and its chunk count, so the caller can **plan its ranges** without a probe fetch.
  - `complete` (bool) — whether the peer holds the **full** resource/capsule (`true`) or only **part** of it (`false`); a partial holder can still serve the ranges it has.

#### `dig.listInventory`

Enumerate what a peer serves — the discovery variant.

- **params:** `{ "store_id"?: "<64hex>", "limit"?: uint }` — omit `store_id` to list the stores the peer serves; supply it to list the roots the peer holds for that store.
- **result:**

```json
{ "stores": ["<64hex>", "..."] }
```

or, when `store_id` is given:

```json
{ "store_id": "<64hex>", "roots": ["<64hex>", "..."] }
```

Enumeration is best-effort discovery — a peer MAY cap or omit it (privacy / size); `dig.getAvailability` is the authoritative per-item check.

### `dig.fetchRange`

Stream a byte range of a resource or capsule from this peer.

- **params:**

```json
{
  "store_id": "<64hex>",
  "retrieval_key": "<64hex>",
  "root": "<64hex>",
  "capsule": false,
  "offset": 0,
  "length": 4194304
}
```

  - **Resource identity.** For a content resource: `store_id` + `retrieval_key` (+ optional `root`, defaulting to the chain-anchored tip). For a whole capsule / `.dig`: set `capsule: true` and identify it by `store_id` (+ optional `root`); `retrieval_key` is then omitted. The capsule identity is `<store_id>[:<root>]`.
  - **Range.** `offset` (bytes into the resource ciphertext, default `0`) and `length` (bytes to return). `length` is clamped to the node's window (3 MiB); a request whose range is not chunk-aligned is widened to whole-chunk boundaries (see integrity below), so the response may return slightly more than asked.

- **result:** a **stream** ([§8](#streaming)) of `dig.fetchRange` frames. Beyond the base frame fields, the **first frame** (`offset == range start`) carries the verification metadata for the range:

```json
{
  "offset": 0,
  "length": 262144,
  "bytes": "<base64 ciphertext>",
  "complete": false,
  "total_length": 10485760,
  "chunk_lens": [262144, 262144, 131072],
  "chunk_index": 0,
  "inclusion_proof": "<base64 merkle proof>",
  "root": "<64hex>"
}
```

  - `total_length` — the full resource ciphertext length (so a client can plan its ranges).
  - `chunk_lens` — the per-chunk ciphertext lengths of the **whole resource**, in order (first frame only) — identical to the [dig RPC `chunk_lens`](./dig-rpc.md#the-chunk-wire-object). This is how a client maps a byte range to the chunk(s) that cover it.
  - `chunk_index` — the index (into `chunk_lens`) of the first chunk in this frame.
  - `inclusion_proof` — the merkle inclusion proof of the **whole resource** against the capsule's generation `root` (first frame only), relayed verbatim ([Merkle inclusion proofs](./merkle-proofs.md)). For `capsule: true` the capsule self-verifies on install, so `inclusion_proof` is `null` (as with [`dig.getCapsule`](./dig-rpc.md)).

### Per-range integrity — verify a range without the whole file {#range-integrity}

A range fetched from one peer is **independently verifiable** against the capsule's on-chain merkle root, so a single peer cannot forge a range and multi-source pieces always reassemble correctly. Integrity aligns exactly with the [existing digstore content model](./merkle-proofs.md): a resource is a sequence of AES-256-GCM-SIV chunks; the resource commits to the generation merkle root as a single leaf (`resource_leaf = SHA-256(concatenated chunk ciphertexts)`); `chunk_lens` fixes the chunk boundaries.

A requested range maps to whole **chunk(s)** — the node widens the range to chunk boundaries — so each returned chunk is a complete, verifiable unit. A client verifies a fetched range as follows:

1. **Split by `chunk_lens`.** Using the first frame's `chunk_lens` and `chunk_index`, cut the reassembled range bytes into the exact chunk(s) it covers.
2. **Verify the resource against the root.** The `inclusion_proof` proves `resource_leaf` (= `SHA-256` of the *whole* resource ciphertext, reconstructed from all chunks in `chunk_lens` order) is included under the caller-supplied **chain-anchored `root`** ([Verification & provenance](./verification-and-provenance.md)) — the node is never the trust anchor. A client that already holds this proof (from an earlier range/peer) reuses it; the proof is the same regardless of which peer or range served the bytes.
3. **Bind each chunk to the committed resource.** Because `chunk_lens` fixes each chunk's length and the resource leaf is `SHA-256` over the concatenation of all chunk ciphertexts in order, a chunk delivered for a given `chunk_index` is correct iff, when placed at its `chunk_lens` offset, the whole-resource hash still matches the proven `resource_leaf`. A chunk from a **bad source** yields a resource hash that does not match the proof — detected without downloading the whole file.
4. **Decrypt.** AES-256-GCM-SIV-open each verified chunk; a wrong key/salt or corrupted bytes fails the authentication tag ([`DIG_ERR_DECRYPT_TAG`](../support/error-codes.md)).

Detecting a bad source: any of a chunk-length mismatch against `chunk_lens`, a failed whole-resource inclusion proof, or a decryption-tag failure marks the serving peer's range as **invalid** — the client discards it and retries that range from a different peer ([`-32006`](#peer-rpc) / a fresh source), penalizing the bad peer.

### The multi-source download pattern (normative) {#multi-source}

```text
1. DISCOVER  — locate candidate holders in the DHT: find_providers(content_key)
               for the store/root/resource (§4c), backed by the introducer +
               dig.getPeers peer discovery (§4).
2. QUERY     — dig.getAvailability (batch) against the candidates: has_store /
   AVAILABILITY   has_root / has_capsule (§9 availability). Keep only peers that
               actually HOLD the resource; read total_length + chunk_count to plan.
3. PLAN      — partition the resource into chunk-aligned ranges (using chunk_lens
               from the first range frame or the availability chunk_count).
4. FAN OUT   — request DIFFERENT ranges from DIFFERENT holders CONCURRENTLY over the
               multiplexed stream transport (§8), respecting each peer's backpressure.
5. VERIFY    — verify each returned range independently against the chain-anchored
               root (§9 integrity) as it arrives; do not trust unverified bytes.
6. RETRY     — a failed, timed-out, missing, or mismatched range is re-requested from
               ANOTHER holder (ranges are independent); penalize the bad source.
7. REASSEMBLE— place verified ranges by offset into the full resource; decrypt per chunk.
```

Step 2 is the gate: a downloader never fans a range at a peer it has not confirmed holds the content, and a **partial** holder (`complete: false`) is used only for the ranges it actually has.

- **Concurrency across sources** is what makes this fast: N peers each serve a slice of the file in parallel.
- **Resume.** Because each range is independently addressable and independently verifiable, an interrupted download resumes **per range** — a client re-requests only the ranges it has not yet verified, from any peer that holds the resource. No range already verified is refetched.
- **Any source, one root.** Every range — whichever peer served it — is verified against the *same* on-chain generation root, so mixing sources never weakens integrity.

### Range fetch error codes

| Code | Name | Meaning |
|---|---|---|
| `-32004` | `RESOURCE_UNAVAILABLE` | This peer does not hold the resource/capsule at the requested root (try another source). |
| `-32007` | `RANGE_NOT_SATISFIABLE` | The requested `offset`/`length` lies outside the resource (`offset >= total_length`), or the range is otherwise unsatisfiable. |

## 10 · The relay-last-fallback invariant {#invariant}

**A node uses the relay to carry peer↔peer DATA (role 4, TURN-like) ONLY when none of DIRECT, UPnP, NAT-PMP, PCP, or hole-punch succeeds.** Concretely:

- If port-forwarding, UPnP, NAT-PMP, or PCP yields a working direct path — inbound or outbound — **no relay carries the data**. The relay may still fill its low-bandwidth signalling roles (STUN, introducer, hole-punch coordination), but the peer's bytes flow directly.
- **Prefer hole-punch signalling over full relaying.** The relay-coordinated hole punch ([§5](#hole-punch), role 3) and full relayed transport ([§6](#relayed), role 4) are different tiers: a node always attempts the hole punch first because it costs the relay only the coordination messages while the stream goes peer-to-peer. Full relayed transport — where the relay carries every byte — is entered **only** when the hole punch fails. This keeps relay bandwidth minimal: the relay brokers the introduction; the data does not flow through it unless there is no other way.
- A relay reservation held for reachability does **not** mean traffic is relayed: a reserved node whose peer can reach it directly (including via a brokered hole punch) is served over the direct link.
- The relayed/TURN transport ([§6](#relayed)) is entered only after strategies (a)–(e) of the [ladder](#nat-traversal) are exhausted, and a node continues to attempt a [hole-punch upgrade](#hole-punch) so a relayed pair can be promoted to a direct peer-to-peer link when conditions allow, dropping the relay from the data path.

The relay is an **untrusted bridge**: it forwards end-to-end-authenticated payloads by `peer_id` and can read none of them. Trust always rests on the mTLS peer identity ([§1](#peer-identity)), never on the relay.

## 11 · Conformance {#conformance}

The peer network is implemented by several crates that must interoperate byte-for-byte. The frozen shapes a reimplementation MUST match:

| Surface | Frozen shape | What it pins |
|---|---|---|
| **`peer_id`** | `SHA-256(SubjectPublicKeyInfo DER)` → `Bytes32`, 64-hex on text surfaces | the identity every peer derives for every other peer; a mismatch means no interop |
| **mTLS handshake** | `wss://` + client cert required + Chia `Handshake` (hex `network_id`, protocol version, node type) | that a peer link is authenticated and network-scoped before any message is processed |
| **Two RPC tiers** | PEER/CONTROL = mTLS-authenticated (peer/DHT/PEX/availability-for-sync/write/config); PUBLIC-READ = anonymous, CORS-`*`, read-only, client-verified, decoy-on-miss ([§0](#dual-transport), [tier map §7a](#tier-map)). No peer/write/config method reachable without mTLS; content read requires no mTLS | that a browser can retrieve+verify content with no client cert while every mutation/identity/peer surface stays mTLS-gated — the boundary invariant is uniform across every serve layer + client |
| **RelayMessage wire** | the RLY-001..RLY-008 JSON shapes in [§6](#relayed), `type`-tagged, `payload` as a byte array, `from` re-stamped, `network_id`-scoped; RLY-008 = the additive [PEX](#pex) binding | that any relay + any node speak the same rendezvous/hole-punch/relayed/PEX wire |
| **PEX** | the four `pex_*` messages ([§4d](#pex)) with the `dig-pex/SPEC.md` shapes; two bindings — dig-nat mux stream (u32-BE+JSON, `PEX_MAX_FRAME` 262144) and the relay [RLY-008](#relayed) (additive WS frames, introducer-only, registration-backed `via:"introducer"`); entries are hints (first-hand rule, `via` provenance, strike-mute); `addresses[]` byte-compatible with `dig.getPeers`/DHT `Contact` | that peer gossip is anti-flood + first-hand across both transports, entries are verified-before-trusted, and PEX-learned contacts drop straight into a dial target |
| **Relay error codes** | `1..4` (`NOT_REGISTERED`/`BAD_MESSAGE`/`PEER_NOT_FOUND`/`CAPACITY`) | deterministic relay-side failure signalling |
| **Relay roles** | the four roles are distinct: STUN + introducer + hole-punch **signalling** are low-bandwidth control; only relayed/TURN transport carries data | that a node prefers brokering a direct link over proxying the stream |
| **Peer exchange** | `RequestPeers`→`RespondPeers` of `TimestampedPeerInfo{host, port, timestamp}` (Chia-streamable, big-endian) | that nodes discover peers from each other identically |
| **Peer RPC** | `dig.getPeers` / `dig.announce` / `dig.getNetworkInfo` + `-32006`; `dig.getAvailability` / `dig.listInventory`; `dig.fetchRange` + `-32007`, generated into [`openrpc-node.json`](https://docs.dig.net/openrpc-node.json) | the machine surface an agent drives; CI-diffable against a live node |
| **Availability** | `dig.getAvailability` batch per-item answers at store / root / capsule granularity (`available` + `roots`/`total_length`/`chunk_count`/`complete`) | that a downloader can confirm a peer HOLDS content (and plan ranges) before any fetch |
| **Streaming + range** | `dig.fetchRange` streams `RangeFrame{offset,length,bytes,complete}`; first frame carries `total_length` + `chunk_lens` + `chunk_index` + `inclusion_proof`; ranges are chunk-aligned | that data streams (not buffered), and a single-peer range verifies against the chain-anchored root — so multi-source pieces reassemble and can't be forged |
| **Range integrity** | a range maps to whole chunk(s); each verifies via `chunk_lens` + the whole-resource `inclusion_proof` against the on-chain `root` (same as [merkle-proofs](./merkle-proofs.md)) | that any peer's range is independently verifiable + a bad source is detectable without the whole file |
| **NAT ladder** | the ordered strategies DIRECT → UPnP → NAT-PMP → PCP → hole-punch (relay signalling only) → RELAYED/TURN (relay carries data), relay-data-last | that every `connect(peer)` implementation prefers direct, prefers hole-punch signalling over full relaying, and proxies the stream only as a last resort |
| **DHT content key** | `SHA-256(tag ‖ canonical bytes)` with tags `0x01` store (`store_id`), `0x02` root/capsule (`store_id ‖ root`), `0x03` resource (`store_id ‖ root ‖ retrieval_key`); node id = `peer_id`; distance = XOR; bucket = `255 − leading_zeros` ([§4c](#dht)) | that every node derives the identical content key for the same content, and places nodes + content in one 256-bit keyspace, so a provider record announced by one implementation is found by another |
| **DHT RPC wire** | the four `type`-tagged methods `find_node` / `find_providers` / `add_provider` / `ping` (+ the `error` envelope), `u32`-BE length-prefixed JSON over an authenticated dig-nat mTLS stream (same framing as the relay control messages), `find_providers` always returning `closer` ([§4c](#dht-wire)) | that any node's DHT speaks the same locate-the-holders wire; `dig-nat`/`dig-dht`/`dig-node` conform |
| **DHT shapes** | `Contact { peer_id:<64hex>, addresses:[{host,port,kind}] }` and `ProviderRecord { content_key, provider_peer_id, addresses, expires_at }`, `addresses[]` byte-compatible with `dig.getPeers`; provider records are TTL'd (absolute `expires_at`), republished before expiry, GC'd when stale, and every inbound RPC folds the mTLS-verified caller into the routing table | that returned contacts/records drop straight into a dial target and that provider state is soft state that ages out |

A reimplementation of any peer crate conforms iff it reproduces these — the same discipline that keeps the [read path parity-locked](./conformance-and-parity.md).

## Related

- [The dig RPC](./dig-rpc.md) — the PUBLIC READ tier: what a browser/agent reads over anonymous JSON-RPC; the node profile the peer RPC extends
- [§21 transport & push](./transport-and-push.md) — the §21 GET (public read) vs PUSH/WRITE (mTLS peer/control) split
- [BLS signatures & DSTs](./bls-signatures.md) — the node/attestation signatures carried over peer links; the per-request write auth on the control tier
- [Conformance & parity](./conformance-and-parity.md) — the cross-implementation parity discipline
- [Verification & provenance](./verification-and-provenance.md) — why a read server (public tier) is never a trust anchor
- [The blind host model](./blind-host-model.md) — decoy-on-miss on the public read tier
- [Error codes](../support/error-codes.md) — the full catalog incl. the peer `-32006`
