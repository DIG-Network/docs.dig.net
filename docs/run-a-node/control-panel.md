---
sidebar_position: 8
title: The dig-node Control Panel
description: "Manage your local dig-node from the DIG Chrome extension's Control Panel: reserved .dig cache space and LRU eviction, upstream, hosted stores, sync, peers, live status, and pairing the control token."
keywords:
  - dig-node control panel
  - dig cache
  - LRU eviction
  - reserved cache space
  - control token pairing
  - hosted stores
  - node sync
  - node peers
tags:
  - dig-node
  - browser
  - dig-rpc
---

# The dig-node Control Panel

The DIG Chrome extension includes a **Control Panel** for your local dig-node. From it you can see the node's live status, decide how much disk space to reserve for cached content, and — after a one-time pairing step — manage the node's upstream, the stores it hosts, its sync, and its peers. No command line required for everyday use.

The Control Panel is the extension's built-in equivalent of the DIG Browser's node-management screen: it talks to the node running on your own machine, so everything stays local.

## Open it

1. Open the extension.
2. Go to the **Network** tab and choose **Control**. (The compact popup shows a summary; use **Open control panel** to see every section full-screen.)

The panel detects the node automatically:

- **Node running** → you see the management view.
- **No node found** → you see a short page on how to install one. Browsing still works — content reads fall back to the public network; a node is only needed for the management view below.

## Live status

At the top, a live indicator shows whether your node is **Connected**, **Connecting**, or **Disconnected**, along with its address and version. It updates on its own — start or stop the node and the indicator flips within a few seconds, with no need to reopen the panel or refresh.

## Reserve disk space for cached content (cache & LRU)

Your node keeps a local cache of the content it has fetched, so repeat visits are instant and you help serve that content. The cache has a **reserved size** — a cap on how much disk it may use. When the cache grows past the cap, the node automatically removes the **least-recently-used** items first (an "LRU" policy), so the space you reserve is never exceeded and the content you actually use stays cached.

This section is available immediately — it needs no pairing.

**See how much is used.** A bar shows used space against the reserved cap, plus a few live figures: how many items are cached, their total size, how much has been evicted since the node started, and the cache hit/miss counts.

**Set the reserved cap.** Enter a new size and apply it. The minimum is 64 MiB; a smaller value is raised to that floor. Lowering the cap below what's currently used triggers eviction of the oldest items until usage fits.

**Review and remove cached items.** The cached list shows each item with its size, when it was last used, and its **eviction order** (position `0` is the next item that would be removed). You can:

- **Evict one item** — remove a single cached item now.
- **Clear all** — empty the cache entirely.

Removing items only frees local disk; anything you visit again is simply re-fetched.

:::tip
Give the cache as much room as you can spare on a machine you browse from often — a larger reserve means fewer re-fetches and more content served locally. On a space-constrained machine, set a smaller reserve; LRU keeps the most useful items and drops the rest.
:::

## Manage the node (pairing required)

The remaining sections change the node's configuration, so they require your explicit permission. Because the extension runs in the browser's sandbox, it cannot read the node's local permission file directly — instead you **pair** it once. Pairing grants the extension its own scoped, revocable credential; it never exposes the node's master key, and it can only be approved from the computer running the node.

### Pair the extension with your node

1. In the Control Panel, choose **Pair**. The extension shows a **6-digit code** and a pairing id.
2. On the computer running the node, in a terminal, run `dig-node pair` to list pending requests (or `dig-node pair approve <pairing-id>` directly).
3. Confirm the code shown in the terminal **matches** the code in the extension, then approve. This match is your safeguard: it ensures you approve *this* extension and nothing else.
4. The Control Panel switches to the paired state automatically. The credential is stored only by the extension.

The pairing code **expires after a few minutes**; if yours does before you approve it, choose **Pair** again for a fresh one.

To stop using the credential, choose **Unpair** in the panel (this forgets it locally). To revoke it on the node itself, run `dig-node pair revoke <token-id>` on that computer — the panel returns to the unpaired state on its next action.

:::note
Pairing is only needed for the management sections below. Live status and the cache/LRU controls above work without it.
:::

### Upstream

View the upstream the node fetches from, and set a different one. A changed upstream takes effect the next time the node starts.

### Hosted stores

See the stores your node holds and pins, pin a new store (so the node keeps and serves it), unpin one, and check any store's status. Pinning a specific version pre-fetches it so it's ready to serve.

### Sync

See whether authenticated whole-store sync is available and, for a specific version, trigger a sync so the node fetches and caches it.

### Peers

See your node's peer-network status — its connection to the relay for reachability behind a home router, and the peers it is connected to.

## Related

- [Manage your node](./manage.md) — the `control.*` admin actions and how the browser drives them
- [Point a consumer at your node](./point-a-consumer.md) — set the extension, browser, or CLI to use your node
- [Configure dig-node](./configure.md) — ports, the cache cap, and the upstream
