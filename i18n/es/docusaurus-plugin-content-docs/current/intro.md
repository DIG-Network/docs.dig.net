---
sidebar_position: 1
slug: /
title: DIG Network
description: "Resumen de los primitivos de DIG Network: DigStore para publicación direccionable por contenido, dig RPC para hospedaje y recuperación ciegos, y el DIG Browser para el acceso al contenido."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - DigStore
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network es una Layer 2 Proof-of-Stake sobre Chia** — una red descentralizada para publicar, direccionar y servir contenido sin confiar en el host.

Esta documentación cubre la red y sus **primitivos**: los bloques de construcción componibles que los desarrolladores usan para crear sobre DIG. La red sigue en expansión, y con el tiempo se documentarán aquí más primitivos.

:::info $DIG impulsa la red
**$DIG es el motor y la economía de DIG Network.** Cada intercambio de valor — publicar un capsule, ser propietario de un store, dar propina a un creador — fluye a través de $DIG. Consumir contenido sigue siendo sencillo y gratuito: nunca pagas por leer, solo por publicar y poseer.
:::

## El capsule {#the-capsule}

Un concepto atraviesa todos los primitivos. Un **capsule** es una generación de store inmutable única — el par `(storeId, rootHash)`, escrito canónicamente como `storeId:rootHash`. Un **store es una secuencia de capsules**, uno por cada commit (cada commit avanza la raíz en la cadena y produce un nuevo capsule).

El capsule es la unidad de la red para:

- **Compilación** — cada capsule compila a un único módulo WASM de tamaño fijo (rellenado para que su longitud no revele nada sobre el tamaño del contenido).
- **Precio** — un **precio uniforme por capsule** (mint o commit), pagado en $DIG a la tasa vigente; el costo de vida de un store es el precio uniforme por capsule × el número de capsules.
- **Recuperación** — una URN nombra un capsule (más un recurso opcional dentro de él).
- **Caché** — un host o navegador cachea un capsule identificado por `storeId:rootHash`; la caché local es un conjunto de capsules.
- **Procedencia** — la raíz de cada capsule lleva la firma BLS del publicador y una raíz Merkle.

Esta es la definición vigente en todo el ecosistema: "capsule = `(storeId, rootHash)`" significa lo mismo en DigStore, el dig RPC y el DIG Browser.

