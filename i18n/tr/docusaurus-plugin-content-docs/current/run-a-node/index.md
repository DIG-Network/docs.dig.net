---
sidebar_position: 1
title: Bir DIG düğümü çalıştırın
description: "Bir dig-node'un ne olduğu, neden bir tane çalıştırmanız gerektiği ve nasıl kurulacağı — Ubuntu/Debian için apt deposu veya çapraz platform evrensel yükleyici."
keywords:
  - dig-node
  - run a node
  - DIG node
  - seedbox
  - dig RPC
  - install dig-node
tags:
  - dig-node
  - dig-rpc
  - capsule
---

# Bir DIG düğümü çalıştırın {#run-a-dig-node}

> **İçeriği kanıtlanabilir ve sağlayıcı-kör şekilde sunun** — yalnızca karmalarla anahtarlanmış ayırt edilemez şifreli metne dokunursunuz, yürütme kanıtlarıyla sadık sunumu tasdik edebilirsiniz ve istemci her şeyi zincire karşı doğrular, böylece güven asla düğümünüze dayanmaz.

Bir **dig-node**, DIG Network'ün içerik **sunucusudur** — ağın arz tarafı. capsule'leri barındırır, yerel bir `.dig` önbelleği tutar ve DIG içeriğini okuyan her şeyin sizden okuyabilmesi için [dig RPC](../rpc/what-is-the-dig-rpc.md)'yi açığa çıkarır. Başsız (headless) olarak (tarayıcı yok, arayüz yok) bir arka plan hizmeti olarak çalışır — yayınladığınız veya sunmaya yardım etmek istediğiniz içerik için bir seedbox.

Şifreli metin + kanıtları getiren, zincir üzeri köke karşı doğrulayan, yerel olarak şifresini çözen ve render eden **tüketicilerin** — [DIG Browser](../browser/chia-protocol.md) ve tarayıcı uzantısının — karşılığıdır. DIG içeriğini okumak için bir dig-node'a **ihtiyacınız yoktur**: yalnızca bir tüketici, `rpc.dig.net`'teki genel referans düğümüne geri dönerek gayet iyi çalışır. Bir dig-node'u **sunmak** için çalıştırırsınız — ve aynı makinede biri mevcut olduğunda, tüketici ondan okur (yerel, çevrimdışı dostu ve ağa katkıda bulunan) ve bir `.dig` önbelleğini paylaşırlar.

:::info Sunma ile tüketme
- **dig-node** = içerik sunar + dig RPC'yi açığa çıkarır. Başsız arka plan hizmeti.
- **DIG Browser / uzantı** = içeriği tüketir (yerel olarak doğrular + şifresini çözer). Yerel düğüm gerekmez.

Her ikisi de kurulduğunda, tarayıcı/uzantı yerel dig-node'unuzdan okur; aksi takdirde `rpc.dig.net`'ten okurlar. Her iki durumda da her bayt istemci tarafında zincire karşı doğrulanır — kaynağa asla güvenilmez.
:::

## Kurun {#install-it}

