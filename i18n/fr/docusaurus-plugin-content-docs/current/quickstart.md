---
sidebar_position: 2
title: Quickstart
description: "Expédiez votre premier site sur DIG — gratuit à construire et prévisualiser, vous ne payez le prix uniforme de capsule que lorsque vous publiez. Parcours web-first (pas de portefeuille pour commencer) plus un parcours CLI parallèle."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Démarrage rapide {#quickstart}

Expédiez un site vers un réseau qu'aucun hébergeur ne peut lire, modifier ou faire tomber — en environ dix minutes.

**Vous construisez et prévisualisez gratuitement.** L'échafaudage et la prévisualisation ne coûtent rien ; vous payez le **prix uniforme de capsule en $DIG** seulement au moment où vous publiez une [capsule](./concepts.md#capsule) on-chain. *Itérez gratuitement, publiez quand c'est prêt.*

Deux façons de le faire. La plupart des gens commencent sur le web.

- **[A. Publier depuis le web](#a-publish-from-the-web)** — dans [DIGHUb](./concepts.md#dighub), connectez un portefeuille à la fin. Idéal pour les sites et frontends. ~10 min.
- **[B. Publier depuis la CLI](#b-publish-from-the-cli)** — `digstore` sur votre machine, scriptable et prêt pour la CI. Idéal pour les développeurs et l'automatisation.

---

## A. Publier depuis le web {#a-publish-from-the-web}

Le chemin le plus rapide : construisez et prévisualisez dans le navigateur, financez un portefeuille seulement à la dernière étape.

### 1. Ouvrez DIGHUb et démarrez un brouillon — gratuit, sans portefeuille {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**Démarrez un nouveau store dans DIGHUb ↗**](https://hub.dig.net/new). Déposez-y votre site construit (un dossier de fichiers statiques — votre `dist/` ou `build/`). DIGHUb vous donne une **prévisualisation de brouillon gratuite** montrant exactement comment il sera servi, sans rien sur la chaîne et sans dépenser de $DIG.

Vous n'avez pas encore besoin de portefeuille. Itérez sur le brouillon autant de fois que vous le souhaitez — re-téléversez, re-prévisualisez — entièrement gratuitement.

### 2. Prévisualisez-le sur le vrai chemin de lecture — toujours gratuit {#2-preview-it-on-the-real-read-path--still-free}

La prévisualisation restitue votre site via le véritable pipeline DIG (chiffrer → compiler → vérifier → déchiffrer), donc ce que vous voyez est ce que les visiteurs obtiennent. Cliquez partout, vérifiez les ressources et le routage. Rien n'est publié et rien n'est dépensé tant que vous ne le décidez pas.

### 3. Publiez — financez et connectez un portefeuille {#3-publish--fund-and-connect-a-wallet}

Quand le brouillon vous convient, cliquez sur **Publier**. C'est la seule étape qui coûte quelque chose :

- Connectez un portefeuille Chia (votre portefeuille *est* votre compte — pas d'email, pas de mot de passe).
- Approuvez la dépense on-chain : le **prix uniforme de capsule en $DIG + de petits frais XCH**, en une seule signature. L'écran de publication affiche le montant exact en $DIG avant que vous ne signiez.
- DIGHUb mint votre store et publie la première **capsule** sur le mainnet Chia.

Pas assez de DIG ? L'écran de publication affiche votre solde et où vous réapprovisionner. Voir [Où obtenir du DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space, ou 9mm.pro.

### 4. Vous êtes en ligne {#4-youre-live}

Votre capsule est maintenant ancrée on-chain et **immédiatement lisible via le [dig RPC](./concepts.md#dig-rpc)** — n'importe qui peut la récupérer et la vérifier via son [URN `urn:dig:`](./concepts.md#urn) ou son adresse [`chia://`](./browser/chia-protocol.md), sans inscription et sans rien payer de plus. L'URN est à la fois l'adresse *et* la clé ; partagez-la pour partager le contenu. Le chemin de lecture est universel et gratuit ; il est actif dès que la capsule est confirmée.

**Vous voulez une adresse conviviale `*.on.dig.net` ?** C'est optionnel. Un store obtient un sous-domaine `*.on.dig.net` seulement quand vous **enregistrez un handle** pour lui dans DIGHUb — un enregistrement payant séparé qui épingle le store à ce nom. Tant que vous n'en enregistrez pas un, il n'y a pas d'URL `*.on.dig.net` (l'URN / l'adresse `chia://` ci-dessus reste toujours la façon canonique d'y accéder). Voir [Puis-je utiliser mon propre domaine ?](./support/faq.md#can-i-use-my-own-domain).

**Pour expédier une mise à jour plus tard :** modifiez, prévisualisez le nouveau brouillon gratuitement, et Publiez à nouveau. Chaque mise à jour publiée est une nouvelle capsule et coûte à nouveau le **prix uniforme de capsule** — vous ne payez que lorsque vous promouvez un brouillon en une version permanente on-chain.

:::tip Automatisez-le
Une fois votre store créé, mettez en place [Déployer depuis GitHub Actions](./digstore/cli/deploy-from-github-actions.md) pour que chaque push sur `main` publie une nouvelle capsule — git-push-to-deploy.
:::

---

## B. Publier depuis la CLI {#b-publish-from-the-cli}

Le même flux depuis votre terminal — scriptable et la base de la CI. La CLI reflète le parcours web : construire et prévisualiser ne coûte rien ; publier une capsule coûte le prix uniforme de capsule en $DIG.

### 1. Installer {#1-install}

```sh
# téléchargez l'installateur pour votre OS depuis la page Releases, puis :
digstore --version
```

Voir [Installer la CLI](./digstore/cli/install.md) pour les installateurs par OS et la construction depuis les sources.

### 2. Échafauder et prévisualiser — gratuit, sans chaîne, sans dépense {#2-scaffold-and-preview--free-no-chain-no-spend}

Échafaudez un projet et prévisualisez-le localement — **gratuit, sans mint, sans chaîne** — avant même de dépenser quoi que ce soit :

```sh
digstore new <template>   # échafaude un projet câblé avec un portefeuille (static · vite-react · next-static · nft-drop · dapp-window-chia) — gratuit, sans mint
digstore dev              # observe + compile-à-la-sauvegarde + sert le vrai chemin de lecture chia://, avec un window.chia injecté — gratuit, rechargement à chaud
```

`new` écrit un projet exécutable (un `dig.toml` + une application de démarrage) ; `dev` le sert via le vrai chemin de lecture DIG (compiler → vérifier → déchiffrer) avec rechargement à chaud. Vous ne payez le prix uniforme de capsule que lorsque vous publiez (étapes suivantes). Ou construisez avec votre chaîne d'outils habituelle (`npm run build` → `dist/`) et publiez ce résultat.

:::tip Vous préférez npm ? Utilisez `create-dig-app`
Si vous vivez dans le monde Node, `npm create dig-app@latest my-app -- --template vite-react` échafaude les mêmes modèles directement depuis npm — pas besoin d'installer `digstore` pour commencer. Voir [Échafauder une application](./build-a-dapp/scaffold.md).
:::

### 3. Configurer un portefeuille (nécessaire seulement pour publier) {#3-set-up-a-wallet-only-needed-to-publish}

Publier dépense de vrais fonds, il vous faut donc d'abord une seed et un portefeuille financé :

```sh
digstore seed generate      # génère une nouvelle mnémonique (affichée une seule fois — sauvegardez-la)
digstore balance            # affiche votre adresse de réception ; financez-la avec du XCH + du DIG
```

Voir [Ancrage on-chain](./digstore/cli/onchain-anchoring.md) pour l'import, le financement et les détails de TTL.

### 4. Publier votre première capsule {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # mint la première capsule du store (prix uniforme de capsule + frais XCH)
```

`init` mint un singleton Chia sur le mainnet — **l'id du launcher devient l'id de votre store** — et bloque jusqu'à confirmation.

### 5. Expédier des mises à jour {#5-ship-updates}

```sh
npm run build                      # produit dist/
digstore add -A                    # met en scène toute la racine de contenu
digstore commit -m "v1.1"          # publie une nouvelle capsule (prix uniforme de capsule + frais XCH)
```

Pour la CI, une seule commande fait add → commit → push et affiche l'URL :

```sh
digstore deploy --output-dir dist --json   # fait avancer un store existant depuis la CI ; ne mint jamais
```

Voir [Déployer depuis GitHub Actions](./digstore/cli/deploy-from-github-actions.md).

### 6. Le relire {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # une URN qui localise ET déchiffre à la fois
```

---

## Ce que ça coûte {#what-it-costs}

| Ce que vous faites | Coût |
|---|---|
| Échafauder, construire, prévisualiser un brouillon | **Gratuit** |
| Publier votre première capsule (`init` / Publier dans DIGHUb) | **prix uniforme de capsule en $DIG** + petits frais XCH |
| Publier chaque mise à jour (`commit` / re-Publier) | **prix uniforme de capsule en $DIG** + petits frais XCH |

Le prix est **uniforme par capsule** partout — voir [pourquoi le prix est uniforme](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Bloqué ? {#stuck}

- [Dépannage](./support/troubleshooting.md) — les échecs courants et leurs solutions.
- [FAQ](./support/faq.md) — réponses rapides.
- [Obtenir de l'aide](./support/get-help.md) — la communauté et comment déposer un bon rapport.

## Voir aussi {#related}

- [Concepts et glossaire](./concepts.md) — capsule, store, URN, et paiement DIG définis
- [Échafauder une application (create-dig-app)](./build-a-dapp/scaffold.md) — démarrer un projet déployable en une commande (npm ou CLI)
- [Installer la CLI](./digstore/cli/install.md) — obtenir `digstore` sur votre machine
- [Ancrage on-chain](./digstore/cli/onchain-anchoring.md) — configuration du portefeuille, financement et coûts
- [Déployer depuis GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — push-to-publish en CI
- [Tutoriel CLI](./digstore/cli/quickstart.md) — le parcours complet créer-committer-lire
