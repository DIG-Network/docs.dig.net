---
sidebar_position: 1
title: For app developers
description: "Lanza un sitio web o app que TÚ posees — acuñado en cadena como tu propio activo, no alquilado. Construye y previsualiza gratis; paga un pequeño precio uniforme en $DIG solo cuando publicas, con los archivos cifrados en tu navegador para que ningún host pueda leerlos."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# For app developers {#for-app-developers}

> **Lanza un sitio web o app que TÚ POSEES** — acuñado en cadena como tu propio activo, no alquilado. Construye y previsualiza **gratis**; paga un pequeño **precio uniforme en $DIG** solo cuando publicas, con los archivos **cifrados en tu navegador** para que ningún host pueda leerlos.

## El modelo mental {#the-mental-model}

Un **[store](../concepts.md#store)** es la identidad permanente de tu sitio web — un singleton en cadena que controlas. Cada vez que publicas, acuñas un **[capsule](../concepts.md#capsule)** inmutable = `storeId:rootHash`. Un store es simplemente la secuencia de capsules que has publicado a lo largo del tiempo.

Dos puertas de entrada llevan al **mismo** ciclo de construcción gratuita → publicación pagada:

- **El camino web** — [DIGHUb](../concepts.md#dighub) en [hub.dig.net](https://hub.dig.net): suelta una carpeta construida, previsualiza gratis, conecta una wallet solo al Publicar.
- **El camino CLI / CI** — la CLI [`dig-store`](../concepts.md#digstore-cli) + [`create-dig-app`](../concepts.md#create-dig-app) + la [GitHub deploy Action](../concepts.md#deploy-action).

Generar, construir y previsualizar no cuesta **nada**. Pagas solo cuando publicas un capsule.

| Lo que haces | Costo |
|---|---|
| Generar, construir, previsualizar un borrador | **Gratis** |
| Publicar tu primer capsule (acuñar un store) | **precio uniforme del capsule en $DIG** + pequeña comisión de XCH |
| Publicar cada actualización (un nuevo capsule) | **precio uniforme del capsule en $DIG** + pequeña comisión de XCH |

## Empieza aquí {#start-here}

- **[Quickstart — lanza un sitio en 10 minutos](../quickstart.md)** — el camino más rápido, web o CLI.

## Publicar desde la web — DIGHUb {#publish-from-the-web--dighub}

[**Inicia un nuevo store en DIGHUb ↗**](https://hub.dig.net/new). Suelta tu sitio construido (tu carpeta `dist/` o `build/`), obtén una **previsualización de borrador gratuita** en la vía de lectura real, y conecta una wallet solo en el paso de **Publicar**. Consulta el recorrido web en [Quickstart → Publicar desde la web](../quickstart.md#a-publish-from-the-web).

## Publicar desde la CLI — dig-store {#publish-from-the-cli--digstore}

El ciclo con forma de Git: `new` → `dev` → `init` → `commit`.

```sh
digs new vite-react   # genera un proyecto ejecutable — gratis, sin mint
digs dev              # previsualiza en la vía de lectura real chia://, recarga en vivo — gratis
digs init site --dir dist   # acuña el primer capsule del store (precio uniforme + comisión de XCH)
digs commit -m "v1.1"       # publica una actualización — un nuevo capsule
```

→ [Quickstart de la CLI](../digstore/cli/quickstart.md) · [El flujo de trabajo completo del proyecto](../digstore/cli/project-workflow.md)

## Genera una app — 5 plantillas {#scaffold-an-app--5-templates}

Empieza desde una plantilla de partida ejecutable y conectada a la wallet — `static`, `vite-react`, `next-static`, `nft-drop` o `dapp-window-chia` — vía `digs new <template>` o `npm create dig-app`.

→ [Genera una app](../build-a-dapp/scaffold.md)

## Previsualiza gratis con `digs dev` {#preview-free-with-digstore-dev}

`digs dev` sirve tu proyecto sobre la vía de lectura **genuina** de DIG (cifrar → compilar → verificar → descifrar) con recarga en vivo y un `window.chia` de desarrollo inyectado. Lo que ves es lo que verán los visitantes — y nada se acuña ni se gasta.

→ [Quickstart de la CLI → desarrollar y previsualizar](../digstore/cli/quickstart.md)

## `dig.toml` — el manifiesto commiteable {#digtoml--the-committable-manifest}

`dig.toml` en la raíz de tu proyecto contiene `store-id`, `output-dir`, `build-command`, `remote` y otra configuración — compartida por `digs dev`, `digs deploy` y las plantillas de scaffold. No contiene **ningún secreto** (esos vienen del entorno), así que puedes commitearlo.

→ [Configuración del proyecto y valores en tiempo de compilación](../digstore/cli/configuration.md)

## Actualizaciones y versiones — cada publicación es un nuevo capsule {#updates--versions--each-publish-is-a-new-capsule}

Cada publicación sella la build actual en un **nuevo capsule inmutable** y avanza la raíz en cadena de tu store. Los capsules antiguos siguen siendo legibles; el store siempre resuelve a su versión más reciente a menos que un lector fije un `rootHash` específico.

→ [Anclaje en cadena](../digstore/cli/onchain-anchoring.md)

## Qué cuesta {#what-it-costs}

Gratis para construir y previsualizar; un **precio uniforme en $DIG** por cada capsule publicado, más una pequeña comisión de red en XCH — incluida **atómicamente** en el mismo gasto en cadena. El precio es uniforme por capsule por diseño (para que la longitud del capsule no revele nada sobre tu contenido). Consigue $DIG en TibetSwap, dexie.space o 9mm.pro.

→ [Dónde conseguir DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [¿Por qué todo capsule tiene el mismo precio?](../support/faq.md#why-uniform-price)

## Push-to-deploy desde GitHub Actions {#push-to-deploy-from-github-actions}

Configura `dig-network/deploy-action` para que cada push publique un nuevo capsule — con una protección `if-changed` que hace que una build idéntica byte a byte sea un no-op (sin gasto).

→ [Deploy desde GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Agrega una dirección web `*.on.dig.net` (opcional) {#add-a-ondignet-web-address-optional}

Tu store es alcanzable por su dirección [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) en el momento en que se confirma — sin costo adicional. Un handle amigable `<nombre>.on.dig.net` es un registro **opcional y pagado** en DIGHUb, sobre eso.

→ [¿Puedo usar mi propio dominio?](../support/faq.md#can-i-use-my-own-domain)

---

## Profundiza: el protocolo {#go-deeper-the-protocol}

El modelo en lenguaje llano de arriba es todo lo que necesitas para lanzar. Cuando quieras el diseño completo:

- **"un store es una secuencia de capsules"** → [Conceptos y glosario](../concepts.md#capsule) · [El modelo de capsule y store](../digstore/format/store-structure.md)
- **"archivos cifrados en tu navegador"** → [URNs y cifrado](../digstore/format/urns-and-encryption.md)
- **"un precio uniforme + gasto atómico en $DIG"** → [Anclaje en cadena](../digstore/cli/onchain-anchoring.md#costs) · [Gastos de store-coin CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Todo** → [Inmersión profunda en el protocolo](../protocol-deep-dive.md)
