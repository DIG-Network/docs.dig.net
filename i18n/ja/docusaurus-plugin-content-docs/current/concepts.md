---
sidebar_position: 1.5
title: 概念と用語集
description: "capsule、store、generation、URN、取得キー、dig RPC、chia://プロトコル、オンチェーンアンカリングなど、DIG Networkの中核となるエンティティの1ページ索引 — それぞれ一度だけ定義し、詳細ドキュメントへリンクします。"
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

# 概念と用語集 {#concepts--glossary}

このページは、DIG Networkの中核となるすべてのエンティティを**一度だけ**平易な言葉で定義し、それぞれを深く掘り下げたドキュメントへリンクします。これはドキュメントの人間可読な背骨であり、また各用語が機械可読な構造化データとしても出力されているため、エージェントがネットワークの語彙を学ぶためにスクレイピングできる地図でもあります。まずざっと目を通し、深く知りたい項目のリンクをたどってください。

## capsule {#capsule}

**capsule**とは、1つの不変なstore世代（generation）のことで、`(storeId, rootHash)`のペアであり、正規表記では`storeId:rootHash`と書かれます。これはネットワークの原子単位であり、コンパイル（1つの固定サイズWASMモジュール）、[価格設定](./digstore/cli/onchain-anchoring.md)（mintまたはcommitに対する$DIGでの均一なcapsuleごとの価格）、取得（[URN](#urn)は1つのcapsuleを指します）、キャッシュ、来歴のそれぞれの単位です。[store](#store)は*capsuleの並び*であり、コミットごとに1つです。この定義はdig-store、dig RPC、DIG Browserの間で同一です。→ [capsuleの詳細](./intro.md#the-capsule)

## store {#store}

**store**とは、アイデンティティとそのコンテンツおよび履歴のことで、[capsule](#capsule)の並び、コミットごとに1つです。そのアイデンティティは64桁の16進数の**store id**であり、これはオンチェーンのChiaシングルトンのランチャーIDそのものです — チェーン上のシングルトンがstoreの現在のrootに対する権威です。storeはDIGにおけるWebサイトの等価物です。→ [storeの構造](./digstore/format/store-structure.md)

## generation {#generation}

**generation**とは、[store](#store)の単一のコミット済み状態のことで、**root hash**（generationのリソースごとの葉に対するMerkle root）によって識別されます。各`commit`は現在のコンテンツを新しい追記専用のgenerationに封印します — これは[capsule](#capsule)が指すものと同じです。generationはGitの履歴のように単調に増加します。→ [Generationとroot hash](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

**URN**は、dig-storeのアドレスと鍵を1つの文字列にまとめたものです。
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`という形式です。これはリソースの**場所を示す**と同時に、**それを復号する鍵を導出**します — URNを保持していることが、公開されたリソースを読むための必要十分条件です。ブラウザ向けの短縮形は[`chia://`プロトコル](#chia-protocol)です。→ [URNと暗号化](./digstore/format/urns-and-encryption.md)

## retrieval key（取得キー） {#retrieval-key}

**retrieval key（取得キー）**は`SHA-256(canonical_urn)`であり、クライアントから外に出る唯一のアドレスです。これは[URN](#urn)やそのパスを明かすことなく、リソースの暗号文の場所を特定します。これは*rootに依存しない*ため、同じキーが複数の[generation](#generation)にまたがってリソースを見つけ出し、配信されたバイト列はその後正しいrootに対して[Merkle検証](#merkle-proof)されます。別の**復号キー**は同じURNからローカルで（HKDFにより）導出され、決して送信されません。→ [1つの文字列に含まれる2つの値](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof（Merkle証明） {#merkle-proof}

各[generation](#generation)は、リソースごとに1つの葉を持つMerkleツリーを構築し、実際に配信された*暗号文*バイトそのものにコミットします。配信されるリソースには単一の**包含証明（inclusion proof）**が添付され、そのバイト列が正確にそのrootに属することを証明します — これにより、コンテンツは一切復号されることなく検証され、ノードが本物のバイト列を返したと信頼される必要は一切ありません。→ [Merkle証明](./digstore/format/proofs-and-security.md)

## オンチェーンアンカリング {#anchoring}

すべてのstoreは**Chiaメインネット上のシングルトン**です。`digs init`はそれをmintし（ランチャーIDが*そのまま*store idになります）、`digs commit`のたびに新しい[generation](#generation)のrootがCHIP-0035シングルトン更新としてオンチェーンに固定されます。どちらも確定するまでブロックし、実際の資金を消費します。チェーンはstoreの最新rootに対する権威です。→ [オンチェーンアンカリング](./digstore/cli/onchain-anchoring.md)

## DIG決済 {#dig-payment}

**$DIG**はDIG Networkのトークン（Chia CAT）です。[capsule](#capsule)をmint（`init`）またはcommitするには、**$DIGでの均一なcapsuleごとの価格**がかかり、これはアンカーと**同じオンチェーン支出にアトミックに含まれます** — 別のトランザクションは存在せず、メモにはstore idが記録されます。→ [費用](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store`は、storeを作成・コミット・共有・読み取るコマンドラインツールであり、暗号化されたオンチェーンのstoreフォーマットに対するGit形式のワークフロー（`init`、`add`、`commit`、`log`、`clone`、`push`、`pull`）を提供します。→ [コマンドリファレンス](./digstore/cli/command-reference.md) · [CLIチュートリアル](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml`は、プロジェクトのルートにある**コミット可能なプロジェクトマニフェスト**であり、`store-id`、`output-dir`、`build-command`、その他のプロジェクト設定を保持し、`digs dev`、`digs deploy`、および足場作りテンプレートで共有されます。これには**秘密情報が一切含まれません**（それらは環境から取得されます）ので、安全にコミットできます。→ [プロジェクト設定とビルド時の値](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app`（`npm create dig-app`）は、DIGプロジェクトを開始するための**JSの入口**であり、実行可能なスターター — アプリ、[`dig.toml`](#dig-toml)、そして（ウォレットテンプレートについては）[DIG SDK](#dig-sdk)が組み込まれたもの — を5つのテンプレート（`static`、`vite-react`、`next-static`、`nft-drop`、`dapp-window-chia`）のいずれかから足場作りします。足場作りは**無料**です — mintもチェーンも支出もありません。[capsule](#capsule)を公開するときにのみ均一なcapsule価格を支払います。これはRust CLIの`digs new`に対するnpm側の相棒です。→ [アプリを足場作りする](./build-a-dapp/scaffold.md)

## GitHubデプロイAction {#deploy-action}

`dig-network/deploy-action`は、**git-push-to-deploy**を実現するGitHub Actionであり、ランナー上に[`dig-store` CLI](#digstore-cli)をインストールし、`digs deploy`を実行してあなたのstoreを進め（決してmintはしません）、公開された[capsule](#capsule)、URL、費用をステップ出力、PRコメント、GitHub Deployment、コミットステータスとして報告します。`if-changed`（デフォルト）を使えば、バイト単位で同一のビルドは何もしません — 支出も発生しません。→ [GitHub Actionsからデプロイする](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK**（`@dignetwork/dig-sdk`）は、統合開発者向けの型付きnpmパッケージであり、`ChiaProvider`（注入された[`window.chia`](#window-chia)を優先し、WalletConnect → Sageにフォールバック）、`DigClient`（[dig RPC](#dig-rpc)経由で検証済みの暗号化コンテンツを読み取る）、`Paywall`（プロバイダーと支出ビルダーを組み合わせた高レベルの支払い解除／NFTゲート型アクセスヘルパー）、そして`/spend`サブパスで再エクスポートされる正規のCHIP-0035支出ビルダーで構成されます。
→ [Chiaでdappを構築する](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC**は、ネットワーク全体にわたる読み取りインターフェースであり、すべてのホスティングノードが同一に対応するHTTPS `POST`上のJSON-RPC 2.0サービスです。これは[取得キー](#merkle-proof)による暗号文と[包含証明](#retrieval-key)、`(storeId, root)`による[capsule](#capsule)全体、そして発見用メタデータを配信します — 構造上盲目であり、検証と復号はクライアント側で行われます。**これは普遍的な読み取りパスです** — 公開されたすべてのcapsuleは、オンチェーンで確定した瞬間に、その[URN](#urn) / [`chia://`](#chia-protocol)アドレスによってここで読み取り可能になります — 登録も、capsuleの公開以上の支払いも不要です。任意の、人に優しい[`*.on.dig.net`ハンドル](#on-dig-net)は、この*上に*ある入口にすぎません。dig RPC自体は常に利用可能です。→ [dig RPCとは？](./rpc/what-is-the-dig-rpc.md)

## chia://プロトコル {#chia-protocol}

`chia://`はDIG Browserのネイティブなコンテンツアドレス方式であり、[`urn:dig:` URN](#urn)を入力しやすくしたフロントエンドです。`chia://<storeId>/`のリンクを貼り付けると、ブラウザはネットワークから直接コンテンツを取得し、コンテンツアドレス指定と暗号学的検証を行います。→ [chia://プロトコル](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia`は、**DIG Browser**があらゆるページに注入するChiaウォレットプロバイダーです。これは[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md)に対応しているため、WebアプリはWalletConnectの設定なしにユーザーのアドレス、署名、支出をリクエストできます — すでにCHIP-0002に対応しているアプリのドロップイン代替となります。→ [window.chiaを使う](./browser/using-window-chia.md)
· [window.chiaプロバイダー仕様](./protocol/window-chia-provider.md)（規範的、バージョン管理済み）

## DIGHUb {#dighub}

**DIGHUb**（[hub.dig.net](https://hub.dig.net)）は、CLIなしで[capsule](#capsule)を公開・管理するためのWebアプリです — capsuleを作成し、フロントエンドをデプロイし、ブラウザ内で自分のstoreを閲覧できます。また、高価なZK実行証明ジョブの予算を管理するゲート付き制御プレーンでもあります。

## dig-node {#dig-node}

**dig-node**は、ネットワークのコンテンツ**サーバー**であり、供給側です。[capsule](#capsule)をホストし、ローカルの`.dig`キャッシュを保持し、`rpc.dig.net`と同一に[dig RPC](#dig-rpc)を話します。DIGコンテンツを読むために1つ**必要という**わけではありません（消費者は`rpc.dig.net`にフォールバックします）。1つ運用することで、読み取りがローカル優先になり、配信キャパシティに貢献できます。ホストは**盲目**です — 暗号文と証明を中継するだけです。
→ [ノードを運用する](./run-a-node/index.md)

## on.dig.netハンドル {#on-dig-net}

**on.dig.netハンドル**とは、[store](#store)向けの*任意の、有料の*人に優しいWebアドレスのことです：`<your-name>.on.dig.net`。storeは自動的にこれを取得する**わけではありません** — ハンドルを登録すると（[DIGHUb](#dighub)での有料のCHIP-54 / `on.dig.net`登録）、その登録がstoreをその名前に固定します。登録がなければ`*.on.dig.net`アドレスは存在しません。これは純粋に利便性のための入口です。ハンドルの有無にかかわらず、storeはすでに[dig RPC](#dig-rpc)経由でその[URN](#urn) / [`chia://`](#chia-protocol)アドレスによって読み取り可能です。（アカウントハンドルとstoreのスラッグは別々の名前空間であり、自動的にサブドメインを公開するものではありません。）→ [`*.on.dig.net`アドレスは取得できますか？](./support/faq.md#can-i-use-my-own-domain)

## 関連項目 {#related}

- [DIG Network概要](./intro.md) — プリミティブの全体像
- [クイックスタート](./quickstart.md) — 無料でビルド・プレビューし、最後にcapsuleを公開する
- [Chiaでdappを構築する](./build-a-dapp/tutorial.md) — すべてのプリミティブを1つの出荷済みdappに組み込む
- [dig-storeとは？](./digstore/what-is-digstore.md) — ワンファイルのstoreフォーマット
- [dig RPCとは？](./rpc/what-is-the-dig-rpc.md) — ネットワークの読み取りパス
- [chia://プロトコル](./browser/chia-protocol.md) — ブラウザでのコンテンツのアドレス指定
- [ヘルプを得る](./support/get-help.md) — コミュニティチャンネルと報告方法

## エージェントとLLM向け {#for-agents--llms}

このドキュメントは機械抽出可能です。各ページはschema.orgのJSON-LD（このページは`DefinedTerm`セットとして）を含み、サイトのルートには2つの厳選されたマップがあります。

- [`/llms.txt`](pathname:///llms.txt) — リンクの豊富なドキュメントのMarkdownマップ（[llms.txt規約](https://llmstxt.org/)）。
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — エンティティ（概念とドキュメント）と型付きエッジ（`defines`、`part-of`、`requires`、`see-also`）。
