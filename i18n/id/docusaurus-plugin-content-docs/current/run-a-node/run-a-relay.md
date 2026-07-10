---
sidebar_position: 6
title: Run a relay
description: "How a DIG node stays reachable behind NAT through a relay, the relay.dig.net default, and how to run your own relay."
keywords:
  - relay
  - NAT traversal
  - relay.dig.net
  - hole punching
  - dig-relay
  - reachability
tags:
  - dig-node
  - relay
---

# Run a relay

> **Stay reachable behind NAT, automatically.** Your node keeps a constant connection to a relay so other peers can reach it even when your network won't accept inbound connections — and it works out of the box with no setup.

Most home and cloud networks sit behind NAT or a firewall that blocks unsolicited inbound connections. That means other DIG nodes can't directly dial yours, even though yours can reach out fine. A **relay** solves this: it's a publicly-reachable meeting point that your node holds an open connection to, so peers can find and reach your node *through* the relay when a direct connection isn't possible.

You almost certainly **don't need to run one** — every node uses the public relay automatically.

## How your node uses a relay

When your node starts, it opens a constant connection (a *reservation*) to a relay and keeps it alive, reconnecting on its own if the link drops. Through that connection the relay can:

- **Keep your node reachable** — peers that can't dial you directly are bridged to you through the relay.
- **Coordinate a direct connection** — the relay helps two nodes behind NAT punch a direct path to each other (*hole punching*); when that succeeds, traffic moves off the relay to the faster direct link.
- **Help peers find each other** — nodes can discover other peers connected to the same relay.

This is all automatic. By default your node uses the public relay at `relay.dig.net`, so a fresh node is reachable with zero configuration.

:::info The relay never sees your content
A relay only forwards already-encrypted peer traffic by node id — it can't read it. Every node still verifies and decrypts everything itself, exactly as it does for any other source. The relay is an untrusted bridge, not a trusted middleman.
:::

## Configure which relay your node uses

You can point your node at a different relay, or turn the connection off:

| Setting | Value | Effect |
|---|---|---|
| `DIG_RELAY_URL` | *(unset)* | Use the default public relay `relay.dig.net`. |
| `DIG_RELAY_URL` | `wss://relay.example.com:9450` | Use a specific relay (e.g. your own). |
| `DIG_RELAY_URL` | `off` | Disable the relay connection (for air-gapped or fully-direct setups). |

Set it the same way as any other node setting (environment variable), then restart the node. You can check the live relay status from your node's management interface — it reports whether the reservation is currently held, the endpoint, and any recent connection error.

## Run your own relay

This is **advanced and optional** — run your own only if you want a relay you control (e.g. a private cluster, or to reduce reliance on the public one). A relay is a small, stateless service: it holds connections and forwards traffic; it stores no content and needs no chain access or keys.

Install it with the [universal installer](./universal-installer.md):

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/DIG-Network/dig-installer/main/install.sh | sh -s -- --with-relay
```

```powershell
# Windows (run from an elevated PowerShell for the system service)
$s = irm https://raw.githubusercontent.com/DIG-Network/dig-installer/main/install.ps1
& ([scriptblock]::Create($s)) --with-relay
```

This downloads the relay for your OS, installs it as a background service (Windows service / systemd / launchd), and starts it. By default it listens on port **9450** (the relay connection) and exposes a health check on **9451**.

Then point your nodes at it:

```bash
DIG_RELAY_URL=wss://your-relay-host:9450
```

To run the relay directly instead of as a service:

```bash
dig-relay serve --listen 0.0.0.0:9450 --health-listen 0.0.0.0:9451
dig-relay status        # is it serving? (probes the health endpoint)
```

:::tip A relay should be publicly reachable
A relay is only useful if other nodes can reach it, so run it somewhere with a public address (a small cloud instance is plenty — a relay is lightweight) and allow inbound traffic on its relay port. Put it behind TLS (`wss://`) for production.
:::

## Related

- [Configure a node](./configure.md) — all node settings, including the relay
- [Install anywhere — the universal installer](./universal-installer.md)
- [Instal lewat wizard GUI](./universal-installer.md#gui-installer) — alternatif terpandu untuk flag di atas
- [Run a DIG node](./index.md) — what a node is and why you'd run one
