---
sidebar_position: 1
title: Dành cho nhà phát triển ứng dụng
description: "Xuất bản một website hoặc ứng dụng bạn thực sự sở hữu — được mint on-chain như tài sản của riêng bạn, không phải thuê. Xây dựng và xem trước miễn phí; chỉ trả một mức giá $DIG đồng nhất nhỏ khi xuất bản, với các file được mã hóa ngay trong trình duyệt của bạn nên không host nào có thể đọc chúng."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - digstore
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# Dành cho nhà phát triển ứng dụng {#for-app-developers}

> **Xuất bản một website hoặc ứng dụng bạn THỰC SỰ SỞ HỮU** — được mint on-chain như tài sản của riêng bạn, không phải thuê. Xây dựng và xem trước **miễn phí**; chỉ trả một **mức giá $DIG đồng nhất** nhỏ khi xuất bản, với các file được **mã hóa ngay trong trình duyệt của bạn** nên không host nào có thể đọc chúng.

## Mô hình tư duy {#the-mental-model}

Một **[store](../concepts.md#store)** là danh tính vĩnh viễn của website của bạn — một singleton on-chain do bạn kiểm soát. Mỗi lần bạn xuất bản, bạn mint một **[capsule](../concepts.md#capsule)** bất biến = `storeId:rootHash`. Một store chỉ đơn giản là chuỗi các capsule bạn đã xuất bản theo thời gian.

Hai cửa ngõ dẫn đến **cùng một** vòng lặp xây-dựng-miễn-phí → xuất-bản-có-trả-phí:

- **Lộ trình web** — [DIGHUb](../concepts.md#dighub) tại [hub.dig.net](https://hub.dig.net): thả một thư mục đã build vào, xem trước miễn phí, kết nối ví chỉ ở bước Publish.
- **Lộ trình CLI / CI** — CLI [`digstore`](../concepts.md#digstore-cli) + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub deploy Action](../concepts.md#deploy-action).

Dựng khung, build, và xem trước không tốn **gì cả**. Bạn chỉ trả tiền khi xuất bản một capsule.

| Bạn đang làm | Chi phí |
|---|---|
| Dựng khung, build, xem trước một bản nháp | **Miễn phí** |
| Xuất bản capsule đầu tiên (mint một store) | **mức giá capsule đồng nhất bằng $DIG** + phí XCH nhỏ |
| Xuất bản mỗi bản cập nhật (một capsule mới) | **mức giá capsule đồng nhất bằng $DIG** + phí XCH nhỏ |

## Bắt đầu tại đây {#start-here}

- **[Bắt đầu nhanh — xuất bản một trang web trong 10 phút](../quickstart.md)** — lộ trình nhanh nhất, web hoặc CLI.

## Xuất bản từ web — DIGHUb {#publish-from-the-web--dighub}

[**Bắt đầu một store mới trong DIGHUb ↗**](https://hub.dig.net/new). Thả trang web đã build của bạn vào (thư mục `dist/` hoặc `build/` của bạn), nhận một **bản xem trước nháp miễn phí** trên đường đọc thực tế, và chỉ kết nối ví ở bước **Publish**. Xem hướng dẫn web trong [Bắt đầu nhanh → Xuất bản từ web](../quickstart.md#a-publish-from-the-web).

## Xuất bản từ CLI — digstore {#publish-from-the-cli--digstore}

Vòng lặp theo phong cách Git: `new` → `dev` → `init` → `commit`.

```sh
digstore new vite-react   # scaffold a runnable project — free, no mint
digstore dev              # preview on the real chia:// read path, live-reload — free
digstore init site --dir dist   # mint the store's first capsule (uniform price + XCH fee)
digstore commit -m "v1.1"       # publish an update — a new capsule
```

→ [Hướng dẫn nhanh CLI](../digstore/cli/quickstart.md) · [Toàn bộ luồng công việc dự án](../digstore/cli/project-workflow.md)

## Dựng khung một ứng dụng — 5 template {#scaffold-an-app--5-templates}

Bắt đầu từ một mẫu khởi đầu chạy được, có ví — `static`, `vite-react`, `next-static`, `nft-drop`, hoặc `dapp-window-chia` — qua `digstore new <template>` hoặc `npm create dig-app`.

→ [Dựng khung một ứng dụng](../build-a-dapp/scaffold.md)

## Xem trước miễn phí với `digstore dev` {#preview-free-with-digstore-dev}

`digstore dev` phục vụ dự án của bạn qua đường đọc DIG **thực thụ** (mã hóa → biên dịch → xác minh → giải mã) với live reload và một `window.chia` dev được tiêm sẵn. Những gì bạn thấy là những gì khách truy cập nhận được — và không có gì bị mint hay tốn tiền.

→ [Hướng dẫn nhanh CLI → phát triển & xem trước](../digstore/cli/quickstart.md)

## `dig.toml` — tệp manifest có thể commit {#digtoml--the-committable-manifest}

`dig.toml` ở gốc dự án của bạn chứa `store-id`, `output-dir`, `build-command`, `remote`, và các cấu hình khác — được chia sẻ bởi `digstore dev`, `digstore deploy`, và các template dựng khung. Nó **không chứa bí mật nào** (những thứ đó đến từ môi trường), nên hãy commit nó.

→ [Cấu hình dự án & giá trị thời điểm build](../digstore/cli/configuration.md)

## Cập nhật & phiên bản — mỗi lần xuất bản là một capsule mới {#updates--versions--each-publish-is-a-new-capsule}

Mỗi lần xuất bản niêm phong bản build hiện tại thành một **capsule bất biến mới** và tiến root on-chain của store của bạn thêm một bước. Các capsule cũ vẫn có thể đọc được; store luôn phân giải về capsule mới nhất trừ khi người đọc ghim một `rootHash` cụ thể.

→ [Neo on-chain](../digstore/cli/onchain-anchoring.md)

## Chi phí là gì {#what-it-costs}

Miễn phí để xây dựng và xem trước; một **mức giá đồng nhất bằng $DIG** cho mỗi capsule đã xuất bản, cộng với một khoản phí mạng XCH nhỏ — được gộp **nguyên tử** trong cùng một giao dịch chi tiêu on-chain. Mức giá đồng nhất trên mỗi capsule là do thiết kế (để độ dài capsule không tiết lộ gì về nội dung của bạn). Lấy $DIG trên TibetSwap, dexie.space, hoặc 9mm.pro.

→ [Lấy DIG ở đâu](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Tại sao mọi capsule đều cùng một mức giá?](../support/faq.md#why-uniform-price)

## Push-to-deploy từ GitHub Actions {#push-to-deploy-from-github-actions}

Thiết lập `dig-network/deploy-action` để mỗi lần push xuất bản một capsule mới — với một cơ chế bảo vệ `if-changed` khiến một bản build giống hệt byte-for-byte trở thành no-op (không tốn tiền).

→ [Triển khai từ GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Thêm một địa chỉ web `*.on.dig.net` (tùy chọn) {#add-a-ondignet-web-address-optional}

Store của bạn có thể truy cập được bằng địa chỉ [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) của nó ngay khi nó được xác nhận — không tốn thêm chi phí nào. Một handle `<name>.on.dig.net` thân thiện là một đợt đăng ký **tùy chọn, có trả phí** trong DIGHUb nằm trên nền đó.

→ [Tôi có thể dùng tên miền riêng của mình không?](../support/faq.md#can-i-use-my-own-domain)

---

## Đi sâu hơn: giao thức {#go-deeper-the-protocol}

Mô hình bằng ngôn ngữ đơn giản ở trên là tất cả những gì bạn cần để xuất bản. Khi bạn muốn tìm hiểu toàn bộ thiết kế:

- **"một store là một chuỗi các capsule"** → [Khái niệm & thuật ngữ](../concepts.md#capsule) · [Mô hình capsule & store](../digstore/format/store-structure.md)
- **"file được mã hóa trong trình duyệt của bạn"** → [URN & mã hóa](../digstore/format/urns-and-encryption.md)
- **"một mức giá đồng nhất + giao dịch $DIG nguyên tử"** → [Neo on-chain](../digstore/cli/onchain-anchoring.md#costs) · [Giao dịch store-coin CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Tất cả** → [Đi sâu vào giao thức](../protocol-deep-dive.md)
