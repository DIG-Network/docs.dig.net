---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "Chaque échec vous donne un code stable et un request-id qui renvoie directement au journal du serveur, les dépenses on-chain sont protégées contre les courses pour que vous ne payiez jamais deux fois, et des garde-fous de pré-vérification clairs évitent de gaspiller des capsules avant de dépenser du $DIG."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Dépannage {#troubleshooting}

> Chaque échec vous donne un **code stable** et un **request-id** qui renvoie directement au journal du serveur, les dépenses on-chain sont **protégées contre les courses** pour que vous ne payiez jamais deux fois, et des **garde-fous de pré-vérification** clairs évitent de gaspiller des capsules avant de dépenser du $DIG.

## Le modèle mental — retrouvez votre échec par son code {#the-mental-model--find-your-failure-by-its-code}

Chaque surface — le dig RPC, la CLI digstore, DIGHUb, le chargeur `chia://`, le SDK — associe un échec à un **code STABLE**. **Aiguillez sur le code, jamais sur le message.** Un catalogue consolidé unique les couvre tous et est aussi publié de façon lisible par machine.

Les garde-fous de pré-vérification (`digstore doctor`, `--dry-run`, `--if-changed`) et les ancrages reprenables signifient qu'une publication bloquée ou sans effet **ne dépense jamais silencieusement**.

## Échecs de publication courants {#common-publishing-failures}

Fonds insuffisants, un délai de confirmation dépassé (reprenable — votre dépense n'est pas perdue), et la « racine distante a avancé » en non-fast-forward.

→ [Dépannage](../support/troubleshooting.md)

## Échecs de lecture et de vérification {#read--verify-failures}

Incompatibilité de preuve, erreurs de déchiffrement/sel, et réponses introuvable / decoy.

→ [Échecs de lecture et de vérification](../support/troubleshooting.md#verification-failed)

## Problèmes de portefeuille et de session {#wallet--session-issues}

Connexion, ré-authentification, une requête refusée, et les sessions en lecture seule qui ne peuvent pas signer.

→ [La session du portefeuille ne peut pas signer](../support/troubleshooting.md#wallet-session)

## Vérifications de pré-vérification et de coût — ne gaspillez pas une capsule {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (environnement + préparation), `--dry-run` (prévisualiser le coût et la capsule potentielle), et `--if-changed` (un build identique à l'octet près est un no-op).

→ [Déployer depuis GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [Ancrage on-chain → coût et sécurité](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Référence des codes d'erreur {#error-codes-reference}

Codes de sortie CLI · RPC `-32xxx` · DIGHUb · dig-loader · SDK — un tableau consolidé unique.

→ [Codes d'erreur](../support/error-codes.md)

## FAQ {#faq}

Coût, l'essai gratuit, pourquoi le prix est uniforme, où obtenir du $DIG, et « y a-t-il un testnet ? ».

→ [FAQ](../support/faq.md)

## Obtenir de l'aide {#get-help}

Discord + GitHub, et comment déposer un bon rapport — **ne collez jamais de secrets**.

→ [Obtenir de l'aide](../support/get-help.md)

## Statut et journal des modifications {#status--changelog}

→ [Statut](../support/status.md) · [Journal des modifications](../support/changelog.md)

---

## Aller plus loin : le protocole {#go-deeper-the-protocol}

- **échecs de lecture et de vérification** → [Preuves et sécurité](../digstore/format/proofs-and-security.md) · [URN et chiffrement](../digstore/format/urns-and-encryption.md)
- **codes RPC `-32xxx`** → [les méthodes du dig RPC](../rpc/methods.md) · [Conformité](../rpc/conformance.md)
- **Tout** → [Plongée en profondeur dans le protocole](../protocol-deep-dive.md) · [Concepts et glossaire](../concepts.md)
