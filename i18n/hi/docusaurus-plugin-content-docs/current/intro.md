---
sidebar_position: 1
slug: /
title: DIG Network
description: "DigStore (कंटेंट-एड्रेसेबल पब्लिशिंग के लिए), dig RPC (ब्लाइंड होस्टिंग और रिट्रीवल के लिए), और DIG Browser (कंटेंट एक्सेस के लिए) — DIG Network के प्रिमिटिव्स का अवलोकन।"
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - DigStore
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network, Chia पर एक Proof-of-Stake Layer 2 है** — कंटेंट को पब्लिश करने, एड्रेस करने, और होस्ट पर भरोसा किए बिना सर्व करने के लिए एक विकेंद्रीकृत नेटवर्क।

ये डॉक्स नेटवर्क और उसके **प्रिमिटिव्स** को कवर करते हैं: वे कंपोज़ेबल बिल्डिंग ब्लॉक्स जिनका उपयोग डेवलपर्स DIG पर बनाने के लिए करते हैं। नेटवर्क अभी भी विस्तार कर रहा है, और समय के साथ यहाँ और भी प्रिमिटिव्स डॉक्यूमेंट किए जाएंगे।

:::info $DIG नेटवर्क को शक्ति देता है
**$DIG, DIG Network का इंजन और अर्थव्यवस्था है।** हर वैल्यू एक्सचेंज — capsule पब्लिश करना, store का मालिक होना, किसी क्रिएटर को टिप देना — $DIG के माध्यम से प्रवाहित होता है। कंटेंट कंज्यूम करना हमेशा आसान और मुफ़्त रहता है: पढ़ने के लिए आप कभी भुगतान नहीं करते, सिर्फ़ पब्लिश और ओनरशिप के लिए करते हैं।
:::

## capsule {#the-capsule}

हर प्रिमिटिव में एक ही अवधारणा चलती है। एक **capsule** एक अपरिवर्तनीय (immutable) store generation है — जोड़ी `(storeId, rootHash)`, जिसे कैननिकल रूप से `storeId:rootHash` लिखा जाता है। एक **store, capsules का एक क्रम (sequence) है** — प्रति commit एक (हर commit ऑन-चेन root को आगे बढ़ाता है और एक नया capsule बनाता है)।

capsule नेटवर्क की इकाई है:

- **कंपाइलेशन** — प्रत्येक capsule एक फिक्स्ड-साइज़ WASM मॉड्यूल में कंपाइल होता है (पैडेड ताकि उसकी लंबाई कंटेंट के आकार के बारे में कुछ भी न बताए)।
- **प्राइसिंग** — एक **यूनिफॉर्म प्रति-capsule कीमत** (mint या commit), जो लाइव रेट पर $DIG में भुगतान की जाती है; किसी store की लाइफटाइम लागत = यूनिफॉर्म प्रति-capsule कीमत × capsules की संख्या।
- **रिट्रीवल** — एक URN एक capsule (साथ ही उसके भीतर एक वैकल्पिक resource) का नाम रखता है।
- **कैशिंग** — एक host या browser, `storeId:rootHash` से keyed एक capsule को कैश करता है; लोकल कैश, capsules का एक सेट होता है।
- **प्रोवेनेंस** — प्रत्येक capsule के root में पब्लिशर का BLS सिग्नेचर और एक Merkle root होता है।

यह ecosystem-व्यापी परिभाषा है: "capsule = `(storeId, rootHash)`" का मतलब DigStore, dig RPC, और DIG Browser में एक ही है।

