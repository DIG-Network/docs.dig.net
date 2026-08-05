---
sidebar_position: 6
title: The https://dig.local endpoint
description: "Your dig-node serves DIG content over HTTPS at https://dig.local, on your machine's loopback, with a certificate your browser trusts. Privacy and integrity for local reads, with a plain-http fallback for clients that can't use it."
keywords:
  - dig.local
  - local HTTPS
  - https://dig.local
  - local certificate authority
  - name constraints
  - loopback TLS
  - dig-node HTTPS
  - browser read tier
tags:
  - dig-node
  - dig-rpc
  - browser
---

# The https://dig.local endpoint

Your dig-node serves DIG content over HTTPS at **`https://dig.local`**, on your own machine. It's the same node and the same content as the plain-`http` surface — just over TLS, so reads between your browser and your node are encrypted and their integrity is protected, all without a single byte leaving your computer.

Because the endpoint lives entirely on your machine's loopback, using it needs a certificate your browser trusts. The DIG Installer sets that trust up for you.

## What you get

- **Privacy and integrity for local reads.** Traffic between the browser and your node is encrypted in transit and can't be tampered with, even though it never leaves the loopback.
- **The same content, the same routes.** `https://dig.local` serves exactly what the plain-`http` endpoint does — the store content, the health check, and verification — so nothing about how you use your node changes.
- **A trusted padlock, no warnings.** Once the certificate is trusted, the browser treats `https://dig.local` like any other secure site — no scary certificate warning to click through.

## The installer provisions local HTTPS trust automatically

When you install the DIG node via the [DIG Installer](/docs/run-a-node/universal-installer), it automatically sets up the local HTTPS certificate trust on your operating system. On **Windows**, the installer provisions the local certificate into the Windows trust store as part of installation, so your browsers trust `https://dig.local` automatically — there's nothing extra to do. On **macOS and Linux**, the endpoint is served the same way, and browsers trust it once the local certificate has been provisioned; until then HTTPS is best-effort and clients simply read over plain `http` instead (see [the fallback](#fallback) below).

The trust that the installer establishes is **name-constrained** — the local certificate authority can only vouch for `dig.local`, `*.dig`, and your machine's loopback addresses (`127.0.0.0/8` and `::1`). This name constraint is critical to security: even if the local CA's key were ever exposed, it could never be used to impersonate any website on the public internet — its authority is confined to your machine and DIG names only. When you uninstall the DIG node, the installer removes this trusted local CA from your operating system, so the trust is completely cleaned up.

## The certificate is short-lived and self-managing

You don't manage any of this. Your node issues and **automatically renews its own short-lived certificate** — so there's no expiry to track and nothing to rotate by hand. The certificate is anchored to a **local certificate authority** that exists only on your machine.

That local authority is deliberately powerless off your machine: it is constrained so that it can vouch **only** for `dig.local`, `*.dig`, and your loopback addresses — and for nothing on the public internet. Even in the unlikely event its key were exposed, it could not be used to impersonate any real website. Its trust is confined to your own machine and the DIG names.

## When HTTPS isn't available, reads fall back to http {#fallback}

The HTTPS endpoint is **fail-soft** by design — it never gets in the way of reading content:

- If no certificate is available yet, your node serves plain `http` only.
- If the HTTPS port can't be claimed, that's a harmless warning — the node keeps running.

Plain **`http://dig.local`** stays available at all times, and there is **no automatic redirect** from `http` to `https`. So a consumer that can use HTTPS prefers `https://dig.local`, and any consumer transparently falls back to `http://dig.local` if HTTPS isn't reachable. Reads always work either way. This is a deliberate transition posture: HTTPS is added alongside the existing plain-`http` surface, not in place of it.

## For integrating developers

The exact shape of the endpoint, for building a custom client that probes it.

### Addresses

`dig-node` (**v0.33.0** and later) listens for HTTPS on port **443** on the loopback aliases:

| Address | Family |
|---|---|
| `127.0.0.2:443` | IPv4 loopback |
| `[::1]:443` | IPv6 loopback |

The listener binds only to these loopback aliases — never to `0.0.0.0` or `[::]`. The plaintext surface remains at `http://dig.local` (`127.0.0.2:80`) and on the node's configured RPC port (default `9778`).

The HTTPS listener serves the **same routes and the same Host allowlist** as the plaintext surface — the `/s/…` content serve, `/verify`, and `/health`. HTTPS is purely a transport wrapper over the same node.

### The local CA and its trust properties

The leaf certificate is issued by a **local certificate authority** created on your machine. The CA certificate carries a **critical `nameConstraints`** extension that permits only:

- `dig.local`
- `*.dig`
- `127.0.0.0/8`
- `::1`

and is marked `CA:TRUE, pathlen:0`. Because the name constraints are critical, a conforming client that trusts this CA will reject any certificate it issues for a name outside that set. The practical guarantee: even if the CA's key leaked, it **cannot vouch for any public internet host** — its authority is confined to the loopback ranges and the DIG names above. This makes it safe to add to a trust store.

The CA is a **stable, long-lived local anchor** — the node never rotates it. The **leaf** certificate, by contrast, is (re-)issued at node startup and **daily** thereafter, so the trust anchor is the CA, not any individual leaf. The leaf's private key is written atomically (temp-then-rename) and, on unix, with file mode `0o600`. If a certificate on disk is ever torn or unreadable, the node keeps serving the last known-good one.

### Probe and fall-through behavior

The endpoint sits at the top of the local read tier of the resolution ladder (`dig.local` → `localhost` → `rpc.dig.net`). A custom client should:

1. Probe **`https://dig.local`** with a short timeout.
2. On any TLS error, connection refusal, or timeout, fall back to **`http://dig.local`**.

The fall-through is entirely **client-side** — the server issues no redirect from `http` to `https`, and plain `http` is always kept available. So a client that can't do HTTPS (or reaches a node with no leaf certificate available) still reads over `http://dig.local` with no special handling.

This browser read tier uses TLS with **no client authentication** — it is distinct from the node-class **mTLS** transport that the `dig-store` CLI and SDK use to authenticate with a client certificate. See [Point a consumer at your node](/docs/run-a-node/point-a-consumer) for that transport and the full resolution ladder.

## Related

- [Install anywhere — the universal installer](/docs/run-a-node/universal-installer) — installs the node and, on Windows, trusts `https://dig.local` for you
- [Point a consumer at your node](/docs/run-a-node/point-a-consumer) — the resolution ladder and the node-class mTLS transport
- [Configure dig-node](/docs/run-a-node/configure) — ports, listeners, cache cap
- [Run a node — overview](/docs/run-a-node)
