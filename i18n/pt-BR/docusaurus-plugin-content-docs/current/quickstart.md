---
sidebar_position: 2
title: Quickstart
description: "Publique seu primeiro site na DIG — grátis para construir e pré-visualizar, você só paga o preço uniforme de capsule quando publica. Caminho web-first (sem carteira para começar) mais uma trilha paralela via CLI."
keywords:
  - DIG quickstart
  - deploy on Chia
  - free preview
  - publish capsule
  - DIGHUb
  - digstore deploy
tags:
  - dighub
  - capsule
  - digstore-cli
  - dig-payment
  - anchoring
---

# Quickstart {#quickstart}

Publique um site em uma rede que nenhum host pode ler, alterar ou derrubar — em cerca de dez minutos.

**Você constrói e pré-visualiza de graça.** Fazer o scaffolding e pré-visualizar não custa nada; você paga o **preço uniforme de capsule em $DIG** somente no momento em que publica um [capsule](./concepts.md#capsule) on-chain. *Itere de graça, publique quando estiver pronto.*

Duas formas de fazer isso. A maioria das pessoas começa pela web.

- **[A. Publicar pela web](#a-publish-from-the-web)** — na [DIGHUb](./concepts.md#dighub), conecte uma carteira no final. Ideal para sites e frontends. ~10 min.
- **[B. Publicar pela CLI](#b-publish-from-the-cli)** — `digstore` na sua máquina, scriptável e pronto para CI. Ideal para devs e automação.

---

## A. Publicar pela web {#a-publish-from-the-web}

O caminho mais rápido: construa e pré-visualize no navegador, financie uma carteira somente no passo final.

### 1. Abra a DIGHUb e comece um rascunho — grátis, sem carteira {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**Inicie um novo store na DIGHUb ↗**](https://hub.dig.net/new). Solte seu site já construído (uma pasta de arquivos estáticos — seu `dist/` ou `build/`). A DIGHUb oferece uma **pré-visualização de rascunho gratuita** de exatamente como ele será servido, sem nada on-chain e sem gastar $DIG.

Você ainda não precisa de uma carteira. Itere no rascunho quantas vezes quiser — reenvie, pré-visualize novamente — tudo de graça.

### 2. Pré-visualize no caminho de leitura real — ainda grátis {#2-preview-it-on-the-real-read-path--still-free}

A pré-visualização renderiza seu site através do pipeline genuíno da DIG (criptografar → compilar → verificar → descriptografar), então o que você vê é o que os visitantes recebem. Clique pelo site, verifique assets e roteamento. Nada é publicado e nada é gasto até você decidir.

### 3. Publique — financie e conecte uma carteira {#3-publish--fund-and-connect-a-wallet}

Quando o rascunho estiver do jeito certo, clique em **Publish**. Este é o único passo que custa algo:

- Conecte uma carteira Chia (sua carteira *é* sua conta — sem e-mail, sem senha).
- Aprove o gasto on-chain: o **preço uniforme de capsule em $DIG + uma pequena taxa de XCH**, em uma única assinatura. A tela de publicação mostra o valor exato em $DIG antes de você assinar.
- A DIGHUb faz o mint do seu store e publica o primeiro **capsule** na mainnet da Chia.

Faltando DIG? A tela de publicação mostra seu saldo e onde comprar mais. Veja [Onde conseguir DIG](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space, ou 9mm.pro.

### 4. Você está no ar {#4-youre-live}

Seu capsule agora está ancorado on-chain e **imediatamente legível através do [dig RPC](./concepts.md#dig-rpc)** — qualquer um pode buscá-lo e verificá-lo pela sua [URN `urn:dig:`](./concepts.md#urn) ou endereço [`chia://`](./browser/chia-protocol.md), sem registro e sem nada mais a pagar. A URN é ao mesmo tempo o endereço *e* a chave; compartilhe-a para compartilhar o conteúdo. O caminho de leitura é universal e gratuito; fica no ar no momento em que o capsule é confirmado.

**Quer um endereço `*.on.dig.net` amigável?** Isso é opcional. Um store só recebe um subdomínio `*.on.dig.net` quando você **registra um handle** para ele na DIGHUb — um registro separado e pago que fixa o store a esse nome. Até você registrar um, não existe URL `*.on.dig.net` (a URN / o endereço `chia://` acima é sempre a forma canônica de acessá-lo). Veja [Posso usar meu próprio domínio?](./support/faq.md#can-i-use-my-own-domain).

**Para publicar uma atualização depois:** edite, pré-visualize o novo rascunho de graça, e publique novamente. Cada atualização publicada é um novo capsule e custa o **preço uniforme de capsule** novamente — você só paga quando promove um rascunho a uma versão permanente on-chain.

:::tip Automatize
Depois que seu store existir, configure o [Deploy a partir do GitHub Actions](./digstore/cli/deploy-from-github-actions.md) para que cada push em `main` publique um novo capsule — deploy via git-push.
:::

---

## B. Publicar pela CLI {#b-publish-from-the-cli}

O mesmo fluxo a partir do seu terminal — scriptável e a base para CI. A CLI espelha o caminho da web: construir e pré-visualizar não custam nada; publicar um capsule custa o preço uniforme de capsule em $DIG.

### 1. Instale {#1-install}

```sh
# baixe o instalador para o seu sistema operacional na página de Releases, depois:
digstore --version
```

Veja [Instalando a CLI](./digstore/cli/install.md) para instaladores por sistema operacional e build a partir do código-fonte.

### 2. Faça o scaffold e pré-visualize — grátis, sem chain, sem gasto {#2-scaffold-and-preview--free-no-chain-no-spend}

Faça o scaffold de um projeto e pré-visualize-o localmente — **grátis, sem mint, sem chain** — antes de gastar qualquer coisa:

```sh
digstore new <template>   # faz o scaffold de um projeto já conectado à carteira (static · vite-react · next-static · nft-drop · dapp-window-chia) — grátis, sem mint
digstore dev              # observa + compila ao salvar + serve o caminho de leitura chia:// real, com um window.chia injetado — grátis, live-reload
```

`new` grava um projeto executável (um `dig.toml` + um app inicial); `dev` o serve através do caminho de leitura real da DIG (compilar → verificar → descriptografar) com live reload. Você paga o preço uniforme de capsule somente quando publica (próximos passos). Ou construa com sua toolchain habitual (`npm run build` → `dist/`) e publique essa saída.

:::tip Prefere npm? Use o `create-dig-app`
Se você vive no mundo Node, `npm create dig-app@latest my-app -- --template vite-react` faz o scaffold dos mesmos templates direto do npm — sem precisar instalar o `digstore` para começar. Veja [Faça o scaffold de uma aplicação](./build-a-dapp/scaffold.md).
:::

### 3. Configure uma carteira (necessário apenas para publicar) {#3-set-up-a-wallet-only-needed-to-publish}

Publicar gasta fundos reais, então você precisa de uma seed e de uma carteira financiada primeiro:

```sh
digstore seed generate      # gera uma mnemônica nova (mostrada uma vez — faça backup)
digstore balance            # mostra seu endereço de recebimento; financie-o com XCH + DIG
```

Veja [Ancoragem on-chain](./digstore/cli/onchain-anchoring.md) para detalhes de importação, financiamento e TTL.

### 4. Publique seu primeiro capsule {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # faz o mint do primeiro capsule do store (preço uniforme de capsule + taxa de XCH)
```

`init` faz o mint de um singleton Chia na mainnet — **o launcher id se torna o id do seu store** — e bloqueia até a confirmação.

### 5. Publique atualizações {#5-ship-updates}

```sh
npm run build                      # produz dist/
digstore add -A                    # adiciona ao staging toda a raiz de conteúdo
digstore commit -m "v1.1"          # publica um novo capsule (preço uniforme de capsule + taxa de XCH)
```

Para CI, um único comando faz add → commit → push e imprime a URL:

```sh
digstore deploy --output-dir dist --json   # avança um store existente a partir do CI; nunca faz mint
```

Veja [Deploy a partir do GitHub Actions](./digstore/cli/deploy-from-github-actions.md).

### 6. Leia de volta {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # uma URN que localiza E descriptografa
```

---

## Quanto custa {#what-it-costs}

| O que você está fazendo | Custo |
|---|---|
| Fazer scaffold, construir, pré-visualizar um rascunho | **Grátis** |
| Publicar seu primeiro capsule (`init` / Publish na DIGHUb) | **preço uniforme de capsule em $DIG** + pequena taxa de XCH |
| Publicar cada atualização (`commit` / republicar) | **preço uniforme de capsule em $DIG** + pequena taxa de XCH |

O preço é **uniforme por capsule** em toda parte — veja [por que o preço é uniforme](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Travou? {#stuck}

- [Solução de problemas](./support/troubleshooting.md) — as falhas comuns e suas correções.
- [FAQ](./support/faq.md) — respostas rápidas.
- [Obtenha ajuda](./support/get-help.md) — a comunidade e como registrar um bom relatório.

## Relacionados {#related}

- [Conceitos e glossário](./concepts.md) — capsule, store, URN e pagamento em DIG definidos
- [Faça o scaffold de uma aplicação (create-dig-app)](./build-a-dapp/scaffold.md) — inicie um projeto implantável em um único comando (npm ou CLI)
- [Instalando a CLI](./digstore/cli/install.md) — coloque o `digstore` na sua máquina
- [Ancoragem on-chain](./digstore/cli/onchain-anchoring.md) — configuração de carteira, financiamento e custos
- [Deploy a partir do GitHub Actions](./digstore/cli/deploy-from-github-actions.md) — publicação via push em CI
- [Tutorial da CLI](./digstore/cli/quickstart.md) — o passo a passo completo de criar-commitar-ler
