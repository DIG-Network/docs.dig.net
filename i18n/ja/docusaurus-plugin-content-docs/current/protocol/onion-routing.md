---
sidebar_position: 14
title: "L7 · Private retrieval (onion routing)"
description: "The normative privacy-mode content-retrieval protocol: the per-request speed-vs-privacy toggle on the dig RPC surface, how a private read is onion-routed end-to-end (requester → guard/entry → middle → exit → providers → back) with a who-knows-what table, telescoping circuit construction over dig-nat mTLS (ntor X25519 + HKDF-SHA256 handshake, fixed-size 512-byte ChaCha20-Poly1305 layered cells, the RELAY command set), the onion-relay directory (dig-dht tag 0x04) and relay advertisement, guard nodes, the exit reusing the ordinary merkle-verified content read, and the honest threat model (partial-adversary unlinkability, stronger than Tor on exit integrity, weaker on anonymity-set size and Sybil cost)."
keywords:
  - onion routing
  - privacy mode
  - private retrieval
  - telescoping circuit
  - ntor handshake
  - X25519
  - ChaCha20-Poly1305
  - onion cell
  - guard node
  - exit relay
  - onion-relay directory
  - dig-dht tag 0x04
  - anonymity
  - threat model
  - unlinkability
tags:
  - dig-node
  - dig-onion
  - dig-rpc
  - peer network
---

# Layer 7 · Private retrieval — onion routing

> **Canonical references:** `dig-onion` (the onion-circuit crypto, cell wire, telescoping circuit builder, privacy-aware path selector, and onion-relay directory), `dig-nat` (the mTLS `PeerConnection` each hop rides), `dig-dht` (the provider-record store the onion-relay directory reuses), and `dig-download` (the multi-source fetch the exit runs). This page is the ecosystem-wide protocol spec for **privacy-mode content retrieval**; the [peer network](./peer-network.md) is the transport it rides and the [dig RPC](./dig-rpc.md) is the surface the toggle lives on.

Content retrieval on the DIG Network takes **one of two modes, chosen per request**. This page is the normative contract for the second one — **privacy mode**, an onion-routed read that hides *who is reading* from the hosts and from any single relay. A conforming reimplementation reproduces the wire and the rules below exactly.

