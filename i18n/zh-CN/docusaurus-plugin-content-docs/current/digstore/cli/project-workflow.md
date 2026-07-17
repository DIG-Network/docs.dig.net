---
sidebar_position: 4
title: Using dig-store in your project
description: "Workflow for initializing projects, managing staging areas, running multiple stores in one workspace, and typical release loops."
keywords:
  - dig-store workflow
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

# Using dig-store in your project

This is the day-to-day workflow: point a store at your build output, commit deployments as you ship, and manage multiple stores in one workspace.

## Capture a build directory

dig-store is built for **build output**. Point a store at the directory your build produces:

```sh
# in your project root
dig-store init site --dir dist
```

Now `add`/`urn`/`status` operate relative to `dist/`. Build, then capture:

```sh
npm run build            # produces dist/
dig-store add -A          # stage everything under the content root (dist/)
dig-store commit -m "v1"
```

`commit` anchors the new root on Chia mainnet (blocks until confirmed, spends XCH), then seals the deployment, compiles the module, and writes a local **URN manifest** (`urns.json` / `urns.txt`) — your index of every shareable URN for that deployment. See [On-chain anchoring](./onchain-anchoring.md).

Change or override the content root anytime:

```sh
dig-store dir build/site      # set the active store's content root
dig-store -C ./dist add -A    # override for just this command
```

## Staging area

Staging works like Git's index:

```sh
dig-store add path/to/file        # stage one file
dig-store add . src/*.css         # stage paths / globs
dig-store add -A                  # stage the whole content root
dig-store staged                  # list staged files + size + remaining headroom
dig-store unstage                 # clear the staging area
```

Each store is capped at **128 MB** of staged content. `add`, `status`, `staged`, and `stores` all show remaining capacity; `add` refuses content that would exceed the cap.

## Multiple stores per workspace

One `.dig/` workspace can hold many stores, each with its own content, keys, and history:

```sh
dig-store init site --dir dist
dig-store init docs --dir build/docs

dig-store stores                  # list stores; * marks the active one + capacity
dig-store use site                # switch the active store
```

Pick which store a command targets:

```sh
dig-store --store site add -A     # target "site" regardless of the active store
```

**Selection precedence:** `--store <name>` → the active store (`use`) → the single store if there's only one.

> **Back-compat aliases.** `dig-store projects` (for `dig-store stores`) and the `--project` flag are kept only as hidden aliases for older scripts; new usage should say `stores` / `--store`.

## A typical release loop

```sh
# once
dig-store init site --dir dist
dig-store remote add origin https://example.com/stores/<storeId>

# every release
npm run build
dig-store add -A
dig-store commit -m "v1.4.2"
dig-store push origin
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
- [Command reference](./command-reference.md) — every `dig-store` command and flag
- [Concepts & glossary](../../concepts.md) — store, capsule, and generation defined

Next: [Sharing over a remote →](./sharing.md)
