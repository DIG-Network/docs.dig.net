---
sidebar_position: 3
title: Using DigStore in your project
---

# Using DigStore in your project

This is the day-to-day workflow: point a store at your build output, commit generations as you ship, and manage multiple stores in one project.

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

`commit` seals a new generation, compiles the module, and writes a local **URN manifest** (`urns.json` / `urns.txt`) — your index of every shareable URN for that generation.

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

## Multiple stores per project

One `.dig/` workspace can hold many stores ("capsules"), each with its own content, keys, and history:

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

## A typical release loop

```sh
# once
digstore init site --dir dist
digstore remote add origin https://example.com/stores/<storeID>

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

Next: [Sharing over a remote →](./sharing.md)
