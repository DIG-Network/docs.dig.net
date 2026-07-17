---
sidebar_position: 1
title: For app developers
description: "Terbitkan situs atau aplikasi yang benar-benar Anda miliki — di-mint on-chain sebagai aset Anda sendiri, bukan disewa. Build dan preview gratis; bayar harga $DIG seragam kecil hanya saat menerbitkan, dengan file terenkripsi di browser Anda sehingga tak ada host yang bisa membacanya."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# For app developers {#for-app-developers}

> **Terbitkan situs atau aplikasi yang benar-benar Anda MILIKI** — di-mint on-chain sebagai aset Anda sendiri, bukan disewa. Build dan preview **gratis**; bayar **harga $DIG seragam** kecil hanya saat menerbitkan, dengan file **terenkripsi di browser Anda** sehingga tak ada host yang bisa membacanya.

## Model mental {#the-mental-model}

**[store](../concepts.md#store)** adalah identitas permanen situs Anda — sebuah singleton on-chain yang Anda kendalikan. Setiap kali Anda menerbitkan, Anda melakukan mint satu **[capsule](../concepts.md#capsule)** yang immutable = `storeId:rootHash`. Sebuah store hanyalah rangkaian capsule yang telah Anda terbitkan seiring waktu.

Dua pintu depan menuju ke loop build-gratis → publish-berbayar yang **sama**:

- **Jalur web** — [DIGHUb](../concepts.md#dighub) di [hub.dig.net](https://hub.dig.net): masukkan folder yang sudah di-build, preview gratis, hubungkan wallet hanya saat Publish.
- **Jalur CLI / CI** — CLI [`dig-store`](../concepts.md#digstore-cli) + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub deploy Action](../concepts.md#deploy-action).

Scaffold, build, dan preview tidak dikenakan biaya **apa pun**. Anda hanya membayar saat menerbitkan sebuah capsule.

| Yang Anda lakukan | Biaya |
|---|---|
| Scaffolding, building, preview draft | **Gratis** |
| Menerbitkan capsule pertama Anda (mint sebuah store) | **harga capsule seragam dalam $DIG** + fee XCH kecil |
| Menerbitkan setiap update (capsule baru) | **harga capsule seragam dalam $DIG** + fee XCH kecil |

## Mulai di sini {#start-here}

- **[Quickstart — terbitkan situs dalam 10 menit](../quickstart.md)** — jalur tercepat, web atau CLI.

## Terbitkan dari web — DIGHUb {#publish-from-the-web--dighub}

[**Mulai store baru di DIGHUb ↗**](https://hub.dig.net/new). Masukkan situs yang sudah Anda build (folder `dist/` atau `build/` Anda), dapatkan **preview draft gratis** pada jalur baca yang sesungguhnya, dan hubungkan wallet hanya pada langkah **Publish**. Lihat walkthrough web-nya di [Quickstart → Terbitkan dari web](../quickstart.md#a-publish-from-the-web).

## Terbitkan dari CLI — dig-store {#publish-from-the-cli--digstore}

Loop bergaya Git: `new` → `dev` → `init` → `commit`.

```sh
dig-store new vite-react   # scaffold proyek yang dapat langsung dijalankan — gratis, tanpa mint
dig-store dev              # preview di jalur baca chia:// yang sesungguhnya, live-reload — gratis
dig-store init site --dir dist   # mint capsule pertama store (harga seragam + fee XCH)
dig-store commit -m "v1.1"       # terbitkan sebuah update — capsule baru
```

→ [Quickstart CLI](../digstore/cli/quickstart.md) · [Alur kerja proyek lengkap](../digstore/cli/project-workflow.md)

## Scaffold sebuah aplikasi — 5 template {#scaffold-an-app--5-templates}

Mulai dari starter yang dapat langsung dijalankan dan terhubung wallet — `static`, `vite-react`, `next-static`, `nft-drop`, atau `dapp-window-chia` — melalui `dig-store new <template>` atau `npm create dig-app`.

→ [Scaffold sebuah aplikasi](../build-a-dapp/scaffold.md)

## Preview gratis dengan `dig-store dev` {#preview-free-with-digstore-dev}

`dig-store dev` menyajikan proyek Anda melalui jalur baca DIG yang **sesungguhnya** (enkripsi → kompilasi → verifikasi → dekripsi) dengan live reload dan sebuah `window.chia` dev yang disuntikkan. Apa yang Anda lihat adalah apa yang akan dilihat pengunjung — dan tidak ada yang di-mint atau dikeluarkan.

→ [Quickstart CLI → develop & preview](../digstore/cli/quickstart.md)

## `dig.toml` — manifest yang dapat di-commit {#digtoml--the-committable-manifest}

`dig.toml` di root proyek Anda menyimpan `store-id`, `output-dir`, `build-command`, `remote`, dan konfigurasi lainnya — digunakan bersama oleh `dig-store dev`, `dig-store deploy`, dan template scaffold. File ini **tidak menyimpan rahasia** (rahasia berasal dari environment), jadi commit saja.

→ [Konfigurasi proyek & nilai build-time](../digstore/cli/configuration.md)

## Update & versi — setiap publish adalah capsule baru {#updates--versions--each-publish-is-a-new-capsule}

Setiap publish menyegel build saat ini menjadi sebuah **capsule immutable baru** dan memajukan root on-chain store Anda. capsule lama tetap dapat dibaca; store selalu meresolusi ke yang terbaru kecuali seorang pembaca mengunci (pin) sebuah `rootHash` tertentu.

→ [Anchoring on-chain](../digstore/cli/onchain-anchoring.md)

## Berapa biayanya {#what-it-costs}

Gratis untuk build dan preview; **harga seragam dalam $DIG** per capsule yang diterbitkan, plus fee jaringan XCH kecil — disertakan **secara atomik** dalam spend on-chain yang sama. Harganya seragam per capsule secara sengaja (agar panjang capsule tidak membocorkan apa pun tentang konten Anda). Dapatkan $DIG di TibetSwap, dexie.space, atau 9mm.pro.

→ [Cara mendapatkan DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Mengapa setiap capsule harganya sama?](../support/faq.md#why-uniform-price)

## Push-to-deploy dari GitHub Actions {#push-to-deploy-from-github-actions}

Siapkan `dig-network/deploy-action` sehingga setiap push menerbitkan capsule baru — dengan penjaga `if-changed` yang membuat build yang identik secara byte menjadi no-op (tanpa biaya).

→ [Deploy dari GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Tambahkan alamat web `*.on.dig.net` (opsional) {#add-a-ondignet-web-address-optional}

Store Anda dapat dijangkau lewat alamat [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md)-nya begitu terkonfirmasi — tanpa biaya tambahan. Sebuah handle `<nama>.on.dig.net` yang ramah manusia adalah registrasi **opsional dan berbayar** di DIGHUb di atas itu.

→ [Bisakah saya memakai domain saya sendiri?](../support/faq.md#can-i-use-my-own-domain)

---

## Mendalami lebih jauh: protokolnya {#go-deeper-the-protocol}

Model bahasa-sederhana di atas sudah cukup untuk Anda mulai menerbitkan. Ketika Anda ingin desain lengkapnya:

- **"sebuah store adalah rangkaian capsule"** → [Konsep & glosarium](../concepts.md#capsule) · [Model capsule & store](../digstore/format/store-structure.md)
- **"file dienkripsi di browser Anda"** → [URN & enkripsi](../digstore/format/urns-and-encryption.md)
- **"harga seragam + spend $DIG atomik"** → [Anchoring on-chain](../digstore/cli/onchain-anchoring.md#costs) · [Spend store-coin CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Semuanya** → [Pembahasan mendalam protokol](../protocol-deep-dive.md)
