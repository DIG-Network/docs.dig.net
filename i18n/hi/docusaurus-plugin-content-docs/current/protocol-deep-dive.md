---
sidebar_position: 1
title: "Protocol: Overview"
description: "DIG Protocol को सात bottom-up layers के रूप में, नॉर्मेटिव और implementation-defined। capsule (storeId:rootHash) मूल इकाई है; host ब्लाइंड है और पाठक चेन के विरुद्ध सत्यापित करता है। यह अथॉरिटेटिव प्रोटोकॉल संदर्भ है।"
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protocol: Overview {#protocol-overview}

यह DIG Protocol का **नॉर्मेटिव स्पेसिफिकेशन** है, जिसे **सात layers, bottom-up** के रूप में परिभाषित किया गया है। हर layer अपनी **कैननिकल crate/file** को नॉर्मेटिव संदर्भ के रूप में नाम देता है।

:::info यह अथॉरिटेटिव प्रोटोकॉल संदर्भ है
यह सेक्शन इस बात का सोर्स ऑफ ट्रुथ है कि नेटवर्क क्या करता है। यह प्रोटोकॉल को वैसे ही डॉक्यूमेंट करता है जैसे यह असल में चलता है, कैननिकल इम्प्लीमेंटेशन के `file:line` सिटेशन्स के साथ।
:::

## मूल इकाई: capsule {#the-fundamental-unit-the-capsule}

हर layer में एक ही अवधारणा चलती है: **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, कैननिकल रूप से `storeId:rootHash`। एक **store**, capsules का एक क्रमबद्ध क्रम है (पुराने→नए), प्रति commit एक; इसकी पहचान `store_id` *ही* Chia पर एक CHIP-0035 DataLayer singleton launcher id है। पहचान, कंपाइलेशन, प्राइसिंग, रिट्रीवल, कैशिंग, और प्रोवेनेंस सभी **प्रति capsule** परिभाषित हैं।

## थीसिस: ब्लाइंड host, क्लाइंट-साइड सत्यापन, चेन-एंकर्ड root {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **ब्लाइंड host।** एक host के पास केवल hashes द्वारा keyed अपारदर्शी ciphertext होता है। इसके पास कोई URN और कोई key नहीं होती, यह capsule के अपने आउटपुट को ज्यों का त्यों रिले करता है, और यह हिट को मिस से अलग नहीं बता सकता। wire पर कोई `decoy` फील्ड नहीं है और कोई CDN नहीं है — कंटेंट केवल [dig RPC](./protocol/dig-rpc.md) के ज़रिए सर्व किया जाता है।
- **क्लाइंट-साइड सत्यापन।** हर byte को पाठक के डिवाइस पर एक ऑन-चेन root के विरुद्ध एक प्रति-resource merkle inclusion proof से जांचा जाता है, फिर authenticated-decrypt किया जाता है। भरोसा कभी सर्विंग ऑरिजिन पर टिका नहीं होता।
- **चेन-एंकर्ड root।** भरोसेमंद root **केवल** Chia पर CHIP-0035 singleton से आता है (coinset.org के ज़रिए resolved), कभी सर्व किए गए "latest" से नहीं।

## सात layers {#the-seven-layers}

| # | Layer | यह क्या परिभाषित करता है | कैननिकल संदर्भ |
|---|---|---|---|
| 0 | [Identity & naming](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN & addressing](./protocol/urn-and-addressing.md) | `urn:dig:chia:…` व्याकरण; rootless `retrieval_key` | `digstore-core::urn`, `lib.rs` |
| 1 | [Cryptography](./protocol/cryptography.md) | HKDF KDF; AES-256-GCM-SIV seal | `digstore-core::crypto` |
| 1 | [Merkle inclusion proofs](./protocol/merkle-proofs.md) | D5 प्रति-resource leaf; NODE_TAG fold | `digstore-core::merkle` |
| 1 | [BLS signatures & DSTs](./protocol/bls-signatures.md) | Chia AugScheme; पांच role DSTs | `digstore-crypto::bls` |
| 2 | [Capsule format](./protocol/capsule-format.md) | DIGS डेटा सेक्शन (BINDING D1) | `digstore-core::datasection` |
| 2 | [The self-defending module](./protocol/self-defending-module.md) | फिक्स्ड-साइज़ ऑब्फस्केशन; सर्विंग guest | `digstore-compiler`, `digstore-guest` |
| 4 | [On-chain anchoring](./protocol/on-chain-anchoring.md) | store = singleton; capsule = root-advance | `chip35_dl_coin`, `digstore-chain` |
| 4 | [DIG CAT payment & pricing](./protocol/dig-cat-payment.md) | प्रति-capsule, डायनामिक, USD-pegged | `chip35_dl_coin::dig` |
| 6 | [The dig RPC](./protocol/dig-rpc.md) | मशीन इंटरफेस (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [§21 transport & push](./protocol/transport-and-push.md) | `dig://` locator, REST, push v1 | `digstore-remote` |
| 7 | [DIG Node peer network](./protocol/peer-network.md) | mTLS peer identity, NAT traversal, STUN, introducer, relay wire, peer RPC | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Verification & provenance](./protocol/verification-and-provenance.md) | चार क्रमबद्ध integrity gates | `digstore-core::merkle`, `dig-node` |
| 6 | [The blind host model](./protocol/blind-host-model.md) | provider-blindness; resolver; `/v1` कंट्रोल प्लेन | hub `retrieval`/`resolver`/`api` |
| — | [Conformance & parity](./protocol/conformance-and-parity.md) | क्रॉस-implementation parity अनुशासन | frozen goldens, OpenRPC diff |

(Layers 3 और §21 transport read path के साथ इंटरलीव होते हैं — तालिका उन्हें वहां ग्रुप करती है जहां एक पाठक उनसे मिलता है। पूरी layer नंबरिंग हर पेज पर दी गई है।)

## एक capsule layers से कैसे गुज़रता है {#how-a-capsule-flows-through-the-layers}

एक पब्लिशर कंटेंट को **chunk + encrypt** (L1) करके एक **capsule format** (L2) में डालता है जो **self-serve** (L3) करता है, इसे ऑन-चेन **एंकर** (L4) करता है, और इसे §21 transport (L5) पर **push** करता है। कोई भी क्लाइंट इसे dig RPC के ज़रिए **पढ़ता** है और इसे पूरी तरह क्लाइंट-साइड पर चेन-एंकर्ड root के विरुद्ध **सत्यापित** (L6) करता है। हर क्रिप्टोग्राफिक constant की producer, host, और verifier में साझा **एक** परिभाषा होती है — [C8 parity invariant](./protocol/conformance-and-parity.md)।

## शब्दावली {#terminology}

- **`chia://`** — नेटवर्क **कंटेंट** एड्रेस (जो एक ब्राउज़र खोलता है)।
- **`dig://`** — §21 **transport** locator (CLI/peer प्लेन) *और* DIG Browser की इंटरनल पेज स्कीम — दो अलग उपयोग, कभी कंटेंट एड्रेस नहीं।
- **`urn:dig:`** — URN नेमस्पेस जिससे दोनों derive होते हैं।
- **store / capsule** — पहचान और उसका अपरिवर्तनीय generation।
- **$DIG** — प्रति capsule भुगतान किया गया CAT; **dig-store** — store फॉर्मेट।

## संबंधित {#related}

- [Concepts & glossary](./concepts.md) — हर entity एक बार परिभाषित
- [Identity & naming](./protocol/identity-and-naming.md) — Layer 0, जहां स्पेक शुरू होता है
- [The dig RPC](./protocol/dig-rpc.md) — प्रोटोकॉल का मशीन इंटरफेस
- [DIG Node peer network](./protocol/peer-network.md) — nodes एक-दूसरे को कैसे खोजते + पहुंचते हैं (mTLS, NAT traversal, relay)
- [Conformance & parity](./protocol/conformance-and-parity.md) — क्रॉस-implementation parity अनुशासन
