---
sidebar_position: 1
title: Build a dapp on Chia
description: "De bout en bout : échafaudez une application React, câblez le portefeuille Chia intégré (window.chia + repli WalletConnect) avec le dig-sdk, construisez et signez une dépense via le wasm chip35, puis déployez on-chain et ajoutez un domaine personnalisé — un seul fil à travers chaque primitive DIG."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digs deploy
  - custom domain
tags:
  - digstore-cli
  - window-chia
  - dig-rpc
  - chip-0035
  - dighub
  - capsule
  - anchoring
---

# Construire une dapp sur Chia {#build-a-dapp-on-chia}

Chaque primitive DIG est documentée séparément — échafaudage, portefeuille intégré, chemin de lecture, dépenses, déploiement. **Cette page est le fil unique qui les relie en une seule dapp expédiée.** Vous partirez d'un dossier vide et finirez avec une application React consciente du portefeuille, en direct on-chain sur votre propre domaine.

Toute la boucle jusqu'à la publication est **gratuite** — échafauder, développer et prévisualiser ne coûtent rien. Vous ne payez le **prix uniforme de capsule en $DIG** qu'à l'étape de déploiement.

```
new ──▶ dev ──▶ câbler le portefeuille (dig-sdk) ──▶ construire une dépense (chip35) ──▶ déployer ──▶ domaine personnalisé
 gratuit  gratuit          gratuit                       gratuit            prix de capsule    gratuit
```

## Ce dont vous aurez besoin {#what-youll-need}

- La [CLI `dig-store`](../digstore/cli/install.md) installée.
- Node 18+ et `npm`.
- Un portefeuille Chia financé — **seulement à l'étape de déploiement** (le prix uniforme de capsule en $DIG + de petits frais XCH). Tout ce qui précède est gratuit.

---

## 1. Échafauder une application React — gratuit, sans chaîne {#1-scaffold-a-react-app--free-no-chain}

`digs new` écrit un projet exécutable et câblé avec un portefeuille. Choisissez le modèle React :

```sh
digs new vite-react my-dapp
cd my-dapp
```

Vous obtenez une application Vite + React, un `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`), et un `App.jsx` déjà câblé au portefeuille intégré. Aucun store n'est minté et rien n'est dépensé — `new` est purement local.

:::tip Vous préférez npm ? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` échafaude le même modèle directement depuis npm — la porte d'entrée JS, pas besoin d'installer `dig-store` pour commencer. Voir [Échafauder une application](./scaffold.md) pour les cinq modèles et comment les deux portes d'entrée se comparent.
:::

## 2. Développer contre le vrai chemin de lecture — gratuit {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev` exécute votre build, sert le résultat via le **véritable chemin de lecture `chia://`** (compiler → vérifier → déchiffrer), et injecte un **shim de développement `window.chia`** pour que vous puissiez construire le flux de portefeuille sans vrai portefeuille. Modifiez `src/App.jsx`, sauvegardez, et la page se recharge à chaud — exactement ce que les visiteurs obtiendront, avec zéro interaction avec la chaîne et zéro dépense.

## 3. Câbler le portefeuille avec le SDK — `window.chia` + repli WalletConnect {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

Le squelette parle directement à `window.chia`, ce qui est parfait à l'intérieur du [DIG Browser](../browser/using-window-chia.md). Pour aussi supporter les utilisateurs sur d'autres navigateurs, ajoutez le SDK — il **préfère le portefeuille `window.chia` injecté et se replie sur WalletConnect → Sage** derrière une surface normalisée unique, afin que vous écriviez le flux de portefeuille une seule fois.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # optionnel : uniquement pour le repli WalletConnect
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" préfère le portefeuille DIG Browser injecté, sinon WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // une valeur PUBLIQUE au moment du build
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // affiche un QR
      },
    });
    setAddress(await provider.getAddress());
  }

  return (
    <main>
      <h1>My DIG dapp</h1>
      <button onClick={login}>Connect wallet</button>
      {address && <p>Connected: {address}</p>}
    </main>
  );
}
```

Un seul `connect()` fonctionne dans le DIG Browser (pas de QR, pas de relais) et partout ailleurs (WalletConnect). `provider.backend` vous indique quel transport s'est connecté. Les noms de méthodes et les formes de résultat sont identiques dans les deux cas — voir [Utiliser `window.chia`](../browser/using-window-chia.md) pour le guide d'intégration, ou [la spécification normative du fournisseur `window.chia`](../protocol/window-chia-provider.md) pour le contrat exact des méthodes/paramètres/retours/erreurs.

:::note L'id de projet WalletConnect est une valeur PUBLIQUE au moment du build
`VITE_WC_PROJECT_ID` est compilé dans votre bundle et est lisible par tous — c'est correct pour un id cloud WalletConnect. **Ne mettez jamais** une seed de portefeuille, une clé de déploiement, ou un quelconque secret dans le bundle : une capsule est un [artefact statique aveugle sans secrets serveur](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Construire et signer une dépense — le wasm chip35, via le SDK {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Quand votre dapp doit faire quelque chose on-chain (minter un store, mettre à jour des métadonnées, construire un paiement CAT), elle construit la dépense avec le **constructeur de dépense CHIP-0035 canonique** et la remet au portefeuille pour signature. Le SDK réexporte ce constructeur au sous-chemin `/spend` — vous ne faites **jamais un paquet de dépense à la main**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // le constructeur wasm chip35

async function doSpend() {
  spend.init();

  // Construisez des dépenses de coin avec le constructeur wasm, ex. spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). Le constructeur est
  // hors ligne et pur — pas de clés, pas de réseau.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Remettez-les au portefeuille pour signature (le portefeuille détient les clés, pas votre dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → combinez en un paquet de dépense et diffusez.
}
```

