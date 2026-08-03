---
sidebar_position: 3
title: Install anywhere — the universal installer
description: "The DIG Installer — the cross-platform installer for Windows, macOS, and x86-64 Linux. One elevated command installs the full DIG stack by default: the dig-store CLI plus the dig-node and dig-dns boot-start services, and registers dig.local."
keywords:
  - DIG Installer
  - universal installer
  - dig-node install
  - dig.local
  - dig-dns
  - boot-start service
  - Windows service
  - launchd
  - systemd
  - native OS package
  - msi
  - pkg
  - deb
  - chia:// scheme handler
  - dig-node open
  - dign
  - digd
tags:
  - dig-node
  - dig-dns
  - digstore-cli
  - dig-rpc
---

# Install anywhere — the universal installer

The cross-platform path — **Windows, macOS, and x86-64 Linux**. The **DIG Installer** detects your OS and installs the full DIG stack in one run: the `dig-store` CLI, plus the `dig-node` and `dig-dns` services, both registered to start automatically on every boot. It needs no package manager.

```sh
# macOS / Linux
curl -fsSL https://dig.net/install.sh | sudo sh
```

```powershell
# Windows — in a PowerShell opened with "Run as administrator"
irm https://dig.net/install.ps1 | iex
```

### Why it needs administrator rights {#elevation}

The default install registers boot-start OS services and writes into an administrator-only install root, so it requires elevation on every platform. Run it **without** elevation and it stops **before** downloading or changing anything, telling you to re-run elevated — nothing is installed and no partial state is left behind. So:

- **Linux / macOS** — put `sudo` in the command, as above. The bootstrap script does not elevate itself.
- **Windows** — open PowerShell with **Run as administrator** first. Piping to `iex` from an ordinary shell stops at the same check.

### Platforms it installs on {#platforms}

| OS | Architecture |
|---|---|
| **Linux** | `x86-64` |
| **macOS** | Apple Silicon (`arm64`) and Intel (`x86-64`) |
| **Windows** | `x86-64` |

On `arm64` Linux, install the `dig-store` CLI from the [apt repository](./apt.md) and read content through `rpc.dig.net`; a `dig-node` build for that platform is not published yet.

