---
sidebar_position: 10
title: "L4 · DIG CAT payment & pricing"
description: "The DIG CAT TAIL asset id, the treasury inner puzzle hash, 3-decimal units, the dynamic USD-pegged per-capsule amount (no protocol constant), the atomic commit-bundle convention, and its non-enforcement caveat."
keywords:
  - DIG CAT
  - DIG_ASSET_ID
  - treasury
  - per-capsule pricing
  - USD-pegged
tags:
  - dig-payment
  - chip-0035
  - anchoring
  - capsule
---

# Layer 4 · DIG CAT payment & pricing

> **Canonical reference:** `chip35_dl_coin::dig` (the canonical builder); `digstore-chain::dig` / `::cat` (the byte-mirror). Builds the per-capsule $DIG payment that rides with a [root-advance](./on-chain-anchoring.md).

## Byte-identical constants (asserted in tests on both sides)

| Constant | Value | Reference |
|---|---|---|
| `DIG_ASSET_ID` (TAIL hash, mainnet) | `a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81` | `dig.rs:43` |
| `DIG_TREASURY_INNER_PUZZLE_HASH` | `ec7c304708c7d59c078d5ae098d0dea004decf47fa1cafebb266c10ad6466ce8` | `dig.rs:56` |
| DIG decimals | **3** (1 DIG = 1000 base units) | mirror `dig.rs:13` |

The treasury inner ph decodes from `xch1a37rq3cgcl2ecpudttsf35x75qzdan68lgw2l6ajvmqs44jxdn5qv6pk3y`.

## The payment builder

```text
build_dig_store_payment(buyer_synth_key, dig_cats: Vec<Cat>, store_id, amount) -> Vec<CoinSpend>
```

1. Validate every `dig_cat`'s asset id `== DIG_ASSET_ID`.
2. Ring-spend the DIG CATs (lead carries the CREATE_COINs; the rest emit `assert_concurrent_spend(lead)`).
3. Create **one** DIG-CAT coin of `amount` to `DIG_TREASURY_INNER_PUZZLE_HASH`, carrying memos `[treasury_inner_ph (hint), store_id]`.
4. Return change to the buyer (hinted).
5. **Reserve no XCH** — the ring nets to zero; the XCH network fee rides separately (`add_fee`).

(`chip35 dig.rs:84`. The mirror's `build_dig_payment` uses the chia-wallet-sdk Action/Spends system but produces the same shape — `cat.rs:208-281`.)

## Dynamic, USD-pegged pricing — no protocol constant

`amount` is a **dynamic input**: `dig_amount = target_usd / live_DIG_price`, where `target_usd` ≈ **$1/capsule/year** of realistic AWS hosting. The amount is **uniform per fixed-size capsule** (the [128 MiB fixed module](./self-defending-module.md#fixed-size-obfuscation)) so price leaks nothing about content. **chip35 has no hardcoded amount** — the caller computes it.

:::note Off-chain pricing
Per-capsule pricing is enforced **off-chain** (the hub/anchor-watcher reconciles a confirmed treasury payment); it is **not** a protocol constant. The mirror's `COMMIT_DIG = 100_000` base units (100 DIG) is only a deterministic CLI fallback when no explicit amount is passed (`anchor/dig.rs:28-41`).
:::

:::note The commit bundle is a client-side all-or-nothing bundle
The commit bundle (the root-advance singleton spend + the DIG-CAT payment) is concatenated and co-signed **all-or-nothing** by the client. The payment-to-root-advance coupling is a [client-side bundling convention](./on-chain-anchoring.md); settlement is reconciled off-chain by the hub/anchor-watcher against a confirmed treasury payment.
:::

## Receipt verification

`dig_treasury_payment_coin(lead_dig_cat, amount)` returns the CAT-wrapped treasury coin for receipt verification; `cat_puzzle_hash(owner_ph, asset_id) = CatArgs::curry_tree_hash(asset_id, owner_ph)`; `reconstruct_cat_coins` walks coinset to confirm a payment landed (`dig.rs:149`, mirror `cat.rs:39-48,85`).

## Related

- [On-chain anchoring](./on-chain-anchoring.md) — the root-advance the payment rides with
- [The blind host model](./blind-host-model.md#push-trust) — the anchor-watcher that reconciles payments
- [Error codes](../support/error-codes.md) — `DIG_INSUFFICIENT`, `insufficient-funds`
