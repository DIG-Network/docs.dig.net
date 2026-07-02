---
sidebar_position: 1
title: 什麼是 dig RPC？
description: "透過 JSON-RPC 2.0 讀取 DigStore capsule 的全網通用讀取介面；天生具有盲目性、無需信任即可驗證，且可在任何大小下進行串流傳輸。"
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# 什麼是 dig RPC？ {#what-is-the-dig-rpc}

:::info 規範性規格
本頁是導覽頁。權威的機器介面規格——包含方法列表、區塊傳輸物件、節點設定檔與 OpenRPC 文件——請見[協定．dig RPC](../protocol/dig-rpc.md)。
:::

**dig RPC 是全網通用的介面，用於直接從託管的 DigStore `.dig` capsule 中讀取內容。** 它是透過 HTTPS `POST` 傳輸的 [JSON-RPC 2.0](https://www.jsonrpc.org/specification) 服務。

每個託管 capsule 的節點——無論是位於 `https://rpc.dig.net` 的參考節點，或任何第三方節點——都會公開**相同語意的相同方法**。針對這個介面撰寫的用戶端，可透過單一端點讀取整個網路的內容。這裡沒有 CDN；DIG 上的所有內容服務都是透過 dig RPC 進行。

它提供三種服務：

| 你擁有… | 你呼叫… | 你會得到… |
|---|---|---|
| 某資源的 **retrieval key**（`sha256(urn)`） | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | 該資源的密文加上一份 merkle 納入證明（以及 ZK 執行證明），以區塊方式串流傳輸 |
| 一個 **store id 加 generation root** | [`dig.getCapsule`](./methods.md#diggetcapsule) | 該 generation 的整個 `.dig` capsule，以區塊方式串流傳輸 |
| 一個 **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | 公開的探索清單／store 中繼資料清單／該 store 已確認的 generation 列表 |

## 定義它的三個特性 {#three-properties-that-define-it}

- **天生具有盲目性。** 節點只提供以雜湊值為鍵的不透明密文。它從未看過 URN、解密金鑰或明文。任何查無結果的請求，都會回傳一組確定性的、無法與正常回應區分的**誘餌（decoy）**串流——絕不會回傳 `404`——因此讀取路徑永遠無法成為判斷內容是否存在的探測工具。所有解密與所有證明驗證都發生在用戶端。
- **無需信任即可驗證。** 每一個真實的位元組都會附帶一份以鏈上 generation root 為根的 merkle **納入證明（inclusion proof）**。用戶端會將這份證明折算回 root，只有在其與自己信任的 root 相符時才會接受。節點永遠不會被信任其回傳了真實的位元組。
- **可在任何大小下進行串流傳輸。** 內容以有界、對齊 64 KiB 的區塊讀取，並帶有明確的續傳機制。一份一千位元組的資源與一份一百百萬位元組的 capsule，會透過同一個迴圈讀取，沒有任何一次回應是無界的。

## 它與 DigStore 的關係 {#how-it-fits-with-digstore}

DigStore 提供的是**格式**：一個內容定址、經過加密的 store，會編譯成單一能自我保護的 `.wasm` capsule，並以一個 URN 定址——而*這個 URN 就是金鑰*。dig RPC 則是在不信任主機的前提下，將這個 capsule **在網路上提供服務**的方式：

1. 你編譯一個 store，並在鏈上錨定一個 generation（一個 CHIP-0035 DataLayer 單例）。它的**內容 root** 是信任錨點。
2. 一個節點託管這個 capsule，並透過 dig RPC 將其公開。
3. 讀取端衍生出 `retrieval_key = sha256(urn)`，呼叫 `dig.getContent`，重組串流傳來的密文，**依照鏈上 root 驗證納入證明**，並**以 URN 衍生出的金鑰解密**——這一切完全在用戶端進行。

該節點只知道一個雜湊值；它從未得知自己提供了什麼內容。

## 一次呼叫完成讀取 {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

用戶端會依照 `next_offset` 反覆呼叫直到 `complete`，接著依照 `root` 驗證重組後位元組的 `inclusion_proof`，然後才解密。若結果中 `"decoy": true`，代表*查無結果*——應停止並如實回報。

## 如何閱讀本文件 {#how-to-read-these-docs}

- **[方法列表](./methods.md)**——完整的方法集合（`dig.getContent`、`dig.getProof`、`dig.getProofStatus`、`dig.getCapsule`、`dig.getManifest`、`dig.getMetadata`、`dig.listCapsules`、`dig.health`、`dig.methods`）、它們的參數與回傳結果。
- **[使用公開網路 RPC](./public-network-rpc.md)**——將你的用戶端指向 `rpc.dig.net`（或任何節點）、端點資訊，以及如何自行運行一個節點。
- **[串流傳輸](./streaming.md)**——區塊模型、重組、證明驗證，以及一份參考用戶端迴圈範例。
- **[一致性](./conformance.md)**——節點要成為網路讀取路徑的一員「必須」實作的內容，以及 CORS、錯誤處理與完整的盲目模型說明。

:::note
dig RPC 是 [DIG Network](https://dig.net) 的一部分。完整的規範性規格收錄在[協定．dig RPC](../protocol/dig-rpc.md)章節，也就是整個網路的內容介面。
:::

## 相關文件 {#related}

- [方法列表](./methods.md)——每一個 dig RPC 方法及其參數與回傳結果
- [串流傳輸](./streaming.md)——區塊模型、重組與證明驗證
- [一致性與安全性](./conformance.md)——盲目模型，以及節點必須實作的內容
- [URN 與加密](../digstore/format/urns-and-encryption.md)——每個 retrieval key 背後的 URN
- [概念與詞彙表](../concepts.md)——dig RPC、capsule 與 retrieval key 的定義
