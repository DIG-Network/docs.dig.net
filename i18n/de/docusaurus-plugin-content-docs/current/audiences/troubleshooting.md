---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "Jeder Fehler liefert dir einen stabilen Code und eine request-id, die direkt zum Server-Log führt, On-Chain-Spends sind race-guarded, sodass du nie doppelt zahlst, und klare Pre-Flight-Guards verhindern verschwendete capsules, bevor du $DIG ausgibst."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Troubleshooting {#troubleshooting}

> Jeder Fehler liefert dir einen **stabilen Code** und eine **request-id**, die direkt zum Server-Log führt, On-Chain-Spends sind **race-guarded**, sodass du nie doppelt zahlst, und klare **Pre-Flight-Guards** verhindern verschwendete capsules, bevor du $DIG ausgibst.

## Das Denkmodell — finde deinen Fehler anhand seines Codes {#the-mental-model--find-your-failure-by-its-code}

Jede Oberfläche — die dig RPC, die digstore-CLI, DIGHUb, der `chia://`-Loader, das SDK — bildet einen Fehler auf einen **STABILEN Code** ab. **Verzweige anhand des Codes, niemals anhand der Meldung.** Ein konsolidierter Katalog deckt sie alle ab und wird auch maschinenlesbar veröffentlicht.

Pre-Flight-Guards (`digstore doctor`, `--dry-run`, `--if-changed`) und fortsetzbare Anker sorgen dafür, dass eine hängende oder wirkungslose Veröffentlichung **niemals stillschweigend Geld ausgibt**.

## Häufige Veröffentlichungsfehler {#common-publishing-failures}

Unzureichende Mittel, ein Bestätigungs-Timeout (fortsetzbar — dein Spend geht nicht verloren) und das Non-Fast-Forward „remote root has advanced".

→ [Troubleshooting](../support/troubleshooting.md)

## Lese- & Verifizierungsfehler {#read--verify-failures}

Proof-Mismatch, Entschlüsselungs-/Salt-Fehler und Not-Found-/Decoy-Antworten.

→ [Lese- & Verifizierungsfehler](../support/troubleshooting.md#verification-failed)

## Wallet- & Session-Probleme {#wallet--session-issues}

Verbindung, Re-Authentifizierung, eine abgelehnte Anfrage und Watch-Only-Sessions, die nicht signieren können.

→ [Wallet-Session kann nicht signieren](../support/troubleshooting.md#wallet-session)

## Pre-Flight- & Kostenprüfungen — keine capsule verschwenden {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (Umgebung + Bereitschaft), `--dry-run` (Vorschau der Kosten und der voraussichtlichen capsule) und `--if-changed` (ein bytegleicher Build ist ein No-Op).

→ [Deploy aus GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [On-Chain-Anchoring → Kosten & Sicherheit](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Referenz der Fehlercodes {#error-codes-reference}

CLI-Exit-Codes · RPC `-32xxx` · DIGHUb · dig-loader · SDK — eine konsolidierte Tabelle.

→ [Fehlercodes](../support/error-codes.md)

## FAQ {#faq}

Kosten, die kostenlose Testphase, warum der Preis einheitlich ist, wo man $DIG bekommt, und „gibt es ein Testnet?".

→ [FAQ](../support/faq.md)

## Hilfe bekommen {#get-help}

Discord + GitHub, und wie man einen guten Bericht einreicht — **niemals Geheimnisse einfügen**.

→ [Hilfe bekommen](../support/get-help.md)

## Status & Changelog {#status--changelog}

→ [Status](../support/status.md) · [Changelog](../support/changelog.md)

---

## Tiefer einsteigen: das Protokoll {#go-deeper-the-protocol}

- **Lese- & Verifizierungsfehler** → [Proofs & Sicherheit](../digstore/format/proofs-and-security.md) · [URNs & Verschlüsselung](../digstore/format/urns-and-encryption.md)
- **RPC-`-32xxx`-Codes** → [die dig-RPC-Methoden](../rpc/methods.md) · [Konformität](../rpc/conformance.md)
- **Alles** → [Protokoll-Deep-Dive](../protocol-deep-dive.md) · [Konzepte & Glossar](../concepts.md)
