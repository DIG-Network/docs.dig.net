---
sidebar_position: 1
title: For app developers
description: "Veröffentlichen Sie eine Website oder App, die Sie wirklich BESITZEN — on-chain als Ihr eigenes Asset geprägt, nicht gemietet. Bauen und testen Sie kostenlos; zahlen Sie einen kleinen, einheitlichen $DIG-Preis erst beim Veröffentlichen, wobei Dateien in Ihrem Browser verschlüsselt werden, sodass kein Host sie lesen kann."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# For app developers {#for-app-developers}

> **Veröffentlichen Sie eine Website oder App, die Sie wirklich BESITZEN** — on-chain als Ihr eigenes Asset geprägt, nicht gemietet. Bauen und testen Sie **kostenlos**; zahlen Sie einen kleinen, **einheitlichen $DIG-Preis** erst beim Veröffentlichen, wobei Dateien **in Ihrem Browser verschlüsselt** werden, sodass kein Host sie lesen kann.

## Das mentale Modell {#the-mental-model}

Ein **[store](../concepts.md#store)** ist die dauerhafte Identität Ihrer Website — ein On-Chain-Singleton, den Sie kontrollieren. Jedes Mal, wenn Sie veröffentlichen, prägen Sie eine unveränderliche **[capsule](../concepts.md#capsule)** = `storeId:rootHash`. Ein store ist einfach die Abfolge der capsules, die Sie im Laufe der Zeit veröffentlicht haben.

Zwei Eingänge führen zur **gleichen** kostenlosen Build-zu-bezahltem-Publish-Schleife:

- **Der Web-Weg** — [DIGHUb](../concepts.md#dighub) unter [hub.dig.net](https://hub.dig.net): einen gebauten Ordner ablegen, kostenlos in der Vorschau ansehen, ein Wallet erst beim Publish verbinden.
- **Der CLI-/CI-Weg** — die [`dig-store`](../concepts.md#digstore-cli)-CLI + [`create-dig-app`](../concepts.md#create-dig-app) + die [GitHub-Deploy-Action](../concepts.md#deploy-action).

Scaffolding, Bauen und Vorschau kosten **nichts**. Sie zahlen erst, wenn Sie eine capsule veröffentlichen.

| Sie tun gerade | Kosten |
|---|---|
| Scaffolding, Bauen, Vorschau eines Entwurfs | **Kostenlos** |
| Veröffentlichen Ihrer ersten capsule (einen store prägen) | **einheitlicher capsule-Preis in $DIG** + geringe XCH-Gebühr |
| Veröffentlichen jedes Updates (eine neue capsule) | **einheitlicher capsule-Preis in $DIG** + geringe XCH-Gebühr |

## Hier beginnen {#start-here}

- **[Quickstart — eine Site in 10 Minuten veröffentlichen](../quickstart.md)** — der schnellste Weg, per Web oder CLI.

## Über das Web veröffentlichen — DIGHUb {#publish-from-the-web--dighub}

[**Einen neuen store in DIGHUb starten ↗**](https://hub.dig.net/new). Legen Sie Ihre gebaute Site ab (Ihren `dist/`- oder `build/`-Ordner), erhalten Sie eine **kostenlose Entwurfsvorschau** auf dem echten Lesepfad, und verbinden Sie ein Wallet erst im Schritt **Publish**. Sehen Sie den Web-Walkthrough unter [Quickstart → Über das Web veröffentlichen](../quickstart.md#a-publish-from-the-web).

## Über die CLI veröffentlichen — dig-store {#publish-from-the-cli--digstore}

Der Git-artige Ablauf: `new` → `dev` → `init` → `commit`.

```sh
digs new vite-react   # scaffold a runnable project — free, no mint
digs dev              # preview on the real chia:// read path, live-reload — free
digs init site --dir dist   # mint the store's first capsule (uniform price + XCH fee)
digs commit -m "v1.1"       # publish an update — a new capsule
```

→ [CLI-Quickstart](../digstore/cli/quickstart.md) · [Der vollständige Projekt-Workflow](../digstore/cli/project-workflow.md)

## Eine App scaffolden — 5 Templates {#scaffold-an-app--5-templates}

Starten Sie mit einem lauffähigen, wallet-verbundenen Starter — `static`, `vite-react`, `next-static`, `nft-drop` oder `dapp-window-chia` — über `digs new <template>` oder `npm create dig-app`.

→ [Eine App scaffolden](../build-a-dapp/scaffold.md)

## Kostenlos testen mit `digs dev` {#preview-free-with-digstore-dev}

`digs dev` liefert Ihr Projekt über den **echten** DIG-Lesepfad aus (verschlüsseln → kompilieren → verifizieren → entschlüsseln) mit Live-Reload und einem injizierten Dev-`window.chia`. Was Sie sehen, ist das, was Besucher erhalten — und nichts wird geprägt oder ausgegeben.

→ [CLI-Quickstart → Entwickeln & Vorschau](../digstore/cli/quickstart.md)

## `dig.toml` — das committable Manifest {#digtoml--the-committable-manifest}

`dig.toml` im Wurzelverzeichnis Ihres Projekts enthält `store-id`, `output-dir`, `build-command`, `remote` und weitere Konfiguration — gemeinsam genutzt von `digs dev`, `digs deploy` und den Scaffold-Templates. Es enthält **keine Geheimnisse** (diese kommen aus der Umgebung), also können Sie es committen.

→ [Projektkonfiguration & Build-Zeit-Werte](../digstore/cli/configuration.md)

## Updates & Versionen — jede Veröffentlichung ist eine neue capsule {#updates--versions--each-publish-is-a-new-capsule}

Jede Veröffentlichung versiegelt den aktuellen Build in einer **neuen unveränderlichen capsule** und rückt die On-Chain-Root Ihres stores vor. Alte capsules bleiben lesbar; der store löst immer zur neuesten auf, sofern ein Leser nicht einen bestimmten `rootHash` fixiert.

→ [On-Chain-Verankerung](../digstore/cli/onchain-anchoring.md)

## Was es kostet {#what-it-costs}

Kostenlos zum Bauen und in der Vorschau ansehen; ein **einheitlicher Preis in $DIG** pro veröffentlichter capsule, plus eine geringe XCH-Netzwerkgebühr — **atomar** in derselben On-Chain-Ausgabe enthalten. Der Preis ist bewusst pro capsule einheitlich (sodass die Länge der capsule nichts über Ihren Inhalt preisgibt). $DIG erhalten Sie auf TibetSwap, dexie.space oder 9mm.pro.

→ [Wo bekomme ich DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Warum hat jede capsule denselben Preis?](../support/faq.md#why-uniform-price)

## Push-to-Deploy über GitHub Actions {#push-to-deploy-from-github-actions}

Verdrahten Sie `dig-network/deploy-action`, sodass jeder Push eine neue capsule veröffentlicht — mit einer `if-changed`-Absicherung, die einen byte-identischen Build zu einem No-op macht (keine Ausgabe).

→ [Über GitHub Actions deployen](../digstore/cli/deploy-from-github-actions.md)

## Eine `*.on.dig.net`-Webadresse hinzufügen (optional) {#add-a-ondignet-web-address-optional}

Ihr store ist über seine [URN](../concepts.md#urn)- / [`chia://`](../browser/chia-protocol.md)-Adresse erreichbar, sobald er bestätigt ist — ohne zusätzliche Kosten. Ein benutzerfreundliches `<name>.on.dig.net`-Handle ist zusätzlich eine **optionale, kostenpflichtige** Registrierung in DIGHUb.

→ [Kann ich meine eigene Domain verwenden?](../support/faq.md#can-i-use-my-own-domain)

---

## Tiefer eintauchen: das Protokoll {#go-deeper-the-protocol}

Das oben beschriebene Modell in einfacher Sprache ist alles, was Sie zum Veröffentlichen brauchen. Wenn Sie das vollständige Design möchten:

- **„ein store ist eine Abfolge von capsules"** → [Konzepte & Glossar](../concepts.md#capsule) · [Das capsule- & store-Modell](../digstore/format/store-structure.md)
- **„Dateien, in Ihrem Browser verschlüsselt"** → [URNs & Verschlüsselung](../digstore/format/urns-and-encryption.md)
- **„ein einheitlicher Preis + atomare $DIG-Ausgabe"** → [On-Chain-Verankerung](../digstore/cli/onchain-anchoring.md#costs) · [CHIP-0035 store-coin-Ausgaben](../chip-0035-spends-and-delegation.md)
- **Alles** → [Protokoll-Deep-Dive](../protocol-deep-dive.md)
