---
sidebar_position: 5
title: "Using the DIG wallet"
description: "The DIG desktop app's wallet: receive address, reading your balance honestly, sending, Chia offers, pairing apps and WalletConnect, and DIG profiles."
schema_type: HowTo
keywords:
  - DIG desktop app wallet
  - receive address
  - send XCH
  - Chia offers
  - WalletConnect
  - DIG profile
  - DIG ID
tags:
  - dig-app
  - wallet
  - onboarding
---

# Using the DIG wallet

The **Wallet** submenu (tray menu, or the app window's Wallet tab if your install trims the tray — see [Using the DIG tray app](./dig-app-tray.md)) is where your account's money and identity live: your address, your balance, sending, offers, and your DIG profiles.

## Receive money

**Copy my receive address** puts your `xch1…` address on your clipboard, ready to hand to whoever's paying you. It needs your account unlocked (or, on an account that's never had a password, a password set first) — until then the row names exactly which of those it's waiting on.

## Check your balance — honestly

**My wallet…** opens the wallet's overview: your balance, and the network peak it was read against. If DIG can't currently reach the chain, it says so rather than showing a stale or invented figure — a balance is only shown when it's actually known.

## Send money

There's no **Send** row in the menu — sending needs an amount and a destination, and those need a form, which a menu can't hold. Open the wallet window (**My wallet…**) to fill in a payment; DIG validates the destination before it will let you send (an address decoded for testnet, for example, is refused rather than silently burning the payment) and the fee is applied before you confirm.

### If a send's outcome was never confirmed

If DIG never learned whether a send you made actually landed, the wallet lets you acknowledge that and release it on your own say-so — you're only ever shown this after DIG has checked your acknowledgment is for the specific send in question.

## Chia offers

Like sending, taking, making, and cancelling an offer are wallet-window actions, not menu rows — they need a form (the pasted `offer1…` string, or the amounts you're offering) that a menu can't hold.

- **Take an offer** — paste an `offer1…` string, review what it actually pays and asks for, then take it. What you accept is the same bytes you reviewed on screen.
- **Make an offer** — fill in what you're offering and asking for on the Wallet pane, review, then make it.
- **Cancel an offer** — cancel one of your own outstanding offers to reclaim its coins. This is destructive: once cancelled, the offer can no longer be filled by anyone, and that can't be undone.

## Pairing other apps

Under **Security** (not Wallet — see [Two-factor and account security](./dig-app-account.md#two-factor-authentication)), two rows let other programs act through your account:

- **Pair an app…** connects a program on this same computer, over a local channel.
- **Connect an app (WalletConnect)…** connects a website or phone app, over WalletConnect — paste the `wc:` link it shows you.

Both need your DIG ID to exist first — see [DIG profiles](#dig-profiles) below — because what a pairing grants is a signature from your identity key, and there's nothing to sign with before that key exists.

- **Paired apps…** and **Manage WalletConnect connections…** show what's currently connected (including "nothing," if that's the honest answer) and let you disconnect anything, any time — these are never gated on anything, because taking access back must always be possible.

## DIG profiles

A **DIG profile** is an on-chain identity tied to your account, separate from a bare `xch1…` address.

- **Copy my DIG ID** — copies your identity address to the clipboard.
- **About DIG profiles…** and **About on-chain DIDs (required, costs XCH)…** explain what a profile and a DID are and what creating one costs — they're informational only, offered in every account state, and neither one creates or spends anything by itself.
- **Set up funding for a profile…** opens the funding check a profile has to pass before it can be created — it reads your balance and shows you where to send XCH. Clicking it doesn't create a profile or spend anything on its own; it's the step before that.
- **Publish my profile changes…** publishes edits you've made to your profile. This is a real, unrecoverable action — it spends XCH and writes to a public chain, and once published, anyone who read the old version may still have a copy of it. If you haven't set up your identity yet, the row explains that and points at the remedy instead of doing nothing silently.

Once you have more than one profile, each one (other than the one currently active) offers **switch to this profile** and **hide from this list**. Hiding is a *local, this-computer-only* preference — it doesn't delete the profile, stop it existing on chain, or stop it being able to spend; it only removes it from view here. You can't hide the profile that's currently active.

## Node-level: reset the coin database

**Reset coin database and re-sync…**, offered whenever a node is connected, discards this node's locally cached view of your coins and rebuilds it from chain. It touches no keys and spends nothing — it's a repair for a coin that failed to sync once and was never retried, not an account action.
