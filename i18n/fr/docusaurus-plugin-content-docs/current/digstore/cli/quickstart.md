---
sidebar_position: 3
title: CLI tutorial
description: "Full walkthrough of the dig-store CLI: initialize a store, commit files, and read content back. The parallel track to the web-first quickstart."
keywords:
  - dig-store quickstart
  - dig-store init
  - dig-store commit
  - dig-store push
  - dig-store cat
  - URN
tags:
  - digstore-cli
  - store
  - urn
  - anchoring
  - dig-payment
  - capsule
---

# CLI tutorial

Create a store, commit a file, and read it back with the `dig-store` CLI.

:::tip New here? Start with the Quickstart
The [**Quickstart**](../../quickstart.md) leads with the free, web-first path (build and preview at no cost, publish only at the end). This page is the deeper CLI walkthrough — the parallel track for terminal and CI workflows.
:::

## The publish flow at a glance

This is the canonical publish flow — run it top-to-bottom from inside your project once your wallet is funded (step 0):

```sh
dig-store init                       # create the on-chain store (mints on Chia; store id = launcher id)
dig-store add -A                     # stage every file under the store root
dig-store add --discovery            # publish the public /.well-known discovery manifest
dig-store commit -m "v3"             # anchor a new capsule on-chain (dynamic per-capsule $DIG price + XCH fee)
dig-store push origin                # push the deployment to DIGHub (rpc.dig.net)
```

Building and previewing locally are free — you only spend when you `commit` a capsule. The rest of this page walks through each step and reads content back.

## 0. Set up your wallet

`dig-store init` mints a singleton on **Chia mainnet** and costs the **uniform capsule price in $DIG + a small XCH fee**, so you need a seed and a funded wallet first. (Building and previewing locally are free — you only spend when you publish a capsule.)

```sh
dig-store seed import        # import an existing BIP-39 mnemonic (prompted)
# or
dig-store seed generate      # generate a fresh mnemonic (shown once — back it up)
```

Fund the wallet address that `dig-store seed status` shows before continuing. For full details see [On-chain anchoring](./onchain-anchoring.md).

## 1. Initialize a workspace

```sh
mkdir my-project && cd my-project
dig-store init
```

`dig-store init` creates a `.dig/` workspace and mints the store's singleton on Chia mainnet — **the on-chain launcher id becomes the store id**. It blocks until the transaction is confirmed (default timeout 300 s), then writes the store locally. Run interactively, it asks a couple of setup questions:

```
Relative path to the build/content directory this store captures [.]:
Make this a private (salted) store? [y/N]:
```

- The **content directory** is what the store captures (a build dir like `dist/`). Press Enter to use the current directory.
- **Private** mixes in a secret salt so the URN alone can't decrypt (see [Public vs private](../format/urns-and-encryption.md#public-vs-private-stores)).

You can skip the prompts with flags — handy in scripts:

```sh
dig-store init                       # current dir, public
dig-store init site --dir dist       # a store named "site" capturing ./dist
dig-store init --private             # private store
```

## 2. Add and commit

```sh
echo "hello dig-store" > readme.txt

dig-store add readme.txt --key readme    # stage one file under the key "readme"
dig-store commit -m "first deployment"   # anchor root on-chain + compile the module
```

`commit` anchors the new root on Chia mainnet and blocks until confirmed before finalizing the deployment (spends XCH). See [On-chain anchoring](./onchain-anchoring.md) for timeout and resume options.

`--key` sets the resource key explicitly; without it the key defaults to the path relative to the content root. Use `-A` to stage everything under the content root:

```sh
dig-store add -A
```

## 3. Inspect

```sh
dig-store status            # what's staged / modified + remaining capacity
dig-store log               # deployments — each root hash is a commit
dig-store urn readme.txt    # preview the exact URN this file has
```

`dig-store log --json` prints the store id and root hashes you'll need to build a full URN.

## 4. Read it back

A URN locates *and* decrypts. With the store id and root from `dig-store log --json`:

```sh
dig-store cat urn:dig:chia:<storeId>:<rootHash>/readme
# → hello dig-store
```

Omit the `<rootHash>` to read from the current deployment:

```sh
dig-store cat urn:dig:chia:<storeId>/readme
```

Write the output to a file instead of stdout:

```sh
dig-store cat urn:dig:chia:<storeId>/readme --out readme.copy.txt
```

## Where to go next

- **[On-chain anchoring](./onchain-anchoring.md)** — wallet setup, funding, init/commit timeouts, anchor status, and config.
- **[Store workflow](./project-workflow.md)** — capture a real build directory, run multiple stores per workspace, manage staging. List them with `dig-store stores`.
- **[Sharing over a remote](./sharing.md)** — publish a store and let others `clone`/`pull` it.
- **[Streaming & keys](./streaming-and-keys.md)** — fetch encrypted vs decrypted, list retrieval keys, checkout a whole deployment.

:::tip Try it
- [**View & manage your stores in DIGHUb ↗**](https://hub.dig.net) — see your published stores in the browser.
- [**Ready to ship? Publish on DIGHUb ↗**](https://hub.dig.net/new) — deploy a new capsule from the web, no CLI required.
:::

## Related

- [Quickstart](../../quickstart.md) — the free, web-first path; publish only at the end
- [Installing the CLI](./install.md) — get `dig-store` on your machine first
- [On-chain anchoring](./onchain-anchoring.md) — wallet setup, funding, and costs
- [URNs & Encryption](../format/urns-and-encryption.md) — what a URN locates *and* decrypts
- [Using dig-store in your project](./project-workflow.md) — the day-to-day release loop
- [Concepts & glossary](../../concepts.md) — store, capsule, and URN defined
