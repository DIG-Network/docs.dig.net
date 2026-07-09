---
sidebar_position: 2
title: On-chain anchoring
description: "Wallet seed setup, on-chain costs, funding, anchor status, and chain-verified downloads for DigStore projects."
keywords:
  - on-chain anchoring
  - Chia singleton
  - wallet seed
  - DIG payment
  - XCH fee
  - chain-verified download
tags:
  - anchoring
  - dig-payment
  - digstore-cli
  - store
  - chip-0035
  - capsule
---

# On-chain anchoring

Every DigStore store is a **singleton on Chia mainnet**. There is no offline mode: `init` mints the singleton and `commit` anchors each new deployment root on-chain. Both operations block until the transaction is confirmed and spend real XCH.

## Wallet seed setup

Before you can create or update a project you need a funded wallet seed.

### Import or generate

```sh
# Import an existing BIP-39 mnemonic (prompted if --mnemonic is omitted)
digstore seed import
digstore seed import --mnemonic "word1 word2 … word24"

# Generate a fresh mnemonic (shown once — back it up)
digstore seed generate             # 24 words by default
digstore seed generate --words 12  # or 12 | 15 | 18 | 21 | 24
```

The seed is encrypted with Argon2id + AES-256-GCM and written to `~/.dig/seed.enc`.

### Unlock session and TTL

Importing or generating a seed unlocks it for the current session. Subsequent commands reuse the cached unlock until the TTL expires. The TTL is set in `~/.dig/config.toml` (`unlock_ttl`). To lock early:

```sh
digstore lock
```

### Non-interactive passphrase

Set `DIGSTORE_PASSPHRASE` in the environment to supply the passphrase without a prompt — useful in CI or scripts:

```sh
DIGSTORE_PASSPHRASE=hunter2 digstore commit -m "release"
```

### Check seed status

```sh
digstore seed status    # shows whether a seed exists and is currently unlocked
```

## Costs

Every on-chain action publishes one **capsule** (`storeId:rootHash`) and costs the same uniform price.

| Operation | $DIG | XCH |
|---|---|---|
| `digstore init` (mint the first capsule) | **the capsule price** | small mainnet fee |
| `digstore commit` (publish a new capsule) | **the capsule price** | small mainnet fee |

The price is **uniform per capsule** — the same whether you mint (`init`) or commit — and is paid in $DIG at the live rate. A store's lifetime cost is therefore the uniform per-capsule price × the number of capsules. (The price is uniform by design: each capsule compiles to one fixed-size module, so a size-varying price would leak content size — see [why the price is uniform](#why-the-price-is-uniform).)

**$DIG** is the DIG Network token (a Chia CAT). The $DIG payment is included **atomically in the same spend bundle** as the mint or deployment root update — there is no separate transaction. The memo on the DIG output is the store id. Before submitting, each command prints the cost and your current balance; if the wallet is short on XCH **or** DIG the command blocks with a clear message rather than broadcasting a partial spend. Use `digstore balance` to check your spendable XCH and DIG at any time:

