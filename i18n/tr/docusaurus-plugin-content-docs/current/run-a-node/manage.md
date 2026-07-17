---
sidebar_position: 7
title: Manage your node
description: "Operate a running dig-node: the control.* admin RPCs (status, cache, peers) and the DIG Browser's My Node UI that drives them."
keywords:
  - dig-node admin
  - control RPC
  - My Node
  - node status
  - cache management
tags:
  - dig-node
  - dig-rpc
  - browser
---

# Manage your node

Once a `dig-node` is running, you operate it through a small set of **admin RPCs** — separate from the public [dig RPC](../rpc/what-is-the-dig-rpc.md) read methods — and, if you use the DIG Browser, through the **My Node** UI that drives those same RPCs.

## The `control.*` admin RPCs

The `control.*` namespace exposes operator actions that are **not** part of the public read surface (they require local/admin authority), for example:

- **status** — health, version, uptime, and the resolved listeners.
- **cache** — inspect the `.dig` cache ([capsules](../concepts.md#capsule) held), and prune/evict.
- **peers / upstream** — the upstream the node blind-fetches from and any peer state.

These are admin-scoped: a remote reader hitting the public dig RPC can never call them.

## The DIG Browser Control Pane

The DIG Browser ships a **Control Pane** that manages your local dig-node over the `control.*` RPCs — see its status, watch the shared cache, manage hosted stores and sync, all without the command line.

Open it from the **Control Pane button in the toolbar** (next to the wallet and shields buttons). It opens full-page in the active tab and behaves honestly:

- **If a node is running** (at `dig.local` or `localhost`) → it shows the **management view** driven by the `control.*` admin RPCs.
- **If no node is found** → it shows a short page on how to **install a dig-node**. You can still browse normally — reads fall back to the network — a node is only needed for the management view.

→ [Point a consumer at your node](./point-a-consumer.md)

## Related

- [Configure dig-node](./configure.md) — ports, cache cap, upstream
- [Node conformance](../rpc/conformance.md) — the public serving contract (distinct from control.*)
- [Self-host a remote origin](../rpc/dig-remote.md) — `digs serve` + dig:// clone/pull/push
