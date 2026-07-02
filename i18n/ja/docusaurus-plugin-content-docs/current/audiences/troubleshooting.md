---
sidebar_position: 6
title: トラブルシューティング — 問題を解決する
description: "すべての失敗はサーバーログに直接結びつく安定したコードとrequest-idを提供し、オンチェーンの支出は競合制御されているため二重支払いは決して起こらず、明確な事前チェックによって$DIGを使う前に無駄なcapsuleの発生を防ぎます。"
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# トラブルシューティング {#troubleshooting}

> すべての失敗は、サーバーログに直接結びつく**安定したコード**と**request-id**を提供し、オンチェーンの支出は**競合制御されている**ため二重支払いは決して起こらず、明確な**事前チェック**が$DIGを使う前に無駄なcapsuleの発生を防ぎます。

## メンタルモデル — コードで失敗を特定する {#the-mental-model--find-your-failure-by-its-code}

dig RPC、digstore CLI、DIGHUb、`chia://`ローダー、SDKといったすべての面が、失敗を1つの**安定したコード**に対応付けます。**コードで分岐し、メッセージでは分岐しないでください。** 1つに統合されたカタログがそれらすべてをカバーし、機械可読な形でも公開されています。

事前チェック（`digstore doctor`、`--dry-run`、`--if-changed`）と再開可能なアンカーにより、行き詰まった、あるいは何も変わらない公開が**サイレントに支出を発生させる**ことは決してありません。

## よくある公開の失敗 {#common-publishing-failures}

資金不足、確定タイムアウト（再開可能であり、あなたの支出が失われることはありません）、そして早送りできない「リモートのrootが進んでいます」というエラー。

→ [トラブルシューティング](../support/troubleshooting.md)

## 読み取りと検証の失敗 {#read--verify-failures}

証明の不一致、復号／saltのエラー、見つからない／デコイ応答。

→ [読み取りと検証の失敗](../support/troubleshooting.md#verification-failed)

## ウォレットとセッションの問題 {#wallet--session-issues}

接続、再認証、拒否されたリクエスト、署名できない閲覧専用セッション。

→ [ウォレットセッションが署名できない](../support/troubleshooting.md#wallet-session)

## 事前チェックと費用の確認 — capsuleを無駄にしない {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor`（環境と準備状況の確認）、`--dry-run`（費用と作成予定のcapsuleをプレビュー）、`--if-changed`（バイト単位で同一のビルドは何もしません）。

→ [GitHub Actionsからデプロイする](../digstore/cli/deploy-from-github-actions.md) · [オンチェーンアンカリング → 費用と安全性](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## エラーコードリファレンス {#error-codes-reference}

CLI終了コード・RPCの`-32xxx`・DIGHUb・digローダー・SDK — 1つに統合された表です。

→ [エラーコード](../support/error-codes.md)

## FAQ {#faq}

費用、無料トライアル、価格が均一である理由、$DIGの入手先、「テストネットはありますか？」について。

→ [FAQ](../support/faq.md)

## ヘルプを得る {#get-help}

DiscordとGitHub、そして良い報告の書き方 — **決して秘密情報を貼り付けないでください**。

→ [ヘルプを得る](../support/get-help.md)

## ステータスと変更履歴 {#status--changelog}

→ [ステータス](../support/status.md) · [変更履歴](../support/changelog.md)

---

## さらに深く：プロトコル {#go-deeper-the-protocol}

- **読み取りと検証の失敗** → [証明とセキュリティ](../digstore/format/proofs-and-security.md) · [URNと暗号化](../digstore/format/urns-and-encryption.md)
- **RPCの`-32xxx`コード** → [dig RPCメソッド](../rpc/methods.md) · [準拠性](../rpc/conformance.md)
- **すべて** → [プロトコル詳解](../protocol-deep-dive.md) · [概念と用語集](../concepts.md)
