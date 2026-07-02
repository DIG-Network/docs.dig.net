---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "Setiap kegagalan memberi Anda sebuah kode stabil dan sebuah request-id yang langsung terhubung ke log server, spend on-chain dijaga terhadap race-condition sehingga Anda tak pernah membayar dua kali, dan pemeriksaan pre-flight yang jelas mencegah capsule sia-sia sebelum Anda mengeluarkan $DIG."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Troubleshooting {#troubleshooting}

> Setiap kegagalan memberi Anda sebuah **kode stabil** dan sebuah **request-id** yang langsung terhubung ke log server, spend on-chain **dijaga terhadap race-condition** sehingga Anda tak pernah membayar dua kali, dan pemeriksaan **pre-flight** yang jelas mencegah capsule sia-sia sebelum Anda mengeluarkan $DIG.

## Model mental — temukan kegagalan Anda lewat kodenya {#the-mental-model--find-your-failure-by-its-code}

Setiap permukaan — dig RPC, CLI digstore, DIGHUb, loader `chia://`, SDK — memetakan sebuah kegagalan ke satu **kode STABIL**. **Bercabang pada kodenya, jangan pernah pada pesannya.** Satu katalog konsolidasi mencakup semuanya dan juga diterbitkan dalam bentuk machine-readable.

Pemeriksaan pre-flight (`digstore doctor`, `--dry-run`, `--if-changed`) dan anchor yang dapat dilanjutkan (resumable) berarti sebuah publish yang macet atau no-op **tidak pernah diam-diam mengeluarkan biaya**.

## Kegagalan publish yang umum {#common-publishing-failures}

Dana tidak cukup, timeout konfirmasi (dapat dilanjutkan — spend Anda tidak hilang), dan "root remote telah maju" yang non-fast-forward.

→ [Troubleshooting](../support/troubleshooting.md)

## Kegagalan baca & verifikasi {#read--verify-failures}

Ketidakcocokan proof, error dekripsi/salt, dan respons not-found / decoy.

→ [Kegagalan baca & verifikasi](../support/troubleshooting.md#verification-failed)

## Masalah wallet & sesi {#wallet--session-issues}

Koneksi, re-autentikasi, permintaan yang ditolak, dan sesi watch-only yang tidak bisa menandatangani.

→ [Sesi wallet tidak bisa menandatangani](../support/troubleshooting.md#wallet-session)

## Pemeriksaan pre-flight & biaya — jangan sia-siakan sebuah capsule {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (lingkungan + kesiapan), `--dry-run` (preview biaya dan capsule yang akan dihasilkan), dan `--if-changed` (build yang identik secara byte adalah no-op).

→ [Deploy dari GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [Anchoring on-chain → biaya & keamanan](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Referensi kode error {#error-codes-reference}

Kode exit CLI · RPC `-32xxx` · DIGHUb · dig-loader · SDK — satu tabel konsolidasi.

→ [Kode error](../support/error-codes.md)

## FAQ {#faq}

Biaya, uji coba gratis, alasan harga bersifat seragam, cara mendapatkan $DIG, dan "apakah ada testnet?".

→ [FAQ](../support/faq.md)

## Dapatkan bantuan {#get-help}

Discord + GitHub, dan cara melaporkan masalah dengan baik — **jangan pernah menempel rahasia**.

→ [Dapatkan bantuan](../support/get-help.md)

## Status & changelog {#status--changelog}

→ [Status](../support/status.md) · [Changelog](../support/changelog.md)

---

## Mendalami lebih jauh: protokolnya {#go-deeper-the-protocol}

- **kegagalan baca & verifikasi** → [Proof & keamanan](../digstore/format/proofs-and-security.md) · [URN & enkripsi](../digstore/format/urns-and-encryption.md)
- **kode RPC `-32xxx`** → [metode dig RPC](../rpc/methods.md) · [Konformansi](../rpc/conformance.md)
- **Semuanya** → [Pembahasan mendalam protokol](../protocol-deep-dive.md) · [Konsep & glosarium](../concepts.md)
