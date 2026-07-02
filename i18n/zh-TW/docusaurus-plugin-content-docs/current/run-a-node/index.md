---
sidebar_position: 1
title: 運行一個 DIG 節點
description: "什麼是 dig-node、為什麼你會想要運行一個，以及如何安裝它——適用於 Ubuntu/Debian 的 apt 儲存庫，或是跨平台的通用安裝程式。"
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# 運行一個 DIG 節點 {#run-a-dig-node}

> **以可證明且對提供者盲目的方式提供內容服務**——你所接觸到的永遠只有以雜湊值為鍵、無法區分彼此的密文，能以執行證明證明自己確實忠實地提供了服務，而用戶端則會對照鏈上狀態驗證一切，因此信任永遠不會落在你的節點上。

**dig-node** 是 DIG Network 的內容**伺服器**——也就是這個網路的供給端。它託管 capsule、維護一份本地的 `.dig` 快取，並公開 [dig RPC](../rpc/what-is-the-dig-rpc.md)，讓任何能讀取 DIG 內容的工具都能從你這裡讀取。它以無頭（headless）方式運行（沒有瀏覽器、沒有介面），作為背景服務——是你所發布或想協助提供服務之內容的種子庫（seedbox）。

它是**消費端**——[DIG Browser](../browser/chia-protocol.md) 與瀏覽器擴充功能——的對應角色，後者負責擷取密文與證明、對照鏈上 root 進行驗證、在本地端解密並渲染。你**不需要**dig-node 才能讀取 DIG 內容：單靠消費端就能正常運作，會退回使用公開的參考節點 `rpc.dig.net`。你運行 dig-node 是為了**提供服務**——當同一台機器上存在一個節點時，消費端就會從它那裡讀取（本地、適合離線使用，並對這個網路做出貢獻），兩者共用同一份 `.dig` 快取。

:::info 提供服務 vs. 消費內容
- **dig-node** = 提供內容服務並公開 dig RPC。無頭背景服務。
- **DIG Browser／擴充功能** = 消費內容（在本地端驗證並解密）。不需要本地節點。

當兩者都安裝時，瀏覽器／擴充功能會從你的本地 dig-node 讀取；否則會從 `rpc.dig.net` 讀取。無論哪種方式，每一個位元組都會在用戶端對照鏈上狀態驗證——來源永遠不會被信任。
:::

## 安裝 {#install-it}

| 你的機器 | 使用方式 |
|---|---|
| **Ubuntu／Debian** | 原生的 **[apt 儲存庫](./apt.md)**——`apt install dig-node digstore`，會自動啟用為 systemd 服務。 |
| **Windows／macOS／Linux（任何版本）** | 跨平台的 **[通用安裝程式](#universal-installer-any-os)**——一行 `curl \| sh`（或下載安裝檔），適用於任何作業系統。 |

兩者都會安裝相同的 `dig-node` 服務以及 `digstore` CLI。apt 是原生的 Debian 路徑（已簽署、可透過 `apt upgrade` 更新）；通用安裝程式則涵蓋其他所有情況。

### apt（Ubuntu／Debian）——建議在 Debian 系家族系統上使用 {#apt-ubuntu--debian--recommended-on-debian-family-systems}

原生路徑：位於 `apt.dig.net` 的已簽署 apt 儲存庫。它會將 `dig-node` 安裝為受管理的 **systemd 服務**，並透過 `apt upgrade` 保持更新。

→ **[透過 apt 在 Ubuntu/Debian 上安裝](./apt.md)**

### 通用安裝程式（任何作業系統） {#universal-installer-any-os}

跨平台路徑——Windows、macOS 與任何 Linux 發行版。它會偵測你的作業系統，安裝 `dig-node` 服務（Windows 服務／`systemd`／`launchd`）以及 `digstore` CLI，且不需要任何套件管理員：

```sh
curl -fsSL https://dig.net/install.sh | sh
```

這與 [Releases 頁面](https://github.com/DIG-Network/dig-installer/releases)上發布的獨立式 `dig-installer` 完全相同——如果你不想透過管線傳給 shell 執行，或是在 Windows 上，可以直接下載並執行它。

:::note 尚未正式發布
託管的安裝程式（`apt.dig.net`、`dig.net/install.sh`）目前仍在建置中。在它們上線之前，可以從原始碼建置，或從 [dig-node Releases](https://github.com/DIG-Network/dig-node/releases) 取得二進位檔。這裡列出的指令都是真實且預期可用的指令。
:::

## 只是想讀取內容？ {#just-want-to-read-content}

你不需要節點。取得 **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** 並開啟任何 `chia://` 地址——如果你有本地的 dig-node，它會從那裡消費內容，否則會從 `rpc.dig.net` 消費。參見 [`chia://` 協定](../browser/chia-protocol.md)。

## 相關文件 {#related}

- [透過 apt 在 Ubuntu/Debian 上安裝](./apt.md)——原生的 Debian 路徑加上 systemd 服務管理
- [在任何地方安裝——通用安裝程式](./universal-installer.md)——Windows／macOS／任何 Linux 加上 `dig.local`
- [將消費端指向你的節點](./point-a-consumer.md)——以本地為優先的讀取，以及共用的 `.dig` 快取
- [設定 dig-node](./configure.md)——連接埠、監聽器、快取上限、上游來源
- [自行託管遠端來源](../rpc/dig-remote.md)——`digstore serve` 加上 dig:// clone/pull/push
- [管理你的節點](./manage.md)——control.* 管理用 RPC 與「我的節點」介面
- [使用公開網路 RPC](../rpc/public-network-rpc.md)——你的節點所提供的 dig RPC，以及如何在網路上運行一個節點
- [安裝 CLI](../digstore/cli/install.md)——單獨安裝 `digstore`（用於發布，而非提供服務）

## 深入了解協定 {#go-deeper-the-protocol}

- **「盲目主機與誘餌」** → [dig RPC 盲目服務模型](../rpc/what-is-the-dig-rpc.md)．[節點一致性](../rpc/conformance.md)
- **「證明忠實提供服務」** → [納入證明 vs. 執行證明](../inclusion-vs-execution-proofs.md)
- **「dig:// clone/pull/push」** → [§21/§22 遠端協定](../rpc/dig-remote.md)
- **完整內容** → [協定深入解析](../protocol-deep-dive.md)．[概念與詞彙表](../concepts.md)
