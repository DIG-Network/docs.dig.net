---
sidebar_position: 1
title: Run a DIG node
description: "एक dig-node क्या है, आप एक क्यों चलाएंगे, और इसे कैसे इंस्टॉल करें — Ubuntu/Debian के लिए apt repository या क्रॉस-प्लेटफॉर्म यूनिवर्सल इंस्टॉलर।"
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Run a DIG node {#run-a-dig-node}

> **प्रमाणित रूप से और प्रोवाइडर-ब्लाइंड कंटेंट सर्व करें** — आप केवल कभी hashes द्वारा keyed अप्रभेद्य ciphertext को छूते हैं, execution proofs के साथ विश्वसनीय सर्विंग की पुष्टि कर सकते हैं, और क्लाइंट सब कुछ चेन के विरुद्ध सत्यापित करता है, इसलिए भरोसा कभी आपके node पर नहीं टिकता।

एक **dig-node**, DIG Network का कंटेंट **सर्वर** है — नेटवर्क का सप्लाई साइड। यह capsules होस्ट करता है, एक लोकल `.dig` कैश रखता है, और [dig RPC](../rpc/what-is-the-dig-rpc.md) एक्सपोज़ करता है ताकि कोई भी चीज़ जो DIG कंटेंट पढ़ती है वह आपसे पढ़ सके। यह headless चलता है (कोई ब्राउज़र नहीं, कोई UI नहीं) एक बैकग्राउंड सर्विस के रूप में — उस कंटेंट के लिए एक seedbox जिसे आप पब्लिश करते हैं या सर्व करने में मदद करना चाहते हैं।

यह **उपभोक्ताओं** — [DIG Browser](../browser/chia-protocol.md) और browser extension — का समकक्ष है, जो ciphertext + proofs fetch करते हैं, ऑन-चेन root के विरुद्ध सत्यापित करते हैं, लोकली डिक्रिप्ट करते हैं, और रेंडर करते हैं। DIG कंटेंट पढ़ने के लिए आपको एक dig-node की **ज़रूरत नहीं** है: अकेला एक उपभोक्ता ठीक काम करता है, `rpc.dig.net` पर पब्लिक रेफरेंस node पर फॉलबैक करते हुए। आप **सर्व** करने के लिए एक dig-node चलाते हैं — और जब एक ही मशीन पर मौजूद हो, उपभोक्ता इससे पढ़ता है (लोकल, ऑफ़लाइन-फ्रेंडली, और नेटवर्क में योगदान करते हुए) और वे एक `.dig` कैश शेयर करते हैं।

:::info सर्विंग बनाम उपभोग
- **dig-node** = कंटेंट सर्व करता है + dig RPC एक्सपोज़ करता है। headless बैकग्राउंड सर्विस।
- **DIG Browser / extension** = कंटेंट का उपभोग करते हैं (लोकली सत्यापित + डिक्रिप्ट करते हैं)। किसी लोकल node की ज़रूरत नहीं।

जब दोनों इंस्टॉल हों, ब्राउज़र/extension आपके लोकल dig-node से पढ़ते हैं; अन्यथा वे `rpc.dig.net` से पढ़ते हैं। किसी भी तरह हर byte क्लाइंट-साइड पर चेन के विरुद्ध सत्यापित होता है — सोर्स पर कभी भरोसा नहीं किया जाता।
:::

## इसे इंस्टॉल करें {#install-it}

| आपकी मशीन | उपयोग करें |
|---|---|
| **Ubuntu / Debian** | नेटिव **[apt repository](./apt.md)** — `apt install dig-node digstore`, systemd सर्विस के रूप में ऑटो-इनेबल्ड। |
| **Windows / macOS / Linux (कोई भी)** | क्रॉस-प्लेटफॉर्म **[universal installer](#universal-installer-any-os)** — हर OS के लिए एक `curl \| sh` (या डाउनलोड)। |

दोनों एक ही `dig-node` सर्विस साथ ही `digstore` CLI इंस्टॉल करते हैं। apt, Debian-नेटिव पथ है (signed, `apt upgrade`-योग्य); universal installer बाकी सब कुछ कवर करता है।

### apt (Ubuntu / Debian) — Debian-family सिस्टम्स पर अनुशंसित {#apt-ubuntu--debian--recommended-on-debian-family-systems}

नेटिव पथ: `apt.dig.net` पर एक signed apt repository। यह `dig-node` को एक managed **systemd सर्विस** के रूप में इंस्टॉल करता है और इसे `apt upgrade` से अपडेटेड रखता है।

→ **[apt के ज़रिए Ubuntu/Debian पर इंस्टॉल करें](./apt.md)**

### Universal installer (कोई भी OS) {#universal-installer-any-os}

क्रॉस-प्लेटफॉर्म पथ — Windows, macOS, और कोई भी Linux। यह आपका OS पता लगाता है, `dig-node` सर्विस (Windows service / `systemd` / `launchd`) और `digstore` CLI इंस्टॉल करता है, और किसी पैकेज मैनेजर की ज़रूरत नहीं है:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

यह वही सेल्फ-कंटेन्ड `dig-installer` है जो [Releases page](https://github.com/DIG-Network/dig-installer/releases) पर शिप किया गया है — अगर आप shell में पाइप नहीं करना चाहते, या Windows पर, इसे सीधे डाउनलोड और चलाएं। ऐसा करने पर एक गाइडेड [GUI विज़ार्ड](./universal-installer.md#gui-installer) भी खुलता है, अगर आप फ़्लैग्स के बजाय क्लिक करना पसंद करते हैं।

:::note Pre-release
होस्टेड इंस्टॉलर्स (`apt.dig.net`, `dig.net/install.sh`) अभी भी प्रोविज़न किए जा रहे हैं। जब तक वे लाइव न हों, सोर्स से बिल्ड करें या [dig-node Releases](https://github.com/DIG-Network/dig-node/releases) से एक बाइनरी लें। यहां दिए गए कमांड्स असली, इच्छित कमांड्स हैं।
:::

## बस कंटेंट पढ़ना चाहते हैं? {#just-want-to-read-content}

आपको एक node की ज़रूरत नहीं है। **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** पाएं और कोई भी `chia://` एड्रेस खोलें — यह आपके लोकल dig-node से उपभोग करता है अगर आपके पास एक है, नहीं तो `rpc.dig.net` से। देखें [The `chia://` protocol](../browser/chia-protocol.md)।

## संबंधित {#related}

- [Install on Ubuntu/Debian via apt](./apt.md) — Debian-नेटिव पथ + systemd सर्विस प्रबंधन
- [Install anywhere — the universal installer](./universal-installer.md) — Windows / macOS / कोई भी Linux + `dig.local`
- [Point a consumer at your node](./point-a-consumer.md) — लोकल-फर्स्ट reads + साझा `.dig` कैश
- [Configure dig-node](./configure.md) — ports, listeners, कैश कैप, upstream
- [Self-host a remote origin](../rpc/dig-remote.md) — `digstore serve` + dig:// clone/pull/push
- [Manage your node](./manage.md) — control.* admin RPCs + My Node UI
- [नियंत्रण पैनल](./control-panel.md) — DIG एक्सटेंशन से अपना node पूरी तरह चलाएँ: लाइव स्थिति, आरक्षित कैश स्पेस (LRU), और — पेयरिंग के बाद — upstream/hosted stores/sync/peers
- [Using the public network RPC](../rpc/public-network-rpc.md) — dig RPC जो आपका node बोलता है, और नेटवर्क पर एक node ऑपरेट करना
- [Installing the CLI](../digstore/cli/install.md) — अकेले `digstore` (पब्लिशिंग, सर्विंग नहीं)

## गहराई में जाएं: प्रोटोकॉल {#go-deeper-the-protocol}

- **"ब्लाइंड host और decoys"** → [The dig RPC blind serving model](../rpc/what-is-the-dig-rpc.md) · [Node conformance](../rpc/conformance.md)
- **"विश्वसनीय सर्विंग की पुष्टि"** → [Inclusion vs execution proofs](../inclusion-vs-execution-proofs.md)
- **"dig:// clone/pull/push"** → [The §21/§22 remote protocol](../rpc/dig-remote.md)
- **सब कुछ** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
