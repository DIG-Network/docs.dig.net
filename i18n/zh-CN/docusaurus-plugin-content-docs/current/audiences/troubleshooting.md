---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "每一次失败都会给你一个稳定的错误码和一个可以直接对应到服务器日志的 request-id，链上支出具备竞态防护因此你永远不会重复付款，清晰的预检防护会在花费 $DIG 之前拦截无谓的 capsule 浪费。"
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# 故障排查 {#troubleshooting}

> 每一次失败都会给你一个**稳定的错误码**和一个可以直接对应到服务器日志的 **request-id**，链上支出具备**竞态防护**因此你永远不会重复付款，清晰的**预检防护**会在花费 $DIG 之前拦截无谓的 capsule 浪费。

## 心智模型 —— 通过错误码定位你的故障 {#the-mental-model--find-your-failure-by-its-code}

每一个接口 —— dig RPC、digstore CLI、DIGHUb、`chia://` 加载器、SDK —— 都会将一次失败映射到一个**稳定的错误码**。**始终基于错误码进行分支判断，绝不基于错误信息文字。** 一份统一的目录涵盖了所有这些错误码，并且同样以机器可读的形式发布。

预检防护（`digstore doctor`、`--dry-run`、`--if-changed`）以及可续传的锚定操作，意味着一次卡住或无操作的发布**永远不会静默地产生花费**。

## 常见发布故障 {#common-publishing-failures}

余额不足、确认超时（可续传 —— 你的支出不会丢失），以及非快进式的"remote root has advanced"（远程根已推进）错误。

→ [故障排查](../support/troubleshooting.md)

## 读取与验证故障 {#read--verify-failures}

证明不匹配、解密/salt 错误，以及未找到 / 诱饵（decoy）响应。

→ [读取与验证故障](../support/troubleshooting.md#verification-failed)

## 钱包与会话问题 {#wallet--session-issues}

连接、重新认证、被拒绝的请求，以及无法签名的只读会话。

→ [钱包会话无法签名](../support/troubleshooting.md#wallet-session)

## 预检与费用检查 —— 不浪费一个 capsule {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor`（环境与就绪状态检查）、`--dry-run`（预览费用和即将产生的 capsule），以及 `--if-changed`（字节完全相同的构建将不做任何操作）。

→ [从 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md) · [链上锚定 → 费用与安全](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## 错误码参考 {#error-codes-reference}

CLI 退出码 · RPC `-32xxx` · DIGHUb · dig-loader · SDK —— 一张统一的对照表。

→ [错误码](../support/error-codes.md)

## 常见问题 {#faq}

费用、免费试用、为什么价格是统一的、去哪里获取 $DIG，以及"有测试网吗？"。

→ [常见问题](../support/faq.md)

## 获取帮助 {#get-help}

Discord + GitHub，以及如何提交一份高质量的问题报告 —— **切勿粘贴任何机密信息**。

→ [获取帮助](../support/get-help.md)

## 状态与更新日志 {#status--changelog}

→ [状态](../support/status.md) · [更新日志](../support/changelog.md)

---

## 深入了解：协议 {#go-deeper-the-protocol}

- **读取与验证故障** → [证明与安全](../digstore/format/proofs-and-security.md) · [URN 与加密](../digstore/format/urns-and-encryption.md)
- **RPC `-32xxx` 错误码** → [dig RPC 方法列表](../rpc/methods.md) · [一致性](../rpc/conformance.md)
- **完整内容** → [协议深度解析](../protocol-deep-dive.md) · [概念与术语表](../concepts.md)
