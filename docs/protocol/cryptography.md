---
sidebar_position: 4
title: "L1 · Cryptography"
description: "Layer 1 read-crypto: HKDF-SHA256 key derivation (salt-mixed secret), AES-256-GCM-SIV fixed-nonce seal, the byte-exact constants table, and the one-crypto-implementation invariant (producer = host = verifier = dig-client-wasm)."
keywords:
  - HKDF-SHA256
  - AES-256-GCM-SIV
  - fixed nonce
  - read crypto
  - key derivation
tags:
  - encryption
  - urn
  - retrieval-key
  - capsule
---

# Layer 1 · Cryptography

> **Canonical reference:** `digstore-core::crypto` (the entire symmetric read-crypto, `no_std` + `alloc`, wasm-clean). `digstore-crypto::{kdf,aead}` are thin re-exports; the browser verifier `dig-client-wasm` imports the **same** functions. **One implementation**, shared by producer, host, and verifier — the [C8 parity invariant](./conformance-and-parity.md).

:::info chip35 has no read-crypto
`chip35_dl_coin` is purely on-chain CHIP-0035 coin/spend logic — a grep for hkdf/aes/gcm/decrypt in its src returns nothing. "chip35 read-crypto" means the `dig-client-wasm` read path verifying against **chip35-anchored roots**.
:::

## Byte-exact constants

| Constant | Value | Reference |
|---|---|---|
| `HKDF_SALT_DOMAIN` | `b"digstore-hkdf-salt-v1"` | `crypto.rs:24` |
| `HKDF_INFO` | `b"digstore-aes-256-gcm-key-v1"` | `crypto.rs:26` |
| `FIXED_NONCE` | `[0u8; 12]` (12 zero bytes) | `crypto.rs:36` |
| `CHAIN` | `"chia"` | `lib.rs:68` |
| `DEFAULT_RESOURCE_KEY` | `"index.html"` | `lib.rs:73` |

## KDF — HKDF-SHA256 {#kdf}

```text
salt = SHA-256( HKDF_SALT_DOMAIN  [|| secret_salt] )
key  = HKDF-SHA256( ikm  = canonical_rootless_urn,
                    salt = salt,
                    info = HKDF_INFO )  → 32 bytes        // crypto.rs:45-60
```

- **IKM is the URN**, not a secret. Per-store entropy enters via the **salt**, not the IKM.
- **Public** store: no `secret_salt`, so `salt = SHA-256("digstore-hkdf-salt-v1")`.
- **Private** store (`Visibility::Private(SecretSalt)`): the 32-byte secret salt is appended into the salt hasher before finalize (`store.rs:156-159`).
- Deterministic: a distinct URN **or** a distinct salt yields a distinct 32-byte key (KAT: `kdf_kat.rs:26-67`). A wrong/missing private salt yields a wrong key whose GCM-SIV tag fails to verify — the confidentiality+integrity coupling.

The key derives from the **[rootless](./urn-and-addressing.md#the-retrieval-key--the-only-address-on-the-wire)** URN, so it is stable across generations.

## AEAD — AES-256-GCM-SIV under a fixed nonce

```text
encrypt_chunk(key32, plaintext) = AES-256-GCM-SIV(key).encrypt(FIXED_NONCE, plaintext)
                                → ciphertext || 16-byte tag           // crypto.rs:64-70
decrypt_chunk(key32, ct)        → Ok(plaintext) | Err(())  on tag failure  // crypto.rs:77-81
```

The AEAD is **AES-256-GCM-SIV** (RFC 8452). (The `info` string reads `"…gcm-key-v1"` — a cosmetic constant name, not a cipher selector.)

**Why a fixed nonce is safe.** GCM-SIV is **nonce-misuse-resistant**: it derives a synthetic IV via POLYVAL over (key, AAD, plaintext), so reusing `(key, nonce)` across distinct plaintexts leaks neither a keystream XOR nor the auth key (it avoids GCM's "forbidden attack"). The fixed nonce also makes encryption **deterministic**, so the ciphertext-committed [merkle root](./merkle-proofs.md) is reproducible — the basis of [byte-identical compilation](./self-defending-module.md#deterministic-compilation). No RNG ⇒ no `getrandom` in the wasm build.

## The guest never decrypts

The [serving guest](./self-defending-module.md) relays **ciphertext + proof** only. **All decryption is 100% client-side** (`content.rs:1-4`). The host therefore cannot read what it serves — the foundation of the [blind host model](./blind-host-model.md).

## Related

- [URN & addressing](./urn-and-addressing.md) — the rootless URN that is the HKDF IKM
- [Merkle inclusion proofs](./merkle-proofs.md) — what the deterministic ciphertext commits to
- [Verification & provenance](./verification-and-provenance.md) — gate 2 (authenticated decryption)
- [Conformance & parity](./conformance-and-parity.md) — the one-crypto-impl invariant + KAT fixtures
