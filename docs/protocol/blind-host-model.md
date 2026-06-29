---
sidebar_position: 14
title: "L6 · The blind host model"
description: "The provider-blindness invariant, serve_blind (framing-only decode), the root-pinned immutable response cache, the *.on.dig.net + custom-domain resolver, the /v1 control plane (CHIP-0002 login, JWT sessions, refresh reuse-detection, action re-auth, GitHub-OIDC CI), and the accept-on-signature push trust model."
keywords:
  - blind host
  - serve_blind
  - resolver
  - control plane
  - CHIP-0002
  - GitHub OIDC
  - accept-on-signature
tags:
  - dig-rpc
  - dighub
  - chip-0035
  - chip-0002
  - capsule
---

# Layer 6 · The blind host model

> **Canonical reference:** hub `services/retrieval/src/bin/bootstrap.rs` (blind read/write), `services/resolver` (the resolver), `services/api` (the `/v1` control plane). DIG's hub is a **provider-blind host** plus three trust planes.

## The blind invariant

The hub holds only **ciphertext keyed by `retrieval_key`** — no URN, no decryption key. It relays the capsule's `serve_blind` output **verbatim** (a real hit OR the capsule's own indistinguishable decoy) and **cannot tell hit from miss**. The trusted root comes **only from the chain**, never from the serving origin.

## Plane A — blind read/write at rpc.dig.net

### serve_blind (framing-only decode)

`serve_via_runtime` (`bootstrap.rs:1489-1633`): fetch the `.dig` for `(store, root)` from the modules bucket (staging fallback for the read-before-promote window), check magic `\0asm` + size ≤ 256 MiB, then run the module's serve for the 32-byte key inside `HostRuntime` under §18.2 ExecutionLimits (fuel/epoch/384-MiB). The host decodes the [ContentResponse](./self-defending-module.md#the-contentresponse-wire-envelope) **framing only** — NOT decryption; ciphertext stays sealed. It does **not** verify the proof and does **not** judge presence.

A `None` is returned **only** for a genuine infra failure (no host seed / module absent / trap / undecodable) → a uniform [`-32004`](./dig-rpc.md#error-model); the hub **never fabricates a miss**.

### Response key-cache

Root-pinned `(store, root, retrieval_key, aligned-range)` only — verbatim `serve_blind` output, LRU/size-capped, **no TTL (immutable)**. Only an explicit concrete root is cacheable; "latest"/absent reads are never cached.

### Push trust = accept-on-signature {#push-trust}

The §21 push write path applies **two** gates: §21.9 [identity auth](./transport-and-push.md#per-request-auth) (any valid identity) + **ownership** (`verify_push_owner`: BLS verify over `SHA-256(PUSH_DST || new_root || store_id)` against the store's **registered** `store_pubkey`).

:::warning DRIFT — accept-on-signature, not on-chain finality
The trust model is **accept-on-signature**: a store the hub doesn't yet host is **auto-created headless/Unlisted** with a **trust-on-first-use** `store_pubkey`, reconciled later by the **anchor-watcher**. This is safe because readers [verify against the on-chain coinset root client-side](./verification-and-provenance.md#gate-3) — an unanchored head simply won't verify (treated as not-found) until the publisher anchors the singleton. This is a deviation from the on-chain-finality framing. Catalogued in [Drift](./drift-from-whitepapers.md).
:::

## Plane B — the resolver (`*.on.dig.net` + custom domains)

`BASE_ZONE = "on.dig.net"`. `subdomain_of` requires exactly one label before `on.dig.net`; `render_for(domain)` → Loader | Available | Pending | Expired | Revoked. The loader embeds `window.__DIG__ = { storeId, root, salt, rpc: "https://rpc.dig.net/", subdomain }` (with `</` → `<\/` script-breakout escape). Custom domains: CloudFront preserves the viewer host in `x-dig-host`; a `CUSTOMDOM#<host>` row maps an external FQDN to a linked subdomain when `status == "active"`. **Hard rule:** never set a `Domain=.dig.net` cookie; the sandboxed preview origin is `{store}.usercontent.dig.net`.

## Plane C — the `/v1` control plane {#v1-control-plane}

- **Login (CHIP-0002).** `POST /v1/auth/challenge` issues a single-use challenge (message `"dighub-login:v1:<nonce>:hub.dig.net:<ts>"`, 120s TTL); `POST /v1/auth/verify` atomically consumes it (replay-proof), binds `ph_from_key == ph_from_addr`, and BLS-AugScheme-verifies over the CHIP-0002 signed-message hash.
- **Sessions.** EdDSA JWT (`iss=hub.dig.net`, `aud=dighub-api|dighub-cli`, access TTL 900s) + an opaque refresh token (sha256-stored, 30d). **Refresh rotation with RFC-6819 family reuse-detection**: a presented hash that ≠ the current one revokes the family + 401; rotation is atomic (closes the concurrent-refresh TOCTOU). Bearer auth pins `Algorithm::EdDSA` + iss + audience and requires a live, non-revoked server-side Session row (real logout).
- **High-impact action re-auth.** `POST /v1/auth/action` issues a 300s action challenge (`store_delete|store_transfer|account_reset`); `verify_action` requires a **fresh wallet signature**, not a bearer.
- **GitHub-OIDC keyless CI auth.** `POST /v1/auth/ci/github-oidc` (the OIDC token IS the auth): verify fail-closed (RS256 pinned, iss/aud/exp checked, alg:none rejected) → resolve `repository@ref` → require a registered binding → require the bound store still exists + is still owned → mint a scoped `aud=dighub-cli` session (no refresh, 900s).

## Related

- [The dig RPC](./dig-rpc.md) — the read interface the hub exposes blind
- [§21 transport & push](./transport-and-push.md) — the push write path
- [Verification & provenance](./verification-and-provenance.md) — why the host is never the trust anchor
- [On-chain anchoring](./on-chain-anchoring.md) — the anchor-watcher reconciliation
- [Drift from the whitepapers](./drift-from-whitepapers.md) — accept-on-signature trust
