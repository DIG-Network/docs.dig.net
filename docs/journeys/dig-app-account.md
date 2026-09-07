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

### If you wrote your phrase down from an older build

An earlier version of the DIG desktop app could show an **incomplete** recovery phrase on the backup screen — 10 of the 24 words rather than all of them. If the phrase you have written down or saved came from a build you no longer have, or you're not certain it was the full 24 words, open **View Account → Show my recovery phrase…** on your current install and re-check every word against your backup before you rely on it. A backup missing words is not a backup.

## Set a password

A brand-new account starts sealed under a password the app generated for you, not one you chose. Until you set your own, the **Security** menu offers **Set a password for my DIG Account…** in place of Unlock — this re-seals the *same* seed under a password you pick, so your account, its identity and its data all survive; nothing is created or replaced.

Set your own password as soon as you can. A machine-generated password you never see is not something you can type back in if you ever need to unlock this account on a different install.

## Replace or remove an account {#manage-account}

**Manage Account** is where you go once you already have an account and want a *different* one, or none at all. Every action here is destructive — read the confirmation it shows you before continuing.

- **Replace this account with a NEW one…** — discards the account on this computer and generates a brand-new one in its place. Use this for a fresh start, or as the fix for a legacy account that has no recovery phrase at all (see **This account has NO recovery phrase — what to do…** under View Account) — there is no way to add a phrase to an account that was never given one, so replacing it is the only remedy.
- **Replace it with an account from a recovery phrase…** — discards the account on this computer and restores a *different* one from a phrase you type in. Same destructive guard as above.
- **Remove this account from this computer…** — removes the account entirely, leaving none. This is the way out for uninstalling, handing the machine on, or moving your account elsewhere — as long as you've backed up its recovery phrase first, nothing is lost; the account still exists wherever else you've restored it.

None of these touch your recovery phrase itself — the phrase is what makes an account restorable in the first place. They touch only what's stored on *this* computer.

## Two-factor authentication {#two-factor-authentication}

Once your account is unlocked, **Security** offers **Set up a security key…** — enrolling a second factor (a hardware security key or your platform's biometric, depending on what this computer supports) that DIG asks for before it will run any of the destructive account actions above, or reveal your recovery phrase.

### The honest threat model

A second factor protects your account from someone who does not control this unlocked computer — it is a second lock on destructive actions and phrase reveals, on top of the first (unlocking). It is **not** protection from:

- **Anyone who has your recovery phrase.** The phrase alone restores your account on any machine, with or without a second factor enrolled there. A second factor makes THIS install harder to act against; it does not make the account itself un-restorable by whoever holds the phrase.
- **Someone who already controls this computer while it's unlocked.** If your session is unlocked and your machine is compromised or in someone else's hands, a second factor enrolled on that same machine is not an independent barrier.

Treat it as what it is: a second factor, not a replacement for keeping your recovery phrase private.

### Turning it off, and what changes with platform support

**Turn off the second factor…** sits in Security whenever one is enrolled, and it works even while your account is **locked** — turning a factor off only deletes the enrolment record and is authorized by your device rather than by the account, so an account that can never be unlocked (see below) can still have its second factor removed. That matters because a second factor that could only be turned off by unlocking first would make an account permanently un-recoverable the moment it became impossible to unlock.

If DIG shows **Second factor: not available on this platform in this version…**, that's naming a real current limitation rather than a state of your account — it still runs the same turn-off flow if you click it. If DIG shows **Second factor: status unavailable…**, it couldn't read this host's enrolment state; clicking it still runs the turn-off flow, which reports what it actually finds.

## An account that won't open

If DIG reports **This account cannot be opened — what to do…**, the account's data is sealed under a key this install can no longer derive. There is no repair for the seal itself — the remedy is **Replace this account with a NEW one…** or **Replace it with an account from a recovery phrase…** under Manage Account, which discards the unopenable account and gives you a working one in its place. Back up anything you can before replacing, if you're able to reach it.
