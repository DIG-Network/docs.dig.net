---
sidebar_position: 1
title: Build a dapp on Chia
description: "End-to-end: scaffold a React app, wire the in-page Chia wallet (window.chia + WalletConnect fallback) with the dig-sdk, build and sign a spend via the chip35 wasm, then deploy on-chain and add a custom domain — one thread through every DIG primitive."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digstore deploy
  - custom domain
tags:
  - digstore-cli
  - window-chia
  - dig-rpc
  - chip-0035
  - dighub
  - capsule
  - anchoring
---

# Build a dapp on Chia

Every DIG primitive is documented on its own — scaffolding, the in-page wallet, the read path, spends, deploy. **This page is the single thread that ties them together into one shipped dapp.** You'll start from an empty folder and finish with a wallet-aware React app, live on-chain at your own domain.

The whole loop up to publishing is **free** — scaffold, develop, and preview cost nothing. You spend a flat **100 DIG** only at the deploy step.

```
new ──▶ dev ──▶ wire wallet (dig-sdk) ──▶ build a spend (chip35) ──▶ deploy ──▶ custom domain
 free    free          free                       free               100 DIG       free
```

## What you'll need

- The [`digstore` CLI](../digstore/cli/install.md) installed.
- Node 18+ and `npm`.
- A funded Chia wallet — **only at the deploy step** (100 DIG + a small XCH fee). Everything before that is free.

---

## 1. Scaffold a React app — free, no chain

`digstore new` writes a runnable, wallet-wired project. Pick the React template:

```sh
digstore new vite-react my-dapp
cd my-dapp
```

You get a Vite + React app, a `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`), and an `App.jsx` already wired to the in-page wallet. No store is minted and nothing is spent — `new` is purely local.

:::tip Prefer npm? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` scaffolds the same template straight from npm — the JS front door, no `digstore` install needed to start. See [Scaffold an app](./scaffold.md) for all five templates and how the two front doors compare.
:::

## 2. Develop against the real read path — free

```sh
digstore dev
```

`dev` runs your build, serves the output over the **genuine `dig://` read path** (compile → verify → decrypt), and injects a **`window.chia` dev shim** so you can build the wallet flow with no real wallet. Edit `src/App.jsx`, save, and the page live-reloads — exactly what visitors will get, with zero chain interaction and zero spend.

## 3. Wire the wallet with the SDK — `window.chia` + WalletConnect fallback

The scaffold talks to `window.chia` directly, which is perfect inside the [DIG Browser](../browser/using-window-chia.md). To also support users on other browsers, add the SDK — it **prefers the injected `window.chia` wallet and falls back to WalletConnect → Sage** behind one normalized surface, so you write the wallet flow once.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # optional: only for the WalletConnect fallback
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" prefers the injected DIG Browser wallet, else WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // a PUBLIC build-time value
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // render a QR
      },
    });
    setAddress(await provider.getAddress());
  }

  return (
    <main>
      <h1>My DIG dapp</h1>
      <button onClick={login}>Connect wallet</button>
      {address && <p>Connected: {address}</p>}
    </main>
  );
}
```

One `connect()` works in the DIG Browser (no QR, no relay) and everywhere else (WalletConnect). `provider.backend` tells you which transport connected. The method names and result shapes are identical either way — see [Using `window.chia`](../browser/using-window-chia.md) for the integration guide, or [the normative `window.chia` provider spec](../protocol/window-chia-provider.md) for the exact method/param/return/error contract.

:::note The WalletConnect project id is a PUBLIC build-time value
`VITE_WC_PROJECT_ID` is compiled into your bundle and is world-readable — that's correct for a WalletConnect cloud id. **Never** put a wallet seed, deploy key, or any secret in the bundle: a capsule is a [blind static artifact with no server secrets](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Build and sign a spend — the chip35 wasm, via the SDK

When your dapp needs to do something on-chain (mint a store, update metadata, build a CAT payment), it builds the spend with the **canonical CHIP-0035 spend builder** and hands it to the wallet to sign. The SDK re-exports that builder at the `/spend` subpath — you **never hand-roll a spend bundle**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // the chip35 wasm builder

async function doSpend() {
  spend.init();

  // Build coin spends with the wasm builder, e.g. spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). The builder is
  // offline and pure — no keys, no network.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Hand them to the wallet to sign (the wallet holds the keys, not your dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → combine into a spend bundle and broadcast.
}
```

