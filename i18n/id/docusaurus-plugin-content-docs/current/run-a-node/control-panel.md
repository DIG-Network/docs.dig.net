---
sidebar_position: 8
title: Panel Kontrol dig-node
description: "Kelola dig-node lokal Anda dari Panel Kontrol pada DIG Chrome extension: ruang cache .dig yang dicadangkan dan eviksi LRU, sumber hulu, store yang di-hosting, sinkronisasi, peer, status langsung, dan pemasangan token kontrol."
keywords:
  - panel kontrol dig-node
  - cache dig
  - eviksi LRU
  - ruang cache yang dicadangkan
  - pemasangan token kontrol
  - store yang di-hosting
  - sinkronisasi node
  - peer node
tags:
  - dig-node
  - browser
  - dig-rpc
---

# Panel Kontrol dig-node

DIG Chrome extension menyertakan **Panel Kontrol** untuk dig-node lokal Anda. Dari sana Anda dapat melihat status langsung node, memutuskan berapa banyak ruang disk yang dicadangkan untuk konten yang di-cache, dan — setelah langkah pemasangan satu kali — mengelola sumber hulu node, store yang di-hosting-nya, sinkronisasinya, dan peer-nya. Tidak diperlukan baris perintah untuk penggunaan sehari-hari.

Panel Kontrol adalah versi bawaan pada ekstensi dari layar manajemen node milik DIG Browser: ia berbicara dengan node yang berjalan di komputer Anda sendiri, sehingga semuanya tetap lokal.

## Membukanya

1. Buka ekstensi.
2. Buka tab **Network** (Jaringan) lalu pilih **Control** (Kontrol). (Popup ringkas hanya menampilkan ringkasan; gunakan **Buka panel kontrol** untuk melihat setiap bagian secara penuh layar.)

Panel akan mendeteksi node secara otomatis:

- **Node berjalan** → Anda akan melihat tampilan manajemen.
- **Tidak ada node yang ditemukan** → Anda akan melihat halaman singkat tentang cara menginstal satu. Menjelajah tetap berjalan normal — pembacaan konten akan kembali menggunakan jaringan publik; node hanya diperlukan untuk tampilan manajemen di bawah ini.

## Status langsung

Di bagian atas, indikator langsung menunjukkan apakah node Anda **Terhubung**, **Menghubungkan**, atau **Terputus**, beserta alamat dan versinya. Indikator ini memperbarui dirinya sendiri — jalankan atau hentikan node, dan indikator akan berubah dalam beberapa detik, tanpa perlu membuka ulang panel atau memuat ulang halaman.

## Mencadangkan ruang disk untuk konten yang di-cache (cache dan LRU)

Node Anda menyimpan cache lokal dari konten yang telah diambilnya, sehingga kunjungan berulang menjadi instan dan Anda turut membantu menyajikan konten tersebut. Cache memiliki **ukuran yang dicadangkan** — batas atas seberapa banyak disk yang boleh digunakannya. Ketika cache melebihi batas ini, node akan secara otomatis menghapus terlebih dahulu item yang **paling lama tidak digunakan** (kebijakan "LRU"), sehingga ruang yang Anda cadangkan tidak akan pernah terlampaui, dan konten yang benar-benar Anda pakai tetap berada di cache.

Bagian ini tersedia segera — tidak memerlukan pemasangan.

**Lihat berapa banyak yang terpakai.** Sebuah bilah menunjukkan ruang yang terpakai dibandingkan batas yang dicadangkan, ditambah beberapa angka langsung: berapa banyak item yang ada di cache, total ukurannya, berapa banyak yang telah dieviksi sejak node dimulai, dan jumlah cache hit/miss.

**Menetapkan batas yang dicadangkan.** Masukkan ukuran baru lalu terapkan. Minimumnya adalah **64 MiB**; nilai yang lebih kecil akan dinaikkan ke batas bawah ini. Menurunkan batas di bawah penggunaan saat ini akan memicu eviksi item tertua hingga penggunaan sesuai.

**Meninjau dan menghapus item cache.** Daftar item cache menampilkan setiap item beserta ukurannya, kapan terakhir digunakan, dan **urutan eviksi**-nya (posisi `0` adalah item berikutnya yang akan dihapus). Anda dapat:

