---
sidebar_position: 2
title: Quickstart
description: "在 DIG 上发布你的第一个站点 —— 构建与预览免费，只有在发布时才需要支付统一的 capsule 价格。网页优先路径（无需先备好钱包），并附带一条并行的 CLI 路径。"
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Quickstart {#quickstart}

将一个站点发布到一个任何主机都无法读取、篡改或下线的网络 —— 大约十分钟即可完成。

**构建与预览完全免费。** 脚手架搭建与预览不花一分钱；只有在你于链上发布一个 [capsule](./concepts.md#capsule) 的那一刻，才需要支付**以 $DIG 计价的统一 capsule 价格**。*先免费迭代，准备好了再发布。*

有两种方式可以做到这一点。大多数人从网页开始。

- **[A. 从网页发布](#a-publish-from-the-web)** —— 在 [DIGHUb](./concepts.md#dighub) 中操作，最后再连接钱包。最适合站点和前端项目。约 10 分钟。
- **[B. 从 CLI 发布](#b-publish-from-the-cli)** —— 在你自己的机器上运行 `digstore`，可脚本化、适配 CI。最适合开发者和自动化场景。

---

## A. 从网页发布 {#a-publish-from-the-web}

最快的路径：在浏览器中构建和预览，只在最后一步才需要为钱包充值。

### 1. 打开 DIGHUb 并创建草稿 —— 免费，无需钱包 {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**在 DIGHUb 中新建一个 store ↗**](https://hub.dig.net/new)。放入你构建好的站点（一个静态文件夹 —— 你的 `dist/` 或 `build/`）。DIGHUb 会给你一个**免费的草稿预览**，精确展示它将如何被提供服务，此时没有任何内容上链，也没有花费任何 $DIG。

此刻你还不需要钱包。你可以随意反复迭代这份草稿 —— 重新上传、重新预览 —— 全程免费。

### 2. 在真实读取路径上预览它 —— 依然免费 {#2-preview-it-on-the-real-read-path--still-free}

预览会通过真实的 DIG 处理流水线（加密 → 编译 → 验证 → 解密）渲染你的站点，因此你看到的就是访客将会看到的效果。点击浏览，检查资源加载与路由。在你选择发布之前，一切都不会发布，也不会有任何花费。

### 3. 发布 —— 为钱包充值并连接 {#3-publish--fund-and-connect-a-wallet}

当草稿看起来没问题时，点击**发布（Publish）**。这是唯一需要付费的步骤：

- 连接一个 Chia 钱包（你的钱包*就是*你的账户 —— 无需邮箱，无需密码）。
- 批准链上支出：**以 $DIG 计价的统一 capsule 价格 + 少量 XCH 手续费**，一次签名即可完成。发布界面会在你签名前显示确切的 $DIG 金额。
- DIGHUb 会铸造你的 store，并在 Chia 主网上发布第一个 **capsule**。

DIG 余额不够？发布界面会显示你的余额以及充值渠道。参见[如何获取 DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) —— TibetSwap、dexie.space 或 9mm.pro。

### 4. 上线完成 {#4-youre-live}

你的 capsule 现已锚定在链上，并**立即可通过 [dig RPC](./concepts.md#dig-rpc) 读取** —— 任何人都可以通过它的 [`urn:dig:` URN](./concepts.md#urn) 或 [`chia://`](./browser/chia-protocol.md) 地址来获取并验证它，无需注册，也无需额外付费。这个 URN 既是**地址**，也是**密钥**；分享它就是分享内容本身。读取路径是通用且免费的；capsule 一经确认即可上线。

**想要一个人类友好的 `*.on.dig.net` 地址？** 这是可选的。只有当你在 DIGHUb 中为 store **注册一个 handle** 时，它才会获得一个 `*.on.dig.net` 子域名 —— 这是一项单独的付费注册，用于将 store 固定到该名称上。在注册之前，不存在 `*.on.dig.net` 地址（上面提到的 URN / `chia://` 地址始终是访问它的规范方式）。参见[我可以使用自己的域名吗？](./support/faq.md#can-i-use-my-own-domain)。

**之后想要发布更新：** 编辑内容，免费预览新草稿，然后再次发布。每次发布的更新都是一个新的 capsule，需要再次支付**统一的 capsule 价格** —— 你只在将草稿提升为永久的链上版本时才需要付费。

:::tip 自动化它
一旦你的 store 创建完成，接入 [从 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md)，让每次推送到 `main` 都自动发布一个新的 capsule —— 实现 git-push-to-deploy。
:::

---

## B. 从 CLI 发布 {#b-publish-from-the-cli}

从终端完成同样的流程 —— 可脚本化，也是 CI 的基础。CLI 与网页路径保持一致：构建和预览不花钱；发布一个 capsule 需要支付以 $DIG 计价的统一 capsule 价格。

### 1. 安装 {#1-install}

```sh
# download the installer for your OS from the Releases page, then:
digstore --version
```

各操作系统的安装程序和源码构建方式参见[安装 CLI](./digstore/cli/install.md)。

### 2. 搭建脚手架并预览 —— 免费，不上链，不花费 {#2-scaffold-and-preview--free-no-chain-no-spend}

在花费任何费用之前，先搭建一个项目脚手架并在本地预览 —— **完全免费，不铸造，不上链**：

```sh
digstore new <template>   # scaffold a wallet-wired project (static · vite-react · next-static · nft-drop · dapp-window-chia) — free, no mint
digstore dev              # watch + compile-on-save + serve the real chia:// read path, with an injected window.chia — free, live-reload
```

`new` 会写入一个可运行的项目（一个 `dig.toml` + 一个初始应用）；`dev` 通过真实的 DIG 读取路径（编译 → 验证 → 解密）来提供服务，并支持热重载。你只有在发布（下一步）时才需要支付统一的 capsule 价格。或者使用你惯用的工具链构建（`npm run build` → `dist/`）并发布该输出。

:::tip 更喜欢 npm？使用 `create-dig-app`
如果你习惯 Node 生态，`npm create dig-app@latest my-app -- --template vite-react` 可以直接从 npm 搭建同样的模板 —— 无需先安装 `digstore` 即可开始。参见[搭建应用脚手架](./build-a-dapp/scaffold.md)。
:::

### 3. 配置钱包（仅发布时需要） {#3-set-up-a-wallet-only-needed-to-publish}

发布会花费真实资金，因此你需要先准备一个助记词和一个已充值的钱包：

```sh
digstore seed generate      # generate a fresh mnemonic (shown once — back it up)
digstore balance            # show your receive address; fund it with XCH + DIG
```

导入、充值与 TTL 详情参见[链上锚定](./digstore/cli/onchain-anchoring.md)。

### 4. 发布你的第一个 capsule {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init` 会在主网上铸造一个 Chia singleton —— **launcher id 即成为你的 store id** —— 并阻塞等待，直到确认完成。

### 5. 发布更新 {#5-ship-updates}

```sh
npm run build                      # produce dist/
digstore add -A                    # stage the whole content root
digstore commit -m "v1.1"          # publish a new capsule (uniform capsule price + XCH fee)
```

对于 CI，一条命令即可完成 add → commit → push 并打印出 URL：

```sh
digstore deploy --output-dir dist --json   # advance an existing store from CI; never mints
```

参见[从 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md)。

### 6. 读回内容 {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # a URN both locates AND decrypts
```

---

## 费用一览 {#what-it-costs}

| 你在做什么 | 费用 |
|---|---|
| 搭建脚手架、构建、预览草稿 | **免费** |
| 发布你的第一个 capsule（`init` / DIGHUb 发布） | **以 $DIG 计价的统一 capsule 价格** + 少量 XCH 手续费 |
| 发布每一次更新（`commit` / 重新发布） | **以 $DIG 计价的统一 capsule 价格** + 少量 XCH 手续费 |

该价格在任何场景下都**按 capsule 统一计价** —— 参见[为什么价格是统一的](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform)。

## 遇到问题？ {#stuck}

- [故障排查](./support/troubleshooting.md) —— 常见故障及其解决方法。
- [常见问题](./support/faq.md) —— 快速解答。
- [获取帮助](./support/get-help.md) —— 社区渠道以及如何提交一份高质量的问题报告。

## 相关链接 {#related}

- [概念与术语表](./concepts.md) —— capsule、store、URN 和 DIG 支付的定义
- [搭建应用脚手架（create-dig-app）](./build-a-dapp/scaffold.md) —— 一条命令即可启动可部署项目（npm 或 CLI）
- [安装 CLI](./digstore/cli/install.md) —— 在你的机器上获取 `digstore`
- [链上锚定](./digstore/cli/onchain-anchoring.md) —— 钱包设置、充值与费用
- [从 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md) —— 在 CI 中实现 push-to-publish
- [CLI 教程](./digstore/cli/quickstart.md) —— 完整的创建-提交-读取全流程演示
