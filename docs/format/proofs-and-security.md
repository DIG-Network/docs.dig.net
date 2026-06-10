---
sidebar_position: 4
title: Proofs & Security
---

# Proofs & Security

DigStore's guarantees come from three mechanisms working together: a **Merkle commitment** over content, **signed roots**, and **host attestation**.

## Merkle proofs

Each generation builds a Merkle tree with **one leaf per resource**, where a leaf commits to the exact ciphertext bytes the module serves for that resource. The tree's root is the generation's **root hash**.

Because the leaf commits to *ciphertext* (and encryption is deterministic — see [URNs & Encryption](./urns-and-encryption.md)), the served bytes can be verified against the root without ever decrypting them. A single inclusion proof accompanies a served resource and proves those exact bytes belong to that exact root.

```sh
digstore cat <urn> --verify-proof
```

`--verify-proof` checks that the resource's proof resolves to the trusted root *and* that the module's program hash matches the expected serving program — so you're verifying both the content and the code that served it.

## Verified downloads

When you `clone` or `pull`, the CLI verifies what it receives **before** installing it:

- the module must embed a public key whose hash equals the **store id** you asked for (self-certifying identity);
- the served root must carry the **publisher's signature**.

A malicious or broken server cannot feed you fabricated content — the command fails instead. Remotes must be `https://` (plain `http://` is allowed only for `localhost`).

## Signed roots and revocation

A store's roots are signed by the key whose hash is the store id. Publishers can also **revoke** a published root — or the whole store — with a signed tombstone:

```sh
digstore revoke --root <hex> --reason compromise
digstore revoke --all --reason takedown
```

A remote persists tombstones and serves them in the store descriptor; clients honor them **fail-closed** — a revoked root is refused, and a revoked store is refused entirely. A revoked root cannot be "un-revoked" by an older unsigned response.

## Host attestation

A store module refuses to serve real content until the **host** proves its identity. The module embeds a set of trusted BLS keys at compile time; attestation binds the running host to one of those keys via a challenge/response signed by the host. A host that cannot attest receives **decoys**, never content.

This is why a generic file host can store and relay a store's `.wasm` (it's just ciphertext to them) but cannot themselves extract content from it — serving requires an attested host the module trusts.

## Threat model in one paragraph

DigStore assumes the **host is untrusted for confidentiality**: it holds only ciphertext keyed by hashes, performs no decryption, and never sees a URN or key. It assumes the **host is untrusted for integrity**: clients verify the store id, the signed root, and per-resource Merkle proofs, so tampered or fabricated bytes are rejected. What DigStore does **not** defend against is a host that simply *withholds* data (availability), or a reader who legitimately holds a URN choosing to redistribute what they read — the URN is a read capability, and sharing it shares the read.

Back to: [Format Overview](./overview.md) · Next up: [CLI Tutorial →](../cli/install.md)
