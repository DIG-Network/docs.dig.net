---
sidebar_position: 1
title: Run a DIG node
description: "Apa itu dig-node, mengapa Anda perlu menjalankannya, dan cara menginstalnya — repositori apt untuk Ubuntu/Debian atau installer universal lintas-platform."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Run a DIG node {#run-a-dig-node}

> **Sajikan konten secara terbukti dan provider-blind** — Anda hanya pernah menyentuh ciphertext yang tak terbedakan berkunci hash, dapat membuktikan penyajian yang jujur dengan execution proof, dan klien memverifikasi semuanya terhadap chain, sehingga kepercayaan tidak pernah bertumpu pada node Anda.

**dig-node** adalah **server** konten DIG Network — sisi penyedia (supply side) jaringan. Ia meng-host capsule, menyimpan cache `.dig` lokal, dan mengekspos [dig RPC](../rpc/what-is-the-dig-rpc.md) sehingga apa pun yang membaca konten DIG dapat membacanya dari Anda. Ia berjalan headless (tanpa browser, tanpa UI) sebagai layanan latar belakang — sebuah seedbox untuk konten yang Anda terbitkan atau ingin bantu sajikan.

Ia adalah rekan dari sisi **konsumen** — [DIG Browser](../browser/chia-protocol.md) dan ekstensi browser — yang mengambil ciphertext + proof, memverifikasi terhadap root on-chain, mendekripsi secara lokal, dan merender. Anda **tidak** memerlukan sebuah dig-node untuk membaca konten DIG: seorang konsumen saja sudah cukup, kembali ke node referensi publik di `rpc.dig.net` sebagai fallback. Anda menjalankan sebuah dig-node untuk **menyajikan** — dan ketika ada satu di mesin yang sama, konsumen membaca darinya (lokal, ramah-offline, dan berkontribusi ke jaringan) dan keduanya berbagi satu cache `.dig`.

:::info Menyajikan vs. mengonsumsi
- **dig-node** = menyajikan konten + mengekspos dig RPC. Layanan latar belakang headless.
- **DIG Browser / ekstensi** = mengonsumsi konten (verifikasi + dekripsi secara lokal). Tidak memerlukan node lokal.

Ketika keduanya terinstal, browser/ekstensi membaca dari dig-node lokal Anda; jika tidak, mereka membaca dari `rpc.dig.net`. Bagaimanapun caranya, setiap byte diverifikasi di sisi klien terhadap chain — sumbernya tidak pernah dipercaya begitu saja.
:::

## Instal {#install-it}

| Mesin Anda | Gunakan |
|---|---|
| **Ubuntu / Debian** | **[repositori apt](./apt.md)** native — `apt install dig-node digstore`, otomatis diaktifkan sebagai layanan systemd. |
| **Windows / macOS / Linux (apa pun)** | **[installer universal](#universal-installer-any-os)** lintas-platform — satu `curl \| sh` (atau unduh) untuk setiap OS. |

Keduanya menginstal layanan `dig-node` yang sama plus CLI `digstore`. apt adalah jalur native-Debian (ditandatangani, dapat di-`apt upgrade`); installer universal mencakup semuanya yang lain.

### apt (Ubuntu / Debian) — direkomendasikan pada sistem keluarga-Debian {#apt-ubuntu--debian--recommended-on-debian-family-systems}

Jalur native: sebuah repositori apt yang ditandatangani di `apt.dig.net`. Ia menginstal `dig-node` sebagai **layanan systemd** terkelola dan menjaganya tetap terbarui dengan `apt upgrade`.

→ **[Instal di Ubuntu/Debian via apt](./apt.md)**

### Installer universal (OS apa pun) {#universal-installer-any-os}

Jalur lintas-platform — Windows, macOS, dan Linux apa pun. Ia mendeteksi OS Anda, menginstal layanan `dig-node` (layanan Windows / `systemd` / `launchd`) dan CLI `digstore`, dan tidak memerlukan package manager:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

Ini adalah `dig-installer` mandiri yang sama yang dirilis di [halaman Releases](https://github.com/DIG-Network/dig-installer/releases) — unduh dan jalankan langsung jika Anda lebih suka tidak meng-pipe ke shell, atau di Windows.

:::note Pra-rilis
Installer yang di-hosting (`apt.dig.net`, `dig.net/install.sh`) masih dalam tahap penyediaan. Sampai keduanya live, build dari source atau ambil sebuah binary dari [Releases dig-node](https://github.com/DIG-Network/dig-node/releases). Perintah di sini adalah perintah yang sungguhan dan dimaksudkan.
:::

## Hanya ingin membaca konten? {#just-want-to-read-content}

Anda tidak memerlukan sebuah node. Dapatkan **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** dan buka alamat `chia://` apa pun — ia mengonsumsi dari dig-node lokal Anda jika Anda punya satu, jika tidak dari `rpc.dig.net`. Lihat [Protokol `chia://`](../browser/chia-protocol.md).

## Terkait {#related}

- [Instal di Ubuntu/Debian via apt](./apt.md) — jalur native-Debian + manajemen layanan systemd
- [Instal di mana saja — installer universal](./universal-installer.md) — Windows / macOS / Linux apa pun + `dig.local`
- [Arahkan sebuah konsumen ke node Anda](./point-a-consumer.md) — pembacaan lokal-terlebih-dahulu + cache `.dig` bersama
- [Konfigurasikan dig-node](./configure.md) — port, listener, batas cache, upstream
- [Self-host sebuah origin remote](../rpc/dig-remote.md) — `digstore serve` + clone/pull/push dig://
- [Kelola node Anda](./manage.md) — RPC admin control.* dan UI My Node
- [Menggunakan RPC jaringan publik](../rpc/public-network-rpc.md) — dig RPC yang diucapkan node Anda, dan cara mengoperasikan sebuah node di jaringan
- [Menginstal CLI](../digstore/cli/install.md) — `digstore` sendiri (menerbitkan, bukan menyajikan)

## Mendalami lebih jauh: protokolnya {#go-deeper-the-protocol}

- **"host blind & decoy"** → [Model blind serving dig RPC](../rpc/what-is-the-dig-rpc.md) · [Konformansi node](../rpc/conformance.md)
- **"membuktikan penyajian yang jujur"** → [Inclusion vs execution proof](../inclusion-vs-execution-proofs.md)
- **"clone/pull/push dig://"** → [Protokol remote §21/§22](../rpc/dig-remote.md)
- **Semuanya** → [Pembahasan mendalam protokol](../protocol-deep-dive.md) · [Konsep & glosarium](../concepts.md)
