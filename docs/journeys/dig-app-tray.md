---
sidebar_position: 4
title: "Using the DIG tray app"
description: "What the DIG tray icon does: the trimmed menu vs the full menu, opening the app window, the menu top to bottom, the Open URL… global shortcut, locking and unlocking, logs, and quit."
schema_type: HowTo
keywords:
  - DIG desktop app
  - DIG tray icon
  - tray menu
  - Open URL shortcut
  - Alt+Space
  - lock the app
  - auto-update channel
tags:
  - dig-app
  - onboarding
---

# Using the DIG tray app

The **DIG desktop app** runs as an icon in your system tray (Windows) or menu bar (macOS/Linux). Everything it does — reading `chia://` content, managing your account, sending and receiving, security — starts from that icon.

## Two shapes of menu

What clicking the tray icon shows you depends on whether this computer can open the app's own window:

- **Most installs** get a short, four-row menu: whatever your account needs right now (if anything), **Open URL…**, **Open App**, and **Quit DIG**. Clicking **Open App** opens the full app window, and everything described below (View Account, Manage Account, Wallet, Security, Cache, Apps, plus Status and auto-update settings) lives there instead of in the tray.
- **On a machine where the app window isn't available** — and on any machine, the moment opening the window is seen to fail — the tray menu itself expands to the full menu described below, with every submenu right there in the tray. Nothing is lost; it just all lives in the tray instead of a separate window.

Either way, the menu *contents* below are the same — only which surface (tray vs. window) holds them changes.

## Open a `chia://` link

Click **Open URL…** and paste (or type) a `chia://` address into the window that appears. This works with **no account at all** — reading content is the product's core function and is never gated on having an account or unlocking one.

There's a faster way: **Open URL…**'s label carries a keyboard shortcut when one is registered, right in the menu (e.g. `Open URL…    Alt+Space`). Press it from anywhere to jump straight to the same input window.

### About the shortcut

- The default is **Alt+Space**. On Windows, Alt+Space normally opens the *focused window's* system menu (Move / Size / Minimize / Close) — DIG claims it deliberately, the same way Microsoft's own PowerToys Run launcher does, because a keyboard shortcut nobody can discover is a shortcut nobody uses.
- If another program already holds Alt+Space, registering it fails — in that case the **Open URL…** row shows no shortcut, and you use the menu item itself. The app never depends on the shortcut working; it's a convenience on top of the menu, never a requirement.
- The shortcut is configurable if you don't want DIG to claim Alt+Space.

## Status

**Status** shows everything the app currently knows about itself in one place — account state, node connection, and (among other things) whether the global shortcut registered and what it's bound to. If something looks wrong elsewhere, check Status first; it's available in every account state, because telling you what's going on is something the app can do even when everything else is broken.

## The menu, top to bottom

- **View Account** — your DIG ID, and your recovery phrase (view / copy / save) once you have an unlocked, recoverable account. See [Set up or restore your account](./dig-app-account.md#back-up-your-recovery-phrase).
- **Manage Account** — set up, restore, replace or remove your account. See [Set up or restore your account](./dig-app-account.md).
- **Wallet** — your receive address, balance, and the wallet's send/offers/profiles surface. See [Using the DIG wallet](./dig-app-wallet.md).
- **Security** — lock/unlock, two-factor, paired apps and WalletConnect connections. See [Two-factor and account security](./dig-app-account.md#two-factor-authentication).
- **Cache** — the node's local content-cache size limit. This submenu's own heading shows how much you're using against your current cap (e.g. "Cache — 350 MiB of 1 GiB used"), so you see the figure just by opening it. Pick a preset size or set a custom one; there's also an honest explainer of what the cache buys you in speed and costs you in disk.
- **Apps** — other DIG apps installed on this computer. Clicking one either opens it or tells you it isn't installed yet — never a silent no-op.

Two things are **always** clickable, whatever else is going on:

- **Open the log folder** — if something's gone wrong and the menu can't explain why, the logs are the escape hatch.
- **Quit DIG** — stops the app.

## Lock and unlock

- **Lock now** appears under **Security** whenever your account is unlocked. Use it to re-seal your session immediately — for example, before stepping away from your computer.
- **Unlock…** appears in its place once locked, asking for your password (or your second factor, if you've set one up).

Locking never destroys anything — it's a re-sealing of the session, not the account. See [Set up or restore your account](./dig-app-account.md) for what actually changes your account's contents.

## Auto-update

Whether DIG updates itself and which release channel it follows (stable or nightly) is set from the app window rather than the tray menu, because changing either needs administrator elevation on this computer. Open the window (**Open App**, or the full menu if that's what your install shows) to reach it.
