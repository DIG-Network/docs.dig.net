---
sidebar_position: 1
title: What is dig-store?
description: "Format de projet en forme de Git, adressable par contenu, avec chiffrement intégré et adressage basé sur URN ; se compile en un seul module WebAssembly auto-défendu."
keywords:
  - dig-store
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# Qu'est-ce que dig-store ? {#what-is-digstore}

**dig-store est un projet en forme de Git, chiffré, adressable par contenu, qui se compile en un seul module WebAssembly auto-défendu.**

Vous obtenez des commandes de style Git — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — pour un projet qui est **chiffré au repos** et se compile en **un seul fichier `.wasm`**. Ce fichier unique est *à la fois vos données et le serveur qui en contrôle l'accès*. Un hébergeur qui le stocke ou le relaie ne voit que du texte chiffré adressé par des hachages ; il ne peut pas lire ce qu'il transporte.

Vous adressez le contenu avec une **[URN](./format/urns-and-encryption.md)**, et l'URN *est* la clé : elle localise et déchiffre à la fois. Donnez une URN à quelqu'un et il peut lire cette ressource ; sans elle, il ne le peut pas — il n'y a pas de mot de passe ou de liste d'accès séparée à gérer.

Contrairement à Git, dig-store est conçu pour le **résultat de build**, pas le code source d'un dépôt. Vous pointez un projet vers un répertoire comme `dist/` et il capture ce qui s'y trouve.

## Pourquoi il existe {#why-it-exists}

| Problème | La réponse de dig-store |
|---|---|
| Les hébergeurs peuvent lire / scanner ce que vous publiez | Le contenu est chiffré au repos ; l'hébergeur ne détient que du texte chiffré indexé par des hachages |
| Le contrôle d'accès implique des mots de passe et des ACL | L'URN *est* la capacité — partagez-la pour accorder la lecture, retenez-la pour la refuser |
| Vous devez faire confiance au serveur pour qu'il serve des octets authentiques | `clone`/`pull` vérifient l'id du store du module, la racine signée de l'éditeur, et la **racine du singleton on-chain** avant l'installation — échoue de façon fermée |
| « Quelle est la taille de ce payload ? » fuite par la taille du fichier | Chaque projet est un seul `.wasm`, complété par du padding à une taille uniforme qui ne révèle rien sur son contenu |
| La logique de service vit séparément de la donnée | La donnée et le code qui en contrôle l'accès se compilent dans le *même* module |

## Comment lire cette documentation {#how-to-read-these-docs}

- **[Le format dig-store](./format/overview.md)** — les concepts : projets, déploiements, le module `.wasm`, les URN, le chiffrement, et les preuves. Commencez ici si vous voulez comprendre *ce qu'est* dig-store.
- **[Tutoriel CLI](./cli/install.md)** — installez la CLI et utilisez-la dans un vrai projet : initialiser un projet, capturer un répertoire de build, committer des déploiements, partager via un remote, et diffuser du contenu en retour.

Si vous voulez juste essayer, allez directement au **[Démarrage rapide](../quickstart.md)** (le parcours gratuit et web-first) ou au **[tutoriel CLI](./cli/quickstart.md)**.

:::note
dig-store fait partie du [DIG Network](https://dig.net). La conception technique complète se trouve dans la [section Protocole](../protocol-deep-dive.md) — le format de store WASM adressable par contenu.
:::

## Voir aussi {#related}

- [Le format dig-store](./format/overview.md) — projets, module WASM, URN, chiffrement, preuves
- [Structure du store](./format/store-structure.md) — identité du store, generations, et le module compilé
- [URN et chiffrement](./format/urns-and-encryption.md) — l'URN qui adresse *et* déchiffre à la fois
- [Tutoriel CLI](./cli/quickstart.md) — créer, committer et lire un store en quelques minutes
- [Concepts et glossaire](../concepts.md) — les entités DIG essentielles en un coup d'œil
