---
sidebar_position: 2
title: Store Structure
---

# Store Structure

A store has an **identity**, a **history of generations**, and a compiled **module**. This page covers each.

## Store identity

A store is identified by a 64-hex **store id**, which is the store's **on-chain Chia singleton launcher id** — minted on mainnet by `digstore init` (see [On-chain anchoring](../cli/onchain-anchoring.md)). The id is the store's permanent on-chain identity: the singleton's current root *is* the store's authoritative latest root, and every `commit` advances it on-chain.

The id is curried into every URN that references the store and is the only mandatory addressing component. A separate publisher **BLS signing key** (embedded in the module) signs the store's published roots and push heads — but the store id is the chain singleton, not a hash of that key.

## Generations and root hashes

Every `commit` seals the current content into a new **generation**, identified by a **root hash** — the Merkle root over the generation's per-resource leaves.

| Term | Meaning |
|---|---|
| Generation | A store state identified by a root hash, with a monotonic ordinal id |
| Root hash | Merkle root over the generation's per-resource leaves |
| Root history | Append-only list of every root hash the store has produced |

Each commit produces exactly **one** new generation, **one** new module file, and **one** new root hash. History grows monotonically — like Git. Any past root hash can be quoted in a URN to address the store *at that generation*; omit it to address the current one.

```sh
digstore log            # list generations (each root hash is a commit)
digstore diff <a> <b>   # what changed between two roots
```

## The content root

Unlike Git, a store doesn't track a source tree — it captures a **content root**: a build-output directory.

- Default content root is the current directory.
- Set it at creation with `digstore init --dir <path>`, or later with `digstore dir <path>`.
- Override it for a single command with `-C/--cwd <path>`.

Resource keys are always **relative to the content root**, so a URN is stable no matter which subdirectory you run a command from.

## On-disk layout

A project lives in a `.dig/` directory, the way a Git repo lives in `.git/`. It holds the store configuration, the append-only root history, the per-generation chunk pools and manifests, and the compiled module(s). Commands discover the `.dig/` workspace by walking up from wherever you run them.

A single `.dig/` workspace can hold **many stores** ("capsules"), each with its own content, keys, and history. See [Project Workflow](../cli/project-workflow.md).

## The compiled module

When you commit, the content and a small serving program compile into a single `.wasm`. It embeds:

- **Encrypted content** — every resource's chunks, sealed with AES-256-GCM-SIV (see [URNs & Encryption](./urns-and-encryption.md)).
- **A key table** — maps each resource's retrieval key to the ordered chunk indices that reassemble it.
- **The Merkle tree** — one leaf per resource, rooting at the generation's root hash (see [Proofs & Security](./proofs-and-security.md)).
- **The serving program** — answers "give me the bytes for this URN" via a fixed host/module ABI, and nothing else.
- **Trusted host keys** — the module refuses to serve content to a host that can't attest to one of these keys; an un-attested host receives only decoys.

The whole module is padded to a **uniform size** so its byte length reveals nothing about how much content it actually holds. Each store is capped at **128 MB** of staged content, enforced at `add` (and defensively at `commit`).

Next: [URNs & Encryption →](./urns-and-encryption.md)
