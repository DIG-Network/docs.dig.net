---
sidebar_position: 1
title: Run a DIG node
description: "什么是 dig-node、为什么要运行一个，以及如何安装它 —— 面向 Ubuntu/Debian 的 apt 仓库，或者跨平台的通用安装程序。"
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

# 运行一个 DIG 节点 {#run-a-dig-node}

> **以可证明且提供者匿名的方式提供内容服务** —— 你所接触的始终只是以哈希为键、无法区分的密文，你可以通过执行证明来证实自己忠实地提供了服务，而客户端会对照链上数据验证一切，因此信任永远不会建立在你的节点之上。

**dig-node** 是 DIG Network 的内容**服务端** —— 网络的供给侧。它托管 capsule，维护一份本地 `.dig` 缓存，并对外提供 [dig RPC](../rpc/what-is-the-dig-rpc.md)，让任何需要读取 DIG 内容的一方都可以从你这里读取。它以无头（headless）方式运行（没有浏览器，没有界面），作为一个后台服务运行 —— 就像是为你发布或想帮助提供服务的内容准备的一个种子服务器（seedbox）。

它是**消费者**（consumers）的对应角色 —— 即 [DIG Browser](../browser/chia-protocol.md) 和浏览器扩展 —— 后者负责获取密文和证明、对照链上根哈希验证、在本地解密并渲染。你**不需要**一个 dig-node 就能读取 DIG 内容：单独使用一个消费者端就能正常工作，它会回退到位于 `rpc.dig.net` 的公共参考节点。你运行一个 dig-node 是为了**提供服务** —— 当同一台机器上存在一个节点时，消费者端会从它那里读取内容（本地化、适合离线场景，并为网络贡献服务能力），并且它们会共享同一个 `.dig` 缓存。

:::info 提供服务 vs 消费内容
- **dig-node** = 提供内容服务 + 对外提供 dig RPC。以无头后台服务方式运行。
- **DIG Browser / 扩展** = 消费内容（本地验证并解密）。不需要本地节点。

当两者都已安装时，浏览器/扩展会从你的本地 dig-node 读取；否则它们会从 `rpc.dig.net` 读取。无论哪种方式，每一个字节都会在客户端对照链上数据完成验证 —— 来源永远不会被信任。
:::

## 安装它 {#install-it}

| 你的机器 | 使用方式 |
|---|---|
| **Ubuntu / Debian** | 原生的 **[apt 仓库](./apt.md)** —— `apt install dig-node digstore`，自动启用为一个 systemd 服务。 |
| **Windows / macOS / Linux（任意发行版）** | 跨平台的**[通用安装程序](#universal-installer-any-os)** —— 一条 `curl \| sh` 命令（或直接下载）即可适配任意操作系统。 |

两者都会安装同一个 `dig-node` 服务，以及 `digstore` CLI。apt 是 Debian 原生的路径（已签名，可通过 `apt upgrade` 更新）；通用安装程序覆盖其他所有场景。

### apt（Ubuntu / Debian）—— 在 Debian 系发行版上推荐使用 {#apt-ubuntu--debian--recommended-on-debian-family-systems}

原生路径：位于 `apt.dig.net` 的一个已签名 apt 仓库。它会将 `dig-node` 安装为一个受管理的 **systemd 服务**，并通过 `apt upgrade` 保持更新。

→ **[通过 apt 在 Ubuntu/Debian 上安装](./apt.md)**

### 通用安装程序（任意操作系统） {#universal-installer-any-os}

跨平台路径 —— 适用于 Windows、macOS 以及任意 Linux 发行版。它会检测你的操作系统，安装 `dig-node` 服务（Windows 服务 / `systemd` / `launchd`）和 `digstore` CLI，且无需任何包管理器：

```sh
curl -fsSL https://dig.net/install.sh | sh
```

这与 [Releases 页面](https://github.com/DIG-Network/dig-installer/releases)上发布的自包含 `dig-installer` 完全相同 —— 如果你不想通过管道直接执行到 shell 中，或者是在 Windows 上，可以直接下载并运行它。这样做还会打开一个有引导的[图形向导](./universal-installer.md#gui-installer)，如果你更喜欢点击操作而不是使用参数的话。

:::note 预发布阶段
托管的安装程序（`apt.dig.net`、`dig.net/install.sh`）目前仍在筹备中。在它们正式上线之前，可以从源码构建，或从 [dig-node Releases](https://github.com/DIG-Network/dig-node/releases) 获取一个二进制文件。此处给出的命令是真实的、预期最终会使用的命令。
:::

## 只是想读取内容？ {#just-want-to-read-content}

你不需要一个节点。获取 **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** 并打开任意 `chia://` 地址即可 —— 如果你有本地 dig-node，它会从中消费内容，否则会从 `rpc.dig.net` 消费。参见 [`chia://` 协议](../browser/chia-protocol.md)。

## 相关链接 {#related}

- [通过 apt 在 Ubuntu/Debian 上安装](./apt.md) —— Debian 原生路径 + systemd 服务管理
- [在任意平台安装 —— 通用安装程序](./universal-installer.md) —— Windows / macOS / 任意 Linux + `dig.local`
- [将消费者端指向你的节点](./point-a-consumer.md) —— 本地优先读取 + 共享的 `.dig` 缓存
- [配置 dig-node](./configure.md) —— 端口、监听器、缓存上限、上游节点
- [自托管一个远程源](../rpc/dig-remote.md) —— `digstore serve` + dig:// 的 clone/pull/push
- [管理你的节点](./manage.md) —— control.* 管理类 RPC 与 My Node 界面
- [使用公共网络 RPC](../rpc/public-network-rpc.md) —— 你的节点所使用的 dig RPC，以及如何在网络上运营一个节点
- [安装 CLI](../digstore/cli/install.md) —— 单独安装 `digstore`（用于发布，而非提供服务）

## 深入了解：协议 {#go-deeper-the-protocol}

- **"盲态主机与诱饵（decoy）"** → [dig RPC 盲态服务模型](../rpc/what-is-the-dig-rpc.md) · [节点一致性](../rpc/conformance.md)
- **"证实忠实地提供了服务"** → [包含性证明 vs 执行证明](../inclusion-vs-execution-proofs.md)
- **"dig:// 的 clone/pull/push"** → [§21/§22 远程协议](../rpc/dig-remote.md)
- **完整内容** → [协议深度解析](../protocol-deep-dive.md) · [概念与术语表](../concepts.md)
