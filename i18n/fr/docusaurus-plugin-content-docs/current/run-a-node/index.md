---
sidebar_position: 1
title: Run a DIG node
description: "Ce qu'est un dig-node, pourquoi en faire tourner un, et comment l'installer — le dépôt apt pour Ubuntu/Debian ou l'installateur universel multiplateforme."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Faire tourner un nœud DIG {#run-a-dig-node}

> **Servir du contenu de façon prouvable et aveugle pour le fournisseur** — vous ne touchez jamais que du texte chiffré indistinguable indexé par des hachages, vous pouvez attester d'un service fidèle avec des preuves d'exécution, et le client vérifie tout par rapport à la chaîne, de sorte que la confiance ne repose jamais sur votre nœud.

Un **dig-node** est le **serveur** de contenu du DIG Network — le côté offre du réseau. Il héberge des capsules, garde un cache local `.dig`, et expose le [dig RPC](../rpc/what-is-the-dig-rpc.md) afin que tout ce qui lit du contenu DIG puisse le lire depuis vous. Il fonctionne sans interface (pas de navigateur, pas d'UI) comme service en arrière-plan — un seedbox pour le contenu que vous publiez ou que vous voulez aider à servir.

C'est le pendant des **consommateurs** — le [DIG Browser](../browser/chia-protocol.md) et l'extension de navigateur — qui récupèrent du texte chiffré + des preuves, vérifient par rapport à la racine on-chain, déchiffrent localement, et affichent. Vous n'avez **pas** besoin d'un dig-node pour lire du contenu DIG : un consommateur seul fonctionne très bien, en se repliant sur le nœud de référence public à `rpc.dig.net`. Vous faites tourner un dig-node pour **servir** — et quand l'un est présent sur la même machine, le consommateur lit depuis lui (local, compatible hors-ligne, et contribuant au réseau) et ils partagent un même cache `.dig`.

:::info Servir vs. consommer
- **dig-node** = sert du contenu + expose le dig RPC. Service en arrière-plan sans interface.
- **DIG Browser / extension** = consomme du contenu (vérifie + déchiffre localement). Pas de nœud local requis.

Quand les deux sont installés, le navigateur/l'extension lit depuis votre dig-node local ; sinon ils lisent depuis `rpc.dig.net`. Dans les deux cas, chaque octet est vérifié côté client par rapport à la chaîne — la source n'est jamais présumée fiable.
:::

## L'installer {#install-it}

| Votre machine | Utilisez |
|---|---|
| **Ubuntu / Debian** | Le **[dépôt apt](./apt.md)** natif — `apt install dig-node digstore`, activé automatiquement comme service systemd. |
| **Windows / macOS / Linux (tous)** | L'**[installateur universel](#universal-installer-any-os)** multiplateforme — un `curl \| sh` (ou téléchargement) pour chaque OS. |

Les deux installent le même service `dig-node` plus la CLI `digstore`. apt est le chemin natif Debian (signé, upgradable avec `apt upgrade`) ; l'installateur universel couvre tout le reste.

### apt (Ubuntu / Debian) — recommandé sur les systèmes de la famille Debian {#apt-ubuntu--debian--recommended-on-debian-family-systems}

Le chemin natif : un dépôt apt signé sur `apt.dig.net`. Il installe `dig-node` comme **service systemd** géré et le maintient à jour avec `apt upgrade`.

→ **[Installer sur Ubuntu/Debian via apt](./apt.md)**

### Installateur universel (tout OS) {#universal-installer-any-os}

Le chemin multiplateforme — Windows, macOS, et n'importe quel Linux. Il détecte votre OS, installe le service `dig-node` (service Windows / `systemd` / `launchd`) et la CLI `digstore`, et ne nécessite aucun gestionnaire de paquets :

```sh
curl -fsSL https://dig.net/install.sh | sh
```

C'est le même `dig-installer` autonome publié sur la [page Releases](https://github.com/DIG-Network/dig-installer/releases) — téléchargez-le et exécutez-le directement si vous préférez ne pas passer par un pipe vers un shell, ou sur Windows. Cela ouvre aussi un [assistant graphique](./universal-installer.md#gui-installer) guidé, si vous préférez cliquer plutôt qu'utiliser des options.

:::note Pré-lancement
Les installateurs hébergés (`apt.dig.net`, `dig.net/install.sh`) sont encore en cours de provisionnement. En attendant qu'ils soient en ligne, construisez depuis les sources ou récupérez un binaire depuis les [Releases de dig-node](https://github.com/DIG-Network/dig-node/releases). Les commandes ici sont les vraies, celles prévues.
:::

## Vous voulez juste lire du contenu ? {#just-want-to-read-content}

Vous n'avez pas besoin d'un nœud. Obtenez le **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** et ouvrez n'importe quelle adresse `chia://` — il consomme depuis votre dig-node local si vous en avez un, sinon depuis `rpc.dig.net`. Voir [Le protocole `chia://`](../browser/chia-protocol.md).

## Voir aussi {#related}

- [Installer sur Ubuntu/Debian via apt](./apt.md) — le chemin natif Debian + la gestion du service systemd
- [Installer n'importe où — l'installateur universel](./universal-installer.md) — Windows / macOS / tout Linux + `dig.local`
- [Pointer un consommateur vers votre nœud](./point-a-consumer.md) — lectures locales en priorité + le cache `.dig` partagé
- [Configurer dig-node](./configure.md) — ports, écouteurs, plafond de cache, amont
- [Auto-héberger une origine distante](../rpc/dig-remote.md) — `digstore serve` + clone/pull/push dig://
- [Gérer votre nœud](./manage.md) — les RPC d'administration control.* et l'UI My Node
- [Utiliser le RPC du réseau public](../rpc/public-network-rpc.md) — le dig RPC que parle votre nœud, et faire tourner un nœud sur le réseau
- [Installer la CLI](../digstore/cli/install.md) — `digstore` seul (publication, pas service)

## Aller plus loin : le protocole {#go-deeper-the-protocol}

- **« hébergeur aveugle et decoys »** → [Le modèle de service aveugle du dig RPC](../rpc/what-is-the-dig-rpc.md) · [Conformité des nœuds](../rpc/conformance.md)
- **« attester un service fidèle »** → [Preuves d'inclusion vs d'exécution](../inclusion-vs-execution-proofs.md)
- **« clone/pull/push dig:// »** → [Le protocole de remote §21/§22](../rpc/dig-remote.md)
- **Tout** → [Plongée en profondeur dans le protocole](../protocol-deep-dive.md) · [Concepts et glossaire](../concepts.md)
