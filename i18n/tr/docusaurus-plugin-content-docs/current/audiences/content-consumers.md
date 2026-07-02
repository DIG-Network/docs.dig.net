---
sidebar_position: 5
title: İçerik tüketicileri için
description: "KENDİ tarayıcınızın blockchain'e karşı doğruladığı chia:// içeriğini açın — hiçbir host onu değiştiremez veya sahtesini yapamaz, özel içerik host'tan gizli kalır ve kalıcı ve her yerde yeniden barındırılabilirdir, böylece kimse kaldıramaz veya sizi kilitleyemez."
keywords:
  - open chia content
  - DIG Browser
  - chia:// protocol
  - verified content
  - private content salt
  - extension
tags:
  - browser
  - chia-protocol
  - capsule
  - dig-node
---

# İçerik tüketicileri için {#for-content-consumers}

> **KENDİ tarayıcınızın blockchain'e karşı doğruladığı `chia://` içeriğini açın** — hiçbir host onu değiştiremez veya sahtesini yapamaz, özel içerik host'tan gizli kalır ve kalıcı ve her yerde yeniden barındırılabilirdir, böylece kimse kaldıramaz veya sizi kilitleyemez.

## Zihinsel model {#the-mental-model}

Bir `chia://` bağlantısı yapıştırın ve içerik doğrudan ağdan gelir — render edilmeden önce **CİHAZINIZDA** **içerik adresli** ve **kriptografik olarak doğrulanmış**. **Başarısızlıkta kapanır**: kurcalanmış veya şifresi çözülemeyen baytlar asla gösterilmez.

- Store'un *en son* sürümü için **`rootHash`'i atlayın**: `chia://<storeId>/`.
- Tek bir tam değişmez [capsule](../concepts.md#capsule)'ü sabitlemek için **dahil edin**: `chia://<storeId>:<rootHash>/`.

Genel içerik yalnızca bağlantıya ihtiyaç duyar. Özel içerik ayrıca gizli bir **`?salt=`**'a — bir şifre gibi — ihtiyaç duyar.

## DIG Browser'ı veya uzantıyı edinin {#get-the-dig-browser-or-the-extension}

- **[DIG Browser'ı edinin ↗](https://github.com/DIG-Network/DIG_Browser/releases)** — `chia://` ve yerleşik bir cüzdanı gömülü olarak içeren bir tarayıcı.
- Chrome / Edge / Brave / Firefox için **uzantı** — zaten kullandığınız bir tarayıcıya `chia://` çözümlemesi ekler.

## `chia://` içeriğini açma — en son ile sabitlenmiş {#open-chia-content--latest-vs-pinned}

Adres biçimleri, temiz `chia://<store>/` çubuğu ve bir `rootHash`'i ne zaman sabitlemeniz gerektiği.

→ [chia:// protokolü](../browser/chia-protocol.md)

## Yerleşik sayfalar, doğrulanmış rozet & kalkanlar {#built-in-pages-the-verified-badge--shields}

`chia://home`, `chia://wallet`, `chia://settings` ve aktif capsule için her kaynağın dahil etme kanıtı hükmünü gösteren doğrulanmış rozet / kalkanlar.

→ [window.chia kullanımı](../browser/using-window-chia.md)

## Genel ile özel — bir `?salt=` sırrına ne zaman ihtiyacınız var {#public-vs-private--when-you-need-a-salt-secret}

Genel store'lar yalnızca bağlantıyla açılır; özel store'lar, şifre çözme anahtarını türeten gizli tuzu (salt) gerektirir.

→ [Genel ile özel store'lar](../digstore/format/urns-and-encryption.md#public-vs-private-stores) · [Genel ile özel — fark nedir?](../support/faq.md#public-vs-private)

## İçeriği yerel olarak çalıştırın (isteğe bağlı) {#run-content-locally-optional}

Daha hızlı, çevrimdışı dostu okumalar için tarayıcınızı/uzantınızı yerel bir [dig-node](../concepts.md#dig-node)'a yönlendirin — bir `.dig` önbelleğini paylaşırlar. İçeriği okumak için asla bir düğüme *ihtiyacınız* yoktur.

→ [Bir düğüm çalıştırın](../run-a-node/index.md)

## $DIG edinin {#get-dig}

İçerik *okumak* için $DIG'e ihtiyacınız yoktur. Yayınlamak isterseniz, **TibetSwap**, **dexie.space** veya **9mm.pro**'da $DIG edinin.

→ [DIG'i nereden alırım?](../support/faq.md#where-do-i-get-dig)

---

## Daha derine inin: protokol {#go-deeper-the-protocol}

- **"blockchain'e karşı doğrulanmış"** → [Zincir üzeri sabitleme](../digstore/cli/onchain-anchoring.md) · [Kanıtlar & güvenlik](../digstore/format/proofs-and-security.md)
- **"genel ile özel tuz (salt)"** → [URN'ler & şifreleme](../digstore/format/urns-and-encryption.md#public-vs-private-stores)
- **"en son ile sabitlenmiş"** → [Generation'lar & kök karmalar](../digstore/format/store-structure.md#generations-and-root-hashes)
- **Her şey** → [Protokol derinlemesine inceleme](../protocol-deep-dive.md) · [Kavramlar & sözlük](../concepts.md)
