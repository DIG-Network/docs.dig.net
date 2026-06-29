---
sidebar_position: 1.5
title: Scaffold an app (create-dig-app)
description: "npm create dig-app — scaffold a wallet-wired, deployable DIG app in one command. Five templates (static, vite-react, next-static, nft-drop, dapp-window-chia), all free to build and preview; you pay the uniform capsule price only when you publish."
keywords:
  - create-dig-app
  - npm create dig-app
  - scaffold DIG app
  - DIG templates
  - dig-sdk
  - free preview
tags:
  - create-dig-app
  - digstore-cli
  - dig-toml
  - dig-sdk
  - window-chia
  - capsule
  - dig-payment
---

# Scaffold an app

`create-dig-app` is the **JS front door** for starting a DIG project. One command writes a runnable starter — a real app, a `dig.toml`, and (for the wallet templates) the [DIG SDK](../concepts.md#dig-sdk) already wired in — then prints your next steps.

```sh
npm create dig-app@latest my-app -- --template vite-react
```

…or run it with no arguments for an interactive picker (it prompts for a name and a template):

```sh
npm create dig-app@latest
```

It needs **Node 18+** and has no runtime dependencies. The `--` is npm's argument separator — it forwards the flags to `create-dig-app`. (With `npx create-dig-app` or `pnpm create dig-app` you can drop it.)

:::tip Free until you publish
Scaffolding, building, and previewing cost **nothing** — `create-dig-app` never mints, touches the chain, or spends. You pay the **[uniform capsule price in $DIG](../concepts.md#dig-payment)** only when you publish a [capsule](../concepts.md#capsule) with `digstore deploy`. *Iterate for free, publish when it's ready.*
:::

## The five templates

| Template | What you get | Output dir | Wallet wired |
|---|---|---|---|
| `static` | Plain HTML/CSS/JS — the lightest way to ship a site. The "build" just copies `src/` → `public/`. | `public` | — |
| `vite-react` | A React SPA built with Vite — the fast default for an app frontend. | `dist` | — |
| `next-static` | Next.js exported to static files (`output: 'export'`) — deployable as a capsule. | `out` | — |
| `nft-drop` | A wallet-connected NFT mint page (`ChiaProvider` + the canonical CHIP-0035 spend builder). | `dist` | yes |
| `dapp-window-chia` | A dapp wired to the injected Chia wallet via `ChiaProvider` (`window.chia` → WalletConnect). | `dist` | yes |

The two **wallet templates** (`nft-drop`, `dapp-window-chia`) wire in [`@dignetwork/dig-sdk`](../concepts.md#dig-sdk): `ChiaProvider` **prefers the injected [DIG Browser](../browser/using-window-chia.md) wallet** (`window.chia`) and **falls back to WalletConnect → Sage**, so you write the wallet flow once and it works everywhere. NFT minting uses the SDK's `/spend` builder — spends are never hand-rolled. To charge for access or gate it on an NFT, the SDK's [`Paywall`](./tutorial.md#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk) helper composes the same provider with the spend builder. **Nothing is minted, signed, or spent at scaffold time**; minting is an explicit, wallet-signed action a user triggers later.

## Options

| Option | Description |
|---|---|
| `<name>` | Project directory + npm package name (slugified to be npm-safe). |
| `-t, --template <t>` | One of: `static`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia`. |
| `-h, --help` | Show usage and the template list. |
| `-v, --version` | Print the version. |

## The free-until-publish flow

Scaffold, preview for free, then publish a capsule only when you're ready:

```sh
npm create dig-app@latest my-app -- --template vite-react
cd my-app
npm install
npm run dev       # work on your app locally (skip for the static template)

digstore dev      # preview on the real chia:// read path — FREE, no chain, no spend
digstore deploy   # publish a capsule when you're ready (the only step that spends $DIG)
```

[`digstore dev`](../digstore/cli/quickstart.md) serves your build over the genuine `chia://` read path (compile → verify → decrypt) with live reload — it's exactly what visitors get, with zero chain interaction. You only spend when you run `digstore deploy` (or publish from [DIGHUb](../concepts.md#dighub)). See the [Quickstart](../quickstart.md) for the full publish flow, and [On-chain anchoring](../digstore/cli/onchain-anchoring.md) for wallet setup and costs.

## What it writes

Every scaffolded project includes:

- **`dig.toml`** — the committable [project manifest](../digstore/cli/configuration.md) `digstore` (and the DIG SDK adapters) read: `output-dir`, `build-command`, and the default `remote`. This is the single source of truth `digstore deploy` and the [GitHub deploy Action](../digstore/cli/deploy-from-github-actions.md) use.
- **`README.md`** — the develop → preview (free) → publish flow for that template.
- a real **app** that `npm install`s and builds to the template's output dir.

## Two front doors: `create-dig-app` vs `digstore new`

There are two ways to scaffold the same templates, and they produce the same kind of project:

- **`npm create dig-app`** (this page) — the **JS front door**. Best if you live in the npm/Node world: no separate install, it runs straight from npm and the wallet templates pull `@dignetwork/dig-sdk` from npm.
- **[`digstore new <template>`](../digstore/cli/quickstart.md)** — the **Rust CLI front door**. Best if you already have the [`digstore` CLI](../digstore/cli/install.md) installed; it scaffolds without Node and keeps you in one tool through `digstore dev` and `digstore deploy`.

Pick whichever fits your stack — both lead into the same free `digstore dev` → `digstore deploy` loop.

## Related

- [Build a dapp on Chia](./tutorial.md) — the end-to-end thread from scaffold to a deployed dapp
- [Example gallery](./example-gallery.md) — clone a finished version of each template
- [Quickstart](../quickstart.md) — the shorter "ship a site" path, free to publish
- [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-deploy in CI
- [Using window.chia](../browser/using-window-chia.md) — the in-page wallet the wallet templates target
- [Project config & build-time values](../digstore/cli/configuration.md) — the `dig.toml` each template writes
- [Concepts & glossary](../concepts.md) — capsule, store, the DIG SDK, and DIG payment defined
