---
sidebar_position: 13
title: "L6 · Verification, provenance & anchoring"
description: "The four ordered integrity gates (merkle inclusion → authenticated decryption → anchored-root pinning → risc0 execution), anchored-root pinning against the CHIP-0035 singleton via coinset.org, the authenticated head, tombstones, the MOCK-by-default risc0 caveat, the freshness contract, and provenance UX surfacing."
keywords:
  - verification
  - integrity gates
  - anchored root
  - risc0
  - inclusion vs execution
  - provenance
tags:
  - merkle-proof
  - anchoring
  - capsule
  - dig-rpc
  - chip-0035
---

# Layer 6 · Verification, provenance & anchoring

> **Canonical reference:** `digstore-core::merkle` + `dig-client-wasm` / `dig-node` / the DIG Browser C++ (`dig_crypto.cc`). The trusted root comes **only from the chain** ([anchored-root pinning](#gate-3)), never from the serving origin.

## The four ordered integrity gates

Applied **in this order** on a content read:

### Gate 1 — per-resource merkle inclusion proof (always-on, fail-closed)

`resource_leaf(served_ciphertext) == proof.leaf` AND `proof.verify()` folds to `proof.root`. See [Merkle inclusion proofs](./merkle-proofs.md). The fullest fail-closed spec is the native `VerifyInclusion` (`dig_crypto.cc:585-677`): base64-decode + bounds-check → `computed_leaf == proof.leaf` → fold with `NODE_TAG` → root check.

### Gate 2 — AES-256-GCM-SIV authenticated decryption (fail-closed)

The [content key](./cryptography.md#kdf) decrypts each chunk; a tag failure (tamper / wrong key / decoy) yields no plaintext. `chunk_lens` MUST sum to `ciphertext.len()` (a hard framing check) — `dig_crypto.cc:679-737`.

### Gate 3 — anchored-root pinning against the CHIP-0035 singleton {#gate-3}

The **chain**, not the serving origin, is the authority for a store's latest authorized root. Resolution **never** trusts the rpc-served "latest".

- `dig.getAnchoredRoot` (`dig-node/src/lib.rs:721-743`) walks the CHIP-0035 DataStore singleton lineage on **coinset.org** via `sync_datastore` and returns `metadata.root_hash` — the trusted root a browser pins a **rootless** `chia://` URN against.
- CLI clone/pull additionally requires the served root to equal the singleton's current on-chain root, read via the launcher id in the module's [ChainState section](./capsule-format.md#chainstate-12--the-on-chain-anchor-pointer); it **fails closed** on mismatch OR an unreachable chain (never a silent fallback).
- Caveat: a module with **no** embedded ChainState (pre-Phase-A) makes the chain-root gate a no-op — the [authenticated head](./transport-and-push.md#authenticated-head) signature is then the only authority.

### Gate 4 — risc0 execution proofs (wired, MOCK by default)

The [execution proof](../inclusion-vs-execution-proofs.md) proves a node faithfully *executed* the serving computation. `verify_response` requires `response.roothash ∈ trusted_roots` AND `bound_public_output(roothash, output) == proof.public_output`; `verify_node_attested` requires the node pubkey ∈ the module's trusted attestation set before the sig check (`prover.rs:36-110`).

:::caution GAP — execution proofs are MOCK/forgeable by default
The default backend is `MockProver` (**forgeable**). Real proofs require the `risc0` cargo feature + the RISC0 toolchain + supplying `CoinsetChainSource` + `SystemClock` + `Risc0Prover`. **Not built/tested in CI.** Gates 1–3 are the enforced integrity today; gate 4 is wired but not yet trustworthy. Catalogued in [Drift](./drift-from-whitepapers.md).
:::

## The freshness contract

When real execution proofs are enabled, `public_input = client_nonce(32) || ChiaBlockRef(44)` (= 76 bytes), and `CoinsetChainSource` fetches the Chia peak/block records from coinset.org for the §13.7/§16 freshness gate. The host attestation freshness window is **300s** ([attestation](./bls-signatures.md#attestation-verify-guest)).

:::caution GAP — production rpc.dig.net serves with default (mock) deps
The live `rpc.dig.net` serve path uses `serve_blind` **default deps** (`MockProver` + `MockChainSource` + `FixedClock`), so the §12/§13 attestation-freshness gate is **not enforced in production**. Reads are still safe because gates 1–3 verify against the chain-anchored root client-side. Catalogued in [Drift](./drift-from-whitepapers.md).
:::

## Provenance UX surfacing

The native loader records a process-global ledger keyed by capsule (`storeId:rootHash`); the [`chia://shields`](../browser/chia-protocol.md) WebUI restates per-resource verdicts (`inclusionProofPassed`, catalogued `DIG_ERR_*` codes), **fail-closed**: any entry without `inclusionProofPassed === true` counts as FAILED. A `chia://` page that rendered earns a **"Verified on Chia"** omnibox chip (+ " · local" when served from this device's cache). Only the `chia://` **content** scheme earns the chip; `dig://` internal pages do not. The shields page exposes document-level `data-dig-*` attributes for agents.

## Related

- [Merkle inclusion proofs](./merkle-proofs.md) — gate 1
- [Cryptography](./cryptography.md) — gate 2
- [On-chain anchoring](./on-chain-anchoring.md) — the singleton gate 3 pins against
- [Inclusion vs execution proofs](../inclusion-vs-execution-proofs.md) — gate 4, in depth
- [The blind host model](./blind-host-model.md) — why the host is never the trust anchor
- [Drift from the whitepapers](./drift-from-whitepapers.md) — mock proofs, unenforced freshness
