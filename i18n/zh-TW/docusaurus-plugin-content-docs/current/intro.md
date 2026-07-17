---
sidebar_position: 1
slug: /
title: DIG Network
description: "DIG Network 核心元件總覽：用於內容定址發布的 dig-store、用於盲目託管與取回的 dig RPC，以及用於存取內容的 DIG Browser。"
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - dig-store
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network 是建構於 Chia 之上的權益證明（Proof-of-Stake）Layer 2**——一個去中心化網路，讓你在不必信任託管方的情況下發布、定址並提供內容。

本文件涵蓋這個網路及其**核心元件（primitives）**：開發者用來在 DIG 之上構建應用的可組合基礎模組。網路仍在持續擴展，未來會有更多核心元件納入本文件。

:::info $DIG 驅動整個網路
**$DIG 是 DIG Network 的引擎與經濟體系。** 發布 capsule、擁有 store、向創作者打賞——每一次價值交換都透過 $DIG 流動。消費內容始終輕鬆、免費：閱讀永遠不需要付費，付費只發生在發布與擁有環節。
:::

## capsule {#the-capsule}

有一個概念貫穿每個核心元件。**capsule** 是單一不可變的 store 世代（generation）——即一對 `(storeId, rootHash)`，以 `storeId:rootHash` 的形式規範表示。**store 是一連串 capsule 的序列**，每次提交（commit）產生一個（每次提交都會推進鏈上的 root 並產生新的 capsule）。

capsule 是這個網路的以下各項單位：

- **編譯（Compilation）**——每個 capsule 會編譯成一個固定大小的 WASM 模組（經過填充，使其長度不會洩漏任何關於內容大小的資訊）。
- **定價（Pricing）**——**每個 capsule 統一定價**（鑄造或提交），以即時匯率換算成 $DIG 支付；一個 store 的終身成本即為統一 capsule 價格 × capsule 數量。
- **取回（Retrieval）**——一個 URN 指向一個 capsule（以及其中選擇性的某個資源）。
- **快取（Caching）**——主機或瀏覽器以 `storeId:rootHash` 為鍵快取 capsule；本地快取即是一組 capsule 的集合。
- **來源證明（Provenance）**——每個 capsule 的 root 都帶有發布者的 BLS 簽章與 Merkle root。

這是整個生態系統通用的定義：「capsule = `(storeId, rootHash)`」在 dig-store、dig RPC 與 DIG Browser 中意義完全相同。

