---
sidebar_position: 1
title: What is the dig RPC?
description: "Interface de lecture pour tout le réseau pour les capsules DigStore via JSON-RPC 2.0 ; aveugle par construction, vérifiable sans confiance, et diffusable à n'importe quelle taille."
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# Qu'est-ce que le dig RPC ? {#what-is-the-dig-rpc}

:::info Spécification normative
Ceci est la page d'orientation. La spécification faisant autorité de l'interface machine — méthodes, l'objet de fil de bloc, le profil de nœud, et les documents OpenRPC — se trouve dans [Protocole · Le dig RPC](../protocol/dig-rpc.md).
:::

**Le dig RPC est l'interface pour tout le réseau permettant de lire du contenu directement depuis des capsules DigStore `.dig` hébergées.** C'est un service [JSON-RPC 2.0](https://www.jsonrpc.org/specification) parlé sur HTTPS `POST`.

Chaque nœud qui héberge des capsules — le nœud de référence à `https://rpc.dig.net`, ou tout nœud tiers — expose **les mêmes méthodes avec la même sémantique**. Un client écrit contre cette interface lit depuis tout le réseau via un seul point d'entrée. Il n'y a pas de CDN ; tout le service de contenu sur DIG passe par le dig RPC.

Il sert trois choses :

| Vous avez… | Vous appelez… | Vous obtenez… |
|---|---|---|
| La **retrieval key** d'une ressource (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | Le texte chiffré de la ressource + une preuve d'inclusion merkle (et la preuve d'exécution ZK), diffusés par blocs |
| Un **store id + une racine de génération** | [`dig.getCapsule`](./methods.md#diggetcapsule) | La capsule `.dig` entière pour cette génération, diffusée par blocs |
| Un **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | Le manifeste public de découverte / le manifeste de métadonnées du store / la liste des générations confirmées du store |

## Trois propriétés qui le définissent {#three-properties-that-define-it}

- **Aveugle par construction.** Un nœud sert du texte chiffré opaque indexé par un hachage. Il ne voit jamais une URN, une clé de déchiffrement, ou du texte en clair. Une requête qui échoue reçoit un flux **decoy** déterministe et indistinguable — jamais un `404` — de sorte que le chemin de lecture n'est jamais un oracle d'existence. Tout le déchiffrement et toute la vérification des preuves se font côté client.
- **Vérifiable sans confiance.** Chaque octet réel arrive avec une **preuve d'inclusion** merkle enracinée à la racine de génération on-chain. Le client replie la preuve jusqu'à la racine et n'accepte que si elle correspond à une racine en laquelle il a confiance. Le nœud n'est jamais présumé avoir retourné des octets authentiques.
- **Diffusable à n'importe quelle taille.** Le contenu est lu en blocs bornés, alignés sur 64 Kio, avec continuation explicite. Une ressource d'un kilo-octet et une capsule de cent méga-octets sont lues par la même boucle, et aucune réponse unique n'est illimitée.

## Comment il s'articule avec DigStore {#how-it-fits-with-digstore}

DigStore vous donne le **format** : un store chiffré, adressable par contenu, qui se compile en une seule capsule `.wasm` auto-défendue, adressée par une URN où *l'URN est la clé*. Le dig RPC est la façon dont cette capsule est **servie sur le réseau** sans faire confiance à l'hébergeur :

1. Vous compilez un store et ancrez une génération on-chain (un singleton DataLayer CHIP-0035). Sa **racine de contenu** est l'ancre de confiance.
2. Un nœud héberge la capsule et l'expose via le dig RPC.
3. Un lecteur dérive `retrieval_key = sha256(urn)`, appelle `dig.getContent`, réassemble le texte chiffré diffusé, **vérifie la preuve d'inclusion contre la racine on-chain**, et **déchiffre avec la clé dérivée de l'URN** — entièrement côté client.

Le nœud n'a appris qu'un hachage ; il n'a jamais appris ce qu'il servait.

## Une lecture en un appel {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

Le client boucle sur `next_offset` jusqu'à `complete`, vérifie `inclusion_proof` sur les octets réassemblés contre `root`, puis déchiffre. Un résultat avec `"decoy": true` signifie *introuvable* — arrêtez et signalez-le comme tel.

## Comment lire cette documentation {#how-to-read-these-docs}

- **[Méthodes](./methods.md)** — l'ensemble complet des méthodes (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), leurs paramètres, et leurs résultats.
- **[Utiliser le RPC du réseau public](./public-network-rpc.md)** — pointez votre client vers `rpc.dig.net` (ou n'importe quel nœud), les points de terminaison, et comment en faire tourner un vous-même.
- **[Streaming](./streaming.md)** — le modèle de blocs, le réassemblage, la vérification des preuves, et une boucle de client de référence.
- **[Conformité](./conformance.md)** — ce qu'un nœud DOIT implémenter pour être membre du chemin de lecture du réseau, plus CORS, les erreurs, et le modèle aveugle en détail.

:::note
Le dig RPC fait partie du [DIG Network](https://dig.net). La spécification normative complète est la section [Protocole · Le dig RPC](../protocol/dig-rpc.md), l'interface de contenu du réseau.
:::

## Voir aussi {#related}

- [Méthodes](./methods.md) — chaque méthode du dig RPC, ses paramètres, et ses résultats
- [Streaming](./streaming.md) — le modèle de blocs, le réassemblage, et la vérification des preuves
- [Conformité & sécurité](./conformance.md) — le modèle aveugle et ce qu'un nœud doit implémenter
- [URN et chiffrement](../digstore/format/urns-and-encryption.md) — l'URN derrière chaque retrieval key
- [Concepts et glossaire](../concepts.md) — le dig RPC, la capsule, et la retrieval key définis
