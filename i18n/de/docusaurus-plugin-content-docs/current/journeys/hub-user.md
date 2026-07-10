---
sidebar_position: 1
title: "How do I… use DIGHUb?"
description: "The shortest path through DIGHUb: create a store, publish a capsule, give it a web address, and get tipped — all from the browser, wallet connected only when you publish or spend."
keywords:
  - DIGHUb how-to
  - create a store
  - publish a capsule
  - custom domain
  - tip a store
  - on.dig.net
tags:
  - dighub
  - store
  - capsule
  - dig-payment
  - anchoring
---

# How do I… use DIGHUb?

> **Publish and manage your store from the browser.** [DIGHUb](../concepts.md#dighub) at [hub.dig.net](https://hub.dig.net) is the no-CLI front door: drop in a built site, preview it for free, and connect a wallet only at the moment you publish. This page is the shortest path through the things you'll actually do.

## The mental model

A **[store](../concepts.md#store)** is your site's permanent, on-chain identity — you control it with your wallet (your wallet *is* your account; no email, no password). Each publish seals the current build into one immutable **[capsule](../concepts.md#capsule)**. Building and previewing are **free**; you pay the uniform [capsule price in $DIG](../digstore/cli/onchain-anchoring.md#costs) only when you publish.

## How do I connect my wallet?

Click **Connect wallet**, then either paste the pairing link into a desktop wallet on the same computer or scan the QR code with your phone. First time using **Sage**? Its WalletConnect setting is easy to miss.

→ [Connect your wallet — step by step (Sage walkthrough)](./connect-your-wallet.md)

## How do I create a store and publish my first capsule?

[Start a new store in DIGHUb ↗](https://hub.dig.net/new), drop in your built folder (`dist/` or `build/`), preview it free on the real read path, then hit **Publish** and approve the one on-chain spend. That mints your store and publishes its first capsule.

→ [Quickstart → Publish from the web](../quickstart.md#a-publish-from-the-web)

## How do I ship an update?

Re-upload the new build, preview the draft for free, and **Publish** again. Each update is a new capsule and costs the uniform capsule price; old capsules stay readable forever, and your store always resolves to its latest unless a reader pins a specific version.

→ [Quickstart → ship an update](../quickstart.md#a-publish-from-the-web) · [On-chain anchoring](../digstore/cli/onchain-anchoring.md)

## How do I share it / give it a web address?

The moment a capsule confirms it's readable by its [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) address — universal, free, nothing to register. For a friendly `<name>.on.dig.net` handle (or a custom domain with TLS), register one in DIGHUb — an **optional, paid** step on top of the always-available address.

→ [Can I get a `*.on.dig.net` address or use my own domain?](../support/faq.md#can-i-use-my-own-domain)

## How do I get tipped for my store?

Every store has a public **tip page** (`https://hub.dig.net/tip/store/<your store id>`), and a one-line script drops a **Tip** button onto any site. Tips go wallet-to-wallet in $DIG — DIGHUb never touches the funds.

→ [Get tipped for your store](../build-a-dapp/tip-your-store.md)

## How do I let CI publish for me?

Issue a **deploy key** (a revocable key that can publish but never touch ownership) in your store's **Automation** tab, then wire it into CI — or use the GitHub deploy Action for push-to-publish with free PR previews.

→ [Deploy keys](../automation/deploy-keys.md) · [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## How do I get notified when a deploy finishes?

Register a **webhook** in the **Automation** tab to receive a signed event when a deployment changes state.

→ [Webhooks](../automation/webhooks.md)

## Can I use DIGHUb in my language?

Yes. DIGHUb — and [dig.net](https://dig.net), the DIG Network site — are both available in **14 languages**: English, 简体中文, 繁體中文, 한국어, 日本語, Русский, Español, Português (Brasil), Français, Deutsch, Türkçe, Tiếng Việt, Bahasa Indonesia, and हिन्दी. Each site **automatically matches your browser's language** on first visit. In DIGHUb, pick a specific language under **Settings → Preferences → Language**; on dig.net, use the language selector in the site header. Your choice is saved on that device and overrides automatic detection from then on.

## Stuck?

- [FAQ](../support/faq.md) — quick answers (cost, updates, privacy, domains).
- [Troubleshooting](../support/troubleshooting.md) — the common failures and their fixes.
- [Get help](../support/get-help.md) — the community and how to file a good report.

---

## Go deeper

- **The full picture for builders** → [For app developers](../audiences/app-developers.md)
- **Concepts** → [Concepts & glossary](../concepts.md) — store, capsule, URN, and DIG payment defined
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md)
