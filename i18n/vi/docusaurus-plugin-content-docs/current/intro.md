---
sidebar_position: 1
slug: /
title: DIG Network
description: "Tổng quan về các thành phần cơ bản của DIG Network: DigStore để xuất bản theo địa chỉ nội dung, dig RPC để lưu trữ và truy xuất ẩn danh (blind hosting), và DIG Browser để truy cập nội dung."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - DigStore
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network là một Proof-of-Stake Layer 2 trên Chia** — một mạng lưới phi tập trung để xuất bản, định địa chỉ và phục vụ nội dung mà không cần tin tưởng bên lưu trữ.

Tài liệu này bao quát mạng lưới và các **thành phần cơ bản** của nó: những khối xây dựng có thể kết hợp mà nhà phát triển dùng để xây dựng trên DIG. Mạng lưới vẫn đang mở rộng, và sẽ có thêm nhiều thành phần cơ bản được tài liệu hóa ở đây theo thời gian.

## Capsule {#the-capsule}

Một khái niệm xuyên suốt mọi thành phần cơ bản. Một **capsule** là một thế hệ (generation) store bất biến duy nhất — cặp `(storeId, rootHash)`, được viết theo dạng chuẩn là `storeId:rootHash`. Một **store là một chuỗi các capsule**, mỗi capsule ứng với một lần commit (mỗi commit tiến root on-chain thêm một bước và tạo ra một capsule mới).

Capsule là đơn vị của mạng lưới cho:

- **Biên dịch (Compilation)** — mỗi capsule biên dịch thành một module WASM có kích thước cố định (được đệm để độ dài không tiết lộ bất cứ điều gì về kích thước nội dung).
- **Định giá (Pricing)** — một **mức giá đồng nhất trên mỗi capsule** (mint hoặc commit), thanh toán bằng $DIG theo tỷ giá thời điểm; chi phí trọn đời của một store là mức giá đồng nhất trên mỗi capsule × số lượng capsule.
- **Truy xuất (Retrieval)** — một URN định danh một capsule (cộng thêm một tài nguyên tùy chọn bên trong nó).
- **Bộ nhớ đệm (Caching)** — một host hoặc trình duyệt lưu đệm một capsule theo khóa `storeId:rootHash`; bộ nhớ đệm cục bộ là một tập hợp các capsule.
- **Nguồn gốc (Provenance)** — root của mỗi capsule mang chữ ký BLS của người xuất bản và một Merkle root.

Đây là định nghĩa áp dụng trên toàn hệ sinh thái: "capsule = `(storeId, rootHash)`" mang cùng một ý nghĩa trong DigStore, dig RPC, và DIG Browser.

