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

## `cache.pushCapsule` — seed content you publish {#cache-pushcapsule}

After publishing a store with `digs commit`, seed your own node so it immediately serves and advertises the content. Send `cache.pushCapsule` to your node (loopback), chunked in ≤3 MiB base64 windows with fields `store_id`, `root`, `data`, `offset`, and `total_length`. Follow the returned `next_offset` until `complete: true`. Over HTTP it needs your node's control token (like other cache-management calls); the browser's in-process node needs none.

**Advanced — `DIG_NODE_PUSH_OPEN=true`** lets remote authorized writers push to your node; only a caller holding the store's publisher key can (a signed request signature is required), so it stays safe against cache-poisoning. Leave it off unless you intend to accept remote seed-pushes.

## `control.wallet.balance` — read a public address's balance {#control-wallet-balance}

`control.wallet.balance` returns the on-chain balance of any public address, in XCH or $DIG. Unlike the other `control.*` methods it is an **open read**: it needs only an address — no control token, no wallet seed, no signing key — because it reads a public address's balance from the chain. It is served on the node's loopback control plane.

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "control.wallet.balance",
  "params": { "address": "xch1…", "asset": "xch" }
}
```

| Param | Type | Required | Meaning |
|---|---|---|---|
| `address` | string | yes | The bech32m address to read (e.g. `xch1…`). |
| `asset` | string | no | The asset to total: `"xch"` (default) or `"dig"`. Omit for `"xch"`. |

**Result**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "balance": 12345, "pending": 6,
    "source": "db", "synced": true, "peak_height": 42
  }
}
```

| Field | Type | Meaning |
|---|---|---|
| `balance` | number (u64) | Confirmed balance in mojos, as a JSON **number** (never a string). |
| `pending` | number (u64) | Unconfirmed/incoming balance in mojos, as a JSON **number**. |
| `source` | string \| null | Which source answered: `"db"` (your node's own chain copy) or `"fallback"` (a public chain service). `null` from a node too old to say. |
| `synced` | boolean | Whether **this answer** came from a fully synced local copy. A `"fallback"` answer is always `false`. |
| `peak_height` | number \| null | The chain height **this answer** reflects, or `null` — including for every `"fallback"` answer. |

### Where the answer came from

`source` tells you which of two places produced the figure:

- **`"db"`** — your own node's copy of the chain. Nothing left your machine.
- **`"fallback"`** — a public chain service your node asked on your behalf, because it could not answer from its own copy. This works, but **the address you asked about was sent to that service**. If you are on a metered or private connection, this is the field to watch.

`synced` and `peak_height` always describe the source that actually answered, not your node in general. So a `"fallback"` answer reports `synced: false` and `peak_height: null` even when your node's own copy is fully caught up — because that copy is not what produced the number you are reading.

A synced address holding nothing is a **success** with `balance: 0` — a zero balance is a truthful answer, never an error. When the node cannot answer truthfully it returns a distinct error (below) rather than a fabricated `0`.

**Errors**

| Code | Name | Meaning |
|---|---|---|
| `-32602` | Invalid params | `address` is missing, not a valid bech32m address, or `asset` is not `"xch"`/`"dig"`. |
| `-32040` | `WALLET_NO_CHAIN_SOURCE` | No live chain source could answer this read. |
| `-32041` | `WALLET_NOT_SYNCED` | The wallet is still syncing and no fallback is available yet. |
| `-32042` | `WALLET_READ_FAILED` | The read failed at the underlying DB / chain-source layer. |
| `-32043` | `WALLET_RATE_LIMITED` | The open coinset-fallback rate limit is exhausted; back off and retry. |

See the full [error-code reference](../support/error-codes.md#dig-rpc-json-rpc).

**From the command line**

```bash
# XCH balance (default asset)
dig-node wallet balance xch1…

# $DIG balance
dig-node wallet balance xch1… --asset dig
```

The CLI reaches the same loopback method and prints the returned figure.


## The DIG Browser Control Pane

The DIG Browser ships a **Control Pane** that manages your local dig-node over the `control.*` RPCs — see its status, watch the shared cache, manage hosted stores and sync, all without the command line.

Open it from the **Control Pane button in the toolbar** (next to the wallet and shields buttons). It opens full-page in the active tab and behaves honestly:

- **If a node is running** (at `dig.local` or `localhost`) → it shows the **management view** driven by the `control.*` admin RPCs.
- **If no node is found** → it shows a short page on how to **install a dig-node**. You can still browse normally — reads fall back to the network — a node is only needed for the management view.

→ [Point a consumer at your node](./point-a-consumer.md)

## Related

- [The dig-node Control Panel](./control-panel.md) — manage the node from the extension: reserved cache + LRU, upstream, hosted stores, sync, peers, pairing
- [Configure dig-node](./configure.md) — ports, cache cap, upstream
- [Node conformance](../rpc/conformance.md) — the public serving contract (distinct from control.*)
- [Self-host a remote origin](../rpc/dig-remote.md) — `digs serve` + dig:// clone/pull/push
