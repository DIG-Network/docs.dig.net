---
sidebar_position: 1
title: Run a DIG node
description: "What a dig-node is, why you'd run one, and how to install it — the apt repository for Ubuntu/Debian or the cross-platform DIG Installer."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
  - DIG Installer
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Run a DIG node

> **Serve content provably and provider-blind** — you only ever touch indistinguishable ciphertext keyed by hashes, can attest faithful serving with execution proofs, and the client verifies everything against the chain, so trust never rests on your node.

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
| **Windows / macOS / Linux (any)** | The cross-platform **[DIG Installer](#universal-installer-any-os)** — one command installs the current `dig-node`, `dig-dns`, and the `dig-store` CLI. |
| **Ubuntu / Debian (x86-64)** | The native **[apt repository](./apt.md)** — ordinary `apt` packages you upgrade with the rest of the box. It currently serves an older `dig-node` than the DIG Installer does. |

The DIG Installer is the path to a current node on every platform. apt is the Debian-native alternative when you want `dig-node` managed by your package manager — see [what apt serves today](./apt.md#what-apt-serves-today) before choosing it.

### DIG Installer (any OS) {#universal-installer-any-os}

The cross-platform path — Windows, macOS, and Linux. The **DIG Installer** detects your OS and installs the full DIG stack in one run — the `dig-store` CLI, plus the `dig-node` and `dig-dns` boot-start services — with no package manager needed.

It registers system services and writes into a protected install root, so it needs administrator rights and stops without changing anything if it doesn't have them:

```sh
# macOS / Linux
curl -fsSL https://dig.net/install.sh | sudo sh
```

```powershell
# Windows — in a PowerShell opened with "Run as administrator"
irm https://dig.net/install.ps1 | iex
```

This is the same self-contained `dig-installer` shipped on the [Releases page](https://github.com/DIG-Network/dig-installer/releases) — download and run it directly if you prefer not to pipe to a shell. Doing so also opens a guided [GUI wizard](./universal-installer.md#gui-installer), if you'd rather click through than use flags.

→ **[Full installer reference — flags, platforms, service ids](./universal-installer.md)**

### apt (Ubuntu / Debian)

A signed apt repository at `apt.dig.net` installs `dig-node` as a managed **systemd service** on x86-64 Debian-family systems.

→ **[Install on Ubuntu/Debian via apt](./apt.md)**

## Check it works

Ask your node to open a real store — this one is a live DIG-hosted app:

```sh
dign open chia://6ed1e80d44840735bf3c94a38f93e9a7c2e1077872681edf7c5985a14d17513f/
```

Your node resolves the store, verifies it against the chain, and opens the result in your default browser. If a page loads, your node is serving.

`dign open` hands the address to your browser, so it is a check you watch rather than one you script. For a scriptable signal, ask the node for its status instead:

```sh
dign status --json
```

→ [More ways to verify + the health checks the installer runs](./universal-installer.md#an-always-on-service-verified-after-install)

## Just want to read content?

You don't need a node. Get the **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** and open any `chia://` address — it consumes from your local dig-node if you have one, else from `rpc.dig.net`. See [The `chia://` protocol](../browser/chia-protocol.md).

## Related

- [Install on Ubuntu/Debian via apt](./apt.md) — the Debian-native path + systemd service management
- [Install anywhere — the universal installer](./universal-installer.md) — Windows / macOS / any Linux + `dig.local`
- [DIG and your DNS](./dns.md) — dig-dns's split-DNS scope + its own encrypted upstream lookup
- [Point a consumer at your node](./point-a-consumer.md) — local-first reads + the shared `.dig` cache
- [Configure dig-node](./configure.md) — ports, listeners, cache cap, upstream
- [Self-host a remote origin](../rpc/dig-remote.md) — `digs serve` + dig:// clone/pull/push
- [Manage your node](./manage.md) — the control.* admin RPCs + the My Node UI
- [The dig-node Control Panel](./control-panel.md) — run your node from the DIG extension: live status, reserved cache space (LRU), and — once paired — upstream/hosted stores/sync/peers
- [Using the public network RPC](../rpc/public-network-rpc.md) — the dig RPC your node speaks, and operating a node on the network
- [Installing the CLI](../digstore/cli/install.md) — `dig-store` on its own (publishing, not serving)

## Go deeper: the protocol

- **"blind host & decoys"** → [The dig RPC blind serving model](../rpc/what-is-the-dig-rpc.md) · [Node conformance](../rpc/conformance.md)
- **"attest faithful serving"** → [Inclusion vs execution proofs](../inclusion-vs-execution-proofs.md)
- **"dig:// clone/pull/push"** → [The §21/§22 remote protocol](../rpc/dig-remote.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
