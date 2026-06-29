---
sidebar_position: 5
title: Configure dig-node
description: "Configure a dig-node: listen ports and listeners, the cache cap, and the upstream the node blind-fetches from — via config and DIGNODE_* environment variables."
keywords:
  - configure dig-node
  - dig-node ports
  - cache cap
  - upstream
  - DIGNODE env vars
tags:
  - dig-node
  - dig-rpc
---

# Configure dig-node

A `dig-node` runs headless with sensible defaults; you tune it through its config file and `DIGNODE_*` environment variables.

## What you can set

| Setting | What it controls |
|---|---|
| **Listeners / ports** | The address and port the [dig RPC](../rpc/what-is-the-dig-rpc.md) is served on (and `dig.local` resolution). |
| **Cache cap** | The maximum on-disk size of the `.dig` cache (a set of [capsules](../concepts.md#capsule)); the node evicts to stay under it. |
| **Upstream** | The remote the node blind-fetches ciphertext + proofs from when it doesn't have a capsule cached (defaults to the public network). |

The node only ever stores and relays **ciphertext** keyed by hashes — configuration never changes the [blind serving contract](../rpc/conformance.md). A capsule it doesn't have is fetched from the upstream, verified, and cached.

## Apply settings

Set values in the config file or as `DIGNODE_*` environment variables (env overrides file). After changing settings, restart the service (the Windows service / `systemctl restart dig-node` / `launchctl`).

## Related

- [Install anywhere — the universal installer](./universal-installer.md)
- [Manage your node](./manage.md) — control.* admin RPCs
- [Node conformance](../rpc/conformance.md) — the blind serving contract
