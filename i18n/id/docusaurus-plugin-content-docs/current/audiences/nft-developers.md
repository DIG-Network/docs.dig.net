---
sidebar_position: 2
title: For NFT developers
description: "Mint seluruh koleksi CHIP-0007 yang seninya hidup secara permanen dalam sebuah capsule DIG yang tamper-evident — satu bundle yang ditandatangani secara atomik, royalti sungguhan, dan mekanisme drop yang jujur yang tidak pernah memalsukan apa yang belum bisa mereka buktikan on-chain."
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# For NFT developers {#for-nft-developers}

> **Mint seluruh koleksi CHIP-0007 yang seninya hidup secara PERMANEN dalam sebuah capsule DIG yang tamper-evident** — satu bundle yang ditandatangani secara atomik, royalti sungguhan, dan mekanisme drop yang jujur (reveal / allowlist / phase) yang tidak pernah memalsukan apa yang belum bisa mereka buktikan on-chain.

## Model mental {#the-mental-model}

Pertama-tama masukkan seni Anda ke dalam sebuah **[capsule DIG](../concepts.md#capsule)**, lalu mint NFT yang `data_uris` / `metadata_uris`-nya menunjuk ke capsule tersebut. Hash on-chain mengunci byte yang asli — sehingga seni tersebut bersifat content-addressed, dapat diverifikasi, dan permanen, bukan sekadar tautan yang bisa lapuk atau ditukar.

Spend **tidak pernah dirakit sendiri (hand-rolled)**: wasm builder CHIP-0035 kanonis (melalui [`@dignetwork/dig-sdk/spend`](../sdk.md)) membangun setiap spend coin, wallet Anda menandatangani sekali, dan ia melakukan broadcast sekali.

Melakukan mint sebuah **store bersifat gratis** dari $DIG — Anda hanya membayar **harga capsule seragam** ketika sebuah capsule dibuat (ketika seni tersebut ditulis ke dalam sebuah capsule).

## Scaffold sebuah halaman mint — template `nft-drop` {#scaffold-a-mint-page--the-nft-drop-template}

Mulai dari sebuah halaman drop yang terhubung wallet dalam satu perintah:

```sh
digstore new nft-drop
# atau
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Scaffold sebuah aplikasi](../build-a-dapp/scaffold.md)

## Mint dari CLI {#mint-from-the-cli}

CLI aset membangun spend melalui builder `digstore-chain`, menandatangani dengan seed wallet Anda, dan melakukan push — semuanya aman untuk CI dengan `--dry-run` / `--json`:

```sh
digstore did create                          # sebuah DID penerbit untuk atribusi
digstore collection create --name "My Drop"  # sebuah koleksi CHIP-0007
digstore nft mint --data ./art.png --metadata ./meta.json --dry-run
digstore offer make ...                       # perdagangan XCH / CAT
```

Jalur **capsule-media** dari `nft mint` menulis seni + metadata CHIP-0007 ke dalam sebuah capsule, menghitung hash data/metadata dari byte yang asli, dan menetapkan URI ke alamat `chia://` capsule tersebut (dengan fallback gateway https). → [Referensi perintah](../digstore/cli/command-reference.md)

## Mint dari web — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Mint sebuah koleksi capsule-backed di browser: unggah seni (ditulis ke dalam sebuah capsule), tetapkan royalti, dan lampirkan sebuah DID untuk atribusi — wallet menandatangani di akhir. → [DIGHUb ↗](https://hub.dig.net)

## Drop — reveal, allowlist, phase {#drops--reveal-allowlist-phases}

Mekanisme drop disajikan secara **jujur**: apa yang benar-benar ditegakkan on-chain hari ini vs. apa yang merupakan kenyamanan off-chain sambil menunggu primitif claim-coin. Kami tidak pernah menyajikan jaminan yang belum bisa kami buktikan on-chain.

→ [Bangun dapp di Chia](../build-a-dapp/tutorial.md) untuk alur mint end-to-end.

## Bangun spend dengan SDK — jangan pernah rakit sendiri {#build-spends-with-the-sdk--never-hand-roll}

Setiap spend coin dibangun oleh wasm CHIP-0035 kanonis dan diekspor ulang di `@dignetwork/dig-sdk/spend`. Alurnya selalu **build → sign → broadcast**, dipisah sehingga wallet hanya pernah menandatangani.

→ [Membangun spend](../spends.md) · [DIG SDK](../sdk.md)

## Monetisasi & pembatasan akses — Paywall {#monetize--gate--the-paywall}

`Paywall` milik SDK menggabungkan provider dengan spend builder untuk **pay-to-unlock** dan **pembatasan akses berbasis kepemilikan NFT / koleksi** — tanpa menghubungkan spend secara manual.

→ [DIG SDK → Paywall](../sdk.md#paywall)

## Offer — make / take / show {#offers--make--take--show}

Perdagangkan NFT untuk XCH atau CAT dengan `digstore offer make | take | show` (masing-masing dengan `--dry-run` / `--json`). → [Referensi perintah](../digstore/cli/command-reference.md)

---

## Mendalami lebih jauh: protokolnya {#go-deeper-the-protocol}

- **"capsule tamper-evident"** → [Proof & keamanan](../digstore/format/proofs-and-security.md) · [Model capsule & store](../digstore/format/store-structure.md)
- **"jangan pernah rakit sendiri sebuah spend"** → [Spend store-coin & delegasi CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Semuanya** → [Pembahasan mendalam protokol](../protocol-deep-dive.md) · [Konsep & glosarium](../concepts.md)
