---
sidebar_position: 4
title: Sharing over a remote
---

# Sharing over a remote

A **remote** is an HTTPS endpoint that stores and serves your `.wasm` module. Because the module is ciphertext addressed by hashes, the remote learns nothing about its contents.

## Publish

```sh
# publisher
digstore remote add origin https://example.com/stores/<storeID>
digstore push origin
```

`push` uploads the compiled module and the signed root for the current generation.

```sh
digstore remote list             # show configured remotes
digstore remote remove origin    # drop one
```

## Consume

From a fresh directory:

```sh
digstore clone https://example.com/stores/<storeID>
digstore cat   urn:dig:chia:<storeID>:<rootHash>/readme
digstore pull  origin            # later: fetch the publisher's newer generation
```

## Downloads are verified

`clone` and `pull` verify what they download **before** installing it:

- the module must embed a public key whose hash equals the **store id** you asked for;
- the served root must carry the **publisher's signature**.

A malicious or broken server can't feed you fabricated content — the command fails instead. See [Proofs & Security](../format/proofs-and-security.md).

:::caution HTTPS required
Remotes must be `https://`. Plain `http://` is allowed only for `localhost` (local testing).
:::

## Public vs private when sharing

- **Public store** — hand someone the URN and they can read it. The URN is the whole capability.
- **Private store** — also give them the secret salt (out-of-band). They locate with the URN but decrypt with `--salt <hex>`:

  ```sh
  digstore cat urn:dig:chia:<storeID>/secret --salt <hex>
  ```

## Revoking a published root

If a generation must be retracted (e.g. a leaked or bad build), publish a signed tombstone:

```sh
digstore revoke --root <hex> --reason superseded     # retract one generation
digstore revoke --all --reason takedown              # retract the whole store
```

Remotes persist tombstones and clients honor them fail-closed — a revoked root is refused.

Next: [Streaming & keys →](./streaming-and-keys.md)
