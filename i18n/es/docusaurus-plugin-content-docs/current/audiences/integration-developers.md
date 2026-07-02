---
sidebar_position: 3
title: For integration developers
description: "Una plataforma totalmente legible por máquinas — OpenAPI/OpenRPC, una taxonomía de errores catalogada, precios en vivo, JWKS, JSON por página, y un @dignetwork/dig-sdk tipado — para que conectes una wallet + lecturas verificadas en tu app sin rastrear ni una sola línea de prosa humana."
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

> **Una plataforma totalmente legible por máquinas** — OpenAPI/OpenRPC, una taxonomía de errores catalogada, precios en vivo, JWKS, JSON por página, y un `@dignetwork/dig-sdk` tipado — para que conectes una wallet + lecturas verificadas en tu app **sin rastrear ni una sola línea de prosa humana**.

## El modelo mental — dos superficies, mantenidas separadas {#the-mental-model--two-surfaces-kept-separate}

1. **Un plano de control REST** — `hub.dig.net/v1`, con bearer-JWT — para gestionar stores, dominios, equipos y NFTs.
2. **Una vía de lectura JSON-RPC 2.0 de dig, agnóstica al nodo** — `rpc.dig.net` — que transmite **texto cifrado verificado**.

Una superficie de **wallet** ([`window.chia` de CHIP-0002](../concepts.md#window-chia)) sobre dos transportes — inyectado (DIG Browser) o WalletConnect → Sage — unificados por el `ChiaProvider` del SDK. Los gastos siempre son construidos por el wasm canónico CHIP-0035 y firmados por la wallet del usuario — **nunca hechos a mano**. Ramifica según **códigos de error estables**, nunca según la prosa.

## Construye una dapp — de principio a fin {#build-a-dapp--end-to-end}

El hilo único desde el scaffold hasta una app consciente de wallet, en vivo en tu propio dominio.

→ [Construye una dapp en Chia](../build-a-dapp/tutorial.md)

## El DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, y los gastos canónicos reexportados en la subruta `/spend`. Instalación, subrutas y `capabilities()`.

→ [El DIG SDK](../sdk.md)

## Conecta una wallet — `window.chia` {#connect-a-wallet--windowchia}

Detecta el proveedor inyectado, llama a `connect()` (consentimiento por origen), y usa los métodos de CHIP-0002.

→ [Usando window.chia](../browser/using-window-chia.md) · especificación: [el proveedor window.chia](../protocol/window-chia-provider.md)

## Lee contenido verificado — `DigClient` + los métodos del dig RPC {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` transmite texto cifrado + pruebas de inclusión y **verifica-y-luego-descifra** del lado del cliente. Llama a los métodos directamente cuando lo necesites.

→ [¿Qué es el dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Métodos](../rpc/methods.md)

## Streaming y reensamblado {#streaming--reassembly}

El modelo de fragmentos, la [retrieval key](../concepts.md#retrieval-key), y el orden verificar-y-luego-descifrar.

→ [Streaming](../rpc/streaming.md)

## Construyendo gastos — el constructor canónico CHIP-0035 {#building-spends--the-canonical-chip-0035-builder}

La división **construir → firmar → transmitir**: el wasm construye el paquete de gasto, la wallet firma, tú transmites. El hub nunca hace un gasto a mano, y tú tampoco deberías.

→ [Construyendo gastos](../spends.md)

## El plano de control `/v1` del hub {#the-hub-v1-control-plane}

Autenticación (JWT / OIDC / emparejamiento de dispositivos), stores, dominios, analítica y webhooks sobre REST.

→ [Superficies legibles por máquinas](../machine-surfaces.md#openapi) para el documento OpenAPI.

## Deploy en CI — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Modos, OIDC sin claves, el enum de resultado, y la salida `--json` para pasos posteriores.

→ [Deploy desde GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Superficies legibles por máquinas {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — descubre e integra sin rastrear prosa.

→ [Superficies legibles por máquinas](../machine-surfaces.md)

## Códigos de error — ramifica según el código {#error-codes--branch-on-the-code}

Una referencia consolidada que cubre el dig RPC, la CLI, DIGHUb, el dig loader y el SDK.

→ [Códigos de error](../support/error-codes.md)

---

## Profundiza: el protocolo {#go-deeper-the-protocol}

- **"lecturas verificadas"** → [El dig RPC (interfaz de contenido de la red)](../rpc/what-is-the-dig-rpc.md) · [Pruebas de inclusión vs. de ejecución](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [la especificación normativa del proveedor](../protocol/window-chia-provider.md)
- **"retrieval_key y streaming"** → [URNs y cifrado](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **"un deploy token es una clave de escritura revocable"** → [Gastos y delegación CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Todo** → [Inmersión profunda en el protocolo](../protocol-deep-dive.md) · [Conceptos y glosario](../concepts.md)
