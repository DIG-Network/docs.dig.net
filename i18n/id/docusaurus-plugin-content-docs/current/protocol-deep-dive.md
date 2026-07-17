---
sidebar_position: 1
title: "Protocol: Overview"
description: "DIG Protocol sebagai tujuh lapisan bottom-up, normatif dan implementation-defined. capsule (storeId:rootHash) adalah unit fundamentalnya; host bersifat blind dan pembaca melakukan verifikasi terhadap chain. Ini adalah referensi protokol yang otoritatif."
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protocol: Overview {#protocol-overview}

Ini adalah **spesifikasi normatif** dari DIG Protocol, didefinisikan sebagai **tujuh lapisan, dari bawah ke atas**. Setiap lapisan menyebutkan **crate/file kanonisnya** sebagai referensi normatif.

:::info Ini adalah referensi protokol yang otoritatif
Bagian ini adalah sumber kebenaran untuk apa yang dilakukan jaringan. Ia mendokumentasikan protokol sebagaimana ia benar-benar berjalan, dengan sitasi `file:line` ke implementasi kanonisnya.
:::

## Unit fundamental: capsule {#the-fundamental-unit-the-capsule}

Satu konsep mengalir melalui setiap lapisan: **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, secara kanonis `storeId:rootHash`. Sebuah **store** adalah rangkaian capsule yang berurutan (paling lama→paling baru), satu per commit; identitasnya `store_id` *merupakan* launcher id singleton DataLayer CHIP-0035 di Chia. Identitas, kompilasi, penetapan harga, retrieval, caching, dan provenance semuanya didefinisikan **per capsule**.

## Tesis: host blind, verifikasi sisi-klien, root tertanam-chain {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Host blind.** Sebuah host hanya memegang ciphertext buram berkunci hash. Ia tidak memegang URN maupun kunci, merelai output capsule itu sendiri secara verbatim, dan tidak dapat membedakan hit dari miss. Tidak ada field `decoy` di wire dan tidak ada CDN — konten hanya disajikan melalui [dig RPC](./protocol/dig-rpc.md).
- **Verifikasi sisi-klien.** Setiap byte diperiksa di perangkat pembaca terhadap sebuah root on-chain dengan sebuah merkle inclusion proof per-resource, lalu didekripsi secara terautentikasi. Kepercayaan tidak pernah bertumpu pada origin penyaji.
- **Root tertanam-chain.** Root yang dipercaya berasal **hanya** dari singleton CHIP-0035 di Chia (diresolusi melalui coinset.org), tidak pernah dari "latest" yang disajikan.

## Tujuh lapisan {#the-seven-layers}

| # | Lapisan | Yang didefinisikan | Referensi kanonis |
|---|---|---|---|
| 0 | [Identity & naming](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN & addressing](./protocol/urn-and-addressing.md) | Tata bahasa `urn:dig:chia:…`; `retrieval_key` tanpa root | `digstore-core::urn`, `lib.rs` |
| 1 | [Cryptography](./protocol/cryptography.md) | KDF HKDF; seal AES-256-GCM-SIV | `digstore-core::crypto` |
| 1 | [Merkle inclusion proofs](./protocol/merkle-proofs.md) | Daun per-resource D5; fold NODE_TAG | `digstore-core::merkle` |
| 1 | [BLS signatures & DSTs](./protocol/bls-signatures.md) | AugScheme Chia; lima DST peran | `digstore-crypto::bls` |
| 2 | [Capsule format](./protocol/capsule-format.md) | Bagian data DIGS (BINDING D1) | `digstore-core::datasection` |
| 2 | [The self-defending module](./protocol/self-defending-module.md) | Obfuskasi ukuran-tetap; guest penyaji | `digstore-compiler`, `digstore-guest` |
| 4 | [On-chain anchoring](./protocol/on-chain-anchoring.md) | store = singleton; capsule = pemajuan root | `chip35_dl_coin`, `digstore-chain` |
| 4 | [DIG CAT payment & pricing](./protocol/dig-cat-payment.md) | Per capsule, dinamis, dipatok-USD | `chip35_dl_coin::dig` |
| 6 | [The dig RPC](./protocol/dig-rpc.md) | Antarmuka mesin (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [§21 transport & push](./protocol/transport-and-push.md) | Locator `dig://`, REST, push v1 | `digstore-remote` |
| 7 | [DIG Node peer network](./protocol/peer-network.md) | Identitas peer mTLS, NAT traversal, STUN, introducer, wire relay, RPC peer | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Verification & provenance](./protocol/verification-and-provenance.md) | Empat gerbang integritas berurutan | `digstore-core::merkle`, `dig-node` |
| 6 | [The blind host model](./protocol/blind-host-model.md) | Provider-blindness; resolver; control plane `/v1` | hub `retrieval`/`resolver`/`api` |
| — | [Conformance & parity](./protocol/conformance-and-parity.md) | Disiplin paritas lintas-implementasi | golden yang dibekukan, diff OpenRPC |

(Lapisan 3 dan §21 transport saling bertautan dengan jalur baca; tabel mengelompokkannya di titik seorang pembaca menemuinya. Penomoran lapisan lengkap diberikan di setiap halaman.)

## Bagaimana sebuah capsule mengalir melalui lapisan-lapisan {#how-a-capsule-flows-through-the-layers}

Seorang penerbit **melakukan chunking + enkripsi** (L1) konten menjadi sebuah **format capsule** (L2) yang **menyajikan dirinya sendiri** (L3), **menanamkannya** on-chain (L4), dan **mendorongnya (push)** melalui §21 transport (L5). Klien mana pun **membacanya** melalui dig RPC dan **memverifikasinya** terhadap root tertanam-chain sepenuhnya di sisi klien (L6). Setiap konstanta kriptografis memiliki **satu** definisi yang dibagikan di antara producer, host, dan verifier — [invarian paritas C8](./protocol/conformance-and-parity.md).

## Terminologi {#terminology}

- **`chia://`** — alamat **konten** jaringan (yang dibuka oleh sebuah browser).
- **`dig://`** — locator **transport** §21 (bidang CLI/peer) *dan* skema halaman internal DIG Browser — dua penggunaan yang berbeda, tidak pernah menjadi alamat konten.
- **`urn:dig:`** — namespace URN yang menjadi asal keduanya.
- **store / capsule** — identitas dan generation-nya yang immutable.
- **$DIG** — CAT yang dibayarkan per capsule; **dig-store** — format store-nya.

## Terkait {#related}

- [Konsep & glosarium](./concepts.md) — setiap entitas didefinisikan sekali
- [Identity & naming](./protocol/identity-and-naming.md) — Lapisan 0, tempat spesifikasi dimulai
- [The dig RPC](./protocol/dig-rpc.md) — antarmuka mesin protokolnya
- [DIG Node peer network](./protocol/peer-network.md) — bagaimana node saling menemukan + menjangkau (mTLS, NAT traversal, relay)
- [Conformance & parity](./protocol/conformance-and-parity.md) — disiplin paritas lintas-implementasi
