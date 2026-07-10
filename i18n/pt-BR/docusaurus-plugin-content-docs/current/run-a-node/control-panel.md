---
sidebar_position: 8
title: O painel de controle do dig-node
description: "Gerencie seu dig-node local pelo painel de controle da DIG Chrome extension: espaço de cache .dig reservado e remoção por LRU, origem upstream, repositórios hospedados, sincronização, pares, status ao vivo e o pareamento do token de controle."
keywords:
  - painel de controle do dig-node
  - cache do dig
  - remoção por LRU
  - espaço de cache reservado
  - pareamento do token de controle
  - repositórios hospedados
  - sincronização do nó
  - pares do nó
tags:
  - dig-node
  - browser
  - dig-rpc
---

# O painel de controle do dig-node

A DIG Chrome extension inclui um **painel de controle** para o seu dig-node local. Nele você vê o status ao vivo do nó, decide quanto espaço em disco reservar para o conteúdo em cache e — depois de uma etapa de pareamento única — gerencia a origem upstream do nó, os repositórios que ele hospeda, sua sincronização e seus pares. O uso diário não exige linha de comando.

O painel de controle é o equivalente embutido na extensão da tela de gerenciamento de nó do DIG Browser: ele conversa com o nó rodando na sua própria máquina, então tudo permanece local.

## Como abrir

1. Abra a extensão.
2. Vá até a aba **Network** (Rede) e escolha **Control** (Controle). (O popup compacto mostra um resumo; use **Abrir painel de controle** para ver cada seção em tela cheia.)

O painel detecta o nó automaticamente:

- **Nó em execução** → você vê a tela de gerenciamento.
- **Nenhum nó encontrado** → você vê uma página curta sobre como instalar um. A navegação continua funcionando — as leituras de conteúdo recorrem à rede pública; um nó só é necessário para a tela de gerenciamento abaixo.

## Status ao vivo

No topo, um indicador ao vivo mostra se o seu nó está **Conectado**, **Conectando** ou **Desconectado**, junto com seu endereço e versão. Ele se atualiza sozinho — inicie ou pare o nó e o indicador muda em poucos segundos, sem precisar reabrir o painel ou atualizar a página.

## Reservar espaço em disco para conteúdo em cache (cache e LRU)

Seu nó mantém um cache local do conteúdo que já buscou, de modo que revisitas sejam instantâneas e você ajude a servir esse conteúdo. O cache tem um **tamanho reservado** — um teto de quanto disco ele pode usar. Quando o cache ultrapassa esse teto, o nó remove automaticamente primeiro os itens **usados há mais tempo** (uma política "LRU"), então o espaço que você reserva nunca é excedido e o conteúdo que você realmente usa permanece em cache.

Esta seção fica disponível de imediato — não precisa de pareamento.

**Veja quanto está em uso.** Uma barra mostra o espaço usado em relação ao teto reservado, além de alguns números ao vivo: quantos itens estão em cache, seu tamanho total, quanto foi removido desde que o nó iniciou, e as contagens de acertos/erros de cache.

**Defina o teto reservado.** Digite um novo tamanho e aplique. O mínimo é **64 MiB**; um valor menor é elevado a esse piso. Reduzir o teto abaixo do que já está em uso dispara a remoção dos itens mais antigos até o uso caber.

**Revise e remova itens em cache.** A lista de itens em cache mostra cada item com seu tamanho, quando foi usado pela última vez e sua **ordem de remoção** (posição `0` é o próximo item a ser removido). Você pode:

- **Remover um item** — remover um único item em cache agora.
- **Limpar tudo** — esvaziar o cache por completo.

Remover itens libera apenas disco local; qualquer coisa que você visite de novo é simplesmente buscada novamente.

:::tip
Dê ao cache o máximo de espaço que puder em uma máquina de onde você navega com frequência — uma reserva maior significa menos rebuscas e mais conteúdo servido localmente. Em uma máquina com espaço limitado, defina uma reserva menor; o LRU mantém os itens mais úteis e descarta o resto.
:::

## Gerenciar o nó (requer pareamento)

As seções restantes alteram a configuração do nó, então exigem sua permissão explícita. Como a extensão roda na sandbox do navegador, ela não consegue ler o arquivo de permissões local do nó diretamente — em vez disso, você faz o **pareamento** uma única vez. O pareamento concede à extensão uma credencial própria, com escopo limitado e revogável; ela nunca expõe a chave mestra do nó, e só pode ser aprovada a partir do computador que roda o nó.

### Parear a extensão com o seu nó

1. No painel de controle, escolha **Parear**. A extensão mostra um **código de 6 dígitos** e um id de pareamento.
2. No computador que roda o nó, em um terminal, execute `dig-node pair` para listar as solicitações pendentes (ou diretamente `dig-node pair approve <pairing-id>`).
3. Confirme que o código exibido no terminal **corresponde** ao código na extensão, depois aprove. Essa correspondência é sua salvaguarda: garante que você está aprovando *esta* extensão e nenhuma outra.
4. O painel de controle muda automaticamente para o estado pareado. A credencial fica armazenada só na extensão.

O código de pareamento **expira em poucos minutos**; se o seu expirar antes de você aprová-lo, escolha **Parear** novamente para obter um novo.

Para deixar de usar a credencial, escolha **Desparear** no painel (isso a esquece localmente). Para revogá-la no próprio nó, execute `dig-node pair revoke <token-id>` naquele computador — o painel volta ao estado não pareado na próxima ação.

:::note
O pareamento só é necessário para as seções de gerenciamento abaixo. O status ao vivo e os controles de cache/LRU acima funcionam sem ele.
:::

### Origem upstream

Veja a origem upstream de onde o nó busca conteúdo e defina uma diferente. Uma origem upstream alterada passa a valer na próxima vez que o nó iniciar.

### Repositórios hospedados

Veja os repositórios que seu nó mantém e fixa, fixe um novo repositório (para que o nó o mantenha e sirva), desfixe um existente e confira o status de qualquer repositório. Fixar uma versão específica a busca antecipadamente para que fique pronta para servir.

### Sincronização

Veja se a sincronização completa autenticada do repositório está disponível e, para uma versão específica, dispare uma sincronização para que o nó a busque e a coloque em cache.

### Pares

Veja o status da rede de pares do seu nó — sua conexão com o relay para alcançabilidade atrás de um roteador doméstico, e os pares aos quais está conectado.

## Relacionados

- [Gerencie seu nó](./manage.md) — as ações administrativas de `control.*` e como o navegador as conduz
- [Aponte um consumidor para o seu nó](./point-a-consumer.md) — configure a extensão, o navegador ou a CLI para usar o seu nó
- [Configure o dig-node](./configure.md) — portas, o teto de cache e a origem upstream
