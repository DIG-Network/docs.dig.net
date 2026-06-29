---
sidebar_position: 8
title: "L2/L3 · The self-defending module"
description: "Fixed-size obfuscation (128 MiB uniform blob, deterministic ChaCha20 filler), WASM injection memory layout (BINDING D2: 2 MiB offset, 384 MiB ceiling), the self-serving guest pipeline, oblivious gather, decoy generation, and the disabled host-attestation gate."
keywords:
  - self-serving WASM
  - fixed-size obfuscation
  - deterministic filler
  - oblivious gather
  - decoy
  - WASM injection
tags:
  - capsule
  - encryption
  - merkle-proof
  - dig-rpc
---

# Layer 2/3 · The self-defending module

> **Canonical reference:** `digstore-compiler` (`pipeline.rs`, `inject.rs`, `filler.rs`, `config.rs`) for the module; `digstore-guest::content` + `digstore-host` for the serving guest. The data it carries is the [DIGS data section](./capsule-format.md).

## Fixed-size obfuscation {#fixed-size-obfuscation}

Every module's injected DIGS blob is padded to **exactly** `uniform_blob_len` (default `FIXED_BLOB_LEN = 128 MiB`), so all production stores compile to the **same module size** — leaking nothing about content size (`config.rs:11-15,38-44`; override `DIGSTORE_UNIFORM_BLOB_LEN` for tests).

Pipeline math (`pipeline.rs:106-136`): encode the blob with an **empty** Filler body → `blob_len_without_filler`; reject if it exceeds the budget (never truncate); `filler_len = budget − blob_len_without_filler`. **Filler (id 11, unreferenced) is the ONLY variable section** — it never touches leaves or `CurrentRoot`, so padding changes nothing served or proven.

:::note Deterministic filler
Filler bytes are **deterministic**: a ChaCha20 keystream with `seed = SHA-256(store_id || roothash || "digstore-filler-v1")`, key = seed, nonce = 12 zero bytes, positional (so a shorter request is a prefix of a longer one) — `filler.rs:7-28`. Determinism is what makes compilation **byte-identical**.
:::

## WASM injection & memory layout (BINDING D2)

- `DIGS_DATA_OFFSET = 0x0020_0000` (**2 MiB**), chosen **above** the guest's rodata (the linker places rodata at the 1 MiB default global base).
- The guest bump heap floats **dynamically** at `align_up(DIGS_DATA_OFFSET + blob_len, 64 KiB)`, so it never overlaps the data section for any blob size (`datasection.rs:32-47`).
- `inject_data_section` appends the DIGS blob as an **active** data segment at `i32.const DIGS_DATA_OFFSET` **last** (later active segments win on overlap), drops the original `DataCount` section, and re-emits the Memory section with `minimum = max(template_min, ceil((offset+blob)/65536))` and **always** `maximum = Some(6144)` (= **384 MiB** ceiling, `MAX_MEMORY_PAGES`); rejects if needed pages > 6144 (`inject.rs:16-206`).

History: the original 1 MiB offset collided with guest rodata and a fixed 8 MiB heap overlapped the chunk pool → the module dropped chunks and failed to self-serve; fixed by 2 MiB + a floating heap.

## The self-serving guest pipeline

The capsule WASM **self-serves**: it runs its own serve flow for a requested retrieval key inside a bounded [host runtime](./blind-host-model.md), and the host only decodes the envelope framing — never decrypting (`content.rs:39-456`).

### The gate chain {#the-gate-chain}

```text
opaque-true predicate
  → temporal window
  → attestation     [DISABLED by default]
  → JWT             [only when AuthInfo.requires_jwt]
  → KeyTable lookup → oblivious gather → ContentResponse
  else → an indistinguishable, success-shaped decoy
```

:::note The host-attestation gate is disabled by default
The host-attestation gate is **disabled by default** so that **any anonymous node can serve** public content and the **program hash stays network-stable** (per-node trusted keys would change it). The privacy decoy path is independent. Any gate failure **fails closed** → an indistinguishable success-shaped decoy (`content.rs:39-65,154-189`).
:::

### Oblivious gather

The guest reads **every** slot in the access plan (cover + real), so the pool access pattern is uniform; real chunks are kept in order and `concat_output` produces the response ciphertext (`content.rs:241-281`, `lib.rs:42-49`).

### The ContentResponse wire envelope

```text
ciphertext(u32 len + bytes) || merkle_proof || roothash(32) || chunk_lens(Vec<u32> per-chunk CIPHERTEXT lengths)
```

`chunk_lens` lets a [streaming client](./dig-rpc.md#streaming) split + GCM-SIV-open each chunk (`content.rs:321-382`). The guest **never decrypts** — it relays ciphertext + proof; [decryption is 100% client-side](./cryptography.md#the-guest-never-decrypts).

## Deterministic compilation {#deterministic-compilation}

Compilation is **byte-identical**: deterministic filler, a pinned committed guest template (the build never invokes `cargo build` for the guest), and `wasm-opt` intentionally **skipped** (not byte-stable) — `lib.rs:1-21`, `config.rs:30-33`. Optional obfuscation (nop insertion, an always-true opaque predicate, bogus dead functions, instruction substitution) is deterministic and behavior-preserving — **security never rests on it** (`obfuscate.rs`).

## Related

- [Capsule format](./capsule-format.md) — the DIGS data section the module carries
- [Cryptography](./cryptography.md) — the guest never decrypts
- [Merkle inclusion proofs](./merkle-proofs.md) — the proof the guest emits
- [The dig RPC](./dig-rpc.md) — how a host runs the guest and streams the envelope
- [The blind host model](./blind-host-model.md) — the bounded host runtime + decoys
