---
sidebar_position: 1
title: Deploy keys
description: "Give your CI or an agent a revocable key that can publish new versions of your store — but never your wallet seed, and never the power to change ownership. Issue it once in DIGHUb, drop it into CI as DIGSTORE_WRITER_KEY, and revoke it any time."
keywords:
  - deploy key
  - writer key
  - DIGSTORE_WRITER_KEY
  - revoke deploy key
  - CI deploy
  - writer delegate
  - keyless OIDC
tags:
  - dighub
  - deploy-action
  - digstore-cli
  - chip-0035
  - store
  - anchoring
---

# Deploy keys

> **Give your CI a key to deploy — never your wallet seed.** A deploy key can publish new versions of one store and **nothing else**: it can't manage members, change ownership, or melt the store, and you can **revoke it any time**.

## The mental model

Publishing a new [capsule](../concepts.md#capsule) means advancing your [store](../concepts.md#store)'s on-chain root — a [CHIP-0035](../chip-0035-spends-and-delegation.md) store-coin spend that normally needs your owner key. You don't want a pipeline holding that.

A **deploy key** is a separate key you authorize *on your store, on-chain*, in the **writer** role. The store's singleton recognizes it as allowed to **advance the root** — and only that:

- ✅ **Can** publish new versions (advance the root → a new capsule).
- ❌ **Cannot** transfer or change ownership, add or remove members, or melt the store.
- 🔁 **Revocable** — remove it with one owner-signed change; the key stops working immediately.

This is the [admin / writer / oracle delegation](../chip-0035-spends-and-delegation.md#delegation--admin--writer--oracle) model: a deploy key is a **revocable writer delegate**. Because it's scoped to advancing the root, a leaked deploy key can publish a capsule but can **never seize your store**.

:::note You own the store; the key only updates it
You create the store once (in DIGHUb or with [`digs init`](../digstore/cli/onchain-anchoring.md), which mints it and spends $DIG). A deploy key never mints and never owns — it only advances an existing store you already control.
:::

## Issue a deploy key

Deploy keys are managed in DIGHUb, on the store you own:

1. Open your store in [DIGHUb](https://hub.dig.net) and go to the **Automation** tab.
2. In **Deploy keys**, choose to authorize a new key.
3. **Sign the authorization in your wallet.** Issuing a key is an on-chain change (it adds the writer delegate to your store's singleton), so you approve it like any other store update. There is **no $DIG cost** for authorizing a key — it's an ownership-puzzle update, not a new capsule.
4. After the change confirms, DIGHUb reveals the key's **secret once**. Copy it now — it is shown a single time and never again.

:::caution Copy the secret when it's shown — it's revealed once
The secret is a 64-hex string (shown `0x`-prefixed). DIGHUb stores only the key's *public* identity, so it cannot show you the secret again. If you lose it, revoke the key and issue a new one.
:::

### Label your keys

Give each key a clear name when you create it — e.g. `github-actions`, `staging-bot`, `release-runner` — so the **Deploy keys** list tells you at a glance which pipeline each key belongs to. One key per pipeline (or per environment) keeps revocation surgical: if a runner is compromised, you revoke exactly that key and nothing else has to rotate.

## Use a deploy key in CI

The issued key goes into CI as the **`DIGSTORE_WRITER_KEY`** secret, and [`digs commit`](../digstore/cli/command-reference.md) reads it to sign the root advance.

:::caution `DIGSTORE_WRITER_KEY` + `digs commit` — not `digs deploy`
The key DIGHUb issues is a **writer** key: it authorizes the on-chain root advance and is consumed by `digs commit --deploy-key` (which reads `DIGSTORE_WRITER_KEY`). It is **not** the `digs deploy` publisher key (`DIGSTORE_DEPLOY_KEY`) — a §21 head-push credential with no on-chain authority. Put the issued secret in `DIGSTORE_WRITER_KEY`.
:::

A minimal GitHub Actions step, using the key as a repository secret:

```yaml
- name: Publish to DIG
  env:
    DIGSTORE_WRITER_KEY: ${{ secrets.DIGSTORE_WRITER_KEY }}  # the issued deploy key (writer, root-only)
    DIGSTORE_PASSPHRASE: ${{ secrets.DIGSTORE_PASSPHRASE }}  # unlocks the funding wallet
    DIG_MNEMONIC:        ${{ secrets.DIG_MNEMONIC }}         # the funding wallet's seed
  run: |
    npm ci && npm run build                 # produce ./dist
    digs seed import --mnemonic "$DIG_MNEMONIC"
    digs commit --message "ci: $GITHUB_SHA"   # advance the root; signed by the writer key
```

Two distinct credentials are in play, and only one can spend:

| Credential | What it can do | Provided as |
|---|---|---|
| **Deploy key** (`DIGSTORE_WRITER_KEY`) | Authorize the **on-chain root advance** — publish a new version. Cannot change ownership or melt. **Revocable.** | Repo secret (the key issued above) |
| **Funding wallet** (`DIGSTORE_PASSPHRASE` + mnemonic) | **Pay** the uniform [capsule price in $DIG](../digstore/cli/onchain-anchoring.md#costs) + the XCH fee for the publish | Repo secret |

:::danger Use a dedicated funding wallet
The writer key authorizes *the change*; the funding seed pays *for it*. Use a **dedicated deploy wallet** funded with only enough $DIG for your expected deploys — never your main wallet — and keep both as encrypted CI secrets, never in `dig.toml` or any committed file.
:::

Most teams don't wire this by hand — the **[`dig-network/deploy-action`](../digstore/cli/deploy-from-github-actions.md)** packages the whole flow (build → commit → report) into one workflow step and adds free PR previews. See [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## Revoke a deploy key

To retire a key — a pipeline you've decommissioned, or a key you suspect is leaked:

1. Open the store's **Automation** tab in DIGHUb.
2. In **Deploy keys**, revoke the key.
3. **Sign the revocation in your wallet.** Like issuing, revoking is an owner-signed on-chain change: it removes the writer delegate from the store's singleton.

Once the revocation confirms, the key can no longer advance the root — any CI still holding it will fail to publish. Revocation never affects your owner key or any other deploy key.

## Keyless CI — connect a GitHub repo (no secret)

A deploy key lives in your CI as a secret. You can avoid the long-lived **hub** secret entirely by **connecting a GitHub repository** instead: GitHub Actions proves its identity with a short-lived **OIDC** token, and DIGHUb mints a one-time, store-scoped session for that run — no hub secret stored in your repo.

In the **Automation** tab, **Connect GitHub (keyless CI)** binds a `owner/repo` + branch ref (default `refs/heads/main`) to your store. The binding holds only those public coordinates — never a key. You still issue a **deploy key** (above) for the **on-chain signature**; the repo binding is the *hub-side* gate that lets the runner skip a stored hub credential.

This is exactly what the [deploy Action](../digstore/cli/deploy-from-github-actions.md) uses by default. See [Deploy from GitHub Actions → keyless auth](../digstore/cli/deploy-from-github-actions.md#keyless-auth--one-time-binding).

## Share access without sharing a key — roles

A deploy key is for **machines**. To share write access with **people**, use the store's roles instead of handing out a key:

| Role | Can |
|---|---|
| **Owner** | Full control — deploy, manage members, transfer the store. |
| **Admin** | Deploy new versions and add or remove members. |
| **Deployer** | Deploy new versions, but can't manage members. |
| **Viewer** | Read-only access in DIGHUb (a hub convenience; not recorded on chain). |

Owner, Admin, and Deployer are on-chain delegated roles — the same CHIP-0035 delegation primitive behind deploy keys — so revoking a member is the same kind of owner-signed change. → [CHIP-0035 store-coin spends & delegation](../chip-0035-spends-and-delegation.md#what-delegation-powers)

## Authorize a website or hub directly (no key to copy)

A deploy key is a key **you generate**. If you'd rather authorize a website's own DIG identity
directly — e.g. giving `hub.dig.net` writer access without copying anything — use:

```
digs authorize-origin-as-writer hub.dig.net
```

This discovers the origin's DIG pubkey from its [well-known
endpoint](../chip-0035-spends-and-delegation.md#well-known-origin-pubkey-discovery)
(`https://hub.dig.net/.well-known/dig/pubkey`) and adds it as a writer delegate — the same
on-chain primitive as above, just sourced from the origin instead of a hub-issued secret.
Add `--pubkey <96-hex>` to skip discovery when you already have the key, or `--dry-run --json`
to preview the change first.

---

## Go deeper: the protocol

- **"a deploy key is a revocable writer delegate"** → [CHIP-0035 store-coin spends & delegation](../chip-0035-spends-and-delegation.md)
- **"advancing the root costs the capsule price in $DIG"** → [On-chain anchoring → costs](../digstore/cli/onchain-anchoring.md#costs)
- **"the spend is built by the canonical wasm, signed by the wallet"** → [Building spends](../spends.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md)

## Related

- [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — the Action that wraps this flow, with free PR previews
- [Webhooks](./webhooks.md) — get notified when a deploy changes state
- [Command reference](../digstore/cli/command-reference.md) — every `dig-store` command and flag
- [Concepts & glossary](../concepts.md) — store, capsule, and anchoring defined
