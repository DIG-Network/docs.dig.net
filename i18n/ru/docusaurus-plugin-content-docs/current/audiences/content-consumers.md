---
sidebar_position: 5
title: For content consumers
description: "Открывайте контент chia://, который ваш СОБСТВЕННЫЙ браузер проверяет по блокчейну — ни один хост не сможет его изменить или подделать, приватный контент остаётся приватным от хоста, а сам контент постоянен и переразмещаем где угодно, так что никто не сможет его удалить или запереть вас в одной платформе."
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

> **Открывайте контент `chia://`, который ваш СОБСТВЕННЫЙ браузер проверяет по блокчейну** — ни один хост не сможет его изменить или подделать, приватный контент остаётся приватным от хоста, а сам контент постоянен и переразмещаем где угодно, так что никто не сможет его удалить или запереть вас в одной платформе.

## Ментальная модель {#the-mental-model}

Вставьте ссылку `chia://`, и контент придёт прямо из сети — **адресованный по содержимому** и **криптографически верифицированный на ВАШЕМ устройстве** перед отображением. Это **fail-closed**: подделанные или нерасшифровываемые байты никогда не отображаются.

- **Опустите `rootHash`** для *последней* версии store: `chia://<storeId>/`.
- **Укажите его**, чтобы закрепить одну точную неизменяемую [capsule](../concepts.md#capsule): `chia://<storeId>:<rootHash>/`.

Для публичного контента нужна только ссылка. Приватному контенту нужен также секретный параметр **`?salt=`** — как пароль.

## Получите DIG Browser или расширение {#get-the-dig-browser-or-the-extension}

- **[Получите DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — браузер со встроенной поддержкой `chia://` и кошельком.
- **Расширение** для Chrome / Edge / Brave / Firefox — добавляет разрешение `chia://` в браузер, которым вы уже пользуетесь.

## Открытие контента `chia://` — последняя версия против закреплённой {#open-chia-content--latest-vs-pinned}

Формы адреса, чистая строка адреса `chia://<store>/` и когда закреплять `rootHash`.

→ [Протокол chia://](../browser/chia-protocol.md)

## Встроенные страницы, значок верификации и щиты {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, а также значок верификации / щиты, показывающие вердикт доказательства включения для каждого ресурса активной capsule.

→ [Использование window.chia](../browser/using-window-chia.md)

## Публичное против приватного — когда нужен секрет `?salt=` {#public-vs-private--when-you-need-a-salt-secret}

Публичные store открываются просто по ссылке; приватные store требуют секретную соль, которая выводит ключ расшифровки.

→ [Публичные и приватные store](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [В чём разница между публичным и приватным?](../support/faq.md#public-vs-private)

## Запустите контент локально (опционально) {#run-content-locally-optional}

Направьте браузер/расширение на локальный [dig-node](../concepts.md#dig-node) для более быстрого и дружественного к офлайн-работе чтения — они делят один кэш `.dig`. Узел никогда не *обязателен* для чтения.

→ [Запуск узла](../run-a-node/index.md)

## Получите $DIG {#get-dig}

Для *чтения* контента $DIG не нужен. Если хотите публиковать, получите $DIG на **TibetSwap**, **dexie.space** или **9mm.pro**.

→ [Где взять DIG?](../support/faq.md#where-do-i-get-dig)

---

## Углубитесь: протокол {#go-deeper-the-protocol}

- **«верифицировано по блокчейну»** → [On-chain закрепление](../digstore/cli/onchain-anchoring.md) · [Доказательства и безопасность](../digstore/format/proofs-and-security.md)
- **«публичная против приватной соли»** → [URN и шифрование](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **«последняя версия против закреплённой»** → [Generation и корневые хеши](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Всё сразу** → [Глубокое погружение в протокол](../protocol-deep-dive.md) · [Концепции и глоссарий](../concepts.md)
