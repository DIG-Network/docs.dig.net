---
sidebar_position: 1
slug: /
title: DIG Network
description: "dig-store ile içerik adresli yayınlama, kör barındırma ve alma için dig RPC ile içerik erişimi için DIG Browser dahil olmak üzere DIG Network temel bileşenlerine genel bakış."
keywords:
  - DIG Network
  - Proof-of-Stake Layer 2
  - Chia
  - capsule
  - dig-store
  - dig RPC
  - DIG Browser
tags:
  - capsule
  - store
  - dig-rpc
  - chia-protocol
  - digstore-cli
  - dighub
  - browser
---

# DIG Network {#dig-network}

**DIG Network, Chia üzerinde bir Proof-of-Stake Layer 2'dir** — barındıranı güvenmeden içerik yayınlamak, adreslemek ve sunmak için merkeziyetsiz bir ağ.

Bu dokümantasyon, ağı ve **temel bileşenlerini** (primitives) kapsar: geliştiricilerin DIG üzerine inşa etmek için kullandığı birleştirilebilir yapı taşları. Ağ hâlâ genişlemekte olup zamanla buraya daha fazla temel bileşen belgelenecektir.

:::info $DIG ağı çalıştırır
**$DIG, DIG Network'ün motoru ve ekonomisidir.** Bir capsule yayınlamak, bir store'a sahip olmak, bir içerik üreticisine bahşiş vermek gibi her değer alışverişi $DIG üzerinden akar. İçerik tüketmek her zaman zahmetsiz ve ücretsiz kalır: okumak için asla ödeme yapmazsınız, yalnızca yayınlamak ve sahip olmak için ödersiniz.
:::

## capsule {#the-capsule}

Her temel bileşende geçen tek bir kavram var. Bir **capsule**, tek bir değişmez store nesli (generation) — `(storeId, rootHash)` çifti — olup kanonik olarak `storeId:rootHash` şeklinde yazılır. Bir **store, bir capsule dizisidir** — her commit için bir tane (her commit, zincir üzerindeki kökü ilerletir ve yeni bir capsule üretir).

capsule, ağın şu birimidir:

- **Derleme** — her capsule tek, sabit boyutlu bir WASM modülüne derlenir (uzunluğu içerik boyutu hakkında hiçbir şey sızdırmayacak şekilde doldurulmuştur).
- **Fiyatlandırma** — canlı kurdan $DIG olarak ödenen **capsule başına tek tip bir fiyat** (mint veya commit); bir store'un yaşam boyu maliyeti, capsule başına tek tip fiyat × capsule sayısıdır.
- **Alma (Retrieval)** — bir URN bir capsule'ü (artı içindeki isteğe bağlı bir kaynağı) adlandırır.
- **Önbellekleme** — bir host veya tarayıcı, bir capsule'ü `storeId:rootHash` anahtarıyla önbelleğe alır; yerel önbellek bir capsule kümesidir.
- **Köken kanıtı (Provenance)** — her capsule'ün kökü, yayıncının BLS imzasını ve bir Merkle kökünü taşır.

Bu, ekosistem genelinde geçerli tanımdır: "capsule = `(storeId, rootHash)`" ifadesi dig-store'da, dig RPC'de ve DIG Browser'da aynı anlama gelir.

