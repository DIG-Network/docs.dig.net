---
sidebar_position: 1
slug: /
title: DIG Network
description: "Visão geral dos primitivos da DIG Network: dig-store para publicação com endereçamento por conteúdo, dig RPC para hospedagem e recuperação cegas, e o DIG Browser para acesso a conteúdo."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - dig-store
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**A DIG Network é uma Layer 2 Proof-of-Stake sobre a Chia** — uma rede descentralizada para publicar, endereçar e servir conteúdo sem confiar no host.

Esta documentação cobre a rede e seus **primitivos**: os blocos de construção componíveis que os desenvolvedores usam para construir sobre a DIG. A rede ainda está em expansão, e mais primitivos serão documentados aqui ao longo do tempo.

:::info O $DIG move a rede
**O $DIG é o motor e a economia da DIG Network.** Toda troca de valor — publicar um capsule, ser dono de um store, dar uma gorjeta a um criador — flui através do $DIG. Consumir conteúdo continua sendo simples e gratuito: você nunca paga para ler, apenas para publicar e possuir.
:::

## O capsule {#the-capsule}

Um conceito percorre todos os primitivos. Um **capsule** é uma única geração imutável de um store — o par `(storeId, rootHash)`, escrito canonicamente como `storeId:rootHash`. Um **store é uma sequência de capsules**, um por commit (cada commit avança a raiz on-chain e produz um novo capsule).

O capsule é a unidade da rede para:

- **Compilação** — cada capsule é compilado em um módulo WASM de tamanho fixo (com padding para que seu tamanho não revele nada sobre o tamanho do conteúdo).
- **Precificação** — um **preço uniforme por capsule** (mint ou commit), pago em $DIG à cotação vigente; o custo de vida útil de um store é o preço uniforme por capsule × o número de capsules.
- **Recuperação** — uma URN nomeia um capsule (mais um recurso opcional dentro dele).
- **Cache** — um host ou navegador armazena em cache um capsule indexado por `storeId:rootHash`; o cache local é um conjunto de capsules.
- **Proveniência** — a raiz de cada capsule carrega a assinatura BLS do publicador e uma raiz Merkle.

Esta é a definição válida em todo o ecossistema: "capsule = `(storeId, rootHash)`" significa a mesma coisa na dig-store, no dig RPC e no DIG Browser.

