---
sidebar_position: 2
title: Quickstart
description: "Verschicke deine erste Website auf DIG — kostenlos zu bauen und zu previewen, du zahlst nur den einheitlichen capsule-Preis, wenn du veröffentlichst. Web-first-Weg (keine Wallet zu Beginn nötig) plus ein paralleler CLI-Track."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Quickstart {#quickstart}

Verschicke eine Website an ein Netzwerk, das kein Host lesen, ändern oder abschalten kann — in etwa zehn Minuten.

**Du baust und previewst kostenlos.** Scaffolding und Preview kosten nichts; du zahlst den **einheitlichen capsule-Preis in $DIG** erst in dem Moment, in dem du eine [capsule](./concepts.md#capsule) on-chain veröffentlichst. *Iteriere kostenlos, veröffentliche, wenn es so weit ist.*

Zwei Wege dorthin. Die meisten starten im Web.

- **[A. Vom Web aus veröffentlichen](#a-publish-from-the-web)** — in [DIGHUb](./concepts.md#dighub) am Ende eine Wallet verbinden. Am besten für Websites und Frontends. ~10 Min.
- **[B. Von der CLI aus veröffentlichen](#b-publish-from-the-cli)** — `digstore` auf deiner Maschine, skriptfähig und CI-tauglich. Am besten für Devs und Automatisierung.

---

## A. Vom Web aus veröffentlichen {#a-publish-from-the-web}

Der schnellste Weg: bauen und previewen im Browser, eine Wallet erst im letzten Schritt aufladen.

### 1. DIGHUb öffnen und einen Entwurf starten — kostenlos, keine Wallet {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**Einen neuen store in DIGHUb starten ↗**](https://hub.dig.net/new). Lade deine gebaute Website hinein (ein Ordner mit statischen Dateien — dein `dist/` oder `build/`). DIGHUb zeigt dir eine **kostenlose Entwurfsvorschau** genau davon, wie sie ausgeliefert wird, ohne dass etwas on-chain ist und ohne $DIG-Ausgabe.

Du brauchst noch keine Wallet. Iteriere am Entwurf so oft du willst — neu hochladen, neu previewen — vollständig kostenlos.

### 2. Auf dem echten Lesepfad previewen — immer noch kostenlos {#2-preview-it-on-the-real-read-path--still-free}

Die Vorschau rendert deine Website über die echte DIG-Pipeline (verschlüsseln → kompilieren → verifizieren → entschlüsseln), sodass das, was du siehst, genau das ist, was Besucher bekommen. Klick dich durch, prüfe Assets und Routing. Nichts wird veröffentlicht und nichts wird ausgegeben, bis du dich dafür entscheidest.

### 3. Veröffentlichen — Wallet aufladen und verbinden {#3-publish--fund-and-connect-a-wallet}

Wenn der Entwurf passt, klicke auf **Publish**. Das ist der einzige Schritt, der etwas kostet:

- Verbinde eine Chia-Wallet (deine Wallet *ist* dein Konto — keine E-Mail, kein Passwort).
- Bestätige die on-chain-Ausgabe: den **einheitlichen capsule-Preis in $DIG + eine kleine XCH-Gebühr**, in einer Signatur. Der Publish-Bildschirm zeigt den genauen $DIG-Betrag, bevor du signierst.
- DIGHUb mintet deinen store und veröffentlicht die erste **capsule** auf dem Chia-Mainnet.

Zu wenig DIG? Der Publish-Bildschirm zeigt dein Guthaben und wo du aufladen kannst. Siehe [Wo bekomme ich DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space oder 9mm.pro.

### 4. Du bist live {#4-youre-live}

Deine capsule ist jetzt on-chain verankert und **sofort über den [dig RPC](./concepts.md#dig-rpc) lesbar** — jeder kann sie über ihre [`urn:dig:`-URN](./concepts.md#urn) oder [`chia://`](./browser/chia-protocol.md)-Adresse abrufen und verifizieren, ohne Registrierung und ohne weitere Kosten. Die URN ist zugleich die Adresse *und* der Schlüssel; teile sie, um den Inhalt zu teilen. Der Lesepfad ist universell und kostenlos; er ist live, sobald die capsule bestätigt ist.

**Willst du eine benutzerfreundliche `*.on.dig.net`-Adresse?** Das ist optional. Ein store bekommt eine `*.on.dig.net`-Subdomain nur, wenn du in DIGHUb **einen Handle registrierst** — eine separate, kostenpflichtige Registrierung, die den store an diesen Namen pinnt. Bis du einen registrierst, gibt es keine `*.on.dig.net`-URL (die obige URN- / `chia://`-Adresse ist immer der kanonische Weg, ihn zu erreichen). Siehe [Kann ich meine eigene Domain verwenden?](./support/faq.md#can-i-use-my-own-domain).

**Um später ein Update zu verschicken:** bearbeiten, den neuen Entwurf kostenlos previewen und erneut auf Publish klicken. Jedes veröffentlichte Update ist eine neue capsule und kostet erneut den **einheitlichen capsule-Preis** — du zahlst nur, wenn du einen Entwurf zu einer dauerhaften on-chain-Version beförderst.

:::tip Automatisieren
Sobald dein store existiert, richte [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md) ein, sodass jeder Push nach `main` eine neue capsule veröffentlicht — git-push-to-deploy.
:::

---

## B. Von der CLI aus veröffentlichen {#b-publish-from-the-cli}

Derselbe Ablauf von deinem Terminal aus — skriptfähig und die Grundlage für CI. Die CLI spiegelt den Web-Weg: Bauen und Previewen kosten nichts; das Veröffentlichen einer capsule kostet den einheitlichen capsule-Preis in $DIG.

### 1. Installieren {#1-install}

```sh
# lade den Installer für dein Betriebssystem von der Releases-Seite herunter, dann:
digstore --version
```

Siehe [Die CLI installieren](./digstore/cli/install.md) für Installer je Betriebssystem und den Build aus dem Quellcode.

### 2. Scaffolden und previewen — kostenlos, keine Chain, keine Ausgabe {#2-scaffold-and-preview--free-no-chain-no-spend}

Scaffold ein Projekt und previewe es lokal — **kostenlos, kein Mint, keine Chain** — bevor du überhaupt etwas ausgibst:

```sh
digstore new <template>   # scaffolde ein wallet-verdrahtetes Projekt (static · vite-react · next-static · nft-drop · dapp-window-chia) — kostenlos, kein Mint
digstore dev              # überwachen + kompilieren-beim-speichern + den echten chia://-Lesepfad servieren, mit injiziertem window.chia — kostenlos, live-reload
```

`new` schreibt ein lauffähiges Projekt (eine `dig.toml` + eine Starter-App); `dev` serviert es über den echten DIG-Lesepfad (kompilieren → verifizieren → entschlüsseln) mit Live-Reload. Du zahlst den einheitlichen capsule-Preis erst, wenn du veröffentlichst (nächste Schritte). Oder baue mit deiner gewohnten Toolchain (`npm run build` → `dist/`) und veröffentliche dieses Ergebnis.

:::tip npm bevorzugt? Nutze `create-dig-app`
Wenn du in der Node-Welt zuhause bist, scaffoldet `npm create dig-app@latest my-app -- --template vite-react` dieselben Templates direkt aus npm — keine `digstore`-Installation nötig, um zu starten. Siehe [Eine App scaffolden](./build-a-dapp/scaffold.md).
:::

### 3. Eine Wallet einrichten (nur zum Veröffentlichen nötig) {#3-set-up-a-wallet-only-needed-to-publish}

Veröffentlichen gibt echte Mittel aus, daher brauchst du zuerst einen Seed und eine finanzierte Wallet:

```sh
digstore seed generate      # generiere eine frische Mnemonic (wird einmal angezeigt — sichere sie)
digstore balance            # zeige deine Empfangsadresse; finanziere sie mit XCH + DIG
```

Siehe [On-chain-Verankerung](./digstore/cli/onchain-anchoring.md) für Import, Finanzierung und TTL-Details.

### 4. Deine erste capsule veröffentlichen {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # minte die erste capsule des stores (einheitlicher capsule-Preis + XCH-Gebühr)
```

`init` mintet ein Chia-Singleton auf dem Mainnet — **die Launcher-ID wird zu deiner store-ID** — und blockiert, bis sie bestätigt ist.

### 5. Updates verschicken {#5-ship-updates}

```sh
npm run build                      # erzeuge dist/
digstore add -A                    # den gesamten Content-Root stagen
digstore commit -m "v1.1"          # eine neue capsule veröffentlichen (einheitlicher capsule-Preis + XCH-Gebühr)
```

Für CI erledigt ein einziger Befehl add → commit → push und gibt die URL aus:

```sh
digstore deploy --output-dir dist --json   # bringt einen bestehenden store aus CI voran; mintet nie
```

Siehe [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md).

### 6. Zurücklesen {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # eine URN lokalisiert UND entschlüsselt zugleich
```

---

## Was es kostet {#what-it-costs}

| Du tust | Kosten |
|---|---|
| Scaffolden, Bauen, Previewen eines Entwurfs | **Kostenlos** |
| Veröffentlichen deiner ersten capsule (`init` / DIGHUb Publish) | **einheitlicher capsule-Preis in $DIG** + kleine XCH-Gebühr |
| Veröffentlichen jedes Updates (`commit` / erneutes Publish) | **einheitlicher capsule-Preis in $DIG** + kleine XCH-Gebühr |

Der Preis ist überall **einheitlich pro capsule** — siehe [warum der Preis einheitlich ist](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Hängst du fest? {#stuck}

- [Fehlerbehebung](./support/troubleshooting.md) — die häufigsten Fehler und ihre Lösungen.
- [FAQ](./support/faq.md) — schnelle Antworten.
- [Hilfe erhalten](./support/get-help.md) — die Community und wie du einen guten Bericht einreichst.

## Verwandte Themen {#related}

- [Konzepte & Glossar](./concepts.md) — capsule, store, URN und DIG-Zahlung definiert
- [Eine App scaffolden (create-dig-app)](./build-a-dapp/scaffold.md) — starte ein deploybares Projekt mit einem Befehl (npm oder CLI)
- [Die CLI installieren](./digstore/cli/install.md) — `digstore` auf deiner Maschine einrichten
- [On-chain-Verankerung](./digstore/cli/onchain-anchoring.md) — Wallet-Einrichtung, Finanzierung und Kosten
- [Deploy from GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — push-to-publish in CI
- [CLI-Tutorial](./digstore/cli/quickstart.md) — der vollständige Create-Commit-Read-Durchlauf
