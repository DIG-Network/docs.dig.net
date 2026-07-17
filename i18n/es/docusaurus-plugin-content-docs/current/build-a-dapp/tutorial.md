---
sidebar_position: 1
title: Build a dapp on Chia
description: "De principio a fin: genera una app React, conecta la wallet de Chia integrada en la página (window.chia + respaldo WalletConnect) con el dig-sdk, construye y firma un gasto vía el wasm de chip35, luego despliega en cadena y agrega un dominio personalizado — un solo hilo a través de cada primitivo de DIG."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digs deploy
  - custom domain
tags:
  - digstore-cli
  - window-chia
  - dig-rpc
  - chip-0035
  - dighub
  - capsule
  - anchoring
---

# Build a dapp on Chia {#build-a-dapp-on-chia}

Cada primitivo de DIG está documentado por su cuenta — scaffolding, la wallet integrada en la página, la vía de lectura, los gastos, el deploy. **Esta página es el hilo único que los une en una sola dapp desplegada.** Empezarás desde una carpeta vacía y terminarás con una app React consciente de la wallet, en vivo en cadena en tu propio dominio.

Todo el ciclo hasta la publicación es **gratis** — generar, desarrollar y previsualizar no cuestan nada. Pagas el **precio uniforme del capsule en $DIG** solo en el paso de deploy.

```
new ──▶ dev ──▶ conectar wallet (dig-sdk) ──▶ construir un gasto (chip35) ──▶ deploy ──▶ dominio personalizado
gratis  gratis          gratis                       gratis          precio del capsule    gratis
```

## Lo que necesitarás {#what-youll-need}

- La [CLI de `dig-store`](../digstore/cli/install.md) instalada.
- Node 18+ y `npm`.
- Una wallet de Chia financiada — **solo en el paso de deploy** (el precio uniforme del capsule en $DIG + una pequeña comisión de XCH). Todo lo anterior es gratis.

---

## 1. Genera una app React — gratis, sin cadena {#1-scaffold-a-react-app--free-no-chain}

`digs new` escribe un proyecto ejecutable y conectado a la wallet. Elige la plantilla de React:

```sh
digs new vite-react my-dapp
cd my-dapp
```

Obtienes una app Vite + React, un `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`), y un `App.jsx` ya conectado a la wallet integrada en la página. No se acuña ningún store y no se gasta nada — `new` es puramente local.

:::tip ¿Prefieres npm? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` genera la misma plantilla directamente desde npm — la puerta de entrada en JS, sin necesidad de instalar `dig-store` para empezar. Consulta [Genera una app](./scaffold.md) para las cinco plantillas y cómo se comparan las dos puertas de entrada.
:::

## 2. Desarrolla contra la vía de lectura real — gratis {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev` ejecuta tu build, sirve el resultado sobre la vía de lectura **genuina** `chia://` (compilar → verificar → descifrar), e inyecta un **shim de desarrollo `window.chia`** para que puedas construir el flujo de wallet sin una wallet real. Edita `src/App.jsx`, guarda, y la página se recarga en vivo — exactamente lo que obtendrán los visitantes, con cero interacción con la cadena y cero gasto.

## 3. Conecta la wallet con el SDK — `window.chia` + respaldo WalletConnect {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

El scaffold habla directamente con `window.chia`, lo cual es perfecto dentro del [DIG Browser](../browser/using-window-chia.md). Para también dar soporte a usuarios en otros navegadores, agrega el SDK — **prefiere la wallet `window.chia` inyectada y recurre a WalletConnect → Sage** detrás de una superficie normalizada, así que escribes el flujo de wallet una sola vez.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # opcional: solo para el respaldo de WalletConnect
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" prefiere la wallet inyectada del DIG Browser, si no, WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // un valor PÚBLICO en tiempo de compilación
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // renderiza un QR
      },
    });
    setAddress(await provider.getAddress());
  }

  return (
    <main>
      <h1>My DIG dapp</h1>
      <button onClick={login}>Connect wallet</button>
      {address && <p>Connected: {address}</p>}
    </main>
  );
}
```

Un solo `connect()` funciona en el DIG Browser (sin QR, sin relay) y en cualquier otro lugar (WalletConnect). `provider.backend` te dice qué transporte se conectó. Los nombres de método y las formas de resultado son idénticos en ambos casos — consulta [Usando `window.chia`](../browser/using-window-chia.md) para la guía de integración, o [la especificación normativa del proveedor `window.chia`](../protocol/window-chia-provider.md) para el contrato exacto de método/parámetro/retorno/error.

:::note El project id de WalletConnect es un valor PÚBLICO en tiempo de compilación
`VITE_WC_PROJECT_ID` se compila dentro de tu bundle y es legible por cualquiera — eso es correcto para un id de nube de WalletConnect. **Nunca** pongas una semilla de wallet, una clave de deploy, o ningún secreto en el bundle: un capsule es un [artefacto estático ciego sin secretos de servidor](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Construye y firma un gasto — el wasm de chip35, vía el SDK {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Cuando tu dapp necesita hacer algo en cadena (acuñar un store, actualizar metadatos, construir un pago en CAT), construye el gasto con el **constructor canónico de gastos CHIP-0035** y se lo entrega a la wallet para firmar. El SDK reexporta ese constructor en la subruta `/spend` — **nunca haces un paquete de gasto a mano**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // el constructor wasm de chip35

async function doSpend() {
  spend.init();

  // Construye gastos de coin con el constructor wasm, p. ej. spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). El constructor es
  // offline y puro — sin claves, sin red.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Entrégalos a la wallet para firmar (la wallet tiene las claves, no tu dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → combina en un paquete de gasto y transmítelo.
}
```

