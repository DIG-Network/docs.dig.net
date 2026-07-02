---
sidebar_position: 3
title: Dành cho nhà phát triển tích hợp
description: "Một nền tảng hoàn toàn có thể đọc được bằng máy — OpenAPI/OpenRPC, một danh mục mã lỗi được phân loại, định giá theo thời gian thực, JWKS, JSON theo từng trang, và một @dignetwork/dig-sdk có kiểu — để bạn kết nối một ví + các lần đọc đã xác minh vào ứng dụng của mình mà không cần quét một dòng văn bản nào."
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

# Dành cho nhà phát triển tích hợp {#for-integration-developers}

> **Một nền tảng hoàn toàn có thể đọc được bằng máy** — OpenAPI/OpenRPC, một danh mục mã lỗi được phân loại, định giá theo thời gian thực, JWKS, JSON theo từng trang, và một `@dignetwork/dig-sdk` có kiểu — để bạn kết nối một ví + các lần đọc đã xác minh vào ứng dụng của mình **mà không cần quét một dòng văn bản nào**.

## Mô hình tư duy — hai bề mặt, được giữ tách biệt {#the-mental-model--two-surfaces-kept-separate}

1. **Một control plane REST** — `hub.dig.net/v1`, bearer-JWT — để quản lý store, tên miền, team, và NFT.
2. **Một đường đọc dig JSON-RPC 2.0 không phụ thuộc node** — `rpc.dig.net` — stream **ciphertext đã xác minh**.

Một bề mặt **ví** duy nhất ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) trên hai lớp vận chuyển — tiêm sẵn (DIG Browser) hoặc WalletConnect → Sage — được hợp nhất bởi `ChiaProvider` của SDK. Các giao dịch chi tiêu luôn được xây dựng bởi wasm CHIP-0035 chuẩn tắc và được ký bởi ví của người dùng — **không bao giờ tự tay xây dựng (hand-rolled)**. Rẽ nhánh dựa trên **mã lỗi ổn định**, không bao giờ dựa vào văn bản.

## Xây dựng một dapp — từ đầu đến cuối {#build-a-dapp--end-to-end}

Luồng công việc duy nhất từ dựng khung đến một ứng dụng nhận biết ví, trực tuyến trên tên miền của riêng bạn.

→ [Xây dựng một dapp trên Chia](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, và các giao dịch chuẩn tắc được re-export tại subpath `/spend`. Cài đặt, các subpath, và `capabilities()`.

→ [DIG SDK](../sdk.md)

## Kết nối một ví — `window.chia` {#connect-a-wallet--windowchia}

Phát hiện provider được tiêm sẵn, gọi `connect()` (đồng ý theo từng origin), và dùng các phương thức CHIP-0002.

→ [Sử dụng window.chia](../browser/using-window-chia.md) · đặc tả: [provider window.chia](../protocol/window-chia-provider.md)

## Đọc nội dung đã xác minh — `DigClient` + các phương thức dig RPC {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` stream ciphertext + bằng chứng bao gồm và **xác minh-rồi-giải mã** ở phía client. Gọi các phương thức trực tiếp khi bạn cần.

→ [dig RPC là gì?](../rpc/what-is-the-dig-rpc.md) · [Các phương thức (Methods)](../rpc/methods.md)

## Streaming & tái lắp ráp {#streaming--reassembly}

Mô hình chunk, [retrieval key](../concepts.md#retrieval-key), và thứ tự xác minh-rồi-giải mã.

→ [Streaming](../rpc/streaming.md)

## Xây dựng giao dịch chi tiêu — trình xây dựng CHIP-0035 chuẩn tắc {#building-spends--the-canonical-chip-0035-builder}

Sự phân chia **xây dựng → ký → phát sóng**: wasm xây dựng bó giao dịch chi tiêu (spend bundle), ví ký, bạn phát sóng. Hub không bao giờ tự tay xây dựng một giao dịch chi tiêu, và bạn cũng không nên làm vậy.

→ [Xây dựng giao dịch chi tiêu](../spends.md)

## Control plane `/v1` của hub {#the-hub-v1-control-plane}

Xác thực (JWT / OIDC / ghép cặp thiết bị), store, tên miền, phân tích, và webhook qua REST.

→ [Các bề mặt có thể đọc được bằng máy](../machine-surfaces.md#openapi) cho tài liệu OpenAPI.

## Triển khai CI — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Các chế độ, OIDC không cần khóa, enum kết quả, và đầu ra `--json` cho các bước tiếp theo.

→ [Triển khai từ GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Các bề mặt có thể đọc được bằng máy {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — khám phá và tích hợp mà không cần quét văn bản.

→ [Các bề mặt có thể đọc được bằng máy](../machine-surfaces.md)

## Mã lỗi — rẽ nhánh dựa trên mã {#error-codes--branch-on-the-code}

Một tài liệu tham chiếu hợp nhất trên dig RPC, CLI, DIGHUb, dig loader, và SDK.

→ [Mã lỗi](../support/error-codes.md)

---

## Đi sâu hơn: giao thức {#go-deeper-the-protocol}

- **"các lần đọc đã xác minh"** → [dig RPC (Giao diện nội dung mạng lưới)](../rpc/what-is-the-dig-rpc.md) · [Bằng chứng bao gồm so với bằng chứng thực thi](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [đặc tả provider chuẩn tắc](../protocol/window-chia-provider.md)
- **"retrieval_key & streaming"** → [URN & mã hóa](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **"một deploy token là một khóa ghi có thể thu hồi"** → [Giao dịch chi tiêu & ủy quyền CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Tất cả** → [Đi sâu vào giao thức](../protocol-deep-dive.md) · [Khái niệm & thuật ngữ](../concepts.md)
