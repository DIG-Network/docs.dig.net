---
sidebar_position: 6
title: Sorun giderme — takılmayı aşın
description: "Her hata, sunucu günlüğüne doğrudan bağlanan kararlı bir kod ve bir istek kimliği verir, zincir üzeri harcamalar asla iki kez ödeme yapmamanız için yarış korumalıdır ve net ön uçuş korumaları $DIG harcamadan önce boşa giden capsule'leri durdurur."
keywords:
  - DIG troubleshooting
  - error codes
  - request id
  - dry-run
  - if-changed
  - doctor
tags:
  - dig-rpc
  - digstore-cli
  - dighub
  - capsule
---

# Sorun giderme {#troubleshooting}

> Her hata, sunucu günlüğüne doğrudan bağlanan bir **kararlı kod** ve bir **istek kimliği** verir, zincir üzeri harcamalar asla iki kez ödeme yapmamanız için **yarış korumalıdır** ve net **ön uçuş korumaları**, $DIG harcamadan önce boşa giden capsule'leri durdurur.

## Zihinsel model — hatanızı koduyla bulun {#the-mental-model--find-your-failure-by-its-code}

Her yüzey — dig RPC, digstore CLI, DIGHUb, `chia://` yükleyicisi, SDK — bir hatayı tek bir **KARARLI koda** eşler. **Kodda dallanın, asla mesajda değil.** Tek bir birleştirilmiş katalog hepsini kapsar ve ayrıca makine tarafından okunabilir olarak yayınlanır.

Ön uçuş korumaları (`digstore doctor`, `--dry-run`, `--if-changed`) ve devam ettirilebilir sabitlemeler, takılan veya hiçbir işlem yapmayan bir yayınlamanın **asla sessizce harcama yapmaması** anlamına gelir.

## Yaygın yayınlama hataları {#common-publishing-failures}

Yetersiz fon, bir onay zaman aşımı (devam ettirilebilir — harcamanız kaybolmaz) ve ileriye-sarma-olmayan (non-fast-forward) "uzak kök ilerledi" hatası.

→ [Sorun giderme](../support/troubleshooting.md)

## Okuma & doğrulama hataları {#read--verify-failures}

Kanıt uyuşmazlığı, şifre çözme/tuz (salt) hataları ve bulunamadı / decoy yanıtları.

→ [Okuma & doğrulama hataları](../support/troubleshooting.md#verification-failed)

## Cüzdan & oturum sorunları {#wallet--session-issues}

Bağlanma, yeniden kimlik doğrulama, reddedilen bir istek ve imzalayamayan yalnızca-izleme oturumları.

→ [Cüzdan oturumu imzalayamıyor](../support/troubleshooting.md#wallet-session)

## Ön uçuş & maliyet kontrolleri — bir capsule'ü boşa harcamayın {#pre-flight--cost-checks--dont-waste-a-capsule}

`digstore doctor` (ortam + hazır olma), `--dry-run` (maliyeti ve olası capsule'ü önizler) ve `--if-changed` (bayt-özdeş bir build hiçbir işlem yapmaz).

→ [GitHub Actions'tan dağıtım](../digstore/cli/deploy-from-github-actions.md) · [Zincir üzeri sabitleme → maliyet & güvenlik](../digstore/cli/onchain-anchoring.md#cost-and-safety)

## Hata kodları referansı {#error-codes-reference}

CLI çıkış kodları · RPC `-32xxx` · DIGHUb · dig-loader · SDK — tek bir birleştirilmiş tablo.

→ [Hata kodları](../support/error-codes.md)

## SSS {#faq}

Maliyet, ücretsiz deneme, fiyat neden tek tip, $DIG nereden alınır ve "bir testnet var mı?".

→ [SSS](../support/faq.md)

## Yardım alın {#get-help}

Discord + GitHub ve iyi bir rapor nasıl dosyalanır — **asla sır yapıştırmayın**.

→ [Yardım alın](../support/get-help.md)

## Durum & değişiklik günlüğü {#status--changelog}

→ [Durum](../support/status.md) · [Değişiklik günlüğü](../support/changelog.md)

---

## Daha derine inin: protokol {#go-deeper-the-protocol}

- **okuma & doğrulama hataları** → [Kanıtlar & güvenlik](../digstore/format/proofs-and-security.md) · [URN'ler & şifreleme](../digstore/format/urns-and-encryption.md)
- **RPC `-32xxx` kodları** → [dig RPC metotları](../rpc/methods.md) · [Uygunluk](../rpc/conformance.md)
- **Her şey** → [Protokol derinlemesine inceleme](../protocol-deep-dive.md) · [Kavramlar & sözlük](../concepts.md)
