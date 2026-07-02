---
sidebar_position: 1
title: Uygulama geliştiricileri için
description: "Gerçekten SAHİP OLDUĞUNUZ bir web sitesi veya uygulama gönderin — kiralanan değil, zincir üzerinde kendi varlığınız olarak basılmış. Ücretsiz inşa edin ve önizleyin; yalnızca yayınladığınızda küçük bir tek tip $DIG fiyatı ödeyin, dosyalar tarayıcınızda şifrelenir, böylece hiçbir host onları okuyamaz."
keywords:
  - publish a site
  - own your app
  - DIGHUb
  - digstore
  - free until publish
  - capsule
tags:
  - dighub
  - digstore-cli
  - capsule
  - store
  - dig-payment
  - anchoring
---

# Uygulama geliştiricileri için {#for-app-developers}

> **Gerçekten SAHİP OLDUĞUNUZ bir web sitesi veya uygulama gönderin** — kiralanan değil, zincir üzerinde kendi varlığınız olarak basılmış. **Ücretsiz** inşa edin ve önizleyin; yalnızca yayınladığınızda küçük bir **tek tip $DIG fiyatı** ödeyin, dosyalar **tarayıcınızda şifrelenir**, böylece hiçbir host onları okuyamaz.

## Zihinsel model {#the-mental-model}

