---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "Каждый сбой даёт вам стабильный код и request-id, напрямую связанный с логом сервера, on-chain траты защищены от гонок, так что вы никогда не заплатите дважды, а понятные предварительные проверки останавливают напрасные capsule до того, как вы потратите $DIG."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Troubleshooting {#troubleshooting}

> Каждый сбой даёт вам **стабильный код** и **request-id**, напрямую связанный с логом сервера, on-chain траты **защищены от гонок**, так что вы никогда не заплатите дважды, а понятные **предварительные проверки** останавливают напрасные capsule до того, как вы потратите $DIG.

## Ментальная модель — находите свой сбой по его коду {#the-mental-model--find-your-failure-by-its-code}

Каждая поверхность — dig RPC, CLI digstore, DIGHUb, загрузчик `chia://`, SDK — сопоставляет сбой с одним **СТАБИЛЬНЫМ кодом**. **Ветвитесь по коду, никогда по тексту сообщения.** Единый сводный каталог охватывает их все и также публикуется в машиночитаемом виде.

Предварительные проверки (`digstore doctor`, `--dry-run`, `--if-changed`) и возобновляемые закрепления означают, что застрявшая или холостая публикация **никогда не тратит средства втихую**.

## Частые сбои публикации {#common-publishing-failures}

Недостаток средств, таймаут подтверждения (возобновляемый — ваша трата не потеряна) и non-fast-forward «удалённый корень продвинулся вперёд».

→ [Устранение неполадок](../support/troubleshooting.md)

## Сбои чтения и верификации {#read--verify-failures}

Несовпадение доказательства, ошибки расшифровки/соли и ответы «не найдено» / decoy.

→ [Сбои чтения и верификации](../support/troubleshooting.md#verification-failed)

## Проблемы с кошельком и сессией {#wallet--session-issues}

Подключение, повторная аутентификация, отклонённый запрос и сессии только для чтения, которые не могут подписывать.

→ [Сессия кошелька не может подписывать](../support/troubleshooting.md#wallet-session)

## Предварительные проверки и проверки стоимости — не тратьте capsule впустую {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (окружение + готовность), `--dry-run` (предпросмотр стоимости и предполагаемой capsule) и `--if-changed` (байт-идентичная сборка становится no-op).

→ [Деплой из GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [On-chain закрепление → стоимость и безопасность](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Справочник кодов ошибок {#error-codes-reference}

Коды выхода CLI · RPC `-32xxx` · DIGHUb · dig-loader · SDK — одна сводная таблица.

→ [Коды ошибок](../support/error-codes.md)

## FAQ {#faq}

Стоимость, бесплатный пробный период, почему цена единая, где взять $DIG и «есть ли тестовая сеть?».

→ [FAQ](../support/faq.md)

## Получить помощь {#get-help}

Discord + GitHub, и как составить хороший отчёт об ошибке — **никогда не вставляйте секреты**.

→ [Получить помощь](../support/get-help.md)

## Статус и список изменений {#status--changelog}

→ [Статус](../support/status.md) · [Список изменений](../support/changelog.md)

---

## Углубитесь: протокол {#go-deeper-the-protocol}

- **сбои чтения и верификации** → [Доказательства и безопасность](../digstore/format/proofs-and-security.md) · [URN и шифрование](../digstore/format/urns-and-encryption.md)
- **коды RPC `-32xxx`** → [методы dig RPC](../rpc/methods.md) · [Соответствие](../rpc/conformance.md)
- **Всё сразу** → [Глубокое погружение в протокол](../protocol-deep-dive.md) · [Концепции и глоссарий](../concepts.md)
