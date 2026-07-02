---
sidebar_position: 1
title: DigStore nedir?
description: "Yerleşik şifreleme ve URN tabanlı adresleme ile Git şekilli, içerik adresli proje formatı; tek, kendini savunan bir WebAssembly moduline derlenir."
keywords:
  - DigStore
  - content-addressable
  - WebAssembly store
  - URN
  - encryption
  - capsule
tags:
  - store
  - capsule
  - urn
  - encryption
  - digstore-cli
  - anchoring
---

# DigStore nedir? {#what-is-digstore}

**DigStore, tek bir kendini savunan WebAssembly moduline derlenen, Git şekilli, şifrelenmiş, içerik adresli bir projedir.**

`init`, `add`, `commit`, `log`, `clone`, `push`, `pull` gibi Git tarzı komutları, **durağan halde şifrelenmiş** ve **tek bir `.wasm` dosyasına** derlenen bir proje için kullanırsınız. Bu tek dosya *hem verinizdir hem de ona erişimi denetleyen sunucudur*. Onu depolayan veya aktaran bir host yalnızca karmalarla (hash) adreslenmiş şifreli metin görür; taşıdığı şeyi okuyamaz.

İçeriği bir **[URN](./format/urns-and-encryption.md)** ile adreslersiniz ve URN *anahtarın kendisidir*: hem konumlandırır hem şifresini çözer. Birine bir URN verin ve o kaynağı okuyabilir; onsuz okuyamaz — yönetilecek ayrı bir şifre veya erişim listesi yoktur.

Git'ten farklı olarak DigStore, depo kaynağı için değil, **build çıktısı** için tasarlanmıştır. Bir projeyi `dist/` gibi bir dizine yönlendirirsiniz ve orada bulunanı yakalar.

## Neden var {#why-it-exists}

| Sorun | DigStore'un cevabı |
|---|---|
| Host'lar yayınladığınızı okuyabilir / tarayabilir | İçerik durağan halde şifrelenir; host yalnızca karmalarla anahtarlanmış şifreli metin tutar |
| Erişim kontrolü şifreler ve ACL'ler demektir | URN *yetenektir (capability)* — okumayı vermek için paylaşın, reddetmek için saklayın |
| Sunucuya gerçek baytları sunduğuna güvenmek zorundasınız | `clone`/`pull`, kurmadan önce modülün store id'sini, yayıncının imzalı kökünü ve **zincir üzeri singleton kökünü** doğrular — başarısızlıkta kapanır |
| "Bu yük ne kadar büyük?" dosya boyutundan sızar | Her proje, içeriği hakkında hiçbir şey açığa çıkarmayan tek tip bir boyuta doldurulmuş tek bir `.wasm`'dır |
| Sunum mantığı veriden ayrı yaşar | Veri ve onu koruyan kod *aynı* modüle derlenir |

## Bu dokümanları nasıl okumalı {#how-to-read-these-docs}

- **[DigStore Formatı](./format/overview.md)** — kavramlar: projeler, dağıtımlar, `.wasm` modülü, URN'ler, şifreleme ve kanıtlar. DigStore'un *ne* olduğunu anlamak istiyorsanız buradan başlayın.
- **[CLI Eğitimi](./cli/install.md)** — CLI'ı kurun ve gerçek bir projede kullanın: bir proje başlatın, bir build dizini yakalayın, dağıtımları commit edin, bir uzak (remote) üzerinden paylaşın ve içeriği geri akıtın.

Sadece denemek istiyorsanız, doğrudan **[Hızlı başlangıç](../quickstart.md)**'a (ücretsiz, web öncelikli yol) veya **[CLI eğitimi](./cli/quickstart.md)**'ne atlayın.

:::note
DigStore, [DIG Network](https://dig.net)'in bir parçasıdır. Tam teknik tasarım [Protokol bölümünde](../protocol-deep-dive.md) yer alır — içerik adresli WASM store formatı.
:::

## İlgili {#related}

- [DigStore Formatı](./format/overview.md) — projeler, WASM modülü, URN'ler, şifreleme, kanıtlar
- [Store yapısı](./format/store-structure.md) — store kimliği, generation'lar ve derlenmiş modül
- [URN'ler & Şifreleme](./format/urns-and-encryption.md) — hem adresleyen *hem de* şifresini çözen URN
- [CLI eğitimi](./cli/quickstart.md) — dakikalar içinde bir store oluşturun, commit edin ve okuyun
- [Kavramlar & sözlük](../concepts.md) — bir bakışta temel DIG varlıkları
