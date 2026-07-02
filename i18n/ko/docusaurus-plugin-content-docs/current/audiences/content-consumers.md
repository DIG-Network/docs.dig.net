---
sidebar_position: 5
title: For content consumers
description: "여러분의 브라우저가 블록체인을 기준으로 직접 검증하는 chia:// 콘텐츠를 여세요 — 어떤 호스트도 이를 변조하거나 위조할 수 없고, 비공개 콘텐츠는 호스트로부터도 비공개로 유지되며, 영구적이고 어디서든 재호스팅할 수 있으므로 아무도 이를 내리거나 여러분을 가둘 수 없습니다."
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

> **여러분의 OWN 브라우저가 블록체인을 기준으로 검증하는 `chia://` 콘텐츠를 여세요** — 어떤 호스트도 이를 변조하거나 위조할 수 없고, 비공개 콘텐츠는 호스트로부터도 비공개로 유지되며, 영구적이고 어디서든 재호스팅할 수 있으므로 아무도 이를 내리거나 여러분을 가둘 수 없습니다.

## 핵심 개념 {#the-mental-model}

`chia://` 링크를 붙여넣으면 콘텐츠가 네트워크에서 곧바로 도착합니다 — **콘텐츠 주소 기반(content-addressed)**이며 렌더링되기 전에 **여러분의 기기에서 암호학적으로 검증**됩니다. 이는 **폐쇄 실패(fail-closed)** 방식입니다: 변조되었거나 복호화할 수 없는 바이트는 절대 표시되지 않습니다.

- **`rootHash`를 생략**하면 store의 *최신* 버전을 가리킵니다: `chia://<storeId>/`.
- **`rootHash`를 포함**하면 하나의 불변 [capsule](../concepts.md#capsule)을 정확히 고정합니다: `chia://<storeId>:<rootHash>/`.

공개 콘텐츠는 링크만 있으면 됩니다. 비공개 콘텐츠는 비밀번호와 같은 **`?salt=`** 비밀 값도 필요합니다.

## DIG Browser 또는 확장 프로그램 받기 {#get-the-dig-browser-or-the-extension}

- **[DIG Browser 받기 ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — `chia://`와 내장 지갑이 기본 탑재된 브라우저입니다.
- **확장 프로그램**은 Chrome / Edge / Brave / Firefox용이며, 여러분이 이미 사용 중인 브라우저에 `chia://` 해석 기능을 추가합니다.

## `chia://` 콘텐츠 열기 — 최신 버전 vs 고정 버전 {#open-chia-content--latest-vs-pinned}

주소 형식, 깔끔한 `chia://<store>/` 주소창, 그리고 `rootHash`를 언제 고정해야 하는지에 대해 설명합니다.

→ [chia:// 프로토콜](../browser/chia-protocol.md)

## 내장 페이지, 검증 배지 및 실드 {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, 그리고 활성 capsule에 대한 각 리소스의 포함 증명(inclusion-proof) 결과를 보여주는 검증 배지 / 실드입니다.

→ [window.chia 사용하기](../browser/using-window-chia.md)

## 공개 vs 비공개 — `?salt=` 비밀 값이 필요한 경우 {#public-vs-private--when-you-need-a-salt-secret}

공개 store는 링크만으로 열리지만, 비공개 store는 복호화 키를 파생하는 비밀 salt 값이 필요합니다.

→ [공개 vs 비공개 store](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [공개 vs 비공개 — 차이가 무엇인가요?](../support/faq.md#public-vs-private)

## 콘텐츠를 로컬에서 실행하기(선택 사항) {#run-content-locally-optional}

더 빠르고 오프라인에서도 편리한 읽기를 위해 브라우저/확장 프로그램을 로컬 [dig-node](../concepts.md#dig-node)에 연결하세요 — 이들은 하나의 `.dig` 캐시를 공유합니다. 콘텐츠를 읽기 위해 노드가 *반드시* 필요한 것은 아닙니다.

→ [노드 실행하기](../run-a-node/index.md)

## $DIG 구하기 {#get-dig}

콘텐츠를 *읽기* 위해 $DIG가 필요하지는 않습니다. 게시하고 싶다면 **TibetSwap**, **dexie.space**, **9mm.pro**에서 $DIG를 구할 수 있습니다.

→ [DIG는 어디서 구하나요?](../support/faq.md#where-do-i-get-dig)

---

## 더 깊이 알아보기: 프로토콜 {#go-deeper-the-protocol}

- **"블록체인을 기준으로 검증됨"** → [온체인 앵커링](../digstore/cli/onchain-anchoring.md) · [증명 및 보안](../digstore/format/proofs-and-security.md)
- **"공개 vs 비공개 salt"** → [URN 및 암호화](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"최신 버전 vs 고정 버전"** → [세대(generation) 및 root 해시](../digstore/format/store-structure.md#generations-and-root-hashes)
- **모든 것** → [프로토콜 심화](../protocol-deep-dive.md) · [개념 및 용어집](../concepts.md)
