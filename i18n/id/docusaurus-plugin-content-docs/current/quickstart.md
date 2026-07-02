---
sidebar_position: 2
title: Quickstart
description: "Terbitkan situs pertama Anda di DIG — gratis untuk build dan preview, Anda hanya membayar harga capsule seragam saat menerbitkan. Jalur web-first (tanpa wallet di awal) plus jalur CLI paralel."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Quickstart {#quickstart}

Terbitkan situs ke jaringan yang tidak bisa dibaca, diubah, atau diturunkan oleh host mana pun — dalam sekitar sepuluh menit.

**Anda build dan preview secara gratis.** Scaffolding dan preview tidak dikenakan biaya apa pun; Anda membayar **harga capsule seragam dalam $DIG** hanya pada saat menerbitkan [capsule](./concepts.md#capsule) on-chain. *Iterasi secara gratis, terbitkan saat sudah siap.*

Ada dua cara melakukannya. Kebanyakan orang mulai dari web.

- **[A. Terbitkan dari web](#a-publish-from-the-web)** — di [DIGHUb](./concepts.md#dighub), hubungkan wallet di akhir. Paling cocok untuk situs dan frontend. ~10 menit.
- **[B. Terbitkan dari CLI](#b-publish-from-the-cli)** — `digstore` di mesin Anda, scriptable dan siap untuk CI. Paling cocok untuk developer dan otomatisasi.

---

## A. Terbitkan dari web {#a-publish-from-the-web}

Jalur tercepat: build dan preview di browser, danai wallet hanya pada langkah terakhir.

### 1. Buka DIGHUb dan mulai draft — gratis, tanpa wallet {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**Mulai store baru di DIGHUb ↗**](https://hub.dig.net/new). Masukkan situs yang sudah Anda build (folder file statis — `dist/` atau `build/` Anda). DIGHUb memberi Anda **preview draft gratis** persis bagaimana situs itu akan disajikan, tanpa apa pun on-chain dan tanpa $DIG yang dikeluarkan.

Anda belum perlu wallet. Iterasi draft sebanyak yang Anda mau — unggah ulang, preview ulang — sepenuhnya gratis.

### 2. Preview di jalur baca yang sesungguhnya — masih gratis {#2-preview-it-on-the-real-read-path--still-free}

Preview merender situs Anda melalui pipeline DIG yang asli (enkripsi → kompilasi → verifikasi → dekripsi), sehingga apa yang Anda lihat adalah apa yang akan dilihat pengunjung. Klik-klik untuk memeriksa aset dan routing. Tidak ada yang diterbitkan dan tidak ada yang dikeluarkan sampai Anda memilih untuk melakukannya.

### 3. Terbitkan — danai dan hubungkan wallet {#3-publish--fund-and-connect-a-wallet}

Ketika draft sudah terlihat pas, klik **Publish**. Ini satu-satunya langkah yang mengeluarkan biaya:

- Hubungkan wallet Chia (wallet Anda *adalah* akun Anda — tanpa email, tanpa password).
- Setujui spend on-chain: **harga capsule seragam dalam $DIG + fee XCH kecil**, dalam satu tanda tangan. Layar publish menampilkan jumlah $DIG persis sebelum Anda menandatangani.
- DIGHUb melakukan mint store Anda dan menerbitkan **capsule** pertama di Chia mainnet.

Kekurangan DIG? Layar publish menampilkan saldo Anda dan tempat untuk top up. Lihat [Cara mendapatkan DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space, atau 9mm.pro.

### 4. Anda sudah live {#4-youre-live}

capsule Anda kini tertanam on-chain dan **langsung dapat dibaca melalui [dig RPC](./concepts.md#dig-rpc)** — siapa pun dapat mengambil dan memverifikasinya lewat [URN `urn:dig:`](./concepts.md#urn) atau alamat [`chia://`](./browser/chia-protocol.md), tanpa registrasi dan tanpa biaya tambahan apa pun. URN sekaligus menjadi alamat *dan* kunci; bagikan untuk membagikan konten. Jalur baca bersifat universal dan gratis; ia langsung live begitu capsule terkonfirmasi.

**Ingin alamat `*.on.dig.net` yang ramah manusia?** Itu opsional. Sebuah store mendapatkan subdomain `*.on.dig.net` hanya ketika Anda **mendaftarkan handle** untuknya di DIGHUb — sebuah registrasi berbayar terpisah yang mengikat store ke nama tersebut. Sampai Anda mendaftarkan satu, tidak ada URL `*.on.dig.net` (alamat URN / `chia://` di atas selalu menjadi cara kanonis untuk menjangkaunya). Lihat [Bisakah saya memakai domain saya sendiri?](./support/faq.md#can-i-use-my-own-domain).

**Untuk mengirim update nanti:** edit, preview draft baru secara gratis, lalu Publish lagi. Setiap update yang diterbitkan adalah capsule baru dan dikenakan **harga capsule seragam** lagi — Anda hanya membayar saat mempromosikan sebuah draft menjadi versi on-chain permanen.

:::tip Otomatiskan
Setelah store Anda ada, siapkan [Deploy dari GitHub Actions](./digstore/cli/deploy-from-github-actions.md) sehingga setiap push ke `main` menerbitkan capsule baru — git-push-to-deploy.
:::

---

## B. Terbitkan dari CLI {#b-publish-from-the-cli}

Alur yang sama dari terminal Anda — scriptable dan menjadi dasar untuk CI. CLI mencerminkan jalur web: build dan preview tidak berbiaya; menerbitkan capsule berbiaya harga capsule seragam dalam $DIG.

### 1. Instal {#1-install}

```sh
# unduh installer untuk OS Anda dari halaman Releases, lalu:
digstore --version
```

Lihat [Menginstal CLI](./digstore/cli/install.md) untuk installer per-OS dan build dari source.

### 2. Scaffold dan preview — gratis, tanpa chain, tanpa biaya {#2-scaffold-and-preview--free-no-chain-no-spend}

Scaffold sebuah proyek dan preview secara lokal — **gratis, tanpa mint, tanpa chain** — sebelum Anda mengeluarkan biaya apa pun:

```sh
digstore new <template>   # scaffold proyek yang sudah terhubung wallet (static · vite-react · next-static · nft-drop · dapp-window-chia) — gratis, tanpa mint
digstore dev              # watch + compile-on-save + sajikan jalur baca chia:// yang sesungguhnya, dengan window.chia yang disuntikkan — gratis, live-reload
```

`new` menulis proyek yang dapat langsung dijalankan (sebuah `dig.toml` + aplikasi starter); `dev` menyajikannya melalui jalur baca DIG yang sesungguhnya (kompilasi → verifikasi → dekripsi) dengan live reload. Anda hanya membayar harga capsule seragam saat menerbitkan (langkah berikutnya). Atau build dengan toolchain biasa Anda (`npm run build` → `dist/`) dan terbitkan hasilnya.

:::tip Lebih suka npm? Gunakan `create-dig-app`
Jika Anda hidup di dunia Node, `npm create dig-app@latest my-app -- --template vite-react` melakukan scaffold template yang sama langsung dari npm — tidak perlu instal `digstore` untuk memulai. Lihat [Scaffold sebuah aplikasi](./build-a-dapp/scaffold.md).
:::

### 3. Siapkan wallet (hanya diperlukan untuk menerbitkan) {#3-set-up-a-wallet-only-needed-to-publish}

Menerbitkan mengeluarkan dana sungguhan, jadi Anda memerlukan seed dan wallet yang terdanai terlebih dahulu:

```sh
digstore seed generate      # hasilkan mnemonic baru (ditampilkan sekali — segera backup)
digstore balance            # tampilkan alamat penerima Anda; danai dengan XCH + DIG
```

Lihat [Anchoring on-chain](./digstore/cli/onchain-anchoring.md) untuk detail import, pendanaan, dan TTL.

### 4. Terbitkan capsule pertama Anda {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # mint capsule pertama store (harga capsule seragam + fee XCH)
```

`init` melakukan mint singleton Chia di mainnet — **launcher id menjadi store id Anda** — dan menunggu hingga terkonfirmasi.

### 5. Kirim update {#5-ship-updates}

```sh
npm run build                      # hasilkan dist/
digstore add -A                    # stage seluruh content root
digstore commit -m "v1.1"          # terbitkan capsule baru (harga capsule seragam + fee XCH)
```

Untuk CI, satu perintah melakukan add → commit → push dan mencetak URL:

```sh
digstore deploy --output-dir dist --json   # majukan store yang sudah ada dari CI; tidak pernah melakukan mint
```

Lihat [Deploy dari GitHub Actions](./digstore/cli/deploy-from-github-actions.md).

### 6. Baca kembali {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # satu URN yang sekaligus menemukan DAN mendekripsi
```

---

## Berapa biayanya {#what-it-costs}

| Yang Anda lakukan | Biaya |
|---|---|
| Scaffolding, building, preview draft | **Gratis** |
| Menerbitkan capsule pertama Anda (`init` / DIGHUb Publish) | **harga capsule seragam dalam $DIG** + fee XCH kecil |
| Menerbitkan setiap update (`commit` / Publish ulang) | **harga capsule seragam dalam $DIG** + fee XCH kecil |

Harganya **seragam per capsule** di mana pun — lihat [alasan harga bersifat seragam](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Mengalami kendala? {#stuck}

- [Troubleshooting](./support/troubleshooting.md) — kegagalan umum dan solusinya.
- [FAQ](./support/faq.md) — jawaban singkat.
- [Dapatkan bantuan](./support/get-help.md) — komunitas dan cara melaporkan masalah dengan baik.

## Terkait {#related}

- [Konsep & glosarium](./concepts.md) — capsule, store, URN, dan pembayaran DIG dijelaskan
- [Scaffold sebuah aplikasi (create-dig-app)](./build-a-dapp/scaffold.md) — mulai proyek yang siap deploy dalam satu perintah (npm atau CLI)
- [Menginstal CLI](./digstore/cli/install.md) — pasang `digstore` di mesin Anda
- [Anchoring on-chain](./digstore/cli/onchain-anchoring.md) — setup wallet, pendanaan, dan biaya
- [Deploy dari GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — push-to-publish di CI
- [Tutorial CLI](./digstore/cli/quickstart.md) — walkthrough lengkap create-commit-read
