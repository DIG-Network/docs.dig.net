---
sidebar_position: 2
title: Hızlı başlangıç
description: "DIG üzerinde ilk sitenizi gönderin — inşa etmek ve önizlemek ücretsizdir, yayınladığınız anda yalnızca tek tip capsule fiyatını ödersiniz. Web öncelikli yol (başlangıçta cüzdan gerekmez) artı paralel bir CLI yolu."
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

# Hızlı başlangıç {#quickstart}

Hiçbir barındıranın okuyamayacağı, değiştiremeyeceği veya kaldıramayacağı bir ağa bir site gönderin — yaklaşık on dakikada.

**İnşa etmek ve önizlemek ücretsizdir.** İskeleleme ve önizleme hiçbir şeye mal olmaz; zincir üzerinde bir [capsule](./concepts.md#capsule) yayınladığınız anda yalnızca **$DIG cinsinden tek tip capsule fiyatını** ödersiniz. *Ücretsiz yineleyin, hazır olduğunda yayınlayın.*

Bunu yapmanın iki yolu var. Çoğu kişi web'den başlar.

- **[A. Web'den yayınlayın](#a-publish-from-the-web)** — [DIGHUb](./concepts.md#dighub)'da, sonunda bir cüzdan bağlayın. Siteler ve ön yüzler için en iyisi. ~10 dk.
- **[B. CLI'dan yayınlayın](#b-publish-from-the-cli)** — makinenizde `digstore`, betiklenebilir ve CI'a hazır. Geliştiriciler ve otomasyon için en iyisi.

---

## A. Web'den yayınlayın {#a-publish-from-the-web}

En hızlı yol: tarayıcıda inşa edin ve önizleyin, cüzdanı yalnızca son adımda fonlayın.

### 1. DIGHUb'ı açın ve bir taslak başlatın — ücretsiz, cüzdan gerekmez {#1-open-dighub-and-start-a-draft--free-no-wallet}

[**DIGHUb'da yeni bir store başlatın ↗**](https://hub.dig.net/new). İnşa edilmiş sitenizi bırakın (bir statik dosya klasörü — `dist/` veya `build/` klasörünüz). DIGHUb, hiçbir şey zincir üzerinde olmadan ve hiç $DIG harcanmadan tam olarak nasıl sunulacağının **ücretsiz bir taslak önizlemesini** verir.

Henüz bir cüzdana ihtiyacınız yok. Taslak üzerinde istediğiniz kadar yineleme yapın — yeniden yükleyin, yeniden önizleyin — tamamen ücretsiz olarak.

### 2. Gerçek okuma yolunda önizleyin — hâlâ ücretsiz {#2-preview-it-on-the-real-read-path--still-free}

Önizleme, sitenizi gerçek DIG işlem hattı üzerinden (şifrele → derle → doğrula → şifre çöz) oluşturur, böylece gördüğünüz şey ziyaretçilerin aldığı şeydir. Etrafa tıklayın, varlıkları ve yönlendirmeyi kontrol edin. Siz seçene kadar hiçbir şey yayınlanmaz ve hiçbir şey harcanmaz.

### 3. Yayınlayın — cüzdanı fonlayın ve bağlayın {#3-publish--fund-and-connect-a-wallet}

Taslak doğru göründüğünde **Publish**'e basın. Bu, herhangi bir maliyeti olan tek adımdır:

- Bir Chia cüzdanı bağlayın (cüzdanınız *hesabınızdır* — e-posta yok, şifre yok).
- Zincir üzerindeki harcamayı onaylayın: tek bir imzada **$DIG cinsinden tek tip capsule fiyatı + küçük bir XCH ücreti**. Yayınlama ekranı, imzalamadan önce tam $DIG miktarını gösterir.
- DIGHUb store'unuzu basar (mint) ve ilk **capsule**'ü Chia mainnet üzerinde yayınlar.

DIG'iniz mi az? Yayınlama ekranı bakiyenizi ve nereden ekleyebileceğinizi gösterir. Bkz. [DIG nereden alınır](./digstore/cli/onchain-anchoring.md#where-to-get-dig) — TibetSwap, dexie.space veya 9mm.pro.

### 4. Artık yayındasınız {#4-youre-live}

capsule'ünüz artık zincir üzerinde sabitlenmiştir ve **[dig RPC](./concepts.md#dig-rpc) üzerinden anında okunabilir** — herkes bunu [`urn:dig:` URN](./concepts.md#urn)'i veya [`chia://`](./browser/chia-protocol.md) adresiyle alabilir ve doğrulayabilir, kayıt gerekmez ve ödenecek başka bir şey yoktur. URN hem adres *hem de* anahtardır; içeriği paylaşmak için URN'i paylaşın. Okuma yolu evrenseldir ve ücretsizdir; capsule onaylandığı anda yayındadır.

**İnsan dostu bir `*.on.dig.net` adresi mi istiyorsunuz?** Bu isteğe bağlıdır. Bir store, yalnızca DIGHUb'da bunun için bir **handle kaydettiğinizde** — store'u o isme sabitleyen ayrı, ücretli bir kayıt — `*.on.dig.net` alt alan adını alır. Bir tane kaydetmeden `*.on.dig.net` URL'si yoktur (yukarıdaki URN / `chia://` adresi her zaman ona ulaşmanın kanonik yoludur). Bkz. [Kendi alan adımı kullanabilir miyim?](./support/faq.md#can-i-use-my-own-domain).

**Daha sonra bir güncelleme göndermek için:** düzenleyin, yeni taslağı ücretsiz önizleyin ve tekrar Publish yapın. Yayınlanan her güncelleme yeni bir capsule'dür ve yine **tek tip capsule fiyatına** mal olur — yalnızca bir taslağı kalıcı bir zincir üzeri sürüme yükselttiğinizde ödersiniz.

:::tip Otomatikleştirin
Store'unuz mevcut olduğunda, her `main`'e push'un yeni bir capsule yayınlaması için [GitHub Actions'tan dağıtım](./digstore/cli/deploy-from-github-actions.md)'ı bağlayın — git-push-ile-dağıtım.
:::

---

## B. CLI'dan yayınlayın {#b-publish-from-the-cli}

Terminalinizden aynı akış — betiklenebilir ve CI'ın temeli. CLI, web yolunu yansıtır: inşa etmek ve önizlemek hiçbir şeye mal olmaz; bir capsule yayınlamak $DIG cinsinden tek tip capsule fiyatına mal olur.

### 1. Kurulum {#1-install}

```sh
# download the installer for your OS from the Releases page, then:
digstore --version
```

İşletim sistemine özel yükleyiciler ve kaynaktan derleme için bkz. [CLI'yı kurma](./digstore/cli/install.md).

### 2. İskeleleme ve önizleme — ücretsiz, zincir yok, harcama yok {#2-scaffold-and-preview--free-no-chain-no-spend}

Hiçbir şey harcamadan önce bir proje iskeleleyin ve yerel olarak önizleyin — **ücretsiz, mint yok, zincir yok**:

```sh
digstore new <template>   # scaffold a wallet-wired project (static · vite-react · next-static · nft-drop · dapp-window-chia) — free, no mint
digstore dev              # watch + compile-on-save + serve the real chia:// read path, with an injected window.chia — free, live-reload
```

`new`, çalıştırılabilir bir proje yazar (bir `dig.toml` + başlangıç uygulaması); `dev` bunu canlı yeniden yüklemeyle gerçek DIG okuma yolu (derle → doğrula → şifre çöz) üzerinden sunar. Tek tip capsule fiyatını yalnızca yayınladığınızda ödersiniz (sonraki adımlar). Ya da her zamanki araç zincirinizle inşa edin (`npm run build` → `dist/`) ve bu çıktıyı yayınlayın.

:::tip npm mi tercih edersiniz? `create-dig-app` kullanın
Node dünyasında yaşıyorsanız, `npm create dig-app@latest my-app -- --template vite-react` başlamak için `digstore` kurulumu gerekmeden aynı şablonları doğrudan npm'den iskeleler. Bkz. [Bir uygulama iskeleleyin](./build-a-dapp/scaffold.md).
:::

### 3. Bir cüzdan kurun (yalnızca yayınlamak için gereklidir) {#3-set-up-a-wallet-only-needed-to-publish}

Yayınlamak gerçek fon harcar, bu yüzden önce bir tohum (seed) ve fonlanmış bir cüzdana ihtiyacınız var:

```sh
digstore seed generate      # generate a fresh mnemonic (shown once — back it up)
digstore balance            # show your receive address; fund it with XCH + DIG
```

İçe aktarma, fonlama ve TTL ayrıntıları için bkz. [Zincir üzeri sabitleme](./digstore/cli/onchain-anchoring.md).

### 4. İlk capsule'ünüzü yayınlayın {#4-publish-your-first-capsule}

```sh
digstore init site --dir dist     # mint the store's first capsule (uniform capsule price + XCH fee)
```

`init`, mainnet üzerinde bir Chia singleton basar — **başlatıcı (launcher) id'si store id'niz olur** — ve onaylanana kadar bloklar.

### 5. Güncellemeleri gönderin {#5-ship-updates}

```sh
npm run build                      # produce dist/
digstore add -A                    # stage the whole content root
digstore commit -m "v1.1"          # publish a new capsule (uniform capsule price + XCH fee)
```

CI için, tek bir komut add → commit → push işlemini yapar ve URL'yi yazdırır:

```sh
digstore deploy --output-dir dist --json   # advance an existing store from CI; never mints
```

Bkz. [GitHub Actions'tan dağıtım](./digstore/cli/deploy-from-github-actions.md).

### 6. Geri okuyun {#6-read-it-back}

```sh
digstore cat urn:dig:chia:<storeId>/readme   # a URN both locates AND decrypts
```

---

## Maliyeti nedir {#what-it-costs}

| Yaptığınız şey | Maliyet |
|---|---|
| İskeleleme, inşa etme, bir taslağı önizleme | **Ücretsiz** |
| İlk capsule'ünüzü yayınlama (`init` / DIGHUb Publish) | **$DIG cinsinden tek tip capsule fiyatı** + küçük XCH ücreti |
| Her güncellemeyi yayınlama (`commit` / yeniden Publish) | **$DIG cinsinden tek tip capsule fiyatı** + küçük XCH ücreti |

Fiyat her yerde **capsule başına tek tiptir** — bkz. [fiyat neden tek tip](./digstore/cli/onchain-anchoring.md#why-the-price-is-uniform).

## Takıldınız mı? {#stuck}

- [Sorun giderme](./support/troubleshooting.md) — yaygın hatalar ve çözümleri.
- [SSS](./support/faq.md) — hızlı cevaplar.
- [Yardım alın](./support/get-help.md) — topluluk ve iyi bir rapor nasıl dosyalanır.

## İlgili {#related}

- [Kavramlar & sözlük](./concepts.md) — capsule, store, URN ve DIG ödemesi tanımlanmış
- [Bir uygulama iskeleleyin (create-dig-app)](./build-a-dapp/scaffold.md) — dağıtılabilir bir projeye tek komutta başlayın (npm veya CLI)
- [CLI'yı kurma](./digstore/cli/install.md) — `digstore`'u makinenize kurun
- [Zincir üzeri sabitleme](./digstore/cli/onchain-anchoring.md) — cüzdan kurulumu, fonlama ve maliyetler
- [GitHub Actions'tan dağıtım](./digstore/cli/deploy-from-github-actions.md) — CI'da push-ile-yayınlama
- [CLI eğitimi](./digstore/cli/quickstart.md) — tam oluştur-commit-oku yürüyüşü
