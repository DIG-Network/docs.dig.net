---
sidebar_position: 8
title: Das dig-node Bedienfeld
description: "Verwalte deinen lokalen dig-node über das Bedienfeld der DIG Chrome extension: reservierter .dig-Cache-Speicherplatz und LRU-Verdrängung, vorgelagerte Quelle, gehostete Stores, Synchronisierung, Peers, Live-Status und die Kopplung des Kontroll-Tokens."
keywords:
  - dig-node Bedienfeld
  - dig-Cache
  - LRU-Verdrängung
  - reservierter Cache-Speicherplatz
  - Kopplung des Kontroll-Tokens
  - gehostete Stores
  - Node-Synchronisierung
  - Node-Peers
tags:
  - dig-node
  - browser
  - dig-rpc
---

# Das dig-node Bedienfeld

Die DIG Chrome extension enthält ein **Bedienfeld** für deinen lokalen dig-node. Darin siehst du den Live-Status des Nodes, legst fest, wie viel Speicherplatz für zwischengespeicherte Inhalte reserviert werden soll, und verwaltest — nach einem einmaligen Kopplungsschritt — die vorgelagerte Quelle des Nodes, die von ihm gehosteten Stores, seine Synchronisierung und seine Peers. Für die alltägliche Nutzung ist keine Kommandozeile nötig.

Das Bedienfeld ist das in die Erweiterung eingebaute Gegenstück zum Node-Verwaltungsbildschirm des DIG Browser: Es spricht mit dem Node, der auf deinem eigenen Rechner läuft, sodass alles lokal bleibt.

## Öffnen

1. Öffne die Erweiterung.
2. Gehe zum Tab **Network** (Netzwerk) und wähle **Control** (Steuerung). (Das kompakte Popup zeigt nur eine Zusammenfassung; nutze **Bedienfeld öffnen**, um jeden Bereich im Vollbild zu sehen.)

Das Bedienfeld erkennt den Node automatisch:

- **Node läuft** → du siehst die Verwaltungsansicht.
- **Kein Node gefunden** → du siehst eine kurze Seite dazu, wie man einen installiert. Das Browsen funktioniert weiterhin normal — Inhaltszugriffe weichen dann auf das öffentliche Netzwerk aus; ein Node wird nur für die unten beschriebene Verwaltungsansicht benötigt.

## Live-Status

Oben zeigt eine Live-Anzeige, ob dein Node **Verbunden**, **Verbindet** oder **Getrennt** ist, zusammen mit seiner Adresse und Version. Sie aktualisiert sich von selbst — starte oder stoppe den Node, und die Anzeige wechselt binnen weniger Sekunden, ohne dass du das Bedienfeld neu öffnen oder die Seite neu laden musst.

## Speicherplatz für zwischengespeicherte Inhalte reservieren (Cache & LRU)

