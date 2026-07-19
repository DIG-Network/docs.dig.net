---
sidebar_position: 1
slug: /
title: DIG Network
description: "Ringkasan primitif DIG Network: dig-store untuk penerbitan content-addressable, dig RPC untuk blind hosting dan retrieval, serta DIG Browser untuk akses konten."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - dig-store
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network adalah Proof-of-Stake Layer 2 di atas Chia** — jaringan terdesentralisasi untuk menerbitkan, mengalamatkan, dan menyajikan konten tanpa harus memercayai pihak yang meng-host-nya.

Dokumen ini membahas jaringan dan **primitif-primitifnya**: blok bangunan komposabel yang digunakan developer untuk membangun di atas DIG. Jaringan ini masih terus berkembang, dan lebih banyak primitif akan didokumentasikan di sini seiring waktu.

:::info $DIG menggerakkan jaringan
**$DIG adalah mesin dan ekonomi DIG Network.** Setiap pertukaran nilai — menerbitkan capsule, memiliki store, memberi tip ke kreator — mengalir melalui $DIG. Mengonsumsi konten tetap mudah dan gratis: Anda tidak pernah membayar untuk membaca, hanya untuk menerbitkan dan memiliki.
:::

## capsule {#the-capsule}

Satu konsep mengalir melalui setiap primitif. **capsule** adalah satu generasi store yang immutable — pasangan `(storeId, rootHash)`, ditulis secara kanonis sebagai `storeId:rootHash`. **store adalah rangkaian capsule**, satu per commit (setiap commit memajukan root on-chain dan menghasilkan capsule baru).

capsule adalah unit dasar jaringan untuk:

- **Kompilasi** — setiap capsule dikompilasi menjadi satu modul WASM berukuran tetap (di-padding sehingga panjangnya tidak membocorkan apa pun tentang ukuran konten).
- **Penetapan harga** — **harga seragam per capsule** (mint atau commit), dibayar dalam $DIG pada kurs yang berlaku; biaya seumur hidup sebuah store adalah harga seragam per capsule × jumlah capsule.
- **Retrieval** — sebuah URN menamai satu capsule (ditambah resource opsional di dalamnya).
- **Caching** — host atau browser menyimpan cache capsule dengan kunci `storeId:rootHash`; cache lokal adalah kumpulan capsule.
- **Provenance** — root setiap capsule membawa tanda tangan BLS penerbit dan root Merkle.

Ini adalah definisi yang berlaku di seluruh ekosistem: "capsule = `(storeId, rootHash)`" memiliki arti yang sama di dig-store, dig RPC, dan DIG Browser.

