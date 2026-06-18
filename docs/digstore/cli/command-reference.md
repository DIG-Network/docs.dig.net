---
sidebar_position: 7
title: Command reference
---

# Command reference

Every `digstore` command. Run `digstore <command> --help` for full flags and examples.

> **On-chain by default.** `init` mints the project's singleton on **Chia mainnet** and `commit` anchors each new deployment root on-chain (both block until confirmed and spend real XCH). Starting in v0.5.4, `init` also costs **100 DIG** and `commit` costs **10 DIG** — paid to the DIG treasury in the same spend bundle (memo = store id). Both commands disclose the cost and check your balance before submitting; they block if the wallet is short on XCH **or** DIG. You need an unlocked wallet seed and a funded wallet first — see [On-chain anchoring](./onchain-anchoring.md).

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
| `digstore commit [-m <msg>] [--wait-timeout <secs>]` | Seal a new deployment: **anchor the new deployment root on Chia mainnet and block until confirmed** (`--wait-timeout`, default 300s), then compile the module + write the URN manifest. Costs **10 DIG + an XCH fee** (paid atomically in the same bundle; cost is disclosed before submission). On failure/timeout the local deployment is not finalized (re-run to resume). |
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

## Maintenance

| Command | What it does |
|---|---|
| `digstore update [--check] [--yes]` | Update DigStore to the latest release |

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
