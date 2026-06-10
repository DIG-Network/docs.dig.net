---
sidebar_position: 2
title: Quick start
---

# Quick start

Create a store, commit a file, and read it back — in under a minute.

## 1. Initialize a workspace

```sh
mkdir my-project && cd my-project
digstore init
```

`digstore init` creates a `.dig/` workspace and a store named `default`. Run interactively, it asks a couple of setup questions so the store is ready to use:

```
Relative path to the build/content directory this store captures [.]:
Make this a private (salted) store? [y/N]:
```

- The **content directory** is what the store captures (a build dir like `dist/`). Press Enter to use the current directory.
- **Private** mixes in a secret salt so the URN alone can't decrypt (see [Public vs private](../format/urns-and-encryption.md#public-vs-private-stores)).

You can skip the prompts with flags — handy in scripts:

```sh
digstore init                       # current dir, public
digstore init site --dir dist       # a store named "site" capturing ./dist
digstore init --private             # private store
```

## 2. Add and commit

```sh
echo "hello digstore" > readme.txt

digstore add readme.txt --key readme    # stage one file under the key "readme"
digstore commit -m "first generation"   # seal a generation + compile the module
```

`--key` sets the resource key explicitly; without it the key defaults to the path relative to the content root. Use `-A` to stage everything under the content root:

```sh
digstore add -A
```

## 3. Inspect

```sh
digstore status            # what's staged / modified + remaining capacity
digstore log               # generations — each root hash is a commit
digstore urn readme.txt    # preview the exact URN this file has
```

`digstore log --json` prints the store id and root hashes you'll need to build a full URN.

## 4. Read it back

A URN locates *and* decrypts. With the store id and root from `digstore log --json`:

```sh
digstore cat urn:dig:chia:<storeID>:<rootHash>/readme
# → hello digstore
```

Omit the `<rootHash>` to read from the current generation:

```sh
digstore cat urn:dig:chia:<storeID>/readme
```

Write the output to a file instead of stdout:

```sh
digstore cat urn:dig:chia:<storeID>/readme --out readme.copy.txt
```

## Where to go next

- **[Project workflow](./project-workflow.md)** — capture a real build directory, use multiple stores, manage staging.
- **[Sharing over a remote](./sharing.md)** — publish a store and let others `clone`/`pull` it.
- **[Streaming & keys](./streaming-and-keys.md)** — fetch encrypted vs decrypted, list retrieval keys, checkout a whole generation.
