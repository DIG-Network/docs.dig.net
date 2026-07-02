---
sidebar_position: 1
title: Chiaでdappを構築する
description: "エンドツーエンド：Reactアプリを足場作りし、dig-sdkでページ内Chiaウォレット（window.chia + WalletConnectフォールバック）を組み込み、chip35 wasmで支出を構築・署名し、オンチェーンにデプロイしてカスタムドメインを追加する — DIGのすべてのプリミティブを1本の流れで。"
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digstore deploy
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

# Chiaでdappを構築する {#build-a-dapp-on-chia}

DIGのすべてのプリミティブはそれぞれ単独で文書化されています — 足場作り、ページ内ウォレット、読み取りパス、支出、デプロイ。**このページは、それらを1つの出荷済みdappにまとめる一本の流れです。** 空のフォルダから始め、自分のドメインでChiaメインネット上に動く、ウォレット対応のReactアプリを完成させます。

公開までの流れ全体は**無料**です — 足場作り、開発、プレビューには一切費用がかかりません。**$DIGでの均一なcapsule価格**を支払うのはデプロイのステップだけです。

```
new ──▶ dev ──▶ wire wallet (dig-sdk) ──▶ build a spend (chip35) ──▶ deploy ──▶ custom domain
 free    free          free                       free            capsule price    free
```

## 必要なもの {#what-youll-need}

- [`digstore` CLI](../digstore/cli/install.md)がインストールされていること。
- Node 18以上と`npm`。
- 資金を入れたChiaウォレット — **デプロイのステップでのみ**必要です（$DIGでの均一なcapsule価格 + わずかなXCH手数料）。それ以前はすべて無料です。

---

## 1. Reactアプリを足場作りする — 無料、チェーンなし {#1-scaffold-a-react-app--free-no-chain}

`digstore new`は、実行可能でウォレット対応済みのプロジェクトを書き出します。Reactテンプレートを選びましょう。

```sh
digstore new vite-react my-dapp
cd my-dapp
```

Vite + Reactアプリ、`dig.toml`（`output-dir = "dist"`、`build-command = "npm install && npm run build"`）、そしてすでにページ内ウォレットに配線された`App.jsx`が手に入ります。storeはmintされず、何も支出されません — `new`は純粋にローカルで完結します。

:::tip npmがお好みですか？`npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react`は同じテンプレートをnpmから直接足場作りします — JSの入口であり、始めるのに`digstore`のインストールは不要です。5つすべてのテンプレートと2つの入口の比較については[アプリを足場作りする](./scaffold.md)を参照してください。
:::

## 2. 実際の読み取りパスに対して開発する — 無料 {#2-develop-against-the-real-read-path--free}

```sh
digstore dev
```

`dev`はあなたのビルドを実行し、その出力を**本物の`chia://`読み取りパス**（コンパイル → 検証 → 復号）で配信し、**`window.chia`開発用シム**を注入するため、本物のウォレットなしでウォレットフローを構築できます。`src/App.jsx`を編集して保存すると、ページはライブリロードされます — チェーンとの対話も支出も一切発生せず、まさに訪問者が受け取るものが表示されます。

## 3. SDKでウォレットを配線する — `window.chia` + WalletConnectフォールバック {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

足場は`window.chia`と直接やり取りしますが、これは[DIG Browser](../browser/using-window-chia.md)の中では完璧に機能します。他のブラウザのユーザーもサポートするために、SDKを追加しましょう。SDKは**注入された`window.chia`ウォレットを優先し、WalletConnect → Sageにフォールバック**します。1つの正規化された面の下に隠れているため、ウォレットフローは一度書くだけで済みます。

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

1回の`connect()`呼び出しが、DIG Browser内では（QRコードもリレーもなしに）、それ以外の場所ではWalletConnect経由で機能します。`provider.backend`でどのトランスポートが接続されたかがわかります。メソッド名と結果の形はどちらの場合も同一です — 統合ガイドは[window.chiaを使う](../browser/using-window-chia.md)を、正確なメソッド／パラメータ／戻り値／エラーの契約については[規範的なwindow.chiaプロバイダー仕様](../protocol/window-chia-provider.md)を参照してください。

:::note WalletConnectのプロジェクトIDは公開のビルド時の値です
`VITE_WC_PROJECT_ID`はあなたのバンドルにコンパイルされ、世界中から読み取り可能です — これはWalletConnectクラウドIDとして正しい扱いです。**決して**ウォレットのシード、デプロイキー、その他の秘密情報をバンドルに入れないでください。capsuleは[サーバー側の秘密情報を持たない盲目な静的アーティファクト](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule)です。
:::

## 4. 支出を構築して署名する — SDK経由のchip35 wasm {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

あなたのdappがオンチェーンで何かを行う必要があるとき（storeをmintする、メタデータを更新する、CAT決済を構築するなど）、**正規のCHIP-0035支出ビルダー**で支出を構築し、それをウォレットに渡して署名させます。SDKはそのビルダーを`/spend`サブパスで再エクスポートしており、**支出バンドルを決して自前で組み立てることはありません**。

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

