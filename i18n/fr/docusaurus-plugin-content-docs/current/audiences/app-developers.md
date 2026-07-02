---
sidebar_position: 1
title: For app developers
description: "Publiez un site ou une application que vous possédez vraiment — minté on-chain comme votre propre actif, pas loué. Construisez et prévisualisez gratuitement ; payez un petit prix uniforme en $DIG seulement lorsque vous publiez, avec des fichiers chiffrés dans votre navigateur pour qu'aucun hébergeur ne puisse les lire."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - digstore
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# Pour les développeurs d'applications {#for-app-developers}

> **Publiez un site ou une application que vous POSSÉDEZ vraiment** — minté on-chain comme votre propre actif, pas loué. Construisez et prévisualisez **gratuitement** ; payez un petit **prix uniforme en $DIG** seulement lorsque vous publiez, avec des fichiers **chiffrés dans votre navigateur** pour qu'aucun hébergeur ne puisse les lire.

## Le modèle mental {#the-mental-model}

Un **[store](../concepts.md#store)** est l'identité permanente de votre site web — un singleton on-chain que vous contrôlez. Chaque fois que vous publiez, vous mintez une **[capsule](../concepts.md#capsule)** immuable = `storeId:rootHash`. Un store n'est que la séquence des capsules que vous avez publiées au fil du temps.

Deux portes d'entrée mènent à la **même** boucle construction-gratuite → publication-payante :

- **Le parcours web** — [DIGHUb](../concepts.md#dighub) sur [hub.dig.net](https://hub.dig.net) : déposez un dossier construit, prévisualisez gratuitement, connectez un portefeuille seulement à la Publication.
- **Le parcours CLI / CI** — la CLI [`digstore`](../concepts.md#digstore-cli) + [`create-dig-app`](../concepts.md#create-dig-app) + l'[Action de déploiement GitHub](../concepts.md#deploy-action).

Échafauder, construire et prévisualiser ne coûte **rien**. Vous ne payez que lorsque vous publiez une capsule.

| Ce que vous faites | Coût |
|---|---|
| Échafauder, construire, prévisualiser un brouillon | **Gratuit** |
| Publier votre première capsule (minter un store) | **prix uniforme de capsule en $DIG** + petits frais XCH |
| Publier chaque mise à jour (une nouvelle capsule) | **prix uniforme de capsule en $DIG** + petits frais XCH |

## Commencez ici {#start-here}

- **[Démarrage rapide — expédier un site en 10 minutes](../quickstart.md)** — le parcours le plus rapide, web ou CLI.

## Publier depuis le web — DIGHUb {#publish-from-the-web--dighub}

[**Démarrez un nouveau store dans DIGHUb ↗**](https://hub.dig.net/new). Déposez-y votre site construit (votre dossier `dist/` ou `build/`), obtenez une **prévisualisation de brouillon gratuite** sur le vrai chemin de lecture, et connectez un portefeuille seulement à l'étape **Publier**. Voir le parcours web dans [Démarrage rapide → Publier depuis le web](../quickstart.md#a-publish-from-the-web).

## Publier depuis la CLI — digstore {#publish-from-the-cli--digstore}

La boucle en forme de Git : `new` → `dev` → `init` → `commit`.

```sh
digstore new vite-react   # échafaude un projet exécutable — gratuit, sans mint
digstore dev              # prévisualise sur le vrai chemin de lecture chia://, rechargement à chaud — gratuit
digstore init site --dir dist   # mint la première capsule du store (prix uniforme + frais XCH)
digstore commit -m "v1.1"       # publie une mise à jour — une nouvelle capsule
```

→ [Démarrage rapide CLI](../digstore/cli/quickstart.md) · [Le workflow de projet complet](../digstore/cli/project-workflow.md)

## Échafauder une application — 5 modèles {#scaffold-an-app--5-templates}

Démarrez à partir d'un starter exécutable et câblé avec un portefeuille — `static`, `vite-react`, `next-static`, `nft-drop`, ou `dapp-window-chia` — via `digstore new <template>` ou `npm create dig-app`.

→ [Échafauder une application](../build-a-dapp/scaffold.md)

## Prévisualiser gratuitement avec `digstore dev` {#preview-free-with-digstore-dev}

`digstore dev` sert votre projet via le **véritable** chemin de lecture DIG (chiffrer → compiler → vérifier → déchiffrer) avec rechargement à chaud et un `window.chia` de développement injecté. Ce que vous voyez est ce que les visiteurs obtiennent — et rien n'est minté ou dépensé.

→ [Démarrage rapide CLI → développer et prévisualiser](../digstore/cli/quickstart.md)

## `dig.toml` — le manifeste committable {#digtoml--the-committable-manifest}

`dig.toml` à la racine de votre projet contient `store-id`, `output-dir`, `build-command`, `remote`, et d'autres configurations — partagées par `digstore dev`, `digstore deploy`, et les modèles d'échafaudage. Il ne contient **aucun secret** (ceux-ci viennent de l'environnement), donc committez-le.

→ [Configuration de projet et valeurs de build](../digstore/cli/configuration.md)

## Mises à jour et versions — chaque publication est une nouvelle capsule {#updates--versions--each-publish-is-a-new-capsule}

Chaque publication scelle le build actuel dans une **nouvelle capsule immuable** et fait avancer la racine on-chain de votre store. Les anciennes capsules restent lisibles, et le store résout toujours vers la plus récente à moins qu'un lecteur n'épingle un `rootHash` spécifique.

→ [Ancrage on-chain](../digstore/cli/onchain-anchoring.md)

## Ce que ça coûte {#what-it-costs}

Gratuit pour construire et prévisualiser ; un **prix uniforme en $DIG** par capsule publiée, plus de petits frais réseau XCH — inclus **atomiquement** dans la même dépense on-chain. Le prix est uniforme par capsule par conception (pour que la longueur de la capsule ne révèle rien sur votre contenu). Obtenez du $DIG sur TibetSwap, dexie.space, ou 9mm.pro.

→ [Où obtenir du DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Pourquoi chaque capsule a-t-elle le même prix ?](../support/faq.md#why-uniform-price)

## Push-to-deploy depuis GitHub Actions {#push-to-deploy-from-github-actions}

Configurez `dig-network/deploy-action` pour que chaque push publie une nouvelle capsule — avec une garde `if-changed` qui fait d'un build identique à l'octet près un no-op (pas de dépense).

→ [Déployer depuis GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Ajouter une adresse web `*.on.dig.net` (optionnel) {#add-a-ondignet-web-address-optional}

Votre store est accessible via son adresse [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) dès qu'il est confirmé — sans coût supplémentaire. Un handle convivial `<nom>.on.dig.net` est un enregistrement **optionnel et payant** dans DIGHUb en plus de cela.

→ [Puis-je utiliser mon propre domaine ?](../support/faq.md#can-i-use-my-own-domain)

---

## Aller plus loin : le protocole {#go-deeper-the-protocol}

Le modèle en langage clair ci-dessus est tout ce dont vous avez besoin pour publier. Quand vous voulez la conception complète :

- **« un store est une séquence de capsules »** → [Concepts et glossaire](../concepts.md#capsule) · [Le modèle capsule et store](../digstore/format/store-structure.md)
- **« des fichiers chiffrés dans votre navigateur »** → [URN et chiffrement](../digstore/format/urns-and-encryption.md)
- **« un prix uniforme + une dépense $DIG atomique »** → [Ancrage on-chain](../digstore/cli/onchain-anchoring.md#costs) · [Dépenses de store-coin CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Tout** → [Plongée en profondeur dans le protocole](../protocol-deep-dive.md)