:::tip 立即體驗
[**在 DIGHUb 建立你的第一個 capsule ↗**](https://hub.dig.net/new)——直接在瀏覽器中發布網站，無需使用 CLI。每個 capsule（鑄造或提交）花費**統一的 capsule 價格（以 $DIG 計價）**。
:::

## 核心元件 {#primitives}

### 🗄️ dig-store {#️-digstore}

第一個也是最基礎的核心元件：一種**內容定址、加密的 WASM 專案格式**。你指定一個建置目錄，像 Git 一樣提交部署，最終得到一個能自我保護的單一 `.wasm` 檔案，這個檔案既是你的資料，也是控管存取權限的伺服器。URN *本身就是*金鑰——它同時負責定位與解密。

→ **[深入了解 dig-store](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[什麼是 dig-store？](./digstore/what-is-digstore.md)** | 一句話說完的單檔案概念 |
| **[格式規範](./digstore/format/overview.md)** | 專案、部署、URN、加密與證明 |
| **[CLI 教學](./digstore/cli/quickstart.md)** | 在你的專案中安裝並使用 `dig-store` |

### 🛰️ dig RPC {#️-dig-rpc}

網路層的核心元件：一個**用於讀取託管 dig-store 部署內容的標準介面**。透過 HTTPS `POST` 傳輸的 JSON-RPC 2.0——每個託管節點都以完全相同的方式回應，因此內容可攜、用戶端與節點無關。它依取回鍵（retrieval key）提供密文與納入證明（inclusion proof）、依 `(store_id, root)` 提供完整部署，以及公開的探索清單（manifest）——以區塊串流方式傳輸，天生具有盲目性，全程在用戶端進行驗證與解密。

→ **[深入了解 dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[什麼是 dig RPC？](./rpc/what-is-the-dig-rpc.md)** | 整個網路讀取路徑的單一端點 |
| **[方法列表](./rpc/methods.md)** | `dig.getContent`、`dig.getCapsule`、`dig.getManifest`、`dig.listCapsules`……等 |
| **[串流傳輸](./rpc/streaming.md)** | 區塊模型、重組與證明驗證 |
| **[一致性與安全性](./rpc/conformance.md)** | 盲目模型、CORS，以及節點必須實作的內容 |

### 🌐 DIG Browser {#-dig-browser}

用戶端的核心元件：一個**內建 Chia 錢包的瀏覽器**。它會在每個頁面注入 `window.chia` 提供者（provider），因此任何網頁應用都能請求使用者的地址、簽章與花費，完全不需要設定 WalletConnect——對於已經支援 CHIP-0002 的應用來說，這是一個即插即用的替代方案。它也能直接解析 `chia://` 內容地址。

→ **[針對 DIG Browser 進行開發](./browser/using-window-chia.md)**

| | |
|---|---|
| **[在你的應用中使用 `window.chia`](./browser/using-window-chia.md)** | 偵測已注入的錢包、連接並呼叫 CHIP-0002 方法 |

:::tip 立即體驗
[**取得 DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases)——下載瀏覽器以開啟 `chia://` 內容並使用內建錢包。
:::

*更多核心元件——結算與節點運作——將在陸續推出時獲得專屬章節。*

## 選擇你的路徑 {#pick-your-path}

本文件依照**你正在做的事情**來組織。每個路線一開始都會用十秒鐘說明「為什麼」、你需要的心智模型，以及高訊號密度的實作方法——接著在你想深入了解時連結到協定細節。

- **[發布屬於你自己的網站或應用](./audiences/app-developers.md)**——將網站／應用作為你自己的鏈上資產發布；免費建置，發布一個 capsule。
- **[鑄造 NFT 與收藏系列](./audiences/nft-developers.md)**——由永久、防竄改的 capsule 支撐的 CHIP-0007 發行。
- **[將 DIG 整合進你的應用](./audiences/integration-developers.md)**——一套具型別的 SDK 加上完全機器可讀的平台。
- **[運行一個節點](./run-a-node/index.md)**——以可證明且對提供者盲目的方式提供內容服務。
- **[開啟 chia:// 內容](./audiences/content-consumers.md)**——閱讀由你自己的瀏覽器對照鏈上狀態驗證過的內容。
- **[遇到問題？](./audiences/troubleshooting.md)**——依穩定代碼找到你遇到的失敗原因。

還不熟悉這些詞彙？瀏覽一下[概念與詞彙表](./concepts.md)。想了解完整設計？閱讀[協定深入解析](./protocol-deep-dive.md)。

:::note
DIG Network 及其核心元件皆為開放原始碼。dig-store 採用 GPL-2.0 授權；詳見 [dig-store 儲存庫](https://github.com/DIG-Network/dig-store)。
:::

## 相關文件 {#related}

- [快速入門](./quickstart.md)——發布你的第一個網站；建置與預覽皆免費
- [在 Chia 上建置 dapp](./build-a-dapp/tutorial.md)——一份教學涵蓋所有核心元件
- [概念與詞彙表](./concepts.md)——DIG 核心實體的定義與連結
- [什麼是 dig-store？](./digstore/what-is-digstore.md)——內容定址的 store 格式
- [什麼是 dig RPC？](./rpc/what-is-the-dig-rpc.md)——全網通用的讀取介面
- [chia:// 協定](./browser/chia-protocol.md)——在 DIG Browser 中開啟內容
- [取得協助](./support/get-help.md)——社群、疑難排解與錯誤代碼
