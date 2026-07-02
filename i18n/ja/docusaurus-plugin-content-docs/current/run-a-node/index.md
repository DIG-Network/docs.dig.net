---
sidebar_position: 1
title: DIGノードを運用する
description: "dig-nodeとは何か、なぜそれを運用するのか、そしてその方法 — Ubuntu/Debian向けのaptリポジトリか、クロスプラットフォームの汎用インストーラーで。"
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

# DIGノードを運用する {#run-a-dig-node}

> **証明可能かつプロバイダー非公開でコンテンツを配信しましょう** — あなたが触れるのは見分けのつかない、ハッシュでキー付けされた暗号文だけであり、実行証明によって誠実な配信を証明でき、クライアントがすべてをチェーンに照らして検証するため、信頼があなたのノードに依存することは決してありません。

**dig-node**は、DIG Networkのコンテンツ**サーバー**であり、ネットワークの供給側です。capsuleをホストし、ローカルの`.dig`キャッシュを保持し、[dig RPC](../rpc/what-is-the-dig-rpc.md)を公開するため、DIGコンテンツを読むものは何でもあなたから読み取れます。これはヘッドレス（ブラウザなし、UIなし）のバックグラウンドサービスとして動作します — あなたが公開したい、あるいは配信を手伝いたいコンテンツのためのシードボックスです。

これは**消費者**、すなわち[DIG Browser](../browser/chia-protocol.md)とブラウザ拡張機能の対になる存在です。消費者側は暗号文と証明を取得し、オンチェーンのrootに照らして検証し、ローカルで復号してレンダリングします。DIGコンテンツを読むためにdig-nodeは**必要ありません**。消費者単体でも問題なく機能し、`rpc.dig.net`にある公開リファレンスノードにフォールバックします。dig-nodeを運用するのは**配信するため**です。同じマシン上に1つ存在する場合、消費者はそこから読み取り（ローカルで、オフラインに強く、ネットワークに貢献しながら）、両者は1つの`.dig`キャッシュを共有します。

:::info 配信 vs 消費
- **dig-node** = コンテンツを配信し、dig RPCを公開する。ヘッドレスなバックグラウンドサービス。
- **DIG Browser／拡張機能** = コンテンツを消費する（ローカルで検証・復号する）。ローカルノードは不要。

両方がインストールされている場合、ブラウザ／拡張機能はあなたのローカルなdig-nodeから読み取ります。そうでない場合は`rpc.dig.net`から読み取ります。いずれの場合も、すべてのバイト列はクライアント側でチェーンに照らして検証されます — 配信元が信頼されることは決してありません。
:::

## インストールする {#install-it}

| あなたのマシン | 使うもの |
|---|---|
| **Ubuntu / Debian** | ネイティブの**[aptリポジトリ](./apt.md)** — `apt install dig-node digstore`、systemdサービスとして自動有効化されます。 |
| **Windows / macOS / Linux（任意）** | クロスプラットフォームの**[汎用インストーラー](#universal-installer-any-os)** — あらゆるOS向けに1つの`curl \| sh`（またはダウンロード）。 |

どちらも同じ`dig-node`サービスと`digstore` CLIをインストールします。aptはDebianネイティブの経路です（署名済みで`apt upgrade`可能）。汎用インストーラーはそれ以外のすべてをカバーします。

### apt（Ubuntu / Debian） — Debian系システムでの推奨 {#apt-ubuntu--debian--recommended-on-debian-family-systems}

ネイティブの経路：`apt.dig.net`にある署名済みaptリポジトリです。`dig-node`を管理された**systemdサービス**としてインストールし、`apt upgrade`で更新し続けます。

→ **[apt経由でUbuntu/Debianにインストールする](./apt.md)**

### 汎用インストーラー（任意のOS） {#universal-installer-any-os}

クロスプラットフォームの経路 — Windows、macOS、あらゆるLinuxに対応します。あなたのOSを検出し、`dig-node`サービス（Windowsサービス／`systemd`／`launchd`）と`digstore` CLIをインストールし、パッケージマネージャーは不要です。

```sh
curl -fsSL https://dig.net/install.sh | sh
```

これは[Releasesページ](https://github.com/DIG-Network/dig-installer/releases)で配布されているものと同じ自己完結型の`dig-installer`です。シェルにパイプしたくない場合や、Windowsの場合は、直接ダウンロードして実行してください。

:::note プレリリース
ホスト型インストーラー（`apt.dig.net`、`dig.net/install.sh`）はまだ準備中です。それらが公開されるまでは、ソースからビルドするか、[dig-nodeのReleases](https://github.com/DIG-Network/dig-node/releases)からバイナリを入手してください。ここに記載されているコマンドは、実際に意図されているものです。
:::

## コンテンツを読みたいだけですか？ {#just-want-to-read-content}

ノードは不要です。**[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)**を入手して、任意の`chia://`アドレスを開いてください — ローカルにdig-nodeがあればそこから、なければ`rpc.dig.net`から消費します。[`chia://`プロトコル](../browser/chia-protocol.md)を参照してください。

## 関連項目 {#related}

- [apt経由でUbuntu/Debianにインストールする](./apt.md) — Debianネイティブの経路 + systemdサービス管理
- [どこにでもインストールする — 汎用インストーラー](./universal-installer.md) — Windows／macOS／あらゆるLinux + `dig.local`
- [消費者を自分のノードに向ける](./point-a-consumer.md) — ローカル優先の読み取り + 共有`.dig`キャッシュ
- [dig-nodeを設定する](./configure.md) — ポート、リスナー、キャッシュ上限、アップストリーム
- [リモートオリジンをセルフホストする](../rpc/dig-remote.md) — `digstore serve` + dig://のclone/pull/push
- [ノードを管理する](./manage.md) — control.*管理RPCとMy Node UI
- [公開ネットワークRPCを使う](../rpc/public-network-rpc.md) — あなたのノードが話すdig RPCと、ネットワーク上でのノード運用
- [CLIのインストール](../digstore/cli/install.md) — `digstore`単体（配信ではなく公開のため）

## さらに深く：プロトコル {#go-deeper-the-protocol}

- **「盲目なホストとデコイ」** → [dig RPCの盲目配信モデル](../rpc/what-is-the-dig-rpc.md) · [ノードの準拠性](../rpc/conformance.md)
- **「誠実な配信を証明する」** → [包含証明と実行証明](../inclusion-vs-execution-proofs.md)
- **「dig://のclone/pull/push」** → [§21/§22リモートプロトコル](../rpc/dig-remote.md)
- **すべて** → [プロトコル詳解](../protocol-deep-dive.md) · [概念と用語集](../concepts.md)
