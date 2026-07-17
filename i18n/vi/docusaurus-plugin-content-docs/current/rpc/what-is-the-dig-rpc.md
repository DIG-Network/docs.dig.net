---
sidebar_position: 1
title: dig RPC là gì?
description: "Giao diện đọc trên toàn mạng lưới cho các capsule dig-store qua JSON-RPC 2.0; ẩn danh theo thiết kế, có thể xác minh mà không cần tin tưởng, và có thể streaming ở bất kỳ kích thước nào."
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# dig RPC là gì? {#what-is-the-dig-rpc}

:::info Đặc tả chuẩn tắc
Đây là trang định hướng. Đặc tả giao diện máy chuẩn tắc — các phương thức, đối tượng wire dạng chunk, hồ sơ node, và các tài liệu OpenRPC — nằm ở [Protocol · dig RPC](../protocol/dig-rpc.md).
:::

**dig RPC là giao diện trên toàn mạng lưới để đọc nội dung trực tiếp từ các capsule `.dig` của dig-store đang được lưu trữ.** Đây là một dịch vụ [JSON-RPC 2.0](https://www.jsonrpc.org/specification) được nói qua HTTPS `POST`.

Mọi node lưu trữ capsule — node tham chiếu tại `https://rpc.dig.net`, hoặc bất kỳ node bên thứ ba nào — đều phơi bày **cùng các phương thức với cùng ngữ nghĩa**. Một client được viết dựa trên giao diện này đọc từ toàn bộ mạng lưới qua một endpoint duy nhất. Không có CDN; toàn bộ việc phục vụ nội dung trên DIG đều qua dig RPC.

Nó phục vụ ba thứ:

| Bạn có… | Bạn gọi… | Bạn nhận lại… |
|---|---|---|
| **Retrieval key** của một tài nguyên (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | Ciphertext của tài nguyên + một bằng chứng bao gồm merkle (và bằng chứng thực thi ZK), được stream theo từng chunk |
| Một **store id + root generation** | [`dig.getCapsule`](./methods.md#diggetcapsule) | Toàn bộ capsule `.dig` cho generation đó, được stream theo từng chunk |
| Một **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | Manifest khám phá công khai / manifest metadata của store / danh sách generation đã xác nhận của store |

## Ba đặc tính định nghĩa nó {#three-properties-that-define-it}

- **Ẩn danh theo thiết kế.** Một node phục vụ ciphertext không rõ nghĩa (opaque) theo khóa hash. Nó không bao giờ thấy một URN, một khóa giải mã, hay plaintext. Một yêu cầu không tìm thấy được trả lời bằng một luồng **decoy** xác định, không thể phân biệt được — không bao giờ trả về `404` — nên đường đọc không bao giờ trở thành một oracle về sự tồn tại. Toàn bộ việc giải mã và xác minh bằng chứng đều xảy ra ở client.
- **Có thể xác minh mà không cần tin tưởng.** Mọi byte thật đến kèm một **bằng chứng bao gồm (inclusion proof)** merkle bắt nguồn từ root generation on-chain. Client gấp bằng chứng lại thành root và chỉ chấp nhận nếu nó khớp với một root mà nó tin tưởng. Node không bao giờ được tin tưởng là đã trả về byte thật.
- **Có thể streaming ở bất kỳ kích thước nào.** Nội dung được đọc theo các chunk có giới hạn, căn chỉnh theo 64 KiB với sự tiếp nối tường minh. Một tài nguyên một kilobyte và một capsule một trăm megabyte được đọc bằng cùng một vòng lặp, và không có phản hồi đơn lẻ nào là không giới hạn.

## Nó khớp với dig-store như thế nào {#how-it-fits-with-digstore}

dig-store cho bạn **định dạng**: một store được mã hóa, định địa chỉ theo nội dung, biên dịch thành một capsule `.wasm` duy nhất tự bảo vệ chính nó, được định địa chỉ bằng một URN mà *URN chính là khóa*. dig RPC là cách capsule đó được **phục vụ trên mạng lưới** mà không cần tin tưởng host:

1. Bạn biên dịch một store và neo một generation on-chain (một singleton DataLayer CHIP-0035). **Content root** của nó là điểm neo tin tưởng.
2. Một node lưu trữ capsule và phơi bày nó qua dig RPC.
3. Một người đọc dẫn xuất `retrieval_key = sha256(urn)`, gọi `dig.getContent`, tái lắp ráp ciphertext đã stream, **xác minh bằng chứng bao gồm dựa trên root on-chain**, và **giải mã bằng khóa dẫn xuất từ URN** — hoàn toàn ở phía client.

Node chỉ biết một hash; nó không bao giờ biết những gì nó đã phục vụ.

## Một lần đọc trong một lệnh gọi {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

Client lặp lại trên `next_offset` cho đến khi `complete`, xác minh `inclusion_proof` dựa trên các byte đã tái lắp ráp so với `root`, rồi giải mã. Kết quả với `"decoy": true` nghĩa là *không tìm thấy* — dừng lại và báo cáo đúng như vậy.

## Cách đọc tài liệu này {#how-to-read-these-docs}

- **[Các phương thức (Methods)](./methods.md)** — toàn bộ tập phương thức (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), tham số, và kết quả của chúng.
- **[Sử dụng RPC mạng công khai](./public-network-rpc.md)** — trỏ client của bạn vào `rpc.dig.net` (hoặc bất kỳ node nào), các endpoint, và tự vận hành một node.
- **[Streaming](./streaming.md)** — mô hình chunk, tái lắp ráp, xác minh bằng chứng, và một vòng lặp client tham chiếu.
- **[Tuân thủ (Conformance)](./conformance.md)** — những gì một node PHẢI triển khai để trở thành thành viên của đường đọc mạng lưới, cộng với CORS, lỗi, và mô hình ẩn danh đầy đủ.

:::note
dig RPC là một phần của [DIG Network](https://dig.net). Đặc tả chuẩn tắc đầy đủ là mục [Protocol · dig RPC](../protocol/dig-rpc.md), giao diện nội dung của mạng lưới.
:::

## Liên quan {#related}

- [Các phương thức (Methods)](./methods.md) — mọi phương thức dig RPC, tham số, và kết quả của nó
- [Streaming](./streaming.md) — mô hình chunk, tái lắp ráp, và xác minh bằng chứng
- [Tuân thủ & Bảo mật](./conformance.md) — mô hình ẩn danh và những gì một node phải triển khai
- [URN & Mã hóa](../digstore/format/urns-and-encryption.md) — URN đứng sau mỗi retrieval key
- [Khái niệm & thuật ngữ](../concepts.md) — định nghĩa dig RPC, capsule, và retrieval key
