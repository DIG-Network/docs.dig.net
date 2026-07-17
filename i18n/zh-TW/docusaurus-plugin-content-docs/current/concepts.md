---
sidebar_position: 1.5
title: 概念與詞彙表
description: "DIG Network 核心實體的單頁索引——capsule、store、generation、URN、retrieval key、dig RPC、chia:// 協定，以及鏈上錨定——每個詞彙都僅定義一次，並連結到其深入文件。"
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# 概念與詞彙表 {#concepts--glossary}

本頁以淺顯易懂的語言，**僅一次**定義每一個 DIG Network 的核心實體，並連結到深入探討該主題的文件。這是本文件人類可讀的主幹——同時，由於每個詞彙也會以機器可讀的結構化資料形式輸出，這裡也是一份代理程式（agent）可以擷取、藉以學習這個網路詞彙系統的地圖。快速瀏覽以取得方向感；點擊連結以深入了解。

## capsule {#capsule}

**capsule** 是單一不可變的 store 世代（generation）：一對 `(storeId, rootHash)`，以 `storeId:rootHash` 的形式規範表示。它是這個網路的原子單位——涵蓋編譯（一個固定大小的 WASM 模組）、[定價](./digstore/cli/onchain-anchoring.md)（鑄造或提交時統一的每 capsule 價格，以 $DIG 支付）、取回（一個 [URN](#urn) 指向一個 capsule）、快取與來源證明。一個 [store](#store) 是*一連串 capsule 的序列*，每次提交產生一個。這個定義在 dig-store、dig RPC 與 DIG Browser 中完全一致。→ [完整了解 capsule](./intro.md#the-capsule)

## store {#store}

**store** 是一個身分加上其內容與歷史記錄：一連串 [capsule](#capsule) 的序列，每次提交產生一個。它的身分是一個 64 位十六進位的 **store id**，這個 id *就是*它在鏈上的 Chia 單例（singleton）launcher id——這個鏈上單例是該 store 目前 root 的權威來源。store 相當於 DIG 世界中的網站。→ [store 結構](./digstore/format/store-structure.md)

## generation {#generation}

**generation** 是 [store](#store) 的單一已提交狀態，由一個 **root hash**（該 generation 各資源葉節點的 Merkle root）識別。每一次 `commit` 都會將目前的內容封存為一個新的、僅能附加（append-only）的 generation——這正是 [capsule](#capsule) 所指稱的對象。generation 會像 Git 歷史紀錄一樣單調遞增。→ [generation 與 root hash](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

**URN** 是 dig-store 集地址與金鑰於一身的字串：
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`。它同時**定位**某個資源，並**衍生出用來解密它的金鑰**——持有這個 URN 即是讀取一項公開資源的充分必要條件。面向瀏覽器的簡寫形式是 [`chia://` 協定](#chia-protocol)。→ [URN 與加密](./digstore/format/urns-and-encryption.md)

## retrieval key {#retrieval-key}

**retrieval key** 是 `SHA-256(canonical_urn)`——唯一會離開用戶端的地址。它能定位資源的密文，卻不會洩漏其路徑或 [URN](#urn)。它與 root *無關*，因此同一把 retrieval key 能在不同 [generation](#generation) 之間找到同一個資源；接著再依照正確的 root 對回傳的位元組進行 [Merkle 驗證](#merkle-proof)。另外還有獨立的**解密金鑰**，是在本地端以（HKDF）從同一個 URN 衍生而來，絕不會被傳送出去。→ [一個字串，兩個值](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

每個 [generation](#generation) 都會建立一棵 Merkle 樹，每個資源對應一個葉節點，承諾的是所提供的確切*密文*位元組。每個被提供的資源都附帶一份 **inclusion proof（納入證明）**，用以證明這些位元組屬於那個確切的 root——因此內容無需被解密即可驗證，節點也永遠不會被信任其回傳了真實的位元組。→ [Merkle proof](./digstore/format/proofs-and-security.md)

## 鏈上錨定 {#anchoring}

每個 store 都是 **Chia 主網上的一個單例（singleton）**。`dig-store init` 會鑄造它（launcher id *即成為* store id），而每一次 `dig-store commit` 都會以 CHIP-0035 單例更新的形式，將新的 [generation](#generation) root 錨定到鏈上。兩者都會阻塞執行直到確認完成，且都會花費真實資金。鏈上狀態是 store 最新 root 的權威來源。→ [鏈上錨定](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG** 是 DIG Network 的代幣（一種 Chia CAT）。鑄造一個 [capsule](#capsule)（`init`）或提交一個 capsule，都需要支付**統一的每 capsule 價格（以 $DIG 計價）**，這筆費用會**原子性地包含在與錨定相同的鏈上花費之中**——不會有另一筆獨立交易，且該筆花費的 memo 會攜帶 store id。→ [費用](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store` 是用來建立、提交、分享並讀取 store 的命令列工具——以 Git 風格的工作流程（`init`、`add`、`commit`、`log`、`clone`、`push`、`pull`）操作這個經過加密、上鏈的 store 格式。→ [指令參考](./digstore/cli/command-reference.md)．[CLI 教學](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` 是位於專案根目錄的**可提交專案設定檔（manifest）**——包含 `store-id`、`output-dir`、`build-command` 以及其他專案設定，由 `dig-store dev`、`dig-store deploy` 與骨架範本共用。它**不含任何機密資訊**（那些來自環境變數），因此可以安全地提交進版本控制。→ [專案設定與建置時期的數值](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app`（`npm create dig-app`）是啟動 DIG 專案的 **JS 前門**：它會從五種範本之一（`static`、`vite-react`、`next-static`、`nft-drop`、`dapp-window-chia`）建立一個可直接執行的起始專案——包含一個應用程式、一個 [`dig.toml`](#dig-toml)，並且（對於錢包相關範本）已接好 [DIG SDK](#dig-sdk)。建立骨架是**免費**的——不鑄造、不上鏈、不花費；只有在你發布一個 [capsule](#capsule) 時才需支付統一的 capsule 價格。它是 Rust CLI 的 `dig-store new` 在 npm 端的對應工具。→ [建立應用骨架](./build-a-dapp/scaffold.md)

## GitHub 部署 Action {#deploy-action}

`dig-network/deploy-action` 是實現 **git-push-to-deploy** 的 GitHub Action：它會在執行器（runner）上安裝 [`dig-store` CLI](#digstore-cli)，執行 `dig-store deploy` 以推進你的 store（絕不進行鑄造），並將已發布的 [capsule](#capsule)、網址與費用回報為步驟輸出、PR 留言、GitHub Deployment 以及提交狀態（commit status）。搭配 `if-changed`（預設啟用），若建置結果與前次位元組完全相同則不會有任何動作——不會產生花費。→ [從 GitHub Actions 部署](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK**（`@dignetwork/dig-sdk`）是提供給整合開發者使用的具型別 npm 套件：一個 `ChiaProvider`（優先使用注入的 [`window.chia`](#window-chia)，並可退回使用 WalletConnect → Sage）、一個 `DigClient`（透過 [dig RPC](#dig-rpc) 讀取經過驗證的加密內容）、一個 `Paywall`（一個結合 provider 與花費建構器的高階付費解鎖／NFT 門檻存取輔助工具），以及在 `/spend` 子路徑重新輸出的規範性 CHIP-0035 花費建構器。
→ [在 Chia 上建置 dapp](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC** 是全網通用的讀取介面：一個透過 HTTPS `POST` 傳輸的 JSON-RPC 2.0 服務，每個託管節點都以完全相同的方式回應。它依 [retrieval key](#merkle-proof) 提供密文加上 [inclusion proof](#retrieval-key)、依 `(storeId, root)` 提供整個 [capsule](#capsule)，以及探索用的中繼資料——天生具有盲目性，並在用戶端進行驗證與解密。**這是全網通用的讀取路徑**：每個已發布的 capsule 一旦在鏈上確認，就能透過它的 [URN](#urn)／[`chia://`](#chia-protocol) 地址在這裡被讀取——不需要註冊，除了發布 capsule 本身之外也無需額外付費。選配的、人性化的 [`*.on.dig.net` 代稱](#on-dig-net)是建立在這之上的一道前門；dig RPC 本身則永遠可用。→ [什麼是 dig RPC？](./rpc/what-is-the-dig-rpc.md)

## chia:// 協定 {#chia-protocol}

`chia://` 是 DIG Browser 原生的內容地址方案——也就是可直接輸入的 [`urn:dig:` URN](#urn) 前端形式。貼上一個 `chia://<storeId>/` 連結，瀏覽器就會直接從網路上擷取內容，內容定址且經過密碼學驗證。→ [chia:// 協定](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` 是 **DIG Browser** 注入到每個頁面中的 Chia 錢包 provider。它支援 [CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md)，因此網頁應用可以請求使用者的地址、簽章與花費，完全不需要設定 WalletConnect——對於已經支援 CHIP-0002 的應用來說，這是一個即插即用的替代方案。→ [使用 window.chia](./browser/using-window-chia.md)
．[window.chia provider 規範](./protocol/window-chia-provider.md)（規範性、附版本號）

## DIGHUb {#dighub}

**DIGHUb**（[hub.dig.net](https://hub.dig.net)）是用於發布與管理 [capsule](#capsule) 的網頁應用，無需使用 CLI——建立 capsule、部署前端，並在瀏覽器中檢視你的 store。它同時也是一個受管控的控制平面，負責調度昂貴的 ZK 執行證明（execution-proof）工作的預算。

## dig-node {#dig-node}

**dig-node** 是這個網路的內容**伺服器**——也就是供給端。它託管 [capsule](#capsule)，維護一份本地的 `.dig` 快取，並以與 `rpc.dig.net` 完全相同的方式提供 [dig RPC](#dig-rpc) 服務。你**不需要**運行 dig-node 才能讀取 DIG 內容（消費端會退回使用 `rpc.dig.net`）；運行一個 dig-node 能讓讀取變得以本地為優先，並貢獻更多服務容量。主機是**盲目的**——它只會轉發密文與證明。
→ [運行一個節點](./run-a-node/index.md)

## on.dig.net 代稱 {#on-dig-net}

**on.dig.net 代稱**是為某個 [store](#store) 提供的一個*選配、付費*的人性化網址：`<your-name>.on.dig.net`。store 並**不會**自動取得這個代稱——你需要註冊該代稱（在 [DIGHUb](#dighub) 中進行付費的 CHIP-54／`on.dig.net` 註冊），該筆註冊會將 store 綁定到這個名稱。沒有註冊就沒有 `*.on.dig.net` 地址。它純粹是一項便利的前門：無論是否存在代稱，該 store 早已能透過 [dig RPC](#dig-rpc)，以其 [URN](#urn)／[`chia://`](#chia-protocol) 地址被讀取。（帳號代稱與 store slug 是各自獨立的命名空間，不會自動對外暴露子網域。）→ [我可以取得 `*.on.dig.net` 地址嗎？](./support/faq.md#can-i-use-my-own-domain)

## 相關文件 {#related}

- [DIG Network 總覽](./intro.md)——核心元件一覽
- [快速入門](./quickstart.md)——免費建置與預覽，最後發布一個 capsule
- [在 Chia 上建置 dapp](./build-a-dapp/tutorial.md)——把每個核心元件串接成一個上線的 dapp
- [什麼是 dig-store？](./digstore/what-is-digstore.md)——單一檔案的 store 格式
- [什麼是 dig RPC？](./rpc/what-is-the-dig-rpc.md)——網路的讀取路徑
- [chia:// 協定](./browser/chia-protocol.md)——在瀏覽器中定址內容
- [取得協助](./support/get-help.md)——社群管道與回報方式

## 給代理程式與 LLM {#for-agents--llms}

本文件可供機器擷取。每一頁都帶有 schema.org JSON-LD（本頁以 `DefinedTerm` 集合的形式呈現），網站根目錄還提供兩份精心整理的地圖：

- [`/llms.txt`](pathname:///llms.txt)——本文件的連結豐富的 markdown 地圖（[llms.txt 慣例](https://llmstxt.org/)）。
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json)——實體（概念與文件）以及具型別的邊（`defines`、`part-of`、`requires`、`see-also`）。
