---
sidebar_position: 1
title: For app developers
description: "Опубликуйте сайт или приложение, которым вы по-настоящему владеете — выпущенное в блокчейне как ваш собственный актив, а не арендованное. Собирайте и просматривайте бесплатно; платите небольшую единую цену $DIG только при публикации, а файлы шифруются прямо в вашем браузере, так что ни один хост не сможет их прочитать."
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

> **Опубликуйте сайт или приложение, которым вы ПО-НАСТОЯЩЕМУ ВЛАДЕЕТЕ** — выпущенное в блокчейне как ваш собственный актив, а не арендованное. Собирайте и просматривайте **бесплатно**; платите небольшую **единую цену $DIG** только при публикации, а файлы **шифруются прямо в вашем браузере**, так что ни один хост не сможет их прочитать.

## Ментальная модель {#the-mental-model}

**[Store](../concepts.md#store)** — это постоянная идентичность вашего сайта — контролируемый вами on-chain синглтон. Каждый раз при публикации вы минтите одну неизменяемую **[capsule](../concepts.md#capsule)** = `storeId:rootHash`. Store — это просто последовательность capsule, опубликованных вами с течением времени.

Два входа ведут к **одному и тому же** циклу «бесплатная сборка → платная публикация»:

- **Веб-путь** — [DIGHUb](../concepts.md#dighub) на [hub.dig.net](https://hub.dig.net): загрузите собранную папку, бесплатный предпросмотр, подключение кошелька только на шаге Publish.
- **CLI / CI-путь** — CLI [`dig-store`](../concepts.md#digstore-cli) + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub deploy Action](../concepts.md#deploy-action).

Скаффолдинг, сборка и предпросмотр **ничего не стоят**. Вы платите только при публикации capsule.

| Вы делаете | Стоимость |
|---|---|
| Скаффолдинг, сборка, предпросмотр черновика | **Бесплатно** |
| Публикация первой capsule (минт store) | **единая цена capsule в $DIG** + небольшая комиссия XCH |
| Публикация каждого обновления (новая capsule) | **единая цена capsule в $DIG** + небольшая комиссия XCH |

## Начните здесь {#start-here}

- **[Quickstart — опубликуйте сайт за 10 минут](../quickstart.md)** — самый быстрый путь, веб или CLI.

## Публикация из веба — DIGHUb {#publish-from-the-web--dighub}

[**Создайте новый store в DIGHUb ↗**](https://hub.dig.net/new). Загрузите собранный сайт (папку `dist/` или `build/`), получите **бесплатный предпросмотр черновика** на настоящем пути чтения и подключите кошелёк только на шаге **Publish**. См. веб-инструкцию в [Quickstart → Публикация из веба](../quickstart.md#a-publish-from-the-web).

## Публикация из CLI — dig-store {#publish-from-the-cli--digstore}

Цикл в стиле Git: `new` → `dev` → `init` → `commit`.

```sh
digs new vite-react   # создать готовый к запуску проект — бесплатно, без минта
digs dev              # предпросмотр на настоящем пути чтения chia://, live-reload — бесплатно
digs init site --dir dist   # минтит первую capsule store (единая цена + комиссия XCH)
digs commit -m "v1.1"       # опубликовать обновление — новую capsule
```

→ [CLI-quickstart](../digstore/cli/quickstart.md) · [Полный рабочий процесс проекта](../digstore/cli/project-workflow.md)

## Скаффолдинг приложения — 5 шаблонов {#scaffold-an-app--5-templates}

Начните с готового к запуску стартового проекта с интеграцией кошелька — `static`, `vite-react`, `next-static`, `nft-drop` или `dapp-window-chia` — через `digs new <template>` или `npm create dig-app`.

→ [Скаффолдинг приложения](../build-a-dapp/scaffold.md)

## Бесплатный предпросмотр через `digs dev` {#preview-free-with-digstore-dev}

`digs dev` обслуживает ваш проект через **настоящий** путь чтения DIG (шифрование → компиляция → верификация → расшифровка) с live reload и внедрённым dev-режимом `window.chia`. Вы видите именно то, что получат посетители — и ничего не минтится и не тратится.

→ [CLI-quickstart → разработка и предпросмотр](../digstore/cli/quickstart.md)

## `dig.toml` — коммитимый манифест {#digtoml--the-committable-manifest}

`dig.toml` в корне вашего проекта хранит `store-id`, `output-dir`, `build-command`, `remote` и другую конфигурацию — общую для `digs dev`, `digs deploy` и шаблонов скаффолдинга. Он **не содержит секретов** (они берутся из окружения), поэтому его можно коммитить.

→ [Конфигурация проекта и значения времени сборки](../digstore/cli/configuration.md)

## Обновления и версии — каждая публикация — новая capsule {#updates--versions--each-publish-is-a-new-capsule}

Каждая публикация запечатывает текущую сборку в **новую неизменяемую capsule** и продвигает on-chain корень вашего store. Старые capsule остаются доступными для чтения; store всегда разрешается в последнюю версию, если читатель не закрепил конкретный `rootHash`.

→ [On-chain закрепление](../digstore/cli/onchain-anchoring.md)

## Сколько это стоит {#what-it-costs}

Сборка и предпросмотр бесплатны; **единая цена в $DIG** за опубликованную capsule, плюс небольшая сетевая комиссия XCH — включённая **атомарно** в ту же on-chain трату. Цена единая для каждой capsule по замыслу (чтобы длина capsule не раскрывала ничего о содержимом). Получите $DIG на TibetSwap, dexie.space или 9mm.pro.

→ [Где взять DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Почему каждая capsule стоит одинаково?](../support/faq.md#why-uniform-price)

## Push-to-deploy из GitHub Actions {#push-to-deploy-from-github-actions}

Настройте `dig-network/deploy-action`, чтобы каждый push публиковал новую capsule — с защитой `if-changed`, делающей байт-идентичную сборку no-op (без трат).

→ [Деплой из GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Добавьте веб-адрес `*.on.dig.net` (опционально) {#add-a-ondignet-web-address-optional}

Ваш store доступен по своему [URN](../concepts.md#urn) / адресу [`chia://`](../browser/chia-protocol.md) в момент подтверждения — без дополнительных затрат. Удобный хендл `<name>.on.dig.net` — это **опциональная, платная** регистрация в DIGHUb поверх этого.

→ [Могу ли я использовать свой домен?](../support/faq.md#can-i-use-my-own-domain)

---

## Углубитесь: протокол {#go-deeper-the-protocol}

Простая модель выше — это всё, что нужно для публикации. Когда захотите разобраться в полной архитектуре:

- **«store — это последовательность capsule»** → [Концепции и глоссарий](../concepts.md#capsule) · [Модель capsule и store](../digstore/format/store-structure.md)
- **«файлы шифруются в вашем браузере»** → [URN и шифрование](../digstore/format/urns-and-encryption.md)
- **«единая цена + атомарная трата $DIG»** → [On-chain закрепление](../digstore/cli/onchain-anchoring.md#costs) · [Траты store-coin CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Всё сразу** → [Глубокое погружение в протокол](../protocol-deep-dive.md)
