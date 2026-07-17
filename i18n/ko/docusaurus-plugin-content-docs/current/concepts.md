---
sidebar_position: 1.5
title: 개념 & 용어집
description: "capsule, store, generation, URN, retrieval key, dig RPC, chia:// 프로토콜, 온체인 앵커링 등 DIG Network의 핵심 엔티티를 한 페이지에 정리한 색인 — 각 항목을 한 번씩 정의하고 관련 심화 문서로 연결합니다."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# 개념 & 용어집 {#concepts--glossary}

이 페이지는 모든 핵심 DIG Network 엔티티를 평이한 언어로 **한 번씩** 정의하고, 각 항목을 심화 내용을
다루는 문서로 연결합니다. 이는 문서의 사람이 읽기 쉬운 뼈대이며, 각 용어가 기계 판독 가능한 구조화
데이터로도 함께 제공되므로 에이전트가 네트워크의 어휘를 학습하기 위해 스크래핑할 수 있는 지도이기도
합니다. 방향을 잡기 위해 훑어보고, 더 깊이 알고 싶으면 링크를 따라가세요.

## capsule {#capsule}

**capsule**은 하나의 불변 store 세대(generation)입니다: `(storeId, rootHash)` 쌍이며, 정규 표기법으로
`storeId:rootHash`로 씁니다. 이는 네트워크의 원자적 단위입니다 — 컴파일(하나의 고정 크기 WASM 모듈),
[가격 책정](./digstore/cli/onchain-anchoring.md)(mint 또는 commit에 대해 $DIG로 지불하는 균일한
capsule당 가격), 검색([URN](#urn)이 하나의 capsule을 지정), 캐싱, 출처 증명(provenance)의 단위입니다.
[store](#store)는 커밋마다 하나씩 생성되는 *capsule들의 시퀀스*입니다. 이 정의는 dig-store, dig RPC,
DIG Browser 전반에서 동일합니다. → [capsule, 전체 설명](./intro.md#the-capsule)

## store {#store}

**store**는 정체성과 그 콘텐츠 및 히스토리의 결합입니다: 커밋마다 하나씩 생성되는
[capsule](#capsule)들의 시퀀스입니다. 그 정체성은 64자리 16진수 **store id**이며, 이는 온체인 Chia
싱글톤 launcher id와 *동일*합니다 — 체인 싱글톤이 store의 현재 root에 대한 권위입니다. store는 DIG의
웹사이트에 해당하는 개념입니다. → [store 구조](./digstore/format/store-structure.md)

## generation {#generation}

**generation**은 [store](#store)의 단일 커밋된 상태이며, **root hash**(generation의 리소스별 leaf에
대한 Merkle root)로 식별됩니다. 각 `commit`은 현재 콘텐츠를 새로운 추가 전용(append-only)
generation으로 봉인합니다 — 이는 [capsule](#capsule)이 지칭하는 것과 동일한 대상입니다. generation은
Git 히스토리처럼 단조롭게 증가합니다. → [generation과 root hash](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

**URN**은 dig-store의 주소이자 키를 하나의 문자열로 결합한 것입니다:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. 이는 리소스를 **찾아내는(locate)** 동시에
**복호화하는 키를 도출(derive)**합니다 — URN을 소유하는 것만으로 공개 리소스를 읽기에 충분하고도
필요합니다. 브라우저에서 사용하는 축약형은 [`chia://` 프로토콜](#chia-protocol)입니다. → [URN과 암호화](./digstore/format/urns-and-encryption.md)

## retrieval key {#retrieval-key}

**retrieval key**는 `SHA-256(canonical_urn)`이며, 클라이언트를 벗어나는 유일한 주소입니다. 이는
리소스의 경로나 [URN](#urn)을 드러내지 않고도 리소스의 암호문을 찾아냅니다. *root와 무관*하므로 동일한
키가 여러 [generation](#generation)에 걸쳐 리소스를 찾을 수 있습니다. 이후 제공된 바이트는 올바른
root에 대해 [Merkle 검증](#merkle-proof)됩니다. 별도의 **복호화 키**는 동일한 URN으로부터 로컬에서
(HKDF로) 도출되며 절대 전송되지 않습니다. → [두 개의 값, 하나의 문자열](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

각 [generation](#generation)은 리소스당 하나의 leaf를 갖는 Merkle 트리를 구축하며, 실제로 제공되는
*암호문* 바이트에 대해 커밋합니다. 제공되는 리소스에는 **포함 증명(inclusion proof)**이 함께
제공되며, 이 바이트가 정확히 해당 root에 속함을 증명합니다 — 따라서 콘텐츠는 절대 복호화되지 않고도
검증되며, 노드가 진짜 바이트를 반환했다고 신뢰할 필요가 없습니다. → [Merkle proof](./digstore/format/proofs-and-security.md)

## 온체인 앵커링 {#anchoring}

모든 store는 **Chia 메인넷 상의 싱글톤**입니다. `dig-store init`이 이를 발행하며(launcher id가 store
id가 *됩니다*), 모든 `dig-store commit`은 새로운 [generation](#generation) root를 CHIP-0035 싱글톤
업데이트로 온체인에 고정합니다. 두 작업 모두 확정될 때까지 대기하며 실제 자금을 지출합니다. 체인은
store의 최신 root에 대한 권위입니다. → [온체인 앵커링](./digstore/cli/onchain-anchoring.md)

## DIG 결제 {#dig-payment}

**$DIG**는 DIG Network 토큰(Chia CAT)입니다. [capsule](#capsule)을 mint(`init`)하거나 commit하는
데는 **$DIG로 균일한 capsule당 가격**이 들며, 이는 앵커링과 **동일한 온체인 지출에 원자적으로
포함**됩니다 — 별도의 트랜잭션은 없으며, 메모에는 store id가 담깁니다. → [비용](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store`는 store를 생성, 커밋, 공유, 읽기 위한 커맨드라인 도구입니다 — 암호화된 온체인 store
포맷 위에서 Git과 유사한 워크플로(`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`)를
제공합니다. → [명령어 레퍼런스](./digstore/cli/command-reference.md) · [CLI 튜토리얼](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml`은 프로젝트 루트에 있는 **커밋 가능한 프로젝트 매니페스트**입니다 — `store-id`,
`output-dir`, `build-command` 등의 프로젝트 설정을 담고 있으며, `dig-store dev`, `dig-store deploy`,
스캐폴딩 템플릿에서 공유됩니다. **비밀 값은 담고 있지 않으므로**(환경 변수에서 가져옴) 커밋해도
안전합니다. → [프로젝트 설정 & 빌드 타임 값](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app`(`npm create dig-app`)은 DIG 프로젝트를 시작하기 위한 **JS 전용 진입점**입니다:
`static`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia` 다섯 가지 템플릿 중 하나로부터
실행 가능한 스타터 — 앱, [`dig.toml`](#dig-toml), (지갑 템플릿의 경우) [DIG SDK](#dig-sdk) 연결까지
포함 — 를 스캐폴딩합니다. 스캐폴딩은 **무료**입니다 — mint도, 체인도, 지출도 없습니다.
[capsule](#capsule)을 게시할 때만 균일한 capsule 가격을 지불합니다. 이는 Rust CLI의
`dig-store new`에 대응하는 npm 측 동반자입니다. → [앱 스캐폴딩하기](./build-a-dapp/scaffold.md)

## GitHub 배포 Action {#deploy-action}

`dig-network/deploy-action`은 **git-push-to-deploy** 방식의 GitHub Action입니다: 러너에
[`dig-store` CLI](#digstore-cli)를 설치하고, `dig-store deploy`를 실행해 store를 진전시키며(mint는
절대 하지 않음), 게시된 [capsule](#capsule) + URL + 비용을 스텝 출력, PR 댓글, GitHub Deployment,
커밋 상태로 보고합니다. `if-changed`(기본값)를 사용하면 바이트 단위로 동일한 빌드는 아무 작업도
하지 않습니다 — 지출도 없습니다. → [GitHub Actions에서 배포하기](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK**(`@dignetwork/dig-sdk`)는 통합 개발자를 위한 타입이 지정된 npm 패키지입니다:
`ChiaProvider`(주입된 [`window.chia`](#window-chia)를 우선 사용하고, WalletConnect → Sage로
폴백), `DigClient`([dig RPC](#dig-rpc)를 통해 검증되고 암호화된 콘텐츠를 읽음), `Paywall`(프로바이더와
지출 빌더를 조합하는 고수준의 지불-후-잠금해제 / NFT-게이트 접근 헬퍼), 그리고 `/spend` 서브패스에서
재내보내지는(re-exported) 정식 CHIP-0035 지출 빌더로 구성됩니다.
→ [Chia에서 dapp 빌드하기](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC**는 네트워크 전역 읽기 인터페이스입니다: 모든 호스팅 노드가 동일하게 구현하는, HTTPS
`POST` 위의 JSON-RPC 2.0 서비스입니다. [retrieval key](#merkle-proof)로 암호문 +
[포함 증명](#retrieval-key)을 서빙하고, `(storeId, root)`로 전체 [capsule](#capsule)을 서빙하며,
검색용 메타데이터도 제공합니다 — 구조적으로 블라인드하며, 검증과 복호화는 클라이언트 측에서
이루어집니다. **이는 보편적인 읽기 경로입니다**: 게시된 모든 capsule은 온체인에서 확정되는 즉시
여기서 [URN](#urn) / [`chia://`](#chia-protocol) 주소로 읽을 수 있습니다 — 등록도, capsule 게시
외의 추가 결제도 필요 없습니다. 선택적이고 사람이 읽기 쉬운 [`*.on.dig.net` 핸들](#on-dig-net)은
이 위에 얹어진 정문(front door)일 뿐이며, dig RPC 자체는 항상 이용 가능합니다.
→ [dig RPC란?](./rpc/what-is-the-dig-rpc.md)

## chia:// 프로토콜 {#chia-protocol}

`chia://`는 DIG Browser의 네이티브 콘텐츠 주소 스킴입니다 — [`urn:dig:` URN](#urn)을 타이핑 가능한
형태로 표현한 프런트엔드입니다. `chia://<storeId>/` 링크를 붙여넣으면 브라우저가 네트워크에서 직접
콘텐츠를 가져옵니다. 콘텐츠 주소 지정 방식이며 암호학적으로 검증됩니다. → [chia:// 프로토콜](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia`는 **DIG Browser**가 모든 페이지에 주입하는 Chia 지갑 프로바이더입니다. 이는
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md)를 지원하므로,
웹 앱은 WalletConnect 설정 없이 사용자의 주소, 서명, 지출을 요청할 수 있습니다 — 이미 CHIP-0002를
지원하는 앱을 위한 즉시 사용 가능한 대안입니다. → [window.chia 사용하기](./browser/using-window-chia.md)
· [window.chia 프로바이더 스펙](./protocol/window-chia-provider.md) (규범적, 버전 관리됨)

## DIGHUb {#dighub}

**DIGHUb**([hub.dig.net](https://hub.dig.net))는 CLI 없이 [capsule](#capsule)을 게시하고 관리하기
위한 웹 앱입니다 — 브라우저에서 capsule을 생성하고, 프런트엔드를 배포하고, store를 확인할 수
있습니다. 또한 고비용 ZK 실행 증명(execution-proof) 작업의 예산을 관리하는 게이트 역할의 제어
플레인이기도 합니다.

## dig-node {#dig-node}

**dig-node**는 네트워크의 콘텐츠 **서버** — 즉 공급 측입니다. [capsule](#capsule)을 호스팅하고, 로컬
`.dig` 캐시를 유지하며, `rpc.dig.net`과 동일하게 [dig RPC](#dig-rpc)를 구현합니다. DIG 콘텐츠를
읽기 위해 dig-node를 운영할 **필요는 없습니다**(소비자는 `rpc.dig.net`으로 폴백합니다). dig-node를
운영하면 읽기가 로컬 우선(local-first)이 되고 서빙 용량에 기여하게 됩니다. 호스트는 **블라인드**입니다
— 오직 암호문과 증명만을 중계할 뿐입니다. → [노드 운영하기](./run-a-node/index.md)

## on.dig.net 핸들 {#on-dig-net}

**on.dig.net 핸들**은 [store](#store)를 위한 *선택적이고 유료인* 사람이 읽기 쉬운 웹 주소입니다:
`<your-name>.on.dig.net`. store는 자동으로 이를 얻지 **않습니다** — [DIGHUb](#dighub)에서 유료
CHIP-54 / `on.dig.net` 등록을 통해 핸들을 등록해야 하며, 그 등록이 store를 해당 이름에 고정합니다.
등록하지 않으면 `*.on.dig.net` 주소는 존재하지 않습니다. 이는 순전히 편의를 위한 정문(front door)일
뿐입니다 — 핸들이 존재하든 아니든 store는 이미 [dig RPC](#dig-rpc)를 통해 [URN](#urn) /
[`chia://`](#chia-protocol) 주소로 읽을 수 있습니다. (계정 핸들과 store 슬러그는 별개의 네임스페이스이며
서브도메인을 자동으로 노출하지 않습니다.) → [`*.on.dig.net` 주소를 받을 수 있나요?](./support/faq.md#can-i-use-my-own-domain)

## 관련 문서 {#related}

- [DIG Network 개요](./intro.md) — 프리미티브를 한눈에 보기
- [빠른 시작](./quickstart.md) — 무료로 빌드하고 미리보기한 뒤 마지막에 capsule을 게시하세요
- [Chia에서 dapp 빌드하기](./build-a-dapp/tutorial.md) — 모든 프리미티브를 하나의 배포된 dapp으로 엮은 문서
- [dig-store란?](./digstore/what-is-digstore.md) — 단일 파일 store 포맷
- [dig RPC란?](./rpc/what-is-the-dig-rpc.md) — 네트워크 읽기 경로
- [chia:// 프로토콜](./browser/chia-protocol.md) — 브라우저에서 콘텐츠 주소 지정하기
- [도움 받기](./support/get-help.md) — 커뮤니티 채널과 리포트 방법

## 에이전트 & LLM을 위한 안내 {#for-agents--llms}

이 문서는 기계로 추출 가능합니다. 각 페이지는 schema.org JSON-LD를 담고 있으며(이 페이지는
`DefinedTerm` 세트로), 사이트 루트에는 큐레이션된 두 개의 지도가 있습니다:

- [`/llms.txt`](pathname:///llms.txt) — 링크가 풍부한 마크다운 형식의 문서 지도([llms.txt 컨벤션](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — 엔티티(개념 + 문서)와 타입이 지정된 엣지(`defines`, `part-of`, `requires`, `see-also`).