:::tip Thử ngay
[**Tạo capsule đầu tiên của bạn trong DIGHUb ↗**](https://hub.dig.net/new) — xuất bản một trang web ngay trên trình duyệt, không cần CLI. Mỗi capsule (mint hoặc commit) có giá là **mức giá capsule đồng nhất tính bằng $DIG**.
:::

## Các thành phần cơ bản {#primitives}

### 🗄️ DigStore {#️-digstore}

Thành phần cơ bản đầu tiên và nền tảng nhất: một **định dạng dự án WASM được mã hóa, định địa chỉ theo nội dung**. Bạn trỏ nó vào một thư mục build, commit các lần triển khai giống như Git, và nhận được một file `.wasm` duy nhất tự bảo vệ chính nó — vừa là dữ liệu của bạn, vừa là server kiểm soát quyền truy cập vào nó. URN *chính là* khóa — nó vừa định vị vừa giải mã.

→ **[Khám phá DigStore](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[DigStore là gì?](./digstore/what-is-digstore.md)** | Ý tưởng một-file, tóm gọn |
| **[Định dạng (The Format)](./digstore/format/overview.md)** | Dự án, các lần triển khai, URN, mã hóa, bằng chứng |
| **[Hướng dẫn CLI](./digstore/cli/quickstart.md)** | Cài đặt và dùng `digstore` trong dự án của bạn |

### 🛰️ dig RPC {#️-dig-rpc}

Thành phần cơ bản về mạng lưới: một **giao diện chuẩn để đọc nội dung từ các bản triển khai DigStore đang được lưu trữ**. JSON-RPC 2.0 qua HTTPS `POST` — mọi node lưu trữ đều nói cùng một giao thức giống hệt nhau, nên nội dung có tính di động và client không phụ thuộc vào node cụ thể nào. Nó phục vụ bản mã hóa (ciphertext) + bằng chứng bao gồm (inclusion proofs) theo retrieval key, toàn bộ bản triển khai theo `(store_id, root)`, và manifest khám phá công khai — được truyền theo từng khối (chunk), ẩn danh theo thiết kế, được xác minh và giải mã hoàn toàn ở phía client.

→ **[Khám phá dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[dig RPC là gì?](./rpc/what-is-the-dig-rpc.md)** | Một endpoint duy nhất cho toàn bộ đường đọc của mạng lưới |
| **[Các phương thức (Methods)](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | Mô hình chunk, tái lắp ráp, và xác minh bằng chứng |
| **[Tuân thủ & Bảo mật](./rpc/conformance.md)** | Mô hình ẩn danh, CORS, và những gì một node phải triển khai |

### 🌐 DIG Browser {#-dig-browser}

Thành phần cơ bản phía client: một **trình duyệt có tích hợp sẵn ví Chia**. Nó tiêm (inject) một provider `window.chia` vào mọi trang, để bất kỳ ứng dụng web nào cũng có thể yêu cầu địa chỉ, chữ ký, và giao dịch chi tiêu của người dùng mà không cần thiết lập WalletConnect — một lựa chọn thay thế cắm-và-chạy cho các ứng dụng đã hỗ trợ CHIP-0002. Nó cũng phân giải trực tiếp các địa chỉ nội dung `chia://`.

→ **[Xây dựng trên nền DIG Browser](./browser/using-window-chia.md)**

| | |
|---|---|
| **[Dùng `window.chia` trong ứng dụng của bạn](./browser/using-window-chia.md)** | Phát hiện ví được tiêm sẵn, kết nối, và gọi các phương thức CHIP-0002 |

:::tip Thử ngay
[**Tải DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — tải trình duyệt để mở nội dung `chia://` và dùng ví tích hợp sẵn.
:::

*Thêm các thành phần cơ bản khác — thanh toán (settlement) và vận hành node — sẽ có mục riêng khi ra mắt.*

## Chọn lộ trình của bạn {#pick-your-path}

Tài liệu được tổ chức xoay quanh **việc bạn đang làm**. Mỗi lộ trình mở đầu bằng lý do "tại sao" trong mười giây, mô hình tư duy bạn cần, và hướng dẫn thực hành trọng tâm — sau đó dẫn sâu vào giao thức khi bạn muốn tìm hiểu thêm.

- **[Xuất bản một trang web hoặc ứng dụng bạn sở hữu](./audiences/app-developers.md)** — đưa một website/ứng dụng lên như tài sản on-chain của riêng bạn; xây dựng miễn phí, xuất bản một capsule.
- **[Mint NFT & bộ sưu tập](./audiences/nft-developers.md)** — các đợt drop CHIP-0007 được đảm bảo bởi các capsule vĩnh viễn, chống giả mạo.
- **[Tích hợp DIG vào ứng dụng của bạn](./audiences/integration-developers.md)** — một SDK có kiểu (typed) + một nền tảng hoàn toàn có thể đọc được bằng máy.
- **[Chạy một node](./run-a-node/index.md)** — phục vụ nội dung có thể chứng minh được và ẩn danh nhà cung cấp.
- **[Mở nội dung chia://](./audiences/content-consumers.md)** — đọc nội dung mà chính trình duyệt của bạn xác minh dựa trên blockchain.
- **[Gỡ rối khi gặp sự cố](./audiences/troubleshooting.md)** — tìm lỗi của bạn qua mã lỗi ổn định.

Chưa quen với thuật ngữ? Lướt qua [Khái niệm & thuật ngữ](./concepts.md). Muốn tìm hiểu toàn bộ thiết kế? Đọc [Đi sâu vào giao thức](./protocol-deep-dive.md).

:::note
DIG Network và các thành phần cơ bản của nó là mã nguồn mở. DigStore được cấp phép theo GPL-2.0; xem [kho mã nguồn digstore](https://github.com/DIG-Network/digstore).
:::

## Liên quan {#related}

- [Bắt đầu nhanh](./quickstart.md) — xuất bản trang web đầu tiên của bạn; miễn phí để xây dựng và xem trước
- [Xây dựng một dapp trên Chia](./build-a-dapp/tutorial.md) — mọi thành phần cơ bản trong một hướng dẫn trọn vẹn từ đầu đến cuối
- [Khái niệm & thuật ngữ](./concepts.md) — các thực thể cốt lõi của DIG, được định nghĩa và liên kết
- [DigStore là gì?](./digstore/what-is-digstore.md) — định dạng store định địa chỉ theo nội dung
- [dig RPC là gì?](./rpc/what-is-the-dig-rpc.md) — giao diện đọc trên toàn mạng lưới
- [Giao thức chia://](./browser/chia-protocol.md) — mở nội dung trong DIG Browser
- [Nhận trợ giúp](./support/get-help.md) — cộng đồng, xử lý sự cố, và mã lỗi
