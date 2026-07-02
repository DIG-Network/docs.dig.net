---
sidebar_position: 2
title: Dành cho nhà phát triển NFT
description: "Mint một bộ sưu tập CHIP-0007 hoàn chỉnh mà tác phẩm nghệ thuật của nó sống vĩnh viễn trong một capsule DIG chống giả mạo — một bó giao dịch đã ký nguyên tử duy nhất, tiền bản quyền thực, và cơ chế drop trung thực không bao giờ giả vờ những gì chưa thể chứng minh on-chain."
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

# Dành cho nhà phát triển NFT {#for-nft-developers}

> **Mint một bộ sưu tập CHIP-0007 hoàn chỉnh mà tác phẩm nghệ thuật của nó sống VĨNH VIỄN trong một capsule DIG chống giả mạo** — một bó giao dịch đã ký nguyên tử duy nhất, tiền bản quyền thực, và cơ chế drop trung thực (reveal / allowlist / phases) không bao giờ giả vờ những gì chúng chưa thể chứng minh on-chain.

## Mô hình tư duy {#the-mental-model}

Trước tiên đưa tác phẩm nghệ thuật của bạn vào một **[capsule DIG](../concepts.md#capsule)**, sau đó mint các NFT mà `data_uris` / `metadata_uris` của chúng trỏ vào capsule đó. Các hash on-chain ghim đúng byte thật — nên tác phẩm nghệ thuật được định địa chỉ theo nội dung, có thể xác minh, và vĩnh viễn, không phải một liên kết có thể mục nát hay bị đổi.

Các giao dịch chi tiêu **không bao giờ được tự tay xây dựng**: trình xây dựng wasm CHIP-0035 chuẩn tắc (qua [`@dignetwork/dig-sdk/spend`](../sdk.md)) xây dựng mọi giao dịch chi tiêu coin, ví của bạn ký một lần, và nó phát sóng một lần.

Việc mint một **store là miễn phí** $DIG — bạn chỉ trả **mức giá capsule đồng nhất** khi một capsule được tạo ra (khi tác phẩm nghệ thuật được ghi vào một capsule).

## Dựng khung một trang mint — template `nft-drop` {#scaffold-a-mint-page--the-nft-drop-template}

Bắt đầu từ một trang drop có ví trong một lệnh:

```sh
digstore new nft-drop
# or
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Dựng khung một ứng dụng](../build-a-dapp/scaffold.md)

## Mint từ CLI {#mint-from-the-cli}

CLI tài sản xây dựng giao dịch chi tiêu qua các trình xây dựng `digstore-chain`, ký bằng seed ví của bạn, và push — tất cả đều an toàn cho CI với `--dry-run` / `--json`:

```sh
digstore did create                          # an issuer DID for attribution
digstore collection create --name "My Drop"  # a CHIP-0007 collection
digstore nft mint --data ./art.png --metadata ./meta.json --dry-run
digstore offer make ...                       # XCH / CAT trades
```

Lộ trình **capsule-media** của `nft mint` ghi tác phẩm nghệ thuật + metadata CHIP-0007 vào một capsule, tính toán hash dữ liệu/metadata từ byte thật, và đặt các URI thành địa chỉ `chia://` của capsule (với một gateway https dự phòng). → [Tham khảo lệnh](../digstore/cli/command-reference.md)

## Mint từ web — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Mint một bộ sưu tập có capsule đứng sau trong trình duyệt: tải lên tác phẩm nghệ thuật (được ghi vào một capsule), đặt tiền bản quyền, và gắn một DID để ghi nhận tác giả — ví ký ở cuối. → [DIGHUb ↗](https://hub.dig.net)

## Drop — reveal, allowlist, phases {#drops--reveal-allowlist-phases}

Cơ chế drop được thể hiện **trung thực**: những gì được thực thi on-chain ngày hôm nay so với những gì là tiện ích off-chain đang chờ nguyên thủy claim-coin. Chúng ta không bao giờ đưa ra một đảm bảo mà chúng ta chưa thể chứng minh on-chain.

→ [Xây dựng một dapp trên Chia](../build-a-dapp/tutorial.md) cho luồng mint từ đầu đến cuối.

## Xây dựng giao dịch chi tiêu với SDK — không bao giờ tự tay xây dựng {#build-spends-with-the-sdk--never-hand-roll}

Mọi giao dịch chi tiêu coin đều được xây dựng bởi wasm CHIP-0035 chuẩn tắc và được re-export tại `@dignetwork/dig-sdk/spend`. Luồng luôn là **xây dựng → ký → phát sóng**, được tách ra để ví chỉ bao giờ ký mà thôi.

→ [Xây dựng giao dịch chi tiêu](../spends.md) · [DIG SDK](../sdk.md)

## Kiếm tiền & kiểm soát truy cập — Paywall {#monetize--gate--the-paywall}

`Paywall` của SDK kết hợp provider với trình xây dựng giao dịch chi tiêu cho **trả-phí-để-mở-khóa** và **kiểm soát truy cập theo quyền sở hữu NFT / bộ sưu tập** — mà không cần tự tay kết nối giao dịch chi tiêu.

→ [DIG SDK → Paywall](../sdk.md#paywall)

## Offer — make / take / show {#offers--make--take--show}

Trao đổi NFT lấy XCH hoặc CAT bằng `digstore offer make | take | show` (mỗi lệnh đều có `--dry-run` / `--json`). → [Tham khảo lệnh](../digstore/cli/command-reference.md)

---

## Đi sâu hơn: giao thức {#go-deeper-the-protocol}

- **"capsule chống giả mạo"** → [Bằng chứng & bảo mật](../digstore/format/proofs-and-security.md) · [Mô hình capsule & store](../digstore/format/store-structure.md)
- **"không bao giờ tự tay xây dựng một giao dịch chi tiêu"** → [Giao dịch store-coin & ủy quyền CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Tất cả** → [Đi sâu vào giao thức](../protocol-deep-dive.md) · [Khái niệm & thuật ngữ](../concepts.md)
