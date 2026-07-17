---
sidebar_position: 1
slug: /
title: DIG Network
description: "Überblick über die Primitive des DIG Network: dig-store für inhaltsadressierte Veröffentlichung, dig RPC für blindes Hosting und Abruf, und der DIG Browser für den Inhaltszugriff."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - dig-store
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network ist ein Proof-of-Stake Layer 2 auf Chia** — ein dezentrales Netzwerk zum Veröffentlichen, Adressieren und Ausliefern von Inhalten, ohne dem Host vertrauen zu müssen.

Diese Dokumentation behandelt das Netzwerk und seine **Primitive**: die zusammensetzbaren Bausteine, mit denen Entwickler auf DIG aufbauen. Das Netzwerk wächst weiter, und im Laufe der Zeit werden hier weitere Primitive dokumentiert.

:::info $DIG treibt das Netzwerk an
**$DIG ist der Motor und die Ökonomie von DIG Network.** Jeder Werttausch — das Veröffentlichen eines capsule, der Besitz eines store, das Trinkgeld an einen Creator — fließt durch $DIG. Inhalte zu konsumieren bleibt mühelos und kostenlos: Du zahlst nie fürs Lesen, sondern nur fürs Veröffentlichen und Besitzen.
:::

## Die capsule {#the-capsule}

Ein Konzept zieht sich durch jedes Primitiv. Eine **capsule** ist eine einzelne unveränderliche store-Generation — das Paar `(storeId, rootHash)`, kanonisch geschrieben als `storeId:rootHash`. Ein **store ist eine Sequenz von capsules**, eine pro Commit (jeder Commit bringt den on-chain-Root voran und erzeugt eine neue capsule).

Die capsule ist die Einheit des Netzwerks für:

- **Kompilierung** — jede capsule wird zu einem WASM-Modul fester Größe kompiliert (mit Padding, sodass die Länge nichts über die Inhaltsgröße verrät).
- **Preisgestaltung** — ein **einheitlicher Preis pro capsule** (Mint oder Commit), bezahlt in $DIG zum aktuellen Kurs; die Lebenszeitkosten eines stores sind der einheitliche Preis pro capsule × Anzahl der capsules.
- **Abruf** — eine URN benennt eine capsule (plus optional eine Ressource darin).
- **Caching** — ein Host oder Browser cacht eine capsule unter dem Schlüssel `storeId:rootHash`; der lokale Cache ist eine Menge von capsules.
- **Herkunftsnachweis** — der Root jeder capsule trägt die BLS-Signatur des Publishers und einen Merkle-Root.

Dies ist die ökosystemweite Definition: "capsule = `(storeId, rootHash)`" bedeutet dasselbe in dig-store, dem dig RPC und dem DIG Browser.

