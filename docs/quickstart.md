---
sidebar_position: 2
title: Quickstart
description: "Ship your first site on DIG — free to build and preview, you only spend 100 DIG when you publish. Web-first path (no wallet to start) plus a parallel CLI track."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Quickstart

Ship a site to a network no host can read, change, or take down — in about ten minutes.

**You build and preview for free.** Scaffolding and previewing cost nothing; you spend a flat **100 $DIG** only at the moment you publish a [capsule](./concepts.md#capsule) on-chain. *Iterate for free, publish when it's ready.*

Two ways to do it. Most people start on the web.

- **[A. Publish from the web](#a-publish-from-the-web)** — in [DIGHUb](./concepts.md#dighub), connect a wallet at the end. Best for sites and frontends. ~10 min.
- **[B. Publish from the CLI](#b-publish-from-the-cli)** — `digstore` on your machine, scriptable and CI-ready. Best for devs and automation.

---

## A. Publish from the web

The fastest path: build and preview in the browser, fund a wallet only at the final step.

### 1. Open DIGHUb and start a draft — free, no wallet

[**Start a new project in DIGHUb ↗**](https://hub.dig.net/new). Drop in your built site (a folder of static files — your `dist/` or `build/`). DIGHUb gives you a **free draft preview** of exactly how it will serve, with nothing on-chain and no DIG spent.

You don't need a wallet yet. Iterate on the draft as many times as you like — re-upload, re-preview — entirely for free.

### 2. Preview it on the real read path — still free

The preview renders your site through the genuine DIG pipeline (encrypt → compile → verify → decrypt), so what you see is what visitors get. Click around, check assets and routing. Nothing is published and nothing is spent until you choose to.

### 3. Publish — fund and connect a wallet (100 DIG)

When the draft looks right, hit **Publish**. This is the only step that costs anything:

- Connect a Chia wallet (your wallet *is* your account — no email, no password).
- Approve the on-chain spend: a flat **100 DIG + a small XCH fee**, in one signature.
- DIGHUb mints your store and publishes the first **capsule** on Chia mainnet.

Short on DIG? The publish screen shows your balance and where to top up. See [Where to get DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space, or 9mm.pro.

### 4. You're live

Your capsule is now anchored on-chain and **immediately readable over the [dig RPC](./concepts.md#dig-rpc)** — anyone can fetch and verify it by its [`urn:dig:` URN](./concepts.md#urn) or [`chia://`](./browser/chia-protocol.md) address, no registration and nothing more to pay. The URN is both the address *and* the key; share it to share the content. The read path is universal and free; it's live the moment the capsule confirms.

**Want a human-friendly `*.on.dig.net` address?** That's optional. A store gets a `*.on.dig.net` subdomain only when you **register a handle** for it in DIGHUb — a separate, paid registration that pins the store to that name. Until you register one, there's no `*.on.dig.net` URL (the URN / `chia://` address above is always the canonical way to reach it). See [Can I use my own domain?](./support/faq.md#can-i-use-my-own-domain).

**To ship an update later:** edit, preview the new draft for free, and Publish again. Each published update is a new capsule and costs another **100 DIG** — you only pay when you promote a draft to a permanent on-chain version.

:::tip Automate it
Once your store exists, wire up [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md) so every push to `main` publishes a new capsule — git-push-to-deploy.
:::

---

## B. Publish from the CLI

The same flow from your terminal — scriptable and the basis for CI. The CLI mirrors the web path: build and preview cost nothing; publishing a capsule costs 100 DIG.

### 1. Install

```sh
# download the installer for your OS from the Releases page, then:
digstore --version
```

See [Installing the CLI](./digstore/cli/install.md) for per-OS installers and build-from-source.

### 2. Scaffold and preview — free, no chain, no spend

Scaffold a project and preview it locally — **free, no mint, no chain** — before you ever spend:

```sh
digstore new <template>   # scaffold a wallet-wired project (static · vite-react · next-static · nft-drop · dapp-window-chia) — free, no mint
digstore dev              # watch + compile-on-save + serve the real dig:// read path, with an injected window.chia — free, live-reload
```

`new` writes a runnable project (a `dig.toml` + a starter app); `dev` serves it over the genuine DIG read path (compile → verify → decrypt) with live reload. You spend the 100 DIG only when you publish (next steps). Or build with your usual toolchain (`npm run build` → `dist/`) and publish that output.

:::tip Prefer npm? Use `create-dig-app`
If you live in the Node world, `npm create dig-app@latest my-app -- --template vite-react` scaffolds the same templates straight from npm — no `digstore` install needed to start. See [Scaffold an app](./build-a-dapp/scaffold.md).
:::

### 3. Set up a wallet (only needed to publish)

Publishing spends real funds, so you need a seed and a funded wallet first:

```sh
digstore seed generate      # generate a fresh mnemonic (shown once — back it up)
digstore balance            # show your receive address; fund it with XCH + DIG
```

See [On-chain anchoring](./digstore/cli/onchain-anchoring.md) for import, funding, and TTL details.

### 4. Publish your first capsule (100 DIG)

```sh
digstore init site --dir dist     # mint the store's first capsule (100 DIG + XCH fee)
```

`init` mints a Chia singleton on mainnet — **the launcher id becomes your store id** — and blocks until confirmed.

### 5. Ship updates

```sh
npm run build                      # produce dist/
digstore add -A                    # stage the whole content root
digstore commit -m "v1.1"          # publish a new capsule (100 DIG + XCH fee)
```

For CI, one command does add → commit → push and prints the URL:

```sh
digstore deploy --output-dir dist --json   # advance an existing store from CI; never mints
```

See [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md).

### 6. Read it back

```sh
digstore cat urn:dig:chia:<storeId>/readme   # a URN both locates AND decrypts
```

---

## What it costs

| You're doing | Cost |
|---|---|
| Scaffolding, building, previewing a draft | **Free** |
| Publishing your first capsule (`init` / DIGHUb Publish) | **100 DIG** + small XCH fee |
| Publishing each update (`commit` / re-Publish) | **100 DIG** + small XCH fee |

The price is a flat **100 DIG per capsule** everywhere — see [why the price is flat](./digstore/cli/onchain-anchoring.md#why-the-price-is-flat).

## Stuck?

- [Troubleshooting](./support/troubleshooting.md) — the common failures and their fixes.
- [FAQ](./support/faq.md) — quick answers.
- [Get help](./support/get-help.md) — the community and how to file a good report.

## Related

- [Concepts & glossary](./concepts.md) — capsule, store, URN, and DIG payment defined
- [Scaffold an app (create-dig-app)](./build-a-dapp/scaffold.md) — start a deployable project in one command (npm or CLI)
- [Installing the CLI](./digstore/cli/install.md) — get `digstore` on your machine
- [On-chain anchoring](./digstore/cli/onchain-anchoring.md) — wallet setup, funding, and costs
- [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — push-to-publish in CI
- [CLI tutorial](./digstore/cli/quickstart.md) — the full create-commit-read walkthrough
