---
sidebar_position: 2
title: For NFT developers
description: "Mint a whole CHIP-0007 collection whose art lives permanently in a tamper-evident DIG capsule — wallet-signed on-chain mints auto-batched for large collections, real royalties, and honest drop mechanics that never fake what they can't yet prove on-chain."
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# For NFT developers

> **Mint a whole CHIP-0007 collection whose art lives PERMANENTLY in a tamper-evident DIG capsule** — wallet-signed on-chain mints (auto-batched for large collections), real royalties, and honest drop mechanics (reveal / allowlist / phases) that never fake what they can't yet prove on-chain.

## The mental model

First put your art into a **[DIG capsule](../concepts.md#capsule)**, then mint NFTs whose `data_uris` / `metadata_uris` point at that capsule. The on-chain hashes pin the real bytes — so the art is content-addressed, verifiable, and permanent, not a link that can rot or be swapped.

Spends are **never hand-rolled**: the canonical CHIP-0035 wasm builder (via [`@dignetwork/dig-sdk/spend`](../sdk.md)) builds every coin spend, your wallet signs, and it broadcasts (a large collection auto-batches — signed + broadcast once per cost-bounded batch).

Minting a **store is free** of $DIG — you pay the **uniform capsule price** only when a capsule is created (when the art is written into a capsule).

## Scaffold a mint page — the `nft-drop` template

Start from a wallet-wired drop page in one command:

```sh
digstore new nft-drop
# or
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Scaffold an app](../build-a-dapp/scaffold.md)

## Mint from the CLI

The asset CLI builds the spend via the `digstore-chain` builders, signs with your wallet seed, and pushes — all `--dry-run` / `--json` CI-safe:

```sh
digstore did create                          # an issuer DID for attribution
digstore collection create --name "My Drop"  # a CHIP-0007 collection
digstore nft mint --data ./art.png --metadata ./meta.json --dry-run
digstore offer make ...                       # XCH / CAT trades
```

The `nft mint` **capsule-media** path writes the art + CHIP-0007 metadata into a capsule, computes the data/metadata hashes from the real bytes, and sets the URIs to the capsule's `chia://` address (with an https gateway fallback). → [Command reference](../digstore/cli/command-reference.md)

### Large collections mint themselves — auto-batching + resume

`digstore collection mint` bulk-mints an entire traits manifest attributed to one creator DID. A large collection (hundreds of items) can't fit in a single on-chain transaction — Chia caps the CLVM cost per block — so `collection mint` **automatically splits the mint into cost-bounded batches**, each a self-contained wallet-signed bundle that stays safely under the block limit. The batch size is **computed from the cost model**, not a fixed number; pass `--batch-size <n>` only to force a smaller batch. Batches broadcast sequentially, all attributed to the same DID.

Because each batch spends real XCH, the mint is **resumable**: progress is saved per batch, so if a run is interrupted after some batches land, just re-run the same `collection mint` command — already-minted batches are skipped and the mint continues where it left off, with no double-spend. If a batch bundle would ever exceed the block cost limit, you get a clear "split into smaller batches" error — never a misleading "check your connection to coinset.org".

## Mint from the web — DIGHUb NFT Studio

Mint a capsule-backed collection in the browser: upload art (written into a capsule), set royalties, and attach a DID for attribution — wallet signs at the end. → [DIGHUb ↗](https://hub.dig.net)

## Drops — reveal, allowlist, phases

Drop mechanics are surfaced **honestly**: what's enforced on-chain today vs. what's an off-chain convenience pending the claim-coin primitive. We never present a guarantee we can't yet prove on-chain.

→ [Build a dapp on Chia](../build-a-dapp/tutorial.md) for the end-to-end mint thread.

## Build spends with the SDK — never hand-roll

Every coin spend is built by the canonical CHIP-0035 wasm and re-exported at `@dignetwork/dig-sdk/spend`. The flow is always **build → sign → broadcast**, split so the wallet only ever signs.

→ [Building spends](../spends.md) · [The DIG SDK](../sdk.md)

## Monetize & gate — the Paywall

The SDK's `Paywall` composes the provider with the spend builder for **pay-to-unlock** and **NFT / collection-ownership gating** — without hand-wiring spends.

→ [The DIG SDK → Paywall](../sdk.md#paywall)

## Offers — make / take / show

Trade NFTs for XCH or CATs with `digstore offer make | take | show` (each `--dry-run` / `--json`). → [Command reference](../digstore/cli/command-reference.md)

---

## Go deeper: the protocol

- **"tamper-evident capsule"** → [Proofs & security](../digstore/format/proofs-and-security.md) · [The capsule & store model](../digstore/format/store-structure.md)
- **"never hand-roll a spend"** → [CHIP-0035 store-coin spends & delegation](../chip-0035-spends-and-delegation.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
