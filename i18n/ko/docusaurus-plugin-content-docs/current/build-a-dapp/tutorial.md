---
sidebar_position: 1
title: Build a dapp on Chia
description: "처음부터 끝까지: React 앱을 스캐폴딩하고, dig-sdk로 인페이지 Chia 지갑(window.chia + WalletConnect 폴백)을 연결하고, chip35 wasm으로 스펜드를 빌드 및 서명한 다음, 온체인에 배포하고 커스텀 도메인을 추가합니다 — 모든 DIG 프리미티브를 하나로 잇는 흐름입니다."
keywords:
  - build a dapp
  - Chia dapp tutorial
  - window.chia
  - dig-sdk
  - chip35 spend
  - digs deploy
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

모든 DIG 프리미티브는 각각 독립적으로 문서화되어 있습니다 — 스캐폴딩, 인페이지 지갑, 읽기 경로, 스펜드, 배포까지. **이 페이지는 이 모든 것을 하나로 엮어 실제로 배포된 dapp을 완성하는 단 하나의 흐름입니다.** 빈 폴더에서 시작해, 자신의 도메인에서 라이브로 동작하는 지갑 연동 React 앱으로 마무리합니다.

게시 단계 전까지 전체 루프는 **무료**입니다 — 스캐폴딩, 개발, 미리보기는 비용이 들지 않습니다. **균일 capsule 가격**을 $DIG로 지불하는 것은 배포 단계뿐입니다.

```
new ──▶ dev ──▶ wire wallet (dig-sdk) ──▶ build a spend (chip35) ──▶ deploy ──▶ custom domain
 free    free          free                       free            capsule price    free
```

## 필요한 것 {#what-youll-need}

- [`dig-store` CLI](../digstore/cli/install.md) 설치.
- Node 18+ 및 `npm`.
- 자금이 있는 Chia 지갑 — **배포 단계에서만 필요**(균일 capsule 가격의 $DIG + 소액의 XCH 수수료). 그 전까지는 모두 무료입니다.

---

## 1. React 앱 스캐폴딩하기 — 무료, 체인 없음 {#1-scaffold-a-react-app--free-no-chain}

`digs new`는 실행 가능하고 지갑이 연결된 프로젝트를 생성합니다. React 템플릿을 선택하세요.

```sh
digs new vite-react my-dapp
cd my-dapp
```

Vite + React 앱과 `dig.toml`(`output-dir = "dist"`, `build-command = "npm install && npm run build"`), 그리고 이미 인페이지 지갑에 연결된 `App.jsx`가 생성됩니다. store는 아직 민팅되지 않으며 아무것도 지출되지 않습니다 — `new`는 순수하게 로컬에서만 이루어집니다.

:::tip npm을 선호하시나요? `npm create dig-app`
`npm create dig-app@latest my-dapp -- --template vite-react`는 npm에서 곧바로 동일한 템플릿을 스캐폴딩합니다 — JS 진입점이며, 시작하기 위해 `dig-store` 설치가 필요 없습니다. 다섯 가지 템플릿과 두 진입점을 비교한 내용은 [앱 스캐폴딩](./scaffold.md)을 참고하세요.
:::

## 2. 실제 읽기 경로로 개발하기 — 무료 {#2-develop-against-the-real-read-path--free}

```sh
digs dev
```

`dev`는 빌드를 실행하고, 결과물을 **진짜 `chia://` 읽기 경로**(컴파일 → 검증 → 복호화)로 서비스하며, 실제 지갑 없이도 지갑 흐름을 만들 수 있도록 **`window.chia` 개발용 셰임(shim)**을 주입합니다. `src/App.jsx`를 편집하고 저장하면 페이지가 실시간으로 다시 로드됩니다 — 체인과의 상호작용이나 지출 없이 방문자가 보게 될 것과 정확히 동일합니다.

## 3. SDK로 지갑 연결하기 — `window.chia` + WalletConnect 폴백 {#3-wire-the-wallet-with-the-sdk--windowchia--walletconnect-fallback}

스캐폴드는 `window.chia`와 직접 통신하며, 이는 [DIG Browser](../browser/using-window-chia.md) 안에서 완벽하게 동작합니다. 다른 브라우저의 사용자도 지원하려면 SDK를 추가하세요 — SDK는 **주입된 `window.chia` 지갑을 우선 사용하고, 없으면 WalletConnect → Sage로 폴백**하며, 하나의 정규화된 인터페이스 뒤에서 이루어지므로 지갑 흐름을 한 번만 작성하면 됩니다.

```sh
npm i @dignetwork/dig-sdk
npm i @walletconnect/sign-client   # optional: only for the WalletConnect fallback
```

