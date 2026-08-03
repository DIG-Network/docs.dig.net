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
  "result": { "balance": 12345, "pending": 6, "synced": true, "peak_height": 42 }
}
```

| Field | Type | Meaning |
|---|---|---|
| `balance` | number (u64) | Confirmed balance in mojos, as a JSON **number** (never a string). |
| `pending` | number (u64) | Unconfirmed/incoming balance in mojos, as a JSON **number**. |
| `synced` | boolean | Whether the read was answered from a fully synced source. |
| `peak_height` | number \| null | The chain height the balance reflects, or `null` when unknown. |

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
