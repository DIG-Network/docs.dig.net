---
sidebar_position: 1
title: For app developers
description: "एक वेबसाइट या ऐप शिप करें जिसे आप सच में ओन करते हैं — ऑन-चेन आपकी अपनी संपत्ति के रूप में mint किया गया, किराए पर नहीं। मुफ़्त में बनाएं और प्रीव्यू करें; पब्लिश करते समय ही एक छोटी यूनिफॉर्म $DIG कीमत चुकाएं, फाइलें आपके ब्राउज़र में एन्क्रिप्टेड होती हैं ताकि कोई host उन्हें पढ़ न सके।"
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# For app developers {#for-app-developers}

> **एक वेबसाइट या ऐप शिप करें जिसे आप सच में OWN करते हैं** — ऑन-चेन आपकी अपनी संपत्ति के रूप में mint किया गया, किराए पर नहीं। मुफ़्त में बनाएं और प्रीव्यू करें; पब्लिश करते समय ही एक छोटी **यूनिफॉर्म $DIG कीमत** चुकाएं, फाइलें **आपके ब्राउज़र में एन्क्रिप्टेड** होती हैं ताकि कोई host उन्हें पढ़ न सके।

## मेंटल मॉडल {#the-mental-model}

एक **[store](../concepts.md#store)** आपकी वेबसाइट की स्थायी पहचान है — एक ऑन-चेन singleton जिसे आप नियंत्रित करते हैं। हर बार जब आप पब्लिश करते हैं, आप एक अपरिवर्तनीय **[capsule](../concepts.md#capsule)** = `storeId:rootHash` mint करते हैं। एक store बस समय के साथ आपके पब्लिश किए गए capsules का क्रम है।

दो front doors उसी फ्री-बिल्ड → पेड-पब्लिश लूप की ओर ले जाते हैं:

- **वेब पथ** — [hub.dig.net](https://hub.dig.net) पर [DIGHUb](../concepts.md#dighub): एक बनाया गया फोल्डर डालें, मुफ़्त में प्रीव्यू करें, केवल Publish पर वॉलेट कनेक्ट करें।
- **CLI / CI पथ** — [`dig-store`](../concepts.md#digstore-cli) CLI + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub deploy Action](../concepts.md#deploy-action)।

स्कैफोल्ड, बिल्ड, और प्रीव्यू करने की कोई कीमत **नहीं** है। आप केवल तभी भुगतान करते हैं जब आप एक capsule पब्लिश करते हैं।

| आप जो कर रहे हैं | कीमत |
|---|---|
| स्कैफोल्डिंग, बिल्डिंग, ड्राफ्ट प्रीव्यू करना | **मुफ़्त** |
| अपना पहला capsule पब्लिश करना (एक store mint करना) | **$DIG में यूनिफॉर्म capsule प्राइस** + छोटी XCH फीस |
| हर अपडेट पब्लिश करना (एक नया capsule) | **$DIG में यूनिफॉर्म capsule प्राइस** + छोटी XCH फीस |

## यहां से शुरू करें {#start-here}

- **[Quickstart — 10 मिनट में एक साइट शिप करें](../quickstart.md)** — सबसे तेज़ पथ, वेब या CLI।

## वेब से पब्लिश करें — DIGHUb {#publish-from-the-web--dighub}

[**DIGHUb में एक नया store शुरू करें ↗**](https://hub.dig.net/new)। अपनी बनी हुई साइट (आपका `dist/` या `build/` फोल्डर) डालें, असली read path पर एक **फ्री ड्राफ्ट प्रीव्यू** पाएं, और केवल **Publish** स्टेप पर वॉलेट कनेक्ट करें। वेब walkthrough देखें [Quickstart → Publish from the web](../quickstart.md#a-publish-from-the-web) में।

## CLI से पब्लिश करें — dig-store {#publish-from-the-cli--digstore}

Git-आकार का लूप: `new` → `dev` → `init` → `commit`।

```sh
digs new vite-react   # scaffold a runnable project — free, no mint
digs dev              # preview on the real chia:// read path, live-reload — free
digs init site --dir dist   # mint the store's first capsule (uniform price + XCH fee)
digs commit -m "v1.1"       # publish an update — a new capsule
```

→ [CLI quickstart](../digstore/cli/quickstart.md) · [The full project workflow](../digstore/cli/project-workflow.md)

## एक ऐप स्कैफोल्ड करें — 5 templates {#scaffold-an-app--5-templates}

एक चलने योग्य, वॉलेट-वायर्ड स्टार्टर से शुरू करें — `static`, `vite-react`, `next-static`, `nft-drop`, या `dapp-window-chia` — `digs new <template>` या `npm create dig-app` के ज़रिए।

→ [Scaffold an app](../build-a-dapp/scaffold.md)

## `digs dev` से मुफ़्त में प्रीव्यू करें {#preview-free-with-digstore-dev}

`digs dev`, आपके प्रोजेक्ट को **असली** DIG read path (encrypt → compile → verify → decrypt) पर लाइव रीलोड और एक इंजेक्टेड dev `window.chia` के साथ सर्व करता है। जो आप देखते हैं वही विज़िटर्स को मिलता है — और कुछ भी mint या खर्च नहीं होता।

→ [CLI quickstart → develop & preview](../digstore/cli/quickstart.md)

## `dig.toml` — committable मैनिफेस्ट {#digtoml--the-committable-manifest}

आपके प्रोजेक्ट रूट पर `dig.toml`, `store-id`, `output-dir`, `build-command`, `remote`, और अन्य कॉन्फ़िग रखता है — जो `digs dev`, `digs deploy`, और स्कैफोल्ड templates द्वारा साझा किया जाता है। इसमें **कोई सीक्रेट नहीं** है (वे environment से आते हैं), इसलिए इसे commit करें।

→ [Project config & build-time values](../digstore/cli/configuration.md)

## अपडेट्स और वर्जन्स — हर पब्लिश एक नया capsule है {#updates--versions--each-publish-is-a-new-capsule}

हर पब्लिश, वर्तमान बिल्ड को एक **नए अपरिवर्तनीय capsule** में सील करता है और आपके store के ऑन-चेन root को आगे बढ़ाता है। पुराने capsules पढ़ने योग्य रहते हैं; store हमेशा अपने नवीनतम पर resolve होता है जब तक कोई पाठक किसी विशिष्ट `rootHash` को पिन न करे।

→ [On-chain anchoring](../digstore/cli/onchain-anchoring.md)

## इसकी कीमत क्या है {#what-it-costs}

बनाना और प्रीव्यू करना मुफ़्त है; प्रति पब्लिश किए गए capsule पर **$DIG में एक यूनिफॉर्म कीमत**, साथ ही एक छोटी XCH नेटवर्क फीस — उसी ऑन-चेन खर्च में **एटॉमिक रूप से** शामिल। कीमत डिज़ाइन के अनुसार प्रति capsule यूनिफॉर्म है (ताकि capsule की लंबाई आपके कंटेंट के बारे में कुछ भी उजागर न करे)। TibetSwap, dexie.space, या 9mm.pro पर $DIG पाएं।

→ [Where to get DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Why is every capsule the same price?](../support/faq.md#why-uniform-price)

## GitHub Actions से Push-to-deploy {#push-to-deploy-from-github-actions}

`dig-network/deploy-action` सेट करें ताकि हर push एक नया capsule पब्लिश करे — एक `if-changed` गार्ड के साथ जो एक byte-identical बिल्ड को no-op बनाता है (कोई खर्च नहीं)।

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## एक `*.on.dig.net` वेब एड्रेस जोड़ें (वैकल्पिक) {#add-a-ondignet-web-address-optional}

आपका store अपने [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) एड्रेस से कन्फर्म होते ही पहुंच योग्य है — कोई अतिरिक्त कीमत नहीं। एक मानव-अनुकूल `<name>.on.dig.net` handle, DIGHUb में उसके ऊपर एक **वैकल्पिक, भुगतान वाला** रजिस्ट्रेशन है।

→ [Can I use my own domain?](../support/faq.md#can-i-use-my-own-domain)

---

## गहराई में जाएं: प्रोटोकॉल {#go-deeper-the-protocol}

ऊपर दिया गया सरल-भाषा मॉडल शिप करने के लिए काफी है। जब आप पूरा डिज़ाइन चाहें:

- **"एक store, capsules का एक क्रम है"** → [Concepts & glossary](../concepts.md#capsule) · [The capsule & store model](../digstore/format/store-structure.md)
- **"फाइलें आपके ब्राउज़र में एन्क्रिप्टेड"** → [URNs & encryption](../digstore/format/urns-and-encryption.md)
- **"एक यूनिफॉर्म कीमत + एटॉमिक $DIG खर्च"** → [On-chain anchoring](../digstore/cli/onchain-anchoring.md#costs) · [CHIP-0035 store-coin spends](../chip-0035-spends-and-delegation.md)
- **सब कुछ** → [Protocol deep-dive](../protocol-deep-dive.md)
