---
sidebar_position: 1
title: Chia üzerinde bir dapp inşa edin
description: "Uçtan uca: bir React uygulaması iskeleleyin, dig-sdk ile sayfa içi Chia cüzdanını (window.chia + WalletConnect geri dönüşü) bağlayın, chip35 wasm'ı üzerinden bir harcama oluşturun ve imzalayın, ardından zincir üzerinde dağıtın ve özel bir alan adı ekleyin — her DIG temel bileşeni tek bir iplikten geçirilir."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digstore deploy
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

# Chia üzerinde bir dapp inşa edin {#build-a-dapp-on-chia}

Her DIG temel bileşeni kendi başına belgelenmiştir — iskeleleme, sayfa içi cüzdan, okuma yolu, harcamalar, dağıtım. **Bu sayfa, onları tek bir yayınlanmış dapp'e bağlayan tek ipliktir.** Boş bir klasörden başlayacak ve kendi alan adınızda, Chia mainnet üzerinde canlı, cüzdan farkındalıklı bir React uygulamasıyla bitireceksiniz.

Yayınlamaya kadar olan tüm döngü **ücretsizdir** — iskeleleme, geliştirme ve önizleme hiçbir şeye mal olmaz. Yalnızca dağıtım adımında **$DIG cinsinden tek tip capsule fiyatını** ödersiniz.

```
new ──▶ dev ──▶ wire wallet (dig-sdk) ──▶ build a spend (chip35) ──▶ deploy ──▶ custom domain
 free    free          free                       free            capsule price    free
```

## İhtiyacınız olanlar {#what-youll-need}

- Kurulu [`digstore` CLI](../digstore/cli/install.md).
- Node 18+ ve `npm`.
- Fonlanmış bir Chia cüzdanı — **yalnızca dağıtım adımında** ($DIG cinsinden tek tip capsule fiyatı + küçük bir XCH ücreti). Ondan öncesi ücretsizdir.

---

## 1. Bir React uygulaması iskeleleyin — ücretsiz, zincir yok {#1-scaffold-a-react-app--free-no-chain}

`digstore new`, çalıştırılabilir, cüzdana bağlı bir proje yazar. React şablonunu seçin:

```sh
digstore new vite-react my-dapp
cd my-dapp
```

Bir Vite + React uygulaması, bir `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`) ve zaten sayfa içi cüzdana bağlanmış bir `App.jsx` alırsınız. Hiçbir store basılmaz ve hiçbir şey harcanmaz — `new` tamamen yereldir.

:::tip npm mi tercih edersiniz? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react`, aynı şablonu doğrudan npm'den iskeleler — JS ön kapısı, başlamak için `digstore` kurulumu gerekmez. Beş şablonun tümü ve iki ön kapının nasıl karşılaştırıldığı için bkz. [Bir uygulama iskeleleyin](./scaffold.md).
:::

## 2. Gerçek okuma yoluna karşı geliştirin — ücretsiz {#2-develop-against-the-real-read-path--free}

```sh
digstore dev
```

`dev`, build'inizi çalıştırır, çıktıyı **gerçek `chia://` okuma yolu** (derle → doğrula → şifre çöz) üzerinden sunar ve gerçek bir cüzdan olmadan cüzdan akışını inşa edebilmeniz için bir **`window.chia` geliştirme şimi (shim)** enjekte eder. `src/App.jsx`'i düzenleyin, kaydedin ve sayfa canlı olarak yeniden yüklenir — sıfır zincir etkileşimi ve sıfır harcamayla ziyaretçilerin tam olarak alacağı şey.

## 3. Cüzdanı SDK ile bağlayın — `window.chia` + WalletConnect geri dönüşü {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

İskele, [DIG Browser](../browser/using-window-chia.md) içinde mükemmel olan `window.chia` ile doğrudan konuşur. Diğer tarayıcılardaki kullanıcıları da desteklemek için SDK'yı ekleyin — **enjekte edilen `window.chia` cüzdanını tercih eder ve WalletConnect → Sage'e geri döner**, tek bir normalleştirilmiş yüzeyin arkasında, böylece cüzdan akışını bir kez yazarsınız.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # optional: only for the WalletConnect fallback
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" prefers the injected DIG Browser wallet, else WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // a PUBLIC build-time value
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // render a QR
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

