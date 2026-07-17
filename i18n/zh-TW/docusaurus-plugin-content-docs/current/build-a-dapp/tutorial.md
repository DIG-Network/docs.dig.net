---
sidebar_position: 1
title: 在 Chia 上建置 dapp
description: "從頭到尾完整流程：建立一個 React 應用骨架、用 dig-sdk 接上頁內 Chia 錢包（window.chia 加上 WalletConnect 備援）、透過 chip35 wasm 建構並簽署一筆花費，接著上鏈部署並加上自訂網域——一條主線串起每一個 DIG 核心元件。"
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digs deploy
  - custom domain
tags:
  - digstore-cli
  - window-chia
  - dig-rpc
  - chip-0035
  - dighub
  - capsule
  - anchoring
---

# 在 Chia 上建置 dapp {#build-a-dapp-on-chia}

每一個 DIG 核心元件都各自擁有獨立的說明文件——建立骨架、頁內錢包、讀取路徑、花費、部署。**本頁則是把它們串成一個完整上線 dapp 的單一主線。** 你會從一個空資料夾開始，最後完成一個具備錢包功能、在鏈上以你自己網域上線的 React 應用。

從頭到發布之前的整個流程都是**免費**的——建立骨架、開發與預覽都不花任何費用。只有在部署步驟才需要支付**統一的 capsule 價格（以 $DIG 計價）**。

```
new ──▶ dev ──▶ 接上錢包（dig-sdk） ──▶ 建構花費（chip35） ──▶ 部署 ──▶ 自訂網域
免費    免費          免費                       免費            capsule 價格    免費
```

## 你會需要 {#what-youll-need}

- 已安裝 [`dig-store` CLI](../digstore/cli/install.md)。
- Node 18+ 與 `npm`。
- 一個已注資的 Chia 錢包——**只有在部署步驟才需要**（統一的 capsule 價格以 $DIG 計價，外加少量 XCH 手續費）。在那之前的一切都是免費的。

---

## 1. 建立一個 React 應用骨架——免費、不上鏈 {#1-scaffold-a-react-app--free-no-chain}

`digs new` 會寫入一個可直接執行、已接好錢包的專案。選擇 React 範本：

```sh
digs new vite-react my-dapp
cd my-dapp
```

你會得到一個 Vite + React 應用、一個 `dig.toml`（`output-dir = "dist"`、`build-command = "npm install && npm run build"`），以及一個已經接好頁內錢包的 `App.jsx`。這個步驟不會鑄造任何 store，也不會花費任何費用——`new` 純粹是本地端操作。

:::tip 偏好使用 npm？試試 `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` 可以直接從 npm 建立相同的範本——這是 JS 前門，一開始不需要安裝 `dig-store`。參見[建立應用骨架](./scaffold.md)以了解全部五種範本，以及這兩道前門的比較。
:::

## 2. 在真實的讀取路徑上開發——免費 {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev` 會執行你的建置流程，並透過**真實的 `chia://` 讀取路徑**（編譯 → 驗證 → 解密）提供輸出結果，同時注入一個 **`window.chia` 開發版模擬器**，讓你不需要真實錢包也能建置錢包流程。編輯 `src/App.jsx`、儲存，頁面就會即時重新載入——完全就是訪客會得到的畫面，且零鏈上互動、零花費。

## 3. 使用 SDK 接上錢包——`window.chia` 加上 WalletConnect 備援 {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

這個骨架直接與 `window.chia` 溝通，這在 [DIG Browser](../browser/using-window-chia.md) 中運作得非常完美。若要同時支援使用其他瀏覽器的使用者，可加入 SDK——它會**優先使用注入的 `window.chia` 錢包，並在無法使用時退回 WalletConnect → Sage**，統一在同一個標準化介面之下，因此你只需要撰寫一次錢包流程。

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # 選用：僅在需要 WalletConnect 備援時安裝
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" 會優先使用注入的 DIG Browser 錢包，否則退回 WalletConnect → Sage。
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // 一個公開的建置時期數值
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // 用於渲染 QR code
      },
    });
    setAddress(await provider.getAddress());
  }

  return (
    <main>
      <h1>My DIG dapp</h1>
      <button onClick={login}>Connect wallet</button>
      {address && <p>Connected: {address}</p>}
    </main>
  );
}
```

一個 `connect()` 呼叫在 DIG Browser 中可以運作（不需要 QR code、不需要中繼），在其他所有地方也一樣能運作（透過 WalletConnect）。`provider.backend` 會告訴你目前連接的是哪種傳輸方式。無論哪種方式，方法名稱與回傳結果的形狀都完全相同——完整的整合指南參見[使用 `window.chia`](../browser/using-window-chia.md)，若需要確切的方法／參數／回傳值／錯誤合約，參見[規範性的 `window.chia` provider 規格](../protocol/window-chia-provider.md)。

:::note WalletConnect 專案 id 是一個公開的建置時期數值
`VITE_WC_PROJECT_ID` 會被編譯進你的打包檔案中，任何人都能讀取——對於 WalletConnect 雲端 id 來說，這是正確的做法。**絕對不要**把錢包助記詞、部署金鑰或任何機密資訊放進打包檔案中：一個 capsule 是[沒有任何伺服器機密資訊的盲目靜態產物](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule)。
:::

## 4. 建構並簽署一筆花費——透過 SDK 使用 chip35 wasm {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

當你的 dapp 需要在鏈上執行某項操作時（鑄造一個 store、更新中繼資料、建構一筆 CAT 付款），它會使用**規範性的 CHIP-0035 花費建構器**來建構花費，再交由錢包簽署。SDK 在 `/spend` 子路徑重新輸出了這個建構器——你**絕不手動拼湊花費包**。

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // chip35 wasm 建構器

async function doSpend() {
  spend.init();

  // 使用 wasm 建構器建構幣的花費，例如 spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...)。這個建構器
  // 是離線且純函式的——不涉及金鑰，也不涉及網路。
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // 交由錢包簽署（金鑰由錢包持有，而非你的 dapp）。
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → 組合成一個花費包並廣播。
}
```

