---
sidebar_position: 3
title: "L0 · URN & addressing"
description: "The normative urn:dig:chia URN grammar, the rootless retrieval_key = SHA-256(canonical) invariant, resourceKey normalization, the three-way scheme split (chia:// vs §21 dig:// vs dig://* browser), and the salt addressing extension."
keywords:
  - URN
  - urn:dig:chia
  - retrieval key
  - addressing
  - salt
  - scheme split
tags:
  - urn
  - retrieval-key
  - capsule
  - chia-protocol
---

# Layer 0 · URN & addressing

> **Canonical reference:** `digstore-core::urn` (the wire-format source of truth), `digstore-core::lib.rs:68-73`. Crypto that consumes the URN is in [Cryptography](./cryptography.md).

## The canonical URN grammar

```abnf
urn         = "urn:dig:" chain ":" store-id [ ":" root-hash ] [ "/" resource-key ]
chain       = "chia"                  ; locked by every producer (lib.rs:68)
store-id    = 64HEXDIG                 ; 32-byte singleton launcher id
root-hash   = 64HEXDIG                 ; OPTIONAL 32-byte generation root (pins one capsule)
resource-key= 1*pchar                  ; OPTIONAL path; taken verbatim (NOT lowercased)
```

`Urn::canonical()` renders `urn:dig:{chain}:{store_id.hex}`, then optionally `:{root.hex}`, then optionally `/{resource_key}` (`urn.rs:63-74`). `Urn::parse` strips `urn:dig:`, splits the resource at the **first** `/`, splits the head on `:` into chain / store_id / optional root_hash, and rejects more than three head segments (`urn.rs:24-60`).

:::note The chain label
Every producer writes the literal `chia` (`CHAIN = "chia"`, `lib.rs:68`) — Chia mainnet is the chain. The canonical `Urn` type carries the chain label as a generic field; the `chia` value is set by every producer.
:::

## The retrieval key — the only address on the wire

```
retrieval_key = SHA-256(canonical_urn_bytes)    // urn.rs:77-79  → 32 bytes, lowercase hex
```

This is the per-resource lookup key (`KeyTableEntry.static_key`). The URN itself never goes on the wire — only its hash.

:::tip KEY INVARIANT — root-independent address + key
At commit, the per-resource URN is built with `root_hash: None` (`store.rs:172-180`), so the `retrieval_key` **and** the [AES key](./cryptography.md) are derived from the **rootless** URN. Consequence: the address and decryption key are **stable across generations** — committing a new capsule never rotates a resource's key. The rooted URN is **display/sharing only** (`reconstructUrnWithRoot`) and is **never hashed**.
:::

## resourceKey normalization

- Split off at the **first** `/`, so a resource key may itself contain `/` and `:`.
- Taken **verbatim** — NOT lowercased (only the hex ids are lowercase).
- A single leading `/` is normalized away: `index.html` ≡ `/index.html`.
- Empty/absent ⇒ the default view `DEFAULT_RESOURCE_KEY = "index.html"` (`lib.rs:73`).

## The `?salt=<hex>` addressing extension

A **private** store mixes a 32-byte secret salt into the [HKDF salt](./cryptography.md#kdf). The salt is **out-of-band**: carried as a `?salt=<hex>` query parameter on the address, **not** inside the canonical URN string — so it never affects `retrieval_key`, only the AES key.

:::note The salt is an addressing extension above the canonical URN
The `?salt=<hex>` parameter is an addressing extension layered above the canonical `Urn` type, parsed at the edges (the SDK, the extension, the wasm verifier, and the browser C++). Because it lives outside the canonical URN string, it feeds only the AES key derivation and never the `retrieval_key`.
:::

## The three-way scheme split

| Scheme | Role | Form | Used by |
|---|---|---|---|
| `chia://` | network **content** address | `chia://[<root>.]<store>/<resource>` (raw hex labels) | DIG Browser address bar; content loader |
| `dig://` | §21 **transport** locator | `dig://[<user>@]<host>/<store>` → `https://<host>/stores/<id>` | `digstore` CLI clone/pull/push ([§21 transport](./transport-and-push.md)) |
| `dig://*` | DIG Browser **internal** pages | `dig://home`, `dig://shields`, `dig://control`, … | the browser UI only |

These are distinct: `chia://` addresses content, the §21 `dig://` names a remote origin, and the browser's `dig://*` names internal pages. All three resolve through the same `urn:dig:` namespace.

## Conformance vectors

The frozen cross-impl conformance vectors that pin `canonical()` + `retrieval_key()` bytes for all four parsers live in [Conformance & parity](./conformance-and-parity.md#urn-conformance-vectors). They are the single source of truth every reimplementation must pass.

## Related

- [Identity & naming](./identity-and-naming.md) — store / capsule / generation
- [Cryptography](./cryptography.md) — the rootless URN as HKDF IKM
- [§21 transport & push](./transport-and-push.md) — the `dig://` locator resolution
- [Conformance & parity](./conformance-and-parity.md) — the URN conformance vectors
