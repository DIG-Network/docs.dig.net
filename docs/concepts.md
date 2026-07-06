---
sidebar_position: 1.5
title: Concepts & glossary
description: "One-page index of the core DIG Network entities — capsule, store, generation, URN, retrieval key, the dig RPC, the chia:// protocol, and on-chain anchoring — each defined once and linked to its deep doc."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts & glossary

This page defines every core DIG Network entity **once**, in plain language, and links each to the
doc that goes deep. It is the human-readable spine of the docs — and, because each term is also
emitted as machine-readable structured data, the map an agent can scrape to learn the network's
vocabulary. Skim it to orient; follow a link to go deep.

## The capsule {#capsule}

A **capsule** is one immutable store generation: the pair `(storeId, rootHash)`, written canonically
as `storeId:rootHash`. It is the network's atomic unit — of compilation (one fixed-size WASM module),
[pricing](./digstore/cli/onchain-anchoring.md) (a uniform per-capsule price to mint or commit, paid
in $DIG), retrieval (a [URN](#urn) names one capsule), caching, and provenance. A [store](#store) is a *sequence of
capsules*, one per commit. This definition is identical across DigStore, the dig RPC, and the DIG
Browser. → [The capsule, in full](./intro.md#the-capsule)

## Store {#store}

A **store** is an identity plus its content and history: a sequence of [capsules](#capsule), one per
commit. Its identity is a 64-hex **store id**, which *is* its on-chain Chia singleton launcher id —
the chain singleton is the authority for the store's current root. A store is the DIG equivalent of a
website. → [Store structure](./digstore/format/store-structure.md)

## Generation {#generation}

A **generation** is a single committed state of a [store](#store), identified by a **root hash** (a
Merkle root over the generation's per-resource leaves). Each `commit` seals the current content into
a new, append-only generation — the same thing a [capsule](#capsule) names. Generations grow
monotonically, like Git history. → [Generations & root hashes](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

A **URN** is DigStore's address *and* key in one string:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. It both **locates** a resource and **derives the
key that decrypts it** — possessing the URN is necessary and sufficient to read a public resource.
The browser-facing shorthand is the [`chia://` protocol](#chia-protocol). → [URNs & Encryption](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

The **retrieval key** is `SHA-256(canonical_urn)` — the only address that ever leaves the client. It
locates a resource's ciphertext without revealing its path or its [URN](#urn). It is
*root-independent*, so the same key finds a resource across [generations](#generation); the served
bytes are then [Merkle-verified](#merkle-proof) against the correct root. The separate
**decryption key** is derived locally (HKDF) from the same URN and never sent. → [Two values, one string](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Each [generation](#generation) builds a Merkle tree with one leaf per resource, committing to the
exact *ciphertext* bytes served. A single **inclusion proof** accompanies a served resource and
proves those bytes belong to that exact root — so content is verified without ever being decrypted,
and a node is never trusted to have returned genuine bytes. → [Merkle proofs](./digstore/format/proofs-and-security.md)

## On-chain anchoring {#anchoring}

Every store is a **singleton on Chia mainnet**. `digstore init` mints it (the launcher id *becomes*
the store id) and every `digstore commit` anchors a new [generation](#generation) root on-chain as a
CHIP-0035 singleton update. Both block until confirmed and spend real funds. The chain is the
authority for a store's latest root. → [On-chain anchoring](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG** is the DIG Network token (a Chia CAT). Minting a [capsule](#capsule) (`init`) or committing one
costs a **uniform per-capsule price in $DIG**, included **atomically in the same on-chain spend** as the
anchor — there is no separate transaction, and the memo carries the store id. → [Costs](./digstore/cli/onchain-anchoring.md#costs)

## DigStore CLI {#digstore-cli}

`digstore` is the command-line tool that creates, commits, shares, and reads stores — a Git-shaped
workflow (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) over the encrypted, on-chain
store format. → [Command reference](./digstore/cli/command-reference.md) · [CLI tutorial](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` is the **committable project manifest** at a project's root — `store-id`, `output-dir`,
`build-command`, and other project config, shared by `digstore dev`, `digstore deploy`, and the
scaffolding templates. It holds **no secrets** (those come from the environment), so it's safe to
commit. → [Project config & build-time values](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) is the **JS front door** for starting a DIG project: it
scaffolds a runnable starter — an app, a [`dig.toml`](#dig-toml), and (for the wallet templates) the
[DIG SDK](#dig-sdk) wired in — from one of five templates (`static`, `vite-react`, `next-static`,
`nft-drop`, `dapp-window-chia`). Scaffolding is **free** — no mint, no chain, no spend; you pay the
uniform capsule price only when you publish a [capsule](#capsule). It is the npm-side companion to the Rust CLI's
`digstore new`. → [Scaffold an app](./build-a-dapp/scaffold.md)

## The GitHub deploy Action {#deploy-action}

`dig-network/deploy-action` is the **git-push-to-deploy** GitHub Action: it installs the
[`digstore` CLI](#digstore-cli) on the runner, runs `digstore deploy` to advance your store (never
mints), and reports the published [capsule](#capsule) + URLs + cost back as step outputs, a PR
comment, a GitHub Deployment, and a commit status. With `if-changed` (default), a byte-identical
build is a no-op — no spend. → [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

The **DIG SDK** (`@dignetwork/dig-sdk`) is the typed npm package for integrating developers: a
`ChiaProvider` (prefers injected [`window.chia`](#window-chia), falls back to WalletConnect → Sage),
a `DigClient` (reads verified, encrypted content over the [dig RPC](#dig-rpc)), a `Paywall`
(a high-level pay-to-unlock / NFT-gated-access helper that composes the provider with the spend
builder), and the canonical CHIP-0035 spend builder re-exported at the `/spend` subpath.
→ [Build a dapp on Chia](./build-a-dapp/tutorial.md)

## The dig RPC {#dig-rpc}

The **dig RPC** is the network-wide read interface: a JSON-RPC 2.0 service over HTTPS `POST` that
every hosting node speaks identically. It serves ciphertext + [inclusion proofs](#merkle-proof) by
[retrieval key](#retrieval-key), whole [capsules](#capsule) by `(storeId, root)`, and discovery
metadata — blind by construction, verified and decrypted client-side. **It is the universal read
path**: every published capsule is readable here by its [URN](#urn) / [`chia://`](#chia-protocol) address the moment it
confirms on-chain — no registration and no payment beyond publishing the capsule. The optional,
human-friendly [`*.on.dig.net` handle](#on-dig-net) is a front door *on top of* this; the dig RPC
itself is always available. → [What is the dig RPC?](./rpc/what-is-the-dig-rpc.md)

## The chia:// protocol {#chia-protocol}

`chia://` is the DIG Browser's native content-address scheme — the typeable front end of the
[`urn:dig:` URN](#urn). Paste a `chia://<storeId>/` link and the browser fetches the content straight
from the network, content-addressed and cryptographically verified. → [The chia:// protocol](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` is the Chia wallet provider the **DIG Browser** injects into every page. It speaks
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), so a web app can
request the user's address, signatures, and spends with no WalletConnect setup — a drop-in
alternative for apps that already speak CHIP-0002. → [Using window.chia](./browser/using-window-chia.md)
· [provider reference](./browser/window-chia-reference.md) · [The window.chia provider spec](./protocol/window-chia-provider.md) (normative, versioned)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) is the web app for publishing and managing
[capsules](#capsule) without the CLI — create a capsule, deploy a frontend, and view your stores in
the browser. It is also the gated control plane that budgets expensive ZK execution-proof jobs.

## dig-node {#dig-node}

A **dig-node** is the network's content **server** — the supply side. It hosts [capsules](#capsule), keeps a
local `.dig` cache, and speaks the [dig RPC](#dig-rpc) identically to `rpc.dig.net`. You do **not** need
one to read DIG content (consumers fall back to `rpc.dig.net`); running one makes reads local-first and
contributes serving capacity. The host is **blind** — it only ever relays ciphertext + proofs.
→ [Run a node](./run-a-node/index.md)

## on.dig.net handle {#on-dig-net}

An **on.dig.net handle** is an *optional, paid* human-friendly web address for a [store](#store):
`<your-name>.on.dig.net`. A store does **not** get one automatically — you register the handle (a
paid CHIP-54 / `on.dig.net` registration in [DIGHUb](#dighub)) and that registration pins the store
to the name. No registration means no `*.on.dig.net` address. It is purely a convenience front door:
the store is already readable over the [dig RPC](#dig-rpc) by its [URN](#urn) / [`chia://`](#chia-protocol) address
whether or not a handle exists. (Account handles and store slugs are separate namespaces and do not
auto-expose a subdomain.) → [Can I get a `*.on.dig.net` address?](./support/faq.md#can-i-use-my-own-domain)

## Related

- [DIG Network overview](./intro.md) — the primitives at a glance
- [Quickstart](./quickstart.md) — build and preview free, publish a capsule at the end
- [Build a dapp on Chia](./build-a-dapp/tutorial.md) — every primitive stitched into one shipped dapp
- [What is DigStore?](./digstore/what-is-digstore.md) — the one-file store format
- [What is the dig RPC?](./rpc/what-is-the-dig-rpc.md) — the network read path
- [The chia:// protocol](./browser/chia-protocol.md) — addressing content in the browser
- [Get help](./support/get-help.md) — community channels and how to report

## For agents & LLMs

These docs are machine-extractable. Each page carries schema.org JSON-LD (this one as a
`DefinedTerm` set), and two curated maps live at the site root:

- [`/llms.txt`](pathname:///llms.txt) — a link-rich markdown map of the docs ([llms.txt convention](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — entities (concepts + docs) and typed edges (`defines`, `part-of`, `requires`, `see-also`).
