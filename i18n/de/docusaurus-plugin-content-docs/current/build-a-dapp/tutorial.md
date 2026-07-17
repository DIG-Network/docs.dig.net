---
sidebar_position: 1
title: Build a dapp on Chia
description: "Durchgängig: Eine React-App scaffolden, die eingebettete Chia-Wallet (window.chia + WalletConnect-Fallback) mit dem dig-sdk verdrahten, einen Spend über das chip35-Wasm bauen und signieren, dann on-chain deployen und eine eigene Domain hinzufügen — ein durchgängiger Ablauf durch jede DIG-Primitive."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - dig-store deploy
  - custom domain
tags:
  - digstore-cli
  - window-chia
  - dig-rpc
  - chip-0035
  - dighub
  - capsule
  - anchoring
---

# Build a dapp on Chia {#build-a-dapp-on-chia}

Jede DIG-Primitive ist für sich dokumentiert — Scaffolding, die eingebettete Wallet, der Lesepfad, Spends, Deploy. **Diese Seite ist der eine durchgängige Ablauf, der sie zu einer fertig ausgelieferten Dapp verbindet.** Du startest bei einem leeren Ordner und endest bei einer wallet-fähigen React-App, live auf der Chia-Mainnet unter deiner eigenen Domain.

Der gesamte Ablauf bis zur Veröffentlichung ist **kostenlos** — Scaffolding, Entwicklung und Vorschau kosten nichts. Du zahlst den **einheitlichen capsule-Preis in $DIG** erst beim Deploy-Schritt.

```
new ──▶ dev ──▶ Wallet verdrahten (dig-sdk) ──▶ Spend bauen (chip35) ──▶ deploy ──▶ eigene Domain
 kostenlos    kostenlos          kostenlos                       kostenlos            capsule-Preis    kostenlos
```

## Was du brauchst {#what-youll-need}

- Die [`dig-store`-CLI](../digstore/cli/install.md) installiert.
- Node 18+ und `npm`.
- Eine finanzierte Chia-Wallet — **nur beim Deploy-Schritt** (der einheitliche capsule-Preis in $DIG + eine kleine XCH-Gebühr). Alles davor ist kostenlos.

---

## 1. Eine React-App scaffolden — kostenlos, keine Chain {#1-scaffold-a-react-app--free-no-chain}

`dig-store new` schreibt ein lauffähiges, wallet-verdrahtetes Projekt. Wähle das React-Template:

```sh
dig-store new vite-react my-dapp
cd my-dapp
```

Du erhältst eine Vite + React-App, eine `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`) und eine `App.jsx`, die bereits mit der eingebetteten Wallet verdrahtet ist. Es wird kein store gemintet und nichts ausgegeben — `new` ist rein lokal.

:::tip Lieber npm? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` scaffoldet dasselbe Template direkt von npm aus — die JS-Vordertür, keine `dig-store`-Installation zum Starten nötig. Siehe [Eine App scaffolden](./scaffold.md) für alle fünf Templates und den Vergleich der beiden Vordertüren.
:::

## 2. Gegen den echten Lesepfad entwickeln — kostenlos {#2-develop-against-the-real-read-path--free}

```sh
dig-store dev
```

`dev` führt deinen Build aus, liefert die Ausgabe über den **echten `chia://`-Lesepfad** aus (kompilieren → verifizieren → entschlüsseln) und injiziert einen **`window.chia`-Dev-Shim**, sodass du den Wallet-Flow ohne echte Wallet bauen kannst. Bearbeite `src/App.jsx`, speichere, und die Seite lädt live neu — genau das, was Besucher erhalten werden, mit null Chain-Interaktion und null Spend.

## 3. Die Wallet mit dem SDK verdrahten — `window.chia` + WalletConnect-Fallback {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

