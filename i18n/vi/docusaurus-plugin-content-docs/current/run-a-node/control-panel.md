---
sidebar_position: 8
title: Bảng điều khiển dig-node
description: "Quản lý dig-node cục bộ của bạn từ Bảng điều khiển của DIG Chrome extension: dung lượng bộ nhớ đệm .dig được dự trữ và loại bỏ theo LRU, thượng nguồn, kho lưu trữ được host, đồng bộ hóa, peer, trạng thái trực tiếp, và ghép nối token điều khiển."
keywords:
  - bảng điều khiển dig-node
  - bộ nhớ đệm dig
  - loại bỏ theo LRU
  - dung lượng bộ nhớ đệm dự trữ
  - ghép nối token điều khiển
  - kho lưu trữ được host
  - đồng bộ hóa node
  - peer của node
tags:
  - dig-node
  - browser
  - dig-rpc
---

# Bảng điều khiển dig-node

DIG Chrome extension bao gồm một **Bảng điều khiển** cho dig-node cục bộ của bạn. Từ đó bạn có thể xem trạng thái trực tiếp của node, quyết định dành bao nhiêu dung lượng đĩa cho nội dung được lưu trong bộ nhớ đệm, và — sau một bước ghép nối chỉ cần làm một lần — quản lý thượng nguồn của node, các kho lưu trữ mà nó host, việc đồng bộ hóa và các peer của nó. Việc sử dụng hằng ngày không cần đến dòng lệnh.

Bảng điều khiển là phiên bản tích hợp sẵn trong tiện ích mở rộng, tương đương với màn hình quản lý node của DIG Browser: nó giao tiếp với node đang chạy trên chính máy của bạn, nên mọi thứ đều ở lại cục bộ.

## Mở bảng điều khiển

1. Mở tiện ích mở rộng.
2. Vào tab **Network** (Mạng) và chọn **Control** (Điều khiển). (Cửa sổ popup thu gọn chỉ hiện bản tóm tắt; dùng **Mở bảng điều khiển** để xem từng phần ở chế độ toàn màn hình.)

Bảng điều khiển tự động phát hiện node:

- **Node đang chạy** → bạn sẽ thấy màn hình quản lý.
- **Không tìm thấy node nào** → bạn sẽ thấy một trang ngắn hướng dẫn cách cài đặt node. Việc duyệt web vẫn hoạt động bình thường — các lượt đọc nội dung sẽ chuyển về dùng mạng công cộng; node chỉ cần thiết cho màn hình quản lý bên dưới.

## Trạng thái trực tiếp

Ở trên cùng, một chỉ báo trực tiếp cho biết node của bạn đang ở trạng thái **Đã kết nối**, **Đang kết nối** hay **Đã ngắt kết nối**, cùng với địa chỉ và phiên bản của nó. Chỉ báo này tự cập nhật — khởi động hoặc dừng node, và chỉ báo sẽ thay đổi trong vài giây, không cần mở lại bảng điều khiển hay tải lại trang.

## Dự trữ dung lượng đĩa cho nội dung được lưu trong bộ nhớ đệm (bộ nhớ đệm và LRU)

Node của bạn giữ một bộ nhớ đệm cục bộ cho nội dung mà nó đã lấy về, để những lần truy cập lại là tức thì và bạn cũng góp phần phục vụ nội dung đó. Bộ nhớ đệm có một **dung lượng dự trữ** — mức trần cho lượng đĩa mà nó được phép dùng. Khi bộ nhớ đệm vượt quá mức trần này, node sẽ tự động loại bỏ trước tiên các mục **ít được dùng gần đây nhất** (chính sách "LRU"), nhờ đó dung lượng bạn dự trữ không bao giờ bị vượt quá, còn nội dung bạn thực sự dùng thì vẫn được giữ trong bộ nhớ đệm.

Phần này khả dụng ngay lập tức — không cần ghép nối.

**Xem lượng đã dùng.** Một thanh sẽ hiển thị dung lượng đã dùng so với mức trần dự trữ, cùng vài con số trực tiếp khác: có bao nhiêu mục trong bộ nhớ đệm, tổng dung lượng của chúng, đã loại bỏ bao nhiêu kể từ khi node khởi động, và số lần trúng/trượt bộ nhớ đệm.

**Đặt mức trần dự trữ.** Nhập một dung lượng mới và áp dụng. Mức tối thiểu là **64 MiB**; giá trị nhỏ hơn sẽ được nâng lên mức sàn này. Hạ mức trần xuống thấp hơn lượng đang dùng sẽ kích hoạt việc loại bỏ các mục cũ nhất cho đến khi lượng dùng vừa khít.

**Xem lại và xóa các mục trong bộ nhớ đệm.** Danh sách các mục trong bộ nhớ đệm hiển thị dung lượng, thời điểm dùng lần cuối, và **thứ tự loại bỏ** của từng mục (vị trí `0` là mục sẽ bị xóa tiếp theo). Bạn có thể:

