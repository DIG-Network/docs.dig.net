---
sidebar_position: 6
title: Troubleshooting — get unstuck
description: "Toda falha te dá um código estável e um request-id que se conecta diretamente ao log do servidor, os gastos on-chain são protegidos contra race conditions para que você nunca pague em duplicidade, e proteções pré-voo claras evitam capsules desperdiçados antes de você gastar $DIG."
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

> Toda falha te dá um **código estável** e um **request-id** que se conecta diretamente ao log do servidor, os gastos on-chain são **protegidos contra race conditions** para que você nunca pague em duplicidade, e proteções **pré-voo** claras evitam capsules desperdiçados antes de você gastar $DIG.

## O modelo mental — encontre sua falha pelo código {#the-mental-model--find-your-failure-by-its-code}

Toda superfície — o dig RPC, a CLI digstore, a DIGHUb, o loader `chia://`, o SDK — mapeia uma falha para um **código ESTÁVEL**. **Faça branch pelo código, nunca pela mensagem.** Um catálogo consolidado cobre todos eles e também é publicado de forma legível por máquina.

Proteções pré-voo (`digstore doctor`, `--dry-run`, `--if-changed`) e âncoras retomáveis significam que uma publicação travada ou sem efeito **nunca gasta silenciosamente**.

## Falhas comuns de publicação {#common-publishing-failures}

Fundos insuficientes, um timeout de confirmação (retomável — seu gasto não é perdido), e o "a raiz remota avançou" de não-fast-forward.

→ [Solução de problemas](../support/troubleshooting.md)

## Falhas de leitura e verificação {#read--verify-failures}

Incompatibilidade de prova, erros de descriptografia/salt, e respostas de não encontrado / decoy.

→ [Falhas de leitura e verificação](../support/troubleshooting.md#verification-failed)

## Problemas de carteira e sessão {#wallet--session-issues}

Conexão, reautenticação, uma requisição recusada, e sessões somente-leitura que não podem assinar.

→ [A sessão da carteira não consegue assinar](../support/troubleshooting.md#wallet-session)

## Checagens pré-voo e de custo — não desperdice um capsule {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (ambiente + prontidão), `--dry-run` (pré-visualize o custo e o capsule que seria criado), e `--if-changed` (um build byte-a-byte idêntico é um no-op).

→ [Deploy a partir do GitHub Actions](../digstore/cli/deploy-from-github-actions.md) · [Ancoragem on-chain → custo e segurança](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Referência de códigos de erro {#error-codes-reference}

Códigos de saída da CLI · RPC `-32xxx` · DIGHUb · dig-loader · SDK — uma tabela consolidada.

→ [Códigos de erro](../support/error-codes.md)

## FAQ {#faq}

Custo, o teste gratuito, por que o preço é uniforme, onde conseguir $DIG, e "existe uma testnet?".

→ [FAQ](../support/faq.md)

## Obtenha ajuda {#get-help}

Discord + GitHub, e como registrar um bom relatório — **nunca cole segredos**.

→ [Obtenha ajuda](../support/get-help.md)

## Status e changelog {#status--changelog}

→ [Status](../support/status.md) · [Changelog](../support/changelog.md)

---

## Aprofunde-se: o protocolo {#go-deeper-the-protocol}

- **falhas de leitura e verificação** → [Provas e segurança](../digstore/format/proofs-and-security.md) · [URNs e criptografia](../digstore/format/urns-and-encryption.md)
- **códigos `-32xxx` do RPC** → [os métodos do dig RPC](../rpc/methods.md) · [Conformidade](../rpc/conformance.md)
- **Tudo** → [Aprofundamento no protocolo](../protocol-deep-dive.md) · [Conceitos e glossário](../concepts.md)
