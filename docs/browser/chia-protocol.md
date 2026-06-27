---
sidebar_position: 1
title: The chia:// protocol & URN scheme
---

# The `chia://` protocol

**`chia://` is the DIG Browser's native address scheme.** Paste a `chia://` link into the address bar and the browser fetches the content straight from the DIG Network — content-addressed and cryptographically verified — with no web server in the middle. It is the browser-facing front end of DigStore's [`urn:dig:` URN scheme](../digstore/format/urns-and-encryption.md): the same identity, in a form you can type and link.

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
| `chia://settings` | DIG settings (local cache, etc.). |

Everything else after `chia://` is a **store id** — that is the difference between a special page and on-chain content.

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

`chia://` is shorthand. The canonical, portable identity is the DigStore **URN**, which the browser also accepts directly in the address bar:

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

The URN's grammar is defined once, in DigStore's [`urn.rs`](https://github.com/DIG-Network/digstore), and is shared byte-for-byte by every implementation (the browser, `dig-node`, the RPC, the extension).

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

## For protocol developers {#capsule-the-unit-of-identity}

### Capsule: the unit of identity

A **capsule** is one immutable store generation: the pair **`(storeId, rootHash)`**, written canonically as **`storeId:rootHash`**. A **store is a sequence of capsules** — one per commit, since each commit advances the on-chain root and produces a new capsule. A `chia://` (or URN) address **with** a `rootHash` names exactly one capsule; **without** a `rootHash` it names a store and resolves to its latest capsule. This is the ecosystem-wide [capsule concept](../intro.md#the-capsule); the canonical identity type lives in DigStore's `capsule.rs`.

### Retrieval key

The address you hold is never sent to a host. The browser derives a **retrieval key** from the canonical URN and sends only that:

```
retrieval_key = SHA-256(canonical_urn)        # lowercase hex
```

Two details matter for getting the same key everywhere:

- The **chain** is the constant `chia` (DigStore's `CHAIN`), and a missing resource defaults to **`index.html`** (`DEFAULT_RESOURCE_KEY`).
- The retrieval key is derived from the **root-dropped** URN — the `rootHash` is **not** part of the key. The key is therefore root-independent, so the same key locates a resource across versions; the served bytes are then Merkle-verified against the correct root.

Getting the canonical string wrong yields a silent cache miss, never corruption — every response is Merkle-verified against the store's on-chain root before it renders. For the full retrieval-key + decryption-key derivation, see [URNs & Encryption](../digstore/format/urns-and-encryption.md).
