---
sidebar_position: 5
title: For content consumers
description: "Open chia:// content that your own browser verifies against the blockchain — no host can alter or fake it, private content stays private from the host, and it's permanent and re-hostable anywhere, so nobody can take it down or lock you in."
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# For content consumers

> **Open `chia://` content that your OWN browser verifies against the blockchain** — no host can alter or fake it, private content stays private from the host, and it's permanent and re-hostable anywhere, so nobody can take it down or lock you in.

## The mental model

Paste a `chia://` link and the content comes straight from the network — **content-addressed** and **cryptographically verified on YOUR device** before it renders. It is **fail-closed**: tampered or undecryptable bytes never show.

- **Omit the `rootHash`** for the store's *latest* version: `chia://<storeId>/`.
- **Include it** to pin one exact immutable [capsule](../concepts.md#capsule): `chia://<storeId>:<rootHash>/`.

Public content needs only the link. Private content also needs a secret **`?salt=`** — like a password.

## Get the DIG Browser, or the extension

- **[Get the DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — a browser with `chia://` and a built-in wallet baked in.
- **The extension** for Chrome / Edge / Brave / Firefox — adds `chia://` resolution to a browser you already use.

## Open `chia://` content — latest vs pinned

The address forms, the clean `chia://<store>/` bar, and when to pin a `rootHash`.

→ [The chia:// protocol](../browser/chia-protocol.md)

## Built-in pages, the verified badge & shields

`chia://home`, `chia://wallet`, `chia://settings`, and the verified badge / shields that show each resource's inclusion-proof verdict for the active capsule.

→ [Using window.chia](../browser/using-window-chia.md)

## Public vs private — when you need a `?salt=` secret

Public stores open with just the link; private stores require the secret salt that derives the decryption key.

→ [Public vs private stores](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Public vs private — what's the difference?](../support/faq.md#public-vs-private)

## Run content locally (optional)

Point your browser/extension at a local [dig-node](../concepts.md#dig-node) for faster, offline-friendly reads — they share one `.dig` cache. You never *need* a node to read.

→ [Run a node](../run-a-node/index.md)

## Get $DIG

You don't need $DIG to *read* content. If you want to publish, get $DIG on **TibetSwap**, **dexie.space**, or **9mm.pro**.

→ [Where do I get DIG?](../support/faq.md#where-do-i-get-dig)

---

## Go deeper: the protocol

- **"verified against the blockchain"** → [On-chain anchoring](../digstore/cli/onchain-anchoring.md) · [Proofs & security](../digstore/format/proofs-and-security.md)
- **"public vs private salt"** → [URNs & encryption](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"latest vs pinned"** → [Generations & root hashes](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
