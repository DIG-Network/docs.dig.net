---
sidebar_position: 2
title: For NFT developers
description: "Acuña una colección CHIP-0007 completa cuyo arte vive PERMANENTEMENTE en un capsule DIG infalsificable — un paquete atómico firmado, regalías reales, y una mecánica de drop honesta que nunca finge lo que aún no puede demostrar en cadena."
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# For NFT developers {#for-nft-developers}

> **Acuña una colección CHIP-0007 completa cuyo arte vive PERMANENTEMENTE en un capsule DIG infalsificable** — un paquete atómico firmado, regalías reales, y una mecánica de drop honesta (revelado / lista de acceso / fases) que nunca finge lo que aún no puede demostrar en cadena.

## El modelo mental {#the-mental-model}

Primero pon tu arte en un **[capsule DIG](../concepts.md#capsule)**, luego acuña NFTs cuyos `data_uris` / `metadata_uris` apunten a ese capsule. Los hashes en cadena fijan los bytes reales — así el arte es direccionable por contenido, verificable y permanente, no un enlace que pueda pudrirse o ser reemplazado.

Los gastos **nunca se hacen a mano**: el constructor canónico wasm CHIP-0035 (vía [`@dignetwork/dig-sdk/spend`](../sdk.md)) construye cada gasto de coin, tu wallet firma una vez, y se transmite una vez.

Acuñar un **store es gratis** de $DIG — pagas el **precio uniforme del capsule** solo cuando se crea un capsule (cuando el arte se escribe en un capsule).

## Genera una página de mint — la plantilla `nft-drop` {#scaffold-a-mint-page--the-nft-drop-template}

Empieza desde una página de drop conectada a la wallet en un comando:

```sh
dig-store new nft-drop
# o
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Genera una app](../build-a-dapp/scaffold.md)

## Acuña desde la CLI {#mint-from-the-cli}

La CLI de activos construye el gasto vía los constructores de `digstore-chain`, firma con tu semilla de wallet, y lo transmite — todo `--dry-run` / `--json`, seguro para CI:

```sh
dig-store did create                          # un DID emisor para atribución
dig-store collection create --name "My Drop"  # una colección CHIP-0007
dig-store nft mint --data ./art.png --metadata ./meta.json --dry-run
dig-store offer make ...                       # intercambios de XCH / CAT
```

La vía **capsule-media** de `nft mint` escribe el arte + los metadatos CHIP-0007 en un capsule, calcula los hashes de datos/metadatos a partir de los bytes reales, y establece las URIs a la dirección `chia://` del capsule (con un respaldo de gateway https). → [Referencia de comandos](../digstore/cli/command-reference.md)

## Acuña desde la web — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Acuña una colección respaldada por capsule en el navegador: sube arte (escrito en un capsule), establece regalías y adjunta un DID para atribución — la wallet firma al final. → [DIGHUb ↗](https://hub.dig.net)

## Drops — revelado, lista de acceso, fases {#drops--reveal-allowlist-phases}

La mecánica de drop se presenta **honestamente**: lo que se aplica en cadena hoy vs. lo que es una conveniencia fuera de cadena pendiente del primitivo claim-coin. Nunca presentamos una garantía que aún no podemos demostrar en cadena.

→ [Construye una dapp en Chia](../build-a-dapp/tutorial.md) para el hilo completo de mint de principio a fin.

## Construye gastos con el SDK — nunca los hagas a mano {#build-spends-with-the-sdk--never-hand-roll}

Cada gasto de coin es construido por el wasm canónico CHIP-0035 y reexportado en `@dignetwork/dig-sdk/spend`. El flujo siempre es **construir → firmar → transmitir**, dividido para que la wallet solo firme.

→ [Construyendo gastos](../spends.md) · [El DIG SDK](../sdk.md)

## Monetiza y restringe el acceso — el Paywall {#monetize--gate--the-paywall}

El `Paywall` del SDK combina el proveedor con el constructor de gastos para **pago por desbloqueo** y **acceso restringido por NFT / propiedad de colección** — sin conectar gastos a mano.

→ [El DIG SDK → Paywall](../sdk.md#paywall)

## Ofertas — hacer / tomar / mostrar {#offers--make--take--show}

Intercambia NFTs por XCH o CATs con `dig-store offer make | take | show` (cada uno `--dry-run` / `--json`). → [Referencia de comandos](../digstore/cli/command-reference.md)

---

## Profundiza: el protocolo {#go-deeper-the-protocol}

- **"capsule infalsificable"** → [Pruebas y seguridad](../digstore/format/proofs-and-security.md) · [El modelo de capsule y store](../digstore/format/store-structure.md)
- **"nunca hagas un gasto a mano"** → [Gastos de store-coin CHIP-0035 y delegación](../chip-0035-spends-and-delegation.md)
- **Todo** → [Inmersión profunda en el protocolo](../protocol-deep-dive.md) · [Conceptos y glosario](../concepts.md)
