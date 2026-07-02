---
sidebar_position: 1
title: For app developers
description: "发布一个你真正拥有的网站或应用 —— 作为你自己的链上资产铸造出来，而不是租来的。构建与预览完全免费；只有在发布时才需要支付少量统一 $DIG 价格，文件在你的浏览器中加密，因此任何主机都无法读取它们。"
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - digstore
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

# 面向应用开发者 {#for-app-developers}

> **发布一个你真正拥有的网站或应用** —— 作为你自己的链上资产铸造出来，而不是租来的。构建与预览完全**免费**；只有在发布时才需要支付少量**统一 $DIG 价格**，文件**在你的浏览器中加密**，因此任何主机都无法读取它们。

## 心智模型 {#the-mental-model}

**[store](../concepts.md#store)** 是你网站的永久身份 —— 一个由你掌控的链上 singleton。每次发布时，你都会铸造一个不可变的 **[capsule](../concepts.md#capsule)** = `storeId:rootHash`。一个 store 只是你随时间发布的一系列 capsule 的集合。

有两个入口通向**同一个**免费构建 → 付费发布的流程：

- **网页路径** —— [hub.dig.net](https://hub.dig.net) 上的 [DIGHUb](../concepts.md#dighub)：放入一个构建好的文件夹，免费预览，只在发布时连接钱包。
- **CLI / CI 路径** —— [`digstore`](../concepts.md#digstore-cli) CLI + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub 部署 Action](../concepts.md#deploy-action)。

搭建脚手架、构建和预览**完全免费**。你只有在发布一个 capsule 时才需要付费。

| 你在做什么 | 费用 |
|---|---|
| 搭建脚手架、构建、预览草稿 | **免费** |
| 发布你的第一个 capsule（铸造一个 store） | **以 $DIG 计价的统一 capsule 价格** + 少量 XCH 手续费 |
| 发布每一次更新（一个新的 capsule） | **以 $DIG 计价的统一 capsule 价格** + 少量 XCH 手续费 |

## 从这里开始 {#start-here}

- **[快速开始 —— 10 分钟内发布一个站点](../quickstart.md)** —— 最快的路径，网页或 CLI 均可。

## 从网页发布 —— DIGHUb {#publish-from-the-web--dighub}

[**在 DIGHUb 中新建一个 store ↗**](https://hub.dig.net/new)。放入你构建好的站点（你的 `dist/` 或 `build/` 文件夹），在真实读取路径上获得**免费的草稿预览**，只在**发布**这一步才需要连接钱包。参见[快速开始 → 从网页发布](../quickstart.md#a-publish-from-the-web)中的网页流程演示。

## 从 CLI 发布 —— digstore {#publish-from-the-cli--digstore}

这是 Git 形态的流程：`new` → `dev` → `init` → `commit`。

```sh
digstore new vite-react   # scaffold a runnable project — free, no mint
digstore dev              # preview on the real chia:// read path, live-reload — free
digstore init site --dir dist   # mint the store's first capsule (uniform price + XCH fee)
digstore commit -m "v1.1"       # publish an update — a new capsule
```

→ [CLI 快速入门](../digstore/cli/quickstart.md) · [完整的项目工作流](../digstore/cli/project-workflow.md)

## 搭建应用脚手架 —— 5 种模板 {#scaffold-an-app--5-templates}

从一个可运行、已接入钱包的初始项目开始 —— `static`、`vite-react`、`next-static`、`nft-drop` 或 `dapp-window-chia` —— 通过 `digstore new <template>` 或 `npm create dig-app` 均可创建。

→ [搭建应用脚手架](../build-a-dapp/scaffold.md)

## 使用 `digstore dev` 免费预览 {#preview-free-with-digstore-dev}

`digstore dev` 会通过**真实的** DIG 读取路径（加密 → 编译 → 验证 → 解密）为你的项目提供服务，支持热重载，并注入一个开发用的 `window.chia`。你看到的就是访客将会看到的效果 —— 而且不会铸造任何内容，也不会有任何花费。

→ [CLI 快速入门 → 开发与预览](../digstore/cli/quickstart.md)

## `dig.toml` —— 可提交的清单文件 {#digtoml--the-committable-manifest}

项目根目录下的 `dig.toml` 保存 `store-id`、`output-dir`、`build-command`、`remote` 及其他配置 —— 由 `digstore dev`、`digstore deploy` 和脚手架模板共用。它**不包含任何机密信息**（那些来自环境变量），因此可以提交它。

→ [项目配置与构建期取值](../digstore/cli/configuration.md)

## 更新与版本 —— 每次发布都是一个新的 capsule {#updates--versions--each-publish-is-a-new-capsule}

每一次发布都会将当前构建封装为一个**新的不可变 capsule**，并推进你 store 的链上根哈希。旧的 capsule 依然可读；除非读取方固定了某个具体的 `rootHash`，否则该 store 始终解析到其最新版本。

→ [链上锚定](../digstore/cli/onchain-anchoring.md)

## 费用一览 {#what-it-costs}

构建和预览免费；每发布一个 capsule 需要支付**以 $DIG 计价的统一价格**，外加少量 XCH 网络手续费 —— 两者**原子性地**包含在同一笔链上支出中。该价格按 capsule 统一计价，这是有意为之的设计（从而使 capsule 长度不会泄露任何有关你内容的信息）。可在 TibetSwap、dexie.space 或 9mm.pro 上获取 $DIG。

→ [如何获取 DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [为什么每个 capsule 价格都一样？](../support/faq.md#why-uniform-price)

## 从 GitHub Actions 实现 push-to-deploy {#push-to-deploy-from-github-actions}

接入 `dig-network/deploy-action`，让每次推送都发布一个新的 capsule —— 并带有 `if-changed` 防护，使字节完全相同的构建不做任何操作（不产生花费）。

→ [从 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)

## 添加一个 `*.on.dig.net` 网址（可选） {#add-a-ondignet-web-address-optional}

你的 store 一经确认即可通过其 [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) 地址访问 —— 无需额外花费。一个人类友好的 `<name>.on.dig.net` handle 是在此基础上，于 DIGHUb 中进行的**可选付费**注册。

→ [我可以使用自己的域名吗？](../support/faq.md#can-i-use-my-own-domain)

---

## 深入了解：协议 {#go-deeper-the-protocol}

上面这套用大白话讲解的模型，已经足够让你完成发布。当你想了解完整设计时：

- **"一个 store 是一系列 capsule 的集合"** → [概念与术语表](../concepts.md#capsule) · [capsule 与 store 模型](../digstore/format/store-structure.md)
- **"文件在你的浏览器中加密"** → [URN 与加密](../digstore/format/urns-and-encryption.md)
- **"统一价格 + 原子性的 $DIG 支出"** → [链上锚定](../digstore/cli/onchain-anchoring.md#costs) · [CHIP-0035 store-coin 支出](../chip-0035-spends-and-delegation.md)
- **完整内容** → [协议深度解析](../protocol-deep-dive.md)
