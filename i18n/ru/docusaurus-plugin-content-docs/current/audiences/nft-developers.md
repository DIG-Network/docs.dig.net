---
sidebar_position: 2
title: For NFT developers
description: "Минтите целую коллекцию CHIP-0007, чей арт хранится ПОСТОЯННО в защищённой от подделки capsule DIG — один атомарный подписанный пакет, реальные роялти и честная механика дропа, которая никогда не выдаёт желаемое за то, что ещё не доказано в блокчейне."
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# For NFT developers {#for-nft-developers}

> **Минтите целую коллекцию CHIP-0007, чей арт хранится ПОСТОЯННО в защищённой от подделки capsule DIG** — один атомарный подписанный пакет, реальные роялти и честная механика дропа (reveal / allowlist / фазы), которая никогда не выдаёт желаемое за то, что ещё не доказано в блокчейне.

## Ментальная модель {#the-mental-model}

Сначала поместите свой арт в **[capsule DIG](../concepts.md#capsule)**, затем минтите NFT, чьи `data_uris` / `metadata_uris` указывают на эту capsule. On-chain хеши закрепляют реальные байты — так арт становится адресованным по содержимому, проверяемым и постоянным, а не ссылкой, которая может протухнуть или быть подменена.

Траты **никогда не собираются вручную**: канонический строитель wasm CHIP-0035 (через [`@dignetwork/dig-sdk/spend`](../sdk.md)) строит каждую трату монеты, ваш кошелёк подписывает один раз, и она транслируется один раз.

Минт **store бесплатен** в $DIG — вы платите **единую цену capsule** только когда создаётся capsule (когда арт записывается в capsule).

## Скаффолдинг страницы минта — шаблон `nft-drop` {#scaffold-a-mint-page--the-nft-drop-template}

Начните со страницы дропа с интеграцией кошелька одной командой:

```sh
digs new nft-drop
# или
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Скаффолдинг приложения](../build-a-dapp/scaffold.md)

## Минт из CLI {#mint-from-the-cli}

CLI для активов строит трату через строители `digstore-chain`, подписывает seed-фразой вашего кошелька и отправляет — все команды безопасны для CI с `--dry-run` / `--json`:

```sh
digs did create                          # DID эмитента для атрибуции
digs collection create --name "My Drop"  # коллекция CHIP-0007
digs nft mint --data ./art.png --metadata ./meta.json --dry-run
digs offer make ...                       # сделки XCH / CAT
```

Путь **capsule-media** команды `nft mint` записывает арт + метаданные CHIP-0007 в capsule, вычисляет хеши данных/метаданных из реальных байтов и устанавливает URI на адрес `chia://` capsule (с резервным https-шлюзом). → [Справочник команд](../digstore/cli/command-reference.md)

## Минт из веба — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Минтите коллекцию, обеспеченную capsule, прямо в браузере: загрузите арт (записывается в capsule), настройте роялти и прикрепите DID для атрибуции — кошелёк подписывает в конце. → [DIGHUb ↗](https://hub.dig.net)

## Дропы — reveal, allowlist, фазы {#drops--reveal-allowlist-phases}

Механика дропа представлена **честно**: что обеспечено в блокчейне уже сегодня, а что — офчейн-удобство до появления примитива claim-coin. Мы никогда не представляем гарантию, которую пока не можем доказать в блокчейне.

→ [Создание dapp на Chia](../build-a-dapp/tutorial.md) для сквозного сценария минта.

## Стройте траты с помощью SDK — никогда не вручную {#build-spends-with-the-sdk--never-hand-roll}

Каждая трата монеты строится каноническим wasm CHIP-0035 и ре-экспортируется по адресу `@dignetwork/dig-sdk/spend`. Поток всегда **сборка → подпись → трансляция**, разделённый так, что кошелёк только подписывает.

→ [Построение трат](../spends.md) · [DIG SDK](../sdk.md)

## Монетизация и гейтинг — Paywall {#monetize--gate--the-paywall}

`Paywall` из SDK объединяет провайдер со строителем трат для **pay-to-unlock** и **гейтинга по владению NFT / коллекцией** — без ручного подключения трат.

→ [DIG SDK → Paywall](../sdk.md#paywall)

## Offers — создать / принять / показать {#offers--make--take--show}

Обменивайте NFT на XCH или CAT через `digs offer make | take | show` (каждая с `--dry-run` / `--json`). → [Справочник команд](../digstore/cli/command-reference.md)

---

## Углубитесь: протокол {#go-deeper-the-protocol}

- **«защищённая от подделки capsule»** → [Доказательства и безопасность](../digstore/format/proofs-and-security.md) · [Модель capsule и store](../digstore/format/store-structure.md)
- **«никогда не собирать трату вручную»** → [Траты store-coin CHIP-0035 и делегирование](../chip-0035-spends-and-delegation.md)
- **Всё сразу** → [Глубокое погружение в протокол](../protocol-deep-dive.md) · [Концепции и глоссарий](../concepts.md)
