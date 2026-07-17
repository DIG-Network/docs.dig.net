---
sidebar_position: 2
title: Troubleshooting
description: "Fixes for the most common DIG failures — funding, confirmation timeouts, push conflicts, verification errors, and wallet/session problems."
keywords:
  - DIG troubleshooting
  - insufficient DIG
  - confirmation timeout
  - non-fast-forward
  - verification failed
  - wallet session
tags:
  - digstore-cli
  - dighub
  - anchoring
  - dig-payment
---

# Troubleshooting

The failures you're most likely to hit, and how to fix them. Each one names the [error code](./error-codes.md) you'll see so you can match it to the message in front of you.

## Publishing / on-chain

### "Insufficient DIG" / "not enough DIG" {#insufficient-dig}

*CLI exit `12` · DIGHUb `DIG_INSUFFICIENT`*

Publishing a capsule costs the **uniform capsule price in $DIG + a small XCH fee**, and your wallet is short on one of them.

- Check your balance: `digs balance` (or the DIGHUb publish screen).
- Fund the **receive address** it shows. You need both: XCH for the fee and enough $DIG for the capsule price. DIG arrives as a Chia CAT at the same `xch1…` address.
- Need DIG? Swap XCH for it on [TibetSwap ↗](https://v2.tibetswap.io/), [dexie.space ↗](https://dexie.space/offers/XCH/a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81), or [9mm.pro ↗](https://xch.9mm.pro/token/a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81), then send it to your receive address.

See [Where to get DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) and [Funding a wallet](../digstore/cli/onchain-anchoring.md#funding-the-wallet).

### The confirmation timed out {#confirm-timeout}

*CLI exit `14` · DIGHUb `REG_PENDING`*

`init`/`commit` block until Chia confirms the spend. On a slow block the wait can time out **even though the transaction will still confirm**. Nothing is lost.

```sh
digs anchor status      # see whether the chain has confirmed it
digs anchor             # poll and flip the project to confirmed once seen
```

A failure *before* the spend (missing seed, insufficient funds) leaves nothing on disk — just fix it and re-run. **Do not pay again** while a spend is pending.

### "non-fast-forward: remote root has advanced" {#non-fast-forward}

*CLI exit `7`*

Someone (or another machine) published a newer capsule than your local copy, so your push isn't a fast-forward.

```sh
digs pull               # bring your local store up to the current root
digs push               # then push
```

### CI deploy fails or double-spends

- The Action **never mints** — the store must already exist (`digs init` once). If you see a mint attempt, you're pointing at a missing/empty store; check `store-id` in `dig.toml`.
- Fund the **dedicated deploy wallet** with enough $DIG for your expected deploys (the uniform capsule price each). See [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md).
- Use `--if-changed` so a no-op build doesn't spend the capsule price on an identical capsule.

## Reading / verification

### "verification failed" {#verification-failed}

*CLI exit `5`*

The served bytes didn't verify against the on-chain root, or couldn't be decrypted. Almost always one of:

- **Wrong or missing `salt`** for a **private** store — a private URN needs its `?salt=<hex>`. Pass `--salt <hex>` to `digs cat`/`checkout`.
- **Wrong URN** — the URN *is* the key; a typo yields the wrong decryption key.
- Genuine tampering — the host returned bytes that don't match the signed root. DIG fails closed by design: nothing is written.

### "resource not found" {#not-found}

*CLI exit `4` · RPC `-32602`*

The store id, root, or path doesn't resolve to a committed resource.

```sh
digs log                # list generations (each root hash is a capsule)
digs keys               # list every committed resource's URN + retrieval key
```

Confirm the store has at least one confirmed capsule; `"latest"` on a brand-new store with no confirmed generation is invalid.

## Wallet / session

### "Your wallet session can't sign" {#wallet-session}

*DIGHUb `WALLET_SESSION`*

- **Disconnect and reconnect** your wallet in DIGHUb.
- Make sure **Sage is up to date** — older versions miss some signing methods.
- A **watch-only** wallet can't sign; connect a wallet that holds the key.
- Wrong network? Connect a **Chia mainnet** (`xch1…`) wallet.
- Can't find where to pair in the first place? See [Connect your wallet with Sage](../journeys/connect-your-wallet.md) for exactly where the WalletConnect setting lives.

### "You declined the request" {#declined}

*DIGHUb `WALLET_DECLINED`*

Not an error — you cancelled the signature in your wallet. Nothing was signed or broadcast. Re-try and approve if you meant to publish.

## Node & browser extension

### "The extension shows my node as offline" {#extension-offline}

Your `dig-node` is running and `/health` answers fine, but the DIG browser extension still reports it offline.

Modern Chrome enforces **Private Network Access**: it blocks a page/extension request to a private address (127.0.0.1 included) unless the node's CORS preflight response allows it. Older `dig-node` builds didn't send that allowance.

- Update to the latest `dig-node` release (v0.13.0 or later) and restart the service.
- Reload the extension after the node restarts.
- Still offline? Confirm you're hitting the node directly at its configured port, not a stale cached connection — reload the extension's own background/service-worker context too.

### "control.* requires the local control token" {#control-token}

You ran `dig-node pair approve …` (or another `control.*`/management command) and it was rejected with this message.

This means the terminal you ran it from can't read the node's control token. The node stores that token in a shared, machine-wide location; if your shell can't read it, the two don't line up. The command itself prints the exact remedy for your setup — the common fixes:

- **Install with the [DIG Installer](../run-a-node/universal-installer.md)** (or a native package / apt). It puts the control state in the machine-wide location and grants your user account read access, so `dig-node pair approve <pairing-id>` then works from an ordinary, non-elevated terminal.
- **On Linux, if the node runs as `root`** (the systemd service from the `.deb`), the control state is root-only — run the command with **`sudo`**: `sudo dig-node pair approve <pairing-id>`.
- Make sure the node is actually **running** (`dig-node status`) before approving — pairing talks to the live service.

## CLI setup

### "no seed found" {#no-seed}

*CLI exit `9`*

```sh
digs seed generate      # create a wallet (mnemonic shown once — back it up)
# or
digs seed import        # import an existing BIP-39 mnemonic
```

### "wrong passphrase" {#bad-passphrase}

*CLI exit `10`*

Re-run and enter the correct passphrase. For CI/scripts, set `DIGSTORE_PASSPHRASE` in the environment. Lost the passphrase? You'll need to re-import from your mnemonic.

### "command not found: dig-store" {#not-installed}

Open a **new** terminal after installing (so `PATH` refreshes), then `digs --version`. See [Installing the CLI](../digstore/cli/install.md).

## Still stuck?

- Look up the exact code in [Error codes](./error-codes.md).
- Ask in the community or file a report — see [Get help](./get-help.md).

## Related

- [Error codes](./error-codes.md) — every code in one table
- [FAQ](./faq.md) — frequently asked questions
- [Get help](./get-help.md) — community channels and how to report
- [On-chain anchoring](../digstore/cli/onchain-anchoring.md) — funding, costs, and confirmation
- [Concepts & glossary](../concepts.md) — the vocabulary, defined once