Dein Node hält einen lokalen Cache der von ihm abgerufenen Inhalte vor, sodass wiederholte Zugriffe sofort erfolgen und du mithilfst, diese Inhalte auszuliefern. Der Cache hat eine **reservierte Größe** — eine Obergrenze dafür, wie viel Speicherplatz er nutzen darf. Wächst der Cache über diese Grenze hinaus, entfernt der Node automatisch zuerst die **am längsten nicht genutzten** Einträge (eine „LRU"-Richtlinie), sodass der von dir reservierte Platz nie überschritten wird und die Inhalte, die du tatsächlich nutzt, im Cache bleiben.

Dieser Bereich ist sofort verfügbar — er erfordert keine Kopplung.

**Nutzung ansehen.** Ein Balken zeigt den genutzten Speicherplatz im Verhältnis zur reservierten Obergrenze, dazu einige Live-Werte: wie viele Einträge im Cache sind, ihre Gesamtgröße, wie viel seit dem Start des Nodes verdrängt wurde, sowie die Zahl der Cache-Treffer/-Fehlschläge.

**Reservierte Obergrenze festlegen.** Gib eine neue Größe ein und wende sie an. Das Minimum ist **64 MiB**; ein kleinerer Wert wird auf diese Untergrenze angehoben. Senkst du die Obergrenze unter die aktuelle Nutzung, löst das die Verdrängung der ältesten Einträge aus, bis die Nutzung wieder passt.

**Zwischengespeicherte Einträge ansehen und entfernen.** Die Liste der zwischengespeicherten Einträge zeigt zu jedem Eintrag seine Größe, wann er zuletzt genutzt wurde, und seine **Verdrängungsreihenfolge** (Position `0` ist der Eintrag, der als Nächstes entfernt würde). Du kannst:

- **Einen Eintrag verdrängen** — einen einzelnen zwischengespeicherten Eintrag sofort entfernen.
- **Alles leeren** — den Cache vollständig leeren.

Das Entfernen von Einträgen gibt nur lokalen Speicherplatz frei; alles, was du erneut besuchst, wird einfach erneut abgerufen.

:::tip
Gib dem Cache so viel Platz wie möglich auf einem Rechner, von dem aus du häufig browst — eine größere Reservierung bedeutet weniger erneute Abrufe und mehr lokal ausgelieferte Inhalte. Auf einem Rechner mit begrenztem Speicherplatz solltest du eine kleinere Reservierung festlegen; LRU behält die nützlichsten Einträge und verwirft den Rest.
:::

## Den Node verwalten (Kopplung erforderlich)

Die übrigen Bereiche ändern die Konfiguration des Nodes und erfordern daher deine ausdrückliche Erlaubnis. Da die Erweiterung in der Sandbox des Browsers läuft, kann sie die lokale Berechtigungsdatei des Nodes nicht direkt lesen — stattdessen **koppelst** du sie einmalig. Die Kopplung gewährt der Erweiterung ein eigenes, im Umfang begrenztes und widerrufbares Zugangsdatum; sie legt nie den Master-Key des Nodes offen, und sie kann nur auf dem Rechner genehmigt werden, auf dem der Node läuft.

### Die Erweiterung mit deinem Node koppeln

1. Wähle im Bedienfeld **Koppeln**. Die Erweiterung zeigt einen **6-stelligen Code** und eine Kopplungs-ID an.
2. Führe auf dem Rechner, auf dem der Node läuft, in einem Terminal `dig-node pair` aus, um ausstehende Anfragen aufzulisten (oder direkt `dig-node pair approve <pairing-id>`).
3. Bestätige, dass der im Terminal angezeigte Code mit dem Code in der Erweiterung **übereinstimmt**, und genehmige dann. Dieser Abgleich ist deine Absicherung: Er stellt sicher, dass du *genau diese* Erweiterung genehmigst und keine andere.
4. Das Bedienfeld wechselt automatisch in den gekoppelten Zustand. Die Zugangsdaten werden nur von der Erweiterung gespeichert.

Der Kopplungscode **läuft nach wenigen Minuten ab**; läuft deiner ab, bevor du ihn genehmigst, wähle einfach erneut **Koppeln** für einen neuen.

Um die Zugangsdaten nicht mehr zu verwenden, wähle im Bedienfeld **Entkoppeln** (das vergisst sie nur lokal). Um sie am Node selbst zu widerrufen, führe auf diesem Rechner `dig-node pair revoke <token-id>` aus — das Bedienfeld kehrt bei seiner nächsten Aktion in den ungekoppelten Zustand zurück.

:::note
Die Kopplung wird nur für die Verwaltungsbereiche unten benötigt. Der Live-Status und die Cache-/LRU-Steuerung oben funktionieren auch ohne sie.
:::

### Vorgelagerte Quelle

Sieh dir die vorgelagerte Quelle an, von der der Node Inhalte abruft, und lege eine andere fest. Eine geänderte vorgelagerte Quelle wird beim nächsten Start des Nodes wirksam.

### Gehostete Stores

Sieh dir die Stores an, die dein Node vorhält und anpinnt, pinne einen neuen Store an (damit der Node ihn vorhält und ausliefert), löse das Anpinnen eines anderen und prüfe den Status jedes beliebigen Stores. Das Anpinnen einer bestimmten Version ruft sie vorab ab, sodass sie sofort ausgeliefert werden kann.

### Synchronisierung

Sieh, ob eine authentifizierte Synchronisierung des gesamten Stores verfügbar ist, und löse für eine bestimmte Version eine Synchronisierung aus, sodass der Node sie abruft und zwischenspeichert.

### Peers

Sieh dir den Status des Peer-Netzwerks deines Nodes an — seine Verbindung zum Relay für Erreichbarkeit hinter einem heimischen Router sowie die Peers, mit denen er verbunden ist.

## Siehe auch

- [Verwalte deinen Node](./manage.md) — die administrativen `control.*`-Aktionen und wie der Browser sie ansteuert
- [Einen Client auf deinen Node zeigen lassen](./point-a-consumer.md) — Erweiterung, Browser oder CLI so einstellen, dass sie deinen Node nutzen
- [dig-node konfigurieren](./configure.md) — Ports, die Cache-Obergrenze und die vorgelagerte Quelle
