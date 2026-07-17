---
sidebar_position: 1
title: 面向應用開發者
description: "發布一個你真正擁有的網站或應用——以你自己的資產形式鑄造在鏈上，而不是租來的。免費建置與預覽；只有在發布時才需支付小額的統一 $DIG 價格，且所有檔案都在你的瀏覽器中加密，因此沒有任何主機能讀取它們。"
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
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

# 面向應用開發者 {#for-app-developers}

> **發布一個你真正擁有的網站或應用**——以你自己的資產形式鑄造在鏈上，而不是租來的。免費建置與預覽；只有在發布時才需支付小額的**統一 $DIG 價格**，且所有檔案都**在你的瀏覽器中加密**，因此沒有任何主機能讀取它們。

## 心智模型 {#the-mental-model}

**[store](../concepts.md#store)** 是你網站的永久身分——一個由你自己掌控的鏈上單例。每次發布時，你都會鑄造一個不可變的 **[capsule](../concepts.md#capsule)** = `storeId:rootHash`。store 就是你隨時間發布的一連串 capsule 序列。

有兩道前門，通向**同一個**「免費建置 → 付費發布」循環：

- **網頁路徑**——[hub.dig.net](https://hub.dig.net) 上的 [DIGHUb](../concepts.md#dighub)：拖曳放入已建置的資料夾、免費預覽，只有在發布時才連接錢包。
- **CLI／CI 路徑**——[`dig-store`](../concepts.md#digstore-cli) CLI + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub 部署 Action](../concepts.md#deploy-action)。

建立骨架、建置與預覽都**不花任何費用**。你只有在發布一個 capsule 時才需付費。

| 你正在做的事 | 費用 |
|---|---|
| 建立骨架、建置、預覽草稿 | **免費** |
| 發布你的第一個 capsule（鑄造一個 store） | **統一的 capsule 價格（以 $DIG 計價）** + 少量 XCH 手續費 |
| 發布每一次更新（一個新的 capsule） | **統一的 capsule 價格（以 $DIG 計價）** + 少量 XCH 手續費 |

## 從這裡開始 {#start-here}

- **[快速入門——10 分鐘發布一個網站](../quickstart.md)**——最快的路徑，網頁或 CLI 皆可。

## 從網頁發布——DIGHUb {#publish-from-the-web--dighub}

[**在 DIGHUb 建立新的 store ↗**](https://hub.dig.net/new)。拖曳放入你建置好的網站（你的 `dist/` 或 `build/` 資料夾），在真實的讀取路徑上取得**免費的草稿預覽**，只有在**發布**步驟才需要連接錢包。完整的網頁流程請參見[快速入門 → 從網頁發布](../quickstart.md#a-publish-from-the-web)。

## 從 CLI 發布——dig-store {#publish-from-the-cli--digstore}

Git 風格的流程：`new` → `dev` → `init` → `commit`。

```sh
digs new vite-react   # 建立一個可直接執行的專案骨架——免費，不鑄造
digs dev              # 在真實的 chia:// 讀取路徑上預覽，即時重新載入——免費
digs init site --dir dist   # 鑄造該 store 的第一個 capsule（統一價格加上 XCH 手續費）
digs commit -m "v1.1"       # 發布一次更新——一個新的 capsule
```

→ [CLI 快速入門](../digstore/cli/quickstart.md)．[完整的專案工作流程](../digstore/cli/project-workflow.md)

## 建立應用骨架——5 種範本 {#scaffold-an-app--5-templates}

從一個可直接執行、已接好錢包的起始專案開始——`static`、`vite-react`、`next-static`、`nft-drop` 或 `dapp-window-chia`——透過 `digs new <template>` 或 `npm create dig-app`。

→ [建立應用骨架](../build-a-dapp/scaffold.md)

## 使用 `digs dev` 免費預覽 {#preview-free-with-digstore-dev}

`digs dev` 會透過**真實的** DIG 讀取路徑（加密 → 編譯 → 驗證 → 解密）提供你的專案，附帶即時重新載入以及注入的開發版 `window.chia`。你所看到的畫面就是訪客會看到的畫面——而且不會鑄造任何東西，也不會有任何花費。

→ [CLI 快速入門 → 開發與預覽](../digstore/cli/quickstart.md)

## `dig.toml`——可提交的設定檔 {#digtoml--the-committable-manifest}

專案根目錄的 `dig.toml` 存放 `store-id`、`output-dir`、`build-command`、`remote` 以及其他設定，由 `digs dev`、`digs deploy` 與骨架範本共用。它**不含任何機密資訊**（那些來自環境變數），因此可以提交它。

→ [專案設定與建置時期的數值](../digstore/cli/configuration.md)

## 更新與版本——每次發布都是一個新的 capsule {#updates--versions--each-publish-is-a-new-capsule}

每一次發布都會將目前的建置結果封存為一個**新的不可變 capsule**，並推進你 store 的鏈上 root。舊的 capsule 依然可讀；除非讀取端指定了特定的 `rootHash`，否則 store 永遠會解析為最新版本。

→ [鏈上錨定](../digstore/cli/onchain-anchoring.md)

## 費用一覽 {#what-it-costs}

建置與預覽免費；每發布一個 capsule 需支付**統一的 $DIG 價格**，外加少量的 XCH 網路手續費——這些會**原子性地**包含在同一筆鏈上花費中。這個價格依設計統一，不因 capsule 而異（因此 capsule 的長度不會洩漏任何關於你內容的資訊）。可在 TibetSwap、dexie.space 或 9mm.pro 取得 $DIG。

→ [如何取得 DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig)．[為什麼每個 capsule 的價格都一樣？](../support/faq.md#why-uniform-price)

## 從 GitHub Actions 實現推送即部署 {#push-to-deploy-from-github-actions}

串接 `dig-network/deploy-action`，讓每次推送都發布一個新的 capsule——搭配 `if-changed` 防護機制，使位元組完全相同的建置結果不會產生任何動作（不花費）。

→ [從 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)

## 加上 `*.on.dig.net` 網址（選配） {#add-a-ondignet-web-address-optional}

你的 store 一經確認即可透過其 [URN](../concepts.md#urn)／[`chia://`](../browser/chia-protocol.md) 地址存取——不需額外費用。人性化的 `<name>.on.dig.net` 代稱，則是在 DIGHUb 中額外進行的一項**選配、付費**註冊。

→ [我可以使用自己的網域嗎？](../support/faq.md#can-i-use-my-own-domain)

---

## 深入了解協定 {#go-deeper-the-protocol}

上面這套淺顯的模型已足夠讓你發布內容。當你想了解完整的設計時：

- **「store 是一連串 capsule 的序列」** → [概念與詞彙表](../concepts.md#capsule)．[capsule 與 store 模型](../digstore/format/store-structure.md)
- **「檔案在你的瀏覽器中加密」** → [URN 與加密](../digstore/format/urns-and-encryption.md)
- **「統一價格加上原子性的 $DIG 花費」** → [鏈上錨定](../digstore/cli/onchain-anchoring.md#costs)．[CHIP-0035 store 幣花費](../chip-0035-spends-and-delegation.md)
- **完整內容** → [協定深入解析](../protocol-deep-dive.md)
