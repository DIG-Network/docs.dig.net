---
sidebar_position: 7
title: Manage your node
description: "Operate a running dig-node: the control.* admin RPCs (status, cache, peers, wallet chain reads) and the DIG Browser's My Node UI that drives them."
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
- **wallet** — read chain state for a public address or coin, and broadcast an already-signed spend ([below](#control-wallet-balance)).

These are admin-scoped: a remote reader hitting the public dig RPC can never call them.

## `cache.pushCapsule` — seed content you publish {#cache-pushcapsule}

After publishing a store with `digs commit`, seed your own node so it immediately serves and advertises the content. Send `cache.pushCapsule` to your node (loopback), chunked in ≤3 MiB base64 windows with fields `store_id`, `root`, `data`, `offset`, and `total_length`. Follow the returned `next_offset` until `complete: true`. Over HTTP it needs your node's control token (like other cache-management calls); the browser's in-process node needs none.

**Advanced — `DIG_NODE_PUSH_OPEN=true`** lets remote authorized writers push to your node; only a caller holding the store's publisher key can (a signed request signature is required), so it stays safe against cache-poisoning. Leave it off unless you intend to accept remote seed-pushes.

## `control.wallet.*` — chain reads and broadcast {#control-wallet-balance}

`control.wallet.*` is the wallet-facing slice of the control plane. Five methods, all on the node's loopback control plane, all working with lowercase 64-hex, unprefixed hashes, and integer amounts in the asset's base unit (mojos for XCH):

| Method | What it does |
|---|---|
| [`control.wallet.balance`](#control-wallet-balance) | Total balance of a public address. |
| [`control.wallet.coins`](#control-wallet-coins) | Unspent coins at a public address. |
| [`control.wallet.peak`](#control-wallet-peak) | The node's current chain peak height. |
| [`control.wallet.coinById`](#control-wallet-coinbyid) | A single coin by id, including a spent one. |
| [`control.wallet.broadcast`](#control-wallet-broadcast) | Push an already-signed spend bundle. |

Four of the five need only public information — an address, or a coin id — so they are **open reads**: no control token, no wallet seed, no signing key. This means a person whose node runs as a service with a control-token file they can't read can still see their own money. `control.wallet.broadcast` is different: it puts bytes on the network, so it is the one wallet method that **requires a control token**, the same as the other admin `control.*` methods.

None of the five wallet methods ever accept a key, a seed, or a mnemonic. The node never signs a spend — it only reads chain state and, for `broadcast`, accepts bytes somebody else already signed.

### `control.wallet.balance` — read a public address's balance {#control-wallet-balance}

`control.wallet.balance` returns the on-chain balance of any public address, in XCH or $DIG. It is an **open read**: it needs only an address — no control token, no wallet seed, no signing key — because it reads a public address's balance from the chain.

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

#### Where the answer came from

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

### `control.wallet.coins` — read a public address's unspent coins {#control-wallet-coins}

`control.wallet.coins` lists the **unspent** coins held by a public address, for one asset. It is an **open read** — only an address is needed.

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "control.wallet.coins",
  "params": { "address": "xch1…", "asset": "xch" }
}
```

| Param | Type | Required | Meaning |
|---|---|---|---|
| `address` | string | yes | The bech32m address to read (e.g. `xch1…`). |
| `asset` | string | no | The asset to list coins for: `"xch"` (default) or `"dig"`. Omit for `"xch"`. |

**Result**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "coins": [
      {
        "coin_id": "aa11…",
        "asset": "xch",
        "amount": 1000000000,
        "parent_coin_info": "bb22…",
        "puzzle_hash": "cc33…",
        "created_height": 4200000,
        "spent_height": null
      }
    ],
    "source": "db", "synced": true, "peak_height": 4200042
  }
}
```

| Field | Type | Meaning |
|---|---|---|
| `coins` | array | The address's unspent coins for the requested asset (see the coin shape below). |
| `source` | string \| null | Which source answered — same meaning as [`control.wallet.balance`](#where-the-answer-came-from). |
| `synced` | boolean | Whether this answer came from a fully synced local copy. |
| `peak_height` | number \| null | The chain height this answer reflects. |

Each entry in `coins`:

| Field | Type | Meaning |
|---|---|---|
| `coin_id` | string | The coin's id, lowercase 64-hex. |
| `asset` | string | The asset this coin is denominated in: `"xch"` or `"dig"`. |
| `amount` | number (u64) | The coin's amount in mojos. |
| `parent_coin_info` | string | The parent coin id, lowercase 64-hex. |
| `puzzle_hash` | string | The coin's puzzle hash, lowercase 64-hex. |
| `created_height` | number | The block height this coin was created at. |
| `spent_height` | number \| null | Always `null` from this method — `control.wallet.coins` returns unspent coins only. Use [`control.wallet.coinById`](#control-wallet-coinbyid) to look up a coin that may have been spent. |

`coins: []` is a **success**: a chain was consulted and the address holds no unspent coins for that asset. It is never returned because the chain couldn't be reached — an unreachable chain is one of the errors below instead, so an empty list always means "checked, and there is nothing there."

**Errors**

| Code | Name | Meaning |
|---|---|---|
| `-32602` | Invalid params | `address` is missing, not a valid bech32m address, or `asset` is not `"xch"`/`"dig"`. |
| `-32040` | `WALLET_NO_CHAIN_SOURCE` | No live chain source could answer this read. |
| `-32041` | `WALLET_NOT_SYNCED` | The wallet is still syncing and no fallback is available yet. |
| `-32042` | `WALLET_READ_FAILED` | The read failed at the underlying DB / chain-source layer. |
| `-32043` | `WALLET_RATE_LIMITED` | The open coinset-fallback rate limit is exhausted; back off and retry. |

See the full [error-code reference](../support/error-codes.md#dig-rpc-json-rpc).

### `control.wallet.peak` — the node's current chain peak {#control-wallet-peak}

`control.wallet.peak` returns the chain height this node currently tracks. It is an **open read** and takes no parameters — use it to get a height to compare a coin's `created_height`/`spent_height` against.

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "control.wallet.peak",
  "params": {}
}
```

**Result**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { "peak_height": 4200042, "synced": true }
}
```

| Field | Type | Meaning |
|---|---|---|
| `peak_height` | number \| null | The chain height this node currently tracks, or `null` if this node tracks no height yet. |
| `synced` | boolean | Whether this node's own copy of the chain is fully synced. |

`peak_height: null` means "this node doesn't yet know a height" — it is **not** a zero. Treat it as unknown, never as height `0`: every real block sits trivially above `0`, so reading `null` as `0` would make an unconfirmed transaction look buried under thousands of blocks it hasn't actually seen.

**Errors**

| Code | Name | Meaning |
|---|---|---|
| `-32040` | `WALLET_NO_CHAIN_SOURCE` | No live chain source could answer this read. |
| `-32041` | `WALLET_NOT_SYNCED` | The wallet is still syncing and no fallback is available yet. |
| `-32042` | `WALLET_READ_FAILED` | The read failed at the underlying DB / chain-source layer. |

See the full [error-code reference](../support/error-codes.md#dig-rpc-json-rpc).

### `control.wallet.coinById` — read one coin, spent or unspent {#control-wallet-coinbyid}

`control.wallet.coinById` looks up a single coin by its coin id — unlike `control.wallet.coins`, it can see a coin that has since been **spent**. It is an **open read**: only a coin id is needed.

This is the method to use to confirm an on-chain mint or payment once you know which coin was consumed to pay for it: check `spent_height` on the funding coin.

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "control.wallet.coinById",
  "params": { "coin_id": "aa11…" }
}
```

| Param | Type | Required | Meaning |
|---|---|---|---|
| `coin_id` | string | yes | The coin id to look up, lowercase 64-hex. A `0x` prefix is accepted on input; the node never emits one. |

**Result**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "coin": {
      "coin_id": "aa11…",
      "asset": null,
      "amount": 1000000000,
      "parent_coin_info": "bb22…",
      "puzzle_hash": "cc33…",
      "created_height": 4200000,
      "spent_height": 4200010
    },
    "source": "fallback", "synced": false, "peak_height": null
  }
}
```

| Field | Type | Meaning |
|---|---|---|
| `coin` | object \| null | The coin, or `null` if no such coin exists on chain. See the field table below. |
| `source` | string | Always `"fallback"` for this method. |
| `synced` | boolean | Always `false` for this method. |
| `peak_height` | number \| null | Always `null` for this method — call [`control.wallet.peak`](#control-wallet-peak) for a height to compare against. |

The `coin` object:

| Field | Type | Meaning |
|---|---|---|
| `coin_id` | string | The coin's id, lowercase 64-hex — echoes the request. |
| `asset` | null | Always `null` here: a coin id alone doesn't say what the coin is denominated in, and the node does not guess. |
| `amount` | number (u64) | The coin's amount in mojos. |
| `parent_coin_info` | string | The parent coin id, lowercase 64-hex. |
| `puzzle_hash` | string | The coin's puzzle hash, lowercase 64-hex. |
| `created_height` | number | The block height this coin was created at. |
| `spent_height` | number \| null | The block height this coin was spent at, or `null` if it is still unspent. This is the field `control.wallet.coins` can never show you. |

`coin: null` is a **success**: a chain was consulted and no coin with that id exists. It is never returned because the chain couldn't be reached — an unreachable chain is one of the errors below instead.

**Errors**

| Code | Name | Meaning |
|---|---|---|
| `-32602` | Invalid params | `coin_id` is missing or not 64 lowercase hex characters (with or without a `0x` prefix). |
| `-32040` | `WALLET_NO_CHAIN_SOURCE` | No live chain source could answer this read. |
| `-32042` | `WALLET_READ_FAILED` | The read failed at the underlying DB / chain-source layer. |
| `-32043` | `WALLET_RATE_LIMITED` | The open coinset-fallback rate limit is exhausted; back off and retry. |

See the full [error-code reference](../support/error-codes.md#dig-rpc-json-rpc).

### `control.wallet.broadcast` — push an already-signed spend {#control-wallet-broadcast}

`control.wallet.broadcast` pushes a spend bundle that was **already signed** somewhere else — the node never signs anything, and there is deliberately no parameter through which a key, a seed, or a mnemonic could be passed. Unlike the four reads above, this method **requires a control token**: it puts bytes on the network, so it carries the same admin authority as the other `control.*` write operations.

**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "control.wallet.broadcast",
  "params": { "signed_bundle_hex": "d34d…" }
}
```

| Param | Type | Required | Meaning |
|---|---|---|---|
| `signed_bundle_hex` | string | yes | The already-signed spend bundle, hex-encoded, lowercase. |

**Result**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { "accepted": true, "transaction_id": "ee44…", "rejection": null }
}
```

| Field | Type | Meaning |
|---|---|---|
| `accepted` | boolean | Whether the mempool took the bundle. |
| `transaction_id` | string \| null | The transaction id, if accepted. |
| `rejection` | string \| null | The mempool's reason for refusing the bundle, if `accepted` is `false`. |

Two things worth being precise about:

- A mempool that looks at the bundle and says no is still a **successful call** — `accepted: false` with a `rejection` reason, not an error. Failing to *reach* a mempool at all is an error instead (below). The remedies are opposite: a `rejection` means retry the *same* bundle only after fixing what it complains about (or rebuild it), while a broadcast error means retry the *same* bundle as-is once the node can reach the network again.
- `accepted: true` means the mempool took the bundle — it is **not** evidence that the spend reached a block. Confirm that separately with [`control.wallet.coinById`](#control-wallet-coinbyid) against the coin the spend consumes: `spent_height` becoming non-null is the actual on-chain confirmation.

**Errors**

| Code | Name | Meaning |
|---|---|---|
| `-32602` | Invalid params | `signed_bundle_hex` is missing or not valid hex. |
| `-32030` | Unauthorized (control) | Called without a valid local control token. |
| `-32040` | `WALLET_NO_CHAIN_SOURCE` | No live chain source could reach the network to broadcast. |
| `-32042` | `WALLET_READ_FAILED` | The broadcast failed at the underlying chain-source layer. |

See the full [error-code reference](../support/error-codes.md#dig-rpc-json-rpc).

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
