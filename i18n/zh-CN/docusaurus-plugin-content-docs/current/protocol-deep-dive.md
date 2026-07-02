---
sidebar_position: 1
title: "Protocol: Overview"
description: "DIG 协议被划分为七个自底向上的层次，兼具规范性与实现定义的内容。capsule（storeId:rootHash）是最基础的单位；主机保持盲态，读取方对照链上数据进行验证。这是权威的协议参考文档。"
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

# 协议：概览 {#protocol-overview}

这是 DIG 协议的**规范性说明**，定义为**自底向上的七个层次**。每一层都以其**规范性的 crate/文件**作为标准参考。

:::info 这是权威的协议参考文档
本部分是该网络实际运行方式的权威来源。它按照网络实际运行的样子记录协议，并附带指向规范实现的 `file:line` 引用。
:::

## 最基础的单位：capsule {#the-fundamental-unit-the-capsule}

有一个概念贯穿每一层：**[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`，规范写法为 `storeId:rootHash`。**store** 是一系列有序排列（从旧到新）的 capsule，每次提交对应一个；它的身份标识 `store_id` *就是* Chia 上的一个 CHIP-0035 DataLayer singleton launcher id。身份、编译、定价、检索、缓存和溯源全部都是**按 capsule** 来定义的。

## 核心论点：盲态主机、客户端验证、链上锚定根哈希 {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **盲态主机。** 主机只持有以哈希为键的不透明密文。它不持有任何 URN 或密钥，仅原样中继 capsule 自身的输出，也无法分辨命中与未命中。协议中不存在 `decoy` 字段，也没有 CDN —— 内容只通过 [dig RPC](./protocol/dig-rpc.md) 提供服务。
- **客户端验证。** 每一个字节都会在读取方的设备上，使用针对该资源的 Merkle 包含性证明，对照链上根哈希进行校验，然后再完成认证解密。信任永远不会建立在服务源之上。
- **链上锚定根哈希。** 受信任的根哈希**只**来自 Chia 上的 CHIP-0035 singleton（通过 coinset.org 解析获得），而绝不来自服务端所提供的"最新版本"。

## 七个层次 {#the-seven-layers}

| # | 层次 | 定义内容 | 规范参考 |
|---|---|---|---|
| 0 | [身份与命名](./protocol/identity-and-naming.md) | store、capsule、generation；`store_id` = launcher id | `digstore-core::capsule`、`::urn` |
| 0 | [URN 与寻址](./protocol/urn-and-addressing.md) | `urn:dig:chia:…` 语法；不含根哈希的 `retrieval_key` | `digstore-core::urn`、`lib.rs` |
| 1 | [密码学](./protocol/cryptography.md) | HKDF 密钥派生函数；AES-256-GCM-SIV 加密封装 | `digstore-core::crypto` |
| 1 | [Merkle 包含性证明](./protocol/merkle-proofs.md) | D5 逐资源叶子节点；NODE_TAG 折叠计算 | `digstore-core::merkle` |
| 1 | [BLS 签名与 DST](./protocol/bls-signatures.md) | Chia AugScheme；五种角色 DST | `digstore-crypto::bls` |
| 2 | [capsule 格式](./protocol/capsule-format.md) | DIGS 数据分段（BINDING D1） | `digstore-core::datasection` |
| 2 | [自我防护模块](./protocol/self-defending-module.md) | 固定大小的混淆处理；服务端 guest | `digstore-compiler`、`digstore-guest` |
| 4 | [链上锚定](./protocol/on-chain-anchoring.md) | store = singleton；capsule = 根哈希推进 | `chip35_dl_coin`、`digstore-chain` |
| 4 | [DIG CAT 支付与定价](./protocol/dig-cat-payment.md) | 按 capsule 计价、动态调整、锚定美元 | `chip35_dl_coin::dig` |
| 6 | [dig RPC](./protocol/dig-rpc.md) | 机器接口（JSON-RPC 2.0） | hub `retrieval`、`dig-node` |
| 5 | [§21 传输与推送](./protocol/transport-and-push.md) | `dig://` 定位符、REST、push v1 | `digstore-remote` |
| 7 | [DIG 节点对等网络](./protocol/peer-network.md) | mTLS 对等身份、NAT 穿透、STUN、introducer、中继协议、对等 RPC | `dig-gossip`、`dig-relay`、`dig-nat`、`dig-node` |
| 6 | [验证与溯源](./protocol/verification-and-provenance.md) | 四道有序的完整性关卡 | `digstore-core::merkle`、`dig-node` |
| 6 | [盲态主机模型](./protocol/blind-host-model.md) | 提供者匿名性；解析器；`/v1` 控制平面 | hub `retrieval`/`resolver`/`api` |
| — | [一致性与对等实现](./protocol/conformance-and-parity.md) | 跨实现的一致性纪律 | 固定的黄金基准数据、OpenRPC diff |

（第 3 层和 §21 传输层与读取路径相互交织；表格将它们归类到读者最先遇到的位置。完整的层级编号见各自页面。）

## capsule 如何流经各层 {#how-a-capsule-flows-through-the-layers}

一位发布者对内容进行**分块加密**（L1），封装成一个**capsule 格式**（L2），该格式能够**自我提供服务**（L3），随后被**锚定**上链（L4），并通过 §21 传输层**推送**出去（L5）。任何客户端都可以通过 dig RPC**读取**它，并完全在客户端**验证**它对照链上锚定根哈希的正确性（L6）。每一个密码学常量在生产者、主机和验证者之间都只有**一处**定义 —— 这就是 [C8 一致性不变式](./protocol/conformance-and-parity.md)。

## 术语说明 {#terminology}

- **`chia://`** —— 网络**内容**地址（浏览器打开的形式）。
- **`dig://`** —— §21 **传输层**定位符（CLI/对等平面）*同时也是* DIG Browser 内部的页面协议 —— 两种不同的用途，绝不作为内容地址。
- **`urn:dig:`** —— 前两者共同派生自的 URN 命名空间。
- **store / capsule** —— 身份及其不可变的 generation。
- **$DIG** —— 每个 capsule 需要支付的 CAT 代币；**DigStore** —— 该 store 的格式名称。

## 相关链接 {#related}

- [概念与术语表](./concepts.md) —— 每个实体只定义一次
- [身份与命名](./protocol/identity-and-naming.md) —— 第 0 层，规范文档的起点
- [dig RPC](./protocol/dig-rpc.md) —— 协议的机器接口
- [DIG 节点对等网络](./protocol/peer-network.md) —— 节点如何互相发现和连接（mTLS、NAT 穿透、中继）
- [一致性与对等实现](./protocol/conformance-and-parity.md) —— 跨实现的一致性纪律
