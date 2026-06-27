---
sidebar_position: 2
title: Using window.chia in your app
---

# Using `window.chia` in your app

**The DIG Browser injects a Chia wallet provider on `window.chia` into every page.** Your web app can ask the browser's built-in wallet for the user's address, request signatures, and submit spends — without WalletConnect, without a QR code, and without a relay. It is a **drop-in WalletConnect alternative** that works automatically for anyone visiting your app inside the DIG Browser.

The provider speaks [CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md) (the Chia wallet provider interface), so the method names and result shapes match what a CHIP-0002 wallet returns over WalletConnect. If you already integrate Sage over WalletConnect, the same calls work here — you just route them through `window.chia` instead of a WalletConnect session.

:::note Audience
This page is for **developers integrating a wallet into a web app**. It documents the public provider surface only; the wallet's internals (key derivation, the loopback signer, on-chain spends) are covered in the [DigStore](../digstore/what-is-digstore.md) and [dig RPC](../rpc/what-is-the-dig-rpc.md) sections.
:::

## How it works

The provider is a thin proxy. Each call is forwarded to the browser's built-in wallet over loopback, where the **native signer** lives. Two things matter for integrators:

- **Per-origin consent.** The wallet gates access by your web **origin**, read from the unspoofable HTTP `Origin` header — page JavaScript cannot forge it. Until the user approves your origin in the wallet's Connections view, every key/sign method is refused. Your app must call [`connect()`](#connect) first; it resolves once the user approves.
- **It's loopback, so HTTPS pages work.** The wallet listens on `127.0.0.1`, a "potentially trustworthy" origin, so an `https://` page can reach it with no mixed-content error. Security is the per-origin approval gate, not the network boundary.

## Detecting the provider

Check for `window.chia` **and** its `isDIG` marker. The marker confirms you're talking to the DIG Browser's provider specifically (not some other injected wallet), so use it rather than the bare presence of `window.chia`:

```js
function getDigProvider() {
  const p = typeof window !== "undefined" ? window.chia : undefined;
  return p && p.isDIG ? p : undefined;
}
```

The provider is injected at document start, so it is present synchronously on load. It also fires a `chia#initialized` event on `window` once it is in place, and exposes a boolean `isConnected` that flips to `true` after a successful `connect()`.

## `connect(eager?)` {#connect}

```js
await window.chia.connect();        // prompt the user to approve this origin
await window.chia.connect(true);    // "eager": try to reconnect a previously approved origin
```

