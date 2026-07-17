---
sidebar_position: 1
title: Xây dựng một dapp trên Chia
description: "Từ đầu đến cuối: dựng khung một ứng dụng React, kết nối ví Chia trong-trang (window.chia + dự phòng WalletConnect) với dig-sdk, xây dựng và ký một giao dịch chi tiêu qua wasm chip35, sau đó triển khai on-chain và thêm một tên miền tùy chỉnh — một luồng duy nhất xuyên suốt mọi thành phần cơ bản của DIG."
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

# Xây dựng một dapp trên Chia {#build-a-dapp-on-chia}

Mỗi thành phần cơ bản của DIG đều được tài liệu hóa riêng — dựng khung, ví trong-trang, đường đọc, giao dịch chi tiêu, triển khai. **Trang này là luồng duy nhất kết nối chúng lại thành một dapp đã xuất bản.** Bạn sẽ bắt đầu từ một thư mục trống và kết thúc với một ứng dụng React nhận biết ví, trực tuyến on-chain trên tên miền của riêng bạn.

Toàn bộ vòng lặp cho đến khi xuất bản đều **miễn phí** — dựng khung, phát triển, và xem trước không tốn gì cả. Bạn chỉ trả **mức giá capsule đồng nhất bằng $DIG** ở bước triển khai.

```
new ──▶ dev ──▶ wire wallet (dig-sdk) ──▶ build a spend (chip35) ──▶ deploy ──▶ custom domain
 free    free          free                       free            capsule price    free
```

## Bạn sẽ cần gì {#what-youll-need}

- [CLI `dig-store`](../digstore/cli/install.md) đã được cài đặt.
- Node 18+ và `npm`.
- Một ví Chia đã nạp tiền — **chỉ cần ở bước triển khai** (mức giá capsule đồng nhất bằng $DIG + một khoản phí XCH nhỏ). Mọi thứ trước đó đều miễn phí.

---

## 1. Dựng khung một ứng dụng React — miễn phí, không cần chuỗi {#1-scaffold-a-react-app--free-no-chain}

`digs new` viết ra một dự án chạy được, có ví. Chọn template React:

```sh
digs new vite-react my-dapp
cd my-dapp
```

Bạn nhận được một ứng dụng Vite + React, một `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`), và một `App.jsx` đã được kết nối sẵn với ví trong-trang. Không có store nào được mint và không có gì bị tốn — `new` hoàn toàn cục bộ.

:::tip Thích dùng npm hơn? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` dựng khung cùng template đó trực tiếp từ npm — cửa ngõ JS, không cần cài `dig-store` để bắt đầu. Xem [Dựng khung một ứng dụng](./scaffold.md) để biết cả năm template và cách hai cửa ngõ so sánh với nhau.
:::

## 2. Phát triển dựa trên đường đọc thực tế — miễn phí {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev` chạy bản build của bạn, phục vụ kết quả qua **đường đọc `chia://` thực thụ** (biên dịch → xác minh → giải mã), và tiêm một **dev shim `window.chia`** để bạn có thể xây dựng luồng ví mà không cần ví thật. Chỉnh sửa `src/App.jsx`, lưu lại, và trang tự động tải lại — chính xác những gì khách truy cập sẽ nhận được, với không tương tác chuỗi nào và không tốn tiền nào.

## 3. Kết nối ví với SDK — `window.chia` + dự phòng WalletConnect {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

Bản dựng khung nói chuyện trực tiếp với `window.chia`, hoàn hảo bên trong [DIG Browser](../browser/using-window-chia.md). Để cũng hỗ trợ người dùng trên các trình duyệt khác, thêm SDK vào — nó **ưu tiên ví `window.chia` được tiêm sẵn và dự phòng bằng WalletConnect → Sage** dưới một bề mặt đã chuẩn hóa, nên bạn chỉ viết luồng ví một lần.

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

Một `connect()` duy nhất hoạt động trong DIG Browser (không QR, không relay) và ở mọi nơi khác (WalletConnect). `provider.backend` cho bạn biết lớp vận chuyển nào đã kết nối. Tên phương thức và hình dạng kết quả giống hệt nhau ở cả hai trường hợp — xem [Sử dụng `window.chia`](../browser/using-window-chia.md) để biết hướng dẫn tích hợp, hoặc [đặc tả provider `window.chia` chuẩn tắc](../protocol/window-chia-provider.md) để biết hợp đồng phương thức/tham số/kết quả trả về/lỗi chính xác.

