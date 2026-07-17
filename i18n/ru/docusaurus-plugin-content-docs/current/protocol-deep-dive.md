---
sidebar_position: 1
title: "Protocol: Overview"
description: "Протокол DIG в виде семи слоёв снизу вверх, нормативных и определяемых реализацией. Capsule (storeId:rootHash) — фундаментальная единица; хост слеп, а читатель верифицирует по блокчейну. Это авторитетный справочник протокола."
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protocol: Overview {#protocol-overview}

Это **нормативная спецификация** протокола DIG, определённая как **семь слоёв, снизу вверх**. Каждый слой называет свой **канонический crate/файл** как нормативный источник.

:::info Это авторитетный справочник протокола
Этот раздел — источник истины о том, как работает сеть. Он документирует протокол таким, каким он фактически работает, с цитатами `file:line` из канонической реализации.
:::

## Фундаментальная единица: capsule {#the-fundamental-unit-the-capsule}

Одна концепция проходит через каждый слой: **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, канонически `storeId:rootHash`. **Store** — это упорядоченная последовательность capsule (от старых к новым), по одной на коммит; его идентичность `store_id` *является* launcher id синглтона DataLayer CHIP-0035 на Chia. Идентичность, компиляция, ценообразование, получение, кэширование и происхождение — всё определено **на уровне capsule**.

## Тезис: слепой хост, верификация на клиенте, корень, закреплённый в блокчейне {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Слепой хост.** Хост хранит только непрозрачный шифротекст, ключ к которому — хеши. У него нет URN и ключа, он ретранслирует вывод самой capsule дословно и не может отличить попадание от промаха. В проводном протоколе нет поля `decoy`, и CDN не существует — контент обслуживается только через [dig RPC](./protocol/dig-rpc.md).
- **Верификация на клиенте.** Каждый байт проверяется на устройстве читателя относительно on-chain корня с помощью доказательства включения по Меркла для каждого ресурса, а затем аутентифицированно расшифровывается. Доверие никогда не опирается на источник обслуживания.
- **Корень, закреплённый в блокчейне.** Доверенный корень поступает **только** из синглтона CHIP-0035 на Chia (разрешается через coinset.org), никогда из отданного «latest».

## Семь слоёв {#the-seven-layers}

| # | Слой | Что определяет | Канонический источник |
|---|---|---|---|
| 0 | [Идентичность и именование](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN и адресация](./protocol/urn-and-addressing.md) | грамматика `urn:dig:chia:…`; `retrieval_key` без корня | `digstore-core::urn`, `lib.rs` |
| 1 | [Криптография](./protocol/cryptography.md) | KDF на основе HKDF; запечатывание AES-256-GCM-SIV | `digstore-core::crypto` |
| 1 | [Доказательства включения по Меркла](./protocol/merkle-proofs.md) | лист на ресурс D5; свёртка NODE_TAG | `digstore-core::merkle` |
| 1 | [BLS-подписи и DST](./protocol/bls-signatures.md) | AugScheme Chia; пять ролевых DST | `digstore-crypto::bls` |
| 2 | [Формат capsule](./protocol/capsule-format.md) | секция данных DIGS (BINDING D1) | `digstore-core::datasection` |
| 2 | [Самозащищённый модуль](./protocol/self-defending-module.md) | обфускация фиксированного размера; обслуживающий guest | `digstore-compiler`, `digstore-guest` |
| 4 | [On-chain закрепление](./protocol/on-chain-anchoring.md) | store = синглтон; capsule = продвижение корня | `chip35_dl_coin`, `digstore-chain` |
| 4 | [Оплата и ценообразование DIG CAT](./protocol/dig-cat-payment.md) | за capsule, динамическая, привязана к USD | `chip35_dl_coin::dig` |
| 6 | [dig RPC](./protocol/dig-rpc.md) | машинный интерфейс (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [Транспорт §21 и push](./protocol/transport-and-push.md) | локатор `dig://`, REST, push v1 | `digstore-remote` |
| 7 | [Одноранговая сеть DIG Node](./protocol/peer-network.md) | mTLS-идентичность узла, обход NAT, STUN, интродьюсер, релейный протокол, peer RPC | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Верификация и происхождение](./protocol/verification-and-provenance.md) | четыре упорядоченных шлюза целостности | `digstore-core::merkle`, `dig-node` |
| 6 | [Модель слепого хоста](./protocol/blind-host-model.md) | слепота провайдера; резолвер; плоскость управления `/v1` | hub `retrieval`/`resolver`/`api` |
| — | [Соответствие и паритет](./protocol/conformance-and-parity.md) | дисциплина паритета между реализациями | замороженные golden-файлы, диф OpenRPC |

(Слои 3 и транспорт §21 переплетаются с путём чтения; таблица группирует их там, где читатель их встречает. Полная нумерация слоёв дана на каждой странице.)

## Как capsule проходит через слои {#how-a-capsule-flows-through-the-layers}

Издатель **разбивает на чанки и шифрует** (L1) контент в **формат capsule** (L2), который **сам себя обслуживает** (L3), **закрепляет** его в блокчейне (L4) и **отправляет** его через транспорт §21 (L5). Любой клиент **читает** её через dig RPC и **верифицирует** относительно закреплённого в блокчейне корня полностью на стороне клиента (L6). Каждая криптографическая константа имеет **одно** определение, общее для производителя, хоста и верификатора — [инвариант паритета C8](./protocol/conformance-and-parity.md).

## Терминология {#terminology}

- **`chia://`** — сетевой адрес **контента** (то, что открывает браузер).
- **`dig://`** — локатор **транспорта** §21 (плоскость CLI/peer) *и* внутренняя схема страниц DIG Browser — два разных применения, никогда не адрес контента.
- **`urn:dig:`** — пространство имён URN, из которого происходят оба вышеупомянутых.
- **store / capsule** — идентичность и её неизменяемое generation.
- **$DIG** — CAT, оплачиваемый за каждую capsule; **dig-store** — формат store.

## Смотрите также {#related}

- [Концепции и глоссарий](./concepts.md) — каждая сущность определена один раз
- [Идентичность и именование](./protocol/identity-and-naming.md) — Слой 0, с которого начинается спецификация
- [dig RPC](./protocol/dig-rpc.md) — машинный интерфейс протокола
- [Одноранговая сеть DIG Node](./protocol/peer-network.md) — как узлы находят и достигают друг друга (mTLS, обход NAT, релей)
- [Соответствие и паритет](./protocol/conformance-and-parity.md) — дисциплина паритета между реализациями