Tek bir `connect()`, DIG Browser'da (QR yok, röle yok) ve her yerde başka (WalletConnect) çalışır. `provider.backend`, hangi aktarımın bağlandığını size söyler. Metot adları ve sonuç şekilleri her iki durumda da aynıdır — entegrasyon kılavuzu için bkz. [`window.chia` kullanımı](../browser/using-window-chia.md), veya tam metot/parametre/dönüş/hata sözleşmesi için [normatif `window.chia` sağlayıcı şartnamesi](../protocol/window-chia-provider.md).

:::note WalletConnect proje kimliği bir GENEL derleme zamanı değeridir
`VITE_WC_PROJECT_ID` paketinize derlenir ve dünya tarafından okunabilirdir — bu bir WalletConnect bulut kimliği için doğrudur. Pakette bir cüzdan tohumu (seed), dağıtım anahtarı veya herhangi bir sır **asla** koymayın: bir capsule, [sunucu sırları olmayan kör bir statik yapıttır](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Bir harcama oluşturun ve imzalayın — chip35 wasm, SDK üzerinden {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Dapp'iniz zincir üzerinde bir şey yapması gerektiğinde (bir store basma, meta veriyi güncelleme, bir CAT ödemesi oluşturma), harcamayı **kanonik CHIP-0035 harcama oluşturucusuyla** oluşturur ve imzalaması için cüzdana verir. SDK, o oluşturucuyu `/spend` alt yolunda yeniden dışa aktarır — **asla bir harcama demetini elle yazmazsınız**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // the chip35 wasm builder

async function doSpend() {
  spend.init();

  // Build coin spends with the wasm builder, e.g. spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). The builder is
  // offline and pure — no keys, no network.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Hand them to the wallet to sign (the wallet holds the keys, not your dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → combine into a spend bundle and broadcast.
}
```

Bu, hub'ın kullandığı tam kalıptır: **demeti tarayıcıda wasm ile oluşturun, cüzdanla imzalayın.** Harcama oluşturucusu, tüm ekosistem genelinde harcama demetlerinin tek kanonik kaynağıdır, bu yüzden dapp'iniz hub ve CLI ile bayt-özdeş harcamalar üretir.

Doğrulanmış, şifrelenmiş içeriği geri **okumak** için (örn. başka bir store'un verisini dapp'inizin içinde render etmek), SDK'nın `DigClient`'ını kullanın:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

`DigClient`, URN'in anahtarlarını tarayıcıda türetir, zincir üzeri köke karşı dahil etmeyi doğrular ve şifresini çözer — sunum host'u kör kalır. Bkz. [dig RPC nedir?](../rpc/what-is-the-dig-rpc.md).

:::tip Erişim için ücret mi alıyorsunuz? `Paywall` kullanın
Parasallaştırmak için — içeriği öde-ve-aç yapmak veya bir NFT'ye sahip olmaya göre kısıtlamak — SDK, ödemeleri elle bağlamamanız için bağlı bir `ChiaProvider`'ı harcama oluşturucusuyla birleştiren yüksek seviyeli bir **`Paywall`** yardımcısı gönderir: `paywall.requestPayment({ amount, owner })` dapp sahibine öder ve bir makbuz döndürür, `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` ise erişimi kısıtlar.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }
```
:::

## 5. Zincir üzerinde dağıtın {#5-deploy-on-chain}

Ücretsiz inşa eder ve önizlersiniz; bu, harcama yapan tek adımdır. Önce store'u **bir kez** oluşturun:

```sh
digstore init my-dapp --dir dist      # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init`, mainnet üzerinde bir Chia singleton'ı basar — **başlatıcı (launcher) id'si store id'niz olur**. Bunu `dig.toml`'a kopyalayın (`store-id = "<64-hex>"`). O andan itibaren, tek bir komut yeni bir capsule inşa eder ve yayınlar:

```sh
digstore deploy --json                # runs build-command, stages dist/, advances the root
```

Her `deploy`, tek tip capsule fiyatı için yeni, değişmez bir capsule yayınlar. Onaylandığı anda, dapp'iniz kayıt gerekmeden ve ödenecek başka bir şey olmadan, şifrelenmiş, doğrulanmış ve kaldırılması imkansız şekilde, [URN](../concepts.md#urn)'i / `chia://` adresiyle **[dig RPC](../rpc/what-is-the-dig-rpc.md) üzerinden okunabilir** hale gelir. (Dostane bir `*.on.dig.net` web adresi ayrı, isteğe bağlı bir adımdır — bkz. [sonraki bölüm](#6-put-it-on-your-own-domain).) Her commit'te push-ile-dağıtım için [GitHub Actions'tan dağıtım](../digstore/cli/deploy-from-github-actions.md)'ı bağlayın.

## 6. Kendi alan adınıza koyun {#6-put-it-on-your-own-domain}

Store'unuz zaten URN / `dig://` adresiyle erişilebilir durumdadır — ama dostane bir web URL'si için bir ad kaydedersiniz. Bir store, DIGHUb'da onun için bir **handle kaydettiğinizde** — store'u o isme sabitleyen ayrı, ücretli bir kayıt (kayıt yoksa `*.on.dig.net` adresi olmaz) — bir `*.on.dig.net` alt alan adı alır. Onu sahip olduğunuz bir alan adından sunmak için, [DIGHUb ↗](https://hub.dig.net)'da TLS'li bir **özel alan adı** ekleyin — alan adınızı store'a işaret edin ve DIGHUb sertifikayı halleder. Her iki durumda da dapp'iniz, altta tamamen merkeziyetsiz kalırken insan dostu bir URL'den yüklenir.

CHIP-54 `.dig` handle'ları geldiğinde, bir store ayrıca insan tarafından okunabilir bir `.dig` adıyla adreslenebilir olacak; o zamana kadar, DIGHUb üzerinden özel alan adları bir dağıtımı markalama yoludur.

---

## Bir dapp gönderdiniz {#you-shipped-a-dapp}

Boş bir klasörden, kendi alan adınızda Chia mainnet üzerinde canlı, cüzdan farkındalıklı bir React uygulamasına gittiniz — her temel bileşene dokunarak: [iskeleleme](../digstore/cli/quickstart.md), [sayfa içi cüzdan](../browser/using-window-chia.md), [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), [harcama oluşturucusu](https://github.com/DIG-Network/chip35_dl_coin), [okuma yolu](../rpc/what-is-the-dig-rpc.md) ve [dağıtım](../digstore/cli/deploy-from-github-actions.md). [Örnek galerisinden](./example-gallery.md) tamamlanmış bir sürümü klonlayın.

## İlgili {#related}

- [Bir uygulama iskeleleyin (create-dig-app)](./scaffold.md) — beş şablon ve npm ile CLI ön kapıları
- [Örnek galerisi](./example-gallery.md) — tamamlanmış bir dapp'i klonlayın ve bir şablonda açın
- [window.chia kullanımı](../browser/using-window-chia.md) — sayfa içi cüzdan sağlayıcısı tam olarak
- [window.chia sağlayıcı şartnamesi](../protocol/window-chia-provider.md) — normatif, sürümlenmiş sağlayıcı sözleşmesi
- [Proje yapılandırması & derleme zamanı değerleri](../digstore/cli/configuration.md) — dig.toml + GENEL yapılandırma
- [GitHub Actions'tan dağıtım](../digstore/cli/deploy-from-github-actions.md) — CI'da push-ile-dağıtım
- [dig RPC nedir?](../rpc/what-is-the-dig-rpc.md) — doğrulanmış, şifrelenmiş içerik okuma
- [Hızlı başlangıç](../quickstart.md) — daha kısa "bir site gönder" yolu
- [Kavramlar & sözlük](../concepts.md) — capsule, store, URN ve window.chia tanımlanmış
