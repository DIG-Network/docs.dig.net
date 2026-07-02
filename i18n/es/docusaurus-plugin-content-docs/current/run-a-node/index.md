---
sidebar_position: 1
title: Run a DIG node
description: "Qué es un dig-node, por qué querrías ejecutar uno, y cómo instalarlo — el repositorio apt para Ubuntu/Debian o el instalador universal multiplataforma."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Run a DIG node {#run-a-dig-node}

> **Sirve contenido de forma demostrable y ciega al proveedor** — solo tocas texto cifrado indistinguible identificado por hashes, puedes certificar un servicio fiel con pruebas de ejecución, y el cliente verifica todo contra la cadena, así que la confianza nunca recae en tu nodo.

Un **dig-node** es el **servidor** de contenido de DIG Network — el lado de la oferta de la red. Hospeda capsules, mantiene una caché local `.dig`, y expone el [dig RPC](../rpc/what-is-the-dig-rpc.md) para que cualquier cosa que lea contenido de DIG pueda leerlo desde ti. Se ejecuta sin interfaz gráfica (sin navegador, sin UI) como un servicio en segundo plano — un seedbox para el contenido que publicas o que quieres ayudar a servir.

Es la contraparte de los **consumidores** — el [DIG Browser](../browser/chia-protocol.md) y la extensión de navegador — que obtienen texto cifrado + pruebas, verifican contra la raíz en cadena, descifran localmente y renderizan. **No** necesitas un dig-node para leer contenido de DIG: un consumidor solo funciona bien, recurriendo al nodo de referencia público en `rpc.dig.net`. Ejecutas un dig-node para **servir** — y cuando hay uno presente en la misma máquina, el consumidor lee de él (local, amigable sin conexión, y contribuyendo a la red) y comparten una caché `.dig`.

:::info Servir vs. consumir
- **dig-node** = sirve contenido + expone el dig RPC. Servicio en segundo plano sin interfaz gráfica.
- **DIG Browser / extensión** = consumen contenido (verifican + descifran localmente). No requieren un nodo local.

Cuando ambos están instalados, el navegador/extensión lee de tu dig-node local; de lo contrario lee de `rpc.dig.net`. De cualquier manera, cada byte se verifica del lado del cliente contra la cadena — nunca se confía en la fuente.
:::

## Instálalo {#install-it}

| Tu máquina | Usa |
|---|---|
| **Ubuntu / Debian** | El **[repositorio apt](./apt.md)** nativo — `apt install dig-node digstore`, auto-habilitado como servicio systemd. |
| **Windows / macOS / Linux (cualquiera)** | El **[instalador universal](#universal-installer-any-os)** multiplataforma — un `curl \| sh` (o descarga) para cualquier sistema operativo. |

Ambos instalan el mismo servicio `dig-node` más la CLI de `digstore`. apt es el camino nativo de Debian (firmado, actualizable con `apt upgrade`); el instalador universal cubre todo lo demás.

### apt (Ubuntu / Debian) — recomendado en sistemas de la familia Debian {#apt-ubuntu--debian--recommended-on-debian-family-systems}

El camino nativo: un repositorio apt firmado en `apt.dig.net`. Instala `dig-node` como un **servicio systemd** gestionado y lo mantiene actualizado con `apt upgrade`.

→ **[Instalar en Ubuntu/Debian vía apt](./apt.md)**

### Instalador universal (cualquier SO) {#universal-installer-any-os}

El camino multiplataforma — Windows, macOS y cualquier Linux. Detecta tu sistema operativo, instala el servicio `dig-node` (servicio de Windows / `systemd` / `launchd`) y la CLI de `digstore`, y no necesita ningún gestor de paquetes:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

Este es el mismo `dig-installer` autocontenido publicado en la [página de Releases](https://github.com/DIG-Network/dig-installer/releases) — descárgalo y ejecútalo directamente si prefieres no canalizarlo a un shell, o en Windows.

:::note Pre-lanzamiento
Los instaladores hospedados (`apt.dig.net`, `dig.net/install.sh`) todavía se están aprovisionando. Hasta que estén en vivo, compila desde el código fuente u obtén un binario de los [Releases de dig-node](https://github.com/DIG-Network/dig-node/releases). Los comandos aquí son los reales, los previstos.
:::

## ¿Solo quieres leer contenido? {#just-want-to-read-content}

No necesitas un nodo. Consigue el **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** y abre cualquier dirección `chia://` — consume de tu dig-node local si tienes uno, si no, de `rpc.dig.net`. Consulta [El protocolo chia://](../browser/chia-protocol.md).

## Relacionado {#related}

- [Instalar en Ubuntu/Debian vía apt](./apt.md) — el camino nativo de Debian + gestión del servicio systemd
- [Instalar en cualquier lugar — el instalador universal](./universal-installer.md) — Windows / macOS / cualquier Linux + `dig.local`
- [Apunta un consumidor a tu nodo](./point-a-consumer.md) — lecturas locales por defecto + la caché `.dig` compartida
- [Configura dig-node](./configure.md) — puertos, listeners, límite de caché, upstream
- [Auto-hospeda un origen remoto](../rpc/dig-remote.md) — `digstore serve` + clone/pull/push por dig://
- [Gestiona tu nodo](./manage.md) — los RPCs de administración control.* y la UI My Node
- [Usando el RPC de la red pública](../rpc/public-network-rpc.md) — el dig RPC que habla tu nodo, y cómo operar un nodo en la red
- [Instalar la CLI](../digstore/cli/install.md) — `digstore` por su cuenta (publicar, no servir)

## Profundiza: el protocolo {#go-deeper-the-protocol}

- **"host ciego y decoys"** → [El modelo de servicio ciego del dig RPC](../rpc/what-is-the-dig-rpc.md) · [Conformidad de nodo](../rpc/conformance.md)
- **"certificar un servicio fiel"** → [Pruebas de inclusión vs. de ejecución](../inclusion-vs-execution-proofs.md)
- **"clone/pull/push por dig://"** → [El protocolo remoto §21/§22](../rpc/dig-remote.md)
- **Todo** → [Inmersión profunda en el protocolo](../protocol-deep-dive.md) · [Conceptos y glosario](../concepts.md)
