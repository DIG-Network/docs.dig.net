---
sidebar_position: 1
title: Build a dapp on Chia
description: "एंड-टू-एंड: एक React ऐप स्कैफोल्ड करें, dig-sdk के साथ इन-पेज Chia वॉलेट (window.chia + WalletConnect फॉलबैक) वायर करें, chip35 wasm के ज़रिए एक spend बनाएं और साइन करें, फिर ऑन-चेन डिप्लॉय करें और एक कस्टम डोमेन जोड़ें — हर DIG प्रिमिटिव से गुज़रने वाला एक थ्रेड।"
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

हर DIG प्रिमिटिव अपने आप में डॉक्यूमेंट किया गया है — स्कैफोल्डिंग, इन-पेज वॉलेट, read path, spends, deploy। **यह पेज वह सिंगल थ्रेड है जो उन्हें एक शिप किए गए dapp में एक साथ बांधता है।** आप एक खाली फोल्डर से शुरू करेंगे और एक वॉलेट-अवेयर React ऐप के साथ खत्म करेंगे, जो Chia mainnet पर आपके अपने डोमेन पर लाइव है।

पब्लिश करने तक का पूरा लूप **मुफ़्त** है — स्कैफोल्ड, डेवलप, और प्रीव्यू करने की कोई कीमत नहीं है। आप deploy स्टेप पर ही **$DIG में यूनिफॉर्म capsule प्राइस** चुकाते हैं।

```
new ──▶ dev ──▶ wire wallet (dig-sdk) ──▶ build a spend (chip35) ──▶ deploy ──▶ custom domain
 free    free          free                       free            capsule price    free
```

## आपको क्या चाहिए {#what-youll-need}

- [`dig-store` CLI](../digstore/cli/install.md) इंस्टॉल किया हुआ।
- Node 18+ और `npm`।
- एक फंडेड Chia वॉलेट — **केवल deploy स्टेप पर** ($DIG में यूनिफॉर्म capsule प्राइस + एक छोटी XCH फीस)। इससे पहले सब कुछ मुफ़्त है।

---

## 1. एक React ऐप स्कैफोल्ड करें — मुफ़्त, कोई चेन नहीं {#1-scaffold-a-react-app--free-no-chain}

`digs new` एक चलने योग्य, वॉलेट-वायर्ड प्रोजेक्ट लिखता है। React template चुनें:

```sh
digs new vite-react my-dapp
cd my-dapp
```

आपको एक Vite + React ऐप, एक `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`), और एक `App.jsx` मिलता है जो पहले से ही इन-पेज वॉलेट से वायर्ड है। कोई store mint नहीं होता और कुछ भी खर्च नहीं होता — `new` पूरी तरह लोकल है।

:::tip npm पसंद है? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` वही template सीधे npm से स्कैफोल्ड करता है — JS front door, शुरू करने के लिए किसी `dig-store` इंस्टॉल की ज़रूरत नहीं। सभी पांच templates और दोनों front doors की तुलना के लिए देखें [Scaffold an app](./scaffold.md)।
:::

## 2. असली read path के विरुद्ध डेवलप करें — मुफ़्त {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev` आपका बिल्ड चलाता है, आउटपुट को **असली `chia://` read path** (compile → verify → decrypt) पर सर्व करता है, और एक **`window.chia` dev shim** इंजेक्ट करता है ताकि आप बिना किसी असली वॉलेट के वॉलेट फ्लो बना सकें। `src/App.jsx` एडिट करें, सेव करें, और पेज लाइव-रीलोड होता है — बिल्कुल वही जो विज़िटर्स को मिलेगा, बिना किसी चेन इंटरैक्शन और बिना किसी खर्च के।

## 3. SDK से वॉलेट वायर करें — `window.chia` + WalletConnect फॉलबैक {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

स्कैफोल्ड सीधे `window.chia` से बात करता है, जो [DIG Browser](../browser/using-window-chia.md) के अंदर बिल्कुल सही है। अन्य ब्राउज़र्स पर भी उपयोगकर्ताओं को सपोर्ट करने के लिए, SDK जोड़ें — यह **इंजेक्टेड `window.chia` वॉलेट को प्राथमिकता देता है और WalletConnect → Sage पर फॉलबैक करता है** एक normalized सतह के पीछे, ताकि आप वॉलेट फ्लो एक बार लिखें।

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

