---
sidebar_position: 1
title: Build a dapp on Chia
description: "От начала до конца: соберите приложение на React, подключите встроенный кошелёк Chia (window.chia + резервный WalletConnect) через dig-sdk, постройте и подпишите трату через wasm chip35, затем задеплойте в блокчейн и добавьте собственный домен — единая нить через каждый примитив DIG."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - dig-store deploy
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

Каждый примитив DIG задокументирован по отдельности — скаффолдинг, встроенный кошелёк, путь чтения, траты, деплой. **Эта страница — единая нить, связывающая их всех в один выпущенный dapp.** Вы начнёте с пустой папки и закончите приложением на React с поддержкой кошелька, работающим в основной сети Chia на вашем собственном домене.

Весь цикл вплоть до публикации **бесплатен** — скаффолдинг, разработка и предпросмотр ничего не стоят. Вы платите **единую цену capsule в $DIG** только на шаге деплоя.

```
new ──▶ dev ──▶ подключение кошелька (dig-sdk) ──▶ сборка траты (chip35) ──▶ деплой ──▶ собственный домен
free    free              free                            free              цена capsule      free
```

## Что вам понадобится {#what-youll-need}

- Установленный [CLI `dig-store`](../digstore/cli/install.md).
- Node 18+ и `npm`.
- Профинансированный кошелёк Chia — **только на шаге деплоя** (единая цена capsule в $DIG + небольшая комиссия XCH). Всё до этого бесплатно.

---

## 1. Скаффолдинг приложения на React — бесплатно, без блокчейна {#1-scaffold-a-react-app--free-no-chain}

`dig-store new` создаёт готовый к запуску проект с интеграцией кошелька. Выберите шаблон React:

```sh
dig-store new vite-react my-dapp
cd my-dapp
```

Вы получаете приложение Vite + React, `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`) и `App.jsx`, уже подключённый к встроенному кошельку. Store не минтится, и ничего не тратится — `new` работает исключительно локально.

:::tip Предпочитаете npm? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` создаёт тот же шаблон прямо из npm — входная точка на JS, установка `dig-store` для начала не нужна. См. [Скаффолдинг приложения](./scaffold.md) для всех пяти шаблонов и сравнения двух входных точек.
:::

## 2. Разработка на настоящем пути чтения — бесплатно {#2-develop-against-the-real-read-path--free}

```sh
dig-store dev
```

`dev` запускает вашу сборку, обслуживает результат через **настоящий путь чтения `chia://`** (компиляция → верификация → расшифровка) и внедряет **dev-заглушку `window.chia`**, чтобы вы могли строить поток работы с кошельком без реального кошелька. Отредактируйте `src/App.jsx`, сохраните — и страница перезагрузится вживую — именно то, что получат посетители, без взаимодействия с блокчейном и без трат.

## 3. Подключение кошелька через SDK — `window.chia` + резервный WalletConnect {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

Шаблон обращается напрямую к `window.chia`, что отлично работает внутри [DIG Browser](../browser/using-window-chia.md). Чтобы также поддержать пользователей других браузеров, добавьте SDK — он **предпочитает внедрённый кошелёк `window.chia`, а при его отсутствии переключается на WalletConnect → Sage** за одной нормализованной поверхностью, так что поток работы с кошельком пишется один раз.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # опционально: только для резервного WalletConnect
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" предпочитает внедрённый кошелёк DIG Browser, иначе WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // ПУБЛИЧНОЕ значение времени сборки
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // отрисовать QR-код
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

Один вызов `connect()` работает и в DIG Browser (без QR, без relay), и везде ещё (WalletConnect). `provider.backend` сообщает, какой транспорт подключился. Имена методов и формы результатов идентичны в обоих случаях — см. [Использование `window.chia`](../browser/using-window-chia.md) для руководства по интеграции или [нормативную спецификацию провайдера `window.chia`](../protocol/window-chia-provider.md) для точного контракта методов/параметров/возврата/ошибок.