:::tip आज़माएं
[**DIGHUb में अपना पहला capsule बनाएं ↗**](https://hub.dig.net/new) — ब्राउज़र में एक साइट पब्लिश करें, किसी CLI की ज़रूरत नहीं। प्रत्येक capsule (mint या commit) की कीमत **$DIG में यूनिफॉर्म capsule प्राइस** है।
:::

## प्रिमिटिव्स {#primitives}

### 🗄️ DigStore {#️-digstore}

पहला और सबसे बुनियादी प्रिमिटिव: एक **कंटेंट-एड्रेसेबल, एन्क्रिप्टेड WASM प्रोजेक्ट फॉर्मेट**। आप इसे एक बिल्ड डायरेक्टरी पर पॉइंट करते हैं, Git की तरह डिप्लॉयमेंट्स को commit करते हैं, और एक सिंगल सेल्फ-डिफेंडिंग `.wasm` फाइल पाते हैं जो आपका डेटा भी है और वह सर्वर भी जो उस तक पहुंच को गेट करता है। URN ही *वह* key है — यह लोकेट भी करता है और डिक्रिप्ट भी।

→ **[DigStore को एक्सप्लोर करें](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[DigStore क्या है?](./digstore/what-is-digstore.md)** | संक्षेप में, वन-फाइल आइडिया |
| **[The Format](./digstore/format/overview.md)** | Projects, deployments, URNs, encryption, proofs |
| **[CLI Tutorial](./digstore/cli/quickstart.md)** | अपने प्रोजेक्ट में `digstore` इंस्टॉल और उपयोग करें |

### 🛰️ dig RPC {#️-dig-rpc}

नेटवर्किंग प्रिमिटिव: होस्टेड DigStore डिप्लॉयमेंट्स से **कंटेंट पढ़ने के लिए एक स्टैंडर्ड इंटरफेस**। HTTPS `POST` पर JSON-RPC 2.0 — हर होस्टिंग नोड इसे समान रूप से बोलता है, इसलिए कंटेंट पोर्टेबल है और क्लाइंट्स नोड-एग्नॉस्टिक हैं। यह retrieval key द्वारा ciphertext + inclusion proofs, `(store_id, root)` द्वारा पूरे डिप्लॉयमेंट्स, और पब्लिक डिस्कवरी मैनिफेस्ट सर्व करता है — chunks में स्ट्रीम किया गया, संरचना से ब्लाइंड, और पूरी तरह क्लाइंट-साइड पर सत्यापित और डिक्रिप्ट किया गया।

→ **[dig RPC को एक्सप्लोर करें](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[dig RPC क्या है?](./rpc/what-is-the-dig-rpc.md)** | पूरे नेटवर्क के read path के लिए एक एंडपॉइंट |
| **[Methods](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | chunk मॉडल, रीअसेंबली, और proof सत्यापन |
| **[Conformance & Security](./rpc/conformance.md)** | ब्लाइंड मॉडल, CORS, और एक नोड को क्या इम्प्लीमेंट करना चाहिए |

### 🌐 DIG Browser {#-dig-browser}

क्लाइंट प्रिमिटिव: एक **इनबिल्ट Chia वॉलेट वाला ब्राउज़र**। यह हर पेज पर एक `window.chia` प्रोवाइडर इंजेक्ट करता है, ताकि कोई भी वेब ऐप बिना किसी WalletConnect सेटअप के उपयोगकर्ता का एड्रेस, सिग्नेचर, और स्पेंड्स रिक्वेस्ट कर सके — उन ऐप्स के लिए एक ड्रॉप-इन विकल्प जो पहले से ही CHIP-0002 बोलते हैं। यह `chia://` कंटेंट एड्रेसेस को सीधे भी रिज़ॉल्व करता है।

→ **[DIG Browser के लिए बनाएं](./browser/using-window-chia.md)**

| | |
|---|---|
| **[अपने ऐप में `window.chia` का उपयोग](./browser/using-window-chia.md)** | इंजेक्टेड वॉलेट का पता लगाएं, कनेक्ट करें, और CHIP-0002 methods कॉल करें |

:::tip आज़माएं
[**DIG Browser पाएं ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — `chia://` कंटेंट खोलने और इनबिल्ट वॉलेट का उपयोग करने के लिए ब्राउज़र डाउनलोड करें।
:::

*अन्य प्रिमिटिव्स — settlement और node operation — जैसे-जैसे तैयार होंगे, अपने खुद के सेक्शन पाएंगे।*

## अपना पथ चुनें {#pick-your-path}

डॉक्स को **आप क्या कर रहे हैं** के इर्द-गिर्द व्यवस्थित किया गया है। हर ट्रैक दस-सेकंड के "क्यों" के साथ शुरू होता है, फिर आपको जो मेंटल मॉडल चाहिए, और हाई-सिग्नल तरीका — फिर जब आप गहराई में जाना चाहें तो प्रोटोकॉल की ओर लिंक करता है।

- **[एक साइट या ऐप पब्लिश करें जो आपकी अपनी है](./audiences/app-developers.md)** — एक वेबसाइट/ऐप को अपनी ऑन-चेन संपत्ति के रूप में शिप करें; फ्री में बनाएं, एक capsule पब्लिश करें।
- **[NFTs और collections mint करें](./audiences/nft-developers.md)** — CHIP-0007 ड्रॉप्स जो स्थायी, टैम्पर-एविडेंट capsules द्वारा समर्थित हैं।
- **[अपने ऐप में DIG को इंटीग्रेट करें](./audiences/integration-developers.md)** — एक टाइप्ड SDK + एक पूरी तरह मशीन-रीडेबल प्लेटफॉर्म।
- **[एक node चलाएं](./run-a-node/index.md)** — प्रमाणित रूप से और प्रोवाइडर-ब्लाइंड कंटेंट सर्व करें।
- **[chia:// कंटेंट खोलें](./audiences/content-consumers.md)** — ऐसा कंटेंट पढ़ें जिसे आपका अपना ब्राउज़र चेन के विरुद्ध सत्यापित करता है।
- **[अटके हुए हैं तो मदद पाएं](./audiences/troubleshooting.md)** — अपनी विफलता को उसके स्थिर कोड से खोजें।

शब्दावली से अपरिचित हैं? [Concepts & glossary](./concepts.md) देखें। पूरा डिज़ाइन चाहिए? [Protocol deep-dive](./protocol-deep-dive.md) पढ़ें।

:::note
DIG Network और उसके प्रिमिटिव्स ओपन सोर्स हैं। DigStore, GPL-2.0 के तहत लाइसेंस प्राप्त है; देखें [digstore repository](https://github.com/DIG-Network/digstore)।
:::

## संबंधित {#related}

- [Quickstart](./quickstart.md) — अपनी पहली साइट शिप करें; बनाना और प्रीव्यू करना मुफ़्त है
- [Build a dapp on Chia](./build-a-dapp/tutorial.md) — एक एंड-टू-एंड ट्यूटोरियल में हर प्रिमिटिव
- [Concepts & glossary](./concepts.md) — मुख्य DIG entities, परिभाषित और लिंक किए गए
- [DigStore क्या है?](./digstore/what-is-digstore.md) — कंटेंट-एड्रेसेबल store फॉर्मेट
- [dig RPC क्या है?](./rpc/what-is-the-dig-rpc.md) — नेटवर्क-व्यापी read इंटरफेस
- [The chia:// protocol](./browser/chia-protocol.md) — DIG Browser में कंटेंट खोलना
- [मदद पाएं](./support/get-help.md) — समुदाय, ट्रबलशूटिंग, और एरर कोड्स
