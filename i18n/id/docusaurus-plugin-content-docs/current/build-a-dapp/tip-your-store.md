---
sidebar_position: 1.8
title: Get tipped for your store
description: "Every store gets a public, shareable tip page, and a one-line script embeds a Tip button on any site. Visitors tip you directly in $DIG, wallet to wallet — no account, no backend, no middleman."
keywords:
  - tip a store
  - tip button
  - embed tip widget
  - DIG tip
  - shareable tip page
  - DIGHUb
tags:
  - dighub
  - dig-payment
  - store
  - capsule
---

# Get tipped for your store

> Every store has a **public tip page** anyone can open to send you **$DIG**, and a **one-line script** drops a **Tip** button onto any website. Tips go **straight to your wallet** — wallet to wallet, on Chia mainnet. No account, no backend, no middleman, and DIGHUb never touches the funds.

## The mental model

A tip is a direct **$DIG** send from a visitor's wallet to your store's owner wallet. The visitor connects a wallet, picks an amount, signs in their own wallet, and the payment broadcasts to the network. You receive it like any other coin.

There are two ways to collect tips, and both run the same flow:

1. A **hosted tip page** on DIGHUb — a shareable URL you can drop in a bio, a README, or a post.
2. An **embeddable Tip button** — a script you paste into your own site so visitors tip without leaving it.

## Share your tip page

Every store anchored on-chain has a deterministic, shareable tip page:

```
https://hub.dig.net/tip/store/<your store id>
```

Open it signed-out to view; it shows your store name, its address, your links, and a **Send a tip** action. Connecting a wallet is only needed to actually tip. Because the URL is just your store id, the page is stable and cacheable — paste it anywhere.

:::tip
If your store is published under a handle on DIGHUb, it also has a tip page at `https://hub.dig.net/tip/<handle>/<slug>`. Both lead to the same tip flow.
:::

## Embed a Tip button on your own site

Paste this one line into any web page where you want the button to appear:

```html
<script
  src="https://hub.dig.net/embed/dig-tip.js"
  data-store="<your 64-hex store id>"
  data-wc-project-id="<your WalletConnect projectId>"
  data-label="Tip in DIG"
  data-presets="1,5,25"
  async></script>
```

The widget is fully self-contained: on click it opens its **own** wallet connection (scan a QR or copy a link — it works best with [Sage](https://sagewallet.net/)), then a tipping modal (pick an amount → sign → send). It loads its dependencies only when the visitor clicks, so the button is weightless until used and never collides with the rest of your page.

### Options

| Attribute | Required | What it does |
|---|---|---|
| `data-store` | **required** | Your store's on-chain id (64-hex). The widget resolves your receive address from it. |
| `data-wc-project-id` | **required** | A free WalletConnect (Reown) projectId from [cloud.reown.com](https://cloud.reown.com). A public embed can't share one; you provide your own. |
| `data-label` | optional | The button text. Default: `Tip in DIG`. |
| `data-presets` | optional | Comma-separated $DIG amount chips. Default: `1,5,25`. |
| `data-target` | optional | A CSS selector to mount the button into. Default: right after the script tag. |
| `data-api-base` | optional | Override the DIGHUb API base. Default: `https://hub.dig.net/v1`. |
| `data-recipient` | optional | Pin the recipient address (64-hex inner puzzle hash) instead of resolving it from the store. Advanced. |

:::note Why you supply your own projectId
WalletConnect needs a project id to open a session, and a public script can't ship a shared secret one. Get a free id at [cloud.reown.com](https://cloud.reown.com) and put it in `data-wc-project-id`. Without it the button still renders and explains the missing id on click — it never fails silently.
:::

## How a tip flows

1. The visitor clicks **Tip** (or **Send a tip** on the hosted page).
2. They connect a wallet — their own session, scanned or copy-linked.
3. They choose an amount and sign the payment in their wallet.
4. The payment broadcasts to Chia mainnet and arrives in your wallet.

The tip is a direct wallet-to-wallet **$DIG** transfer. DIGHUb only helps look up your store's receive address and build the payment in the visitor's browser — it never holds the funds, and there is no checkout or custodian in the middle.
