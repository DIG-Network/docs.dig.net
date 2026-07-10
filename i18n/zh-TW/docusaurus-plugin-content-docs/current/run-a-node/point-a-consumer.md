---
sidebar_position: 4
title: Point a consumer at your node
description: "Make the DIG Browser, extension, or digstore CLI read from your local dig-node first (dig.local → localhost), falling back to rpc.dig.net — local-first reads that share one .dig cache. The extension can also source its wallet data (balances, tokens, NFTs) from your node."
keywords:
  - dig-node host
  - local-first reads
  - shared .dig cache
  - extension dig-node
  - dig.local
  - digstore --node
  - wallet data source
  - extension wallet node
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
- **Extension** — set the `dig-node` host (the `server.host` setting) to your node; leave it blank to use the automatic `dig.local` → `localhost` → `rpc.dig.net` resolution. To also read wallet balances/tokens/NFTs from your node, see [Wallet data (extension)](#wallet-data-extension) below.
- **digstore CLI** — set an explicit override with the `--node <url>` global flag, the `$DIG_NODE_URL` environment variable, or a persisted `digstore config node.url <url>`; leave all three unset to use the automatic resolution. See [Which node digstore talks to](../digstore/cli/command-reference.md#which-node-digstore-talks-to).

## Wallet data (extension)

Beyond reading content, the extension's **wallet** can source its data — balances, tokens (in the XCH → $DIG → other-CAT order), NFTs, identities (DIDs), and activity — from your own dig-node instead of the public `coinset.org` service. Reading from your node is more private (your addresses aren't disclosed to a public operator) and faster.

**Your keys never leave your device.** The node is a read-only data source for the extension: it answers *what* your wallet holds, but every send is still **signed locally** in the extension's own encrypted vault. The node never receives a key.

Choose the source under **Settings → Wallet data source** (in the full-window wallet):

- **Automatic** (default) — use your dig-node when it's running, otherwise fall back to `coinset.org`.
  As soon as a local node answers, the panel shows a **"Local dig-node detected"** note naming its
  address — no manual setup needed.
- **My dig-node** — always read from your local node; wallet data is unavailable if it isn't running.
- **coinset.org** — always use the public service; your node isn't used for wallet data.
- **Custom node URL** — read from a specific node RPC address you enter.

An explicit choice overrides the automatic `dig.local` → `localhost` → `rpc.dig.net` order. Changing the source re-loads every wallet view from the newly selected source right away.

## The shared cache

The local cache is a set of [capsules](../concepts.md#capsule) keyed by `storeId:rootHash`, written content-addressed with a cross-process lock — so the in-process browser node and a standalone dig-node on the same machine read and write **one** cache without corruption.

## Related

- [Run a node — overview](./index.md)
- [Configure dig-node](./configure.md)
- [Manage your node](./manage.md) — the control.* admin RPCs + the My Node UI
- [Command reference — global flags](../digstore/cli/command-reference.md#global-flags) — the CLI's `--node` flag and `digstore config node.url`
- [The dig:// remote (clone/pull/push)](../rpc/dig-remote.md) — the same ladder as it applies to `dig://` URLs without an explicit host
