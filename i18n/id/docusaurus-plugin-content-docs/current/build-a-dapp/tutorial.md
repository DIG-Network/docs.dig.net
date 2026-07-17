---
sidebar_position: 1
title: Build a dapp on Chia
description: "End-to-end: scaffold aplikasi React, hubungkan wallet Chia dalam-halaman (window.chia + fallback WalletConnect) dengan dig-sdk, bangun dan tandatangani sebuah spend melalui wasm chip35, lalu deploy on-chain dan tambahkan domain kustom — satu alur melalui setiap primitif DIG."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digs deploy
  - custom domain
tags:
  - digstore-cli
  - window-chia
  - dig-rpc
  - chip-0035
  - dighub
  - capsule
  - anchoring
---

# Build a dapp on Chia {#build-a-dapp-on-chia}

Setiap primitif DIG didokumentasikan secara terpisah — scaffolding, wallet dalam-halaman, jalur baca, spend, deploy. **Halaman ini adalah satu alur tunggal yang merangkai semuanya menjadi satu dapp yang diterbitkan.** Anda akan mulai dari folder kosong dan berakhir dengan aplikasi React yang wallet-aware, live on-chain di domain Anda sendiri.

Seluruh loop hingga penerbitan bersifat **gratis** — scaffold, develop, dan preview tidak dikenakan biaya apa pun. Anda hanya membayar **harga capsule seragam dalam $DIG** pada langkah deploy.

```
new ──▶ dev ──▶ hubungkan wallet (dig-sdk) ──▶ bangun spend (chip35) ──▶ deploy ──▶ domain kustom
 gratis   gratis          gratis                       gratis            harga capsule    gratis
```

## Yang Anda perlukan {#what-youll-need}

- [CLI `dig-store`](../digstore/cli/install.md) terinstal.
- Node 18+ dan `npm`.
- Sebuah wallet Chia yang terdanai — **hanya pada langkah deploy** (harga capsule seragam dalam $DIG + fee XCH kecil). Semua sebelum itu gratis.

---

## 1. Scaffold aplikasi React — gratis, tanpa chain {#1-scaffold-a-react-app--free-no-chain}

`digs new` menulis sebuah proyek yang dapat langsung dijalankan dan sudah terhubung wallet. Pilih template React-nya:

```sh
digs new vite-react my-dapp
cd my-dapp
```

Anda mendapatkan aplikasi Vite + React, sebuah `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`), dan sebuah `App.jsx` yang sudah terhubung ke wallet dalam-halaman. Tidak ada store yang di-mint dan tidak ada yang dikeluarkan — `new` murni bersifat lokal.

:::tip Lebih suka npm? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` melakukan scaffold template yang sama langsung dari npm — pintu depan JS, tidak perlu instal `dig-store` untuk memulai. Lihat [Scaffold sebuah aplikasi](./scaffold.md) untuk kelima template dan perbandingan kedua pintu depannya.
:::

## 2. Develop terhadap jalur baca yang sesungguhnya — gratis {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev` menjalankan build Anda, menyajikan hasilnya melalui **jalur baca `chia://` yang sesungguhnya** (kompilasi → verifikasi → dekripsi), dan menyuntikkan sebuah **shim dev `window.chia`** sehingga Anda dapat membangun alur wallet tanpa wallet sungguhan. Edit `src/App.jsx`, simpan, dan halaman melakukan live-reload — persis seperti yang akan didapat pengunjung, dengan nol interaksi chain dan nol biaya.

## 3. Hubungkan wallet dengan SDK — `window.chia` + fallback WalletConnect {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

