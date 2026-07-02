---
sidebar_position: 1
title: What is DigStore?
description: "Git-आकार का, कंटेंट-एड्रेसेबल प्रोजेक्ट फॉर्मेट जिसमें इनबिल्ट एन्क्रिप्शन और URN-आधारित एड्रेसिंग है; एक सिंगल सेल्फ-डिफेंडिंग WebAssembly मॉड्यूल में कंपाइल होता है।"
keywords:
  - DigStore
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# What is DigStore? {#what-is-digstore}

**DigStore एक Git-आकार का, एन्क्रिप्टेड, कंटेंट-एड्रेसेबल प्रोजेक्ट है जो एक सिंगल सेल्फ-डिफेंडिंग WebAssembly मॉड्यूल में कंपाइल होता है।**

आपको Git-शैली के कमांड्स मिलते हैं — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — एक ऐसे प्रोजेक्ट के लिए जो **रेस्ट में एन्क्रिप्टेड** है और **एक `.wasm` फाइल** में कंपाइल होता है। वह सिंगल फाइल *आपका डेटा भी है और वह सर्वर भी जो उस तक पहुंच को गेट करता है*। कोई host जो इसे स्टोर या रिले करता है उसे केवल hashes द्वारा एड्रेस किया गया ciphertext दिखता है; वह यह नहीं पढ़ सकता कि वह क्या ले जा रहा है।

आप कंटेंट को एक **[URN](./format/urns-and-encryption.md)** से एड्रेस करते हैं, और URN ही *वह* key है: यह लोकेट भी करता है और डिक्रिप्ट भी। किसी को URN दें और वे उस resource को पढ़ सकते हैं; इसके बिना वे नहीं पढ़ सकते — मैनेज करने के लिए कोई अलग पासवर्ड या access list नहीं है।

Git के विपरीत, DigStore **build output** के लिए बनाया गया है, न कि repository source के लिए। आप एक प्रोजेक्ट को `dist/` जैसी डायरेक्टरी पर पॉइंट करते हैं और यह वहां जो है उसे कैप्चर करता है।

## यह क्यों मौजूद है {#why-it-exists}

| समस्या | DigStore का जवाब |
|---|---|
| Hosts वह पढ़ / स्कैन कर सकते हैं जो आप पब्लिश करते हैं | कंटेंट रेस्ट में एन्क्रिप्टेड है; host के पास केवल hashes से keyed ciphertext होता है |
| Access control का मतलब है पासवर्ड्स और ACLs | URN ही *वह* capability है — read देने के लिए इसे शेयर करें, अस्वीकार करने के लिए इसे रोकें |
| असली bytes सर्व करने के लिए आपको सर्वर पर भरोसा करना पड़ता है | `clone`/`pull`, इंस्टॉल करने से पहले मॉड्यूल की store id, पब्लिशर के signed root, और **ऑन-चेन singleton root** को सत्यापित करते हैं — fail closed |
| "यह पेलोड कितना बड़ा है?" फाइल साइज़ से लीक होता है | हर प्रोजेक्ट एक `.wasm` है, जो एक यूनिफॉर्म साइज़ तक पैडेड है जो उसके कंटेंट के बारे में कुछ भी उजागर नहीं करता |
| सर्विंग लॉजिक डेटा से अलग रहता है | डेटा और वह कोड जो उसे गेट करता है, *उसी* मॉड्यूल में कंपाइल होते हैं |

## ये डॉक्स कैसे पढ़ें {#how-to-read-these-docs}

- **[The DigStore Format](./format/overview.md)** — अवधारणाएं: projects, deployments, `.wasm` मॉड्यूल, URNs, encryption, और proofs। यहां से शुरू करें अगर आप समझना चाहते हैं कि DigStore *क्या* है।
- **[CLI Tutorial](./cli/install.md)** — CLI इंस्टॉल करें और इसे एक असली प्रोजेक्ट में उपयोग करें: एक प्रोजेक्ट इनिशियलाइज़ करें, एक बिल्ड डायरेक्टरी कैप्चर करें, डिप्लॉयमेंट्स commit करें, एक remote पर शेयर करें, और कंटेंट को वापस स्ट्रीम करें।

अगर आप बस इसे आज़माना चाहते हैं, सीधे **[Quickstart](../quickstart.md)** (मुफ़्त, वेब-फर्स्ट पथ) या **[CLI tutorial](./cli/quickstart.md)** पर जाएं।

:::note
DigStore, [DIG Network](https://dig.net) का हिस्सा है। पूरा तकनीकी डिज़ाइन [Protocol section](../protocol-deep-dive.md) में है — कंटेंट-एड्रेसेबल WASM store फॉर्मेट।
:::

## संबंधित {#related}

- [The DigStore Format](./format/overview.md) — projects, WASM मॉड्यूल, URNs, encryption, proofs
- [Store structure](./format/store-structure.md) — store पहचान, generations, और compiled मॉड्यूल
- [URNs & Encryption](./format/urns-and-encryption.md) — वह URN जो *एक साथ* एड्रेस भी करता है और डिक्रिप्ट भी
- [CLI tutorial](./cli/quickstart.md) — मिनटों में एक store बनाएं, commit करें, और पढ़ें
- [Concepts & glossary](../concepts.md) — एक नज़र में मुख्य DIG entities
