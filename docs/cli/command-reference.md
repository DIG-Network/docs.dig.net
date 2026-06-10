---
sidebar_position: 6
title: Command reference
---

# Command reference

Every `digstore` command. Run `digstore <command> --help` for full flags and examples.

## Stores & workspace

| Command | What it does |
|---|---|
| `digstore init [name] [--dir <path>] [--private]` | Initialize a store (default name `default`); `--dir` sets its content root. Interactive when flags are omitted. |
| `digstore stores` | List stores with the active marker, root, content root, and capacity |
| `digstore use <name>` | Set the active store |
| `digstore dir [<path>]` | Show or set the active store's content root |

## Staging & commits

| Command | What it does |
|---|---|
| `digstore add <path…> [-A] [--key <name>]` | Stage files (`-A` = the whole content root) |
| `digstore staged` | List the staging area |
| `digstore unstage` | Clear the staging area |
| `digstore commit [-m <msg>]` | Seal a new generation, compile the module, write the URN manifest |
| `digstore status` | Show staged / modified / untracked + remaining capacity |

## History

| Command | What it does |
|---|---|
| `digstore log [--limit N]` | List generations (each root hash is a commit) |
| `digstore diff <a> <b>` | Compare two generations |

## Reading content

| Command | What it does |
|---|---|
| `digstore urn [PATHS…] [--root <hex>]` | Preview the URN(s) and retrieval key(s) files will have |
| `digstore keys [--root <hex>]` | List the retrieval key + URN for every committed resource |
| `digstore cat <urn-or-retrieval-key> [--out <file>] [--salt <hex>] [--verify-proof]` | Stream a resource out — by URN (decrypted) or retrieval key (encrypted) |
| `digstore checkout <root> --out <dir> [--salt <hex>]` | Write a whole generation to a directory |

## Remotes & sharing

| Command | What it does |
|---|---|
| `digstore remote add\|list\|remove …` | Manage remotes |
| `digstore clone <url>` | Clone a store from a remote (verified) |
| `digstore push [remote]` | Push the local store's content + signed head |
| `digstore pull [remote]` | Pull the latest content + signed head (verified) |
| `digstore revoke [--root <hex>\|--all] [--reason <r>]` | Revoke a published root or the whole store with a signed tombstone |

## Maintenance

| Command | What it does |
|---|---|
| `digstore update [--check] [--yes]` | Update DigStore to the latest release |

## Global flags

| Flag | Effect |
|---|---|
| `--store <name>` | Operate on a specific store (overrides the active store) |
| `-C, --cwd <path>` | Operating directory for this command (overrides the content root) |
| `--dig-dir <path>` | Workspace location |
| `--json` | Machine-readable output |
| `--quiet` | Suppress progress and hints |
| `--verbose` | Verbose (debug-level) logging |
| `--color <auto\|always\|never>` | Color output mode |