:::note ID dự án WalletConnect là một giá trị thời điểm build CÔNG KHAI
`VITE_WC_PROJECT_ID` được biên dịch vào bundle của bạn và ai cũng đọc được — điều đó đúng đối với một id đám mây WalletConnect. **Không bao giờ** đặt một seed ví, khóa triển khai, hoặc bất kỳ bí mật nào vào bundle: một capsule là một [tài sản tĩnh ẩn danh không có bí mật server](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Xây dựng và ký một giao dịch chi tiêu — wasm chip35, qua SDK {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Khi dapp của bạn cần làm điều gì đó on-chain (mint một store, cập nhật metadata, xây dựng một khoản thanh toán CAT), nó xây dựng giao dịch chi tiêu bằng **trình xây dựng giao dịch chi tiêu CHIP-0035 chuẩn tắc** và đưa nó cho ví ký. SDK re-export trình xây dựng đó tại subpath `/spend` — bạn **không bao giờ tự tay xây dựng một bó giao dịch chi tiêu**.

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

Đây chính là mẫu hình mà hub sử dụng: **xây dựng bó giao dịch trong trình duyệt bằng wasm, ký nó bằng ví.** Trình xây dựng giao dịch chi tiêu là nguồn duy nhất và chuẩn tắc của các bó giao dịch chi tiêu trên toàn bộ hệ sinh thái, nên dapp của bạn tạo ra các giao dịch chi tiêu giống hệt byte-for-byte với hub và CLI.

Để **đọc** nội dung đã xác minh, mã hóa trở lại (ví dụ: render dữ liệu của một store khác bên trong dapp của bạn), dùng `DigClient` của SDK:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

`DigClient` dẫn xuất các khóa của URN trong trình duyệt, xác minh sự bao gồm dựa trên root on-chain, và giải mã — host phục vụ vẫn ẩn danh. Xem [dig RPC là gì?](../rpc/what-is-the-dig-rpc.md).

:::tip Tính phí truy cập? Dùng `Paywall`
Để kiếm tiền — trả-phí-để-mở-khóa nội dung, hoặc kiểm soát truy cập dựa trên việc sở hữu một NFT — SDK cung cấp một trình trợ giúp cấp cao **`Paywall`** kết hợp một `ChiaProvider` đã kết nối với trình xây dựng giao dịch chi tiêu để bạn không phải tự tay kết nối thanh toán: `paywall.requestPayment({ amount, owner })` trả tiền cho chủ sở hữu dapp và trả về một biên nhận, và `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` kiểm soát truy cập.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }
```
:::

## 5. Triển khai on-chain {#5-deploy-on-chain}

Bạn xây dựng và xem trước miễn phí; đây là bước duy nhất tốn tiền. Đầu tiên tạo store **một lần**:

```sh
digs init my-dapp --dir dist      # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init` mint một singleton Chia trên mainnet — **launcher id trở thành store id của bạn**. Sao chép nó vào `dig.toml` (`store-id = "<64-hex>"`). Từ đó trở đi, một lệnh duy nhất xây dựng và xuất bản một capsule mới:

```sh
digs deploy --json                # runs build-command, stages dist/, advances the root
```

Mỗi lần `deploy` xuất bản một capsule bất biến mới với chi phí là mức giá capsule đồng nhất. Ngay khi nó được xác nhận, dapp của bạn **có thể đọc được qua [dig RPC](../rpc/what-is-the-dig-rpc.md)** bằng địa chỉ [URN](../concepts.md#urn) / `chia://` của nó — được mã hóa, xác minh, và không thể gỡ xuống, không cần đăng ký và không tốn thêm gì. (Một địa chỉ web `*.on.dig.net` thân thiện là một bước riêng biệt, tùy chọn — xem [mục tiếp theo](#6-put-it-on-your-own-domain).) Để push-to-deploy trên mỗi commit, thiết lập [Triển khai từ GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## 6. Đưa nó lên tên miền của riêng bạn {#6-put-it-on-your-own-domain}

Store của bạn đã có thể truy cập được bằng địa chỉ URN / `chia://` của nó — nhưng để có một URL web thân thiện bạn đăng ký một tên. Một store nhận một subdomain `*.on.dig.net` khi bạn **đăng ký một handle** cho nó trong DIGHUb: một đợt đăng ký riêng, có trả phí, gắn store vào tên đó (không đăng ký → không có địa chỉ `*.on.dig.net`). Để phục vụ nó từ một tên miền bạn sở hữu thay vào đó, thêm một **tên miền tùy chỉnh có TLS trong [DIGHUb ↗](https://hub.dig.net)** — trỏ tên miền của bạn vào store và DIGHUb xử lý chứng chỉ. Dù bằng cách nào, dapp của bạn cũng tải từ một URL thân thiện với con người trong khi vẫn hoàn toàn phi tập trung bên dưới.

Khi các handle `.dig` CHIP-54 ra mắt, một store cũng sẽ có thể được định địa chỉ bằng một tên `.dig` dễ đọc; cho đến lúc đó, tên miền tùy chỉnh qua DIGHUb là cách để gắn thương hiệu cho một bản triển khai.

---

## Bạn đã xuất bản một dapp {#you-shipped-a-dapp}

Bạn đã đi từ một thư mục trống đến một ứng dụng React nhận biết ví, trực tuyến trên Chia mainnet tại tên miền của riêng bạn — chạm vào mọi thành phần cơ bản: [dựng khung](../digstore/cli/quickstart.md), [ví trong-trang](../browser/using-window-chia.md), [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), [trình xây dựng giao dịch chi tiêu](https://github.com/DIG-Network/chip35_dl_coin), [đường đọc](../rpc/what-is-the-dig-rpc.md), và [triển khai](../digstore/cli/deploy-from-github-actions.md). Sao chép một phiên bản hoàn chỉnh từ [bộ sưu tập ví dụ](./example-gallery.md).

## Liên quan {#related}

- [Dựng khung một ứng dụng (create-dig-app)](./scaffold.md) — năm template và hai cửa ngõ npm so với CLI
- [Bộ sưu tập ví dụ](./example-gallery.md) — sao chép một dapp hoàn chỉnh và mở nó trong một template
- [Sử dụng window.chia](../browser/using-window-chia.md) — provider ví trong-trang đầy đủ
- [Đặc tả provider window.chia](../protocol/window-chia-provider.md) — hợp đồng provider chuẩn tắc, có phiên bản
- [Cấu hình dự án & giá trị thời điểm build](../digstore/cli/configuration.md) — dig.toml + cấu hình CÔNG KHAI
- [Triển khai từ GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-deploy trong CI
- [dig RPC là gì?](../rpc/what-is-the-dig-rpc.md) — đọc nội dung đã xác minh, mã hóa
- [Bắt đầu nhanh](../quickstart.md) — lộ trình "xuất bản một trang web" ngắn hơn
- [Khái niệm & thuật ngữ](../concepts.md) — định nghĩa capsule, store, URN, và window.chia
