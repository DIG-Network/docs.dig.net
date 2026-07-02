---
sidebar_position: 5
title: For content consumers
description: "打开由你自己的浏览器对照区块链验证的 chia:// 内容 —— 任何主机都无法篡改或伪造它，私密内容对主机保持私密，并且内容永久存在、可在任何地方重新托管，因此没有人能下线它或将你锁定在某个平台上。"
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

# 面向内容消费者 {#for-content-consumers}

> **打开由你自己的浏览器对照区块链验证的 `chia://` 内容** —— 任何主机都无法篡改或伪造它，私密内容对主机保持私密，并且内容永久存在、可在任何地方重新托管，因此没有人能下线它或将你锁定在某个平台上。

## 心智模型 {#the-mental-model}

粘贴一个 `chia://` 链接，内容就会直接从网络中获取 —— **内容可寻址**，并且在渲染之前会在**你自己的设备上**进行加密学验证。它是**失败即拒绝（fail-closed）**的：被篡改或无法解密的字节永远不会显示出来。

- **省略 `rootHash`** 即获取该 store 的*最新*版本：`chia://<storeId>/`。
- **包含 `rootHash`** 则可固定到某一个确切的、不可变的 [capsule](../concepts.md#capsule)：`chia://<storeId>:<rootHash>/`。

公开内容只需要这个链接即可访问。私密内容还需要一个秘密的 **`?salt=`** —— 类似密码的作用。

## 获取 DIG Browser 或扩展程序 {#get-the-dig-browser-or-the-extension}

- **[获取 DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** —— 一款内置了 `chia://` 支持和钱包的浏览器。
- **扩展程序**，支持 Chrome / Edge / Brave / Firefox —— 为你已经在使用的浏览器添加 `chia://` 解析能力。

## 打开 `chia://` 内容 —— 最新版本 vs 固定版本 {#open-chia-content--latest-vs-pinned}

地址的各种形式、简洁的 `chia://<store>/` 地址栏，以及何时应该固定一个 `rootHash`。

→ [chia:// 协议](../browser/chia-protocol.md)

## 内置页面、已验证徽章与防护标识 {#built-in-pages-the-verified-badge--shields}

`chia://home`、`chia://wallet`、`chia://settings`，以及展示当前 capsule 每个资源包含性证明验证结果的已验证徽章 / 防护标识。

→ [使用 window.chia](../browser/using-window-chia.md)

## 公开 vs 私密 —— 何时需要 `?salt=` 密钥 {#public-vs-private--when-you-need-a-salt-secret}

公开的 store 只需一个链接即可打开；私密的 store 需要用于派生解密密钥的秘密 salt。

→ [公开与私密 store](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [公开与私密有什么区别？](../support/faq.md#public-vs-private)

## 在本地运行内容（可选） {#run-content-locally-optional}

将你的浏览器/扩展指向一个本地 [dig-node](../concepts.md#dig-node)，以获得更快、更适合离线场景的读取体验 —— 它们共用同一个 `.dig` 缓存。读取内容时你从来*不需要*运行一个节点。

→ [运行一个节点](../run-a-node/index.md)

## 获取 $DIG {#get-dig}

*读取*内容不需要 $DIG。如果你想发布内容，可以在 **TibetSwap**、**dexie.space** 或 **9mm.pro** 上获取 $DIG。

→ [我在哪里可以获取 DIG？](../support/faq.md#where-do-i-get-dig)

---

## 深入了解：协议 {#go-deeper-the-protocol}

- **"对照区块链验证"** → [链上锚定](../digstore/cli/onchain-anchoring.md) · [证明与安全](../digstore/format/proofs-and-security.md)
- **"公开与私密的 salt"** → [URN 与加密](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"最新版本 vs 固定版本"** → [Generation 与根哈希](../digstore/format/store-structure.md#generations-and-root-hashes)
- **完整内容** → [协议深度解析](../protocol-deep-dive.md) · [概念与术语表](../concepts.md)
