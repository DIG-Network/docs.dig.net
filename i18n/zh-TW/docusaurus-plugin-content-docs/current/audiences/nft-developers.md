---
sidebar_position: 2
title: 面向 NFT 開發者
description: "鑄造一整個 CHIP-0007 收藏系列，其藝術作品永久存放在防竄改的 DIG capsule 中——一個原子性的已簽署花費包、真實的版稅機制，以及誠實的發行機制，絕不假裝提供尚無法在鏈上證明的保證。"
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

# 面向 NFT 開發者 {#for-nft-developers}

> **鑄造一整個 CHIP-0007 收藏系列，其藝術作品「永久」存放在防竄改的 DIG capsule 中**——一個原子性的已簽署花費包、真實的版稅機制，以及誠實的發行機制（揭曉／白名單／階段），絕不假裝提供尚無法在鏈上證明的保證。

## 心智模型 {#the-mental-model}

先將你的藝術作品放入一個 **[DIG capsule](../concepts.md#capsule)**，再鑄造指向該 capsule 的 `data_uris`／`metadata_uris` NFT。鏈上的雜湊值固定住真實的位元組——因此這些藝術作品是內容定址、可驗證且永久存在的，而不是一個可能失效或被替換的連結。

花費**絕不手動拼湊**：規範性的 CHIP-0035 wasm 建構器（透過 [`@dignetwork/dig-sdk/spend`](../sdk.md)）負責建構每一筆幣的花費，你的錢包只需簽署一次，並廣播一次。

鑄造一個 **store 不需花費** $DIG——只有在建立一個 capsule 時（也就是藝術作品被寫入 capsule 時），你才需要支付**統一的 capsule 價格**。

## 建立鑄造頁面骨架——`nft-drop` 範本 {#scaffold-a-mint-page--the-nft-drop-template}

一個指令即可從已接好錢包的發行頁面開始：

```sh
digs new nft-drop
# 或者
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [建立應用骨架](../build-a-dapp/scaffold.md)

## 從 CLI 鑄造 {#mint-from-the-cli}

資產 CLI 透過 `digstore-chain` 建構器建構花費、以你的錢包助記詞簽署，然後推送——全部都支援 `--dry-run`／`--json`，適合在 CI 中安全執行：

```sh
digs did create                          # 建立一個用於歸屬的發行者 DID
digs collection create --name "My Drop"  # 建立一個 CHIP-0007 收藏系列
digs nft mint --data ./art.png --metadata ./meta.json --dry-run
digs offer make ...                       # XCH／CAT 交易
```

`nft mint` 的 **capsule-media** 路徑會將藝術作品加上 CHIP-0007 中繼資料寫入一個 capsule，依真實位元組計算資料／中繼資料雜湊值，並將 URI 設為該 capsule 的 `chia://` 地址（附帶 https 閘道作為備援）。→ [指令參考](../digstore/cli/command-reference.md)

## 從網頁鑄造——DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

在瀏覽器中鑄造一個由 capsule 支撐的收藏系列：上傳藝術作品（會被寫入一個 capsule）、設定版稅，並附加一個 DID 以供歸屬——最後由錢包簽署。→ [DIGHUb ↗](https://hub.dig.net)

## 發行機制——揭曉、白名單、階段 {#drops--reveal-allowlist-phases}

發行機制會**誠實地**呈現：哪些是今天就已在鏈上強制執行的，哪些只是在等待 claim-coin 這項基礎機制到位前的鏈下便利功能。我們絕不呈現一項尚無法在鏈上證明的保證。

→ [在 Chia 上建置 dapp](../build-a-dapp/tutorial.md)，取得從頭到尾的鑄造流程說明。

## 使用 SDK 建構花費——絕不手動拼湊 {#build-spends-with-the-sdk--never-hand-roll}

每一筆幣的花費都由規範性的 CHIP-0035 wasm 建構，並在 `@dignetwork/dig-sdk/spend` 重新輸出。流程永遠是**建構 → 簽署 → 廣播**，如此分工使錢包永遠只需負責簽署。

→ [建構花費](../spends.md)．[DIG SDK](../sdk.md)

## 變現與門檻管控——Paywall {#monetize--gate--the-paywall}

SDK 的 `Paywall` 結合了 provider 與花費建構器，用於**付費解鎖**與 **NFT／收藏系列所有權門檻管控**——不需要手動接線花費邏輯。

→ [DIG SDK → Paywall](../sdk.md#paywall)

## Offer——建立／接受／展示 {#offers--make--take--show}

透過 `digs offer make | take | show`（各自支援 `--dry-run`／`--json`）以 XCH 或 CAT 交易 NFT。→ [指令參考](../digstore/cli/command-reference.md)

---

## 深入了解協定 {#go-deeper-the-protocol}

- **「防竄改的 capsule」** → [證明與安全性](../digstore/format/proofs-and-security.md)．[capsule 與 store 模型](../digstore/format/store-structure.md)
- **「絕不手動拼湊花費」** → [CHIP-0035 store 幣花費與委派](../chip-0035-spends-and-delegation.md)
- **完整內容** → [協定深入解析](../protocol-deep-dive.md)．[概念與詞彙表](../concepts.md)
