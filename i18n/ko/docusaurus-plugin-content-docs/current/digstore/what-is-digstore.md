---
sidebar_position: 1
title: dig-store란?
description: "내장 암호화와 URN 기반 주소 지정을 갖춘 Git 형태의 콘텐츠 주소 지정 방식 프로젝트 포맷으로, 단일 자기방어형 WebAssembly 모듈로 컴파일됩니다."
keywords:
  - dig-store
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# dig-store란? {#what-is-digstore}

**dig-store는 Git 형태의, 암호화된, 콘텐츠 주소 지정 방식 프로젝트로, 단일 자기방어형 WebAssembly 모듈로 컴파일됩니다.**

`init`, `add`, `commit`, `log`, `clone`, `push`, `pull` 같은 Git 스타일의 명령어를 사용하지만, 프로젝트는 **저장 시 암호화**되어 있고 **하나의 `.wasm` 파일**로 컴파일됩니다. 그 단일 파일이 *곧* 여러분의 데이터이자 접근을 통제하는 서버입니다. 이를 저장하거나 중계하는 호스트는 해시로 주소 지정된 암호문만을 볼 뿐, 무엇을 담고 있는지 읽을 수 없습니다.

콘텐츠는 **[URN](./format/urns-and-encryption.md)**으로 주소를 지정하며, URN 자체가 *곧* 키입니다: 위치를 찾아내는 동시에 복호화도 수행합니다. 누군가에게 URN을 건네면 그 사람은 해당 리소스를 읽을 수 있고, URN이 없으면 읽을 수 없습니다 — 별도로 관리해야 할 비밀번호나 접근 목록이 없습니다.

Git과 달리 dig-store는 저장소 소스가 아니라 **빌드 결과물**을 위해 만들어졌습니다. `dist/`와 같은 디렉터리를 프로젝트에 지정하면 그곳에 있는 내용을 캡처합니다.

## 왜 존재하는가 {#why-it-exists}

| 문제 | dig-store의 답 |
|---|---|
| 호스트가 게시한 내용을 읽거나 스캔할 수 있음 | 콘텐츠는 저장 시 암호화되며, 호스트는 해시로 키가 지정된 암호문만 보유합니다 |
| 접근 제어를 위해 비밀번호와 ACL이 필요함 | URN 자체가 *곧* 권한입니다 — 공유하면 읽기를 허용하고, 보류하면 거부합니다 |
| 서버가 진짜 바이트를 서빙한다고 신뢰해야 함 | `clone`/`pull`은 설치 전에 모듈의 store id, 게시자의 서명된 root, **온체인 싱글톤 root**를 검증합니다 — 실패 시 폐쇄적으로 처리됩니다(fails closed) |
| "이 페이로드는 얼마나 큰가?"가 파일 크기에서 유출됨 | 모든 프로젝트는 하나의 `.wasm`이며, 내용에 대해 아무것도 드러내지 않도록 균일한 크기로 패딩됩니다 |
| 서빙 로직이 데이터와 별도로 존재함 | 데이터와 이를 통제하는 코드가 *동일한* 모듈로 컴파일됩니다 |

## 이 문서 읽는 방법 {#how-to-read-these-docs}

- **[dig-store 포맷](./format/overview.md)** — 개념들: 프로젝트, 배포, `.wasm` 모듈, URN, 암호화, 증명. dig-store가 *무엇인지* 이해하고 싶다면 여기서 시작하세요.
- **[CLI 튜토리얼](./cli/install.md)** — CLI를 설치하고 실제 프로젝트에서 사용하기: 프로젝트 초기화, 빌드 디렉터리 캡처, 배포 커밋, 원격을 통한 공유, 콘텐츠 스트리밍.

바로 시도해보고 싶다면 **[빠른 시작](../quickstart.md)**(무료 웹 우선 경로) 또는 **[CLI 튜토리얼](./cli/quickstart.md)**로 바로 이동하세요.

:::note
dig-store는 [DIG Network](https://dig.net)의 일부입니다. 전체 기술 설계는 [프로토콜 섹션](../protocol-deep-dive.md)에 있습니다 — 콘텐츠 주소 지정 방식 WASM store 포맷입니다.
:::

## 관련 문서 {#related}

- [dig-store 포맷](./format/overview.md) — 프로젝트, WASM 모듈, URN, 암호화, 증명
- [store 구조](./format/store-structure.md) — store 정체성, generation, 컴파일된 모듈
- [URN & 암호화](./format/urns-and-encryption.md) — 주소도 지정하고 복호화도 하는 URN
- [CLI 튜토리얼](./cli/quickstart.md) — 몇 분 안에 store를 생성, 커밋, 읽기
- [개념 & 용어집](../concepts.md) — DIG 핵심 엔티티 한눈에 보기