Scaffold berbicara langsung ke `window.chia`, yang sempurna di dalam [DIG Browser](../browser/using-window-chia.md). Untuk juga mendukung pengguna di browser lain, tambahkan SDK — SDK ini **mengutamakan wallet `window.chia` yang disuntikkan dan kembali ke WalletConnect → Sage sebagai fallback** di balik satu permukaan yang dinormalisasi, sehingga Anda menulis alur wallet hanya sekali.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # opsional: hanya untuk fallback WalletConnect
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" mengutamakan wallet DIG Browser yang disuntikkan, jika tidak ada WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // sebuah nilai build-time yang PUBLIK
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // render sebuah QR
      },
    });
    setAddress(await provider.getAddress());
  }

  return (
    <main>
      <h1>My DIG dapp</h1>
      <button onClick={login}>Connect wallet</button>
      {address && <p>Connected: {address}</p>}
    </main>
  );
}
```

Satu `connect()` bekerja di DIG Browser (tanpa QR, tanpa relay) dan di mana pun lainnya (WalletConnect). `provider.backend` memberi tahu Anda transport mana yang terhubung. Nama metode dan bentuk hasilnya identik pada keduanya — lihat [Menggunakan `window.chia`](../browser/using-window-chia.md) untuk panduan integrasinya, atau [spesifikasi provider `window.chia` normatif](../protocol/window-chia-provider.md) untuk kontrak metode/parameter/return/error yang persis.

:::note Project id WalletConnect adalah nilai build-time yang PUBLIK
`VITE_WC_PROJECT_ID` dikompilasi ke dalam bundle Anda dan dapat dibaca siapa pun — itu benar untuk sebuah id cloud WalletConnect. **Jangan pernah** meletakkan seed wallet, deploy key, atau rahasia apa pun di dalam bundle: sebuah capsule adalah [artefak statis blind tanpa rahasia server](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Bangun dan tandatangani sebuah spend — wasm chip35, melalui SDK {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Ketika dapp Anda perlu melakukan sesuatu on-chain (mint sebuah store, update metadata, membangun pembayaran CAT), ia membangun spend tersebut dengan **spend builder CHIP-0035 kanonis** dan menyerahkannya ke wallet untuk ditandatangani. SDK mengekspor ulang builder tersebut di subpath `/spend` — Anda **tidak pernah merakit sendiri sebuah spend bundle**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // builder wasm chip35

async function doSpend() {
  spend.init();

  // Bangun spend coin dengan wasm builder, misalnya spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). Builder-nya
  // offline dan murni — tanpa kunci, tanpa jaringan.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Serahkan ke wallet untuk ditandatangani (wallet memegang kunci, bukan dapp Anda).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → gabungkan menjadi sebuah spend bundle dan lakukan broadcast.
}
```

Ini adalah pola yang persis sama yang digunakan hub: **bangun bundle-nya dalam-browser dengan wasm, tandatangani dengan wallet.** Spend builder adalah satu-satunya sumber kanonis spend bundle di seluruh ekosistem, sehingga dapp Anda menghasilkan spend yang identik secara byte dengan hub dan CLI.

Untuk **membaca** konten terenkripsi yang terverifikasi kembali (mis. merender data store lain di dalam dapp Anda), gunakan `DigClient` milik SDK:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // default ke https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // trust anchor, dibaca dari chain
});
```

`DigClient` menurunkan kunci-kunci URN di browser, memverifikasi inclusion terhadap root on-chain, dan mendekripsi — host yang menyajikan tetap blind. Lihat [Apa itu dig RPC?](../rpc/what-is-the-dig-rpc.md).

:::tip Mengenakan biaya untuk akses? Gunakan `Paywall`
Untuk memonetisasi — pay-to-unlock konten, atau membatasi akses berdasarkan kepemilikan NFT — SDK menyediakan helper **`Paywall`** tingkat tinggi yang menggabungkan `ChiaProvider` yang terhubung dengan spend builder sehingga Anda tidak perlu menghubungkan pembayaran secara manual: `paywall.requestPayment({ amount, owner })` membayar pemilik dapp dan mengembalikan sebuah tanda terima (receipt), dan `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` membatasi akses.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* buka kunci kontennya */ }
```
:::

## 5. Deploy on-chain {#5-deploy-on-chain}

Anda build dan preview secara gratis; ini satu-satunya langkah yang mengeluarkan biaya. Pertama buat store-nya **sekali**:

