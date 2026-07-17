---
sidebar_position: 2
title: For NFT developers
description: "Minte uma coleção CHIP-0007 inteira cuja arte vive permanentemente em um capsule DIG à prova de adulteração — um único pacote atômico assinado, royalties reais, e mecânicas de drop honestas que nunca simulam o que ainda não conseguem provar on-chain."
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

> **Minte uma coleção CHIP-0007 inteira cuja arte vive PERMANENTEMENTE em um capsule DIG à prova de adulteração** — um único pacote atômico assinado, royalties reais, e mecânicas de drop honestas (reveal / allowlist / fases) que nunca simulam o que ainda não conseguem provar on-chain.

## O modelo mental {#the-mental-model}

Primeiro coloque sua arte em um **[capsule DIG](../concepts.md#capsule)**, depois minte NFTs cujos `data_uris` / `metadata_uris` apontam para esse capsule. Os hashes on-chain fixam os bytes reais — então a arte é endereçada por conteúdo, verificável, e permanente, não um link que pode apodrecer ou ser trocado.

Os spends **nunca são feitos à mão**: o construtor wasm canônico CHIP-0035 (via [`@dignetwork/dig-sdk/spend`](../sdk.md)) constrói todo spend de coin, sua carteira assina uma vez, e ele transmite uma vez.

Mintar um **store é gratuito** em $DIG — você paga o **preço uniforme de capsule** somente quando um capsule é criado (quando a arte é gravada em um capsule).

## Faça o scaffold de uma página de mint — o template `nft-drop` {#scaffold-a-mint-page--the-nft-drop-template}

Comece a partir de uma página de drop já conectada a uma carteira em um único comando:

```sh
dig-store new nft-drop
# ou
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Faça o scaffold de uma aplicação](../build-a-dapp/scaffold.md)

## Minte pela CLI {#mint-from-the-cli}

A CLI de ativos constrói o spend via os builders do `digstore-chain`, assina com a seed da sua carteira, e transmite — tudo compatível com `--dry-run` / `--json` para CI:

```sh
dig-store did create                          # um DID de emissor para atribuição
dig-store collection create --name "My Drop"  # uma coleção CHIP-0007
dig-store nft mint --data ./art.png --metadata ./meta.json --dry-run
dig-store offer make ...                       # trocas de XCH / CAT
```

O caminho **capsule-media** do `nft mint` grava a arte + os metadados CHIP-0007 em um capsule, calcula os hashes de dados/metadados a partir dos bytes reais, e define as URIs para o endereço `chia://` do capsule (com um fallback via gateway https). → [Referência de comandos](../digstore/cli/command-reference.md)

## Minte pela web — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Minte uma coleção apoiada por capsule no navegador: envie a arte (gravada em um capsule), defina royalties, e vincule um DID para atribuição — a carteira assina no final. → [DIGHUb ↗](https://hub.dig.net)

## Drops — reveal, allowlist, fases {#drops--reveal-allowlist-phases}

As mecânicas de drop são apresentadas **de forma honesta**: o que é aplicado on-chain hoje vs. o que é uma conveniência off-chain pendente do primitivo claim-coin. Nunca apresentamos uma garantia que ainda não podemos provar on-chain.

→ [Construa um dapp na Chia](../build-a-dapp/tutorial.md) para o fio de ponta a ponta do mint.

## Construa spends com o SDK — nunca faça à mão {#build-spends-with-the-sdk--never-hand-roll}

Todo spend de coin é construído pelo wasm canônico CHIP-0035 e reexportado em `@dignetwork/dig-sdk/spend`. O fluxo é sempre **construir → assinar → transmitir**, dividido para que a carteira só precise assinar.

→ [Construindo spends](../spends.md) · [O DIG SDK](../sdk.md)

## Monetize e restrinja o acesso — o Paywall {#monetize--gate--the-paywall}

O `Paywall` do SDK compõe o provider com o construtor de spends para **pagar-para-desbloquear** e **restrição de acesso por posse de NFT / coleção** — sem conectar spends manualmente.

→ [O DIG SDK → Paywall](../sdk.md#paywall)

## Offers — criar / aceitar / exibir {#offers--make--take--show}

Troque NFTs por XCH ou CATs com `dig-store offer make | take | show` (cada um compatível com `--dry-run` / `--json`). → [Referência de comandos](../digstore/cli/command-reference.md)

---

## Aprofunde-se: o protocolo {#go-deeper-the-protocol}

- **"capsule à prova de adulteração"** → [Provas e segurança](../digstore/format/proofs-and-security.md) · [O modelo de capsule e store](../digstore/format/store-structure.md)
- **"nunca faça um spend à mão"** → [Spends de store-coin CHIP-0035 e delegação](../chip-0035-spends-and-delegation.md)
- **Tudo** → [Aprofundamento no protocolo](../protocol-deep-dive.md) · [Conceitos e glossário](../concepts.md)
