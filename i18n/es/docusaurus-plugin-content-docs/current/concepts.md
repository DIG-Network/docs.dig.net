---
sidebar_position: 1.5
title: Concepts & glossary
description: "Índice de una página de las entidades centrales de DIG Network — capsule, store, generation, URN, retrieval key, el dig RPC, el protocolo chia:// y el anclaje en cadena — cada una definida una vez y enlazada a su documento en profundidad."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts & glossary {#concepts--glossary}

Esta página define **una vez**, en lenguaje llano, cada entidad central de DIG Network, y enlaza cada una al documento que profundiza. Es la columna vertebral legible para humanos de esta documentación — y, dado que cada término también se emite como datos estructurados legibles por máquinas, es el mapa que un agente puede rastrear para aprender el vocabulario de la red. Recórrela para orientarte; sigue un enlace para profundizar.

## El capsule {#capsule}

Un **capsule** es una generación de store inmutable: el par `(storeId, rootHash)`, escrito canónicamente
como `storeId:rootHash`. Es la unidad atómica de la red — de compilación (un módulo WASM de tamaño fijo),
[precio](./digstore/cli/onchain-anchoring.md) (un precio uniforme por capsule para mint o commit, pagado
en $DIG), recuperación (una [URN](#urn) nombra un capsule), caché y procedencia. Un [store](#store) es una *secuencia de
capsules*, uno por cada commit. Esta definición es idéntica en dig-store, el dig RPC y el DIG
Browser. → [El capsule, en detalle](./intro.md#the-capsule)

## Store {#store}

Un **store** es una identidad más su contenido e historial: una secuencia de [capsules](#capsule), uno por
commit. Su identidad es un **store id** de 64 caracteres hexadecimales, que *es* el launcher id de su singleton de Chia en cadena —
el singleton en la cadena es la autoridad para la raíz actual del store. Un store es el equivalente en DIG de un
sitio web. → [Estructura del store](./digstore/format/store-structure.md)

## Generation {#generation}

Una **generation** es un estado confirmado único de un [store](#store), identificado por un **root hash** (una
raíz Merkle sobre las hojas por recurso de la generación). Cada `commit` sella el contenido actual en
una nueva generación de solo anexado — lo mismo que nombra un [capsule](#capsule). Las generations crecen
monótonamente, como el historial de Git. → [Generations y root hashes](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

Una **URN** es la dirección *y* la clave de dig-store en una sola cadena:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. A la vez **localiza** un recurso y **deriva la
clave que lo descifra** — poseer la URN es necesario y suficiente para leer un recurso público.
La abreviatura orientada al navegador es el [protocolo `chia://`](#chia-protocol). → [URNs y cifrado](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

La **retrieval key** es `SHA-256(canonical_urn)` — la única dirección que sale del cliente. Ella
localiza el texto cifrado de un recurso sin revelar su ruta ni su [URN](#urn). Es
*independiente de la raíz*, así que la misma clave encuentra un recurso a través de las [generations](#generation); los
bytes servidos luego se [verifican con Merkle](#merkle-proof) contra la raíz correcta. La
**decryption key** separada se deriva localmente (HKDF) a partir de la misma URN y nunca se envía. → [Dos valores, una cadena](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Cada [generation](#generation) construye un árbol Merkle con una hoja por recurso, comprometiéndose a
los bytes exactos de *texto cifrado* servidos. Una única **prueba de inclusión** acompaña a un recurso servido y
demuestra que esos bytes pertenecen a esa raíz exacta — así el contenido se verifica sin ser jamás
descifrado, y nunca se confía en que un nodo haya devuelto bytes genuinos. → [Pruebas Merkle](./digstore/format/proofs-and-security.md)

## On-chain anchoring {#anchoring}

Todo store es un **singleton en la mainnet de Chia**. `digs init` lo acuña (el launcher id *se convierte* en
el store id) y cada `digs commit` ancla en cadena una nueva raíz de [generation](#generation) como una
actualización de singleton CHIP-0035. Ambos bloquean hasta la confirmación y gastan fondos reales. La cadena es la
autoridad para la raíz más reciente de un store. → [Anclaje en cadena](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG** es el token de DIG Network (un CAT de Chia). Acuñar un [capsule](#capsule) (`init`) o hacerle commit
cuesta un **precio uniforme por capsule en $DIG**, incluido **atómicamente en el mismo gasto en cadena** que el
anclaje — no hay una transacción separada, y el memo lleva el store id. → [Costos](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store` es la herramienta de línea de comandos que crea, hace commit, comparte y lee stores — un flujo
de trabajo con forma de Git (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) sobre el formato de
store cifrado y en cadena. → [Referencia de comandos](./digstore/cli/command-reference.md) · [Tutorial de la CLI](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` es el **manifiesto de proyecto commiteable** en la raíz de un proyecto — `store-id`, `output-dir`,
`build-command`, y otra configuración del proyecto, compartida por `digs dev`, `digs deploy` y las
plantillas de scaffolding. No contiene **ningún secreto** (esos vienen del entorno), así que es seguro
commitearlo. → [Configuración del proyecto y valores en tiempo de compilación](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) es la **puerta de entrada en JS** para iniciar un proyecto DIG: genera
un proyecto de partida ejecutable — una app, un [`dig.toml`](#dig-toml) y (para las plantillas con wallet) el
[DIG SDK](#dig-sdk) ya conectado — a partir de una de cinco plantillas (`static`, `vite-react`, `next-static`,
`nft-drop`, `dapp-window-chia`). El scaffolding es **gratis** — sin mint, sin cadena, sin gasto; pagas el
precio uniforme del capsule solo cuando publicas un [capsule](#capsule). Es el equivalente en npm de la CLI en Rust
`digs new`. → [Genera una app](./build-a-dapp/scaffold.md)

## The GitHub deploy Action {#deploy-action}

`dig-network/deploy-action` es la GitHub Action de **git-push-to-deploy**: instala la
[CLI de `dig-store`](#digstore-cli) en el runner, ejecuta `digs deploy` para avanzar tu store (nunca
acuña) y reporta el [capsule](#capsule) publicado + las URLs + el costo de vuelta como salidas del paso, un
comentario en el PR, un GitHub Deployment y un estado de commit. Con `if-changed` (por defecto), una
build idéntica byte a byte es un no-op — sin gasto. → [Deploy desde GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

El **DIG SDK** (`@dignetwork/dig-sdk`) es el paquete npm tipado para desarrolladores de integración: un
`ChiaProvider` (prefiere el [`window.chia`](#window-chia) inyectado, recurre a WalletConnect → Sage),
un `DigClient` (lee contenido cifrado y verificado a través del [dig RPC](#dig-rpc)), un `Paywall`
(un helper de alto nivel para pago por desbloqueo / acceso restringido por NFT que compone el proveedor con el
constructor de gastos), y el constructor canónico de gastos CHIP-0035 reexportado en la subruta `/spend`.
→ [Construye una dapp en Chia](./build-a-dapp/tutorial.md)

## The dig RPC {#dig-rpc}

El **dig RPC** es la interfaz de lectura de toda la red: un servicio JSON-RPC 2.0 sobre HTTPS `POST` que
todo nodo de hospedaje habla de forma idéntica. Sirve texto cifrado + [pruebas de inclusión](#merkle-proof) por
[retrieval key](#retrieval-key), [capsules](#capsule) completos por `(storeId, root)`, y metadatos de
descubrimiento — ciego por construcción, verificado y descifrado del lado del cliente. **Es la vía de lectura universal**:
todo capsule publicado es legible aquí por su dirección [URN](#urn) / [`chia://`](#chia-protocol) en el momento en que se
confirma en cadena — sin registro y sin más pago que el de publicar el capsule. El [handle `*.on.dig.net`](#on-dig-net)
opcional y amigable es una puerta de entrada *sobre* esto; el dig RPC
en sí siempre está disponible. → [¿Qué es el dig RPC?](./rpc/what-is-the-dig-rpc.md)

## The chia:// protocol {#chia-protocol}

`chia://` es el esquema nativo de direcciones de contenido del DIG Browser — el frente escribible de la
[URN `urn:dig:`](#urn). Pega un enlace `chia://<storeId>/` y el navegador obtiene el contenido directamente
de la red, direccionado por contenido y verificado criptográficamente. → [El protocolo chia://](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` es el proveedor de wallet de Chia que el **DIG Browser** inyecta en cada página. Habla
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), así que una app web puede
solicitar la dirección, las firmas y los gastos del usuario sin ninguna configuración de WalletConnect — una
alternativa lista para usar para apps que ya hablan CHIP-0002. → [Usando window.chia](./browser/using-window-chia.md)
· [La especificación del proveedor window.chia](./protocol/window-chia-provider.md) (normativa, versionada)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) es la app web para publicar y gestionar
[capsules](#capsule) sin la CLI — crea un capsule, despliega un frontend y visualiza tus stores en
el navegador. También es el plano de control con acceso restringido que gestiona el presupuesto de los costosos trabajos de prueba de ejecución ZK.

## dig-node {#dig-node}

Un **dig-node** es el **servidor** de contenido de la red — el lado de la oferta. Hospeda [capsules](#capsule), mantiene
una caché local `.dig` y habla el [dig RPC](#dig-rpc) de forma idéntica a `rpc.dig.net`. **No** necesitas
uno para leer contenido de DIG (los consumidores recurren a `rpc.dig.net`); ejecutar uno hace que las lecturas sean locales por defecto y
contribuye con capacidad de servicio. El host es **ciego** — solo retransmite texto cifrado + pruebas.
→ [Ejecuta un nodo](./run-a-node/index.md)

## on.dig.net handle {#on-dig-net}

Un **handle on.dig.net** es una dirección web amigable *opcional y pagada* para un [store](#store):
`<tu-nombre>.on.dig.net`. Un store **no** obtiene una automáticamente — registras el handle (un
registro pagado CHIP-54 / `on.dig.net` en [DIGHUb](#dighub)) y ese registro fija el store al
nombre. Sin registro no hay dirección `*.on.dig.net`. Es puramente una puerta de entrada de conveniencia:
el store ya es legible a través del [dig RPC](#dig-rpc) por su dirección [URN](#urn) / [`chia://`](#chia-protocol) exista
o no un handle. (Los handles de cuenta y los slugs de store son espacios de nombres separados y no
exponen automáticamente un subdominio.) → [¿Puedo obtener una dirección `*.on.dig.net`?](./support/faq.md#can-i-use-my-own-domain)

## Relacionado {#related}

- [Resumen de DIG Network](./intro.md) — los primitivos de un vistazo
- [Quickstart](./quickstart.md) — construye y previsualiza gratis, publica un capsule al final
- [Construye una dapp en Chia](./build-a-dapp/tutorial.md) — todos los primitivos combinados en una dapp desplegada
- [¿Qué es dig-store?](./digstore/what-is-digstore.md) — el formato de store de un solo archivo
- [¿Qué es el dig RPC?](./rpc/what-is-the-dig-rpc.md) — la vía de lectura de la red
- [El protocolo chia://](./browser/chia-protocol.md) — direccionar contenido en el navegador
- [Obtener ayuda](./support/get-help.md) — canales de la comunidad y cómo reportar

## Para agentes y LLMs {#for-agents--llms}

Esta documentación es extraíble por máquinas. Cada página lleva JSON-LD de schema.org (esta, como un
conjunto `DefinedTerm`), y en la raíz del sitio hay dos mapas curados:

- [`/llms.txt`](pathname:///llms.txt) — un mapa en markdown, rico en enlaces, de la documentación ([convención llms.txt](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — entidades (conceptos + documentos) y aristas tipadas (`defines`, `part-of`, `requires`, `see-also`).
