---
sidebar_position: 2
title: 빠른 시작
description: "DIG에서 첫 번째 사이트를 게시하세요 — 빌드와 미리보기는 무료이며, 게시할 때만 균일한 capsule 가격을 지불합니다. 지갑 없이 시작하는 웹 우선 경로와 병행 가능한 CLI 트랙을 제공합니다."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# 빠른 시작 {#quickstart}

호스트가 읽거나, 변경하거나, 내릴 수 없는 네트워크에 사이트를 게시하세요 — 약 10분이면 됩니다.

**빌드와 미리보기는 무료입니다.** 스캐폴딩과 미리보기는 비용이 전혀 들지 않으며, 온체인에 [capsule](./concepts.md#capsule)을 게시하는 순간에만 **$DIG로 균일한 capsule 가격**을 지불합니다. *무료로 반복 작업하고, 준비되었을 때 게시하세요.*

두 가지 방법이 있습니다. 대부분의 사람들은 웹에서 시작합니다.

- **[A. 웹에서 게시하기](#a-publish-from-the-web)** — [DIGHUb](./concepts.md#dighub)에서 마지막에 지갑을 연결합니다. 사이트와 프런트엔드에 최적입니다. 약 10분.
- **[B. CLI에서 게시하기](#b-publish-from-the-cli)** — 여러분의 머신에서 `digstore`를 사용합니다. 스크립트화 가능하고 CI에 적합합니다. 개발자와 자동화에 최적입니다.

---

## A. 웹에서 게시하기 {#a-publish-from-the-web}

가장 빠른 경로: 브라우저에서 빌드하고 미리보기한 뒤, 최종 단계에서만 지갑에 자금을 채웁니다.

### 1. DIGHUb를 열고 초안을 시작하세요 — 무료, 지갑 불필요 {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**DIGHUb에서 새 store 시작하기 ↗**](https://hub.dig.net/new). 빌드된 사이트(정적 파일 폴더 — `dist/` 또는 `build/`)를 드롭하세요. DIGHUb는 실제로 어떻게 서빙될지 정확히 보여주는 **무료 초안 미리보기**를 제공하며, 온체인에는 아무것도 기록되지 않고 $DIG도 지출되지 않습니다.

아직 지갑이 필요하지 않습니다. 초안을 원하는 만큼 반복 작업하세요 — 재업로드, 재미리보기 — 완전히 무료입니다.

### 2. 실제 읽기 경로에서 미리보기하기 — 여전히 무료 {#2-preview-it-on-the-real-read-path--still-free}

미리보기는 진짜 DIG 파이프라인(암호화 → 컴파일 → 검증 → 복호화)을 통해 사이트를 렌더링하므로, 여러분이 보는 것이 곧 방문자가 얻는 것입니다. 클릭해보고, 에셋과 라우팅을 확인하세요. 여러분이 선택하기 전까지는 아무것도 게시되지 않고 아무것도 지출되지 않습니다.

### 3. 게시하기 — 자금을 채우고 지갑 연결하기 {#3-publish--fund-and-connect-a-wallet}

초안이 마음에 들면 **게시**를 누르세요. 비용이 발생하는 유일한 단계입니다:

- Chia 지갑을 연결하세요(여러분의 지갑이 *곧* 계정입니다 — 이메일도, 비밀번호도 필요 없습니다).
- 온체인 지출을 승인하세요: **$DIG로 균일한 capsule 가격 + 소액의 XCH 수수료**를 한 번의 서명으로 처리합니다. 게시 화면은 서명 전에 정확한 $DIG 금액을 보여줍니다.
- DIGHUb가 여러분의 store를 발행(mint)하고 Chia 메인넷에 첫 번째 **capsule**을 게시합니다.

DIG가 부족한가요? 게시 화면은 여러분의 잔액과 충전 방법을 보여줍니다. [DIG 구하는 곳](./digstore/cli/onchain-anchoring.md#where-to-get-dig)을 참고하세요 — TibetSwap, dexie.space, 또는 9mm.pro.

### 4. 이제 라이브 상태입니다 {#4-youre-live}

여러분의 capsule은 이제 온체인에 고정(anchor)되었고 **[dig RPC](./concepts.md#dig-rpc)를 통해 즉시 읽을 수 있습니다** — 누구든지 [`urn:dig:` URN](./concepts.md#urn) 또는 [`chia://`](./browser/chia-protocol.md) 주소로 가져와서 검증할 수 있으며, 등록도 필요 없고 추가로 지불할 것도 없습니다. URN은 주소이자 키입니다 — 콘텐츠를 공유하려면 URN을 공유하세요. 읽기 경로는 보편적이고 무료이며, capsule이 확정되는 순간 즉시 라이브 상태가 됩니다.

**사람이 읽기 쉬운 `*.on.dig.net` 주소를 원하시나요?** 이는 선택 사항입니다. store는 DIGHUb에서 **핸들을 등록**할 때만 `*.on.dig.net` 서브도메인을 얻습니다 — 별도의 유료 등록 절차로, store를 해당 이름에 고정합니다. 핸들을 등록하기 전까지는 `*.on.dig.net` URL이 존재하지 않습니다(위의 URN / `chia://` 주소가 항상 정식으로 접근하는 방법입니다). [내 도메인을 사용할 수 있나요?](./support/faq.md#can-i-use-my-own-domain)를 참고하세요.

**나중에 업데이트를 게시하려면:** 편집하고, 새 초안을 무료로 미리보기한 다음, 다시 게시하세요. 게시된 업데이트마다 새로운 capsule이 생성되며 다시 **균일한 capsule 가격**이 듭니다 — 초안을 영구적인 온체인 버전으로 승격할 때만 비용을 지불합니다.

:::tip 자동화하기
store가 존재하면 [GitHub Actions에서 배포하기](./digstore/cli/deploy-from-github-actions.md)를 연결해서 `main`에 푸시할 때마다 새로운 capsule이 게시되도록 하세요 — git-push-to-deploy 방식입니다.
:::

---

## B. CLI에서 게시하기 {#b-publish-from-the-cli}

터미널에서 진행하는 동일한 흐름으로, 스크립트화 가능하며 CI의 기반이 됩니다. CLI는 웹 경로를 그대로 반영합니다: 빌드와 미리보기는 비용이 들지 않고, capsule을 게시할 때만 $DIG로 균일한 capsule 가격이 듭니다.

### 1. 설치 {#1-install}

```sh
# Releases 페이지에서 여러분의 OS용 설치 프로그램을 다운로드한 다음:
digstore --version
```

OS별 설치 프로그램과 소스에서 빌드하는 방법은 [CLI 설치하기](./digstore/cli/install.md)를 참고하세요.

### 2. 스캐폴딩 및 미리보기 — 무료, 체인 없음, 지출 없음 {#2-scaffold-and-preview--free-no-chain-no-spend}

지출하기 전에 프로젝트를 스캐폴딩하고 로컬에서 미리보기하세요 — **무료, mint 없음, 체인 없음**:

```sh
digstore new <template>   # 지갑이 연결된 프로젝트를 스캐폴딩합니다 (static · vite-react · next-static · nft-drop · dapp-window-chia) — 무료, mint 없음
digstore dev              # 저장 시 컴파일 + 감시(watch) + 주입된 window.chia로 실제 chia:// 읽기 경로 서빙 — 무료, 라이브 리로드
```

`new`는 실행 가능한 프로젝트(`dig.toml` + 스타터 앱)를 작성합니다. `dev`는 진짜 DIG 읽기 경로(컴파일 → 검증 → 복호화)를 통해 라이브 리로드로 프로젝트를 서빙합니다. 게시할 때만(다음 단계) 균일한 capsule 가격을 지불합니다. 또는 평소 사용하는 툴체인(`npm run build` → `dist/`)으로 빌드하고 그 결과물을 게시하세요.

:::tip npm을 선호하시나요? `create-dig-app`을 사용하세요
Node 생태계에 익숙하다면, `npm create dig-app@latest my-app -- --template vite-react`로 동일한 템플릿을 npm에서 바로 스캐폴딩할 수 있습니다 — 시작하는 데 `digstore` 설치가 필요 없습니다. [앱 스캐폴딩하기](./build-a-dapp/scaffold.md)를 참고하세요.
:::

### 3. 지갑 설정하기 (게시할 때만 필요) {#3-set-up-a-wallet-only-needed-to-publish}

게시는 실제 자금을 지출하므로, 먼저 시드와 자금이 채워진 지갑이 필요합니다:

```sh
digstore seed generate      # 새 니모닉을 생성합니다 (한 번만 표시됨 — 백업하세요)
digstore balance            # 수신 주소를 표시합니다. XCH와 DIG로 자금을 채우세요
```

가져오기, 자금 조달, TTL 관련 세부 사항은 [온체인 앵커링](./digstore/cli/onchain-anchoring.md)을 참고하세요.

### 4. 첫 번째 capsule 게시하기 {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # store의 첫 번째 capsule을 발행합니다 (균일한 capsule 가격 + XCH 수수료)
```

`init`은 메인넷에 Chia 싱글톤을 발행합니다 — **launcher id가 여러분의 store id가 됩니다** — 그리고 확정될 때까지 대기합니다.

### 5. 업데이트 게시하기 {#5-ship-updates}

```sh
npm run build                      # dist/를 생성합니다
digstore add -A                    # 전체 콘텐츠 루트를 스테이징합니다
digstore commit -m "v1.1"          # 새 capsule을 게시합니다 (균일한 capsule 가격 + XCH 수수료)
```

CI를 위해, 하나의 명령어로 add → commit → push를 수행하고 URL을 출력합니다:

```sh
digstore deploy --output-dir dist --json   # CI에서 기존 store를 진전시킵니다; mint는 절대 하지 않습니다
```

[GitHub Actions에서 배포하기](./digstore/cli/deploy-from-github-actions.md)를 참고하세요.

### 6. 다시 읽어보기 {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # URN 하나가 위치도 찾고 복호화도 합니다
```

---

## 비용 {#what-it-costs}

| 작업 | 비용 |
|---|---|
| 스캐폴딩, 빌드, 초안 미리보기 | **무료** |
| 첫 번째 capsule 게시하기 (`init` / DIGHUb 게시) | **$DIG로 균일한 capsule 가격** + 소액의 XCH 수수료 |
| 업데이트마다 게시하기 (`commit` / 재게시) | **$DIG로 균일한 capsule 가격** + 소액의 XCH 수수료 |

가격은 어디서나 **capsule당 균일**합니다 — [왜 가격이 균일한지](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform)를 참고하세요.

## 막혔나요? {#stuck}

- [문제 해결](./support/troubleshooting.md) — 흔한 실패 사례와 해결 방법.
- [FAQ](./support/faq.md) — 빠른 답변.
- [도움 받기](./support/get-help.md) — 커뮤니티와 좋은 리포트를 작성하는 방법.

## 관련 문서 {#related}

- [개념 & 용어집](./concepts.md) — capsule, store, URN, DIG 결제가 정의되어 있습니다
- [앱 스캐폴딩하기 (create-dig-app)](./build-a-dapp/scaffold.md) — 한 번의 명령으로 배포 가능한 프로젝트를 시작하세요 (npm 또는 CLI)
- [CLI 설치하기](./digstore/cli/install.md) — 여러분의 머신에 `digstore`를 설치하세요
- [온체인 앵커링](./digstore/cli/onchain-anchoring.md) — 지갑 설정, 자금 조달, 비용
- [GitHub Actions에서 배포하기](./digstore/cli/deploy-from-github-actions.md) — CI에서 push-to-publish
- [CLI 튜토리얼](./digstore/cli/quickstart.md) — 생성-커밋-읽기 전체 과정
