---
sidebar_position: 9
title: "L4 · On-chain anchoring (CHIP-0035)"
description: "store = a CHIP-0035 singleton; capsule = a singleton update + root-advance. Free mint vs DIG-paid commit, the owner-discovery memo hint, and admin/writer/oracle delegation as the Teams / deploy-token primitive."
keywords:
  - CHIP-0035
  - singleton
  - anchoring
  - delegation
  - deploy token
  - owner hint
tags:
  - chip-0035
  - anchoring
  - store
  - capsule
  - dig-payment
---

# Layer 4 · On-chain anchoring (CHIP-0035)

> **Canonical reference:** `chip35_dl_coin` (the canonical spend builder; wasm `@dignetwork/chip35-dl-coin-wasm`); `digstore-chain` is its byte-mirror for the CLI / in-process wallet. **Builders emit unsigned `CoinSpend`s** and do no networking/signing/key-derivation/coin-selection; the caller signs. Payment is on the next page, [DIG CAT payment & pricing](./dig-cat-payment.md).

## store = a CHIP-0035 DataLayer singleton

`store_id == launcher_id == the launcher coin id`. On-chain metadata is `DataStoreMetadata { root_hash, label?, description?, bytes?, size_proof? }`; the singleton inner state carries `owner_puzzle_hash` + a list of `DelegatedPuzzle`. Minted via `Launcher::new(lead_coin_id, 1).mint_datastore(ctx, metadata, owner_ph, delegated_puzzles)` (chia-sdk-driver).

- **store mint** = a CHIP-0035 singleton launch. **FREE of $DIG** — mint is a singleton launch + an XCH network fee only.
- **capsule / root-advance** = a singleton **update** + a DIG-CAT payment, concatenated and **co-signed atomically**.

:::warning DRIFT — pricing inverted vs the whitepaper
The whitepaper charged at INIT. The implementation makes **mint free** and charges **per capsule** (commit), dynamically and USD-pegged — there is **no protocol pricing constant**. See [DIG CAT payment & pricing](./dig-cat-payment.md). Catalogued in [Drift](./drift-from-whitepapers.md).
:::

:::caution GAP — atomicity is a client-side convention
That a root-advance was paid in $DIG is a **client-side bundling convention** (the commit bundle is built all-or-nothing) — there is **no on-chain enforcement** that a root-advance carried a DIG payment. Catalogued in [Drift](./drift-from-whitepapers.md).
:::

## Owner-discovery hint (a cross-system byte contract)

```text
DIGSTORE_OWNER_HINT_DOMAIN = b"dig:datastore:owner:v1"
digstore_owner_hint(owner_ph) = SHA-256(DOMAIN || owner_ph)
```

On the launch CREATE_COIN to the singleton launcher, chip35 overrides the launcher memos to `[digstore_owner_hint(owner_ph), DATASTORE_LAUNCHER_HINT]` (`store.rs:47,198-201`). The first (indexed) memo makes the launcher discoverable via coinset `get_coin_records_by_hint(...)` — returning **only** the owner's store launchers. The domain string is **byte-identical** across chip35 (`store.rs:47`) and the mirror (`singleton.rs:47`); a mismatch silently loses owned stores from enumeration.

## Delegation — admin / writer / oracle

`DelegatedPuzzle` has three constructors (mirroring DataLayer-Driver byte-for-byte):

| Delegate | Authority | Constructor |
|---|---|---|
| **Admin** | update metadata/root **and** change the delegated set; cannot transfer ownership outright | `admin_delegated_puzzle_from_key(synth_key)` (`store.rs:95`) |
| **Writer** | advance the root (= deploy a capsule) only | `writer_delegated_puzzle_from_key(synth_key)` |
| **Oracle** | anyone may spend for a fee (keyed by a payment ph, not a pubkey) | `oracle_delegated_puzzle(oracle_ph, oracle_fee)` |

:::info The delegation primitive behind Teams (#43) + deploy tokens (#17)
A **deploy token IS a Writer delegate** — there is no bespoke deploy-token puzzle (the old `deploy_token.rs` scaffold is retired). The delegated set is **REPLACED wholesale** on update (`update_store_ownership`): to revoke a delegate, omit it; to keep one, re-send it. `digstore-chain` adds writer-authorized advance (`build_update_unsigned_writer`), co-signing the singleton with the writer key and the XCH fee + DIG payment with the wallet keys, in one bundle (`anchor.rs:396`). Simulator-verified: a writer delegate advances the root; an un-delegated writer spend is rejected (`singleton.rs:975,1035`).
:::

## Lifecycle builders (chip35 `store.rs`)

- `mint_store(...)` — `selected_coins[0]` is the lead; the rest emit `assert_concurrent_spend(lead)`; change returned to minter, hinted.
- `update_store_metadata(...)` — emits `new_metadata_condition`; **REPLACES metadata wholesale** (re-send label/description every update or they clear).
- `update_store_ownership(...)` — the single primitive behind both delegation-management and ownership transfer; new delegated set replaces the old.
- `melt_store(...)` — Owner-only; `reserve_fee(1)` + `MeltSingleton{}`.
- `oracle_spend(...)`, `add_fee(...)` — let a singleton-only op carry an XCH fee / a CAT-ring net-zero spend pay a fee.

## ChainState in the capsule

The compiled module's [ChainState data section](./capsule-format.md#chainstate-12--the-on-chain-anchor-pointer) carries `launcher_id / coin_id / confirmed_height` so a client can resolve the on-chain head — the basis of [anchored-root pinning](./verification-and-provenance.md#gate-3).

## Related

- [Identity & naming](./identity-and-naming.md) — `store_id` = launcher id
- [DIG CAT payment & pricing](./dig-cat-payment.md) — the per-capsule $DIG payment
- [Verification & provenance](./verification-and-provenance.md) — anchored-root pinning
- [CHIP-0035 store-coin spends & delegation](../chip-0035-spends-and-delegation.md) — the spend builder, in depth
- [Drift from the whitepapers](./drift-from-whitepapers.md) — inverted pricing, deploy-token = writer-delegate
