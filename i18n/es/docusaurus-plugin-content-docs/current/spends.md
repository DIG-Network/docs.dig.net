---
sidebar_position: 8
title: Building spends
description: "Every on-chain action is built by the canonical CHIP-0035 wasm, signed by the user's wallet, and broadcast — the build → sign → broadcast split. Never hand-roll a spend bundle."
keywords:
  - chip35 spend
  - build sign broadcast
  - coin spend
  - spend bundle
  - dig-sdk spend
tags:
  - chip-0035
  - dig-sdk
  - window-chia
---

# Building spends

When your app does something on-chain — mint a store, advance a capsule, pay in $DIG, mint an NFT — it builds the spend with the **canonical CHIP-0035 spend builder** and hands it to the wallet to sign. **You never hand-roll a spend bundle.** This is the exact pattern the hub and CLI use, so your app produces byte-identical spends.

## The build → sign → broadcast split

1. **Build** — the wasm builder constructs the coin spends. It is offline and pure: no keys, no network.
2. **Sign** — the user's wallet (which holds the keys, not your app) signs them.
3. **Broadcast** — combine into a spend bundle and push it to the network.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // the chip35 wasm builder

spend.init();

// 1. BUILD with the wasm — e.g. spend.mintStore(...) / spend.updateStoreMetadata(...) /
//    spend.buildDigPayment(...). Pure + offline.
const coinSpends = /* spend.mintStore({ ... }) */ [];

// 2. SIGN with the wallet (keys live in the wallet, never in your app).
const provider = await ChiaProvider.connect({ mode: "auto" });
const aggregatedSignature = await provider.signCoinSpends(coinSpends);

// 3. BROADCAST — combine into a spend bundle and push it.
```

## Why never hand-roll

The CHIP-0035 wasm is the **single canonical source** of spend bundles across the whole ecosystem (CLI, hub, SDK). Hand-rolling a puzzle or a coin spell risks producing a coin that doesn't match the on-chain layout the network expects — and silently burning funds. Building through the wasm guarantees your spend is the same the rest of DIG produces.

Delegation (admin / writer / oracle) — the primitive behind Teams and CI deploy tokens — is built the same way through the wasm, never as a hand-written puzzle.

## Related

- [The DIG SDK](./sdk.md) — `/spend` and the wallet provider
- [CHIP-0035 store-coin spends & delegation](./chip-0035-spends-and-delegation.md) — the protocol-level detail
- [Build a dapp on Chia](./build-a-dapp/tutorial.md) — a spend in context
