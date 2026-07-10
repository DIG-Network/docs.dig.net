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

## 圖形介面安裝程式 {#gui-installer}

比起使用旗標參數，更想要有引導的設定流程？直接下載並執行安裝程式（而不是透過管道傳給 shell）會開啟一個桌面精靈 —— **Welcome → License → Components → Install → Done** —— 採用與 DIG Network 其他應用程式一致的深色主題。

在 **Components** 步驟中，每個元件 —— `digstore`、`dig-node`、`dig-dns`、`dig-relay` 和 DIG Browser —— 預設都是勾選狀態，因此不做任何變更直接繼續會安裝全部元件（`digstore` 沒有核取方塊；它一律會被安裝）。取消勾選其他任一元件即可只安裝其中一部分。

如果某個元件尚未針對你的平台發布，會被自動略過，你所選的其餘元件仍會正常安裝。

在已安裝的 `dig-node` 或 `dig-relay` 上重新執行安裝程式 —— 例如進行升級 —— 不需要任何手動步驟：它會停止正在執行的服務，將二進位檔替換為新版本，然後重新啟動，使服務恢復到之前相同的執行或停止狀態。

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
