---
sidebar_position: 1
title: "Protocol: Overview"
description: "Le protocole DIG en sept couches de bas en haut, normatives et à implémentation définie. La capsule (storeId:rootHash) est l'unité fondamentale ; l'hébergeur est aveugle et le lecteur vérifie par rapport à la chaîne. Ceci est la référence de protocole faisant autorité."
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protocole : Vue d'ensemble {#protocol-overview}

Ceci est la **spécification normative** du protocole DIG, définie en **sept couches, de bas en haut**. Chaque couche nomme son **crate/fichier canonique** comme référence normative.

:::info Ceci est la référence de protocole faisant autorité
Cette section est la source de vérité pour ce que fait le réseau. Elle documente le protocole tel qu'il fonctionne réellement, avec des citations `fichier:ligne` vers l'implémentation canonique.
:::

## L'unité fondamentale : la capsule {#the-fundamental-unit-the-capsule}

Un concept traverse chaque couche : la **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, canoniquement `storeId:rootHash`. Un **store** est une séquence ordonnée de capsules (de la plus ancienne à la plus récente), une par commit ; son identité `store_id` *est* un id de launcher de singleton DataLayer CHIP-0035 sur Chia. L'identité, la compilation, la tarification, la récupération, la mise en cache et la provenance sont toutes définies **par capsule**.

## La thèse : hébergeur aveugle, vérification côté client, racine ancrée sur la chaîne {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Hébergeur aveugle.** Un hébergeur ne détient que du texte chiffré opaque indexé par des hachages. Il ne détient ni URN ni clé, relaie la propre sortie de la capsule mot pour mot, et ne peut pas distinguer un succès d'un échec. Il n'y a pas de champ `decoy` sur le fil et pas de CDN — le contenu n'est servi que via le [dig RPC](./protocol/dig-rpc.md).
- **Vérification côté client.** Chaque octet est vérifié sur l'appareil du lecteur contre une racine on-chain avec une preuve d'inclusion merkle par ressource, puis authentifié-déchiffré. La confiance ne repose jamais sur l'origine de service.
- **Racine ancrée sur la chaîne.** La racine de confiance provient **uniquement** du singleton CHIP-0035 sur Chia (résolu via coinset.org), jamais du « latest » servi.

## Les sept couches {#the-seven-layers}

| # | Couche | Ce qu'elle définit | Référence canonique |
|---|---|---|---|
| 0 | [Identité et nommage](./protocol/identity-and-naming.md) | store, capsule, generation ; `store_id` = id de launcher | `digstore-core::capsule`, `::urn` |
| 0 | [URN et adressage](./protocol/urn-and-addressing.md) | grammaire `urn:dig:chia:…` ; `retrieval_key` sans racine | `digstore-core::urn`, `lib.rs` |
| 1 | [Cryptographie](./protocol/cryptography.md) | KDF HKDF ; scellement AES-256-GCM-SIV | `digstore-core::crypto` |
| 1 | [Preuves d'inclusion Merkle](./protocol/merkle-proofs.md) | feuille par ressource D5 ; repliement NODE_TAG | `digstore-core::merkle` |
| 1 | [Signatures BLS et DST](./protocol/bls-signatures.md) | AugScheme Chia ; cinq DST de rôle | `digstore-crypto::bls` |
| 2 | [Format de capsule](./protocol/capsule-format.md) | la section de données DIGS (contrat BINDING D1) | `digstore-core::datasection` |
| 2 | [Le module auto-défendu](./protocol/self-defending-module.md) | obfuscation de taille fixe ; le guest de service | `digstore-compiler`, `digstore-guest` |
| 4 | [Ancrage on-chain](./protocol/on-chain-anchoring.md) | store = singleton ; capsule = avancement de racine | `chip35_dl_coin`, `digstore-chain` |
| 4 | [Paiement et tarification CAT DIG](./protocol/dig-cat-payment.md) | par capsule, dynamique, indexé sur l'USD | `chip35_dl_coin::dig` |
| 6 | [Le dig RPC](./protocol/dig-rpc.md) | l'interface machine (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [Transport et push §21](./protocol/transport-and-push.md) | localisateur `dig://`, REST, push v1 | `digstore-remote` |
| 7 | [Réseau de pairs DIG Node](./protocol/peer-network.md) | identité de pair mTLS, traversée NAT, STUN, introducteur, fil de relais, RPC de pair | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Vérification et provenance](./protocol/verification-and-provenance.md) | les quatre portes d'intégrité ordonnées | `digstore-core::merkle`, `dig-node` |
| 6 | [Le modèle d'hébergeur aveugle](./protocol/blind-host-model.md) | cécité du fournisseur ; résolveur ; plan de contrôle `/v1` | hub `retrieval`/`resolver`/`api` |
| — | [Conformité et parité](./protocol/conformance-and-parity.md) | la discipline de parité inter-implémentations | goldens figés, diff OpenRPC |

(Les couches 3 et le transport §21 s'entrelacent avec le chemin de lecture ; le tableau les regroupe là où un lecteur les rencontre. La numérotation complète des couches est donnée sur chaque page.)

## Comment une capsule traverse les couches {#how-a-capsule-flows-through-the-layers}

Un éditeur **découpe + chiffre** (L1) le contenu dans un **format de capsule** (L2) qui **se sert lui-même** (L3), **l'ancre** on-chain (L4), et le **pousse** via le transport §21 (L5). Tout client la **lit** via le dig RPC et la **vérifie** contre la racine ancrée sur la chaîne entièrement côté client (L6). Chaque constante cryptographique a **une** définition unique partagée entre le producteur, l'hébergeur et le vérificateur — l'[invariant de parité C8](./protocol/conformance-and-parity.md).

## Terminologie {#terminology}

- **`chia://`** — l'adresse de **contenu** du réseau (ce qu'un navigateur ouvre).
- **`dig://`** — le localisateur de **transport** §21 (plan CLI/pair) *et* le schéma de page interne du DIG Browser — deux usages distincts, jamais l'adresse de contenu.
- **`urn:dig:`** — l'espace de noms d'URN dont les deux dérivent.
- **store / capsule** — l'identité et sa génération immuable.
- **$DIG** — le CAT payé par capsule ; **DigStore** — le format de store.

## Voir aussi {#related}

- [Concepts et glossaire](./concepts.md) — chaque entité définie une fois
- [Identité et nommage](./protocol/identity-and-naming.md) — Couche 0, où la spécification commence
- [Le dig RPC](./protocol/dig-rpc.md) — l'interface machine du protocole
- [Réseau de pairs DIG Node](./protocol/peer-network.md) — comment les nœuds se trouvent et s'atteignent (mTLS, traversée NAT, relais)
- [Conformité et parité](./protocol/conformance-and-parity.md) — la discipline de parité inter-implémentations
