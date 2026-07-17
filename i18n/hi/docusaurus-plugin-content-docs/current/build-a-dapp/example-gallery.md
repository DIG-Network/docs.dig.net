---
sidebar_position: 2
title: Example gallery
description: "Example DIG dapps you can clone and open in a template — a static site, a wallet-wired React app, and an NFT drop page. Start from working code instead of a blank folder."
keywords:
  - DIG examples
  - example dapp
  - template
  - clone a dapp
  - starter project
tags:
  - digstore-cli
  - window-chia
  - capsule
  - dighub
---

# Example gallery

Start from working code, not a blank folder. Every example below maps to a **`digs new` template** you can scaffold in one command, and links to the example repo it's based on.

```sh
digs new <template> my-project    # free, no chain, no spend
cd my-project && digs dev          # preview on the real read path
```

:::tip Two front doors, same templates
You can scaffold these from the `dig-store` CLI (`digs new`) **or** straight from npm with `npm create dig-app@latest my-project -- --template <template>`. See [Scaffold an app](./scaffold.md) for the full template list and how the two front doors compare.
:::

:::note Repo links are placeholders during pre-release
The `digs new <template>` commands are live today. The **example repository links are placeholders** while the gallery is being assembled — they're marked _(coming soon)_ below. The templates themselves ship with the CLI, so you can scaffold and run every one of these now.
:::

## Static site — `static-site`

A plain HTML/CSS/JS site, no build step. The simplest possible deployment: the folder _is_ the capsule.

```sh
digs new static-site my-site
```

- **Scaffolds:** `index.html`, styles, and a `dig.toml` with `output-dir = "."`.
- **Good for:** a landing page, docs, a portfolio — anything static.
- **Open in template:** _(example repo coming soon)_

## React dapp — `vite-react`

A Vite + React app wired to the in-page Chia wallet (`window.chia`). This is the template the [Build a dapp tutorial](./tutorial.md) walks through end to end.

```sh
digs new vite-react my-dapp
```

- **Scaffolds:** a Vite/React app, `App.jsx` with a wallet **Connect** flow, `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`).
- **Good for:** any interactive dapp that needs a wallet — signing, spends, reading verified content.
- **Pairs with:** [`@dignetwork/dig-sdk`](https://www.npmjs.com/package/@dignetwork/dig-sdk) for the `window.chia` + WalletConnect fallback and the spend builder.
- **Open in template:** _(example repo coming soon)_

## NFT drop page — `nft-drop`

The public mint/collection page for an NFT drop.

```sh
digs new nft-drop my-drop
```

- **Scaffolds:** a mint/collection landing page and a `dig.toml`. (Minting the NFTs themselves is a separate on-chain step.)
- **Good for:** a collection's public face — the page collectors visit to mint.
- **Open in template:** _(example repo coming soon)_

## Also available

Two more templates ship with the CLI:

- **`next-static`** — a Next.js static-export site.
- **`dapp-window-chia`** — a hand-written (no build step) dapp wired directly to `window.chia`, the minimal example of the in-page wallet.

```sh
digs new next-static my-next-site
digs new dapp-window-chia my-wallet-dapp
```

## Related

- [Scaffold an app (create-dig-app)](./scaffold.md) — the five templates and the npm vs CLI front doors
- [Build a dapp on Chia](./tutorial.md) — the end-to-end thread that uses the `vite-react` template
- [Using window.chia](../browser/using-window-chia.md) — the in-page wallet these dapps target
- [Quickstart](../quickstart.md) — scaffold, preview, and publish
- [Project config & build-time values](../digstore/cli/configuration.md) — the `dig.toml` each template writes
- [Concepts & glossary](../concepts.md) — capsule, store, and window.chia defined
