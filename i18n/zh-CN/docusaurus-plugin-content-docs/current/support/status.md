---
sidebar_position: 6
title: Status
description: "Where to check the health of the DIG services — the dig RPC (rpc.dig.net), DIGHUb (hub.dig.net), and the resolver (on.dig.net) — plus how RPC and provider versions are signalled."
keywords:
  - DIG status
  - service health
  - rpc.dig.net
  - hub.dig.net
  - on.dig.net
  - uptime
tags:
  - dig-rpc
  - dighub
  - window-chia
---

# Status

The health of the services your dapp depends on at runtime.

:::tip Live status dashboard
Check **[status.dig.net ↗](https://status.dig.net/)** for the live health of all DIG services — the dig RPC, DIGHUb, the resolver, coinset, and Chia mainnet — with per-service status, uptime, and latency. DIG is pre-release, so expect occasional downtime; if something looks down, also check [Discord ↗](https://discord.gg/v78aygUZt).
:::

The dashboard is **agent-readable** — poll these documents instead of scraping the page:

| Endpoint | Shape |
|---|---|
| [`status.dig.net/health.json`](https://status.dig.net/health.json) | `{ schemaVersion, overall, generatedAt, systems: { <id>: status } }` — quick liveness summary. |
| [`status.dig.net/status.json`](https://status.dig.net/status.json) | Full current status (per-system `status`, `latencyMs`, `uptime`, `detail.errorCode`) + `schemaVersion`. |
| [`status.dig.net/history.json`](https://status.dig.net/history.json) | Rolling history series (uptime / sparklines). |
| `status.dig.net/{status,history,health}.schema.json` | JSON Schemas (draft-2020-12) for each document. |

`status` is the stable enum `up` · `degraded` · `down`; a failure carries a stable `detail.errorCode` (e.g. `TIMEOUT`, `HTTP_5XX`, `RPC_ERROR`, `STALE_PEAK`). See [Error codes](./error-codes.md).

## Services

| Service | What it does | Check |
|---|---|---|
| **dig RPC** (`rpc.dig.net`) | The blind read path: serves ciphertext + inclusion proofs by retrieval key. | Send a JSON-RPC `dig.methods` (or any read call) and confirm a `200` with a JSON-RPC envelope. See [Methods](../rpc/methods.md). |
| **DIGHUb** (`hub.dig.net`) | The web app + `/v1` control plane for publishing and managing capsules. | Load [hub.dig.net ↗](https://hub.dig.net). |
| **Resolver** (`on.dig.net`) | The optional human-friendly front door: serves stores whose owners have **registered a handle** at `*.on.dig.net` (and custom domains). Stores without a registered handle are still readable over the dig RPC. | Load a known `*.on.dig.net` deployment. |

A read served by the dig RPC is **verified client-side** against the on-chain root, so even when a node misbehaves, a tampered or wrong byte **fails closed** — it is never silently accepted. A degraded node can slow or fail a read, but cannot serve you content that doesn't match the chain.

## Versioning you can depend on

When a service or contract changes, here's how the change is signalled — so your dapp can detect and adapt rather than break silently:

- **dig RPC** — a node advertises the methods it implements via `dig.methods`; an unimplemented method returns `-32601` (method not found) rather than failing opaquely. The chunk wire format is part of the shared, byte-stable read contract — a change to it is a coordinated, breaking change announced in the [changelog](./changelog.md).
- **`window.chia` provider** — the injected provider exposes its identity (`isDIG`) and connection state; query capabilities before calling a method. The provider's versioned surface is documented in [Using window.chia](../browser/using-window-chia.md), and the DIG Browser is its reference implementation.
- **CLI / SDK** — semver (`dig-store --version`, npm). Pin a version in CI and bump deliberately; breaking changes are listed in the [changelog](./changelog.md).

## Related

- [Changelog](./changelog.md) — what changed across the CLI, RPC, and window.chia
- [Error codes](./error-codes.md) — every error code in one table
- [Troubleshooting](./troubleshooting.md) — fixes for the common failures
- [Get help](./get-help.md) — community channels and how to report
- [dig RPC methods](../rpc/methods.md) — the read interface to health-check
