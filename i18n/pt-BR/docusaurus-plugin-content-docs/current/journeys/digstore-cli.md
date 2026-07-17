---
sidebar_position: 3
title: "How do I… use the dig-store CLI?"
description: "The shortest path through the dig-store CLI: install it, scaffold and preview for free, publish a capsule on-chain, share it over a remote, and read it back — each task linked to the page that walks it."
keywords:
  - dig-store CLI how-to
  - dig-store install
  - digs init
  - digs commit
  - digs deploy
  - digs cat
tags:
  - digstore-cli
  - store
  - capsule
  - anchoring
  - dig-payment
  - urn
---

# How do I… use the dig-store CLI?

> **Drive everything from your terminal.** [`dig-store`](../concepts.md#digstore-cli) is the Git-shaped CLI for creating, publishing, sharing, and reading stores — scriptable and CI-ready. This page maps each task to the page that walks it. Building and previewing are free; you spend only when you publish.

## The mental model

The loop mirrors Git: scaffold and preview locally for **free**, then `init` to mint a [store](../concepts.md#store) and `commit` to publish each [capsule](../concepts.md#capsule) (a new on-chain root). A capsule costs the uniform [price in $DIG](../digstore/cli/onchain-anchoring.md#costs); everything before publishing costs nothing. Configuration lives in a committable [`dig.toml`](../concepts.md#dig-toml) (no secrets — those come from the environment).

## How do I install it?

Grab the `dig-store` binary for your OS from the Releases page — or the guided DIG Installer, or build from source — then confirm with `digs --version`.

→ [Installing the CLI](../digstore/cli/install.md)

## How do I try it before I spend anything?

Scaffold a runnable project with `digs new <template>` and preview it live with `digs dev` — served over the genuine `chia://` read path with live reload and an injected dev `window.chia`. **No mint, no chain, no spend.** `digs doctor` runs a pre-publish preflight, and `digs commit --dry-run` previews the exact $DIG/XCH cost without spending.

→ [Scaffold an app](../build-a-dapp/scaffold.md) · [CLI tutorial](../digstore/cli/quickstart.md)

## How do I set up a wallet?

Publishing spends real funds, so generate or import a seed and fund the wallet first: `digs seed generate`, then `digs balance` to see your receive address.

→ [On-chain anchoring](../digstore/cli/onchain-anchoring.md) · [Where to get DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig)

## How do I publish my first capsule?

`digs init site --dir dist` mints the store's singleton on Chia mainnet — **the launcher id becomes your store id** — and blocks until confirmed.

→ [CLI tutorial → initialize](../digstore/cli/quickstart.md)

## How do I ship an update?

`digs add -A` then `digs commit -m "v1.1"` seals the current content into a new capsule and advances your on-chain root. For CI, `digs deploy --output-dir dist --json` does add → commit → push in one command and never mints.

→ [Using dig-store in your project](../digstore/cli/project-workflow.md) · [Project config](../digstore/cli/configuration.md)

## How do I share it / serve it over a remote?

`push`, `clone`, and `pull` move a store over a §21 remote (the default is the public DIGHUb). This is the basis for hosting your own content and for the deploy flow.

→ [Sharing over a remote](../digstore/cli/sharing.md)

## How do I read content back?

`digs cat urn:dig:chia:<storeId>/<resource>` — a [URN](../concepts.md#urn) both locates *and* decrypts the resource. The same chunked, verify-then-decrypt path the network uses.

→ [Streaming & retrieval keys](../digstore/cli/streaming-and-keys.md)

## How do I deploy from GitHub Actions?

Wire `dig-network/deploy-action` so every push publishes a new capsule, with an `if-changed` guard (a byte-identical build is a no-op, no spend) and free PR previews. Authorize CI with a revocable **deploy key** — never your wallet seed.

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [Deploy keys](../automation/deploy-keys.md)

## Where's every command?

The full reference, with the on-chain-cost notes and the free pre-publish commands.

→ [Command reference](../digstore/cli/command-reference.md)

---

## Go deeper

- **The full builder overview** → [For app developers](../audiences/app-developers.md)
- **The store format** → [What is dig-store?](../digstore/what-is-digstore.md) · [Store structure](../digstore/format/store-structure.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
