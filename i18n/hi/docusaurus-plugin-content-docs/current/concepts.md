---
sidebar_position: 1.5
title: Concepts & glossary
description: "मुख्य DIG Network entities का वन-पेज इंडेक्स — capsule, store, generation, URN, retrieval key, dig RPC, chia:// protocol, और on-chain anchoring — हर एक को एक बार परिभाषित किया गया और उसके गहन डॉक से लिंक किया गया।"
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts & glossary {#concepts--glossary}

यह पेज हर मुख्य DIG Network entity को **एक बार**, सरल भाषा में परिभाषित करता है, और हर एक को उस डॉक से लिंक करता है जो गहराई में जाता है। यह डॉक्स की मानव-पठनीय रीढ़ है — और, क्योंकि हर शब्द मशीन-रीडेबल स्ट्रक्चर्ड डेटा के रूप में भी उत्सर्जित होता है, यह वह मानचित्र है जिसे एक agent नेटवर्क की शब्दावली सीखने के लिए स्क्रैप कर सकता है। ओरिएंट होने के लिए इसे स्किम करें; गहराई में जाने के लिए एक लिंक फॉलो करें।

## capsule {#capsule}

एक **capsule** एक अपरिवर्तनीय store generation है: जोड़ी `(storeId, rootHash)`, जिसे कैननिकल रूप से
`storeId:rootHash` लिखा जाता है। यह नेटवर्क की एटॉमिक इकाई है — कंपाइलेशन की (एक फिक्स्ड-साइज़ WASM मॉड्यूल),
[pricing](./digstore/cli/onchain-anchoring.md) की ($DIG में भुगतान की गई, mint या commit के लिए एक यूनिफॉर्म प्रति-capsule कीमत), रिट्रीवल की (एक [URN](#urn) एक capsule का नाम रखता है), कैशिंग की, और प्रोवेनेंस की। एक [store](#store) *capsules का एक क्रम* है, प्रति commit एक। यह परिभाषा dig-store, dig RPC, और DIG
Browser में समान है। → [The capsule, in full](./intro.md#the-capsule)

## Store {#store}

एक **store** एक पहचान (identity) है साथ ही उसका कंटेंट और इतिहास: [capsules](#capsule) का एक क्रम, प्रति
commit एक। इसकी पहचान एक 64-hex **store id** है, जो *वही* है जो इसका ऑन-चेन Chia singleton launcher id है —
चेन singleton, store के वर्तमान root के लिए अथॉरिटी है। एक store, DIG की वेबसाइट के बराबर है। → [Store structure](./digstore/format/store-structure.md)

## Generation {#generation}

एक **generation**, एक [store](#store) की एक सिंगल committed state है, जिसे एक **root hash** (generation के
प्रति-resource leaves पर एक Merkle root) से पहचाना जाता है। हर `commit`, वर्तमान कंटेंट को एक
नए, append-only generation में सील करता है — वही चीज़ जिसे एक [capsule](#capsule) नाम देता है। Generations मोनोटोनिक रूप से बढ़ते हैं, Git history की तरह। → [Generations & root hashes](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

एक **URN**, dig-store का एड्रेस *और* key एक स्ट्रिंग में है:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`। यह एक resource को **लोकेट** भी करता है और **वह key
भी derive करता है जो उसे डिक्रिप्ट करती है** — एक पब्लिक resource को पढ़ने के लिए URN का होना ज़रूरी और पर्याप्त है।
ब्राउज़र-फेसिंग शॉर्टहैंड है [`chia://` protocol](#chia-protocol)। → [URNs & Encryption](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

**retrieval key**, `SHA-256(canonical_urn)` है — यह इकलौता एड्रेस है जो कभी क्लाइंट से बाहर जाता है। यह
किसी resource के ciphertext को उसका पथ या [URN](#urn) उजागर किए बिना लोकेट करता है। यह
*root-independent* है, इसलिए वही key सभी [generations](#generation) में एक resource को खोजती है; फिर सर्व की गई bytes को सही root के विरुद्ध [Merkle-verified](#merkle-proof) किया जाता है। अलग
**decryption key** लोकली (HKDF) से उसी URN से derive की जाती है और कभी भेजी नहीं जाती। → [Two values, one string](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

हर [generation](#generation), प्रति resource एक leaf के साथ एक Merkle tree बनाता है, जो सर्व किए गए
सटीक *ciphertext* bytes को कमिट करता है। एक सर्व किए गए resource के साथ एक सिंगल **inclusion proof** साथ आता है और
साबित करता है कि वे bytes उसी सटीक root से संबंधित हैं — इसलिए कंटेंट को कभी डिक्रिप्ट किए बिना सत्यापित किया जाता है,
और किसी node पर कभी यह भरोसा नहीं किया जाता कि उसने असली bytes लौटाए हैं। → [Merkle proofs](./digstore/format/proofs-and-security.md)

## On-chain anchoring {#anchoring}

हर store, Chia mainnet पर एक **singleton** है। `digs init` इसे mint करता है (launcher id *ही*
store id बन जाता है) और हर `digs commit`, CHIP-0035 singleton update के रूप में एक नए
[generation](#generation) root को ऑन-चेन एंकर करता है। दोनों कन्फर्म होने तक ब्लॉक करते हैं और असली फंड खर्च करते हैं। चेन ही
किसी store के नवीनतम root के लिए अथॉरिटी है। → [On-chain anchoring](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG**, DIG Network टोकन (एक Chia CAT) है। एक [capsule](#capsule) mint करना (`init`) या उसे commit करना
$DIG में **एक यूनिफॉर्म प्रति-capsule कीमत** लेता है, जो एंकर के समान ऑन-चेन खर्च में **एटॉमिक रूप से शामिल** है —
कोई अलग ट्रांज़ैक्शन नहीं है, और memo store id ले जाता है। → [Costs](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store`, वह कमांड-लाइन टूल है जो stores बनाता, commit करता, शेयर करता, और पढ़ता है — एन्क्रिप्टेड,
ऑन-चेन store फॉर्मेट पर एक Git-आकार का वर्कफ़्लो (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`)। → [Command reference](./digstore/cli/command-reference.md) · [CLI tutorial](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml`, किसी प्रोजेक्ट के रूट पर **committable प्रोजेक्ट मैनिफेस्ट** है — `store-id`, `output-dir`,
`build-command`, और अन्य प्रोजेक्ट कॉन्फ़िग, जो `digs dev`, `digs deploy`, और
स्कैफोल्डिंग templates द्वारा साझा किया जाता है। इसमें **कोई सीक्रेट नहीं** होता (वे environment से आते हैं), इसलिए इसे
commit करना सुरक्षित है। → [Project config & build-time values](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) DIG प्रोजेक्ट शुरू करने के लिए **JS front door** है: यह
पांच templates (`static`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia`) में से एक से एक चलने योग्य स्टार्टर — एक ऐप, एक [`dig.toml`](#dig-toml), और (वॉलेट templates के लिए)
[DIG SDK](#dig-sdk) वायर्ड — स्कैफोल्ड करता है। स्कैफोल्डिंग **मुफ़्त** है — कोई mint नहीं, कोई चेन नहीं, कोई खर्च नहीं; आप
यूनिफॉर्म capsule प्राइस केवल तभी चुकाते हैं जब आप एक [capsule](#capsule) पब्लिश करते हैं। यह Rust CLI के
`digs new` का npm-साइड साथी है। → [Scaffold an app](./build-a-dapp/scaffold.md)

## The GitHub deploy Action {#deploy-action}

`dig-network/deploy-action`, **git-push-to-deploy** GitHub Action है: यह रनर पर
[`dig-store` CLI](#digstore-cli) इंस्टॉल करता है, आपके store को आगे बढ़ाने के लिए `digs deploy` चलाता है (कभी
mint नहीं करता), और पब्लिश किए गए [capsule](#capsule) + URLs + लागत को step outputs, एक PR
कमेंट, एक GitHub Deployment, और एक commit status के रूप में रिपोर्ट करता है। `if-changed` (डिफ़ॉल्ट) के साथ, एक byte-identical
बिल्ड एक no-op है — कोई खर्च नहीं। → [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK** (`@dignetwork/dig-sdk`), इंटीग्रेटिंग डेवलपर्स के लिए टाइप्ड npm पैकेज है: एक
`ChiaProvider` (इंजेक्टेड [`window.chia`](#window-chia) को प्राथमिकता देता है, फिर WalletConnect → Sage पर फॉलबैक करता है),
एक `DigClient` ([dig RPC](#dig-rpc) पर सत्यापित, एन्क्रिप्टेड कंटेंट पढ़ता है), एक `Paywall`
(एक हाई-लेवल pay-to-unlock / NFT-गेटेड-एक्सेस हेल्पर जो प्रोवाइडर को spend builder के साथ compose करता है), और
`/spend` सबपाथ पर पुनः-एक्सपोर्ट किया गया कैननिकल CHIP-0035 spend builder।
→ [Build a dapp on Chia](./build-a-dapp/tutorial.md)

## The dig RPC {#dig-rpc}

**dig RPC**, नेटवर्क-व्यापी read इंटरफेस है: HTTPS `POST` पर एक JSON-RPC 2.0 सर्विस जिसे हर होस्टिंग नोड
समान रूप से बोलता है। यह [retrieval key](#retrieval-key) द्वारा ciphertext + [inclusion proofs](#merkle-proof), `(storeId, root)`
द्वारा पूरे [capsules](#capsule), और डिस्कवरी मेटाडेटा सर्व करता है — संरचना से ब्लाइंड, और क्लाइंट-साइड सत्यापित और डिक्रिप्ट किया गया। **यह सार्वभौमिक read
path है**: हर पब्लिश किया गया capsule ऑन-चेन कन्फर्म होते ही यहां उसके [URN](#urn) / [`chia://`](#chia-protocol) एड्रेस से पढ़ने योग्य है — कोई
रजिस्ट्रेशन नहीं और capsule पब्लिश करने के अलावा कोई भुगतान नहीं। वैकल्पिक, मानव-अनुकूल
[`*.on.dig.net` handle](#on-dig-net), इसके *ऊपर* एक front door है; dig RPC
हमेशा उपलब्ध रहता है। → [What is the dig RPC?](./rpc/what-is-the-dig-rpc.md)

## The chia:// protocol {#chia-protocol}

`chia://`, DIG Browser की मूल कंटेंट-एड्रेस स्कीम है — [`urn:dig:` URN](#urn) का टाइप करने योग्य फ्रंट एंड।
एक `chia://<storeId>/` लिंक पेस्ट करें और ब्राउज़र सीधे नेटवर्क से, कंटेंट-एड्रेस्ड और क्रिप्टोग्राफिक रूप से सत्यापित,
कंटेंट fetch करता है। → [The chia:// protocol](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia`, वह Chia वॉलेट प्रोवाइडर है जिसे **DIG Browser** हर पेज में इंजेक्ट करता है। यह
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md) बोलता है, इसलिए एक वेब ऐप बिना किसी WalletConnect सेटअप के
उपयोगकर्ता का एड्रेस, सिग्नेचर, और स्पेंड्स रिक्वेस्ट कर सकता है — उन ऐप्स के लिए एक ड्रॉप-इन
विकल्प जो पहले से ही CHIP-0002 बोलते हैं। → [Using window.chia](./browser/using-window-chia.md)
· [The window.chia provider spec](./protocol/window-chia-provider.md) (नॉर्मेटिव, वर्जन्ड)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)), बिना CLI के [capsules](#capsule) पब्लिश और मैनेज करने के लिए
वेब ऐप है — एक capsule बनाएं, एक फ्रंटएंड डिप्लॉय करें, और अपने stores को ब्राउज़र में देखें। यह वह
गेटेड कंट्रोल प्लेन भी है जो महंगे ZK execution-proof jobs का बजट तय करता है।

## dig-node {#dig-node}

एक **dig-node**, नेटवर्क का कंटेंट **सर्वर** है — सप्लाई साइड। यह [capsules](#capsule) होस्ट करता है, एक
लोकल `.dig` कैश रखता है, और [dig RPC](#dig-rpc) को `rpc.dig.net` की तरह ही बोलता है। DIG कंटेंट पढ़ने के लिए आपको इसकी **ज़रूरत नहीं** है (उपभोक्ता `rpc.dig.net` पर फॉलबैक करते हैं); एक चलाने से reads लोकल-फर्स्ट हो जाते हैं और
सर्विंग क्षमता में योगदान होता है। host **ब्लाइंड** है — यह केवल ciphertext + proofs रिले करता है।
→ [Run a node](./run-a-node/index.md)

## on.dig.net handle {#on-dig-net}

एक **on.dig.net handle**, एक [store](#store) के लिए एक *वैकल्पिक, भुगतान वाला* मानव-अनुकूल वेब एड्रेस है:
`<your-name>.on.dig.net`। एक store को यह अपने आप **नहीं** मिलता — आप handle को रजिस्टर करते हैं (DIGHUb में एक
भुगतान वाला CHIP-54 / `on.dig.net` रजिस्ट्रेशन) और वह रजिस्ट्रेशन store को उस नाम से पिन करता है। कोई रजिस्ट्रेशन न होने का मतलब है कोई `*.on.dig.net` एड्रेस नहीं। यह केवल एक सुविधा वाला front door है:
store पहले से ही [dig RPC](#dig-rpc) पर अपने [URN](#urn) / [`chia://`](#chia-protocol) एड्रेस से पढ़ने योग्य है,
चाहे handle मौजूद हो या न हो। (Account handles और store slugs अलग नेमस्पेस हैं और अपने आप
सबडोमेन एक्सपोज़ नहीं करते।) → [Can I get a `*.on.dig.net` address?](./support/faq.md#can-i-use-my-own-domain)

## संबंधित {#related}

- [DIG Network overview](./intro.md) — एक नज़र में प्रिमिटिव्स
- [Quickstart](./quickstart.md) — मुफ़्त में बनाएं और प्रीव्यू करें, अंत में एक capsule पब्लिश करें
- [Build a dapp on Chia](./build-a-dapp/tutorial.md) — एक शिप किए गए dapp में सिले हुए हर प्रिमिटिव
- [dig-store क्या है?](./digstore/what-is-digstore.md) — वन-फाइल store फॉर्मेट
- [dig RPC क्या है?](./rpc/what-is-the-dig-rpc.md) — नेटवर्क read path
- [The chia:// protocol](./browser/chia-protocol.md) — ब्राउज़र में कंटेंट को एड्रेस करना
- [मदद पाएं](./support/get-help.md) — समुदाय चैनल्स और रिपोर्ट कैसे करें

## Agents और LLMs के लिए {#for-agents--llms}

ये डॉक्स मशीन-एक्सट्रैक्टेबल हैं। हर पेज schema.org JSON-LD ले जाता है (यह पेज एक
`DefinedTerm` सेट के रूप में), और साइट रूट पर दो क्यूरेटेड मैप्स रहते हैं:

- [`/llms.txt`](pathname:///llms.txt) — डॉक्स का एक लिंक-रिच मार्कडाउन मैप ([llms.txt convention](https://llmstxt.org/))।
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — entities (concepts + docs) और टाइप्ड edges (`defines`, `part-of`, `requires`, `see-also`)।
