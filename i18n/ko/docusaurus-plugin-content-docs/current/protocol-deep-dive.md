---
sidebar_position: 1
title: "Protocol: Overview"
description: "DIG 프로토콜을 하위에서 상위로 이어지는 7개 레이어로 정리한 규범적/구현 정의 문서. capsule(storeId:rootHash)이 기본 단위이며, 호스트는 내용을 알지 못하고 리더가 체인을 기준으로 검증합니다. 이 문서가 권위 있는 프로토콜 레퍼런스입니다."
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

이 문서는 DIG 프로토콜의 **규범적 명세(normative specification)**이며, 하위에서 상위로 이어지는 **7개 레이어**로 정의됩니다. 각 레이어는 자신의 **정규 크레이트/파일**을 규범적 참조로 명시합니다.

:::info 이 문서가 권위 있는 프로토콜 레퍼런스입니다
이 섹션은 네트워크가 실제로 무엇을 하는지에 대한 진실의 원천(source of truth)입니다. 실제로 동작하는 프로토콜을 정규 구현에 대한 `file:line` 인용과 함께 문서화합니다.
:::

## 기본 단위: capsule {#the-fundamental-unit-the-capsule}

모든 레이어를 관통하는 하나의 개념이 있습니다. 바로 **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`이며, 정규 표기로는 `storeId:rootHash`입니다. **store**는 커밋마다 하나씩 생성되는 capsule들의 순서 있는 시퀀스(오래된 것 → 최신 것)이며, 그 식별자인 `store_id`는 Chia 상의 CHIP-0035 DataLayer 싱글톤 launcher id *그 자체*입니다. 식별(identity), 컴파일, 가격 책정, 검색(retrieval), 캐싱, 출처 증명(provenance)은 모두 **capsule 단위**로 정의됩니다.

## 핵심 명제: 내용을 모르는 호스트, 클라이언트 측 검증, 체인에 고정된 root {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **내용을 모르는 호스트(Blind host).** 호스트는 해시로 키가 매겨진 불투명한 암호문만 보관합니다. URN도 키도 갖고 있지 않으며, capsule 자체의 출력을 그대로 중계할 뿐 히트인지 미스인지도 구분하지 못합니다. 와이어에는 `decoy` 필드가 없으며 CDN도 없습니다 — 콘텐츠는 오직 [dig RPC](./protocol/dig-rpc.md)를 통해서만 제공됩니다.
- **클라이언트 측 검증(Client-side verify).** 모든 바이트는 리소스별 머클 포함 증명(merkle inclusion proof)을 사용해 리더의 기기에서 온체인 root와 대조 검증된 후, 인증 복호화(authenticated-decrypt)됩니다. 신뢰는 결코 서빙하는 origin에 의존하지 않습니다.
- **체인에 고정된 root(Chain-anchored root).** 신뢰할 수 있는 root는 **오직** Chia 상의 CHIP-0035 싱글톤(coinset.org를 통해 확인)에서만 오며, 서빙된 "최신본"에서 오지 않습니다.

## 7개 레이어 {#the-seven-layers}

| # | 레이어 | 정의하는 내용 | 정규 참조 |
|---|---|---|---|
| 0 | [식별 및 네이밍](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN 및 주소 지정](./protocol/urn-and-addressing.md) | `urn:dig:chia:…` 문법; root가 없는 `retrieval_key` | `digstore-core::urn`, `lib.rs` |
| 1 | [암호화](./protocol/cryptography.md) | HKDF KDF; AES-256-GCM-SIV 봉인 | `digstore-core::crypto` |
| 1 | [머클 포함 증명](./protocol/merkle-proofs.md) | D5 리소스별 리프; NODE_TAG 폴드 | `digstore-core::merkle` |
| 1 | [BLS 서명 및 DST](./protocol/bls-signatures.md) | Chia AugScheme; 5개 역할별 DST | `digstore-crypto::bls` |
| 2 | [capsule 포맷](./protocol/capsule-format.md) | DIGS 데이터 섹션(BINDING D1) | `digstore-core::datasection` |
| 2 | [자기 방어 모듈](./protocol/self-defending-module.md) | 고정 크기 난독화; 서빙 게스트 | `digstore-compiler`, `digstore-guest` |
| 4 | [온체인 앵커링](./protocol/on-chain-anchoring.md) | store = 싱글톤; capsule = root 전진 | `chip35_dl_coin`, `digstore-chain` |
| 4 | [DIG CAT 결제 및 가격 책정](./protocol/dig-cat-payment.md) | capsule 단위, 동적, USD 연동 | `chip35_dl_coin::dig` |
| 6 | [dig RPC](./protocol/dig-rpc.md) | 머신 인터페이스(JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [§21 전송 및 push](./protocol/transport-and-push.md) | `dig://` 로케이터, REST, push v1 | `digstore-remote` |
| 7 | [DIG 노드 피어 네트워크](./protocol/peer-network.md) | mTLS 피어 식별, NAT 통과, STUN, introducer, relay wire, 피어 RPC | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [검증 및 출처 증명](./protocol/verification-and-provenance.md) | 4단계 순차 무결성 게이트 | `digstore-core::merkle`, `dig-node` |
| 6 | [내용을 모르는 호스트 모델](./protocol/blind-host-model.md) | 프로바이더 블라인드성; 리졸버; `/v1` 컨트롤 플레인 | hub `retrieval`/`resolver`/`api` |
| — | [정합성 및 패리티](./protocol/conformance-and-parity.md) | 구현 간 패리티 규율 | 고정된 골든 데이터, OpenRPC diff |

