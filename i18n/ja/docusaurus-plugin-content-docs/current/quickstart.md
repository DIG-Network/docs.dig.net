---
sidebar_position: 2
title: クイックスタート
description: "DIG上に最初のサイトを出荷する — ビルドとプレビューは無料で、公開する瞬間にのみ均一なcapsule価格を支払います。ウォレット不要で始められるWeb優先の手順と、それに並行するCLIトラックです。"
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# クイックスタート {#quickstart}

どんなホストも読めず、変更できず、停止させることもできないネットワークにサイトを出荷しましょう — 所要時間は約10分です。

**ビルドとプレビューは無料です。** 足場作りとプレビューには一切費用がかかりません。[capsule](./concepts.md#capsule)をオンチェーンで公開する瞬間にのみ、**$DIGでの均一なcapsule価格**を支払います。*無料で反復し、準備ができたら公開しましょう。*

方法は2つあります。ほとんどの人はWebから始めます。

- **[A. Webから公開する](#a-publish-from-the-web)** — [DIGHUb](./concepts.md#dighub)で、最後にウォレットを接続します。サイトやフロントエンドに最適です。約10分。
- **[B. CLIから公開する](#b-publish-from-the-cli)** — 自分のマシンで`digstore`を使い、スクリプト化・CI対応可能です。開発者や自動化に最適です。

---

## A. Webから公開する {#a-publish-from-the-web}

最速の方法です。ブラウザでビルドとプレビューを行い、最後のステップでのみウォレットに資金を入れます。

### 1. DIGHUbを開いてドラフトを開始する — 無料、ウォレット不要 {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**DIGHUbで新しいstoreを開始する ↗**](https://hub.dig.net/new)。ビルド済みのサイト（静的ファイルのフォルダ — `dist/`や`build/`）をドロップします。DIGHUbは、オンチェーンに何も置かず$DIGも使わずに、実際にどう配信されるかをそのまま示す**無料のドラフトプレビュー**を提供します。

まだウォレットは必要ありません。ドラフトは何度でも — 再アップロード、再プレビュー — 完全に無料で反復できます。

### 2. 実際の読み取りパスでプレビューする — まだ無料 {#2-preview-it-on-the-real-read-path--still-free}

このプレビューは、本物のDIGパイプライン（暗号化 → コンパイル → 検証 → 復号）を通してサイトをレンダリングするため、あなたが見るものは訪問者が受け取るものと同じです。クリックして回り、アセットやルーティングを確認しましょう。あなたが選択するまで何も公開されず、何も費用は発生しません。

### 3. 公開する — ウォレットに資金を入れて接続する {#3-publish--fund-and-connect-a-wallet}

ドラフトが問題なければ、**公開**をクリックします。これが唯一費用が発生するステップです。

- Chiaウォレットを接続します（あなたのウォレットが*あなたのアカウント*です — メールもパスワードも不要です）。
- オンチェーンの支出を承認します。**$DIGでの均一なcapsule価格 + わずかなXCH手数料**を、1回の署名で。公開画面には、署名前に正確な$DIGの金額が表示されます。
- DIGHUbがあなたのstoreをmintし、Chiaメインネット上に最初の**capsule**を公開します。

DIGが足りませんか？公開画面にはあなたの残高と、どこで補充できるかが表示されます。[DIGの入手方法](./digstore/cli/onchain-anchoring.md#where-to-get-dig)（TibetSwap、dexie.space、9mm.pro）を参照してください。

### 4. 公開完了 {#4-youre-live}

あなたのcapsuleは今やオンチェーンに固定され、**[dig RPC](./concepts.md#dig-rpc)経由で即座に読み取り可能**です — 誰でも[`urn:dig:` URN](./concepts.md#urn)や[`chia://`](./browser/chia-protocol.md)アドレスによってそれを取得・検証でき、登録も追加の支払いも不要です。URNはアドレスであると同時に鍵でもあります。共有することはコンテンツを共有することです。読み取りパスは普遍的かつ無料であり、capsuleが確定した瞬間に公開されます。

**人に優しい`*.on.dig.net`アドレスが欲しいですか？** それは任意です。storeが`*.on.dig.net`サブドメインを得るのは、DIGHUbで**ハンドルを登録**した場合のみです — これは別途有料の登録であり、storeをその名前に固定します。登録するまでは`*.on.dig.net`のURLは存在しません（上記のURN / `chia://`アドレスは常にそこへ到達する正規の方法です）。[自分のドメインは使えますか？](./support/faq.md#can-i-use-my-own-domain)を参照してください。

**後で更新を出荷するには：** 編集し、新しいドラフトを無料でプレビューし、再び公開してください。公開された更新はそれぞれ新しいcapsuleであり、再び**均一なcapsule価格**がかかります — ドラフトを永続的なオンチェーンバージョンに昇格させるときにのみ費用が発生します。

:::tip 自動化する
storeが存在するようになったら、[GitHub Actionsからデプロイする](./digstore/cli/deploy-from-github-actions.md)を設定して、`main`へのプッシュのたびに新しいcapsuleを公開しましょう — git-push-to-deployです。
:::

---

## B. CLIから公開する {#b-publish-from-the-cli}

ターミナルから同じフローを実行します — スクリプト化可能で、CIの基盤になります。CLIはWebの手順を反映しています。ビルドとプレビューは無料で、capsuleの公開には$DIGでの均一なcapsule価格がかかります。

### 1. インストール {#1-install}

```sh
# download the installer for your OS from the Releases page, then:
digstore --version
```

OSごとのインストーラーとソースからのビルドについては、[CLIのインストール](./digstore/cli/install.md)を参照してください。

### 2. 足場を作りプレビューする — 無料、チェーンなし、支出なし {#2-scaffold-and-preview--free-no-chain-no-spend}

支出する前に、プロジェクトの足場を作りローカルでプレビューします — **無料、mintなし、チェーンなし**です。

```sh
digstore new <template>   # scaffold a wallet-wired project (static · vite-react · next-static · nft-drop · dapp-window-chia) — free, no mint
digstore dev              # watch + compile-on-save + serve the real chia:// read path, with an injected window.chia — free, live-reload
```

`new`は実行可能なプロジェクト（`dig.toml`とスターターアプリ）を書き出します。`dev`はそれを本物のDIG読み取りパス（コンパイル → 検証 → 復号）でライブリロード付きに配信します。均一なcapsule価格を支払うのは公開するとき（次のステップ）だけです。あるいは、いつものツールチェーン（`npm run build` → `dist/`）でビルドし、その出力を公開することもできます。

:::tip npmがお好みですか？`create-dig-app`を使いましょう
Node中心の環境にお住まいなら、`npm create dig-app@latest my-app -- --template vite-react`が同じテンプレートをnpmから直接足場作りします — 始めるのに`digstore`のインストールは不要です。[アプリを足場作りする](./build-a-dapp/scaffold.md)を参照してください。
:::

### 3. ウォレットを設定する（公開する場合のみ必要） {#3-set-up-a-wallet-only-needed-to-publish}

公開は実際の資金を消費するため、まずシードと資金を入れたウォレットが必要です。

```sh
digstore seed generate      # generate a fresh mnemonic (shown once — back it up)
digstore balance            # show your receive address; fund it with XCH + DIG
```

インポート、資金供給、TTLの詳細については、[オンチェーンアンカリング](./digstore/cli/onchain-anchoring.md)を参照してください。

### 4. 最初のcapsuleを公開する {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init`はメインネット上にChiaシングルトンをmintします — **ランチャーIDがあなたのstore IDになります** — そして確定するまでブロックします。

### 5. 更新を出荷する {#5-ship-updates}

```sh
npm run build                      # produce dist/
digstore add -A                    # stage the whole content root
digstore commit -m "v1.1"          # publish a new capsule (uniform capsule price + XCH fee)
```

CIでは、1つのコマンドでadd → commit → pushを行い、URLを出力します。

```sh
digstore deploy --output-dir dist --json   # advance an existing store from CI; never mints
```

[GitHub Actionsからデプロイする](./digstore/cli/deploy-from-github-actions.md)を参照してください。

### 6. 読み戻す {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # a URN both locates AND decrypts
```

---

## 費用について {#what-it-costs}

| あなたが行うこと | 費用 |
|---|---|
| 足場作り、ビルド、ドラフトのプレビュー | **無料** |
| 最初のcapsuleを公開する（`init` / DIGHUbの公開） | **$DIGでの均一なcapsule価格** + わずかなXCH手数料 |
| 各更新を公開する（`commit` / 再公開） | **$DIGでの均一なcapsule価格** + わずかなXCH手数料 |

価格はどこでも**capsuleごとに均一**です — [なぜ価格が均一なのか](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform)を参照してください。

## 行き詰まったら？ {#stuck}

- [トラブルシューティング](./support/troubleshooting.md) — よくある失敗とその修正方法。
- [FAQ](./support/faq.md) — 簡単な回答。
- [ヘルプを得る](./support/get-help.md) — コミュニティと、良い報告の書き方。

## 関連項目 {#related}

- [概念と用語集](./concepts.md) — capsule、store、URN、DIG決済の定義
- [アプリを足場作りする（create-dig-app）](./build-a-dapp/scaffold.md) — 1つのコマンド（npmまたはCLI）でデプロイ可能なプロジェクトを開始する
- [CLIのインストール](./digstore/cli/install.md) — 自分のマシンに`digstore`を入れる
- [オンチェーンアンカリング](./digstore/cli/onchain-anchoring.md) — ウォレットの設定、資金供給、費用
- [GitHub Actionsからデプロイする](./digstore/cli/deploy-from-github-actions.md) — CIでのpush-to-publish
- [CLIチュートリアル](./digstore/cli/quickstart.md) — 作成・コミット・読み取りの完全な手順
