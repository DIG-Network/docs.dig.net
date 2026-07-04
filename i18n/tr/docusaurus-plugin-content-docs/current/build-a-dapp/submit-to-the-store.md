---
sidebar_position: 1.9
title: Submit your dApp to the store
description: "List your dApp on the DIG Network dApp store (explore.dig.net): connect your wallet on DIGHUb, fill in the submission form, and an admin reviews it. Once approved, DIGHUb opens the listing for you automatically — no repository, no pull request, no waiting on infrastructure."
keywords:
  - submit a dapp
  - list on explore.dig.net
  - DIG Network dApp store
  - dApp store submission
  - DIGHUb submit
tags:
  - dighub
  - store
  - dapp-store
---

# Submit your dApp to the store

> **List your dApp on the DIG Network dApp store** — [explore.dig.net](https://explore.dig.net), the curated
> directory of dApps built on Chia. Connect your wallet on [DIGHUb](../concepts.md#dighub), fill in one
> form, and an admin reviews it. Once approved, DIGHUb opens the listing for you automatically — you
> never touch a repository or a pull request.

## The mental model

The DIG Network dApp store is **curated**: every listing is reviewed before it goes live. Submitting
is a single wallet-gated form on DIGHUb at **[hub.dig.net/submit](https://hub.dig.net/submit)** — your
Chia wallet **is** your identity here, so there's no separate account or password. Fill in your dApp's
details and artwork, submit for review, and track its status on the same page. An admin reviews the
submission; once approved, DIGHUb publishes it to explore.dig.net for you.

## Before you start

Gather these first so the form goes quickly:

- **The basics** — your dApp's name, a one-line tagline, a longer description, its category, a
  handful of search tags, its live URL, and your (or your team's) name.
- **Artwork** — a square app icon and a social-share image are **required to list**; a wide hero
  image and at least two desktop screenshots are needed if you want your dApp considered for the
  **featured** shelf. See [Artwork requirements](#artwork-requirements) below for exact sizes.
- **Optional extras** — a public source repository, your dApp's own version, its license, and links
  to docs, Discord, X, YouTube, or a blog.

## Submit your dApp

1. **Connect your wallet** at [hub.dig.net/submit](https://hub.dig.net/submit). If you're signed
   out, DIGHUb asks you to connect before showing the form — the wallet you connect becomes the
   submission's owner, so you (and only you) can see its status afterward.
2. **Fill in the form**, organized into four sections:
   - **About your dApp** — slug (the URL-safe name your listing uses, e.g. `my-dapp`), name, tagline,
     and description.
   - **Details** — category, tags, your live website URL, author name (and an optional author URL),
     status (Live, Beta, or Draft), an accent color that themes your listing, and an optional version
     string.
   - **Links** *(optional)* — a public source repository, a license identifier, and any of docs,
     Discord, X, YouTube, or a blog.
   - **Artwork** — upload your PNGs; see [Artwork requirements](#artwork-requirements).
3. **Submit for review.** DIGHUb uploads your artwork and hands the submission to an admin queue.
   Your submission then appears under **Your submissions** on the same page, with a live status:

   | Status | Meaning |
   |---|---|
   | Uploading | Your artwork is still being uploaded. |
   | In review | Everything uploaded; waiting on an admin. |
   | Approved | An admin approved it — the listing PR is open. |
   | Published | The listing is live on explore.dig.net. |
   | Rejected | An admin declined it (with a reason you can read). |
   | Needs a retry | Approved, but publishing hit a snag — DIGHUb will retry automatically. |

4. **An admin reviews it.** Reviews check the same things every explore.dig.net listing must satisfy —
   working product, accurate metadata, and artwork that meets the size requirements below. If a
   submission is declined, you'll see the reason and can submit again.
5. **Once approved, it's published — no extra step from you.** DIGHUb opens the listing on
   explore.dig.net on your behalf and, once it passes the store's automated checks, it goes live at
   `explore.dig.net/app/<your-slug>`. Your submission's status updates to **Published** when it does.

## Field reference

| Field | Required | Notes |
|---|---|---|
| Slug | yes | Lowercase letters, numbers, and hyphens, 3–40 characters (e.g. `my-dapp`) — this becomes your listing's URL. |
| Name | yes | 1–40 characters, as you want it branded. |
| Tagline | yes | 10–120 characters, plain text — your one-line pitch. |
| Description | yes | 80–5,000 characters; basic markdown (paragraphs, headings, lists, bold/italic/code/links) is supported. |
| Category | yes | One primary category: Payments, DeFi, NFTs, Gaming, Social, Storage, Identity, Infrastructure, Tools, or Other. |
| Tags | yes | 1–8 short keywords, comma-separated. |
| Website | yes | Your live dApp — must start with `https://`. |
| Author / team name | yes | 1–60 characters. |
| Author URL | optional | Must be `https://` if set. |
| Status | yes | Live, Beta, or Draft. A Draft listing shows a Draft badge and can't be featured. |
| Accent color | yes | A `#RRGGBB` color that themes your listing's card and detail page. |
| Source repository | optional | A public `https://github.com/...` link. Open-source dApps are preferred. |
| Version | optional | Your dApp's own release version. |
| License | optional | An SPDX identifier (e.g. `MIT`, `GPL-2.0`). |
| Docs / Discord / X / YouTube / Blog | optional | Any that apply, each `https://`. |

Every listing you submit starts **not featured** — featuring is a curation decision the store team
makes after your dApp is live, not something you set yourself.

## Artwork requirements

Every image is a **PNG at the exact pixel size** shown — the store validates this automatically, so
double-check your export before uploading.

| Image | Exact size | Max size | Required |
|---|---|---|---|
| App icon | 512 × 512 | 512 KiB | **to list** |
| Social share image | 1200 × 630 | 1 MiB | **to list** |
| App icon (large) | 1024 × 1024 | 1 MiB | optional |
| Hero image | 1600 × 900 | 2 MiB | **to be featured** |
| Tile image | 800 × 450 | 1 MiB | optional |
| Desktop screenshots | 1280 × 800 | 2 MiB each | up to 8; **2+ needed to be featured** |
| Mobile screenshots | 1080 × 1920 | 2 MiB each | up to 8 |

Screenshots should be real captures of your running dApp, numbered in the order you upload them.

## What happens after you submit

Once your submission is **Published**, it's a normal explore.dig.net listing: discoverable in the
store's search and category filters, with its own detail page and social-share card. Updating a
published listing's metadata or artwork later isn't yet available from the submission form — for now,
each submission creates one listing.

## Stuck?

- [FAQ](../support/faq.md) — quick answers about DIGHUb.
- [Get help](../support/get-help.md) — the community and how to file a good report.

---

## Go deeper

- **Publish the dApp itself first** → [For app developers](../audiences/app-developers.md) — ship
  your site or app before you list it in the store.
- **The full picture for using DIGHUb** → [How do I… use DIGHUb?](../journeys/hub-user.md)
