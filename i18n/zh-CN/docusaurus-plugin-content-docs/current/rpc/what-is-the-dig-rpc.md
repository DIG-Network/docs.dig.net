---
sidebar_position: 1
title: What is the dig RPC?
description: "用于读取 DigStore capsule 的全网统一读取接口，基于 JSON-RPC 2.0；天生盲态、无需信任即可验证，且可在任意大小下流式传输。"
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

# 什么是 dig RPC？ {#what-is-the-dig-rpc}

:::info 规范性文档
本页是概览性介绍。权威的机器接口规范 —— 方法列表、分块传输对象、节点画像以及 OpenRPC 文档 —— 参见 [协议 · dig RPC](../protocol/dig-rpc.md)。
:::

**dig RPC 是用于直接从已托管的 DigStore `.dig` capsule 中读取内容的全网统一接口。** 它是一个通过 HTTPS `POST` 传输的 [JSON-RPC 2.0](https://www.jsonrpc.org/specification) 服务。

每一个托管 capsule 的节点 —— 无论是位于 `https://rpc.dig.net` 的参考节点，还是任何第三方节点 —— 都公开**相同语义的相同方法**。基于该接口编写的客户端只需通过一个端点即可读取整个网络的数据。这里没有 CDN；DIG 上的所有内容服务都通过 dig RPC 完成。

它提供三类服务：

| 你已有… | 你调用… | 你会得到… |
|---|---|---|
| 一个资源的**检索键**（`sha256(urn)`） | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | 该资源的密文 + 一份 Merkle 包含性证明（以及 ZK 执行证明），以分块方式流式传输 |
| 一个 **store id + generation 根哈希** | [`dig.getCapsule`](./methods.md#diggetcapsule) | 该 generation 对应的整个 `.dig` capsule，以分块方式流式传输 |
| 一个 **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | 公开的发现清单 / store 元数据清单 / store 的已确认 generation 列表 |

## 定义它的三个特性 {#three-properties-that-define-it}

- **天生盲态。** 节点只提供以哈希为键的不透明密文。它从未见过 URN、解密密钥或明文。一次未命中的请求会得到一个确定性的、无法区分的**诱饵（decoy）**流作为响应 —— 而不是 `404` —— 因此读取路径永远不会成为一个"是否存在"的判别源。所有解密和证明验证都发生在客户端。
- **无需信任即可验证。** 每一个真实字节都伴随着一份根植于链上 generation 根哈希的 Merkle **包含性证明**。客户端会将该证明折叠计算到根哈希，只有当结果与其信任的根哈希一致时才接受。节点永远不需要被信任其返回的是真实字节。
- **可在任意大小下流式传输。** 内容以有界的、64 KiB 对齐的分块形式读取，并带有明确的续传标记。一个一千字节的资源和一个上百兆字节的 capsule 都通过同一套循环来读取，且没有任何一次响应是无界的。

## 它与 DigStore 如何配合 {#how-it-fits-with-digstore}

DigStore 提供**格式**：一个内容可寻址、加密的 store，编译为单一的自我防护 `.wasm` capsule，通过一个 URN 寻址，*URN 本身就是密钥*。dig RPC 则是该 capsule 在网络上**如何被提供服务**而无需信任主机的方式：

1. 你编译一个 store，并在链上锚定一个 generation（一个 CHIP-0035 DataLayer singleton）。它的**内容根哈希**就是信任锚点。
2. 一个节点托管该 capsule，并通过 dig RPC 对外提供服务。
3. 读取方计算出 `retrieval_key = sha256(urn)`，调用 `dig.getContent`，重组流式传输回来的密文，**对照链上根哈希验证包含性证明**，并**使用由 URN 派生出的密钥解密** —— 全部在客户端完成。

节点只知道一个哈希值；它从未知道自己提供的内容是什么。

## 一次调用完成一次读取 {#a-read-in-one-call}

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

客户端会循环调用直到 `next_offset` 显示 `complete`，然后对照 `root` 验证重组后字节的 `inclusion_proof`，最后再解密。如果结果中 `"decoy": true`，则意味着*未找到* —— 应停止并如实报告。

## 如何阅读本文档 {#how-to-read-these-docs}

- **[方法列表](./methods.md)** —— 完整的方法集合（`dig.getContent`、`dig.getProof`、`dig.getProofStatus`、`dig.getCapsule`、`dig.getManifest`、`dig.getMetadata`、`dig.listCapsules`、`dig.health`、`dig.methods`）、各自的参数和返回结果。
- **[使用公共网络 RPC](./public-network-rpc.md)** —— 将你的客户端指向 `rpc.dig.net`（或任意节点）、各个端点，以及如何自行运营一个节点。
- **[流式传输](./streaming.md)** —— 分块模型、重组、证明验证，以及一个参考客户端循环实现。
- **[一致性](./conformance.md)** —— 节点若要成为该网络读取路径的一员，必须实现哪些内容，以及 CORS、错误和完整的盲态模型。

:::note
dig RPC 是 [DIG Network](https://dig.net) 的一部分。完整的规范性说明位于[协议 · dig RPC](../protocol/dig-rpc.md)部分，即网络内容接口。
:::

## 相关链接 {#related}

- [方法列表](./methods.md) —— 每一个 dig RPC 方法、其参数与返回结果
- [流式传输](./streaming.md) —— 分块模型、重组与证明验证
- [一致性与安全](./conformance.md) —— 盲态模型与节点必须实现的内容
- [URN 与加密](../digstore/format/urns-and-encryption.md) —— 每个检索键背后的 URN
- [概念与术语表](../concepts.md) —— dig RPC、capsule 与检索键的定义
