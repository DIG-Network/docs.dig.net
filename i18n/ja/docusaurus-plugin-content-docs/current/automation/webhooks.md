---
sidebar_position: 2
title: Webhooks
description: "Register an HTTPS endpoint to be notified when a deployment changes state — queued, building, ready, or error. Each event is signed so you can verify it came from DIGHUb. The event contract — payload shape and signature — is stable; delivery is rolling out."
keywords:
  - webhooks
  - deploy events
  - X-Dig-Signature
  - HMAC
  - verify webhook
  - deploy.ready
  - CI dashboard
tags:
  - dighub
  - deploy-action
  - store
  - capsule
  - anchoring
---

# Webhooks

> **Get notified when a deployment changes state.** Register an HTTPS endpoint for one of your stores and DIGHUb will `POST` a small JSON event each time a deploy moves through `queued → building → ready` (or `error`) — wire it to a Slack bot, a CI dashboard, or your own automation. Every event is **signed** so you can verify it came from DIGHUb.

:::info Status — register now; delivery is rolling out
You can **register, list, and remove** webhooks today, and the **event contract below (payload shape + signature) is stable and final**, so you can build and test your receiver against it now. The DIGHUb-side delivery of live deploy events is being rolled out — until it's enabled for your store, a registered endpoint won't yet receive events. The contract won't change when it turns on.
:::

## The mental model

A **deploy** is the act of publishing a new [capsule](../concepts.md#capsule) — staged, then anchored on-chain. As it progresses, it passes through a few **states**. A webhook is your endpoint subscribing to those state changes for one [store](../concepts.md#store): when the deploy's state changes, DIGHUb sends a signed JSON `POST` to your URL. You verify the signature, then act on it.

You register a webhook **per store**, and only the store **owner** can manage its webhooks.

## Events

The `event` field is always `deploy.<state>`. There are four states:

| Event | Meaning |
|---|---|
| `deploy.queued` | A deploy has been accepted and queued. No content root exists yet. |
| `deploy.building` | The capsule is being compiled / staged. |
| `deploy.ready` | The deploy succeeded — the new root is anchored and the capsule is live. *(terminal)* |
| `deploy.error` | The deploy failed. *(terminal)* |

A successful deploy goes `queued → building → ready`; a failure goes `… → error`. `ready` and `error` are terminal — no further events follow for that deploy.

## Payload

The request body is a single JSON object (`Content-Type: application/json`):

```json
{
  "event": "deploy.ready",
  "store_id": "<64-hex store id>",
  "root": "<64-hex content root>",
  "state": "ready",
  "confirmations": 3,
  "at": 1719700000
}
```

| Field | Type | Description |
|---|---|---|
| `event` | string | The event name, `deploy.<state>` (e.g. `deploy.ready`). |
| `store_id` | string | The store the deploy belongs to (hex). |
| `root` | string \| null | The new content [root hash](../concepts.md#generation) (hex). `null` for a `queued` event, before a root exists. |
| `state` | string | The deploy state: `queued`, `building`, `ready`, or `error`. Mirrors `event`. |
| `confirmations` | number | On-chain confirmation depth at the moment the event was emitted (`0` while building). |
| `at` | number | Emit time, Unix seconds. |

A `(store_id, root)` pair is a [capsule](../concepts.md#capsule) — so a `deploy.ready` event identifies exactly which capsule went live, readable immediately over the [dig RPC](../concepts.md#dig-rpc) by its [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) address.

## Register a webhook

Webhooks are managed in DIGHUb, on the store you own:

1. Open your store in [DIGHUb](https://hub.dig.net) and go to the **Automation** tab.
2. In **Deploy webhooks**, add your endpoint URL. It **must** be `https://` — deploy events carry your production root, so plain HTTP is rejected.
3. DIGHUb shows the webhook's **signing secret once**. Copy it now — it's revealed a single time and is what you'll use to verify every event.

You can register more than one endpoint per store, list the ones you have, and remove any of them at any time from the same place.

:::caution Save the signing secret when it's shown
The secret is shown only on creation. DIGHUb does not store it in a way it can show you again, so if you lose it, delete the webhook and register a new one to get a fresh secret.
:::

## Verify each event

Every delivery carries an HMAC signature so you can confirm it genuinely came from DIGHUb and the body wasn't altered. The header is:

```
X-Dig-Signature: sha256=<hex>
```

`<hex>` is the **HMAC-SHA256 of the exact raw request body**, keyed by your webhook's signing secret. To verify: compute the same HMAC over the bytes you received and compare (use a constant-time comparison).

Node.js:

```js
import crypto from "node:crypto";

// `rawBody` is the exact bytes received (verify BEFORE JSON-parsing).
function verify(rawBody, signatureHeader, secret) {
  const expected =
    "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signatureHeader || "");
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

:::tip Verify the raw bytes, then parse
Compute the HMAC over the exact body you received, before any JSON re-serialization — re-encoding can change bytes (key order, whitespace) and break the comparison. Reject any request whose signature doesn't match.
:::

## Delivery & retries

- Each event is delivered with a single `POST` to your endpoint. Respond with a `2xx` status to acknowledge.
- A non-`2xx` response (or a connection failure) is **retried** — up to **5 attempts** with exponential backoff (the first retry is immediate, then growing delays capped at 5 minutes).
- Make your receiver **idempotent**: a retried delivery repeats the same event, so key any side effects off `(store_id, root, state)` rather than assuming exactly-once delivery.
- Endpoints must be reachable over public HTTPS with a valid certificate.

## A typical use

- **Notify a channel** — `deploy.ready` → post the new capsule's address to Slack/Discord; `deploy.error` → page whoever's on call.
- **Drive a dashboard** — track `queued → building → ready/error` per store to show deploy status.
- **Trigger follow-on work** — on `deploy.ready`, kick a cache warm, a smoke test against the live `chia://` address, or a downstream build.

If you publish from CI with the [deploy Action](../digstore/cli/deploy-from-github-actions.md), you already get a PR comment, a GitHub Deployment, and a commit status for each deploy — webhooks are for **out-of-band** consumers (a bot, a dashboard, another service) that aren't watching the PR.

---

## Go deeper: the protocol

- **"a `(store_id, root)` is a capsule"** → [Concepts & glossary → capsule](../concepts.md#capsule)
- **"the new root is anchored on-chain"** → [On-chain anchoring](../digstore/cli/onchain-anchoring.md)
- **"branch on stable codes, not prose"** → [Error codes](../support/error-codes.md)
- **Everything** → [Protocol deep-dive](../protocol-deep-dive.md)

## Related

- [Deploy keys](./deploy-keys.md) — let CI publish for you without your wallet seed
- [Deploy from GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-publish, with PR previews and commit status
- [Concepts & glossary](../concepts.md) — store, capsule, root, and the dig RPC defined
