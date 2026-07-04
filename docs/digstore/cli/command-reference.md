---
sidebar_position: 8
title: Command reference
description: "Complete command reference for the digstore CLI, including wallet, store, staging, history, content, remote, and maintenance commands."
keywords:
  - digstore command reference
  - digstore CLI commands
  - init
  - commit
  - clone
  - push
  - pull
tags:
  - digstore-cli
  - store
  - anchoring
  - dig-payment
  - retrieval-key
  - urn
---

# Command reference

Every `digstore` command. Run `digstore <command> --help` for full flags and examples.

> **On-chain by default.** `init` mints the store's singleton on **Chia mainnet** and `commit` anchors each new deployment root on-chain (both block until confirmed and spend real XCH). Each publishes one **capsule** and costs the **uniform capsule price in $DIG** (mint or commit) — paid to the DIG treasury in the same spend bundle (memo = store id). Both commands disclose the cost and check your balance before submitting; they block if the wallet is short on XCH **or** DIG. You need an unlocked wallet seed and a funded wallet first — see [On-chain anchoring](./onchain-anchoring.md).

## Start a store & preview — free, no spend

**Try it before you pay.** Scaffolding, previewing, and cost-previews cost nothing — $DIG is spent only when you publish (`commit`/`deploy`). Start here:

| Command | What it does |
|---|---|
| `digstore new <template> [dir] [--force] [--list]` | Scaffold a working project locally from a template — **no wallet, no chain, no spend**. Templates: `static-site`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia`. Writes a `dig.toml`, a starter app, and (for the dapp/NFT templates) a `window.chia` usage example. `--list` prints the catalog. |
| `digstore dev [--dir <path>] [--build <cmd>] [--port <n>] [--open]` | Local preview loop: builds on save and serves your project over the **real `chia://` read path** (compile → verify → decrypt, exactly as a visitor's browser does) on `http://127.0.0.1:<port>`, with live reload and an injected dev `window.chia` shim. **Free — no chain, no spend.** Reads `output-dir`/`build-command` from `dig.toml` (flags override). |
| `digstore doctor [--json]` | Pre-publish preflight: checks seed present/unlocked, wallet funds vs the capsule price in $DIG + XCH cost, dighub login, default remote reachable, and content dir present — printed pass/fail. Exits non-zero if a hard check fails. Reads only; never spends. |
| `digstore commit --dry-run [--json]` | Preview the resulting version (root) **and the exact DIG/XCH cost** without spending, anchoring, or publishing anything. |

The intended flow: `digstore new <template>` → edit → `digstore dev` (free preview) → `digstore doctor` → `digstore commit` / `digstore deploy` (the only step that spends DIG).

## Get set up & sign in

| Command | What it does |
|---|---|
| `digstore setup` (alias: `auth`) | One-shot onboarding: import/generate a seed, check funds, and (optionally) sign in to DIGHUb. Safe to re-run. `--generate` / `--import`, `--no-login`, `--json`. |
| `digstore link <storeID> [--output-dir <dir>] [--remote <url>]` | Connect the current folder to an existing store — writes a `dig.toml` + remote so `digstore dev`/`deploy` work here. |
| `digstore login` | Sign in to your DIGHUb account via device pairing (no password). |
| `digstore whoami` | Show the current DIGHUb login (handle / token presence). |
| `digstore logout` | Sign out of DIGHUb (clear the stored session). |

## Wallet & on-chain anchoring

| Command | What it does |
|---|---|
| `digstore seed import [--mnemonic <words>]` | Import a BIP-39 mnemonic; encrypted to `~/.dig/seed.enc` and unlocked for the session |
| `digstore seed generate [--words 12\|15\|18\|21\|24]` | Generate a new mnemonic (shown once), encrypt, and unlock |
| `digstore seed status` | Show whether a seed exists and is currently unlocked |
| `digstore lock` | Lock the seed (clear the cached-unlock session) |
| `digstore balance [--json]` | Show spendable XCH (mojos) and DIG (3-decimal display) + the wallet receive address (read-only) |
| `digstore anchor [--wait-timeout <secs>]` | Resume a pending anchor: poll the chain and flip the store to confirmed |
| `digstore anchor status [--json]` | Show the store's anchor state (network, launcher/store id, current coin, height) + the pointer embedded in the module |
| `digstore anchor inspect <module.dig> [--json]` | Decode and print the on-chain pointer embedded in any compiled module file |

Set the wallet passphrase non-interactively with `DIGSTORE_PASSPHRASE`. Global config lives in `~/.dig/config.toml` (`coinset_url`, `unlock_ttl`, `fee`, `node.url`).

