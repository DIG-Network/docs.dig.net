---
sidebar_position: 3
title: 面向整合開發者
description: "一個完全機器可讀的平台——OpenAPI／OpenRPC、一套已編目的錯誤分類系統、即時定價、JWKS、逐頁 JSON，以及具型別的 @dignetwork/dig-sdk——讓你把錢包與經過驗證的讀取功能接進你的應用，完全不需要爬梳任何一行人類可讀的說明文字。"
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

# 面向整合開發者 {#for-integration-developers}

> **一個完全機器可讀的平台**——OpenAPI／OpenRPC、一套已編目的錯誤分類系統、即時定價、JWKS、逐頁 JSON，以及具型別的 `@dignetwork/dig-sdk`——讓你把錢包與經過驗證的讀取功能接進你的應用，**完全不需要爬梳任何一行人類可讀的說明文字**。

## 心智模型——兩個各自獨立的介面 {#the-mental-model--two-surfaces-kept-separate}

1. **一個 REST 控制平面**——`hub.dig.net/v1`，採用 bearer-JWT——用於管理 store、網域、團隊與 NFT。
2. **一個與節點無關的 dig JSON-RPC 2.0 讀取路徑**——`rpc.dig.net`——用來串流**經過驗證的密文**。

一個**錢包**介面（[CHIP-0002 `window.chia`](../concepts.md#window-chia)）搭配兩種傳輸方式——注入式（DIG Browser）或 WalletConnect → Sage——透過 SDK 的 `ChiaProvider` 統一起來。花費一律由規範性的 CHIP-0035 wasm 建構，並由使用者的錢包簽署——**絕不手動拼湊**。分支邏輯一律依據**穩定的錯誤代碼**，絕不依賴文字說明。

## 建置一個 dapp——從頭到尾 {#build-a-dapp--end-to-end}

從建立骨架到一個具備錢包功能、上線在你自己網域的應用，一條完整的主線。

→ [在 Chia 上建置 dapp](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk`——`ChiaProvider` + `DigClient` + `Paywall`，以及在 `/spend` 子路徑重新輸出的規範性花費建構器。安裝方式、子路徑，以及 `capabilities()`。

→ [DIG SDK](../sdk.md)

## 連接錢包——`window.chia` {#connect-a-wallet--windowchia}

偵測已注入的 provider、呼叫 `connect()`（依來源各自取得使用者同意），並使用 CHIP-0002 方法。

→ [使用 window.chia](../browser/using-window-chia.md)．規格文件：[window.chia provider](../protocol/window-chia-provider.md)

## 讀取經過驗證的內容——`DigClient` 與 dig RPC 方法 {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` 會串流密文與納入證明，並在用戶端**先驗證再解密**。需要時也可以直接呼叫這些方法。

→ [什麼是 dig RPC？](../rpc/what-is-the-dig-rpc.md)．[方法列表](../rpc/methods.md)

## 串流傳輸與重組 {#streaming--reassembly}

區塊模型、[retrieval key](../concepts.md#retrieval-key)，以及先驗證再解密的順序。

→ [串流傳輸](../rpc/streaming.md)

## 建構花費——規範性的 CHIP-0035 建構器 {#building-spends--the-canonical-chip-0035-builder}

**建構 → 簽署 → 廣播**的分工：wasm 負責建構花費包（spend bundle），錢包負責簽署，你負責廣播。hub 從不手動拼湊花費，你也不應該這麼做。

→ [建構花費](../spends.md)

## hub 的 `/v1` 控制平面 {#the-hub-v1-control-plane}

透過 REST 進行的驗證（JWT／OIDC／裝置配對）、store、網域、分析數據與 webhook。

→ [機器可讀介面](../machine-surfaces.md#openapi)取得 OpenAPI 文件。

## CI 部署——`dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

各種模式、免金鑰的 OIDC、結果列舉值，以及供下游步驟使用的 `--json` 輸出。

→ [從 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)

## 機器可讀介面 {#machine-readable-surfaces}

`/openapi.json`、`/openrpc.json`、`/error-codes.json`、`/llms.txt`、`/knowledge-graph.json`——無需爬梳文字說明即可探索並整合。

→ [機器可讀介面](../machine-surfaces.md)

## 錯誤代碼——依代碼分支處理 {#error-codes--branch-on-the-code}

一份橫跨 dig RPC、CLI、DIGHUb、dig loader 與 SDK 的統一參考文件。

→ [錯誤代碼](../support/error-codes.md)

---

## 深入了解協定 {#go-deeper-the-protocol}

- **「經過驗證的讀取」** → [dig RPC（網路內容介面）](../rpc/what-is-the-dig-rpc.md)．[納入證明 vs. 執行證明](../inclusion-vs-execution-proofs.md)
- **「window.chia」** → [規範性 provider 規格](../protocol/window-chia-provider.md)
- **「retrieval_key 與串流傳輸」** → [URN 與加密](../digstore/format/urns-and-encryption.md#two-values-one-string)．[串流傳輸](../rpc/streaming.md)
- **「部署權杖是一把可撤銷的寫入金鑰」** → [CHIP-0035 花費與委派](../chip-0035-spends-and-delegation.md)
- **完整內容** → [協定深入解析](../protocol-deep-dive.md)．[概念與詞彙表](../concepts.md)