`connect()` asks the DIG Browser wallet to approve **your origin**. It **blocks until the user approves** (or rejects, or it times out) — when an approval is pending it polls the wallet until the user acts, then resolves. On success it sets `window.chia.isConnected = true` and emits a [`connect`](#events) event.

- Pass `eager: true` to attempt a silent reconnect for an origin the user already approved (e.g. on page load), so returning users don't see a prompt.
- A rejection or timeout throws. Approval is **per-origin** and persists across browser restarts, so a user approves your site once.

You must `connect()` before any key or signing method. A key/sign call from an unapproved origin is refused — call `connect()` and have the user approve, then retry.

## `request({ method, params })` {#request}

```js
const { address } = await window.chia.request({ method: "chia_getAddress" });
```

`request` takes a single object with a `method` name and a `params` object, and resolves to the **bare result the wallet returns** (the same value a CHIP-0002 wallet would return over WalletConnect). Errors throw.

Method names may be passed **bare or namespaced** — a bare name like `getPublicKeys` is auto-prefixed to `chip0002_getPublicKeys`. Names already starting with `chip0002_` or `chia_` are used as-is. Prefer the explicit namespaced names below for clarity.

### Supported methods

| Method | `params` | Returns |
|---|---|---|
| `chip0002_getPublicKeys` | `{ offset?, limit? }` (defaults to the first 10 keys; `limit` is clamped) | Array of synthetic public keys (hex). |
| `chip0002_signMessage` | `{ message, publicKey }` | A signature over `message` by the given key. |
| `chip0002_signCoinSpends` | `{ coinSpends }` | A signature over the supplied coin spends. |
| `chip0002_getAssetBalance` | `{ type?, assetId? }` — `type: null` for XCH, `type: "cat"` for a CAT (the DIG CAT) | `{ confirmed, spendable }`. |
| `chip0002_getAssetCoins` | `{ type?, assetId?, offset?, limit? }` | `{ coins: [...] }` in Sage's `SpendableCoin` shape (`{ coin{parent_coin_info,puzzle_hash,amount}, locked, spent_block_index }`; XCH entries also carry `puzzle`). |
| `chia_getAddress` | `{}` | `{ address }` — the wallet's receive address (`xch1…`). |
| `chia_signMessageByAddress` | `{ message, address }` | A signed-message result for `message` under `address`. |
| `chia_takeOffer` | `{ offer, fee? }` | Accepts an offer (build + sign the taker side); returns a transaction-shaped result. |

These map to the wallet's native CHIP-0002 signer; the result shapes are byte-compatible with Sage's, so client code that parses a Sage/WalletConnect response parses these unchanged.

:::note
There is **no key-export or seed-reveal method** on this surface. The recovery phrase and projectId settings are reachable only from the wallet's own UI — never from a page, a WalletConnect session, or `window.chia`.
:::

## Events {#events}

Subscribe with `on(event, fn)` and unsubscribe with `off(event, fn)`:

```js
function onConnect(info) { /* origin approved */ }
window.chia.on("connect", onConnect);
// later…
window.chia.off("connect", onConnect);
```

The `connect` event fires when your origin is approved (including via an eager reconnect).

## Recommended pattern: prefer `window.chia`, fall back to WalletConnect

Write your app to **use `window.chia` when it's present, and fall back to WalletConnect/Sage otherwise.** Inside the DIG Browser, users connect with one click and no QR; everywhere else, your existing WalletConnect flow runs unchanged. Because the method names and result shapes are identical, the only branch is *how you send the request* — injected provider vs. relay.

This is exactly what `hub.dig.net` does:

- It detects the provider with `isDIG` (see `apps/web/lib/injected-wallet.js`).
- At connect time it branches: if the injected provider is available it calls `window.chia.connect()` (no relay, no pairing URI); otherwise it opens a WalletConnect session (`apps/web/lib/wallet-context.jsx`).
- All subsequent calls route through one `request(...)` helper that sends to `window.chia` when the injected backend is active, and to the WalletConnect relay otherwise (`apps/web/lib/walletconnect.js`). The wallet method calls themselves (`apps/web/lib/sage.js`) are written once and don't care which backend is underneath.

The [CHIP-0035 DataLayer demo](https://github.com/DIG-Network/chip35_dl_coin) is a WalletConnect-only reference for the same methods (`chia_getAddress`, `chip0002_getAssetCoins`, `chip0002_signCoinSpends`) — useful as the "fallback" half of the pattern.

### Minimal example: detect → connect → get address → sign

```js
// Prefer the DIG Browser's injected wallet; fall back to your WalletConnect flow.
async function login() {
  const dig = (window.chia && window.chia.isDIG) ? window.chia : undefined;

  if (dig) {
    // 1. Ask the user to approve this origin (one click in the DIG Browser).
    await dig.connect();

    // 2. Read the wallet's address.
    const { address } = await dig.request({ method: "chia_getAddress" });

    // 3. Prove ownership by signing a login challenge with that address.
    const signed = await dig.request({
      method: "chia_signMessageByAddress",
      params: { address, message: `Sign in to ${location.host}` },
    });

    return { address, signed };
  }

  // Not in the DIG Browser → use your existing WalletConnect / Sage path.
  return loginWithWalletConnect();
}
```

That's the whole integration: a one-line detection, a `connect()`, and CHIP-0002 calls you may already make over WalletConnect. Inside the DIG Browser your app gets a built-in wallet for free; outside it, nothing changes.

:::tip
Pages served from a `chia://` store run inside the DIG Browser too, so `window.chia` is available there as well — a store you publish can ship a fully wallet-aware front end with no external wallet setup.
:::
