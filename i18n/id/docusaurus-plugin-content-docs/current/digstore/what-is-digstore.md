---
sidebar_position: 1
title: What is dig-store?
description: "Format proyek content-addressable bergaya Git dengan enkripsi bawaan dan pengalamatan berbasis URN; dikompilasi menjadi satu modul WebAssembly yang mempertahankan dirinya sendiri."
keywords:
  - dig-store
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# What is dig-store? {#what-is-digstore}

**dig-store adalah proyek content-addressable terenkripsi bergaya Git yang dikompilasi menjadi satu modul WebAssembly yang mempertahankan dirinya sendiri.**

Anda mendapatkan perintah bergaya Git — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — untuk sebuah proyek yang **terenkripsi saat disimpan (at rest)** dan dikompilasi menjadi **satu file `.wasm`**. File tunggal itu adalah *sekaligus data Anda dan server yang mengatur akses ke data tersebut*. Host yang menyimpan atau merelainya hanya melihat ciphertext yang dialamatkan dengan hash; ia tidak dapat membaca apa yang dibawanya.

Anda mengalamatkan konten dengan sebuah **[URN](./format/urns-and-encryption.md)**, dan URN itu *adalah* kuncinya: ia sekaligus menemukan dan mendekripsi. Berikan seseorang sebuah URN dan mereka dapat membaca resource tersebut; tanpanya mereka tidak bisa — tidak ada password terpisah atau daftar akses yang perlu dikelola.

Berbeda dengan Git, dig-store dibangun untuk **hasil build**, bukan source repositori. Anda mengarahkan sebuah proyek ke direktori seperti `dist/` dan ia menangkap apa yang ada di sana.

## Mengapa ada {#why-it-exists}

| Masalah | Jawaban dig-store |
|---|---|
| Host bisa membaca / memindai apa yang Anda terbitkan | Konten dienkripsi saat disimpan; host hanya memegang ciphertext berkunci hash |
| Kontrol akses berarti password dan ACL | URN *adalah* kapabilitasnya — bagikan untuk memberi akses baca, tahan untuk menolak |
| Anda harus memercayai server untuk menyajikan byte yang asli | `clone`/`pull` memverifikasi store id modul, root yang ditandatangani penerbit, dan **root singleton on-chain** sebelum menginstal — gagal secara tertutup (fail closed) |
| "Seberapa besar payload ini?" bocor dari ukuran file | Setiap proyek adalah satu `.wasm`, di-padding hingga ukuran seragam yang tidak mengungkap apa pun tentang isinya |
| Logika penyajian hidup terpisah dari data | Data dan kode yang mengatur aksesnya dikompilasi menjadi modul yang *sama* |

## Cara membaca dokumen ini {#how-to-read-these-docs}

- **[Format dig-store](./format/overview.md)** — konsepnya: proyek, deployment, modul `.wasm`, URN, enkripsi, dan proof. Mulai di sini jika Anda ingin memahami *apa* itu dig-store.
- **[Tutorial CLI](./cli/install.md)** — instal CLI dan gunakan di proyek nyata: inisialisasi sebuah proyek, tangkap direktori build, commit deployment, bagikan lewat sebuah remote, dan streaming konten kembali keluar.

Jika Anda hanya ingin mencobanya, langsung lompat ke **[Quickstart](../quickstart.md)** (jalur web-first yang gratis) atau **[tutorial CLI](./cli/quickstart.md)**.

:::note
dig-store adalah bagian dari [DIG Network](https://dig.net). Desain teknis lengkapnya ada di bagian [Protokol](../protocol-deep-dive.md) — format store WASM content-addressable.
:::

## Terkait {#related}

- [Format dig-store](./format/overview.md) — proyek, modul WASM, URN, enkripsi, proof
- [Struktur store](./format/store-structure.md) — identitas store, generation, dan modul yang dikompilasi
- [URN & Enkripsi](./format/urns-and-encryption.md) — URN yang sekaligus mengalamatkan *dan* mendekripsi
- [Tutorial CLI](./cli/quickstart.md) — buat, commit, dan baca sebuah store dalam hitungan menit
- [Konsep & glosarium](../concepts.md) — entitas inti DIG sekilas
