---
sidebar_position: 1
title: The window.chia provider (specification)
description: "Normative, versioned specification of the window.chia Chia wallet provider — the provider object shape, the EIP-1193-style request contract, every CHIP-0002 method with params/returns/error codes, the connect/202-pending contract, capability discovery, and EIP-6963-style multi-provider discovery."
schema_type: TechArticle
keywords:
  - window.chia
  - provider specification
  - CHIP-0002
  - EIP-1193
  - EIP-6963
  - multi-provider discovery
  - Chia wallet provider
  - DIG Browser
tags:
  - window-chia
  - provider-spec
  - chip-0002
  - browser
  - dig-sdk
  - chia-protocol
---

# The `window.chia` provider — specification

This is the **normative, versioned specification** of the `window.chia` Chia wallet provider: the
in-page object a Chia wallet injects so any web page can request the user's address, public keys,
signatures, balances, coins, and spends — the way EIP-1193 lets an Ethereum dapp talk to `window.ethereum`.

This page is for **provider authors** (wallets that want to be `window.chia`-compatible) and for
**dapp authors** who want the exact contract rather than the [task-oriented integration
guide](../browser/using-window-chia.md). If you just want to wire a wallet into an app, start there;
this page is the contract underneath it.

:::info Status & versioning
The provider surface is versioned by a single field, [`chiaVersion`](#capability--version), and the
status of each part of this spec is called out inline:

- **Normative** — implemented today and required for compatibility. The [DIG Browser](#reference-implementation)
  native provider is the reference implementation; [`@dignetwork/dig-sdk`](#recommended-consumer)'s
  `ChiaProvider` is the reference consumer. Both ship the surface below.
- **Proposed** — specified here but **not yet implemented** anywhere. Marked **(proposed)** at the
  point of use. Provider authors SHOULD treat proposed surface as the migration target; dapp authors
  MUST feature-detect it before relying on it.

This spec uses **MUST / SHOULD / MAY** in the [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) sense.
:::

## 1. The provider object {#provider-object}

A compliant provider is a single object exposed at `window.chia`. It is injected into the page's main
world **at document start**, so it is present synchronously on first script execution. When it is in
place the provider MUST dispatch a `chia#initialized` event on `window` (so late-loading code can
detect it without polling).

```ts
interface ChiaProvider {
  // ---- identity / capability (normative) ----
  isDIG?: boolean;          // unspoofable marker set by the DIG Browser's provider
  isConnected: boolean;     // flips true after a successful connect()

  // ---- capability descriptor (proposed) ----
  chiaVersion?: string;     // semver of THIS provider's window.chia surface
  capabilities?: string[];  // method names this provider implements (feature-detect)

  // ---- the EIP-1193-style contract (normative) ----
  request(args: { method: string; params?: unknown }): Promise<unknown>;
  connect(eager?: boolean): Promise<unknown>;

  // ---- events (normative) ----
  on(event: string, handler: (data: unknown) => void): void;
  off(event: string, handler: (data: unknown) => void): void;
}
```

| Member | Status | Contract |
|---|---|---|
| `isDIG` | normative | `true` iff this is the DIG Browser's native provider. A consumer that specifically wants the DIG wallet MUST key on this, **not** on the bare presence of `window.chia` (another Chia wallet could also define `window.chia`). Other providers MAY set their own `isX` marker. |
| `isConnected` | normative | `false` until a `connect()` resolves for this origin, then `true`. Reflects per-origin approval, not transport liveness. |
| `chiaVersion` | **proposed** | Semantic version of the provider surface this object implements (e.g. `"1.0.0"`). Absent today; see [§5](#capability--version). |
| `capabilities` | **proposed** | The method names this provider answers, for feature detection without a round-trip. See [§5](#capability--version). |
| `request(...)` | normative | The single CHIP-0002 entrypoint. See [§3](#request). |
| `connect(...)` | normative | Establishes per-origin consent. See [§2](#connect). |
| `on` / `off` | normative | EIP-1193-style event subscription. See [§6](#events). |

A provider MUST NOT clobber an already-present provider: if `window.chia` is already set, an injecting
provider MUST leave it in place. (The DIG Browser does exactly this — `if (window.chia) return;` —
which is also why two Chia wallets cannot coexist today and why [§7 discovery](#discovery) exists.)

## 2. `connect(eager?)` — per-origin consent {#connect}

```ts
await window.chia.connect();      // prompt the user to approve this origin
await window.chia.connect(true);  // "eager": silently reuse a prior approval, else reject
```

A dapp MUST call `connect()` and have it resolve **before** any key, signing, balance, or coin
method. The provider gates every such method on **per-origin consent**: the wallet keys approval to
the calling frame's **committed web origin**, which it MUST obtain from a source the page cannot
forge (the browser process / the unspoofable HTTP `Origin`), never from page-supplied JavaScript.

- `connect()` (no arg / falsy) MUST prompt the user to approve **this origin** and MUST block until
  the user approves, rejects, or it times out. On approval it MUST set `isConnected = true` and emit
  a [`connect`](#events) event, then resolve.
- `connect(true)` ("eager") MUST attempt a silent reconnect for an already-approved origin and MUST
  NOT prompt; if the origin was never approved it rejects (or resolves falsy — see below).
- Approval is **per-origin** and SHOULD persist across browser restarts, so a user approves a site
  once.
- A rejection or timeout MUST reject the returned promise.

### The connect / 202-pending contract {#pending}

`connect()` is the only method that may surface a **pending-approval** state, because approval is the
one step that waits on a human. The reference implementation models this on the wire with HTTP status
**202 Accepted** (see [§4 transport](#transport)): while the user has not yet acted, the underlying
`chip0002_connect` call returns `202`, and the provider's `connect()` **polls** until the user acts,
then resolves (approved) or rejects (declined/timeout).

The reference provider polls on a fixed cadence up to a **120-second** deadline; on each `202` it
waits ~1.2 s and retries. A dapp does **not** see the polling — `connect()` simply blocks until
settled. A provider MAY implement the wait differently (e.g. push), but `connect()` MUST present the
same single-promise contract: it resolves once and only after the user has decided.

:::note
`chip0002_chainId` and `chip0002_connect` are the only methods answerable **without** an unlocked
wallet (the keyless handshake). Every other method requires both an unlocked wallet and an approved
origin.
:::

## 3. `request({ method, params })` — the EIP-1193-style contract {#request}

```ts
const { address } = await window.chia.request({ method: "chia_getAddress" });
```

`request` takes a single object `{ method, params }` and returns a `Promise` that resolves to the
**bare result** the wallet returns for that method (the same value a CHIP-0002 wallet returns over
WalletConnect) and **rejects** on error.

- `method` (string, required) MUST be a CHIP-0002 / chia method name. A **bare** name (e.g.
  `getPublicKeys`) MUST be auto-prefixed to the `chip0002_` namespace; a name already starting with
  `chip0002_` or `chia_` MUST be used as-is. Dapps SHOULD pass the explicit namespaced name.
- `params` (object, optional) is the method's parameters; omit or pass `{}` when a method takes none.
- The resolved value is method-specific (see [§4 the method registry](#method-registry)).
- On failure `request` MUST reject with an `Error` carrying a numeric **`code`** (see
  [§4.3 errors](#errors)).

`request` is the **only** way to invoke a method. There is no per-method function on the provider
object; `connect` is the one exception (and is also reachable as `request({ method: "chip0002_connect" })`).

## 4. The CHIP-0002 method registry {#method-registry}

These are the methods a compliant provider MUST implement. They are the single canonical
`WALLET_METHODS` list shared, byte-for-byte, by the hub (`apps/web/lib/wallet-methods.js`), the SDK
(`@dignetwork/dig-sdk` `src/methods.ts`), and the native wallet (`dig-store` `crates/dig-wallet`), so
that the injected transport and the WalletConnect → Sage transport can never drift. A method present
in one transport but not the other is a defect.

All hashes/keys are lowercase hex; signing keys are **synthetic BLS public keys**. Result shapes are
**byte-compatible with Sage's**, so a dapp that parses a Sage/WalletConnect response parses these
unchanged. (Provider authors: tolerate both `0x`-prefixed and bare hex, and both `snake_case` and
`camelCase`, on the **request** side — the SDK normalizers do this on the **response** side, but
robust providers accept either.)

### 4.1 Handshake (no unlocked wallet required) {#handshake-methods}

| Method | `params` | Returns | Status |
|---|---|---|---|
| `chip0002_connect` | `{ eager?: boolean }` | `true` on approval; **202-pending** until the user acts (see [§2](#pending)). | normative |
| `chip0002_chainId` | `{}` | The chain id. The reference wallet returns the string `"mainnet"`. There is no testnet flow. | normative |

:::caution chainId shape
Today `chip0002_chainId` returns the bare string `"mainnet"`. The **proposed** [capability](#capability--version)
revision standardizes the [CAIP-2](https://chainagnostic.org/CAIPs/caip-2) form `"chia:mainnet"`
(the value the SDK already uses internally as `DEFAULT_CHAIN`). Dapps that need the chain id SHOULD
accept both forms until `chiaVersion` ≥ the revision that pins CAIP-2. **(partly proposed)**
:::

### 4.2 Keys, signing, balances, coins, offers (unlocked + approved) {#core-methods}

| Method | `params` | Returns |
|---|---|---|
| `chip0002_getPublicKeys` | `{ offset?: number, limit?: number }` (defaults to the first keys; `limit` is clamped by the wallet) | `string[]` — synthetic public keys (hex). |
| `chip0002_signMessage` | `{ message: string, publicKey: string }` | A signature over `message` by `publicKey`. Normalizes to `{ publicKey, signature }`. |
| `chip0002_signCoinSpends` | `{ coinSpends, partialSign?: boolean }` | The aggregated BLS signature over the supplied coin spends (hex). The mint/commit/update + spend path. |
| `chip0002_getAssetBalance` | `{ type?: "cat" \| null, assetId?: string \| null }` — `type:null` → XCH; `type:"cat"` + `assetId` → that CAT | `{ confirmed, spendable }` (mojo / base-unit strings). |
| `chip0002_getAssetCoins` | `{ type?, assetId?, offset?, limit?, includedLocked? }` | `{ coins: SpendableCoin[] }` — Sage's shape: `{ coin{ parent_coin_info, puzzle_hash, amount }, locked, spent_block_index }`; XCH entries also carry `puzzle` (the p2 reveal curried with that coin's synthetic key). CAT entries omit `puzzle`. |
| `chia_getAddress` | `{}` | `{ address }` — the wallet's receive address (`xch1…`). |
| `chia_signMessageByAddress` | `{ message: string, address: string }` | A signed-message result for `message` under `address` — the login-challenge path. |
| `chia_takeOffer` | `{ offer: string, fee?: number \| string }` | Builds + signs the taker side of a Chia offer (e.g. an NFT/badge offer); returns a transaction-shaped result. |

The full canonical list, in order:

```js
// WALLET_METHODS — the single source of truth (hub, dig-sdk, dig-wallet all share it)
[
  "chip0002_connect",
  "chip0002_chainId",
  "chip0002_getPublicKeys",
  "chip0002_getAssetCoins",
  "chip0002_getAssetBalance",
  "chip0002_signCoinSpends",
  "chip0002_signMessage",
  "chia_getAddress",
  "chia_signMessageByAddress",
  "chia_takeOffer",
]
```

**Message-signing preference.** A login flow SHOULD prefer `chia_signMessageByAddress` (sign by
address) and fall back to `chip0002_signMessage` (sign by public key) when the wallet/session does
not grant the by-address method. This `SIGN_METHODS` order (`["chia_signMessageByAddress",
"chip0002_signMessage"]`) is shared by the SDK so both transports agree.

:::note No key export — by design
A compliant provider MUST NOT expose any key-export or seed-reveal method on this surface. The
reference wallet explicitly refuses an export class of method names
(`export`/`exportMnemonic`/`getMnemonic`/`getSecretKeys`/`getPrivateKey(s)`/`revealSeed`/…) — they
are unreachable through `request`, and the WalletConnect delegate path is independently barred from
forwarding them. The recovery phrase is reachable only from the wallet's own UI, never from a page,
a WalletConnect session, or `window.chia`.
:::

#### Extended wallet methods **(proposed for the provider surface)** {#extended-methods}

The native DIG wallet's underlying method surface is broader than the canonical list above — it also
serves the Sage-parity set `chia_{signMessageByAddress, send, getTransactions, getNfts, transferNft,
mintNft, bulkMintNfts, getDids, createDidWallet, transferDid, getOfferSummary, createOffer,
takeOffer, cancelOffer}` and asset-generic `chip0002_*` (any CAT by `assetId`). These
are **not yet part of the normative `window.chia` provider contract** — they are not in the shared
`WALLET_METHODS` list a dapp can rely on across transports, and state-changing methods are
additionally gated by the wallet's broadcast policy. They are listed here as the **proposed**
expansion surface; a dapp MUST [feature-detect](#capability--version) any method beyond
[§4.2](#core-methods) before calling it.

### 4.3 Errors {#errors}

On failure, `request` (and `connect`) MUST reject with an `Error` whose `code` property is a number.
The reference provider maps the wallet's wire status to `code` as follows:

| Condition | `code` | `Error` carries |
|---|---|---|
| User approval still pending (during `connect`) | `4001` | `.pending = true` (the provider polls; a dapp normally never sees this — see [§2](#pending)) |
| Wallet unreachable / no native bridge | `-1` | `"DIG wallet is not reachable"` |
| Malformed wallet response | `-1` | `"DIG wallet returned a malformed response"` |
| Origin not approved (a key/sign method before `connect`) | `403` | the wallet's refusal message |
| Wallet locked | `401` | `"wallet is locked"` |
| Bad params (e.g. missing `message`) | `400` | a description of the bad field |
| Method not implemented | `501` | `"unsupported … method"` |
| Upstream chain read failed (coinset) | `502` | the underlying error |
| Any other non-2xx wallet status | that status | the wallet's error string |

The numeric `code` is the load-bearing field; the message string is human-facing and MAY change.
A `code` ≥ 200 and `< 300` never occurs on the rejected path (success resolves).

:::note Error-code alignment **(proposed)**
The codes above are HTTP-derived (the wallet's transport status). A future `chiaVersion` revision
SHOULD align provider error codes with the dig RPC's JSON-RPC `-32xxx` range and the ecosystem-wide
[error-codes table](../support/error-codes.md) so a dapp has one error vocabulary. Until then, branch
on the codes above. **(proposed)**
:::

## 5. Capability & version (feature detection) {#capability--version}

So a dapp can adapt to wallets at different revisions **without a round-trip**, a provider SHOULD
expose:

- **`chiaVersion`** — the semantic version of the `window.chia` surface this object implements.
- **`capabilities`** — the array of method names this provider answers (a superset of, or equal to,
  the canonical [§4.2](#core-methods) list; including any [extended](#extended-methods) methods it
  actually serves).

```js
function supports(method) {
  const p = window.chia;
  if (p?.capabilities) return p.capabilities.includes(method);
  // Fallback for providers without the descriptor: assume the canonical set.
  return WALLET_METHODS.includes(method);
}
```

:::caution Status
`chiaVersion` and `capabilities` are **proposed** — no provider exposes them yet. Today a dapp MUST
assume the canonical [§4.2](#core-methods) list for any provider it detects, and treat
[§4.2.x extended](#extended-methods) methods as unavailable unless probed. This section is the
forward contract; the [DIG SDK](#recommended-consumer) already centralizes the canonical list in one
place (`WALLET_METHODS`) so the migration is a one-line change when providers ship the descriptor.
:::

## 6. Events {#events}

A provider MUST support EIP-1193-style subscription via `on(event, handler)` and unsubscription via
`off(event, handler)`.

```js
function onConnect(info) { /* origin approved */ }
window.chia.on("connect", onConnect);
// later…
window.chia.off("connect", onConnect);
```

| Event | Status | Fires when |
|---|---|---|
| `connect` | normative | This origin is approved (including via an eager reconnect). |
| `accountsChanged` | **proposed** | The active address/keys change (e.g. the user switches accounts). |
| `chainChanged` | **proposed** | The active chain changes. (Mainnet-only today, so this never fires.) |
| `disconnect` | **proposed** | The user revokes this origin's approval. |

Additionally, the global `window` event `chia#initialized` MUST be dispatched once when the provider
is injected (see [§1](#provider-object)). A handler that throws MUST NOT break dispatch to other
handlers.

## 7. Multi-provider discovery (EIP-6963-style) {#discovery}

**Status: proposed.** Today exactly one provider can win `window.chia`: a provider MUST NOT clobber an
existing one ([§1](#provider-object)), so whichever injects first holds the slot and a second Chia
wallet on the same machine is unreachable. This is the same collision EIP-6963 solved for Ethereum,
and the resolution here is the same: an **announce / request** event pair so multiple wallets can
coexist and a dapp can let the user pick.

This subsection specifies that mechanism. It is **not yet implemented** — it is the normative target
for the browser-side discovery work (a separate task); dapps MUST feature-detect it.

### 7.1 Provider info {#provider-info}

Each provider is described by a stable info record:

```ts
interface ChiaProviderInfo {
  uuid: string;     // a per-page-load UUIDv4 identifying THIS provider instance
  name: string;     // human-readable wallet name, e.g. "DIG Browser"
  icon: string;     // a data: URI (image/png|svg+xml|…) for the wallet's icon
  rdns: string;     // reverse-DNS wallet identifier, e.g. "net.dig.browser"
}

interface ChiaProviderDetail {
  info: ChiaProviderInfo;
  provider: ChiaProvider;   // the same shape as §1
}
```

`rdns` is the durable wallet identity (stable across loads and machines); `uuid` is per-instance
(fresh each page load). This mirrors EIP-6963's `EIP6963ProviderInfo`, with `rdns` carried over and
Chia-namespaced event names.

### 7.2 Announce / request events {#announce-request}

Two `window` events, both carrying a `ChiaProviderDetail` (announce) or nothing (request):

| Event | Direction | Payload |
|---|---|---|
| `chia:announceProvider` | provider → dapp | `CustomEvent<ChiaProviderDetail>` — a provider announces itself. |
| `chia:requestProvider` | dapp → provider | `Event` — a dapp asks all providers to (re)announce. |

The protocol:

1. On injection, each provider MUST dispatch `chia:announceProvider` with its detail.
2. A dapp listens for `chia:announceProvider`, collecting each unique provider by `info.rdns`.
3. A dapp MAY dispatch `chia:requestProvider` at any time; every provider MUST respond by
   re-announcing (so a late-loading dapp still discovers early-loading providers).

```js
// Dapp side: discover every Chia provider, then connect to the chosen one.
const providers = new Map();
window.addEventListener("chia:announceProvider", (e) => {
  providers.set(e.detail.info.rdns, e.detail);   // de-dupe by rdns
});
window.dispatchEvent(new Event("chia:requestProvider"));
// …render providers for the user to pick; then:
const chosen = providers.get("net.dig.browser");
await chosen.provider.connect();
```

A provider that participates in discovery MUST still inject the singleton `window.chia` for backward
compatibility (so dapps written before discovery keep working), subject to the no-clobber rule in
[§1](#provider-object). Discovery is **additive**: the announced `provider` is the same object shape
as `window.chia`.

## 8. Transport (informative) {#transport}

How `request` reaches the wallet is an implementation detail a dapp never sees, but it explains the
status codes in [§4.3](#errors). The DIG Browser's reference provider forwards each call over a
**frame-scoped native bridge** — `window.__digWalletRpc`, a Mojo pipe to the browser process
installed by the renderer just before the provider script. It is **not** loopback HTTP and **not**
`fetch`: there is no http/https mismatch and **nothing for a page's Content-Security-Policy to
block**, so the wallet is reachable on any dapp. The browser process supplies the calling frame's
unspoofable committed origin to the per-origin approval gate ([§2](#connect)).

The bridge returns a JSON envelope `{ "status": <u16>, "body": <json> }`; the provider maps `status`
to the resolve/reject contract in [§4.3](#errors) and resolves with `body.data` on success. A
WalletConnect-based provider would instead forward `{ method, params }` over the relay to Sage and
return Sage's result — the dapp-facing contract is identical either way, which is the whole point of
this spec.

## 9. Reference implementation & recommended consumer {#reference-implementation}

### Reference provider — the DIG Browser {#reference-provider}

The native DIG Browser injects `dig_provider.js` into every page, exposing
`window.chia = { isDIG: true, isConnected, request, connect, on, off }` over the Mojo bridge
described in [§8](#transport). It is the canonical implementation of this spec; where prose and the
DIG Browser provider disagree, treat the implementation as authoritative and
[file an issue](../support/get-help.md).

### Recommended consumer — `@dignetwork/dig-sdk` {#recommended-consumer}

Dapps SHOULD consume the provider through the SDK's `ChiaProvider` rather than calling `window.chia`
directly. `ChiaProvider` detects the injected provider (on the `isDIG` marker), **prefers it over
WalletConnect**, falls back to WalletConnect → Sage when no injected provider is present, and
normalizes every response shape ([§4](#method-registry)) so app code is written once. It also owns
the canonical `WALLET_METHODS` / `SIGN_METHODS` lists this spec is built on. See
[Build a dapp on Chia](../build-a-dapp/tutorial.md) and
[Using `window.chia`](../browser/using-window-chia.md).

## Related

- [Using window.chia](../browser/using-window-chia.md) — the task-oriented integration guide
- [The chia:// protocol](../browser/chia-protocol.md) — the browser's native content-address scheme
- [Build a dapp on Chia](../build-a-dapp/tutorial.md) — every primitive stitched into one dapp
- [Error codes](../support/error-codes.md) — the ecosystem-wide error vocabulary
- [Concepts & glossary](../concepts.md) — window.chia and the chia:// protocol defined
