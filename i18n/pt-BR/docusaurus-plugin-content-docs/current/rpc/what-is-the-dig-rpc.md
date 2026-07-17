---
sidebar_position: 1
title: What is the dig RPC?
description: "Interface de leitura de toda a rede para capsules dig-store via JSON-RPC 2.0; cega por construção, verificável sem confiança, e transmissível em qualquer tamanho."
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# What is the dig RPC? {#what-is-the-dig-rpc}

:::info Especificação normativa
Esta é a página de orientação. A especificação normativa da interface de máquina — métodos, o objeto de wire dos chunks, o perfil de nó, e os documentos OpenRPC — está em [Protocolo · O dig RPC](../protocol/dig-rpc.md).
:::

**O dig RPC é a interface de toda a rede para ler conteúdo diretamente de capsules `.dig` da dig-store hospedados.** É um serviço [JSON-RPC 2.0](https://www.jsonrpc.org/specification) falado sobre HTTPS `POST`.

Todo nó que hospeda capsules — o nó de referência em `https://rpc.dig.net`, ou qualquer nó de terceiros — expõe os **mesmos métodos com a mesma semântica**. Um cliente escrito contra essa interface lê de toda a rede através de um único endpoint. Não há CDN; todo o serviço de conteúdo na DIG é via o dig RPC.

Ele serve três coisas:

| Você tem… | Você chama… | Você recebe de volta… |
|---|---|---|
| A **retrieval key** de um recurso (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | O ciphertext do recurso + uma prova de inclusão merkle (e a prova de execução ZK), transmitidos em chunks |
| Um **store id + raiz de generation** | [`dig.getCapsule`](./methods.md#diggetcapsule) | O capsule `.dig` inteiro daquela generation, transmitido em chunks |
| Um **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | O manifesto público de descoberta / o manifesto de metadados do store / a lista de generations confirmadas do store |

## Três propriedades que o definem {#three-properties-that-define-it}

- **Cego por construção.** Um nó serve ciphertext opaco indexado por um hash. Ele nunca vê uma URN, uma chave de descriptografia, ou texto plano. Uma requisição que não encontra nada é respondida com um stream **decoy** determinístico e indistinguível — nunca um `404` — então o caminho de leitura nunca é um oráculo de existência. Toda a descriptografia e toda a verificação de provas acontecem no cliente.
- **Verificável sem confiança.** Todo byte real chega com uma **prova de inclusão** merkle enraizada na raiz de generation on-chain. O cliente dobra a prova até a raiz e aceita somente se ela corresponder a uma raiz em que confia. O nó nunca é confiável para ter retornado bytes genuínos.
- **Transmissível em qualquer tamanho.** O conteúdo é lido em chunks limitados, alinhados a 64 KiB, com continuação explícita. Um recurso de um kilobyte e um capsule de cem megabytes são lidos pelo mesmo loop, e nenhuma resposta individual é ilimitada.

## Como se encaixa com a dig-store {#how-it-fits-with-digstore}

A dig-store fornece o **formato**: um store criptografado e endereçável por conteúdo que compila para
um único capsule `.wasm` autodefensivo, endereçado por uma URN onde *a URN é a chave*. O dig RPC é
como esse capsule é **servido na rede** sem confiar no host:

1. Você compila um store e ancora uma generation on-chain (um singleton DataLayer CHIP-0035). Sua **raiz de conteúdo** é a âncora de confiança.
2. Um nó hospeda o capsule e o expõe via o dig RPC.
3. Um leitor deriva `retrieval_key = sha256(urn)`, chama `dig.getContent`, remonta o ciphertext transmitido, **verifica a prova de inclusão contra a raiz on-chain**, e **descriptografa com a chave derivada da URN** — tudo no lado do cliente.

O nó aprendeu apenas um hash; ele nunca soube o que serviu.

## Uma leitura em uma chamada {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

O cliente repete o loop em `next_offset` até `complete`, verifica `inclusion_proof` sobre os bytes remontados contra `root`, e então descriptografa. Um resultado com `"decoy": true` significa *não encontrado* — pare e reporte como tal.

## Como ler esta documentação {#how-to-read-these-docs}

- **[Métodos](./methods.md)** — o conjunto completo de métodos (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), seus parâmetros e resultados.
- **[Usando o RPC da rede pública](./public-network-rpc.md)** — aponte seu cliente para `rpc.dig.net` (ou qualquer nó), endpoints, e como operar um você mesmo.
- **[Streaming](./streaming.md)** — o modelo de chunks, remontagem, verificação de provas, e um loop de cliente de referência.
- **[Conformidade](./conformance.md)** — o que um nó DEVE implementar para ser membro do caminho de leitura da rede, além de CORS, erros, e o modelo cego por completo.

:::note
O dig RPC faz parte da [DIG Network](https://dig.net). A especificação normativa completa é a seção [Protocolo · O dig RPC](../protocol/dig-rpc.md), a interface de conteúdo da rede.
:::

## Relacionados {#related}

- [Métodos](./methods.md) — todo método do dig RPC, seus parâmetros e resultados
- [Streaming](./streaming.md) — o modelo de chunks, remontagem e verificação de provas
- [Conformidade e segurança](./conformance.md) — o modelo cego e o que um nó precisa implementar
- [URNs e criptografia](../digstore/format/urns-and-encryption.md) — a URN por trás de toda retrieval key
- [Conceitos e glossário](../concepts.md) — o dig RPC, capsule, e retrieval key definidos
