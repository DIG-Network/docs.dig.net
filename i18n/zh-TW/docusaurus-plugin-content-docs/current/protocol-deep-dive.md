---
sidebar_position: 1
title: "Protocol: Overview"
description: "DIG 協定以由下而上的七個層級呈現，兼具規範性與實作定義。capsule（storeId:rootHash）是最基本的單位；主機是盲目的，讀取端則對照鏈上狀態進行驗證。這是權威的協定參考文件。"
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protocol: Overview {#protocol-overview}

這是 DIG 協定的**規範性規格**，以由下而上的**七個層級**定義。每個層級都以其**規範性 crate／檔案**作為權威參考。

:::info 這是權威的協定參考文件
本章節是這個網路實際運作方式的權威來源。它會以指向規範性實作的 `file:line` 引用方式，記錄協定實際運行的樣貌。
:::

## 最基本的單位：capsule {#the-fundamental-unit-the-capsule}

有一個概念貫穿每一個層級：**[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`，規範表示為 `storeId:rootHash`。**store** 是一連串按時間排序（由舊到新）的 capsule 序列，每次提交產生一個；其身分識別碼 `store_id` *即是* Chia 上一個 CHIP-0035 DataLayer 單例的 launcher id。身分、編譯、定價、取回、快取與來源證明，全部都是**依 capsule 為單位**定義的。

## 核心論點：主機盲目、用戶端驗證、鏈上錨定的 root {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **主機盲目。** 主機只持有以雜湊值為鍵的不透明密文。它不持有 URN 也不持有金鑰，僅原樣轉發 capsule 自身的輸出，且無法判斷是命中還是未命中。傳輸中並沒有 `decoy` 欄位，也沒有 CDN——DIG 上的內容僅透過 [dig RPC](./protocol/dig-rpc.md) 提供服務。
- **用戶端驗證。** 每一個位元組都會在讀取端裝置上，依照鏈上 root 搭配逐資源的 merkle 納入證明進行檢查，然後才進行帶驗證的解密。信任永遠不會建立在服務來源之上。
- **鏈上錨定的 root。** 受信任的 root **只**來自 Chia 上的 CHIP-0035 單例（透過 coinset.org 解析），絕不會來自伺服端提供的「最新版本」。

## 七個層級 {#the-seven-layers}

| # | 層級 | 定義內容 | 規範性參考 |
|---|---|---|---|
| 0 | [身分與命名](./protocol/identity-and-naming.md) | store、capsule、generation；`store_id` = launcher id | `digstore-core::capsule`、`::urn` |
| 0 | [URN 與定址](./protocol/urn-and-addressing.md) | `urn:dig:chia:…` 語法；不含 root 的 `retrieval_key` | `digstore-core::urn`、`lib.rs` |
| 1 | [密碼學](./protocol/cryptography.md) | HKDF 金鑰衍生函式；AES-256-GCM-SIV 封裝 | `digstore-core::crypto` |
| 1 | [Merkle 納入證明](./protocol/merkle-proofs.md) | D5 逐資源葉節點；NODE_TAG 折算 | `digstore-core::merkle` |
| 1 | [BLS 簽章與 DST](./protocol/bls-signatures.md) | Chia AugScheme；五種角色 DST | `digstore-crypto::bls` |
| 2 | [capsule 格式](./protocol/capsule-format.md) | DIGS 資料段（BINDING D1） | `digstore-core::datasection` |
| 2 | [自我保護模組](./protocol/self-defending-module.md) | 固定大小混淆處理；提供服務的 guest | `digstore-compiler`、`digstore-guest` |
| 4 | [鏈上錨定](./protocol/on-chain-anchoring.md) | store = 單例；capsule = root 推進 | `chip35_dl_coin`、`digstore-chain` |
| 4 | [DIG CAT 付款與定價](./protocol/dig-cat-payment.md) | 依 capsule 計價、動態、以美元計價 | `chip35_dl_coin::dig` |
| 6 | [dig RPC](./protocol/dig-rpc.md) | 機器介面（JSON-RPC 2.0） | hub `retrieval`、`dig-node` |
| 5 | [§21 傳輸與推送](./protocol/transport-and-push.md) | `dig://` 定位器、REST、推送 v1 | `digstore-remote` |
| 7 | [DIG 節點對等網路](./protocol/peer-network.md) | mTLS 對等身分、NAT 穿越、STUN、介紹者（introducer）、中繼傳輸協定、對等 RPC | `dig-gossip`、`dig-relay`、`dig-nat`、`dig-node` |
| 6 | [驗證與來源證明](./protocol/verification-and-provenance.md) | 四道有序的完整性關卡 | `digstore-core::merkle`、`dig-node` |
| 6 | [盲目主機模型](./protocol/blind-host-model.md) | 對提供者的盲目性；解析器；`/v1` 控制平面 | hub `retrieval`／`resolver`／`api` |
| — | [一致性與對等驗證](./protocol/conformance-and-parity.md) | 跨實作的一致性紀律 | 固定的黃金測資、OpenRPC diff |

（第 3 層與 §21 傳輸與讀取路徑相互交錯；此表格依讀者實際接觸到的位置分組。完整的層級編號則列於各頁面之中。）

## capsule 如何流經各層級 {#how-a-capsule-flows-through-the-layers}

發布者將內容進行**分塊加密**（L1），封裝成一個**capsule 格式**（L2），使其能夠**自我提供服務**（L3），將其**錨定**至鏈上（L4），並透過 §21 傳輸協定**推送**出去（L5）。任何用戶端都能透過 dig RPC **讀取**它，並完全在用戶端對照鏈上錨定的 root **驗證**它（L6）。每一個密碼學常數在生產者、主機與驗證者之間都只有**唯一**一份定義——這就是 [C8 一致性不變量](./protocol/conformance-and-parity.md)。

## 術語 {#terminology}

- **`chia://`**——網路的**內容**地址（瀏覽器開啟的對象）。
- **`dig://`**——§21 的**傳輸**定位器（CLI／對等網路層面），*同時*也是 DIG Browser 內部的頁面配置方案——兩種用途各自獨立，都不是內容地址。
- **`urn:dig:`**——上述兩者共同衍生出的 URN 命名空間。
- **store／capsule**——身分識別碼及其不可變的世代（generation）。
- **$DIG**——每個 capsule 需支付的 CAT；**dig-store**——store 格式本身。

## 相關文件 {#related}

- [概念與詞彙表](./concepts.md)——每個實體僅定義一次
- [身分與命名](./protocol/identity-and-naming.md)——第 0 層，規格由此開始
- [dig RPC](./protocol/dig-rpc.md)——協定的機器介面
- [DIG 節點對等網路](./protocol/peer-network.md)——節點如何找到並連接彼此（mTLS、NAT 穿越、中繼）
- [一致性與對等驗證](./protocol/conformance-and-parity.md)——跨實作的一致性紀律
