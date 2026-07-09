---
sidebar_position: 3
title: The `window.chia` provider reference
description: "The integrating-developer reference for the DIG window.chia wallet provider — the provider object fields, connect, events, every read and write method with params and returns, and the CHIP-0002 error codes to branch on."
schema_type: TechArticle
keywords:
  - window.chia
  - CHIP-0002
  - Chia wallet provider
  - wallet methods
  - error codes
  - DIG Browser
tags:
  - window-chia
  - browser
  - chip-0002
  - dig-sdk
  - chia-protocol
  - dighub
---

# The `window.chia` provider reference

The **DIG Browser** (its built-in wallet) and the **DIG Chrome extension** (self-custody) inject a Chia wallet provider on `window.chia`. Any web page can ask it for the user's address, public keys, balances, coins, and NFTs, and can request signatures, transfers, and offers — the CHIP-0002 wallet-provider interface, delivered in-page instead of over WalletConnect.

This is the **reference**: the provider object's fields, `connect`, the events, and every method with its params, return shape, and error codes. For a walkthrough with the recommended detect → connect → fallback pattern, start with [Using `window.chia`](./using-window-chia.md). For a typed wrapper that unifies this surface with the WalletConnect fallback, use [`@dignetwork/dig-sdk`](../sdk.md)'s `ChiaProvider`.