Publishing through [DIGHUb](https://hub.dig.net) with a **Super Supporter** NFT held in your wallet halves the capsule price. DIGHUb checks live ownership across every address in your wallet at publish time and shows/charges the discounted amount, the same live check used for the [handle discount](../../support/faq.md#can-i-use-my-own-domain). The discount applies only while the NFT is in that wallet; if it's staked, moved, or sold, DIGHUb charges the full price instead. Mint a Super Supporter badge (150 $DIG) at [hub.dig.net](https://hub.dig.net) to get one. The `digstore` CLI's `init`/`commit` always spend the full live price shown above — the discount currently applies only when publishing through DIGHUb.

```sh
digstore balance          # shows XCH (mojos), DIG (3-decimal), and receive address
digstore balance --json
```

## Funding the wallet

`init` and `commit` spend both **XCH** (the transaction fee) and **DIG** (the DIG token). The wallet derived from your seed needs **both**. If either is short, the command blocks and prints the **receive address** — fund that address on mainnet, then retry. Both XCH and DIG are received at the same `xch1…` address (DIG arrives as a CAT). Transactions go out via coinset.org over HTTPS; the `coinset_url` key in `~/.dig/config.toml` overrides the default endpoint.

### Where to get DIG {#where-to-get-dig}

$DIG is the DIG Network token (a Chia CAT). Acquire it on any of these, then send it to your `digstore balance` receive address:

- [**TibetSwap ↗**](https://v2.tibetswap.io/) — swap XCH for DIG on the AMM.
- [**dexie.space ↗**](https://dexie.space/offers/XCH/a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81) — trade DIG on the Chia DEX.
- [**9mm.pro ↗**](https://xch.9mm.pro/token/a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81) — trade DIG on the 9mm DEX.

DIG asset id (CAT TAIL): `a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81`.

:::note Iterate for free — pay only to publish
You only spend DIG when you publish a capsule on-chain (`init`/`commit`). Scaffolding, building, and previewing a site locally cost **nothing**. Start from the [zero-cost quickstart](./quickstart.md) and fund a wallet only when you're ready to go live.
:::

### Why the price is uniform per capsule {#why-the-price-is-uniform}

The price is the same for every capsule on purpose. Each capsule compiles to a **fixed-size** WASM module — padded so its length reveals nothing about how much content is inside. A price that varied with content size would re-leak the size the padding hides, so the price has to be uniform. That's why there's no per-byte fee, no tiers, and no "small commit" discount: one capsule, one price, regardless of what's in it. (The price is paid in $DIG at the live rate; only the publish screen shows the exact figure at the moment you publish.)

## `digstore init` — mint the store singleton

```sh
digstore init                              # interactive prompts
digstore init site --dir dist              # non-interactive
digstore init --wait-timeout 600           # increase confirmation timeout (default 300s)
```

`init` mints a Chia singleton on mainnet. **The on-chain launcher id becomes the store id** — the old SHA-256(pubkey) store id is gone in v0.5.0. `init` blocks until the mint transaction is confirmed (default timeout 300 s).

If the confirmation times out before the chain confirms, the store is written to disk in `pending` state and is resumable:

```sh
digstore anchor    # poll the chain and flip the store to confirmed
```

A failure *before* the mint (missing seed, insufficient funds) leaves nothing on disk — just fix the issue and re-run `init`.

## `digstore commit` — anchor a new deployment root

```sh
digstore commit -m "v1.4.2"
digstore commit -m "v1.4.2" --wait-timeout 600
```

`commit` stages a singleton update transaction on mainnet and **blocks until the transaction is confirmed** before finalizing the local deployment. If it times out or fails, the local deployment is not written — re-run `commit` to resume (the operation is idempotent). Every commit spends real XCH.

## Resuming a pending anchor

```sh
digstore anchor                    # poll the chain; flip to confirmed when seen
digstore anchor --wait-timeout 120
```

Use this after a confirmation timeout on `init` or `commit`. Once the chain confirms the transaction the store or deployment moves out of `pending`.

## Anchor status and inspection

```sh
digstore anchor status             # show the store's anchor state (network, launcher/store id, current coin, confirmed height)
digstore anchor status --json      # machine-readable

digstore anchor inspect <module.dig>          # decode the on-chain pointer embedded in the module
digstore anchor inspect <module.dig> --json
```

## Self-describing modules

Every compiled `.dig` module embeds an **on-chain pointer** in its data section:

- network (mainnet)
- launcher / store id
- current coin id
- confirmed height
- a coinset URL hint (local `~/.dig/config.toml` overrides this at runtime)

This makes the module self-describing: any tool can locate its chain state without out-of-band metadata.

## Chain-verified clone and pull

`clone` and `pull` perform three checks before accepting a download:

1. The module's embedded public key hashes to the store id you requested.
2. The served root carries the publisher's valid signature.
3. **The served root matches the store's current on-chain singleton root** (queried live from the chain).

If the chain is unreachable, or the served root does not match the on-chain root, the command fails closed — nothing is installed.

## Config: `~/.dig/config.toml`

| Key | Default | Purpose |
|---|---|---|
| `coinset_url` | `https://coinset.org` | Mainnet chain endpoint |
| `unlock_ttl` | (binary default) | Seed unlock session lifetime |
| `fee` | (binary default) | Transaction fee in mojos |

## Cost and safety

- **`init` costs the capsule price in $DIG + an XCH fee** — one spend bundle to mint the singleton (the first capsule).
- **`commit` costs the capsule price in $DIG + an XCH fee** — one spend bundle per published capsule.
- The price is **uniform per capsule** (mint or commit) everywhere in the ecosystem.
- Both are on **Chia mainnet**. There is no testnet mode; use a wallet with only as much XCH and DIG as you intend to spend.
- Lost seed = lost ability to update the store. The singleton stays on-chain and existing content remains readable, but no new commits are possible. Back up `~/.dig/seed.enc` and your mnemonic.

## Related

- [CLI tutorial](./quickstart.md) — the wallet-then-init flow end to end
- [Store structure](../format/store-structure.md) — why the store id *is* the singleton launcher id
- [Proofs & Security](../format/proofs-and-security.md) — the on-chain root check that verifies downloads
- [Command reference](./command-reference.md) — every wallet and anchoring command
- [Concepts & glossary](../../concepts.md) — anchoring and DIG payment defined

Next: [Using DigStore in your project →](./project-workflow.md)
