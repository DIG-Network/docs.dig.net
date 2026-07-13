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
| **Relay** | The relay the node keeps a constant connection to so peers behind NAT can reach it — defaults to the public `relay.dig.net`. Override with `DIG_RELAY_URL` (e.g. point at your own relay); set `DIG_RELAY_URL=off` to disable it (air-gapped nodes). See [Run a relay](./run-a-relay.md). |

The node only ever stores and relays **ciphertext** keyed by hashes — configuration never changes the [blind serving contract](../rpc/conformance.md). A capsule it doesn't have is fetched from the upstream, verified, and cached.

## Apply settings

Set values in the config file or as `DIGNODE_*` environment variables (env overrides file). After changing settings, restart the service (the Windows service / `systemctl restart net.dignetwork.dig-node` / `launchctl`).

## Related

- [Install anywhere — the universal installer](./universal-installer.md)
- [Run a relay](./run-a-relay.md) — how a node stays reachable behind NAT, and how to run your own relay
- [Manage your node](./manage.md) — control.* admin RPCs
- [Node conformance](../rpc/conformance.md) — the blind serving contract
