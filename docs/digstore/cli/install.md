---
sidebar_position: 1
title: Installing the CLI
description: "Install the dig-store CLI: the raw per-OS/arch binary from the dig-store Releases page (with the macOS Gatekeeper fix), the guided DIG Installer for a full desktop setup, building from source, and the built-in self-updater."
keywords:
  - dig-store install
  - dig-store CLI installer
  - DIG Installer
  - macOS Gatekeeper
  - raw binary
  - dig-store update
  - build from source
  - Rust
tags:
  - digstore-cli
---

# Installing the CLI

Every install method below places two binaries on your `PATH`: `dig-store` and its shorthand `digs`. They're the same program — `digs <args>` behaves identically to `dig-store <args>` (same commands, flags, and `--json` output) — so use whichever you prefer. For example, `digs new my-app` and `dig-store new my-app` do exactly the same thing.

## Raw binary (Windows / macOS / Linux)

Download the binary for your OS/CPU from the [Releases](https://github.com/DIG-Network/digs/releases) page:

- **`dig-store-<ver>-windows-x64.exe`** — Windows
- **`dig-store-<ver>-macos-arm64`** — Apple Silicon Mac (M1/M2/M3)
- **`dig-store-<ver>-macos-x64`** — Intel Mac
- **`dig-store-<ver>-linux-x64`** — Linux (x86-64), or the **`dig-store-<ver>-aarch64-unknown-linux-gnu.tar.gz`** tarball for ARM Linux

A macOS/Linux binary has **no file extension — that's normal**, not a broken download.

Downloaded binaries lose their exec bit, and macOS quarantines an unsigned download (Gatekeeper). Two commands fix both — **no `sudo` needed**:

```sh
chmod +x dig-store-<ver>-macos-arm64
xattr -d com.apple.quarantine dig-store-<ver>-macos-arm64   # macOS only: clear Gatekeeper
mv dig-store-<ver>-macos-arm64 /opt/homebrew/bin/dig-store    # Apple Silicon (no sudo); Intel/Linux: /usr/local/bin
dig-store --version
```

On Windows, place `dig-store-<ver>-windows-x64.exe` in a folder on your `PATH` (renaming it `dig-store.exe` is optional but convenient), then open a **new** terminal and confirm:

```sh
dig-store --version
```

If you hit **`permission denied`** on macOS/Linux, it's the exec bit or the quarantine above — not privileges. `sudo` is the wrong fix.

## Guided setup (DIG Installer)

Prefer a desktop wizard, or want `dig-store` alongside a local node in one run? The **[DIG Installer](../../run-a-node/universal-installer.md)** puts `dig-store` on your `PATH` with no manual steps, installs `dig-node` and `dig-dns` as boot-start services by default, and — on Windows — registers the DIG brand icon for `.dig` files. Its desktop wizard (`DIG-Installer-Setup-<version>-{windows-x64.exe, macos.dmg, linux-x86_64.AppImage}`) walks Welcome → License → Components → Install → Done.

## Build from source (any platform)

You need [Rust](https://rustup.rs) (the version is pinned via `rust-toolchain.toml`). The CLI embeds a WebAssembly guest, so build that target first:

```sh
rustup target add wasm32-unknown-unknown
cargo build -p digstore-guest --target wasm32-unknown-unknown --release
cargo build -p digstore-cli --release
```

The binary lands at `target/release/dig-store` (`dig-store.exe` on Windows). Copy it somewhere on your `PATH`.

## Keeping up to date

`dig-store update` is a built-in self-updater. On macOS and Linux it **downloads and installs the latest release in place** — it detects your OS and CPU, downloads the matching binary, verifies it, makes it executable, clears the macOS quarantine, and atomically replaces the running `dig-store`. If the install location isn't writable it stops and prints the exact manual steps.

```sh
dig-store update          # download + install the latest release, in place
dig-store update --check  # just report whether a newer release exists
```

On Windows, download the latest `dig-store-<ver>-windows-x64.exe` from the [Releases](https://github.com/DIG-Network/digs/releases) page (or re-run the [DIG Installer](../../run-a-node/universal-installer.md)) and use it to replace the binary on your `PATH`.

## Related

- [CLI tutorial](./quickstart.md) — create, commit, and read a store in minutes
- [On-chain anchoring](./onchain-anchoring.md) — wallet setup and funding before `init`
- [Command reference](./command-reference.md) — every `dig-store` command
- [What is dig-store?](../what-is-digstore.md) — what the CLI operates on

Next: [Quick start →](./quickstart.md)
