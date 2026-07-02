---
sidebar_position: 7
title: The DIG SDK
description: "@dignetwork/dig-sdk — ChiaProvider (injected window.chia + WalletConnect→Sage), DigClient (verified reads), Paywall (pay-to-unlock / NFT-gating), and the canonical CHIP-0035 spends at the /spend subpath."
keywords:
  - dig-sdk
  - ChiaProvider
  - DigClient
  - Paywall
  - chip35 spend
  - npm
tags:
  - dig-sdk
  - window-chia
  - dig-rpc
  - chip-0035
---

# The DIG SDK

`@dignetwork/dig-sdk` is the typed npm package for integrating developers. It unifies **one wallet surface over two transports**, reads **verified** content, monetizes access, and re-exports the **canonical spend builder** — so you wire DIG into your app without scraping prose or hand-rolling a spend.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # optional: only for the WalletConnect fallback
```

## What's in it

| Export | Subpath | What it does |
|---|---|---|
| `ChiaProvider` | `@dignetwork/dig-sdk` | One wallet API; prefers injected [`window.chia`](./browser/using-window-chia.md), falls back to WalletConnect → Sage |
| `DigClient` | `@dignetwork/dig-sdk` | Reads verified, encrypted content over the [dig RPC](./rpc/what-is-the-dig-rpc.md) — verify-then-decrypt, client-side |
| `Paywall` | `@dignetwork/dig-sdk` | High-level pay-to-unlock / NFT-or-collection ownership gating |
| canonical CHIP-0035 spend builder | `@dignetwork/dig-sdk/spend` | The wasm that builds every coin spend — [never hand-rolled](./spends.md) |

## `ChiaProvider` — connect a wallet

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";

// "auto" prefers the injected DIG Browser wallet, else WalletConnect → Sage.
const provider = await ChiaProvider.connect({ mode: "auto" });
const address = await provider.getAddress();
// provider.backend tells you which transport connected.
```

One `connect()` works in the [DIG Browser](./browser/using-window-chia.md) (no QR, no relay) and everywhere else (WalletConnect). The method names and result shapes are identical either way; the exact contract is the [normative `window.chia` provider spec](./protocol/window-chia-provider.md).

## `DigClient` — read verified content

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

It derives the URN's keys in the browser, [verifies inclusion](./digstore/format/proofs-and-security.md) against the on-chain root, and decrypts — the serving host stays blind. → [What is the dig RPC?](./rpc/what-is-the-dig-rpc.md)

## `Paywall` — monetize & gate {#paywall}

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });

const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }

// or gate on ownership instead of payment:
await paywall.proveAccess({ collection: "<collection-id>" });
```

`Paywall` composes a connected `ChiaProvider` with the spend builder so you don't wire payments by hand.

## `capabilities()`

`ChiaProvider` exposes `capabilities()` so you can introspect which methods and transports are available before you call them — discover, don't assume.

## `/spend` — the canonical builder

The CHIP-0035 wasm is re-exported at the `/spend` subpath. **Never hand-roll a spend bundle** — see [Building spends](./spends.md).

## Related

- [Build a dapp on Chia](./build-a-dapp/tutorial.md) — the SDK in an end-to-end app
- [Building spends](./spends.md) — the build → sign → broadcast split
- [Using window.chia](./browser/using-window-chia.md) · [provider spec](./protocol/window-chia-provider.md)
- [What is the dig RPC?](./rpc/what-is-the-dig-rpc.md) · [Machine-readable surfaces](./machine-surfaces.md)
