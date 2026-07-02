---
sidebar_position: 2
title: NFT開発者向け
description: "アートが改ざん検知可能なDIG capsuleに永続的に存在するCHIP-0007コレクション全体をmintする — 1つのアトミックな署名済みバンドル、実在するロイヤリティ、そしてオンチェーンでまだ証明できないことを決して偽らない誠実なドロップの仕組み。"
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# NFT開発者向け {#for-nft-developers}

> **アートが改ざん検知可能なDIG capsuleに永続的に存在するCHIP-0007コレクション全体をmintしましょう** — 1つのアトミックな署名済みバンドル、実在するロイヤリティ、そして（reveal／allowlist／フェーズといった）オンチェーンでまだ証明できないことを決して偽らない誠実なドロップの仕組みです。

## メンタルモデル {#the-mental-model}

まずアートを**[DIG capsule](../concepts.md#capsule)**に入れ、その後`data_uris` / `metadata_uris`がそのcapsuleを指すNFTをmintします。オンチェーンのハッシュが実際のバイト列を固定するため、アートはコンテンツアドレス指定され、検証可能で、永続的であり、朽ちたり差し替えられたりするリンクではありません。

支出は**決して自前で組み立てません**。正規のCHIP-0035 wasmビルダー（[`@dignetwork/dig-sdk/spend`](../sdk.md)経由）がすべてのコイン支出を構築し、あなたのウォレットが一度だけ署名し、一度だけブロードキャストします。

**storeのmintは**$DIGの費用が**かかりません** — capsuleが作成されるとき（アートがcapsuleに書き込まれるとき）にのみ、**均一なcapsule価格**を支払います。

## mintページを足場作りする — `nft-drop`テンプレート {#scaffold-a-mint-page--the-nft-drop-template}

1つのコマンドで、ウォレット対応済みのドロップページから始めましょう。

```sh
digstore new nft-drop
# or
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [アプリを足場作りする](../build-a-dapp/scaffold.md)

## CLIからmintする {#mint-from-the-cli}

アセットCLIは`digstore-chain`ビルダー経由で支出を構築し、あなたのウォレットシードで署名し、プッシュします — すべて`--dry-run` / `--json`でCI安全です。

```sh
digstore did create                          # an issuer DID for attribution
digstore collection create --name "My Drop"  # a CHIP-0007 collection
digstore nft mint --data ./art.png --metadata ./meta.json --dry-run
digstore offer make ...                       # XCH / CAT trades
```

`nft mint`の**capsule-media**経路は、アートとCHIP-0007メタデータをcapsuleに書き込み、実際のバイト列からデータ／メタデータのハッシュを計算し、URIをそのcapsuleの`chia://`アドレスに設定します（httpsゲートウェイのフォールバック付き）。→ [コマンドリファレンス](../digstore/cli/command-reference.md)

## Webからmintする — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

ブラウザでcapsuleに支えられたコレクションをmintしましょう：アートをアップロードし（capsuleに書き込まれます）、ロイヤリティを設定し、帰属のためのDIDを紐付けます — ウォレットは最後に署名します。→ [DIGHUb ↗](https://hub.dig.net)

## ドロップ — reveal、allowlist、フェーズ {#drops--reveal-allowlist-phases}

ドロップの仕組みは**誠実に**提示されます。今日オンチェーンで強制されるものと、claim-coinのプリミティブが実現するまでのオフチェーンの利便性にすぎないものが区別されます。オンチェーンでまだ証明できない保証を提示することはありません。

→ エンドツーエンドのmintの流れについては[Chiaでdappを構築する](../build-a-dapp/tutorial.md)を参照してください。

## SDKで支出を構築する — 決して自前で組み立てない {#build-spends-with-the-sdk--never-hand-roll}

すべてのコイン支出は正規のCHIP-0035 wasmによって構築され、`@dignetwork/dig-sdk/spend`で再エクスポートされます。フローは常に**構築 → 署名 → ブロードキャスト**であり、ウォレットが署名のみを行うように分離されています。

→ [支出の構築](../spends.md) · [DIG SDK](../sdk.md)

## 収益化とゲート — Paywall {#monetize--gate--the-paywall}

SDKの`Paywall`は、プロバイダーと支出ビルダーを組み合わせて、支出を手作業で配線することなく**支払い解除**と**NFT／コレクション所有によるゲート制御**を実現します。

→ [DIG SDK → Paywall](../sdk.md#paywall)

## Offer — 作成／受諾／表示 {#offers--make--take--show}

`digstore offer make | take | show`（それぞれ`--dry-run` / `--json`対応）でNFTをXCHやCATと交換できます。→ [コマンドリファレンス](../digstore/cli/command-reference.md)

---

## さらに深く：プロトコル {#go-deeper-the-protocol}

- **「改ざん検知可能なcapsule」** → [証明とセキュリティ](../digstore/format/proofs-and-security.md) · [capsuleとstoreのモデル](../digstore/format/store-structure.md)
- **「決して支出を自前で組み立てない」** → [CHIP-0035 store-coinの支出と委任](../chip-0035-spends-and-delegation.md)
- **すべて** → [プロトコル詳解](../protocol-deep-dive.md) · [概念と用語集](../concepts.md)
