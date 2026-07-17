---
sidebar_position: 1.5
title: Concepts & glossary
description: "Однострочный указатель основных сущностей DIG Network — capsule, store, generation, URN, retrieval key, dig RPC, протокол chia:// и on-chain закрепление — каждая определена один раз со ссылкой на подробный документ."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts & glossary {#concepts--glossary}

Эта страница определяет каждую основную сущность DIG Network **один раз**, простым языком, и связывает
её с документом, где раскрыта вся глубина темы. Это человекочитаемый костяк документации — и, поскольку
каждый термин также публикуется как машиночитаемые структурированные данные, это карта, которую агент
может считать, чтобы изучить словарь сети. Просмотрите её для ориентации; переходите по ссылке, чтобы
углубиться.

## Capsule {#capsule}

**Capsule** — это одно неизменяемое поколение store: пара `(storeId, rootHash)`, записываемая канонически
как `storeId:rootHash`. Это атомарная единица сети — для компиляции (один WASM-модуль фиксированного
размера), [ценообразования](./digstore/cli/onchain-anchoring.md) (единая цена за capsule для mint или
commit, оплачиваемая в $DIG), получения (один [URN](#urn) именует одну capsule), кэширования и
происхождения. [Store](#store) — это *последовательность capsule*, по одной на коммит. Это определение
идентично в dig-store, dig RPC и DIG Browser. → [Capsule подробно](./intro.md#the-capsule)

## Store {#store}

**Store** — это идентичность плюс её контент и история: последовательность [capsule](#capsule), по одной
на коммит. Его идентичность — это 64-символьный шестнадцатеричный **store id**, который *является*
launcher id его on-chain синглтона Chia — синглтон в блокчейне является источником истины для текущего
корня store. Store — это эквивалент веб-сайта в DIG. → [Структура store](./digstore/format/store-structure.md)

## Generation {#generation}

**Generation** — это одно зафиксированное состояние [store](#store), идентифицируемое **корневым хешем**
(корнем Меркла по листьям ресурсов этого поколения). Каждый `commit` запечатывает текущий контент в
новое, добавляемое-только поколение — то же самое, что именует [capsule](#capsule). Generation растут
монотонно, как история Git. → [Generation и корневые хеши](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

**URN** — это адрес *и* ключ dig-store в одной строке:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. Он одновременно **находит** ресурс и **выводит
ключ, расшифровывающий его** — обладание URN необходимо и достаточно для чтения публичного ресурса.
Сокращённая форма для браузера — [протокол `chia://`](#chia-protocol). → [URN и шифрование](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

**Retrieval key** — это `SHA-256(canonical_urn)`, единственный адрес, который вообще покидает клиент. Он
находит шифротекст ресурса, не раскрывая его путь или [URN](#urn). Он *не зависит от корня*, поэтому один
и тот же ключ находит ресурс во всех [generation](#generation); отданные байты затем
[верифицируются по Меркла](#merkle-proof) относительно правильного корня. Отдельный **ключ расшифровки**
выводится локально (HKDF) из того же URN и никогда не отправляется. → [Два значения, одна строка](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Каждое [generation](#generation) строит дерево Меркла с одним листом на ресурс, фиксируя точные байты
*шифротекста*, которые отдаются. Единственное **доказательство включения** сопровождает отданный ресурс
и доказывает, что эти байты принадлежат именно этому корню — так контент верифицируется без расшифровки,
а узлу никогда не доверяют факт возврата подлинных байтов. → [Доказательства Меркла](./digstore/format/proofs-and-security.md)

## On-chain закрепление {#anchoring}

Каждый store — это **синглтон в основной сети Chia**. `dig-store init` минтит его (launcher id
*становится* store id), а каждый `dig-store commit` закрепляет новый корень [generation](#generation)
в блокчейне как обновление синглтона CHIP-0035. Обе операции блокируются до подтверждения и тратят
реальные средства. Блокчейн является источником истины для последнего корня store. → [On-chain закрепление](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG** — это токен DIG Network (Chia CAT). Минт [capsule](#capsule) (`init`) или её коммит стоит
**единую цену за capsule в $DIG**, включённую **атомарно в ту же on-chain трату**, что и закрепление —
отдельной транзакции нет, а memo несёт store id. → [Стоимость](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store` — это инструмент командной строки, который создаёт, коммитит, делится и читает store —
рабочий процесс в стиле Git (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) поверх
зашифрованного, on-chain формата store. → [Справочник команд](./digstore/cli/command-reference.md) · [CLI-туториал](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` — это **коммитимый манифест проекта** в корне проекта — `store-id`, `output-dir`,
`build-command` и другая конфигурация проекта, общая для `dig-store dev`, `dig-store deploy` и шаблонов
скаффолдинга. Он **не содержит секретов** (они берутся из окружения), поэтому его безопасно коммитить.
→ [Конфигурация проекта и значения времени сборки](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) — это **входная точка на JS** для запуска проекта DIG: он
создаёт готовый к запуску стартовый проект — приложение, [`dig.toml`](#dig-toml) и (для шаблонов с
кошельком) подключённый [DIG SDK](#dig-sdk) — на основе одного из пяти шаблонов (`static`, `vite-react`,
`next-static`, `nft-drop`, `dapp-window-chia`). Скаффолдинг **бесплатен** — без минта, без блокчейна, без
трат; вы платите единую цену capsule только при публикации [capsule](#capsule). Это npm-аналог CLI на
Rust — команды `dig-store new`. → [Скаффолдинг приложения](./build-a-dapp/scaffold.md)

## GitHub deploy Action {#deploy-action}

`dig-network/deploy-action` — это GitHub Action для **git-push-to-deploy**: он устанавливает
[CLI `dig-store`](#digstore-cli) на раннере, запускает `dig-store deploy` для продвижения вашего store
(никогда не минтит) и сообщает об опубликованной [capsule](#capsule) + URL + стоимости обратно как
выходные данные шага, комментарий к PR, GitHub Deployment и статус коммита. С `if-changed`
(по умолчанию) байт-идентичная сборка становится no-op — без трат. → [Деплой из GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK** (`@dignetwork/dig-sdk`) — это типизированный npm-пакет для интегрирующих разработчиков:
`ChiaProvider` (предпочитает внедрённый [`window.chia`](#window-chia), при отсутствии — WalletConnect →
Sage), `DigClient` (читает верифицированный зашифрованный контент через [dig RPC](#dig-rpc)), `Paywall`
(высокоуровневый помощник pay-to-unlock / гейтинга по владению NFT, объединяющий провайдер со
строителем трат) и канонический строитель трат CHIP-0035, ре-экспортированный по подпути `/spend`.
→ [Создание dapp на Chia](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC** — это общесетевой интерфейс чтения: сервис JSON-RPC 2.0 поверх HTTPS `POST`, на котором
одинаково говорит каждый хостинг-узел. Он отдаёт шифротекст + [доказательства включения](#merkle-proof)
по [retrieval key](#retrieval-key), целые [capsule](#capsule) по `(storeId, root)` и метаданные для
обнаружения — слепо по конструкции, с верификацией и расшифровкой на стороне клиента. **Это
универсальный путь чтения**: каждая опубликованная capsule доступна для чтения здесь по её
[URN](#urn) / адресу [`chia://`](#chia-protocol) в момент подтверждения в блокчейне — без регистрации и
без платы сверх публикации capsule. Опциональный, удобный для человека
[хендл `*.on.dig.net`](#on-dig-net) — это входная точка *поверх* этого; сам dig RPC всегда доступен.
→ [Что такое dig RPC?](./rpc/what-is-the-dig-rpc.md)

## Протокол chia:// {#chia-protocol}

`chia://` — это нативная схема адресации контента DIG Browser — вводимая вручную форма
[URN `urn:dig:`](#urn). Вставьте ссылку `chia://<storeId>/`, и браузер получит контент прямо из сети,
адресованный по содержимому и криптографически верифицированный. → [Протокол chia://](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` — это провайдер кошелька Chia, который **DIG Browser** внедряет на каждую страницу. Он
говорит на [CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), поэтому
веб-приложение может запросить адрес пользователя, подписи и траты без настройки WalletConnect —
готовая альтернатива для приложений, уже говорящих на CHIP-0002. → [Использование window.chia](./browser/using-window-chia.md)
· [Спецификация провайдера window.chia](./protocol/window-chia-provider.md) (нормативная, версионированная)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) — это веб-приложение для публикации и управления
[capsule](#capsule) без CLI — создавайте capsule, деплойте фронтенд и просматривайте свои store прямо
в браузере. Это также контролируемая плоскость управления, которая бюджетирует дорогостоящие задания
ZK-доказательств выполнения.

## dig-node {#dig-node}

**dig-node** — это **сервер** контента сети — сторона предложения. Он размещает [capsule](#capsule),
хранит локальный кэш `.dig` и говорит на [dig RPC](#dig-rpc) идентично `rpc.dig.net`. Для чтения
контента DIG узел **не обязателен** (потребители по умолчанию используют `rpc.dig.net`); запуск узла
делает чтение локально-приоритетным и увеличивает мощность обслуживания сети. Хост **слеп** — он лишь
ретранслирует шифротекст + доказательства.
→ [Запуск узла](./run-a-node/index.md)

## Хендл on.dig.net {#on-dig-net}

**Хендл on.dig.net** — это *опциональный, платный* удобный для человека веб-адрес для [store](#store):
`<ваше-имя>.on.dig.net`. Store **не** получает его автоматически — вы регистрируете хендл (платная
регистрация CHIP-54 / `on.dig.net` в [DIGHUb](#dighub)), и эта регистрация закрепляет store за именем.
Без регистрации адреса `*.on.dig.net` не будет. Это исключительно удобная входная точка: store уже
доступен для чтения через [dig RPC](#dig-rpc) по своему [URN](#urn) / адресу [`chia://`](#chia-protocol)
независимо от наличия хендла. (Хендлы аккаунтов и слаги store — отдельные пространства имён и не
раскрывают поддомен автоматически.) → [Могу ли я получить адрес `*.on.dig.net`?](./support/faq.md#can-i-use-my-own-domain)

## Смотрите также {#related}

- [Обзор DIG Network](./intro.md) — примитивы одним взглядом
- [Quickstart](./quickstart.md) — соберите и просмотрите бесплатно, опубликуйте capsule в конце
- [Создание dapp на Chia](./build-a-dapp/tutorial.md) — все примитивы сшиты в одном выпущенном dapp
- [Что такое dig-store?](./digstore/what-is-digstore.md) — формат store в один файл
- [Что такое dig RPC?](./rpc/what-is-the-dig-rpc.md) — путь чтения сети
- [Протокол chia://](./browser/chia-protocol.md) — адресация контента в браузере
- [Получить помощь](./support/get-help.md) — каналы сообщества и как сообщить об ошибке

## Для агентов и LLM {#for-agents--llms}

Эта документация машиночитаема. Каждая страница несёт schema.org JSON-LD (эта страница — как набор
`DefinedTerm`), и на корне сайта размещены две подготовленные карты:

- [`/llms.txt`](pathname:///llms.txt) — насыщенная ссылками markdown-карта документации ([соглашение llms.txt](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — сущности (концепции + документы) и типизированные связи (`defines`, `part-of`, `requires`, `see-also`).
