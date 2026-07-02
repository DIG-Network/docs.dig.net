---
sidebar_position: 3
title: For integration developers
description: "Platform yang sepenuhnya machine-readable — OpenAPI/OpenRPC, taksonomi error yang dikatalogkan, penetapan harga live, JWKS, JSON per-halaman, dan @dignetwork/dig-sdk yang bertipe — sehingga Anda menghubungkan wallet + pembacaan terverifikasi ke aplikasi Anda tanpa perlu meng-scrape satu baris pun prosa manusia."
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# For integration developers {#for-integration-developers}

> **Platform yang sepenuhnya machine-readable** — OpenAPI/OpenRPC, taksonomi error yang dikatalogkan, penetapan harga live, JWKS, JSON per-halaman, dan `@dignetwork/dig-sdk` yang bertipe — sehingga Anda menghubungkan wallet + pembacaan terverifikasi ke aplikasi Anda **tanpa perlu meng-scrape satu baris pun prosa manusia**.

## Model mental — dua permukaan, dijaga terpisah {#the-mental-model--two-surfaces-kept-separate}

1. **Sebuah REST control plane** — `hub.dig.net/v1`, bearer-JWT — untuk mengelola store, domain, tim, dan NFT.
2. **Sebuah jalur BACA dig JSON-RPC 2.0 yang node-agnostic** — `rpc.dig.net` — yang men-streaming **ciphertext terverifikasi**.

Satu permukaan **wallet** ([`window.chia` CHIP-0002](../concepts.md#window-chia)) melalui dua transport — disuntikkan (DIG Browser) atau WalletConnect → Sage — disatukan oleh `ChiaProvider` milik SDK. Spend selalu dibangun oleh wasm CHIP-0035 kanonis dan ditandatangani oleh wallet pengguna — **tidak pernah dirakit sendiri (hand-rolled)**. Bercabang pada **kode error yang stabil**, tidak pernah pada prosa.

## Bangun sebuah dapp — end-to-end {#build-a-dapp--end-to-end}

Satu alur tunggal dari scaffold hingga aplikasi yang wallet-aware, live di domain Anda sendiri.

→ [Bangun dapp di Chia](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, dan spend kanonis yang diekspor ulang di subpath `/spend`. Instalasi, subpath, dan `capabilities()`.

→ [DIG SDK](../sdk.md)

## Hubungkan sebuah wallet — `window.chia` {#connect-a-wallet--windowchia}

Deteksi provider yang disuntikkan, panggil `connect()` (persetujuan per-origin), dan gunakan metode CHIP-0002.

→ [Menggunakan window.chia](../browser/using-window-chia.md) · spesifikasi: [provider window.chia](../protocol/window-chia-provider.md)

## Baca konten terverifikasi — `DigClient` + metode dig RPC {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` men-streaming ciphertext + inclusion proof dan **memverifikasi-lalu-mendekripsi** di sisi klien. Panggil metodenya langsung ketika Anda memerlukannya.

→ [Apa itu dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Metode](../rpc/methods.md)

## Streaming & penyusunan ulang {#streaming--reassembly}

Model chunk, [retrieval key](../concepts.md#retrieval-key), dan urutan verifikasi-lalu-dekripsi.

→ [Streaming](../rpc/streaming.md)

## Membangun spend — builder CHIP-0035 kanonis {#building-spends--the-canonical-chip-0035-builder}

Pemisahan **build → sign → broadcast**: wasm membangun spend bundle, wallet menandatangani, Anda melakukan broadcast. Hub tidak pernah merakit sendiri sebuah spend, begitu pula seharusnya Anda.

→ [Membangun spend](../spends.md)

## Control plane `/v1` hub {#the-hub-v1-control-plane}

Autentikasi (JWT / OIDC / device pairing), store, domain, analitik, dan webhook melalui REST.

→ [Permukaan machine-readable](../machine-surfaces.md#openapi) untuk dokumen OpenAPI-nya.

## Deploy CI — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Mode, OIDC tanpa kunci (keyless), enum outcome, dan output `--json` untuk step selanjutnya.

→ [Deploy dari GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Permukaan machine-readable {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — temukan dan integrasikan tanpa perlu meng-scrape prosa.

→ [Permukaan machine-readable](../machine-surfaces.md)

## Kode error — bercabang pada kodenya {#error-codes--branch-on-the-code}

Satu referensi konsolidasi di seluruh dig RPC, CLI, DIGHUb, dig loader, dan SDK.

→ [Kode error](../support/error-codes.md)

---

## Mendalami lebih jauh: protokolnya {#go-deeper-the-protocol}

- **"pembacaan terverifikasi"** → [dig RPC (Network Content Interface)](../rpc/what-is-the-dig-rpc.md) · [Inclusion vs execution proof](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [spesifikasi provider normatif](../protocol/window-chia-provider.md)
- **"retrieval_key & streaming"** → [URN & enkripsi](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **"deploy token adalah writer key yang dapat dicabut"** → [Spend & delegasi CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Semuanya** → [Pembahasan mendalam protokol](../protocol-deep-dive.md) · [Konsep & glosarium](../concepts.md)
