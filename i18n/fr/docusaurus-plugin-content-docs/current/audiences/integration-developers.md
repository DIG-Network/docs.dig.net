---
sidebar_position: 3
title: For integration developers
description: "Une plateforme entièrement lisible par machine — OpenAPI/OpenRPC, une taxonomie d'erreurs cataloguée, une tarification en direct, JWKS, du JSON par page, et un @dignetwork/dig-sdk typé — pour câbler un portefeuille + des lectures vérifiées dans votre application sans avoir à extraire la moindre ligne de prose humaine."
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# Pour les développeurs d'intégration {#for-integration-developers}

> **Une plateforme entièrement lisible par machine** — OpenAPI/OpenRPC, une taxonomie d'erreurs cataloguée, une tarification en direct, JWKS, du JSON par page, et un `@dignetwork/dig-sdk` typé — pour câbler un portefeuille + des lectures vérifiées dans votre application **sans avoir à extraire la moindre ligne de prose humaine**.

## Le modèle mental — deux surfaces, gardées séparées {#the-mental-model--two-surfaces-kept-separate}

1. **Un plan de contrôle REST** — `hub.dig.net/v1`, bearer-JWT — pour gérer les stores, domaines, équipes, et NFT.
2. **Un chemin de LECTURE JSON-RPC 2.0 dig agnostique du nœud** — `rpc.dig.net` — qui diffuse du **texte chiffré vérifié**.

Une surface de **portefeuille** ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) sur deux transports — injecté (DIG Browser) ou WalletConnect → Sage — unifiée par le `ChiaProvider` du SDK. Les dépenses sont toujours construites par le wasm CHIP-0035 canonique et signées par le portefeuille de l'utilisateur — **jamais faites main**. Aiguillez sur des **codes d'erreur stables**, jamais sur la prose.

## Construire une dapp — de bout en bout {#build-a-dapp--end-to-end}

Le fil unique de l'échafaudage à une application consciente du portefeuille, en direct sur votre propre domaine.

→ [Construire une dapp sur Chia](../build-a-dapp/tutorial.md)

## Le DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, et les dépenses canoniques réexportées au sous-chemin `/spend`. Installation, sous-chemins, et `capabilities()`.

→ [Le DIG SDK](../sdk.md)

## Connecter un portefeuille — `window.chia` {#connect-a-wallet--windowchia}

Détectez le fournisseur injecté, appelez `connect()` (consentement par origine), et utilisez les méthodes CHIP-0002.

→ [Utiliser window.chia](../browser/using-window-chia.md) · spécification : [le fournisseur window.chia](../protocol/window-chia-provider.md)

## Lire du contenu vérifié — `DigClient` + les méthodes du dig RPC {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` diffuse du texte chiffré + des preuves d'inclusion et **vérifie-puis-déchiffre** côté client. Appelez les méthodes directement quand vous en avez besoin.

→ [Qu'est-ce que le dig RPC ?](../rpc/what-is-the-dig-rpc.md) · [Méthodes](../rpc/methods.md)

## Streaming et réassemblage {#streaming--reassembly}

Le modèle de blocs, la [retrieval key](../concepts.md#retrieval-key), et l'ordre vérifier-puis-déchiffrer.

→ [Streaming](../rpc/streaming.md)

## Construire des dépenses — le constructeur CHIP-0035 canonique {#building-spends--the-canonical-chip-0035-builder}

La division **construire → signer → diffuser** : le wasm construit le paquet de dépense, le portefeuille signe, vous diffusez. Le hub ne fait jamais de dépense à la main, et vous non plus.

→ [Construire des dépenses](../spends.md)

## Le plan de contrôle `/v1` du hub {#the-hub-v1-control-plane}

Authentification (JWT / OIDC / appairage d'appareil), stores, domaines, analyses, et webhooks via REST.

→ [Surfaces lisibles par machine](../machine-surfaces.md#openapi) pour le document OpenAPI.

## Déploiement CI — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Modes, OIDC sans clé, l'énumération de résultats, et la sortie `--json` pour les étapes suivantes.

→ [Déployer depuis GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Surfaces lisibles par machine {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — découvrez et intégrez sans extraire de prose.

→ [Surfaces lisibles par machine](../machine-surfaces.md)

## Codes d'erreur — aiguillez sur le code {#error-codes--branch-on-the-code}

Une référence consolidée à travers le dig RPC, la CLI, DIGHUb, le chargeur dig, et le SDK.

→ [Codes d'erreur](../support/error-codes.md)

---

## Aller plus loin : le protocole {#go-deeper-the-protocol}

- **« lectures vérifiées »** → [Le dig RPC (interface de contenu du réseau)](../rpc/what-is-the-dig-rpc.md) · [Preuves d'inclusion vs d'exécution](../inclusion-vs-execution-proofs.md)
- **« window.chia »** → [la spécification normative du fournisseur](../protocol/window-chia-provider.md)
- **« retrieval_key et streaming »** → [URN et chiffrement](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **« un jeton de déploiement est une clé d'écriture révocable »** → [Dépenses et délégation CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Tout** → [Plongée en profondeur dans le protocole](../protocol-deep-dive.md) · [Concepts et glossaire](../concepts.md)
