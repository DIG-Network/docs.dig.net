---
sidebar_position: 1
title: For app developers
description: "Publique um site ou aplicação que você realmente possui — mintado on-chain como seu próprio ativo, não alugado. Construa e pré-visualize de graça; pague um pequeno preço uniforme em $DIG somente quando publicar, com arquivos criptografados no seu navegador para que nenhum host possa lê-los."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - dig-store
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# For app developers {#for-app-developers}

> **Publique um site ou aplicação que você realmente POSSUI** — mintado on-chain como seu próprio ativo, não alugado. Construa e pré-visualize de graça; pague um pequeno **preço uniforme em $DIG** somente quando publicar, com arquivos **criptografados no seu navegador** para que nenhum host possa lê-los.

## O modelo mental {#the-mental-model}

Um **[store](../concepts.md#store)** é a identidade permanente do seu site — um singleton on-chain que você controla. A cada publicação, você minta um **[capsule](../concepts.md#capsule)** imutável = `storeId:rootHash`. Um store é apenas a sequência de capsules que você publicou ao longo do tempo.

Duas portas de entrada levam ao **mesmo** ciclo de construir-de-graça → publicar-pago:

- **O caminho web** — [DIGHUb](../concepts.md#dighub) em [hub.dig.net](https://hub.dig.net): solte uma pasta já construída, pré-visualize de graça, conecte uma carteira somente no Publish.
- **O caminho CLI / CI** — a CLI [`dig-store`](../concepts.md#digstore-cli) + [`create-dig-app`](../concepts.md#create-dig-app) + a [GitHub deploy Action](../concepts.md#deploy-action).

Fazer o scaffold, construir e pré-visualizar não custam **nada**. Você paga somente quando publica um capsule.

| O que você está fazendo | Custo |
|---|---|
| Fazer scaffold, construir, pré-visualizar um rascunho | **Grátis** |
| Publicar seu primeiro capsule (mint de um store) | **preço uniforme de capsule em $DIG** + pequena taxa de XCH |
| Publicar cada atualização (um novo capsule) | **preço uniforme de capsule em $DIG** + pequena taxa de XCH |

## Comece por aqui {#start-here}

- **[Quickstart — publique um site em 10 minutos](../quickstart.md)** — o caminho mais rápido, via web ou CLI.

## Publicar pela web — DIGHUb {#publish-from-the-web--dighub}

[**Inicie um novo store na DIGHUb ↗**](https://hub.dig.net/new). Solte seu site já construído (sua pasta `dist/` ou `build/`), obtenha uma **pré-visualização de rascunho gratuita** no caminho de leitura real, e conecte uma carteira somente no passo de **Publish**. Veja o passo a passo da web no [Quickstart → Publicar pela web](../quickstart.md#a-publish-from-the-web).

## Publicar pela CLI — dig-store {#publish-from-the-cli--digstore}

O ciclo no estilo Git: `new` → `dev` → `init` → `commit`.

```sh
dig-store new vite-react   # faz o scaffold de um projeto executável — grátis, sem mint
dig-store dev              # pré-visualiza no caminho de leitura chia:// real, com live-reload — grátis
dig-store init site --dir dist   # faz o mint do primeiro capsule do store (preço uniforme + taxa de XCH)
dig-store commit -m "v1.1"       # publica uma atualização — um novo capsule
```

→ [Quickstart da CLI](../digstore/cli/quickstart.md) · [O fluxo de trabalho completo do projeto](../digstore/cli/project-workflow.md)

## Faça o scaffold de uma aplicação — 5 templates {#scaffold-an-app--5-templates}

Comece a partir de um ponto de partida executável e já conectado a uma carteira — `static`, `vite-react`, `next-static`, `nft-drop`, ou `dapp-window-chia` — via `dig-store new <template>` ou `npm create dig-app`.

→ [Faça o scaffold de uma aplicação](../build-a-dapp/scaffold.md)

## Pré-visualize de graça com `dig-store dev` {#preview-free-with-digstore-dev}

`dig-store dev` serve seu projeto no caminho de leitura **genuíno** da DIG (criptografar → compilar → verificar → descriptografar) com live reload e um `window.chia` de desenvolvimento injetado. O que você vê é o que os visitantes recebem — e nada é mintado ou gasto.

→ [Quickstart da CLI → desenvolver e pré-visualizar](../digstore/cli/quickstart.md)

## `dig.toml` — o manifesto commitável {#digtoml--the-committable-manifest}

`dig.toml` na raiz do seu projeto guarda `store-id`, `output-dir`, `build-command`, `remote`, e outras configurações — compartilhado por `dig-store dev`, `dig-store deploy`, e os templates de scaffold. Ele não guarda **nenhum segredo** (esses vêm do ambiente), então commite-o.

→ [Configuração de projeto e valores em tempo de build](../digstore/cli/configuration.md)

## Atualizações e versões — cada publicação é um novo capsule {#updates--versions--each-publish-is-a-new-capsule}

Toda publicação sela o build atual em um **novo capsule imutável** e avança a raiz on-chain do seu store. Capsules antigos continuam legíveis, e o store sempre resolve para o mais recente, a menos que um leitor fixe um `rootHash` específico.

→ [Ancoragem on-chain](../digstore/cli/onchain-anchoring.md)

## Quanto custa {#what-it-costs}

Grátis para construir e pré-visualizar; um **preço uniforme em $DIG** por capsule publicado, mais uma pequena taxa de rede em XCH — incluída **atomicamente** no mesmo gasto on-chain. O preço é uniforme por capsule por design (para que o tamanho do capsule não revele nada sobre seu conteúdo). Consiga $DIG na TibetSwap, dexie.space, ou 9mm.pro.

→ [Onde conseguir DIG](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Por que todo capsule tem o mesmo preço?](../support/faq.md#why-uniform-price)

## Deploy via push a partir do GitHub Actions {#push-to-deploy-from-github-actions}

Configure o `dig-network/deploy-action` para que cada push publique um novo capsule — com uma proteção `if-changed` que torna um build byte-a-byte idêntico um no-op (sem gasto).

→ [Deploy a partir do GitHub Actions](../digstore/cli/deploy-from-github-actions.md)

## Adicione um endereço web `*.on.dig.net` (opcional) {#add-a-ondignet-web-address-optional}

Seu store é acessível pelo seu endereço [URN](../concepts.md#urn) / [`chia://`](../browser/chia-protocol.md) no momento em que confirma — sem custo extra. Um handle amigável `<nome>.on.dig.net` é um registro **opcional e pago** na DIGHUb, em cima disso.

→ [Posso usar meu próprio domínio?](../support/faq.md#can-i-use-my-own-domain)

---

## Aprofunde-se: o protocolo {#go-deeper-the-protocol}

O modelo em linguagem simples acima é tudo que você precisa para publicar. Quando quiser o design completo:

- **"um store é uma sequência de capsules"** → [Conceitos e glossário](../concepts.md#capsule) · [O modelo de capsule e store](../digstore/format/store-structure.md)
- **"arquivos criptografados no seu navegador"** → [URNs e criptografia](../digstore/format/urns-and-encryption.md)
- **"um preço uniforme + gasto atômico em $DIG"** → [Ancoragem on-chain](../digstore/cli/onchain-anchoring.md#costs) · [Spends de store-coin CHIP-0035](../chip-0035-spends-and-delegation.md)
- **Tudo** → [Aprofundamento no protocolo](../protocol-deep-dive.md)
