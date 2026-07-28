---
sidebar_position: 2
title: Install on Ubuntu/Debian (apt)
description: "Install dig-node and the dig-store CLI on Ubuntu/Debian from the apt.dig.net repository, and run dig-node as a managed systemd service."
keywords:
  - dig-node apt
  - apt.dig.net
  - install dig-node Ubuntu
  - install dig-node Debian
  - dig-node systemd
  - dig-store apt
tags:
  - dig-node
  - digstore-cli
  - dig-rpc
---

# Install on Ubuntu/Debian (apt)

On Ubuntu, Debian, and other Debian-family distributions, install the DIG ecosystem from the **`apt.dig.net`** repository. You get the `dig-node` service and the `dig-store` CLI as ordinary apt packages — signed, and upgraded with `apt upgrade` like anything else on the box. Installing `dig-node` sets up and **enables a systemd service** so your node starts on boot and stays running.

## What apt serves today {#what-apt-serves-today}

Check this before you choose apt, because the repository trails the current releases:

| Package | apt serves | Current release | Architectures |
|---|---|---|---|
| `dig-node` | 0.43.0 | 0.64.0 | `amd64` only |
| `dig-store` | 0.17.0 | 0.19.3 | `amd64`, `arm64` |

**Choose apt** when you want `dig-node` managed by your package manager on an x86-64 Debian-family box and an older node is acceptable.

**Choose the [DIG Installer](./universal-installer.md)** when you want the current `dig-node`, or you are on `arm64`, or you want the `dign` and `digd` short aliases, `dig-dns`, `dig.local`, and the `chia://` scheme handler — none of which are part of these apt packages.

## 1. Add the signing key

The repository is signed; add its public key to a dedicated keyring (the modern, per-repo way — no global `apt-key`):

```sh
curl -fsSL https://apt.dig.net/dig.gpg | sudo gpg --dearmor -o /usr/share/keyrings/dig.gpg
```

## 2. Add the apt source

Point apt at the repository, telling it to trust packages signed by the key you just added:

```sh
echo "deb [signed-by=/usr/share/keyrings/dig.gpg] https://apt.dig.net stable main" | sudo tee /etc/apt/sources.list.d/dig.list
```

## 3. Install the packages

```sh
sudo apt update && sudo apt install dig-node dig-store
```

- **`dig-node`** — the headless node service (serves the [dig RPC](../rpc/what-is-the-dig-rpc.md), hosts capsules, keeps the local `.dig` cache). Installs `/usr/bin/dig-node`.
- **`dig-store`** — the CLI for creating, committing, and reading stores. Installs `dig-store` plus its `digs` alias. Optional if you only want to serve, but usually wanted alongside.

## 4. Check the service

Installing `dig-node` registers the **systemd** unit `dig-node.service` and **enables + starts it for you**, so it's already running and will come back on every boot. No manual enable step is needed.

Check it's running and watch its logs:

```sh
systemctl status dig-node     # is it active? when did it start?
journalctl -u dig-node -f      # follow the node's logs live
```

`systemctl status` should report `active (running)`. The node now serves the dig RPC on `127.0.0.1:9778` and begins hosting/caching content.

The service runs as its own unprivileged `dig-node` system account — never root — and keeps its `.dig` cache in `/var/lib/dig-node`. Change any of its settings with a drop-in:

```sh
sudo systemctl edit dig-node
```

→ [Configure dig-node](./configure.md) for the settings you can set

## What dig-node does once it's running

Your dig-node is now the **serve side** of the network on this machine:

- **Exposes the dig RPC locally**, so a [DIG Browser](../browser/chia-protocol.md) or the extension on the same machine reads content **from your node** instead of going out to `rpc.dig.net` — local, offline-capable, and contributing to the network. Consumers prefer a reachable local node and fall back to `rpc.dig.net` when there isn't one. (See [serving vs. consuming](./index.md).)
- **Keeps the local `.dig` cache** of verified capsules. When a browser/extension and a dig-node are both present, they **share one cache** — content isn't stored twice.
- **Verifies and decrypts locally.** Even reading through your own node, every byte is checked against the on-chain root before it's served — the node is never blindly trusted.

A node running headless on a server (no browser present) simply serves its RPC to whatever consumes it — a seedbox for the capsules you host.

## Keeping it up to date

Because it's an apt package, updates ride your normal system upgrades:

```sh
sudo apt update && sudo apt upgrade        # picks up new dig-node / dig-store releases
```

To restart after a config change, or stop the service:

```sh
sudo systemctl restart dig-node
sudo systemctl stop dig-node       # stop serving (does not uninstall)
sudo systemctl disable dig-node    # don't start on boot
```

To run a newer `dig-node` than the repository carries, use the [DIG Installer](./universal-installer.md) instead of apt — it always resolves the current release. Pick one route per machine and stay on it, so there is only ever one `dig-node` and one service to reason about.

## Other operating systems

apt is the **Ubuntu/Debian-native** path on x86-64. For Windows, macOS, `arm64` Linux, or non-Debian Linux, use the cross-platform **[DIG Installer](./universal-installer.md)**, which installs the `dig-node` and `dig-dns` services (as a Windows service / `launchd` / `systemd`) plus the `dig-store` CLI in one run. To **read** DIG content without running a node, just get the **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)**.

## Related

- [Run a DIG node](./index.md) — what a node is, serving vs. consuming, and all install paths
- [Using the public network RPC](../rpc/public-network-rpc.md) — the dig RPC your node speaks; operating on the network
- [The chia:// protocol](../browser/chia-protocol.md) — how the browser/extension consume from your node (or `rpc.dig.net`)
- [Installing the CLI](../digstore/cli/install.md) — `dig-store` installers and build-from-source
- [Troubleshooting](../support/troubleshooting.md) — common failures and fixes
