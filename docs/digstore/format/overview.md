---
sidebar_position: 1
title: Format Overview
---

# The DigStore WASM Store Format

A DigStore **store** is a content-addressable, encrypted collection of files that compiles into a single WebAssembly module. This page gives you the whole picture in one read; the following pages go deeper on each piece.

## The one-file idea

Most systems separate three things: the **data**, the **server** that serves it, and the **access control** in front of both. DigStore collapses all three into one artifact.

When you `commit`, DigStore compiles your content together with a small, fixed serving program into a single `.wasm` module:

```
        your files (dist/)                a tiny serving program
                │                                  │
                └──────────────┬───────────────────┘
                               ▼
                    digstore commit  →  store.wasm
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                       ▼
  encrypted content      retrieval logic        Merkle root + proofs
  (AES-256-GCM-SIV)      (URN → bytes)           (verifiable to a signed root)
```

That `.wasm` is simultaneously:

- **your data** — every file, chunked and encrypted;
- **the server** — it answers "give me the bytes for this URN" and nothing else;
- **its own guard** — it returns ciphertext addressed by hashes, and it can prove the bytes belong to a specific, publisher-signed root.

Copy the file to back it up. Run it (in a host) to serve it. Hand someone a URN to let them read one resource from it.

## The four concepts

1. **Store** — an identity plus its content and history. A store's identity is a 64-hex **store id** that is its **on-chain Chia singleton launcher id** (minted on mainnet at `init`); the chain singleton is the authority for the store's current root. See [On-chain anchoring](../cli/onchain-anchoring.md).

2. **Generation (capsule)** — a commit. Each `commit` seals the current content into a new generation: an immutable `(storeId, root_hash)` pair anchored on-chain as a CHIP-0035 singleton update, identified by a **root hash** (a Merkle root). That pair is a **capsule** — the unit of retrieval, caching, and pricing (100 DIG per capsule) — so a store is a *sequence of capsules*, one per commit. Generations are append-only, like Git history. (See [the capsule](../../intro.md#the-capsule) for the ecosystem-wide definition.)

3. **URN** — the address *and* the key. `urn:dig:chia:<storeID>[:<rootHash>][/<resourceKey>]` both locates a resource and derives the key that decrypts it. See [URNs & Encryption](./urns-and-encryption.md).

4. **Module** — the compiled `.wasm`. It embeds the encrypted content, a key table, the Merkle tree, and the serving program. See [Store Structure](./store-structure.md).

## What you get from it

- **Encrypted at rest.** Content is encrypted with a key *derived from its URN*. There is no key stored anywhere to recover — lose the URN, lose the read.
- **Provider-blind hosting.** Whoever hosts your store holds only ciphertext keyed by hashes. They can't scan it or read requests.
- **Verified downloads.** `clone`/`pull` reject anything that isn't the genuine, publisher-signed store whose served root matches its current on-chain singleton root (fails closed).
- **Uniform & self-contained.** A store is a single `.wasm`, padded to a uniform size so its bytes reveal nothing about how much content it holds.

## Where DigStore fits

DigStore is **not** a replacement for Git on your source tree. It is for **published build output** — the `dist/` of a web app, a documentation site, a dataset, a release bundle — anything you want to address by URN, encrypt at rest, and hand to an untrusted host or peer.

Next: [Store Structure →](./store-structure.md)
