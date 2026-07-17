---
sidebar_position: 1
title: "プロトコル：概要"
description: "DIG Protocolを、規範的かつ実装で定義された7つの層としてボトムアップに解説します。capsule（storeId:rootHash）が基本単位であり、ホストは盲目で、読み手はチェーンに照らして検証します。これは権威あるプロトコルリファレンスです。"
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# プロトコル：概要 {#protocol-overview}

これはDIG Protocolの**規範的な仕様**であり、ボトムアップの**7つの層**として定義されています。各層は、規範的な参照として自身の**正規のクレート／ファイル**を示します。

:::info これは権威あるプロトコルリファレンスです
このセクションは、ネットワークが実際に何を行うかについての信頼できる情報源です。プロトコルが実際にどう動作するかを、正規の実装への`file:line`引用とともに文書化しています。
:::

## 基本単位：capsule {#the-fundamental-unit-the-capsule}

すべての層を貫く一つの概念があります。**[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`、正規表記では`storeId:rootHash`です。**store**は（古い順から新しい順への）capsuleの順序付き並びであり、コミットごとに1つ。そのアイデンティティである`store_id`は、Chia上のCHIP-0035 DataLayerシングルトンのランチャーIDそのものです。アイデンティティ、コンパイル、価格設定、取得、キャッシュ、来歴はすべて**capsuleごとに**定義されます。

## テーゼ：盲目なホスト、クライアント側検証、チェーンに固定されたroot {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **盲目なホスト。** ホストはハッシュでキー付けされた不透明な暗号文しか保持しません。URNも鍵も保持せず、capsule自身の出力をそのまま中継するだけで、ヒットとミスを見分けることもできません。ワイヤー上に`decoy`フィールドは存在せず、CDNも存在しません — コンテンツは[dig RPC](./protocol/dig-rpc.md)経由でのみ配信されます。
- **クライアント側検証。** すべてのバイト列は、読み手のデバイス上で、リソースごとのmerkle包含証明とともにオンチェーンのrootに照らして検証され、その後認証付き復号が行われます。信頼が配信元に依存することは決してありません。
- **チェーンに固定されたroot。** 信頼されるrootは**唯一**、Chia上のCHIP-0035シングルトン（coinset.org経由で解決）から得られ、配信された「latest」から得られることは決してありません。

## 7つの層 {#the-seven-layers}

| # | 層 | 定義する内容 | 正規の参照 |
|---|---|---|---|
| 0 | [アイデンティティと命名](./protocol/identity-and-naming.md) | store、capsule、generation；`store_id` = ランチャーID | `digstore-core::capsule`、`::urn` |
| 0 | [URNとアドレス指定](./protocol/urn-and-addressing.md) | `urn:dig:chia:…`の文法；rootを持たない`retrieval_key` | `digstore-core::urn`、`lib.rs` |
| 1 | [暗号技術](./protocol/cryptography.md) | HKDF KDF；AES-256-GCM-SIVシール | `digstore-core::crypto` |
| 1 | [Merkle包含証明](./protocol/merkle-proofs.md) | D5リソースごとの葉；NODE_TAGによる折りたたみ | `digstore-core::merkle` |
| 1 | [BLS署名とDST](./protocol/bls-signatures.md) | Chia AugScheme；5つの役割別DST | `digstore-crypto::bls` |
| 2 | [Capsuleフォーマット](./protocol/capsule-format.md) | DIGSデータセクション（BINDING D1） | `digstore-core::datasection` |
| 2 | [自己防衛型モジュール](./protocol/self-defending-module.md) | 固定サイズの難読化；配信用ゲスト | `digstore-compiler`、`digstore-guest` |
| 4 | [オンチェーンアンカリング](./protocol/on-chain-anchoring.md) | store = シングルトン；capsule = rootの進行 | `chip35_dl_coin`、`digstore-chain` |
| 4 | [DIG CAT決済と価格設定](./protocol/dig-cat-payment.md) | capsuleごと、動的、USD連動 | `chip35_dl_coin::dig` |
| 6 | [dig RPC](./protocol/dig-rpc.md) | マシンインターフェース（JSON-RPC 2.0） | hub `retrieval`、`dig-node` |
| 5 | [§21トランスポートとプッシュ](./protocol/transport-and-push.md) | `dig://`ロケーター、REST、pushバージョン1 | `digstore-remote` |
| 7 | [DIG Nodeピアネットワーク](./protocol/peer-network.md) | mTLSピアアイデンティティ、NATトラバーサル、STUN、イントロデューサー、リレーワイヤー、ピアRPC | `dig-gossip`、`dig-relay`、`dig-nat`、`dig-node` |
| 6 | [検証と来歴](./protocol/verification-and-provenance.md) | 4つの順序付き完全性ゲート | `digstore-core::merkle`、`dig-node` |
| 6 | [盲目ホストモデル](./protocol/blind-host-model.md) | プロバイダーの非公開性；リゾルバー；`/v1`制御プレーン | hub `retrieval`/`resolver`/`api` |
| — | [準拠性とパリティ](./protocol/conformance-and-parity.md) | 実装間のパリティ規律 | 凍結されたゴールデン、OpenRPC差分 |

（層3と§21トランスポートは読み取りパスと相互に絡み合っており、この表では読み手が出会う位置にまとめています。完全な層番号は各ページに記載されています。）

## capsuleが層をどう流れるか {#how-a-capsule-flows-through-the-layers}

公開者は（L1で）コンテンツを**チャンク化＋暗号化**し、（L2で）**capsuleフォーマット**にし、それが（L3で）**自己配信**し、（L4で）オンチェーンに**固定**され、（L5で）§21トランスポート経由で**プッシュ**されます。どのクライアントも、それをdig RPC経由で**読み取り**、（L6で）完全にクライアント側でチェーンに固定されたrootに照らして**検証**します。すべての暗号定数には、生成者・ホスト・検証者の間で共有される**唯一**の定義があります — [C8パリティ不変条件](./protocol/conformance-and-parity.md)です。

## 用語 {#terminology}

- **`chia://`** — ネットワークの**コンテンツ**アドレス（ブラウザが開くもの）。
- **`dig://`** — §21の**トランスポート**ロケーター（CLI／ピア層）*かつ*DIG Browserの内部ページスキーム — 2つの異なる用途であり、決してコンテンツアドレスではありません。
- **`urn:dig:`** — 両者が派生元とするURN名前空間。
- **store / capsule** — アイデンティティとその不変のgeneration。
- **$DIG** — capsuleごとに支払われるCAT；**dig-store** — storeフォーマット。

## 関連項目 {#related}

- [概念と用語集](./concepts.md) — すべてのエンティティを一度だけ定義
- [アイデンティティと命名](./protocol/identity-and-naming.md) — 層0、仕様が始まる場所
- [dig RPC](./protocol/dig-rpc.md) — プロトコルのマシンインターフェース
- [DIG Nodeピアネットワーク](./protocol/peer-network.md) — ノード同士がどう見つけ合い、到達し合うか（mTLS、NATトラバーサル、リレー）
- [準拠性とパリティ](./protocol/conformance-and-parity.md) — 実装間のパリティ規律