Este es exactamente el patrón que usa el hub: **construir el paquete en el navegador con el wasm, firmarlo con la wallet.** El constructor de gastos es la única fuente canónica de paquetes de gasto en todo el ecosistema, así que tu dapp produce gastos idénticos byte a byte a los del hub y la CLI.

Para **leer** contenido verificado y cifrado de vuelta (p. ej. renderizar los datos de otro store dentro de tu dapp), usa el `DigClient` del SDK:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // por defecto usa https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // el ancla de confianza, leída de la cadena
});
```

`DigClient` deriva las claves de la URN en el navegador, verifica la inclusión contra la raíz en cadena, y descifra — el host de servicio permanece ciego. Consulta [¿Qué es el dig RPC?](../rpc/what-is-the-dig-rpc.md).

:::tip ¿Cobras por el acceso? Usa `Paywall`
Para monetizar — pago por desbloqueo de contenido, o restringirlo a la posesión de un NFT — el SDK incluye un helper de alto nivel **`Paywall`** que combina un `ChiaProvider` conectado con el constructor de gastos para que no conectes los pagos a mano: `paywall.requestPayment({ amount, owner })` paga al propietario de la dapp y devuelve un recibo, y `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` controlan el acceso.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }
```
:::

## 5. Despliega en cadena {#5-deploy-on-chain}

Construyes y previsualizas gratis; este es el único paso que gasta. Primero crea el store **una vez**:

```sh
digs init my-dapp --dir dist      # acuña el primer capsule del store (precio uniforme del capsule + comisión de XCH)
```

`init` acuña un singleton de Chia en la mainnet — **el launcher id se convierte en el id de tu store**. Cópialo en `dig.toml` (`store-id = "<64-hex>"`). A partir de ahí, un solo comando construye y publica un nuevo capsule:

```sh
digs deploy --json                # ejecuta build-command, prepara dist/, avanza la raíz
```

Cada `deploy` publica un nuevo capsule inmutable por el precio uniforme del capsule. En el momento en que se confirma, tu dapp es **legible a través del [dig RPC](../rpc/what-is-the-dig-rpc.md)** por su dirección [URN](../concepts.md#urn) / `chia://` — cifrada, verificada, e imposible de dar de baja, sin registro y sin nada más que pagar. (Una dirección web amigable `*.on.dig.net` es un paso separado y opcional — consulta [la siguiente sección](#6-put-it-on-your-own-domain).) Para push-to-deploy en cada commit, configura [Deploy desde GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## 6. Ponlo en tu propio dominio {#6-put-it-on-your-own-domain}

Tu store ya es alcanzable por su dirección URN / `chia://` — pero para una URL web amigable registras un nombre. Un store obtiene un subdominio `*.on.dig.net` cuando **registras un handle** para él en DIGHUb: un registro pagado y separado que fija el store a ese nombre (sin registro → sin dirección `*.on.dig.net`). Para servirlo desde un dominio que ya posees, agrega un **dominio personalizado con TLS en [DIGHUb ↗](https://hub.dig.net)** — apunta tu dominio al store y DIGHUb gestiona el certificado. De cualquier manera, tu dapp carga desde una URL amigable mientras permanece totalmente descentralizada por debajo.

Cuando lleguen los handles `.dig` de CHIP-54, un store también será direccionable por un nombre `.dig` legible por humanos; hasta entonces, los dominios personalizados vía DIGHUb son la forma de dar marca a un despliegue.

---

## Lanzaste una dapp {#you-shipped-a-dapp}

Fuiste desde una carpeta vacía hasta una app React consciente de la wallet, en vivo en la mainnet de Chia en tu propio dominio, tocando cada primitivo: [scaffolding](../digstore/cli/quickstart.md), la [wallet integrada en la página](../browser/using-window-chia.md), el [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), el [constructor de gastos](https://github.com/DIG-Network/chip35_dl_coin), la [vía de lectura](../rpc/what-is-the-dig-rpc.md), y el [deploy](../digstore/cli/deploy-from-github-actions.md). Clona una versión terminada desde la [galería de ejemplos](./example-gallery.md).

## Relacionado {#related}

- [Genera una app (create-dig-app)](./scaffold.md) — las cinco plantillas y las puertas de entrada de npm vs. CLI
- [Galería de ejemplos](./example-gallery.md) — clona una dapp terminada y ábrela en una plantilla
- [Usando window.chia](../browser/using-window-chia.md) — el proveedor de wallet integrado en la página, en detalle
- [La especificación del proveedor window.chia](../protocol/window-chia-provider.md) — el contrato normativo y versionado del proveedor
- [Configuración del proyecto y valores en tiempo de compilación](../digstore/cli/configuration.md) — dig.toml + configuración PÚBLICA
- [Deploy desde GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-deploy en CI
- [¿Qué es el dig RPC?](../rpc/what-is-the-dig-rpc.md) — leer contenido verificado y cifrado
- [Quickstart](../quickstart.md) — el camino más corto de "lanzar un sitio"
- [Conceptos y glosario](../concepts.md) — capsule, store, URN y window.chia definidos
