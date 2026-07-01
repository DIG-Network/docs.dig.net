---
sidebar_position: 13
title: "L7 · DIG Node peer network"
description: "The normative node↔node protocol: mTLS peer identity (peer_id = SHA-256(TLS SPKI DER)), the ordered NAT-traversal ladder (direct → UPnP → NAT-PMP → PCP → relay-coordinated hole-punch (signalling only) → relayed/TURN transport), the relay's four roles (STUN, introducer, hole-punch signalling, relayed transport), STUN reflexive-address discovery, introducer + gossip peer discovery, the relay RelayMessage wire (RLY-001..RLY-007), the peer RPC methods (dig.getPeers/dig.announce/dig.getNetworkInfo), and the relay-last-fallback invariant (prefer hole-punch signalling over full relaying)."
keywords:
  - peer network
  - peer_id
  - mTLS
  - NAT traversal
  - STUN
  - hole punching
  - relay
  - introducer
  - dig.getPeers
tags:
  - dig-node
  - relay
  - dig-rpc
  - chia-protocol
---

# Layer 7 · The DIG Node peer network

> **Canonical references:** `dig-gossip` (the peer transport, discovery, and gossip layer — TLS-WebSocket peers, `peer_id = SHA-256(TLS SPKI DER)`, address manager, introducer + peer-exchange), `dig-relay` (the rendezvous / hole-punch coordinator / circuit relay serving the `RelayMessage` wire), `dig-nat` (the `connect(peer)` NAT-traversal ladder), and `dig-constants` (`DIG_RELAY_URL`). This layer is how DIG Nodes find and reach each other; the [dig RPC](./dig-rpc.md) is what they speak once connected.

This is the **normative anchor** for DIG Node ↔ Node communication. Every peer-facing crate — `dig-nat`, `dig-relay`, `dig-gossip`, and `dig-node` — conforms to the contracts below. Where a statement is a wire contract it is fixed at the field/byte level; a conforming reimplementation must reproduce it exactly.

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

The **[peer RPC methods](#peer-rpc)** in [§7](#peer-rpc) expose this same peer-exchange over the node's JSON-RPC surface, so an agent or a non-gossip client can drive discovery through the documented [node profile](./dig-rpc.md#node-profile).

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
| — | `error` | relay → node | `{ "type":"error", "code":uint, "message":str }` |

where `RelayPeerInfo = { "peer_id":str, "network_id":str, "protocol_version":uint, "connected_at":uint, "last_seen":uint }` (`connected_at`/`last_seen` are unix seconds). `peer_id` fields are the 64-hex rendering of the [`peer_id`](#peer-identity). `payload` is a JSON array of byte values (`0..255`).

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
1. DISCOVER  — find candidate peers via the introducer + dig.getPeers (§4).
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
| **RelayMessage wire** | the RLY-001..RLY-007 JSON shapes in [§6](#relayed), `type`-tagged, `payload` as a byte array, `from` re-stamped, `network_id`-scoped | that any relay + any node speak the same rendezvous/hole-punch/relayed wire |
| **Relay error codes** | `1..4` (`NOT_REGISTERED`/`BAD_MESSAGE`/`PEER_NOT_FOUND`/`CAPACITY`) | deterministic relay-side failure signalling |
| **Relay roles** | the four roles are distinct: STUN + introducer + hole-punch **signalling** are low-bandwidth control; only relayed/TURN transport carries data | that a node prefers brokering a direct link over proxying the stream |
| **Peer exchange** | `RequestPeers`→`RespondPeers` of `TimestampedPeerInfo{host, port, timestamp}` (Chia-streamable, big-endian) | that nodes discover peers from each other identically |
| **Peer RPC** | `dig.getPeers` / `dig.announce` / `dig.getNetworkInfo` + `-32006`; `dig.getAvailability` / `dig.listInventory`; `dig.fetchRange` + `-32007`, generated into [`openrpc-node.json`](https://docs.dig.net/openrpc-node.json) | the machine surface an agent drives; CI-diffable against a live node |
| **Availability** | `dig.getAvailability` batch per-item answers at store / root / capsule granularity (`available` + `roots`/`total_length`/`chunk_count`/`complete`) | that a downloader can confirm a peer HOLDS content (and plan ranges) before any fetch |
| **Streaming + range** | `dig.fetchRange` streams `RangeFrame{offset,length,bytes,complete}`; first frame carries `total_length` + `chunk_lens` + `chunk_index` + `inclusion_proof`; ranges are chunk-aligned | that data streams (not buffered), and a single-peer range verifies against the chain-anchored root — so multi-source pieces reassemble and can't be forged |
| **Range integrity** | a range maps to whole chunk(s); each verifies via `chunk_lens` + the whole-resource `inclusion_proof` against the on-chain `root` (same as [merkle-proofs](./merkle-proofs.md)) | that any peer's range is independently verifiable + a bad source is detectable without the whole file |
| **NAT ladder** | the ordered strategies DIRECT → UPnP → NAT-PMP → PCP → hole-punch (relay signalling only) → RELAYED/TURN (relay carries data), relay-data-last | that every `connect(peer)` implementation prefers direct, prefers hole-punch signalling over full relaying, and proxies the stream only as a last resort |

A reimplementation of any peer crate conforms iff it reproduces these — the same discipline that keeps the [read path parity-locked](./conformance-and-parity.md).

## Related

- [The dig RPC](./dig-rpc.md) — what peers speak once connected; the node profile the peer RPC extends
- [BLS signatures & DSTs](./bls-signatures.md) — the node/attestation signatures carried over peer links
- [Conformance & parity](./conformance-and-parity.md) — the cross-implementation parity discipline
- [Verification & provenance](./verification-and-provenance.md) — why a peer link is never a trust anchor
- [Error codes](../support/error-codes.md) — the full catalog incl. the peer `-32006`
