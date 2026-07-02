---
sidebar_position: 1
title: Run a DIG node
description: "O que é um dig-node, por que rodar um, e como instalá-lo — o repositório apt para Ubuntu/Debian ou o instalador universal multiplataforma."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Run a DIG node {#run-a-dig-node}

> **Sirva conteúdo de forma comprovável e sem conhecer o provedor** — você só lida com ciphertext indistinguível indexado por hashes, pode atestar um serviço fiel com provas de execução, e o cliente verifica tudo contra a chain, então a confiança nunca repousa no seu nó.

Um **dig-node** é o **servidor** de conteúdo da DIG Network — o lado de oferta da rede. Ele hospeda capsules, mantém um cache local `.dig`, e expõe o [dig RPC](../rpc/what-is-the-dig-rpc.md) para que qualquer coisa que leia conteúdo DIG possa lê-lo de você. Ele roda headless (sem navegador, sem interface) como um serviço em segundo plano — uma seedbox para o conteúdo que você publica ou quer ajudar a servir.

Ele é a contrapartida dos **consumidores** — o [DIG Browser](../browser/chia-protocol.md) e a extensão de navegador — que buscam ciphertext + provas, verificam contra a raiz on-chain, descriptografam localmente, e renderizam. Você **não** precisa de um dig-node para ler conteúdo DIG: um consumidor sozinho funciona bem, recorrendo ao nó de referência público em `rpc.dig.net`. Você roda um dig-node para **servir** — e quando um está presente na mesma máquina, o consumidor lê dele (local, amigável a modo offline, e contribuindo para a rede) e ambos compartilham um único cache `.dig`.

:::info Servir vs. consumir
- **dig-node** = serve conteúdo + expõe o dig RPC. Serviço headless em segundo plano.
- **DIG Browser / extensão** = consome conteúdo (verifica + descriptografa localmente). Nenhum nó local necessário.

Quando ambos estão instalados, o navegador/extensão lê do seu dig-node local; caso contrário, lê de `rpc.dig.net`. De qualquer forma, todo byte é verificado no lado do cliente contra a chain — a fonte nunca é confiável por padrão.
:::

## Instale-o {#install-it}

| Sua máquina | Use |
|---|---|
| **Ubuntu / Debian** | O **[repositório apt](./apt.md)** nativo — `apt install dig-node digstore`, ativado automaticamente como um serviço systemd. |
| **Windows / macOS / Linux (qualquer)** | O **[instalador universal](#universal-installer-any-os)** multiplataforma — um único `curl \| sh` (ou download) para qualquer sistema operacional. |

Ambos instalam o mesmo serviço `dig-node` mais a CLI `digstore`. apt é o caminho nativo para Debian (assinado, atualizável via `apt upgrade`); o instalador universal cobre todo o resto.

### apt (Ubuntu / Debian) — recomendado em sistemas da família Debian {#apt-ubuntu--debian--recommended-on-debian-family-systems}

O caminho nativo: um repositório apt assinado em `apt.dig.net`. Ele instala o `dig-node` como um **serviço systemd** gerenciado e o mantém atualizado com `apt upgrade`.

→ **[Instale no Ubuntu/Debian via apt](./apt.md)**

### Instalador universal (qualquer sistema operacional) {#universal-installer-any-os}

O caminho multiplataforma — Windows, macOS, e qualquer Linux. Ele detecta seu sistema operacional, instala o serviço `dig-node` (serviço do Windows / `systemd` / `launchd`) e a CLI `digstore`, e não precisa de nenhum gerenciador de pacotes:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

Este é o mesmo `dig-installer` autocontido publicado na [página de Releases](https://github.com/DIG-Network/dig-installer/releases) — baixe e execute-o diretamente se preferir não fazer pipe para um shell, ou no Windows.

:::note Pré-lançamento
Os instaladores hospedados (`apt.dig.net`, `dig.net/install.sh`) ainda estão sendo provisionados. Até estarem no ar, construa a partir do código-fonte ou pegue um binário nas [Releases do dig-node](https://github.com/DIG-Network/dig-node/releases). Os comandos aqui são os reais e pretendidos.
:::

## Só quer ler conteúdo? {#just-want-to-read-content}

Você não precisa de um nó. Obtenha o **[DIG Browser ↗](https://github.com/DIG-Network/DIG_Browser/releases)** e abra qualquer endereço `chia://` — ele consome do seu dig-node local se você tiver um, senão de `rpc.dig.net`. Veja [O protocolo `chia://`](../browser/chia-protocol.md).

## Relacionados {#related}

- [Instale no Ubuntu/Debian via apt](./apt.md) — o caminho nativo para Debian + gerenciamento do serviço systemd
- [Instale em qualquer lugar — o instalador universal](./universal-installer.md) — Windows / macOS / qualquer Linux + `dig.local`
- [Aponte um consumidor para o seu nó](./point-a-consumer.md) — leituras local-first + o cache `.dig` compartilhado
- [Configure o dig-node](./configure.md) — portas, listeners, limite de cache, upstream
- [Auto-hospede uma origem remota](../rpc/dig-remote.md) — `digstore serve` + clone/pull/push via dig://
- [Gerencie seu nó](./manage.md) — os RPCs administrativos control.* e a interface My Node
- [Usando o RPC da rede pública](../rpc/public-network-rpc.md) — o dig RPC que seu nó fala, e como operar um nó na rede
- [Instalando a CLI](../digstore/cli/install.md) — `digstore` sozinho (publicar, não servir)

## Aprofunde-se: o protocolo {#go-deeper-the-protocol}

- **"host cego e decoys"** → [O modelo de serviço cego do dig RPC](../rpc/what-is-the-dig-rpc.md) · [Conformidade de nó](../rpc/conformance.md)
- **"atestar um serviço fiel"** → [Provas de inclusão vs. execução](../inclusion-vs-execution-proofs.md)
- **"clone/pull/push via dig://"** → [O protocolo de remote §21/§22](../rpc/dig-remote.md)
- **Tudo** → [Aprofundamento no protocolo](../protocol-deep-dive.md) · [Conceitos e glossário](../concepts.md)
