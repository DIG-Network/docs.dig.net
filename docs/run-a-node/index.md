---
sidebar_position: 1
title: Run a DIG node
description: "What a dig-node is, why you'd run one, and how to install it — the apt repository for Ubuntu/Debian or the cross-platform universal installer."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Run a DIG node

A **dig-node** is the DIG Network's content **server** — the supply side of the network. It hosts capsules, keeps a local `.dig` cache, and exposes the [dig RPC](../rpc/what-is-the-dig-rpc.md) so anything that reads DIG content can read it from you. It runs headless (no browser, no UI) as a background service — a seedbox for the content you publish or want to help serve.

It is the counterpart to the **consumers** — the [DIG Browser](../browser/chia-protocol.md) and the browser extension — which fetch ciphertext + proofs, verify against the on-chain root, decrypt locally, and render. You do **not** need a dig-node to read DIG content: a consumer alone works fine, falling back to the public reference node at `rpc.dig.net`. You run a dig-node to **serve** — and when one is present on the same machine, the consumer reads from it (local, offline-friendly, and contributing to the network) and they share one `.dig` cache.

:::info Serving vs. consuming
- **dig-node** = serves content + exposes the dig RPC. Headless background service.
- **DIG Browser / extension** = consume content (verify + decrypt locally). No local node required.

When both are installed, the browser/extension read from your local dig-node; otherwise they read from `rpc.dig.net`. Either way every byte is verified client-side against the chain — the source is never trusted.
:::

## Install it

| Your machine | Use |
|---|---|
| **Ubuntu / Debian** | The native **[apt repository](./apt.md)** — `apt install dig-node digstore`, auto-enabled as a systemd service. |
| **Windows / macOS / Linux (any)** | The cross-platform **[universal installer](#universal-installer-any-os)** — one `curl \| sh` (or download) for every OS. |

Both install the same `dig-node` service plus the `digstore` CLI. apt is the Debian-native path (signed, `apt upgrade`-able); the universal installer covers everything else.

### apt (Ubuntu / Debian) — recommended on Debian-family systems

The native path: a signed apt repository at `apt.dig.net`. It installs `dig-node` as a managed **systemd service** and keeps it updated with `apt upgrade`.

→ **[Install on Ubuntu/Debian via apt](./apt.md)**

### Universal installer (any OS) {#universal-installer-any-os}

The cross-platform path — Windows, macOS, and any Linux. It detects your OS, installs the `dig-node` service (Windows service / `systemd` / `launchd`) and the `digstore` CLI, and needs no package manager:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

This is the same self-contained `dig-installer` shipped on the [Releases page](https://github.com/DIG-Network/dig-installer/releases) — download and run it directly if you prefer not to pipe to a shell, or on Windows.

:::note Pre-release
The hosted installers (`apt.dig.net`, `dig.net/install.sh`) are still being provisioned. Until they're live, build from source or grab a binary from the [dig-node Releases](https://github.com/DIG-Network/dig-companion/releases). The commands here are the real, intended ones.
:::

## Just want to read content?

You don't need a node. Get the **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** and open any `chia://` address — it consumes from your local dig-node if you have one, else from `rpc.dig.net`. See [The `chia://` protocol](../browser/chia-protocol.md).

## Related

- [Install on Ubuntu/Debian via apt](./apt.md) — the Debian-native path + systemd service management
- [Using the public network RPC](../rpc/public-network-rpc.md) — the dig RPC your node speaks, and operating a node on the network
- [The chia:// protocol](../browser/chia-protocol.md) — how consumers address and open content
- [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) — the read interface in overview
- [Installing the CLI](../digstore/cli/install.md) — `digstore` on its own (publishing, not serving)
