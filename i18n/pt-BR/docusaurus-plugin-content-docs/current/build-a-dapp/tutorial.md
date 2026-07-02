---
sidebar_position: 1
title: Build a dapp on Chia
description: "De ponta a ponta: faça o scaffold de uma aplicação React, conecte a carteira Chia embutida na página (window.chia + fallback WalletConnect) com o dig-sdk, construa e assine um spend via o wasm chip35, depois faça o deploy on-chain e adicione um domínio personalizado — um único fio por todo primitivo da DIG."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digstore deploy
  - custom domain
tags:
  - digstore-cli
  - window-chia
  - dig-rpc
  - chip-0035
  - dighub
  - capsule
  - anchoring
---

# Build a dapp on Chia {#build-a-dapp-on-chia}

Cada primitivo da DIG é documentado por si só — scaffolding, a carteira embutida na página, o caminho de leitura, spends, deploy. **Esta página é o fio único que os une em um único dapp publicado.** Você vai começar de uma pasta vazia e terminar com uma aplicação React com carteira, no ar on-chain no seu próprio domínio.

Todo o ciclo até a publicação é **gratuito** — fazer scaffold, desenvolver e pré-visualizar não custam nada. Você paga o **preço uniforme de capsule em $DIG** somente no passo de deploy.

```
new ──▶ dev ──▶ conectar carteira (dig-sdk) ──▶ construir um spend (chip35) ──▶ deploy ──▶ domínio personalizado
 grátis  grátis          grátis                       grátis            preço do capsule    grátis
```

## O que você vai precisar {#what-youll-need}

- A [CLI `digstore`](../digstore/cli/install.md) instalada.
- Node 18+ e `npm`.
- Uma carteira Chia financiada — **somente no passo de deploy** (o preço uniforme de capsule em $DIG + uma pequena taxa de XCH). Tudo antes disso é gratuito.

---

## 1. Faça o scaffold de uma aplicação React — grátis, sem chain {#1-scaffold-a-react-app--free-no-chain}

`digstore new` grava um projeto executável já conectado a uma carteira. Escolha o template React:

```sh
digstore new vite-react my-dapp
cd my-dapp
```

Você recebe uma aplicação Vite + React, um `dig.toml` (`output-dir = "dist"`, `build-command = "npm install && npm run build"`), e um `App.jsx` já conectado à carteira embutida na página. Nenhum store é mintado e nada é gasto — `new` é puramente local.

:::tip Prefere npm? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react` faz o scaffold do mesmo template direto do npm — a porta de entrada em JS, sem precisar instalar o `digstore` para começar. Veja [Faça o scaffold de uma aplicação](./scaffold.md) para todos os cinco templates e como as duas portas de entrada se comparam.
:::

## 2. Desenvolva contra o caminho de leitura real — grátis {#2-develop-against-the-real-read-path--free}

```sh
digstore dev
```

`dev` executa seu build, serve a saída no **caminho de leitura `chia://` genuíno** (compilar → verificar → descriptografar), e injeta um **shim de desenvolvimento `window.chia`** para que você possa construir o fluxo de carteira sem uma carteira real. Edite `src/App.jsx`, salve, e a página recarrega ao vivo — exatamente o que os visitantes vão receber, com zero interação com a chain e zero gasto.

## 3. Conecte a carteira com o SDK — `window.chia` + fallback WalletConnect {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

O scaffold fala diretamente com `window.chia`, o que é perfeito dentro do [DIG Browser](../browser/using-window-chia.md). Para também dar suporte a usuários em outros navegadores, adicione o SDK — ele **prefere a carteira `window.chia` injetada e recorre ao WalletConnect → Sage** sob uma única superfície normalizada, então você escreve o fluxo de carteira uma única vez.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # opcional: apenas para o fallback WalletConnect
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" prefere a carteira injetada do DIG Browser, senão WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // um valor PÚBLICO em tempo de build
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // renderize um QR
      },
    });
    setAddress(await provider.getAddress());
  }

  return (
    <main>
      <h1>My DIG dapp</h1>
      <button onClick={login}>Connect wallet</button>
      {address && <p>Connected: {address}</p>}
    </main>
  );
}
```

Um único `connect()` funciona no DIG Browser (sem QR, sem relay) e em qualquer outro lugar (WalletConnect). `provider.backend` diz qual transporte se conectou. Os nomes de métodos e formatos de resultado são idênticos em ambos os casos — veja [Usando `window.chia`](../browser/using-window-chia.md) para o guia de integração, ou [a especificação normativa do provider `window.chia`](../protocol/window-chia-provider.md) para o contrato exato de método/parâmetro/retorno/erro.

:::note O project id do WalletConnect é um valor PÚBLICO em tempo de build
`VITE_WC_PROJECT_ID` é compilado no seu bundle e é legível publicamente — isso é correto para um id de nuvem do WalletConnect. **Nunca** coloque uma seed de carteira, uma chave de deploy, ou qualquer segredo no bundle: um capsule é um [artefato estático cego sem segredos de servidor](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule).
:::

## 4. Construa e assine um spend — o wasm chip35, via o SDK {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

Quando seu dapp precisa fazer algo on-chain (mintar um store, atualizar metadados, construir um pagamento em CAT), ele constrói o spend com o **construtor de spend canônico CHIP-0035** e o entrega à carteira para assinar. O SDK reexporta esse construtor no subcaminho `/spend` — você **nunca constrói um pacote de spend à mão**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // o construtor wasm do chip35

async function doSpend() {
  spend.init();

  // Construa spends de coin com o construtor wasm, ex.: spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). O construtor é
  // offline e puro — sem chaves, sem rede.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Entregue-os à carteira para assinar (a carteira guarda as chaves, não seu dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → combine em um pacote de spend e transmita.
}
```

