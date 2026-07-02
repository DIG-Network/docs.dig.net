---
sidebar_position: 3
title: For integration developers
description: "一个完全机器可读的平台 —— OpenAPI/OpenRPC、一套完整分类的错误体系、实时定价、JWKS、逐页 JSON，以及一个类型化的 @dignetwork/dig-sdk —— 让你无需抓取一行人类阅读的文字说明，就能将钱包与已验证的读取能力接入你的应用。"
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# 面向集成开发者 {#for-integration-developers}

> **一个完全机器可读的平台** —— OpenAPI/OpenRPC、一套完整分类的错误体系、实时定价、JWKS、逐页 JSON，以及一个类型化的 `@dignetwork/dig-sdk` —— 让你**无需抓取一行人类阅读的文字说明**，就能将钱包与已验证的读取能力接入你的应用。

## 心智模型 —— 两个相互独立的接口平面 {#the-mental-model--two-surfaces-kept-separate}

1. **一个 REST 控制平面** —— `hub.dig.net/v1`，使用 bearer-JWT —— 用于管理 store、域名、团队和 NFT。
2. **一个与节点无关的 dig JSON-RPC 2.0 读取路径** —— `rpc.dig.net` —— 用于流式传输**已验证的密文**。

一个**钱包**接口（[CHIP-0002 `window.chia`](../concepts.md#window-chia)）覆盖两种传输方式 —— 注入式（DIG Browser）或 WalletConnect → Sage —— 由 SDK 的 `ChiaProvider` 统一封装。所有支出都由规范的 CHIP-0035 wasm 构建，并由用户的钱包签名 —— **绝不手工拼装**。始终基于**稳定的错误码**进行分支判断，而不是基于文字说明。

## 构建一个 dapp —— 端到端 {#build-a-dapp--end-to-end}

从脚手架到一个具备钱包能力的应用上线，一条完整的线索贯穿始终。

→ [在 Chia 上构建一个 dapp](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` —— `ChiaProvider` + `DigClient` + `Paywall`，以及在 `/spend` 子路径下重新导出的规范支出构建器。安装方式、子路径与 `capabilities()`。

→ [DIG SDK](../sdk.md)

## 连接钱包 —— `window.chia` {#connect-a-wallet--windowchia}

检测已注入的 provider，调用 `connect()`（按来源逐一授权），并使用 CHIP-0002 方法。

→ [使用 window.chia](../browser/using-window-chia.md) · 规范文档：[window.chia provider](../protocol/window-chia-provider.md)

## 读取已验证的内容 —— `DigClient` + dig RPC 方法 {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` 会流式传输密文和包含性证明，并在客户端**先验证再解密**。需要时也可以直接调用这些方法。

→ [什么是 dig RPC？](../rpc/what-is-the-dig-rpc.md) · [方法列表](../rpc/methods.md)

## 流式传输与重组 {#streaming--reassembly}

分块模型、[检索键](../concepts.md#retrieval-key)，以及先验证再解密的顺序。

→ [流式传输](../rpc/streaming.md)

## 构建支出 —— 规范的 CHIP-0035 构建器 {#building-spends--the-canonical-chip-0035-builder}

**构建 → 签名 → 广播**的分离流程：wasm 构建支出包（spend bundle），钱包完成签名，由你负责广播。hub 从不手工拼装支出，你也不应该这么做。

→ [构建支出](../spends.md)

## hub 的 `/v1` 控制平面 {#the-hub-v1-control-plane}

通过 REST 完成认证（JWT / OIDC / 设备配对）、store、域名、分析数据和 webhook。

→ [机器可读接口](../machine-surfaces.md#openapi) 查看 OpenAPI 文档。

## CI 部署 —— `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

各种模式、无密钥 OIDC、结果枚举，以及供下游步骤使用的 `--json` 输出。

→ [从 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)

## 机器可读接口 {#machine-readable-surfaces}

`/openapi.json`、`/openrpc.json`、`/error-codes.json`、`/llms.txt`、`/knowledge-graph.json` —— 无需抓取文字说明即可发现并完成集成。

→ [机器可读接口](../machine-surfaces.md)

## 错误码 —— 基于错误码进行分支判断 {#error-codes--branch-on-the-code}

一份统一的参考文档，涵盖 dig RPC、CLI、DIGHUb、dig loader 以及 SDK。

→ [错误码](../support/error-codes.md)

---

## 深入了解：协议 {#go-deeper-the-protocol}

- **"已验证的读取"** → [dig RPC（网络内容接口）](../rpc/what-is-the-dig-rpc.md) · [包含性证明 vs 执行证明](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [规范性的 provider 规范文档](../protocol/window-chia-provider.md)
- **"retrieval_key 与流式传输"** → [URN 与加密](../digstore/format/urns-and-encryption.md#two-values-one-string) · [流式传输](../rpc/streaming.md)
- **"部署令牌是一个可撤销的写入密钥"** → [CHIP-0035 支出与委托](../chip-0035-spends-and-delegation.md)
- **完整内容** → [协议深度解析](../protocol-deep-dive.md) · [概念与术语表](../concepts.md)