## Configuration

| Command | What it does |
|---|---|
| `digstore config node.url <url>` | Persist a custom node endpoint to `~/.dig/config.toml` — every subsequent command talks to this node first, ahead of the automatic `dig.local` → `localhost` → `rpc.dig.net` resolution below. |
| `digstore config node.url --unset` | Remove the stored override; resolution falls back to the automatic ladder. |
| `digstore config <key> [<value>]` | Get or set any config key in `~/.dig/config.toml` (`coinset_url`, `unlock_ttl`, `fee`, `node.url`). Omit `<value>` to print the current value. |

### Which node digstore talks to

Every command that reaches a node (`clone`, `pull`, `push`, reads, `serve` peers, etc.) resolves the endpoint in this fixed order, using the first that responds:

1. **An explicit override** — the `--node <url>` global flag, then the `$DIG_NODE_URL` environment variable, then the `node.url` value in `~/.dig/config.toml` (set via `digstore config node.url <url>`). Any of these always wins over the steps below.
2. **`dig.local`** — your installed local dig-node.
3. **`localhost`** — a dig-node on the loopback address, its default local port.
4. **`rpc.dig.net`** — the public gateway, the final fallback when no local node answers.

Each tier is a cheap health probe with a short timeout, so digstore never hangs waiting on an unreachable local node. Connections to any tier use mTLS with a client certificate derived from your identity key; `rpc.dig.net` additionally serves plain HTTPS for browsers, which can't present a client certificate. See [Point a consumer at your node](../../run-a-node/point-a-consumer.md) for the same ladder as it applies to the DIG Browser and extension.

## Stores & workspace

A single workspace (`.dig/`) can hold many stores. The commands below create and switch between the stores in your workspace.

| Command | What it does |
|---|---|
| `digstore init [name] [--dir <path>] [--private] [--wait-timeout <secs>]` | Initialize a store (default name `default`); `--dir` sets its content root. **Mints the store singleton on Chia mainnet — the launcher id becomes the store id** — and blocks until confirmed (`--wait-timeout`, default 300s). Costs the **uniform capsule price in $DIG + an XCH fee** (paid atomically in the same bundle; cost is disclosed before submission). Requires an unlocked seed, XCH, and DIG; on a confirmation timeout the store is kept `pending` and resumable with `digstore anchor`. Interactive when flags are omitted. |
| `digstore stores` | List stores with the active marker, root, content root, and capacity |
| `digstore use <name>` | Set the active store |
| `digstore dir [<path>]` | Show or set the active store's content root |

> **Back-compat aliases.** `digstore projects` (for `digstore stores`) and the `--project` flag are kept only as hidden aliases for older scripts; new usage should say `stores` / store.

## Staging & commits

| Command | What it does |
|---|---|
| `digstore add <path…> [-A] [--key <name>]` | Stage files (`-A` = the whole content root) |
| `digstore staged` | List the staging area |
| `digstore unstage` | Clear the staging area |
| `digstore commit [-m <msg>] [--wait-timeout <secs>]` | Seal a new deployment: **anchor the new deployment root on Chia mainnet and block until confirmed** (`--wait-timeout`, default 300s), then compile the module + write the URN manifest. Publishes a new capsule for the **uniform capsule price in $DIG + an XCH fee** (paid atomically in the same bundle; cost is disclosed before submission). On failure/timeout the local deployment is not finalized (re-run to resume). |
| `digstore commit --dry-run [--json]` | Preview the resulting version (root) + the exact DIG/XCH cost **without spending or publishing** anything. |
| `digstore status` | Show staged / modified / untracked + remaining capacity |

## History

| Command | What it does |
|---|---|
| `digstore log [--limit N]` | List deployments (each root hash is a commit) |
| `digstore diff <a> <b>` | Compare two deployments |

## Reading content

| Command | What it does |
|---|---|
| `digstore urn [PATHS…] [--root <hex>]` | Preview the URN(s) and retrieval key(s) files will have |
| `digstore keys [--root <hex>]` | List the retrieval key + URN for every committed resource |
| `digstore cat <urn-or-retrieval-key> [--out <file>] [--salt <hex>] [--verify-proof]` | Stream a resource out — by URN (decrypted) or retrieval key (encrypted) |
| `digstore checkout <root> --out <dir> [--salt <hex>]` | Write a whole deployment to a directory |

## Remotes & sharing

