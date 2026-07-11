---
sidebar_position: 1
slug: /
title: DIG Network
description: "콘텐츠 주소 지정 방식 게시를 위한 DigStore, 블라인드 호스팅 및 검색을 위한 dig RPC, 콘텐츠 접근을 위한 DIG Browser 등 DIG Network 프리미티브 개요."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - DigStore
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network는 Chia 위에 구축된 Proof-of-Stake Layer 2**입니다 — 호스트를 신뢰하지 않고도 콘텐츠를 게시, 주소 지정, 서빙할 수 있는 탈중앙화 네트워크입니다.

이 문서는 네트워크와 그 **프리미티브**를 다룹니다: 개발자가 DIG 위에서 구축할 때 사용하는 조합 가능한 빌딩 블록입니다. 네트워크는 계속 확장되고 있으며, 더 많은 프리미티브가 시간이 지나면서 이곳에 문서화될 것입니다.

:::info $DIG가 네트워크를 움직입니다
**$DIG는 DIG Network의 엔진이자 경제입니다.** capsule 게시, store 소유, 크리에이터에게 팁 주기 등 모든 가치 교환은 $DIG를 통해 흐릅니다. 콘텐츠를 소비하는 것은 언제나 손쉽고 무료입니다 — 읽는 데는 비용이 들지 않으며, 비용은 게시와 소유에만 듭니다.
:::

## capsule {#the-capsule}

모든 프리미티브를 관통하는 하나의 개념이 있습니다. **capsule**은 하나의 불변 store 세대(generation)입니다 — `(storeId, rootHash)` 쌍이며, 정규 표기법으로 `storeId:rootHash`로 씁니다. **store는 capsule들의 시퀀스**이며, 커밋할 때마다 하나씩 생성됩니다(각 커밋은 온체인 root를 진전시키고 새로운 capsule을 생성합니다).

capsule은 다음 사항들의 네트워크 단위입니다:

- **컴파일** — 각 capsule은 하나의 고정 크기 WASM 모듈로 컴파일됩니다(콘텐츠 크기에 대해 아무것도 유출하지 않도록 패딩됩니다).
- **가격 책정** — **capsule당 균일한 가격**(mint 또는 commit)이 실시간 환율로 $DIG로 지불됩니다. store의 전체 생애 비용은 균일한 capsule당 가격 × capsule 개수입니다.
- **검색(Retrieval)** — URN은 하나의 capsule(및 그 안의 선택적 리소스)을 지정합니다.
- **캐싱** — 호스트나 브라우저는 `storeId:rootHash`를 키로 하여 capsule을 캐싱합니다. 로컬 캐시는 capsule들의 집합입니다.
- **출처 증명(Provenance)** — 각 capsule의 root는 게시자의 BLS 서명과 Merkle root를 담고 있습니다.

이는 생태계 전반의 정의입니다: "capsule = `(storeId, rootHash)`"는 DigStore, dig RPC, DIG Browser에서 모두 동일한 의미를 갖습니다.

