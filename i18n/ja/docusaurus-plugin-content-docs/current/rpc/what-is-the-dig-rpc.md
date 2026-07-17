---
sidebar_position: 1
title: dig RPCとは？
description: "JSON-RPC 2.0によるdig-store capsule向けのネットワーク全体の読み取りインターフェース。構造上盲目であり、信頼なしに検証可能で、あらゆるサイズでストリーミング可能です。"
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# dig RPCとは？ {#what-is-the-dig-rpc}

:::info 規範的な仕様
これは概要ページです。権威あるマシンインターフェース仕様 — メソッド、チャンクのワイヤーオブジェクト、ノードプロファイル、OpenRPCドキュメント — は[プロトコル・dig RPC](../protocol/dig-rpc.md)にあります。
:::

**dig RPCは、ホストされたdig-storeの`.dig` capsuleから直接コンテンツを読み取るための、ネットワーク全体のインターフェースです。** これはHTTPS `POST`上で話される[JSON-RPC 2.0](https://www.jsonrpc.org/specification)サービスです。

capsuleをホストするすべてのノード — `https://rpc.dig.net`にあるリファレンスノードでも、任意のサードパーティのノードでも — は**同じセマンティクスを持つ同じメソッド**を公開します。このインターフェースに対して書かれたクライアントは、1つのエンドポイントを通じてネットワーク全体から読み取れます。CDNは存在せず、DIG上のすべてのコンテンツ配信はdig RPC経由です。

これは以下の3つを提供します。

| あなたが持っているもの… | あなたが呼び出すもの… | あなたが受け取るもの… |
|---|---|---|
| リソースの**retrieval key（取得キー）**（`sha256(urn)`） | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | リソースの暗号文 + merkle包含証明（およびZK実行証明）、チャンク単位でストリーミング |
| **store id + generation root** | [`dig.getCapsule`](./methods.md#diggetcapsule) | そのgenerationの`.dig` capsule全体、チャンク単位でストリーミング |
| **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | 公開用の発見マニフェスト／storeのメタデータマニフェスト／storeの確定済みgenerationリスト |

## それを定義する3つの性質 {#three-properties-that-define-it}

- **構造上盲目。** ノードはハッシュでキー付けされた不透明な暗号文しか配信しません。URN、復号キー、平文を一切見ることはありません。ミスしたリクエストには決定論的で見分けのつかない**デコイ**ストリームで応答します — 決して`404`は返しません — そのため読み取りパスが存在オラクルになることはありません。すべての復号とすべての証明検証はクライアント側で行われます。
- **信頼なしに検証可能。** すべての本物のバイト列は、オンチェーンのgeneration rootに根ざしたmerkle**包含証明**とともに届きます。クライアントは証明をrootまで折りたたみ、それが自分が信頼するrootと一致した場合にのみ受け入れます。ノードが本物のバイト列を返したと信頼される必要は一切ありません。
- **あらゆるサイズでストリーミング可能。** コンテンツは、明示的な継続指示付きで、境界のある64KiB単位のチャンクで読み取られます。1キロバイトのリソースと100メガバイトのcapsuleは同じループで読み取られ、単一のレスポンスが無制限になることはありません。

## dig-storeとの関係 {#how-it-fits-with-digstore}

dig-storeは**フォーマット**を提供します。すなわち、コンテンツアドレス指定型で暗号化されたstoreであり、単一の自己防衛型`.wasm` capsuleにコンパイルされ、URNによってアドレス指定されます（*URNが鍵そのもの*です）。dig RPCは、そのcapsuleがホストを信頼することなく**ネットワーク上で配信される**方法です。

1. storeをコンパイルし、generationをオンチェーンに固定します（CHIP-0035 DataLayerシングルトン）。その**content root**が信頼の起点です。
2. ノードがcapsuleをホストし、それをdig RPC経由で公開します。
3. 読み手は`retrieval_key = sha256(urn)`を導出し、`dig.getContent`を呼び出し、ストリーミングされた暗号文を再構成し、**オンチェーンのrootに対して包含証明を検証**し、**URNから導出した鍵で復号**します — すべてクライアント側で行われます。

ノードはハッシュしか知り得ず、自分が何を配信したのかを決して知りません。

## 1回の呼び出しでの読み取り {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

クライアントは`complete`になるまで`next_offset`をループし、再構成されたバイト列に対する`inclusion_proof`を`root`に対して検証してから復号します。`"decoy": true`という結果は*見つからなかった*ことを意味します — その時点で処理を止め、そのように報告してください。

## このドキュメントの読み方 {#how-to-read-these-docs}

- **[メソッド](./methods.md)** — 全メソッド一式（`dig.getContent`、`dig.getProof`、`dig.getProofStatus`、`dig.getCapsule`、`dig.getManifest`、`dig.getMetadata`、`dig.listCapsules`、`dig.health`、`dig.methods`）、そのパラメータと結果。
- **[公開ネットワークRPCを使う](./public-network-rpc.md)** — クライアントを`rpc.dig.net`（または任意のノード）に向ける方法、エンドポイント、自分でノードを運用する方法。
- **[ストリーミング](./streaming.md)** — チャンクモデル、再構成、証明検証、リファレンスクライアントのループ。
- **[準拠性](./conformance.md)** — ノードがネットワークの読み取りパスの一員となるために実装しなければならないこと、CORS、エラー、盲目モデルの詳細。

:::note
dig RPCは[DIG Network](https://dig.net)の一部です。完全な規範仕様は[プロトコル・dig RPC](../protocol/dig-rpc.md)セクション（ネットワークのコンテンツインターフェース）にあります。
:::

## 関連項目 {#related}

- [メソッド](./methods.md) — すべてのdig RPCメソッド、そのパラメータと結果
- [ストリーミング](./streaming.md) — チャンクモデル、再構成、証明検証
- [準拠性とセキュリティ](./conformance.md) — 盲目モデルとノードが実装すべきこと
- [URNと暗号化](../digstore/format/urns-and-encryption.md) — すべてのretrieval keyの背後にあるURN
- [概念と用語集](../concepts.md) — dig RPC、capsule、retrieval keyの定義
