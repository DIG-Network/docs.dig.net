---
sidebar_position: 5
title: Sharing over a remote
description: "Publishing stores to remotes, downloading with verification, revoking roots, and understanding public vs. private access models."
keywords:
  - digstore remote
  - push
  - clone
  - pull
  - revoke
  - public vs private store
tags:
  - digstore-cli
  - store
  - dig-rpc
  - merkle-proof
  - anchoring
  - urn
---

# Sharing over a remote

A **remote** is an HTTPS endpoint that stores and serves your `.wasm` module. Because the module is ciphertext addressed by hashes, the remote learns nothing about its contents.

## Publish

```sh
# publisher
digstore remote add origin https://example.com/stores/<storeId>
digstore push origin
```

`push` uploads the compiled module and the signed root for the current deployment.

```sh
digstore remote list             # show configured remotes
digstore remote remove origin    # drop one
```

## Consume

From a fresh directory:

```sh
digstore clone https://example.com/stores/<storeId>
digstore cat   urn:dig:chia:<storeId>:<rootHash>/readme
digstore pull  origin            # later: fetch the publisher's newer deployment
```

## Downloads are verified

`clone` and `pull` verify what they download **before** installing it:

- the module must embed a public key whose hash equals the **store id** you asked for;
- the served root must carry the **publisher's signature**;
- the served root must match the project's **current on-chain singleton root** (queried live from Chia mainnet — fails closed if the chain is unreachable or the roots differ).

A malicious or broken server can't feed you fabricated content — the command fails instead. See [Proofs & Security](../format/proofs-and-security.md) and [On-chain anchoring](./onchain-anchoring.md).

:::caution HTTPS required
Remotes must be `https://`. Plain `http://` is allowed only for `localhost` (local testing).
:::

## Public vs private when sharing

- **Public project** — hand someone the URN and they can read it. The URN is the whole capability.
- **Private project** — also give them the secret salt (out-of-band). They locate with the URN but decrypt with `--salt <hex>`:

  ```sh
  digstore cat urn:dig:chia:<storeId>/secret --salt <hex>
  ```

## Revoking a published root

If a deployment must be retracted (e.g. a leaked or bad build), publish a signed tombstone:

```sh
digstore revoke --root <hex> --reason superseded     # retract one deployment
digstore revoke --all --reason takedown              # retract the whole project
```

Remotes persist tombstones and clients honor them fail-closed — a revoked root is refused.

:::note Reading over the network
A remote serves the **whole module** for `clone`/`pull`/`push`. To read individual resources from a
published store over the network, see the [dig RPC](../../rpc/what-is-the-dig-rpc.md) and its
git-style [`dig://` remote](../../rpc/dig-remote.md) — the same nodes, addressed as `dig://…`.
:::

## Related

- [The dig:// remote](../../rpc/dig-remote.md) — clone/pull/push over `dig://` with per-request auth
- [What is the dig RPC?](../../rpc/what-is-the-dig-rpc.md) — the network-wide read interface
- [Proofs & Security](../format/proofs-and-security.md) — what `clone`/`pull` verify before installing
- [Streaming & retrieval keys](./streaming-and-keys.md) — fetch resources by URN or key
- [Concepts & glossary](../../concepts.md) — store, capsule, and anchoring defined

Next: [Streaming & keys →](./streaming-and-keys.md)
