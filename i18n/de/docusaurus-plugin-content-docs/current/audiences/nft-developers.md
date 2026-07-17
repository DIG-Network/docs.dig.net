---
sidebar_position: 2
title: For NFT developers
description: "Minte eine ganze CHIP-0007-Kollektion, deren Kunstwerke dauerhaft in einer manipulationssicheren DIG-capsule leben — ein atomares, signiertes Bundle, echte Royalties und ehrliche Drop-Mechaniken, die niemals etwas vortäuschen, das sie on-chain noch nicht beweisen können."
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# For NFT developers {#for-nft-developers}

> **Minte eine ganze CHIP-0007-Kollektion, deren Kunstwerke DAUERHAFT in einer manipulationssicheren DIG-capsule leben** — ein atomares, signiertes Bundle, echte Royalties und ehrliche Drop-Mechaniken (Reveal / Allowlist / Phasen), die niemals etwas vortäuschen, das sie on-chain noch nicht beweisen können.

## Das Denkmodell {#the-mental-model}

Lege deine Kunstwerke zunächst in eine **[DIG-capsule](../concepts.md#capsule)**, und minte dann NFTs, deren `data_uris` / `metadata_uris` auf diese capsule verweisen. Die On-Chain-Hashes verankern die echten Bytes — die Kunst ist damit content-adressiert, verifizierbar und dauerhaft, kein Link, der verrotten oder ausgetauscht werden kann.

Spends werden **niemals von Hand zusammengebaut**: Der kanonische CHIP-0035-Wasm-Builder (über [`@dignetwork/dig-sdk/spend`](../sdk.md)) baut jeden Coin-Spend, deine Wallet signiert einmal, und er wird einmal gesendet (broadcast).

Einen **store zu minten ist kostenlos** in $DIG — du zahlst den **einheitlichen capsule-Preis** nur, wenn eine capsule erstellt wird (wenn die Kunst in eine capsule geschrieben wird).

## Eine Mint-Seite scaffolden — das `nft-drop`-Template {#scaffold-a-mint-page--the-nft-drop-template}

Starte mit einer wallet-verdrahteten Drop-Seite in einem Befehl:

```sh
digs new nft-drop
# oder
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Eine App scaffolden](../build-a-dapp/scaffold.md)

## Minten über die CLI {#mint-from-the-cli}

Die Asset-CLI baut den Spend über die `digstore-chain`-Builder, signiert mit deinem Wallet-Seed und sendet ihn — alles `--dry-run` / `--json` CI-sicher:

```sh
digs did create                          # eine Issuer-DID für die Zuordnung
digs collection create --name "My Drop"  # eine CHIP-0007-Kollektion
digs nft mint --data ./art.png --metadata ./meta.json --dry-run
digs offer make ...                       # XCH- / CAT-Trades
```

Der **capsule-media**-Pfad von `nft mint` schreibt die Kunst + CHIP-0007-Metadaten in eine capsule, berechnet die Data-/Metadaten-Hashes aus den echten Bytes und setzt die URIs auf die `chia://`-Adresse der capsule (mit einem https-Gateway-Fallback). → [Befehlsreferenz](../digstore/cli/command-reference.md)

## Minten über das Web — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Minte eine capsule-gestützte Kollektion im Browser: Kunst hochladen (wird in eine capsule geschrieben), Royalties festlegen und eine DID für die Zuordnung anhängen — die Wallet signiert am Ende. → [DIGHUb ↗](https://hub.dig.net)

## Drops — Reveal, Allowlist, Phasen {#drops--reveal-allowlist-phases}

Drop-Mechaniken werden **ehrlich** dargestellt: was heute on-chain durchgesetzt wird gegenüber dem, was eine Off-Chain-Annehmlichkeit ist, bis die claim-coin-Primitive verfügbar ist. Wir präsentieren niemals eine Garantie, die wir on-chain noch nicht beweisen können.

→ [Eine Dapp auf Chia bauen](../build-a-dapp/tutorial.md) für den durchgängigen Mint-Ablauf.

## Spends mit dem SDK bauen — niemals von Hand zusammenbauen {#build-spends-with-the-sdk--never-hand-roll}

Jeder Coin-Spend wird vom kanonischen CHIP-0035-Wasm gebaut und unter `@dignetwork/dig-sdk/spend` re-exportiert. Der Ablauf ist immer **bauen → signieren → senden (broadcast)**, so aufgeteilt, dass die Wallet nur signiert.

→ [Spends bauen](../spends.md) · [Das DIG SDK](../sdk.md)

## Monetarisieren & absichern — die Paywall {#monetize--gate--the-paywall}

Die `Paywall` des SDK kombiniert den Provider mit dem Spend-Builder für **Pay-to-Unlock** und **NFT-/Collection-Ownership-Gating** — ohne Spends manuell zu verdrahten.

→ [Das DIG SDK → Paywall](../sdk.md#paywall)

## Offers — make / take / show {#offers--make--take--show}

Handle NFTs gegen XCH oder CATs mit `digs offer make | take | show` (jeweils `--dry-run` / `--json`). → [Befehlsreferenz](../digstore/cli/command-reference.md)

---

## Tiefer einsteigen: das Protokoll {#go-deeper-the-protocol}

- **„manipulationssichere capsule"** → [Proofs & Sicherheit](../digstore/format/proofs-and-security.md) · [Das capsule- & store-Modell](../digstore/format/store-structure.md)
- **„niemals einen Spend von Hand zusammenbauen"** → [CHIP-0035 store-coin-Spends & Delegation](../chip-0035-spends-and-delegation.md)
- **Alles** → [Protokoll-Deep-Dive](../protocol-deep-dive.md) · [Konzepte & Glossar](../concepts.md)
