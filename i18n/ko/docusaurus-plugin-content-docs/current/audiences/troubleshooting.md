---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "모든 실패는 서버 로그와 직접 연결되는 안정적인 코드와 request-id를 제공하며, 온체인 스펜드는 이중 지불을 방지하도록 경쟁 조건이 방지되어 있고, 명확한 사전 점검 가드가 $DIG를 쓰기 전에 낭비되는 capsule을 막아줍니다."
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

> 모든 실패는 서버 로그와 직접 연결되는 **안정적인 코드**와 **request-id**를 제공하며, 온체인 스펜드는 **경쟁 조건이 방지**되어 있어 절대 이중 지불이 발생하지 않고, 명확한 **사전 점검 가드**가 $DIG를 쓰기 전에 낭비되는 capsule을 막아줍니다.

## 사고 모델 — 코드로 실패를 찾아내기 {#the-mental-model--find-your-failure-by-its-code}

dig RPC, digstore CLI, DIGHUb, `chia://` 로더, SDK 등 모든 표면은 실패를 하나의 **안정적인(STABLE) 코드**로 매핑합니다. **메시지가 아니라 항상 코드로 분기하세요.** 하나의 통합 카탈로그가 이 모든 것을 다루며, 기계가 읽을 수 있는 형식으로도 공개되어 있습니다.

사전 점검 가드(`digstore doctor`, `--dry-run`, `--if-changed`)와 재개 가능한 앵커 덕분에, 멈추거나 아무 변화가 없는 게시 작업이 **조용히 비용을 지불하는 일은 절대 없습니다**.

## 흔한 게시 실패 {#common-publishing-failures}

잔액 부족, 컨펌 타임아웃(재개 가능 — 스펜드가 사라지지 않음), 그리고 "remote root has advanced"라는 non-fast-forward 오류.

→ [Troubleshooting](../support/troubleshooting.md)

## 읽기 및 검증 실패 {#read--verify-failures}

증명 불일치, 복호화/salt 오류, not-found / decoy 응답.

→ [읽기 및 검증 실패](../support/troubleshooting.md#verification-failed)

## 지갑 및 세션 문제 {#wallet--session-issues}

연결, 재인증, 거부된 요청, 서명할 수 없는 조회 전용(watch-only) 세션.

→ [지갑 세션이 서명할 수 없음](../support/troubleshooting.md#wallet-session)

## 사전 점검 및 비용 확인 — capsule을 낭비하지 마세요 {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor`(환경 및 준비 상태 확인), `--dry-run`(비용과 생성될 capsule을 미리보기), `--if-changed`(바이트 단위로 동일한 빌드는 아무 작업도 하지 않음).

→ [GitHub Actions에서 배포하기](../digstore/cli/deploy-from-github-actions.md) · [온체인 앵커링 → 비용과 안전성](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## 오류 코드 레퍼런스 {#error-codes-reference}

CLI 종료 코드 · RPC `-32xxx` · DIGHUb · dig-loader · SDK — 하나의 통합 표.

→ [오류 코드](../support/error-codes.md)

## FAQ {#faq}

비용, 무료 체험, 가격이 균일한 이유, $DIG를 얻는 방법, 그리고 "테스트넷이 있나요?" 등.

→ [FAQ](../support/faq.md)

## 도움 받기 {#get-help}

Discord와 GitHub, 그리고 좋은 리포트를 작성하는 방법 — **절대 비밀 정보를 붙여넣지 마세요**.

→ [도움 받기](../support/get-help.md)

## 상태 및 변경 내역 {#status--changelog}

→ [상태](../support/status.md) · [변경 내역](../support/changelog.md)

---

## 더 깊이 알아보기: 프로토콜 {#go-deeper-the-protocol}

- **읽기 및 검증 실패** → [증명과 보안](../digstore/format/proofs-and-security.md) · [URN과 암호화](../digstore/format/urns-and-encryption.md)
- **RPC `-32xxx` 코드** → [dig RPC 메서드](../rpc/methods.md) · [적합성](../rpc/conformance.md)
- **모든 것** → [프로토콜 심층 분석](../protocol-deep-dive.md) · [개념 및 용어집](../concepts.md)