```jsx
// src/App.jsx
import { useState } from "react";
import { ChiaProvider } from "@dignetwork/dig-sdk";

export default function App() {
  const [address, setAddress] = useState(null);

  async function login() {
    // "auto" prefers the injected DIG Browser wallet, else WalletConnect → Sage.
    const provider = await ChiaProvider.connect({
      mode: "auto",
      walletConnect: {
        projectId: import.meta.env.VITE_WC_PROJECT_ID, // a PUBLIC build-time value
        metadata: {
          name: "My DIG dapp",
          description: "Built with @dignetwork/dig-sdk",
          url: "https://my-dapp.example",
          icons: ["https://my-dapp.example/icon.png"],
        },
        onUri: (uri) => console.log("Scan to connect:", uri), // render a QR
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

하나의 `connect()` 호출이 DIG Browser에서는 QR도 relay도 없이, 그 외 모든 곳에서는 WalletConnect로 동작합니다. `provider.backend`를 보면 어떤 전송 방식으로 연결되었는지 알 수 있습니다. 메서드 이름과 반환 형태는 어느 쪽이든 동일합니다 — 통합 가이드는 [window.chia 사용하기](../browser/using-window-chia.md)를, 정확한 메서드/파라미터/반환값/오류 계약은 [정규 window.chia 프로바이더 스펙](../protocol/window-chia-provider.md)을 참고하세요.

:::note WalletConnect 프로젝트 id는 PUBLIC 빌드타임 값입니다
`VITE_WC_PROJECT_ID`는 번들에 컴파일되어 누구나 읽을 수 있으며, WalletConnect 클라우드 id로서는 그것이 올바른 사용법입니다. **절대** 지갑 시드, 배포 키, 또는 어떤 비밀 정보도 번들에 넣지 마세요. capsule은 [서버 비밀이 전혀 없는 blind 정적 아티팩트](../digstore/cli/configuration.md#the-one-hard-rule-no-server-secrets-in-a-blind-static-capsule)입니다.
:::

## 4. 스펜드 빌드 및 서명하기 — SDK를 통한 chip35 wasm {#4-build-and-sign-a-spend--the-chip35-wasm-via-the-sdk}

dapp이 온체인에서 무언가를 해야 할 때(store 민팅, 메타데이터 업데이트, CAT 결제 빌드 등), **정본 CHIP-0035 스펜드 빌더**로 스펜드를 빌드하여 지갑에 서명을 넘깁니다. SDK는 이 빌더를 `/spend` 하위 경로에서 재내보내기하므로 **스펜드 번들을 절대 직접 조립하지 않습니다**.

```jsx
import { ChiaProvider } from "@dignetwork/dig-sdk";
import * as spend from "@dignetwork/dig-sdk/spend"; // the chip35 wasm builder

async function doSpend() {
  spend.init();

  // Build coin spends with the wasm builder, e.g. spend.mintStore(...) /
  // spend.updateStoreMetadata(...) / spend.buildDigPayment(...). The builder is
  // offline and pure — no keys, no network.
  const coinSpends = /* spend.mintStore({ ... }) */ [];

  // Hand them to the wallet to sign (the wallet holds the keys, not your dapp).
  const provider = await ChiaProvider.connect({ mode: "auto" });
  const aggregatedSignature = await provider.signCoinSpends(coinSpends);
  // → combine into a spend bundle and broadcast.
}
```

이것은 hub가 사용하는 것과 정확히 동일한 패턴입니다. **wasm으로 브라우저 안에서 번들을 빌드하고, 지갑으로 서명합니다.** 스펜드 빌더는 전체 생태계에 걸쳐 스펜드 번들을 만드는 단 하나의 정본 소스이므로, 여러분의 dapp은 hub 및 CLI와 바이트 단위로 동일한 스펜드를 생성합니다.

검증되고 암호화된 콘텐츠를 다시 **읽으려면**(예: 다른 store의 데이터를 dapp 안에서 렌더링), SDK의 `DigClient`를 사용하세요.

```jsx
import { DigClient } from "@dignetwork/dig-sdk";

const dig = new DigClient();                 // defaults to https://rpc.dig.net
const html = await dig.readText({
  urn: "urn:dig:chia:<storeId>/index.html",
  root: "<onchain-root-hex>",                 // the trust anchor, read from the chain
});
```

`DigClient`는 브라우저 안에서 URN의 키를 유도하고, 온체인 root에 대해 포함 여부를 검증한 뒤 복호화합니다 — 서비스 호스트는 계속 blind 상태를 유지합니다. [dig RPC란 무엇인가?](../rpc/what-is-the-dig-rpc.md)를 참고하세요.

:::tip 접근 권한을 유료화하고 싶으신가요? `Paywall`을 사용하세요
콘텐츠를 결제 후 잠금 해제하거나 NFT 소유 여부로 게이팅하는 방식으로 수익화하려면, SDK는 고수준 **`Paywall`** 헬퍼를 제공합니다. 이는 연결된 `ChiaProvider`와 스펜드 빌더를 결합하여 결제 로직을 직접 연결하지 않아도 되게 해줍니다: `paywall.requestPayment({ amount, owner })`는 dapp 소유자에게 결제하고 영수증을 반환하며, `paywall.verifyReceipt(...)` / `paywall.proveAccess({ nft | collection })`가 접근을 게이팅합니다.

```jsx
import { ChiaProvider, Paywall } from "@dignetwork/dig-sdk";

