---
sidebar_position: 6
title: Xử lý sự cố — thoát khỏi bế tắc
description: "Mỗi lỗi đều cho bạn một mã ổn định và một request-id gắn thẳng vào log server, các giao dịch chi tiêu on-chain được bảo vệ khỏi tình trạng đua (race-guarded) nên bạn không bao giờ trả tiền hai lần, và các bảo vệ tiền kiểm rõ ràng ngăn lãng phí capsule trước khi bạn chi $DIG."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Xử lý sự cố {#troubleshooting}

> Mỗi lỗi đều cho bạn một **mã ổn định** và một **request-id** gắn thẳng vào log server, các giao dịch chi tiêu on-chain được **bảo vệ khỏi tình trạng đua (race-guarded)** nên bạn không bao giờ trả tiền hai lần, và các **bảo vệ tiền kiểm** rõ ràng ngăn lãng phí capsule trước khi bạn chi $DIG.

## Mô hình tư duy — tìm lỗi của bạn qua mã của nó {#the-mental-model--find-your-failure-by-its-code}

Mọi bề mặt — dig RPC, digstore CLI, DIGHUb, trình tải `chia://`, SDK — đều ánh xạ một lỗi thành một **mã ỔN ĐỊNH** duy nhất. **Rẽ nhánh dựa trên mã, không bao giờ dựa vào thông điệp.** Một danh mục hợp nhất bao quát tất cả và cũng được công bố dưới dạng máy đọc được.

Các bảo vệ tiền kiểm (`digstore doctor`, `--dry-run`, `--if-changed`) và các điểm neo có thể tiếp tục lại nghĩa là một lần xuất bản bị kẹt hoặc no-op **không bao giờ âm thầm tốn tiền**.

## Các lỗi xuất bản thường gặp {#common-publishing-failures}

Thiếu tiền, hết thời gian chờ xác nhận (có thể tiếp tục lại — giao dịch chi tiêu của bạn không bị mất), và lỗi "root từ xa đã tiến thêm" không-fast-forward.

→ [Xử lý sự cố](../support/troubleshooting.md)

## Lỗi đọc & xác minh {#read--verify-failures}

Bằng chứng không khớp, lỗi giải mã/salt, và các phản hồi không tìm thấy / decoy.

→ [Lỗi đọc & xác minh](../support/troubleshooting.md#verification-failed)

## Sự cố ví & phiên làm việc {#wallet--session-issues}

Kết nối, xác thực lại, một yêu cầu bị từ chối, và các phiên chỉ-xem không thể ký.

→ [Phiên ví không thể ký](../support/troubleshooting.md#wallet-session)

## Kiểm tra tiền kiểm & chi phí — đừng lãng phí một capsule {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (môi trường + sự sẵn sàng), `--dry-run` (xem trước chi phí và capsule sẽ được tạo), và `--if-changed` (một bản build giống hệt byte-for-byte là no-op).

→ [Triển khai từ GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [Neo on-chain → chi phí & an toàn](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Tham khảo mã lỗi {#error-codes-reference}

Mã thoát CLI · RPC `-32xxx` · DIGHUb · dig-loader · SDK — một bảng hợp nhất duy nhất.

→ [Mã lỗi](../support/error-codes.md)

## Câu hỏi thường gặp {#faq}

Chi phí, bản dùng thử miễn phí, tại sao mức giá lại đồng nhất, lấy $DIG ở đâu, và "có testnet không?".

→ [Câu hỏi thường gặp](../support/faq.md)

## Nhận trợ giúp {#get-help}

Discord + GitHub, và cách gửi một báo cáo tốt — **không bao giờ dán bí mật**.

→ [Nhận trợ giúp](../support/get-help.md)

## Trạng thái & nhật ký thay đổi {#status--changelog}

→ [Trạng thái](../support/status.md) · [Nhật ký thay đổi](../support/changelog.md)

---

## Đi sâu hơn: giao thức {#go-deeper-the-protocol}

- **lỗi đọc & xác minh** → [Bằng chứng & bảo mật](../digstore/format/proofs-and-security.md) · [URN & mã hóa](../digstore/format/urns-and-encryption.md)
- **mã RPC `-32xxx`** → [các phương thức dig RPC](../rpc/methods.md) · [Tuân thủ](../rpc/conformance.md)
- **Tất cả** → [Đi sâu vào giao thức](../protocol-deep-dive.md) · [Khái niệm & thuật ngữ](../concepts.md)