:::tip 직접 해보기
[**DIGHUb에서 첫 번째 capsule 만들기 ↗**](https://hub.dig.net/new) — CLI 없이 브라우저에서 사이트를 게시하세요. 각 capsule(mint 또는 commit)은 **$DIG로 균일한 capsule 가격**이 듭니다.
:::

## 프리미티브 {#primitives}

### 🗄️ DigStore {#️-digstore}

가장 먼저이자 가장 근본적인 프리미티브: **콘텐츠 주소 지정 방식의 암호화된 WASM 프로젝트 포맷**입니다. 빌드 디렉터리를 지정하면 Git처럼 배포를 커밋할 수 있고, 결과물로 데이터이자 접근을 통제하는 서버 역할을 동시에 하는 단일 자기방어형 `.wasm` 파일을 얻습니다. URN 자체가 *곧* 키입니다 — 위치를 찾아내는 동시에 복호화도 수행합니다.

→ **[DigStore 살펴보기](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[DigStore란?](./digstore/what-is-digstore.md)** | 한마디로 정리한 단일 파일 아이디어 |
| **[포맷](./digstore/format/overview.md)** | 프로젝트, 배포, URN, 암호화, 증명 |
| **[CLI 튜토리얼](./digstore/cli/quickstart.md)** | 프로젝트에서 `digstore` 설치 및 사용하기 |

### 🛰️ dig RPC {#️-dig-rpc}

네트워킹 프리미티브: **호스팅된 DigStore 배포에서 콘텐츠를 읽기 위한 표준 인터페이스**입니다. HTTPS `POST` 위의 JSON-RPC 2.0으로, 모든 호스팅 노드가 동일하게 구현하므로 콘텐츠는 이식 가능하고 클라이언트는 노드에 구애받지 않습니다. retrieval key로 암호문 + 포함 증명(inclusion proof)을 서빙하고, `(store_id, root)`로 전체 배포를 서빙하며, 공개 검색용 매니페스트도 제공합니다 — 청크 단위로 스트리밍되고, 구조적으로 블라인드이며, 검증과 복호화는 전적으로 클라이언트 측에서 이루어집니다.

→ **[dig RPC 살펴보기](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[dig RPC란?](./rpc/what-is-the-dig-rpc.md)** | 네트워크 전체 읽기 경로를 위한 단일 엔드포인트 |
| **[메서드](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[스트리밍](./rpc/streaming.md)** | 청크 모델, 재조립, 증명 검증 |
| **[적합성 & 보안](./rpc/conformance.md)** | 블라인드 모델, CORS, 노드가 구현해야 하는 사항 |

### 🌐 DIG Browser {#-dig-browser}

클라이언트 프리미티브: **Chia 지갑이 내장된 브라우저**입니다. 모든 페이지에 `window.chia` 프로바이더를 주입하므로, 어떤 웹 앱이든 WalletConnect 설정 없이 사용자의 주소, 서명, 지출을 요청할 수 있습니다 — 이미 CHIP-0002를 지원하는 앱을 위한 즉시 사용 가능한 대안입니다. 또한 `chia://` 콘텐츠 주소를 직접 해석(resolve)합니다.

→ **[DIG Browser를 대상으로 빌드하기](./browser/using-window-chia.md)**

| | |
|---|---|
| **[앱에서 `window.chia` 사용하기](./browser/using-window-chia.md)** | 주입된 지갑을 감지하고, 연결하고, CHIP-0002 메서드를 호출하기 |

:::tip 직접 해보기
[**DIG Browser 받기 ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — `chia://` 콘텐츠를 열고 내장 지갑을 사용하려면 브라우저를 다운로드하세요.
:::

*정산(settlement)과 노드 운영 등 더 많은 프리미티브가 준비되는 대로 각자의 섹션을 갖게 될 것입니다.*

## 경로 선택하기 {#pick-your-path}

이 문서는 **여러분이 하려는 작업**을 중심으로 구성되어 있습니다. 각 트랙은 10초짜리 "왜"로 시작해, 필요한 사고 모델과 핵심 신호가 되는 사용법을 안내한 다음, 더 깊이 알고 싶을 때 프로토콜로 연결됩니다.

- **[본인 소유의 사이트나 앱 게시하기](./audiences/app-developers.md)** — 웹사이트/앱을 여러분 자신의 온체인 자산으로 배포하세요. 무료로 빌드하고 capsule을 게시하세요.
- **[NFT 및 컬렉션 발행](./audiences/nft-developers.md)** — 영구적이고 변조 감지가 가능한 capsule로 뒷받침되는 CHIP-0007 드롭.
- **[앱에 DIG 통합하기](./audiences/integration-developers.md)** — 타입이 지정된 SDK와 완전히 기계 판독 가능한 플랫폼.
- **[노드 운영하기](./run-a-node/index.md)** — 검증 가능하고 프로바이더-블라인드 방식으로 콘텐츠를 서빙하세요.
- **[chia:// 콘텐츠 열기](./audiences/content-consumers.md)** — 여러분의 브라우저가 체인에 대해 직접 검증하는 콘텐츠를 읽으세요.
- **[막혔을 때](./audiences/troubleshooting.md)** — 안정적인 코드로 문제를 찾으세요.

용어가 낯설다면? [개념 & 용어집](./concepts.md)을 훑어보세요. 전체 설계를 알고 싶다면 [프로토콜 심층 분석](./protocol-deep-dive.md)을 읽어보세요.

:::note
DIG Network와 그 프리미티브는 오픈 소스입니다. DigStore는 GPL-2.0 라이선스로 배포됩니다. [digstore 저장소](https://github.com/DIG-Network/digstore)를 참고하세요.
:::

## 관련 문서 {#related}

- [빠른 시작](./quickstart.md) — 첫 번째 사이트를 게시하세요. 빌드와 미리보기는 무료입니다
- [Chia에서 dapp 빌드하기](./build-a-dapp/tutorial.md) — 하나의 엔드투엔드 튜토리얼에 담긴 모든 프리미티브
- [개념 & 용어집](./concepts.md) — DIG의 핵심 엔티티를 정의하고 연결한 문서
- [DigStore란?](./digstore/what-is-digstore.md) — 콘텐츠 주소 지정 방식의 store 포맷
- [dig RPC란?](./rpc/what-is-the-dig-rpc.md) — 네트워크 전역 읽기 인터페이스
- [chia:// 프로토콜](./browser/chia-protocol.md) — DIG Browser에서 콘텐츠 열기
- [도움 받기](./support/get-help.md) — 커뮤니티, 문제 해결, 오류 코드
