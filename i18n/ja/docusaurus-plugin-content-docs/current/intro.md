---
sidebar_position: 1
slug: /
title: DIG Network
description: "DigStoreによるコンテンツアドレス指定型の公開、盲目ホスティングと取得のためのdig RPC、そしてコンテンツアクセスのためのDIG BrowserというDIG Networkのプリミティブの概要。"
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - DigStore
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG NetworkはChia上のProof-of-Stake Layer 2です** — ホストを信頼することなくコンテンツを公開し、アドレス指定し、配信するための分散型ネットワークです。

このドキュメントはネットワークとその**プリミティブ**（DIG上に構築する際に開発者が使う、組み合わせ可能な構成要素）を扱います。ネットワークはまだ拡張中であり、今後さらに多くのプリミティブがここに文書化されていきます。

## capsule {#the-capsule}

すべてのプリミティブを貫く一つの概念があります。**capsule**とは、1つの不変なstore世代（generation）のことで、`(storeId, rootHash)`のペアであり、正規表記では`storeId:rootHash`と書かれます。**storeはcapsuleの並び**であり、コミットごとに1つ（各コミットがオンチェーンのrootを進め、新しいcapsuleを生成します）。

capsuleはネットワークにおける以下の単位です。

- **コンパイル** — 各capsuleは1つの固定サイズのWASMモジュールにコンパイルされます（その長さがコンテンツサイズについて何も漏らさないようパディングされます）。
- **価格設定** — **capsuleごとに均一な価格**（mintまたはcommit）を、その時点のレートで$DIGにより支払います。storeの生涯コストは、均一なcapsule価格 × capsuleの数です。
- **取得** — URNは1つのcapsule（および任意でその中のリソース）を指します。
- **キャッシュ** — ホストやブラウザは`storeId:rootHash`をキーにcapsuleをキャッシュします。ローカルキャッシュはcapsuleの集合です。
- **来歴（provenance）** — 各capsuleのrootには、公開者のBLS署名とMerkle rootが含まれます。

これはエコシステム全体にわたる定義です。「capsule = `(storeId, rootHash)`」は、DigStore、dig RPC、DIG Browserのいずれにおいても同じ意味を持ちます。