This is the exact pattern the hub uses: **build the bundle in-browser with the wasm, sign it with the wallet.** The spend builder is the single canonical source of spend bundles across the whole ecosystem, so your dapp produces byte-identical spends to the hub and CLI.

To **read** verified, encrypted content back (e.g. render another store's data inside your dapp), use the SDK's `DigClient`:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

`DigClient` derives the URN's keys in the browser, verifies inclusion against the on-chain root, and decrypts — the serving host stays blind. See [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md).

## 5. Deploy on-chain — 100 DIG

You build and preview for free; this is the only step that spends. First create the store **once**:

```sh
digstore init my-dapp --dir dist      # mint the store's first capsule (100 DIG + XCH fee)
```

`init` mints a Chia singleton on mainnet — **the launcher id becomes your store id**. Copy it into `dig.toml` (`store-id = "<64-hex>"`). From then on, one command builds and publishes a new capsule:

```sh
digstore deploy --json                # runs build-command, stages dist/, advances the root
```

Each `deploy` publishes a new immutable capsule for 100 DIG. The moment it confirms, your dapp is **readable over the [dig RPC](../rpc/what-is-the-dig-rpc.md)** by its [URN](../concepts.md#urn) / `dig://` address — encrypted, verified, and impossible to take down, with no registration and nothing more to pay. (A friendly `*.on.dig.net` web address is a separate, optional step — see [the next section](#6-put-it-on-your-own-domain).) For push-to-deploy on every commit, wire up [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## 6. Put it on your own domain

Your store is already reachable by its URN / `dig://` address — but for a friendly web URL you register a name. A store gets a `*.on.dig.net` subdomain when you **register a handle** for it in DIGHub: a separate, paid registration that pins the store to that name (no registration → no `*.on.dig.net` address). To serve it from a domain you own instead, add a **custom domain with TLS in [DIGHub ↗](https://hub.dig.net)** — point your domain at the store and DIGHub handles the certificate. Either way your dapp loads from a human-friendly URL while staying fully decentralized underneath.

When CHIP-54 `.dig` handles land, a store will also be addressable by a human-readable `.dig` name; until then, custom domains via DIGHub are the way to brand a deployment.

---

## You shipped a dapp

You went from an empty folder to a wallet-aware React app, live on Chia mainnet at your own domain — touching every primitive: [scaffolding](../digstore/cli/quickstart.md), the [in-page wallet](../browser/using-window-chia.md), the [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), the [spend builder](https://github.com/DIG-Network/chip35_dl_coin), the [read path](../rpc/what-is-the-dig-rpc.md), and [deploy](../digstore/cli/deploy-from-github-actions.md). Clone a finished version from the [example gallery](./example-gallery.md).

## Related

- [Scaffold an app (create-dig-app)](./scaffold.md) — the five templates and the npm vs CLI front doors
- [Example gallery](./example-gallery.md) — clone a finished dapp and open it in a template
- [Using window.chia](../browser/using-window-chia.md) — the in-page wallet provider in full
- [The window.chia provider spec](../protocol/window-chia-provider.md) — the normative, versioned provider contract
- [Project config & build-time values](../digstore/cli/configuration.md) — dig.toml + PUBLIC config
- [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-deploy in CI
- [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) — reading verified, encrypted content
- [Quickstart](../quickstart.md) — the shorter "ship a site" path
- [Concepts & glossary](../concepts.md) — capsule, store, URN, and window.chia defined