:::note Project id WalletConnect — это ПУБЛИЧНОЕ значение времени сборки
`VITE_WC_PROJECT_ID` компилируется в ваш бандл и общедоступен для чтения — это корректно для облачного id WalletConnect. **Никогда** не помещайте seed-фразу кошелька, deploy-ключ или любой секрет в бандл: capsule — это [слепой статический артефакт без серверных секретов](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Постройте и подпишите трату — wasm chip35 через SDK {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Когда вашему dapp нужно сделать что-то в блокчейне (минтить store, обновить метаданные, построить платёж CAT), он строит трату через **канонический строитель трат CHIP-0035** и передаёт её кошельку для подписи. SDK ре-экспортирует этот строитель по подпути `/spend` — вы **никогда не собираете пакет трат вручную**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // строитель на wasm chip35

async function doSpend() {
  spend.init();

  // Постройте траты монет с помощью строителя wasm, например spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). Строитель работает
  // офлайн и является чистой функцией — без ключей, без сети.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Передайте их кошельку для подписи (ключи хранит кошелёк, а не ваш dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → объедините в пакет трат и транслируйте.
}
```

Это в точности та же схема, что использует hub: **соберите пакет прямо в браузере через wasm, подпишите его кошельком.** Строитель трат — единственный канонический источник пакетов трат для всей экосистемы, поэтому ваш dapp производит байт-идентичные траты hub и CLI.

Чтобы **прочитать** обратно верифицированный, зашифрованный контент (например, отрисовать данные другого store внутри вашего dapp), используйте `DigClient` из SDK:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // по умолчанию https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // якорь доверия, читаемый из блокчейна
});
```

`DigClient` выводит ключи URN прямо в браузере, верифицирует включение относительно on-chain корня и расшифровывает — обслуживающий хост остаётся слепым. См. [Что такое dig RPC?](../rpc/what-is-the-dig-rpc.md).

:::tip Взимаете плату за доступ? Используйте `Paywall`
Для монетизации — pay-to-unlock контента или гейтинга по владению NFT — SDK поставляет высокоуровневый помощник **`Paywall`**, объединяющий подключённый `ChiaProvider` со строителем трат, чтобы вам не пришлось подключать платежи вручную: `paywall.requestPayment({ amount, owner })` платит владельцу dapp и возвращает квитанцию, а `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` контролируют доступ.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* разблокировать контент */ }
```
:::

## 5. Деплой в блокчейн {#5-deploy-on-chain}

Сборка и предпросмотр бесплатны; это единственный шаг, который тратит средства. Сначала создайте store **один раз**:

```sh
dig-store init my-dapp --dir dist      # минтит первую capsule store (единая цена capsule + комиссия XCH)
```

`init` минтит синглтон Chia в основной сети — **launcher id становится вашим store id**. Скопируйте его в `dig.toml` (`store-id = "<64-hex>"`). С этого момента одна команда собирает и публикует новую capsule:

```sh
dig-store deploy --json                # выполняет build-command, добавляет в индекс dist/, продвигает корень
```

Каждый `deploy` публикует новую неизменяемую capsule за единую цену capsule. В момент подтверждения ваш dapp становится **доступным для чтения через [dig RPC](../rpc/what-is-the-dig-rpc.md)** по своему [URN](../concepts.md#urn) / адресу `chia://` — зашифрованным, верифицированным и невозможным для удаления, без регистрации и без дополнительной платы. (Удобный веб-адрес `*.on.dig.net` — это отдельный, опциональный шаг — см. [следующий раздел](#6-put-it-on-your-own-domain).) Для push-to-deploy при каждом коммите настройте [Деплой из GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## 6. Разместите на своём домене {#6-put-it-on-your-own-domain}

Ваш store уже доступен по своему адресу URN / `dig://` — но для удобного веб-URL вы регистрируете имя. Store получает поддомен `*.on.dig.net`, когда вы **регистрируете хендл** для него в DIGHUb: отдельная, платная регистрация, закрепляющая store за этим именем (без регистрации → без адреса `*.on.dig.net`). Чтобы обслуживать его с домена, которым вы владеете, вместо этого добавьте **собственный домен с TLS в [DIGHUb ↗](https://hub.dig.net)** — направьте свой домен на store, и DIGHUb обработает сертификат. В любом случае ваш dapp загружается с удобного для человека URL, оставаясь полностью децентрализованным под капотом.

Когда появятся хендлы `.dig` по CHIP-54, store также станет адресуемым по человекочитаемому имени `.dig`; до тех пор собственные домены через DIGHUb — способ брендировать деплой.

---

## Вы выпустили dapp {#you-shipped-a-dapp}

Вы прошли путь от пустой папки до приложения на React с поддержкой кошелька, работающего в основной сети Chia на вашем собственном домене — затронув каждый примитив: [скаффолдинг](../digstore/cli/quickstart.md), [встроенный кошелёк](../browser/using-window-chia.md), [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), [строитель трат](https://github.com/DIG-Network/chip35_dl_coin), [путь чтения](../rpc/what-is-the-dig-rpc.md) и [деплой](../digstore/cli/deploy-from-github-actions.md). Клонируйте готовую версию из [галереи примеров](./example-gallery.md).

## Смотрите также {#related}

- [Скаффолдинг приложения (create-dig-app)](./scaffold.md) — пять шаблонов и сравнение входных точек npm и CLI
- [Галерея примеров](./example-gallery.md) — клонируйте готовый dapp и откройте его в шаблоне
- [Использование window.chia](../browser/using-window-chia.md) — встроенный провайдер кошелька во всех деталях
- [Спецификация провайдера window.chia](../protocol/window-chia-provider.md) — нормативный, версионированный контракт провайдера
- [Конфигурация проекта и значения времени сборки](../digstore/cli/configuration.md) — dig.toml + ПУБЛИЧНАЯ конфигурация
- [Деплой из GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — push-to-deploy в CI
- [Что такое dig RPC?](../rpc/what-is-the-dig-rpc.md) — чтение верифицированного зашифрованного контента
- [Quickstart](../quickstart.md) — более короткий путь «опубликовать сайт»
- [Концепции и глоссарий](../concepts.md) — определения capsule, store, URN и window.chia