:::tip 試してみる
[**DIGHUbで最初のcapsuleを作成する ↗**](https://hub.dig.net/new) — CLI不要で、ブラウザからサイトを公開できます。各capsule（mintまたはcommit）には**$DIGでの均一なcapsule価格**がかかります。
:::

## プリミティブ {#primitives}

### 🗄️ DigStore {#️-digstore}

最初の、そして最も基礎的なプリミティブです。**コンテンツアドレス指定型の、暗号化されたWASMプロジェクトフォーマット**です。ビルドディレクトリを指定し、Gitのようにデプロイをコミットすると、単一の自己防衛型`.wasm`ファイルが得られます。このファイルはデータそのものであると同時に、そのアクセスを制御するサーバーでもあります。URNこそが鍵です — 場所を示すと同時に復号も行います。

→ **[DigStoreを詳しく見る](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[DigStoreとは？](./digstore/what-is-digstore.md)** | 一言で言えばワンファイルという発想 |
| **[フォーマット](./digstore/format/overview.md)** | プロジェクト、デプロイ、URN、暗号化、証明 |
| **[CLIチュートリアル](./digstore/cli/quickstart.md)** | プロジェクトで`digstore`をインストールして使う |

### 🛰️ dig RPC {#️-dig-rpc}

ネットワーキングのプリミティブです。**ホストされたDigStoreデプロイからコンテンツを読み取るための標準インターフェース**です。HTTPS `POST`上のJSON-RPC 2.0であり、すべてのホスティングノードが同一に対応するため、コンテンツはポータブルでクライアントはノードに依存しません。取得キーによる暗号文と包含証明、`(store_id, root)`によるデプロイ全体、そして公開用の発見マニフェストをチャンク単位でストリーミングし、構造上盲目であり、検証と復号はすべてクライアント側で行われます。

→ **[dig RPCを詳しく見る](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[dig RPCとは？](./rpc/what-is-the-dig-rpc.md)** | ネットワーク全体の読み取りパスのための単一エンドポイント |
| **[メソッド](./rpc/methods.md)** | `dig.getContent`、`dig.getCapsule`、`dig.getManifest`、`dig.listCapsules`、… |
| **[ストリーミング](./rpc/streaming.md)** | チャンクモデル、再構成、証明検証 |
| **[準拠性とセキュリティ](./rpc/conformance.md)** | 盲目モデル、CORS、ノードが実装すべきこと |

### 🌐 DIG Browser {#-dig-browser}

クライアントのプリミティブです。**Chiaウォレット内蔵のブラウザ**です。すべてのページに`window.chia`プロバイダーを注入するため、どんなWebアプリでもWalletConnectの設定なしにユーザーのアドレス、署名、支出をリクエストできます — すでにCHIP-0002に対応しているアプリのドロップイン代替となります。また、`chia://`のコンテンツアドレスを直接解決します。

→ **[DIG Browserに対応した開発をする](./browser/using-window-chia.md)**

| | |
|---|---|
| **[アプリで`window.chia`を使う](./browser/using-window-chia.md)** | 注入されたウォレットを検出し、接続し、CHIP-0002メソッドを呼び出す |

:::tip 試してみる
[**DIG Browserを入手する ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — ブラウザをダウンロードして`chia://`のコンテンツを開き、内蔵ウォレットを使いましょう。
:::

*決済とノード運用といった追加のプリミティブも、順次それぞれの節が用意されます。*

## あなたの道を選ぶ {#pick-your-path}

このドキュメントは**あなたが何をしたいか**を軸に構成されています。各トラックは10秒でわかる「なぜ」から始まり、必要なメンタルモデル、そして重要度の高い手順を示し、さらに深く知りたければプロトコルへのリンクへと続きます。

- **[自分が所有するサイトやアプリを公開する](./audiences/app-developers.md)** — Webサイト/アプリを自分自身のオンチェーン資産として出荷する。無料でビルドし、capsuleを公開する。
- **[NFTとコレクションをミントする](./audiences/nft-developers.md)** — 永続的で改ざん検知可能なcapsuleに支えられたCHIP-0007ドロップ。
- **[アプリにDIGを統合する](./audiences/integration-developers.md)** — 型付きSDKと完全に機械可読なプラットフォーム。
- **[ノードを運用する](./run-a-node/index.md)** — 証明可能かつプロバイダー非公開でコンテンツを配信する。
- **[chia://コンテンツを開く](./audiences/content-consumers.md)** — 自分のブラウザがチェーンに照らして検証したコンテンツを読む。
- **[困ったときは](./audiences/troubleshooting.md)** — 安定したコードで失敗の原因を特定する。

用語に不慣れですか？[概念と用語集](./concepts.md)にざっと目を通してください。設計の全体像を知りたければ、[プロトコル詳解](./protocol-deep-dive.md)を読んでください。

:::note
DIG Networkとそのプリミティブはオープンソースです。DigStoreはGPL-2.0の下でライセンスされています。[digstoreリポジトリ](https://github.com/DIG-Network/digstore)を参照してください。
:::

## 関連項目 {#related}

- [クイックスタート](./quickstart.md) — 最初のサイトを出荷する。ビルドとプレビューは無料
- [Chiaでdappを構築する](./build-a-dapp/tutorial.md) — すべてのプリミティブを1つのエンドツーエンドチュートリアルで
- [概念と用語集](./concepts.md) — DIGの中核となるエンティティを定義し、リンクする
- [DigStoreとは？](./digstore/what-is-digstore.md) — コンテンツアドレス指定型のstoreフォーマット
- [dig RPCとは？](./rpc/what-is-the-dig-rpc.md) — ネットワーク全体の読み取りインターフェース
- [chia://プロトコル](./browser/chia-protocol.md) — DIG Browserでコンテンツを開く
- [ヘルプを得る](./support/get-help.md) — コミュニティ、トラブルシューティング、エラーコード
