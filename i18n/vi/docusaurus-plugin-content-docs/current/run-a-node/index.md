---
sidebar_position: 1
title: Chạy một DIG node
description: "dig-node là gì, tại sao bạn nên chạy một node, và cách cài đặt nó — kho apt cho Ubuntu/Debian hoặc trình cài đặt phổ dụng đa nền tảng."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Chạy một DIG node {#run-a-dig-node}

> **Phục vụ nội dung có thể chứng minh được và ẩn danh nhà cung cấp** — bạn chỉ bao giờ chạm vào ciphertext không thể phân biệt được theo khóa hash, có thể xác thực việc phục vụ trung thực bằng bằng chứng thực thi, và client xác minh mọi thứ dựa trên chuỗi, nên sự tin tưởng không bao giờ dựa vào node của bạn.

Một **dig-node** là **server** nội dung của DIG Network — phía cung của mạng lưới. Nó lưu trữ các capsule, giữ một bộ nhớ đệm `.dig` cục bộ, và phơi bày [dig RPC](../rpc/what-is-the-dig-rpc.md) để bất cứ thứ gì đọc nội dung DIG cũng có thể đọc từ bạn. Nó chạy không đầu (headless, không trình duyệt, không giao diện) như một dịch vụ nền — một seedbox cho nội dung bạn xuất bản hoặc muốn giúp phục vụ.

Nó là đối tác của các **người tiêu thụ** — [DIG Browser](../browser/chia-protocol.md) và tiện ích mở rộng trình duyệt — những thứ lấy ciphertext + bằng chứng, xác minh dựa trên root on-chain, giải mã cục bộ, và render. Bạn **không cần** một dig-node để đọc nội dung DIG: chỉ riêng một trình tiêu thụ đã hoạt động tốt, dự phòng về node tham chiếu công khai tại `rpc.dig.net`. Bạn chạy một dig-node để **phục vụ** — và khi có một node hiện diện trên cùng máy, trình tiêu thụ đọc từ nó (cục bộ, thân thiện với offline, và đóng góp cho mạng lưới) và chúng chia sẻ chung một bộ nhớ đệm `.dig`.

:::info Phục vụ so với tiêu thụ
- **dig-node** = phục vụ nội dung + phơi bày dig RPC. Dịch vụ nền không đầu.
- **DIG Browser / tiện ích mở rộng** = tiêu thụ nội dung (xác minh + giải mã cục bộ). Không cần node cục bộ.

Khi cả hai được cài đặt, trình duyệt/tiện ích mở rộng đọc từ dig-node cục bộ của bạn; nếu không, chúng đọc từ `rpc.dig.net`. Dù bằng cách nào, mọi byte đều được xác minh ở phía client dựa trên chuỗi — nguồn không bao giờ được tin tưởng.
:::

## Cài đặt nó {#install-it}

| Máy của bạn | Dùng |
|---|---|
| **Ubuntu / Debian** | **[Kho apt](./apt.md)** gốc — `apt install dig-node digstore`, tự động bật như một dịch vụ systemd. |
| **Windows / macOS / Linux (bất kỳ)** | **[Trình cài đặt phổ dụng](#universal-installer-any-os)** đa nền tảng — một lệnh `curl \| sh` (hoặc tải xuống) cho mọi hệ điều hành. |

Cả hai đều cài đặt cùng một dịch vụ `dig-node` cộng với CLI `digstore`. apt là lộ trình gốc của Debian (đã ký, có thể `apt upgrade`); trình cài đặt phổ dụng bao quát mọi thứ khác.

### apt (Ubuntu / Debian) — khuyến nghị trên các hệ thống dòng Debian {#apt-ubuntu--debian--recommended-on-debian-family-systems}

Lộ trình gốc: một kho apt đã ký tại `apt.dig.net`. Nó cài đặt `dig-node` như một **dịch vụ systemd** được quản lý và giữ nó cập nhật bằng `apt upgrade`.

→ **[Cài đặt trên Ubuntu/Debian qua apt](./apt.md)**

### Trình cài đặt phổ dụng (mọi hệ điều hành) {#universal-installer-any-os}

Lộ trình đa nền tảng — Windows, macOS, và bất kỳ Linux nào. Nó phát hiện hệ điều hành của bạn, cài đặt dịch vụ `dig-node` (dịch vụ Windows / `systemd` / `launchd`) và CLI `digstore`, và không cần trình quản lý gói:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

Đây là cùng một `dig-installer` tự chứa được phát hành trên [trang Releases](https://github.com/DIG-Network/dig-installer/releases) — tải xuống và chạy trực tiếp nếu bạn không muốn pipe vào một shell, hoặc trên Windows.

:::note Trước khi phát hành
Các trình cài đặt được lưu trữ (`apt.dig.net`, `dig.net/install.sh`) vẫn đang được thiết lập. Cho đến khi chúng trực tuyến, hãy build từ mã nguồn hoặc lấy một binary từ [dig-node Releases](https://github.com/DIG-Network/dig-node/releases). Các lệnh ở đây là những lệnh thực sự, đúng như dự định.
:::

## Chỉ muốn đọc nội dung? {#just-want-to-read-content}

Bạn không cần một node. Lấy **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** và mở bất kỳ địa chỉ `chia://` nào — nó tiêu thụ từ dig-node cục bộ của bạn nếu bạn có một, nếu không thì từ `rpc.dig.net`. Xem [Giao thức `chia://`](../browser/chia-protocol.md).

## Liên quan {#related}

- [Cài đặt trên Ubuntu/Debian qua apt](./apt.md) — lộ trình gốc của Debian + quản lý dịch vụ systemd
- [Cài đặt ở bất cứ đâu — trình cài đặt phổ dụng](./universal-installer.md) — Windows / macOS / bất kỳ Linux nào + `dig.local`
- [Trỏ một trình tiêu thụ vào node của bạn](./point-a-consumer.md) — đọc ưu tiên cục bộ + bộ nhớ đệm `.dig` chung
- [Cấu hình dig-node](./configure.md) — cổng, listener, giới hạn bộ nhớ đệm, upstream
- [Tự lưu trữ một nguồn gốc từ xa](../rpc/dig-remote.md) — `digstore serve` + clone/pull/push qua dig://
- [Quản lý node của bạn](./manage.md) — các RPC quản trị control.* + giao diện My Node
- [Sử dụng RPC mạng công khai](../rpc/public-network-rpc.md) — dig RPC mà node của bạn nói, và vận hành một node trên mạng lưới
- [Cài đặt CLI](../digstore/cli/install.md) — `digstore` một mình (xuất bản, không phải phục vụ)

## Đi sâu hơn: giao thức {#go-deeper-the-protocol}

- **"host ẩn danh & decoy"** → [Mô hình phục vụ ẩn danh của dig RPC](../rpc/what-is-the-dig-rpc.md) · [Tuân thủ Node](../rpc/conformance.md)
- **"chứng thực việc phục vụ trung thực"** → [Bằng chứng bao gồm so với bằng chứng thực thi](../inclusion-vs-execution-proofs.md)
- **"clone/pull/push qua dig://"** → [Giao thức remote §21/§22](../rpc/dig-remote.md)
- **Tất cả** → [Đi sâu vào giao thức](../protocol-deep-dive.md) · [Khái niệm & thuật ngữ](../concepts.md)
