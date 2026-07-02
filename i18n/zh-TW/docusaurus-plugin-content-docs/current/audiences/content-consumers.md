---
sidebar_position: 5
title: 面向內容消費者
description: "開啟 chia:// 內容，由你自己的瀏覽器對照區塊鏈進行驗證——沒有任何主機能竄改或偽造它，私有內容對主機保持私密，且內容永久存在、可在任何地方重新託管，因此沒有人能將它下架或把你鎖死在特定平台上。"
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# 面向內容消費者 {#for-content-consumers}

> **開啟由你「自己的」瀏覽器對照區塊鏈驗證的 `chia://` 內容**——沒有任何主機能竄改或偽造它，私有內容對主機保持私密，且內容永久存在、可在任何地方重新託管，因此沒有人能將它下架或把你鎖死在特定平台上。

## 心智模型 {#the-mental-model}

貼上一個 `chia://` 連結，內容就會直接來自這個網路——**內容定址**且在**你自己的裝置上經過密碼學驗證**後才會顯示。它是**故障即關閉（fail-closed）**的：遭竄改或無法解密的位元組永遠不會顯示出來。

- **省略 `rootHash`** 即取得該 store 的*最新*版本：`chia://<storeId>/`。
- **加上它**即可鎖定某一個確切、不可變的 [capsule](../concepts.md#capsule)：`chia://<storeId>:<rootHash>/`。

公開內容只需要連結即可。私有內容還需要一個像密碼一樣的私密 **`?salt=`**。

## 取得 DIG Browser，或安裝擴充功能 {#get-the-dig-browser-or-the-extension}

- **[取得 DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)**——一款內建 `chia://` 解析與內建錢包的瀏覽器。
- 適用於 Chrome／Edge／Brave／Firefox 的**擴充功能**——為你已經在使用的瀏覽器加上 `chia://` 解析能力。

## 開啟 `chia://` 內容——最新版本 vs. 鎖定版本 {#open-chia-content--latest-vs-pinned}

地址格式、簡潔的 `chia://<store>/` 網址列，以及何時該鎖定一個 `rootHash`。

→ [chia:// 協定](../browser/chia-protocol.md)

## 內建頁面、已驗證徽章與防護標記 {#built-in-pages-the-verified-badge--shields}

`chia://home`、`chia://wallet`、`chia://settings`，以及顯示目前 capsule 各項資源納入證明驗證結果的已驗證徽章／防護標記。

→ [使用 window.chia](../browser/using-window-chia.md)

## 公開 vs. 私有——何時需要 `?salt=` 密鑰 {#public-vs-private--when-you-need-a-salt-secret}

公開 store 只需連結即可開啟；私有 store 則需要用來衍生解密金鑰的私密 salt。

→ [公開與私有 store](../digstore/format/urns-and-encryption.md#public-vs-private-stores)．[公開與私有——有什麼差別？](../support/faq.md#public-vs-private)

## 在本地端執行內容（選用） {#run-content-locally-optional}

將你的瀏覽器／擴充功能指向本地的 [dig-node](../concepts.md#dig-node)，以取得更快、更適合離線使用的讀取體驗——它們共用同一份 `.dig` 快取。你並不*需要*節點才能讀取內容。

→ [運行一個節點](../run-a-node/index.md)

## 取得 $DIG {#get-dig}

*讀取*內容不需要 $DIG。如果你想發布內容，可以在 **TibetSwap**、**dexie.space** 或 **9mm.pro** 取得 $DIG。

→ [我要去哪裡取得 DIG？](../support/faq.md#where-do-i-get-dig)

---

## 深入了解協定 {#go-deeper-the-protocol}

- **「對照區塊鏈驗證」** → [鏈上錨定](../digstore/cli/onchain-anchoring.md)．[證明與安全性](../digstore/format/proofs-and-security.md)
- **「公開 vs. 私有 salt」** → [URN 與加密](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **「最新版本 vs. 鎖定版本」** → [generation 與 root hash](../digstore/format/store-structure.md#generations-and-root-hashes)
- **完整內容** → [協定深入解析](../protocol-deep-dive.md)．[概念與詞彙表](../concepts.md)
