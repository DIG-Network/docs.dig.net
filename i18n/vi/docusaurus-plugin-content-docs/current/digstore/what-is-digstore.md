---
sidebar_position: 1
title: DigStore là gì?
description: "Định dạng dự án theo phong cách Git, định địa chỉ theo nội dung với mã hóa tích hợp và định địa chỉ dựa trên URN; biên dịch thành một module WebAssembly duy nhất tự bảo vệ chính nó."
keywords:
  - DigStore
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# DigStore là gì? {#what-is-digstore}

**DigStore là một dự án theo phong cách Git, được mã hóa, định địa chỉ theo nội dung, biên dịch thành một module WebAssembly duy nhất tự bảo vệ chính nó.**

Bạn nhận được các lệnh theo phong cách Git — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — cho một dự án **được mã hóa khi lưu trữ (encrypted at rest)** và biên dịch thành **một file `.wasm` duy nhất**. File duy nhất đó *vừa là dữ liệu của bạn vừa là server kiểm soát quyền truy cập vào nó*. Một host lưu trữ hoặc chuyển tiếp nó chỉ thấy ciphertext được định địa chỉ theo hash; nó không thể đọc những gì nó đang mang theo.

Bạn định địa chỉ nội dung bằng một **[URN](./format/urns-and-encryption.md)**, và URN *chính là* khóa: nó vừa định vị vừa giải mã. Đưa cho ai đó một URN và họ có thể đọc tài nguyên đó; không có nó thì không thể — không có mật khẩu hay danh sách truy cập riêng biệt nào để quản lý.

Khác với Git, DigStore được xây dựng cho **kết quả build (build output)**, không phải mã nguồn của repository. Bạn trỏ một dự án vào một thư mục như `dist/` và nó ghi lại những gì có ở đó.

## Tại sao nó tồn tại {#why-it-exists}

| Vấn đề | Câu trả lời của DigStore |
|---|---|
| Host có thể đọc / quét những gì bạn xuất bản | Nội dung được mã hóa khi lưu trữ; host chỉ giữ ciphertext theo khóa hash |
| Kiểm soát truy cập nghĩa là mật khẩu và ACL | URN *chính là* khả năng (capability) — chia sẻ nó để cấp quyền đọc, giữ lại để từ chối |
| Bạn phải tin tưởng server để phục vụ đúng byte thật | `clone`/`pull` xác minh store id của module, root đã ký của người xuất bản, và **root singleton on-chain** trước khi cài đặt — thất bại theo hướng đóng (fails closed) |
| "Payload này lớn cỡ nào?" bị lộ ra từ kích thước file | Mỗi dự án là một `.wasm` duy nhất, được đệm đến một kích thước đồng nhất không tiết lộ gì về nội dung của nó |
| Logic phục vụ nằm tách biệt với dữ liệu | Dữ liệu và mã kiểm soát nó biên dịch vào *cùng* một module |

## Cách đọc tài liệu này {#how-to-read-these-docs}

- **[Định dạng DigStore](./format/overview.md)** — các khái niệm: dự án, các lần triển khai, module `.wasm`, URN, mã hóa, và bằng chứng. Bắt đầu ở đây nếu bạn muốn hiểu *DigStore là gì*.
- **[Hướng dẫn CLI](./cli/install.md)** — cài đặt CLI và dùng nó trong một dự án thực: khởi tạo một dự án, chụp lại một thư mục build, commit các lần triển khai, chia sẻ qua một remote, và stream nội dung trở ra.

Nếu bạn chỉ muốn thử ngay, hãy nhảy thẳng đến **[Bắt đầu nhanh](../quickstart.md)** (lộ trình ưu tiên web, miễn phí) hoặc [Hướng dẫn CLI](./cli/quickstart.md).

:::note
DigStore là một phần của [DIG Network](https://dig.net). Toàn bộ thiết kế kỹ thuật nằm trong [mục Protocol](../protocol-deep-dive.md) — định dạng store WASM định địa chỉ theo nội dung.
:::

## Liên quan {#related}

- [Định dạng DigStore](./format/overview.md) — dự án, module WASM, URN, mã hóa, bằng chứng
- [Cấu trúc store](./format/store-structure.md) — danh tính store, các generation, và module đã biên dịch
- [URN & Mã hóa](./format/urns-and-encryption.md) — URN vừa định địa chỉ *vừa* giải mã
- [Hướng dẫn CLI](./cli/quickstart.md) — tạo, commit, và đọc một store chỉ trong vài phút
- [Khái niệm & thuật ngữ](../concepts.md) — các thực thể cốt lõi của DIG trong nháy mắt
