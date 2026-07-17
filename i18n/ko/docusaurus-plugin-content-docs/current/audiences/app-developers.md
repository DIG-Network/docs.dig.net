---
sidebar_position: 1
title: For app developers
description: "진짜로 소유하는 웹사이트나 앱을 배포하세요 — 대여하는 것이 아니라 온체인에서 나만의 자산으로 민팅됩니다. 빌드와 미리보기는 무료이며, 게시할 때만 소액의 균일한 $DIG 가격을 지불합니다. 파일은 브라우저에서 암호화되므로 어떤 호스트도 그 내용을 읽을 수 없습니다."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# For app developers {#for-app-developers}

> **진짜로 소유하는(OWN) 웹사이트나 앱을 배포하세요** — 대여하는 것이 아니라 온체인에서 나만의 자산으로 민팅됩니다. 빌드와 미리보기는 **무료**이며, 게시할 때만 소액의 **균일한 $DIG 가격**을 지불합니다. 파일은 **브라우저에서 암호화**되므로 어떤 호스트도 그 내용을 읽을 수 없습니다.

## 핵심 개념 {#the-mental-model}

**[store](../concepts.md#store)**는 여러분의 웹사이트가 갖는 영구적인 정체성으로, 여러분이 통제하는 온체인 싱글톤입니다. 게시할 때마다 하나의 불변 **[capsule](../concepts.md#capsule)** = `storeId:rootHash`가 민팅됩니다. store는 그동안 게시해 온 capsule들의 시퀀스일 뿐입니다.

두 개의 입구가 **동일한** 무료 빌드 → 유료 게시 흐름으로 이어집니다.

- **웹 경로** — [hub.dig.net](https://hub.dig.net)의 [DIGHUb](../concepts.md#dighub): 빌드된 폴더를 드롭하고, 무료로 미리보고, Publish 시점에만 지갑을 연결합니다.
- **CLI / CI 경로** — [`dig-store`](../concepts.md#digstore-cli) CLI + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub 배포 Action](../concepts.md#deploy-action).

스캐폴딩, 빌드, 미리보기는 **비용이 들지 않습니다**. 비용은 capsule을 게시할 때만 발생합니다.

| 하는 일 | 비용 |
|---|---|
| 초안 스캐폴딩, 빌드, 미리보기 | **무료** |
| 첫 capsule 게시(store 민팅) | **$DIG로 표시된 균일한 capsule 가격** + 소액의 XCH 수수료 |
| 업데이트 게시(새 capsule)마다 | **$DIG로 표시된 균일한 capsule 가격** + 소액의 XCH 수수료 |

## 여기서 시작하세요 {#start-here}

- **[퀵스타트 — 10분 만에 사이트 배포하기](../quickstart.md)** — 웹이든 CLI든, 가장 빠른 경로입니다.

## 웹에서 게시하기 — DIGHUb {#publish-from-the-web--dighub}

[**DIGHUb에서 새 store 시작하기 ↗**](https://hub.dig.net/new). 빌드된 사이트(`dist/` 또는 `build/` 폴더)를 드롭하면 실제 읽기 경로에서 **무료 초안 미리보기**를 받을 수 있고, **Publish** 단계에서만 지갑을 연결합니다. 웹 진행 과정은 [퀵스타트 → 웹에서 게시하기](../quickstart.md#a-publish-from-the-web)에서 확인하세요.

## CLI에서 게시하기 — dig-store {#publish-from-the-cli--digstore}

Git과 유사한 흐름입니다: `new` → `dev` → `init` → `commit`.

```sh
digs new vite-react   # 실행 가능한 프로젝트 스캐폴딩 — 무료, 민팅 없음
digs dev              # 실제 chia:// 읽기 경로에서 미리보기, 라이브 리로드 — 무료
digs init site --dir dist   # store의 첫 capsule 민팅(균일 가격 + XCH 수수료)
digs commit -m "v1.1"       # 업데이트 게시 — 새 capsule
```

→ [CLI 퀵스타트](../digstore/cli/quickstart.md) · [전체 프로젝트 워크플로우](../digstore/cli/project-workflow.md)

## 앱 스캐폴딩하기 — 5개 템플릿 {#scaffold-an-app--5-templates}

`static`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia` 중 실행 가능하고 지갑이 연결된 스타터로 시작하세요. `digs new <template>` 또는 `npm create dig-app`을 통해 사용할 수 있습니다.

→ [앱 스캐폴딩하기](../build-a-dapp/scaffold.md)

## `digs dev`로 무료 미리보기 {#preview-free-with-digstore-dev}

`digs dev`는 여러분의 프로젝트를 **실제** DIG 읽기 경로(암호화 → 컴파일 → 검증 → 복호화)를 통해 라이브 리로드와 주입된 개발용 `window.chia`와 함께 서빙합니다. 여러분이 보는 것이 곧 방문자가 보는 것이며, 아무것도 민팅되거나 소비되지 않습니다.

→ [CLI 퀵스타트 → 개발 및 미리보기](../digstore/cli/quickstart.md)

## `dig.toml` — 커밋 가능한 매니페스트 {#digtoml--the-committable-manifest}

프로젝트 루트의 `dig.toml`은 `store-id`, `output-dir`, `build-command`, `remote` 등의 설정을 담고 있으며, `digs dev`, `digs deploy`, 스캐폴드 템플릿이 이를 공유합니다. **비밀 정보는 담지 않으므로**(그런 값들은 환경 변수에서 옵니다) 커밋해도 됩니다.

→ [프로젝트 설정 및 빌드 타임 값](../digstore/cli/configuration.md)

## 업데이트와 버전 — 게시할 때마다 새로운 capsule {#updates--versions--each-publish-is-a-new-capsule}

게시할 때마다 현재 빌드가 새로운 불변 **capsule**로 봉인되고 여러분의 store의 온체인 root가 전진합니다. 이전 capsule들은 계속 읽을 수 있으며, 리더가 특정 `rootHash`를 고정하지 않는 한 store는 항상 최신 버전으로 해석됩니다.

→ [온체인 앵커링](../digstore/cli/onchain-anchoring.md)

## 비용은 얼마인가요 {#what-it-costs}

빌드와 미리보기는 무료이며, 게시된 capsule마다 **$DIG로 표시된 균일한 가격**과 소액의 XCH 네트워크 수수료가 듭니다. 이 두 비용은 동일한 온체인 스펜드에 **원자적으로** 포함됩니다. 가격이 capsule마다 균일하게 설계된 이유는 capsule의 길이가 콘텐츠에 대한 어떤 정보도 노출하지 않도록 하기 위함입니다. $DIG는 TibetSwap, dexie.space, 9mm.pro에서 구할 수 있습니다.

→ [DIG는 어디서 구하나요](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [왜 모든 capsule의 가격이 같은가요?](../support/faq.md#why-uniform-price)

## GitHub Actions로 push-to-deploy {#push-to-deploy-from-github-actions}

`dig-network/deploy-action`을 연결하면 모든 push마다 새로운 capsule이 게시됩니다 — `if-changed` 가드가 있어 바이트 단위로 동일한 빌드는 아무 동작도 하지 않습니다(비용 발생 없음).

→ [GitHub Actions에서 배포하기](../digstore/cli/deploy-from-github-actions.md)

## `*.on.dig.net` 웹 주소 추가하기(선택 사항) {#add-a-ondignet-web-address-optional}

여러분의 store는 확정되는 즉시 자신의 [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) 주소로 접근할 수 있습니다 — 추가 비용은 없습니다. 사람이 읽기 쉬운 `<name>.on.dig.net` 핸들은 그 위에 추가되는 **선택적인 유료** DIGHUb 등록입니다.

→ [내 도메인을 사용할 수 있나요?](../support/faq.md#can-i-use-my-own-domain)

---

## 더 깊이 알아보기: 프로토콜 {#go-deeper-the-protocol}

위의 평이한 설명만으로도 배포하기에는 충분합니다. 전체 설계를 원한다면 다음을 참고하세요.

- **"store는 capsule들의 시퀀스입니다"** → [개념 및 용어집](../concepts.md#capsule) · [capsule 및 store 모델](../digstore/format/store-structure.md)
- **"파일은 브라우저에서 암호화됩니다"** → [URN 및 암호화](../digstore/format/urns-and-encryption.md)
- **"균일한 가격 + 원자적 $DIG 스펜드"** → [온체인 앵커링](../digstore/cli/onchain-anchoring.md#costs) · [CHIP-0035 store-coin 스펜드](../chip-0035-spends-and-delegation.md)
- **모든 것** → [프로토콜 심화](../protocol-deep-dive.md)
