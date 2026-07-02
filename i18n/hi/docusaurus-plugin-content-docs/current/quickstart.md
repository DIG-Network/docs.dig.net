---
sidebar_position: 2
title: Quickstart
description: "DIG पर अपनी पहली साइट शिप करें — बनाना और प्रीव्यू करना मुफ़्त है, पब्लिश करते समय आप केवल यूनिफॉर्म capsule प्राइस चुकाते हैं। वेब-फर्स्ट पथ (शुरुआत में वॉलेट की ज़रूरत नहीं) साथ ही एक समानांतर CLI ट्रैक।"
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Quickstart {#quickstart}

एक ऐसे नेटवर्क पर साइट शिप करें जिसे कोई भी host पढ़, बदल, या हटा नहीं सकता — लगभग दस मिनट में।

**आप फ्री में बनाते और प्रीव्यू करते हैं।** स्कैफोल्डिंग और प्रीव्यूइंग की कोई कीमत नहीं है; आप **$DIG में यूनिफॉर्म capsule प्राइस** केवल तभी चुकाते हैं जब आप ऑन-चेन एक [capsule](./concepts.md#capsule) पब्लिश करते हैं। *जब तक तैयार न हो, फ्री में इटरेट करें, फिर पब्लिश करें।*

ऐसा करने के दो तरीके हैं। ज़्यादातर लोग वेब से शुरू करते हैं।

- **[A. वेब से पब्लिश करें](#a-publish-from-the-web)** — [DIGHUb](./concepts.md#dighub) में, अंत में एक वॉलेट कनेक्ट करें। साइट्स और फ्रंटएंड्स के लिए सबसे अच्छा। ~10 मिनट।
- **[B. CLI से पब्लिश करें](#b-publish-from-the-cli)** — आपकी मशीन पर `digstore`, स्क्रिप्टेबल और CI-रेडी। डेवलपर्स और ऑटोमेशन के लिए सबसे अच्छा।

---

## A. वेब से पब्लिश करें {#a-publish-from-the-web}

सबसे तेज़ पथ: ब्राउज़र में बनाएं और प्रीव्यू करें, अंतिम स्टेप में ही वॉलेट फंड करें।

### 1. DIGHUb खोलें और एक ड्राफ्ट शुरू करें — मुफ़्त, कोई वॉलेट नहीं {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**DIGHUb में एक नया store शुरू करें ↗**](https://hub.dig.net/new)। अपनी बनी हुई साइट (स्टेटिक फाइलों का एक फोल्डर — आपका `dist/` या `build/`) डालें। DIGHUb आपको बिल्कुल वैसा ही एक **फ्री ड्राफ्ट प्रीव्यू** देता है जैसा यह सर्व करेगा, बिना किसी चीज़ के ऑन-चेन गए और बिना किसी $DIG खर्च किए।

आपको अभी वॉलेट की ज़रूरत नहीं है। ड्राफ्ट पर जितनी बार चाहें इटरेट करें — फिर से अपलोड करें, फिर से प्रीव्यू करें — पूरी तरह मुफ़्त में।

### 2. इसे असली read path पर प्रीव्यू करें — फिर भी मुफ़्त {#2-preview-it-on-the-real-read-path--still-free}

प्रीव्यू आपकी साइट को असली DIG पाइपलाइन (encrypt → compile → verify → decrypt) के ज़रिए रेंडर करता है, इसलिए जो आप देखते हैं वही विज़िटर्स को मिलता है। इधर-उधर क्लिक करें, assets और routing जांचें। जब तक आप न चुनें, कुछ भी पब्लिश नहीं होता और कुछ भी खर्च नहीं होता।

### 3. पब्लिश करें — वॉलेट फंड करें और कनेक्ट करें {#3-publish--fund-and-connect-a-wallet}

जब ड्राफ्ट सही लगे, **Publish** दबाएं। यह एकमात्र स्टेप है जिसकी कोई कीमत है:

- एक Chia वॉलेट कनेक्ट करें (आपका वॉलेट *ही* आपका अकाउंट है — कोई ईमेल नहीं, कोई पासवर्ड नहीं)।
- ऑन-चेन खर्च को अनुमोदित करें: **$DIG में यूनिफॉर्म capsule प्राइस + एक छोटी XCH फीस**, एक ही सिग्नेचर में। पब्लिश स्क्रीन साइन करने से पहले सटीक $DIG राशि दिखाती है।
- DIGHUb आपके store को mint करता है और Chia mainnet पर पहला **capsule** पब्लिश करता है।

DIG कम है? पब्लिश स्क्रीन आपका बैलेंस और कहां टॉप-अप करना है दिखाती है। देखें [Where to get DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space, या 9mm.pro।

### 4. आप लाइव हैं {#4-youre-live}

आपका capsule अब ऑन-चेन एंकर हो चुका है और [dig RPC](./concepts.md#dig-rpc) पर **तुरंत पढ़ने योग्य** है — कोई भी इसे इसके [`urn:dig:` URN](./concepts.md#urn) या [`chia://`](./browser/chia-protocol.md) एड्रेस से fetch और सत्यापित कर सकता है, कोई रजिस्ट्रेशन नहीं और चुकाने के लिए कुछ और नहीं। URN ही एड्रेस *और* key दोनों है; कंटेंट शेयर करने के लिए URN शेयर करें। read path सार्वभौमिक और मुफ़्त है; capsule कन्फर्म होते ही यह लाइव हो जाता है।

**एक मानव-अनुकूल `*.on.dig.net` एड्रेस चाहिए?** यह वैकल्पिक है। एक store को `*.on.dig.net` सबडोमेन तभी मिलता है जब आप DIGHUb में उसके लिए एक **handle रजिस्टर** करते हैं — एक अलग, भुगतान वाला रजिस्ट्रेशन जो store को उस नाम से पिन करता है। जब तक आप एक रजिस्टर नहीं करते, कोई `*.on.dig.net` URL नहीं होता (ऊपर दिया गया URN / `chia://` एड्रेस हमेशा इस तक पहुंचने का कैननिकल तरीका है)। देखें [Can I use my own domain?](./support/faq.md#can-i-use-my-own-domain)।

**बाद में अपडेट शिप करने के लिए:** एडिट करें, नए ड्राफ्ट को मुफ़्त में प्रीव्यू करें, और फिर से Publish करें। हर पब्लिश किया गया अपडेट एक नया capsule है और फिर से **यूनिफॉर्म capsule प्राइस** की कीमत लेता है — आप केवल तभी भुगतान करते हैं जब आप एक ड्राफ्ट को एक स्थायी ऑन-चेन वर्शन में प्रमोट करते हैं।

:::tip इसे ऑटोमेट करें
एक बार आपका store बन जाए, तो [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md) सेट करें ताकि `main` पर हर push एक नया capsule पब्लिश करे — git-push-to-deploy।
:::

---

## B. CLI से पब्लिश करें {#b-publish-from-the-cli}

आपके टर्मिनल से वही फ्लो — स्क्रिप्टेबल और CI का आधार। CLI वेब पथ को दर्शाता है: बनाना और प्रीव्यू करना मुफ़्त है; एक capsule पब्लिश करने की कीमत $DIG में यूनिफॉर्म capsule प्राइस है।

### 1. इंस्टॉल करें {#1-install}

```sh
# download the installer for your OS from the Releases page, then:
digstore --version
```

प्रति-OS इंस्टॉलर्स और सोर्स से बिल्ड के लिए देखें [Installing the CLI](./digstore/cli/install.md)।

### 2. स्कैफोल्ड और प्रीव्यू करें — मुफ़्त, कोई चेन नहीं, कोई खर्च नहीं {#2-scaffold-and-preview--free-no-chain-no-spend}

खर्च करने से पहले एक प्रोजेक्ट स्कैफोल्ड करें और उसे लोकली प्रीव्यू करें — **मुफ़्त, कोई mint नहीं, कोई चेन नहीं**:

```sh
digstore new <template>   # scaffold a wallet-wired project (static · vite-react · next-static · nft-drop · dapp-window-chia) — free, no mint
digstore dev              # watch + compile-on-save + serve the real chia:// read path, with an injected window.chia — free, live-reload
```

`new` एक चलने योग्य प्रोजेक्ट लिखता है (एक `dig.toml` + एक स्टार्टर ऐप); `dev` इसे असली DIG read path (compile → verify → decrypt) पर लाइव रीलोड के साथ सर्व करता है। आप यूनिफॉर्म capsule प्राइस केवल तभी चुकाते हैं जब आप पब्लिश करते हैं (अगले स्टेप्स)। या अपने सामान्य टूलचेन (`npm run build` → `dist/`) से बनाएं और उस आउटपुट को पब्लिश करें।

:::tip npm पसंद है? `create-dig-app` उपयोग करें
अगर आप Node की दुनिया में रहते हैं, तो `npm create dig-app@latest my-app -- --template vite-react` वही templates सीधे npm से स्कैफोल्ड करता है — शुरू करने के लिए किसी `digstore` इंस्टॉल की ज़रूरत नहीं। देखें [Scaffold an app](./build-a-dapp/scaffold.md)।
:::

### 3. एक वॉलेट सेट अप करें (केवल पब्लिश करने के लिए ज़रूरी) {#3-set-up-a-wallet-only-needed-to-publish}

पब्लिश करने में असली फंड खर्च होते हैं, इसलिए आपको पहले एक seed और एक फंडेड वॉलेट चाहिए:

```sh
digstore seed generate      # generate a fresh mnemonic (shown once — back it up)
digstore balance            # show your receive address; fund it with XCH + DIG
```

इम्पोर्ट, फंडिंग, और TTL विवरण के लिए देखें [On-chain anchoring](./digstore/cli/onchain-anchoring.md)।

### 4. अपना पहला capsule पब्लिश करें {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init`, mainnet पर एक Chia singleton mint करता है — **launcher id आपका store id बन जाता है** — और कन्फर्म होने तक ब्लॉक करता है।

### 5. अपडेट्स शिप करें {#5-ship-updates}

```sh
npm run build                      # produce dist/
digstore add -A                    # stage the whole content root
digstore commit -m "v1.1"          # publish a new capsule (uniform capsule price + XCH fee)
```

CI के लिए, एक कमांड add → commit → push करता है और URL प्रिंट करता है:

```sh
digstore deploy --output-dir dist --json   # advance an existing store from CI; never mints
```

देखें [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md)।

### 6. इसे वापस पढ़ें {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # a URN both locates AND decrypts
```

---

## इसकी कीमत क्या है {#what-it-costs}

| आप जो कर रहे हैं | कीमत |
|---|---|
| स्कैफोल्डिंग, बिल्डिंग, ड्राफ्ट प्रीव्यू करना | **मुफ़्त** |
| अपना पहला capsule पब्लिश करना (`init` / DIGHUb Publish) | **$DIG में यूनिफॉर्म capsule प्राइस** + छोटी XCH फीस |
| हर अपडेट पब्लिश करना (`commit` / फिर से Publish) | **$DIG में यूनिफॉर्म capsule प्राइस** + छोटी XCH फीस |

कीमत हर जगह **प्रति capsule यूनिफॉर्म** है — देखें [why the price is uniform](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform)।

## अटके हुए हैं? {#stuck}

- [Troubleshooting](./support/troubleshooting.md) — सामान्य विफलताएं और उनके समाधान।
- [FAQ](./support/faq.md) — त्वरित उत्तर।
- [मदद पाएं](./support/get-help.md) — समुदाय और एक अच्छी रिपोर्ट कैसे फाइल करें।

## संबंधित {#related}

- [Concepts & glossary](./concepts.md) — capsule, store, URN, और DIG payment परिभाषित
- [Scaffold an app (create-dig-app)](./build-a-dapp/scaffold.md) — एक कमांड में एक डिप्लॉय करने योग्य प्रोजेक्ट शुरू करें (npm या CLI)
- [Installing the CLI](./digstore/cli/install.md) — अपनी मशीन पर `digstore` पाएं
- [On-chain anchoring](./digstore/cli/onchain-anchoring.md) — वॉलेट सेटअप, फंडिंग, और लागत
- [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — CI में push-to-publish
- [CLI tutorial](./digstore/cli/quickstart.md) — पूरा create-commit-read walkthrough
