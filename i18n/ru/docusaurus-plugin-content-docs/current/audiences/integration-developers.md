---
sidebar_position: 3
title: For integration developers
description: "Полностью машиночитаемая платформа — OpenAPI/OpenRPC, каталогизированная таксономия ошибок, живое ценообразование, JWKS, JSON для каждой страницы и типизированный @dignetwork/dig-sdk — так что вы подключаете кошелёк и верифицированное чтение в своё приложение, не парся ни строчки человеческого текста."
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

> **Полностью машиночитаемая платформа** — OpenAPI/OpenRPC, каталогизированная таксономия ошибок, живое ценообразование, JWKS, JSON для каждой страницы и типизированный `@dignetwork/dig-sdk` — так что вы подключаете кошелёк и верифицированное чтение в своё приложение **не парся ни строчки человеческого текста**.

## Ментальная модель — две поверхности, разделённые {#the-mental-model--two-surfaces-kept-separate}

1. **REST-плоскость управления** — `hub.dig.net/v1`, bearer-JWT — для управления store, доменами, командами и NFT.
2. **Независимый от узла путь чтения dig JSON-RPC 2.0** — `rpc.dig.net` — который стримит **верифицированный шифротекст**.

Одна поверхность **кошелька** ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) на два транспорта — внедрённый (DIG Browser) или WalletConnect → Sage — объединённые через `ChiaProvider` SDK. Траты всегда строятся каноническим wasm CHIP-0035 и подписываются кошельком пользователя — **никогда вручную**. Ветвление по **стабильным кодам ошибок**, никогда не по тексту.

## Создание dapp — от начала до конца {#build-a-dapp--end-to-end}

Единая нить от скаффолдинга до приложения, работающего с кошельком, на вашем собственном домене.

→ [Создание dapp на Chia](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, а также канонические траты, ре-экспортированные по подпути `/spend`. Установка, подпути и `capabilities()`.

→ [DIG SDK](../sdk.md)

## Подключение кошелька — `window.chia` {#connect-a-wallet--windowchia}

Обнаружьте внедрённый провайдер, вызовите `connect()` (согласие по каждому origin) и используйте методы CHIP-0002.

→ [Использование window.chia](../browser/using-window-chia.md) · спецификация: [провайдер window.chia](../protocol/window-chia-provider.md)

## Чтение верифицированного контента — `DigClient` + методы dig RPC {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` стримит шифротекст + доказательства включения и **верифицирует, затем расшифровывает** на стороне клиента. Вызывайте методы напрямую, когда это нужно.

→ [Что такое dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Методы](../rpc/methods.md)

## Стриминг и пересборка {#streaming--reassembly}

Модель чанков, [retrieval key](../concepts.md#retrieval-key) и порядок «сначала верификация, потом расшифровка».

→ [Стриминг](../rpc/streaming.md)

## Построение трат — канонический строитель CHIP-0035 {#building-spends--the-canonical-chip-0035-builder}

Разделение **сборка → подпись → трансляция**: wasm строит пакет трат, кошелёк подписывает, вы транслируете. Hub никогда не собирает трату вручную, и вам не следует.

→ [Построение трат](../spends.md)

## Плоскость управления hub `/v1` {#the-hub-v1-control-plane}

Аутентификация (JWT / OIDC / привязка устройства), store, домены, аналитика и веб-хуки через REST.

→ [Машиночитаемые поверхности](../machine-surfaces.md#openapi) для документа OpenAPI.

## CI-деплой — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Режимы, keyless OIDC, перечисление результатов и вывод `--json` для последующих шагов.

→ [Деплой из GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Машиночитаемые поверхности {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — открывайте и интегрируйтесь, не парся текст.

→ [Машиночитаемые поверхности](../machine-surfaces.md)

## Коды ошибок — ветвление по коду {#error-codes--branch-on-the-code}

Единый сводный справочник по dig RPC, CLI, DIGHUb, загрузчику dig и SDK.

→ [Коды ошибок](../support/error-codes.md)

---

## Углубитесь: протокол {#go-deeper-the-protocol}

- **«верифицированное чтение»** → [dig RPC (интерфейс контента сети)](../rpc/what-is-the-dig-rpc.md) · [Доказательства включения против доказательств выполнения](../inclusion-vs-execution-proofs.md)
- **«window.chia»** → [нормативная спецификация провайдера](../protocol/window-chia-provider.md)
- **«retrieval_key и стриминг»** → [URN и шифрование](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Стриминг](../rpc/streaming.md)
- **«deploy-токен — это отзываемый ключ писателя»** → [Траты и делегирование CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Всё сразу** → [Глубокое погружение в протокол](../protocol-deep-dive.md) · [Концепции и глоссарий](../concepts.md)
