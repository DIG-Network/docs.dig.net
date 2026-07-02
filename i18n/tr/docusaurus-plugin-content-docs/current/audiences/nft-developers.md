---
sidebar_position: 2
title: NFT geliştiricileri için
description: "Sanatı kalıcı olarak kurcalamaya karşı kanıtlı bir DIG capsule'ünde yaşayan tam bir CHIP-0007 koleksiyonu basın — tek bir atomik imzalı demet, gerçek telif hakları ve zincir üzerinde henüz kanıtlayamadıkları şeyi asla sahtelemeyen dürüst drop mekanikleri."
keywords:
  - mint NFT Chia
  - CHIP-0007 collection
  - NFT art permanent
  - capsule-backed mint
  - nft-drop template
  - royalties
tags:
  - capsule
  - chip-0035
  - dig-sdk
  - dighub
  - digstore-cli
---

# NFT geliştiricileri için {#for-nft-developers}

> **Sanatı KALICI olarak kurcalamaya karşı kanıtlı bir DIG capsule'ünde yaşayan tam bir CHIP-0007 koleksiyonu basın** — tek bir atomik imzalı demet, gerçek telif hakları ve zincir üzerinde henüz kanıtlayamadıkları şeyi asla sahtelemeyen dürüst drop mekanikleri (reveal / allowlist / aşamalar).

## Zihinsel model {#the-mental-model}

Önce sanatınızı bir **[DIG capsule](../concepts.md#capsule)**'üne koyun, ardından `data_uris` / `metadata_uris`'i o capsule'e işaret eden NFT'ler basın. Zincir üzerindeki karmalar gerçek baytları sabitler — böylece sanat içerik adresli, doğrulanabilir ve kalıcıdır, çürüyebilecek veya değiştirilebilecek bir bağlantı değildir.

Harcamalar **asla elle yazılmaz**: kanonik CHIP-0035 wasm oluşturucusu ([`@dignetwork/dig-sdk/spend`](../sdk.md) üzerinden), her coin harcamasını oluşturur, cüzdanınız bir kez imzalar ve bir kez yayınlanır.

Bir **store basmak** $DIG açısından ücretsizdir — yalnızca bir capsule oluşturulduğunda (sanat bir capsule'e yazıldığında) **tek tip capsule fiyatını** ödersiniz.

## Bir mint sayfası iskeleleyin — `nft-drop` şablonu {#scaffold-a-mint-page--the-nft-drop-template}

Tek bir komutla cüzdana bağlı bir drop sayfasından başlayın:

```sh
digstore new nft-drop
# or
npm create dig-app@latest my-drop -- --template nft-drop
```

→ [Bir uygulama iskeleleyin](../build-a-dapp/scaffold.md)

## CLI'dan basın {#mint-from-the-cli}

Varlık CLI'ı, harcamayı `digstore-chain` oluşturucuları aracılığıyla oluşturur, cüzdan tohumunuzla imzalar ve gönderir — hepsi `--dry-run` / `--json` ile CI-güvenli:

```sh
digstore did create                          # an issuer DID for attribution
digstore collection create --name "My Drop"  # a CHIP-0007 collection
digstore nft mint --data ./art.png --metadata ./meta.json --dry-run
digstore offer make ...                       # XCH / CAT trades
```

`nft mint` **capsule-media** yolu, sanatı + CHIP-0007 meta verisini bir capsule'e yazar, gerçek baytlardan veri/meta veri karmalarını hesaplar ve URI'leri capsule'ün `chia://` adresine (https ağ geçidi geri dönüşüyle) ayarlar. → [Komut referansı](../digstore/cli/command-reference.md)

## Web'den basın — DIGHUb NFT Studio {#mint-from-the-web--dighub-nft-studio}

Tarayıcıda capsule destekli bir koleksiyon basın: sanatı yükleyin (bir capsule'e yazılır), telif haklarını ayarlayın ve atıf için bir DID ekleyin — cüzdan sonda imzalar. → [DIGHUb ↗](https://hub.dig.net)

## Drop'lar — reveal, allowlist, aşamalar {#drops--reveal-allowlist-phases}

Drop mekanikleri **dürüstçe** sunulur: bugün zincir üzerinde neyin uygulandığı ile claim-coin ilkesini beklerken zincir dışı bir kolaylık olan şey. Zincir üzerinde henüz kanıtlayamadığımız bir garantiyi asla sunmayız.

→ Uçtan uca basım ipliği için [Chia üzerinde bir dapp inşa edin](../build-a-dapp/tutorial.md).

## SDK ile harcamalar oluşturun — asla elle yazmayın {#build-spends-with-the-sdk--never-hand-roll}

Her coin harcaması, kanonik CHIP-0035 wasm'ı tarafından oluşturulur ve `@dignetwork/dig-sdk/spend`'de yeniden dışa aktarılır. Akış her zaman **oluştur → imzala → yayınla**'dır, cüzdanın yalnızca imzalaması için bölünmüştür.

→ [Harcamalar oluşturma](../spends.md) · [DIG SDK](../sdk.md)

## Parasallaştırın & kısıtlayın — Paywall {#monetize--gate--the-paywall}

SDK'nın `Paywall`'u, **öde-ve-aç** ve **NFT / koleksiyon-sahipliği kısıtlaması** için sağlayıcıyı harcama oluşturucusuyla birleştirir — harcamaları elle bağlamadan.

→ [DIG SDK → Paywall](../sdk.md#paywall)

## Teklifler — oluştur / al / göster {#offers--make--take--show}

NFT'leri `digstore offer make | take | show` ile (her biri `--dry-run` / `--json`) XCH veya CAT'ler karşılığında takas edin. → [Komut referansı](../digstore/cli/command-reference.md)

---

## Daha derine inin: protokol {#go-deeper-the-protocol}

- **"kurcalamaya karşı kanıtlı capsule"** → [Kanıtlar & güvenlik](../digstore/format/proofs-and-security.md) · [capsule & store modeli](../digstore/format/store-structure.md)
- **"asla bir harcamayı elle yazmayın"** → [CHIP-0035 store-coin harcamaları & delegasyon](../chip-0035-spends-and-delegation.md)
- **Her şey** → [Protokol derinlemesine inceleme](../protocol-deep-dive.md) · [Kavramlar & sözlük](../concepts.md)
