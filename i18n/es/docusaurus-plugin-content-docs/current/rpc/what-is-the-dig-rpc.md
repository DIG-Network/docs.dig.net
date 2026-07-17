---
sidebar_position: 1
title: What is the dig RPC?
description: "Interfaz de lectura de toda la red para capsules de dig-store vía JSON-RPC 2.0; ciega por construcción, verificable sin confianza, y transmisible en cualquier tamaño."
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

:::info Especificación normativa
Esta es la página de orientación. La especificación normativa de la interfaz de máquina — métodos, el objeto de fragmento en el wire, el perfil de nodo y los documentos OpenRPC — está en [Protocolo · El dig RPC](../protocol/dig-rpc.md).
:::

**El dig RPC es la interfaz de toda la red para leer contenido directamente desde capsules `.dig` de dig-store hospedados.** Es un servicio [JSON-RPC 2.0](https://www.jsonrpc.org/specification) hablado sobre HTTPS `POST`.

Todo nodo que hospeda capsules — el nodo de referencia en `https://rpc.dig.net`, o cualquier nodo de terceros — expone los **mismos métodos con la misma semántica**. Un cliente escrito contra esta interfaz lee de toda la red a través de un único endpoint. No hay CDN; todo el servicio de contenido en DIG es vía el dig RPC.

Sirve tres cosas:

| Tienes… | Llamas… | Recibes… |
|---|---|---|
| La **retrieval key** de un recurso (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | El texto cifrado del recurso + una prueba de inclusión merkle (y la prueba de ejecución ZK), transmitidos en fragmentos |
| Un **store id + raíz de generation** | [`dig.getCapsule`](./methods.md#diggetcapsule) | El capsule `.dig` completo para esa generation, transmitido en fragmentos |
| Un **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | El manifiesto público de descubrimiento / el manifiesto de metadatos del store / la lista de generations confirmadas del store |

## Tres propiedades que lo definen {#three-properties-that-define-it}

- **Ciego por construcción.** Un nodo sirve texto cifrado opaco identificado por un hash. Nunca ve una URN, una clave de descifrado o texto plano. Una solicitud que no encuentra coincidencia se responde con un flujo **decoy** determinista e indistinguible — nunca un `404` — así la vía de lectura nunca es un oráculo de existencia. Todo el descifrado y toda la verificación de pruebas ocurren en el cliente.
- **Verificable sin confianza.** Cada byte real llega con una **prueba de inclusión** merkle anclada en la raíz de generation en cadena. El cliente pliega la prueba hasta la raíz y acepta solo si coincide con una raíz en la que confía. Nunca se confía en que el nodo haya devuelto bytes genuinos.
- **Transmisible en cualquier tamaño.** El contenido se lee en fragmentos acotados, alineados a 64 KiB, con continuación explícita. Un recurso de un kilobyte y un capsule de cien megabytes se leen con el mismo bucle, y ninguna respuesta individual es ilimitada.

## Cómo encaja con dig-store {#how-it-fits-with-digstore}

dig-store te da el **formato**: un store cifrado y direccionable por contenido que compila a un único capsule `.wasm` autodefendido, direccionado por una URN donde *la URN es la clave*. El dig RPC es cómo ese capsule se **sirve en la red** sin confiar en el host:

1. Compilas un store y anclas una generation en cadena (un singleton DataLayer CHIP-0035). Su **raíz de contenido** es el ancla de confianza.
2. Un nodo hospeda el capsule y lo expone a través del dig RPC.
3. Un lector deriva `retrieval_key = sha256(urn)`, llama a `dig.getContent`, reensambla el texto cifrado transmitido, **verifica la prueba de inclusión contra la raíz en cadena** y **descifra con la clave derivada de la URN** — todo del lado del cliente.

El nodo solo aprendió un hash; nunca supo qué sirvió.

## Una lectura en una llamada {#a-read-in-one-call}

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

El cliente itera sobre `next_offset` hasta `complete`, verifica `inclusion_proof` sobre los bytes reensamblados contra `root`, y luego descifra. Un resultado con `"decoy": true` significa *no encontrado* — detente y repórtalo como tal.

## Cómo leer esta documentación {#how-to-read-these-docs}

- **[Métodos](./methods.md)** — el conjunto completo de métodos (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), sus parámetros y resultados.
- **[Usando el RPC de la red pública](./public-network-rpc.md)** — apunta tu cliente a `rpc.dig.net` (o a cualquier nodo), endpoints, y cómo operar uno tú mismo.
- **[Streaming](./streaming.md)** — el modelo de fragmentos, el reensamblado, la verificación de pruebas y un bucle de cliente de referencia.
- **[Conformidad](./conformance.md)** — lo que un nodo DEBE implementar para ser miembro de la vía de lectura de la red, además de CORS, errores y el modelo ciego en detalle.

:::note
El dig RPC es parte de [DIG Network](https://dig.net). La especificación normativa completa es la sección [Protocolo · El dig RPC](../protocol/dig-rpc.md), la interfaz de contenido de la red.
:::

## Relacionado {#related}

- [Métodos](./methods.md) — todos los métodos del dig RPC, sus parámetros y resultados
- [Streaming](./streaming.md) — el modelo de fragmentos, el reensamblado y la verificación de pruebas
- [Conformidad y seguridad](./conformance.md) — el modelo ciego y lo que un nodo debe implementar
- [URNs y cifrado](../digstore/format/urns-and-encryption.md) — la URN detrás de cada retrieval key
- [Conceptos y glosario](../concepts.md) — el dig RPC, el capsule y la retrieval key definidos