:::tip Experimente
[**Crie seu primeiro capsule na DIGHUb ↗**](https://hub.dig.net/new) — publique um site no navegador, sem precisar de CLI. Cada capsule (mint ou commit) custa o **preço uniforme de capsule em $DIG**.
:::

## Primitivos {#primitives}

### 🗄️ dig-store {#️-digstore}

O primeiro e mais fundamental primitivo: um **projeto WASM criptografado e endereçável por conteúdo**. Você aponta para um diretório de build, faz commit dos deployments como no Git, e obtém um único arquivo `.wasm` autodefensivo que é ao mesmo tempo seus dados e o servidor que controla o acesso a eles. A URN *é* a chave — ela localiza e descriptografa ao mesmo tempo.

→ **[Explore a dig-store](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[O que é a dig-store?](./digstore/what-is-digstore.md)** | A ideia de um único arquivo, em poucas palavras |
| **[O formato](./digstore/format/overview.md)** | Projetos, deployments, URNs, criptografia, provas |
| **[Tutorial da CLI](./digstore/cli/quickstart.md)** | Instale e use o `dig-store` no seu projeto |

### 🛰️ dig RPC {#️-dig-rpc}

O primitivo de rede: uma **interface padrão para ler conteúdo de deployments dig-store hospedados**. JSON-RPC 2.0 sobre HTTPS `POST` — todo nó de hospedagem fala o mesmo protocolo de forma idêntica, então o conteúdo é portável e os clientes são agnósticos em relação ao nó. Ele serve ciphertext + provas de inclusão por chave de recuperação, deployments inteiros por `(store_id, root)`, e o manifesto público de descoberta — transmitido em chunks, cego por construção, verificado e descriptografado inteiramente no lado do cliente.

→ **[Explore o dig RPC](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[O que é o dig RPC?](./rpc/what-is-the-dig-rpc.md)** | Um único endpoint para todo o caminho de leitura da rede |
| **[Métodos](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Streaming](./rpc/streaming.md)** | O modelo de chunks, remontagem e verificação de provas |
| **[Conformidade e segurança](./rpc/conformance.md)** | O modelo cego, CORS, e o que um nó precisa implementar |

### 🌐 DIG Browser {#-dig-browser}

O primitivo de cliente: um **navegador com uma carteira Chia embutida**. Ele injeta um provedor `window.chia` em toda página, então qualquer aplicação web pode solicitar o endereço, assinaturas e gastos do usuário sem nenhuma configuração de WalletConnect — uma alternativa plug-and-play para aplicações que já falam CHIP-0002. Ele também resolve endereços de conteúdo `chia://` diretamente.

→ **[Desenvolva contra o DIG Browser](./browser/using-window-chia.md)**

| | |
|---|---|
| **[Usando `window.chia` na sua aplicação](./browser/using-window-chia.md)** | Detecte a carteira injetada, conecte-se e chame métodos CHIP-0002 |

:::tip Experimente
[**Obtenha o DIG Browser ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — baixe o navegador para abrir conteúdo `chia://` e usar a carteira embutida.
:::

*Mais primitivos — liquidação e operação de nós — ganharão suas próprias seções à medida que forem lançados.*

## Escolha seu caminho {#pick-your-path}

A documentação está organizada em torno **do que você está fazendo**. Cada trilha começa com um "porquê" de dez segundos, o modelo mental necessário e o passo a passo de maior sinal — depois leva ao protocolo quando você quiser se aprofundar.

- **[Publique um site ou app que você possui](./audiences/app-developers.md)** — lance um site/app como seu próprio ativo on-chain; construa de graça, publique um capsule.
- **[Crie NFTs e coleções](./audiences/nft-developers.md)** — drops CHIP-0007 apoiados por capsules permanentes e à prova de adulteração.
- **[Integre a DIG na sua aplicação](./audiences/integration-developers.md)** — um SDK tipado + uma plataforma totalmente legível por máquina.
- **[Rode um nó](./run-a-node/index.md)** — sirva conteúdo de forma comprovável e sem conhecer o provedor.
- **[Abra conteúdo chia://](./audiences/content-consumers.md)** — leia conteúdo que o seu próprio navegador verifica contra a chain.
- **[Resolva um problema](./audiences/troubleshooting.md)** — encontre sua falha pelo código estável.

Novo no vocabulário? Dê uma olhada em [Conceitos e glossário](./concepts.md). Quer o design completo? Leia o [Aprofundamento no protocolo](./protocol-deep-dive.md).

:::note
A DIG Network e seus primitivos são open source. A dig-store é licenciada sob GPL-2.0; veja o [repositório dig-store](https://github.com/DIG-Network/dig-store).
:::

## Relacionados {#related}

- [Quickstart](./quickstart.md) — publique seu primeiro site; grátis para construir e pré-visualizar
- [Construa um dapp na Chia](./build-a-dapp/tutorial.md) — cada primitivo em um único tutorial de ponta a ponta
- [Conceitos e glossário](./concepts.md) — as entidades centrais da DIG, definidas e ligadas
- [O que é a dig-store?](./digstore/what-is-digstore.md) — o formato de store endereçável por conteúdo
- [O que é o dig RPC?](./rpc/what-is-the-dig-rpc.md) — a interface de leitura de toda a rede
- [O protocolo chia://](./browser/chia-protocol.md) — abrindo conteúdo no DIG Browser
- [Obtenha ajuda](./support/get-help.md) — comunidade, solução de problemas e códigos de erro
