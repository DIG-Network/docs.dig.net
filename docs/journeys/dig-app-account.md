---
sidebar_position: 3
title: "Set up or restore your account (DIG desktop app)"
description: "First run in the DIG desktop app: create a brand-new account or import an existing 24-word recovery phrase, then back it up safely — view, copy, or save your recovery phrase behind an unlock, with an honest note on keeping the plaintext seed secure."
schema_type: HowTo
keywords:
  - DIG desktop app
  - recovery phrase
  - import recovery phrase
  - restore account
  - back up account
  - 24-word recovery phrase
  - self-custody
tags:
  - dig-app
  - wallet
  - onboarding
---

# Set up or restore your account (DIG desktop app)

> Your account is a **24-word recovery phrase**. Whoever holds it controls the account — there is no password reset and no support line that can recover it for you. Back it up, and keep the backup private.

The first time you open the **DIG desktop app** it sets up your account. You have two routes.

## First run — create new or import

- **Create a new account.** The app generates a fresh 24-word recovery phrase for you. This is a brand-new account with no history.
- **Import an existing recovery phrase.** Already have an account — from this app on another machine, or any wallet that uses a standard 24-word recovery phrase? Choose **Import**, type your existing phrase, and the app restores that account. This is how you move your account to a new computer or recover it after a reinstall.

Either route ends with the same account unlocked and ready.

## Back up your recovery phrase

You can view your recovery phrase — and make a copy of it — at any time from the app's backup screen. Because the phrase is the whole account, the app **asks you to unlock first**: the backup screen is reachable only after you confirm it's you.

From there you have three ways to save it:

- **View it** — the 24 words are shown on screen so you can write them down. Writing them on paper and storing that somewhere safe is the most durable backup.
- **Copy to clipboard** — puts the phrase on your clipboard so you can paste it into your own password manager.
- **Save to a file** — writes the phrase to a file you choose. On macOS and Linux the file is created readable only by your user account.

## Keep the plaintext safe {#keep-it-safe}

:::caution The copy and save options write the phrase as plain text
Copying to the clipboard, or saving to a file, puts your recovery phrase in the clear — it is **not** encrypted by those actions. Anyone who reads that clipboard or that file can take your account. Treat both as sensitive:

- **After copying, clear your clipboard** once you've pasted the phrase where you want it. Clipboard history and clipboard sync (across your own devices, or to a cloud service) can quietly keep a copy — so don't leave it sitting there.
- **If you save to a file, store it somewhere you trust** — an encrypted disk or a password manager — and remove any stray copy from a shared or synced folder. On macOS and Linux the app restricts the file to your own account, but a plaintext seed is still only as safe as where you put it.
:::

Written down on paper and kept offline, a recovery phrase is a strong backup. The risk is only in the plaintext copies you make — so make them deliberately, put them somewhere private, and don't leave loose copies behind.
