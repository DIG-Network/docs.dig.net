---
sidebar_position: 1
slug: /
title: DIG Network
description: "Vue d'ensemble des primitives du DIG Network : dig-store pour la publication adressable par contenu, le dig RPC pour l'hébergement et la récupération à l'aveugle, et le DIG Browser pour l'accès au contenu."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - dig-store
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network est un Layer 2 Proof-of-Stake sur Chia** — un réseau décentralisé pour publier, adresser et servir du contenu sans avoir à faire confiance à l'hébergeur.

Cette documentation couvre le réseau et ses **primitives** : les briques composables que les développeurs utilisent pour construire sur DIG. Le réseau est encore en expansion, et d'autres primitives seront documentées ici au fil du temps.

:::info $DIG propulse le réseau
**$DIG est le moteur et l'économie de DIG Network.** Chaque échange de valeur — publier une capsule, posséder un store, laisser un pourboire à un créateur — circule via $DIG. Consommer du contenu reste simple et gratuit : vous ne payez jamais pour lire, seulement pour publier et posséder.
:::

## La capsule {#the-capsule}

Un concept traverse chaque primitive. Une **capsule** est une génération de store immuable unique — la paire `(storeId, rootHash)`, notée canoniquement `storeId:rootHash`. Un **store est une séquence de capsules**, une par commit (chaque commit fait avancer la racine on-chain et produit une nouvelle capsule).

La capsule est l'unité du réseau pour :

- **La compilation** — chaque capsule se compile en un module WASM de taille fixe unique (complété par du padding pour que sa longueur ne révèle rien sur la taille du contenu).
- **La tarification** — un **prix uniforme par capsule** (mint ou commit), payé en $DIG au taux courant ; le coût total d'un store sur sa durée de vie est le prix uniforme par capsule × le nombre de capsules.
- **La récupération** — une URN nomme une capsule (plus une ressource optionnelle en son sein).
- **La mise en cache** — un hébergeur ou un navigateur met en cache une capsule identifiée par `storeId:rootHash` ; le cache local est un ensemble de capsules.
- **La provenance** — la racine de chaque capsule porte la signature BLS de l'éditeur et une racine de Merkle.

C'est la définition partagée dans tout l'écosystème : « capsule = `(storeId, rootHash)` » signifie la même chose dans dig-store, le dig RPC et le DIG Browser.

