---
sidebar_position: 5
title: コンテンツ消費者向け
description: "自分のブラウザがブロックチェーンに照らして検証するchia://コンテンツを開く — どのホストもそれを改ざんしたり偽造したりできず、非公開のコンテンツはホストからも非公開のままで、永続的かつどこにでも再ホスト可能なので、誰もそれを停止させたり閉じ込めたりできません。"
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# コンテンツ消費者向け {#for-content-consumers}

> **自分自身のブラウザがブロックチェーンに照らして検証する`chia://`コンテンツを開きましょう** — どのホストもそれを改ざんしたり偽造したりできず、非公開のコンテンツはホストからも非公開のままで、永続的かつどこにでも再ホスト可能なので、誰もそれを停止させたり閉じ込めたりできません。

## メンタルモデル {#the-mental-model}

`chia://`リンクを貼り付けると、コンテンツはネットワークから直接届き、レンダリングされる前に**コンテンツアドレス指定**され、**あなたのデバイス上で暗号学的に検証**されます。これは**フェイルクローズ**です。改ざんされた、あるいは復号できないバイト列は決して表示されません。

- **`rootHash`を省略する**と、storeの*最新*バージョンになります：`chia://<storeId>/`。
- **含める**と、1つの正確な不変[capsule](../concepts.md#capsule)に固定されます：`chia://<storeId>:<rootHash>/`。

公開コンテンツはリンクだけで十分です。非公開コンテンツにはパスワードのような秘密の**`?salt=`**も必要です。

## DIG Browser、または拡張機能を入手する {#get-the-dig-browser-or-the-extension}

- **[DIG Browserを入手する ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — `chia://`と内蔵ウォレットを備えたブラウザです。
- **拡張機能**（Chrome / Edge / Brave / Firefox向け） — すでに使っているブラウザに`chia://`の解決機能を追加します。

## `chia://`コンテンツを開く — 最新版と固定版 {#open-chia-content--latest-vs-pinned}

アドレスの形式、すっきりした`chia://<store>/`バー、そして`rootHash`を固定すべきタイミング。

→ [chia://プロトコル](../browser/chia-protocol.md)

## 組み込みページ、検証バッジ、シールド {#built-in-pages-the-verified-badge--shields}

`chia://home`、`chia://wallet`、`chia://settings`、そして現在有効なcapsuleの包含証明の判定結果を示す検証バッジ／シールド。

→ [window.chiaを使う](../browser/using-window-chia.md)

## 公開 vs 非公開 — `?salt=`の秘密が必要なとき {#public-vs-private--when-you-need-a-salt-secret}

公開storeはリンクだけで開けます。非公開storeは復号キーを導出するための秘密のsaltが必要です。

→ [公開storeと非公開store](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [公開と非公開の違いは？](../support/faq.md#public-vs-private)

## コンテンツをローカルで実行する（任意） {#run-content-locally-optional}

より高速でオフラインに強い読み取りのために、ブラウザ／拡張機能をローカルの[dig-node](../concepts.md#dig-node)に向けましょう — これらは1つの`.dig`キャッシュを共有します。コンテンツを読むためにノードが*必要*になることはありません。

→ [ノードを運用する](../run-a-node/index.md)

## $DIGを入手する {#get-dig}

コンテンツを*読む*ために$DIGは必要ありません。公開したい場合は、**TibetSwap**、**dexie.space**、**9mm.pro**で$DIGを入手してください。

→ [DIGはどこで入手できますか？](../support/faq.md#where-do-i-get-dig)

---

## さらに深く：プロトコル {#go-deeper-the-protocol}

- **「ブロックチェーンに照らして検証される」** → [オンチェーンアンカリング](../digstore/cli/onchain-anchoring.md) · [証明とセキュリティ](../digstore/format/proofs-and-security.md)
- **「公開と非公開のsalt」** → [URNと暗号化](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **「最新版と固定版」** → [Generationとroot hash](../digstore/format/store-structure.md#generations-and-root-hashes)
- **すべて** → [プロトコル詳解](../protocol-deep-dive.md) · [概念と用語集](../concepts.md)
