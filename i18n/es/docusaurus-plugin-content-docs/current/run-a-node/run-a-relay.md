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

## Configuration and tuning

A relay runs well with **zero configuration** — the defaults are production-safe, and the [universal installer](./universal-installer.md) sets everything up for you. The settings below let you tune capacity, abuse protection, and connection hygiene for your own environment.

Every setting can be given as a flag on `dig-relay serve` **or** as an environment variable (the installed service reads the environment). When both are set, the command-line flag wins. Restart the relay after changing a setting.

```bash
# Example: a higher-capacity relay that also terminates its own TLS
dig-relay serve \
  --listen [::]:9450 \
  --max-connections 16384 \
  --tls-cert /etc/dig-relay/relay.crt \
  --tls-key /etc/dig-relay/relay.key
```

### Network listeners

Where the relay binds each of its listeners. An IPv6 address (the default `[::]`) accepts both IPv6 and IPv4 connections.

| Flag | Environment variable | Default | What it does |
|---|---|---|---|
| `--listen` | `DIG_RELAY_LISTEN` | `[::]:9450` | The relay connection listener — the port your nodes connect to. |
| `--health-listen` | `DIG_RELAY_HEALTH_LISTEN` | `[::]:9451` | The HTTP health-check endpoint (used by `dig-relay status` and monitoring). |
| `--dashboard-listen` | `DIG_RELAY_DASHBOARD_LISTEN` | `[::]:80` | The HTTP peer-stats dashboard. |
| `--stun-listen` | `DIG_RELAY_STUN_LISTEN` | `[::]:3478` | The STUN (UDP) listener that helps nodes discover their public address for hole punching. |

### Capacity and connection limits

Overall size and per-connection bounds. Raise these for a busy relay with room to spare.

| Flag | Environment variable | Default | What it does |
|---|---|---|---|
| `--max-connections` | `DIG_RELAY_MAX_CONNECTIONS` | `4096` | Maximum concurrent connections the relay accepts. |
| `--idle-timeout-secs` | *(flag only)* | `120` | Seconds of silence before an idle connection is closed. This is the long backstop behind the faster health sweep below. |
| `--register-timeout-secs` | `DIG_RELAY_REGISTER_TIMEOUT_SECS` | `10` | Seconds a freshly-accepted connection has to register before it is dropped. |
| `--max-message-bytes` | `DIG_RELAY_MAX_MESSAGE_BYTES` | `262144` | Largest single inbound message accepted (256 KiB). |
| `--outbound-queue-capacity` | `DIG_RELAY_OUTBOUND_QUEUE_CAPACITY` | `1024` | Per-connection outbound queue depth. A reader slower than this has messages dropped rather than stalling the relay. |

### Abuse-protection limits

These bound what a single source can consume, so one busy or misbehaving host can't monopolise or overwhelm a shared relay. **Set any of them to `0` to disable that specific limit.**

| Flag | Environment variable | Default | What it does |
|---|---|---|---|
| `--max-connections-per-ip` | `DIG_RELAY_MAX_CONNECTIONS_PER_IP` | `64` | Maximum concurrent connections from one source IP. Must not exceed `--max-connections`. |
| `--registrations-per-ip-per-sec` | `DIG_RELAY_REGISTRATIONS_PER_IP_PER_SEC` | `10` | Registration attempts per second allowed from one source IP. |
| `--max-registrations-per-ip` | `DIG_RELAY_MAX_REGISTRATIONS_PER_IP` | `128` | Maximum concurrent registrations from one source IP. |
| `--messages-per-conn-per-sec` | `DIG_RELAY_MESSAGES_PER_CONN_PER_SEC` | `256` | Inbound messages per second per connection before it is disconnected. |
| `--bytes-per-conn-per-sec` | `DIG_RELAY_BYTES_PER_CONN_PER_SEC` | `1048576` | Inbound bytes per second per connection before it is disconnected (1 MiB/s). |
| `--max-relayed-bytes-per-conn` | `DIG_RELAY_MAX_RELAYED_BYTES_PER_CONN` | `1073741824` | Total inbound bytes one connection may relay over its lifetime before it is disconnected (1 GiB). |
| `--stun-per-ip-rps` | `DIG_RELAY_STUN_PER_IP_RPS` | `5` | STUN responses per second to one source IP. |
| `--stun-global-rps` | `DIG_RELAY_STUN_GLOBAL_RPS` | `1000` | STUN responses per second across all sources. |

### Connection health and pruning

The relay actively removes dead or silent connections so they stop being handed out to other nodes, instead of waiting for the much longer idle timeout to reap them.

| Flag | Environment variable | Default | What it does |
|---|---|---|---|
| `--health-check-interval-secs` | `DIG_RELAY_HEALTH_CHECK_INTERVAL_SECS` | `30` | How often the relay sweeps for and removes dead or silent connections. Must be less than or equal to the liveness deadline. |
| `--liveness-deadline-secs` | `DIG_RELAY_LIVENESS_DEADLINE_SECS` | `90` | Seconds without any inbound message before the sweep prunes a connection. Must be shorter than the idle timeout. |

### Terminate TLS at the relay (optional)

By default the relay speaks plain `ws://` and expects TLS to be terminated in front of it — for example at a load balancer, which is how the public `relay.dig.net` is run. Set **both** of the settings below to have the relay terminate TLS itself and require every connecting client to present a certificate.

| Flag | Environment variable | Default | What it does |
|---|---|---|---|
| `--tls-cert` | `DIG_RELAY_TLS_CERT_PATH` | *(none)* | Path to the relay's TLS certificate (PEM). Set together with `--tls-key`. |
| `--tls-key` | `DIG_RELAY_TLS_KEY_PATH` | *(none)* | Path to the relay's TLS private key (PEM). Set together with `--tls-cert`. |

## Related

- [Configure a node](./configure.md) — all node settings, including the relay
- [Install anywhere — the universal installer](./universal-installer.md)
- [Instalar mediante el asistente gráfico](./universal-installer.md#gui-installer) — una alternativa guiada a los flags anteriores
- [Run a DIG node](./index.md) — what a node is and why you'd run one
