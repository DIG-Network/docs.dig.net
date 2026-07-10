---
sidebar_position: 2
title: "How do I connect my wallet? (Sage walkthrough)"
description: "Step-by-step: connect a Chia wallet to DIGHUb, including exactly where Sage's WalletConnect setting lives."
keywords:
  - connect wallet
  - Sage
  - WalletConnect
  - DIGHUb
  - pair wallet
tags:
  - dighub
  - wallet
  - sage
  - walletconnect
---

# How do I connect my wallet?

> DIGHUb only needs your wallet at the moment you sign something — creating your account handle or publishing a capsule. Building and previewing are free and need no wallet at all.

## What "connecting" actually does

[DIGHUb](../concepts.md#dighub) never holds your keys or your funds. Connecting opens a **WalletConnect** session — an encrypted pairing between your browser and your wallet app — so DIGHUb can ask your wallet to sign things, and your wallet always shows you exactly what it's signing before anything happens. Disconnect any time; nothing is ever removed from your wallet, and no key ever leaves it.

## Step 1 — Click Connect wallet

On [hub.dig.net](https://hub.dig.net), click **Connect wallet** (top-right of every page). A QR code and a copyable pairing link appear.

## Step 2 — Open your wallet and pair

You have two ways to pair, depending on where your wallet lives:

- **Wallet on the same computer as your browser** (the common case for [Sage](https://sagewallet.net/) on desktop): click **Copy link**, then paste it into your wallet — see the exact steps for Sage below.
- **Wallet on your phone**: scan the QR code on screen with your phone's camera or your wallet's built-in scanner.

### Connecting with Sage (step by step)

DIGHUb is built and tested against **[Sage](https://sagewallet.net/)**, the recommended Chia wallet — but its WalletConnect setting is a little hidden the first time you look. Here's exactly where to find it:

1. **Don't have Sage yet?** [Download it](https://sagewallet.net/) and create or import a wallet first — this takes a couple of minutes.
2. Open Sage and click the **gear icon** (Settings).
3. Choose **WalletConnect** from the settings list.
4. Click **Add connection** (the **+** button).
5. **Paste the link** you copied from DIGHUb — or, if Sage is on your phone, tap the scan icon on that same screen and scan the QR code instead.
6. Sage shows you which site is asking to connect (`hub.dig.net`). Review it and **approve**.
7. Go back to the DIGHUb tab — it now shows you're paired.

> Using a different WalletConnect-compatible Chia wallet? The same shape applies: look for a **WalletConnect** or **Connect a dApp** option in its settings, then paste the link or scan the QR code.

## Step 3 — Sign in (one free signature)

DIGHUb asks your wallet to sign a one-time challenge that proves you control it — this is **not an on-chain transaction** and costs nothing. Approve it in your wallet, and you're connected.

## Step 4 — First time only: choose a username

The first time you connect, DIGHUb asks for a short username (3–30 characters, lowercase letters/digits/hyphens). This becomes your public address (`hub.dig.net/<username>`) — pick something you're happy to share.

## Troubleshooting

- **Nothing happens after pasting the link** — make sure you copied the whole link (use the **Copy link** button rather than selecting text by hand), and that Sage is fully open and unlocked.
- **Sage doesn't show a signing request** — bring the Sage window to the front; some setups open the request behind the browser window.
- **"Your wallet session can't sign"** — disconnect and reconnect, confirm Sage is up to date, and make sure you're not connecting a watch-only wallet. See [Troubleshooting → Wallet / session](../support/troubleshooting.md#wallet-session).
- **Wrong network** — DIGHUb runs on Chia **mainnet**; connect a mainnet wallet (an address starting `xch1…`), not testnet.

## Go further

- [How do I use DIGHUb?](./hub-user.md) — the full "how do I" path once you're connected.
- [Wallet security](../browser/wallet-security.md) — how key derivation and signing work under the hood.
- [FAQ](../support/faq.md) · [Troubleshooting](../support/troubleshooting.md)
