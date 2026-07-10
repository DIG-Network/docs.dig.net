---
sidebar_position: 1
title: Run a DIG node
description: "Was ein dig-node ist, warum du einen betreiben solltest und wie du ihn installierst — das apt-Repository für Ubuntu/Debian oder der plattformübergreifende Universal-Installer."
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

# Run a DIG node {#run-a-dig-node}

> **Content nachweisbar und anbieter-blind servieren** — du kommst nur je mit ununterscheidbarem, per Hash adressiertem Chiffretext in Berührung, kannst treues Serving mit Execution Proofs attestieren, und der Client verifiziert alles gegen die Chain, sodass Vertrauen nie auf deinem Node ruht.

Ein **dig-node** ist der Content-**Server** des DIG Network — die Angebotsseite des Netzwerks. Er hostet capsules, führt einen lokalen `.dig`-Cache und stellt die [dig RPC](../rpc/what-is-the-dig-rpc.md) bereit, sodass alles, was DIG-Content liest, es von ihm lesen kann. Er läuft headless (kein Browser, keine UI) als Hintergrunddienst — eine Seedbox für den Content, den du veröffentlichst oder mit servieren helfen möchtest.

Er ist das Gegenstück zu den **Konsumenten** — dem [DIG Browser](../browser/chia-protocol.md) und der Browser-Erweiterung — die Chiffretext + Proofs abrufen, gegen den On-Chain-Root verifizieren, lokal entschlüsseln und rendern. Du **brauchst keinen** dig-node, um DIG-Content zu lesen: Ein Konsument allein funktioniert einwandfrei und fällt auf den öffentlichen Referenz-Node unter `rpc.dig.net` zurück. Du betreibst einen dig-node, um zu **servieren** — und wenn einer auf derselben Maschine vorhanden ist, liest der Konsument von ihm (lokal, offline-freundlich und zum Netzwerk beitragend), und beide teilen sich einen `.dig`-Cache.

:::info Servieren vs. konsumieren
- **dig-node** = serviert Content + stellt die dig RPC bereit. Headless-Hintergrunddienst.
- **DIG Browser / Erweiterung** = konsumiert Content (verifiziert + entschlüsselt lokal). Kein lokaler Node erforderlich.

Wenn beide installiert sind, liest der Browser/die Erweiterung von deinem lokalen dig-node; andernfalls von `rpc.dig.net`. So oder so wird jedes Byte clientseitig gegen die Chain verifiziert — der Quelle wird nie vertraut.
:::

## Installieren {#install-it}

| Deine Maschine | Verwende |
|---|---|
| **Ubuntu / Debian** | Das native **[apt-Repository](./apt.md)** — `apt install dig-node digstore`, automatisch als systemd-Dienst aktiviert. |
| **Windows / macOS / Linux (beliebig)** | Der plattformübergreifende **[Universal-Installer](#universal-installer-any-os)** — ein `curl \| sh` (oder Download) für jedes Betriebssystem. |

Beide installieren denselben `dig-node`-Dienst plus die `digstore`-CLI. apt ist der Debian-native Pfad (signiert, per `apt upgrade` aktualisierbar); der Universal-Installer deckt alles andere ab.

### apt (Ubuntu / Debian) — empfohlen auf Debian-Familie-Systemen {#apt-ubuntu--debian--recommended-on-debian-family-systems}

Der native Pfad: ein signiertes apt-Repository unter `apt.dig.net`. Es installiert `dig-node` als verwalteten **systemd-Dienst** und hält ihn per `apt upgrade` aktuell.

→ **[Installation unter Ubuntu/Debian via apt](./apt.md)**

### Universal-Installer (jedes Betriebssystem) {#universal-installer-any-os}

Der plattformübergreifende Pfad — Windows, macOS und jedes Linux. Er erkennt dein Betriebssystem, installiert den `dig-node`-Dienst (Windows-Dienst / `systemd` / `launchd`) und die `digstore`-CLI, und benötigt keinen Paketmanager:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

Dies ist derselbe eigenständige `dig-installer`, der auf der [Releases-Seite](https://github.com/DIG-Network/dig-installer/releases) bereitgestellt wird — lade ihn herunter und führe ihn direkt aus, wenn du es vorziehst, nicht in eine Shell zu piped, oder unter Windows. Dabei öffnet sich auch ein geführter [GUI-Assistent](./universal-installer.md#gui-installer), falls du lieber klickst statt Flags zu verwenden.

:::note Pre-Release
Die gehosteten Installer (`apt.dig.net`, `dig.net/install.sh`) werden noch bereitgestellt. Bis sie live sind, baue aus dem Quellcode oder besorge dir eine Binärdatei von den [dig-node Releases](https://github.com/DIG-Network/dig-node/releases). Die hier gezeigten Befehle sind die echten, beabsichtigten.
:::

## Willst du nur Content lesen? {#just-want-to-read-content}

Du brauchst keinen Node. Hol dir den **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** und öffne eine beliebige `chia://`-Adresse — er konsumiert von deinem lokalen dig-node, falls vorhanden, sonst von `rpc.dig.net`. Siehe [Das `chia://`-Protokoll](../browser/chia-protocol.md).

## Verwandte Themen {#related}

- [Installation unter Ubuntu/Debian via apt](./apt.md) — der Debian-native Pfad + systemd-Dienstverwaltung
- [Überall installieren — der Universal-Installer](./universal-installer.md) — Windows / macOS / beliebiges Linux + `dig.local`
- [Einen Konsumenten auf deinen Node ausrichten](./point-a-consumer.md) — lokale Reads zuerst + der geteilte `.dig`-Cache
- [dig-node konfigurieren](./configure.md) — Ports, Listener, Cache-Obergrenze, Upstream
- [Einen Remote-Origin selbst hosten](../rpc/dig-remote.md) — `digstore serve` + dig://-Clone/Pull/Push
- [Deinen Node verwalten](./manage.md) — die control.*-Admin-RPCs + die My-Node-UI
- [Die öffentliche Netzwerk-RPC nutzen](../rpc/public-network-rpc.md) — die dig RPC, die dein Node spricht, und den Betrieb eines Node im Netzwerk
- [Die CLI installieren](../digstore/cli/install.md) — `digstore` für sich allein (Veröffentlichen, nicht Servieren)

## Tiefer einsteigen: das Protokoll {#go-deeper-the-protocol}

- **„blind host & decoys"** → [Das blinde Serving-Modell der dig RPC](../rpc/what-is-the-dig-rpc.md) · [Node-Konformität](../rpc/conformance.md)
- **„treues Serving attestieren"** → [Inclusion- vs. Execution-Proofs](../inclusion-vs-execution-proofs.md)
- **„dig://-Clone/Pull/Push"** → [Das §21/§22-Remote-Protokoll](../rpc/dig-remote.md)
- **Alles** → [Protokoll-Deep-Dive](../protocol-deep-dive.md) · [Konzepte & Glossar](../concepts.md)
