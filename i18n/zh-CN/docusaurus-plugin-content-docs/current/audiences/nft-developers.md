---
sidebar_position: 2
title: For NFT developers
description: "铸造一整套 CHIP-0007 合集，其艺术作品永久存放于一个防篡改的 DIG capsule 中 —— 一个原子性的已签名支出包、真实的版税，以及诚实的发行机制，绝不会假装能证明尚未在链上得到证实的事情。"
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# 面向 NFT 开发者 {#for-nft-developers}

> **铸造一整套 CHIP-0007 合集，其艺术作品永久存放于一个防篡改的 DIG capsule 中** —— 一个原子性的已签名支出包、真实的版税，以及诚实的发行机制（揭示 / 白名单 / 阶段发放），绝不会假装能证明尚未在链上得到证实的事情。

## 心智模型 {#the-mental-model}

首先将你的艺术作品放入一个 **[DIG capsule](../concepts.md#capsule)**，然后铸造那些 `data_uris` / `metadata_uris` 指向该 capsule 的 NFT。链上的哈希值锁定了真实的字节内容 —— 因此艺术作品是内容可寻址、可验证且永久存在的，而不是一个可能失效或被替换的链接。

支出**从不手工拼装**：规范的 CHIP-0035 wasm 构建器（通过 [`@dignetwork/dig-sdk/spend`](../sdk.md)）构建每一笔链上支出，你的钱包只需签名一次，然后广播一次。

铸造一个 **store 本身不花费** $DIG —— 你只有在创建一个 capsule 时（即艺术作品被写入一个 capsule 时）才需要支付**统一的 capsule 价格**。

## 搭建一个铸造页面 —— `nft-drop` 模板 {#scaffold-a-mint-page--the-nft-drop-template}

一条命令即可启动一个已接入钱包的发行页面：

```sh
dig-store new nft-drop
# or
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [搭建应用脚手架](../build-a-dapp/scaffold.md)

## 从 CLI 铸造 {#mint-from-the-cli}

资产 CLI 通过 `digstore-chain` 构建器构建支出，使用你的钱包助记词签名，并推送上链 —— 全部支持 `--dry-run` / `--json`，可安全用于 CI：

```sh
dig-store did create                          # an issuer DID for attribution
dig-store collection create --name "My Drop"  # a CHIP-0007 collection
dig-store nft mint --data ./art.png --metadata ./meta.json --dry-run
dig-store offer make ...                       # XCH / CAT trades
```

`nft mint` 的 **capsule-media** 路径会将艺术作品和 CHIP-0007 元数据写入一个 capsule，根据真实字节内容计算出数据/元数据哈希，并将 URI 设置为该 capsule 的 `chia://` 地址（并附带一个 https 网关作为回退）。→ [命令参考](../digstore/cli/command-reference.md)

## 从网页铸造 —— DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

在浏览器中铸造一个由 capsule 支撑的合集：上传艺术作品（会被写入一个 capsule），设置版税，并为归属关系附加一个 DID —— 最后由钱包完成签名。→ [DIGHUb ↗](https://hub.dig.net)

## 发行机制 —— 揭示、白名单、阶段发放 {#drops--reveal-allowlist-phases}

发行机制会**诚实地**呈现：哪些是今天已在链上强制执行的规则，哪些只是链下的便利性功能，等待 claim-coin 这一基础原语落地后才能实现。我们绝不会展示一个尚无法在链上证明的保证。

→ [在 Chia 上构建一个 dapp](../build-a-dapp/tutorial.md) 查看端到端的铸造流程。

## 使用 SDK 构建支出 —— 绝不手工拼装 {#build-spends-with-the-sdk--never-hand-roll}

每一笔链上支出都由规范的 CHIP-0035 wasm 构建，并在 `@dignetwork/dig-sdk/spend` 处重新导出。整个流程始终是**构建 → 签名 → 广播**，这样划分是为了让钱包永远只负责签名。

→ [构建支出](../spends.md) · [DIG SDK](../sdk.md)

## 变现与门控 —— Paywall {#monetize--gate--the-paywall}

SDK 的 `Paywall` 将 provider 与支出构建器组合起来，用于实现**付费解锁**和 **NFT / 合集持有门控**功能 —— 无需手动接入支出逻辑。

→ [DIG SDK → Paywall](../sdk.md#paywall)

## 挂单 —— 创建 / 接受 / 查看 {#offers--make--take--show}

使用 `dig-store offer make | take | show`（均支持 `--dry-run` / `--json`）用 XCH 或 CAT 交易 NFT。→ [命令参考](../digstore/cli/command-reference.md)

---

## 深入了解：协议 {#go-deeper-the-protocol}

- **"防篡改的 capsule"** → [证明与安全](../digstore/format/proofs-and-security.md) · [capsule 与 store 模型](../digstore/format/store-structure.md)
- **"绝不手工拼装支出"** → [CHIP-0035 store-coin 支出与委托](../chip-0035-spends-and-delegation.md)
- **完整内容** → [协议深度解析](../protocol-deep-dive.md) · [概念与术语表](../concepts.md)
