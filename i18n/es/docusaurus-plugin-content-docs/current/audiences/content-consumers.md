---
sidebar_position: 5
title: For content consumers
description: "Abre contenido chia:// que tu propio navegador verifica contra la blockchain — ningún host puede alterarlo ni falsificarlo, el contenido privado permanece privado frente al host, y es permanente y re-hospedable en cualquier lugar, así que nadie puede darlo de baja ni encerrarte en un proveedor."
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# For content consumers {#for-content-consumers}

> **Abre contenido `chia://` que TU PROPIO navegador verifica contra la blockchain** — ningún host puede alterarlo ni falsificarlo, el contenido privado permanece privado frente al host, y es permanente y re-hospedable en cualquier lugar, así que nadie puede darlo de baja ni encerrarte en un proveedor.

## El modelo mental {#the-mental-model}

Pega un enlace `chia://` y el contenido llega directamente desde la red — **direccionado por contenido** y **verificado criptográficamente en TU dispositivo** antes de renderizarse. Es **fail-closed**: los bytes alterados o que no se pueden descifrar nunca se muestran.

- **Omite el `rootHash`** para la versión *más reciente* del store: `chia://<storeId>/`.
- **Inclúyelo** para fijar un [capsule](../concepts.md#capsule) inmutable exacto: `chia://<storeId>:<rootHash>/`.

El contenido público solo necesita el enlace. El contenido privado también necesita un secreto **`?salt=`** — como una contraseña.

## Consigue el DIG Browser, o la extensión {#get-the-dig-browser-or-the-extension}

- **[Consigue el DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — un navegador con `chia://` y una wallet integrada de fábrica.
- **La extensión** para Chrome / Edge / Brave / Firefox — agrega resolución de `chia://` a un navegador que ya usas.

## Abrir contenido chia:// — última versión vs. fijada {#open-chia-content--latest-vs-pinned}

Las formas de dirección, la barra limpia `chia://<store>/`, y cuándo fijar un `rootHash`.

→ [El protocolo chia://](../browser/chia-protocol.md)

## Páginas integradas, la insignia verificada y los escudos {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, y la insignia verificada / los escudos que muestran el veredicto de la prueba de inclusión de cada recurso para el capsule activo.

→ [Usando window.chia](../browser/using-window-chia.md)

## Público vs. privado — cuándo necesitas un secreto `?salt=` {#public-vs-private--when-you-need-a-salt-secret}

Los stores públicos se abren solo con el enlace; los stores privados requieren el salt secreto que deriva la clave de descifrado.

→ [Stores públicos vs. privados](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Público vs. privado — ¿cuál es la diferencia?](../support/faq.md#public-vs-private)

## Ejecuta contenido localmente (opcional) {#run-content-locally-optional}

Apunta tu navegador/extensión a un [dig-node](../concepts.md#dig-node) local para lecturas más rápidas y amigables sin conexión — comparten una caché `.dig`. Nunca *necesitas* un nodo para leer.

→ [Ejecuta un nodo](../run-a-node/index.md)

## Consigue $DIG {#get-dig}

No necesitas $DIG para *leer* contenido. Si quieres publicar, consigue $DIG en **TibetSwap**, **dexie.space** o **9mm.pro**.

→ [¿Dónde consigo DIG?](../support/faq.md#where-do-i-get-dig)

---

## Profundiza: el protocolo {#go-deeper-the-protocol}

- **"verificado contra la blockchain"** → [Anclaje en cadena](../digstore/cli/onchain-anchoring.md) · [Pruebas y seguridad](../digstore/format/proofs-and-security.md)
- **"salt público vs. privado"** → [URNs y cifrado](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"última versión vs. fijada"** → [Generations y root hashes](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Todo** → [Inmersión profunda en el protocolo](../protocol-deep-dive.md) · [Conceptos y glosario](../concepts.md)
