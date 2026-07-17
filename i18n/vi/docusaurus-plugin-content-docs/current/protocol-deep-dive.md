---
sidebar_position: 1
title: "Protocol: Overview"
description: "Giao thức DIG được mô tả dưới dạng bảy lớp từ dưới lên trên, vừa chuẩn tắc vừa tùy triển khai xác định. Capsule (storeId:rootHash) là đơn vị nền tảng; host thì ẩn danh và người đọc xác minh dựa trên chuỗi. Đây là tài liệu tham chiếu giao thức có thẩm quyền."
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

# Protocol: Overview {#protocol-overview}

Đây là **đặc tả chuẩn tắc** của DIG Protocol, được định nghĩa dưới dạng **bảy lớp, từ dưới lên trên**. Mỗi lớp nêu tên **crate/file chuẩn tắc** của nó làm tham chiếu chuẩn.

:::info Đây là tài liệu tham chiếu giao thức có thẩm quyền
Mục này là nguồn sự thật cho những gì mạng lưới thực sự làm. Nó ghi lại giao thức đúng như cách nó thực sự chạy, với trích dẫn `file:line` đến bản triển khai chuẩn tắc.
:::

## Đơn vị nền tảng: capsule {#the-fundamental-unit-the-capsule}

Một khái niệm xuyên suốt mọi lớp: **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, viết theo dạng chuẩn là `storeId:rootHash`. Một **store** là một chuỗi capsule có thứ tự (cũ→mới), mỗi capsule ứng với một lần commit; danh tính `store_id` của nó *chính là* một launcher id singleton DataLayer CHIP-0035 trên Chia. Danh tính, biên dịch, định giá, truy xuất, lưu đệm, và nguồn gốc đều được định nghĩa **theo từng capsule**.

## Luận điểm cốt lõi: host ẩn danh, xác minh phía client, root neo trên chuỗi {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Host ẩn danh.** Một host chỉ giữ ciphertext không rõ nghĩa theo khóa hash. Nó không giữ URN và không giữ khóa, chuyển tiếp đầu ra của chính capsule y nguyên, và không thể phân biệt hit với miss. Không có trường `decoy` nào trên wire và không có CDN — nội dung chỉ được phục vụ qua [dig RPC](./protocol/dig-rpc.md).
- **Xác minh phía client.** Mọi byte đều được kiểm tra trên thiết bị của người đọc dựa trên một root on-chain bằng một bằng chứng bao gồm merkle theo từng tài nguyên, sau đó được giải mã có xác thực. Sự tin tưởng không bao giờ dựa vào nguồn gốc phục vụ.
- **Root neo trên chuỗi.** Root đáng tin cậy chỉ đến **duy nhất** từ singleton CHIP-0035 trên Chia (được phân giải qua coinset.org), không bao giờ từ "latest" được phục vụ.

## Bảy lớp {#the-seven-layers}

| # | Lớp | Nó định nghĩa gì | Tham chiếu chuẩn tắc |
|---|---|---|---|
| 0 | [Danh tính & định danh](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN & định địa chỉ](./protocol/urn-and-addressing.md) | ngữ pháp `urn:dig:chia:…`; `retrieval_key` không phụ thuộc root | `digstore-core::urn`, `lib.rs` |
| 1 | [Mật mã học](./protocol/cryptography.md) | KDF HKDF; niêm phong AES-256-GCM-SIV | `digstore-core::crypto` |
| 1 | [Bằng chứng bao gồm Merkle](./protocol/merkle-proofs.md) | lá per-resource D5; gấp NODE_TAG | `digstore-core::merkle` |
| 1 | [Chữ ký BLS & DST](./protocol/bls-signatures.md) | AugScheme của Chia; năm DST theo vai trò | `digstore-crypto::bls` |
| 2 | [Định dạng Capsule](./protocol/capsule-format.md) | phần dữ liệu DIGS (BINDING D1) | `digstore-core::datasection` |
| 2 | [Module tự bảo vệ](./protocol/self-defending-module.md) | làm rối kích thước cố định; guest phục vụ | `digstore-compiler`, `digstore-guest` |
| 4 | [Neo on-chain](./protocol/on-chain-anchoring.md) | store = singleton; capsule = tiến root | `chip35_dl_coin`, `digstore-chain` |
| 4 | [Thanh toán & định giá DIG CAT](./protocol/dig-cat-payment.md) | theo capsule, động, neo theo USD | `chip35_dl_coin::dig` |
| 6 | [dig RPC](./protocol/dig-rpc.md) | giao diện máy (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [Vận chuyển & đẩy §21](./protocol/transport-and-push.md) | locator `dig://`, REST, push v1 | `digstore-remote` |
| 7 | [Mạng peer DIG Node](./protocol/peer-network.md) | danh tính peer mTLS, xuyên NAT, STUN, introducer, wire relay, RPC peer | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Xác minh & nguồn gốc](./protocol/verification-and-provenance.md) | bốn cổng toàn vẹn theo thứ tự | `digstore-core::merkle`, `dig-node` |
| 6 | [Mô hình host ẩn danh](./protocol/blind-host-model.md) | tính ẩn danh nhà cung cấp; resolver; control plane `/v1` | hub `retrieval`/`resolver`/`api` |
| — | [Tuân thủ & tương đương](./protocol/conformance-and-parity.md) | kỷ luật tương đương xuyên bản triển khai | golden đông cứng, diff OpenRPC |

(Các lớp 3 và vận chuyển §21 đan xen với đường đọc; bảng này nhóm chúng ở nơi người đọc gặp chúng. Đánh số lớp đầy đủ được đưa ra trên mỗi trang.)

## Một capsule đi qua các lớp như thế nào {#how-a-capsule-flows-through-the-layers}

Một người xuất bản **chia chunk + mã hóa** (L1) nội dung thành một **định dạng capsule** (L2) **tự phục vụ** (L3), **neo** nó on-chain (L4), và **đẩy** nó qua vận chuyển §21 (L5). Bất kỳ client nào cũng **đọc** nó qua dig RPC và **xác minh** nó dựa trên root neo trên chuỗi hoàn toàn ở phía client (L6). Mỗi hằng số mật mã học có **một** định nghĩa duy nhất được chia sẻ giữa người tạo, host, và người xác minh — [bất biến tương đương C8](./protocol/conformance-and-parity.md).

## Thuật ngữ {#terminology}

- **`chia://`** — địa chỉ **nội dung** của mạng lưới (những gì một trình duyệt mở).
- **`dig://`** — locator **vận chuyển** §21 (mặt phẳng CLI/peer) *và* lược đồ trang nội bộ của DIG Browser — hai công dụng riêng biệt, không bao giờ là địa chỉ nội dung.
- **`urn:dig:`** — không gian tên URN mà cả hai đều bắt nguồn từ.
- **store / capsule** — danh tính và generation bất biến của nó.
- **$DIG** — CAT được trả theo mỗi capsule; **dig-store** — định dạng store.

## Liên quan {#related}

- [Khái niệm & thuật ngữ](./concepts.md) — mọi thực thể được định nghĩa một lần
- [Danh tính & định danh](./protocol/identity-and-naming.md) — Lớp 0, nơi đặc tả bắt đầu
- [dig RPC](./protocol/dig-rpc.md) — giao diện máy của giao thức
- [Mạng peer DIG Node](./protocol/peer-network.md) — cách các node tìm + tiếp cận nhau (mTLS, xuyên NAT, relay)
- [Tuân thủ & tương đương](./protocol/conformance-and-parity.md) — kỷ luật tương đương xuyên bản triển khai
