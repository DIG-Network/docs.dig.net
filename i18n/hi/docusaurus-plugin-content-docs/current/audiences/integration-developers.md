---
sidebar_position: 3
title: For integration developers
description: "एक पूरी तरह मशीन-रीडेबल प्लेटफॉर्म — OpenAPI/OpenRPC, एक कैटलॉग्ड एरर टैक्सोनॉमी, लाइव प्राइसिंग, JWKS, प्रति-पेज JSON, और एक टाइप्ड @dignetwork/dig-sdk — ताकि आप बिना मानव प्रोज़ की एक भी लाइन स्क्रैप किए अपने ऐप में एक वॉलेट + सत्यापित reads वायर कर सकें।"
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# For integration developers {#for-integration-developers}

> **एक पूरी तरह मशीन-रीडेबल प्लेटफॉर्म** — OpenAPI/OpenRPC, एक कैटलॉग्ड एरर टैक्सोनॉमी, लाइव प्राइसिंग, JWKS, प्रति-पेज JSON, और एक टाइप्ड `@dignetwork/dig-sdk` — ताकि आप **बिना मानव प्रोज़ की एक भी लाइन स्क्रैप किए** अपने ऐप में एक वॉलेट + सत्यापित reads वायर कर सकें।

## मेंटल मॉडल — दो सतहें, अलग रखी गई {#the-mental-model--two-surfaces-kept-separate}

1. **एक REST कंट्रोल प्लेन** — `hub.dig.net/v1`, bearer-JWT — stores, domains, teams, और NFTs मैनेज करने के लिए।
2. **एक नोड-एग्नॉस्टिक dig JSON-RPC 2.0 READ path** — `rpc.dig.net` — जो **सत्यापित ciphertext** स्ट्रीम करता है।

एक **वॉलेट** सतह ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) दो transports पर — इंजेक्टेड (DIG Browser) या WalletConnect → Sage — जो SDK के `ChiaProvider` द्वारा एकीकृत है। Spends हमेशा कैननिकल CHIP-0035 wasm द्वारा बनाए जाते हैं और उपयोगकर्ता के वॉलेट द्वारा साइन किए जाते हैं — **कभी हाथ से नहीं बनाए जाते**। **स्थिर एरर कोड्स** पर branch करें, कभी प्रोज़ पर नहीं।

## एक dapp बनाएं — एंड-टू-एंड {#build-a-dapp--end-to-end}

स्कैफोल्ड से लेकर आपके अपने डोमेन पर लाइव एक वॉलेट-अवेयर ऐप तक का सिंगल थ्रेड।

→ [Build a dapp on Chia](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, और `/spend` सबपाथ पर पुनः-एक्सपोर्ट किए गए कैननिकल spends। इंस्टॉल, subpaths, और `capabilities()`।

→ [The DIG SDK](../sdk.md)

## एक वॉलेट कनेक्ट करें — `window.chia` {#connect-a-wallet--windowchia}

इंजेक्टेड प्रोवाइडर का पता लगाएं, `connect()` कॉल करें (प्रति-ऑरिजिन सहमति), और CHIP-0002 methods उपयोग करें।

→ [Using window.chia](../browser/using-window-chia.md) · स्पेक: [the window.chia provider](../protocol/window-chia-provider.md)

## सत्यापित कंटेंट पढ़ें — `DigClient` + dig RPC methods {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient`, ciphertext + inclusion proofs स्ट्रीम करता है और क्लाइंट-साइड पर **verify-then-decrypt** करता है। जब आपको ज़रूरत हो तो methods को सीधे कॉल करें।

→ [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Methods](../rpc/methods.md)

## Streaming और reassembly {#streaming--reassembly}

chunk मॉडल, [retrieval key](../concepts.md#retrieval-key), और verify-then-decrypt क्रम।

→ [Streaming](../rpc/streaming.md)

## Spends बनाना — कैननिकल CHIP-0035 builder {#building-spends--the-canonical-chip-0035-builder}

**build → sign → broadcast** विभाजन: wasm spend bundle बनाता है, वॉलेट साइन करता है, आप broadcast करते हैं। hub कभी एक spend हाथ से नहीं बनाता, और आपको भी नहीं बनाना चाहिए।

→ [Building spends](../spends.md)

## hub `/v1` कंट्रोल प्लेन {#the-hub-v1-control-plane}

Auth (JWT / OIDC / device pairing), stores, domains, analytics, और webhooks REST पर।

→ OpenAPI डॉक्यूमेंट के लिए [Machine-readable surfaces](../machine-surfaces.md#openapi)।

## CI डिप्लॉय — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Modes, keyless OIDC, outcome enum, और डाउनस्ट्रीम steps के लिए `--json` आउटपुट।

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## मशीन-रीडेबल सतहें {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — बिना प्रोज़ स्क्रैप किए डिस्कवर और इंटीग्रेट करें।

→ [Machine-readable surfaces](../machine-surfaces.md)

## एरर कोड्स — कोड पर branch करें {#error-codes--branch-on-the-code}

dig RPC, CLI, DIGHUb, dig loader, और SDK में एक समेकित संदर्भ।

→ [Error codes](../support/error-codes.md)

---

## गहराई में जाएं: प्रोटोकॉल {#go-deeper-the-protocol}

- **"सत्यापित reads"** → [The dig RPC (Network Content Interface)](../rpc/what-is-the-dig-rpc.md) · [Inclusion vs execution proofs](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [the normative provider spec](../protocol/window-chia-provider.md)
- **"retrieval_key & streaming"** → [URNs & encryption](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **"एक deploy token एक revocable writer key है"** → [CHIP-0035 spends & delegation](../chip-0035-spends-and-delegation.md)
- **सब कुछ** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
