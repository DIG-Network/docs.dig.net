---
sidebar_position: 1
title: The chia:// protocol & URN scheme
description: "A content-addressed protocol for opening stores and resources directly from the DIG Network, with URN and shorthand forms."
keywords:
  - chia protocol
  - chia:// scheme
  - URN
  - store id
  - root hash
  - retrieval key
  - DIG Browser
  - SPA history-fallback
  - local-first serving
tags:
  - chia-protocol
  - browser
  - urn
  - store
  - capsule
  - retrieval-key
  - window-chia
---

# The `chia://` protocol

**`chia://` is the DIG Browser's native address scheme.** Paste a `chia://` link into the address bar and the browser fetches the content straight from the DIG Network — content-addressed and cryptographically verified — with no web server in the middle. It is the browser-facing front end of dig-store's [`urn:dig:` URN scheme](../digstore/format/urns-and-encryption.md): the same identity, in a form you can type and link. The browser also provides [`window.chia` wallet integration](./using-window-chia.md) for apps running in the DIG Browser.

:::note Renamed from `dig://`
The scheme value is `chia` (it was previously `dig`); it is otherwise **functionally identical**. The underlying `urn:dig:` URN namespace is **unchanged** — it derives retrieval keys and must stay byte-exact — so only the typed/linked address changed, not the protocol.
:::

## Just open a link

For most people there is nothing to learn. A DIG address looks like this:

```
chia://2855390f…aade/
```

That opens a **store** — the DIG equivalent of a website — and shows its home page. Everything you'd expect from a browser works: links, images, JavaScript, and even the [built-in wallet](./using-window-chia.md). The address bar shows the clean form (`chia://<store>/`); you never see `/index.html`.

A few addresses are special, handled by the browser itself:

| Address | Opens |
|---|---|
| `chia://home` | The DIG Browser home page (also the new-tab page). |
| `chia://wallet` | The browser's built-in Chia wallet. |
| `chia://settings` | DIG settings (local cache, etc.) — a deprecated alias the browser rewrites to `chrome://settings/dig`. |
| `dig://control` | The **Control Pane** — opened from the dedicated Control Pane button in the toolbar (next to the wallet + shields buttons). It opens full-page in the active tab and manages your local DIG node: if a node is running it shows the management view, otherwise it shows how to install one. Browsing never needs a node. |

Everything else after `chia://` is a **store id** — that is the difference between a special page and on-chain content.

:::tip Try it
[**Get the DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) and open `chia://home` in the address bar to see these built-in pages live.
:::

:::note Open `chia://` links from any app
You don't need the DIG Browser to follow a `chia://` link. When you install a [dig-node](../run-a-node/universal-installer.md), it registers `chia://` (and `urn:`) as an operating-system handler, so clicking one in an email, a chat, or an ordinary browser routes it through your local node and opens the content in your default browser. See [Open `chia://` links from anywhere](../run-a-node/universal-installer.md#chia-scheme-handler).
:::

## Addressing content

A DIG address has up to three parts: **which store**, **which version of it**, and **which file inside it**.

```
chia://<storeId>/<resource>                  # latest version of the store
chia://<storeId>:<rootHash>/<resource>       # a specific, pinned version
chia://<rootHash>.<storeId>/<resource>       # same thing, host-label form
```

| Part | What it is | Default |
|---|---|---|
| `storeId` | The store's id — a **64-character hex** string (the CHIP-0035 DataLayer singleton launcher id). | Required |
| `rootHash` | A **64-character hex** id pinning one specific version. Omit it and the browser resolves the store's **latest** on-chain version. | Latest |
| `resource` | The path of a file inside the store, e.g. `about/index.html`. Omit it and you get the default file, `index.html`. | `index.html` |

So `chia://2855…aade/` and `chia://2855…aade/index.html` open the same page — the browser canonicalizes the default view to `chia://2855…aade/` and hides the `index.html`, exactly like a web server serving `/`.

Both id parts are case-insensitive and normalized to lowercase. An address whose `storeId` (or `rootHash`) is not a valid 64-hex string is rejected as not a DIG address.

