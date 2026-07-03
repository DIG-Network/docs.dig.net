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

The easiest way: open your store's **Developer** tab on DIGHUb (or your tip page) and copy the ready-made **Embed snippet**. It comes pre-filled with your receive address, the **$DIG** asset, and your store name — paste it into any web page and you're done.

The snippet is the [xchtip.app](https://xchtip.app) tip widget — a self-contained, embeddable Tip button. It looks like this:

```html
<script src="https://xchtip.app/embed/xch-tip.js"
  data-recipient="<your xch1… receive address>"
  data-asset="a406d3a9de984d03c9591c10d917593b434d5263cabe2b42f6b367df16832f81"
  data-scheme="purple"
  data-name="<your store name>"
  async></script>
```

On click it opens its **own** wallet connection (scan a QR or copy a link — works best with [Sage](https://sagewallet.net/)), then a tipping modal: pick an amount, sign in your wallet, send. It loads its dependencies only when a visitor clicks, so the button is weightless until used and never collides with the rest of your page.

### Options

| Attribute | Required | What it does |
|---|---|---|
| `data-recipient` | **required** | Your bech32m receive address (`xch1…`). DIGHUb fills this in from your store. |
| `data-asset` | **required** | `xch` for XCH, or a CAT asset id. The **$DIG** CAT id is `a406d3a9…16832f81`. |
| `data-scheme` | optional | `green` (default), `purple` (the $DIG brand), or `orange`. |
| `data-name` | optional | A display name shown on the widget's card/banner variants and your tip page. DIGHUb fills in your `handle/store` name. |
| `data-label` | optional | The button text. Default: `Send a tip` for a CAT, `Tip in XCH` for XCH. |
| `data-amount-presets` | optional | Comma-separated amount chips (whole units). Default for a CAT: `1,5,25`. |
| `data-variant` | optional | `button` (default), `compact`, `pill`, `inline`, `banner`, or `card`. |
| `data-target` | optional | A CSS selector to mount the button into. Default: inline, right after the script tag. |
| `data-wc-project-id` | optional | A WalletConnect projectId. Not needed — the widget uses xchtip.app's own by default. |

:::tip No projectId to manage
Unlike a raw WalletConnect integration, you don't supply a WalletConnect projectId — the widget ships with xchtip.app's. Just paste the snippet and the button works.
:::

For the full attribute set (custom colors, sizes, symbols, locale), open the [xchtip.app](https://xchtip.app) builder — it previews the button live and generates the snippet for any configuration.

## How a tip flows

1. The visitor clicks **Tip** (or **Send a tip** on the hosted page).
2. They connect a wallet — their own session, scanned or copy-linked.
3. They choose an amount and sign the payment in their wallet.
4. The payment broadcasts to Chia mainnet and arrives in your wallet.

The tip is a direct wallet-to-wallet **$DIG** transfer, built in the visitor's browser and broadcast to Chia mainnet. There is no checkout and no custodian in the middle — neither DIGHUb nor xchtip.app ever holds the funds.
