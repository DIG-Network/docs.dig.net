---
sidebar_position: 3
title: Install anywhere — the universal installer
description: "The cross-platform dig-node installer for Windows, macOS, and any Linux: one curl | sh (or a direct download), installs the service and the digstore CLI, and registers dig.local."
keywords:
  - universal installer
  - dig-node install
  - dig.local
  - dig-dns
  - Windows service
  - launchd
  - systemd
tags:
  - dig-node
  - dig-rpc
---

# Install anywhere — the universal installer

The cross-platform path — **Windows, macOS, and any Linux**. It detects your OS, installs the `dig-node` service (Windows service / `systemd` / `launchd`) and the `digstore` CLI, and needs no package manager.

```sh
curl -fsSL https://dig.net/install.sh | sh
```

This is the same self-contained `dig-installer` shipped on the [Releases page](https://github.com/DIG-Network/dig-installer/releases) — download and run it directly if you prefer not to pipe to a shell, or on Windows.

## GUI 설치 프로그램 {#gui-installer}

플래그 대신 안내형 설정을 선호하시나요? 설치 프로그램을 셸로 파이프하는 대신 직접 다운로드하여 실행하면 데스크톱 마법사가 열립니다 — **Welcome → License → Components → Install → Done** — DIG Network의 다른 앱과 어울리는 다크 테마로요.

**Components** 단계에서는 `digstore`, `dig-node`, `dig-dns`, `dig-relay`, DIG Browser 등 모든 구성 요소가 기본적으로 체크되어 있어, 아무것도 바꾸지 않고 진행하면 전부 설치됩니다(`digstore`에는 체크박스가 없으며 항상 설치됩니다). 일부만 설치하려면 다른 구성 요소의 체크를 해제하세요.

구성 요소가 사용 중인 플랫폼에 아직 제공되지 않는 경우 자동으로 건너뛰며, 선택한 나머지 구성 요소는 정상적으로 설치됩니다.

이미 설치된 `dig-node` 또는 `dig-relay` 위에 설치 프로그램을 다시 실행하는 경우(예: 업그레이드) 별도의 수동 작업이 필요 없습니다. 실행 중인 서비스를 중지하고, 바이너리를 새 버전으로 교체한 다음 다시 시작하므로, 서비스는 이전과 동일한 실행/중지 상태로 돌아옵니다.

## `dig.local`

The installer registers **`dig.local`** for your machine so consumers on the same host resolve your node by name (`dig.local` → `localhost`) without hard-coding a port. This is what lets the [DIG Browser](../browser/chia-protocol.md) and extension prefer a local node automatically. → [Point a consumer at your node](./point-a-consumer.md)

:::note Pre-release
The hosted installers (`apt.dig.net`, `dig.net/install.sh`) are still being provisioned. Until they're live, build from source or grab a binary from the [dig-node Releases](https://github.com/DIG-Network/dig-node/releases). The commands here are the real, intended ones.
:::

## An always-on service, verified after install

`--with-dig-node` registers `dig-node` as an **auto-start** service — it comes up again after a reboot with no manual step, and starts as part of installation. On Linux and macOS it also **auto-restarts if it ever crashes** (Windows recovery-on-crash is still being wired up).

Once the service is started, the installer runs two checks and prints the result of each:

- **`dig.local` resolves** — the OS resolver actually maps `dig.local` to your node's loopback address right now (not just that the hosts entry was written).
- **Health check** — the node answers a live RPC call on its configured port (default `9778`), proving the service isn't just registered but actually serving.

```sh
dig-installer --with-dig-node
#   Registering dig-node as an OS service (port 9778):
#     ✓ dig-node installed as an OS service and started
#     ✓ dig.local: 127.0.0.2 dig.local → /etc/hosts
#     ✓ dig.local resolve check: dig.local → 127.0.0.2
#     ✓ health check: rpc.discover on http://127.0.0.1:9778/ answered
```

With the node up and verified, the [extension](../audiences/content-consumers.md) and the [DIG Browser](../browser/chia-protocol.md) find it automatically at `dig.local` (or `localhost:9778`) — no configuration needed on the consumer side. `--uninstall-dig-node` removes the service and the `dig.local` entry cleanly.

## Browse `.dig` names directly {#browse-dig-names-directly}

Add `--with-dig-dns` to also install [`dig-dns`](https://github.com/DIG-Network/dig-dns)
— a local `*.dig` name resolver — as an OS service (Windows Service / macOS
LaunchDaemon / Linux systemd):

```sh
curl -fsSL https://dig.net/install.sh | sh -s -- --with-dig-dns
```

This lets a browser open `http://<storeId>.dig/<path>` directly: dig-dns resolves the
store's chain-anchored root and serves its content from your dig-node. The installer
wires OS split-DNS (or an NRPT rule on Windows) and, as a fallback, a PAC proxy file
for browsers that bypass the OS resolver (e.g. a browser forcing DNS-over-HTTPS) —
either path alone is enough for `.dig` URLs to load. It never edits `/etc/hosts`,
never rewrites URLs, and never intercepts TLS. Run `dig-dns doctor` any time to check
which path is live and get a fix hint for what isn't.

The [extension](../audiences/content-consumers.md)'s "open a chia:// address or DIG URN"
input on its home screen detects `dig-dns` automatically: with it installed and running, opening
an address navigates straight to its real `http://<storeId>.dig/` page; without it, the same
address still opens, rendered inside the extension.

## On Debian-family systems

Prefer the signed, `apt upgrade`-able native path: → [Install on Ubuntu/Debian via apt](./apt.md).

## Related

- [Run a node — overview](./index.md)
- [Configure dig-node](./configure.md) — ports, listeners, cache cap, upstream
- [Point a consumer at your node](./point-a-consumer.md) — shared `.dig` cache
