---
sidebar_position: 6
title: 疑難排解——解決卡關問題
description: "每一次失敗都會提供一個穩定代碼與一個能直接對應到伺服器日誌的請求識別碼（request-id），鏈上花費具備競爭防護機制因此你絕不會重複付款，而明確的前置檢查機制則能在你花費 $DIG 之前，先攔下會被浪費的 capsule。"
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

# 疑難排解 {#troubleshooting}

> 每一次失敗都會提供一個**穩定代碼**與一個能直接對應到伺服器日誌的**請求識別碼（request-id）**，鏈上花費具備**競爭防護機制**因此你絕不會重複付款，而明確的**前置檢查機制**則能在你花費 $DIG 之前，先攔下會被浪費的 capsule。

## 心智模型——依代碼找出你遇到的失敗原因 {#the-mental-model--find-your-failure-by-its-code}

每一個介面——dig RPC、digstore CLI、DIGHUb、`chia://` 載入器、SDK——都會將失敗對應到一個**穩定代碼**。**永遠依代碼分支處理，而非依錯誤訊息文字。** 有一份統一的分類表涵蓋所有介面，並以機器可讀格式發布。

前置檢查機制（`digstore doctor`、`--dry-run`、`--if-changed`）加上可續傳的錨定機制，代表卡住或無變化的發布**絕不會靜默地花費資金**。

## 常見的發布失敗 {#common-publishing-failures}

資金不足、確認逾時（可續傳——你的花費不會遺失），以及非快轉（non-fast-forward）的「遠端 root 已經推進」錯誤。

→ [疑難排解](../support/troubleshooting.md)

## 讀取與驗證失敗 {#read--verify-failures}

證明不符、解密／salt 錯誤，以及查無結果／誘餌（decoy）回應。

→ [讀取與驗證失敗](../support/troubleshooting.md#verification-failed)

## 錢包與連線問題 {#wallet--session-issues}

連接、重新驗證、被拒絕的請求，以及無法簽署的唯讀（watch-only）連線。

→ [錢包連線無法簽署](../support/troubleshooting.md#wallet-session)

## 前置檢查與費用檢查——別浪費一個 capsule {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor`（環境與就緒狀態檢查）、`--dry-run`（預覽費用與將要產生的 capsule），以及 `--if-changed`（位元組完全相同的建置結果不會有任何動作）。

→ [從 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)．[鏈上錨定 → 費用與安全性](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## 錯誤代碼參考 {#error-codes-reference}

CLI 結束代碼．RPC `-32xxx`．DIGHUb．dig-loader．SDK——統一收錄於一份表格中。

→ [錯誤代碼](../support/error-codes.md)

## 常見問答 {#faq}

費用、免費試用、為何價格是統一的、去哪裡取得 $DIG，以及「有測試網嗎？」。

→ [常見問答](../support/faq.md)

## 取得協助 {#get-help}

Discord 與 GitHub，以及如何提交一份完善的回報——**絕不貼上機密資訊**。

→ [取得協助](../support/get-help.md)

## 狀態與變更紀錄 {#status--changelog}

→ [狀態](../support/status.md)．[變更紀錄](../support/changelog.md)

---

## 深入了解協定 {#go-deeper-the-protocol}

- **讀取與驗證失敗** → [證明與安全性](../digstore/format/proofs-and-security.md)．[URN 與加密](../digstore/format/urns-and-encryption.md)
- **RPC `-32xxx` 代碼** → [dig RPC 方法列表](../rpc/methods.md)．[一致性](../rpc/conformance.md)
- **完整內容** → [協定深入解析](../protocol-deep-dive.md)．[概念與詞彙表](../concepts.md)
