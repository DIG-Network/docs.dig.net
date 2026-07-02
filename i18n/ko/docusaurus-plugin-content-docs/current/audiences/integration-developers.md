---
sidebar_position: 3
title: For integration developers
description: "완전히 기계가 읽을 수 있는 플랫폼입니다 — OpenAPI/OpenRPC, 체계화된 오류 분류 체계, 실시간 가격 정보, JWKS, 페이지별 JSON, 그리고 타입이 지정된 @dignetwork/dig-sdk를 통해, 사람이 쓴 문장을 한 줄도 스크래핑하지 않고 지갑과 검증된 읽기 기능을 앱에 연결할 수 있습니다."
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

> **완전히 기계가 읽을 수 있는 플랫폼입니다** — OpenAPI/OpenRPC, 체계화된 오류 분류 체계, 실시간 가격 정보, JWKS, 페이지별 JSON, 그리고 타입이 지정된 `@dignetwork/dig-sdk`를 통해, **사람이 쓴 문장을 한 줄도 스크래핑하지 않고** 지갑과 검증된 읽기 기능을 앱에 연결할 수 있습니다.

## 핵심 개념 — 분리된 두 개의 표면 {#the-mental-model--two-surfaces-kept-separate}

1. **REST 컨트롤 플레인** — `hub.dig.net/v1`, bearer-JWT 방식 — store, 도메인, 팀, NFT 관리용.
2. **노드에 종속되지 않는 dig JSON-RPC 2.0 읽기 경로** — `rpc.dig.net` — **검증된 암호문(ciphertext)**을 스트리밍합니다.

두 가지 전송 방식 위에 하나의 **지갑** 표면([CHIP-0002 `window.chia`](../concepts.md#window-chia))이 있습니다 — injected 방식(DIG Browser)이든 WalletConnect → Sage 방식이든, SDK의 `ChiaProvider`로 통합됩니다. 스펜드는 항상 정규 CHIP-0035 wasm이 빌드하고 사용자의 지갑이 서명합니다 — **직접 작성(hand-rolled)하지 않습니다**. 프로세스 분기는 항상 **안정된 오류 코드**를 기준으로 하며, 문장을 기준으로 하지 않습니다.

## dapp 만들기 — 처음부터 끝까지 {#build-a-dapp--end-to-end}

스캐폴딩부터 여러분 자신의 도메인에서 동작하는 지갑 연동 앱까지 이어지는 단일 흐름입니다.

→ [Chia에서 dapp 만들기](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, 그리고 `/spend` 서브패스에 재노출된 정규 스펜드들. 설치 방법, 서브패스, `capabilities()`를 다룹니다.

→ [DIG SDK](../sdk.md)

## 지갑 연결하기 — `window.chia` {#connect-a-wallet--windowchia}

주입된 프로바이더를 감지하고, `connect()`를 호출하며(출처별 동의), CHIP-0002 메서드를 사용합니다.

→ [window.chia 사용하기](../browser/using-window-chia.md) · 명세: [window.chia 프로바이더](../protocol/window-chia-provider.md)

## 검증된 콘텐츠 읽기 — `DigClient` + dig RPC 메서드 {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient`는 암호문과 포함 증명(inclusion proof)을 스트리밍하고 클라이언트 측에서 **검증 후 복호화**합니다. 필요할 때는 메서드를 직접 호출할 수도 있습니다.

→ [dig RPC란 무엇인가요?](../rpc/what-is-the-dig-rpc.md) · [메서드](../rpc/methods.md)

## 스트리밍 및 재조립 {#streaming--reassembly}

청크 모델, [retrieval key](../concepts.md#retrieval-key), 그리고 검증 후 복호화 순서를 다룹니다.

→ [스트리밍](../rpc/streaming.md)

## 스펜드 빌드하기 — 정규 CHIP-0035 빌더 {#building-spends--the-canonical-chip-0035-builder}

**빌드 → 서명 → 브로드캐스트**의 분리 구조입니다: wasm이 스펜드 번들을 빌드하고, 지갑이 서명하며, 여러분이 브로드캐스트합니다. hub도 결코 스펜드를 직접 작성하지 않으며, 여러분도 그래서는 안 됩니다.

→ [스펜드 빌드하기](../spends.md)

## hub `/v1` 컨트롤 플레인 {#the-hub-v1-control-plane}

인증(JWT / OIDC / 디바이스 페어링), store, 도메인, 분석, REST를 통한 웹훅을 다룹니다.

→ OpenAPI 문서는 [기계가 읽을 수 있는 표면](../machine-surfaces.md#openapi)을 참고하세요.

## CI 배포 — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

모드, keyless OIDC, 결과 열거형(outcome enum), 그리고 다운스트림 단계를 위한 `--json` 출력을 다룹니다.

→ [GitHub Actions에서 배포하기](../digstore/cli/deploy-from-github-actions.md)

## 기계가 읽을 수 있는 표면 {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — 문장을 스크래핑하지 않고 발견하고 통합할 수 있습니다.

→ [기계가 읽을 수 있는 표면](../machine-surfaces.md)

## 오류 코드 — 코드를 기준으로 분기하기 {#error-codes--branch-on-the-code}

dig RPC, CLI, DIGHUb, dig 로더, SDK 전반을 아우르는 하나의 통합 레퍼런스입니다.

→ [오류 코드](../support/error-codes.md)

---

## 더 깊이 알아보기: 프로토콜 {#go-deeper-the-protocol}

- **"검증된 읽기"** → [dig RPC(네트워크 콘텐츠 인터페이스)](../rpc/what-is-the-dig-rpc.md) · [포함 증명 vs 실행 증명](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [규범적 프로바이더 명세](../protocol/window-chia-provider.md)
- **"retrieval_key 및 스트리밍"** → [URN 및 암호화](../digstore/format/urns-and-encryption.md#two-values-one-string) · [스트리밍](../rpc/streaming.md)
- **"배포 토큰은 취소 가능한 writer 키입니다"** → [CHIP-0035 스펜드 및 위임](../chip-0035-spends-and-delegation.md)
- **모든 것** → [프로토콜 심화](../protocol-deep-dive.md) · [개념 및 용어집](../concepts.md)
