---
sidebar_position: 4
title: Error codes
description: "Every DIG error code in one place: dig RPC JSON-RPC codes, digstore CLI exit codes, and DIGHUb user-facing codes — each with what it means and what to do."
keywords:
  - DIG error codes
  - JSON-RPC error codes
  - CLI exit codes
  - DIGHUb errors
  - DIG_INSUFFICIENT
  - SLUG_TAKEN
tags:
  - dig-rpc
  - digstore-cli
  - dighub
---

# Error codes

A consolidated reference for every error code you might see, across the surfaces: the **dig RPC** (JSON-RPC), the **`digstore` CLI** (process exit codes), **DIGHUb** (the web app's user-facing codes), and the **dig:// content loader** (the DIG Browser / extension). Look up the code you got; each row says what it means and what to do.

For step-by-step fixes, see [Troubleshooting](./troubleshooting.md).

:::tip Machine-readable
This catalog is also published as [`error-codes.json`](https://docs.dig.net/error-codes.json) — a flat `[{surface, code, http_or_exit, description}]` list (plus a `bySurface` index) so an agent can branch on a code without scraping this table. It is generated from the same source as the tables below and drift-checked against them on every build, so the two can never disagree.
:::

## dig RPC (JSON-RPC)

The [dig RPC](../protocol/dig-rpc.md) uses the standard [JSON-RPC 2.0](https://www.jsonrpc.org/specification) error codes plus the protocol-specific `-32004`. A content **miss is never an error** — the capsule returns its own indistinguishable, non-verifying response (there is no `decoy` field on the wire), and the client discovers the miss by inclusion-proof and/or decryption failure (see [the blind host model](../protocol/blind-host-model.md)). For any well-formed body the HTTP status is `200`; the error is carried in the JSON envelope.

| Code | Meaning | What to do |
|---|---|---|
| `-32700` | **Parse error** — the request body isn't valid JSON. | Fix the JSON you're sending; ensure `Content-Type: application/json`. |
| `-32600` | **Invalid request** — not a request object/array, an empty batch, or a missing `method`. | Send a valid JSON-RPC request with a `method` field. |
| `-32601` | **Method not found** — this node doesn't implement the method. | Check the name against [Methods](../rpc/methods.md); call `dig.methods` to see what the node supports. |
| `-32602` | **Invalid params** — missing/malformed `store_id`, `root`, or `retrieval_key`, or `"latest"` on a store with no confirmed generation. | Verify each identifier is the right length of lower-case hex; confirm the store has at least one capsule. |
| `-32603` | **Internal error** — the node failed to satisfy a well-formed call. | Retry; if it persists, try another node or report it. |
| `-32004` | **Resource not available at the requested root** — a genuine infrastructure miss (no host seed, the module absent in both buckets, bad magic, oversize, a wasmtime trap, or an undecodable envelope). Distinct from a content miss, which is an indistinguishable decoy and is *never* an error. | Confirm the `root` is a confirmed generation (`dig.listCapsules`); retry or try another node. |

## digstore CLI (exit codes)

`digstore` exits `0` on success and a distinct non-zero code per error kind, so scripts and CI can branch on the cause. Re-run with `--verbose` to see the full message; many errors also print a one-line fix hint.

| Exit | Code | Meaning | What to do |
|---|---|---|---|
| `0` | success | The command completed. | — |
| `1` | other | An unclassified error. | Re-run with `--verbose`; see the printed message. |
| `2` | invalid-argument | A flag or argument was invalid. | Check `digstore <command> --help`. |
| `3` | no-store | No store found here. | Run `digstore init` (or `cd` into a store's directory). |
| `4` | not-found | A resource/URN/root wasn't found. | Run `digstore log` to list generations and keys. |
| `5` | verification-failed | Content failed cryptographic verification. | Wrong `salt`/key, or the data was tampered with — recheck your URN/salt. |
| `6` | network | A network/transport failure. | Check your connection and that the remote is reachable (`digstore remote list`). |
| `7` | non-fast-forward | The remote root has advanced past yours. | Run `digstore pull` first, then push. |
| `8` | unauthorized | Not authorized for this action. | Check your credentials / the store's signing key. |
| `9` | no-seed | No wallet seed is set up. | Run `digstore seed import` or `digstore seed generate`. |
| `10` | bad-passphrase | Wrong passphrase for the seed. | Re-run and enter the correct passphrase. |
| `11` | invalid-mnemonic | The mnemonic is invalid. | Check the word list and word count (12/24). |
| `12` | insufficient-funds | Not enough XCH **or** DIG to cover the spend. | Fund the printed receive address (you need the uniform capsule price in $DIG + an XCH fee per capsule), then retry. |
| `13` | chain | A Chia chain/coinset error. | Check your connection to coinset.org and retry. |
| `14` | confirm-timeout | The on-chain confirmation timed out. | The tx may still confirm — run `digstore anchor status`. |
| `15` | mint-failed | Minting the store singleton failed. | Retry; if it persists, check wallet funds and coinset.org. |
| `16` | update-failed | Anchoring the new root failed. | Retry; if it persists, check wallet funds and coinset.org. |

## DIGHUb (web app)

When a publish or account action fails, DIGHUb shows a plain-language message **and** a stable code you can quote in a report. The codes below are the ones you're most likely to see.

| Code | What it means | What to do |
|---|---|---|
| `WALLET_DECLINED` | You declined the signature in your wallet. Nothing was signed or broadcast. | Not an error — re-try and approve if you meant to publish. |
| `DIG_INSUFFICIENT` | Not enough $DIG in your wallet to cover this capsule's price. | Top up $DIG (the publish screen links where to get it), then retry. |
| `COIN_CONFLICT` | The coin was just spent elsewhere (double-spend / mempool conflict). | Retry — DIGHUb rebuilds the spend with a fresh coin. |
| `REG_PENDING` | Your spend is on chain and will appear shortly. | Wait a moment — **do not** sign or pay again. |
| `WALLET_SESSION` | Your wallet session can't sign (expired, watch-only, or missing method). | Disconnect and reconnect your wallet; make sure Sage is up to date. |
| `NET_OFFLINE` | You appear to be offline. | Check your connection and try again. |
| `NET_TIMEOUT` | The request timed out or couldn't reach the network. | Try again. |
| `SLUG_TAKEN` | That store name is already taken. | Pick a different name. |
| `OVER_QUOTA` | You've reached the store limit for this account. | Remove an unused store or contact support. |
| `COIN_RESERVED` | A coin is busy finishing another transaction. | Wait a moment and try again. |
| `UNAUTHORIZED` | Your session isn't authorized for this. | Reconnect your wallet and try again. |
| `FORBIDDEN` | You don't have permission to do this. | Use the account that owns the store. |
| `NOT_FOUND` | The thing couldn't be found — it may have expired. | Start over and try again. |
| `INVALID_REQUEST` | Something about the request wasn't valid. | Try again; if it persists, report it with the code. |
| `UNEXPECTED` | An unclassified error. | Retry; if it persists, report it with the code. |

:::note Codes are stable; messages may improve
The **code** is the stable identifier — quote it in a [report](./get-help.md). The wording of a message may change as the copy gets clearer.
:::

## dig:// content loader

When you open `chia://` content (in the DIG Browser, or via the extension) and it can't be served, the loader is **fail-closed** — it never shows unverified bytes — and surfaces a stable code so an agent can branch on *why*. These are catalogued in [`error-codes.json`](https://docs.dig.net/error-codes.json) under the `dig-loader` surface.

| Code | What it means | What to do |
|---|---|---|
| `DIG_ERR_PROOF_MISMATCH` | The served ciphertext did not verify against the on-chain generation root (tamper, or the wrong root). | Refresh; if it persists the host is serving bad bytes — try another node. |
| `DIG_ERR_DECRYPT_TAG` | The AES-256-GCM-SIV authentication tag failed — wrong key/salt or corrupted bytes. | Recheck the URN/salt you opened; the content may be private. |
| `DIG_ERR_NOT_FOUND` | A blind miss (decoy) — there is no resource at this address under this generation. | Check the URN/path and that the capsule actually contains it. |
| `DIG_ERR_NETWORK` | The node or CDN was unreachable, or the transport failed. | Check your connection; try again or point at another node. |

## Related

- [Troubleshooting](./troubleshooting.md) — fixes for the common failures
- [FAQ](./faq.md) — frequently asked questions
- [Get help](./get-help.md) — community channels and how to file a report
- [dig RPC methods](../rpc/methods.md) — where the JSON-RPC codes come from
- [On-chain anchoring](../digstore/cli/onchain-anchoring.md) — funding, costs, and confirmation timeouts