एक `connect()`, DIG Browser में काम करता है (कोई QR नहीं, कोई relay नहीं) और बाकी हर जगह भी (WalletConnect)। `provider.backend` आपको बताता है कि कौन सा transport कनेक्ट हुआ। method के नाम और result आकार दोनों ही तरह से एक जैसे हैं — पूरी इंटीग्रेशन गाइड के लिए देखें [Using `window.chia`](../browser/using-window-chia.md), या सटीक method/param/return/error कॉन्ट्रैक्ट के लिए [the normative `window.chia` provider spec](../protocol/window-chia-provider.md)।

:::note WalletConnect प्रोजेक्ट id एक PUBLIC build-time value है
`VITE_WC_PROJECT_ID` आपके बंडल में कंपाइल होता है और world-readable है — यह एक WalletConnect cloud id के लिए सही है। बंडल में **कभी** एक वॉलेट seed, deploy key, या कोई सीक्रेट न डालें: एक capsule [कोई सर्वर सीक्रेट न रखने वाला एक ब्लाइंड स्टेटिक आर्टिफैक्ट](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule) है।
:::

## 4. एक spend बनाएं और साइन करें — chip35 wasm, SDK के ज़रिए {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

जब आपके dapp को ऑन-चेन कुछ करने की ज़रूरत हो (एक store mint करना, मेटाडेटा अपडेट करना, एक CAT payment बनाना), यह **कैननिकल CHIP-0035 spend builder** से spend बनाता है और वॉलेट को साइन करने के लिए देता है। SDK उस builder को `/spend` सबपाथ पर पुनः-एक्सपोर्ट करता है — आप **कभी एक spend bundle हाथ से नहीं बनाते**।

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

यह बिल्कुल वही पैटर्न है जो hub उपयोग करता है: **बंडल को wasm के साथ ब्राउज़र में बनाएं, इसे वॉलेट से साइन करें।** spend builder पूरे ecosystem में spend bundles का एकमात्र कैननिकल सोर्स है, इसलिए आपका dapp hub और CLI के बराबर byte-identical spends बनाता है।

सत्यापित, एन्क्रिप्टेड कंटेंट को वापस **पढ़ने** के लिए (जैसे, अपने dapp के अंदर किसी अन्य store का डेटा रेंडर करना), SDK के `DigClient` का उपयोग करें:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

`DigClient`, URN की keys को ब्राउज़र में derive करता है, ऑन-चेन root के विरुद्ध inclusion सत्यापित करता है, और डिक्रिप्ट करता है — सर्विंग host ब्लाइंड रहता है। देखें [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md)।

:::tip एक्सेस के लिए चार्ज कर रहे हैं? `Paywall` उपयोग करें
मुनाफ़ा कमाने के लिए — कंटेंट को pay-to-unlock करना, या इसे एक NFT के स्वामित्व पर गेट करना — SDK एक हाई-लेवल **`Paywall`** हेल्पर शिप करता है जो एक कनेक्टेड `ChiaProvider` को spend builder के साथ compose करता है ताकि आप भुगतान हाथ से वायर न करें: `paywall.requestPayment({ amount, owner })`, dapp के मालिक को भुगतान करता है और एक रसीद लौटाता है, और `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` एक्सेस गेट करते हैं।

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }
```
:::

## 5. ऑन-चेन डिप्लॉय करें {#5-deploy-on-chain}

आप मुफ़्त में बनाते और प्रीव्यू करते हैं; यह इकलौता स्टेप है जो खर्च करता है। पहले store **एक बार** बनाएं:

```sh
digs init my-dapp --dir dist      # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init`, mainnet पर एक Chia singleton mint करता है — **launcher id आपका store id बन जाता है**। इसे अपने `dig.toml` (`store-id = "<64-hex>"`) में कॉपी करें। उसके बाद, एक कमांड एक नया capsule बनाता और पब्लिश करता है:

