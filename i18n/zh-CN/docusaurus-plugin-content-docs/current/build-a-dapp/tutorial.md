---
sidebar_position: 1
title: Build a dapp on Chia
description: "端到端教程：搭建一个 React 应用，用 dig-sdk 接入页内 Chia 钱包（window.chia + WalletConnect 回退），通过 chip35 wasm 构建并签名一笔支出，然后上链部署并添加自定义域名 —— 一条贯穿每个 DIG 基础原语的完整线索。"
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

# 在 Chia 上构建一个 dapp {#build-a-dapp-on-chia}

每个 DIG 基础原语都有各自独立的文档 —— 脚手架、页内钱包、读取路径、支出、部署。**本页则是将它们串联成一个完整已发布 dapp 的那条唯一线索。** 你将从一个空文件夹开始，最终得到一个具备钱包能力的 React 应用，并在自己的域名下于链上正式上线。

从头到发布之前的整个流程都是**免费**的 —— 搭建脚手架、开发和预览都不花一分钱。你只在部署这一步才需要支付**以 $DIG 计价的统一 capsule 价格**。

```
new ──▶ dev ──▶ wire wallet (dig-sdk) ──▶ build a spend (chip35) ──▶ deploy ──▶ custom domain
 free    free          free                       free            capsule price    free
```

## 你需要准备什么 {#what-youll-need}

- 已安装 [`dig-store` CLI](../digstore/cli/install.md)。
- Node 18+ 和 `npm`。
- 一个已充值的 Chia 钱包 —— **仅在部署这一步需要**（以 $DIG 计价的统一 capsule 价格 + 少量 XCH 手续费）。在此之前的一切都是免费的。

---

## 1. 搭建一个 React 应用 —— 免费，不上链 {#1-scaffold-a-react-app--free-no-chain}

`digs new` 会写入一个可运行的、已接入钱包的项目。选择 React 模板：

```sh
digs new vite-react my-dapp
cd my-dapp
```

你会得到一个 Vite + React 应用、一个 `dig.toml`（`output-dir = "dist"`、`build-command = "npm install && npm run build"`），以及一个已经接入页内钱包的 `App.jsx`。此时没有任何 store 被铸造，也没有任何花费 —— `new` 完全是本地操作。

:::tip 更喜欢 npm？使用 `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` 可以直接从 npm 搭建同样的模板 —— 这是 JS 入口，无需先安装 `dig-store` 即可开始。查看[搭建应用脚手架](./scaffold.md)了解全部五种模板，以及这两个入口之间的比较。
:::

## 2. 在真实读取路径上开发 —— 免费 {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev` 会运行你的构建流程，通过**真实的 `chia://` 读取路径**（编译 → 验证 → 解密）提供输出内容的服务，并注入一个 **`window.chia` 开发模拟器（dev shim）**，让你无需真实钱包即可开发钱包相关流程。编辑 `src/App.jsx` 并保存，页面会热重载 —— 这正是访客最终会看到的效果，且不涉及任何链上交互，也不会有任何花费。

## 3. 用 SDK 接入钱包 —— `window.chia` + WalletConnect 回退 {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

脚手架直接与 `window.chia` 通信，这在 [DIG Browser](../browser/using-window-chia.md) 内部效果完美。为了同时支持其他浏览器的用户，可以添加 SDK —— 它会**优先使用注入的 `window.chia` 钱包，回退到 WalletConnect → Sage**，两者被统一封装在同一个规范化接口之下，因此钱包相关逻辑只需编写一次。

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # optional: only for the WalletConnect fallback
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" prefers the injected DIG Browser wallet, else WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // a PUBLIC build-time value
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // render a QR
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

同一个 `connect()` 调用既能在 DIG Browser 中工作（无需二维码，无需中继），也能在其他任何地方工作（通过 WalletConnect）。`provider.backend` 会告诉你实际连接使用的是哪种传输方式。无论哪种情况，方法名称和返回结果的结构都完全一致 —— 完整的集成指南参见[使用 `window.chia`](../browser/using-window-chia.md)，或者查看[规范性的 `window.chia` provider 规范文档](../protocol/window-chia-provider.md)以获取确切的方法/参数/返回值/错误约定。

:::note WalletConnect 项目 ID 是一个公开的构建期取值
`VITE_WC_PROJECT_ID` 会被编译进你的构建产物中，是全世界都可读的 —— 对于一个 WalletConnect 云端 ID 来说，这是正确的做法。**切勿**将钱包助记词、部署密钥或任何机密信息放入构建产物中：capsule 是一个[没有服务器端机密信息的盲态静态制品](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule)。
:::

## 4. 构建并签名一笔支出 —— 通过 SDK 使用 chip35 wasm {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

当你的 dapp 需要在链上执行某些操作时（铸造一个 store、更新元数据、构建一笔 CAT 支付），它会使用**规范的 CHIP-0035 支出构建器**来构建这笔支出，并交给钱包签名。SDK 在 `/spend` 子路径下重新导出了该构建器 —— 你**永远不需要手工拼装一个支出包**。

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // the chip35 wasm builder

