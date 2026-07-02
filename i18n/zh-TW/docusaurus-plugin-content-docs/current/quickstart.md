---
sidebar_position: 2
title: 快速入門
description: "在 DIG 上發布你的第一個網站——建置與預覽免費，只有在發布時才需支付統一的 capsule 價格。以網頁優先的路徑（一開始不需要錢包），並附上一條並行的 CLI 路徑。"
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

# 快速入門 {#quickstart}

將網站發布到一個沒有任何主機能讀取、竄改或下架的網路——大約只需十分鐘。

**建置與預覽完全免費。** 建立骨架與預覽不花任何費用；只有在你於鏈上發布 [capsule](./concepts.md#capsule) 的那一刻，才需要支付**統一的 capsule 價格（以 $DIG 計價）**。*先免費迭代，準備好了再發布。*

有兩種做法，多數人會從網頁版開始。

- **[A. 從網頁發布](#a-publish-from-the-web)**——在 [DIGHUb](./concepts.md#dighub) 中，最後才連接錢包。最適合網站與前端應用。約 10 分鐘。
- **[B. 從 CLI 發布](#b-publish-from-the-cli)**——在你自己的機器上使用 `digstore`，可寫成腳本、適合 CI。最適合開發者與自動化流程。

---

## A. 從網頁發布 {#a-publish-from-the-web}

最快的路徑：在瀏覽器中建置並預覽，只在最後一步才需要為錢包注資。

### 1. 開啟 DIGHUb 並建立草稿——免費，不需錢包 {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**在 DIGHUb 建立新的 store ↗**](https://hub.dig.net/new)。拖曳放入你建置好的網站（一個包含靜態檔案的資料夾——你的 `dist/` 或 `build/`）。DIGHUb 會提供**免費的草稿預覽**，讓你確切看到它實際服務的樣子，完全不上鏈、不花任何 $DIG。

你現在還不需要錢包。可以隨意多次迭代這份草稿——重新上傳、重新預覽——完全免費。

### 2. 在真實的讀取路徑上預覽——仍然免費 {#2-preview-it-on-the-real-read-path--still-free}

這個預覽是透過真正的 DIG 流程（加密 → 編譯 → 驗證 → 解密）來呈現你的網站，因此你看到的畫面就是訪客會看到的畫面。點擊瀏覽，檢查資源與路由。除非你主動選擇，否則不會發布任何內容，也不會花費任何費用。

### 3. 發布——為錢包注資並連接 {#3-publish--fund-and-connect-a-wallet}

當草稿看起來沒問題時，點擊**發布**。這是唯一需要花費的步驟：

- 連接一個 Chia 錢包（你的錢包*就是*你的帳號——不需要電子郵件，也不需要密碼）。
- 核准鏈上花費：**統一的 capsule 價格（以 $DIG 計價）加上一小筆 XCH 手續費**，只需一次簽章。發布畫面會在你簽署之前顯示確切的 $DIG 金額。
- DIGHUb 會鑄造你的 store，並在 Chia 主網上發布第一個 **capsule**。

$DIG 不夠嗎？發布畫面會顯示你的餘額以及可以在哪裡儲值。參見[如何取得 DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig)——TibetSwap、dexie.space 或 9mm.pro。

### 4. 上線完成 {#4-youre-live}

你的 capsule 現在已經錨定在鏈上，並且**立即可透過 [dig RPC](./concepts.md#dig-rpc) 讀取**——任何人都能透過它的 [`urn:dig:` URN](./concepts.md#urn) 或 [`chia://`](./browser/chia-protocol.md) 地址擷取並驗證它，不需要註冊，也不需再支付任何費用。URN 同時是地址*也是*金鑰；分享它就等於分享內容。讀取路徑是全球通用且免費的；capsule 一經確認即可上線。

**想要一個人性化的 `*.on.dig.net` 地址嗎？** 那是選配的。只有在你於 DIGHUb 為 store **註冊一個代稱（handle）**時，該 store 才會取得 `*.on.dig.net` 子網域——這是另一項需要付費的獨立註冊，將 store 固定綁定到該名稱。在你註冊代稱之前，並不存在 `*.on.dig.net` 網址（上述的 URN／`chia://` 地址永遠是抵達該內容的規範方式）。參見[我可以使用自己的網域嗎？](./support/faq.md#can-i-use-my-own-domain)。

**之後要發布更新：** 編輯、免費預覽新的草稿，然後再次發布。每一次發布的更新都是一個新的 capsule，並且會再次收取**統一的 capsule 價格**——只有在你將草稿升級為永久的鏈上版本時才需付費。

:::tip 自動化流程
一旦你的 store 建立完成，串接 [從 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md)，讓每次推送到 `main` 都自動發布新的 capsule——git-push-to-deploy。
:::

---

## B. 從 CLI 發布 {#b-publish-from-the-cli}

同樣的流程改在終端機中執行——可寫成腳本，也是 CI 的基礎。CLI 路徑與網頁路徑相互對應：建置與預覽不花費任何費用；發布一個 capsule 需支付統一的 capsule 價格（以 $DIG 計價）。

### 1. 安裝 {#1-install}

```sh
# 從 Releases 頁面下載適用於你作業系統的安裝程式，然後執行：
digstore --version
```

各作業系統的安裝方式與原始碼建置方法，參見[安裝 CLI](./digstore/cli/install.md)。

### 2. 建立骨架並預覽——免費、不上鏈、不花費 {#2-scaffold-and-preview--free-no-chain-no-spend}

建立專案骨架並在本地預覽——**免費、不鑄造、不上鏈**——在你真正花費之前：

```sh
digstore new <template>   # 建立一個已接好錢包的專案骨架（static · vite-react · next-static · nft-drop · dapp-window-chia）——免費，不鑄造
digstore dev              # 監看檔案變更、儲存時編譯，並提供真實的 chia:// 讀取路徑，附帶注入的 window.chia——免費、即時重新載入
```

`new` 會寫入一個可直接執行的專案（一個 `dig.toml` 加上一個起始應用程式）；`dev` 則透過真正的 DIG 讀取路徑（編譯 → 驗證 → 解密）以即時重新載入的方式提供服務。只有在發布時（下一步）才需支付統一的 capsule 價格。或者也可以用你慣用的工具鏈建置（`npm run build` → `dist/`），再發布該輸出結果。

:::tip 偏好使用 npm？試試 `create-dig-app`
如果你習慣 Node 生態系，`npm create dig-app@latest my-app -- --template vite-react` 可以直接從 npm 建立相同的專案骨架——一開始不需要安裝 `digstore`。參見[建立應用骨架](./build-a-dapp/scaffold.md)。
:::

### 3. 設定錢包（只有在要發布時才需要） {#3-set-up-a-wallet-only-needed-to-publish}

發布會花費真實的資金，因此你需要先準備助記詞並為錢包注資：

```sh
digstore seed generate      # 產生一組新的助記詞（只會顯示一次——請務必備份）
digstore balance            # 顯示你的收款地址；為其注入 XCH 與 DIG
```

匯入、注資與 TTL 的細節，參見[鏈上錨定](./digstore/cli/onchain-anchoring.md)。

### 4. 發布你的第一個 capsule {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # 鑄造該 store 的第一個 capsule（統一 capsule 價格加上 XCH 手續費）
```

`init` 會在主網上鑄造一個 Chia 單例（singleton）——**launcher id 即成為你的 store id**——並會阻塞執行直到確認完成。

### 5. 發布更新 {#5-ship-updates}

```sh
npm run build                      # 產生 dist/
digstore add -A                    # 暫存整個內容根目錄
digstore commit -m "v1.1"          # 發布一個新的 capsule（統一 capsule 價格加上 XCH 手續費）
```

在 CI 中，一個指令即可完成 add → commit → push 並印出網址：

```sh
digstore deploy --output-dir dist --json   # 從 CI 推進既有的 store；絕不進行鑄造
```

參見[從 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md)。

### 6. 讀回內容 {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # 一個 URN 同時負責定位「並」解密
```

---

## 費用一覽 {#what-it-costs}

| 你正在做的事 | 費用 |
|---|---|
| 建立骨架、建置、預覽草稿 | **免費** |
| 發布你的第一個 capsule（`init` / DIGHUb 的發布） | **統一的 capsule 價格（以 $DIG 計價）** + 少量 XCH 手續費 |
| 發布每一次更新（`commit` / 重新發布） | **統一的 capsule 價格（以 $DIG 計價）** + 少量 XCH 手續費 |

這個價格在任何地方都是**每個 capsule 統一定價**——參見[為何價格是統一的](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform)。

## 卡關了嗎？ {#stuck}

- [疑難排解](./support/troubleshooting.md)——常見的失敗狀況與對應解法。
- [常見問答](./support/faq.md)——快速解答。
- [取得協助](./support/get-help.md)——社群管道，以及如何提交一份完善的回報。

## 相關文件 {#related}

- [概念與詞彙表](./concepts.md)——capsule、store、URN 與 DIG 付款機制的定義
- [建立應用骨架（create-dig-app）](./build-a-dapp/scaffold.md)——一個指令即可啟動可部署的專案（npm 或 CLI）
- [安裝 CLI](./digstore/cli/install.md)——在你的機器上取得 `digstore`
- [鏈上錨定](./digstore/cli/onchain-anchoring.md)——錢包設定、注資與費用
- [從 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md)——在 CI 中實現推送即發布
- [CLI 教學](./digstore/cli/quickstart.md)——完整的建立、提交、讀取流程走查
