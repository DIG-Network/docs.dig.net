---
sidebar_position: 8
title: Command reference
description: "Complete command reference for the digstore CLI, including wallet, project, staging, history, content, remote, and maintenance commands."
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

> **On-chain by default.** `init` mints the project's singleton on **Chia mainnet** and `commit` anchors each new deployment root on-chain (both block until confirmed and spend real XCH). Each publishes one **capsule** and costs a flat **100 DIG** (mint or commit) — paid to the DIG treasury in the same spend bundle (memo = store id). Both commands disclose the cost and check your balance before submitting; they block if the wallet is short on XCH **or** DIG. You need an unlocked wallet seed and a funded wallet first — see [On-chain anchoring](./onchain-anchoring.md).

## Start a project & preview — free, no spend

**Try it before you pay.** Scaffolding, previewing, and cost-previews cost nothing — DIG is spent only when you publish (`commit`/`deploy`). Start here:

| Command | What it does |
|---|---|
| `digstore new <template> [dir] [--force] [--list]` | Scaffold a working project locally from a template — **no wallet, no chain, no spend**. Templates: `static-site`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia`. Writes a `dig.toml`, a starter app, and (for the dapp/NFT templates) a `window.chia` usage example. `--list` prints the catalog. |
| `digstore dev [--dir <path>] [--build <cmd>] [--port <n>] [--open]` | Local preview loop: builds on save and serves your project over the **real `dig://` read path** (compile → verify → decrypt, exactly as a visitor's browser does) on `http://127.0.0.1:<port>`, with live reload and an injected dev `window.chia` shim. **Free — no chain, no spend.** Reads `output-dir`/`build-command` from `dig.toml` (flags override). |
| `digstore doctor [--json]` | Pre-publish preflight: checks seed present/unlocked, wallet funds vs the 100 DIG + XCH cost, dighub login, default remote reachable, and content dir present — printed pass/fail. Exits non-zero if a hard check fails. Reads only; never spends. |
| `digstore commit --dry-run [--json]` | Preview the resulting version (root) **and the exact DIG/XCH cost** without spending, anchoring, or publishing anything. |

The intended flow: `digstore new <template>` → edit → `digstore dev` (free preview) → `digstore doctor` → `digstore commit` / `digstore deploy` (the only step that spends DIG).

## Get set up & sign in

| Command | What it does |
|---|---|
| `digstore setup` (alias: `auth`) | One-shot onboarding: import/generate a seed, check funds, and (optionally) sign in to DIGHub. Safe to re-run. `--generate` / `--import`, `--no-login`, `--json`. |
| `digstore link <storeID> [--output-dir <dir>] [--remote <url>]` | Connect the current folder to an existing store — writes a `dig.toml` + remote so `digstore dev`/`deploy` work here. |
| `digstore login` | Sign in to your DIGHub account via device pairing (no password). |
| `digstore whoami` | Show the current DIGHub login (handle / token presence). |
| `digstore logout` | Sign out of DIGHub (clear the stored session). |

## Wallet & on-chain anchoring

| Command | What it does |
|---|---|
| `digstore seed import [--mnemonic <words>]` | Import a BIP-39 mnemonic; encrypted to `~/.dig/seed.enc` and unlocked for the session |
| `digstore seed generate [--words 12\|15\|18\|21\|24]` | Generate a new mnemonic (shown once), encrypt, and unlock |
| `digstore seed status` | Show whether a seed exists and is currently unlocked |
| `digstore lock` | Lock the seed (clear the cached-unlock session) |
| `digstore balance [--json]` | Show spendable XCH (mojos) and DIG (3-decimal display) + the wallet receive address (read-only) |
| `digstore anchor [--wait-timeout <secs>]` | Resume a pending anchor: poll the chain and flip the project to confirmed |
| `digstore anchor status [--json]` | Show the project's anchor state (network, launcher/store id, current coin, height) + the pointer embedded in the module |
| `digstore anchor inspect <module.dig> [--json]` | Decode and print the on-chain pointer embedded in any compiled module file |

Set the wallet passphrase non-interactively with `DIGSTORE_PASSPHRASE`. Global config lives in `~/.dig/config.toml` (`coinset_url`, `unlock_ttl`, `fee`).

## Projects & workspace

A single workspace (`.dig/`) can hold many projects. The commands below create and switch between the projects in your workspace.

