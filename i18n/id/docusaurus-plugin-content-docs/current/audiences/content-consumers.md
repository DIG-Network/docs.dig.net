---
sidebar_position: 5
title: For content consumers
description: "Buka konten chia:// yang diverifikasi oleh browser Anda SENDIRI terhadap blockchain — tak ada host yang bisa mengubah atau memalsukannya, konten privat tetap privat dari host, dan bersifat permanen serta dapat di-host ulang di mana saja, sehingga tak seorang pun dapat menurunkannya atau mengunci Anda."
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# For content consumers {#for-content-consumers}

> **Buka konten `chia://` yang diverifikasi oleh browser Anda SENDIRI terhadap blockchain** — tak ada host yang bisa mengubah atau memalsukannya, konten privat tetap privat dari host, dan bersifat permanen serta dapat di-host ulang di mana saja, sehingga tak seorang pun dapat menurunkannya atau mengunci Anda.

## Model mental {#the-mental-model}

Tempel sebuah tautan `chia://` dan konten langsung datang dari jaringan — **content-addressed** dan **diverifikasi secara kriptografis di PERANGKAT ANDA** sebelum dirender. Sifatnya **fail-closed**: byte yang diutak-atik atau tidak dapat didekripsi tidak akan pernah ditampilkan.

- **Hilangkan `rootHash`** untuk versi *terbaru* store: `chia://<storeId>/`.
- **Sertakan** untuk mengunci satu [capsule](../concepts.md#capsule) immutable yang persis: `chia://<storeId>:<rootHash>/`.

Konten publik hanya memerlukan tautannya. Konten privat juga memerlukan sebuah **`?salt=`** rahasia — seperti sebuah password.

## Dapatkan DIG Browser, atau ekstensinya {#get-the-dig-browser-or-the-extension}

- **[Dapatkan DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — sebuah browser dengan `chia://` dan wallet bawaan yang sudah tertanam.
- **Ekstensi** untuk Chrome / Edge / Brave / Firefox — menambahkan resolusi `chia://` ke browser yang sudah Anda gunakan.

## Membuka konten `chia://` — terbaru vs terkunci (pinned) {#open-chia-content--latest-vs-pinned}

Bentuk-bentuk alamat, bilah `chia://<store>/` yang bersih, dan kapan mengunci sebuah `rootHash`.

→ [Protokol chia://](../browser/chia-protocol.md)

## Halaman bawaan, badge terverifikasi & shield {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, serta badge terverifikasi / shield yang menunjukkan hasil verifikasi inclusion-proof setiap resource untuk capsule yang aktif.

→ [Menggunakan window.chia](../browser/using-window-chia.md)

## Publik vs privat — kapan Anda memerlukan rahasia `?salt=` {#public-vs-private--when-you-need-a-salt-secret}

Store publik terbuka hanya dengan tautannya; store privat memerlukan salt rahasia yang menurunkan decryption key.

→ [Store publik vs privat](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Publik vs privat — apa bedanya?](../support/faq.md#public-vs-private)

## Jalankan konten secara lokal (opsional) {#run-content-locally-optional}

Arahkan browser/ekstensi Anda ke sebuah [dig-node](../concepts.md#dig-node) lokal untuk pembacaan yang lebih cepat dan ramah-offline — keduanya berbagi satu cache `.dig`. Anda tidak pernah *perlu* sebuah node untuk membaca.

→ [Jalankan sebuah node](../run-a-node/index.md)

## Dapatkan $DIG {#get-dig}

Anda tidak memerlukan $DIG untuk *membaca* konten. Jika Anda ingin menerbitkan, dapatkan $DIG di **TibetSwap**, **dexie.space**, atau **9mm.pro**.

→ [Di mana saya bisa mendapatkan DIG?](../support/faq.md#where-do-i-get-dig)

---

## Mendalami lebih jauh: protokolnya {#go-deeper-the-protocol}

- **"diverifikasi terhadap blockchain"** → [Anchoring on-chain](../digstore/cli/onchain-anchoring.md) · [Proof & keamanan](../digstore/format/proofs-and-security.md)
- **"salt publik vs privat"** → [URN & enkripsi](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"terbaru vs terkunci"** → [Generation & root hash](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Semuanya** → [Pembahasan mendalam protokol](../protocol-deep-dive.md) · [Konsep & glosarium](../concepts.md)