| Command | What it does |
|---|---|
| `digstore remote add\|list\|remove …` | Manage remotes |
| `digstore clone <url>` | Clone a store from a remote. Verified: module identity + signed head + **the served root is checked against the store's current on-chain singleton root** (fails closed) |
| `digstore push [remote]` | Push the local store's content + signed head |
| `digstore pull [remote]` | Pull the latest content + signed head. Verified, including the **on-chain root check** |
| `digstore revoke [--root <hex>\|--all] [--reason <r>]` | Revoke a published root or the whole store with a signed tombstone |
| `digstore serve [--bind <addr:port>] [--store <name>]` | Run a `dig://` remote node for the active store — serves `clone`/`pull`/`push` over the §21 protocol (the same one `rpc.dig.net` speaks), so anyone can host an origin. Each request is authenticated by a signed message from the caller's identity key. |

## CI deploy

| Command | What it does |
|---|---|
| `digstore deploy [--store-id <hex>] [--output-dir <dir>] [--build-command <cmd>] [-m <msg>] [--remote <url>] [--writer-key <hex>] [--preview] [--if-changed]` | Advance an **existing** store from a fresh checkout (CI): reconstruct it locally, stage the output dir, commit + push a new capsule. Reads `dig.toml`. Never mints. `--writer-key` advances the root with a revocable writer-delegated key (no owner seed); `--preview` produces a free, no-spend content-addressed build; `--if-changed` makes a byte-identical build a no-op. |
| `digstore deploy-key export [--out <file>]` | Export the store's §21 publisher deploy key (64-hex) to store as a CI secret |
| `digstore authorize-origin-as-writer <origin> [--pubkey <hex>] [--dry-run] [--fee <mojos>]` | Discover ORIGIN's DIG pubkey at `https://<origin>/.well-known/dig/pubkey` and add it as a CHIP-0035 **writer** delegate on the active store — authorizes a website/hub's own identity directly, with no key to copy or hub-managed secret. `--pubkey` skips discovery for a caller that already has the key. Idempotent: re-authorizing an already-authorized pubkey is a no-op. |

See [Deploy from GitHub Actions](./deploy-from-github-actions.md) for the full workflow.

## Assets — NFTs, collections, DIDs, offers

Build the spend with the canonical CHIP-0035 builders, sign with your wallet, and push via coinset — every command is `--json` / `--dry-run` CI-safe.

| Command | What it does |
|---|---|
| `digstore nft mint\|bulk\|transfer\|list …` | Mint an NFT (media stored permanently in a DIG capsule), bulk-mint, transfer, or list the NFTs the wallet owns. |
| `digstore collection create\|mint\|show\|list …` | Define a collection (shared id/name/royalty) and bulk-mint its items from a traits manifest, attributed to a creator DID. |
| `digstore did create …` | Create a creator-identity DID (decentralized identifier) owned by the wallet. |
| `digstore offer make\|take\|show …` | Make, take, and inspect Chia offers (XCH / CAT trades). |

## Maintenance

| Command | What it does |
|---|---|
| `digstore update [--check] [--yes]` | Update DigStore to the latest release |
| `digstore compile [--metadata]` | Compile the active store to its self-serving `.dig` WASM module (used internally by the publish flow). |
| `digstore completion <shell>` | Print a shell completion script (`bash`, `zsh`, `fish`, `powershell`, `elvish`). |

## Global flags

| Flag | Effect |
|---|---|
| `--node <url>` | Use this node for the command, ahead of the automatic `dig.local` → `localhost` → `rpc.dig.net` resolution. Same precedence tier as `$DIG_NODE_URL` and the stored `node.url` config (flag wins if more than one is set) — see [Which node digstore talks to](#which-node-digstore-talks-to). |
| `--store <name>` | Operate on a specific store (overrides the active store). `--project` is a hidden back-compat alias. |
| `-C, --cwd <path>` | Operating directory for this command (overrides the content root) |
| `--dig-dir <path>` | Workspace location |
| `--json` | Machine-readable output |
| `--quiet` | Suppress progress and hints |
| `--verbose` | Verbose (debug-level) logging |
| `--color <auto\|always\|never>` | Color output mode |

## Related

- [CLI tutorial](./quickstart.md) — the most common commands in order
- [On-chain anchoring](./onchain-anchoring.md) — wallet, costs, and the `init`/`commit` flow
- [Sharing over a remote](./sharing.md) — `remote`, `clone`, `push`, `pull`, `revoke`
- [Streaming & retrieval keys](./streaming-and-keys.md) — `cat`, `keys`, `checkout`
- [Deploy from GitHub Actions](./deploy-from-github-actions.md) — `deploy`, `deploy-key`
- [Point a consumer at your node](../../run-a-node/point-a-consumer.md) — the same node-resolution ladder for the DIG Browser and extension
- [Concepts & glossary](../../concepts.md) — the entities these commands operate on
