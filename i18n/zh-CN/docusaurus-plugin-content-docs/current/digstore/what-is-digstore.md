---
sidebar_position: 1
title: What is dig-store?
description: "Git 形态、内容可寻址的项目格式，内置加密与基于 URN 的寻址；编译为单一的自我防护 WebAssembly 模块。"
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

# 什么是 dig-store？ {#what-is-digstore}

**dig-store 是一种 Git 形态、加密、内容可寻址的项目，编译为单一的自我防护 WebAssembly 模块。**

你可以使用 Git 风格的命令 —— `init`、`add`、`commit`、`log`、`clone`、`push`、`pull` —— 来管理一个**静态加密**、并编译为**单个 `.wasm` 文件**的项目。这个单一文件*既是你的数据，也是控制访问权限的服务端*。存储或中继它的主机看到的只是按哈希寻址的密文；它无法读取自己所承载的内容。

你通过一个 **[URN](./format/urns-and-encryption.md)** 来寻址内容，而这个 URN *就是*密钥：它既能定位内容，也能解密内容。把 URN 交给某人，他们就能读取该资源；没有它，他们就无法读取 —— 不存在需要单独管理的密码或访问列表。

与 Git 不同，dig-store 是为**构建产物**而设计的，而不是仓库源码。你将一个项目指向像 `dist/` 这样的目录，它就会捕获其中的内容。

## 它为什么存在 {#why-it-exists}

| 问题 | dig-store 的解答 |
|---|---|
| 主机可以读取 / 扫描你发布的内容 | 内容静态加密；主机只持有以哈希为键的密文 |
| 访问控制意味着密码和 ACL | URN *就是*访问凭证 —— 分享它即授予读取权限，不分享即拒绝访问 |
| 你必须信任服务器返回的是真实字节 | `clone`/`pull` 会在安装前验证模块的 store id、发布者的签名根，以及**链上的 singleton 根哈希** —— 失败即拒绝 |
| “这份内容有多大？”这种信息会从文件大小中泄露 | 每个项目都是一个 `.wasm` 文件，被填充为统一的大小，不会泄露任何有关其内容的信息 |
| 服务逻辑与数据相互分离 | 数据和控制访问权限的代码被编译进*同一个*模块 |

## 如何阅读本文档 {#how-to-read-these-docs}

- **[dig-store 格式](./format/overview.md)** —— 核心概念：项目、部署、`.wasm` 模块、URN、加密与证明。如果你想了解 dig-store*是什么*，从这里开始。
- **[CLI 教程](./cli/install.md)** —— 安装 CLI 并在真实项目中使用它：初始化一个项目、捕获一个构建目录、提交部署、通过远程仓库共享，以及将内容流式读取回来。

如果你只是想试试看，可以直接跳到 **[快速开始](../quickstart.md)**（免费、网页优先的路径）或 **[CLI 教程](./cli/quickstart.md)**。

:::note
dig-store 是 [DIG Network](https://dig.net) 的一部分。完整的技术设计参见[协议部分](../protocol-deep-dive.md) —— 内容可寻址的 WASM store 格式。
:::

## 相关链接 {#related}

- [dig-store 格式](./format/overview.md) —— 项目、WASM 模块、URN、加密、证明
- [store 结构](./format/store-structure.md) —— store 身份、generation 与已编译的模块
- [URN 与加密](./format/urns-and-encryption.md) —— 既能寻址又能解密的 URN
- [CLI 教程](./cli/quickstart.md) —— 几分钟内创建、提交并读取一个 store
- [概念与术语表](../concepts.md) —— DIG 核心实体一览