:::tip Deneyin
[**DIGHUb'da ilk capsule'ünüzü oluşturun ↗**](https://hub.dig.net/new) — tarayıcıda bir site yayınlayın, CLI gerekmez. Her capsule (mint veya commit) **$DIG cinsinden tek tip capsule fiyatına** mal olur.
:::

## Temel bileşenler {#primitives}

### 🗄️ dig-store {#️-digstore}

İlk ve en temel bileşen: **içerik adresli, şifrelenmiş bir WASM proje formatı**. Bir build dizinini işaret edersiniz, dağıtımları Git gibi commit'lersiniz ve hem verinizi hem de ona erişimi denetleyen sunucuyu barındıran tek, kendini savunan bir `.wasm` dosyası elde edersiniz. URN *anahtarın kendisidir* — hem konumlandırır hem şifresini çözer.

→ **[dig-store'u keşfedin](./digstore/what-is-digstore.md)**

| | |
|---|---|
| **[dig-store nedir?](./digstore/what-is-digstore.md)** | Tek dosya fikri, özetle |
| **[Format](./digstore/format/overview.md)** | Projeler, dağıtımlar, URN'ler, şifreleme, kanıtlar |
| **[CLI Eğitimi](./digstore/cli/quickstart.md)** | Projenizde `dig-store`'u kurun ve kullanın |

### 🛰️ dig RPC {#️-dig-rpc}

Ağ bileşeni: barındırılan dig-store dağıtımlarından **içerik okumak için standart bir arayüz**. HTTPS `POST` üzerinden JSON-RPC 2.0 — her barındırma düğümü bunu aynı şekilde konuşur, böylece içerik taşınabilir ve istemciler düğümden bağımsızdır. Alma anahtarına göre şifreli metin + dahil etme kanıtları, `(store_id, root)` ile tüm dağıtımlar ve genel keşif manifestosunu sunar — parçalar halinde akıtılır, tasarım gereği kördür, tamamen istemci tarafında doğrulanır ve şifresi çözülür.

→ **[dig RPC'yi keşfedin](./rpc/what-is-the-dig-rpc.md)**

| | |
|---|---|
| **[dig RPC nedir?](./rpc/what-is-the-dig-rpc.md)** | Tüm ağın okuma yolu için tek bir uç nokta |
| **[Metotlar](./rpc/methods.md)** | `dig.getContent`, `dig.getCapsule`, `dig.getManifest`, `dig.listCapsules`, … |
| **[Akış (Streaming)](./rpc/streaming.md)** | Chunk modeli, yeniden birleştirme ve kanıt doğrulama |
| **[Uygunluk & Güvenlik](./rpc/conformance.md)** | Kör model, CORS ve bir düğümün uygulaması gerekenler |

### 🌐 DIG Browser {#-dig-browser}

İstemci bileşeni: **yerleşik bir Chia cüzdanına sahip bir tarayıcı**. Her sayfaya bir `window.chia` sağlayıcısı enjekte eder, böylece herhangi bir web uygulaması WalletConnect kurulumu olmadan kullanıcının adresini, imzalarını ve harcamalarını talep edebilir — zaten CHIP-0002 konuşan uygulamalar için doğrudan bir alternatif. Ayrıca `chia://` içerik adreslerini doğrudan çözer.

→ **[DIG Browser'a karşı geliştirin](./browser/using-window-chia.md)**

| | |
|---|---|
| **[Uygulamanızda `window.chia` kullanımı](./browser/using-window-chia.md)** | Enjekte edilen cüzdanı algılayın, bağlanın ve CHIP-0002 metotlarını çağırın |

:::tip Deneyin
[**DIG Browser'ı edinin ↗**](https://github.com/DIG-Network/DIG_Browser/releases) — `chia://` içeriğini açmak ve yerleşik cüzdanı kullanmak için tarayıcıyı indirin.
:::

*Diğer temel bileşenler — mutabakat (settlement) ve düğüm işletimi — hazır olduklarında kendi bölümlerine kavuşacak.*

## Yolunuzu seçin {#pick-your-path}

Dokümantasyon **ne yaptığınıza** göre organize edilmiştir. Her yol, on saniyelik bir "neden"i, ihtiyacınız olan zihinsel modeli ve yüksek sinyalli nasıl-yapılır bilgisiyle açılır — ardından daha derine inmek istediğinizde protokole bağlanır.

- **[Sahip olduğunuz bir site veya uygulamayı yayınlayın](./audiences/app-developers.md)** — bir web sitesini/uygulamayı kendi zincir üzeri varlığınız olarak gönderin; ücretsiz inşa edin, bir capsule yayınlayın.
- **[NFT'ler ve koleksiyonlar basın](./audiences/nft-developers.md)** — kalıcı, kurcalamaya karşı kanıtlı capsule'lerle desteklenen CHIP-0007 dropları.
- **[DIG'i uygulamanıza entegre edin](./audiences/integration-developers.md)** — tipli bir SDK + tamamen makine tarafından okunabilir bir platform.
- **[Bir düğüm çalıştırın](./run-a-node/index.md)** — içeriği kanıtlanabilir ve sağlayıcı-kör şekilde sunun.
- **[chia:// içeriği açın](./audiences/content-consumers.md)** — kendi tarayıcınızın zincire karşı doğruladığı içeriği okuyun.
- **[Takıldığınızda](./audiences/troubleshooting.md)** — hatanızı kararlı kodundan bulun.

Kelime dağarcığına yeni misiniz? [Kavramlar & sözlük](./concepts.md)'e göz atın. Tam tasarımı mı istiyorsunuz? [Protokol derinlemesine inceleme](./protocol-deep-dive.md)'yi okuyun.

:::note
DIG Network ve temel bileşenleri açık kaynaktır. dig-store, GPL-2.0 lisansı altındadır; bkz. [dig-store deposu](https://github.com/DIG-Network/digs).
:::

## İlgili {#related}

- [Hızlı başlangıç](./quickstart.md) — ilk sitenizi gönderin; inşa etmek ve önizlemek ücretsizdir
- [Chia üzerinde bir dapp inşa edin](./build-a-dapp/tutorial.md) — tek uçtan uca eğitimde her temel bileşen
- [Kavramlar & sözlük](./concepts.md) — temel DIG varlıkları, tanımlanmış ve bağlantılı
- [dig-store nedir?](./digstore/what-is-digstore.md) — içerik adresli store formatı
- [dig RPC nedir?](./rpc/what-is-the-dig-rpc.md) — ağ genelinde okuma arayüzü
- [chia:// protokolü](./browser/chia-protocol.md) — içeriği DIG Browser'da açmak
- [Yardım alın](./support/get-help.md) — topluluk, sorun giderme ve hata kodları
