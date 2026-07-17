---
sidebar_position: 1
title: What is dig-store?
description: "Formato de projeto no estilo Git, endereçável por conteúdo, com criptografia embutida e endereçamento baseado em URN; compila para um único módulo WebAssembly autodefensivo."
keywords:
  - dig-store
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# What is dig-store? {#what-is-digstore}

**A dig-store é um projeto criptografado e endereçável por conteúdo, no estilo Git, que compila para um único módulo WebAssembly autodefensivo.**

Você tem comandos no estilo Git — `init`, `add`, `commit`, `log`, `clone`, `push`, `pull` — para um projeto que é **criptografado em repouso** e compila em **um único arquivo `.wasm`**. Esse arquivo único é *tanto seus dados quanto o servidor que controla o acesso a eles*. Um host que o armazena ou retransmite vê apenas ciphertext endereçado por hashes; ele não consegue ler o que carrega.

Você endereça o conteúdo com uma **[URN](./format/urns-and-encryption.md)**, e a URN *é* a chave: ela ao mesmo tempo localiza e descriptografa. Entregue uma URN a alguém e essa pessoa poderá ler aquele recurso; sem ela, não pode — não há senha separada ou lista de acesso para gerenciar.

Ao contrário do Git, a dig-store é construída para **saída de build**, não código-fonte de repositório. Você aponta um projeto para um diretório como `dist/` e ele captura o que está lá.

## Por que ela existe {#why-it-exists}

| Problema | A resposta da dig-store |
|---|---|
| Hosts podem ler / escanear o que você publica | O conteúdo é criptografado em repouso; o host guarda apenas ciphertext indexado por hashes |
| Controle de acesso significa senhas e ACLs | A URN *é* a capability — compartilhe-a para conceder leitura, retenha-a para negar |
| Você precisa confiar no servidor para servir bytes genuínos | `clone`/`pull` verificam o store id do módulo, a raiz assinada pelo publicador, e a **raiz do singleton on-chain** antes de instalar — falha de forma fechada |
| "Qual é o tamanho desse payload?" vaza pelo tamanho do arquivo | Todo projeto é um único `.wasm`, com padding para um tamanho uniforme que não revela nada sobre seu conteúdo |
| A lógica de serviço vive separada dos dados | Os dados e o código que controla o acesso a eles compilam no *mesmo* módulo |

## Como ler esta documentação {#how-to-read-these-docs}

- **[O formato dig-store](./format/overview.md)** — os conceitos: projetos, deployments, o módulo `.wasm`, URNs, criptografia e provas. Comece aqui se você quer entender *o que* é a dig-store.
- **[Tutorial da CLI](./cli/install.md)** — instale a CLI e use-a em um projeto real: inicialize um projeto, capture um diretório de build, commite deployments, compartilhe via um remote, e transmita conteúdo de volta.

Se você só quer experimentar, vá direto ao **[Quickstart](../quickstart.md)** (o caminho gratuito, web-first) ou ao **[tutorial da CLI](./cli/quickstart.md)**.

:::note
A dig-store faz parte da [DIG Network](https://dig.net). O design técnico completo está na seção [Protocolo](../protocol-deep-dive.md) — o formato de store WASM endereçável por conteúdo.
:::

## Relacionados {#related}

- [O formato dig-store](./format/overview.md) — projetos, o módulo WASM, URNs, criptografia, provas
- [Estrutura do store](./format/store-structure.md) — identidade do store, generations, e o módulo compilado
- [URNs e criptografia](./format/urns-and-encryption.md) — a URN que endereça *e* descriptografa
- [Tutorial da CLI](./cli/quickstart.md) — crie, commite e leia um store em minutos
- [Conceitos e glossário](../concepts.md) — as entidades centrais da DIG em um relance
