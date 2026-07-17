---
sidebar_position: 1
title: "Protocol: Overview"
description: "O Protocolo DIG como sete camadas de baixo para cima, normativas e definidas por implementação. O capsule (storeId:rootHash) é a unidade fundamental; o host é cego e o leitor verifica contra a chain. Esta é a referência autoritativa do protocolo."
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protocol: Overview {#protocol-overview}

Esta é a **especificação normativa** do Protocolo DIG, definida como **sete camadas, de baixo para cima**. Cada camada nomeia seu **crate/arquivo canônico** como referência normativa.

:::info Esta é a referência autoritativa do protocolo
Esta seção é a fonte de verdade para o que a rede faz. Ela documenta o protocolo como ele realmente roda, com citações `file:line` para a implementação canônica.
:::

## A unidade fundamental: o capsule {#the-fundamental-unit-the-capsule}

Um conceito percorre todas as camadas: o **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, canonicamente `storeId:rootHash`. Um **store** é uma sequência ordenada de capsules (do mais antigo ao mais novo), um por commit; sua identidade `store_id` *é* um launcher id de singleton DataLayer CHIP-0035 na Chia. Identidade, compilação, precificação, recuperação, cache e proveniência são todos definidos **por capsule**.

## A tese: host cego, verificação no cliente, raiz ancorada na chain {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Host cego.** Um host guarda apenas ciphertext opaco indexado por hashes. Ele não guarda URN nem chave, retransmite a saída do próprio capsule literalmente, e não consegue distinguir um acerto de uma falha. Não há campo `decoy` no wire e não há CDN — o conteúdo é servido apenas através do [dig RPC](./protocol/dig-rpc.md).
- **Verificação no cliente.** Todo byte é checado no dispositivo do leitor contra uma raiz on-chain com uma prova de inclusão merkle por recurso, depois autenticado-descriptografado. A confiança nunca repousa na origem que serve.
- **Raiz ancorada na chain.** A raiz confiável vem **apenas** do singleton CHIP-0035 na Chia (resolvido via coinset.org), nunca do "latest" servido.

## As sete camadas {#the-seven-layers}

| # | Camada | O que define | Referência canônica |
|---|---|---|---|
| 0 | [Identidade e nomenclatura](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = launcher id | `digstore-core::capsule`, `::urn` |
| 0 | [URN e endereçamento](./protocol/urn-and-addressing.md) | gramática `urn:dig:chia:…`; `retrieval_key` sem root | `digstore-core::urn`, `lib.rs` |
| 1 | [Criptografia](./protocol/cryptography.md) | KDF HKDF; selo AES-256-GCM-SIV | `digstore-core::crypto` |
| 1 | [Provas de inclusão Merkle](./protocol/merkle-proofs.md) | folha por recurso D5; dobra NODE_TAG | `digstore-core::merkle` |
| 1 | [Assinaturas BLS e DSTs](./protocol/bls-signatures.md) | AugScheme da Chia; cinco DSTs de papel | `digstore-crypto::bls` |
| 2 | [Formato do capsule](./protocol/capsule-format.md) | a seção de dados DIGS (BINDING D1) | `digstore-core::datasection` |
| 2 | [O módulo autodefensivo](./protocol/self-defending-module.md) | ofuscação de tamanho fixo; o guest de serviço | `digstore-compiler`, `digstore-guest` |
| 4 | [Ancoragem on-chain](./protocol/on-chain-anchoring.md) | store = singleton; capsule = avanço de raiz | `chip35_dl_coin`, `digstore-chain` |
| 4 | [Pagamento e precificação do CAT DIG](./protocol/dig-cat-payment.md) | por capsule, dinâmico, atrelado a USD | `chip35_dl_coin::dig` |
| 6 | [O dig RPC](./protocol/dig-rpc.md) | a interface de máquina (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [Transporte e push §21](./protocol/transport-and-push.md) | localizador `dig://`, REST, push v1 | `digstore-remote` |
| 7 | [Rede de peers do DIG Node](./protocol/peer-network.md) | identidade de peer mTLS, NAT traversal, STUN, introducer, wire de relay, RPC de peer | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Verificação e proveniência](./protocol/verification-and-provenance.md) | os quatro gates de integridade ordenados | `digstore-core::merkle`, `dig-node` |
| 6 | [O modelo de host cego](./protocol/blind-host-model.md) | cegueira do provedor; resolver; plano de controle `/v1` | hub `retrieval`/`resolver`/`api` |
| — | [Conformidade e paridade](./protocol/conformance-and-parity.md) | a disciplina de paridade entre implementações | goldens congelados, diff do OpenRPC |

(As camadas 3 e o transporte §21 se interpõem com o caminho de leitura; a tabela as agrupa onde um leitor as encontra. A numeração completa das camadas é dada em cada página.)

## Como um capsule flui pelas camadas {#how-a-capsule-flows-through-the-layers}

Um publicador **fragmenta + criptografa** (L1) o conteúdo em um **formato de capsule** (L2) que **se autosserve** (L3), **ancora** ele on-chain (L4), e o **envia** via transporte §21 (L5). Qualquer cliente o **lê** através do dig RPC e o **verifica** contra a raiz ancorada na chain inteiramente no lado do cliente (L6). Toda constante criptográfica tem **uma única** definição compartilhada entre produtor, host e verificador — o [invariante de paridade C8](./protocol/conformance-and-parity.md).

## Terminologia {#terminology}

- **`chia://`** — o endereço de **conteúdo** da rede (o que um navegador abre).
- **`dig://`** — o localizador de **transporte** §21 (plano de CLI/peer) *e* o esquema interno de páginas do DIG Browser — dois usos distintos, nunca o endereço de conteúdo.
- **`urn:dig:`** — o namespace de URN do qual ambos derivam.
- **store / capsule** — a identidade e sua generation imutável.
- **$DIG** — o CAT pago por capsule; **dig-store** — o formato do store.

## Relacionados {#related}

- [Conceitos e glossário](./concepts.md) — cada entidade definida uma vez
- [Identidade e nomenclatura](./protocol/identity-and-naming.md) — Camada 0, onde a especificação começa
- [O dig RPC](./protocol/dig-rpc.md) — a interface de máquina do protocolo
- [Rede de peers do DIG Node](./protocol/peer-network.md) — como os nós se encontram + se alcançam (mTLS, NAT traversal, relay)
- [Conformidade e paridade](./protocol/conformance-and-parity.md) — a disciplina de paridade entre implementações
