---
sidebar_position: 2
title: Bắt đầu nhanh
description: "Xuất bản trang web đầu tiên của bạn trên DIG — miễn phí để xây dựng và xem trước, bạn chỉ trả mức giá capsule đồng nhất khi xuất bản. Lộ trình ưu tiên web (không cần ví để bắt đầu) cùng một lộ trình CLI song song."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Bắt đầu nhanh {#quickstart}

Xuất bản một trang web lên mạng lưới mà không host nào có thể đọc, thay đổi, hay gỡ xuống — trong khoảng mười phút.

**Bạn xây dựng và xem trước miễn phí.** Việc dựng khung (scaffolding) và xem trước không tốn gì cả; bạn chỉ trả **mức giá capsule đồng nhất bằng $DIG** vào đúng thời điểm bạn xuất bản một [capsule](./concepts.md#capsule) trên chuỗi. *Lặp lại miễn phí, xuất bản khi đã sẵn sàng.*

Có hai cách để làm điều này. Hầu hết mọi người bắt đầu trên web.

- **[A. Xuất bản từ web](#a-publish-from-the-web)** — trong [DIGHUb](./concepts.md#dighub), kết nối ví ở bước cuối. Phù hợp nhất cho trang web và frontend. ~10 phút.
- **[B. Xuất bản từ CLI](#b-publish-from-the-cli)** — `digstore` trên máy của bạn, có thể viết script và sẵn sàng cho CI. Phù hợp nhất cho lập trình viên và tự động hóa.

---

## A. Xuất bản từ web {#a-publish-from-the-web}

Lộ trình nhanh nhất: xây dựng và xem trước trong trình duyệt, chỉ nạp tiền vào ví ở bước cuối cùng.

### 1. Mở DIGHUb và bắt đầu một bản nháp — miễn phí, không cần ví {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**Bắt đầu một store mới trong DIGHUb ↗**](https://hub.dig.net/new). Thả trang web đã build của bạn vào (một thư mục các file tĩnh — `dist/` hoặc `build/` của bạn). DIGHUb cho bạn một **bản xem trước nháp miễn phí** thể hiện chính xác cách nó sẽ được phục vụ, không có gì on-chain và không tốn $DIG nào.

Bạn chưa cần ví. Lặp lại bản nháp bao nhiêu lần tùy thích — tải lại, xem trước lại — hoàn toàn miễn phí.

### 2. Xem trước trên đường đọc thực tế — vẫn miễn phí {#2-preview-it-on-the-real-read-path--still-free}

Bản xem trước render trang web của bạn qua đúng pipeline DIG thực thụ (mã hóa → biên dịch → xác minh → giải mã), vì vậy những gì bạn thấy chính là những gì khách truy cập nhận được. Nhấp qua lại, kiểm tra tài nguyên và định tuyến. Không có gì được xuất bản và không có gì bị tốn cho đến khi bạn chọn làm vậy.

### 3. Xuất bản — nạp tiền và kết nối ví {#3-publish--fund-and-connect-a-wallet}

Khi bản nháp đã ổn, nhấn **Publish**. Đây là bước duy nhất tốn phí:

- Kết nối một ví Chia (ví của bạn *chính là* tài khoản của bạn — không cần email, không cần mật khẩu).
- Chấp thuận giao dịch chi tiêu on-chain: **mức giá capsule đồng nhất bằng $DIG + một khoản phí XCH nhỏ**, trong một chữ ký duy nhất. Màn hình xuất bản hiển thị số lượng $DIG chính xác trước khi bạn ký.
- DIGHUb mint store của bạn và xuất bản **capsule** đầu tiên trên Chia mainnet.

Thiếu DIG? Màn hình xuất bản hiển thị số dư của bạn và nơi để nạp thêm. Xem [Lấy DIG ở đâu](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space, hoặc 9mm.pro.

### 4. Bạn đã trực tuyến {#4-youre-live}

Capsule của bạn giờ đã được neo (anchored) on-chain và **có thể đọc được ngay lập tức qua [dig RPC](./concepts.md#dig-rpc)** — bất kỳ ai cũng có thể lấy về và xác minh nó bằng [URN `urn:dig:`](./concepts.md#urn) hoặc địa chỉ [`chia://`](./browser/chia-protocol.md), không cần đăng ký và không phải trả thêm gì. URN vừa là địa chỉ *vừa là* khóa; chia sẻ nó là chia sẻ nội dung. Đường đọc là phổ quát và miễn phí; nó trực tuyến ngay khi capsule được xác nhận.

**Muốn một địa chỉ `*.on.dig.net` thân thiện với con người?** Đó là tùy chọn. Một store chỉ nhận subdomain `*.on.dig.net` khi bạn **đăng ký một handle** cho nó trong DIGHUb — một đợt đăng ký riêng, có trả phí, gắn store vào tên đó. Cho đến khi bạn đăng ký một handle, sẽ không có URL `*.on.dig.net` nào (địa chỉ URN / `chia://` ở trên luôn là cách chuẩn để truy cập nó). Xem [Tôi có thể dùng tên miền riêng của mình không?](./support/faq.md#can-i-use-my-own-domain).

**Để xuất bản một bản cập nhật sau này:** chỉnh sửa, xem trước bản nháp mới miễn phí, và Publish lại. Mỗi lần cập nhật được xuất bản là một capsule mới và lại tốn **mức giá capsule đồng nhất** một lần nữa — bạn chỉ trả tiền khi nâng cấp một bản nháp thành phiên bản vĩnh viễn trên chuỗi.

:::tip Tự động hóa nó
Khi store của bạn đã tồn tại, thiết lập [Triển khai từ GitHub Actions](./digstore/cli/deploy-from-github-actions.md) để mỗi lần push lên `main` sẽ xuất bản một capsule mới — git-push-to-deploy.
:::

---

## B. Xuất bản từ CLI {#b-publish-from-the-cli}

Cùng một luồng công việc nhưng từ terminal của bạn — có thể viết script và là nền tảng cho CI. CLI phản chiếu lộ trình web: xây dựng và xem trước không tốn gì; xuất bản một capsule tốn mức giá capsule đồng nhất bằng $DIG.

### 1. Cài đặt {#1-install}

```sh
# download the installer for your OS from the Releases page, then:
digstore --version
```

Xem [Cài đặt CLI](./digstore/cli/install.md) để biết trình cài đặt theo từng hệ điều hành và cách build từ mã nguồn.

### 2. Dựng khung và xem trước — miễn phí, không cần chuỗi, không tốn tiền {#2-scaffold-and-preview--free-no-chain-no-spend}

Dựng khung một dự án và xem trước cục bộ — **miễn phí, không mint, không cần chuỗi** — trước khi bạn phải trả bất cứ khoản nào:

```sh
digstore new <template>   # scaffold a wallet-wired project (static · vite-react · next-static · nft-drop · dapp-window-chia) — free, no mint
digstore dev              # watch + compile-on-save + serve the real chia:// read path, with an injected window.chia — free, live-reload
```

`new` viết ra một dự án chạy được (một `dig.toml` + một ứng dụng khởi đầu); `dev` phục vụ nó qua đường đọc DIG thực thụ (biên dịch → xác minh → giải mã) với live reload. Bạn chỉ trả mức giá capsule đồng nhất khi xuất bản (các bước tiếp theo). Hoặc build bằng toolchain quen thuộc của bạn (`npm run build` → `dist/`) rồi xuất bản kết quả đó.

:::tip Thích dùng npm hơn? Dùng `create-dig-app`
Nếu bạn quen với thế giới Node, `npm create dig-app@latest my-app -- --template vite-react` dựng khung cùng các template đó trực tiếp từ npm — không cần cài `digstore` để bắt đầu. Xem [Dựng khung một ứng dụng](./build-a-dapp/scaffold.md).
:::

### 3. Thiết lập một ví (chỉ cần khi xuất bản) {#3-set-up-a-wallet-only-needed-to-publish}

Xuất bản tốn tiền thật, nên bạn cần một seed và một ví đã nạp tiền trước:

```sh
digstore seed generate      # generate a fresh mnemonic (shown once — back it up)
digstore balance            # show your receive address; fund it with XCH + DIG
```

Xem [Neo on-chain](./digstore/cli/onchain-anchoring.md) để biết chi tiết về nhập, nạp tiền, và TTL.

### 4. Xuất bản capsule đầu tiên của bạn {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init` mint một singleton Chia trên mainnet — **launcher id trở thành store id của bạn** — và chờ cho đến khi được xác nhận.

### 5. Xuất bản các bản cập nhật {#5-ship-updates}

```sh
npm run build                      # produce dist/
digstore add -A                    # stage the whole content root
digstore commit -m "v1.1"          # publish a new capsule (uniform capsule price + XCH fee)
```

Đối với CI, một lệnh duy nhất thực hiện add → commit → push và in ra URL:

```sh
digstore deploy --output-dir dist --json   # advance an existing store from CI; never mints
```

Xem [Triển khai từ GitHub Actions](./digstore/cli/deploy-from-github-actions.md).

### 6. Đọc lại nội dung {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # a URN both locates AND decrypts
```

---

## Chi phí là gì {#what-it-costs}

| Bạn đang làm | Chi phí |
|---|---|
| Dựng khung, build, xem trước một bản nháp | **Miễn phí** |
| Xuất bản capsule đầu tiên (`init` / Publish trong DIGHUb) | **mức giá capsule đồng nhất bằng $DIG** + phí XCH nhỏ |
| Xuất bản mỗi bản cập nhật (`commit` / Publish lại) | **mức giá capsule đồng nhất bằng $DIG** + phí XCH nhỏ |

Mức giá **đồng nhất trên mỗi capsule** ở mọi nơi — xem [tại sao mức giá lại đồng nhất](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Gặp khó khăn? {#stuck}

- [Xử lý sự cố](./support/troubleshooting.md) — các lỗi thường gặp và cách khắc phục.
- [Câu hỏi thường gặp](./support/faq.md) — câu trả lời nhanh.
- [Nhận trợ giúp](./support/get-help.md) — cộng đồng và cách gửi báo cáo tốt.

## Liên quan {#related}

- [Khái niệm & thuật ngữ](./concepts.md) — định nghĩa capsule, store, URN, và thanh toán DIG
- [Dựng khung một ứng dụng (create-dig-app)](./build-a-dapp/scaffold.md) — bắt đầu một dự án có thể triển khai chỉ trong một lệnh (npm hoặc CLI)
- [Cài đặt CLI](./digstore/cli/install.md) — cài `digstore` lên máy của bạn
- [Neo on-chain](./digstore/cli/onchain-anchoring.md) — thiết lập ví, nạp tiền, và chi phí
- [Triển khai từ GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — xuất bản qua push trong CI
- [Hướng dẫn CLI](./digstore/cli/quickstart.md) — toàn bộ hành trình create-commit-read
