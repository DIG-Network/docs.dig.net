---
sidebar_position: 1.5
title: Concepts & glossary
description: "Índice em uma página das entidades centrais da DIG Network — capsule, store, generation, URN, retrieval key, o dig RPC, o protocolo chia:// e a ancoragem on-chain — cada uma definida uma vez e ligada ao seu documento aprofundado."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Concepts & glossary {#concepts--glossary}

Esta página define cada entidade central da DIG Network **uma vez**, em linguagem simples, e liga
cada termo ao documento que se aprofunda nele. É a espinha dorsal legível por humanos da
documentação — e, como cada termo também é emitido como dado estruturado legível por máquina, é o
mapa que um agente pode raspar para aprender o vocabulário da rede. Passe os olhos para se
orientar; siga um link para se aprofundar.

## O capsule {#capsule}

Um **capsule** é uma geração imutável de um store: o par `(storeId, rootHash)`, escrito canonicamente
como `storeId:rootHash`. É a unidade atômica da rede — de compilação (um módulo WASM de tamanho
fixo), [precificação](./digstore/cli/onchain-anchoring.md) (um preço uniforme por capsule para mint
ou commit, pago em $DIG), recuperação (uma [URN](#urn) nomeia um capsule), cache, e proveniência. Um
[store](#store) é uma *sequência de capsules*, um por commit. Esta definição é idêntica na DigStore,
no dig RPC e no DIG Browser. → [O capsule, na íntegra](./intro.md#the-capsule)

## Store {#store}

Um **store** é uma identidade mais seu conteúdo e histórico: uma sequência de [capsules](#capsule), um
por commit. Sua identidade é um **store id** de 64 caracteres hexadecimais, que *é* o launcher id do
seu singleton Chia on-chain — o singleton na chain é a autoridade para a raiz atual do store. Um
store é o equivalente da DIG a um website. → [Estrutura do store](./digstore/format/store-structure.md)

## Generation {#generation}

Uma **generation** é um estado commitado de um [store](#store), identificado por um **root hash** (uma
raiz Merkle sobre as folhas por recurso daquela generation). Cada `commit` sela o conteúdo atual em
uma nova generation, append-only — a mesma coisa que um [capsule](#capsule) nomeia. As generations
crescem monotonicamente, como o histórico do Git. → [Generations e root hashes](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

Uma **URN** é o endereço *e* a chave da DigStore em uma única string:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. Ela ao mesmo tempo **localiza** um recurso e
**deriva a chave que o descriptografa** — possuir a URN é necessário e suficiente para ler um recurso
público. A forma abreviada voltada ao navegador é o [protocolo `chia://`](#chia-protocol). → [URNs e criptografia](./digstore/format/urns-and-encryption.md)

## Retrieval key {#retrieval-key}

A **retrieval key** é `SHA-256(canonical_urn)` — o único endereço que jamais sai do cliente. Ela
localiza o ciphertext de um recurso sem revelar seu caminho ou sua [URN](#urn). Ela é
*independente de root*, então a mesma chave encontra um recurso em diferentes [generations](#generation);
os bytes servidos são então [verificados via Merkle](#merkle-proof) contra a raiz correta. A
**chave de descriptografia**, separada, é derivada localmente (HKDF) a partir da mesma URN e nunca é
enviada. → [Dois valores, uma string](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle proof {#merkle-proof}

Cada [generation](#generation) constrói uma árvore Merkle com uma folha por recurso, comprometendo-se
com os bytes exatos do *ciphertext* servido. Uma única **prova de inclusão** acompanha um recurso
servido e prova que esses bytes pertencem exatamente àquela raiz — assim o conteúdo é verificado sem
nunca ser descriptografado, e um nó nunca é confiável para ter retornado bytes genuínos. → [Provas Merkle](./digstore/format/proofs-and-security.md)

## On-chain anchoring {#anchoring}

Todo store é um **singleton na mainnet da Chia**. `digstore init` faz o mint dele (o launcher id
*se torna* o store id) e todo `digstore commit` ancora uma nova raiz de [generation](#generation)
on-chain como uma atualização de singleton CHIP-0035. Ambos bloqueiam até a confirmação e gastam
fundos reais. A chain é a autoridade para a raiz mais recente de um store. → [Ancoragem on-chain](./digstore/cli/onchain-anchoring.md)

## DIG payment {#dig-payment}

**$DIG** é o token da DIG Network (um CAT da Chia). Fazer o mint de um [capsule](#capsule) (`init`) ou
commitar um custa um **preço uniforme por capsule em $DIG**, incluído **atomicamente no mesmo gasto
on-chain** que a ancoragem — não há transação separada, e o memo carrega o id do store. → [Custos](./digstore/cli/onchain-anchoring.md#costs)

## DigStore CLI {#digstore-cli}

`digstore` é a ferramenta de linha de comando que cria, commita, compartilha e lê stores — um fluxo
de trabalho no formato do Git (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`) sobre o
formato de store criptografado e on-chain. → [Referência de comandos](./digstore/cli/command-reference.md) · [Tutorial da CLI](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml` é o **manifesto de projeto commitável** na raiz de um projeto — `store-id`, `output-dir`,
`build-command`, e outras configurações de projeto, compartilhado por `digstore dev`, `digstore deploy`,
e os templates de scaffolding. Ele não guarda **nenhum segredo** (esses vêm do ambiente), então é
seguro commitá-lo. → [Configuração de projeto e valores em tempo de build](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`) é a **porta de entrada em JS** para iniciar um projeto DIG: ele
faz o scaffold de um projeto inicial executável — uma aplicação, um [`dig.toml`](#dig-toml), e (para os
templates com carteira) o [DIG SDK](#dig-sdk) já conectado — a partir de um de cinco templates
(`static`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia`). O scaffolding é **gratuito** —
sem mint, sem chain, sem gasto; você paga o preço uniforme de capsule somente quando publica um
[capsule](#capsule). É o companheiro do lado npm para o `digstore new` da CLI em Rust. → [Faça o scaffold de uma aplicação](./build-a-dapp/scaffold.md)

## The GitHub deploy Action {#deploy-action}

`dig-network/deploy-action` é a **GitHub Action de deploy via git-push**: ela instala a
[CLI `digstore`](#digstore-cli) no runner, executa `digstore deploy` para avançar seu store (nunca
faz mint), e reporta o [capsule](#capsule) publicado + URLs + custo de volta como outputs de step, um
comentário de PR, um GitHub Deployment, e um commit status. Com `if-changed` (padrão), um build
byte-a-byte idêntico é um no-op — sem gasto. → [Deploy a partir do GitHub Actions](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

O **DIG SDK** (`@dignetwork/dig-sdk`) é o pacote npm tipado para desenvolvedores de integração: um
`ChiaProvider` (prefere o [`window.chia`](#window-chia) injetado, com fallback para WalletConnect → Sage),
um `DigClient` (lê conteúdo verificado e criptografado via o [dig RPC](#dig-rpc)), um `Paywall`
(um helper de alto nível para pagamento-para-desbloquear / acesso restrito por NFT que compõe o
provider com o construtor de spends), e o construtor de spends canônico CHIP-0035, reexportado no
subcaminho `/spend`.
→ [Construa um dapp na Chia](./build-a-dapp/tutorial.md)

## The dig RPC {#dig-rpc}

O **dig RPC** é a interface de leitura de toda a rede: um serviço JSON-RPC 2.0 sobre HTTPS `POST` que
todo nó de hospedagem fala de forma idêntica. Ele serve ciphertext + [provas de inclusão](#merkle-proof)
por [retrieval key](#retrieval-key), [capsules](#capsule) inteiros por `(storeId, root)`, e metadados de
descoberta — cego por construção, verificado e descriptografado no lado do cliente. **É o caminho de
leitura universal**: todo capsule publicado é legível aqui pelo seu endereço [URN](#urn) /
[`chia://`](#chia-protocol) no momento em que confirma on-chain — sem registro e sem pagamento além de
publicar o capsule. O opcional e amigável [handle `*.on.dig.net`](#on-dig-net) é uma porta de entrada
*em cima disso*; o dig RPC em si está sempre disponível. → [O que é o dig RPC?](./rpc/what-is-the-dig-rpc.md)

## The chia:// protocol {#chia-protocol}

`chia://` é o esquema nativo de endereçamento de conteúdo do DIG Browser — a frente digitável da
[URN `urn:dig:`](#urn). Cole um link `chia://<storeId>/` e o navegador busca o conteúdo diretamente da
rede, endereçado por conteúdo e criptograficamente verificado. → [O protocolo chia://](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia` é o provedor de carteira Chia que o **DIG Browser** injeta em toda página. Ele fala
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md), então uma aplicação
web pode solicitar o endereço, assinaturas e gastos do usuário sem nenhuma configuração de
WalletConnect — uma alternativa plug-and-play para aplicações que já falam CHIP-0002. → [Usando o window.chia](./browser/using-window-chia.md)
· [A especificação do provider window.chia](./protocol/window-chia-provider.md) (normativa, versionada)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)) é a aplicação web para publicar e gerenciar
[capsules](#capsule) sem a CLI — crie um capsule, faça o deploy de um frontend e veja seus stores no
navegador. Também é o plano de controle com acesso restrito que orça os jobs caros de prova de
execução ZK.

## dig-node {#dig-node}

Um **dig-node** é o **servidor** de conteúdo da rede — o lado de oferta. Ele hospeda [capsules](#capsule), mantém
um cache local `.dig`, e fala o [dig RPC](#dig-rpc) de forma idêntica ao `rpc.dig.net`. Você **não**
precisa de um para ler conteúdo DIG (os consumidores caem de volta para `rpc.dig.net`); rodar um
torna as leituras locais-first e contribui com capacidade de serviço. O host é **cego** — ele apenas
retransmite ciphertext + provas.
→ [Rode um nó](./run-a-node/index.md)

## on.dig.net handle {#on-dig-net}

Um **handle on.dig.net** é um endereço web amigável *opcional e pago* para um [store](#store):
`<seu-nome>.on.dig.net`. Um store **não** recebe um automaticamente — você registra o handle (um
registro pago CHIP-54 / `on.dig.net` na [DIGHUb](#dighub)) e esse registro fixa o store a esse nome.
Nenhum registro significa nenhum endereço `*.on.dig.net`. É puramente uma porta de entrada de
conveniência: o store já é legível via o [dig RPC](#dig-rpc) pelo seu endereço [URN](#urn) /
[`chia://`](#chia-protocol), exista ou não um handle. (Handles de conta e slugs de store são namespaces
separados e não expõem automaticamente um subdomínio.) → [Posso obter um endereço `*.on.dig.net`?](./support/faq.md#can-i-use-my-own-domain)

## Relacionados {#related}

- [Visão geral da DIG Network](./intro.md) — os primitivos em um relance
- [Quickstart](./quickstart.md) — construa e pré-visualize de graça, publique um capsule no final
- [Construa um dapp na Chia](./build-a-dapp/tutorial.md) — todo primitivo unido em um único dapp publicado
- [O que é a DigStore?](./digstore/what-is-digstore.md) — o formato de store em um único arquivo
- [O que é o dig RPC?](./rpc/what-is-the-dig-rpc.md) — o caminho de leitura da rede
- [O protocolo chia://](./browser/chia-protocol.md) — endereçando conteúdo no navegador
- [Obtenha ajuda](./support/get-help.md) — canais da comunidade e como reportar

## Para agentes e LLMs {#for-agents--llms}

Esta documentação é extraível por máquina. Cada página carrega JSON-LD do schema.org (esta como um
conjunto `DefinedTerm`), e dois mapas selecionados vivem na raiz do site:

- [`/llms.txt`](pathname:///llms.txt) — um mapa em markdown rico em links da documentação ([convenção llms.txt](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — entidades (conceitos + documentos) e arestas tipadas (`defines`, `part-of`, `requires`, `see-also`).