:::note DIG is Chia mainnet-only
Every call runs against **Chia mainnet**. There is no testnet flow: [`chip0002_chainId`](#reads) resolves to `"mainnet"`, and the `chainId` getter reads the same value once connected.
:::

## The provider object {#provider-object}

`window.chia` is present synchronously on first script execution. Confirm you are talking to the DIG provider with its `isDIG` marker rather than the bare presence of `window.chia` (another Chia wallet could also claim the slot).

| Field | Type | Meaning |
|---|---|---|
| `isDIG` | `true` | Marks the DIG provider. Key on this to target the DIG wallet specifically. |
| `isGoby` | `true` | Goby-compatibility marker, so a page that feature-detects a Goby-style provider finds this one. |
| `name` | `"DIG"` | The provider name. |
| `apiVersion` | `string` | Semantic version of the `window.chia` surface (e.g. `"1.0.0"`). |
| `version` | `string` | The wallet build version. |
| `info` | `object` | `{ isDIG, transport: "injected" \| "native", edition: "extension" \| "browser", providerVersion }` — how the provider is delivered and which edition injected it. |
| `methods` | `string[]` | The method names this provider answers (the catalogue — feature-detect against it). |
| `errorCodes` | `object` | The numeric [error-code](#errors) enum, exposed for reference. |
| `chainId` | getter → `string` | `"mainnet"` once connected. |
| `selectedAddress` | getter → `string` | The connected address (cached after `connect`). |
| `isConnected()` | `() => boolean` | Whether this origin is connected. |

Two call styles are supported and equivalent:

- **`request({ method, params })`** — the EIP-1193-style entrypoint (below).
- **Direct methods** — `provider.getPublicKeys(...)`, `provider.transfer(...)`, `provider.createOffer(...)`, and so on. Bare Goby/Sage-style names alias to their namespaced forms (`transfer` → `chia_send`, `getPublicKeys` → `chip0002_getPublicKeys`), so code written for a Goby- or Sage-shaped provider works unchanged.

```js
// Equivalent — pick whichever style your code prefers.
const keys = await window.chia.request({ method: "chip0002_getPublicKeys" });
const keys2 = await window.chia.getPublicKeys();
```

### `request({ method, params })` {#request}

`request` takes a single `{ method, params }` object and resolves to the **bare result** the wallet returns for that method, rejecting with an [error](#errors) on failure. A **bare** method name (e.g. `getPublicKeys`) is auto-prefixed to the `chip0002_` namespace; a name already starting with `chip0002_` or `chia_` is used as-is. Prefer the explicit namespaced names in the tables below.

### Discovering the method catalogue {#discovery}

Read `window.chia.methods` directly, or ask the provider (answered locally, no user prompt):

```js
const methods = await window.chia.request({ method: "chip0002_getMethods" }); // string[]
```

## `connect` {#connect}

```js
const ok = await window.chia.connect();                       // prompt to approve this origin
const eager = await window.chia.connect({ eager: true });     // silently reuse a prior approval
```

`connect({ eager?, scope? })` establishes per-origin consent and resolves to a **`boolean`** (`true` on success). It caches the connected address and fires the [`connect`](#events) and [`accountChanged`](#events) events.

- `eager: true` attempts a silent reconnect for an already-approved origin without prompting — use it on page load so returning users don't see a prompt.
- `scope` is `"full"` (default) or `"read-only"`.
- Approval is **per-origin**; the user approves your site once.

You must `connect()` before any key, balance, coin, or signing method. Two more account helpers:

| Method | Returns | Notes |
|---|---|---|
| `requestAccounts()` | `string[]` | Prompts for approval if needed, then returns the wallet's addresses. |
| `accounts()` | `string[]` | The already-approved addresses; rejects with [`4900`](#errors) if not connected. |

## Events {#events}

Subscribe with `on(event, handler)`, unsubscribe with `off(event, handler)` (also aliased as `removeListener`):

```js
function onAccount(addr) { /* active address changed */ }
window.chia.on("accountChanged", onAccount);
window.chia.off("accountChanged", onAccount);
```

| Event | Fires when |
|---|---|
| `connect` | This origin is approved (including via an eager reconnect). |
| `accountChanged` | The active address changes (also emitted on connect). |
| `chainChanged` | The active chain changes. (Mainnet-only, so this does not fire in normal use.) |

## Read methods {#reads}

Reads require a connected origin but **never** show an approval prompt.

| Method | `params` | Returns |
|---|---|---|
| `chip0002_chainId` | — | `"mainnet"`. |
| `chip0002_getPublicKeys` | — | `string[]` — hex public keys across both HD derivation schemes. |
| `chia_getAddress` | — | `{ address }` — the wallet's receive address (bech32m `xch1…`). |
| `chip0002_getAssetBalance` | `{ type, assetId }` | `{ confirmed, spendable, spendableCoinCount }` — see below. |
| `chip0002_getAssetCoins` | `{ type, assetId }` | `SpendableCoin[]` — see below. |
| `chip0002_filterUnlockedCoins` | `{ coins }` | The subset of the supplied `coins` that are unlocked (spendable) for this wallet. |
| `chia_getNfts` (alias `getNFTs`) | — | The wallet's NFTs as an array; each entry carries `launcherId`, `coinId`, and edition / royalty / URI metadata. |

**Selecting an asset.** For `getAssetBalance` and `getAssetCoins`, pass `type: null` **and** `assetId: null` for native **XCH**; pass `type: "cat"` with the CAT's 32-byte **TAIL** `assetId` (hex) to select that CAT.

**`getAssetBalance` shape.** `confirmed`, `spendable` are base-unit amounts as decimal **strings** (mojos for XCH); `spendableCoinCount` is a number. `confirmed === spendable`.

```js
const bal = await window.chia.request({
  method: "chip0002_getAssetBalance",
  params: { type: null, assetId: null }, // native XCH
});
// { confirmed: "1000000000000", spendable: "1000000000000", spendableCoinCount: 3 }
```

**`SpendableCoin` shape.** Each entry is:

```js
{
  coin: { parentCoinInfo: string, puzzleHash: string, amount: string },
  coinName: string,
  locked: boolean
}
```

## Write methods {#writes}

Each write shows an **approval prompt**; the user must confirm before anything is signed or broadcast. Amounts and fees are in **base units** (mojos for XCH).

| Method | `params` | Returns |
|---|---|---|
| `chia_send` (aliases `transfer`, `send`) | `{ address \| to, amount, assetId?, fee? }` — `amount` is a string or number; `assetId` selects a CAT (omit for XCH) | `{ id }` — the transaction id. |
| `chia_sendTransaction` | `{ spendBundle: { coin_spends: [...], aggregated_signature } }` — broadcast an already-signed bundle | `TransactionResp[]` — `[{ status }]`; `status` is a MempoolInclusionStatus (`1` = success). |
| `chia_createOffer` | `{ offerAssets: [{ assetId?, amount }], requestAssets: [{ assetId?, amount }], fee? }` — exactly one offered and one requested asset; omit `assetId` for XCH | `{ offer }` — an `offer1…` string. |
| `chia_takeOffer` | `{ offer, fee? }` | `{ id }` — the transaction id. |
| `chia_cancelOffer` | `{ offer, fee? }` | `{ id }` — the transaction id. |
| `chip0002_signCoinSpends` | `{ coinSpends }` | `string` — the aggregated BLS signature (hex); your dApp broadcasts the signed bundle. |
| `chip0002_signMessage` (alias `chia_signMessageByAddress`) | `{ message, publicKey? }` | `{ signature, publicKey }`. |

```js
// Send 0.25 XCH (base units = mojos). Shows an approval prompt.
const { id } = await window.chia.request({
  method: "chia_send",
  params: { to: "xch1…", amount: "250000000000", fee: "0" },
});
```

## Error codes {#errors}

A rejected call throws an `Error` carrying a numeric **`.code`** (CHIP-0002). Branch on `.code`, not on the message string.

| Code | Name | Meaning |
|---|---|---|
| `4000` | `INVALID_PARAMS` | A parameter is missing or malformed. |
| `4001` | `UNAUTHORIZED` | Not connected, or the wallet is locked. Call [`connect()`](#connect) first. |
| `4002` | `USER_REJECTED` | The user declined the prompt, or a `connect` approval timed out. |
| `4003` | `SPENDABLE_BALANCE_EXCEEDED` | The spend exceeds the spendable balance. |
| `4004` | `METHOD_NOT_FOUND` | The method is unsupported or not implemented (see below). |
| `4005` | `NO_SECRET_KEY` | No signing key is available for the request. |
| `4029` | `LIMIT_EXCEEDED` | A rate/size limit was exceeded. |
| `4900` | `DISCONNECTED` | The provider is not connected to an approved origin. |

`4002` (the user said no) is distinct from `4001` (not authorized) — branch on them separately.

:::note Unimplemented methods return `4004`
Methods outside the read/write sets above — such as DID management and NFT minting / bulk-minting — are **not implemented** and reject with `4004` (`METHOD_NOT_FOUND`). Feature-detect against [`window.chia.methods`](#discovery) before calling anything beyond the tables here.
:::

## Getting started {#getting-started}

Feature-detect the provider, connect, read an address and balance, send a transfer, and branch on the error code:

```js
async function demo() {
  const dig = (typeof window !== "undefined" && window.chia?.isDIG) ? window.chia : undefined;
  if (!dig) return; // Not in the DIG Browser / extension — use your WalletConnect fallback.

  try {
    const connected = await dig.connect();      // → true on approval
    if (!connected) return;

    const { address } = await dig.request({ method: "chia_getAddress" });

    const balance = await dig.request({
      method: "chip0002_getAssetBalance",
      params: { type: null, assetId: null },    // native XCH
    });

    // Shows an approval prompt; amount + fee are in mojos.
    const { id } = await dig.request({
      method: "chia_send",
      params: { to: address, amount: "1", fee: "0" },
    });

    return { address, balance, id };
  } catch (err) {
    if (err.code === 4002) return;              // user declined — not an error to surface
    if (err.code === 4001) {                    // not connected / locked
      await dig.connect();
      return;
    }
    throw err;
  }
}
```

## Related

- [Using window.chia](./using-window-chia.md) — the detect → connect → fallback integration guide
- [Wallet security](./wallet-security.md) — how the built-in wallet protects the user's keys
- [The window.chia provider spec](../protocol/window-chia-provider.md) — the normative, versioned provider contract
- [The DIG SDK](../sdk.md) — `ChiaProvider` unifies this surface with the WalletConnect fallback
- [The chia:// protocol](./chia-protocol.md) — the browser's native content-address scheme
- [Error codes](../support/error-codes.md) — the ecosystem-wide error vocabulary
- [Concepts & glossary](../concepts.md) — window.chia and the chia:// protocol defined