| Command | What it does |
|---|---|
| `digstore init [name] [--dir <path>] [--private] [--wait-timeout <secs>]` | Initialize a project (default name `default`); `--dir` sets its content root. **Mints the project singleton on Chia mainnet — the launcher id becomes the store id** — and blocks until confirmed (`--wait-timeout`, default 300s). Costs **100 DIG + an XCH fee** (paid atomically in the same bundle; cost is disclosed before submission). Requires an unlocked seed, XCH, and DIG; on a confirmation timeout the project is kept `pending` and resumable with `digstore anchor`. Interactive when flags are omitted. |
| `digstore stores` (alias: `projects`) | List projects with the active marker, root, content root, and capacity |
| `digstore use <name>` | Set the active project |
| `digstore dir [<path>]` | Show or set the active project's content root |

## Staging & commits

| Command | What it does |
|---|---|
| `digstore add <path…> [-A] [--key <name>]` | Stage files (`-A` = the whole content root) |
| `digstore staged` | List the staging area |
| `digstore unstage` | Clear the staging area |
| `digstore commit [-m <msg>] [--wait-timeout <secs>]` | Seal a new deployment: **anchor the new deployment root on Chia mainnet and block until confirmed** (`--wait-timeout`, default 300s), then compile the module + write the URN manifest. Publishes a new capsule for **100 DIG + an XCH fee** (paid atomically in the same bundle; cost is disclosed before submission). On failure/timeout the local deployment is not finalized (re-run to resume). |
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
| `digstore clone <url>` | Clone a project from a remote. Verified: module identity + signed head + **the served root is checked against the project's current on-chain singleton root** (fails closed) |
| `digstore push [remote]` | Push the local project's content + signed head |
| `digstore pull [remote]` | Pull the latest content + signed head. Verified, including the **on-chain root check** |
| `digstore revoke [--root <hex>\|--all] [--reason <r>]` | Revoke a published root or the whole project with a signed tombstone |
| `digstore serve [--bind <addr:port>] [--store <name>]` | Run a `dig://` remote node for the active store — serves `clone`/`pull`/`push` over the §21 protocol (the same one `rpc.dig.net` speaks), so anyone can host an origin. Each request is authenticated by a signed message from the caller's identity key. |

## CI deploy

| Command | What it does |
|---|---|
| `digstore deploy [--store-id <hex>] [--output-dir <dir>] [--build-command <cmd>] [-m <msg>] [--remote <url>] [--writer-key <hex>] [--preview] [--if-changed]` | Advance an **existing** store from a fresh checkout (CI): reconstruct it locally, stage the output dir, commit + push a new capsule. Reads `dig.toml`. Never mints. `--writer-key` advances the root with a revocable writer-delegated key (no owner seed); `--preview` produces a free, no-spend content-addressed build; `--if-changed` makes a byte-identical build a no-op. |
| `digstore deploy-key export [--out <file>]` | Export the store's §21 publisher deploy key (64-hex) to store as a CI secret |

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
| `digstore compile [--metadata]` | Compile the active project to its self-serving `.dig` WASM module (used internally by the publish flow). |
| `digstore completion <shell>` | Print a shell completion script (`bash`, `zsh`, `fish`, `powershell`, `elvish`). |

## Global flags

| Flag | Effect |
|---|---|
| `--store <name>` (alias: `--project`) | Operate on a specific project (overrides the active project) |
| `-C, --cwd <path>` | Operating directory for this command (overrides the content root) |
| `--dig-dir <path>` | Workspace location |
| `--json` | Machine-readable output |
| `--quiet` | Suppress progress and hints |
| `--verbose` | Verbose (debug-level) logging |
| `--color <auto\|always\|never>` | Color output mode |

## Related

- [Quick start](./quickstart.md) — the most common commands in order
- [On-chain anchoring](./onchain-anchoring.md) — wallet, costs, and the `init`/`commit` flow
- [Sharing over a remote](./sharing.md) — `remote`, `clone`, `push`, `pull`, `revoke`
- [Streaming & retrieval keys](./streaming-and-keys.md) — `cat`, `keys`, `checkout`
- [Deploy from GitHub Actions](./deploy-from-github-actions.md) — `deploy`, `deploy-key`
- [Concepts & glossary](../../concepts.md) — the entities these commands operate on
