---
sidebar_position: 2
title: "L0 · Identity & naming"
description: "Layer 0 of the DIG Protocol: store vs capsule vs generation. store_id is the CHIP-0035 singleton launcher id — NOT a hash of any key. A store is an ordered sequence of capsules."
keywords:
  - store id
  - capsule
  - generation
  - launcher id
  - RootHistory
tags:
  - capsule
  - store
  - generation
  - chip-0035
---

# Layer 0 · Identity & naming

> **Canonical reference:** `digstore-core::capsule`, `digstore-core::urn`. Addressing grammar continues in [URN & addressing](./urn-and-addressing.md).

## store — the on-chain identity

A **store** is an on-chain identity: `store_id: Bytes32`, which **is the CHIP-0035 DataLayer singleton launcher id** (the launcher coin id). It is the only mutable-identity anchor; everything else is derived per-generation. Host-side it is persisted as hex in `config.toml` (`digstore-store/config.rs:10,40`).

:::danger DRIFT — `store_id` is NOT `SHA-256(pk)`
The whitepaper's `id == hash(key)` is **dead**. `verify_module_root` asserts explicitly that the store id is the on-chain launcher id and is intentionally **not** bound to `SHA-256(pk)` (`digstore-compiler/data_section.rs:209-213, 286-288`). Catalogued in [Drift](./drift-from-whitepapers.md).
:::

## capsule — one immutable generation

A **capsule** is the identity of one immutable generation: the pair `(store_id, root_hash)`, canonical string `storeId:rootHash` (lowercase hex `:` lowercase hex).

```rust
// digstore_core::capsule::Capsule { store_id, root_hash }
Capsule::canonical()      // = format!("{}:{}", store_id.to_hex(), root_hash.to_hex())
Capsule::from_canonical() // requires EXACTLY two ':'-segments of valid 32-byte hex
```

- `canonical()` / `from_canonical` — `capsule.rs:27-62`.
- Codec encoding is `store_id(32) || root_hash(32)`, big-endian Chia-streamable (`capsule.rs:70-84`).
- The capsule is a **pure naming layer** and MUST NOT alter `Urn::canonical()` / `Urn::retrieval_key()` (regression-locked, `capsule.rs:12-15`).

## store = an ordered sequence of capsules

A store is a **sequence of capsules**, one per commit / root-advance. The ordered root list is the **RootHistory** (oldest→newest), persisted host-side as `GenerationState { id: u64, root, timestamp }` and embedded in the compiled module as the [RootHistory section](./capsule-format.md#sectionids).

A [`Urn`](./urn-and-addressing.md) names a capsule **iff** its `root_hash` is `Some`:

```rust
// urn.rs:88-93
Urn { chain, store_id, root_hash: Option<Bytes32>, resource_key: Option<String> }
Urn::as_capsule() -> Some(Capsule)   // only when root_hash is Some; rootless -> None (= latest)
```

## The three identities at a glance

| Term | Value | Mutable? | Reference |
|---|---|---|---|
| **store** | `store_id` = CHIP-0035 launcher id (`Bytes32`) | identity fixed; current root advances | `capsule.rs`, `data_section.rs:209-213` |
| **capsule** | `(store_id, root_hash)` = one generation | immutable | `capsule.rs:27-62` |
| **generation** | one entry in RootHistory, ordered oldest→newest | append-only | `digstore-store/generation.rs` |

## Related

- [Protocol: Overview](../protocol-deep-dive.md) — the seven-layer model
- [URN & addressing](./urn-and-addressing.md) — how a capsule is named and hashed
- [On-chain anchoring](./on-chain-anchoring.md) — where `store_id` comes from (the singleton launch)
- [Concepts & glossary](../concepts.md) — capsule, store, generation defined
- [Drift from the whitepapers](./drift-from-whitepapers.md) — `store_id` ≠ `hash(pk)`
