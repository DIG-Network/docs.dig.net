---
sidebar_position: 6
title: Streaming & retrieval keys
description: "Streaming resources by URN or retrieval key, listing keys per deployment, and checking out entire generations."
keywords:
  - digstore cat
  - retrieval key
  - URN
  - checkout
  - streaming
tags:
  - digstore-cli
  - retrieval-key
  - urn
  - encryption
  - generation
---

# Streaming & retrieval keys

DigStore lets you stream a resource out **by URN** (decrypted) or **by retrieval key** (encrypted), optionally to a file — plus list every resource's retrieval key and check out a whole deployment.

## `cat` — stream one resource

`digstore cat <target>` accepts either a URN or a 64-hex retrieval key, and the two behave differently:

| You pass… | You get back | Use it for |
|---|---|---|
| a **URN** (`urn:dig:…`) | the resource **decrypted** (final plaintext) | reading content you hold the URN for |
| a **retrieval key** (64-hex) | the **raw encrypted** bytes, no decryption | moving/mirroring ciphertext without the read capability |

```sh
# By URN → decrypted
digstore cat urn:dig:chia:<storeId>/logo.png --out logo.png

# By retrieval key → encrypted bytes only (resolved within the active project)
digstore cat 34e4d485…b111 --out logo.png.enc
```

Both forms support `--out <file>` to write to a file instead of stdout, and the URN form supports `--verify-proof` (check the Merkle proof against the trusted root) and `--salt <hex>` (private projects).

Why two modes? The URN and the retrieval key are **different values** (see [URNs & Encryption](../format/urns-and-encryption.md)). The retrieval key only *locates* ciphertext; it cannot decrypt. So passing a retrieval key gives you the encrypted bytes — useful for a host or mirror that should move data without being able to read it.

## `keys` — list retrieval keys

`digstore keys` lists every committed resource in a deployment with its URN and retrieval key:

```sh
digstore keys                  # current deployment
digstore keys --root <hex>     # a specific deployment
digstore keys --json           # machine-readable
```

Example (`--json`):

```json
[
  {
    "key": "readme.txt",
    "urn": "urn:dig:chia:285539…aade/readme.txt",
    "retrieval_key": "34e4d485387f30e904c1e4e7d77e83d68c5acbd618852a676e20394dbac5b111"
  }
]
```

The retrieval key is **root-independent** — derived from the store id and resource key, not the deployment — so it's stable across commits.

## `checkout` — materialize a whole deployment

To write an entire deployment's content to a directory (decrypted):

```sh
digstore checkout <root> --out ./restored
digstore checkout <root> --out ./restored --salt <hex>   # private project
```

This is the bulk counterpart to `cat`: instead of one resource, it reconstructs every file in that deployment under `--out`.

## Related

- [URNs & Encryption](../format/urns-and-encryption.md) — why the URN and retrieval key are different values
- [Command reference](./command-reference.md) — full flags for `cat`, `keys`, and `checkout`
- [The dig RPC: Streaming](../../rpc/streaming.md) — the same fetch, over the network in chunks
- [CLI tutorial](./quickstart.md) — read a resource back end to end
- [Concepts & glossary](../../concepts.md) — URN and retrieval key defined

Next: [Deploy from GitHub Actions →](./deploy-from-github-actions.md), or see the full [Command reference](./command-reference.md)
