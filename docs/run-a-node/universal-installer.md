---
sidebar_position: 3
title: Install anywhere — the universal installer
description: "The cross-platform dig-node installer for Windows, macOS, and any Linux: one curl | sh (or a direct download), installs the service and the digstore CLI, and registers dig.local."
keywords:
  - universal installer
  - dig-node install
  - dig.local
  - dig-dns
  - Windows service
  - launchd
  - systemd
tags:
  - dig-node
  - dig-rpc
---

# Install anywhere — the universal installer

The cross-platform path — **Windows, macOS, and any Linux**. It detects your OS, installs the `dig-node` service (Windows service / `systemd` / `launchd`) and the `digstore` CLI, and needs no package manager.

```sh
curl -fsSL https://dig.net/install.sh | sh
```

This is the same self-contained `dig-installer` shipped on the [Releases page](https://github.com/DIG-Network/dig-installer/releases) — download and run it directly if you prefer not to pipe to a shell, or on Windows.

## `dig.local`

The installer registers **`dig.local`** for your machine so consumers on the same host resolve your node by name (`dig.local` → `localhost`) without hard-coding a port. This is what lets the [DIG Browser](../browser/chia-protocol.md) and extension prefer a local node automatically. → [Point a consumer at your node](./point-a-consumer.md)

:::note Pre-release
The hosted installers (`apt.dig.net`, `dig.net/install.sh`) are still being provisioned. Until they're live, build from source or grab a binary from the [dig-node Releases](https://github.com/DIG-Network/dig-node/releases). The commands here are the real, intended ones.
:::

## Browse `.dig` names directly

Add `--with-dig-dns` to also install [`dig-dns`](https://github.com/DIG-Network/dig-dns)
— a local `*.dig` name resolver — as an OS service (Windows Service / macOS
LaunchDaemon / Linux systemd):

```sh
curl -fsSL https://dig.net/install.sh | sh -s -- --with-dig-dns
```

This lets a browser open `http://<storeId>.dig/<path>` directly: dig-dns resolves the
store's chain-anchored root and serves its content from your dig-node. The installer
wires OS split-DNS (or an NRPT rule on Windows) and, as a fallback, a PAC proxy file
for browsers that bypass the OS resolver (e.g. a browser forcing DNS-over-HTTPS) —
either path alone is enough for `.dig` URLs to load. It never edits `/etc/hosts`,
never rewrites URLs, and never intercepts TLS. Run `dig-dns doctor` any time to check
which path is live and get a fix hint for what isn't.

## On Debian-family systems

Prefer the signed, `apt upgrade`-able native path: → [Install on Ubuntu/Debian via apt](./apt.md).

## Related

- [Run a node — overview](./index.md)
- [Configure dig-node](./configure.md) — ports, listeners, cache cap, upstream
- [Point a consumer at your node](./point-a-consumer.md) — shared `.dig` cache
