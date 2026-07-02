---
sidebar_position: 1
title: アプリ開発者向け
description: "本当に自分が所有するWebサイトやアプリを出荷する — レンタルではなく、オンチェーンで自分の資産としてmintされます。ビルドとプレビューは無料で、公開するときにのみ小さな均一の$DIG価格を支払います。ファイルはブラウザ内で暗号化されるため、どのホストも読み取れません。"
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - digstore
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# アプリ開発者向け {#for-app-developers}

> **本当にあなたが所有するWebサイトやアプリを出荷しましょう** — オンチェーンで自分の資産としてmintされ、レンタルではありません。ビルドとプレビューは**無料**です。公開するときにのみ小さな**均一の$DIG価格**を支払い、ファイルは**ブラウザ内で暗号化される**ため、どのホストも読み取れません。

## メンタルモデル {#the-mental-model}

**[store](../concepts.md#store)**は、あなたのWebサイトの永続的なアイデンティティであり、あなたが管理するオンチェーンのシングルトンです。公開するたびに、`storeId:rootHash`という1つの不変な**[capsule](../concepts.md#capsule)**をmintします。storeは、これまでに公開してきたcapsuleの並びにすぎません。

2つの入口が、**同じ**「無料でビルド → 有料で公開」というループに通じています。

- **Webの経路** — [hub.dig.net](https://hub.dig.net)にある[DIGHUb](../concepts.md#dighub)：ビルド済みフォルダをドロップし、無料でプレビューし、公開時にのみウォレットを接続します。
- **CLI／CIの経路** — [`digstore`](../concepts.md#digstore-cli) CLI + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHubデプロイAction](../concepts.md#deploy-action)。

足場作り、ビルド、プレビューは**無料**です。費用がかかるのは公開するときだけです。

| あなたが行うこと | 費用 |
|---|---|
| 足場作り、ビルド、ドラフトのプレビュー | **無料** |
| 最初のcapsuleを公開する（storeをmintする） | **$DIGでの均一なcapsule価格** + わずかなXCH手数料 |
| 各更新を公開する（新しいcapsule） | **$DIGでの均一なcapsule価格** + わずかなXCH手数料 |

## まずはここから {#start-here}

- **[クイックスタート — 10分でサイトを出荷する](../quickstart.md)** — WebでもCLIでも、最速の経路。

## Webから公開する — DIGHUb {#publish-from-the-web--dighub}

[**DIGHUbで新しいstoreを開始する ↗**](https://hub.dig.net/new)。ビルド済みのサイト（`dist/`や`build/`フォルダ）をドロップし、実際の読み取りパスで**無料のドラフトプレビュー**を取得し、**公開**ステップでのみウォレットを接続します。Webの手順は[クイックスタート → Webから公開する](../quickstart.md#a-publish-from-the-web)を参照してください。

## CLIから公開する — digstore {#publish-from-the-cli--digstore}

Git形式のループです：`new` → `dev` → `init` → `commit`。

```sh
digstore new vite-react   # scaffold a runnable project — free, no mint
digstore dev              # preview on the real chia:// read path, live-reload — free
digstore init site --dir dist   # mint the store's first capsule (uniform price + XCH fee)
digstore commit -m "v1.1"       # publish an update — a new capsule
```

→ [CLIクイックスタート](../digstore/cli/quickstart.md) · [プロジェクトワークフローの全体像](../digstore/cli/project-workflow.md)

## アプリを足場作りする — 5つのテンプレート {#scaffold-an-app--5-templates}

`digstore new <template>`または`npm create dig-app`を通じて、実行可能でウォレット対応済みのスターター — `static`、`vite-react`、`next-static`、`nft-drop`、`dapp-window-chia` — から始めましょう。

→ [アプリを足場作りする](../build-a-dapp/scaffold.md)

## `digstore dev`で無料プレビュー {#preview-free-with-digstore-dev}

`digstore dev`は、あなたのプロジェクトを**本物の**DIG読み取りパス（暗号化 → コンパイル → 検証 → 復号）でライブリロード付きに配信し、開発用の`window.chia`を注入します。あなたが見るものが訪問者の得るものであり、mintも支出も一切発生しません。

→ [CLIクイックスタート → 開発とプレビュー](../digstore/cli/quickstart.md)

## `dig.toml` — コミット可能なマニフェスト {#digtoml--the-committable-manifest}

プロジェクトルートの`dig.toml`は、`store-id`、`output-dir`、`build-command`、`remote`、その他の設定を保持し、`digstore dev`、`digstore deploy`、足場作りテンプレートで共有されます。これには**秘密情報が一切含まれない**ため（それらは環境から取得されます）、コミットして構いません。

→ [プロジェクト設定とビルド時の値](../digstore/cli/configuration.md)

## 更新とバージョン — 各公開は新しいcapsule {#updates--versions--each-publish-is-a-new-capsule}

公開のたびに、現在のビルドは新しい**不変なcapsule**に封印され、あなたのstoreのオンチェーンrootが進みます。古いcapsuleは読み取り可能なままであり、読み手が特定の`rootHash`を指定しない限り、storeは常に最新のものに解決されます。

→ [オンチェーンアンカリング](../digstore/cli/onchain-anchoring.md)

## 費用について {#what-it-costs}

ビルドとプレビューは無料です。公開されたcapsuleごとに**$DIGでの均一な価格**と、わずかなXCHネットワーク手数料がかかり、同じオンチェーン支出に**アトミックに**含まれます。価格はcapsuleごとに均一であるよう設計されています（capsuleの長さがコンテンツについて何も漏らさないようにするためです）。$DIGはTibetSwap、dexie.space、9mm.proで入手できます。

→ [DIGの入手方法](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [なぜすべてのcapsuleは同じ価格なのですか？](../support/faq.md#why-uniform-price)

## GitHub Actionsからのpush-to-deploy {#push-to-deploy-from-github-actions}

`dig-network/deploy-action`を設定して、プッシュのたびに新しいcapsuleを公開しましょう。`if-changed`ガードにより、バイト単位で同一のビルドは何もしません（支出が発生しません）。

→ [GitHub Actionsからデプロイする](../digstore/cli/deploy-from-github-actions.md)

## `*.on.dig.net`のWebアドレスを追加する（任意） {#add-a-ondignet-web-address-optional}

あなたのstoreは、確定した瞬間に、その[URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md)アドレスによって到達可能になります — 追加費用はかかりません。人に優しい`<name>.on.dig.net`ハンドルは、その上にある**任意の、有料の**DIGHUbでの登録です。

→ [自分のドメインは使えますか？](../support/faq.md#can-i-use-my-own-domain)

---

## さらに深く：プロトコル {#go-deeper-the-protocol}

上記の平易な言葉によるモデルだけで出荷には十分です。全体の設計を知りたいときは、

- **「storeはcapsuleの並びである」** → [概念と用語集](../concepts.md#capsule) · [capsuleとstoreのモデル](../digstore/format/store-structure.md)
- **「ブラウザ内で暗号化されるファイル」** → [URNと暗号化](../digstore/format/urns-and-encryption.md)
- **「均一な価格とアトミックな$DIG支出」** → [オンチェーンアンカリング](../digstore/cli/onchain-anchoring.md#costs) · [CHIP-0035 store-coinの支出](../chip-0035-spends-and-delegation.md)
- **すべて** → [プロトコル詳解](../protocol-deep-dive.md)
