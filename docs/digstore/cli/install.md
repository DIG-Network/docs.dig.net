---
sidebar_position: 1
title: Installing the CLI
description: "Download and run the self-contained DigStore CLI installer for Windows, macOS, or Linux; also build from source with Rust."
keywords:
  - digstore install
  - DigStore CLI installer
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

## Build from source (any platform)

You need [Rust](https://rustup.rs) (the version is pinned via `rust-toolchain.toml`). The CLI embeds a WebAssembly guest, so build that target first:

```sh
rustup target add wasm32-unknown-unknown
cargo build -p digstore-guest --target wasm32-unknown-unknown --release
cargo build -p digstore-cli --release
```

The binary lands at `target/release/digstore` (`digstore.exe` on Windows). Copy it somewhere on your `PATH`.

## Keeping up to date

```sh
digstore update            # download + run the latest installer
digstore update --check    # just report whether a newer release exists
```

## Related

- [CLI tutorial](./quickstart.md) — create, commit, and read a store in minutes
- [On-chain anchoring](./onchain-anchoring.md) — wallet setup and funding before `init`
- [Command reference](./command-reference.md) — every `digstore` command
- [What is DigStore?](../what-is-digstore.md) — what the CLI operates on

Next: [Quick start →](./quickstart.md)
