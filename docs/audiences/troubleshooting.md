---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "Every failure gives you a stable code and a request-id that ties straight to the server log, on-chain spends are race-guarded so you never double-pay, and clear pre-flight guards stop wasted capsules before you spend $DIG."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Troubleshooting

> Every failure gives you a **stable code** and a **request-id** that ties straight to the server log, on-chain spends are **race-guarded** so you never double-pay, and clear **pre-flight guards** stop wasted capsules before you spend $DIG.

## The mental model — find your failure by its code

Every surface — the dig RPC, the digstore CLI, DIGHUb, the `chia://` loader, the SDK — maps a failure to one **STABLE code**. **Branch on the code, never the message.** One consolidated catalog covers all of them and is also published machine-readable.

Pre-flight guards (`digstore doctor`, `--dry-run`, `--if-changed`) and resumable anchors mean a stuck or no-op publish **never silently spends**.

## Common publishing failures

Insufficient funds, a confirm timeout (resumable — your spend isn't lost), and the non-fast-forward "remote root has advanced".

→ [Troubleshooting](../support/troubleshooting.md)

## Read & verify failures

Proof mismatch, decrypt/salt errors, and not-found / decoy responses.

→ [Read & verify failures](../support/troubleshooting.md#verification-failed)

## Wallet & session issues

Connect, re-auth, a declined request, and watch-only sessions that can't sign.

→ [Wallet session can't sign](../support/troubleshooting.md#wallet-session)

## Pre-flight & cost checks — don't waste a capsule

`digstore doctor` (environment + readiness), `--dry-run` (preview the cost and the would-be capsule), and `--if-changed` (a byte-identical build is a no-op).

→ [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [On-chain anchoring → cost & safety](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Error codes reference

CLI exit codes · RPC `-32xxx` · DIGHUb · dig-loader · SDK — one consolidated table.

→ [Error codes](../support/error-codes.md)

## FAQ

Cost, the free trial, why the price is uniform, where to get $DIG, and "is there a testnet?".

→ [FAQ](../support/faq.md)

## Get help

Discord + GitHub, and how to file a good report — **never paste secrets**.

→ [Get help](../support/get-help.md)

## Status & changelog

→ [Status](../support/status.md) · [Changelog](../support/changelog.md)

---

## Go deeper: the protocol

- **read & verify failures** → [Proofs & security](../digstore/format/proofs-and-security.md) · [URNs & encryption](../digstore/format/urns-and-encryption.md)
- **RPC `-32xxx` codes** → [the dig RPC methods](../rpc/methods.md) · [Conformance](../rpc/conformance.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md) · [Concepts & glossary](../concepts.md)