C'est exactement le modèle que le hub utilise : **construire le paquet dans le navigateur avec le wasm, le signer avec le portefeuille.** Le constructeur de dépense est la source canonique unique de paquets de dépense dans tout l'écosystème, donc votre dapp produit des dépenses identiques à l'octet près à celles du hub et de la CLI.

Pour **lire** du contenu vérifié et chiffré en retour (par ex. afficher les données d'un autre store dans votre dapp), utilisez le `DigClient` du SDK :

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // par défaut https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // l'ancre de confiance, lue depuis la chaîne
});
```

`DigClient` dérive les clés de l'URN dans le navigateur, vérifie l'inclusion contre la racine on-chain, et déchiffre — l'hébergeur de service reste aveugle. Voir [Qu'est-ce que le dig RPC ?](../rpc/what-is-the-dig-rpc.md).

:::tip Facturer l'accès ? Utilisez `Paywall`
Pour monétiser — paiement pour déverrouiller du contenu, ou le contrôler par possession d'un NFT — le SDK propose un assistant haut niveau **`Paywall`** qui compose un `ChiaProvider` connecté avec le constructeur de dépense pour que vous n'ayez pas à câbler les paiements à la main : `paywall.requestPayment({ amount, owner })` paie le propriétaire de la dapp et retourne un reçu, et `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` contrôlent l'accès.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* déverrouiller le contenu */ }
```
:::

## 5. Déployer on-chain {#5-deploy-on-chain}

Vous construisez et prévisualisez gratuitement ; c'est la seule étape qui dépense. Créez d'abord le store **une fois** :

```sh
digs init my-dapp --dir dist      # mint la première capsule du store (prix uniforme de capsule + frais XCH)
```

`init` mint un singleton Chia sur le mainnet — **l'id du launcher devient l'id de votre store**. Copiez-le dans `dig.toml` (`store-id = "<64-hex>"`). À partir de là, une seule commande construit et publie une nouvelle capsule :

```sh
digs deploy --json                # exécute build-command, met dist/ en scène, fait avancer la racine
```

Chaque `deploy` publie une nouvelle capsule immuable pour le prix uniforme de capsule. Dès qu'elle est confirmée, votre dapp est **lisible via le [dig RPC](../rpc/what-is-the-dig-rpc.md)** par son adresse [URN](../concepts.md#urn) / `chia://` — chiffrée, vérifiée, et impossible à faire tomber, sans inscription et sans rien payer de plus. (Une adresse web conviviale `*.on.dig.net` est une étape séparée et optionnelle — voir [la section suivante](#6-put-it-on-your-own-domain).) Pour le push-to-deploy à chaque commit, configurez [Déployer depuis GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## 6. Mettez-le sur votre propre domaine {#6-put-it-on-your-own-domain}

Votre store est déjà accessible via son adresse URN / `chia://` — mais pour une URL web conviviale, vous enregistrez un nom. Un store obtient un sous-domaine `*.on.dig.net` quand vous **enregistrez un handle** pour lui dans DIGHUb : un enregistrement payant séparé qui épingle le store à ce nom (pas d'enregistrement → pas d'adresse `*.on.dig.net`). Pour le servir depuis un domaine que vous possédez à la place, ajoutez un **domaine personnalisé avec TLS dans [DIGHUb ↗](https://hub.dig.net)** — pointez votre domaine vers le store et DIGHUb gère le certificat. Dans les deux cas, votre dapp se charge depuis une URL conviviale tout en restant entièrement décentralisée en dessous.

Quand les handles `.dig` CHIP-54 arriveront, un store sera aussi adressable par un nom `.dig` lisible par un humain ; en attendant, les domaines personnalisés via DIGHUb sont le moyen de marquer un déploiement.

---

## Vous avez expédié une dapp {#you-shipped-a-dapp}

Vous êtes passé d'un dossier vide à une application React consciente du portefeuille, en direct sur le mainnet Chia sur votre propre domaine — en touchant chaque primitive : [l'échafaudage](../digstore/cli/quickstart.md), le [portefeuille intégré](../browser/using-window-chia.md), le [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), le [constructeur de dépense](https://github.com/DIG-Network/chip35_dl_coin), le [chemin de lecture](../rpc/what-is-the-dig-rpc.md), et le [déploiement](../digstore/cli/deploy-from-github-actions.md). Clonez une version terminée depuis la [galerie d'exemples](./example-gallery.md).

## Voir aussi {#related}

- [Échafauder une application (create-dig-app)](./scaffold.md) — les cinq modèles et les portes d'entrée npm vs CLI
- [Galerie d'exemples](./example-gallery.md) — clonez une dapp terminée et ouvrez-la dans un modèle
- [Utiliser window.chia](../browser/using-window-chia.md) — le fournisseur de portefeuille intégré en détail
- [La spécification du fournisseur window.chia](../protocol/window-chia-provider.md) — le contrat de fournisseur normatif et versionné
- [Configuration de projet et valeurs de build](../digstore/cli/configuration.md) — dig.toml + configuration PUBLIQUE
- [Déployer depuis GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-deploy en CI
- [Qu'est-ce que le dig RPC ?](../rpc/what-is-the-dig-rpc.md) — lire du contenu vérifié et chiffré
- [Démarrage rapide](../quickstart.md) — le parcours plus court « expédier un site »
- [Concepts et glossaire](../concepts.md) — capsule, store, URN, et window.chia définis
