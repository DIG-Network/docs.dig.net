---
sidebar_position: 1
title: What is the dig RPC?
description: "Netzwerkweite Leseschnittstelle für dig-store-capsules über JSON-RPC 2.0; blind by construction, ohne Vertrauen verifizierbar und in beliebiger Größe streambar."
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# What is the dig RPC? {#what-is-the-dig-rpc}

:::info Normative Spezifikation
Dies ist die Orientierungsseite. Die maßgebliche Spezifikation der maschinellen Schnittstelle — Methoden, das Chunk-Wire-Objekt, das Node-Profil und die OpenRPC-Dokumente — finden Sie unter [Protokoll · Die dig RPC](../protocol/dig-rpc.md).
:::

**Die dig RPC ist die netzwerkweite Schnittstelle zum direkten Lesen von Inhalten aus gehosteten dig-store-`.dig`-capsules.** Es handelt sich um einen [JSON-RPC 2.0](https://www.jsonrpc.org/specification)-Dienst, der über HTTPS `POST` angesprochen wird.

Jeder Node, der capsules hostet — der Referenz-Node unter `https://rpc.dig.net` oder jeder Drittanbieter-Node — stellt **dieselben Methoden mit derselben Semantik** bereit. Ein Client, der gegen diese Schnittstelle geschrieben ist, liest über einen einzigen Endpunkt vom gesamten Netzwerk. Es gibt kein CDN; sämtliche Content-Auslieferung bei DIG erfolgt über die dig RPC.

Sie bedient drei Dinge:

| Sie haben… | Sie rufen auf… | Sie erhalten zurück… |
|---|---|---|
| Den **retrieval key** einer Ressource (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | Den Chiffretext der Ressource + einen Merkle-Inclusion-Proof (und den ZK-Ausführungs-Proof), in Chunks gestreamt |
| Eine **store id + Generation-Root** | [`dig.getCapsule`](./methods.md#diggetcapsule) | Die gesamte `.dig`-capsule dieser Generation, in Chunks gestreamt |
| Eine **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | Das öffentliche Discovery-Manifest / das Store-Metadaten-Manifest / die Liste der bestätigten Generationen des stores |

## Drei Eigenschaften, die sie definieren {#three-properties-that-define-it}

- **Blind by construction.** Ein Node liefert opaken, über einen Hash referenzierten Chiffretext aus. Er sieht niemals eine URN, einen Entschlüsselungsschlüssel oder Klartext. Eine erfolglose Anfrage wird mit einem deterministischen, nicht unterscheidbaren **Decoy**-Stream beantwortet — niemals mit einem `404` — sodass der Lesepfad niemals als Existenz-Orakel dienen kann. Sämtliche Entschlüsselung und Proof-Verifikation erfolgt beim Client.
- **Ohne Vertrauen verifizierbar.** Jedes echte Byte kommt mit einem Merkle-**Inclusion-Proof** an, der in der On-Chain-Generation-Root verwurzelt ist. Der Client faltet den Proof bis zur Root und akzeptiert nur, wenn diese mit einer Root übereinstimmt, der er vertraut. Dem Node wird nie vertraut, echte Bytes zurückgegeben zu haben.
- **In beliebiger Größe streambar.** Inhalte werden in begrenzten, 64-KiB-ausgerichteten Chunks mit expliziter Fortsetzung gelesen. Eine Ein-Kilobyte-Ressource und eine Hundert-Megabyte-capsule werden über dieselbe Schleife gelesen, und keine einzelne Antwort ist unbegrenzt.

## Wie sie zu dig-store passt {#how-it-fits-with-digstore}

dig-store liefert Ihnen das **Format**: einen content-adressierbaren, verschlüsselten store, der zu einer einzigen, sich selbst verteidigenden `.wasm`-capsule kompiliert, adressiert über eine URN, bei der *die URN der Schlüssel ist*. Die dig RPC ist die Art, wie diese capsule **im Netzwerk ausgeliefert wird**, ohne dem Host zu vertrauen:

1. Sie kompilieren einen store und verankern eine Generation on-chain (ein CHIP-0035-DataLayer-Singleton). Ihre **Content-Root** ist der Vertrauensanker.
2. Ein Node hostet die capsule und stellt sie über die dig RPC bereit.
3. Ein Leser leitet `retrieval_key = sha256(urn)` ab, ruft `dig.getContent` auf, setzt den gestreamten Chiffretext wieder zusammen, **verifiziert den Inclusion-Proof gegen die On-Chain-Root** und **entschlüsselt mit dem von der URN abgeleiteten Schlüssel** — vollständig clientseitig.

Der Node hat nur einen Hash erfahren; er hat nie erfahren, was er ausgeliefert hat.

## Ein Read in einem Aufruf {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

Der Client durchläuft `next_offset` in einer Schleife, bis `complete` erreicht ist, verifiziert `inclusion_proof` über die wieder zusammengesetzten Bytes gegen `root` und entschlüsselt dann. Ein Ergebnis mit `"decoy": true` bedeutet *nicht gefunden* — abbrechen und entsprechend melden.

## So lesen Sie diese Dokumentation {#how-to-read-these-docs}

- **[Methoden](./methods.md)** — der vollständige Methodensatz (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), ihre Parameter und Ergebnisse.
- **[Die öffentliche Netzwerk-RPC nutzen](./public-network-rpc.md)** — richten Sie Ihren Client auf `rpc.dig.net` (oder jeden beliebigen Node) aus, Endpunkte, und wie Sie selbst einen betreiben.
- **[Streaming](./streaming.md)** — das Chunk-Modell, das Reassembly, die Proof-Verifikation und eine Referenz-Client-Schleife.
- **[Konformität](./conformance.md)** — was ein Node implementieren MUSS, um Mitglied des Netzwerk-Lesepfads zu sein, plus CORS, Fehler und das Blind-Modell im Detail.

:::note
Die dig RPC ist Teil des [DIG Network](https://dig.net). Die vollständige normative Spezifikation ist der Abschnitt [Protokoll · Die dig RPC](../protocol/dig-rpc.md), die Netzwerk-Content-Schnittstelle.
:::

## Weiterführend {#related}

- [Methoden](./methods.md) — jede dig-RPC-Methode, ihre Parameter und Ergebnisse
- [Streaming](./streaming.md) — das Chunk-Modell, das Reassembly und die Proof-Verifikation
- [Konformität & Sicherheit](./conformance.md) — das Blind-Modell und was ein Node implementieren muss
- [URNs & Verschlüsselung](../digstore/format/urns-and-encryption.md) — die URN hinter jedem retrieval key
- [Konzepte & Glossar](../concepts.md) — die dig RPC, capsule und retrieval key erklärt