(레이어 3과 §21 전송은 읽기 경로와 서로 얽혀 있습니다. 표는 리더가 이를 마주치는 지점을 기준으로 그룹화한 것입니다. 전체 레이어 번호 체계는 각 페이지에 명시되어 있습니다.)

## capsule이 레이어를 거쳐 흘러가는 과정 {#how-a-capsule-flows-through-the-layers}

퍼블리셔는 콘텐츠를 **청크로 나누고 암호화**(L1)하여 **capsule 포맷**(L2)으로 만들고, 이는 **스스로를 서빙**(L3)하며, **온체인 앵커링**(L4)을 거쳐, **§21 전송**(L5)으로 push됩니다. 클라이언트는 dig RPC를 통해 이를 **읽고**, 체인에 고정된 root를 기준으로 전적으로 클라이언트 측에서 **검증**합니다(L6). 모든 암호학적 상수는 producer, host, verifier가 공유하는 **단 하나**의 정의를 가집니다 — 이것이 [C8 패리티 불변식](./protocol/conformance-and-parity.md)입니다.

## 용어 {#terminology}

- **`chia://`** — 네트워크의 **콘텐츠** 주소(브라우저가 여는 대상).
- **`dig://`** — §21 **전송** 로케이터(CLI/피어 플레인)이자 DIG Browser의 내부 페이지 스킴 — 서로 다른 두 가지 용도이며, 결코 콘텐츠 주소가 아닙니다.
- **`urn:dig:`** — 두 스킴이 모두 파생되는 URN 네임스페이스.
- **store / capsule** — 식별자와 그 불변의 세대(generation).
- **$DIG** — capsule마다 지불되는 CAT; **DigStore** — store 포맷.

## 관련 문서 {#related}

- [개념 및 용어집](./concepts.md) — 모든 개체를 한 번씩 정의
- [식별 및 네이밍](./protocol/identity-and-naming.md) — 명세가 시작되는 레이어 0
- [dig RPC](./protocol/dig-rpc.md) — 프로토콜의 머신 인터페이스
- [DIG 노드 피어 네트워크](./protocol/peer-network.md) — 노드들이 서로를 찾고 연결하는 방법(mTLS, NAT 통과, relay)
- [정합성 및 패리티](./protocol/conformance-and-parity.md) — 구현 간 패리티 규율
