---
sidebar_position: 3
title: Quick start
description: "Five-minute walkthrough to initialize a project, commit files, and read content back via DigStore CLI."
---

# Quick start

Create a project, commit a file, and read it back — in under a minute.

## 0. Set up your wallet

`digstore init` mints a singleton on **Chia mainnet** and costs real XCH, so you need a seed and a funded wallet first.

```sh
digstore seed import        # import an existing BIP-39 mnemonic (prompted)
# or
digstore seed generate      # generate a fresh mnemonic (shown once — back it up)
```

Fund the wallet address that `digstore seed status` shows before continuing. For full details see [On-chain anchoring](./onchain-anchoring.md).

## 1. Initialize a workspace

```sh
mkdir my-project && cd my-project
digstore init
```

`digstore init` creates a `.dig/` workspace and mints the project's singleton on Chia mainnet — **the on-chain launcher id becomes the store id**. It blocks until the transaction is confirmed (default timeout 300 s), then writes the project locally. Run interactively, it asks a couple of setup questions:

```
Relative path to the build/content directory this project captures [.]:
Make this a private (salted) project? [y/N]:
```

- The **content directory** is what the project captures (a build dir like `dist/`). Press Enter to use the current directory.
- **Private** mixes in a secret salt so the URN alone can't decrypt (see [Public vs private](../format/urns-and-encryption.md#public-vs-private-stores)).

You can skip the prompts with flags — handy in scripts:

```sh
digstore init                       # current dir, public
digstore init site --dir dist       # a project named "site" capturing ./dist
digstore init --private             # private project
```

## 2. Add and commit

```sh
echo "hello digstore" > readme.txt

digstore add readme.txt --key readme    # stage one file under the key "readme"
digstore commit -m "first deployment"   # anchor root on-chain + compile the module
```

`commit` anchors the new root on Chia mainnet and blocks until confirmed before finalizing the deployment (spends XCH). See [On-chain anchoring](./onchain-anchoring.md) for timeout and resume options.

`--key` sets the resource key explicitly; without it the key defaults to the path relative to the content root. Use `-A` to stage everything under the content root:

```sh
digstore add -A
```

## 3. Inspect

```sh
digstore status            # what's staged / modified + remaining capacity
digstore log               # deployments — each root hash is a commit
digstore urn readme.txt    # preview the exact URN this file has
```

`digstore log --json` prints the store id and root hashes you'll need to build a full URN.

## 4. Read it back

A URN locates *and* decrypts. With the store id and root from `digstore log --json`:

```sh
digstore cat urn:dig:chia:<storeId>:<rootHash>/readme
# → hello digstore
```

Omit the `<rootHash>` to read from the current deployment:

```sh
digstore cat urn:dig:chia:<storeId>/readme
```

Write the output to a file instead of stdout:

```sh
digstore cat urn:dig:chia:<storeId>/readme --out readme.copy.txt
```

## Where to go next

- **[On-chain anchoring](./onchain-anchoring.md)** — wallet setup, funding, init/commit timeouts, anchor status, and config.
- **[Project workflow](./project-workflow.md)** — capture a real build directory, run multiple projects per workspace, manage staging. List them with `digstore stores` (alias: `projects`).
- **[Sharing over a remote](./sharing.md)** — publish a project and let others `clone`/`pull` it.
- **[Streaming & keys](./streaming-and-keys.md)** — fetch encrypted vs decrypted, list retrieval keys, checkout a whole deployment.

:::tip Try it
- [**View & manage your stores in the Hub →**](https://hub.dig.net) — see your published stores in the browser.
- [**Ready to ship? Publish on DIGHub →**](https://hub.dig.net/new) — deploy a new capsule from the web, no CLI required.
:::
