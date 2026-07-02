---
sidebar_position: 1
title: What is the dig RPC?
description: "JSON-RPC 2.0 के ज़रिए DigStore capsules के लिए नेटवर्क-व्यापी read इंटरफेस; संरचना से ब्लाइंड, बिना भरोसे के सत्यापन योग्य, और किसी भी साइज़ पर स्ट्रीम करने योग्य।"
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# What is the dig RPC? {#what-is-the-dig-rpc}

:::info Normative spec
यह ओरिएंटेशन पेज है। अथॉरिटेटिव मशीन-इंटरफेस स्पेक — methods, chunk wire object, node profile, और OpenRPC डॉक्यूमेंट्स — [Protocol · The dig RPC](../protocol/dig-rpc.md) में है।
:::

**dig RPC, होस्टेड DigStore `.dig` capsules से सीधे कंटेंट पढ़ने के लिए नेटवर्क-व्यापी इंटरफेस है।** यह HTTPS `POST` पर बोली जाने वाली एक [JSON-RPC 2.0](https://www.jsonrpc.org/specification) सर्विस है।

हर node जो capsules होस्ट करता है — `https://rpc.dig.net` पर संदर्भ node, या कोई भी थर्ड-पार्टी node — **समान semantics के साथ समान methods** एक्सपोज़ करता है। इस इंटरफेस के विरुद्ध लिखा गया एक क्लाइंट एक एंडपॉइंट के ज़रिए पूरे नेटवर्क से पढ़ता है। कोई CDN नहीं है; DIG पर सारी कंटेंट सर्विंग dig RPC के ज़रिए होती है।

यह तीन चीज़ें सर्व करता है:

| आपके पास... | आप कॉल करते हैं... | आपको वापस मिलता है... |
|---|---|---|
| किसी resource की **retrieval key** (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | resource का ciphertext + एक merkle inclusion proof (और ZK execution proof), chunks में स्ट्रीम किया गया |
| एक **store id + generation root** | [`dig.getCapsule`](./methods.md#diggetcapsule) | उस generation के लिए पूरा `.dig` capsule, chunks में स्ट्रीम किया गया |
| एक **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | पब्लिक डिस्कवरी मैनिफेस्ट / store मेटाडेटा मैनिफेस्ट / store की confirmed generation सूची |

## तीन गुण जो इसे परिभाषित करते हैं {#three-properties-that-define-it}

- **संरचना से ब्लाइंड।** एक node एक hash द्वारा keyed अपारदर्शी ciphertext सर्व करता है। यह कभी एक URN, एक decryption key, या plaintext नहीं देखता। जो रिक्वेस्ट मिस होती है उसका जवाब एक निश्चित, अप्रभेद्य **decoy** स्ट्रीम से दिया जाता है — कभी `404` से नहीं — इसलिए read path कभी existence oracle नहीं बनता। सारा decryption और सारा proof सत्यापन क्लाइंट में होता है।
- **बिना भरोसे के सत्यापन योग्य।** हर असली byte, ऑन-चेन generation root पर rooted एक merkle **inclusion proof** के साथ आता है। क्लाइंट proof को root तक fold करता है और तभी स्वीकार करता है जब वह किसी भरोसेमंद root से मेल खाता हो। node पर कभी यह भरोसा नहीं किया जाता कि उसने असली bytes लौटाए हैं।
- **किसी भी साइज़ पर स्ट्रीम करने योग्य।** कंटेंट को स्पष्ट continuation के साथ bounded, 64 KiB-aligned chunks में पढ़ा जाता है। एक एक-किलोबाइट resource और सौ-मेगाबाइट का capsule एक ही लूप से पढ़े जाते हैं, और कोई भी सिंगल response अनबाउंडेड नहीं होता।

## यह DigStore के साथ कैसे फिट होता है {#how-it-fits-with-digstore}

DigStore आपको **फॉर्मेट** देता है: एक कंटेंट-एड्रेसेबल, एन्क्रिप्टेड store जो एक सिंगल सेल्फ-डिफेंडिंग `.wasm` capsule में कंपाइल होता है, जिसे एक URN से एड्रेस किया जाता है जहां *URN ही key है*। dig RPC यह है कि उस capsule को host पर भरोसा किए बिना नेटवर्क पर **कैसे सर्व किया जाता है**:

1. आप एक store कंपाइल करते हैं और एक generation को ऑन-चेन एंकर करते हैं (एक CHIP-0035 DataLayer singleton)। इसका **कंटेंट root** ट्रस्ट एंकर है।
2. एक node capsule को होस्ट करता है और उसे dig RPC पर एक्सपोज़ करता है।
3. एक पाठक `retrieval_key = sha256(urn)` derive करता है, `dig.getContent` कॉल करता है, स्ट्रीम किए गए ciphertext को रीअसेंबल करता है, **ऑन-चेन root के विरुद्ध inclusion proof को सत्यापित करता है**, और **URN-derived key से डिक्रिप्ट करता है** — पूरी तरह क्लाइंट-साइड पर।

node ने केवल एक hash सीखा; उसने कभी नहीं सीखा कि उसने क्या सर्व किया।

## एक कॉल में एक read {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

क्लाइंट `next_offset` पर तब तक लूप करता है जब तक `complete` न हो, रीअसेंबल की गई bytes पर `inclusion_proof` को `root` के विरुद्ध सत्यापित करता है, फिर डिक्रिप्ट करता है। `"decoy": true` वाला result मतलब है *नहीं मिला* — रुकें और इसे उसी रूप में रिपोर्ट करें।

## ये डॉक्स कैसे पढ़ें {#how-to-read-these-docs}

- **[Methods](./methods.md)** — पूरा method सेट (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), उनके parameters, और results।
- **[Using the public network RPC](./public-network-rpc.md)** — अपने क्लाइंट को `rpc.dig.net` (या किसी भी node) पर पॉइंट करें, endpoints, और खुद एक चलाना।
- **[Streaming](./streaming.md)** — chunk मॉडल, रीअसेंबली, proof सत्यापन, और एक संदर्भ क्लाइंट लूप।
- **[Conformance](./conformance.md)** — नेटवर्क read path का सदस्य बनने के लिए एक node को क्या इम्प्लीमेंट करना MUST है, साथ ही CORS, errors, और पूरा ब्लाइंड मॉडल।

:::note
dig RPC, [DIG Network](https://dig.net) का हिस्सा है। पूरा नॉर्मेटिव स्पेसिफिकेशन [Protocol · The dig RPC](../protocol/dig-rpc.md) सेक्शन है, नेटवर्क कंटेंट इंटरफेस।
:::

## संबंधित {#related}

- [Methods](./methods.md) — हर dig RPC method, उसके params, और results
- [Streaming](./streaming.md) — chunk मॉडल, रीअसेंबली, और proof सत्यापन
- [Conformance & Security](./conformance.md) — ब्लाइंड मॉडल और एक node को क्या इम्प्लीमेंट करना चाहिए
- [URNs & Encryption](../digstore/format/urns-and-encryption.md) — हर retrieval key के पीछे का URN
- [Concepts & glossary](../concepts.md) — dig RPC, capsule, और retrieval key परिभाषित
