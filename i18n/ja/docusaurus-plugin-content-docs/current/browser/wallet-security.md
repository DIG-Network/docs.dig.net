---
sidebar_position: 4
title: Wallet security — how your keys are protected
description: "How the DIG Chrome extension's built-in Chia wallet protects your keys: encryption at rest, phishing and scam warnings, revocable site permissions, and the Argon2id/AES-256-GCM crypto behind it."
schema_type: TechArticle
keywords:
  - wallet security
  - self-custody
  - Argon2id
  - AES-256-GCM
  - phishing protection
  - address poisoning
  - DIG Chrome extension
tags:
  - window-chia
  - browser
  - chip-0002
  - dighub
---

# Wallet security — how your keys are protected

The **DIG Chrome extension** (Chrome / Edge / Brave / Firefox) ships a **self-custody Chia wallet**: it holds your keys, and only you control them — there is no account recovery, no custodian, and no server that can move your funds. This page explains what that protects you against and, for anyone integrating against it or auditing it, exactly how.

:::note Audience
The first section is for **everyone using the wallet**. The [protocol-level detail](#for-protocol-developers) further down is for **integrators and security reviewers** who want the exact cryptographic parameters and mechanisms.
:::

## The short version

- **Your keys never leave your device**, and never leave the wallet's own protected memory — not even to the rest of the extension.
- **Your recovery phrase and any exported key are encrypted at rest** with a password-derived key; nobody — including DIG — can read them without your password.
- **The wallet warns you before you sign anything risky**: sending nearly everything you own, an unusually high fee, or a request it cannot fully verify all raise a clear warning before you can approve.
- **A lookalike address gets caught.** If you paste an address that looks like one you've used before but isn't, the wallet stops you and asks you to confirm.
- **Websites can't see or touch your wallet until you say so** — and you can review and revoke any site's access at any time.
- **DIG will never ask for your recovery phrase.** Nobody legitimately will — not DIG support, not a website, not a "wallet sync" prompt.
- **A locked wallet stays locked.** It locks itself after a period of inactivity, and nothing — including a website's pending request — can keep it unlocked past that.

## How your keys are stored

Creating or importing a wallet turns your 24-word recovery phrase into a single encrypted file, protected by the password you choose. That password is the only thing that unlocks it — there is no password reset, because a resettable password would mean someone else could reset it too. Losing both the password and the recovery phrase means losing access to the wallet; this is the tradeoff of true self-custody.

The wallet is never written to disk unencrypted, and it is never synced anywhere — it stays only on the device where you created or imported it, unless you explicitly export an encrypted backup file yourself.

## Backing up and moving your wallet

Three ways to preserve access to your wallet, in order of how often you'll use them:

1. **The 24-word recovery phrase** — shown once when you create a wallet, and re-viewable behind your password at any time. This is the ultimate backup: anyone who has it can fully restore the wallet on any device.
2. **An encrypted backup file** — export your wallet as a file from the wallet switcher. It's the same encryption that protects the wallet on your device, just moved to a file; restoring it still asks for your password, and it never exposes your recovery phrase in the process.
3. **A watch-only wallet** — if you just want to check balances or share a receive address from a second device without ever exposing signing ability there, import a wallet using only its public key. A watch-only wallet can never sign or spend, on any device, no matter what.

Anywhere a secret is shown on screen — the recovery phrase or an exported private key — it renders in a way that other extensions and scripts on the page cannot read it out of the page's content, and any copy button clears your clipboard again shortly after.

## Connecting to a website

The first time a website asks to connect, the wallet checks it against a list of known scam/phishing sites plus a check for sites that look like a trick (an address bar that resembles a real DIG page but isn't). A known bad site is blocked outright before it can even ask; a suspicious one gets an explicit warning you have to acknowledge.

Once you approve a site, that approval is **scoped to that site alone** and is **fully visible and revocable** — open the wallet's Connected Sites settings to see every site you've approved, when it last used your wallet, and revoke one or all of them with a click. A revoked site has to ask again.

## Approving a transaction or a signature

Whenever a website asks you to sign something — a payment, a signature, an offer — the approval you see is built directly from the actual transaction the wallet is about to sign, never from text the website supplies. That means a malicious site cannot show you one thing and have the wallet sign another.

Before you can approve, the wallet also checks the transaction itself for patterns that show up in real theft attempts — draining nearly all of an asset, an abnormally large fee, or a transaction that needs a signature the wallet can't account for — and requires you to explicitly acknowledge the risk before it lets you proceed. A transaction the wallet cannot fully decode and show you cannot be approved at all; your only option is to reject it.

## For protocol developers

The rest of this page is the technical detail behind the guarantees above, for integrators and security reviewers.

### Key derivation and the at-rest keystore

The wallet derives keys from a BIP-39 mnemonic exactly as `dig-l1-wallet` and Sage do (empty BIP-39 passphrase, both the hardened and unhardened `m/12381/8444/2/i` paths, `chia_rs`-compatible synthetic-key derivation) — a given seed produces the identical address on every implementation.

At rest, the wallet's entropy is stored as a single versioned encrypted record:

- **KDF:** Argon2id, default cost 64 MiB / 3 iterations / 4 lanes (memory-hard — resistant to GPU/ASIC brute force), with a stronger 256 MiB preset available for high-value wallets. A fresh random salt is drawn on every (re-)encryption.
- **Cipher:** AES-256-GCM with a fresh 96-bit nonce; the full record header (KDF parameters, salt, cipher id, nonce) is bound as additional authenticated data, so tampering with any of them fails the authentication tag rather than silently decrypting garbage.
- **Key handling:** the derived AES key is a non-extractable key handle — it cannot be serialized out of the runtime that holds it.
- **Failure signaling:** a wrong password and a tampered/corrupted record both collapse to the same generic failure, so a failed unlock attempt cannot be used to distinguish the two.
- A bounded PBKDF2-HMAC-SHA-512 fallback (≥600,000 iterations) exists only for the case the memory-hard KDF's runtime fails to initialize, and the wallet re-encrypts to the primary KDF on the next successful unlock.

### Where the decrypted key lives

The decrypted key exists only inside the extension's isolated background document — never in the service worker, never in browser storage, never persisted or logged anywhere in plaintext. The wallet auto-locks (discarding the decrypted key from memory) on an explicit lock action, after a configurable idle timeout, on OS/browser idle detection, when every extension window closes, and immediately on the next startup after a sleep/restart. A transaction approval window open at the moment the timeout elapses cannot be used to extend the session or sign after the fact — every signing call re-checks the lock state live, from durable storage, not from a cached flag.

### The connect/sign perimeter

Every request from a page's injected wallet provider crosses a fixed set of checks before it can read wallet data or move funds:

- **Origin risk assessment** — the requesting page's origin is checked against a maintained blocklist plus on-device homoglyph/lookalike detection for domains that visually resemble a legitimate DIG surface. A blocked origin is refused before it is ever recorded as pending or approved; a merely suspicious one proceeds only behind an explicit interstitial acknowledgement.
- **Per-origin permissions** are a capability record — which addresses were exposed, which methods were used, when — not a bare yes/no flag, exposed to the page as CHIP-0002-mapped permission-query/revoke methods and to the user as a Connected Sites list with per-site and revoke-all controls.
- **Spend-risk heuristics** run over the transaction the wallet is actually about to sign (decoded from the built spend, never from page-supplied text) and flag: near-total value drain, a disproportionate fee, a required signer the wallet cannot account for, or inputs the wallet does not own (so their amounts cannot be trusted). Any flagged case requires an explicit "I understand the risk" acknowledgement rather than a one-click approval.
- **Signer accountability** — every key a transaction needs signed must map to a key the wallet actually holds; the wallet's signer refuses to produce a partial signature for a transaction it cannot fully authorize, and a transaction the wallet fails to decode cannot be approved under any circumstance — only rejected.

### Address-poisoning defenses

On every send, the destination address is checked against your saved contacts and recent recipients. An address that is **not** one you've used before, but shares the same start and end characters as one you have (the classic address-poisoning trick, since wallets commonly display addresses truncated in the middle) triggers a blocking warning naming the address it resembles, which you must explicitly dismiss before the transaction can proceed. A genuinely new address gets a lighter first-time notice; a known one gets neither.

### Supply-chain hardening

The extension's build denies dependency install scripts by default, re-running only a small, hand-reviewed allowlist of packages known to need one for legitimate native-build reasons; any new dependency that ships an install script not on that list fails the build until it is explicitly reviewed and added. This closes the most common real-world supply-chain attack against a hot wallet — a compromised dependency exfiltrating key material at install time — before a single line of wallet code ever runs.

### What this does not cover

This model is deliberately explicit about its limits: it does not defend against a fully compromised operating system or browser process, it does not sandbox already-loaded dependency code at runtime, there is no hardware-wallet support, and it does not run an independent hosted transaction-simulation service — the on-device heuristics above are pattern-based, not a full simulation. A transaction you approve after seeing every warning is honored as your intent; the wallet surfaces risk, it does not override a decision you've made with full information.

## Related

- [Using window.chia](./using-window-chia.md) — connecting a web app to the wallet
- [The window.chia provider reference](./window-chia-reference.md) — every method, param, and error code
- [The window.chia provider spec](../protocol/window-chia-provider.md) — the normative, versioned provider contract
- [The chia:// protocol](./chia-protocol.md) — the browser's native content-address scheme
- [Concepts & glossary](../concepts.md) — window.chia and self-custody defined
