---
sidebar_position: 1.5
title: Concepts & glossary
description: "DIG Network 核心实体的单页索引 —— capsule、store、generation、URN、retrieval key、dig RPC、chia:// 协议以及链上锚定 —— 每个术语只定义一次，并链接到其详细文档。"
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

# 概念与术语表 {#concepts--glossary}

本页用简明的语言**一次性**定义 DIG Network 的每一个核心实体，并链接到深入介绍它的文档。它是本文档的人类可读脊柱 —— 同时，由于每个术语也以机器可读的结构化数据形式发出，它也是智能体（agent）可以抓取以学习该网络词汇的地图。浏览它以获得整体方向；点击链接以深入了解。

## capsule {#capsule}

**capsule** 是一次不可变的 store 生成版本：即 `(storeId, rootHash)` 这一对值，规范写法为
`storeId:rootHash`。它是该网络的原子单位 —— 涵盖编译（一个固定大小的 WASM 模块）、
[定价](./digstore/cli/onchain-anchoring.md)（mint 或 commit 均按统一的单 capsule 价格计价，以 $DIG
支付）、检索（一个 [URN](#urn) 指向一个 capsule）、缓存和溯源。[store](#store) 是*一系列
capsule 的集合*，每次提交对应一个。这个定义在 dig-store、dig RPC 和 DIG
Browser 中完全一致。→ [完整的 capsule 说明](./intro.md#the-capsule)

## store {#store}

**store** 是一个身份加上其内容与历史：一系列 [capsule](#capsule) 的集合，每次提交对应一个。它的身份是一个
64 位十六进制的 **store id**，该 id *就是*它在链上的 Chia singleton launcher id ——
链上的 singleton 是该 store 当前根哈希的权威来源。store 是 DIG 语境下等价于网站的概念。→ [store 结构](./digstore/format/store-structure.md)

## generation {#generation}

**generation** 是 [store](#store) 的一个已提交状态，由一个**根哈希**（对该 generation 各资源叶子节点计算的
Merkle 根）标识。每次 `commit` 都会将当前内容封装为一个新的、仅追加的
generation —— 这与 [capsule](#capsule) 所指代的正是同一件事。generation 单调递增，就像 Git 历史一样。→ [Generation 与根哈希](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

**URN** 将 dig-store 的地址*与*密钥合二为一，写作一个字符串：
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`。它既能**定位**一个资源，又能**推导出解密它所需的
密钥** —— 拥有这个 URN 就是读取一个公开资源的充分必要条件。面向浏览器的简写形式是
[`chia://` 协议](#chia-protocol)。→ [URN 与加密](./digstore/format/urns-and-encryption.md)

## retrieval key（检索键） {#retrieval-key}

**retrieval key** 是 `SHA-256(canonical_urn)` —— 唯一会离开客户端的地址。它能
定位一个资源的密文，而不泄露其路径或其 [URN](#urn)。它是
*与根哈希无关的*，因此同一个 key 可以在不同 [generation](#generation) 中找到同一个资源；随后收到的字节会针对正确的根哈希进行
[Merkle 验证](#merkle-proof)。独立的
**解密密钥**通过本地（HKDF）从同一个 URN 推导而来，且从不发送。→ [一个字符串，两个值](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle 证明 {#merkle-proof}

每个 [generation](#generation) 都会构建一棵 Merkle 树，每个资源对应一个叶子节点，承诺其提供服务所用的确切
*密文*字节。每个被返回的资源都附带一份**包含性证明（inclusion proof）**，用于证明这些字节确实属于该确切的
根哈希 —— 因此内容无需被解密即可完成验证，节点也永远无需被信任其返回的是真实字节。→ [Merkle 证明](./digstore/format/proofs-and-security.md)

## 链上锚定 {#anchoring}

每个 store 都是 **Chia 主网上的一个 singleton**。`digs init` 会铸造它（launcher id
*即成为*该 store id），而每次 `digs commit` 都会作为一次 CHIP-0035 singleton 更新，将新的
[generation](#generation) 根哈希锚定到链上。两者都会阻塞直到确认完成，并花费真实资金。链是 store
最新根哈希的权威来源。→ [链上锚定](./digstore/cli/onchain-anchoring.md)

## DIG 支付 {#dig-payment}

**$DIG** 是 DIG Network 的代币（一种 Chia CAT）。铸造一个 [capsule](#capsule)（`init`）或对其进行提交
都需要支付**以 $DIG 计价的统一单 capsule 价格**，该费用与锚定操作**原子性地包含在同一笔链上支出**中 ——
不存在单独的交易，且备注（memo）中携带 store id。→ [费用](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store` 是用于创建、提交、共享和读取 store 的命令行工具 —— 在加密的链上 store 格式之上，提供了一套
Git 形态的工作流（`init`、`add`、`commit`、`log`、`clone`、`push`、`pull`）。→ [命令参考](./digstore/cli/command-reference.md) · [CLI 教程](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` 是位于项目根目录、**可提交的项目清单文件** —— 包含 `store-id`、`output-dir`、
`build-command` 及其他项目配置，被 `digs dev`、`digs deploy` 和脚手架模板共用。它**不包含任何机密信息**
（那些来自环境变量），因此可以安全地提交。→ [项目配置与构建期取值](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app`（`npm create dig-app`）是启动 DIG 项目的 **JS 入口**：它会从五个模板
（`static`、`vite-react`、`next-static`、`nft-drop`、`dapp-window-chia`）之一，搭建出一个可运行的初始项目 ——
包含一个应用、一个 [`dig.toml`](#dig-toml)，以及（对于钱包相关模板）已接入的
[DIG SDK](#dig-sdk)。搭建脚手架是**免费**的 —— 不铸造、不上链、不花费；你只有在发布一个 [capsule](#capsule)
时才需要支付统一的 capsule 价格。它是 Rust CLI 中 `digs new` 在 npm 一侧的对应工具。→ [搭建应用脚手架](./build-a-dapp/scaffold.md)

## GitHub 部署 Action {#deploy-action}

`dig-network/deploy-action` 是实现 **git-push-to-deploy** 的 GitHub Action：它会在运行器上安装
[`dig-store` CLI](#digstore-cli)，运行 `digs deploy` 来推进你的 store（从不铸造），并将已发布的
[capsule](#capsule)、URL 和费用以步骤输出（step output）、PR 评论、GitHub Deployment 以及提交状态的形式汇报回去。
在 `if-changed`（默认）模式下，字节完全相同的构建将不做任何操作 —— 不产生任何花费。→ [从 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK**（`@dignetwork/dig-sdk`）是面向集成开发者的类型化 npm 包：包含一个
`ChiaProvider`（优先使用注入的 [`window.chia`](#window-chia)，否则回退到 WalletConnect → Sage）、
一个 `DigClient`（通过 [dig RPC](#dig-rpc) 读取已验证的加密内容）、一个 `Paywall`
（一个组合了 provider 与 spend 构建器的高级付费解锁 / NFT 门控访问辅助工具），以及在
`/spend` 子路径下重新导出的规范 CHIP-0035 spend 构建器。
→ [在 Chia 上构建一个 dapp](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC** 是全网统一的读取接口：一个基于 HTTPS `POST` 的 JSON-RPC 2.0 服务，
每个托管节点的实现都完全一致。它按 [retrieval key](#merkle-proof) 提供密文和
[包含性证明](#retrieval-key)，按 `(storeId, root)` 提供整个 [capsule](#capsule)，还提供发现
元数据 —— 天生盲态，验证与解密均在客户端完成。**它是通用的读取
路径**：每个已发布的 capsule 一旦在链上确认，即可通过它的 [URN](#urn) / [`chia://`](#chia-protocol) 地址在这里
被读取 —— 无需注册，除发布该 capsule 之外无需额外付费。可选的、人类友好的
[`*.on.dig.net` handle](#on-dig-net) 是构建在这之*上*的一个入口；dig RPC 本身
始终可用。→ [什么是 dig RPC？](./rpc/what-is-the-dig-rpc.md)

## chia:// 协议 {#chia-protocol}

`chia://` 是 DIG Browser 原生的内容地址方案 —— 是
[`urn:dig:` URN](#urn) 面向前端、可直接输入的形式。粘贴一个 `chia://<storeId>/` 链接，浏览器就会直接从网络
获取内容，内容可寻址且经过加密学验证。→ [chia:// 协议](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` 是 **DIG Browser** 注入到每个页面中的 Chia 钱包 provider。它遵循
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md)，因此网页应用可以
请求用户的地址、签名和支出，而无需配置 WalletConnect —— 对于已经支持 CHIP-0002 的应用来说，这是一种可直接替换的
方案。→ [使用 window.chia](./browser/using-window-chia.md)
· [window.chia provider 规范](./protocol/window-chia-provider.md)（规范性文档，带版本号）

## DIGHUb {#dighub}

**DIGHUb**（[hub.dig.net](https://hub.dig.net)）是用于发布和管理
[capsule](#capsule) 的网页应用，无需使用 CLI —— 你可以在浏览器中创建一个 capsule、部署前端，并查看你的
store。它同时也是那个受门控管理的控制平面，用于为高成本的零知识执行证明（ZK execution-proof）任务分配预算。

## dig-node {#dig-node}

**dig-node** 是该网络的内容**服务端** —— 供给侧。它托管 [capsule](#capsule)，维护一份
本地的 `.dig` 缓存，并与 `rpc.dig.net` 一样对外提供 [dig RPC](#dig-rpc) 服务。要读取 DIG 内容，你**不需要**
运行一个 dig-node（消费者会回退到 `rpc.dig.net`）；运行一个 dig-node 可以使读取变得本地优先，并且
有助于提升整个网络的服务能力。主机是**盲态**的 —— 它只会中继密文和证明。
→ [运行一个节点](./run-a-node/index.md)

## on.dig.net handle {#on-dig-net}

**on.dig.net handle** 是 [store](#store) 的一个*可选的、付费的*人类友好网址：
`<your-name>.on.dig.net`。store 并**不会**自动获得这个地址 —— 你需要在
[DIGHUb](#dighub) 中注册这个 handle（一次付费的 CHIP-54 / `on.dig.net` 注册），该注册会将该
store 固定到这个名称上。不注册就没有 `*.on.dig.net` 地址。它纯粹是一个便利性的入口：
无论是否存在 handle，该 store 都已经可以通过它的 [dig RPC](#dig-rpc)、以其 [URN](#urn) /
[`chia://`](#chia-protocol) 地址被读取。（账户 handle 与 store slug 是彼此独立的命名空间，不会
自动暴露一个子域名。）→ [我能获得一个 `*.on.dig.net` 地址吗？](./support/faq.md#can-i-use-my-own-domain)

## 相关链接 {#related}

- [DIG Network 概览](./intro.md) —— 一览各基础原语
- [快速开始](./quickstart.md) —— 免费构建与预览，最后再发布一个 capsule
- [在 Chia 上构建一个 dapp](./build-a-dapp/tutorial.md) —— 将每个基础原语串联进一个已发布的 dapp
- [什么是 dig-store？](./digstore/what-is-digstore.md) —— 单文件 store 格式
- [什么是 dig RPC？](./rpc/what-is-the-dig-rpc.md) —— 网络读取路径
- [chia:// 协议](./browser/chia-protocol.md) —— 在浏览器中寻址内容
- [获取帮助](./support/get-help.md) —— 社区渠道与如何提交报告

## 面向智能体与大语言模型 {#for-agents--llms}

本文档是可供机器提取的。每个页面都携带 schema.org 的 JSON-LD 数据（本页作为一组
`DefinedTerm`），站点根目录还提供两份精心整理的地图：

- [`/llms.txt`](pathname:///llms.txt) —— 链接丰富的 markdown 格式文档地图（遵循 [llms.txt 约定](https://llmstxt.org/)）。
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) —— 实体（概念 + 文档）与带类型的边（`defines`、`part-of`、`requires`、`see-also`）。