Das Scaffold spricht direkt mit `window.chia`, was innerhalb des [DIG Browser](../browser/using-window-chia.md) perfekt funktioniert. Um auch Nutzer in anderen Browsern zu unterstützen, füge das SDK hinzu — es **bevorzugt die injizierte `window.chia`-Wallet und fällt auf WalletConnect → Sage zurück**, hinter einer einzigen normalisierten Oberfläche, sodass du den Wallet-Flow nur einmal schreibst.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # optional: nur für den WalletConnect-Fallback
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" bevorzugt die injizierte DIG-Browser-Wallet, sonst WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // ein ÖFFENTLICHER Build-Time-Wert
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // einen QR-Code rendern
      },
    });
    setAddress(await provider.getAddress());
  }

  return (
    <main>
      <h1>My DIG dapp</h1>
      <button onClick={login}>Connect wallet</button>
      {address && <p>Connected: {address}</p>}
    </main>
  );
}
```

Ein einziges `connect()` funktioniert im DIG Browser (kein QR-Code, kein Relay) und überall sonst (WalletConnect). `provider.backend` verrät dir, welcher Transport verbunden wurde. Die Methodennamen und Ergebnisformen sind in beiden Fällen identisch — siehe [Using `window.chia`](../browser/using-window-chia.md) für den Integrationsleitfaden, oder [die normative `window.chia`-Provider-Spezifikation](../protocol/window-chia-provider.md) für den exakten Methoden-/Parameter-/Rückgabe-/Fehlervertrag.

:::note Die WalletConnect-Projekt-ID ist ein ÖFFENTLICHER Build-Time-Wert
`VITE_WC_PROJECT_ID` wird in dein Bundle kompiliert und ist öffentlich lesbar — das ist für eine WalletConnect-Cloud-ID korrekt. **Niemals** einen Wallet-Seed, einen Deploy-Key oder ein sonstiges Geheimnis in das Bundle packen: Eine capsule ist ein [blindes statisches Artefakt ohne Server-Geheimnisse](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Einen Spend bauen und signieren — das chip35-Wasm, über das SDK {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Wenn deine Dapp etwas on-chain tun muss (einen store minten, Metadaten aktualisieren, eine CAT-Zahlung bauen), baut sie den Spend mit dem **kanonischen CHIP-0035-Spend-Builder** und übergibt ihn der Wallet zum Signieren. Das SDK re-exportiert diesen Builder unter dem `/spend`-Unterpfad — du baust **niemals ein Spend-Bundle von Hand**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // der chip35-Wasm-Builder

async function doSpend() {
  spend.init();

  // Coin-Spends mit dem Wasm-Builder bauen, z. B. spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). Der Builder ist
  // offline und pur — keine Keys, kein Netzwerk.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Sie der Wallet zum Signieren übergeben (die Wallet hält die Keys, nicht deine Dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → zu einem Spend-Bundle kombinieren und senden (broadcast).
}
```

Genau dieses Muster verwendet der hub: **das Bundle im Browser mit dem Wasm bauen, mit der Wallet signieren.** Der Spend-Builder ist die einzige kanonische Quelle für Spend-Bundles im gesamten Ökosystem, sodass deine Dapp bytegleiche Spends wie der hub und die CLI erzeugt.

Um verifizierten, verschlüsselten Content **zurückzulesen** (z. B. die Daten eines anderen stores innerhalb deiner Dapp zu rendern), verwende den `DigClient` des SDK:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // Standard ist https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // der Trust Anchor, aus der Chain gelesen
});
```

`DigClient` leitet die Keys der URN im Browser ab, verifiziert die Inclusion gegen den On-Chain-Root und entschlüsselt — der servierende Host bleibt blind. Siehe [Was ist die dig RPC?](../rpc/what-is-the-dig-rpc.md).

:::tip Zugang berechnen? Nutze `Paywall`
Um zu monetarisieren — Content per Pay-to-Unlock freischalten oder ihn an den Besitz eines NFT koppeln — bringt das SDK einen High-Level-Helfer namens **`Paywall`** mit, der einen verbundenen `ChiaProvider` mit dem Spend-Builder kombiniert, sodass du Zahlungen nicht von Hand verdrahtest: `paywall.requestPayment({ amount, owner })` bezahlt den Dapp-Besitzer und liefert eine Quittung zurück, und `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` sichern den Zugang ab.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* den Content freischalten */ }
```
:::

## 5. On-chain deployen {#5-deploy-on-chain}

Du baust und siehst dir die Vorschau kostenlos an; dies ist der einzige Schritt, der Geld ausgibt. Erstelle zunächst **einmalig** den store:

