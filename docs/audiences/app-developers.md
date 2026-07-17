---
sidebar_position: 1
title: For app developers
description: "Ship a website or app you truly own — minted on-chain as your own asset, not rented. Build and preview for free; pay a small uniform $DIG price only when you publish, with files encrypted in your browser so no host can read them."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# For app developers

> **Ship a website or app you truly OWN** — minted on-chain as your own asset, not rented. Build and preview for **free**; pay a small **uniform $DIG price** only when you publish, with files **encrypted in your browser** so no host can read them.

## The mental model

A **[store](../concepts.md#store)** is your website's permanent identity — an on-chain singleton you control. Each time you publish, you mint one immutable **[capsule](../concepts.md#capsule)** = `storeId:rootHash`. A store is just the sequence of capsules you've published over time.

Two front doors lead to the **same** free-build → paid-publish loop:

- **The web path** — [DIGHUb](../concepts.md#dighub) at [hub.dig.net](https://hub.dig.net): drop a built folder, preview free, connect a wallet only at Publish.
- **The CLI / CI path** — the [`dig-store`](../concepts.md#digstore-cli) CLI + [`create-dig-app`](../concepts.md#create-dig-app) + the [GitHub deploy Action](../concepts.md#deploy-action).

Scaffold, build, and preview cost **nothing**. You pay only when you publish a capsule.

| You're doing | Cost |
|---|---|
| Scaffolding, building, previewing a draft | **Free** |
| Publishing your first capsule (mint a store) | **uniform capsule price in $DIG** + small XCH fee |
| Publishing each update (a new capsule) | **uniform capsule price in $DIG** + small XCH fee |

## Start here

- **[Quickstart — ship a site in 10 minutes](../quickstart.md)** — the fastest path, web or CLI.

## Publish from the web — DIGHUb

[**Start a new store in DIGHUb ↗**](https://hub.dig.net/new). Drop in your built site (your `dist/` or `build/` folder), get a **free draft preview** on the real read path, and connect a wallet only at the **Publish** step. See the web walkthrough in the [Quickstart → Publish from the web](../quickstart.md#a-publish-from-the-web).

## Publish from the CLI — dig-store

The Git-shaped loop: `new` → `dev` → `init` → `commit`.

```sh
digs new vite-react   # scaffold a runnable project — free, no mint
digs dev              # preview on the real chia:// read path, live-reload — free
digs init site --dir dist   # mint the store's first capsule (uniform price + XCH fee)
digs commit -m "v1.1"       # publish an update — a new capsule
```

→ [CLI quickstart](../digstore/cli/quickstart.md) · [The full project workflow](../digstore/cli/project-workflow.md)

## Scaffold an app — 5 templates

Start from a runnable, wallet-wired starter — `static`, `vite-react`, `next-static`, `nft-drop`, or `dapp-window-chia` — via `digs new <template>` or `npm create dig-app`.

→ [Scaffold an app](../build-a-dapp/scaffold.md)

## Preview free with `digs dev`

`digs dev` serves your project over the **genuine** DIG read path (encrypt → compile → verify → decrypt) with live reload and an injected dev `window.chia`. What you see is what visitors get — and nothing is minted or spent.

→ [CLI quickstart → develop & preview](../digstore/cli/quickstart.md)

## `dig.toml` — the committable manifest

`dig.toml` at your project root holds `store-id`, `output-dir`, `build-command`, `remote`, and other config — shared by `digs dev`, `digs deploy`, and the scaffold templates. It holds **no secrets** (those come from the environment), so commit it.

→ [Project config & build-time values](../digstore/cli/configuration.md)

## Updates & versions — each publish is a new capsule

Every publish seals the current build into a **new immutable capsule** and advances your store's on-chain root. Old capsules stay readable; the store always resolves to its latest unless a reader pins a specific `rootHash`.

→ [On-chain anchoring](../digstore/cli/onchain-anchoring.md)

## What it costs

Free to build and preview; a **uniform price in $DIG** per published capsule, plus a small XCH network fee — included **atomically** in the same on-chain spend. The price is uniform per capsule by design (so capsule length leaks nothing about your content). Get $DIG on TibetSwap, dexie.space, or 9mm.pro.

→ [Where to get DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Why is every capsule the same price?](../support/faq.md#why-uniform-price)

## Push-to-deploy from GitHub Actions

Wire `dig-network/deploy-action` so every push publishes a new capsule — with an `if-changed` guard that makes a byte-identical build a no-op (no spend).

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## List your dApp in the store

Once your dApp is live, submit it to the [DIG Network dApp store](https://explore.dig.net) — connect
your wallet at [hub.dig.net/submit](https://hub.dig.net/submit), fill in one form, and an admin
review publishes it for you.

→ [Submit your dApp to the store](../build-a-dapp/submit-to-the-store.md)

## Add a `*.on.dig.net` web address (optional)

Your store is reachable by its [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) address the moment it confirms — no extra cost. A human-friendly `<name>.on.dig.net` handle is an **optional, paid** registration in DIGHUb on top of that.

→ [Can I use my own domain?](../support/faq.md#can-i-use-my-own-domain)

---

## Go deeper: the protocol

The plain-language model above is all you need to ship. When you want the full design:

- **"a store is a sequence of capsules"** → [Concepts & glossary](../concepts.md#capsule) · [The capsule & store model](../digstore/format/store-structure.md)
- **"files encrypted in your browser"** → [URNs & encryption](../digstore/format/urns-and-encryption.md)
- **"a uniform price + atomic $DIG spend"** → [On-chain anchoring](../digstore/cli/onchain-anchoring.md#costs) · [CHIP-0035 store-coin spends](../chip-0035-spends-and-delegation.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md)
