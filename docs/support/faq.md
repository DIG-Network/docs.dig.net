---
sidebar_position: 3
title: FAQ
description: "Frequently asked questions about DIG — what it costs, whether you can iterate for free, how the host can't read your app, custom domains, and updates."
keywords:
  - DIG FAQ
  - DIG cost
  - free preview
  - custom domain
  - private store
  - update a site
tags:
  - dighub
  - capsule
  - dig-payment
  - digstore-cli
  - urn
---

# FAQ

Short answers to the questions that come up most. Follow a link to go deep.

## What does it cost?

A **uniform per-[capsule](../concepts.md#capsule) price**, paid in $DIG at the live rate — the same whether you mint your first one (`init` / first Publish) or ship an update (`commit` / re-Publish) — plus a small XCH transaction fee. A store's lifetime cost is the uniform per-capsule price × the number of capsules. The price is [uniform by design](../digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Can I try it for free?

Yes. **Scaffolding, building, and previewing cost nothing.** You spend DIG only when you publish a capsule on-chain. Start from the [Quickstart](../quickstart.md) — build and preview a draft for free, fund a wallet only at the Publish step.

## Why is every capsule the same price — isn't a small update cheaper? {#why-uniform-price}

No, and that's intentional. Each capsule compiles to a **fixed-size** module (padded so its length leaks nothing about content size). A price that varied with size would re-leak the size the padding hides — so the price has to be uniform. See [why the price is uniform](../digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Do I need a wallet to start?

Not to build and preview. You connect a Chia wallet only at the moment you publish. Your **wallet is your account** — no email, no password.

## Where do I get DIG?

DIG is the DIG Network token (a Chia CAT). Swap XCH for it on [TibetSwap ↗](https://v2.tibetswap.io/), [dexie.space ↗](https://dexie.space/offers/XCH/a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81), or [9mm.pro ↗](https://xch.9mm.pro/token/a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81), then send it to your wallet's receive address. See [Where to get DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig). DIG asset id: `a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81`.

## Is there a testnet?

No. There's no testnet mode; everything runs on **Chia mainnet**. Use a wallet funded with only as much XCH and DIG as you intend to spend. (You can still iterate for free — see above — because previews never touch the chain.)

## How can the host not read my app?

The host only ever stores **ciphertext keyed by hashes**. Encryption and decryption happen entirely in the client; the [URN](../concepts.md#urn) is both the address *and* the key, and the URN never reaches the host (only `SHA-256(URN)` does). The host literally cannot read or scan your content. See [URNs & Encryption](../digstore/format/urns-and-encryption.md).

## How do I update a site after it's live?

Publish again. Edit, preview the new draft for free, then Publish (web) or `digstore commit` (CLI) to ship a new capsule for the uniform capsule price. Each capsule is immutable; an update is a new one, and your store points at the latest.

## Is my store reachable as soon as I publish?

Yes — over the **read path**. The moment a capsule confirms on-chain it's readable through the [dig RPC](../concepts.md#dig-rpc) by its [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) address: universal, verified client-side, no registration and nothing more to pay. A friendly `*.on.dig.net` web address is a separate, optional step (next question).

## Can I get a `*.on.dig.net` address or use my own domain? {#can-i-use-my-own-domain}

A store does **not** get a `*.on.dig.net` subdomain automatically. You get one by **registering a handle** for the store in DIGHUb — a paid registration that pins the store to that name. (Your account handle and a store's slug are separate namespaces; they don't auto-expose a subdomain.) DIGHUb also supports custom domains with TLS. Either way, the store is already readable by its URN / `chia://` address without any of this. See [DIGHUb ↗](https://hub.dig.net).

## What happens if I lose my seed?

The store stays on-chain and existing content stays readable, but **you can't publish new capsules** to it. Back up `~/.dig/seed.enc` and your mnemonic. See [On-chain anchoring](../digstore/cli/onchain-anchoring.md).

## Public vs private — what's the difference? {#public-vs-private}

A **public** store needs only its URN to read. A **private** store adds a secret `salt`; the URN alone isn't enough — the reader also needs the salt. Treat the salt like a password. See [URNs & Encryption](../digstore/format/urns-and-encryption.md).

## How do I deploy from CI?

Add the [GitHub Action](../digstore/cli/deploy-from-github-actions.md): push to `main` and it publishes a new capsule to your existing store — git-push-to-deploy. Use a **dedicated, funded deploy wallet**.

## Is it open source?

Yes. DigStore is GPL-2.0 — see the [digstore repository ↗](https://github.com/DIG-Network/digstore). The whole protocol is [specified in the Protocol section](../protocol-deep-dive.md).

## Related

- [Quickstart](../quickstart.md) — build and preview free, publish at the end
- [Troubleshooting](./troubleshooting.md) — fixes for the common failures
- [Error codes](./error-codes.md) — every error code in one table
- [Get help](./get-help.md) — community channels and how to report
- [Concepts & glossary](../concepts.md) — the vocabulary, defined once
