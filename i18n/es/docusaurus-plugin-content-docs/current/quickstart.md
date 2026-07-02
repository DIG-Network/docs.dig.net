---
sidebar_position: 2
title: Quickstart
description: "Lanza tu primer sitio en DIG — gratis para construir y previsualizar, solo pagas el precio uniforme del capsule cuando publicas. Camino web-first (sin wallet para empezar) más una vía paralela por CLI."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Quickstart {#quickstart}

Lanza un sitio a una red que ningún host puede leer, cambiar o dar de baja — en unos diez minutos.

**Construyes y previsualizas gratis.** El scaffolding y la previsualización no cuestan nada; pagas el **precio uniforme del capsule en $DIG** solo en el momento en que publicas un [capsule](./concepts.md#capsule) en cadena. *Itera gratis, publica cuando esté listo.*

Dos formas de hacerlo. La mayoría empieza en la web.

- **[A. Publicar desde la web](#a-publish-from-the-web)** — en [DIGHUb](./concepts.md#dighub), conecta una wallet al final. Ideal para sitios y frontends. ~10 min.
- **[B. Publicar desde la CLI](#b-publish-from-the-cli)** — `digstore` en tu máquina, scriptable y listo para CI. Ideal para devs y automatización.

---

## A. Publicar desde la web {#a-publish-from-the-web}

El camino más rápido: construye y previsualiza en el navegador, financia una wallet solo en el paso final.

### 1. Abre DIGHUb e inicia un borrador — gratis, sin wallet {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**Inicia un nuevo store en DIGHUb ↗**](https://hub.dig.net/new). Suelta tu sitio ya construido (una carpeta de archivos estáticos — tu `dist/` o `build/`). DIGHUb te da una **previsualización de borrador gratuita** de exactamente cómo se servirá, sin nada en cadena y sin gastar $DIG.

Todavía no necesitas una wallet. Itera el borrador tantas veces como quieras — vuelve a subir, vuelve a previsualizar — completamente gratis.

### 2. Previsualízalo en la vía de lectura real — aún gratis {#2-preview-it-on-the-real-read-path--still-free}

La previsualización renderiza tu sitio a través del pipeline genuino de DIG (cifrar → compilar → verificar → descifrar), así que lo que ves es lo que verán los visitantes. Recorre el sitio, revisa los recursos y el enrutamiento. Nada se publica y nada se gasta hasta que tú lo decidas.

### 3. Publica — financia y conecta una wallet {#3-publish--fund-and-connect-a-wallet}

Cuando el borrador se vea bien, presiona **Publicar**. Este es el único paso que cuesta algo:

- Conecta una wallet de Chia (tu wallet *es* tu cuenta — sin correo, sin contraseña).
- Aprueba el gasto en cadena: el **precio uniforme del capsule en $DIG + una pequeña comisión de XCH**, en una sola firma. La pantalla de publicación muestra el monto exacto en $DIG antes de firmar.
- DIGHUb acuña tu store y publica el primer **capsule** en la mainnet de Chia.

¿Te falta DIG? La pantalla de publicación muestra tu saldo y dónde recargar. Consulta [Dónde conseguir DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space o 9mm.pro.

### 4. Ya estás en vivo {#4-youre-live}

Tu capsule ya está anclado en cadena y es **inmediatamente legible por el [dig RPC](./concepts.md#dig-rpc)** — cualquiera puede obtenerlo y verificarlo por su [URN `urn:dig:`](./concepts.md#urn) o su dirección [`chia://`](./browser/chia-protocol.md), sin registro y sin nada más que pagar. La URN es tanto la dirección *como* la clave; compártela para compartir el contenido. La vía de lectura es universal y gratuita; está en vivo en el momento en que el capsule se confirma.

**¿Quieres una dirección `*.on.dig.net` amigable?** Eso es opcional. Un store obtiene un subdominio `*.on.dig.net` solo cuando **registras un handle** para él en DIGHUb — un registro pagado y separado que fija el store a ese nombre. Hasta que registres uno, no hay URL `*.on.dig.net` (la dirección URN / `chia://` de arriba es siempre la forma canónica de llegar a él). Consulta [¿Puedo usar mi propio dominio?](./support/faq.md#can-i-use-my-own-domain).

**Para lanzar una actualización más tarde:** edita, previsualiza el nuevo borrador gratis y publica de nuevo. Cada actualización publicada es un nuevo capsule y cuesta de nuevo el **precio uniforme del capsule** — solo pagas cuando promueves un borrador a una versión permanente en cadena.

:::tip Automatízalo
Una vez que tu store existe, configura [Deploy desde GitHub Actions](./digstore/cli/deploy-from-github-actions.md) para que cada push a `main` publique un nuevo capsule — git-push-to-deploy.
:::

---

## B. Publicar desde la CLI {#b-publish-from-the-cli}

El mismo flujo desde tu terminal — scriptable y la base para CI. La CLI refleja el camino web: construir y previsualizar no cuestan nada; publicar un capsule cuesta el precio uniforme del capsule en $DIG.

### 1. Instalar {#1-install}

```sh
# descarga el instalador para tu sistema operativo desde la página de Releases, luego:
digstore --version
```

Consulta [Instalar la CLI](./digstore/cli/install.md) para los instaladores por sistema operativo y la compilación desde el código fuente.

### 2. Scaffold y previsualiza — gratis, sin cadena, sin gasto {#2-scaffold-and-preview--free-no-chain-no-spend}

Genera un proyecto y previsualízalo localmente — **gratis, sin mint, sin cadena** — antes de gastar nada:

```sh
digstore new <template>   # scaffold de un proyecto conectado a la wallet (static · vite-react · next-static · nft-drop · dapp-window-chia) — gratis, sin mint
digstore dev              # observa + compila al guardar + sirve la vía de lectura real chia://, con un window.chia inyectado — gratis, recarga en vivo
```

`new` escribe un proyecto ejecutable (un `dig.toml` + una app de partida); `dev` lo sirve sobre la vía de lectura genuina de DIG (compilar → verificar → descifrar) con recarga en vivo. Pagas el precio uniforme del capsule solo cuando publicas (siguientes pasos). O compila con tu toolchain habitual (`npm run build` → `dist/`) y publica ese resultado.

:::tip ¿Prefieres npm? Usa `create-dig-app`
Si vives en el mundo de Node, `npm create dig-app@latest my-app -- --template vite-react` genera las mismas plantillas directamente desde npm — sin necesidad de instalar `digstore` para empezar. Consulta [Genera una app](./build-a-dapp/scaffold.md).
:::

### 3. Configura una wallet (solo necesaria para publicar) {#3-set-up-a-wallet-only-needed-to-publish}

Publicar gasta fondos reales, así que primero necesitas una semilla y una wallet financiada:

```sh
digstore seed generate      # genera una mnemónica nueva (se muestra una sola vez — respáldala)
digstore balance            # muestra tu dirección de recepción; finánciala con XCH + DIG
```

Consulta [Anclaje en cadena](./digstore/cli/onchain-anchoring.md) para detalles de importación, financiamiento y TTL.

### 4. Publica tu primer capsule {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # acuña el primer capsule del store (precio uniforme del capsule + comisión de XCH)
```

`init` acuña un singleton de Chia en la mainnet — **el launcher id se convierte en el id de tu store** — y bloquea hasta que se confirme.

### 5. Lanza actualizaciones {#5-ship-updates}

```sh
npm run build                      # produce dist/
digstore add -A                    # prepara toda la raíz de contenido
digstore commit -m "v1.1"          # publica un nuevo capsule (precio uniforme del capsule + comisión de XCH)
```

Para CI, un solo comando hace add → commit → push e imprime la URL:

```sh
digstore deploy --output-dir dist --json   # avanza un store existente desde CI; nunca acuña
```

Consulta [Deploy desde GitHub Actions](./digstore/cli/deploy-from-github-actions.md).

### 6. Léelo de vuelta {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # una URN que a la vez localiza Y descifra
```

---

## Qué cuesta {#what-it-costs}

| Lo que haces | Costo |
|---|---|
| Generar, construir, previsualizar un borrador | **Gratis** |
| Publicar tu primer capsule (`init` / Publicar en DIGHUb) | **precio uniforme del capsule en $DIG** + pequeña comisión de XCH |
| Publicar cada actualización (`commit` / volver a publicar) | **precio uniforme del capsule en $DIG** + pequeña comisión de XCH |

El precio es **uniforme por capsule** en todas partes — consulta [por qué el precio es uniforme](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## ¿Atascado? {#stuck}

- [Resolución de problemas](./support/troubleshooting.md) — los fallos comunes y sus soluciones.
- [Preguntas frecuentes](./support/faq.md) — respuestas rápidas.
- [Obtener ayuda](./support/get-help.md) — la comunidad y cómo presentar un buen reporte.

## Relacionado {#related}

- [Conceptos y glosario](./concepts.md) — capsule, store, URN y pago en DIG definidos
- [Genera una app (create-dig-app)](./build-a-dapp/scaffold.md) — inicia un proyecto desplegable en un comando (npm o CLI)
- [Instalar la CLI](./digstore/cli/install.md) — obtén `digstore` en tu máquina
- [Anclaje en cadena](./digstore/cli/onchain-anchoring.md) — configuración de wallet, financiamiento y costos
- [Deploy desde GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — push-to-publish en CI
- [Tutorial de la CLI](./digstore/cli/quickstart.md) — el recorrido completo de crear-commit-leer