:::tip Ausprobieren
[**Erstelle deine erste capsule in DIGHUb ↗**](https://hub.dig.net/new) — veröffentliche eine Website im Browser, kein CLI erforderlich. Jede capsule (Mint oder Commit) kostet den **einheitlichen capsule-Preis in $DIG**.
:::

## Primitive {#primitives}

### 🗄️ dig-store {#️-digstore}

Das erste und grundlegendste Primitiv: ein **inhaltsadressiertes, verschlüsseltes WASM-Projektformat**. Du zeigst auf ein Build-Verzeichnis, committest Deployments wie bei Git und erhältst eine einzelne selbstschützende `.wasm`-Datei, die sowohl deine Daten als auch der Server ist, der den Zugriff darauf regelt. Die URN *ist* der Schlüssel — sie lokalisiert und entschlüsselt zugleich.

→ **[dig-store erkunden](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[Was ist dig-store?](./digstore/what-is-digstore.md)** | Die Ein-Datei-Idee, kurz und knapp |
| **[Das Format](./digstore/format/overview.md)** | Projekte, Deployments, URNs, Verschlüsselung, Proofs |
| **[CLI-Tutorial](./digstore/cli/quickstart.md)** | `dig-store` installieren und in deinem Projekt verwenden |

### 🛰️ dig RPC {#️-dig-rpc}

Das Netzwerk-Primitiv: eine **Standardschnittstelle zum Lesen von Inhalten aus gehosteten dig-store-Deployments**. JSON-RPC 2.0 über HTTPS `POST` — jeder Hosting-Node spricht es identisch, sodass Inhalte portabel und Clients node-agnostisch sind. Es liefert Chiffretext + Inclusion-Proofs per Retrieval-Key, ganze Deployments per `(store_id, root)` und das öffentliche Discovery-Manifest — in Chunks gestreamt, durch Konstruktion blind, vollständig clientseitig verifiziert und entschlüsselt.

→ **[Den dig RPC erkunden](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[Was ist der dig RPC?](./rpc/what-is-the-dig-rpc.md)** | Ein Endpunkt für den gesamten Lesepfad des Netzwerks |
| **[Methoden](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | Das Chunk-Modell, Reassemblierung und Proof-Verifizierung |
| **[Konformität & Sicherheit](./rpc/conformance.md)** | Das blinde Modell, CORS und was ein Node implementieren muss |

### 🌐 DIG Browser {#-dig-browser}

Das Client-Primitiv: ein **Browser mit integrierter Chia-Wallet**. Er injiziert auf jeder Seite einen `window.chia`-Provider, sodass jede Web-App die Adresse, Signaturen und Spends des Nutzers anfordern kann — ganz ohne WalletConnect-Setup — eine Drop-in-Alternative für Apps, die bereits CHIP-0002 sprechen. Außerdem löst er `chia://`-Inhaltsadressen direkt auf.

→ **[Gegen den DIG Browser entwickeln](./browser/using-window-chia.md)**

| | |
|---|---|
| **[`window.chia` in deiner App verwenden](./browser/using-window-chia.md)** | Die injizierte Wallet erkennen, verbinden und CHIP-0002-Methoden aufrufen |

:::tip Ausprobieren
[**DIG Browser holen ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — lade den Browser herunter, um `chia://`-Inhalte zu öffnen und die integrierte Wallet zu nutzen.
:::

*Weitere Primitive — Settlement und Node-Betrieb — erhalten eigene Abschnitte, sobald sie fertig sind.*

## Wähle deinen Weg {#pick-your-path}

Die Dokumentation ist danach organisiert, **was du gerade tust**. Jeder Track beginnt mit einem Zehn-Sekunden-"Warum", dem mentalen Modell, das du brauchst, und den wichtigsten How-Tos — und verlinkt dann ins Protokoll, wenn du tiefer einsteigen willst.

- **[Eine Website oder App veröffentlichen, die dir gehört](./audiences/app-developers.md)** — verschicke eine Website/App als dein eigenes on-chain-Asset; kostenlos bauen, eine capsule veröffentlichen.
- **[NFTs & Kollektionen minten](./audiences/nft-developers.md)** — CHIP-0007-Drops, abgesichert durch dauerhafte, manipulationssichere capsules.
- **[DIG in deine App integrieren](./audiences/integration-developers.md)** — ein typisiertes SDK + eine vollständig maschinenlesbare Plattform.
- **[Einen Node betreiben](./run-a-node/index.md)** — Inhalte nachweisbar und provider-blind ausliefern.
- **[chia://-Inhalte öffnen](./audiences/content-consumers.md)** — Inhalte lesen, die dein eigener Browser gegen die Chain verifiziert.
- **[Weiterkommen bei Problemen](./audiences/troubleshooting.md)** — finde deinen Fehler anhand seines stabilen Codes.

Neu im Vokabular? Überflieg [Konzepte & Glossar](./concepts.md). Willst du das vollständige Design? Lies den [Protocol Deep-Dive](./protocol-deep-dive.md).

:::note
DIG Network und seine Primitive sind Open Source. dig-store ist unter GPL-2.0 lizenziert; siehe das [dig-store-Repository](https://github.com/DIG-Network/dig-store).
:::

## Verwandte Themen {#related}

- [Quickstart](./quickstart.md) — verschicke deine erste Website; kostenlos zu bauen und zu previewen
- [Eine Dapp auf Chia bauen](./build-a-dapp/tutorial.md) — jedes Primitiv in einem durchgängigen Tutorial
- [Konzepte & Glossar](./concepts.md) — die zentralen DIG-Entitäten, definiert und verlinkt
- [Was ist dig-store?](./digstore/what-is-digstore.md) — das inhaltsadressierte store-Format
- [Was ist der dig RPC?](./rpc/what-is-the-dig-rpc.md) — die netzwerkweite Leseschnittstelle
- [Das chia://-Protokoll](./browser/chia-protocol.md) — Inhalte im DIG Browser öffnen
- [Hilfe erhalten](./support/get-help.md) — Community, Fehlerbehebung und Fehlercodes
