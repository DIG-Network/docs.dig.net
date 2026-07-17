---
sidebar_position: 1
slug: /
title: DIG Network
description: "DIG Network 各基础原语概览：用于内容可寻址发布的 dig-store、用于盲目托管与检索的 dig RPC，以及用于内容访问的 DIG Browser。"
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - dig-store
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network 是构建在 Chia 之上的权益证明（Proof-of-Stake）第二层网络** —— 一个用于发布、寻址和提供内容的去中心化网络，无需信任托管方。

本文档涵盖该网络及其**基础原语（primitives）**：开发者用来在 DIG 之上构建应用的可组合基础构件。网络仍在不断扩展，未来会持续补充更多基础原语的文档。

:::info $DIG 驱动整个网络
**$DIG 是 DIG Network 的引擎与经济体系。** 发布 capsule、拥有 store、给创作者打赏——每一次价值交换都通过 $DIG 流转。消费内容始终轻松、免费：阅读永远不需要付费，付费只发生在发布与拥有环节。
:::

## capsule {#the-capsule}

有一个概念贯穿每一个基础原语。**capsule** 是一次不可变的 store 生成版本 —— 即 `(storeId, rootHash)` 这一对值，规范写法为 `storeId:rootHash`。**store 是一系列 capsule 的集合**，每次提交（commit）对应一个 capsule（每次提交都会推进链上根哈希并产生一个新的 capsule）。

capsule 是该网络的最小单位，体现在：

- **编译** —— 每个 capsule 都会编译成一个固定大小的 WASM 模块（经过填充，其长度不会泄露任何有关内容大小的信息）。
- **定价** —— **每个 capsule 统一定价**（无论是 mint 还是 commit），以 $DIG 按实时汇率支付；一个 store 的生命周期成本 = 统一的单 capsule 价格 × capsule 数量。
- **检索** —— 一个 URN 指向一个 capsule（以及其中可选的某个资源）。
- **缓存** —— 主机或浏览器以 `storeId:rootHash` 为键缓存一个 capsule；本地缓存就是一组 capsule 的集合。
- **溯源** —— 每个 capsule 的根都带有发布者的 BLS 签名和一个 Merkle 根。

这是整个生态系统范围内的统一定义：“capsule = `(storeId, rootHash)`”在 dig-store、dig RPC 和 DIG Browser 中含义完全一致。

:::tip 试一试
[**在 DIGHUb 中创建你的第一个 capsule ↗**](https://hub.dig.net/new) —— 在浏览器中发布一个站点，无需 CLI。每个 capsule（mint 或 commit）都需支付**以 $DIG 计价的统一 capsule 价格**。
:::

## 基础原语 {#primitives}

### 🗄️ dig-store {#️-digstore}

第一个也是最基础的原语：一种**内容可寻址、加密的 WASM 项目格式**。你将其指向一个构建目录，像 Git 一样提交部署，最终得到一个单一的、自我防护的 `.wasm` 文件 —— 它既是你的数据，也是控制访问权限的服务端。存储或中继它的主机看到的只是按哈希寻址的密文；它无法读取自己所承载的内容。

→ **[了解 dig-store](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[什么是 dig-store？](./digstore/what-is-digstore.md)** | 一言以蔽之的单文件理念 |
| **[格式说明](./digstore/format/overview.md)** | 项目、部署、URN、加密与证明 |
| **[CLI 教程](./digstore/cli/quickstart.md)** | 在你的项目中安装并使用 `dig-store` |

### 🛰️ dig RPC {#️-dig-rpc}

网络原语：一个**用于从已托管的 dig-store 部署中读取内容的标准接口**。基于 HTTPS `POST` 的 JSON-RPC 2.0 —— 每个托管节点的实现完全一致，因此内容可移植，客户端与节点无关。它按检索键（retrieval key）提供密文与包含性证明，按 `(store_id, root)` 提供整个部署，还提供公开的发现清单 —— 以分块方式流式传输，天生盲目（blind by construction），全部在客户端完成验证与解密。

→ **[了解 dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[什么是 dig RPC？](./rpc/what-is-the-dig-rpc.md)** | 覆盖整个网络读取路径的单一端点 |
| **[方法列表](./rpc/methods.md)** | `dig.getContent`、`dig.getCapsule`、`dig.getManifest`、`dig.listCapsules` 等 |
| **[流式传输](./rpc/streaming.md)** | 分块模型、重组与证明验证 |
| **[一致性与安全](./rpc/conformance.md)** | 盲态模型、CORS，以及节点必须实现的内容 |

### 🌐 DIG Browser {#-dig-browser}

客户端原语：一款**内置 Chia 钱包的浏览器**。它会在每个页面中注入一个 `window.chia` 提供者，因此任何网页应用都可以请求用户的地址、签名和支出，而无需配置 WalletConnect —— 对于已经支持 CHIP-0002 的应用来说，这是一种可直接替换的方案。它还可以直接解析 `chia://` 内容地址。

→ **[基于 DIG Browser 构建](./browser/using-window-chia.md)**

| | |
|---|---|
| **[在你的应用中使用 `window.chia`](./browser/using-window-chia.md)** | 检测已注入的钱包、建立连接并调用 CHIP-0002 方法 |

:::tip 试一试
[**获取 DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) —— 下载浏览器以打开 `chia://` 内容并使用内置钱包。
:::

*更多基础原语 —— 结算与节点运维 —— 将在落地后拥有各自的章节。*

## 选择你的路径 {#pick-your-path}

本文档按**你要做的事情**来组织。每条路径都以十秒钟讲清"为什么"开篇，接着给出你需要的心智模型，以及高信号的操作指南 —— 之后再链接到协议部分，供你深入了解。

- **[发布你自己拥有的网站或应用](./audiences/app-developers.md)** —— 将网站/应用作为你自己的链上资产发布；免费构建，发布一个 capsule。
- **[铸造 NFT 与合集](./audiences/nft-developers.md)** —— 由永久、防篡改的 capsule 支撑的 CHIP-0007 发行。
- **[将 DIG 集成到你的应用](./audiences/integration-developers.md)** —— 一个类型化的 SDK + 一个完全机器可读的平台。
- **[运行一个节点](./run-a-node/index.md)** —— 以可证明且提供者匿名的方式提供内容服务。
- **[打开 chia:// 内容](./audiences/content-consumers.md)** —— 阅读由你自己的浏览器对照链上数据验证过的内容。
- **[遇到问题？](./audiences/troubleshooting.md)** —— 通过稳定错误码定位你的故障。

刚接触这些术语？可以先浏览[概念与术语表](./concepts.md)。想了解完整设计？请阅读[协议深度解析](./protocol-deep-dive.md)。

:::note
DIG Network 及其基础原语均为开源项目。dig-store 采用 GPL-2.0 许可证；详见 [dig-store 代码仓库](https://github.com/DIG-Network/dig-store)。
:::

## 相关链接 {#related}

- [快速开始](./quickstart.md) —— 发布你的第一个站点；构建与预览免费
- [在 Chia 上构建一个 dapp](./build-a-dapp/tutorial.md) —— 在一篇端到端教程中涵盖每个基础原语
- [概念与术语表](./concepts.md) —— DIG 的核心实体，定义并互相链接
- [什么是 dig-store？](./digstore/what-is-digstore.md) —— 内容可寻址的 store 格式
- [什么是 dig RPC？](./rpc/what-is-the-dig-rpc.md) —— 全网统一的读取接口
- [chia:// 协议](./browser/chia-protocol.md) —— 在 DIG Browser 中打开内容
- [获取帮助](./support/get-help.md) —— 社区、故障排查与错误码
