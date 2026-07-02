---
sidebar_position: 5
title: For content consumers
description: "Ouvrez du contenu chia:// que votre propre navigateur vérifie par rapport à la blockchain — aucun hébergeur ne peut l'altérer ou le falsifier, le contenu privé reste privé vis-à-vis de l'hébergeur, et c'est permanent et ré-hébergeable partout, donc personne ne peut le faire tomber ou vous enfermer."
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# Pour les consommateurs de contenu {#for-content-consumers}

> **Ouvrez du contenu `chia://` que VOTRE PROPRE navigateur vérifie par rapport à la blockchain** — aucun hébergeur ne peut l'altérer ou le falsifier, le contenu privé reste privé vis-à-vis de l'hébergeur, et c'est permanent et ré-hébergeable partout, donc personne ne peut le faire tomber ou vous enfermer.

## Le modèle mental {#the-mental-model}

Collez un lien `chia://` et le contenu vient directement du réseau — **adressé par contenu** et **vérifié de façon cryptographique sur VOTRE appareil** avant d'être affiché. C'est **fail-closed** : des octets altérés ou indéchiffrables ne s'affichent jamais.

- **Omettez le `rootHash`** pour la *dernière* version du store : `chia://<storeId>/`.
- **Incluez-le** pour épingler une [capsule](../concepts.md#capsule) immuable exacte : `chia://<storeId>:<rootHash>/`.

Le contenu public ne nécessite que le lien. Le contenu privé nécessite aussi un secret **`?salt=`** — comme un mot de passe.

## Obtenir le DIG Browser, ou l'extension {#get-the-dig-browser-or-the-extension}

- **[Obtenir le DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — un navigateur avec `chia://` et un portefeuille intégré.
- **L'extension** pour Chrome / Edge / Brave / Firefox — ajoute la résolution `chia://` à un navigateur que vous utilisez déjà.

## Ouvrir du contenu `chia://` — dernier vs épinglé {#open-chia-content--latest-vs-pinned}

Les formes d'adresse, la barre `chia://<store>/` épurée, et quand épingler un `rootHash`.

→ [Le protocole chia://](../browser/chia-protocol.md)

## Pages intégrées, badge vérifié et boucliers {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, et le badge vérifié / les boucliers qui affichent le verdict de la preuve d'inclusion de chaque ressource pour la capsule active.

→ [Utiliser window.chia](../browser/using-window-chia.md)

## Public vs privé — quand vous avez besoin d'un secret `?salt=` {#public-vs-private--when-you-need-a-salt-secret}

Les stores publics s'ouvrent avec juste le lien ; les stores privés nécessitent le sel secret qui dérive la clé de déchiffrement.

→ [Stores publics vs privés](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Public vs privé — quelle est la différence ?](../support/faq.md#public-vs-private)

## Faire tourner du contenu localement (optionnel) {#run-content-locally-optional}

Pointez votre navigateur/extension vers un [dig-node](../concepts.md#dig-node) local pour des lectures plus rapides et compatibles hors-ligne — ils partagent un même cache `.dig`. Vous n'avez jamais *besoin* d'un nœud pour lire.

→ [Faire tourner un nœud](../run-a-node/index.md)

## Obtenir du $DIG {#get-dig}

Vous n'avez pas besoin de $DIG pour *lire* du contenu. Si vous voulez publier, obtenez du $DIG sur **TibetSwap**, **dexie.space**, ou **9mm.pro**.

→ [Où puis-je obtenir du DIG ?](../support/faq.md#where-do-i-get-dig)

---

## Aller plus loin : le protocole {#go-deeper-the-protocol}

- **« vérifié par rapport à la blockchain »** → [Ancrage on-chain](../digstore/cli/onchain-anchoring.md) · [Preuves et sécurité](../digstore/format/proofs-and-security.md)
- **« sel public vs privé »** → [URN et chiffrement](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **« dernier vs épinglé »** → [Generations et root hashes](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Tout** → [Plongée en profondeur dans le protocole](../protocol-deep-dive.md) · [Concepts et glossaire](../concepts.md)