これはhubが使っているのと全く同じパターンです。**wasmでブラウザ内にバンドルを構築し、ウォレットで署名する。** この支出ビルダーはエコシステム全体にわたる唯一の正規の支出バンドルの源であるため、あなたのdappはhubやCLIとバイト単位で同一の支出を生成します。

検証済みの暗号化されたコンテンツを**読み取る**には（たとえば、別のstoreのデータをあなたのdapp内にレンダリングするなど）、SDKの`DigClient`を使います。

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

`DigClient`はブラウザ内でURNの鍵を導出し、オンチェーンのrootに対して包含を検証し、復号します — 配信元のホストは盲目のままです。[dig RPCとは？](../rpc/what-is-the-dig-rpc.md)を参照してください。

:::tip アクセスに課金しますか？`Paywall`を使いましょう
収益化のため — コンテンツの支払い解除、あるいはNFT所有によるゲート制御 — SDKには、接続済みの`ChiaProvider`と支出ビルダーを組み合わせ、支払いを手作業で配線せずに済む高レベルの**`Paywall`**ヘルパーが用意されています。`paywall.requestPayment({ amount, owner })`はdappのオーナーに支払いを行い受領証を返し、`paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })`がアクセスをゲート制御します。

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }
```
:::

## 5. オンチェーンにデプロイする {#5-deploy-on-chain}

ビルドとプレビューは無料です。支出が発生するのはこのステップだけです。まず**一度だけ**storeを作成します。

```sh
digstore init my-dapp --dir dist      # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init`はメインネット上にChiaシングルトンをmintします — **ランチャーIDがあなたのstore IDになります**。それを`dig.toml`（`store-id = "<64-hex>"`）にコピーしてください。それ以降は、1つのコマンドで新しいcapsuleを構築・公開できます。

```sh
digstore deploy --json                # runs build-command, stages dist/, advances the root
```

各`deploy`は、均一なcapsule価格で新しい不変のcapsuleを公開します。確定した瞬間、あなたのdappは[dig RPC](../rpc/what-is-the-dig-rpc.md)経由で、その[URN](../concepts.md#urn) / `chia://`アドレスによって**読み取り可能**になります — 暗号化され、検証済みで、停止させることは不可能であり、登録も追加の支払いも不要です。（フレンドリーな`*.on.dig.net`のWebアドレスは、別の任意のステップです — [次のセクション](#6-put-it-on-your-own-domain)を参照してください。）すべてのコミットでpush-to-deployするには、[GitHub Actionsからデプロイする](../digstore/cli/deploy-from-github-actions.md)を設定してください。

## 6. 自分のドメインに載せる {#6-put-it-on-your-own-domain}

あなたのstoreはすでにURN / `dig://`アドレスによって到達可能ですが、フレンドリーなWeb URLのためには名前を登録します。storeが`*.on.dig.net`サブドメインを得るのは、DIGHUbで**ハンドルを登録**したときです。これは、storeをその名前に固定する、別途有料の登録です（登録がなければ`*.on.dig.net`アドレスもありません）。代わりに自分が所有するドメインから配信したい場合は、[DIGHUb ↗](https://hub.dig.net)で**TLS付きのカスタムドメイン**を追加してください。ドメインをstoreに向けると、DIGHUbが証明書を処理します。どちらの方法でも、あなたのdappは基盤としては完全に分散化されたままで、人に優しいURLから読み込まれます。

CHIP-54の`.dig`ハンドルが実現すれば、storeは人が読みやすい`.dig`名でもアドレス指定できるようになります。それまでは、DIGHUb経由のカスタムドメインがデプロイをブランド化する方法です。

---

## dappを出荷しました {#you-shipped-a-dapp}

空のフォルダから、Chiaメインネット上で自分のドメインに実在する、ウォレット対応のReactアプリまでたどり着きました — [足場作り](../digstore/cli/quickstart.md)、[ページ内ウォレット](../browser/using-window-chia.md)、[SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk)、[支出ビルダー](https://github.com/DIG-Network/chip35_dl_coin)、[読み取りパス](../rpc/what-is-the-dig-rpc.md)、[デプロイ](../digstore/cli/deploy-from-github-actions.md)というすべてのプリミティブに触れました。完成版は[サンプルギャラリー](./example-gallery.md)からクローンできます。

## 関連項目 {#related}

- [アプリを足場作りする（create-dig-app）](./scaffold.md) — 5つのテンプレートと、npmとCLIという2つの入口
- [サンプルギャラリー](./example-gallery.md) — 完成済みのdappをクローンしてテンプレートで開く
- [window.chiaを使う](../browser/using-window-chia.md) — ページ内ウォレットプロバイダーの全体像
- [window.chiaプロバイダー仕様](../protocol/window-chia-provider.md) — 規範的でバージョン管理された、プロバイダーの契約
- [プロジェクト設定とビルド時の値](../digstore/cli/configuration.md) — dig.tomlと公開設定
- [GitHub Actionsからデプロイする](../digstore/cli/deploy-from-github-actions.md) — CIでのpush-to-deploy
- [dig RPCとは？](../rpc/what-is-the-dig-rpc.md) — 検証済みの暗号化コンテンツの読み取り
- [クイックスタート](../quickstart.md) — より短い「サイトを出荷する」経路
- [概念と用語集](../concepts.md) — capsule、store、URN、window.chiaの定義
