---
sidebar_position: 4.5
title: Project config & build-time values
description: "The committable dig.toml manifest and how to inject PUBLIC build-time config (RPC endpoint, asset/CAT ids, feature flags) into a dapp — plus the one hard rule: a blind static capsule holds no server secrets."
keywords:
  - dig.toml
  - build-time config
  - environment variables
  - public config
  - no server secrets
  - static capsule
tags:
  - digstore-cli
  - dig-toml
  - store
  - capsule
  - anchoring
---

# Project config & build-time values

Every DIG project carries a small, committable manifest — **`dig.toml`** — and most non-trivial dapps also need a few **build-time values** baked into the bundle (an RPC endpoint, a CAT/asset id, a feature flag). This page covers both, and the one rule that governs them: **a capsule is a blind, static artifact, so it can never hold a server secret.**

## `dig.toml` — the project manifest

`dig.toml` lives at your project root, is **safe to commit** (it holds no secrets), and is the single source of project config shared by [`digstore dev`](./quickstart.md), [`digstore deploy`](./deploy-from-github-actions.md), and the scaffolding templates. It's what `digstore new <template>` writes for you.

```toml
# dig.toml — your DIG project config. Committed to your repo; contains NO secrets.
store-id      = "<your 64-hex store id>"   # the store this project deploys to
output-dir    = "dist"                      # the built-output directory to publish
build-command = "npm install && npm run build"  # run before staging (optional)
```

### Keys

Every key is optional; a missing file means all config comes from flags/env.

| Key | Alias | Default | What it sets |
|---|---|---|---|
| `store-id` | `store_id` | — | The 64-hex store id this project deploys to (the store `digstore init` minted). |
| `output-dir` | `output_dir` | `dist` | The built-output directory that gets staged and published. |
| `build-command` | `build_command` | — | A shell command run **before** staging (e.g. `npm install && npm run build`). |
| `message` | — | `deploy <sha>` | Default commit message for the new capsule. |
| `wait-timeout` | `wait_timeout` | `300` | Seconds to wait for on-chain confirmation. |
| `network` | — | `mainnet` | The Chia network to anchor on. |
| `remote` | — | public DIGHub | The remote to publish to (e.g. `dig://<store-id>` or a node URL). |

Both `kebab-case` and `snake_case` keys are accepted, so a hand-edited file is forgiving. A **malformed** file is a hard error (it never silently deploys the wrong thing).

### Precedence

The same value can come from several places. Highest wins:

```
flags  >  environment  >  dig.toml  >  built-in defaults
```

So `digstore deploy --output-dir build` overrides `output-dir = "dist"` in the file for that one run, and the file overrides the built-in `dist` default.

:::note Secrets live in the environment, never in `dig.toml`
Credentials — your wallet mnemonic (`DIGSTORE_PASSPHRASE` / the deploy wallet seed), the writer deploy-key (`DIGSTORE_WRITER_KEY`), the publisher deploy key (`DIGSTORE_DEPLOY_KEY`), a private store's salt (`DIGSTORE_STORE_SALT`) — are read from the **environment**, not the manifest. `dig.toml` is committed; secrets are not. See [Deploy from GitHub Actions](./deploy-from-github-actions.md#security).
:::

## Build-time values for a dapp

A real dapp usually needs a handful of **PUBLIC** values compiled into its bundle: which dig RPC endpoint to read from, a CAT/asset id it transacts with, a feature flag. With DIG you inject these the **ordinary way your framework already does** — at build time, before `digstore` stages the output:

- **Vite** — `import.meta.env.VITE_*` from a `.env` file or the build environment.
- **Next.js (static export)** — `NEXT_PUBLIC_*`.
- **A plain static site** — a small `config.js` you write (or template) before building.

Because `dig.toml`'s `build-command` runs first, your env-driven build produces a fully-baked `output-dir`, and `digstore` simply publishes those bytes. Nothing DIG-specific is required — set your env, build, deploy:

```sh
# Vite example: a PUBLIC RPC endpoint compiled into the bundle.
echo 'VITE_DIG_RPC=https://rpc.dig.net' > .env
digstore deploy        # runs build-command (which reads VITE_DIG_RPC), then publishes dist/
```

```jsx
// In the app, read the baked-in PUBLIC value:
const RPC = import.meta.env.VITE_DIG_RPC; // "https://rpc.dig.net"
```

These values are **baked into the published capsule** and are world-readable — exactly like any value compiled into a client-side bundle on any host. That's fine for an RPC URL, an asset id, or a flag; it is **not** fine for a secret.

## The one hard rule: no server secrets in a blind static capsule

A capsule is a **static, content-addressable artifact served by a blind host** — there is no server you control inside it, and the host stores only ciphertext it cannot read or run logic against. So:

> **Anything you put in a capsule is client-side and PUBLIC. A capsule can hold no server secret, no private API key, and no privileged backend.**

This is the same rule as any static-site or single-page-app deploy, made absolute by the blind-host model: there is genuinely no server-side place to hide a secret.

| Belongs in a capsule (PUBLIC, build-time) | Does **not** belong in a capsule |
|---|---|
| dig RPC / read endpoint URL | Wallet mnemonic or private key |
| CAT / asset ids, public contract ids | The publisher deploy key |
| Feature flags, public config | A private store's `salt` |
| Public analytics keys (if any) | Any third-party **secret** API key |

What to do instead when a dapp needs privileged work:

- **Signing & spends** stay client-side: the user's wallet signs, via [`window.chia`](../../browser/using-window-chia.md) or WalletConnect through the [SDK](../../build-a-dapp/tutorial.md). The capsule never holds a key.
- **Reads** go to the public [dig RPC](../../rpc/what-is-the-dig-rpc.md) — blind and verifiable, no secret needed.
- **A genuine private backend** (a secret third-party API) lives in your **own** service the dapp calls over HTTPS — outside the capsule. The capsule holds only the public URL of that service.
- **Private content** is encrypted: use a [private store](./streaming-and-keys.md) (a secret `salt`) so the bytes are unreadable without the key — the secret is the salt you hold off-capsule, not something embedded in it.

## Related

- [Deploy from GitHub Actions](./deploy-from-github-actions.md) — `dig.toml` + secrets in CI
- [Using DigStore in your project](./project-workflow.md) — capture a build directory and commit it
- [Build a dapp on Chia](../../build-a-dapp/tutorial.md) — the end-to-end tutorial that uses this config
- [Using window.chia](../../browser/using-window-chia.md) — client-side signing, no key in the capsule
- [On-chain anchoring](./onchain-anchoring.md) — what a deploy spends and confirms
- [Concepts & glossary](../../concepts.md) — store, capsule, and anchoring defined
