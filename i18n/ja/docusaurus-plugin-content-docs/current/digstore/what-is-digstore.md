---
sidebar_position: 1
title: dig-storeとは？
description: "組み込みの暗号化とURNベースのアドレス指定を備えた、Git形式のコンテンツアドレス指定型プロジェクトフォーマット。単一の自己防衛型WebAssemblyモジュールにコンパイルされます。"
keywords:
  - dig-store
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# dig-storeとは？ {#what-is-digstore}

**dig-storeは、Git形式で、暗号化された、コンテンツアドレス指定型のプロジェクトであり、単一の自己防衛型WebAssemblyモジュールにコンパイルされます。**

Gitスタイルのコマンド — `init`、`add`、`commit`、`log`、`clone`、`push`、`pull` — が使えるプロジェクトでありながら、**保存時に暗号化**され、**1つの`.wasm`ファイル**にコンパイルされます。この単一のファイルは*あなたのデータであると同時に、そのアクセスを制御するサーバーでもあります*。それを保存または中継するホストは、ハッシュでアドレス指定された暗号文しか見えず、それが運んでいるものを読むことはできません。

コンテンツは**[URN](./format/urns-and-encryption.md)**でアドレス指定され、URN*こそが*鍵です。それは場所を示すと同時に復号も行います。誰かにURNを渡せば、そのリソースを読むことができます。渡さなければ読めません — 管理すべき別のパスワードやアクセスリストは存在しません。

Gitとは異なり、dig-storeは**ビルド出力**のために作られており、リポジトリのソースのためのものではありません。プロジェクトを`dist/`のようなディレクトリに向けると、そこにあるものを取り込みます。

## 存在理由 {#why-it-exists}

| 問題 | dig-storeの答え |
|---|---|
| ホストが公開物を読む・スキャンできてしまう | コンテンツは保存時に暗号化され、ホストはハッシュでキー付けされた暗号文しか保持しない |
| アクセス制御にはパスワードとACLが必要になる | URN*こそが*権限（capability）である — 共有すれば読み取りを許可し、渡さなければ拒否する |
| サーバーが本物のバイト列を返すと信頼しなければならない | `clone`/`pull`は、インストール前にモジュールのstore id、公開者の署名済みroot、そして**オンチェーンのシングルトンroot**を検証する — 失敗時は閉じる |
| 「このペイロードはどれくらい大きいか」がファイルサイズから漏れる | すべてのプロジェクトは1つの`.wasm`であり、内容について何も明かさない均一なサイズにパディングされる |
| サービングロジックがデータとは別の場所に存在する | データとそれを制御するコードが*同じ*モジュールにコンパイルされる |

## このドキュメントの読み方 {#how-to-read-these-docs}

- **[dig-storeフォーマット](./format/overview.md)** — 概念編：プロジェクト、デプロイ、`.wasm`モジュール、URN、暗号化、証明。dig-storeが*何であるか*を理解したいなら、まずここから。
- **[CLIチュートリアル](./cli/install.md)** — CLIをインストールして実際のプロジェクトで使う：プロジェクトの初期化、ビルドディレクトリの取り込み、デプロイのコミット、リモート経由の共有、コンテンツのストリーミング読み出しまで。

とにかく試してみたいなら、**[クイックスタート](../quickstart.md)**（無料でWeb優先の手順）または**[CLIチュートリアル](./cli/quickstart.md)**に直接進んでください。

:::note
dig-storeは[DIG Network](https://dig.net)の一部です。技術設計の全体像は[プロトコルセクション](../protocol-deep-dive.md)（コンテンツアドレス指定型WASM storeフォーマット）にあります。
:::

## 関連項目 {#related}

- [dig-storeフォーマット](./format/overview.md) — プロジェクト、WASMモジュール、URN、暗号化、証明
- [storeの構造](./format/store-structure.md) — storeのアイデンティティ、generation、コンパイル済みモジュール
- [URNと暗号化](./format/urns-and-encryption.md) — アドレス指定*と*復号の両方を行うURN
- [CLIチュートリアル](./cli/quickstart.md) — 数分でstoreを作成・コミット・読み取る
- [概念と用語集](../concepts.md) — DIGの中核となるエンティティの全体像