:::tip Coba sekarang
[**Buat capsule pertama Anda di DIGHUb ↗**](https://hub.dig.net/new) — terbitkan situs langsung dari browser, tanpa perlu CLI. Setiap capsule (mint atau commit) dikenakan **harga capsule seragam dalam $DIG**.
:::

## Primitif {#primitives}

### 🗄️ dig-store {#️-digstore}

Primitif pertama dan paling fundamental: sebuah **proyek content-addressable terenkripsi dalam format WASM**. Anda arahkan ke direktori build, melakukan commit deployment layaknya Git, dan mendapatkan satu file `.wasm` yang mempertahankan dirinya sendiri — yaitu data Anda sekaligus server yang mengatur akses ke data tersebut. URN itu sendiri *adalah* kuncinya — ia sekaligus menemukan dan mendekripsi.

→ **[Jelajahi dig-store](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[Apa itu dig-store?](./digstore/what-is-digstore.md)** | Ide satu-file, secara ringkas |
| **[Format](./digstore/format/overview.md)** | Proyek, deployment, URN, enkripsi, proof |
| **[Tutorial CLI](./digstore/cli/quickstart.md)** | Instal dan gunakan `dig-store` di proyek Anda |

### 🛰️ dig RPC {#️-dig-rpc}

Primitif jaringan: sebuah **antarmuka standar untuk membaca konten dari deployment dig-store yang di-host**. JSON-RPC 2.0 melalui HTTPS `POST` — setiap node hosting berbicara dengan cara yang identik, sehingga konten bersifat portabel dan klien tidak terikat pada node tertentu. Ia menyajikan ciphertext + proof inklusi berdasarkan retrieval key, seluruh deployment berdasarkan `(store_id, root)`, dan manifest discovery publik — di-streaming dalam potongan (chunk), blind secara konstruksi, diverifikasi dan didekripsi sepenuhnya di sisi klien.

→ **[Jelajahi dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[Apa itu dig RPC?](./rpc/what-is-the-dig-rpc.md)** | Satu endpoint untuk seluruh jalur baca jaringan |
| **[Metode](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | Model chunk, penyusunan ulang, dan verifikasi proof |
| **[Konformansi & Keamanan](./rpc/conformance.md)** | Model blind, CORS, dan apa yang harus diimplementasikan sebuah node |

### 🌐 DIG Browser {#-dig-browser}

Primitif klien: sebuah **browser dengan wallet Chia bawaan**. Ia menyuntikkan provider `window.chia` di setiap halaman, sehingga aplikasi web apa pun dapat meminta alamat, tanda tangan, dan spend milik pengguna tanpa perlu setup WalletConnect — alternatif drop-in untuk aplikasi yang sudah menggunakan CHIP-0002. Browser ini juga langsung meresolusi alamat konten `chia://`.

→ **[Bangun aplikasi dengan DIG Browser](./browser/using-window-chia.md)**

| | |
|---|---|
| **[Menggunakan `window.chia` di aplikasi Anda](./browser/using-window-chia.md)** | Deteksi wallet yang disuntikkan, hubungkan, dan panggil metode CHIP-0002 |

:::tip Coba sekarang
[**Dapatkan DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — unduh browser untuk membuka konten `chia://` dan menggunakan wallet bawaan.
:::

*Primitif lainnya — settlement dan operasi node — akan mendapatkan bagiannya sendiri seiring dirilis.*

## Pilih jalur Anda {#pick-your-path}

Dokumen ini disusun berdasarkan **apa yang sedang Anda kerjakan**. Setiap jalur dibuka dengan "alasan" singkat sepuluh detik, model mental yang Anda butuhkan, dan cara-cara praktis paling penting — lalu tertaut ke protokol saat Anda ingin mendalami lebih jauh.

- **[Terbitkan situs atau aplikasi yang Anda miliki](./audiences/app-developers.md)** — kirim website/aplikasi sebagai aset on-chain milik Anda sendiri; build gratis, terbitkan sebuah capsule.
- **[Mint NFT & koleksi](./audiences/nft-developers.md)** — drop CHIP-0007 yang didukung oleh capsule permanen dan tamper-evident.
- **[Integrasikan DIG ke dalam aplikasi Anda](./audiences/integration-developers.md)** — SDK yang bertipe (typed) + platform yang sepenuhnya machine-readable.
- **[Jalankan sebuah node](./run-a-node/index.md)** — sajikan konten secara terbukti dan provider-blind.
- **[Buka konten chia://](./audiences/content-consumers.md)** — baca konten yang diverifikasi sendiri oleh browser Anda terhadap chain.
- **[Atasi kendala](./audiences/troubleshooting.md)** — temukan kegagalan Anda lewat kode stabilnya.

Baru mengenal kosakatanya? Simak [Konsep & glosarium](./concepts.md). Ingin memahami desain lengkapnya? Baca [Pembahasan mendalam protokol](./protocol-deep-dive.md).

:::note
DIG Network dan primitif-primitifnya bersifat open source. dig-store dilisensikan di bawah GPL-2.0; lihat [repositori dig-store](https://github.com/DIG-Network/digs).
:::

## Terkait {#related}

- [Quickstart](./quickstart.md) — terbitkan situs pertama Anda; gratis untuk build dan preview
- [Bangun dapp di Chia](./build-a-dapp/tutorial.md) — setiap primitif dalam satu tutorial end-to-end
- [Konsep & glosarium](./concepts.md) — entitas inti DIG, didefinisikan dan tertaut
- [Apa itu dig-store?](./digstore/what-is-digstore.md) — format store content-addressable
- [Apa itu dig RPC?](./rpc/what-is-the-dig-rpc.md) — antarmuka baca yang berlaku di seluruh jaringan
- [Protokol chia://](./browser/chia-protocol.md) — membuka konten di DIG Browser
- [Dapatkan bantuan](./support/get-help.md) — komunitas, troubleshooting, dan kode error