- **Mengeviksi satu item** — menghapus satu item cache sekarang.
- **Bersihkan semua** — mengosongkan cache sepenuhnya.

Menghapus item hanya membebaskan disk lokal; apa pun yang Anda kunjungi kembali cukup diambil ulang.

:::tip
Berikan ruang sebanyak mungkin untuk cache pada komputer yang sering Anda pakai untuk menjelajah — cadangan yang lebih besar berarti lebih sedikit pengambilan ulang dan lebih banyak konten yang disajikan secara lokal. Pada komputer dengan ruang terbatas, tetapkan cadangan yang lebih kecil; LRU akan mempertahankan item yang paling berguna dan membuang sisanya.
:::

## Mengelola node (memerlukan pemasangan)

Bagian-bagian lainnya mengubah konfigurasi node, sehingga memerlukan izin eksplisit Anda. Karena ekstensi berjalan di dalam sandbox milik peramban, ia tidak dapat membaca berkas izin lokal node secara langsung — sebagai gantinya, Anda **memasangkannya** satu kali. Pemasangan memberikan ekstensi kredensial miliknya sendiri, dengan cakupan terbatas dan dapat dicabut; ia tidak pernah mengungkap kunci utama node, dan hanya dapat disetujui dari komputer yang menjalankan node tersebut.

### Memasangkan ekstensi dengan node Anda

1. Di Panel Kontrol, pilih **Pasangkan**. Ekstensi akan menampilkan **kode 6 digit** dan id pemasangan.
2. Di komputer yang menjalankan node, pada sebuah terminal, jalankan `dig-node pair` untuk mendaftar permintaan yang tertunda (atau langsung jalankan `dig-node pair approve <pairing-id>`).
3. Pastikan kode yang ditampilkan di terminal **cocok** dengan kode di ekstensi, lalu setujui. Kecocokan ini adalah pengaman Anda: ini memastikan bahwa yang Anda setujui adalah ekstensi *ini* dan bukan yang lain.
4. Panel Kontrol akan otomatis beralih ke status terpasang. Kredensial hanya disimpan oleh ekstensi.

Kode pemasangan **kedaluwarsa setelah beberapa menit**; jika kode Anda kedaluwarsa sebelum disetujui, pilih **Pasangkan** lagi untuk mendapatkan yang baru.

Untuk berhenti menggunakan kredensial tersebut, pilih **Lepas Pasangan** di panel (ini hanya melupakannya secara lokal). Untuk mencabutnya di node itu sendiri, jalankan `dig-node pair revoke <token-id>` di komputer tersebut — panel akan kembali ke status belum terpasang pada aksi berikutnya.

:::note
Pemasangan hanya diperlukan untuk bagian-bagian manajemen di bawah ini. Status langsung dan kontrol cache/LRU di atas berfungsi tanpanya.
:::

### Sumber hulu

Lihat sumber hulu tempat node mengambil konten, dan tetapkan yang berbeda. Sumber hulu yang diubah akan berlaku pada saat node berikutnya kali dimulai.

### Store yang di-hosting

Lihat store yang disimpan dan di-pin oleh node Anda, pin store baru (agar node menyimpan dan menyajikannya), lepaskan pin dari salah satunya, dan periksa status store mana pun. Mem-pin versi tertentu akan mengambilnya terlebih dahulu agar siap untuk disajikan.

### Sinkronisasi

Lihat apakah sinkronisasi seluruh store yang terautentikasi tersedia, dan untuk versi tertentu, picu sinkronisasi agar node mengambil dan meng-cache-nya.

### Peer

Lihat status jaringan peer node Anda — koneksinya ke relay untuk keterjangkauan di balik router rumah, serta peer yang sedang terhubung dengannya.

## Terkait

- [Kelola node Anda](./manage.md) — aksi administratif `control.*` dan cara peramban mengendalikannya
- [Arahkan konsumen ke node Anda](./point-a-consumer.md) — atur ekstensi, peramban, atau CLI agar menggunakan node Anda
- [Konfigurasikan dig-node](./configure.md) — port, batas cache, dan sumber hulu