| Makineniz | Kullanın |
|---|---|
| **Ubuntu / Debian** | Yerel **[apt deposu](./apt.md)** — `apt install dig-node digstore`, otomatik olarak bir systemd hizmeti olarak etkinleştirilir. |
| **Windows / macOS / Linux (herhangi biri)** | Çapraz platform **[evrensel yükleyici](#universal-installer-any-os)** — her işletim sistemi için tek bir `curl \| sh` (veya indirme). |

Her ikisi de aynı `dig-node` hizmetini artı `digstore` CLI'ı kurar. apt, Debian-yerel yoldur (imzalı, `apt upgrade` ile güncellenebilir); evrensel yükleyici geri kalan her şeyi kapsar.

### apt (Ubuntu / Debian) — Debian ailesi sistemlerde önerilir {#apt-ubuntu--debian--recommended-on-debian-family-systems}

Yerel yol: `apt.dig.net`'te imzalı bir apt deposu. `dig-node`'u yönetilen bir **systemd hizmeti** olarak kurar ve `apt upgrade` ile güncel tutar.

→ **[apt ile Ubuntu/Debian'a kurun](./apt.md)**

### Evrensel yükleyici (herhangi bir işletim sistemi) {#universal-installer-any-os}

Çapraz platform yolu — Windows, macOS ve herhangi bir Linux. İşletim sisteminizi algılar, `dig-node` hizmetini (Windows hizmeti / `systemd` / `launchd`) ve `digstore` CLI'ını kurar ve bir paket yöneticisine ihtiyaç duymaz:

```sh
curl -fsSL https://dig.net/install.sh | sh
```

Bu, [Releases sayfasında](https://github.com/DIG-Network/dig-installer/releases) gönderilen aynı kendi kendine yeten `dig-installer`dır — bir kabuğa (shell) yönlendirmek istemiyorsanız veya Windows'taysanız doğrudan indirip çalıştırın. Bunu yapmak, bayraklar yerine tıklamayı tercih edenler için rehberli bir [GUI sihirbazı](./universal-installer.md#gui-installer) da açar.

:::note Ön sürüm (pre-release)
Barındırılan yükleyiciler (`apt.dig.net`, `dig.net/install.sh`) hâlâ hazırlanmaktadır. Yayına girene kadar, kaynaktan derleyin veya [dig-node Releases](https://github.com/DIG-Network/dig-node/releases)'ten bir ikili (binary) alın. Buradaki komutlar gerçek, amaçlanan komutlardır.
:::

## Sadece içerik mi okumak istiyorsunuz? {#just-want-to-read-content}

Bir düğüme ihtiyacınız yok. **[DIG Browser'ı ↗](https://github.com/DIG-Network/DIG_Browser/releases)** edinin ve herhangi bir `chia://` adresini açın — eğer bir tane varsa yerel dig-node'unuzdan, yoksa `rpc.dig.net`'ten tüketir. Bkz. [`chia://` protokolü](../browser/chia-protocol.md).

## İlgili {#related}

- [apt ile Ubuntu/Debian'a kurun](./apt.md) — Debian-yerel yol + systemd hizmet yönetimi
- [Her yere kurun — evrensel yükleyici](./universal-installer.md) — Windows / macOS / herhangi bir Linux + `dig.local`
- [Düğümünüze bir tüketici yönlendirin](./point-a-consumer.md) — yerel öncelikli okumalar + paylaşılan `.dig` önbelleği
- [dig-node'u yapılandırın](./configure.md) — bağlantı noktaları, dinleyiciler, önbellek sınırı, yukarı akış
- [Uzak bir kaynağı kendiniz barındırın](../rpc/dig-remote.md) — `digstore serve` + dig:// clone/pull/push
- [Düğümünüzü yönetin](./manage.md) — control.* yönetim RPC'leri + Düğümüm arayüzü
- [Genel ağ RPC'sini kullanma](../rpc/public-network-rpc.md) — düğümünüzün konuştuğu dig RPC ve ağda bir düğüm işletme
- [CLI'yı kurma](../digstore/cli/install.md) — kendi başına `digstore` (yayınlama, sunma değil)

## Daha derine inin: protokol {#go-deeper-the-protocol}

- **"kör host & decoy'lar"** → [dig RPC kör sunum modeli](../rpc/what-is-the-dig-rpc.md) · [Düğüm uygunluğu](../rpc/conformance.md)
- **"sadık sunumu tasdik etme"** → [Dahil etme ile yürütme kanıtları](../inclusion-vs-execution-proofs.md)
- **"dig:// clone/pull/push"** → [§21/§22 uzak protokolü](../rpc/dig-remote.md)
- **Her şey** → [Protokol derinlemesine inceleme](../protocol-deep-dive.md) · [Kavramlar & sözlük](../concepts.md)
