---
sidebar_position: 1
title: "Protocol: Overview"
description: "Das DIG-Protokoll als sieben Schichten von unten nach oben, normativ und implementierungsdefiniert. Die capsule (storeId:rootHash) ist die fundamentale Einheit; der Host ist blind, und der Reader verifiziert gegen die Chain. Dies ist die maßgebliche Protokollreferenz."
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protocol: Overview {#protocol-overview}

Dies ist die **normative Spezifikation** des DIG-Protokolls, definiert als **sieben Schichten, von
unten nach oben**. Jede Schicht benennt ihre **kanonische Crate/Datei** als normative Referenz.

:::info Dies ist die maßgebliche Protokollreferenz
Dieser Abschnitt ist die Quelle der Wahrheit dafür, was das Netzwerk tut. Er dokumentiert das
Protokoll so, wie es tatsächlich läuft, mit `file:line`-Zitaten zur kanonischen Implementierung.
:::

## Die fundamentale Einheit: die capsule {#the-fundamental-unit-the-capsule}

Ein Konzept zieht sich durch jede Schicht: die **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`,
kanonisch `storeId:rootHash`. Ein **store** ist eine geordnete Sequenz von capsules (älteste→neueste),
eine pro Commit; seine Identität `store_id` *ist* eine CHIP-0035-DataLayer-Singleton-Launcher-ID auf
Chia. Identität, Kompilierung, Preisgestaltung, Abruf, Caching und Herkunftsnachweis sind alle **pro
capsule** definiert.

## Die These: blinder Host, clientseitige Verifizierung, chain-verankerter Root {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Blinder Host.** Ein Host hält nur opaken, per Hash adressierten Chiffretext. Er hält weder eine
  URN noch einen Schlüssel, leitet die eigene Ausgabe der capsule wortgetreu weiter und kann einen
  Treffer nicht von einem Fehlschlag unterscheiden. Es gibt kein `decoy`-Feld auf der Leitung und
  kein CDN — Inhalt wird ausschließlich über den [dig RPC](./protocol/dig-rpc.md) ausgeliefert.
- **Clientseitige Verifizierung.** Jedes Byte wird auf dem Gerät des Lesers gegen einen on-chain-Root
  mit einem Per-Ressource-Merkle-Inclusion-Proof geprüft und dann authentifiziert entschlüsselt.
  Vertrauen ruht nie auf dem ausliefernden Ursprung.
- **Chain-verankerter Root.** Der vertrauenswürdige Root kommt **ausschließlich** vom
  CHIP-0035-Singleton auf Chia (aufgelöst über coinset.org), nie vom ausgelieferten "neuesten Stand".

## Die sieben Schichten {#the-seven-layers}

| # | Schicht | Was sie definiert | Kanonische Referenz |
|---|---|---|---|
| 0 | [Identity & naming](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = Launcher-ID | `digstore-core::capsule`, `::urn` |
| 0 | [URN & addressing](./protocol/urn-and-addressing.md) | `urn:dig:chia:…`-Grammatik; rootloser `retrieval_key` | `digstore-core::urn`, `lib.rs` |
| 1 | [Cryptography](./protocol/cryptography.md) | HKDF-KDF; AES-256-GCM-SIV-Siegel | `digstore-core::crypto` |
| 1 | [Merkle inclusion proofs](./protocol/merkle-proofs.md) | D5 Per-Ressource-Blatt; NODE_TAG-Faltung | `digstore-core::merkle` |
| 1 | [BLS signatures & DSTs](./protocol/bls-signatures.md) | Chia AugScheme; fünf Rollen-DSTs | `digstore-crypto::bls` |
| 2 | [Capsule format](./protocol/capsule-format.md) | der DIGS-Datenabschnitt (BINDING D1) | `digstore-core::datasection` |
| 2 | [The self-defending module](./protocol/self-defending-module.md) | Obfuskierung fester Größe; der servierende Guest | `digstore-compiler`, `digstore-guest` |
| 4 | [On-chain anchoring](./protocol/on-chain-anchoring.md) | store = Singleton; capsule = Root-Vorschub | `chip35_dl_coin`, `digstore-chain` |
| 4 | [DIG CAT payment & pricing](./protocol/dig-cat-payment.md) | pro capsule, dynamisch, USD-gekoppelt | `chip35_dl_coin::dig` |
| 6 | [The dig RPC](./protocol/dig-rpc.md) | die Maschinenschnittstelle (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [§21 transport & push](./protocol/transport-and-push.md) | `dig://`-Locator, REST, Push v1 | `digstore-remote` |
| 7 | [DIG Node peer network](./protocol/peer-network.md) | mTLS-Peer-Identität, NAT-Traversal, STUN, Introducer, Relay-Wire, Peer-RPC | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Verification & provenance](./protocol/verification-and-provenance.md) | die vier geordneten Integritäts-Gates | `digstore-core::merkle`, `dig-node` |
| 6 | [The blind host model](./protocol/blind-host-model.md) | Provider-Blindheit; Resolver; `/v1`-Control-Plane | hub `retrieval`/`resolver`/`api` |
| — | [Conformance & parity](./protocol/conformance-and-parity.md) | die Cross-Implementierungs-Paritätsdisziplin | eingefrorene Goldens, OpenRPC-Diff |

(Schicht 3 und der §21-Transport überschneiden sich mit dem Lesepfad; die Tabelle gruppiert sie
dort, wo ein Leser ihnen begegnet. Die vollständige Schichtnummerierung steht auf jeder Seite.)

## Wie eine capsule durch die Schichten fließt {#how-a-capsule-flows-through-the-layers}

Ein Publisher **chunkt + verschlüsselt** (L1) Inhalt in ein **capsule-Format** (L2), das sich
**selbst serviert** (L3), es on-chain **verankert** (L4) und es über den §21-Transport **pusht**
(L5). Jeder Client **liest** es über den dig RPC und **verifiziert** es gegen den
chain-verankerten Root vollständig clientseitig (L6). Jede kryptografische Konstante hat **eine**
Definition, geteilt über Produzent, Host und Verifizierer hinweg — die [C8-Paritätsinvariante](./protocol/conformance-and-parity.md).

## Terminologie {#terminology}

- **`chia://`** — die netzwerkweite **Inhalts**-Adresse (was ein Browser öffnet).
- **`dig://`** — der §21-**Transport**-Locator (CLI-/Peer-Ebene) *und* das interne
  Seitenschema des DIG Browser — zwei unterschiedliche Verwendungen, nie die Inhaltsadresse.
- **`urn:dig:`** — der URN-Namensraum, aus dem beide abgeleitet sind.
- **store / capsule** — die Identität und ihre unveränderliche generation.
- **$DIG** — das CAT, das pro capsule bezahlt wird; **dig-store** — das store-Format.

## Verwandte Themen {#related}

- [Concepts & glossary](./concepts.md) — jede Entität einmal definiert
- [Identity & naming](./protocol/identity-and-naming.md) — Schicht 0, wo die Spezifikation beginnt
- [The dig RPC](./protocol/dig-rpc.md) — die Maschinenschnittstelle des Protokolls
- [DIG Node peer network](./protocol/peer-network.md) — wie Nodes einander finden + erreichen (mTLS, NAT-Traversal, Relay)
- [Conformance & parity](./protocol/conformance-and-parity.md) — die Cross-Implementierungs-Paritätsdisziplin
