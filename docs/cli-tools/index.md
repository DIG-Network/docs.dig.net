---
sidebar_position: 4
title: DIG CLI tools
description: "The DIG command-line suite at a glance: digs (the store CLI) for publishing content, dign (the node CLI) for serving it, and digd (the DNS helper) that makes .dig addresses resolve — what each is for, how to install it, and where its deeper docs live."
keywords:
  - DIG CLI
  - DIG command-line tools
  - digs
  - dign
  - digd
  - dig-store
  - dig-node
  - dig-dns
  - DIG Installer
tags:
  - digstore-cli
  - dig-node
  - dig-dns
---

# DIG CLI tools

The DIG Network ships a small suite of command-line tools. Each one owns a distinct job in the publish → serve → read journey, and each has a short, first-class name so it is quick to type:

- **`digs`** — the **store CLI**. Scaffold, preview, and publish content to the DIG Network.
- **`dign`** — the **node CLI**. Run a headless server that hosts content and answers reads.
- **`digd`** — the **DNS helper**. Makes `http://<storeId>.dig/` addresses resolve on your machine.

You do not need all three. Pick the tool for what you want to do:

| I want to… | Tool | Start here |
| --- | --- | --- |
| Publish a site, app, or files to DIG | `digs` | [Install the store CLI](/docs/digstore/cli/install) |
| Serve content and run a node | `dign` | [Run a DIG node](/docs/run-a-node/) |
| Open `.dig` addresses in a browser | `digd` | [DIG and your DNS](/docs/run-a-node/dns) |

## `digs` — the store CLI

`digs` is the first-class shorthand for `dig-store`, the tool that turns a folder into a verifiable, on-chain-anchored DIG capsule and publishes it. `digs <args>` and `dig-store <args>` are the same program — identical commands, flags, and `--json` output — so use whichever you prefer.

Typical flow:

```sh
digs new my-app        # scaffold a project from a template — free, no wallet
digs dev               # local preview over the real chia:// read path — free
digs doctor            # pre-publish preflight
digs deploy            # publish (the step that spends DIG)
```

**Deeper docs:** [installing the CLI](/docs/digstore/cli/install) · [quickstart](/docs/digstore/cli/quickstart) · [full command reference](/docs/digstore/cli/command-reference)

## `dign` — the node CLI

`dign` is the first-class shorthand for `dig-node`, the DIG Network's content **server**. A node hosts capsules, keeps a local `.dig` cache, and exposes the [dig RPC](/docs/rpc/what-is-the-dig-rpc) so anything that reads DIG content can read it from you. It runs headless as a background service. `dign` and `dig-node` are the same program — the same subcommands (including the service verbs `install` / `start` / `stop` / `status` / `serve`), flags, `--json` output, and exit codes.

You do not need a node to *read* DIG content — a consumer alone works fine. You run a node to **serve**, and when one is present the local reader uses it automatically.

```sh
dign open chia://<storeId>/   # open an address to confirm serving works
dign status --json            # scriptable health signal
```

**Deeper docs:** [run a DIG node](/docs/run-a-node/) · [manage the service](/docs/run-a-node/manage) · [configure](/docs/run-a-node/configure)

## `digd` — the DNS helper

`digd` is the first-class shorthand for `dig-dns`, a **split-DNS resolver** that makes `.dig` addresses (`http://<storeId>.dig/`) work in an ordinary browser. It claims only the `.dig` top-level domain and leaves every other name on your system resolving exactly as before — it never becomes your default resolver, never edits `/etc/hosts`, and never intercepts TLS.

```sh
digd doctor            # report which .dig resolution path is live
```

**Deeper docs:** [DIG and your DNS](/docs/run-a-node/dns) · [point a consumer at a node](/docs/run-a-node/point-a-consumer)

## Installing the tools

The **[DIG Installer](/docs/run-a-node/universal-installer)** is the one-stop route: it sets up `dig-node`, `dig-dns`, and the `chia://` scheme handler, and places all three short aliases — `digs`, `dign`, and `digd` — on your `PATH` as real installed binaries. Each behaves identically to its full-named primary (`dig-store`, `dig-node`, `dig-dns`).

Prefer to install just one tool?

- **Store CLI only** — grab the raw `dig-store` binary or build from source: [installing the CLI](/docs/digstore/cli/install). The `.deb` and installer routes also place `digs` on your `PATH`.
- **Node only** — the [apt repository](/docs/run-a-node/apt) installs `dig-node` on Ubuntu/Debian. The short aliases `dign` and `digd` are specific to the DIG Installer route; with the apt or native OS packages, use the full `dig-node` / `dig-dns` names.

:::note The short aliases come with the DIG Installer
`dign` and `digd` are placed on your `PATH` by the DIG Installer route only. The apt and native OS packages carry the full-named `dig-node` and `dig-dns` binaries instead. `digs` also ships with the store CLI's own install methods.
:::
