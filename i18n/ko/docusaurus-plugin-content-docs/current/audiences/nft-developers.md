---
sidebar_position: 2
title: For NFT developers
description: "위변조가 불가능한 DIG capsule에 예술 작품이 영구적으로 저장되는 CHIP-0007 컬렉션 전체를 민팅하세요 — 하나의 원자적 서명 번들, 실제 로열티, 그리고 온체인에서 아직 증명할 수 없는 것을 절대 거짓으로 내세우지 않는 정직한 드롭 메커니즘까지."
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# For NFT developers {#for-nft-developers}

> **위변조가 불가능한 DIG capsule에 예술 작품이 PERMANENTLY(영구적으로) 저장되는 CHIP-0007 컬렉션 전체를 민팅하세요** — 하나의 원자적 서명 번들, 실제 로열티, 그리고 온체인에서 아직 증명할 수 없는 것을 절대 거짓으로 내세우지 않는 정직한 드롭 메커니즘(reveal / allowlist / phases)까지.

## 사고 모델 {#the-mental-model}

먼저 예술 작품을 **[DIG capsule](../concepts.md#capsule)**에 넣은 다음, 해당 capsule을 가리키는 `data_uris` / `metadata_uris`를 가진 NFT를 민팅합니다. 온체인 해시가 실제 바이트를 고정하므로 예술 작품은 콘텐츠 주소 지정 방식이며, 검증 가능하고, 영구적입니다 — 링크가 썩거나 바뀔 수 있는 것이 아닙니다.

스펜드는 **절대 직접 조립하지 않습니다**. 정본 CHIP-0035 wasm 빌더([`@dignetwork/dig-sdk/spend`](../sdk.md) 경유)가 모든 코인 스펜드를 빌드하고, 지갑이 한 번 서명하며, 한 번 브로드캐스트됩니다.

**store** 민팅은 $DIG가 들지 않고 무료입니다 — capsule이 생성될 때(예술 작품이 capsule에 기록될 때)만 **균일 capsule 가격**을 지불합니다.

## 민팅 페이지 스캐폴딩 — `nft-drop` 템플릿 {#scaffold-a-mint-page--the-nft-drop-template}

한 번의 명령으로 지갑이 연결된 드롭 페이지를 시작하세요.

```sh
digs new nft-drop
# or
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [앱 스캐폴딩](../build-a-dapp/scaffold.md)

## CLI에서 민팅하기 {#mint-from-the-cli}

에셋 CLI는 `digstore-chain` 빌더를 통해 스펜드를 빌드하고, 지갑 시드로 서명하고, 푸시합니다 — 전부 `--dry-run` / `--json`으로 CI에서 안전하게 사용할 수 있습니다.

```sh
digs did create                          # an issuer DID for attribution
digs collection create --name "My Drop"  # a CHIP-0007 collection
digs nft mint --data ./art.png --metadata ./meta.json --dry-run
digs offer make ...                       # XCH / CAT trades
```

`nft mint`의 **capsule-media** 경로는 예술 작품과 CHIP-0007 메타데이터를 capsule에 기록하고, 실제 바이트로부터 data/metadata 해시를 계산하며, URI를 해당 capsule의 `chia://` 주소로 설정합니다(https 게이트웨이 폴백 포함). → [명령어 레퍼런스](../digstore/cli/command-reference.md)

## 웹에서 민팅하기 — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

브라우저에서 capsule 기반 컬렉션을 민팅하세요. 예술 작품을 업로드하고(capsule에 기록됨), 로열티를 설정하고, 귀속을 위한 DID를 첨부합니다 — 마지막에 지갑이 서명합니다. → [DIGHUb ↗](https://hub.dig.net)

## 드롭 — reveal, allowlist, phases {#drops--reveal-allowlist-phases}

드롭 메커니즘은 **정직하게** 제시됩니다. 오늘 온체인에서 강제되는 것과, claim-coin 프리미티브를 기다리는 오프체인 편의 기능이 명확히 구분됩니다. 온체인에서 아직 증명할 수 없는 보증을 절대 제시하지 않습니다.

→ 처음부터 끝까지 이어지는 민팅 흐름은 [Chia에서 dapp 빌드하기](../build-a-dapp/tutorial.md)를 참고하세요.

## SDK로 스펜드 빌드하기 — 절대 직접 조립하지 않음 {#build-spends-with-the-sdk--never-hand-roll}

모든 코인 스펜드는 정본 CHIP-0035 wasm이 빌드하며, `@dignetwork/dig-sdk/spend`에서 재내보내기됩니다. 흐름은 항상 **빌드 → 서명 → 브로드캐스트**로 분리되어, 지갑은 오직 서명만 담당합니다.

→ [스펜드 빌드하기](../spends.md) · [DIG SDK](../sdk.md)

## 수익화 및 게이팅 — Paywall {#monetize--gate--the-paywall}

SDK의 `Paywall`은 프로바이더와 스펜드 빌더를 결합하여 **결제 후 잠금 해제**와 **NFT / 컬렉션 소유권 기반 게이팅**을 스펜드를 직접 연결하지 않고도 구현합니다.

→ [DIG SDK → Paywall](../sdk.md#paywall)

## Offer — make / take / show {#offers--make--take--show}

`digs offer make | take | show`로 NFT를 XCH나 CAT과 거래하세요(각각 `--dry-run` / `--json` 지원). → [명령어 레퍼런스](../digstore/cli/command-reference.md)

---

## 더 깊이 알아보기: 프로토콜 {#go-deeper-the-protocol}

- **"위변조가 불가능한 capsule"** → [증명과 보안](../digstore/format/proofs-and-security.md) · [capsule과 store 모델](../digstore/format/store-structure.md)
- **"스펜드를 절대 직접 조립하지 않음"** → [CHIP-0035 store-coin 스펜드와 위임](../chip-0035-spends-and-delegation.md)
- **모든 것** → [프로토콜 심층 분석](../protocol-deep-dive.md) · [개념 및 용어집](../concepts.md)
