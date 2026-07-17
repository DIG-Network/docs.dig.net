---
sidebar_position: 1
title: What is dig-store?
description: "Git-shaped, content-addressable project format with built-in encryption and URN-based addressing; compiles to a single self-defending WebAssembly module."
keywords:
  - dig-store
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# What is dig-store?

**dig-store is a Git-shaped, encrypted, content-addressable project that compiles to a single self-defending WebAssembly module.**

You get Git-style commands — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — for a project that is **encrypted at rest** and compiles into **one `.wasm` file**. That single file is *both your data and the server that gates access to it*. A host that stores or relays it sees only ciphertext addressed by hashes; it cannot read what it carries.

You address content with a **[URN](./format/urns-and-encryption.md)**, and the URN *is* the key: it both locates and decrypts. Hand someone a URN and they can read that resource; without it they can't — there is no separate password or access list to manage.

Unlike Git, dig-store is built for **build output**, not repository source. You point a project at a directory like `dist/` and it captures what's there.

## Why it exists

| Problem | dig-store's answer |
|---|---|
| Hosts can read / scan what you publish | Content is encrypted at rest; the host holds only ciphertext keyed by hashes |
| Access control means passwords and ACLs | The URN *is* the capability — share it to grant read, withhold it to deny |
| You have to trust the server to serve genuine bytes | `clone`/`pull` verify the module's store id, the publisher's signed root, and the **on-chain singleton root** before installing — fails closed |
| "How big is this payload?" leaks from file size | Every project is one `.wasm`, padded to a uniform size that reveals nothing about its contents |
| Serving logic lives separately from the data | The data and the code that gates it compile into the *same* module |

## How to read these docs

- **[The dig-store Format](./format/overview.md)** — the concepts: projects, deployments, the `.wasm` module, URNs, encryption, and proofs. Start here if you want to understand *what* dig-store is.
- **[CLI Tutorial](./cli/install.md)** — install the CLI and use it in a real project: initialize a project, capture a build directory, commit deployments, share over a remote, and stream content back out.

If you just want to try it, jump straight to the **[Quickstart](../quickstart.md)** (the free, web-first path) or the **[CLI tutorial](./cli/quickstart.md)**.

:::note
dig-store is part of the [DIG Network](https://dig.net). The full technical design lives in the [Protocol section](../protocol-deep-dive.md) — the content-addressable WASM store format.
:::

## Related

- [The dig-store Format](./format/overview.md) — projects, the WASM module, URNs, encryption, proofs
- [Store structure](./format/store-structure.md) — store identity, generations, and the compiled module
- [URNs & Encryption](./format/urns-and-encryption.md) — the URN that both addresses *and* decrypts
- [CLI tutorial](./cli/quickstart.md) — create, commit, and read a store in minutes
- [Concepts & glossary](../concepts.md) — the core DIG entities at a glance
