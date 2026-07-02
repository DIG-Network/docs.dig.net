---
sidebar_position: 3
title: For integration developers
description: "Uma plataforma totalmente legível por máquina — OpenAPI/OpenRPC, uma taxonomia de erros catalogada, precificação ao vivo, JWKS, JSON por página, e um @dignetwork/dig-sdk tipado — para você conectar uma carteira + leituras verificadas na sua aplicação sem raspar uma única linha de texto humano."
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

> **Uma plataforma totalmente legível por máquina** — OpenAPI/OpenRPC, uma taxonomia de erros catalogada, precificação ao vivo, JWKS, JSON por página, e um `@dignetwork/dig-sdk` tipado — para você conectar uma carteira + leituras verificadas na sua aplicação **sem raspar uma única linha de texto humano**.

## O modelo mental — duas superfícies, mantidas separadas {#the-mental-model--two-surfaces-kept-separate}

1. **Um plano de controle REST** — `hub.dig.net/v1`, com bearer-JWT — para gerenciar stores, domínios, times e NFTs.
2. **Um caminho de LEITURA JSON-RPC 2.0 dig agnóstico em relação ao nó** — `rpc.dig.net` — que transmite **ciphertext verificado**.

Uma única superfície de **carteira** ([`window.chia` CHIP-0002](../concepts.md#window-chia)) sobre dois transportes — injetado (DIG Browser) ou WalletConnect → Sage — unificados pelo `ChiaProvider` do SDK. Os spends são sempre construídos pelo wasm canônico CHIP-0035 e assinados pela carteira do usuário — **nunca feitos à mão**. Faça branch em **códigos de erro estáveis**, nunca em texto livre.

## Construa um dapp — de ponta a ponta {#build-a-dapp--end-to-end}

O fio único do scaffold até uma aplicação com carteira, no ar no seu próprio domínio.

→ [Construa um dapp na Chia](../build-a-dapp/tutorial.md)

## O DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, e os spends canônicos reexportados no subcaminho `/spend`. Instalação, subcaminhos, e `capabilities()`.

→ [O DIG SDK](../sdk.md)

## Conecte uma carteira — `window.chia` {#connect-a-wallet--windowchia}

Detecte o provider injetado, chame `connect()` (consentimento por origem), e use os métodos CHIP-0002.

→ [Usando o window.chia](../browser/using-window-chia.md) · especificação: [o provider window.chia](../protocol/window-chia-provider.md)

## Leia conteúdo verificado — `DigClient` + os métodos do dig RPC {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient` transmite ciphertext + provas de inclusão e **verifica-então-descriptografa** no lado do cliente. Chame os métodos diretamente quando precisar.

→ [O que é o dig RPC?](../rpc/what-is-the-dig-rpc.md) · [Métodos](../rpc/methods.md)

## Streaming e remontagem {#streaming--reassembly}

O modelo de chunks, a [retrieval key](../concepts.md#retrieval-key), e a ordem verificar-então-descriptografar.

→ [Streaming](../rpc/streaming.md)

## Construindo spends — o construtor canônico CHIP-0035 {#building-spends--the-canonical-chip-0035-builder}

A divisão **construir → assinar → transmitir**: o wasm constrói o pacote de spend, a carteira assina, você transmite. O hub nunca constrói um spend à mão, e você também não deveria.

→ [Construindo spends](../spends.md)

## O plano de controle `/v1` do hub {#the-hub-v1-control-plane}

Autenticação (JWT / OIDC / pareamento de dispositivo), stores, domínios, analytics, e webhooks via REST.

→ [Superfícies legíveis por máquina](../machine-surfaces.md#openapi) para o documento OpenAPI.

## Deploy em CI — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Modos, OIDC sem chaves, o enum de resultado, e a saída `--json` para steps posteriores.

→ [Deploy a partir do GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Superfícies legíveis por máquina {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — descubra e integre sem raspar texto livre.

→ [Superfícies legíveis por máquina](../machine-surfaces.md)

## Códigos de erro — faça branch pelo código {#error-codes--branch-on-the-code}

Uma referência consolidada em todo o dig RPC, a CLI, a DIGHUb, o dig loader, e o SDK.

→ [Códigos de erro](../support/error-codes.md)

---

## Aprofunde-se: o protocolo {#go-deeper-the-protocol}

- **"leituras verificadas"** → [O dig RPC (interface de conteúdo da rede)](../rpc/what-is-the-dig-rpc.md) · [Provas de inclusão vs. execução](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [a especificação normativa do provider](../protocol/window-chia-provider.md)
- **"retrieval_key e streaming"** → [URNs e criptografia](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Streaming](../rpc/streaming.md)
- **"um deploy token é uma chave de escrita revogável"** → [Spends e delegação CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Tudo** → [Aprofundamento no protocolo](../protocol-deep-dive.md) · [Conceitos e glossário](../concepts.md)
