---
sidebar_position: 5
title: For content consumers
description: "chia:// कंटेंट खोलें जिसे आपका अपना ब्राउज़र ब्लॉकचेन के विरुद्ध सत्यापित करता है — कोई host इसे बदल या नकली नहीं बना सकता, प्राइवेट कंटेंट host से प्राइवेट रहता है, और यह स्थायी और कहीं भी दोबारा-होस्ट करने योग्य है, इसलिए कोई इसे हटा या आपको लॉक-इन नहीं कर सकता।"
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# For content consumers {#for-content-consumers}

> **`chia://` कंटेंट खोलें जिसे आपका OWN ब्राउज़र ब्लॉकचेन के विरुद्ध सत्यापित करता है** — कोई host इसे बदल या नकली नहीं बना सकता, प्राइवेट कंटेंट host से प्राइवेट रहता है, और यह स्थायी और कहीं भी दोबारा-होस्ट करने योग्य है, इसलिए कोई इसे हटा या आपको लॉक-इन नहीं कर सकता।

## मेंटल मॉडल {#the-mental-model}

एक `chia://` लिंक पेस्ट करें और कंटेंट सीधे नेटवर्क से आता है — **कंटेंट-एड्रेस्ड** और रेंडर होने से पहले **आपके डिवाइस पर क्रिप्टोग्राफिक रूप से सत्यापित**। यह **fail-closed** है: छेड़छाड़ की गई या डिक्रिप्ट न हो सकने वाली bytes कभी नहीं दिखाई जातीं।

- स्टोर के *नवीनतम* वर्जन के लिए **`rootHash` छोड़ें**: `chia://<storeId>/`।
- एक बिल्कुल exact अपरिवर्तनीय [capsule](../concepts.md#capsule) पिन करने के लिए **इसे शामिल करें**: `chia://<storeId>:<rootHash>/`।

पब्लिक कंटेंट के लिए केवल लिंक चाहिए। प्राइवेट कंटेंट के लिए एक सीक्रेट **`?salt=`** भी चाहिए — एक पासवर्ड की तरह।

## DIG Browser पाएं, या extension {#get-the-dig-browser-or-the-extension}

- **[DIG Browser पाएं ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — एक ऐसा ब्राउज़र जिसमें `chia://` और एक इनबिल्ट वॉलेट बेक्ड इन है।
- Chrome / Edge / Brave / Firefox के लिए **extension** — जो ब्राउज़र आप पहले से उपयोग करते हैं उसमें `chia://` रिज़ॉल्यूशन जोड़ता है।

## `chia://` कंटेंट खोलें — नवीनतम बनाम पिन किया गया {#open-chia-content--latest-vs-pinned}

एड्रेस फॉर्म्स, साफ़ `chia://<store>/` बार, और एक `rootHash` कब पिन करें।

→ [The chia:// protocol](../browser/chia-protocol.md)

## इनबिल्ट पेजेस, वेरिफाइड बैज, और शील्ड्स {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, और वेरिफाइड बैज / शील्ड्स जो सक्रिय capsule के लिए हर resource का inclusion-proof वर्डिक्ट दिखाते हैं।

→ [Using window.chia](../browser/using-window-chia.md)

## पब्लिक बनाम प्राइवेट — आपको `?salt=` सीक्रेट कब चाहिए {#public-vs-private--when-you-need-a-salt-secret}

पब्लिक stores केवल लिंक से खुलते हैं; प्राइवेट stores को उस सीक्रेट salt की ज़रूरत होती है जो decryption key derive करता है।

→ [Public vs private stores](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Public vs private — what's the difference?](../support/faq.md#public-vs-private)

## कंटेंट को लोकली चलाएं (वैकल्पिक) {#run-content-locally-optional}

तेज़, ऑफ़लाइन-फ्रेंडली reads के लिए अपने ब्राउज़र/extension को एक लोकल [dig-node](../concepts.md#dig-node) पर पॉइंट करें — वे एक `.dig` कैश शेयर करते हैं। कंटेंट पढ़ने के लिए आपको कभी एक node की *ज़रूरत* नहीं है।

→ [Run a node](../run-a-node/index.md)

## $DIG पाएं {#get-dig}

कंटेंट *पढ़ने* के लिए आपको $DIG की ज़रूरत नहीं है। अगर आप पब्लिश करना चाहते हैं, तो $DIG **TibetSwap**, **dexie.space**, या **9mm.pro** पर पाएं।

→ [Where do I get DIG?](../support/faq.md#where-do-i-get-dig)

---

## गहराई में जाएं: प्रोटोकॉल {#go-deeper-the-protocol}

- **"ब्लॉकचेन के विरुद्ध सत्यापित"** → [On-chain anchoring](../digstore/cli/onchain-anchoring.md) · [Proofs & security](../digstore/format/proofs-and-security.md)
- **"पब्लिक बनाम प्राइवेट salt"** → [URNs & encryption](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"नवीनतम बनाम पिन किया गया"** → [Generations & root hashes](../digstore/format/store-structure.md#generations-and-root-hashes)
- **सब कुछ** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