Este é exatamente o padrão que o hub usa: **construir o pacote no navegador com o wasm, assiná-lo com a carteira.** O construtor de spend é a única fonte canônica de pacotes de spend em todo o ecossistema, então seu dapp produz spends byte-a-byte idênticos aos do hub e da CLI.

Para **ler** conteúdo verificado e criptografado de volta (ex.: renderizar os dados de outro store dentro do seu dapp), use o `DigClient` do SDK:

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // usa https://rpc.dig.net por padrão
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // a âncora de confiança, lida da chain
});
```

`DigClient` deriva as chaves da URN no navegador, verifica a inclusão contra a raiz on-chain, e descriptografa — o host que serve permanece cego. Veja [O que é o dig RPC?](../rpc/what-is-the-dig-rpc.md).

:::tip Vai cobrar pelo acesso? Use o `Paywall`
Para monetizar — pagar-para-desbloquear conteúdo, ou restringir o acesso à posse de um NFT — o SDK traz um helper de alto nível, o **`Paywall`**, que compõe um `ChiaProvider` conectado com o construtor de spend para que você não precise conectar pagamentos manualmente: `paywall.requestPayment({ amount, owner })` paga o dono do dapp e retorna um recibo, e `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })` restringem o acesso.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* desbloqueie o conteúdo */ }
```
:::

## 5. Faça o deploy on-chain {#5-deploy-on-chain}

Você constrói e pré-visualiza de graça; este é o único passo que gasta. Primeiro crie o store **uma vez**:

```sh
digstore init my-dapp --dir dist      # minta o primeiro capsule do store (preço uniforme de capsule + taxa de XCH)
```

`init` minta um singleton Chia na mainnet — **o launcher id se torna o id do seu store**. Copie-o para o `dig.toml` (`store-id = "<64-hex>"`). A partir daí, um único comando constrói e publica um novo capsule:

```sh
digstore deploy --json                # executa o build-command, faz o staging do dist/, avança a raiz
```

Cada `deploy` publica um novo capsule imutável pelo preço uniforme de capsule. No momento em que confirma, seu dapp está **legível através do [dig RPC](../rpc/what-is-the-dig-rpc.md)** pelo seu endereço [URN](../concepts.md#urn) / `chia://` — criptografado, verificado, e impossível de derrubar, sem registro e sem nada mais a pagar. (Um endereço web amigável `*.on.dig.net` é um passo separado e opcional — veja [a próxima seção](#6-put-it-on-your-own-domain).) Para deploy via push a cada commit, configure o [Deploy a partir do GitHub Actions](../digstore/cli/deploy-from-github-actions.md).

## 6. Coloque no seu próprio domínio {#6-put-it-on-your-own-domain}

Seu store já é acessível pelo seu endereço URN / `dig://` — mas para uma URL web amigável você registra um nome. Um store recebe um subdomínio `*.on.dig.net` quando você **registra um handle** para ele na DIGHUb: um registro separado e pago que fixa o store a esse nome (sem registro → sem endereço `*.on.dig.net`). Para servi-lo a partir de um domínio que você possui, adicione um **domínio personalizado com TLS na [DIGHUb ↗](https://hub.dig.net)** — aponte seu domínio para o store e a DIGHUb cuida do certificado. De qualquer forma, seu dapp carrega a partir de uma URL amigável enquanto permanece totalmente descentralizado por baixo.

Quando os handles `.dig` do CHIP-54 chegarem, um store também será endereçável por um nome `.dig` legível por humanos; até lá, domínios personalizados via DIGHUb são a forma de dar identidade a um deployment.

---

## Você publicou um dapp {#you-shipped-a-dapp}

Você foi de uma pasta vazia a uma aplicação React com carteira, no ar na mainnet da Chia no seu próprio domínio — tocando em todo primitivo: [scaffolding](../digstore/cli/quickstart.md), a [carteira embutida na página](../browser/using-window-chia.md), o [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), o [construtor de spend](https://github.com/DIG-Network/chip35_dl_coin), o [caminho de leitura](../rpc/what-is-the-dig-rpc.md), e o [deploy](../digstore/cli/deploy-from-github-actions.md). Clone uma versão finalizada da [galeria de exemplos](./example-gallery.md).

## Relacionados {#related}

- [Faça o scaffold de uma aplicação (create-dig-app)](./scaffold.md) — os cinco templates e as portas de entrada npm vs. CLI
- [Galeria de exemplos](./example-gallery.md) — clone um dapp finalizado e abra-o em um template
- [Usando window.chia](../browser/using-window-chia.md) — o provider de carteira embutido na página, em detalhes
- [A especificação do provider window.chia](../protocol/window-chia-provider.md) — o contrato normativo e versionado do provider
- [Configuração de projeto e valores em tempo de build](../digstore/cli/configuration.md) — dig.toml + configuração PÚBLICA
- [Deploy a partir do GitHub Actions](../digstore/cli/deploy-from-github-actions.md) — deploy via push em CI
- [O que é o dig RPC?](../rpc/what-is-the-dig-rpc.md) — lendo conteúdo verificado e criptografado
- [Quickstart](../quickstart.md) — o caminho mais curto de "publicar um site"
- [Conceitos e glossário](../concepts.md) — capsule, store, URN, e window.chia definidos
