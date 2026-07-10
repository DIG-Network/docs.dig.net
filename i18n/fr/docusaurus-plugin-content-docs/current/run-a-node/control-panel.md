---
sidebar_position: 8
title: Le panneau de contrôle de dig-node
description: "Gérez votre dig-node local depuis le panneau de contrôle de la DIG Chrome extension : espace de cache .dig réservé et éviction LRU, source amont, dépôts hébergés, synchronisation, pairs, statut en direct, et l'appairage du jeton de contrôle."
keywords:
  - panneau de contrôle dig-node
  - cache dig
  - éviction LRU
  - espace de cache réservé
  - appairage du jeton de contrôle
  - dépôts hébergés
  - synchronisation du nœud
  - pairs du nœud
tags:
  - dig-node
  - browser
  - dig-rpc
---

# Le panneau de contrôle de dig-node

La DIG Chrome extension embarque un **panneau de contrôle** pour votre dig-node local. Il permet de voir le statut en direct du nœud, de décider combien d'espace disque réserver au contenu mis en cache et — après une étape d'appairage à faire une seule fois — de gérer la source amont du nœud, les dépôts qu'il héberge, sa synchronisation et ses pairs. Aucune ligne de commande n'est nécessaire au quotidien.

Le panneau de contrôle est l'équivalent, intégré à l'extension, de l'écran de gestion de nœud de DIG Browser : il dialogue avec le nœud qui tourne sur votre propre machine, donc tout reste local.

## L'ouvrir

1. Ouvrez l'extension.
2. Allez dans l'onglet **Network** (Réseau) et choisissez **Control** (Contrôle). (Le popup compact n'affiche qu'un résumé ; utilisez **Ouvrir le panneau de contrôle** pour voir chaque section en plein écran.)

Le panneau détecte automatiquement le nœud :

- **Nœud en cours d'exécution** → vous voyez la vue de gestion.
- **Aucun nœud trouvé** → vous voyez une courte page expliquant comment en installer un. La navigation continue de fonctionner normalement — les lectures de contenu basculent alors sur le réseau public ; un nœud n'est nécessaire que pour la vue de gestion ci-dessous.

## Statut en direct

En haut, un indicateur en direct montre si votre nœud est **Connecté**, **En connexion** ou **Déconnecté**, avec son adresse et sa version. Il se met à jour tout seul — démarrez ou arrêtez le nœud, et l'indicateur bascule en quelques secondes, sans avoir besoin de rouvrir le panneau ni de rafraîchir la page.

## Réserver de l'espace disque pour le contenu mis en cache (cache et LRU)

Votre nœud conserve un cache local du contenu qu'il a récupéré, afin que les visites répétées soient instantanées et que vous aidiez à servir ce contenu. Le cache a une **taille réservée** — un plafond sur la quantité de disque qu'il peut utiliser. Quand le cache dépasse ce plafond, le nœud supprime automatiquement en premier les éléments **les moins récemment utilisés** (une politique « LRU »), de sorte que l'espace que vous réservez n'est jamais dépassé et que le contenu que vous utilisez réellement reste en cache.

Cette section est disponible immédiatement — elle ne nécessite aucun appairage.

**Voir l'espace utilisé.** Une barre montre l'espace utilisé par rapport au plafond réservé, ainsi que quelques chiffres en direct : combien d'éléments sont en cache, leur taille totale, ce qui a été évincé depuis le démarrage du nœud, et le nombre de succès/échecs de cache.

**Définir le plafond réservé.** Saisissez une nouvelle taille et appliquez-la. Le minimum est **64 MiB** ; une valeur plus petite est relevée à ce plancher. Abaisser le plafond en dessous de l'utilisation actuelle déclenche l'éviction des éléments les plus anciens jusqu'à ce que l'utilisation rentre dans la limite.

