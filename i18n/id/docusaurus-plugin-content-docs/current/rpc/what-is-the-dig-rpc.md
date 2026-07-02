---
sidebar_position: 1
title: What is the dig RPC?
description: "Antarmuka baca yang berlaku di seluruh jaringan untuk capsule DigStore melalui JSON-RPC 2.0; blind secara konstruksi, dapat diverifikasi tanpa kepercayaan, dan dapat di-streaming pada ukuran berapa pun."
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# What is the dig RPC? {#what-is-the-dig-rpc}

:::info Spesifikasi normatif
Ini adalah halaman orientasi. Spesifikasi antarmuka mesin yang otoritatif — metode, objek wire chunk, profil node, dan dokumen OpenRPC — ada di [Protocol · The dig RPC](../protocol/dig-rpc.md).
:::

**dig RPC adalah antarmuka yang berlaku di seluruh jaringan untuk membaca konten langsung dari capsule `.dig` DigStore yang di-host.** Ini adalah layanan [JSON-RPC 2.0](https://www.jsonrpc.org/specification) yang diucapkan melalui HTTPS `POST`.

Setiap node yang meng-host capsule — node referensi di `https://rpc.dig.net`, atau node pihak ketiga mana pun — mengekspos **metode yang sama dengan semantik yang sama**. Sebuah klien yang ditulis terhadap antarmuka ini membaca dari seluruh jaringan melalui satu endpoint. Tidak ada CDN; semua penyajian konten di DIG dilakukan melalui dig RPC.

Ia menyajikan tiga hal:

| Anda punya… | Anda memanggil… | Anda mendapatkan kembali… |
|---|---|---|
| **retrieval key** sebuah resource (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | Ciphertext resource tersebut + sebuah merkle inclusion proof (dan ZK execution proof), di-streaming dalam chunk |
| **store id + root generation** | [`dig.getCapsule`](./methods.md#diggetcapsule) | Seluruh capsule `.dig` untuk generation tersebut, di-streaming dalam chunk |
| **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | Manifest discovery publik / manifest metadata store / daftar generation terkonfirmasi milik store |

## Tiga properti yang mendefinisikannya {#three-properties-that-define-it}

- **Blind secara konstruksi.** Sebuah node menyajikan ciphertext buram berkunci hash. Ia tidak pernah melihat URN, decryption key, atau plaintext. Permintaan yang tidak menemukan hasil dijawab dengan stream **decoy** yang deterministik dan tak terbedakan — bukan `404` — sehingga jalur baca tidak pernah menjadi existence oracle. Semua dekripsi dan verifikasi proof terjadi di klien.
- **Dapat diverifikasi tanpa kepercayaan.** Setiap byte asli tiba dengan sebuah merkle **inclusion proof** yang berakar pada root generation on-chain. Klien melipat proof tersebut hingga ke root dan hanya menerimanya jika cocok dengan root yang dipercayanya. Node tidak pernah dipercaya begitu saja telah mengembalikan byte yang asli.
- **Dapat di-streaming pada ukuran berapa pun.** Konten dibaca dalam chunk yang dibatasi, selaras 64 KiB dengan kelanjutan (continuation) eksplisit. Sebuah resource satu kilobyte dan sebuah capsule seratus megabyte dibaca dengan loop yang sama, dan tidak ada satu pun respons yang tidak dibatasi.

## Bagaimana ini cocok dengan DigStore {#how-it-fits-with-digstore}

DigStore memberi Anda **format**: sebuah store content-addressable dan terenkripsi yang dikompilasi menjadi satu capsule `.wasm` yang mempertahankan dirinya sendiri, dialamatkan oleh sebuah URN di mana *URN itu adalah kuncinya*. dig RPC adalah cara capsule tersebut **disajikan di jaringan** tanpa memercayai host:

1. Anda mengompilasi sebuah store dan menanamkan sebuah generation on-chain (sebuah singleton DataLayer CHIP-0035). **Root konten**-nya adalah trust anchor.
2. Sebuah node meng-host capsule tersebut dan mengekspornya melalui dig RPC.
3. Seorang pembaca menurunkan `retrieval_key = sha256(urn)`, memanggil `dig.getContent`, menyusun ulang ciphertext yang di-streaming, **memverifikasi inclusion proof terhadap root on-chain**, dan **mendekripsi dengan kunci turunan-URN** — sepenuhnya di sisi klien.

Node hanya mempelajari sebuah hash; ia tidak pernah tahu apa yang disajikannya.

## Satu pembacaan dalam satu panggilan {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

Klien melakukan loop pada `next_offset` hingga `complete`, memverifikasi `inclusion_proof` atas byte yang tersusun ulang terhadap `root`, lalu mendekripsi. Hasil dengan `"decoy": true` berarti *tidak ditemukan* — hentikan dan laporkan sebagai demikian.

## Cara membaca dokumen ini {#how-to-read-these-docs}

- **[Metode](./methods.md)** — seluruh kumpulan metode (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), parameter, dan hasilnya.
- **[Menggunakan RPC jaringan publik](./public-network-rpc.md)** — arahkan klien Anda ke `rpc.dig.net` (atau node mana pun), endpoint, dan cara mengoperasikan satu sendiri.
- **[Streaming](./streaming.md)** — model chunk, penyusunan ulang, verifikasi proof, dan sebuah loop klien referensi.
- **[Konformansi](./conformance.md)** — apa yang HARUS diimplementasikan sebuah node agar menjadi anggota jalur baca jaringan, plus CORS, error, dan model blind secara lengkap.

:::note
dig RPC adalah bagian dari [DIG Network](https://dig.net). Spesifikasi normatif lengkapnya ada di bagian [Protocol · The dig RPC](../protocol/dig-rpc.md), antarmuka konten jaringan.
:::

## Terkait {#related}

- [Metode](./methods.md) — setiap metode dig RPC, parameternya, dan hasilnya
- [Streaming](./streaming.md) — model chunk, penyusunan ulang, dan verifikasi proof
- [Konformansi & Keamanan](./conformance.md) — model blind dan apa yang harus diimplementasikan sebuah node
- [URN & Enkripsi](../digstore/format/urns-and-encryption.md) — URN di balik setiap retrieval key
- [Konsep & glosarium](../concepts.md) — dig RPC, capsule, dan retrieval key dijelaskan