async function doSpend() {
  spend.init();

  // Build coin spends with the wasm builder, e.g. spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). The builder is
  // offline and pure — no keys, no network.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Hand them to the wallet to sign (the wallet holds the keys, not your dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → combine into a spend bundle and broadcast.
}
```

这正是 hub 所使用的精确模式：**在浏览器中用 wasm 构建支出包，用钱包为其签名。** 该支出构建器是整个生态系统中支出包的唯一规范来源，因此你的 dapp 产生的支出与 hub 和 CLI 产生的支出在字节层面完全一致。

要**读取**已验证的加密内容（例如，在你的 dapp 中渲染另一个 store 的数据），可以使用 SDK 的 `DigClient`：

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

`DigClient` 会在浏览器中推导出 URN 对应的密钥，对照链上根哈希验证包含性，然后解密 —— 服务端的主机始终保持盲态。参见[什么是 dig RPC？](../rpc/what-is-the-dig-rpc.md)。

:::tip 想要收费访问？使用 `Paywall`
若要实现变现 —— 付费解锁内容，或将访问权限限定为持有某个 NFT —— SDK 提供了一个高级的 **`Paywall`** 辅助工具，它将一个已连接的 `ChiaProvider` 与支出构建器组合起来，让你无需手动接入支付逻辑：`paywall.requestPayment({ amount, owner })` 会向 dapp 所有者付款并返回一个凭证，而 `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` 则用于门控访问权限。

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }
```
:::

## 5. 部署上链 {#5-deploy-on-chain}

构建和预览都是免费的；这一步是唯一会花费的步骤。首先**一次性**创建 store：

```sh
digs init my-dapp --dir dist      # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init` 会在主网上铸造一个 Chia singleton —— **launcher id 即成为你的 store id**。将它复制进 `dig.toml`（`store-id = "<64-hex>"`）。此后，一条命令即可构建并发布一个新的 capsule：

```sh
digs deploy --json                # runs build-command, stages dist/, advances the root
```

每一次 `deploy` 都会以统一的 capsule 价格发布一个新的不可变 capsule。一经确认，你的 dapp 就**可以通过 [dig RPC](../rpc/what-is-the-dig-rpc.md) 读取**，通过它的 [URN](../concepts.md#urn) / `chia://` 地址访问 —— 加密、已验证，且无法被下线，无需注册，也无需额外付费。（一个友好的 `*.on.dig.net` 网址是一个单独的可选步骤 —— 参见[下一节](#6-put-it-on-your-own-domain)。）若要在每次提交时都实现 push-to-deploy，请接入[从 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md)。

## 6. 部署到你自己的域名 {#6-put-it-on-your-own-domain}

你的 store 已经可以通过它的 URN / `chia://` 地址访问 —— 但如果想要一个友好的网址，你需要注册一个名字。当你在 DIGHUb 中为 store **注册一个 handle** 时，它就会获得一个 `*.on.dig.net` 子域名：这是一项单独的付费注册，用于将该 store 固定到那个名称上（不注册 → 就没有 `*.on.dig.net` 地址）。如果想改用你自己拥有的域名提供服务，可以在 [DIGHUb ↗](https://hub.dig.net) 中添加一个**带 TLS 的自定义域名** —— 将你的域名指向该 store，DIGHUb 会自动处理证书。无论哪种方式，你的 dapp 都会从一个人类友好的网址加载，同时底层依然完全去中心化。

当 CHIP-54 的 `.dig` handle 落地后，一个 store 也将可以通过人类可读的 `.dig` 名称被寻址；在那之前，通过 DIGHUb 使用自定义域名是为一次部署打上品牌标识的方式。

---

## 你已经发布了一个 dapp {#you-shipped-a-dapp}

你从一个空文件夹出发，最终得到了一个具备钱包能力的 React 应用，并在 Chia 主网上通过你自己的域名正式上线 —— 沿途接触了每一个基础原语：[脚手架搭建](../digstore/cli/quickstart.md)、[页内钱包](../browser/using-window-chia.md)、[SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk)、[支出构建器](https://github.com/DIG-Network/chip35_dl_coin)、[读取路径](../rpc/what-is-the-dig-rpc.md)，以及[部署](../digstore/cli/deploy-from-github-actions.md)。你也可以从[示例画廊](./example-gallery.md)中克隆一个已完成的版本。

## 相关链接 {#related}

- [搭建应用脚手架（create-dig-app）](./scaffold.md) —— 五种模板以及 npm 与 CLI 两种入口
- [示例画廊](./example-gallery.md) —— 克隆一个已完成的 dapp 并在模板中打开它
- [使用 window.chia](../browser/using-window-chia.md) —— 完整的页内钱包 provider 说明
- [window.chia provider 规范](../protocol/window-chia-provider.md) —— 规范性的、带版本号的 provider 约定
- [项目配置与构建期取值](../digstore/cli/configuration.md) —— dig.toml + 公开配置
- [从 GitHub Actions 部署](../digstore/cli/deploy-from-github-actions.md) —— 在 CI 中实现 push-to-deploy
- [什么是 dig RPC？](../rpc/what-is-the-dig-rpc.md) —— 读取已验证的加密内容
- [快速开始](../quickstart.md) —— 更短的"发布一个站点"路径
- [概念与术语表](../concepts.md) —— capsule、store、URN 和 window.chia 的定义
