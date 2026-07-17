---
sidebar_position: 2
title: For NFT developers
description: "Mintez une collection CHIP-0007 entière dont l'art vit en permanence dans une capsule DIG inviolable — un paquet unique atomique et signé, de vraies royalties, et une mécanique de drop honnête qui ne simule jamais ce qu'elle ne peut pas encore prouver on-chain."
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

# Pour les développeurs de NFT {#for-nft-developers}

> **Mintez une collection CHIP-0007 entière dont l'art vit EN PERMANENCE dans une capsule DIG inviolable** — un paquet unique atomique et signé, de vraies royalties, et une mécanique de drop honnête (reveal / allowlist / phases) qui ne simule jamais ce qu'elle ne peut pas encore prouver on-chain.

## Le modèle mental {#the-mental-model}

Mettez d'abord votre art dans une **[capsule DIG](../concepts.md#capsule)**, puis mintez des NFT dont les `data_uris` / `metadata_uris` pointent vers cette capsule. Les hachages on-chain épinglent les octets réels — donc l'art est adressé par contenu, vérifiable et permanent, pas un lien qui peut pourrir ou être échangé.

Les dépenses ne sont **jamais faites à la main** : le constructeur wasm CHIP-0035 canonique (via [`@dignetwork/dig-sdk/spend`](../sdk.md)) construit chaque dépense de coin, votre portefeuille signe une fois, et il diffuse une fois.

Minter un **store est gratuit** en $DIG — vous ne payez le **prix uniforme de capsule** que lorsqu'une capsule est créée (quand l'art est écrit dans une capsule).

## Échafauder une page de mint — le modèle `nft-drop` {#scaffold-a-mint-page--the-nft-drop-template}

Démarrez à partir d'une page de drop câblée avec un portefeuille en une commande :

```sh
digs new nft-drop
# ou
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Échafauder une application](../build-a-dapp/scaffold.md)

## Minter depuis la CLI {#mint-from-the-cli}

La CLI d'actifs construit la dépense via les constructeurs `digstore-chain`, signe avec la seed de votre portefeuille, et diffuse — le tout compatible CI avec `--dry-run` / `--json` :

```sh
digs did create                          # un DID d'émetteur pour l'attribution
digs collection create --name "My Drop"  # une collection CHIP-0007
digs nft mint --data ./art.png --metadata ./meta.json --dry-run
digs offer make ...                       # échanges XCH / CAT
```

Le chemin **capsule-media** de `nft mint` écrit l'art + les métadonnées CHIP-0007 dans une capsule, calcule les hachages de données/métadonnées à partir des octets réels, et fixe les URI à l'adresse `chia://` de la capsule (avec un repli sur une passerelle https). → [Référence des commandes](../digstore/cli/command-reference.md)

## Minter depuis le web — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Mintez une collection adossée à une capsule dans le navigateur : téléversez de l'art (écrit dans une capsule), fixez les royalties, et attachez un DID pour l'attribution — le portefeuille signe à la fin. → [DIGHUb ↗](https://hub.dig.net)

## Drops — reveal, allowlist, phases {#drops--reveal-allowlist-phases}

La mécanique de drop est présentée **honnêtement** : ce qui est appliqué on-chain aujourd'hui vs. ce qui est une commodité hors-chaîne en attendant la primitive claim-coin. Nous ne présentons jamais une garantie que nous ne pouvons pas encore prouver on-chain.

→ [Construire une dapp sur Chia](../build-a-dapp/tutorial.md) pour le fil de mint de bout en bout.

## Construire des dépenses avec le SDK — ne jamais faire à la main {#build-spends-with-the-sdk--never-hand-roll}

Chaque dépense de coin est construite par le wasm CHIP-0035 canonique et réexportée à `@dignetwork/dig-sdk/spend`. Le flux est toujours **construire → signer → diffuser**, divisé pour que le portefeuille ne fasse jamais que signer.

→ [Construire des dépenses](../spends.md) · [Le DIG SDK](../sdk.md)

## Monétiser et contrôler l'accès — le Paywall {#monetize--gate--the-paywall}

Le `Paywall` du SDK compose le fournisseur avec le constructeur de dépense pour le **paiement pour déverrouiller** et le **contrôle d'accès par propriété de NFT / collection** — sans câbler les dépenses à la main.

→ [Le DIG SDK → Paywall](../sdk.md#paywall)

## Offres — faire / accepter / afficher {#offers--make--take--show}

Échangez des NFT contre du XCH ou des CAT avec `digs offer make | take | show` (chacun avec `--dry-run` / `--json`). → [Référence des commandes](../digstore/cli/command-reference.md)

---

## Aller plus loin : le protocole {#go-deeper-the-protocol}

- **« capsule inviolable »** → [Preuves et sécurité](../digstore/format/proofs-and-security.md) · [Le modèle capsule et store](../digstore/format/store-structure.md)
- **« ne jamais faire une dépense à la main »** → [Dépenses de store-coin CHIP-0035 et délégation](../chip-0035-spends-and-delegation.md)
- **Tout** → [Plongée en profondeur dans le protocole](../protocol-deep-dive.md) · [Concepts et glossaire](../concepts.md)