**Consulter et retirer des éléments du cache.** La liste des éléments en cache affiche, pour chacun, sa taille, la dernière fois qu'il a été utilisé et son **ordre d'éviction** (la position `0` est le prochain élément qui serait retiré). Vous pouvez :

- **Évincer un élément** — retirer immédiatement un seul élément du cache.
- **Tout effacer** — vider entièrement le cache.

Retirer des éléments ne fait que libérer du disque local ; tout ce que vous revisitez est simplement récupéré à nouveau.

:::tip
Donnez au cache autant d'espace que possible sur une machine que vous utilisez souvent pour naviguer — une réserve plus grande signifie moins de nouvelles récupérations et davantage de contenu servi localement. Sur une machine à l'espace limité, définissez une réserve plus petite ; le LRU conserve les éléments les plus utiles et écarte le reste.
:::

## Gérer le nœud (appairage requis)

Les sections restantes modifient la configuration du nœud et nécessitent donc votre autorisation explicite. Comme l'extension s'exécute dans le bac à sable du navigateur, elle ne peut pas lire directement le fichier de permissions local du nœud — vous devez à la place l'**appairer** une fois. L'appairage accorde à l'extension ses propres identifiants, à portée limitée et révocables ; il n'expose jamais la clé maîtresse du nœud, et il ne peut être approuvé que depuis l'ordinateur qui fait tourner le nœud.

### Appairer l'extension avec votre nœud

1. Dans le panneau de contrôle, choisissez **Appairer**. L'extension affiche un **code à 6 chiffres** et un identifiant d'appairage.
2. Sur l'ordinateur qui fait tourner le nœud, dans un terminal, exécutez `dig-node pair` pour lister les demandes en attente (ou directement `dig-node pair approve <pairing-id>`).
3. Vérifiez que le code affiché dans le terminal **correspond** à celui de l'extension, puis approuvez. Cette correspondance est votre garde-fou : elle garantit que vous approuvez *cette* extension précise, et aucune autre.
4. Le panneau de contrôle bascule automatiquement à l'état appairé. Les identifiants ne sont stockés que par l'extension.

Le code d'appairage **expire après quelques minutes** ; si le vôtre expire avant que vous ne l'approuviez, choisissez de nouveau **Appairer** pour en obtenir un nouveau.

Pour cesser d'utiliser ces identifiants, choisissez **Dissocier** dans le panneau (cela les oublie localement). Pour les révoquer sur le nœud lui-même, exécutez `dig-node pair revoke <token-id>` sur cet ordinateur — le panneau revient à l'état non appairé lors de sa prochaine action.

:::note
L'appairage n'est nécessaire que pour les sections de gestion ci-dessous. Le statut en direct et les contrôles cache/LRU ci-dessus fonctionnent sans lui.
:::

### Source amont

Consultez la source amont depuis laquelle le nœud récupère le contenu, et définissez-en une autre. Une source amont modifiée prend effet au prochain démarrage du nœud.

### Dépôts hébergés

Consultez les dépôts que votre nœud détient et épingle, épinglez un nouveau dépôt (pour que le nœud le conserve et le serve), désépinglez-en un, et vérifiez le statut de n'importe quel dépôt. Épingler une version précise la récupère à l'avance pour qu'elle soit prête à être servie.

### Synchronisation

Vérifiez si la synchronisation complète et authentifiée d'un dépôt est disponible et, pour une version précise, déclenchez une synchronisation pour que le nœud la récupère et la mette en cache.

### Pairs

Consultez le statut du réseau de pairs de votre nœud — sa connexion au relais pour être joignable derrière un routeur domestique, et les pairs auxquels il est connecté.

## Voir aussi

- [Gérer votre nœud](./manage.md) — les actions d'administration `control.*` et comment le navigateur les pilote
- [Diriger un client vers votre nœud](./point-a-consumer.md) — configurer l'extension, le navigateur ou la CLI pour utiliser votre nœud
- [Configurer dig-node](./configure.md) — ports, plafond de cache et source amont
