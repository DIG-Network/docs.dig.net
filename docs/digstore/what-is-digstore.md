---
sidebar_position: 1
title: What is DigStore?
---

# What is DigStore?

**DigStore is a Git-shaped, encrypted, content-addressable store that compiles to a single self-defending WebAssembly module.**

You get Git-style commands — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — for a store that is **encrypted at rest** and compiles into **one `.wasm` file**. That single file is *both your data and the server that gates access to it*. A host that stores or relays it sees only ciphertext addressed by hashes; it cannot read what it carries.

You address content with a **URN**, and the URN *is* the key: it both locates and decrypts. Hand someone a URN and they can read that resource; without it they can't — there is no separate password or access list to manage.

Unlike Git, DigStore is built for **build output**, not repository source. You point a store at a directory like `dist/` and it captures what's there.

## Why it exists

| Problem | DigStore's answer |
|---|---|
| Hosts can read / scan what you publish | Content is encrypted at rest; the host holds only ciphertext keyed by hashes |
| Access control means passwords and ACLs | The URN *is* the capability — share it to grant read, withhold it to deny |
| You have to trust the server to serve genuine bytes | `clone`/`pull` verify the module's store id and the publisher's signed root before installing |
| "How big is this payload?" leaks from file size | Every store is one `.wasm`, padded to a uniform size that reveals nothing about its contents |
| Serving logic lives separately from the data | The data and the code that gates it compile into the *same* module |

## How to read these docs

- **[The DigStore Format](./format/overview.md)** — the concepts: stores, generations, the `.wasm` module, URNs, encryption, and proofs. Start here if you want to understand *what* DigStore is.
- **[CLI Tutorial](./cli/install.md)** — install the CLI and use it in a real project: initialize a store, capture a build directory, commit generations, share over a remote, and stream content back out.

If you just want to try it, jump straight to the **[Quick start](./cli/quickstart.md)**.

:::note
DigStore is part of the [DIG Network](https://dig.net). The full technical design lives in the DigStore whitepaper, *The Content-Addressable WASM Store Format*.
:::
