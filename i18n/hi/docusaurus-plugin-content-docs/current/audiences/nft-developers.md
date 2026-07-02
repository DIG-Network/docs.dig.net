---
sidebar_position: 2
title: For NFT developers
description: "एक पूरा CHIP-0007 collection mint करें जिसकी कला एक टैम्पर-एविडेंट DIG capsule में स्थायी रूप से रहती है — एक एटॉमिक साइन किया गया बंडल, असली रॉयल्टीज़, और ईमानदार ड्रॉप मैकेनिक्स जो कभी वह नकली नहीं दिखाते जो वे अभी तक ऑन-चेन साबित नहीं कर सकते।"
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# For NFT developers {#for-nft-developers}

> **एक पूरा CHIP-0007 collection mint करें जिसकी कला एक टैम्पर-एविडेंट DIG capsule में PERMANENTLY रहती है** — एक एटॉमिक साइन किया गया बंडल, असली रॉयल्टीज़, और ईमानदार ड्रॉप मैकेनिक्स (reveal / allowlist / phases) जो कभी वह नकली नहीं दिखाते जो वे अभी तक ऑन-चेन साबित नहीं कर सकते।

## मेंटल मॉडल {#the-mental-model}

पहले अपनी कला को एक **[DIG capsule](../concepts.md#capsule)** में डालें, फिर ऐसे NFTs mint करें जिनके `data_uris` / `metadata_uris` उस capsule की ओर पॉइंट करें। ऑन-चेन hashes असली bytes को पिन करते हैं — इसलिए कला कंटेंट-एड्रेस्ड, सत्यापन योग्य, और स्थायी है, न कि एक लिंक जो सड़ सकता है या बदला जा सकता है।

Spends **कभी हाथ से नहीं बनाए जाते**: कैननिकल CHIP-0035 wasm builder ([`@dignetwork/dig-sdk/spend`](../sdk.md) के ज़रिए) हर coin spend बनाता है, आपका वॉलेट एक बार साइन करता है, और यह एक बार broadcast होता है।

एक **store mint करना** $DIG से मुफ़्त है — आप **यूनिफॉर्म capsule प्राइस** केवल तभी चुकाते हैं जब एक capsule बनाया जाता है (जब कला को एक capsule में लिखा जाता है)।

## एक mint पेज स्कैफोल्ड करें — `nft-drop` template {#scaffold-a-mint-page--the-nft-drop-template}

एक कमांड में एक वॉलेट-वायर्ड ड्रॉप पेज से शुरू करें:

```sh
digstore new nft-drop
# or
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Scaffold an app](../build-a-dapp/scaffold.md)

## CLI से mint करें {#mint-from-the-cli}

asset CLI, `digstore-chain` builders के ज़रिए spend बनाता है, आपके वॉलेट seed से साइन करता है, और push करता है — सभी `--dry-run` / `--json` CI-safe:

```sh
digstore did create                          # an issuer DID for attribution
digstore collection create --name "My Drop"  # a CHIP-0007 collection
digstore nft mint --data ./art.png --metadata ./meta.json --dry-run
digstore offer make ...                       # XCH / CAT trades
```

`nft mint` का **capsule-media** पथ, कला + CHIP-0007 मेटाडेटा को एक capsule में लिखता है, असली bytes से data/metadata hashes की गणना करता है, और URIs को capsule के `chia://` एड्रेस पर सेट करता है (एक https गेटवे फॉलबैक के साथ)। → [Command reference](../digstore/cli/command-reference.md)

## वेब से mint करें — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

ब्राउज़र में एक capsule-backed collection mint करें: कला अपलोड करें (एक capsule में लिखी गई), रॉयल्टीज़ सेट करें, और attribution के लिए एक DID जोड़ें — अंत में वॉलेट साइन करता है। → [DIGHUb ↗](https://hub.dig.net)

## ड्रॉप्स — reveal, allowlist, phases {#drops--reveal-allowlist-phases}

ड्रॉप मैकेनिक्स को **ईमानदारी से** दिखाया जाता है: आज ऑन-चेन क्या लागू होता है बनाम claim-coin प्रिमिटिव आने तक क्या एक ऑफ-चेन सुविधा है। हम कभी ऐसी गारंटी पेश नहीं करते जिसे हम अभी तक ऑन-चेन साबित नहीं कर सकते।

→ एंड-टू-एंड mint थ्रेड के लिए [Build a dapp on Chia](../build-a-dapp/tutorial.md)।

## SDK से spends बनाएं — कभी हाथ से न बनाएं {#build-spends-with-the-sdk--never-hand-roll}

हर coin spend कैननिकल CHIP-0035 wasm द्वारा बनाया जाता है और `@dignetwork/dig-sdk/spend` पर पुनः-एक्सपोर्ट किया जाता है। फ्लो हमेशा **build → sign → broadcast** है, इस तरह विभाजित कि वॉलेट केवल साइन करे।

→ [Building spends](../spends.md) · [The DIG SDK](../sdk.md)

## मुनाफ़ा कमाएं और गेट करें — Paywall {#monetize--gate--the-paywall}

SDK का `Paywall`, **pay-to-unlock** और **NFT / collection-ownership gating** के लिए प्रोवाइडर को spend builder के साथ compose करता है — बिना spends को हाथ से वायर किए।

→ [The DIG SDK → Paywall](../sdk.md#paywall)

## Offers — make / take / show {#offers--make--take--show}

`digstore offer make | take | show` (हर एक `--dry-run` / `--json`) के साथ NFTs को XCH या CATs के लिए ट्रेड करें। → [Command reference](../digstore/cli/command-reference.md)

---

## गहराई में जाएं: प्रोटोकॉल {#go-deeper-the-protocol}

- **"टैम्पर-एविडेंट capsule"** → [Proofs & security](../digstore/format/proofs-and-security.md) · [The capsule & store model](../digstore/format/store-structure.md)
- **"कभी एक spend हाथ से न बनाएं"** → [CHIP-0035 store-coin spends & delegation](../chip-0035-spends-and-delegation.md)
- **सब कुछ** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
