---
sidebar_position: 7
title: Deploy from GitHub Actions
description: "Auto-publish your built site or dapp to your existing DIG store on every push with the dig-network/deploy-action — git-push-to-deploy, free PR previews, and a PR comment + GitHub deployment status. Keyless CI auth, no long-lived hub secret."
keywords:
  - deploy-action
  - digstore deploy
  - github actions
  - ci deploy
  - keyless deploy
  - writer key
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

Publish your site or dapp to DIG automatically — a new **capsule** of your existing store, exactly the git-push-to-deploy flow you'd expect from a managed host, but decentralized. Add one workflow file; the Action does the right thing for the event:

- **Pull request → a free preview.** Your build is compiled and verified through the real `chia://` read path and you get a shareable, content-addressed preview. **No chain, no wallet, no spend.**
- **Push to your default branch → a real deploy.** The Action advances your store's on-chain root and publishes the new capsule, then posts the live URL + cost back on the commit.

The dedicated **[`dig-network/deploy-action`](https://github.com/DIG-Network/deploy-action)** does the work: it installs the [`digstore`](https://github.com/DIG-Network/digstore) CLI on the runner, runs `digstore deploy`, and reports the result as step outputs, a PR comment, a GitHub Deployment, and a commit status.

:::note You create the store once; CI only updates it
Your store already exists (you ran [`digstore init`](./onchain-anchoring.md) once, which mints it and spends $DIG). The Action only **advances** that store — it never mints. Each real deploy is a new capsule and costs the uniform capsule price in $DIG + a small XCH fee, paid from your deploy wallet. **PR previews are free.**
:::

## What you need

- An existing DIG store (created with `digstore init`).
- The store **bound to your repo** in DIGHUb (the one-time keyless binding, below) — so CI needs no long-lived hub secret.
- A **dedicated deploy wallet** funded with enough DIG for your expected deploys (it pays only on a real deploy; see [Security](#security)).
- A GitHub repo whose build produces a directory of static files (e.g. `dist/`).

:::caution Requires digstore ≥ v0.6.0
Keyless CI auth (`--writer-key`) and the free `deploy --preview` path require **digstore ≥ `v0.6.0`** — which is the Action's default `digstore-version`. Keep `digstore-version` pinned to an explicit tag for reproducible CI.
:::

## Add the workflow

One workflow handles both modes — a **free preview on every PR** and a **real deploy on push to your default branch**. The Action picks the mode from the event; you don't configure it.

```yaml
name: Deploy to DIG
on:
  push:
    branches: [main]      # real deploy
  pull_request:           # free preview

permissions:
  contents: read
  id-token: write         # KEYLESS auth — exchange the OIDC token (no hub secret)
  pull-requests: write    # comment the preview / live URL on the PR
  deployments: write      # the GitHub Deployment + commit status

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
        uses: DIG-Network/deploy-action@v1   # pin to @v1 once released (a commit SHA until then)
        with:
          directory: dist
          digstore-version: v0.6.0           # PIN for reproducible CI
          # KEYLESS: no hub secret. The on-chain spend still needs a funding wallet:
          writer-key: ${{ secrets.DIG_WRITER_KEY }}        # advances the root (revocable, root-only)
          passphrase: ${{ secrets.DIGSTORE_PASSPHRASE }}   # funds the capsule price ($DIG) + XCH fee
          mnemonic:   ${{ secrets.DIG_MNEMONIC }}
          # store-id comes from the OIDC binding (or dig.toml). Pass store-id: to override.

      - run: echo "Deployed ${{ steps.dig.outputs.capsule }} -> ${{ steps.dig.outputs.hub-url }}"
```

That's it. Open a PR to get a free preview commented on it; merge to `main` to advance your store's on-chain root and publish the new capsule to DIGHUb.

- **PRs** run `digstore deploy --preview`: a **free**, content-addressed build verified through the real `chia://` read path. The preview address is the `content-address` output and is commented on the PR.
- **Pushes to the default branch** run `digstore deploy --if-changed`: a push whose build is byte-identical to the live version is a **no-op** (no spend, nothing published), so it is safe to run on every push.
- A push to a **non-default** branch previews (never a surprise spend). Set `preview: true` to force a preview on any event.

## Keyless auth — one-time binding

Keyless auth removes the long-lived hub secret from your repo. CI presents the workflow's short-lived GitHub **OIDC** token; the hub verifies it (fail-closed against GitHub's JWKS) and, if your repo + ref is **bound to your store**, mints a short-lived store-scoped session for the push. Requires `permissions: id-token: write` (in the workflow above).

Register the binding once (owner-only) — no secret is generated, the binding itself is what authorizes the exchange:

- In DIGHUb: **Project → Settings → CI deploy → add a repo binding** for `owner/repo` + the git ref (defaults to `refs/heads/main`).

If the repo isn't bound, the Action fails with a clear `403` pointing you here.

## What it reports on a PR

With `comment-on-pr` at its default `true`, the Action:

- **Upserts a PR comment** with the published capsule (or preview address), its URLs (`dig://` + the DIGHUb URL), and the cost.
- **Creates a GitHub Deployment** for the commit (marked transient for a preview).
- **Sets a commit status** — a red X if the on-chain anchor or hub push failed or timed out, so a broken deploy can block merge.

## Security

There are three distinct credentials. Two are keyless / spend-limited; only the funding wallet can spend, and that is needed solely on a **real deploy** (never for a preview):

| Credential | What it can do | How it's provided |
|---|---|---|
| **Keyless OIDC session** | Authorize the DIGHUb head push for the bound store | Minted per-run from the GitHub OIDC token — **no secret in the repo** |
| **Writer deploy-key** (`writer-key`) | Advance the store's **on-chain root only** — never change the owner, never melt; **revocable** | Repo secret |
| **Funding wallet** (`passphrase` + `mnemonic`) | **Pay** the capsule price ($DIG) + XCH fee for a real deploy | Repo secret |

:::danger The funding wallet's seed can spend its DIG and XCH — use a dedicated wallet
The funding seed only signs the *payment* for the on-chain root update (the writer-key authorizes the change itself), but protect it anyway:

- Use a **dedicated deploy wallet**, never your main wallet.
- Fund it with only **enough $DIG for your expected deploys** (each real deploy = the uniform capsule price + a small fee).
- Store the passphrase and mnemonic as GitHub **encrypted secrets** — never in `dig.toml` or any committed file.
- **PR previews are free and need none of these** — no OIDC, no writer-key, no wallet.
:::

The **publisher deploy-key** (`deploy-key`) is a separate §21 head-push credential with **no spend authority**. In keyless mode the OIDC session covers the push, so you usually don't need it; it remains available for self-hosted remotes or when not using keyless auth.

### One-time setup

On the machine where you created the store:

```sh
digstore log --json          # copy the "store_id" field (or set it in dig.toml)
```

1. **Bind the repo to your store (keyless):** in DIGHUb, **Project → Settings → CI deploy → add a repo binding** for `owner/repo` + ref. No secret is generated — the binding authorizes the OIDC exchange.
2. **Authorize a writer deploy-key** for CI (DIGHUb Teams → add a "Deployer") and store it as a secret.
3. **Add the funding wallet** as secrets.

Repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `DIG_WRITER_KEY` | The 64-hex writer deploy-key that advances the store's root (revocable, root-only) |
| `DIGSTORE_PASSPHRASE` | The passphrase that unlocks the funding wallet's seed in CI |
| `DIG_MNEMONIC` | The dedicated funding wallet's BIP-39 mnemonic |

And commit a `dig.toml` to your repo root (so `output-dir` etc. don't have to be passed; `store-id` is resolved from the OIDC binding but may also be pinned here):

```toml
store-id   = "<your 64-hex store id>"
output-dir = "dist"
# build-command = "npm ci && npm run build"   # optional
```

## Action inputs

| Input | Default | Description |
|---|---|---|
| `directory` | `dist` | The built-output directory to publish. |
| `store-id` | OIDC binding / `dig.toml` | The 64-hex store id to advance. Resolved from the keyless OIDC binding when available. |
| `if-changed` | `true` | Skip the deploy (and the spend) when the build is byte-identical to the live version. |
| `preview` | `false` | Force a **free preview** (`--preview`) even on a default-branch push. PRs preview automatically. |
| `digstore-version` | `v0.6.0` | The `digstore` CLI version: a release tag, git ref/branch, or `latest`. **Pin this.** Needs ≥ `v0.6.0`. |
| `keyless` | `true` | Keyless CI auth: exchange the GitHub OIDC token (`audience=dighub`) for a store-scoped session — no hub secret. Needs `id-token: write`. |
| `api-base` | `https://hub.dig.net/v1` | The DIGHUb control-plane API base for the OIDC exchange. |
| `writer-key` | — | The on-chain **writer** deploy-key (64-hex): advances the root only, revocable. (`DIGSTORE_WRITER_KEY`.) |
| `passphrase` | — | The funding wallet's `DIGSTORE_PASSPHRASE` — pays the on-chain fee on a real deploy. **Use a dedicated wallet.** |
| `deploy-key` | — | The store's 64-hex §21 publisher deploy key (no spend authority). Usually unneeded with keyless. |
| `mnemonic` | — | The funding wallet's BIP-39 mnemonic, imported under `passphrase`. |
| `salt` | — | Secret salt (64-hex) for a **private** store. Omit for public stores. |
| `remote` | public DIGHUb | The remote to publish to (e.g. `dig://<store-id>` or a node URL). |
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
| `hub-url` | The DIGHUb URL for the store (`https://hub.dig.net/stores/<id>`). |
| `coin-id` | The on-chain coin id of the anchored root. |
| `content-address` | On a `--preview` build: the shareable root-pinned `dig://` address. Empty on a real deploy. |
| `preview` | `true` when this run produced a free preview (a PR), not a real on-chain deploy. |
| `skipped` | `true` when `--if-changed` skipped a no-op deploy. |
| `spent` | `true` when the deploy spent DIG (a real publish). |
| `pushed` | `true` when the capsule was published to the hub. |

:::note Your `*.on.dig.net` address isn't a deploy output
A `*.on.dig.net` address is an **optional, paid** handle you register for a store — it isn't derivable from a deploy (and a store has none until you register one), so the Action surfaces the always-available `dig-url` (`dig://`), `urn`, and `hub-url` instead. The capsule is readable over the dig RPC by those the moment it confirms; if you've registered a handle, your site is *also* served at `<your-name>.on.dig.net`.
:::

## Using the CLI directly

The Action wraps `digstore deploy`, which is built for CI. You can run the same flow yourself (e.g. from another CI system):

```sh
digstore seed import --mnemonic "$DIG_MNEMONIC"            # DIGSTORE_PASSPHRASE set (funds the fee)
DIGSTORE_WRITER_KEY=<64-hex> digstore deploy --output-dir dist --json --if-changed   # advance root + push
digstore deploy --preview --output-dir dist --json         # a free preview — no chain, no spend
```

On a fresh checkout `digstore deploy` reconstructs the store locally from the deploy key + the current on-chain root, stages your output directory, advances the root (signed by the writer deploy-key), and pushes the new capsule — all non-interactively. See `digstore deploy --help`.

## Versioning

Reference the Action as `DIG-Network/deploy-action@v1` for the latest compatible v1.x release; pin to an exact tag (`@v1.2.3`) or a commit SHA for byte-for-byte reproducibility. Always **pin `digstore-version`** to a release tag (≥ `v0.6.0`) so the CLI doesn't move under you.

:::note Pre-release
The Action is built and tested but **not yet tagged `@v1`** — a human gates the first release. Until then, pin to a commit SHA.
:::

## Related

- [`create-dig-app` — scaffold an app](../../build-a-dapp/scaffold.md) — start a deployable project in one command
- [Project config & build-time values](./configuration.md) — the `dig.toml` keys and the no-secrets rule
- [On-chain anchoring](./onchain-anchoring.md) — what a deploy spends and confirms on Chia mainnet
- [Project workflow](./project-workflow.md) — capture a build directory and commit it locally
- [Sharing over a remote](./sharing.md) — the `push`/`clone`/`pull` the Action builds on
- [Command reference](./command-reference.md) — every `digstore` command and flag
- [Concepts & glossary](../../concepts.md) — store, capsule, and anchoring defined

Next: [Command reference →](./command-reference.md)
```
