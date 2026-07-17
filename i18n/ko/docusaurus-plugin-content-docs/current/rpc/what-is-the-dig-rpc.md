---
sidebar_position: 1
title: dig RPC란?
description: "JSON-RPC 2.0을 통해 dig-store capsule을 읽기 위한 네트워크 전역 읽기 인터페이스; 구조적으로 블라인드이며, 신뢰 없이 검증 가능하고, 어떤 크기든 스트리밍할 수 있습니다."
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

# dig RPC란? {#what-is-the-dig-rpc}

:::info 규범적 스펙
이 페이지는 개요 페이지입니다. 메서드, 청크 wire 객체, 노드 프로필, OpenRPC 문서를 포함한 권위 있는
기계 인터페이스 스펙은 [프로토콜 · dig RPC](../protocol/dig-rpc.md)에 있습니다.
:::

**dig RPC는 호스팅된 dig-store `.dig` capsule에서 콘텐츠를 직접 읽기 위한 네트워크 전역 인터페이스입니다.** 이는 HTTPS `POST` 위에서 이야기되는 [JSON-RPC 2.0](https://www.jsonrpc.org/specification) 서비스입니다.

capsule을 호스팅하는 모든 노드 — `https://rpc.dig.net`의 레퍼런스 노드든, 어떤 서드파티 노드든 — 는 **동일한 메서드를 동일한 시맨틱으로** 노출합니다. 이 인터페이스를 대상으로 작성된 클라이언트는 하나의 엔드포인트를 통해 네트워크 전체를 읽습니다. CDN은 존재하지 않습니다. DIG의 모든 콘텐츠 서빙은 dig RPC를 통해 이루어집니다.

세 가지를 서빙합니다:

| 여러분이 가진 것… | 여러분이 호출하는 것… | 돌려받는 것… |
|---|---|---|
| 리소스의 **retrieval key** (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | 리소스의 암호문 + merkle 포함 증명(및 ZK 실행 증명), 청크 단위로 스트리밍됨 |
| **store id + generation root** | [`dig.getCapsule`](./methods.md#diggetcapsule) | 해당 generation 전체의 `.dig` capsule, 청크 단위로 스트리밍됨 |
| **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | 공개 검색용 매니페스트 / store 메타데이터 매니페스트 / store의 확정된 generation 목록 |

## 이를 정의하는 세 가지 속성 {#three-properties-that-define-it}

- **구조적으로 블라인드.** 노드는 해시로 키가 지정된 불투명한 암호문을 서빙합니다. URN, 복호화 키, 평문을 절대 보지 않습니다. 요청이 매치되지 않으면 결정론적이고 구별 불가능한 **decoy** 스트림으로 응답합니다 — 절대 `404`가 아닙니다 — 따라서 읽기 경로가 존재 여부를 판별하는 오라클이 되는 일이 없습니다. 모든 복호화와 모든 증명 검증은 클라이언트에서 이루어집니다.
- **신뢰 없이 검증 가능.** 모든 실제 바이트는 온체인 generation root에 뿌리를 둔 merkle **포함 증명(inclusion proof)**과 함께 도착합니다. 클라이언트는 증명을 root까지 접어(fold) 자신이 신뢰하는 root와 일치할 때만 받아들입니다. 노드가 진짜 바이트를 반환했다고 신뢰할 필요가 없습니다.
- **어떤 크기든 스트리밍 가능.** 콘텐츠는 명시적인 연속(continuation)을 갖는, 64 KiB 단위로 정렬된 유한 청크로 읽힙니다. 1킬로바이트짜리 리소스와 100메가바이트짜리 capsule은 동일한 루프로 읽히며, 어떤 단일 응답도 무한하지 않습니다.

## dig-store와 어떻게 맞물리는가 {#how-it-fits-with-digstore}

dig-store는 **포맷**을 제공합니다: 콘텐츠 주소 지정 방식의 암호화된 store로, 단일 자기방어형 `.wasm` capsule로 컴파일되며, URN으로 주소가 지정되고 *URN 자체가 곧 키*입니다. dig RPC는 그 capsule이 호스트를 신뢰하지 않고도 네트워크에서 **서빙되는 방법**입니다:

1. store를 컴파일하고 generation을 온체인에(CHIP-0035 DataLayer 싱글톤으로) 고정합니다. **콘텐츠 root**가 신뢰 앵커입니다.
2. 노드가 capsule을 호스팅하고 dig RPC로 노출합니다.
3. 리더(reader)는 `retrieval_key = sha256(urn)`을 도출하고, `dig.getContent`를 호출하고, 스트리밍된 암호문을 재조립하고, **온체인 root에 대해 포함 증명을 검증**하고, **URN에서 도출한 키로 복호화**합니다 — 이 모든 과정이 클라이언트 측에서만 이루어집니다.

노드는 오직 해시만을 알았을 뿐, 자신이 무엇을 서빙했는지는 전혀 알지 못했습니다.

## 한 번의 호출로 읽기 {#a-read-in-one-call}

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

클라이언트는 `complete`가 될 때까지 `next_offset`을 반복하고, 재조립된 바이트에 대해 `root`를 기준으로 `inclusion_proof`를 검증한 다음 복호화합니다. `"decoy": true`인 결과는 *찾을 수 없음*을 의미합니다 — 중단하고 그렇게 보고하세요.

## 이 문서 읽는 방법 {#how-to-read-these-docs}

- **[메서드](./methods.md)** — 전체 메서드 집합(`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), 각각의 파라미터와 결과.
- **[공개 네트워크 RPC 사용하기](./public-network-rpc.md)** — 클라이언트를 `rpc.dig.net`(또는 어떤 노드든)으로 지정하기, 엔드포인트, 직접 운영하기.
- **[스트리밍](./streaming.md)** — 청크 모델, 재조립, 증명 검증, 레퍼런스 클라이언트 루프.
- **[적합성](./conformance.md)** — 네트워크 읽기 경로의 구성원이 되기 위해 노드가 반드시 구현해야 하는 것, 그리고 CORS, 오류, 블라인드 모델 전체.

:::note
dig RPC는 [DIG Network](https://dig.net)의 일부입니다. 전체 규범적 명세는 네트워크 콘텐츠 인터페이스인 [프로토콜 · dig RPC](../protocol/dig-rpc.md) 섹션에 있습니다.
:::

## 관련 문서 {#related}

- [메서드](./methods.md) — 모든 dig RPC 메서드, 파라미터, 결과
- [스트리밍](./streaming.md) — 청크 모델, 재조립, 증명 검증
- [적합성 & 보안](./conformance.md) — 블라인드 모델과 노드가 구현해야 하는 것
- [URN & 암호화](../digstore/format/urns-and-encryption.md) — 모든 retrieval key의 근간이 되는 URN
- [개념 & 용어집](../concepts.md) — dig RPC, capsule, retrieval key 정의
