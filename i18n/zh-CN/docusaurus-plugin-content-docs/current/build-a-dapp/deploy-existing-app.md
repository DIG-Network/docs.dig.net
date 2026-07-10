---
sidebar_position: 1.2
title: Deploy an existing app (web upload)
description: "Already have a built site or SPA? How DIG serves it — the store as your file set, index.html + assets + routes, the anchored-root serve model — and a worked example: upload a real dist/ folder through DIGHUb's web upload and reach it."
keywords:
  - deploy existing app
  - port an app to DIG
  - web upload
  - subfolder upload
  - drag and drop deploy
  - DIGHUb
  - SPA routing
tags:
  - dighub
  - capsule
  - urn
  - chia-protocol
---

# Deploy an existing app (web upload)

Already have a built site — a React/Vue/Svelte SPA, a static site generator's output, plain HTML/CSS/JS — and just want to put it on DIG? This page is that path: no CLI, no scaffolding, just your existing `dist/`/`build/` folder through [DIGHUb](../concepts.md#dighub)'s web upload.

If you're starting a *new* project from scratch instead, see the [Quickstart](../quickstart.md) or the [full tutorial](./tutorial.md). If you'd rather drive this from a terminal/CI, the CLI does the identical thing — see [Publish from the CLI](../quickstart.md#b-publish-from-the-cli).

## How DIG serves your app (the mental model)

A DIG **[store](../concepts.md#store)** *is* your site's file set — every file you upload becomes one addressable **resource**, keyed by its path. There's no separate "deploy config" describing routes: the files you give it are the entire app.

- **The store = your files, addressed by path.** Upload `index.html`, `assets/app.js`, `assets/logo.png` and each keeps that exact path as its **resource key** (nested folders included — `assets/app.js` stays `assets/app.js`, not flattened). This is the same `path` field the on-chain [capsule format](../protocol/capsule-format.md) records for every public resource.
- **`index.html` is the default view.** Omit a path (or ask for `/`) and DIG serves `index.html` — the same convention a web server uses for `/`. See [`chia://` addressing](../browser/chia-protocol.md#addressing-content) and the normative [resourceKey normalization](../protocol/urn-and-addressing.md#resourcekey-normalization) rules.
- **A URN/root always maps to one exact set of files.** Every time you publish, the current file set is sealed into a new immutable **[generation](../digstore/format/store-structure.md#generations-and-root-hashes)** — a `(storeId, rootHash)` pair, i.e. a [capsule](../concepts.md#capsule). Reading `urn:dig:chia:<storeId>/<path>` (optionally pinned to a `rootHash`) always resolves to the bytes that were live in *that* generation — so a shared link never silently changes under the person you shared it with unless you meant it to (omit the root for "always the latest").
- **Client-side routing works like it does on any static host.** DIG doesn't run a server-side router — if your SPA uses `history.pushState` routing, configure your build the way you would for any static host (a catch-all that serves `index.html` for unknown paths client-side); nothing DIG-specific to change here.
- **Everything is encrypted client-side before it ever reaches DIGHUb.** DIGHUb (and every host) only ever sees ciphertext — see [URNs & Encryption](../digstore/format/urns-and-encryption.md) if you want the mechanism.

## Worked example: take a built SPA from `dist/` to live

This assumes you already have a production build — `npm run build` (Vite/CRA/Next static export/etc.) producing a `dist/` (or `build/`, `out/`) folder with an `index.html` at its root plus nested `assets/`, `js/`, `css/` subfolders. Nothing about this is DIG-specific; it's whatever your framework already produces.

### 1. Build your app as usual

```sh
npm run build
```

Confirm the output folder has an `index.html` at its root (the file DIG serves for `/`) and that any relative asset references (`./assets/...`, `/assets/...`) resolve *within* that same folder — DIG serves exactly the tree you give it, with no separate CDN/rewrite layer in front.

### 2. Start a store and upload the whole folder — free, no wallet

[**Start a new store in DIGHUb ↗**](https://hub.dig.net/new), or open an existing store's **Publish** tab.

- Click **Add a folder** (or drag the entire `dist/` folder onto the drop zone — dragging a folder works too) and pick your build output folder. Every file *and every subfolder* uploads together, each keeping its path (`assets/index-abc123.js` stays exactly that) — you do **not** need to flatten your app into single files or re-add each nested file by hand.
- Prefer picking files one at a time, or your browser doesn't support folder selection? "Add a folder" and folder drag-and-drop are conveniences, not a requirement — adding files individually (or many at once) works exactly the same; DIG doesn't care how the selection happened, only what paths the resulting files carry.

### 3. Preview it for free before publishing anything

DIGHUb renders a **free draft preview** of exactly how your app will serve — nothing on-chain yet, no $DIG spent. Use **Expand preview** for a proper, near-fullscreen look (with a Desktop/Mobile width toggle) before you decide it's ready — this is the moment to actually verify routing, assets, and layout, not after you've already published.

Iterate as many times as you like: re-upload, re-preview, for free.

### 4. Publish

When it looks right, hit **Publish** and sign once (the [uniform capsule price](../digstore/cli/onchain-anchoring.md#why-the-price-is-uniform) in $DIG + a small XCH network fee). Your existing app is now a live DIG store.

### 5. Reach it

The publish-success screen shows every way to reach it, all free:

- The **`urn:dig:chia:<storeId>/`** address — copy it, or share it as-is.
- **`chia://`** — opens directly in the [DIG Browser](../audiences/content-consumers.md) or the extension.
- **A `.dig` address** (`http://<storeId>.dig/`) — opens in *any* browser once [dig-dns](../run-a-node/universal-installer.md#browse-dig-names-directly) is installed on that device.
- A **`*.on.dig.net`** friendly subdomain is an **optional** upgrade (a separate, paid registration) — never required to view or share what you just published.

## Related

- [Quickstart](../quickstart.md) — the shorter end-to-end "ship a site" path (web and CLI)
- [Build a dapp on Chia](./tutorial.md) — the full tutorial, from an empty folder to a wallet-wired dapp
- [For content consumers](../audiences/content-consumers.md) — every way to open a published store
- [Store Structure](../digstore/format/store-structure.md) — generations, root hashes, the content root
- [`chia://` addressing](../browser/chia-protocol.md) — the address form and the `index.html` default
- [URN grammar reference](../protocol/urn-and-addressing.md) — the normative resource-addressing spec
- [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — automate future updates via CI
