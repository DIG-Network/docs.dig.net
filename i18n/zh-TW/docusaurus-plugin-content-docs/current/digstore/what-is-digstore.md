---
sidebar_position: 1
title: 什麼是 dig-store？
description: "Git 風格、內容定址的專案格式，內建加密與基於 URN 的定址方式；編譯為單一能自我保護的 WebAssembly 模組。"
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

# 什麼是 dig-store？ {#what-is-digstore}

**dig-store 是一種 Git 風格、經過加密、內容定址的專案，會編譯成單一能自我保護的 WebAssembly 模組。**

你會得到 Git 風格的指令——`init`、`add`、`commit`、`log`、`clone`、`push`、`pull`——用來操作一個**靜態加密**並編譯成**單一 `.wasm` 檔案**的專案。這個單一檔案*同時是你的資料，也是控管其存取權限的伺服器*。儲存或轉發它的主機看到的只有以雜湊值定址的密文；它無法讀取自己所攜帶的內容。

你使用 **[URN](./format/urns-and-encryption.md)** 來定址內容，而這個 URN *本身就是*金鑰：它同時負責定位與解密。把 URN 交給某人，他們就能讀取那項資源；沒有它就不行——不需要另外管理密碼或存取清單。

與 Git 不同，dig-store 是為**建置輸出**而設計的，而非儲存庫原始碼。你將專案指向一個像 `dist/` 這樣的目錄，它就會捕捉該處的內容。

## 為什麼需要它 {#why-it-exists}

| 問題 | dig-store 的解法 |
|---|---|
| 主機能讀取／掃描你所發布的內容 | 內容以靜態加密方式儲存；主機只持有以雜湊值為鍵的密文 |
| 存取控管意味著密碼與 ACL | URN *就是*能力憑證——分享它以授予讀取權，不分享則拒絕存取 |
| 你必須信任伺服器會提供真實的位元組 | `clone`／`pull` 在安裝前會驗證模組的 store id、發布者已簽署的 root，以及**鏈上單例的 root**——驗證失敗即拒絕 |
| 「這個內容有多大？」會從檔案大小洩漏出去 | 每個專案都是單一 `.wasm`，經過填充達到統一大小，不會洩漏任何關於內容的資訊 |
| 服務邏輯與資料各自分離 | 資料與控管其存取的程式碼會編譯進*同一個*模組 |

## 如何閱讀本文件 {#how-to-read-these-docs}

- **[dig-store 格式](./format/overview.md)**——核心概念：專案、部署、`.wasm` 模組、URN、加密與證明。如果你想了解 dig-store *是什麼*，請從這裡開始。
- **[CLI 教學](./cli/install.md)**——安裝 CLI 並在實際專案中使用：初始化專案、擷取建置目錄、提交部署、透過遠端分享，並將內容以串流方式讀回。

如果你只想直接試用，可以跳到 **[快速入門](../quickstart.md)**（免費、以網頁優先的路徑）或 **[CLI 教學](./cli/quickstart.md)**。

:::note
dig-store 是 [DIG Network](https://dig.net) 的一部分。完整的技術設計收錄在[協定章節](../protocol-deep-dive.md)——也就是內容定址的 WASM store 格式。
:::

## 相關文件 {#related}

- [dig-store 格式](./format/overview.md)——專案、WASM 模組、URN、加密、證明
- [store 結構](./format/store-structure.md)——store 身分、generation 與已編譯的模組
- [URN 與加密](./format/urns-and-encryption.md)——同時負責定址*與*解密的 URN
- [CLI 教學](./cli/quickstart.md)——幾分鐘內建立、提交並讀取一個 store
- [概念與詞彙表](../concepts.md)——一覽 DIG 核心實體
