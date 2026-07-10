---
sidebar_position: 1
title: Run a DIG node
description: "dig-node가 무엇인지, 왜 실행해야 하는지, 그리고 설치 방법 — Ubuntu/Debian용 apt 저장소 또는 크로스플랫폼 유니버설 설치 프로그램."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Run a DIG node {#run-a-dig-node}

> **콘텐츠를 증명 가능하면서도 제공자에게는 알 수 없는(provider-blind) 방식으로 서비스합니다** — 여러분은 해시로 키가 지정된, 구별할 수 없는 암호문만을 다루며, 실행 증명(execution proof)으로 충실한 서비스 제공을 증명할 수 있고, 클라이언트는 체인에 대해 모든 것을 검증하므로 신뢰가 여러분의 노드에 의존하지 않습니다.

**dig-node**는 DIG Network의 콘텐츠 **서버**입니다 — 네트워크의 공급 측입니다. capsule을 호스팅하고, 로컬 `.dig` 캐시를 유지하며, [dig RPC](../rpc/what-is-the-dig-rpc.md)를 노출하여 DIG 콘텐츠를 읽는 모든 것이 여러분에게서 읽을 수 있게 합니다. 브라우저나 UI 없이 헤드리스 백그라운드 서비스로 동작합니다 — 여러분이 게시하거나 서비스에 기여하고 싶은 콘텐츠를 위한 seedbox입니다.

이는 **소비자(consumer)** 측인 [DIG Browser](../browser/chia-protocol.md)와 브라우저 확장 프로그램의 대응 개념입니다. 소비자는 암호문과 증명을 가져와서 온체인 root에 대해 검증하고, 로컬에서 복호화하여 렌더링합니다. DIG 콘텐츠를 읽기 위해 dig-node가 반드시 필요한 것은 **아닙니다** — 소비자 단독으로도 잘 동작하며, 공개 참조 노드인 `rpc.dig.net`으로 폴백합니다. dig-node를 실행하는 이유는 **서비스하기 위해서**입니다 — 그리고 같은 머신에 노드가 있으면 소비자는 그 노드에서 읽으며(로컬, 오프라인 친화적, 네트워크에 기여), 둘은 하나의 `.dig` 캐시를 공유합니다.

:::info 서비스 제공 대 소비
- **dig-node** = 콘텐츠를 서비스하고 dig RPC를 노출합니다. 헤드리스 백그라운드 서비스입니다.
- **DIG Browser / 확장 프로그램** = 콘텐츠를 소비합니다(로컬에서 검증 및 복호화). 로컬 노드가 필요하지 않습니다.

둘 다 설치되어 있으면 브라우저/확장 프로그램은 여러분의 로컬 dig-node에서 읽고, 그렇지 않으면 `rpc.dig.net`에서 읽습니다. 어느 쪽이든 모든 바이트는 클라이언트 측에서 체인에 대해 검증되며 — 소스는 절대 신뢰되지 않습니다.
:::

## 설치하기 {#install-it}

| 여러분의 머신 | 사용할 것 |
|---|---|
| **Ubuntu / Debian** | 네이티브 **[apt 저장소](./apt.md)** — `apt install dig-node digstore`, systemd 서비스로 자동 활성화됩니다. |
| **Windows / macOS / Linux (모두)** | 크로스플랫폼 **[유니버설 설치 프로그램](#universal-installer-any-os)** — 모든 OS에서 `curl \| sh` 한 번(또는 다운로드)으로 설치합니다. |

두 방법 모두 동일한 `dig-node` 서비스와 `digstore` CLI를 설치합니다. apt는 Debian 네이티브 경로이며(서명됨, `apt upgrade` 가능), 유니버설 설치 프로그램은 그 외 모든 것을 다룹니다.

### apt (Ubuntu / Debian) — Debian 계열 시스템에 권장 {#apt-ubuntu--debian--recommended-on-debian-family-systems}

네이티브 경로: `apt.dig.net`의 서명된 apt 저장소입니다. `dig-node`를 관리형 **systemd 서비스**로 설치하고 `apt upgrade`로 최신 상태를 유지합니다.

→ **[apt로 Ubuntu/Debian에 설치하기](./apt.md)**

### 유니버설 설치 프로그램 (모든 OS) {#universal-installer-any-os}

크로스플랫폼 경로 — Windows, macOS, 그리고 모든 Linux. OS를 감지하여 `dig-node` 서비스(Windows 서비스 / `systemd` / `launchd`)와 `digstore` CLI를 설치하며, 패키지 관리자가 필요하지 않습니다.

```sh
curl -fsSL https://dig.net/install.sh | sh
```

이것은 [Releases 페이지](https://github.com/DIG-Network/dig-installer/releases)에 게시된 동일한 독립형 `dig-installer`입니다 — 셸로 파이프하는 것을 선호하지 않거나 Windows를 사용 중이라면 직접 다운로드하여 실행하세요. 이렇게 하면 플래그 대신 클릭으로 진행하고 싶은 경우를 위한 안내형 [GUI 마법사](./universal-installer.md#gui-installer)도 열립니다.

:::note 출시 전(Pre-release)
호스팅된 설치 프로그램(`apt.dig.net`, `dig.net/install.sh`)은 아직 준비 중입니다. 이것들이 활성화되기 전까지는 소스에서 빌드하거나 [dig-node Releases](https://github.com/DIG-Network/dig-node/releases)에서 바이너리를 받으세요. 여기에 나온 명령어들은 실제로 의도된 명령어입니다.
:::

## 그냥 콘텐츠를 읽고 싶으신가요? {#just-want-to-read-content}

노드가 필요하지 않습니다. **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)**를 받아서 아무 `chia://` 주소나 열어보세요 — 로컬 dig-node가 있으면 그곳에서, 없으면 `rpc.dig.net`에서 소비합니다. [`chia://` 프로토콜](../browser/chia-protocol.md)을 참고하세요.

## 관련 문서 {#related}

- [apt로 Ubuntu/Debian에 설치하기](./apt.md) — Debian 네이티브 경로 + systemd 서비스 관리
- [어디서나 설치하기 — 유니버설 설치 프로그램](./universal-installer.md) — Windows / macOS / 모든 Linux + `dig.local`
- [소비자를 여러분의 노드에 연결하기](./point-a-consumer.md) — 로컬 우선 읽기 + 공유 `.dig` 캐시
- [dig-node 설정하기](./configure.md) — 포트, 리스너, 캐시 한도, 업스트림
- [원격 origin 셀프 호스팅하기](../rpc/dig-remote.md) — `digstore serve` + dig:// clone/pull/push
- [노드 관리하기](./manage.md) — control.* 관리 RPC + My Node UI
- [공개 네트워크 RPC 사용하기](../rpc/public-network-rpc.md) — 노드가 사용하는 dig RPC, 그리고 네트워크에서 노드 운영하기
- [CLI 설치하기](../digstore/cli/install.md) — `digstore` 단독 설치(게시용, 서비스용 아님)

## 더 깊이 알아보기: 프로토콜 {#go-deeper-the-protocol}

- **"blind host & decoys"** → [dig RPC의 blind 서비스 모델](../rpc/what-is-the-dig-rpc.md) · [노드 적합성](../rpc/conformance.md)
- **"충실한 서비스 제공 증명"** → [Inclusion 증명 대 Execution 증명](../inclusion-vs-execution-proofs.md)
- **"dig:// clone/pull/push"** → [§21/§22 원격 프로토콜](../rpc/dig-remote.md)
- **모든 것** → [프로토콜 심층 분석](../protocol-deep-dive.md) · [개념 및 용어집](../concepts.md)
