---
sidebar_position: 1.5
title: Concepts & glossary
description: "Indeks satu halaman untuk entitas inti DIG Network — capsule, store, generation, URN, retrieval key, dig RPC, protokol chia://, dan anchoring on-chain — masing-masing didefinisikan sekali dan tertaut ke dokumen mendalamnya."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts & glossary {#concepts--glossary}

Halaman ini mendefinisikan setiap entitas inti DIG Network **satu kali**, dalam bahasa yang sederhana, dan
menautkan masing-masing ke dokumen yang membahasnya secara mendalam. Ini adalah tulang punggung yang
dapat dibaca manusia dari dokumentasi ini — dan, karena setiap istilah juga dipancarkan sebagai data
terstruktur yang dapat dibaca mesin, ini juga menjadi peta yang dapat dijelajahi agent untuk mempelajari
kosakata jaringan. Simak sekilas untuk berorientasi; ikuti tautan untuk mendalami.

## capsule {#capsule}

**capsule** adalah satu generasi store yang immutable: pasangan `(storeId, rootHash)`, ditulis secara kanonis
sebagai `storeId:rootHash`. Ini adalah unit atomik jaringan — untuk kompilasi (satu modul WASM berukuran
tetap), [penetapan harga](./digstore/cli/onchain-anchoring.md) (harga seragam per capsule untuk mint atau commit, dibayar
dalam $DIG), retrieval (sebuah [URN](#urn) menamai satu capsule), caching, dan provenance. Sebuah [store](#store) adalah *rangkaian
capsule*, satu per commit. Definisi ini identik di seluruh dig-store, dig RPC, dan DIG
Browser. → [capsule, secara lengkap](./intro.md#the-capsule)

## Store {#store}

**store** adalah identitas beserta konten dan riwayatnya: rangkaian [capsule](#capsule), satu per
commit. Identitasnya adalah **store id** 64-hex, yang *merupakan* launcher id singleton Chia on-chain-nya —
singleton chain tersebut adalah otoritas untuk root store saat ini. store adalah padanan DIG untuk sebuah
website. → [Struktur store](./digstore/format/store-structure.md)

## Generation {#generation}

**generation** adalah satu state ter-commit dari sebuah [store](#store), diidentifikasi oleh sebuah **root
hash** (root Merkle atas daun-daun per-resource pada generation tersebut). Setiap `commit` menyegel
konten saat ini menjadi generation baru yang bersifat append-only — hal yang sama yang dinamai oleh sebuah
[capsule](#capsule). generation tumbuh secara monoton, seperti riwayat Git. → [Generation & root hash](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

**URN** adalah alamat *sekaligus* kunci milik dig-store dalam satu string:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. Ia sekaligus **menemukan** sebuah resource dan
**menurunkan kunci yang mendekripsinya** — memiliki URN sudah cukup dan diperlukan untuk membaca resource
publik. Singkatan yang menghadap browser adalah [protokol `chia://`](#chia-protocol). → [URN & Enkripsi](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

**retrieval key** adalah `SHA-256(canonical_urn)` — satu-satunya alamat yang pernah meninggalkan klien. Ia
menemukan ciphertext sebuah resource tanpa mengungkap jalurnya atau [URN](#urn)-nya. Retrieval key ini
bersifat *tidak bergantung pada root*, sehingga kunci yang sama dapat menemukan sebuah resource di seluruh
[generation](#generation); byte yang disajikan kemudian [diverifikasi-Merkle](#merkle-proof) terhadap root
yang benar. **decryption key** yang terpisah diturunkan secara lokal (HKDF) dari URN yang sama dan tidak
pernah dikirim. → [Dua nilai, satu string](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Setiap [generation](#generation) membangun pohon Merkle dengan satu daun per resource, yang berkomitmen pada
byte *ciphertext* persis yang disajikan. Satu **inclusion proof** menyertai setiap resource yang disajikan
dan membuktikan bahwa byte tersebut memang milik root yang tepat itu — sehingga konten diverifikasi tanpa
pernah didekripsi, dan sebuah node tidak pernah dipercaya begitu saja telah mengembalikan byte yang asli. → [Merkle proof](./digstore/format/proofs-and-security.md)

## On-chain anchoring {#anchoring}

Setiap store adalah **singleton di Chia mainnet**. `dig-store init` melakukan mint-nya (launcher id
*menjadi* store id) dan setiap `dig-store commit` menanamkan root [generation](#generation) baru on-chain sebagai
update singleton CHIP-0035. Keduanya menunggu hingga terkonfirmasi dan mengeluarkan dana sungguhan. Chain adalah
otoritas untuk root terbaru sebuah store. → [Anchoring on-chain](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG** adalah token DIG Network (sebuah CAT Chia). Melakukan mint [capsule](#capsule) (`init`) atau melakukan commit
dikenakan **harga seragam per capsule dalam $DIG**, disertakan **secara atomik dalam spend on-chain yang sama** sebagai
anchor — tidak ada transaksi terpisah, dan memo membawa store id. → [Biaya](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store` adalah alat command-line yang membuat, meng-commit, membagikan, dan membaca store — sebuah
alur kerja bergaya Git (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) di atas format
store terenkripsi dan on-chain. → [Referensi perintah](./digstore/cli/command-reference.md) · [Tutorial CLI](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` adalah **manifest proyek yang dapat di-commit** di root sebuah proyek — `store-id`, `output-dir`,
`build-command`, dan konfigurasi proyek lainnya, digunakan bersama oleh `dig-store dev`, `dig-store deploy`, dan
template scaffolding. File ini **tidak menyimpan rahasia** (rahasia berasal dari environment), sehingga aman untuk
di-commit. → [Konfigurasi proyek & nilai build-time](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) adalah **pintu masuk JS** untuk memulai proyek DIG: ia
melakukan scaffold sebuah starter yang siap dijalankan — sebuah aplikasi, sebuah [`dig.toml`](#dig-toml), dan (untuk
template wallet) [DIG SDK](#dig-sdk) yang sudah terhubung — dari salah satu dari lima template (`static`, `vite-react`, `next-static`,
`nft-drop`, `dapp-window-chia`). Scaffolding bersifat **gratis** — tanpa mint, tanpa chain, tanpa biaya; Anda hanya membayar
harga capsule seragam saat menerbitkan sebuah [capsule](#capsule). Ini adalah pendamping sisi-npm untuk CLI Rust,
`dig-store new`. → [Scaffold sebuah aplikasi](./build-a-dapp/scaffold.md)

## GitHub deploy Action {#deploy-action}

`dig-network/deploy-action` adalah GitHub Action **git-push-to-deploy**: ia menginstal
[CLI `dig-store`](#digstore-cli) di runner, menjalankan `dig-store deploy` untuk memajukan store Anda (tidak pernah
melakukan mint), dan melaporkan [capsule](#capsule) yang diterbitkan + URL + biaya kembali sebagai output step, komentar
PR, GitHub Deployment, dan status commit. Dengan `if-changed` (default), build yang identik secara byte adalah
no-op — tanpa biaya. → [Deploy dari GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK** (`@dignetwork/dig-sdk`) adalah paket npm bertipe (typed) untuk integrating developer: sebuah
`ChiaProvider` (mengutamakan [`window.chia`](#window-chia) yang disuntikkan, kembali ke WalletConnect → Sage sebagai fallback),
sebuah `DigClient` (membaca konten terenkripsi yang terverifikasi melalui [dig RPC](#dig-rpc)), sebuah `Paywall`
(helper pay-to-unlock / NFT-gated-access tingkat tinggi yang menggabungkan provider dengan spend
builder), dan spend builder CHIP-0035 kanonis yang diekspor ulang di subpath `/spend`.
→ [Bangun dapp di Chia](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC** adalah antarmuka baca yang berlaku di seluruh jaringan: sebuah layanan JSON-RPC 2.0 melalui HTTPS `POST` yang
diucapkan secara identik oleh setiap node hosting. Ia menyajikan ciphertext + [inclusion proof](#merkle-proof) berdasarkan
[retrieval key](#retrieval-key), seluruh [capsule](#capsule) berdasarkan `(storeId, root)`, dan metadata discovery
— blind secara konstruksi, diverifikasi dan didekripsi di sisi klien. **Ini adalah jalur baca
universal**: setiap capsule yang diterbitkan dapat dibaca di sini lewat alamat [URN](#urn) / [`chia://`](#chia-protocol)-nya begitu
terkonfirmasi on-chain — tanpa registrasi dan tanpa pembayaran di luar menerbitkan capsule tersebut. [handle `*.on.dig.net`](#on-dig-net)
yang opsional dan ramah manusia adalah pintu depan *di atas* ini; dig RPC
itu sendiri selalu tersedia. → [Apa itu dig RPC?](./rpc/what-is-the-dig-rpc.md)

## Protokol chia:// {#chia-protocol}

`chia://` adalah skema alamat konten native milik DIG Browser — bagian depan yang dapat diketik dari
[URN `urn:dig:`](#urn). Tempel tautan `chia://<storeId>/` dan browser mengambil konten langsung
dari jaringan, content-addressed dan diverifikasi secara kriptografis. → [Protokol chia://](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` adalah provider wallet Chia yang disuntikkan **DIG Browser** ke setiap halaman. Ia berbicara
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), sehingga sebuah aplikasi web dapat
meminta alamat, tanda tangan, dan spend milik pengguna tanpa perlu setup WalletConnect — alternatif
drop-in untuk aplikasi yang sudah berbicara CHIP-0002. → [Menggunakan window.chia](./browser/using-window-chia.md)
· [Spesifikasi provider window.chia](./protocol/window-chia-provider.md) (normatif, ber-versi)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) adalah aplikasi web untuk menerbitkan dan mengelola
[capsule](#capsule) tanpa CLI — buat sebuah capsule, deploy sebuah frontend, dan lihat store Anda di
browser. Ia juga merupakan control plane yang dikendalikan aksesnya (gated) yang mengalokasikan anggaran untuk job ZK execution-proof yang mahal.

## dig-node {#dig-node}

**dig-node** adalah **server** konten jaringan — sisi penyedia (supply side). Ia meng-host [capsule](#capsule), menyimpan
cache `.dig` lokal, dan berbicara [dig RPC](#dig-rpc) secara identik dengan `rpc.dig.net`. Anda **tidak** memerlukan
satu pun untuk membaca konten DIG (konsumen kembali ke `rpc.dig.net` sebagai fallback); menjalankan satu membuat pembacaan menjadi lokal-terlebih-dahulu dan
menyumbang kapasitas penyajian. Host bersifat **blind** — ia hanya pernah merelai ciphertext + proof.
→ [Jalankan sebuah node](./run-a-node/index.md)

## handle on.dig.net {#on-dig-net}

**handle on.dig.net** adalah alamat web yang ramah manusia yang bersifat *opsional dan berbayar* untuk sebuah [store](#store):
`<nama-anda>.on.dig.net`. Sebuah store **tidak** mendapatkannya secara otomatis — Anda mendaftarkan handle tersebut (sebuah
registrasi CHIP-54 / `on.dig.net` berbayar di [DIGHUb](#dighub)) dan registrasi tersebut mengikat store
ke nama itu. Tanpa registrasi berarti tidak ada alamat `*.on.dig.net`. Ini murni pintu depan untuk kenyamanan:
store tersebut sudah dapat dibaca melalui [dig RPC](#dig-rpc) lewat alamat [URN](#urn) / [`chia://`](#chia-protocol)-nya
terlepas dari ada atau tidaknya sebuah handle. (Handle akun dan slug store adalah namespace terpisah dan tidak
secara otomatis memunculkan subdomain.) → [Bisakah saya mendapatkan alamat `*.on.dig.net`?](./support/faq.md#can-i-use-my-own-domain)

## Terkait {#related}

- [Ringkasan DIG Network](./intro.md) — primitif-primitifnya sekilas
- [Quickstart](./quickstart.md) — build dan preview gratis, terbitkan sebuah capsule di akhir
- [Bangun dapp di Chia](./build-a-dapp/tutorial.md) — setiap primitif dirangkai menjadi satu dapp yang diterbitkan
- [Apa itu dig-store?](./digstore/what-is-digstore.md) — format store satu-file
- [Apa itu dig RPC?](./rpc/what-is-the-dig-rpc.md) — jalur baca jaringan
- [Protokol chia://](./browser/chia-protocol.md) — mengalamatkan konten di browser
- [Dapatkan bantuan](./support/get-help.md) — kanal komunitas dan cara melapor

## Untuk agent & LLM {#for-agents--llms}

Dokumen ini dapat diekstraksi mesin. Setiap halaman membawa schema.org JSON-LD (halaman ini sebagai
kumpulan `DefinedTerm`), dan dua peta yang dikurasi berada di root situs:

- [`/llms.txt`](pathname:///llms.txt) — peta markdown kaya tautan dari dokumentasi ([konvensi llms.txt](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — entitas (konsep + dokumen) dan edge bertipe (`defines`, `part-of`, `requires`, `see-also`).
