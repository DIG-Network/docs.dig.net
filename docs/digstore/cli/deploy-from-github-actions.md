---
sidebar_position: 7
title: Deploy from GitHub Actions
description: "Auto-publish your built site or dapp to your existing DIG store on every push with the digstore GitHub Action — git-push-to-deploy."
keywords:
  - digstore deploy
  - github actions
  - ci deploy
  - deploy key
  - dig.toml
  - continuous deployment
tags:
  - digstore-cli
  - store
  - anchoring
  - dig-payment
  - capsule
---

# Deploy from GitHub Actions

Publish your site or dapp to DIG automatically on every push — a new **capsule** of your existing store, exactly the git-push-to-deploy flow you'd expect from a managed host, but decentralized. You add one workflow file and two repository secrets; every push to your default branch builds your site and publishes it.

:::note You create the store once; CI only updates it
Your store already exists (you ran [`digstore init`](./onchain-anchoring.md) once, which mints it and spends 100 DIG). The Action only **advances** that store — it never mints. Each deploy is a new capsule and costs 100 DIG + a small XCH fee, paid from your deploy wallet.
:::

## What you need

- An existing DIG store (created with `digstore init`).
- A **dedicated deploy wallet** funded with enough DIG for your expected deploys (see the security note below).
- A GitHub repo whose build produces a directory of static files (e.g. `dist/`).

## One-time setup

On the machine where you created the store, grab two values:

```sh
digstore log --json          # copy the "store_id" field
digstore deploy-key export   # copy the 64-hex publisher deploy key
```

Then, in your GitHub repo:

1. **Add two repository secrets** (Settings → Secrets and variables → Actions):

   | Secret | Value |
   |---|---|
   | `DIG_MNEMONIC` | Your funded deploy wallet's BIP-39 mnemonic |
   | `DIG_DEPLOY_KEY` | The 64-hex key from `digstore deploy-key export` |

2. **Commit a `dig.toml`** to your repo root:

   ```toml
   store-id   = "<your 64-hex store id>"
   output-dir = "dist"
   # build-command = "npm ci && npm run build"   # optional
   ```

3. **Add the workflow** at `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to DIG
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20 }
         - run: npm ci && npm run build   # produces ./dist
         - name: Deploy to DIG
           id: dig
           uses: DIG-Network/digstore@v0.5.29   # pin to a release tag
           with:
             mnemonic: ${{ secrets.DIG_MNEMONIC }}
             deploy-key: ${{ secrets.DIG_DEPLOY_KEY }}
             output-dir: dist
         - run: echo "Published ${{ steps.dig.outputs.capsule }}"
   ```

That's it. Push to `main` and the Action builds, advances your store's on-chain root, and publishes the new capsule to DIGHub.

## The one security caveat

:::danger v1 puts your wallet seed in CI — use a dedicated deploy wallet
`DIG_MNEMONIC` is the wallet that owns your store. In CI it can **spend all of that wallet's DIG and XCH**. Protect yourself:

- Use a **separate deploy wallet**, not your main wallet.
- Fund it with only **enough DIG for your expected deploys** (each deploy = 100 DIG + a small fee).
- Keep both secrets in GitHub's encrypted secrets — never in `dig.toml` or any committed file.

Scoped, spend-capped, revocable deploy tokens (no seed in CI) are the planned secure replacement. Until then, the dedicated-wallet approach keeps your exposure bounded.
:::

The **deploy key** (`DIG_DEPLOY_KEY`) is a separate credential: it authorizes publishing capsules to DIGHub but has **no spend authority**. Still treat it like a secret.

## Action inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `mnemonic` | yes | — | Funded deploy wallet's BIP-39 mnemonic (a repo secret) |
| `deploy-key` | yes | — | The store's publisher deploy key, 64-hex (a repo secret) |
| `store-id` | no | from `dig.toml` | The 64-hex store id to advance |
| `output-dir` | no | `dist` | The built-output directory to publish |
| `build-command` | no | — | Shell command to build before deploying |
| `salt` | no | — | Secret salt (64-hex) for a **private** store (a repo secret) |
| `remote` | no | public DIGHub | The remote to publish to (e.g. `dig://<store-id>` or a node URL) |
| `message` | no | `deploy <sha>` | Commit message for the new capsule |
| `wait-timeout` | no | `600` | Seconds to wait for on-chain confirmation |
| `digstore-ref` | no | `main` | The digstore git ref the CLI is built from (pin to a release tag) |

## Action outputs

| Output | Description |
|---|---|
| `capsule` | The new capsule: `storeId:rootHash` |
| `root` | The new on-chain root hash |
| `store-id` | The store id that was advanced |
| `dig-url` | The `dig://` URL of the new capsule |
| `hub-url` | The DIGHub URL for the store |

## Using the CLI directly

The Action wraps `digstore deploy`. You can run the same flow yourself (e.g. from another CI system):

```sh
digstore seed import --mnemonic "$DIG_MNEMONIC"   # DIGSTORE_PASSPHRASE set
DIGSTORE_DEPLOY_KEY=<64-hex> digstore deploy --output-dir dist --json
```

`digstore deploy` reads `dig.toml`, reconstructs the store locally from the deploy key + the current on-chain root, stages your output directory, advances the root, and pushes the new capsule — all non-interactively. See `digstore deploy --help`.

## Per-PR previews

:::note Coming soon
Per-PR preview deployments (a temporary capsule per pull request, the kind of managed-host-style preview URLs you'd expect — but decentralized) are planned. For now the Action deploys on push to your default branch.
:::

## Related

- [On-chain anchoring](./onchain-anchoring.md) — what a deploy spends and confirms on Chia mainnet
- [Project workflow](./project-workflow.md) — capture a build directory and commit it locally
- [Sharing over a remote](./sharing.md) — the `push`/`clone`/`pull` the Action builds on
- [Command reference](./command-reference.md) — every `digstore` command and flag
- [Concepts & glossary](../../concepts.md) — store, capsule, and anchoring defined

Next: [Command reference →](./command-reference.md)
