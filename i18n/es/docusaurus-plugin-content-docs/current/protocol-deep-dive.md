---
sidebar_position: 1
title: "Protocol: Overview"
description: "El protocolo DIG como siete capas de abajo hacia arriba, normativas y definidas por implementación. El capsule (storeId:rootHash) es la unidad fundamental; el host es ciego y el lector verifica contra la cadena. Esta es la referencia autoritativa del protocolo."
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

Esta es la **especificación normativa** del protocolo DIG, definida como **siete capas, de abajo hacia arriba**. Cada capa nombra su **crate/archivo canónico** como referencia normativa.

:::info Esta es la referencia autoritativa del protocolo
Esta sección es la fuente de verdad de lo que hace la red. Documenta el protocolo tal como se ejecuta realmente, con citas `file:line` a la implementación canónica.
:::

## La unidad fundamental: el capsule {#the-fundamental-unit-the-capsule}

Un concepto atraviesa todas las capas: el **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, canónicamente `storeId:rootHash`. Un **store** es una secuencia ordenada de capsules (del más antiguo al más nuevo), uno por commit; su identidad `store_id` *es* un launcher id de singleton DataLayer CHIP-0035 en Chia. La identidad, la compilación, el precio, la recuperación, la caché y la procedencia se definen todos **por capsule**.

## La tesis: host ciego, verificación del lado del cliente, raíz anclada en cadena {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Host ciego.** Un host solo tiene texto cifrado opaco identificado por hashes. No tiene ninguna URN ni clave, retransmite la salida propia del capsule textualmente, y no puede distinguir un acierto de un fallo. No hay campo `decoy` en el wire ni CDN — el contenido se sirve solo a través del [dig RPC](./protocol/dig-rpc.md).
- **Verificación del lado del cliente.** Cada byte se comprueba en el dispositivo del lector contra una raíz en cadena con una prueba de inclusión merkle por recurso, y luego se autentica y descifra. La confianza nunca recae en el origen de servicio.
- **Raíz anclada en cadena.** La raíz de confianza proviene **únicamente** del singleton CHIP-0035 en Chia (resuelto vía coinset.org), nunca de la "última" servida.

## Las siete capas {#the-seven-layers}

| # | Capa | Qué define | Referencia canónica |
|---|---|---|---|
| 0 | [Identidad y nomenclatura](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN y direccionamiento](./protocol/urn-and-addressing.md) | gramática `urn:dig:chia:…`; `retrieval_key` sin raíz | `digstore-core::urn`, `lib.rs` |
| 1 | [Criptografía](./protocol/cryptography.md) | KDF HKDF; sellado AES-256-GCM-SIV | `digstore-core::crypto` |
| 1 | [Pruebas de inclusión Merkle](./protocol/merkle-proofs.md) | hoja por recurso D5; pliegue NODE_TAG | `digstore-core::merkle` |
| 1 | [Firmas BLS y DSTs](./protocol/bls-signatures.md) | AugScheme de Chia; cinco DSTs de rol | `digstore-crypto::bls` |
| 2 | [Formato del capsule](./protocol/capsule-format.md) | la sección de datos DIGS (BINDING D1) | `digstore-core::datasection` |
| 2 | [El módulo autodefendido](./protocol/self-defending-module.md) | ofuscación de tamaño fijo; el guest de servicio | `digstore-compiler`, `digstore-guest` |
| 4 | [Anclaje en cadena](./protocol/on-chain-anchoring.md) | store = singleton; capsule = avance de raíz | `chip35_dl_coin`, `digstore-chain` |
| 4 | [Pago y precio del CAT DIG](./protocol/dig-cat-payment.md) | por capsule, dinámico, referenciado en USD | `chip35_dl_coin::dig` |
| 6 | [El dig RPC](./protocol/dig-rpc.md) | la interfaz de máquina (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [Transporte y push §21](./protocol/transport-and-push.md) | localizador `dig://`, REST, push v1 | `digstore-remote` |
| 7 | [Red de pares de DIG Node](./protocol/peer-network.md) | identidad de par mTLS, traversal NAT, STUN, introducer, wire de relay, RPC de par | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Verificación y procedencia](./protocol/verification-and-provenance.md) | las cuatro puertas de integridad ordenadas | `digstore-core::merkle`, `dig-node` |
| 6 | [El modelo de host ciego](./protocol/blind-host-model.md) | ceguera del proveedor; resolver; plano de control `/v1` | hub `retrieval`/`resolver`/`api` |
| — | [Conformidad y paridad](./protocol/conformance-and-parity.md) | la disciplina de paridad entre implementaciones | goldens congelados, diff de OpenRPC |

(Las capas 3 y el transporte §21 se entrelazan con la vía de lectura; la tabla las agrupa donde un lector las encuentra. La numeración completa de capas se da en cada página.)

## Cómo fluye un capsule a través de las capas {#how-a-capsule-flows-through-the-layers}

Un publicador **fragmenta + cifra** (L1) el contenido en un **formato de capsule** (L2) que se **autosirve** (L3), lo **ancla** en cadena (L4) y lo **envía** sobre el transporte §21 (L5). Cualquier cliente lo **lee** a través del dig RPC y lo **verifica** contra la raíz anclada en cadena enteramente del lado del cliente (L6). Cada constante criptográfica tiene **una** definición compartida entre el productor, el host y el verificador — el [invariante de paridad C8](./protocol/conformance-and-parity.md).

## Terminología {#terminology}

- **`chia://`** — la dirección de **contenido** de la red (lo que abre un navegador).
- **`dig://`** — el localizador de **transporte** §21 (plano de CLI/pares) *y* el esquema de página interno del DIG Browser — dos usos distintos, nunca la dirección de contenido.
- **`urn:dig:`** — el espacio de nombres URN del que ambos derivan.
- **store / capsule** — la identidad y su generation inmutable.
- **$DIG** — el CAT pagado por capsule; **DigStore** — el formato del store.

## Relacionado {#related}

- [Conceptos y glosario](./concepts.md) — cada entidad definida una vez
- [Identidad y nomenclatura](./protocol/identity-and-naming.md) — Capa 0, donde empieza la especificación
- [El dig RPC](./protocol/dig-rpc.md) — la interfaz de máquina del protocolo
- [Red de pares de DIG Node](./protocol/peer-network.md) — cómo los nodos se encuentran y se alcanzan entre sí (mTLS, traversal NAT, relay)
- [Conformidad y paridad](./protocol/conformance-and-parity.md) — la disciplina de paridad entre implementaciones
