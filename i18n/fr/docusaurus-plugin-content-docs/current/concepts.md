---
sidebar_position: 1.5
title: Concepts & glossary
description: "Index en une page des entités essentielles du DIG Network — capsule, store, generation, URN, retrieval key, le dig RPC, le protocole chia://, et l'ancrage on-chain — chacune définie une fois et reliée à sa documentation détaillée."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts et glossaire {#concepts--glossary}

Cette page définit **une fois** chaque entité essentielle du DIG Network, en langage clair, et relie chacune à la
documentation qui va plus loin. C'est l'épine dorsale lisible par un humain de cette documentation — et, comme chaque terme est aussi
émis sous forme de données structurées lisibles par machine, c'est la carte qu'un agent peut extraire pour apprendre le
vocabulaire du réseau. Parcourez-la pour vous orienter ; suivez un lien pour aller plus loin.

## La capsule {#capsule}

Une **capsule** est une génération de store immuable unique : la paire `(storeId, rootHash)`, notée canoniquement
`storeId:rootHash`. C'est l'unité atomique du réseau — pour la compilation (un module WASM de taille fixe unique),
la [tarification](./digstore/cli/onchain-anchoring.md) (un prix uniforme par capsule pour mint ou committer, payé
en $DIG), la récupération (une [URN](#urn) nomme une capsule), la mise en cache et la provenance. Un [store](#store) est une *séquence de
capsules*, une par commit. Cette définition est identique dans dig-store, le dig RPC, et le DIG
Browser. → [La capsule, en détail](./intro.md#the-capsule)

## Store {#store}

Un **store** est une identité plus son contenu et son historique : une séquence de [capsules](#capsule), une par
commit. Son identité est un **store id** de 64 caractères hexadécimaux, qui *est* l'id du launcher de son singleton Chia on-chain —
le singleton de la chaîne fait autorité pour la racine actuelle du store. Un store est l'équivalent DIG d'un
site web. → [Structure du store](./digstore/format/store-structure.md)

## Generation {#generation}

Une **generation** est un état committé unique d'un [store](#store), identifié par un **root hash** (une
racine de Merkle sur les feuilles par ressource de cette generation). Chaque `commit` scelle le contenu actuel dans
une nouvelle generation, en ajout seul — la même chose qu'une [capsule](#capsule) nomme. Les generations croissent
de façon monotone, comme l'historique Git. → [Generations et root hashes](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

Une **URN** est l'adresse *et* la clé de dig-store en une seule chaîne :
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. Elle **localise** une ressource et **dérive la
clé qui la déchiffre** — posséder l'URN est nécessaire et suffisant pour lire une ressource publique.
Le raccourci côté navigateur est le [protocole `chia://`](#chia-protocol). → [URN et chiffrement](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

La **retrieval key** est `SHA-256(canonical_urn)` — la seule adresse qui quitte jamais le client. Elle
localise le texte chiffré d'une ressource sans révéler son chemin ni son [URN](#urn). Elle est
*indépendante de la racine*, si bien que la même clé retrouve une ressource à travers les [generations](#generation) ; les octets
servis sont ensuite [vérifiés par Merkle](#merkle-proof) contre la racine correcte. La **clé de déchiffrement**
séparée est dérivée localement (HKDF) à partir de la même URN et n'est jamais envoyée. → [Deux valeurs, une chaîne](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Chaque [generation](#generation) construit un arbre de Merkle avec une feuille par ressource, s'engageant sur les
octets exacts du *texte chiffré* servi. Une seule **preuve d'inclusion** accompagne une ressource servie et
prouve que ces octets appartiennent à cette racine exacte — ainsi le contenu est vérifié sans jamais être déchiffré,
et un nœud n'est jamais présumé avoir retourné des octets authentiques. → [Preuves de Merkle](./digstore/format/proofs-and-security.md)

## On-chain anchoring {#anchoring}

Chaque store est un **singleton sur le mainnet Chia**. `dig-store init` le mint (l'id du launcher *devient*
l'id du store) et chaque `dig-store commit` ancre une nouvelle racine de [generation](#generation) on-chain comme
une mise à jour de singleton CHIP-0035. Les deux bloquent jusqu'à confirmation et dépensent de vrais fonds. La chaîne fait
autorité pour la dernière racine d'un store. → [Ancrage on-chain](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG** est le token du DIG Network (un CAT Chia). Minter une [capsule](#capsule) (`init`) ou en committer une
coûte un **prix uniforme par capsule en $DIG**, inclus **atomiquement dans la même dépense on-chain** que
l'ancrage — il n'y a pas de transaction séparée, et le mémo porte l'id du store. → [Coûts](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store` est l'outil en ligne de commande qui crée, committe, partage et lit des stores — un workflow
en forme de Git (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) sur le format de store chiffré et
on-chain. → [Référence des commandes](./digstore/cli/command-reference.md) · [Tutoriel CLI](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` est le **manifeste de projet committable** à la racine d'un projet — `store-id`, `output-dir`,
`build-command`, et d'autres configurations de projet, partagés par `dig-store dev`, `dig-store deploy`, et les
modèles d'échafaudage. Il ne contient **aucun secret** (ceux-ci viennent de l'environnement), donc il est sûr de le
committer. → [Configuration de projet et valeurs de build](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) est la **porte d'entrée JS** pour démarrer un projet DIG : il
échafaude un starter exécutable — une application, un [`dig.toml`](#dig-toml), et (pour les modèles avec portefeuille) le
[DIG SDK](#dig-sdk) déjà câblé — à partir de l'un des cinq modèles (`static`, `vite-react`, `next-static`,
`nft-drop`, `dapp-window-chia`). L'échafaudage est **gratuit** — pas de mint, pas de chaîne, pas de dépense ; vous ne payez
le prix uniforme de capsule que lorsque vous publiez une [capsule](#capsule). C'est le compagnon côté npm de la CLI Rust
`dig-store new`. → [Échafauder une application](./build-a-dapp/scaffold.md)

## The GitHub deploy Action {#deploy-action}

`dig-network/deploy-action` est l'Action GitHub **git-push-to-deploy** : elle installe la
[CLI `dig-store`](#digstore-cli) sur le runner, exécute `dig-store deploy` pour faire avancer votre store (sans jamais
minter), et renvoie la [capsule](#capsule) publiée + les URL + le coût sous forme de sorties d'étape, d'un
commentaire de PR, d'un GitHub Deployment, et d'un statut de commit. Avec `if-changed` (par défaut), un
build identique à l'octet près est un no-op — pas de dépense. → [Déployer depuis GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

Le **DIG SDK** (`@dignetwork/dig-sdk`) est le package npm typé pour les développeurs d'intégration : un
`ChiaProvider` (préfère le [`window.chia`](#window-chia) injecté, se replie sur WalletConnect → Sage),
un `DigClient` (lit du contenu vérifié et chiffré via le [dig RPC](#dig-rpc)), un `Paywall`
(un assistant haut niveau de paiement pour déverrouiller / d'accès contrôlé par NFT qui compose le fournisseur avec le constructeur
de dépense), et le constructeur de dépense CHIP-0035 canonique réexporté au sous-chemin `/spend`.
→ [Construire une dapp sur Chia](./build-a-dapp/tutorial.md)

## The dig RPC {#dig-rpc}

Le **dig RPC** est l'interface de lecture pour tout le réseau : un service JSON-RPC 2.0 sur HTTPS `POST` que
chaque nœud d'hébergement parle de façon identique. Il sert du texte chiffré + des [preuves d'inclusion](#merkle-proof) par
[retrieval key](#retrieval-key), des [capsules](#capsule) entières par `(storeId, root)`, et des métadonnées de
découverte — aveugle par construction, vérifié et déchiffré côté client. **C'est le chemin de lecture
universel** : chaque capsule publiée est lisible ici via son adresse [URN](#urn) / [`chia://`](#chia-protocol) dès qu'elle est
confirmée on-chain — sans inscription et sans paiement au-delà de la publication de la capsule. Le [handle](#on-dig-net) optionnel et convivial
`*.on.dig.net` est une porte d'entrée *par-dessus* cela ; le dig RPC
lui-même est toujours disponible. → [Qu'est-ce que le dig RPC ?](./rpc/what-is-the-dig-rpc.md)

## The chia:// protocol {#chia-protocol}

`chia://` est le schéma d'adresse de contenu natif du DIG Browser — la façade saisissable de
l'[URN `urn:dig:`](#urn). Collez un lien `chia://<storeId>/` et le navigateur récupère le contenu directement
depuis le réseau, adressé par contenu et vérifié de façon cryptographique. → [Le protocole chia://](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` est le fournisseur de portefeuille Chia que le **DIG Browser** injecte dans chaque page. Il parle
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), afin qu'une application web puisse
demander l'adresse, les signatures et les dépenses de l'utilisateur sans configuration WalletConnect — une alternative
clé en main pour les applications qui parlent déjà CHIP-0002. → [Utiliser window.chia](./browser/using-window-chia.md)
· [La spécification du fournisseur window.chia](./protocol/window-chia-provider.md) (normative, versionnée)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) est l'application web pour publier et gérer des
[capsules](#capsule) sans la CLI — créer une capsule, déployer un frontend, et voir vos stores dans
le navigateur. C'est aussi le plan de contrôle contrôlé qui budgétise les tâches coûteuses de preuve d'exécution ZK.

## dig-node {#dig-node}

Un **dig-node** est le **serveur** de contenu du réseau — le côté offre. Il héberge des [capsules](#capsule), garde un
cache local `.dig`, et parle le [dig RPC](#dig-rpc) de façon identique à `rpc.dig.net`. Vous n'avez **pas** besoin d'en
faire tourner un pour lire du contenu DIG (les consommateurs se replient sur `rpc.dig.net`) ; en faire tourner un rend les lectures locales en priorité et
contribue à la capacité de service. L'hébergeur est **aveugle** — il ne fait que relayer du texte chiffré + des preuves.
→ [Faire tourner un nœud](./run-a-node/index.md)

## on.dig.net handle {#on-dig-net}

Un **handle on.dig.net** est une adresse web humainement conviviale *optionnelle et payante* pour un [store](#store) :
`<votre-nom>.on.dig.net`. Un store n'en obtient **pas** un automatiquement — vous enregistrez le handle (un
enregistrement CHIP-54 / `on.dig.net` payant dans [DIGHUb](#dighub)) et cet enregistrement épingle le store
à ce nom. Pas d'enregistrement signifie pas d'adresse `*.on.dig.net`. C'est purement une porte d'entrée pratique :
le store est déjà lisible via le [dig RPC](#dig-rpc) par son adresse [URN](#urn) / [`chia://`](#chia-protocol) que
le handle existe ou non. (Les handles de compte et les slugs de store sont des espaces de noms séparés et n'exposent pas
automatiquement un sous-domaine.) → [Puis-je obtenir une adresse `*.on.dig.net` ?](./support/faq.md#can-i-use-my-own-domain)

## Voir aussi {#related}

- [Vue d'ensemble du DIG Network](./intro.md) — les primitives en un coup d'œil
- [Démarrage rapide](./quickstart.md) — construisez et prévisualisez gratuitement, publiez une capsule à la fin
- [Construire une dapp sur Chia](./build-a-dapp/tutorial.md) — chaque primitive assemblée dans une seule dapp expédiée
- [Qu'est-ce que dig-store ?](./digstore/what-is-digstore.md) — le format de store en un seul fichier
- [Qu'est-ce que le dig RPC ?](./rpc/what-is-the-dig-rpc.md) — le chemin de lecture du réseau
- [Le protocole chia://](./browser/chia-protocol.md) — adresser du contenu dans le navigateur
- [Obtenir de l'aide](./support/get-help.md) — canaux communautaires et comment signaler un problème

## Pour les agents et les LLM {#for-agents--llms}

Cette documentation est extractible par machine. Chaque page porte du JSON-LD schema.org (celle-ci comme un
ensemble `DefinedTerm`), et deux cartes organisées se trouvent à la racine du site :

- [`/llms.txt`](pathname:///llms.txt) — une carte markdown riche en liens de la documentation (convention [llms.txt](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — entités (concepts + documents) et arêtes typées (`defines`, `part-of`, `requires`, `see-also`).