```sh
dig-store init my-dapp --dir dist      # die erste capsule des stores minten (einheitlicher capsule-Preis + XCH-Gebühr)
```

`init` mintet ein Chia-Singleton auf der Mainnet — **die Launcher-ID wird zu deiner Store-ID**. Kopiere sie in `dig.toml` (`store-id = "<64-hex>"`). Von da an baut und veröffentlicht ein einziger Befehl eine neue capsule:

```sh
dig-store deploy --json                # führt build-command aus, staged dist/, rückt den Root vor
```

Jeder `deploy` veröffentlicht eine neue, unveränderliche capsule zum einheitlichen capsule-Preis. Sobald er bestätigt ist, ist deine Dapp über die [dig RPC](../rpc/what-is-the-dig-rpc.md) unter ihrer [URN](../concepts.md#urn) / `chia://`-Adresse **lesbar** — verschlüsselt, verifiziert und unmöglich abzuschalten, ohne Registrierung und ohne weitere Kosten. (Eine freundliche `*.on.dig.net`-Web-Adresse ist ein separater, optionaler Schritt — siehe [den nächsten Abschnitt](#6-put-it-on-your-own-domain).) Für Push-to-Deploy bei jedem Commit richte [Deploy aus GitHub Actions](../digstore/cli/deploy-from-github-actions.md) ein.

## 6. Auf deine eigene Domain bringen {#6-put-it-on-your-own-domain}

Dein store ist bereits über seine URN- / `dig://`-Adresse erreichbar — aber für eine freundliche Web-URL registrierst du einen Namen. Ein store erhält eine `*.on.dig.net`-Subdomain, wenn du in DIGHUb ein **Handle registrierst**: eine separate, kostenpflichtige Registrierung, die den store an diesen Namen bindet (keine Registrierung → keine `*.on.dig.net`-Adresse). Um ihn stattdessen von einer eigenen Domain auszuliefern, füge eine **eigene Domain mit TLS in [DIGHUb ↗](https://hub.dig.net)** hinzu — richte deine Domain auf den store aus, und DIGHUb kümmert sich um das Zertifikat. So oder so lädt deine Dapp von einer menschenfreundlichen URL, während sie darunter vollständig dezentralisiert bleibt.

Sobald CHIP-54-`.dig`-Handles verfügbar sind, wird ein store auch über einen menschenlesbaren `.dig`-Namen adressierbar sein; bis dahin sind eigene Domains über DIGHUb der Weg, um ein Deployment zu brandmarken.

---

## Du hast eine Dapp ausgeliefert {#you-shipped-a-dapp}

Du bist von einem leeren Ordner zu einer wallet-fähigen React-App gelangt, live auf der Chia-Mainnet unter deiner eigenen Domain — und hast dabei jede Primitive berührt: [Scaffolding](../digstore/cli/quickstart.md), die [eingebettete Wallet](../browser/using-window-chia.md), das [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), den [Spend-Builder](https://github.com/DIG-Network/chip35_dl_coin), den [Lesepfad](../rpc/what-is-the-dig-rpc.md) und [Deploy](../digstore/cli/deploy-from-github-actions.md). Klone eine fertige Version aus der [Beispielgalerie](./example-gallery.md).

## Verwandte Themen {#related}

- [Eine App scaffolden (create-dig-app)](./scaffold.md) — die fünf Templates und die npm- vs. CLI-Vordertüren
- [Beispielgalerie](./example-gallery.md) — eine fertige Dapp klonen und in einem Template öffnen
- [Using window.chia](../browser/using-window-chia.md) — der eingebettete Wallet-Provider im Detail
- [The window.chia provider spec](../protocol/window-chia-provider.md) — der normative, versionierte Provider-Vertrag
- [Project config & build-time values](../digstore/cli/configuration.md) — dig.toml + ÖFFENTLICHE Konfiguration
- [Deploy aus GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — Push-to-Deploy in CI
- [Was ist die dig RPC?](../rpc/what-is-the-dig-rpc.md) — verifizierten, verschlüsselten Content lesen
- [Quickstart](../quickstart.md) — der kürzere „Eine Seite ausliefern"-Pfad
- [Konzepte & Glossar](../concepts.md) — capsule, store, URN und window.chia definiert