const provider = await ChiaProvider.connect({ mode: "auto" });
const paywall = new Paywall({ provider });
const receipt = await paywall.requestPayment({ amount: 5, owner: "<your-address>" });
if (await paywall.verifyReceipt(receipt)) { /* unlock the content */ }
```
:::

## 5. 온체인 배포하기 {#5-deploy-on-chain}

빌드와 미리보기는 무료이며, 이 단계만 비용이 발생합니다. 먼저 store를 **한 번만** 생성하세요.

```sh
digs init my-dapp --dir dist      # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init`은 메인넷에 Chia 싱글톤을 민팅합니다 — **launcher id가 여러분의 store id가 됩니다.** 이것을 `dig.toml`에 복사하세요(`store-id = "<64-hex>"`). 그 이후로는 하나의 명령으로 새 capsule을 빌드하고 게시할 수 있습니다.

```sh
digs deploy --json                # runs build-command, stages dist/, advances the root
```

`deploy`를 실행할 때마다 균일 capsule 가격으로 새로운 불변 capsule이 게시됩니다. 컨펌되는 순간, 여러분의 dapp은 [URN](../concepts.md#urn) / `chia://` 주소를 통해 [dig RPC](../rpc/what-is-the-dig-rpc.md)로 **읽을 수 있게** 됩니다 — 암호화되고, 검증되며, 내릴 수 없고, 등록도 추가 비용도 필요 없습니다. (친숙한 `*.on.dig.net` 웹 주소는 별도의 선택적 단계입니다 — [다음 섹션](#6-put-it-on-your-own-domain)을 참고하세요.) 모든 커밋마다 자동으로 배포하려면 [GitHub Actions에서 배포하기](../digstore/cli/deploy-from-github-actions.md)를 연결하세요.

## 6. 자신의 도메인에 연결하기 {#6-put-it-on-your-own-domain}

여러분의 store는 이미 URN / `chia://` 주소로 접근할 수 있지만, 친숙한 웹 URL을 위해서는 이름을 등록해야 합니다. DIGHUb에서 **핸들을 등록**하면 store가 `*.on.dig.net` 서브도메인을 갖게 됩니다 — 이는 해당 이름에 store를 고정하는 별도의 유료 등록입니다(등록하지 않으면 `*.on.dig.net` 주소도 없습니다). 대신 자신이 소유한 도메인에서 서비스하려면, [DIGHUb ↗](https://hub.dig.net)에서 **TLS를 포함한 커스텀 도메인**을 추가하세요 — 도메인을 store로 연결하면 DIGHUb가 인증서를 처리합니다. 어느 쪽이든, 내부적으로는 완전히 탈중앙화된 상태를 유지하면서 여러분의 dapp은 사람이 읽기 쉬운 URL에서 로드됩니다.

CHIP-54 `.dig` 핸들이 도입되면, store는 사람이 읽을 수 있는 `.dig` 이름으로도 주소 지정이 가능해집니다. 그때까지는 DIGHUb를 통한 커스텀 도메인이 배포에 브랜드를 입히는 방법입니다.

---

## dapp을 배포했습니다 {#you-shipped-a-dapp}

빈 폴더에서 시작하여, 자신의 도메인에서 Chia 메인넷에 라이브로 동작하는 지갑 연동 React 앱까지 도달했습니다 — [스캐폴딩](../digstore/cli/quickstart.md), [인페이지 지갑](../browser/using-window-chia.md), [SDK](https://www.npmjs.com/package/@dignetwork/dig-sdk), [스펜드 빌더](https://github.com/DIG-Network/chip35_dl_coin), [읽기 경로](../rpc/what-is-the-dig-rpc.md), [배포](../digstore/cli/deploy-from-github-actions.md)까지 모든 프리미티브를 다뤘습니다. [예제 갤러리](./example-gallery.md)에서 완성된 버전을 클론해 보세요.

## 관련 문서 {#related}

- [앱 스캐폴딩 (create-dig-app)](./scaffold.md) — 다섯 가지 템플릿과 npm 대 CLI 진입점 비교
- [예제 갤러리](./example-gallery.md) — 완성된 dapp을 클론하여 템플릿에서 열어보기
- [window.chia 사용하기](../browser/using-window-chia.md) — 인페이지 지갑 프로바이더 전체 가이드
- [window.chia 프로바이더 스펙](../protocol/window-chia-provider.md) — 정규화되고 버전 관리되는 프로바이더 계약
- [프로젝트 설정 및 빌드타임 값](../digstore/cli/configuration.md) — dig.toml + PUBLIC 설정
- [GitHub Actions에서 배포하기](../digstore/cli/deploy-from-github-actions.md) — CI에서의 push-to-deploy
- [dig RPC란 무엇인가?](../rpc/what-is-the-dig-rpc.md) — 검증되고 암호화된 콘텐츠 읽기
- [빠른 시작](../quickstart.md) — 더 짧은 "사이트 배포하기" 경로
- [개념 및 용어집](../concepts.md) — capsule, store, URN, window.chia 정의