:::tip Pruébalo
[**Crea tu primer capsule en DIGHUb ↗**](https://hub.dig.net/new) — publica un sitio desde el navegador, sin necesidad de CLI. Cada capsule (mint o commit) cuesta el **precio uniforme del capsule en $DIG**.
:::

## Primitivos {#primitives}

### 🗄️ DigStore {#️-digstore}

El primitivo primero y más fundamental: un **proyecto WASM cifrado y direccionable por contenido**. Lo apuntas a un directorio de build, haces commit de los despliegues como en Git, y obtienes un único archivo `.wasm` autodefendido que es a la vez tus datos y el servidor que controla el acceso a ellos. La URN *es* la clave — a la vez localiza y descifra.

→ **[Explora DigStore](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[¿Qué es DigStore?](./digstore/what-is-digstore.md)** | La idea de un solo archivo, en pocas palabras |
| **[El formato](./digstore/format/overview.md)** | Proyectos, despliegues, URNs, cifrado, pruebas |
| **[Tutorial de la CLI](./digstore/cli/quickstart.md)** | Instala y usa `digstore` en tu proyecto |

### 🛰️ dig RPC {#️-dig-rpc}

El primitivo de red: una **interfaz estándar para leer contenido de despliegues de DigStore hospedados**. JSON-RPC 2.0 sobre HTTPS `POST` — todo nodo de hospedaje lo habla de forma idéntica, así el contenido es portable y los clientes son agnósticos al nodo. Sirve texto cifrado + pruebas de inclusión por clave de recuperación, despliegues completos por `(store_id, root)`, y el manifiesto público de descubrimiento — transmitido en fragmentos, ciego por construcción, verificado y descifrado enteramente del lado del cliente.

→ **[Explora el dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[¿Qué es el dig RPC?](./rpc/what-is-the-dig-rpc.md)** | Un único endpoint para toda la vía de lectura de la red |
| **[Métodos](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | El modelo de fragmentos, el reensamblado y la verificación de pruebas |
| **[Conformidad y seguridad](./rpc/conformance.md)** | El modelo ciego, CORS, y lo que un nodo debe implementar |

### 🌐 DIG Browser {#-dig-browser}

El primitivo cliente: un **navegador con una wallet de Chia integrada**. Inyecta un proveedor `window.chia` en cada página, de modo que cualquier aplicación web puede solicitar la dirección, las firmas y los gastos del usuario sin ninguna configuración de WalletConnect — una alternativa lista para usar para apps que ya hablan CHIP-0002. También resuelve directamente direcciones de contenido `chia://`.

→ **[Desarrolla contra el DIG Browser](./browser/using-window-chia.md)**

| | |
|---|---|
| **[Usando `window.chia` en tu app](./browser/using-window-chia.md)** | Detecta la wallet inyectada, conéctate y llama a los métodos de CHIP-0002 |

:::tip Pruébalo
[**Consigue el DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — descarga el navegador para abrir contenido `chia://` y usar la wallet integrada.
:::

*Más primitivos — liquidación y operación de nodos — tendrán sus propias secciones a medida que lleguen.*

## Elige tu camino {#pick-your-path}

La documentación está organizada en torno a **lo que estás haciendo**. Cada recorrido abre con un "por qué" de diez segundos, el modelo mental que necesitas, y el cómo de alta señal — y luego enlaza al protocolo cuando quieras profundizar.

- **[Publica un sitio o app que sea tuyo](./audiences/app-developers.md)** — lanza un sitio web/app como tu propio activo en cadena; construye gratis, publica un capsule.
- **[Acuña NFTs y colecciones](./audiences/nft-developers.md)** — drops CHIP-0007 respaldados por capsules permanentes e infalsificables.
- **[Integra DIG en tu app](./audiences/integration-developers.md)** — un SDK tipado + una plataforma totalmente legible por máquinas.
- **[Ejecuta un nodo](./run-a-node/index.md)** — sirve contenido de forma demostrable y ciega al proveedor.
- **[Abre contenido chia://](./audiences/content-consumers.md)** — lee contenido que tu propio navegador verifica contra la cadena.
- **[Resuelve un problema](./audiences/troubleshooting.md)** — encuentra tu fallo por su código estable.

¿Nuevo en el vocabulario? Repasa [Conceptos y glosario](./concepts.md). ¿Quieres el diseño completo? Lee la [Inmersión profunda en el protocolo](./protocol-deep-dive.md).

:::note
DIG Network y sus primitivos son de código abierto. DigStore está licenciado bajo GPL-2.0; consulta el [repositorio de digstore](https://github.com/DIG-Network/digstore).
:::

## Relacionado {#related}

- [Quickstart](./quickstart.md) — lanza tu primer sitio; gratis para construir y previsualizar
- [Construye una dapp en Chia](./build-a-dapp/tutorial.md) — todos los primitivos en un tutorial de principio a fin
- [Conceptos y glosario](./concepts.md) — las entidades centrales de DIG, definidas y enlazadas
- [¿Qué es DigStore?](./digstore/what-is-digstore.md) — el formato de store direccionable por contenido
- [¿Qué es el dig RPC?](./rpc/what-is-the-dig-rpc.md) — la interfaz de lectura de toda la red
- [El protocolo chia://](./browser/chia-protocol.md) — abrir contenido en el DIG Browser
- [Obtener ayuda](./support/get-help.md) — comunidad, resolución de problemas y códigos de error
