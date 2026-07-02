---
sidebar_position: 5
title: Dành cho người tiêu thụ nội dung
description: "Mở nội dung chia:// mà chính trình duyệt của bạn xác minh dựa trên blockchain — không host nào có thể thay đổi hay giả mạo nó, nội dung riêng tư vẫn riêng tư với host, và nó vĩnh viễn và có thể lưu trữ lại ở bất cứ đâu, nên không ai có thể gỡ nó xuống hay khóa bạn lại."
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

# Dành cho người tiêu thụ nội dung {#for-content-consumers}

> **Mở nội dung `chia://` mà CHÍNH trình duyệt của bạn xác minh dựa trên blockchain** — không host nào có thể thay đổi hay giả mạo nó, nội dung riêng tư vẫn riêng tư với host, và nó vĩnh viễn và có thể lưu trữ lại ở bất cứ đâu, nên không ai có thể gỡ nó xuống hay khóa bạn lại.

## Mô hình tư duy {#the-mental-model}

Dán một liên kết `chia://` và nội dung đến thẳng từ mạng lưới — **định địa chỉ theo nội dung** và **được xác minh bằng mật mã trên CHÍNH thiết bị của bạn** trước khi nó hiển thị. Nó **thất bại theo hướng đóng (fail-closed)**: các byte bị giả mạo hoặc không thể giải mã không bao giờ hiển thị.

- **Bỏ qua `rootHash`** để lấy phiên bản *mới nhất* của store: `chia://<storeId>/`.
- **Bao gồm nó** để ghim một [capsule](../concepts.md#capsule) bất biến, chính xác duy nhất: `chia://<storeId>:<rootHash>/`.

Nội dung công khai chỉ cần liên kết. Nội dung riêng tư cũng cần một **`?salt=`** bí mật — giống như một mật khẩu.

## Lấy DIG Browser, hoặc tiện ích mở rộng {#get-the-dig-browser-or-the-extension}

- **[Tải DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — một trình duyệt có `chia://` và một ví tích hợp sẵn.
- **Tiện ích mở rộng (extension)** cho Chrome / Edge / Brave / Firefox — thêm khả năng phân giải `chia://` vào trình duyệt bạn đã dùng.

## Mở nội dung `chia://` — mới nhất so với đã ghim {#open-chia-content--latest-vs-pinned}

Các dạng địa chỉ, thanh địa chỉ gọn `chia://<store>/`, và khi nào nên ghim một `rootHash`.

→ [Giao thức chia://](../browser/chia-protocol.md)

## Các trang tích hợp sẵn, huy hiệu đã xác minh & shield {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, và huy hiệu đã xác minh / shield hiển thị kết quả bằng chứng bao gồm của từng tài nguyên cho capsule đang hoạt động.

→ [Sử dụng window.chia](../browser/using-window-chia.md)

## Công khai so với riêng tư — khi nào bạn cần một bí mật `?salt=` {#public-vs-private--when-you-need-a-salt-secret}

Store công khai mở ra chỉ với liên kết; store riêng tư yêu cầu salt bí mật dùng để dẫn xuất khóa giải mã.

→ [Store công khai so với riêng tư](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Công khai so với riêng tư — khác nhau thế nào?](../support/faq.md#public-vs-private)

## Chạy nội dung cục bộ (tùy chọn) {#run-content-locally-optional}

Trỏ trình duyệt/tiện ích mở rộng của bạn vào một [dig-node](../concepts.md#dig-node) cục bộ để đọc nhanh hơn, thân thiện với offline hơn — chúng chia sẻ chung một bộ nhớ đệm `.dig`. Bạn không bao giờ *cần* một node để đọc.

→ [Chạy một node](../run-a-node/index.md)

## Lấy $DIG {#get-dig}

Bạn không cần $DIG để *đọc* nội dung. Nếu bạn muốn xuất bản, hãy lấy $DIG trên **TibetSwap**, **dexie.space**, hoặc **9mm.pro**.

→ [Tôi lấy DIG ở đâu?](../support/faq.md#where-do-i-get-dig)

---

## Đi sâu hơn: giao thức {#go-deeper-the-protocol}

- **"đã xác minh dựa trên blockchain"** → [Neo on-chain](../digstore/cli/onchain-anchoring.md) · [Bằng chứng & bảo mật](../digstore/format/proofs-and-security.md)
- **"salt công khai so với riêng tư"** → [URN & mã hóa](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"mới nhất so với đã ghim"** → [Generation & root hash](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Tất cả** → [Đi sâu vào giao thức](../protocol-deep-dive.md) · [Khái niệm & thuật ngữ](../concepts.md)
