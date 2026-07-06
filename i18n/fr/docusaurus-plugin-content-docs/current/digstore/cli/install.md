---
sidebar_position: 1
title: Installing the CLI
description: "Install the DigStore CLI: the self-contained installer for Windows, macOS, and Linux, the raw per-CPU binary (with the macOS Gatekeeper fix), building from source, and the built-in self-updater."
keywords:
  - digstore install
  - DigStore CLI installer
  - macOS Gatekeeper
  - raw binary
  - digstore update
  - build from source
  - Rust
tags:
  - digstore-cli
---

# Installing the CLI

DigStore ships **one self-contained installer per operating system**. The download *is* the installer — run it and it installs the `digstore` CLI; there's no second step.

## Windows / macOS / Linux (installer)

Download the artifact for your OS from the [Releases](https://github.com/DIG-Network/digstore/releases) page:

| OS | Download | Run |
|---|---|---|
| **Windows** | `DigStore-Setup-<version>-windows-x64.exe` | Double-click. Installs **per-user — no admin prompt** — and adds `digstore` to your `PATH`. |
| **macOS** | `DigStore-Setup-<version>-macos.dmg` | Open the `.dmg`, run the installer. |
| **Linux** | `DigStore-Setup-<version>-linux-x86_64.AppImage` | `chmod +x` it and run it. |

Then open a **new** terminal and confirm:

```sh
digstore --version
```

:::note Single-file installer
Each installer embeds the `digstore` binary directly, so the download is one self-contained file. On Windows it also registers the DigStore icon for `.dig` files.
:::

## Raw binary (macOS / Linux)

Prefer the installer above. If you grab the raw per-OS binary from the [Releases](https://github.com/DIG-Network/digstore/releases) page instead, pick the file for your CPU:

- **`digstore-<ver>-macos-arm64`** — Apple Silicon Mac (M1/M2/M3)
- **`digstore-<ver>-macos-x64`** — Intel Mac
- **`digstore-<ver>-linux-x64`** — Linux (x86-64), or the **`digstore-<ver>-aarch64-unknown-linux-gnu.tar.gz`** tarball for ARM Linux

A macOS/Linux binary has **no file extension — that's normal**, not a broken download.

Downloaded binaries lose their exec bit, and macOS quarantines an unsigned download (Gatekeeper). Two commands fix both — **no `sudo` needed**:

```sh
chmod +x digstore-<ver>-macos-arm64
xattr -d com.apple.quarantine digstore-<ver>-macos-arm64   # macOS only: clear Gatekeeper
mv digstore-<ver>-macos-arm64 /opt/homebrew/bin/digstore    # Apple Silicon (no sudo); Intel/Linux: /usr/local/bin
digstore --version
```

If you hit **`permission denied`**, it's the exec bit or the quarantine above — not privileges. `sudo` is the wrong fix.

## Build from source (any platform)

You need [Rust](https://rustup.rs) (the version is pinned via `rust-toolchain.toml`). The CLI embeds a WebAssembly guest, so build that target first:

```sh
rustup target add wasm32-unknown-unknown
cargo build -p digstore-guest --target wasm32-unknown-unknown --release
cargo build -p digstore-cli --release
```

The binary lands at `target/release/digstore` (`digstore.exe` on Windows). Copy it somewhere on your `PATH`.

## Keeping up to date

`digstore update` is a built-in self-updater. On macOS and Linux it **downloads and installs the latest release in place** — it detects your OS and CPU, downloads the matching binary, verifies it, makes it executable, clears the macOS quarantine, and atomically replaces the running `digstore`. On Windows it runs the bundled installer. If the install location isn't writable it stops and prints the exact manual steps.

```sh
digstore update          # download + install the latest release, in place
digstore update --check  # just report whether a newer release exists
```

## Related

- [CLI tutorial](./quickstart.md) — create, commit, and read a store in minutes
- [On-chain anchoring](./onchain-anchoring.md) — wallet setup and funding before `init`
- [Command reference](./command-reference.md) — every `digstore` command
- [What is DigStore?](../what-is-digstore.md) — what the CLI operates on

Next: [Quick start →](./quickstart.md)
