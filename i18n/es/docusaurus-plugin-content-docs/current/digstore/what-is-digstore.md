---
sidebar_position: 1
title: What is DigStore?
description: "Proyecto direccionable por contenido con forma de Git, con cifrado integrado y direccionamiento basado en URN; compila a un único módulo WebAssembly autodefendido."
keywords:
  - DigStore
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# What is DigStore? {#what-is-digstore}

**DigStore es un proyecto cifrado y direccionable por contenido, con forma de Git, que compila a un único módulo WebAssembly autodefendido.**

Obtienes comandos al estilo Git — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — para un proyecto que está **cifrado en reposo** y compila en **un único archivo `.wasm`**. Ese único archivo es *a la vez tus datos y el servidor que controla el acceso a ellos*. Un host que lo almacena o retransmite solo ve texto cifrado direccionado por hashes; no puede leer lo que lleva.

Direccionas el contenido con una **[URN](./format/urns-and-encryption.md)**, y la URN *es* la clave: a la vez localiza y descifra. Entrega a alguien una URN y podrá leer ese recurso; sin ella no podrá — no hay contraseña separada ni lista de acceso que administrar.

A diferencia de Git, DigStore está construido para el **resultado de una build**, no para el código fuente de un repositorio. Apuntas un proyecto a un directorio como `dist/` y captura lo que hay allí.

## Por qué existe {#why-it-exists}

| Problema | La respuesta de DigStore |
|---|---|
| Los hosts pueden leer / escanear lo que publicas | El contenido está cifrado en reposo; el host solo tiene texto cifrado identificado por hashes |
| El control de acceso implica contraseñas y ACLs | La URN *es* la capacidad — compártela para otorgar lectura, retenla para negarla |
| Tienes que confiar en el servidor para que sirva bytes genuinos | `clone`/`pull` verifican el store id del módulo, la raíz firmada del publicador y la **raíz del singleton en cadena** antes de instalar — falla en modo cerrado |
| "¿Qué tan grande es este payload?" se filtra por el tamaño del archivo | Cada proyecto es un único `.wasm`, rellenado a un tamaño uniforme que no revela nada sobre su contenido |
| La lógica de servicio vive separada de los datos | Los datos y el código que controla el acceso a ellos compilan en el *mismo* módulo |

## Cómo leer esta documentación {#how-to-read-these-docs}

- **[El formato DigStore](./format/overview.md)** — los conceptos: proyectos, despliegues, el módulo `.wasm`, URNs, cifrado y pruebas. Empieza aquí si quieres entender *qué* es DigStore.
- **[Tutorial de la CLI](./cli/install.md)** — instala la CLI y úsala en un proyecto real: inicializa un proyecto, captura un directorio de build, haz commit de despliegues, comparte sobre un remoto y transmite contenido de vuelta.

Si solo quieres probarlo, ve directo al **[Quickstart](../quickstart.md)** (el camino gratuito, web-first) o al **[tutorial de la CLI](./cli/quickstart.md)**.

:::note
DigStore es parte de [DIG Network](https://dig.net). El diseño técnico completo vive en la sección de [Protocolo](../protocol-deep-dive.md) — el formato de store WASM direccionable por contenido.
:::

## Relacionado {#related}

- [El formato DigStore](./format/overview.md) — proyectos, el módulo WASM, URNs, cifrado, pruebas
- [Estructura del store](./format/store-structure.md) — identidad del store, generations y el módulo compilado
- [URNs y cifrado](./format/urns-and-encryption.md) — la URN que a la vez direcciona *y* descifra
- [Tutorial de la CLI](./cli/quickstart.md) — crea, haz commit y lee un store en minutos
- [Conceptos y glosario](../concepts.md) — las entidades centrales de DIG de un vistazo
