---
sidebar_position: 9
title: DIG and your DNS
description: "How dig-dns handles DNS: it claims only the .dig top-level domain locally and leaves every other domain's resolution untouched, and its own rpc.dig.net lookup goes out over encrypted DNS by default."
keywords:
  - dig-dns
  - split-DNS
  - encrypted DNS
  - DNS-over-HTTPS
  - DNS-over-TLS
  - DIG_DNS_SECURE_UPSTREAM
  - dig-dns doctor
  - privacy
tags:
  - dig-dns
  - privacy
---

# DIG and your DNS

`dig-dns` is a **split-DNS resolver**: it makes `.dig` addresses (`http://<storeId>.dig/`) work, and it does that without touching how anything else on your computer resolves names.

## What it touches — and what it doesn't

- **Claims only `.dig`.** dig-dns answers lookups for the `.dig` top-level domain and nothing else. Every other domain — `.com`, `.net`, your work VPN's internal names, anything — keeps resolving exactly as it did before dig-dns was installed.
- **Never takes over your system DNS.** dig-dns doesn't become your machine's default resolver. It wires a narrow, `.dig`-scoped rule instead — OS split-DNS, or an NRPT rule on Windows — plus a PAC proxy file as a fallback for browsers that bypass the OS resolver (for example, one that forces its own DNS-over-HTTPS). Either path alone is enough for `.dig` addresses to load.
- **Non-invasive.** It never edits `/etc/hosts`, never rewrites URLs, and never intercepts TLS.

Check the current state any time with:

```sh
dig-dns doctor
```

which reports exactly which `.dig` resolution path is live and gives a fix hint for anything that isn't.

## Its own lookup is encrypted too

dig-dns makes exactly one outbound name lookup of its own: **`rpc.dig.net`**, the public gateway it falls back to only when no local dig-node answers. By default, that one lookup goes out over **encrypted DNS** (DNS-over-HTTPS / DNS-over-TLS) instead of your network's plain resolver — so even dig-dns's own resolution isn't visible to whoever operates that resolver.

It tries, in order: **Mullvad** (encrypted), then **Quad9** (encrypted) as a fallback. If every encrypted provider is unreachable — some networks block DoH/DoT — dig-dns falls back to your OS's ordinary resolver so `rpc.dig.net` still resolves and nothing stops working; `dig-dns doctor` reports this state as **degraded**, so you know encryption fell back on this network.

Toggle it with an environment variable, default `on`:

```sh
DIG_DNS_SECURE_UPSTREAM=off dig-dns serve   # use the plain OS resolver for this lookup instead
```

`off` restores the OS resolver unconditionally for that one lookup; every other behavior — the `.dig` resolution above, `dig.local`, `localhost` — is unchanged either way.

## Related

- [Browse `.dig` names directly](./universal-installer.md#browse-dig-names-directly) — how dig-dns wires `.dig` resolution into your OS/browser
- [Configure dig-node](./configure.md) — ports, listeners, cache cap, upstream
- [Troubleshooting](../support/troubleshooting.md) — common failures and fixes
