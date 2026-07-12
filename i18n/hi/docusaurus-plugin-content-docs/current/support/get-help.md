---
sidebar_position: 1
title: Get help
description: "Where to get help with DIG — the community Discord, GitHub issues, and how to file a report that gets answered fast."
keywords:
  - DIG support
  - get help
  - Discord
  - community
  - report a bug
tags:
  - dighub
  - digstore-cli
  - dig-rpc
---

# Get help

Stuck on something? Start here.

| Where | Best for |
|---|---|
| [**Discord ↗**](https://discord.gg/v78aygUZt) | Quick questions, deploy help, talking to other builders and the team. |
| [**digstore issues ↗**](https://github.com/DIG-Network/digstore/issues) | CLI bugs, feature requests, anything `digstore`. |
| [**DIGHUb issues ↗**](https://github.com/DIG-Network/hub.dig.net/issues) | Web app / publish / domain problems. |
| [Troubleshooting](./troubleshooting.md) · [FAQ](./faq.md) · [Error codes](./error-codes.md) | Answers you can find without waiting. |

:::tip Pre-release — expect rough edges
DIG is pre-release. If something is broken or confusing, that's worth reporting — it's how the rough edges get filed down. There are no dumb questions in [Discord ↗](https://discord.gg/v78aygUZt).
:::

## Before you ask

You'll get an answer faster if you check these first:

1. **[Troubleshooting](./troubleshooting.md)** — the common failures and their fixes.
2. **[Error codes](./error-codes.md)** — look up the exact code you got (RPC `-32xxx`, a CLI exit code, or a DIGHUb code like `SLUG_TAKEN`).
3. **[FAQ](./faq.md)** — the questions that come up most.

## How to file a good report

A report that gets answered fast includes:

- **What you ran** — the exact `digstore` command (or the DIGHUb step), and what you expected.
- **What happened** — the full error message and any **error code** (e.g. exit code `12`, RPC `-32602`, or `DIG_INSUFFICIENT`). See [Error codes](./error-codes.md).
- **Versions** — `digstore --version`, your OS; for the web, your browser and wallet.
- **Reproduce it** — the smallest set of steps that triggers it.

For CLI issues, re-run with `--verbose` (and `--json` if scripting) and include the output.

:::caution Never paste secrets
Don't share your mnemonic, your `~/.dig/seed.enc`, a deploy key, or a private store's `salt`. Support will never ask for them.
:::

## Related

- [Troubleshooting](./troubleshooting.md) — fixes for the common failures
- [FAQ](./faq.md) — frequently asked questions
- [Error codes](./error-codes.md) — every error code in one table
- [Changelog](./changelog.md) — what changed across the CLI, RPC, and window.chia
- [Status](./status.md) — health of the DIG services
- [Concepts & glossary](../concepts.md) — the vocabulary, defined once
