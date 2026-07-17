---
sidebar_position: 2
title: Using `window.chia` in your app
description: "Detect and use the DIG Browser's injected Chia wallet provider for permission-gated key and signing operations."
keywords:
  - window.chia
  - CHIP-0002
  - injected wallet
  - WalletConnect alternative
  - DIG Browser
  - Sage
tags:
  - window-chia
  - browser
  - chip-0002
  - chia-protocol
  - dighub
---

# Using `window.chia` in your app

**The DIG Browser and the DIG Chrome extension each inject a Chia wallet provider on `window.chia` into every page.** Your web app can ask the built-in wallet for the user's address, request signatures, and submit spends — without WalletConnect, without a QR code, and without a relay. It is a **drop-in WalletConnect alternative** that works automatically for anyone visiting your app inside the DIG Browser or with the extension installed.

The provider speaks [CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md) (the Chia wallet provider interface), so the method names and result shapes match what a CHIP-0002 wallet returns over WalletConnect. If you already integrate Sage over WalletConnect, the same calls work here — you just route them through `window.chia` instead of a WalletConnect session.

:::note Audience
This page is for **developers integrating a wallet into a web app**. It documents the public provider surface only; the wallet's internals (key derivation, the loopback signer, on-chain spends) are covered in the [dig-store](../digstore/what-is-digstore.md) and [dig RPC](../rpc/what-is-the-dig-rpc.md) sections.
:::

## How it works

The provider is a thin proxy. Each call is forwarded to the browser's built-in wallet, where the **native signer** lives. Two things matter for integrators:

