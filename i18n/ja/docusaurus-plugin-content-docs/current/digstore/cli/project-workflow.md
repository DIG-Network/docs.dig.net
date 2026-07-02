---
sidebar_position: 4
title: Using DigStore in your project
description: "Workflow for initializing projects, managing staging areas, running multiple stores in one workspace, and typical release loops."
keywords:
  - digstore workflow
  - build output
  - staging area
  - multiple stores
  - release loop
tags:
  - digstore-cli
  - store
  - capsule
  - anchoring
---

# Using DigStore in your project

This is the day-to-day workflow: point a store at your build output, commit deployments as you ship, and manage multiple stores in one workspace.

## Capture a build directory

DigStore is built for **build output**. Point a store at the directory your build produces:

```sh
# in your project root
digstore init site --dir dist
```

Now `add`/`urn`/`status` operate relative to `dist/`. Build, then capture:

```sh
npm run build            # produces dist/
digstore add -A          # stage everything under the content root (dist/)
digstore commit -m "v1"
```

`commit` anchors the new root on Chia mainnet (blocks until confirmed, spends XCH), then seals the deployment, compiles the module, and writes a local **URN manifest** (`urns.json` / `urns.txt`) — your index of every shareable URN for that deployment. See [On-chain anchoring](./onchain-anchoring.md).

Change or override the content root anytime:

```sh
digstore dir build/site      # set the active store's content root
digstore -C ./dist add -A    # override for just this command
```

## Staging area

Staging works like Git's index:

```sh
digstore add path/to/file        # stage one file
digstore add . src/*.css         # stage paths / globs
digstore add -A                  # stage the whole content root
digstore staged                  # list staged files + size + remaining headroom
digstore unstage                 # clear the staging area
```

Each store is capped at **128 MB** of staged content. `add`, `status`, `staged`, and `stores` all show remaining capacity; `add` refuses content that would exceed the cap.

## Multiple stores per workspace

One `.dig/` workspace can hold many stores, each with its own content, keys, and history:

```sh
digstore init site --dir dist
digstore init docs --dir build/docs

digstore stores                  # list stores; * marks the active one + capacity
digstore use site                # switch the active store
```

Pick which store a command targets:

```sh
digstore --store site add -A     # target "site" regardless of the active store
```

**Selection precedence:** `--store <name>` → the active store (`use`) → the single store if there's only one.

> **Back-compat aliases.** `digstore projects` (for `digstore stores`) and the `--project` flag are kept only as hidden aliases for older scripts; new usage should say `stores` / `--store`.

## A typical release loop

```sh
# once
digstore init site --dir dist
digstore remote add origin https://example.com/stores/<storeId>

# every release
npm run build
digstore add -A
digstore commit -m "v1.4.2"
digstore push origin
```

## Handy globals

| Flag | Effect |
|---|---|
| `--store <name>` | Operate on a specific store |
| `-C, --cwd <path>` | Operating directory for this command (overrides the content root) |
| `--dig-dir <path>` | Use a specific workspace location |
| `--json` | Machine-readable output (great for scripts/CI) |
| `--quiet` / `--verbose` | Less / more output |

## Related

- [Project config & build-time values](./configuration.md) — the `dig.toml` manifest and PUBLIC build config
- [Sharing over a remote](./sharing.md) — publish a store and let others clone/pull it
- [Deploy from GitHub Actions](./deploy-from-github-actions.md) — auto-publish this build on every push
- [Streaming & retrieval keys](./streaming-and-keys.md) — read content back out
- [On-chain anchoring](./onchain-anchoring.md) — what `commit` spends and confirms
- [Command reference](./command-reference.md) — every `digstore` command and flag
- [Concepts & glossary](../../concepts.md) — store, capsule, and generation defined

Next: [Sharing over a remote →](./sharing.md)
