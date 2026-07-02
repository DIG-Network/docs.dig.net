---
sidebar_position: 5
title: For content consumers
description: "Öffnen Sie chia://-Inhalte, die Ihr eigener Browser gegen die Blockchain verifiziert — kein Host kann sie verändern oder fälschen, private Inhalte bleiben vor dem Host privat, und sie sind dauerhaft und überall neu hostbar, sodass niemand sie entfernen oder Sie einsperren kann."
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# For content consumers {#for-content-consumers}

> **Öffnen Sie `chia://`-Inhalte, die Ihr EIGENER Browser gegen die Blockchain verifiziert** — kein Host kann sie verändern oder fälschen, private Inhalte bleiben vor dem Host privat, und sie sind dauerhaft und überall neu hostbar, sodass niemand sie entfernen oder Sie einsperren kann.

## Das mentale Modell {#the-mental-model}

Fügen Sie einen `chia://`-Link ein, und der Inhalt kommt direkt aus dem Netzwerk — **content-adressiert** und **kryptografisch auf IHREM Gerät verifiziert**, bevor er angezeigt wird. Es ist **fail-closed**: manipulierte oder nicht entschlüsselbare Bytes werden niemals angezeigt.

- **`rootHash` weglassen** für die *neueste* Version des stores: `chia://<storeId>/`.
- **Einschließen**, um genau eine unveränderliche [capsule](../concepts.md#capsule) zu fixieren: `chia://<storeId>:<rootHash>/`.

Öffentliche Inhalte benötigen nur den Link. Private Inhalte benötigen zusätzlich ein geheimes **`?salt=`** — wie ein Passwort.

## Den DIG Browser oder die Extension holen {#get-the-dig-browser-or-the-extension}

- **[DIG Browser holen ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — ein Browser mit fest eingebautem `chia://` und integriertem Wallet.
- **Die Extension** für Chrome / Edge / Brave / Firefox — fügt einem Browser, den Sie bereits nutzen, die `chia://`-Auflösung hinzu.

## `chia://`-Inhalte öffnen — neueste vs. fixierte Version {#open-chia-content--latest-vs-pinned}

Die Adressformen, die übersichtliche `chia://<store>/`-Leiste, und wann Sie einen `rootHash` fixieren sollten.

→ [Das chia://-Protokoll](../browser/chia-protocol.md)

## Integrierte Seiten, das Verifiziert-Badge & Shields {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, und das Verifiziert-Badge / die Shields, die das Inclusion-Proof-Ergebnis jeder Ressource für die aktive capsule anzeigen.

→ [window.chia verwenden](../browser/using-window-chia.md)

## Öffentlich vs. privat — wann Sie ein `?salt=`-Geheimnis brauchen {#public-vs-private--when-you-need-a-salt-secret}

Öffentliche stores öffnen sich mit nur dem Link; private stores erfordern das geheime Salt, aus dem der Entschlüsselungsschlüssel abgeleitet wird.

→ [Öffentliche vs. private stores](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Öffentlich vs. privat — was ist der Unterschied?](../support/faq.md#public-vs-private)

## Inhalte lokal ausführen (optional) {#run-content-locally-optional}

Richten Sie Ihren Browser/Ihre Extension auf einen lokalen [dig-node](../concepts.md#dig-node) für schnellere, offline-freundliche Reads — sie teilen sich einen `.dig`-Cache. Sie brauchen niemals einen Node, um zu lesen.

→ [Einen Node betreiben](../run-a-node/index.md)

## $DIG erhalten {#get-dig}

Sie brauchen kein $DIG, um Inhalte zu *lesen*. Wenn Sie veröffentlichen möchten, erhalten Sie $DIG auf **TibetSwap**, **dexie.space** oder **9mm.pro**.

→ [Wo bekomme ich DIG?](../support/faq.md#where-do-i-get-dig)

---

## Tiefer eintauchen: das Protokoll {#go-deeper-the-protocol}

- **„gegen die Blockchain verifiziert"** → [On-Chain-Verankerung](../digstore/cli/onchain-anchoring.md) · [Proofs & Sicherheit](../digstore/format/proofs-and-security.md)
- **„öffentliches vs. privates Salt"** → [URNs & Verschlüsselung](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **„neueste vs. fixierte Version"** → [Generationen & Root-Hashes](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Alles** → [Protokoll-Deep-Dive](../protocol-deep-dive.md) · [Konzepte & Glossar](../concepts.md)
