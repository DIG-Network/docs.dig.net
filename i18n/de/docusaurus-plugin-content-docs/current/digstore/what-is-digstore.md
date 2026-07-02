---
sidebar_position: 1
title: What is DigStore?
description: "Git-artiges, content-adressierbares Projektformat mit integrierter Verschlüsselung und URN-basierter Adressierung; kompiliert zu einem einzigen, sich selbst verteidigenden WebAssembly-Modul."
keywords:
  - DigStore
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# What is DigStore? {#what-is-digstore}

**DigStore ist ein Git-artiges, verschlüsseltes, content-adressierbares Projekt, das zu einem einzigen, sich selbst verteidigenden WebAssembly-Modul kompiliert.**

Sie erhalten Git-artige Befehle — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — für ein Projekt, das **im Ruhezustand verschlüsselt** ist und zu **einer einzigen `.wasm`-Datei** kompiliert. Diese eine Datei ist *sowohl Ihre Daten als auch der Server, der den Zugriff darauf regelt*. Ein Host, der sie speichert oder weiterleitet, sieht nur Chiffretext, adressiert über Hashes; er kann nicht lesen, was er transportiert.

Sie adressieren Inhalte über eine **[URN](./format/urns-and-encryption.md)**, und die URN *ist* der Schlüssel: Sie lokalisiert und entschlüsselt zugleich. Geben Sie jemandem eine URN, kann diese Person die Ressource lesen; ohne sie geht das nicht — es gibt keine separate Passwortverwaltung oder Zugriffsliste.

Anders als Git ist DigStore für **Build-Output** konzipiert, nicht für Repository-Quellcode. Sie richten ein Projekt auf ein Verzeichnis wie `dist/` aus, und es erfasst, was dort liegt.

## Warum es das gibt {#why-it-exists}

| Problem | DigStores Antwort |
|---|---|
| Hosts können lesen / scannen, was Sie veröffentlichen | Inhalte sind im Ruhezustand verschlüsselt; der Host hält nur Chiffretext, referenziert über Hashes |
| Zugriffskontrolle bedeutet Passwörter und ACLs | Die URN *ist* die Capability — teilen Sie sie, um Lesezugriff zu gewähren, halten Sie sie zurück, um ihn zu verweigern |
| Sie müssen dem Server vertrauen, dass er echte Bytes ausliefert | `clone`/`pull` verifizieren die Store-ID des Moduls, die signierte Root des Publishers und die **On-Chain-Singleton-Root**, bevor installiert wird — schlägt standardmäßig fehl (fail-closed) |
| „Wie groß ist diese Payload?" verrät sich über die Dateigröße | Jedes Projekt ist eine einzige `.wasm`-Datei, auf eine einheitliche Größe aufgefüllt, die nichts über den Inhalt preisgibt |
| Auslieferungslogik liegt getrennt von den Daten | Die Daten und der Code, der sie schützt, kompilieren in das *gleiche* Modul |

## So lesen Sie diese Dokumentation {#how-to-read-these-docs}

- **[Das DigStore-Format](./format/overview.md)** — die Konzepte: Projekte, Deployments, das `.wasm`-Modul, URNs, Verschlüsselung und Proofs. Beginnen Sie hier, wenn Sie verstehen möchten, *was* DigStore ist.
- **[CLI-Tutorial](./cli/install.md)** — installieren Sie die CLI und nutzen Sie sie in einem echten Projekt: ein Projekt initialisieren, ein Build-Verzeichnis erfassen, Deployments committen, über einen Remote teilen und Inhalte wieder zurückstreamen.

Wenn Sie es einfach ausprobieren möchten, springen Sie direkt zum **[Quickstart](../quickstart.md)** (der kostenlose, web-first-Weg) oder zum **[CLI-Tutorial](./cli/quickstart.md)**.

:::note
DigStore ist Teil des [DIG Network](https://dig.net). Das vollständige technische Design finden Sie im [Protokoll-Abschnitt](../protocol-deep-dive.md) — dem content-adressierbaren WASM-Store-Format.
:::

## Weiterführend {#related}

- [Das DigStore-Format](./format/overview.md) — Projekte, das WASM-Modul, URNs, Verschlüsselung, Proofs
- [Store-Struktur](./format/store-structure.md) — Store-Identität, Generationen und das kompilierte Modul
- [URNs & Verschlüsselung](./format/urns-and-encryption.md) — die URN, die zugleich adressiert *und* entschlüsselt
- [CLI-Tutorial](./cli/quickstart.md) — einen store in wenigen Minuten erstellen, committen und lesen
- [Konzepte & Glossar](../concepts.md) — die zentralen DIG-Entitäten im Überblick