:::info Latest vs. pinned
Without a `rootHash` you always get the store's **current** version — the browser resolves and verifies against the store's chain-anchored tip, not whatever a host claims. Include a `rootHash` to pin one exact, immutable version (a [capsule](#capsule-the-unit-of-identity)) that never changes.
:::

## The full URN form

`chia://` is shorthand. The canonical, portable identity is the dig-store **URN**, which the browser also accepts directly in the address bar:

```
urn:dig:<chain>:<storeId>[:<rootHash>][/<resource>]
```

| Part | Role | Required |
|---|---|---|
| `urn:dig:` | Scheme + namespace (literal) | Required |
| `<chain>` | Chain identifier — always `chia` | Required |
| `<storeId>` | 64-hex store id | Required |
| `<rootHash>` | Pin a specific version; omit for the latest | Optional |
| `<resource>` | File path within the store; omit for the default (`index.html`) | Optional |

```
urn:dig:chia:2855390f…aade/readme.txt              # latest version
urn:dig:chia:2855390f…aade:1a2b3c…/readme.txt      # pinned version
```

When you type a URN (`urn:dig:…`) or a chain-qualified shorthand (`chia://chia:<storeId>…`), the browser **canonicalizes** it to the host-bearing form `chia://[<rootHash>.]<storeId>/<resource>`. Two benefits: it parses as an ordinary URL, and **relative subresources** (the page's images, scripts, links) resolve against the same store and version automatically.

The URN's grammar is defined once, in dig-store's [`urn.rs`](https://github.com/DIG-Network/dig-store), and is shared byte-for-byte by every implementation (the browser, `dig-node`, the RPC, the extension).

## For integrating developers — the shorthand grammar

If you generate or parse DIG addresses, these are the exact accepted forms. The browser's parser strips an optional `chia://` (or `chia:`) and an optional `urn:dig:` prefix, then reads the head as colon-separated segments:

```
chia://<storeId>[:<rootHash>][/<resource>]
chia://<chain>:<storeId>[:<rootHash>][/<resource>]
chia://[<rootHash>.]<storeId>[/<resource>]            # canonical host-label form
urn:dig:<chain>:<storeId>[:<rootHash>][/<resource>]
```

Parsing rules (from the shared parser):

- **One head segment** → `storeId`.
- **Two head segments** → if **both** are 64-hex it is `storeId:rootHash`; otherwise it is `chain:storeId`.
- **Three head segments** → `chain:storeId:rootHash`.
- **More than three** → rejected.
- The `chain` defaults to **`chia`** when omitted.
- `storeId` and (if present) `rootHash` must each be **exactly 64 hex characters**; anything else is rejected.
- The resource is everything after the **first** `/`. An empty resource means the default view (`index.html`).
- In the host-label form, the host is `<storeId>` or `<rootHash>.<storeId>` (two 64-hex labels separated by `.`).

A private (encrypted) store may carry its secret as a `?salt=<hex>` query parameter; it is preserved through canonicalization and never affects the host.

## For integrating developers — serving from a local node {#serving-from-a-local-node}

When a local [dig-node](../concepts.md#dig-node) answers, the extension opens a `chia://` address by navigating directly to the node's plaintext serve surface instead of its own sandboxed viewer — the store loads as an ordinary website, already decrypted and verified before the node sends any bytes.

- **Rooted at the store.** The response is scoped to `<storeId>[:<rootHash>]`, so the page's own relative links, images, and scripts resolve inside that same store and version with no change to the page's markup.
- **Root-absolute links (`/foo`) reroot to the same store**, so a page written with root-absolute paths — the default for most SPA build tools — keeps working unmodified.
- **Client-side routes fall back to the entry page.** A request for a path that isn't one of the store's files, and doesn't look like a static asset, serves the store's `index.html` instead of a dead end — the same **SPA history-fallback** convention every static host uses, so a page's own JavaScript router can render the route. A request for a path that *looks* like a static asset (a known extension the store simply doesn't have) still 404s.
- **Absolute links to another origin (`https://…`)** are untouched — the browser navigates there directly, off the node entirely.
- **No reachable node?** The same address still opens fine, verified and decrypted in the browser from the public network — just without the local-serving behavior above.

→ [Reading from your own node](../audiences/content-consumers.md#reading-from-your-own-node) · [Point a consumer at your node](../run-a-node/point-a-consumer.md)

## For protocol developers {#capsule-the-unit-of-identity}

### Capsule: the unit of identity

A **capsule** is one immutable store generation: the pair **`(storeId, rootHash)`**, written canonically as **`storeId:rootHash`**. A **store is a sequence of capsules** — one per commit, since each commit advances the on-chain root and produces a new capsule. A `chia://` (or URN) address **with** a `rootHash` names exactly one capsule; **without** a `rootHash` it names a store and resolves to its latest capsule. This is the ecosystem-wide [capsule concept](../intro.md#the-capsule); the canonical identity type lives in dig-store's `capsule.rs`.

### Retrieval key

The address you hold is never sent to a host. The browser derives a **retrieval key** from the canonical URN and sends only that:

```
retrieval_key = SHA-256(canonical_urn)        # lowercase hex
```

Two details matter for getting the same key everywhere:

- The **chain** is the constant `chia` (dig-store's `CHAIN`), and a missing resource defaults to **`index.html`** (`DEFAULT_RESOURCE_KEY`).
- The retrieval key is derived from the **root-dropped** URN — the `rootHash` is **not** part of the key. The key is therefore root-independent, so the same key locates a resource across versions; the served bytes are then Merkle-verified against the correct root.

Getting the canonical string wrong yields a silent cache miss, never corruption — every response is Merkle-verified against the store's on-chain root before it renders. For the full retrieval-key + decryption-key derivation, see [URNs & Encryption](../digstore/format/urns-and-encryption.md).

## Related

- [Using window.chia](./using-window-chia.md) — the injected wallet provider on every page
- [URNs & Encryption](../digstore/format/urns-and-encryption.md) — the canonical URN the scheme shortens
- [What is the dig RPC?](../rpc/what-is-the-dig-rpc.md) — how the browser fetches content over the network
- [Store structure](../digstore/format/store-structure.md) — store id, root hash, and generations
- [Point a consumer at your node](../run-a-node/point-a-consumer.md) — local-first reads + the shared `.dig` cache
- [Concepts & glossary](../concepts.md) — the chia:// protocol, URN, and capsule defined