```sh
digs init my-dapp --dir dist      # mint capsule pertama store (harga capsule seragam + fee XCH)
```

`init` melakukan mint singleton Chia di mainnet — **launcher id menjadi store id Anda**. Salin ke `dig.toml` (`store-id = "<64-hex>"`). Sejak saat itu, satu perintah membangun dan menerbitkan capsule baru:

```sh
digs deploy --json                # menjalankan build-command, staging dist/, memajukan root
```

Setiap `deploy` menerbitkan capsule immutable baru dengan harga capsule seragam. Begitu terkonfirmasi, dapp Anda **dapat dibaca melalui [dig RPC](../rpc/what-is-the-dig-rpc.md)** lewat alamat [URN](../concepts.md#urn) / `chia://`-nya — terenkripsi, terverifikasi, dan mustahil untuk diturunkan, tanpa registrasi dan tanpa biaya tambahan apa pun. (Alamat web `*.on.dig.net` yang ramah adalah langkah terpisah dan opsional — lihat [bagian berikutnya](#6-put-it-on-your-own-domain).) Untuk push-to-deploy pada setiap commit, siapkan [Deploy dari GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## 6. Letakkan di domain Anda sendiri {#6-put-it-on-your-own-domain}

Store Anda sudah dapat dijangkau lewat alamat URN / `chia://`-nya — tetapi untuk URL web yang ramah Anda mendaftarkan sebuah nama. Sebuah store mendapatkan subdomain `*.on.dig.net` ketika Anda **mendaftarkan sebuah handle** untuknya di DIGHUb: sebuah registrasi berbayar terpisah yang mengikat store ke nama tersebut (tanpa registrasi → tanpa alamat `*.on.dig.net`). Untuk menyajikannya dari domain yang Anda miliki sendiri, tambahkan **domain kustom dengan TLS di [DIGHUb ↗](https://hub.dig.net)** — arahkan domain Anda ke store dan DIGHUb yang mengurus sertifikatnya. Baik satu maupun lainnya, dapp Anda dimuat dari URL yang ramah manusia sambil tetap sepenuhnya terdesentralisasi di baliknya.

Ketika handle CHIP-54 `.dig` hadir, sebuah store juga akan dapat dialamatkan dengan nama `.dig` yang mudah dibaca manusia; sampai saat itu, domain kustom melalui DIGHUb adalah cara untuk mem-branding sebuah deployment.

---

## Anda telah menerbitkan sebuah dapp {#you-shipped-a-dapp}

Anda telah berjalan dari folder kosong hingga aplikasi React yang wallet-aware, live di Chia mainnet di domain Anda sendiri — menyentuh setiap primitif: [scaffolding](../digstore/cli/quickstart.md), [wallet dalam-halaman](../browser/using-window-chia.md), [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), [spend builder](https://github.com/DIG-Network/chip35_dl_coin), [jalur baca](../rpc/what-is-the-dig-rpc.md), dan [deploy](../digstore/cli/deploy-from-github-actions.md). Clone versi jadi dari [galeri contoh](./example-gallery.md).

## Terkait {#related}

- [Scaffold sebuah aplikasi (create-dig-app)](./scaffold.md) — kelima template dan pintu depan npm vs CLI
- [Galeri contoh](./example-gallery.md) — clone sebuah dapp jadi dan buka di sebuah template
- [Menggunakan window.chia](../browser/using-window-chia.md) — provider wallet dalam-halaman secara lengkap
- [Spesifikasi provider window.chia](../protocol/window-chia-provider.md) — kontrak provider normatif dan ber-versi
- [Konfigurasi proyek & nilai build-time](../digstore/cli/configuration.md) — dig.toml + konfigurasi PUBLIK
- [Deploy dari GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-deploy di CI
- [Apa itu dig RPC?](../rpc/what-is-the-dig-rpc.md) — membaca konten terenkripsi yang terverifikasi
- [Quickstart](../quickstart.md) — jalur "terbitkan situs" yang lebih singkat
- [Konsep & glosarium](../concepts.md) — capsule, store, URN, dan window.chia dijelaskan