This is the same self-contained `dig-installer` shipped on the [Releases page](https://github.com/DIG-Network/dig-installer/releases) — download `dig-installer-<version>-<os_arch>` and run it directly (elevated) if you prefer not to pipe to a shell.

Every component installs by default — `dig-store`, `dig-node`, and `dig-dns`. Skip any one of them with its `--no-<component>` flag (`--no-dig-store`, `--no-dig-node`, `--no-dig-dns`); the advanced `dig-relay` and the DIG Browser stay opt-in via `--with-relay` / `--with-browser`.

## Short aliases: `dign` and `digd` {#short-aliases}

The DIG Installer also places two short aliases on your `PATH`: **`dign`** for `dig-node` and **`digd`** for `dig-dns`. They are specific to this route — neither the [apt packages](./apt.md) nor the native OS packages below carry them, so use the full `dig-node` / `dig-dns` names if you installed one of those ways. Each is a real installed binary — not a shell alias — and behaves identically to its primary: the same subcommands (including every service verb — `install`/`uninstall`/`start`/`stop`/`status`/`serve`), the same flags and `--json` output, and the same exit codes. `dign --help`/`--version` reports `dign`, and `digd --help`/`--version` reports `digd`; the primaries keep reporting their own names. For example, `dign open chia://<storeId>/` and `dig-node open chia://<storeId>/` do exactly the same thing. This mirrors [`digs`](../digstore/cli/install.md), the first-class alias for `dig-store`.

## GUI installer {#gui-installer}

Prefer a guided setup over flags? Download the desktop wizard —
**`DIG-Installer-Setup-<version>-{windows-x64.exe, macos.dmg, linux-x86_64.AppImage}`** from the
[Releases page](https://github.com/DIG-Network/dig-installer/releases) — in a dark theme that
matches the rest of DIG Network's apps: **Welcome → License → Components → Install → Done**.

On the **Components** step, every component — `dig-store`, `dig-node`, `dig-dns`, `dig-relay`, and DIG Browser — is checked by default, so clicking through with no changes installs everything (`dig-store` has no checkbox; it's always installed). Uncheck any of the others to install just a subset.

If a component isn't available yet for your platform, it's skipped automatically and the rest of your selected components still install normally.

Re-running the installer over an already-installed `dig-node` or `dig-relay` — to upgrade, for example — needs no manual steps: it stops the running service, replaces the binary with the new version, then starts it again, so the service ends up in the same running or stopped state it was in before.

## Native OS packages {#native-os-packages}

`dig-node` also ships as **native OS packages** — a Windows **`.msi`**, a macOS **`.pkg`**, and a Linux **`.deb`**. Install one directly with your OS's own tooling when you'd rather not run the installer at all. Take the asset from the [dig-node Releases page](https://github.com/DIG-Network/dig-node/releases/latest):

| OS | Install a package directly |
|---|---|
| **Windows** | Double-click `dig-node-<version>-windows-x64.msi`, or `msiexec /i dig-node-<version>-windows-x64.msi` from an elevated prompt. |
| **macOS** | Double-click `dig-node-<version>-macos.pkg`, or `sudo installer -pkg dig-node-<version>-macos.pkg -target /`. |
| **Linux** | `sudo apt install ./dig-node_<version>_amd64.deb`. |

Installing a package **registers the background service and starts it immediately and on every boot** — no extra step. Each package installs only the `dig-node` binary and its service; the short aliases, `dig.local`, and `dig-dns` come with the [DIG Installer](#platforms).

### Finding the service on your machine {#service-ids}

The id your service manager knows the node by depends on how you installed it, so use the row that matches your route:

| How you installed | OS | Ask for it as |
|---|---|---|
| DIG Installer | Linux (systemd) | `dignetwork-dig-node`, in the **user** scope — `systemctl --user` |
| DIG Installer | macOS (launchd) | `net.dignetwork.dig-node` |
| DIG Installer | Windows (Services) | `net.dignetwork.dig-node` — **DIG NETWORK: NODE** |
| `.deb` / `.pkg` / `.msi` | Linux / macOS / Windows | `net.dignetwork.dig-node` |
| [apt repository](./apt.md) | Linux (systemd) | `dig-node` |

`dig-dns` follows the same pattern with `dig-dns` in place of `dig-node` (**DIG NETWORK: DNS** on Windows). On Linux, `dig-node` reports its own id as `net.dignetwork.dig-node`, while the name to hand `systemctl` is the one in the table:

```sh
systemctl --user status dignetwork-dig-node
journalctl --user -u dignetwork-dig-node -f
```

Because that unit lives in your user scope, it needs a logged-in session for your account. On a headless server, prefer the [apt repository](./apt.md) or the `.deb`, which both register a **system** service that runs with no session at all.

Whichever route you used, the node reports on itself without you needing an id:

```sh
dign status --json
```

## Open `chia://` links from anywhere {#chia-scheme-handler}

The DIG Installer and the native OS packages also register **`chia://`** (and **`urn:`**) as an operating-system URL-scheme handler — on by default. With it registered, opening a `chia://…` or `urn:dig:chia:…` link **anywhere on your computer** — from an email, a chat, or an ordinary browser — routes it through your local dig-node, which resolves and verifies the content and opens it in your default browser. Nothing else needs to be installed for the click to work; if you also run the [DIG Browser](../browser/chia-protocol.md) or the extension, it still verifies the page.

Prefer not to register the handler? Choose the guided [GUI installer](#gui-installer) and decline it during setup.

### `dig-node open`

The handler runs one command, which you can also use yourself to open a DIG address:

```sh
dig-node open chia://<storeId>[:<rootHash>]/<path>
dig-node open urn:dig:chia:<storeId>[:<rootHash>]/<path>
```

It **validates the link strictly** — only `chia://` and `urn:dig:chia:` are accepted, the store id must be a valid 64-hex value, and every other scheme (`file:`, `javascript:`, `http:`, …) is rejected — then opens your local node's address for it in the default browser. Add `--json` for a machine-readable result:

```sh
dig-node open --json chia://<storeId>/
# { "ok": true, "action": "open", "opened": true,
#   "url": "http://localhost:9778/s/<storeId>/", "store_id": "<storeId>", … }
```

## `dig.local`

The installer registers **`dig.local`** for your machine so consumers on the same host resolve your node by name (`dig.local` → `localhost`) without hard-coding a port. This is what lets the [DIG Browser](../browser/chia-protocol.md) and extension prefer a local node automatically. → [Point a consumer at your node](./point-a-consumer.md)

On Windows the installer also trusts your node's local HTTPS certificate, so browsers reach it securely at `https://dig.local`. → [The `https://dig.local` endpoint](/docs/run-a-node/local-https)

## An always-on service, verified after install

`dig-node` installs **by default** and registers as an **auto-start** service — it comes up again after a reboot with no manual step, and starts as part of installation. Skip it with `--no-dig-node`. On Linux and macOS it also **auto-restarts if it ever crashes** (Windows recovery-on-crash is still being wired up).

Once the service is started, the installer runs two checks and prints the result of each:

- **`dig.local` resolves** — the OS resolver actually maps `dig.local` to your node's loopback address right now (not just that the hosts entry was written).
- **Health check** — the node answers a live RPC call on its configured port (default `9778`), proving the service isn't just registered but actually serving.

```sh
sudo dig-installer
#   Registering dig-node as an OS service (port 9778):
#     ✓ dig-node installed as an OS service and started
#     ✓ dig.local: 127.0.0.2 dig.local → /etc/hosts
#     ✓ dig.local resolve check: dig.local → 127.0.0.2
#     ✓ health check: rpc.discover on http://127.0.0.1:9778/ answered
```

With the node up and verified, the [extension](../audiences/content-consumers.md) and the [DIG Browser](../browser/chia-protocol.md) find it automatically at `dig.local` (or `localhost:9778`) — no configuration needed on the consumer side. `--uninstall-dig-node` removes the service and the `dig.local` entry cleanly.

## Browse `.dig` names directly {#browse-dig-names-directly}

[`dig-dns`](https://github.com/DIG-Network/dig-dns) — a local `*.dig` name resolver — installs
**by default** too, registered as an OS service (Windows Service / macOS LaunchDaemon / Linux
systemd) alongside `dig-node`. Skip it with `--no-dig-dns`:

```sh
curl -fsSL https://dig.net/install.sh | sudo sh -s -- --no-dig-dns
```

This lets a browser open `http://<storeId>.dig/<path>` directly: dig-dns resolves the
store's chain-anchored root and serves its content from your dig-node. The installer
wires OS split-DNS (or an NRPT rule on Windows) and, as a fallback, a PAC proxy file
for browsers that bypass the OS resolver (e.g. a browser forcing DNS-over-HTTPS) —
either path alone is enough for `.dig` URLs to load. It never edits `/etc/hosts`,
never rewrites URLs, and never intercepts TLS. Run `dig-dns doctor` any time to check
which path is live and get a fix hint for what isn't. → See [DIG and your
DNS](./dns.md) for what dig-dns does and doesn't touch, and how it protects its own
lookup.

The [extension](../audiences/content-consumers.md) already opens content directly from a
reachable node as a real page — see [Reading from your own
node](../audiences/content-consumers.md#reading-from-your-own-node). `dig-dns` layers a
friendlier, per-store address on top of that: with it installed and running, the same open
detects `dig-dns` automatically and lands on `http://<storeId>.dig/` instead of the node's own
address; without `dig-dns`, the page still opens directly from the node, just at the node's own
local address. Only when **no** node is reachable at all does the address fall back to opening
inside the extension's own viewer.

## On Debian-family systems

Prefer the signed, `apt upgrade`-able native path: → [Install on Ubuntu/Debian via apt](./apt.md).

## Related

- [Run a node — overview](./index.md)
- [Install on Ubuntu/Debian via apt](./apt.md) — the same `.deb`, signed and `apt upgrade`-able
- [The chia:// protocol](../browser/chia-protocol.md) — what a `chia://` address is and how it resolves
- [DIG and your DNS](./dns.md) — dig-dns's split-DNS scope + its own encrypted upstream lookup
- [Installing the CLI](../digstore/cli/install.md) — the raw `dig-store` binary on its own
- [Configure dig-node](./configure.md) — ports, listeners, cache cap, upstream
- [Point a consumer at your node](./point-a-consumer.md) — shared `.dig` cache
- [The `https://dig.local` endpoint](/docs/run-a-node/local-https) — local HTTPS and the certificate the installer trusts