Bir **[store](../concepts.md#store)**, web sitenizin kalıcı kimliğidir — kontrol ettiğiniz bir zincir üzeri singleton. Her yayınladığınızda, `storeId:rootHash` olan tek bir değişmez **[capsule](../concepts.md#capsule)** basarsınız. Bir store, yalnızca zaman içinde yayınladığınız capsule'lerin dizisidir.

Aynı ücretsiz-inşa → ücretli-yayınlama döngüsüne giden iki ön kapı var:

- **Web yolu** — [hub.dig.net](https://hub.dig.net)'teki [DIGHUb](../concepts.md#dighub): inşa edilmiş bir klasör bırakın, ücretsiz önizleyin, yalnızca Publish'te bir cüzdan bağlayın.
- **CLI / CI yolu** — [`digstore`](../concepts.md#digstore-cli) CLI'ı + [`create-dig-app`](../concepts.md#create-dig-app) + [GitHub dağıtım Action'ı](../concepts.md#deploy-action).

İskeleleme, inşa etme ve önizleme **hiçbir şeye** mal olmaz. Yalnızca bir capsule yayınladığınızda ödersiniz.

| Yaptığınız şey | Maliyet |
|---|---|
| İskeleleme, inşa etme, bir taslağı önizleme | **Ücretsiz** |
| İlk capsule'ünüzü yayınlama (bir store basma) | **$DIG cinsinden tek tip capsule fiyatı** + küçük XCH ücreti |
| Her güncellemeyi yayınlama (yeni bir capsule) | **$DIG cinsinden tek tip capsule fiyatı** + küçük XCH ücreti |

## Buradan başlayın {#start-here}

- **[Hızlı başlangıç — 10 dakikada bir site gönderin](../quickstart.md)** — en hızlı yol, web veya CLI.

## Web'den yayınlama — DIGHUb {#publish-from-the-web--dighub}

[**DIGHUb'da yeni bir store başlatın ↗**](https://hub.dig.net/new). İnşa edilmiş sitenizi bırakın (`dist/` veya `build/` klasörünüz), gerçek okuma yolunda **ücretsiz bir taslak önizleme** alın ve yalnızca **Publish** adımında bir cüzdan bağlayın. [Hızlı başlangıç → Web'den yayınlayın](../quickstart.md#a-publish-from-the-web)'daki web yürüyüşüne bakın.

## CLI'dan yayınlama — digstore {#publish-from-the-cli--digstore}

Git şekilli döngü: `new` → `dev` → `init` → `commit`.

```sh
digstore new vite-react   # scaffold a runnable project — free, no mint
digstore dev              # preview on the real chia:// read path, live-reload — free
digstore init site --dir dist   # mint the store's first capsule (uniform price + XCH fee)
digstore commit -m "v1.1"       # publish an update — a new capsule
```

→ [CLI hızlı başlangıcı](../digstore/cli/quickstart.md) · [Tam proje iş akışı](../digstore/cli/project-workflow.md)

## Bir uygulama iskeleleyin — 5 şablon {#scaffold-an-app--5-templates}

Çalıştırılabilir, cüzdana bağlı bir başlangıçtan başlayın — `static`, `vite-react`, `next-static`, `nft-drop` veya `dapp-window-chia` — `digstore new <template>` veya `npm create dig-app` ile.

→ [Bir uygulama iskeleleyin](../build-a-dapp/scaffold.md)

## `digstore dev` ile ücretsiz önizleyin {#preview-free-with-digstore-dev}

`digstore dev`, projenizi canlı yeniden yükleme ve enjekte edilmiş bir geliştirme `window.chia`'sıyla **gerçek** DIG okuma yolu (şifrele → derle → doğrula → şifre çöz) üzerinden sunar. Gördüğünüz şey ziyaretçilerin aldığı şeydir — ve hiçbir şey basılmaz veya harcanmaz.

→ [CLI hızlı başlangıcı → geliştirme & önizleme](../digstore/cli/quickstart.md)

## `dig.toml` — commit edilebilir manifesto {#digtoml--the-committable-manifest}

Proje kökünüzdeki `dig.toml`, `digstore dev`, `digstore deploy` ve iskeleleme şablonları tarafından paylaşılan `store-id`, `output-dir`, `build-command`, `remote` ve diğer yapılandırmayı tutar. **Hiçbir sır içermez** (bunlar ortamdan gelir), bu yüzden commit edin.

→ [Proje yapılandırması & derleme zamanı değerleri](../digstore/cli/configuration.md)

## Güncellemeler & sürümler — her yayınlama yeni bir capsule'dür {#updates--versions--each-publish-is-a-new-capsule}

Her yayınlama, mevcut build'i yeni, değişmez bir **capsule**'e mühürler ve store'unuzun zincir üzeri kökünü ilerletir. Eski capsule'ler okunabilir kalır; bir okuyucu belirli bir `rootHash` sabitlemedikçe store her zaman en sonuncusuna çözümlenir.

→ [Zincir üzeri sabitleme](../digstore/cli/onchain-anchoring.md)

## Maliyeti nedir {#what-it-costs}

İnşa etmek ve önizlemek ücretsizdir; yayınlanan capsule başına **$DIG cinsinden tek tip bir fiyat**, artı aynı zincir üzeri harcamaya **atomik olarak** dahil edilen küçük bir XCH ağ ücreti. Fiyat, tasarım gereği capsule başına tek tiptir (böylece capsule uzunluğu içeriğiniz hakkında hiçbir şey sızdırmaz). TibetSwap, dexie.space veya 9mm.pro'da $DIG edinin.

→ [DIG nereden alınır](../digstore/cli/onchain-anchoring.md#where-to-get-dig) · [Her capsule neden aynı fiyatta?](../support/faq.md#why-uniform-price)

## GitHub Actions'tan push-ile-dağıtım {#push-to-deploy-from-github-actions}

Her push'un yeni bir capsule yayınlaması için `dig-network/deploy-action`'ı bağlayın — bayt-özdeş bir build'i hiçbir işlem yapmayan hale getiren bir `if-changed` korumasıyla (harcama yok).

→ [GitHub Actions'tan dağıtım](../digstore/cli/deploy-from-github-actions.md)

## Bir `*.on.dig.net` web adresi ekleyin (isteğe bağlı) {#add-a-ondignet-web-address-optional}

Store'unuz, onaylandığı anda [URN](../concepts.md#urn)'i / [`chia://`](../browser/chia-protocol.md) adresiyle erişilebilir durumdadır — ek maliyet yok. İnsan dostu bir `<isim>.on.dig.net` handle'ı, bunun üzerine DIGHUb'da **isteğe bağlı, ücretli** bir kayıttır.

→ [Kendi alan adımı kullanabilir miyim?](../support/faq.md#can-i-use-my-own-domain)

---

## Daha derine inin: protokol {#go-deeper-the-protocol}

Yukarıdaki sade dilde model, göndermek için ihtiyacınız olan her şeydir. Tam tasarımı istediğinizde:

- **"bir store, capsule'lerin bir dizisidir"** → [Kavramlar & sözlük](../concepts.md#capsule) · [capsule & store modeli](../digstore/format/store-structure.md)
- **"tarayıcınızda şifrelenmiş dosyalar"** → [URN'ler & şifreleme](../digstore/format/urns-and-encryption.md)
- **"tek tip bir fiyat + atomik $DIG harcaması"** → [Zincir üzeri sabitleme](../digstore/cli/onchain-anchoring.md#costs) · [CHIP-0035 store-coin harcamaları](../chip-0035-spends-and-delegation.md)
- **Her şey** → [Protokol derinlemesine inceleme](../protocol-deep-dive.md)