:::tip Essayez-le
[**Créez votre première capsule dans DIGHUb ↗**](https://hub.dig.net/new) — publiez un site dans le navigateur, sans CLI requise. Chaque capsule (mint ou commit) coûte le **prix uniforme de capsule en $DIG**.
:::

## Primitives {#primitives}

### 🗄️ dig-store {#️-digstore}

La première primitive, et la plus fondamentale : un **format de projet WASM chiffré et adressable par contenu**. Vous le pointez vers un répertoire de build, vous committez les déploiements comme avec Git, et vous obtenez un unique fichier `.wasm` auto-défendu qui est à la fois votre donnée et le serveur qui en contrôle l'accès. L'URN *est* la clé — elle localise et déchiffre à la fois.

→ **[Explorer dig-store](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[Qu'est-ce que dig-store ?](./digstore/what-is-digstore.md)** | L'idée en un fichier, en un mot |
| **[Le format](./digstore/format/overview.md)** | Projets, déploiements, URN, chiffrement, preuves |
| **[Tutoriel CLI](./digstore/cli/quickstart.md)** | Installer et utiliser `dig-store` dans votre projet |

### 🛰️ dig RPC {#️-dig-rpc}

La primitive réseau : une **interface standard pour lire du contenu depuis des déploiements dig-store hébergés**. JSON-RPC 2.0 sur HTTPS `POST` — chaque nœud d'hébergement la parle de façon identique, donc le contenu est portable et les clients sont agnostiques du nœud. Elle sert du texte chiffré + des preuves d'inclusion par clé de récupération, des déploiements entiers par `(store_id, root)`, et le manifeste public de découverte — diffusés par blocs, aveugles par construction, vérifiés et déchiffrés entièrement côté client.

→ **[Explorer le dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[Qu'est-ce que le dig RPC ?](./rpc/what-is-the-dig-rpc.md)** | Un seul point d'entrée pour tout le chemin de lecture du réseau |
| **[Méthodes](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | Le modèle de blocs, le réassemblage et la vérification des preuves |
| **[Conformité & sécurité](./rpc/conformance.md)** | Le modèle aveugle, CORS, et ce qu'un nœud doit implémenter |

### 🌐 DIG Browser {#-dig-browser}

La primitive client : un **navigateur avec un portefeuille Chia intégré**. Il injecte un fournisseur `window.chia` sur chaque page, afin que toute application web puisse demander l'adresse, les signatures et les dépenses de l'utilisateur sans configuration WalletConnect — une alternative clé en main pour les applications qui parlent déjà CHIP-0002. Il résout également directement les adresses de contenu `chia://`.

→ **[Développer avec le DIG Browser](./browser/using-window-chia.md)**

| | |
|---|---|
| **[Utiliser `window.chia` dans votre application](./browser/using-window-chia.md)** | Détecter le portefeuille injecté, se connecter, et appeler les méthodes CHIP-0002 |

:::tip Essayez-le
[**Obtenir le DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — téléchargez le navigateur pour ouvrir du contenu `chia://` et utiliser le portefeuille intégré.
:::

*D'autres primitives — règlement et opération de nœud — auront leurs propres sections à mesure qu'elles arrivent.*

## Choisissez votre parcours {#pick-your-path}

La documentation est organisée autour de **ce que vous faites**. Chaque parcours s'ouvre avec un « pourquoi » de dix secondes, le modèle mental dont vous avez besoin, et le mode d'emploi à fort signal — puis renvoie vers le protocole quand vous voulez aller plus loin.

- **[Publier un site ou une application que vous possédez](./audiences/app-developers.md)** — expédiez un site web/une application comme votre propre actif on-chain ; construisez gratuitement, publiez une capsule.
- **[Créer des NFT et des collections](./audiences/nft-developers.md)** — des drops CHIP-0007 adossés à des capsules permanentes et inviolables.
- **[Intégrer DIG dans votre application](./audiences/integration-developers.md)** — un SDK typé + une plateforme entièrement lisible par machine.
- **[Faire tourner un nœud](./run-a-node/index.md)** — servir du contenu de façon prouvable et aveugle pour le fournisseur.
- **[Ouvrir du contenu chia://](./audiences/content-consumers.md)** — lire du contenu que votre propre navigateur vérifie par rapport à la chaîne.
- **[Se débloquer](./audiences/troubleshooting.md)** — retrouvez votre échec par son code stable.

Nouveau dans le vocabulaire ? Parcourez [Concepts et glossaire](./concepts.md). Vous voulez la conception complète ? Lisez la [Plongée en profondeur dans le protocole](./protocol-deep-dive.md).

:::note
DIG Network et ses primitives sont open source. dig-store est sous licence GPL-2.0 ; voir le [dépôt dig-store](https://github.com/DIG-Network/dig-store).
:::

## Voir aussi {#related}

- [Démarrage rapide](./quickstart.md) — expédiez votre premier site ; gratuit à construire et prévisualiser
- [Construire une dapp sur Chia](./build-a-dapp/tutorial.md) — chaque primitive dans un seul tutoriel de bout en bout
- [Concepts et glossaire](./concepts.md) — les entités DIG essentielles, définies et reliées
- [Qu'est-ce que dig-store ?](./digstore/what-is-digstore.md) — le format de store adressable par contenu
- [Qu'est-ce que le dig RPC ?](./rpc/what-is-the-dig-rpc.md) — l'interface de lecture pour tout le réseau
- [Le protocole chia://](./browser/chia-protocol.md) — ouvrir du contenu dans le DIG Browser
- [Obtenir de l'aide](./support/get-help.md) — communauté, dépannage et codes d'erreur
