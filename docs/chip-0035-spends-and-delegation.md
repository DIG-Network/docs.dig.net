---
sidebar_position: 9
title: CHIP-0035 store-coin spends & delegation
description: "The canonical CHIP-0035 wasm builder constructs every store-coin spend; admin / writer / oracle delegation is the on-chain primitive behind Teams and revocable CI deploy tokens — never hand-rolled."
keywords:
  - CHIP-0035
  - store coin spend
  - delegation
  - deploy token
  - DataLayer singleton
  - writer key
tags:
  - chip-0035
  - anchoring
  - capsule
  - store
  - deploy-action
---

# CHIP-0035 store-coin spends & delegation

:::info Normative spec
The protocol-level anchoring + payment contracts are [Protocol · On-chain anchoring](./protocol/on-chain-anchoring.md) and [Protocol · DIG CAT payment & pricing](./protocol/dig-cat-payment.md). This page is the spend-builder reference.
:::

A [store](./digstore/format/store-structure.md) is a **CHIP-0035 DataLayer singleton** on Chia mainnet: minting it and advancing its root are **store-coin spends**. This page is the protocol-level view of how those spends are built and how authority over a store is delegated.

## The canonical wasm builder

Every store-coin spend — mint, root advance ([commit](./digstore/cli/onchain-anchoring.md)), metadata update, melt, ownership/delegation change — is constructed by the **canonical CHIP-0035 wasm builder** (`@dignetwork/chip35-dl-coin-wasm`, re-exported by the SDK at [`/spend`](./spends.md)). It is the single source of spend bundles across the CLI, the hub, and any integrating app, so every surface produces **byte-identical** spends.

The split is always **build (wasm) → sign (wallet) → broadcast**. Nothing hand-rolls a puzzle or coin spell. → [Building spends](./spends.md)

The capsule price in $DIG is included **atomically** in the same spend as the root advance — there is no separate payment transaction. → [On-chain anchoring → costs](./digstore/cli/onchain-anchoring.md#costs)

## Delegation — admin / writer / oracle

CHIP-0035 supports **delegating** authority over a store's singleton to additional keys, in roles:

- **admin** — full control, including managing other delegates and ownership.
- **writer** — may advance the store's root (publish capsules) but not change ownership/delegation.
- **oracle** — read/attestation authority for metadata, without write authority.

Delegation is itself an on-chain store-coin spend, built through the same wasm — never a hand-written puzzle.

## What delegation powers

- **Teams / orgs** — share write access to a store across people without sharing one private key; revoke a member by removing their delegated key.
- **CI deploy tokens** — a **deploy token is a revocable writer key**. [Keyless CI deploys](./digstore/cli/deploy-from-github-actions.md) hand a runner writer authority scoped to one store; revoke it without touching the owner key. This is why a leaked deploy token can advance a capsule but never seize a store.
- **Authorizing a website/hub directly** — `digs authorize-origin-as-writer <origin>` delegates writer authority straight to an origin's OWN DIG identity (its BLS pubkey), discovered from the origin itself rather than copy-pasted or issued through a hub UI. See [Well-known origin pubkey discovery](#well-known-origin-pubkey-discovery) below.

## Well-known origin pubkey discovery

A website or hub can publish its own DIG identity at a fixed, well-known HTTPS path (RFC 8615)
so any dig-store CLI operator can discover and authorize it as a writer without a key ever
being copy-pasted or emailed:

```
GET https://<origin>/.well-known/dig/pubkey
```

A conformant origin responds `200 application/json`:

```json
{ "pubkey": "<96-hex BLS12-381 G1 public key>" }
```

- The endpoint is a **plain, unauthenticated GET** — a pubkey is public identity, not a secret.
- Any non-2xx response, or a body missing a string `pubkey` field, is a discovery **failure**
  — never a silent fallback to an unverified or cached key.
- `digs authorize-origin-as-writer <origin>` fetches this endpoint, then adds the returned
  pubkey to the active store's delegated-puzzle set in the **writer** role via the same
  `update_store_ownership` primitive behind deploy keys and Teams roles above — re-sending
  every existing delegate so no prior admin/writer/oracle is dropped. `--pubkey <96-hex>` skips
  discovery entirely for a caller that already has the key, or an origin whose well-known
  endpoint isn't live yet.

## Related

- [Building spends](./spends.md) — the build → sign → broadcast split
- [The DIG SDK](./sdk.md) — `/spend`
- [On-chain anchoring](./digstore/cli/onchain-anchoring.md) — the singleton as trust root
- [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — deploy tokens in practice