- **SPEED** — the fast path documented in the [peer network](./peer-network.md#multi-source): locate holders in the DHT, fan byte-ranges across multiple providers, verify each range. The requesting node dials providers directly, so providers (and any on-path observer) see the requester's IP and `peer_id`. This is the default for public content where the *reader* has nothing to hide.
- **PRIVACY** — a telescoping **onion circuit** built through `k` (default 3) DIG nodes acting as **onion relays**. The requester's node is the only party that knows *both* "who is asking" and "what is being asked for." Each relay peels exactly one encryption layer and learns only its immediate predecessor and successor. The **exit** relay runs an ordinary SPEED fetch on the requester's behalf against the real providers, so **providers see the exit, never the requester**. Content stays end-to-end encrypted at the DIG content layer and is merkle-verified by the requester, so a malicious relay can withhold bytes but never forge them.

Privacy mode costs latency (a 3-hop telescoping build plus per-hop crypto) and throughput (a circuit is a single ordered pipe on the requester→exit leg, not an N-way fan-out). Its anonymity set is the population of honest onion relays. The guarantees are **weaker than Tor on some axes and stronger on others** — stated plainly in [§7](#threat-model).

## 0 · The two modes on the RPC surface {#modes}

The mode is a first-class, optional field on the content-fetch methods, defaulting to `speed`. A legacy client that omits it gets `speed` unchanged.

```jsonc
// dig.getContent / dig.fetchRange params — additive fields (legacy clients omit them → speed)
{
  "store_id": "<64hex>",
  "retrieval_key": "<64hex>",
  "root": "<64hex>|null",
  "offset": 0, "length": 3145728,
  "mode": "speed",                     // "speed" (default) | "privacy"
  "privacy": {                         // present only when mode == "privacy"
    "hops": 3,                         // circuit length: min 2, default 3, max 5
    "reuse_circuit": true,             // MAY bind to a prebuilt/existing suitable circuit
    "cover_traffic": false             // opt-in padding (best-effort obfuscation, not a guarantee)
  }
}
```

Normative rules:

- An absent `mode` MUST be treated as `speed`. `mode:"speed"` MUST use the [multi-source path](./peer-network.md#multi-source) and MUST NOT route through a circuit (**no silent upgrade** — no surprise latency). `mode:"privacy"` MUST route through an onion circuit per this page.
- `hops` MUST lie in `[2, 5]` (default 3); out of range fails with [`-32022`](#error-codes).

### Where the toggle lives — the local node only {#toggle-placement}

The subtle, load-bearing rule: **`mode:"privacy"` is meaningful only on the caller's own trusted local node** (the in-process DIG Browser node, or the OS-service node on the loopback `dig.local` / `127.0.0.1`). That node is the *originator* — it builds the circuit outward and is the only party holding both the reader's identity and the query.

- A node MUST NOT honor `mode:"privacy"` received from a remote/anonymous caller by fetching privately on that caller's behalf — doing so would hand this node the caller's identity **and** their query, the exact linkage privacy mode exists to break. A caller with no trusted local originator (for example a browser talking only to a public read endpoint) cannot obtain privacy mode; the node MUST reject with [`-32021`](#error-codes). Privacy mode therefore **requires a local DIG node**.
- The circuit hops themselves are ordinary [PEER/CONTROL-tier](./peer-network.md#dual-transport) traffic: each hop is a `dig-nat` mTLS peer connection carrying onion cells on a dedicated `dig.onion` logical stream. Onion relaying is an mTLS-gated peer capability, never anonymous-reachable, disjoint from the public read tier.

### Hard invariants {#invariants}

1. **No silent downgrade.** A `mode:"privacy"` request that cannot be served privately MUST fail with [`-32020`](#error-codes); it MUST NOT fall back to a direct fetch (that would deanonymize exactly the user who asked for privacy). Downgrading to a fast fetch is an explicit user/client choice only.
2. **No silent upgrade.** `mode:"speed"` MUST NOT route through a circuit.
3. **Exit-side provider resolution.** For a private read, the requester's node MUST NOT issue a content-specific DHT `find_providers` from its own node (that would reveal to the DHT what it wants to read); the **exit** performs the lookup ([§1](#flow) step 2). The requester's only DHT activity for privacy is the content-independent onion-directory refresh ([§3](#directory)).
4. **Integrity identical to SPEED.** A private read ends in the same client-side verification (chain-anchored [root pin](./verification-and-provenance.md) + [merkle inclusion](./merkle-proofs.md) + per-chunk AES-256-GCM-SIV decrypt) as a fast read. Privacy adds anonymity; it subtracts nothing from integrity.

## 1 · How a private read is routed end-to-end {#flow}

A requester `R` (the user's local node) fetches through a prebuilt circuit `R → E → M → X` — guard/entry `E`, middle `M`, exit `X`:

```text
User (browser / SDK) ──mode:privacy──▶ LOCAL dig-node R (trusted, on loopback)
                                          │
                                          │ 1. bind the request to a prebuilt circuit R→E→M→X
                                          │    (guard E; M, X drawn from the onion directory §3–§6)
                                          │ 2. R sends RESOLVE_PROVIDERS{content} down the circuit so the
                                          │    DHT find_providers runs AT THE EXIT, not at R (invariant §0)
                                          │ 3. R sends BEGIN_FETCH{content, root, ranges}
                                          ▼
        E (guard / entry) ──mTLS──▶ M (middle) ──mTLS──▶ X (exit)
        knows: R's IP + peer_id;    knows: E and X       knows: M (its predecessor),
        that R runs an onion        are relays;          the content id + root; runs the
        circuit; NOT the content    NOT R, NOT the       ordinary SPEED fetch against providers
        id, NOT the content         content id, NOT      (find_providers → select → multi-source)
        id, NOT the exit.           the content.               │
                                                               ▼
                                                Providers P1..Pn (ordinary, unchanged nodes)
                                                know: the EXIT asked for this content id (ranges,
                                                      ciphertext served) — indistinguishable from
                                                      any normal fetch; do NOT know R exists.
                                                               │ ciphertext + inclusion proofs
                                                               ▼
        Response X──▶M──▶E──▶R: X wraps each returned range frame's CIPHERTEXT (still DIG-layer
        encrypted!) in onion layers; M and E each add a layer; R peels all three, then runs the
        ORDINARY client-side verification — chain-anchored root pin, merkle inclusion proof, and
        AES-256-GCM-SIV decrypt with the URN-derived key. No hop (including X) ever saw plaintext
        or the decryption key.
```

### Who knows what — the honest table {#who-knows-what}

| Party | Learns | Does NOT learn |
|---|---|---|
| **Guard / entry `E`** | `R`'s IP + `peer_id`; that `R` is running an onion circuit; cell timing / volume | The content id; the content; who the exit is; anything decryptable |
| **Middle `M`** | That `E` and `X` are relays; cell timing / volume | `R`'s existence / identity; the content id; the content |
| **Exit `X`** | The content id + `root`; that *some* circuit wants it; runs the real fetch | `R`'s identity / IP; that a specific person/app wants it; the decryption key; the plaintext (content stays DIG-layer ciphertext through `X`) |
| **Providers `P`** | The exit fetched this content id (ranges) — identical to any normal fetch | `R`'s existence; that this was an onion fetch at all |
| **On-path observer (single link)** | Fixed-size cells between two adjacent hops; their volume / timing | The content; the path beyond the two endpoints it watches |

Two integrity facts make privacy mode *stronger* than Tor here: **(a)** the content stays encrypted at the DIG content layer (AES-256-GCM-SIV, URN-derived key) the entire way, so the exit and every hop handle *ciphertext* — even the exit does not read the content; and **(b)** `R` verifies the merkle inclusion proof against the chain-anchored `root` it resolves *itself*, so a malicious exit can withhold or stall but cannot forge (a forged byte fails the merkle check, `R` tears the circuit and retries on a new one).

## 2 · Circuit construction {#circuit}

### 2.1 Telescoping build

A `k`-hop circuit is built **one hop at a time**, each downstream hop key-exchanged *through the already-built prefix*, so no relay ever sees the requester's raw key material for a hop beyond itself:

```text
R wants circuit R → E → M → X

1. R dials E over dig-nat mTLS (an ordinary peer connection; E sees R's IP — mitigated by guards §4).
   R ⇄ E: ntor handshake (CREATE / CREATED)  → shared key K_E.   R now holds a 1-hop circuit.

2. R sends E an EXTEND cell (encrypted under K_E) naming M + R's handshake for M.
   E dials M over dig-nat mTLS, relays R's handshake, returns M's reply (EXTENDED).
   R ⇄ M (through E): ntor handshake → K_M.   M sees only E as its predecessor.

3. R sends (through E→M) an EXTEND cell naming X + R's handshake for X.
   M dials X over dig-nat mTLS, relays the handshake.
   R ⇄ X (through E→M): ntor handshake → K_X.   X sees only M as its predecessor.

Circuit ready. R holds the ordered keys [K_E, K_M, K_X].
```

Telescoping (rather than a single-packet onion) is chosen because each `EXTEND` is *"open a normal mTLS peer connection to the next hop"* — exactly what the [NAT-traversal ladder](./peer-network.md#nat-traversal) already does, NAT traversal and relay fallback included — and because each hop's key is an ephemeral key exchange giving forward secrecy per hop.

### 2.2 Two identities — transport vs onion {#identities}

An onion relay carries **two distinct cryptographic identities**, which MUST NOT be conflated:

1. **Transport identity** `peer_id = SHA-256(TLS SubjectPublicKeyInfo DER)` ([peer identity](./peer-network.md#peer-identity)) — long-term, routable, publicly-linkable; authenticates the mTLS pipe between two adjacent hops. Reused from `dig-nat`, unchanged.
2. **Onion identity** — a separate **X25519 static keypair** `(B, b)`, where `B` is the relay's published *onion key*. The circuit handshake binds to `B`, giving **forward secrecy** (the per-circuit session key derives from ephemeral key exchanges) and **cryptographic separation** (the transport key authenticates the wire between hops; the onion key authenticates the requester↔relay circuit layer riding inside those pipes).

The handshake MUST key on `B`, never on `peer_id` or the mTLS session key. `B` is published in the [directory](#directory) and rotates on a schedule, with the immediately-previous `B` honored for a short grace window so in-flight circuits survive rotation.

### 2.3 The ntor handshake {#ntor}

The per-hop handshake is **`ntor` over X25519 + HKDF-SHA256**, domain-separated by the protocol id `"dig-onion-ntor-1"` so a DIG cell can never be confused with (or cross-replayed against) a Tor relay. For a hop to relay `N` with published onion key `B_N` and node id `ID_N = peer_id(N)`:

```text
R: generate ephemeral X25519 (x, X);  send { ID_N, B_N, X }
N: generate ephemeral X25519 (y, Y)
   secret_input = EXP(X, y) ‖ EXP(X, b_N) ‖ ID_N ‖ B_N ‖ X ‖ Y ‖ PROTOID
   KEY_SEED = HKDF-Extract(secret_input);   verify = HMAC(KEY_SEED, "verify")
   N: send { Y, AUTH = HMAC(verify, …) }
R: recompute secret_input using x (EXP(Y, x) ‖ EXP(B_N, x) ‖ …); verify AUTH in constant time
   → both derive K_N = HKDF-Expand(KEY_SEED, "dig-onion", keylen)
```

`R` MUST verify `AUTH` in constant time before using the circuit; a failed check tears the (partial) circuit. `K_N` is split into **directional** keys — a forward (requester→relay) and a backward (relay→requester) ChaCha20-Poly1305 key + nonce — so the two directions use independent keystreams. The exact byte layout is frozen by the `dig-onion` conformance vectors; a change to it is a wire-breaking event that bumps the protocol id.

### 2.4 Cells — fixed size, layered AEAD {#cells}

Onion traffic is a stream of **fixed-size cells** (so an on-path observer counting bytes cannot read message boundaries). Each cell is exactly **512 bytes** of onion payload and rides inside a `dig-nat` yamux stream between adjacent hops (the outer mTLS record encrypts the wire).

```text
onion cell (fixed 512-byte payload):
  ┌────────────┬──────────┬──────────────────────────────────────────────┐
  │ circ_id u32│ cmd  u8   │ payload (512 − 5 bytes, layer-encrypted)      │
  └────────────┴──────────┴──────────────────────────────────────────────┘

  cmd ∈ { CREATE, CREATED, EXTEND, EXTENDED, RELAY, RELAY_EARLY, DESTROY, PADDING }

  A RELAY cell's payload, after the requester applies/peels ALL layers:
  ┌──────────┬───────────┬──────────┬──────────┬──────────────┬───────────┐
  │ stream u16│ digest u48│ len   u16│ rcmd  u8 │ data  (len)   │ pad 0x00  │
  └──────────┴───────────┴──────────┴──────────┴──────────────┴───────────┘
     rcmd ∈ { BEGIN_FETCH, DATA, END, CONNECTED, TRUNCATED, SENDME, RESOLVE_PROVIDERS }
```

- **Layered encryption.** Outbound, `R` wraps the RELAY payload under `K_X`, then `K_M`, then `K_E` (inside-out). `E` peels its layer and forwards; `M` peels its layer; `X` peels the last layer and sees the plaintext RELAY command (e.g. `BEGIN_FETCH{content, root, ranges}`). Inbound (`X→R`), each hop *adds* a layer and `R` peels all `k`. AEAD is **ChaCha20-Poly1305** with the per-hop directional key/nonce. A failed authentication tag makes a hop drop the cell and count a fault; too many faults tear the circuit.
- **The `digest` field** is a rolling MAC seeded from `K_N` that lets a hop recognize a cell that is fully unwrapped *for it* versus one it must forward — without any hop learning the whole path.
- **`RELAY_EARLY`** carries `EXTEND` requests and is count-capped, bounding circuit length so no relay can be driven to extend indefinitely.
- **`PADDING`** cells enable optional cover traffic when `privacy.cover_traffic` is set — best-effort obfuscation, never represented as defeating a global observer.

### 2.5 The RELAY command set {#relay-commands}

Inside a fully-unwrapped RELAY payload, `rcmd` selects the action:

| `rcmd` | Direction | Meaning |
|---|---|---|
| `BEGIN_FETCH` | R → exit | Begin fetching the named content (`store_id`/`retrieval_key`/`root` + ranges) on a new stream. |
| `RESOLVE_PROVIDERS` | R → exit | Run the DHT `find_providers` lookup **at the exit** (invariant §0-3), before `BEGIN_FETCH`. |
| `CONNECTED` | exit → R | The fetch stream is established. |
| `DATA` | either | A frame of DIG-layer **ciphertext** (up the circuit) or flow-control payload. |
| `END` | either | End of a stream. |
| `SENDME` | either | Windowed flow-control acknowledgement (per-stream and circuit-level), so a slow reader applies backpressure and a relay cannot be memory-exhausted. |
| `TRUNCATED` | relay → R | The circuit was truncated at some hop (the downstream portion is gone); `R` rebuilds. |

**Stream multiplexing.** Many logical streams share one circuit, each identified by its `stream` id, pipelined under `SENDME` windows. This lets range-level parallelism survive on the requester→exit leg even though the circuit is a single path: the exit runs the [multi-source download](./peer-network.md#multi-source) against providers (full fan-out on the exit→provider leg), and streams the returned ranges back over concurrent streams within the one circuit. All ranges of one logical retrieval use **one** circuit by default; splitting a resource across independent circuits is opt-in only, because independent exits could otherwise correlate the pieces.

### 2.6 Circuit lifetime + teardown {#lifetime}

- **Pre-building.** A privacy-enabled node keeps a small pool of clean, ready circuits so a user request binds instantly and the build latency (and build timing) is decoupled from the request.
- **Rotation.** A circuit serves for a bounded age / byte budget; after that, new streams get a fresh circuit and the old one drains its in-flight streams, then tears down.
- **Teardown.** A `DESTROY{circ_id}` propagates hop-by-hop — each relay tears its next-hop link and forgets that circuit's keys (which are zeroized). A dead link, repeated authentication-tag faults, a per-hop timeout, or circuit age all trigger teardown. If a private circuit cannot be built or dies mid-fetch, the request fails or retries on a fresh circuit — it MUST NOT silently fall back to a direct fetch (invariant §0-1).

## 3 · The onion-relay directory {#directory}

Onion relays are discovered through a dedicated **additive namespace in the [DHT](./peer-network.md#dht)**, seeded by `relay.dig.net` as a bootstrap. A reserved content key names the relay set:

```text
ONION_DIRECTORY_KEY = SHA-256( 0x04 ‖ network_id )      // new content tag 0x04, "onion relay set"
```

Tag `0x04` is disjoint from the existing DHT content tags `0x01` (store) / `0x02` (root/capsule) / `0x03` (resource), so adding it changes no existing DHT semantics.

- **Advertisement.** A node that opts into relaying advertises `capabilities: ["onion-relay"]` (and optionally `"exit"`) in [`dig.getNetworkInfo`](./peer-network.md#peer-rpc) and `announce_provider`s itself under `ONION_DIRECTORY_KEY`. Its provider record carries its dialable, [IPv6-first](./peer-network.md#address-family) candidate addresses plus an **additive record extension**:

  ```jsonc
  { "onion_key": "<32-byte X25519 B, hex>",
    "onion_key_prev": "<hex|null>",         // grace-window previous key
    "capacity_class": "low"|"medium"|"high", // coarse, self-declared — NOT a learned metric
    "caps": ["onion-relay","exit"],          // "exit" is opted into separately from relaying
    "attest": "<signature over the above by the relay's peer_id certificate>" }
  ```

- **Anti-forgery.** The `attest` field MUST be a signature by the relay's transport (`peer_id`) certificate over the record extension, so a third party can republish a *stale real* relay record but cannot forge a record binding a relay to an attacker-held `onion_key`. A requester MUST discard a record whose `attest` does not verify, and MUST independently confirm `onion_key` ownership via the ntor `AUTH` check ([§2.3](#ntor)) before routing through the relay. This raises the cost of cheap record forgery; it does not stop an adversary running many *real* relays ([§7.4](#sybil)).
- **Bootstrap.** A cold node with an empty DHT seeds its first relay set from `relay.dig.net`'s [introducer](./peer-network.md#discovery) (`get_peers`, filtered to `onion-relay`-flagged registrants), then transitions to DHT-sourced discovery. The relay is a bootstrap, never the directory authority: `relay.dig.net` is not itself an onion relay by default (promoting it would concentrate trust in one operator). It serves onion routing only as this bootstrap and as the ordinary per-hop NAT [hole-punch / relayed fallback](./peer-network.md#relayed) any `dig-nat` link may already use.

## 4 · Guard nodes {#guards}

Picking three fresh random relays per circuit is a known deanonymization footgun: over many circuits a requester whose *first* hop is sometimes adversarial will eventually build a circuit whose first **and** last hop are both adversarial — full deanonymization for that circuit.

The mitigation is **entry guards**: each node keeps a small, persistent set of guard relays (default 3) and draws the **first hop of every privacy circuit from that set**. Guards persist across restarts and rotate slowly (on a jittered multi-week schedule, or when a guard dies). This converts the "am I unlucky this time" dice from per-circuit to per-rotation-period: a user with all-honest guards is safe from the entry side of the correlation attack for the guard lifetime; a user unlucky in guards is exposed *consistently* (which is detectable) rather than intermittently.

## 5 · The exit fetch — the ordinary content read {#exit}

When a circuit's exit executes the fetch, it runs the **ordinary SPEED path**: on `RESOLVE_PROVIDERS` it runs the DHT [`find_providers`](./peer-network.md#dht); on `BEGIN_FETCH` it runs the [multi-source download](./peer-network.md#multi-source) against providers and streams the returned range frames back up the circuit as `DATA`/`END`.

- The exit is just a normal DIG node doing a normal fetch — which is exactly why providers cannot distinguish an onion-exit fetch from any other node's fetch, and why **no provider-side change is ever required**.
- The exit handles only DIG-layer **ciphertext + merkle proofs**. It never sees the plaintext and never holds the URN-derived decryption key (which lives only at `R`).
- The requester verifies every returned range against the chain-anchored `root` it resolves itself — the same [per-range integrity](./peer-network.md#range-integrity) as a fast read. A range that fails its inclusion proof or decryption tag is discarded and the circuit is rebuilt. **Integrity is identical to SPEED** (invariant §0-4).

## 6 · Hop selection — privacy-aware, not quality-ranked {#selection}

Circuit hops MUST be chosen by a **privacy-aware selector**, distinct from the multi-source download's quality optimizer. A quality optimizer ranks the *fastest* peers, converges on a small preferred set, exposes per-peer saturation, and records per-transfer latency signatures — every one of which is a deanonymization vector for a circuit (a small anonymity set, a fingerprintable flow, and a selection that leaks the requester's network vantage). The privacy selector's rules:

1. **Uniform-at-random within eligibility cohorts.** Middle and exit hops are drawn uniformly at random from the relays that pass the hard eligibility filter (below), optionally weighted only by a coarse capacity class. Measured "quality" plays no role, and selection is **content-oblivious** — the path distribution MUST NOT depend on the content being fetched.
2. **Guard-pinned entry.** The first hop is drawn from the persistent [guard set](#guards), not chosen fresh per circuit.
3. **Eligibility filter.** A relay is eligible for a position iff it is live, ntor-authenticable, on the correct network, not already on this circuit, satisfies path diversity, and (for the exit) advertises the `exit` capability.
4. **Path diversity.** No two hops in one circuit share a network group (`/16` for IPv4, `/32` for IPv6), and a detectably-shared operator is avoided — forcing a Sybil adversary to spread across networks.
5. **Coarse capacity only.** Selection MAY weight by the relay's self-declared coarse `capacity_class` (three buckets) to avoid overloading tiny relays. It MUST NOT use any measured / learned per-flow throughput or latency, and MUST NOT keep an externally-observable per-relay quality model. A relay that fails a build is cooled down locally for the current selection round only.

The quality optimizer is still used where it helps and cannot hurt: at the **exit→provider leg**, where the exit optimizes its real fetch for speed. From the providers' view the "requester" is the exit, so optimizing that leg does not deanonymize the true requester.

## 7 · Threat model — guarantees and limits {#threat-model}

Privacy mode provides **unlinkability of a content read to the reader's network identity against a partial adversary** — one who controls *some* relays and/or observes *some* links, but not all. It does **not** provide anonymity against a global observer, nor does it hide *that content exists* or *that it was served*. Every claim below is paired with its limit.

### 7.1 Exit sees content / tampering — DIG is stronger than Tor
On Tor the exit sees and can modify plaintext (the classic malicious-exit problem). On DIG the exit handles only DIG-layer **ciphertext + merkle proofs**, never plaintext or the decryption key, and the requester verifies every byte against the chain-anchored root it resolves itself. So a malicious exit **cannot read or forge** content — only withhold or stall. Withholding is mitigated by rotating to a fresh circuit and retrying, and by per-hop timeouts.

### 7.2 Traffic analysis / timing correlation — the fundamental limit
A global passive adversary who can watch the requester→entry link *and* the exit→provider link can correlate packet timing and volume and link the reader to the content. This is the known, unfixable-in-principle limit of *any* low-latency onion routing (Tor has it too). **Privacy mode is not a defense against a global observer.** Partial mitigations only: fixed-size cells remove message-boundary leakage; optional padding blurs volume; circuit rotation limits the correlation window; guards reduce the chance the entry is ever adversarial. A DIG-specific note: because a capsule compiles to a fixed-size module, capsule-granularity fetches leak little size information, but *sub-capsule range* fetches leak approximate resource size via total bytes transferred — quantize ranges to fixed windows to blunt this.

### 7.3 Selection-based deanonymization — closed by §6
Choosing hops by the quality optimizer would leak through a converged preferred set, observable saturation, real-time latency fingerprints, and an explicit preference order. The [privacy-aware selector](#selection) (uniform-cohort, content-oblivious, no observable quality model) is mandatory precisely to close this.

### 7.4 Sybil-controlled circuits — the primary residual risk {#sybil}
An adversary running many relays raises the chance of owning two hops of a circuit (entry **and** exit ⇒ deanonymization). Relay identities are cheap (there is no proof-of-work/stake for relays), so **Sybil is the primary residual risk.** It is cost-raised, not eliminated: **guards** mean the adversary must own *your specific few guards*, not just "an entry sometimes"; **path diversity** forces the adversary to spread across networks; **directory anti-forgery** stops cheap fake records (real Sybils still cost real nodes); an optional relay-collateral weighting can raise the economic cost further. Sybil resistance is **not** claimed.

### 7.5 Guard / entry compromise — bounded by §4
Without guards, repeated circuit building eventually guarantees an entry+exit compromise for a fraction of users. Guards convert that per-circuit risk into a per-rotation-period risk.

### 7.6 DHT-lookup deanonymization — closed by the exit-side lookup
If the requester ran `find_providers` from its own node, it would tell the DHT (and any DHT peer, possibly adversarial) exactly what it wants to read — deanonymizing the very lookup the circuit was meant to hide. The [exit-side resolution](#flow) invariant closes this: the requester emits no content-specific DHT query for a private read; the exit does the lookup. The requester's only DHT activity is the content-independent directory refresh, which reveals only "this node uses privacy mode," not *what* it reads.

### 7.7 Denial of service on relays
Relaying is unpaid work. Per-circuit and per-predecessor rate limits, `SENDME` flow control, and the `RELAY_EARLY` length cap bound the load; a relay may shed load by refusing new circuits with a `DESTROY` carrying a resource reason. A relay uses only local, coarse admission control — no cross-request reputation model (which would leak).

### 7.8 What privacy mode does not defend
A global passive adversary ([§7.2](#threat-model)); an adversary who owns your specific guard set **and** an exit for the content you read; the public fact that content exists and was served (DIG is a public content network — privacy hides the *reader*, not the *existence* of the read); write/publish anonymity (a publish carries a signing identity by design, and anonymizing it is a separate, deferred concern); and application-layer self-doxxing (if the content you fetch makes your app phone home, that is outside the circuit).

**Compared to Tor, in one line each.** *Weaker* — a smaller, newer anonymity set, no proof-of-work relay cost (Sybil is cheaper), and no dedicated directory authorities (bootstrap is via the DHT + relay). *Stronger* — content-addressed, chain-anchored, client-decrypted data means the **exit cannot read or tamper with content**, and the content-lookup leak is closed by exit-side resolution. *The same* — fundamentally vulnerable to a global timing adversary; both are low-latency onion routing, not a mixnet.

## Error codes {#error-codes}

Privacy mode adds three node-profile JSON-RPC codes, catalogued in the [error codes](../support/error-codes.md) reference:

| Code | Name | Meaning |
|---|---|---|
| `-32020` | `onion_circuit_unavailable` | A `mode:"privacy"` request could not be served privately. The node MUST NOT downgrade to a direct fetch ([invariant §0-1](#invariants)); retry, or the client may explicitly choose a fast fetch. |
| `-32021` | `privacy_requires_local_node` | `mode:"privacy"` was requested but the caller is not the node's own trusted local originator ([§0](#toggle-placement)). Privacy mode requires a local DIG node. |
| `-32022` | `onion_hops_out_of_range` | The requested `hops` is outside `[2, 5]`. |

## Conformance {#conformance}

A conforming privacy-mode implementation reproduces these frozen shapes:

| Surface | Frozen shape | What it pins |
|---|---|---|
| **Mode toggle** | additive `mode ∈ {speed, privacy}` (absent ⇒ speed) + the `privacy{hops, reuse_circuit, cover_traffic}` object on `dig.getContent`/`dig.fetchRange`; `hops ∈ [2,5]` | that a legacy client is unaffected and every client speaks the same toggle |
| **Local-node-only + no-downgrade** | privacy honored only for the trusted local originator (`-32021`); a private request never falls back to a direct fetch (`-32020`); the exit resolves providers, not the requester | the anonymity invariants that make privacy mode meaningful |
| **ntor handshake** | `ntor` over X25519 + HKDF-SHA256, protocol id `"dig-onion-ntor-1"`, constant-time `AUTH`, directional forward/backward ChaCha20-Poly1305 keys; onion key `B` distinct from `peer_id` | that any two implementations complete a circuit hop and derive identical keys |
| **Cell wire** | fixed 512-byte cells `[circ_id u32][cmd u8][payload]`; commands `CREATE`/`CREATED`/`EXTEND`/`EXTENDED`/`RELAY`/`RELAY_EARLY`/`DESTROY`/`PADDING`; RELAY payload `[stream u16][digest u48][len u16][rcmd u8][data][pad]`; layered inside-out AEAD | that cells are indistinguishable by size and that layers wrap/peel identically across implementations |
| **Directory** | `ONION_DIRECTORY_KEY = SHA-256(0x04 ‖ network_id)`; the record extension `{onion_key, onion_key_prev, capacity_class, caps, attest}`; `attest` verified before use; bootstrap from the relay introducer | that a relay announced by one implementation is found and trusted by another, and forged records are rejected |
| **Selection** | guard-pinned entry; uniform-cohort, content-oblivious middle/exit; `/16`·`/32` path diversity; coarse capacity weighting only; no observable per-flow quality model | that hop selection maximizes the anonymity set and leaks nothing about the reader |
| **Integrity** | identical to SPEED — chain-anchored root pin + merkle inclusion + AES-256-GCM-SIV decrypt at the requester; the exit handles only ciphertext | that privacy adds anonymity and subtracts nothing from integrity |

## Related

- [The DIG Node peer network](./peer-network.md) — the mTLS peer transport, the NAT ladder, the DHT, and the [dual-transport tiers](./peer-network.md#dual-transport) the `dig.onion` stream sits on
- [The dig RPC](./dig-rpc.md) — the content-read surface the `mode` toggle extends
- [Verification & provenance](./verification-and-provenance.md) — why the requester verifies content itself, so a relay cannot forge
- [Merkle inclusion proofs](./merkle-proofs.md) — the per-range integrity the exit's ciphertext carries
- [Error codes](../support/error-codes.md) — the full catalog, including `-32020`/`-32021`/`-32022`