- **Loại bỏ một mục** — xóa ngay một mục trong bộ nhớ đệm.
- **Xóa tất cả** — làm trống toàn bộ bộ nhớ đệm.

Xóa các mục chỉ giải phóng đĩa cục bộ; bất cứ thứ gì bạn truy cập lại đều đơn giản là được lấy về lại.

:::tip
Hãy dành cho bộ nhớ đệm càng nhiều dung lượng càng tốt trên một máy mà bạn thường xuyên duyệt web — mức dự trữ lớn hơn nghĩa là ít phải lấy lại nội dung hơn và nhiều nội dung được phục vụ cục bộ hơn. Trên một máy có dung lượng hạn chế, hãy đặt mức dự trữ nhỏ hơn; LRU sẽ giữ lại các mục hữu ích nhất và loại bỏ phần còn lại.
:::

## Quản lý node (cần ghép nối)

Các phần còn lại thay đổi cấu hình của node, vì vậy chúng cần sự cho phép rõ ràng từ bạn. Vì tiện ích mở rộng chạy trong sandbox của trình duyệt, nó không thể đọc trực tiếp tệp quyền cục bộ của node — thay vào đó bạn **ghép nối** nó một lần. Việc ghép nối cấp cho tiện ích mở rộng một thông tin xác thực riêng, có phạm vi giới hạn và có thể thu hồi; nó không bao giờ để lộ khóa chủ của node, và chỉ có thể được phê duyệt từ chính máy tính đang chạy node.

### Ghép nối tiện ích mở rộng với node của bạn

1. Trong Bảng điều khiển, chọn **Ghép nối**. Tiện ích mở rộng sẽ hiện một **mã 6 chữ số** và một id ghép nối.
2. Trên máy tính đang chạy node, trong một terminal, chạy `dig-node pair` để liệt kê các yêu cầu đang chờ (hoặc chạy trực tiếp `dig-node pair approve <pairing-id>`).
3. Xác nhận mã hiển thị trong terminal **khớp** với mã trong tiện ích mở rộng, rồi phê duyệt. Sự khớp này chính là biện pháp bảo vệ của bạn: nó đảm bảo bạn đang phê duyệt *đúng* tiện ích mở rộng này và không phải cái nào khác.
4. Bảng điều khiển tự động chuyển sang trạng thái đã ghép nối. Thông tin xác thực chỉ được lưu bởi tiện ích mở rộng.

Mã ghép nối sẽ **hết hạn sau vài phút**; nếu mã của bạn hết hạn trước khi được phê duyệt, hãy chọn **Ghép nối** lại để lấy mã mới.

Để ngừng dùng thông tin xác thực đó, chọn **Hủy ghép nối** trong bảng điều khiển (thao tác này chỉ quên nó ở phía cục bộ). Để thu hồi nó ngay trên node, chạy `dig-node pair revoke <token-id>` trên máy tính đó — bảng điều khiển sẽ quay về trạng thái chưa ghép nối ở lần thao tác tiếp theo.

:::note
Ghép nối chỉ cần thiết cho các phần quản lý bên dưới. Trạng thái trực tiếp và các điều khiển bộ nhớ đệm/LRU ở trên vẫn hoạt động mà không cần nó.
:::

### Thượng nguồn

Xem thượng nguồn mà node đang lấy nội dung về, và đặt một thượng nguồn khác. Thượng nguồn đã thay đổi sẽ có hiệu lực vào lần khởi động tiếp theo của node.

### Kho lưu trữ được host

Xem các kho lưu trữ mà node của bạn đang giữ và ghim, ghim một kho lưu trữ mới (để node giữ và phục vụ nó), bỏ ghim một kho lưu trữ, và kiểm tra trạng thái của bất kỳ kho lưu trữ nào. Ghim một phiên bản cụ thể sẽ lấy trước phiên bản đó để nó sẵn sàng phục vụ.

### Đồng bộ hóa

Xem liệu việc đồng bộ hóa toàn bộ kho lưu trữ có xác thực có khả dụng hay không, và với một phiên bản cụ thể, kích hoạt một lần đồng bộ hóa để node lấy về và lưu vào bộ nhớ đệm.

### Peer

Xem trạng thái mạng peer của node bạn — kết nối của nó tới relay để có thể được tiếp cận khi ở sau một router gia đình, và các peer mà nó đang kết nối tới.

## Liên quan

- [Quản lý node của bạn](./manage.md) — các thao tác quản trị `control.*` và cách trình duyệt điều khiển chúng
- [Trỏ một consumer tới node của bạn](./point-a-consumer.md) — thiết lập tiện ích mở rộng, trình duyệt, hoặc CLI để dùng node của bạn
- [Cấu hình dig-node](./configure.md) — cổng, mức trần bộ nhớ đệm, và thượng nguồn
