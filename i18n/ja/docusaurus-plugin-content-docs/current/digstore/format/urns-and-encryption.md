---
sidebar_position: 3
title: URNs & Encryption
description: "URN format and semantics, derivation of retrieval and decryption keys, AES-256-GCM-SIV encryption, and public vs. private store differences."
keywords:
  - URN
  - retrieval key
  - decryption key
  - AES-256-GCM-SIV
  - encryption
  - public vs private store
tags:
  - urn
  - retrieval-key
  - encryption
  - store
  - digstore-cli
  - chia-protocol
---

# URNs & Encryption

:::info Normative spec
The byte-exact grammar, the rootless `retrieval_key` invariant, and the HKDF/GCM-SIV constants are in the Protocol section: [URN & addressing](../../protocol/urn-and-addressing.md) and [Cryptography](../../protocol/cryptography.md).
:::

The URN is the heart of dig-store. It is **both** the address that locates a resource **and** the secret that decrypts it.

## URN format

```
urn:dig:<chain>:<storeId>[:<rootHash>][/<resourceKey>]
```

| Part | Role | Required |
|---|---|---|
| `urn:dig:` | Scheme + namespace | Required (literal) |
| `<chain>` | Chain identifier, e.g. `chia` | Required |
| `<storeId>` | 64-hex store id | Required |
| `<rootHash>` | Pin a specific generation; omit for the current one | Optional |
| `<resourceKey>` | Which resource (content-root-relative path); omit for store-level | Optional |

Examples:

```
urn:dig:chia:285539…aade/readme.txt              # current generation
urn:dig:chia:285539…aade:1a2b3c…/readme.txt      # pinned to a generation
```

Preview the exact URN a file *will* have before you commit:

```sh
digs urn readme.txt
digs urn -A            # every staged file
```

## Two values, one string

When a client resolves a URN, it canonicalizes the string and derives **two** values from it — and from nothing else:

```
retrieval_key  = SHA-256(canonical_urn)                       # WHERE the bytes are
decryption_key = HKDF-SHA256(ikm = canonical_urn, …)          # WHAT decrypts them
```

- The **retrieval key** is the only address that leaves the client. It locates the encrypted chunks via the module's key table. The URN itself never goes to the host.
- The **decryption key** is an AES-256 key derived locally. The host never sees it and performs no decryption.

This split is what makes the URN a **capability**: possessing it is *necessary and sufficient* to both find and read a resource in a public store.

:::tip Retrieval keys are root-independent
A URN without a `rootHash` derives a *root-independent* key, so the same key locates the resource across generations. You can list every resource's retrieval key with `digs keys`. This matters for the cipher choice below.
:::

## Encryption

Each resource's chunks are encrypted with **AES-256-GCM-SIV** (RFC 8452) — a nonce-misuse-resistant authenticated cipher — under the resource's URN-derived key, with a fixed all-zero nonce.

Why GCM-SIV and not plain GCM? GCM-SIV derives a synthetic IV internally from the key and plaintext, so a fixed nonce is safe even when the *same* key seals *different* plaintexts across generations (which root-independent keys do). It also keeps encryption **deterministic**, which the ciphertext-committed Merkle root requires: the same plaintext under the same key must always seal to the same bytes.

Decryption runs on the **client**: it derives the key from the URN it holds, verifies the authentication tag, and recovers the plaintext. A failed tag is reported as tampering, never silently accepted. **No key material is stored in the module, transmitted, or held by the host.**

## Public vs private stores

```sh
digs init             # public:  the URN alone decrypts
digs init --private   # private: decryption ALSO needs a secret salt
```

- **Public** — the URN is sufficient to decrypt.
- **Private** — a secret salt is mixed into the key derivation, so the URN alone can't read the resource. The publisher holds the salt and shares it out-of-band; readers pass it with `--salt <hex>` on `cat`/`checkout`. A URN-holder *without* the salt can still locate a resource but cannot decrypt it.

## Retrieval key vs URN, in practice

Because the retrieval key and the decryption key are different values, the CLI lets you fetch by either:

- **By URN** → the bytes come back **decrypted** (final plaintext).
- **By retrieval key** → the bytes come back **encrypted** (raw ciphertext), with no decryption.

See [Streaming & Keys](../cli/streaming-and-keys.md).

## Related

- [Streaming & retrieval keys](../cli/streaming-and-keys.md) — fetch by URN (decrypted) or key (encrypted)
- [Proofs & Security](./proofs-and-security.md) — why the leaf commits to ciphertext
- [The chia:// protocol](../../browser/chia-protocol.md) — the typeable shorthand for a URN
- [Store structure](./store-structure.md) — where the key table and Merkle tree live
- [Concepts & glossary](../../concepts.md) — URN and retrieval key defined

Next: [Proofs & Security →](./proofs-and-security.md)
