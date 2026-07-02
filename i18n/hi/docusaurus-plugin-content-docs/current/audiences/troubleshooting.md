---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "हर विफलता आपको एक स्थिर कोड और एक request-id देती है जो सीधे सर्वर लॉग से जुड़ती है, ऑन-चेन spends रेस-गार्डेड हैं ताकि आप कभी दोगुना भुगतान न करें, और स्पष्ट pre-flight गार्ड्स $DIG खर्च करने से पहले बर्बाद capsules को रोकते हैं।"
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Troubleshooting {#troubleshooting}

> हर विफलता आपको एक **स्थिर कोड** और एक **request-id** देती है जो सीधे सर्वर लॉग से जुड़ती है, ऑन-चेन spends **रेस-गार्डेड** हैं ताकि आप कभी दोगुना भुगतान न करें, और स्पष्ट **pre-flight गार्ड्स** $DIG खर्च करने से पहले बर्बाद capsules को रोकते हैं।

## मेंटल मॉडल — अपनी विफलता को उसके कोड से खोजें {#the-mental-model--find-your-failure-by-its-code}

हर सतह — dig RPC, digstore CLI, DIGHUb, `chia://` loader, SDK — एक विफलता को एक **स्थिर कोड** से मैप करती है। **कोड पर branch करें, कभी मैसेज पर नहीं।** एक समेकित कैटलॉग इन सभी को कवर करता है और मशीन-रीडेबल रूप में भी पब्लिश होता है।

Pre-flight गार्ड्स (`digstore doctor`, `--dry-run`, `--if-changed`) और resumable anchors का मतलब है कि एक अटका हुआ या no-op publish **कभी चुपचाप खर्च नहीं करता**।

## सामान्य publishing विफलताएं {#common-publishing-failures}

अपर्याप्त फंड, एक confirm टाइमआउट (resumable — आपका spend खोया नहीं है), और non-fast-forward "remote root has advanced"।

→ [Troubleshooting](../support/troubleshooting.md)

## Read और verify विफलताएं {#read--verify-failures}

Proof मिसमैच, decrypt/salt एरर्स, और not-found / decoy responses।

→ [Read & verify failures](../support/troubleshooting.md#verification-failed)

## वॉलेट और सेशन समस्याएं {#wallet--session-issues}

Connect, re-auth, एक अस्वीकृत रिक्वेस्ट, और watch-only सेशन्स जो साइन नहीं कर सकते।

→ [Wallet session can't sign](../support/troubleshooting.md#wallet-session)

## Pre-flight और लागत जांच — एक capsule बर्बाद न करें {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (environment + तैयारी), `--dry-run` (लागत और होने वाले capsule का पूर्वावलोकन), और `--if-changed` (एक byte-identical बिल्ड एक no-op है)।

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [On-chain anchoring → cost & safety](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## एरर कोड्स संदर्भ {#error-codes-reference}

CLI exit codes · RPC `-32xxx` · DIGHUb · dig-loader · SDK — एक समेकित तालिका।

→ [Error codes](../support/error-codes.md)

## FAQ {#faq}

लागत, फ्री ट्रायल, कीमत यूनिफॉर्म क्यों है, $DIG कहां पाएं, और "क्या कोई testnet है?"।

→ [FAQ](../support/faq.md)

## मदद पाएं {#get-help}

Discord + GitHub, और एक अच्छी रिपोर्ट कैसे फाइल करें — **कभी सीक्रेट्स पेस्ट न करें**।

→ [मदद पाएं](../support/get-help.md)

## Status और changelog {#status--changelog}

→ [Status](../support/status.md) · [Changelog](../support/changelog.md)

---

## गहराई में जाएं: प्रोटोकॉल {#go-deeper-the-protocol}

- **read और verify विफलताएं** → [Proofs & security](../digstore/format/proofs-and-security.md) · [URNs & encryption](../digstore/format/urns-and-encryption.md)
- **RPC `-32xxx` कोड्स** → [the dig RPC methods](../rpc/methods.md) · [Conformance](../rpc/conformance.md)
- **सब कुछ** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
