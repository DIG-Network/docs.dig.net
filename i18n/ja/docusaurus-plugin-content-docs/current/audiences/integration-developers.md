---
sidebar_position: 3
title: 統合開発者向け
description: "OpenAPI/OpenRPC、体系化されたエラー分類、リアルタイム価格、JWKS、ページごとのJSON、そして型付きの@dignetwork/dig-sdkを備えた、完全に機械可読なプラットフォーム — 人間向けの文章を一行もスクレイピングすることなく、ウォレットと検証済みの読み取りをアプリに組み込めます。"
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# 統合開発者向け {#for-integration-developers}

> **完全に機械可読なプラットフォーム** — OpenAPI/OpenRPC、体系化されたエラー分類、リアルタイム価格、JWKS、ページごとのJSON、そして型付きの`@dignetwork/dig-sdk`を備え、**人間向けの文章を一行もスクレイピングすることなく**、ウォレットと検証済みの読み取りをアプリに組み込めます。

## メンタルモデル — 分離された2つの面 {#the-mental-model--two-surfaces-kept-separate}

1. **RESTの制御プレーン** — `hub.dig.net/v1`、bearer-JWT — store、ドメイン、チーム、NFTの管理用。
2. **ノードに依存しないdig JSON-RPC 2.0の読み取りパス** — `rpc.dig.net` — **検証済みの暗号文**をストリーミングします。

1つの**ウォレット**の面（[CHIP-0002 `window.chia`](../concepts.md#window-chia)）が2つのトランスポート — 注入型（DIG Browser）またはWalletConnect → Sage — にまたがり、SDKの`ChiaProvider`によって統一されています。支出は常に正規のCHIP-0035 wasmによって構築され、ユーザーのウォレットによって署名されます — **決して自前で組み立てません**。常に**安定したエラーコード**で分岐し、文章では分岐しません。

## dappを構築する — エンドツーエンド {#build-a-dapp--end-to-end}

足場作りから、自分のドメインで動くウォレット対応アプリまでの一本の流れです。

→ [Chiaでdappを構築する](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`、そして`/spend`サブパスで再エクスポートされる正規の支出。インストール、サブパス、`capabilities()`について。

→ [DIG SDK](../sdk.md)

## ウォレットを接続する — `window.chia` {#connect-a-wallet--windowchia}

注入されたプロバイダーを検出し、`connect()`を呼び出し（オリジンごとの同意）、CHIP-0002メソッドを使います。

→ [window.chiaを使う](../browser/using-window-chia.md) · 仕様：[window.chiaプロバイダー](../protocol/window-chia-provider.md)

## 検証済みコンテンツを読む — `DigClient` + dig RPCメソッド {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient`は暗号文と包含証明をストリーミングし、クライアント側で**検証してから復号**します。必要に応じてメソッドを直接呼び出すこともできます。

→ [dig RPCとは？](../rpc/what-is-the-dig-rpc.md) · [メソッド](../rpc/methods.md)

## ストリーミングと再構成 {#streaming--reassembly}

チャンクモデル、[取得キー](../concepts.md#retrieval-key)、検証してから復号する順序について。

→ [ストリーミング](../rpc/streaming.md)

## 支出の構築 — 正規のCHIP-0035ビルダー {#building-spends--the-canonical-chip-0035-builder}

**構築 → 署名 → ブロードキャスト**の分離：wasmが支出バンドルを構築し、ウォレットが署名し、あなたがブロードキャストします。hubは決して自前で支出を組み立てません。あなたもそうすべきではありません。

→ [支出の構築](../spends.md)

## hubの`/v1`制御プレーン {#the-hub-v1-control-plane}

認証（JWT / OIDC / デバイスペアリング）、store、ドメイン、分析、Webhookをすべて REST で。

→ [機械可読なサーフェス](../machine-surfaces.md#openapi)（OpenAPIドキュメントについて）。

## CIデプロイ — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

モード、キーレスOIDC、結果を表す列挙型、そして後続ステップのための`--json`出力。

→ [GitHub Actionsからデプロイする](../digstore/cli/deploy-from-github-actions.md)

## 機械可読なサーフェス {#machine-readable-surfaces}

`/openapi.json`、`/openrpc.json`、`/error-codes.json`、`/llms.txt`、`/knowledge-graph.json` — 文章をスクレイピングすることなく発見・統合できます。

→ [機械可読なサーフェス](../machine-surfaces.md)

## エラーコード — コードで分岐する {#error-codes--branch-on-the-code}

dig RPC、CLI、DIGHUb、digローダー、SDKにまたがる、1つに統合されたリファレンスです。

→ [エラーコード](../support/error-codes.md)

---

## さらに深く：プロトコル {#go-deeper-the-protocol}

- **「検証済みの読み取り」** → [dig RPC（ネットワークコンテンツインターフェース）](../rpc/what-is-the-dig-rpc.md) · [包含証明と実行証明](../inclusion-vs-execution-proofs.md)
- **「window.chia」** → [規範的なプロバイダー仕様](../protocol/window-chia-provider.md)
- **「retrieval_keyとストリーミング」** → [URNと暗号化](../digstore/format/urns-and-encryption.md#two-values-one-string) · [ストリーミング](../rpc/streaming.md)
- **「デプロイトークンは失効可能な書き込みキーである」** → [CHIP-0035の支出と委任](../chip-0035-spends-and-delegation.md)
- **すべて** → [プロトコル詳解](../protocol-deep-dive.md) · [概念と用語集](../concepts.md)