- **Per-origin consent.** The wallet gates access by your web **origin**, supplied by the browser process from the frame's unspoofable committed origin — page JavaScript cannot forge it. Until the user approves your origin in the wallet's Connections view, every key/sign method is refused. Your app must call [`connect()`](#connect) first; it resolves once the user approves.
- **It works on any dapp, including HTTPS with a strict CSP.** The provider reaches the wallet over a frame-scoped native bridge (not `fetch`, not loopback HTTP), so there is no mixed-content error and nothing for your page's Content-Security-Policy to block. Security is the per-origin approval gate, not the network boundary.

:::tip Want the exact contract?
This page is the task-oriented guide. For the **normative, versioned** provider contract — every method's params/returns, the error codes, the connect/202-pending contract, capability detection, and EIP-6963-style multi-wallet discovery — see [The `window.chia` provider spec](../protocol/window-chia-provider.md).
:::

## Detecting the provider

Check for `window.chia` **and** its `isDIG` marker. The marker confirms you're talking to the DIG Browser's provider specifically (not some other injected wallet), so use it rather than the bare presence of `window.chia`:

```js
function getDigProvider() {
  const p = typeof window !== "undefined" ? window.chia : undefined;
  return p && p.isDIG ? p : undefined;
}
```

The provider is injected at document start, so it is present synchronously on load. It also fires a `chia#initialized` event on `window` once it is in place. Beyond `isDIG`, the provider carries `isGoby`, `name`, `apiVersion`, `info`, and a `methods` catalogue, and exposes an `isConnected()` method plus `chainId` / `selectedAddress` getters — the [provider reference](./window-chia-reference.md#provider-object) lists them all.

## `connect(options?)` {#connect}

```js
const ok = await window.chia.connect();                    // prompt the user to approve this origin
const eager = await window.chia.connect({ eager: true });  // try to reconnect a previously approved origin
```

`connect({ eager?, scope? })` asks the DIG wallet to approve **your origin** and resolves to a **`boolean`** (`true` on success). It **blocks until the user approves** (or rejects, or it times out), then emits [`connect`](#events) and [`accountChanged`](#events) and caches the address.

- Pass `eager: true` to attempt a silent reconnect for an origin the user already approved (e.g. on page load), so returning users don't see a prompt.
- `scope` is `"full"` (default) or `"read-only"`.
- Approval is **per-origin** and persists across browser restarts, so a user approves your site once.

You must `connect()` before any key, balance, coin, or signing method. A call from an unapproved origin is refused with error code [`4001`](./window-chia-reference.md#errors) — call `connect()`, have the user approve, then retry.

## `request({ method, params })` {#request}

```js
const { address } = await window.chia.request({ method: "chia_getAddress" });
```

`request` takes a single object with a `method` name and a `params` object, and resolves to the **bare result the wallet returns** (the same value a CHIP-0002 wallet would return over WalletConnect). Errors throw with a numeric CHIP-0002 [`.code`](#handling-errors).

Method names may be passed **bare or namespaced** — a bare name like `getPublicKeys` is auto-prefixed to `chip0002_getPublicKeys`; names already starting with `chip0002_` or `chia_` are used as-is. The provider also exposes **direct methods** (`window.chia.getPublicKeys(...)`, `window.chia.transfer(...)`) whose bare names alias the namespaced forms, so code written for a Goby- or Sage-shaped provider works unchanged.

### Common methods

The methods you'll reach for most often:

| Method | `params` | Returns |
|---|---|---|
| `chip0002_getPublicKeys` | — | Public keys (hex), across both HD schemes. |
| `chia_getAddress` | — | `{ address }` — the wallet's receive address (`xch1…`). |
| `chip0002_getAssetBalance` | `{ type, assetId }` — `null`/`null` for XCH, `type:"cat"` + TAIL `assetId` for a CAT | `{ confirmed, spendable, spendableCoinCount }` (base-unit strings). |
| `chia_send` (alias `transfer`) | `{ to, amount, assetId?, fee? }` (base units) | `{ id }` — shows an approval prompt. |
| `chia_signMessageByAddress` | `{ message, address }` | `{ signature, publicKey }` — the login-challenge path. |

The full catalogue — every read, every write (transfers, offers, signing), each param and return shape — is the [**`window.chia` provider reference**](./window-chia-reference.md). Result shapes are byte-compatible with Sage's, so client code that parses a Sage/WalletConnect response parses these unchanged.

:::note
There is **no key-export or seed-reveal method** on this surface. The recovery phrase and projectId settings are reachable only from the wallet's own UI — never from a page, a WalletConnect session, or `window.chia`.
:::

## Handling errors {#handling-errors}

A rejected call throws an `Error` with a numeric CHIP-0002 **`.code`** — branch on the code, not the message. The ones you'll handle most: **`4001`** (not connected / locked — `connect()` first), **`4002`** (the user declined the prompt), **`4003`** (spendable balance exceeded), and **`4004`** (method not implemented). See the [full error-code table](./window-chia-reference.md#errors).

## Events {#events}

Subscribe with `on(event, fn)` and unsubscribe with `off(event, fn)`:

```js
function onConnect(info) { /* origin approved */ }
window.chia.on("connect", onConnect);
// later…
window.chia.off("connect", onConnect);
```

The provider emits `connect` when your origin is approved (including via an eager reconnect), `accountChanged` when the active address changes (also on connect), and `chainChanged` if the active chain changes (mainnet-only, so this does not fire in normal use). `off` is also aliased as `removeListener`.

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

:::tip Try it
[**Download the DIG Browser to test `window.chia` ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — run your app inside the browser to detect the injected provider and call CHIP-0002 methods for real.
:::

## Related

- [The window.chia provider reference](./window-chia-reference.md) — every method, param, return, event, and error code
- [Wallet security](./wallet-security.md) — how the built-in wallet protects the user's keys
- [The window.chia provider spec](../protocol/window-chia-provider.md) — the normative, versioned provider contract
- [The chia:// protocol](./chia-protocol.md) — the browser's native content-address scheme
- [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) — how the browser reads content from the network
- [What is dig-store?](../digstore/what-is-digstore.md) — the store format a `chia://` page is served from
- [Concepts & glossary](../concepts.md) — window.chia and the chia:// protocol defined