```sh
digs deploy --json                # runs build-command, stages dist/, advances the root
```

हर `deploy`, यूनिफॉर्म capsule प्राइस के लिए एक नया अपरिवर्तनीय capsule पब्लिश करता है। कन्फर्म होते ही, आपका dapp अपने [URN](../concepts.md#urn) / `chia://` एड्रेस से [dig RPC](../rpc/what-is-the-dig-rpc.md) पर **पढ़ने योग्य** है — एन्क्रिप्टेड, सत्यापित, और हटाना असंभव, कोई रजिस्ट्रेशन नहीं और चुकाने के लिए कुछ और नहीं। (एक फ्रेंडली `*.on.dig.net` वेब एड्रेस एक अलग, वैकल्पिक स्टेप है — देखें [अगला सेक्शन](#6-put-it-on-your-own-domain))। हर commit पर push-to-deploy के लिए, [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) सेट करें।

## 6. इसे अपने डोमेन पर डालें {#6-put-it-on-your-own-domain}

आपका store पहले से ही अपने URN / `dig://` एड्रेस से पहुंच योग्य है — लेकिन एक फ्रेंडली वेब URL के लिए आप एक नाम रजिस्टर करते हैं। एक store को `*.on.dig.net` सबडोमेन तब मिलता है जब आप DIGHUb में इसके लिए एक **handle रजिस्टर** करते हैं: एक अलग, भुगतान वाला रजिस्ट्रेशन जो store को उस नाम से पिन करता है (कोई रजिस्ट्रेशन नहीं → कोई `*.on.dig.net` एड्रेस नहीं)। इसके बजाय इसे अपने खुद के डोमेन से सर्व करने के लिए, [DIGHUb ↗](https://hub.dig.net) में TLS के साथ एक **कस्टम डोमेन** जोड़ें — अपने डोमेन को store पर पॉइंट करें और DIGHUb सर्टिफिकेट संभालता है। किसी भी तरह से आपका dapp एक मानव-अनुकूल URL से लोड होता है जबकि नीचे पूरी तरह विकेंद्रीकृत रहता है।

जब CHIP-54 `.dig` handles आएंगे, एक store एक मानव-पठनीय `.dig` नाम से भी एड्रेस करने योग्य होगा; तब तक, DIGHUb के ज़रिए कस्टम डोमेन्स एक डिप्लॉयमेंट को ब्रांड करने का तरीका हैं।

---

## आपने एक dapp शिप किया {#you-shipped-a-dapp}

आप एक खाली फोल्डर से शुरू होकर Chia mainnet पर अपने खुद के डोमेन पर लाइव एक वॉलेट-अवेयर React ऐप तक पहुंचे — हर प्रिमिटिव को छूते हुए: [स्कैफोल्डिंग](../digstore/cli/quickstart.md), [इन-पेज वॉलेट](../browser/using-window-chia.md), [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), [spend builder](https://github.com/DIG-Network/chip35_dl_coin), [read path](../rpc/what-is-the-dig-rpc.md), और [deploy](../digstore/cli/deploy-from-github-actions.md)। [example gallery](./example-gallery.md) से एक पूरा वर्जन क्लोन करें।

## संबंधित {#related}

- [Scaffold an app (create-dig-app)](./scaffold.md) — पांच templates और npm बनाम CLI front doors
- [Example gallery](./example-gallery.md) — एक पूरा dapp क्लोन करें और उसे एक template में खोलें
- [Using window.chia](../browser/using-window-chia.md) — इन-पेज वॉलेट प्रोवाइडर पूरी तरह
- [The window.chia provider spec](../protocol/window-chia-provider.md) — नॉर्मेटिव, वर्जन्ड प्रोवाइडर कॉन्ट्रैक्ट
- [Project config & build-time values](../digstore/cli/configuration.md) — dig.toml + PUBLIC कॉन्फ़िग
- [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — CI में push-to-deploy
- [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) — सत्यापित, एन्क्रिप्टेड कंटेंट पढ़ना
- [Quickstart](../quickstart.md) — छोटा "ship a site" पथ
- [Concepts & glossary](../concepts.md) — capsule, store, URN, और window.chia परिभाषित
