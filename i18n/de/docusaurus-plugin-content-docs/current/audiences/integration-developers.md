---
sidebar_position: 3
title: For integration developers
description: "Eine vollständig maschinenlesbare Plattform — OpenAPI/OpenRPC, eine katalogisierte Fehlertaxonomie, Live-Preise, JWKS, Pro-Seite-JSON und ein typisiertes @dignetwork/dig-sdk — sodass Sie ein Wallet + verifizierte Reads in Ihre App einbinden, ohne eine einzige Zeile menschlicher Prosa zu scrapen."
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# For integration developers {#for-integration-developers}

> **Eine vollständig maschinenlesbare Plattform** — OpenAPI/OpenRPC, eine katalogisierte Fehlertaxonomie, Live-Preise, JWKS, Pro-Seite-JSON und ein typisiertes `@dignetwork/dig-sdk` — sodass Sie ein Wallet + verifizierte Reads in Ihre App einbinden, **ohne eine einzige Zeile menschlicher Prosa zu scrapen**.

## Das mentale Modell — zwei Oberflächen, getrennt gehalten {#the-mental-model--two-surfaces-kept-separate}

1. **Eine REST-Steuerungsebene** — `hub.dig.net/v1`, Bearer-JWT — zum Verwalten von stores, Domains, Teams und NFTs.
2. **Ein node-agnostischer dig-JSON-RPC-2.0-Lesepfad** — `rpc.dig.net` — der **verifizierten Chiffretext** streamt.

Eine **Wallet**-Oberfläche ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) über zwei Transportwege — injiziert (DIG Browser) oder WalletConnect → Sage — vereinheitlicht durch das `ChiaProvider` des SDK. Ausgaben werden immer vom kanonischen CHIP-0035-Wasm erstellt und vom Wallet des Nutzers signiert — **niemals von Hand zusammengebaut**. Verzweigen Sie auf **stabile Fehlercodes**, niemals auf Prosa.

## Eine dapp bauen — end-to-end {#build-a-dapp--end-to-end}

Der durchgängige Weg vom Scaffold zu einer wallet-fähigen App, live auf Ihrer eigenen Domain.

→ [Eine dapp auf Chia bauen](../build-a-dapp/tutorial.md)

## Das DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, sowie die kanonischen Ausgaben, re-exportiert unter dem `/spend`-Unterpfad. Installation, Unterpfade und `capabilities()`.

→ [Das DIG SDK](../sdk.md)

## Ein Wallet verbinden — `window.chia` {#connect-a-wallet--windowchia}

Erkennen Sie den injizierten Provider, rufen Sie `connect()` auf (Zustimmung pro Origin), und verwenden Sie die CHIP-0002-Methoden.

→ [window.chia verwenden](../browser/using-window-chia.md) · Spezifikation: [der window.chia-Provider](../protocol/window-chia-provider.md)

## Verifizierte Inhalte lesen — `DigClient` + die dig-RPC-Methoden {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` streamt Chiffretext + Inclusion-Proofs und **verifiziert-dann-entschlüsselt** clientseitig. Rufen Sie die Methoden bei Bedarf direkt auf.

→ [Was ist die dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Methoden](../rpc/methods.md)

## Streaming & Reassembly {#streaming--reassembly}

Das Chunk-Modell, der [retrieval key](../concepts.md#retrieval-key), und die Verifizieren-dann-Entschlüsseln-Reihenfolge.

→ [Streaming](../rpc/streaming.md)

## Ausgaben erstellen — der kanonische CHIP-0035-Builder {#building-spends--the-canonical-chip-0035-builder}

Die Aufteilung **Erstellen → Signieren → Broadcasten**: das Wasm erstellt das Spend-Bundle, das Wallet signiert, Sie broadcasten. Der hub baut niemals eine Ausgabe von Hand zusammen — Sie sollten das auch nicht tun.

→ [Ausgaben erstellen](../spends.md)

## Die hub-`/v1`-Steuerungsebene {#the-hub-v1-control-plane}

Auth (JWT / OIDC / Geräte-Pairing), stores, Domains, Analytics und Webhooks über REST.

→ [Maschinenlesbare Oberflächen](../machine-surfaces.md#openapi) für das OpenAPI-Dokument.

## CI-Deploy — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Modi, keyless OIDC, das Ergebnis-Enum und die `--json`-Ausgabe für nachgelagerte Schritte.

→ [Über GitHub Actions deployen](../digstore/cli/deploy-from-github-actions.md)

## Maschinenlesbare Oberflächen {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — entdecken und integrieren, ohne Prosa zu scrapen.

→ [Maschinenlesbare Oberflächen](../machine-surfaces.md)

## Fehlercodes — auf den Code verzweigen {#error-codes--branch-on-the-code}

Eine konsolidierte Referenz über die dig RPC, die CLI, DIGHUb, den dig-Loader und das SDK hinweg.

→ [Fehlercodes](../support/error-codes.md)

---

## Tiefer eintauchen: das Protokoll {#go-deeper-the-protocol}

- **„verifizierte Reads"** → [Die dig RPC (Network Content Interface)](../rpc/what-is-the-dig-rpc.md) · [Inclusion- vs. Execution-Proofs](../inclusion-vs-execution-proofs.md)
- **„window.chia"** → [die normative Provider-Spezifikation](../protocol/window-chia-provider.md)
- **„retrieval_key & Streaming"** → [URNs & Verschlüsselung](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **„ein Deploy-Token ist ein widerrufbarer Writer-Key"** → [CHIP-0035-Ausgaben & Delegation](../chip-0035-spends-and-delegation.md)
- **Alles** → [Protokoll-Deep-Dive](../protocol-deep-dive.md) · [Konzepte & Glossar](../concepts.md)
