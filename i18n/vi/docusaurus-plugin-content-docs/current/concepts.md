---
sidebar_position: 1.5
title: Khái niệm & thuật ngữ
description: "Danh mục một trang cho các thực thể cốt lõi của DIG Network — capsule, store, generation, URN, retrieval key, dig RPC, giao thức chia://, và việc neo on-chain — mỗi thực thể được định nghĩa một lần và liên kết đến tài liệu chuyên sâu của nó."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Khái niệm & thuật ngữ {#concepts--glossary}

Trang này định nghĩa mọi thực thể cốt lõi của DIG Network **một lần duy nhất**, bằng ngôn ngữ đơn giản, và
liên kết mỗi thuật ngữ đến tài liệu đi sâu vào nó. Đây là xương sống dễ đọc dành cho con người của tài liệu —
và, vì mỗi thuật ngữ cũng được phát ra dưới dạng dữ liệu có cấu trúc máy đọc được, đây cũng là bản đồ mà một
agent có thể thu thập để học từ vựng của mạng lưới. Lướt qua để định hướng; theo liên kết để tìm hiểu sâu hơn.

## Capsule {#capsule}

Một **capsule** là một thế hệ (generation) store bất biến duy nhất: cặp `(storeId, rootHash)`, được viết theo dạng chuẩn
là `storeId:rootHash`. Đây là đơn vị nguyên tử của mạng lưới — về biên dịch (một module WASM kích thước cố định),
[định giá](./digstore/cli/onchain-anchoring.md) (một mức giá đồng nhất trên mỗi capsule để mint hoặc commit, thanh toán
bằng $DIG), truy xuất (một [URN](#urn) định danh một capsule), lưu đệm, và nguồn gốc. Một [store](#store) là *một chuỗi
các capsule*, mỗi capsule ứng với một lần commit. Định nghĩa này giống hệt nhau trên dig-store, dig RPC, và DIG
Browser. → [Capsule, đầy đủ](./intro.md#the-capsule)

## Store {#store}

Một **store** là một danh tính cùng với nội dung và lịch sử của nó: một chuỗi các [capsule](#capsule), mỗi capsule ứng
với một lần commit. Danh tính của nó là một **store id** dạng hex 64 ký tự, *chính là* launcher id của singleton Chia
on-chain — singleton trên chuỗi là thẩm quyền cho root hiện tại của store. Một store là tương đương của DIG cho một
website. → [Cấu trúc store](./digstore/format/store-structure.md)

## Generation {#generation}

Một **generation** là một trạng thái đã commit duy nhất của một [store](#store), được định danh bằng một **root hash**
(một Merkle root trên các lá per-resource của generation). Mỗi `commit` niêm phong nội dung hiện tại thành một
generation mới, chỉ-thêm-vào (append-only) — chính là thứ mà một [capsule](#capsule) định danh. Các generation phát
triển đơn điệu, giống như lịch sử Git. → [Generation & root hash](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

Một **URN** là địa chỉ *và* khóa của dig-store gộp trong một chuỗi:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. Nó vừa **định vị** một tài nguyên vừa **dẫn xuất khóa giải mã**
nó — sở hữu URN là điều kiện cần và đủ để đọc một tài nguyên công khai. Dạng viết tắt hướng-trình-duyệt là
[giao thức `chia://`](#chia-protocol). → [URN & Mã hóa](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

**Retrieval key** là `SHA-256(canonical_urn)` — địa chỉ duy nhất từng rời khỏi client. Nó định vị bản mã hóa
(ciphertext) của một tài nguyên mà không tiết lộ đường dẫn hay [URN](#urn) của nó. Nó *độc lập với root*, nên
cùng một key tìm thấy một tài nguyên xuyên suốt các [generation](#generation); các byte được phục vụ sau đó được
[xác minh bằng Merkle](#merkle-proof) dựa trên root chính xác. **Khóa giải mã** riêng biệt được dẫn xuất cục bộ
(HKDF) từ cùng một URN và không bao giờ được gửi đi. → [Hai giá trị, một chuỗi](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Mỗi [generation](#generation) xây dựng một cây Merkle với một lá cho mỗi tài nguyên, cam kết vào đúng những byte
*ciphertext* được phục vụ. Một **bằng chứng bao gồm (inclusion proof)** duy nhất đi kèm với mỗi tài nguyên được
phục vụ và chứng minh những byte đó thuộc về đúng root đó — vì vậy nội dung được xác minh mà không bao giờ cần
giải mã, và một node không bao giờ được tin tưởng là đã trả về byte thật. → [Merkle proof](./digstore/format/proofs-and-security.md)

## Neo on-chain {#anchoring}

Mỗi store là một **singleton trên Chia mainnet**. `digs init` mint nó (launcher id *trở thành* store id) và
mỗi `digs commit` neo một root [generation](#generation) mới on-chain dưới dạng một bản cập nhật singleton
CHIP-0035. Cả hai đều chờ cho đến khi được xác nhận và tốn tiền thật. Chuỗi là thẩm quyền cho root mới nhất của
một store. → [Neo on-chain](./digstore/cli/onchain-anchoring.md)

## Thanh toán DIG {#dig-payment}

**$DIG** là token của DIG Network (một CAT của Chia). Mint một [capsule](#capsule) (`init`) hoặc commit một capsule
tốn **mức giá đồng nhất trên mỗi capsule bằng $DIG**, được gộp **nguyên tử trong cùng một giao dịch chi tiêu
on-chain** với việc neo — không có giao dịch riêng biệt nào, và memo mang store id. → [Chi phí](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store` là công cụ dòng lệnh tạo, commit, chia sẻ, và đọc các store — một luồng công việc theo phong cách Git
(`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) trên định dạng store được mã hóa, on-chain. → [Tham khảo lệnh](./digstore/cli/command-reference.md) · [Hướng dẫn CLI](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` là **tệp manifest dự án có thể commit** ở gốc của một dự án — `store-id`, `output-dir`,
`build-command`, và các cấu hình dự án khác, được chia sẻ bởi `digs dev`, `digs deploy`, và các template
dựng khung. Nó **không chứa bí mật nào** (những thứ đó đến từ môi trường), nên an toàn để commit. → [Cấu hình dự án & giá trị thời điểm build](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) là **cửa ngõ JS** để bắt đầu một dự án DIG: nó dựng khung một mẫu khởi
đầu chạy được — một ứng dụng, một [`dig.toml`](#dig-toml), và (đối với các template có ví) [DIG SDK](#dig-sdk) đã
được kết nối sẵn — từ một trong năm template (`static`, `vite-react`, `next-static`, `nft-drop`,
`dapp-window-chia`). Dựng khung **miễn phí** — không mint, không cần chuỗi, không tốn tiền; bạn chỉ trả mức giá
capsule đồng nhất khi xuất bản một [capsule](#capsule). Đây là đối tác phía npm của lệnh `digs new` trong CLI
Rust. → [Dựng khung một ứng dụng](./build-a-dapp/scaffold.md)

## GitHub deploy Action {#deploy-action}

`dig-network/deploy-action` là GitHub Action **git-push-to-deploy**: nó cài đặt [CLI `dig-store`](#digstore-cli)
trên runner, chạy `digs deploy` để tiến store của bạn thêm một bước (không bao giờ mint), và báo cáo
[capsule](#capsule) đã xuất bản + URL + chi phí trở lại dưới dạng step outputs, một bình luận PR, một GitHub
Deployment, và một commit status. Với `if-changed` (mặc định), một bản build giống hệt byte-for-byte sẽ là
no-op — không tốn tiền. → [Triển khai từ GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK** (`@dignetwork/dig-sdk`) là gói npm có kiểu (typed) dành cho các nhà phát triển tích hợp: một
`ChiaProvider` (ưu tiên [`window.chia`](#window-chia) được tiêm sẵn, dự phòng bằng WalletConnect → Sage), một
`DigClient` (đọc nội dung đã được xác minh, mã hóa qua [dig RPC](#dig-rpc)), một `Paywall` (một trình trợ giúp
cấp cao cho trả-phí-để-mở-khóa / kiểm soát truy cập theo NFT, kết hợp provider với trình xây dựng spend), và
trình xây dựng spend chuẩn CHIP-0035 được re-export tại subpath `/spend`.
→ [Xây dựng một dapp trên Chia](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC** là giao diện đọc trên toàn mạng lưới: một dịch vụ JSON-RPC 2.0 qua HTTPS `POST` mà mọi node lưu trữ
đều nói cùng một giao thức giống hệt nhau. Nó phục vụ ciphertext + [bằng chứng bao gồm](#merkle-proof) theo
[retrieval key](#retrieval-key), toàn bộ [capsule](#capsule) theo `(storeId, root)`, và metadata khám phá — ẩn
danh theo thiết kế, được xác minh và giải mã ở phía client. **Đây là đường đọc phổ quát**: mọi capsule đã xuất
bản đều có thể đọc được ở đây qua địa chỉ [URN](#urn) / [`chia://`](#chia-protocol) của nó ngay khi nó được xác
nhận on-chain — không cần đăng ký và không tốn phí nào ngoài việc xuất bản capsule. [Handle `*.on.dig.net`](#on-dig-net)
thân thiện, tùy chọn là một cửa ngõ *nằm trên* đường đọc này; bản thân dig RPC luôn sẵn sàng. → [dig RPC là gì?](./rpc/what-is-the-dig-rpc.md)

## Giao thức chia:// {#chia-protocol}

`chia://` là lược đồ địa chỉ nội dung gốc của DIG Browser — mặt trước có thể gõ được của [URN `urn:dig:`](#urn).
Dán một liên kết `chia://<storeId>/` và trình duyệt sẽ lấy nội dung trực tiếp từ mạng lưới, định địa chỉ theo
nội dung và được xác minh bằng mật mã. → [Giao thức chia://](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` là provider ví Chia mà **DIG Browser** tiêm vào mọi trang. Nó nói
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), nên một ứng dụng web có thể
yêu cầu địa chỉ, chữ ký, và giao dịch chi tiêu của người dùng mà không cần thiết lập WalletConnect — một lựa
chọn thay thế cắm-và-chạy cho các ứng dụng đã hỗ trợ CHIP-0002. → [Sử dụng window.chia](./browser/using-window-chia.md)
· [Đặc tả provider window.chia](./protocol/window-chia-provider.md) (chuẩn tắc, có phiên bản)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) là ứng dụng web để xuất bản và quản lý
[capsule](#capsule) mà không cần CLI — tạo một capsule, triển khai một frontend, và xem các store của bạn trong
trình duyệt. Nó cũng là control plane có kiểm soát, phân bổ ngân sách cho các tác vụ bằng chứng thực thi ZK tốn
kém.

## dig-node {#dig-node}

Một **dig-node** là **server** nội dung của mạng lưới — phía cung. Nó lưu trữ [capsule](#capsule), giữ một bộ
nhớ đệm `.dig` cục bộ, và nói [dig RPC](#dig-rpc) giống hệt như `rpc.dig.net`. Bạn **không cần** một node để
đọc nội dung DIG (người dùng đọc sẽ dự phòng về `rpc.dig.net`); chạy một node giúp các lần đọc ưu tiên cục bộ
và đóng góp năng lực phục vụ. Host này **ẩn danh** — nó chỉ chuyển tiếp ciphertext + bằng chứng.
→ [Chạy một node](./run-a-node/index.md)

## Handle on.dig.net {#on-dig-net}

Một **handle on.dig.net** là một địa chỉ web thân thiện với con người, *tùy chọn, có trả phí* cho một
[store](#store): `<your-name>.on.dig.net`. Một store **không** tự động nhận được handle — bạn đăng ký handle
(một đợt đăng ký CHIP-54 / `on.dig.net` có trả phí trong [DIGHUb](#dighub)) và đăng ký đó gắn store vào tên đó.
Không đăng ký nghĩa là không có địa chỉ `*.on.dig.net`. Đây thuần túy là một cửa ngõ tiện lợi: store đã có thể
đọc được qua [dig RPC](#dig-rpc) bằng địa chỉ [URN](#urn) / [`chia://`](#chia-protocol) của nó dù có handle hay
không. (Handle tài khoản và slug store là các không gian tên riêng biệt và không tự động lộ ra một subdomain.)
→ [Tôi có thể lấy một địa chỉ `*.on.dig.net` không?](./support/faq.md#can-i-use-my-own-domain)

## Liên quan {#related}

- [Tổng quan DIG Network](./intro.md) — các thành phần cơ bản trong nháy mắt
- [Bắt đầu nhanh](./quickstart.md) — xây dựng và xem trước miễn phí, xuất bản một capsule ở cuối
- [Xây dựng một dapp trên Chia](./build-a-dapp/tutorial.md) — mọi thành phần cơ bản gắn kết vào một dapp đã xuất bản
- [dig-store là gì?](./digstore/what-is-digstore.md) — định dạng store một-file
- [dig RPC là gì?](./rpc/what-is-the-dig-rpc.md) — đường đọc của mạng lưới
- [Giao thức chia://](./browser/chia-protocol.md) — định địa chỉ nội dung trong trình duyệt
- [Nhận trợ giúp](./support/get-help.md) — các kênh cộng đồng và cách báo cáo

## Dành cho agent & LLM {#for-agents--llms}

Tài liệu này có thể được trích xuất bằng máy. Mỗi trang mang schema.org JSON-LD (trang này dưới dạng một tập hợp
`DefinedTerm`), và hai bản đồ được biên soạn có ở gốc trang web:

- [`/llms.txt`](pathname:///llms.txt) — một bản đồ markdown giàu liên kết của tài liệu ([quy ước llms.txt](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — các thực thể (khái niệm + tài liệu) và các cạnh có kiểu (`defines`, `part-of`, `requires`, `see-also`).
