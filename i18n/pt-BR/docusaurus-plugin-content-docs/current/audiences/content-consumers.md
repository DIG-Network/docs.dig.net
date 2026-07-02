---
sidebar_position: 5
title: For content consumers
description: "Abra conteúdo chia:// que o seu próprio navegador verifica contra a blockchain — nenhum host pode alterá-lo ou falsificá-lo, o conteúdo privado permanece privado em relação ao host, e ele é permanente e re-hospedável em qualquer lugar, então ninguém pode derrubá-lo ou te prender a um provedor."
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

> **Abra conteúdo `chia://` que o SEU PRÓPRIO navegador verifica contra a blockchain** — nenhum host pode alterá-lo ou falsificá-lo, o conteúdo privado permanece privado em relação ao host, e ele é permanente e re-hospedável em qualquer lugar, então ninguém pode derrubá-lo ou te prender a um provedor.

## O modelo mental {#the-mental-model}

Cole um link `chia://` e o conteúdo vem diretamente da rede — **endereçado por conteúdo** e **criptograficamente verificado no SEU dispositivo** antes de ser renderizado. Ele é **fail-closed**: bytes adulterados ou que não podem ser descriptografados nunca são exibidos.

- **Omita o `rootHash`** para a versão *mais recente* do store: `chia://<storeId>/`.
- **Inclua-o** para fixar um exato e imutável [capsule](../concepts.md#capsule): `chia://<storeId>:<rootHash>/`.

Conteúdo público precisa apenas do link. Conteúdo privado também precisa de um **`?salt=`** secreto — como uma senha.

## Obtenha o DIG Browser, ou a extensão {#get-the-dig-browser-or-the-extension}

- **[Obtenha o DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — um navegador com `chia://` e uma carteira embutida já integrados.
- **A extensão** para Chrome / Edge / Brave / Firefox — adiciona resolução `chia://` a um navegador que você já usa.

## Abrindo conteúdo `chia://` — mais recente vs. fixado {#open-chia-content--latest-vs-pinned}

As formas de endereço, a barra limpa `chia://<store>/`, e quando fixar um `rootHash`.

→ [O protocolo chia://](../browser/chia-protocol.md)

## Páginas embutidas, o selo verificado e os escudos {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings`, e o selo verificado / escudos que mostram o veredito da prova de inclusão de cada recurso para o capsule ativo.

→ [Usando o window.chia](../browser/using-window-chia.md)

## Público vs. privado — quando você precisa de um segredo `?salt=` {#public-vs-private--when-you-need-a-salt-secret}

Stores públicos abrem apenas com o link; stores privados exigem o salt secreto que deriva a chave de descriptografia.

→ [Stores públicos vs. privados](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Público vs. privado — qual a diferença?](../support/faq.md#public-vs-private)

## Rode o conteúdo localmente (opcional) {#run-content-locally-optional}

Aponte seu navegador/extensão para um [dig-node](../concepts.md#dig-node) local para leituras mais rápidas e amigáveis a modo offline — eles compartilham um único cache `.dig`. Você nunca *precisa* de um nó para ler.

→ [Rode um nó](../run-a-node/index.md)

## Consiga $DIG {#get-dig}

Você não precisa de $DIG para *ler* conteúdo. Se quiser publicar, consiga $DIG na **TibetSwap**, **dexie.space**, ou **9mm.pro**.

→ [Onde eu consigo DIG?](../support/faq.md#where-do-i-get-dig)

---

## Aprofunde-se: o protocolo {#go-deeper-the-protocol}

- **"verificado contra a blockchain"** → [Ancoragem on-chain](../digstore/cli/onchain-anchoring.md) · [Provas e segurança](../digstore/format/proofs-and-security.md)
- **"salt público vs. privado"** → [URNs e criptografia](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"mais recente vs. fixado"** → [Generations e root hashes](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Tudo** → [Aprofundamento no protocolo](../protocol-deep-dive.md) · [Conceitos e glossário](../concepts.md)
