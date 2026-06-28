---
sidebar_position: 7
title: Deploy from GitHub Actions
description: "Auto-publish your built site or dapp to your existing DIG store on every push with the dig-network/deploy-action — git-push-to-deploy, with a PR comment + GitHub deployment status."
keywords:
  - deploy-action
  - digstore deploy
  - github actions
  - ci deploy
  - deploy key
  - dig.toml
  - continuous deployment
tags:
  - deploy-action
  - digstore-cli
  - store
  - anchoring
  - dig-payment
  - capsule
---

# Deploy from GitHub Actions

Publish your site or dapp to DIG automatically on every push — a new **capsule** of your existing store, exactly the git-push-to-deploy flow you'd expect from a managed host, but decentralized. Add one workflow file and a few repository secrets; every push to your default branch builds your site, advances your store's on-chain root, and posts the published capsule + URLs + cost back on the pull request.

The dedicated **[`dig-network/deploy-action`](https://github.com/DIG-Network/deploy-action)** does the work: it installs the [`digstore`](https://github.com/DIG-Network/digstore) CLI on the runner, runs `digstore deploy`, and reports the result as step outputs, a PR comment, a GitHub Deployment, and a commit status.

:::note You create the store once; CI only updates it
Your store already exists (you ran [`digstore init`](./onchain-anchoring.md) once, which mints it and spends 100 DIG). The Action only **advances** that store — it never mints. Each real deploy is a new capsule and costs 100 DIG + a small XCH fee, paid from your deploy wallet.
:::

## What you need

- An existing DIG store (created with `digstore init`).
- A **dedicated deploy wallet** funded with enough DIG for your expected deploys (see the security note below).
- A GitHub repo whose build produces a directory of static files (e.g. `dist/`).

## One-time setup

On the machine where you created the store, grab two values:

```sh
digstore log --json          # copy the "store_id" field (or set it in dig.toml)
digstore deploy-key export   # copy the 64-hex publisher deploy key
```

Then, in your GitHub repo:

1. **Add three repository secrets** (Settings → Secrets and variables → Actions):

   | Secret | Value |
   |---|---|
   | `DIGSTORE_PASSPHRASE` | The passphrase that unlocks the deploy wallet's seed in CI |
   | `DIG_MNEMONIC` | Your dedicated deploy wallet's BIP-39 mnemonic |
   | `DIG_DEPLOY_KEY` | The 64-hex key from `digstore deploy-key export` |

2. **Commit a `dig.toml`** to your repo root (so `store-id` / `output-dir` don't have to be passed):

   ```toml
   store-id   = "<your 64-hex store id>"
   output-dir = "dist"
   # build-command = "npm ci && npm run build"   # optional
   ```

3. **Add the workflow** at `.github/workflows/deploy.yml` (copy-paste):

   ```yaml
   name: Deploy to DIG
   on:
     push:
       branches: [main]

   permissions:
     contents: read
     deployments: write   # for the GitHub Deployment + commit status

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: "20" }
         - run: npm ci && npm run build         # produces ./dist

         - name: Deploy to DIG
           id: dig
           uses: DIG-Network/deploy-action@v1
           with:
             directory: dist
             digstore-version: v0.5.29          # PIN for reproducible CI
             passphrase: ${{ secrets.DIGSTORE_PASSPHRASE }}
             mnemonic:   ${{ secrets.DIG_MNEMONIC }}
             deploy-key: ${{ secrets.DIG_DEPLOY_KEY }}
             # store-id is read from dig.toml; pass store-id: here to override.

         - run: echo "Published ${{ steps.dig.outputs.capsule }} -> ${{ steps.dig.outputs.hub-url }}"
   ```

That's it. Push to `main` and the Action builds, advances your store's on-chain root, and publishes the new capsule to DIGHub.

:::tip Safe to run on every push
With `if-changed` (the default), a push whose build is byte-identical to the live version is a **no-op** — no spend, nothing published. So you can wire this on every push without paying for unchanged deploys.
:::

## Preview per pull request

Add a second workflow to deploy a preview from each pull request and comment the URL on the PR:

```yaml
name: DIG Preview
on:
  pull_request:

permissions:
  contents: read
  pull-requests: write   # to comment the preview URL on the PR
  deployments: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci && npm run build

      - name: Preview on DIG
        uses: DIG-Network/deploy-action@v1
        with:
          directory: dist
          preview: true
          digstore-version: v0.5.29
          passphrase: ${{ secrets.DIGSTORE_PASSPHRASE }}
          mnemonic:   ${{ secrets.DIG_MNEMONIC }}
          deploy-key: ${{ secrets.DIG_DEPLOY_KEY }}
```

:::warning Previews are not free yet
Free, no-spend, expiring per-PR preview capsules are **planned but not live**. **Until they ship, `preview: true` publishes a *real* capsule on Chia (100 DIG)** — it is labelled as a preview in the PR comment and the deployment is marked transient, but it does spend. The `preview` flag is provided now so your workflows are forward-compatible; treat it as a real deploy for the moment.
:::

## What it reports on a PR

On a pull request (with `comment-on-pr` at its default `true`), the Action:

- **Upserts a PR comment** with the published capsule, its URLs (`dig://` + the DIGHub URL), and the cost.
- **Creates a GitHub Deployment** for the commit (marked transient for a preview).
- **Sets a commit status** — a red X if the on-chain anchor or hub push failed or timed out, so a broken deploy can block merge.

## The one security caveat

:::danger v1 puts your deploy wallet's seed in CI — use a dedicated deploy wallet
`passphrase` + `mnemonic` unlock a seed that **can spend all of that wallet's DIG and XCH** in CI. Protect yourself:

- Use a **separate deploy wallet**, never your main wallet.
- Fund it with only **enough DIG for your expected deploys** (each deploy = 100 DIG + a small fee).
- Store both as GitHub **encrypted secrets** — never in `dig.toml` or any committed file.

**The future safe path is scoped deploy tokens:** a store-bound, spend-capped, revocable credential that advances *one* store **without** the master seed. The `deploy-token` input is reserved for it now (using it today is an error). Cut over to deploy tokens as soon as they ship — they remove the funded-seed-in-CI risk entirely.
:::

The **deploy key** (`deploy-key`) is a separate credential: it authorizes publishing the capsule to DIGHub but has **no spend authority**. Still treat it like a secret.

## Action inputs

| Input | Default | Description |
|---|---|---|
| `directory` | `dist` | The built-output directory to publish. |
| `store-id` | from `dig.toml` | The 64-hex store id to advance. |
| `if-changed` | `true` | Skip the deploy (and the spend) when the build is byte-identical to the live version. |
| `preview` | `false` | PR preview deploy. **Not yet free/no-spend** — see the preview note. |
| `digstore-version` | `latest` | The `digstore` CLI version (a release tag, e.g. `v0.5.29`). **Pin this.** |
| `passphrase` | — | The deploy wallet's `DIGSTORE_PASSPHRASE` (v1 credential). **Use a dedicated wallet.** |
| `deploy-token` | — | **Reserved** for scoped deploy tokens. Not yet implemented — using it errors. |
| `deploy-key` | — | The store's 64-hex publisher deploy key (no spend authority). |
| `mnemonic` | — | The deploy wallet's BIP-39 mnemonic, imported under `passphrase`. |
| `salt` | — | Secret salt (64-hex) for a **private** store. Omit for public stores. |
| `remote` | public DIGHub | The remote to publish to (e.g. `dig://<store-id>` or a node URL). |
| `message` | the commit | Commit message for the new capsule. |
| `build-command` | — | Optional shell build command to run before deploying. |
| `wait-timeout` | `600` | Seconds to wait for on-chain confirmation (0 = don't block). |
| `comment-on-pr` | `true` | On a PR, upsert the comment and set the deployment + commit status. |
| `github-token` | `${{ github.token }}` | Token for the PR comment / deployment / commit status. |
| `working-directory` | `.` | Directory to run `digstore` from (where `dig.toml` lives). |

All credentials should be passed from **repo secrets**, never inline.

## Action outputs

| Output | Description |
|---|---|
| `capsule` | The published capsule: `storeId:rootHash`. |
| `root` | The new on-chain root hash. |
| `store-id` | The store id that was advanced. |
| `dig-url` | The `dig://` URL of the deployment (rootless = latest tip). |
| `urn` | The root-pinned URN permalink (`urn:dig:chia:<store>:<root>`). |
| `hub-url` | The DIGHub URL for the store (`https://hub.dig.net/stores/<id>`). |
| `coin-id` | The on-chain coin id of the anchored root. |
| `skipped` | `true` when `--if-changed` skipped a no-op deploy. |
| `spent` | `true` when the deploy spent DIG (a real publish). |
| `pushed` | `true` when the capsule was published to the hub. |

:::note Your `*.on.dig.net` domain isn't a deploy output
A `*.on.dig.net` human domain is an **optional, user-chosen** name you register for a store — it isn't derivable from a deploy, so the Action surfaces the always-available `hub-url` and `dig://` URL instead. If you've registered a domain, your site is also live at `<your-name>.on.dig.net`.
:::

## Using the CLI directly

The Action wraps `digstore deploy`, which is built for CI. You can run the same flow yourself (e.g. from another CI system):

```sh
digstore seed import --mnemonic "$DIG_MNEMONIC"            # DIGSTORE_PASSPHRASE set
DIGSTORE_DEPLOY_KEY=<64-hex> digstore deploy --output-dir dist --json --if-changed
```

On a fresh checkout `digstore deploy` reconstructs the store locally from the deploy key + the current on-chain root, stages your output directory, advances the root, and pushes the new capsule — all non-interactively. See `digstore deploy --help`.

## Versioning & the digstore-root action

Reference the Action as `DIG-Network/deploy-action@v1` for the latest compatible v1.x release; pin to an exact tag (`@v1.2.3`) or a commit SHA for byte-for-byte reproducibility. Always **pin `digstore-version`** to a release tag so the CLI doesn't move under you.

> This dedicated `deploy-action` repo is the supported entry point and supersedes the older form of invoking the action from the `digstore` repository root. Use `DIG-Network/deploy-action@v1`; the inputs above are its canonical surface.

## Related

- [`create-dig-app` — scaffold an app](../../build-a-dapp/scaffold.md) — start a deployable project in one command
- [Project config & build-time values](./configuration.md) — the `dig.toml` keys and the no-secrets rule
- [On-chain anchoring](./onchain-anchoring.md) — what a deploy spends and confirms on Chia mainnet
- [Project workflow](./project-workflow.md) — capture a build directory and commit it locally
- [Sharing over a remote](./sharing.md) — the `push`/`clone`/`pull` the Action builds on
- [Command reference](./command-reference.md) — every `digstore` command and flag
- [Concepts & glossary](../../concepts.md) — store, capsule, and anchoring defined

Next: [Command reference →](./command-reference.md)
