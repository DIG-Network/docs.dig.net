---
sidebar_position: 1.5
title: Concepts & glossary
description: "Eine Seite mit dem Index der zentralen DIG-Network-Entitäten — capsule, store, generation, URN, retrieval key, der dig RPC, das chia://-Protokoll und on-chain-Verankerung — jede einmal definiert und mit ihrer ausführlichen Dokumentation verlinkt."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts & glossary {#concepts--glossary}

Diese Seite definiert jede zentrale DIG-Network-Entität **einmal**, in einfacher Sprache, und
verlinkt jede mit der ausführlichen Dokumentation dazu. Sie ist das menschenlesbare Rückgrat der
Dokumentation — und, weil jeder Begriff auch als maschinenlesbare strukturierte Daten ausgegeben
wird, die Karte, die ein Agent abgrasen kann, um das Vokabular des Netzwerks zu lernen. Überflieg
sie zur Orientierung; folge einem Link, um tiefer einzusteigen.

## Die capsule {#capsule}

Eine **capsule** ist eine unveränderliche store-Generation: das Paar `(storeId, rootHash)`, kanonisch
geschrieben als `storeId:rootHash`. Sie ist die atomare Einheit des Netzwerks — für Kompilierung
(ein WASM-Modul fester Größe), [Preisgestaltung](./digstore/cli/onchain-anchoring.md) (ein
einheitlicher Preis pro capsule zum Minten oder Committen, bezahlt in $DIG), Abruf (eine
[URN](#urn) benennt eine capsule), Caching und Herkunftsnachweis. Ein [store](#store) ist eine
*Sequenz von capsules*, eine pro Commit. Diese Definition ist identisch in DigStore, dem dig RPC
und dem DIG Browser. → [Die capsule, vollständig](./intro.md#the-capsule)

## Store {#store}

Ein **store** ist eine Identität plus ihr Inhalt und ihre Historie: eine Sequenz von
[capsules](#capsule), eine pro Commit. Seine Identität ist eine 64-Hex-**store id**, die *identisch*
mit ihrer on-chain-Chia-Singleton-Launcher-ID ist — das Chain-Singleton ist die Autorität für den
aktuellen Root des stores. Ein store ist das DIG-Äquivalent einer Website. → [Store-Struktur](./digstore/format/store-structure.md)

## Generation {#generation}

Eine **generation** ist ein einzelner committeter Zustand eines [stores](#store), identifiziert durch
einen **Root-Hash** (ein Merkle-Root über die Per-Ressource-Blätter der generation). Jeder `commit`
versiegelt den aktuellen Inhalt in einer neuen, append-only generation — dasselbe, was eine
[capsule](#capsule) benennt. Generations wachsen monoton, wie eine Git-Historie. → [Generations & Root-Hashes](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

Eine **URN** ist die Adresse *und* der Schlüssel von DigStore in einem String:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. Sie **lokalisiert** eine Ressource und
**leitet den Schlüssel ab, der sie entschlüsselt** — den Besitz der URN zu haben ist notwendig und
hinreichend, um eine öffentliche Ressource zu lesen. Die browserseitige Kurzform ist das
[`chia://`-Protokoll](#chia-protocol). → [URNs & Verschlüsselung](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

Der **retrieval key** ist `SHA-256(canonical_urn)` — die einzige Adresse, die den Client jemals
verlässt. Er lokalisiert den Chiffretext einer Ressource, ohne ihren Pfad oder ihre [URN](#urn)
preiszugeben. Er ist *root-unabhängig*, sodass derselbe Schlüssel eine Ressource über
[generations](#generation) hinweg findet; die ausgelieferten Bytes werden anschließend gegen den
korrekten Root [Merkle-verifiziert](#merkle-proof). Der separate **Entschlüsselungsschlüssel** wird
lokal (HKDF) aus derselben URN abgeleitet und nie gesendet. → [Zwei Werte, ein String](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Jede [generation](#generation) baut einen Merkle-Baum mit einem Blatt pro Ressource, der sich auf die
exakten ausgelieferten *Chiffretext*-Bytes festlegt. Ein einzelner **Inclusion-Proof** begleitet
eine ausgelieferte Ressource und beweist, dass diese Bytes zu genau diesem Root gehören — sodass
Inhalt verifiziert wird, ohne je entschlüsselt zu werden, und einem Node nie vertraut werden muss,
echte Bytes zurückgegeben zu haben. → [Merkle proofs](./digstore/format/proofs-and-security.md)

## On-chain-Verankerung {#anchoring}

Jeder store ist ein **Singleton auf dem Chia-Mainnet**. `digstore init` mintet ihn (die Launcher-ID
*wird* zur store-ID), und jeder `digstore commit` verankert einen neuen [generation](#generation)-Root
on-chain als CHIP-0035-Singleton-Update. Beide blockieren, bis sie bestätigt sind, und geben echte
Mittel aus. Die Chain ist die Autorität für den aktuellsten Root eines stores. → [On-chain-Verankerung](./digstore/cli/onchain-anchoring.md)

## DIG-Zahlung {#dig-payment}

**$DIG** ist der Token des DIG Network (ein Chia-CAT). Das Minten einer [capsule](#capsule) (`init`)
oder das Committen einer solchen kostet einen **einheitlichen Preis pro capsule in $DIG**, der
**atomar in derselben on-chain-Ausgabe** wie die Verankerung enthalten ist — es gibt keine separate
Transaktion, und das Memo trägt die store-ID. → [Kosten](./digstore/cli/onchain-anchoring.md#costs)

## DigStore CLI {#digstore-cli}

`digstore` ist das Kommandozeilen-Tool, das stores erstellt, committet, teilt und liest — ein
Git-förmiger Workflow (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) über das
verschlüsselte, on-chain-store-Format. → [Kommandoreferenz](./digstore/cli/command-reference.md) · [CLI-Tutorial](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` ist das **committbare Projektmanifest** im Root eines Projekts — `store-id`,
`output-dir`, `build-command` und weitere Projektkonfiguration, gemeinsam genutzt von
`digstore dev`, `digstore deploy` und den Scaffolding-Templates. Es enthält **keine Geheimnisse**
(die kommen aus der Umgebung), daher ist es sicher, es zu committen. → [Projektkonfiguration & Build-Zeit-Werte](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) ist die **JS-Eingangstür** für den Start eines
DIG-Projekts: es scaffoldet einen lauffähigen Starter — eine App, eine [`dig.toml`](#dig-toml) und
(für die Wallet-Templates) das eingebundene [DIG SDK](#dig-sdk) — aus einem von fünf Templates
(`static`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia`). Scaffolding ist
**kostenlos** — kein Mint, keine Chain, keine Ausgabe; du zahlst den einheitlichen capsule-Preis
erst, wenn du eine [capsule](#capsule) veröffentlichst. Es ist das npm-seitige Gegenstück zum
`digstore new` der Rust-CLI. → [Eine App scaffolden](./build-a-dapp/scaffold.md)

## Die GitHub-Deploy-Action {#deploy-action}

`dig-network/deploy-action` ist die **git-push-to-deploy**-GitHub-Action: sie installiert die
[`digstore`-CLI](#digstore-cli) auf dem Runner, führt `digstore deploy` aus, um deinen store
voranzubringen (mintet nie), und meldet die veröffentlichte [capsule](#capsule) + URLs + Kosten
als Step-Outputs, PR-Kommentar, GitHub-Deployment und Commit-Status zurück. Mit `if-changed`
(Standard) ist ein bytegleicher Build ein No-op — keine Ausgabe. → [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

Das **DIG SDK** (`@dignetwork/dig-sdk`) ist das typisierte npm-Paket für integrierende
Entwickler: ein `ChiaProvider` (bevorzugt injiziertes [`window.chia`](#window-chia), fällt zurück
auf WalletConnect → Sage), ein `DigClient` (liest verifizierten, verschlüsselten Inhalt über den
[dig RPC](#dig-rpc)), eine `Paywall` (ein High-Level-Pay-to-Unlock- / NFT-Gated-Access-Helfer, der
den Provider mit dem Spend-Builder kombiniert) und der kanonische CHIP-0035-Spend-Builder,
re-exportiert unter dem `/spend`-Unterpfad.
→ [Eine Dapp auf Chia bauen](./build-a-dapp/tutorial.md)

## Der dig RPC {#dig-rpc}

Der **dig RPC** ist die netzwerkweite Leseschnittstelle: ein JSON-RPC-2.0-Dienst über HTTPS
`POST`, den jeder Hosting-Node identisch spricht. Er liefert Chiffretext + [Inclusion-Proofs](#merkle-proof)
per [retrieval key](#retrieval-key), ganze [capsules](#capsule) per `(storeId, root)` und
Discovery-Metadaten — durch Konstruktion blind, clientseitig verifiziert und entschlüsselt. **Es
ist der universelle Lesepfad**: jede veröffentlichte capsule ist hier über ihre [URN](#urn) / [`chia://`](#chia-protocol)-Adresse
lesbar, sobald sie on-chain bestätigt ist — ohne Registrierung und ohne Zahlung über das
Veröffentlichen der capsule hinaus. Der optionale, benutzerfreundliche [`*.on.dig.net`-Handle](#on-dig-net)
ist eine Eingangstür *zusätzlich zu* diesem; der dig RPC selbst ist immer verfügbar. → [Was ist der dig RPC?](./rpc/what-is-the-dig-rpc.md)

## Das chia://-Protokoll {#chia-protocol}

`chia://` ist das native Inhaltsadressierungsschema des DIG Browser — die eintippbare
Frontend-Form der [`urn:dig:`-URN](#urn). Füge einen `chia://<storeId>/`-Link ein, und der Browser
holt den Inhalt direkt aus dem Netzwerk, inhaltsadressiert und kryptografisch verifiziert. → [Das chia://-Protokoll](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` ist der Chia-Wallet-Provider, den der **DIG Browser** in jede Seite injiziert. Er
spricht [CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), sodass
eine Web-App die Adresse, Signaturen und Spends des Nutzers ohne WalletConnect-Setup anfordern
kann — eine Drop-in-Alternative für Apps, die bereits CHIP-0002 sprechen. → [window.chia verwenden](./browser/using-window-chia.md)
· [Die window.chia-Provider-Spezifikation](./protocol/window-chia-provider.md) (normativ, versioniert)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) ist die Web-App zum Veröffentlichen und Verwalten
von [capsules](#capsule) ohne die CLI — erstelle eine capsule, deploye ein Frontend und sieh dir
deine stores im Browser an. Sie ist außerdem die gated Control-Plane, die teure
ZK-Ausführungsbeweis-Jobs budgetiert.

## dig-node {#dig-node}

Ein **dig-node** ist der Inhalts-**Server** des Netzwerks — die Angebotsseite. Er hostet
[capsules](#capsule), hält einen lokalen `.dig`-Cache und spricht den [dig RPC](#dig-rpc) identisch
zu `rpc.dig.net`. Du brauchst **keinen**, um DIG-Inhalte zu lesen (Konsumenten fallen zurück auf
`rpc.dig.net`); einen zu betreiben macht Lesevorgänge local-first und trägt zur
Auslieferungskapazität bei. Der Host ist **blind** — er leitet ausschließlich Chiffretext + Proofs
weiter. → [Einen Node betreiben](./run-a-node/index.md)

## on.dig.net-Handle {#on-dig-net}

Ein **on.dig.net-Handle** ist eine *optionale, kostenpflichtige* benutzerfreundliche Web-Adresse
für einen [store](#store): `<dein-name>.on.dig.net`. Ein store bekommt automatisch **keine**
solche Adresse — du registrierst den Handle (eine kostenpflichtige CHIP-54- / `on.dig.net`-Registrierung
in [DIGHUb](#dighub)), und diese Registrierung pinnt den store an den Namen. Keine Registrierung
bedeutet keine `*.on.dig.net`-Adresse. Es ist rein eine bequeme Eingangstür: der store ist bereits
über den [dig RPC](#dig-rpc) via seiner [URN](#urn) / [`chia://`](#chia-protocol)-Adresse lesbar,
unabhängig davon, ob ein Handle existiert. (Account-Handles und store-Slugs sind separate
Namensräume und legen nicht automatisch eine Subdomain offen.) → [Kann ich eine `*.on.dig.net`-Adresse bekommen?](./support/faq.md#can-i-use-my-own-domain)

## Verwandte Themen {#related}

- [DIG Network Überblick](./intro.md) — die Primitive auf einen Blick
- [Quickstart](./quickstart.md) — kostenlos bauen und previewen, am Ende eine capsule veröffentlichen
- [Eine Dapp auf Chia bauen](./build-a-dapp/tutorial.md) — jedes Primitiv zu einer verschickten Dapp zusammengefügt
- [Was ist DigStore?](./digstore/what-is-digstore.md) — das Ein-Datei-store-Format
- [Was ist der dig RPC?](./rpc/what-is-the-dig-rpc.md) — der Lesepfad des Netzwerks
- [Das chia://-Protokoll](./browser/chia-protocol.md) — Inhalte im Browser adressieren
- [Hilfe erhalten](./support/get-help.md) — Community-Kanäle und wie man meldet

## Für Agenten & LLMs {#for-agents--llms}

Diese Dokumentation ist maschinell extrahierbar. Jede Seite trägt schema.org JSON-LD (diese hier
als ein `DefinedTerm`-Set), und zwei kuratierte Karten liegen an der Wurzel der Website:

- [`/llms.txt`](pathname:///llms.txt) — eine linkreiche Markdown-Karte der Dokumentation ([llms.txt-Konvention](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — Entitäten (Konzepte + Dokumente) und typisierte Kanten (`defines`, `part-of`, `requires`, `see-also`).