這正是 hub 所採用的模式：**在瀏覽器中用 wasm 建構花費包，再用錢包簽署。** 這個花費建構器是整個生態系統中花費包的唯一規範性來源，因此你的 dapp 產生的花費在位元組層級上會與 hub 及 CLI 完全一致。

若要**讀取**經過驗證的加密內容（例如在你的 dapp 中渲染另一個 store 的資料），可使用 SDK 的 `DigClient`：

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // 預設指向 https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // 信任錨點，從鏈上讀取
});
```

`DigClient` 會在瀏覽器中衍生出該 URN 的金鑰，依照鏈上 root 驗證納入證明，並進行解密——提供服務的主機始終保持盲目。參見[什麼是 dig RPC？](../rpc/what-is-the-dig-rpc.md)。

:::tip 想收費存取？使用 `Paywall`
若要進行變現——付費解鎖內容，或依擁有某個 NFT 作為門檻——SDK 提供了一個高階的 **`Paywall`** 輔助工具，它結合一個已連接的 `ChiaProvider` 與花費建構器，讓你不需要手動接線付款邏輯：`paywall.requestPayment({ amount, owner })` 會向 dapp 擁有者付款並回傳一張收據，而 `paywall.verifyReceipt(...)`／`paywall.proveAccess({ nft | collection })` 則用於門檻管控存取權限。

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* 解鎖內容 */ }
```
:::

## 5. 上鏈部署 {#5-deploy-on-chain}

你可以免費建置與預覽；這是唯一會花費的步驟。首先**一次性地**建立這個 store：

```sh
digs init my-dapp --dir dist      # 鑄造該 store 的第一個 capsule（統一 capsule 價格加上 XCH 手續費）
```

`init` 會在主網上鑄造一個 Chia 單例——**launcher id 即成為你的 store id**。把它複製進 `dig.toml`（`store-id = "<64-hex>"`）。從此之後，一個指令即可建構並發布一個新的 capsule：

```sh
digs deploy --json                # 執行 build-command、暫存 dist/、推進 root
```

每一次 `deploy` 都會以統一的 capsule 價格發布一個新的不可變 capsule。一經確認，你的 dapp 就能透過它的 [URN](../concepts.md#urn)／`chia://` 地址在 [dig RPC](../rpc/what-is-the-dig-rpc.md) 上**被讀取**——經過加密、驗證，且不可能被下架，不需要註冊，也無需再支付任何費用。（一個友善的 `*.on.dig.net` 網址是另一個獨立的選配步驟——參見[下一節](#6-put-it-on-your-own-domain)。）若要在每次提交時實現推送即部署，串接[從 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)。

## 6. 放到你自己的網域上 {#6-put-it-on-your-own-domain}

你的 store 早已能透過它的 URN／`chia://` 地址存取——但若想要一個友善的網址，你可以註冊一個名稱。當你在 DIGHUb 中為一個 store **註冊代稱**時，它就會取得一個 `*.on.dig.net` 子網域：這是一項另外付費的獨立註冊，將 store 綁定到該名稱（沒有註冊 → 沒有 `*.on.dig.net` 地址）。若想改用你自己擁有的網域提供服務，可以在 [DIGHUb ↗](https://hub.dig.net) 中加上帶有 TLS 的**自訂網域**——把你的網域指向該 store，DIGHUb 會負責處理憑證。無論哪種方式，你的 dapp 都能以人性化的網址載入，底層依然完全去中心化。

當 CHIP-54 的 `.dig` 代稱正式推出後，一個 store 也能以人類可讀的 `.dig` 名稱定址；在此之前，透過 DIGHUb 使用自訂網域是為部署品牌化的方式。

---

## 你已經完成一個 dapp {#you-shipped-a-dapp}

你從一個空資料夾出發，完成了一個具備錢包功能、在 Chia 主網上以你自己網域上線的 React 應用——過程中觸及了每一個核心元件：[建立骨架](../digstore/cli/quickstart.md)、[頁內錢包](../browser/using-window-chia.md)、[SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk)、[花費建構器](https://github.com/DIG-Network/chip35_dl_coin)、[讀取路徑](../rpc/what-is-the-dig-rpc.md)，以及[部署](../digstore/cli/deploy-from-github-actions.md)。你也可以從[範例展示館](./example-gallery.md)複製一份完成品。

## 相關文件 {#related}

- [建立應用骨架（create-dig-app）](./scaffold.md)——五種範本，以及 npm 與 CLI 兩道前門的比較
- [範例展示館](./example-gallery.md)——複製一份完成的 dapp，並在範本中開啟它
- [使用 window.chia](../browser/using-window-chia.md)——完整的頁內錢包 provider 說明
- [window.chia provider 規格](../protocol/window-chia-provider.md)——規範性、附版本號的 provider 合約
- [專案設定與建置時期的數值](../digstore/cli/configuration.md)——dig.toml 加上公開設定
- [從 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)——在 CI 中實現推送即部署
- [什麼是 dig RPC？](../rpc/what-is-the-dig-rpc.md)——讀取經過驗證的加密內容
- [快速入門](../quickstart.md)——較短的「發布一個網站」路徑
- [概念與詞彙表](../concepts.md)——capsule、store、URN 與 window.chia 的定義
