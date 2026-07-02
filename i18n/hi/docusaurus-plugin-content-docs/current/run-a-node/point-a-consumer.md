---
sidebar_position: 4
title: Point a consumer at your node
description: "Make the DIG Browser or extension read from your local dig-node first (dig.local → localhost), falling back to rpc.dig.net — local-first reads that share one .dig cache."
keywords:
  - dig-node host
  - local-first reads
  - shared .dig cache
  - extension dig-node
  - dig.local
tags:
  - dig-node
  - browser
  - dig-rpc
---

# Point a consumer at your node

A consumer — the [DIG Browser](../browser/chia-protocol.md) or the [extension](../audiences/content-consumers.md) — does **not** need a node to read DIG content; it falls back to the public reference node at `rpc.dig.net`. Pointing it at a **local** dig-node makes reads **local-first**: faster, offline-friendly, and contributing to the network. When a node is on the same machine, the consumer and the node **share one `.dig` cache**.

## How it works

The consumer prefers a local node — resolving **`dig.local` → `localhost`** — and only falls back to `rpc.dig.net` when no local node answers. Either way **every byte is verified client-side against the chain**; pointing at a local node changes *where* ciphertext is fetched, never *whether* it's trusted.

## Set the host

- **DIG Browser** — the **My Node** UI lets you select the local dig-node and view its status.
- **Extension** — set the `dig-node` host (the `server.host` setting) to your node; leave it blank to use `rpc.dig.net`.

## The shared cache

The local cache is a set of [capsules](../concepts.md#capsule) keyed by `storeId:rootHash`, written content-addressed with a cross-process lock — so the in-process browser node and a standalone dig-node on the same machine read and write **one** cache without corruption.

## Related

- [Run a node — overview](./index.md)
- [Configure dig-node](./configure.md)
- [Manage your node](./manage.md) — the control.* admin RPCs + the My Node UI
