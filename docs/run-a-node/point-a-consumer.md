---
sidebar_position: 4
title: Point a consumer at your node
description: "Make the DIG Browser, extension, or digstore CLI read from your local dig-node first (dig.local → localhost), falling back to rpc.dig.net — local-first reads that share one .dig cache."
keywords:
  - dig-node host
  - local-first reads
  - shared .dig cache
  - extension dig-node
  - dig.local
  - digstore --node
tags:
  - dig-node
  - browser
  - dig-rpc
  - digstore-cli
---

# Point a consumer at your node

A consumer — the [DIG Browser](../browser/chia-protocol.md), the [extension](../audiences/content-consumers.md), or the `digstore` CLI — does **not** need a node to read DIG content; every one of them falls back to the public reference node at `rpc.dig.net` when no local node is reachable. Pointing a consumer at a **local** dig-node makes reads **local-first**: faster, offline-friendly, and contributing to the network. When a node is on the same machine, the consumer and the node **share one `.dig` cache**.

## How it works

Every consumer resolves its node endpoint in the same fixed order, using the first that responds:

1. **An explicit override**, when the consumer has one set — always wins over the automatic steps below.
2. **`dig.local`** — an installed local dig-node.
3. **`localhost`** — a dig-node on the loopback address, its default local port.
4. **`rpc.dig.net`** — the public gateway, the final fallback when no local node answers.

Either way **every byte is verified client-side against the chain**; pointing at a local node changes *where* ciphertext is fetched, never *whether* it's trusted. Node-class clients (the CLI, the SDK) connect over mTLS with a client certificate derived from their identity key, across all three tiers; `rpc.dig.net` also serves plain HTTPS for browsers, which can't present a client certificate.

## Set the host

- **DIG Browser** — the **My Node** UI lets you select the local dig-node and view its status.
- **Extension** — set the `dig-node` host (the `server.host` setting) to your node; leave it blank to use the automatic `dig.local` → `localhost` → `rpc.dig.net` resolution.
- **digstore CLI** — set an explicit override with the `--node <url>` global flag, the `$DIG_NODE_URL` environment variable, or a persisted `digstore config node.url <url>`; leave all three unset to use the automatic resolution. See [Which node digstore talks to](../digstore/cli/command-reference.md#which-node-digstore-talks-to).

## The shared cache

The local cache is a set of [capsules](../concepts.md#capsule) keyed by `storeId:rootHash`, written content-addressed with a cross-process lock — so the in-process browser node and a standalone dig-node on the same machine read and write **one** cache without corruption.

## Related

- [Run a node — overview](./index.md)
- [Configure dig-node](./configure.md)
- [Manage your node](./manage.md) — the control.* admin RPCs + the My Node UI
- [Command reference — global flags](../digstore/cli/command-reference.md#global-flags) — the CLI's `--node` flag and `digstore config node.url`
- [The dig:// remote (clone/pull/push)](../rpc/dig-remote.md) — the same ladder as it applies to `dig://` URLs without an explicit host
