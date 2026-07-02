---
sidebar_position: 3
title: Entegrasyon geliştiricileri için
description: "Tamamen makine tarafından okunabilir bir platform — OpenAPI/OpenRPC, kataloglanmış bir hata taksonomisi, canlı fiyatlandırma, JWKS, sayfa başına JSON ve tipli bir @dignetwork/dig-sdk — böylece tek bir satır insan düzyazısını bile taramadan uygulamanıza bir cüzdan + doğrulanmış okumalar bağlarsınız."
keywords:
  - dig-sdk
  - integrate DIG
  - dig RPC
  - window.chia
  - OpenRPC
  - error codes
tags:
  - dig-sdk
  - dig-rpc
  - window-chia
  - chip-0035
  - dighub
  - deploy-action
---

# Entegrasyon geliştiricileri için {#for-integration-developers}

> **Tamamen makine tarafından okunabilir bir platform** — OpenAPI/OpenRPC, kataloglanmış bir hata taksonomisi, canlı fiyatlandırma, JWKS, sayfa başına JSON ve tipli bir `@dignetwork/dig-sdk` — böylece **tek bir satır insan düzyazısını bile taramadan** uygulamanıza bir cüzdan + doğrulanmış okumalar bağlarsınız.

## Zihinsel model — ayrı tutulan iki yüzey {#the-mental-model--two-surfaces-kept-separate}

1. **Bir REST kontrol düzlemi** — `hub.dig.net/v1`, bearer-JWT — store'ları, alan adlarını, ekipleri ve NFT'leri yönetmek için.
2. **Düğümden bağımsız bir dig JSON-RPC 2.0 OKUMA yolu** — `rpc.dig.net` — **doğrulanmış şifreli metni** akıtan.

İki aktarım üzerinden ([CHIP-0002 `window.chia`](../concepts.md#window-chia)) tek bir **cüzdan** yüzeyi — enjekte edilmiş (DIG Browser) veya WalletConnect → Sage — SDK'nın `ChiaProvider`'ı tarafından birleştirilmiş. Harcamalar her zaman kanonik CHIP-0035 wasm'ı tarafından oluşturulur ve kullanıcının cüzdanı tarafından imzalanır — **asla elle yazılmaz**. **Kararlı hata kodlarında** dallanın, asla düzyazıda değil.

## Bir dapp inşa edin — uçtan uca {#build-a-dapp--end-to-end}

İskeleden kendi alan adınızda yayında cüzdan farkındalıklı bir uygulamaya giden tek iplik.

→ [Chia üzerinde bir dapp inşa edin](../build-a-dapp/tutorial.md)

## DIG SDK {#the-dig-sdk}

`@dignetwork/dig-sdk` — `ChiaProvider` + `DigClient` + `Paywall`, ve `/spend` alt yolunda yeniden dışa aktarılan kanonik harcamalar. Kurulum, alt yollar ve `capabilities()`.

→ [DIG SDK](../sdk.md)

## Bir cüzdan bağlayın — `window.chia` {#connect-a-wallet--windowchia}

Enjekte edilen sağlayıcıyı algılayın, `connect()`'i çağırın (köken-başına onay) ve CHIP-0002 metotlarını kullanın.

→ [window.chia kullanımı](../browser/using-window-chia.md) · şartname: [window.chia sağlayıcısı](../protocol/window-chia-provider.md)

## Doğrulanmış içerik okuyun — `DigClient` + dig RPC metotları {#read-verified-content--digclient--the-dig-rpc-methods}

`DigClient`, şifreli metin + dahil etme kanıtlarını akıtır ve istemci tarafında **doğrular-sonra-şifresini-çözer**. İhtiyaç duyduğunuzda metotları doğrudan çağırın.

→ [dig RPC nedir?](../rpc/what-is-the-dig-rpc.md) · [Metotlar](../rpc/methods.md)

## Akış (Streaming) & yeniden birleştirme {#streaming--reassembly}

Chunk modeli, [alma anahtarı](../concepts.md#retrieval-key) ve doğrula-sonra-şifresini-çöz sırası.

→ [Akış (Streaming)](../rpc/streaming.md)

## Harcama oluşturma — kanonik CHIP-0035 oluşturucusu {#building-spends--the-canonical-chip-0035-builder}

**oluştur → imzala → yayınla** ayrımı: wasm harcama demetini (spend bundle) oluşturur, cüzdan imzalar, siz yayınlarsınız. Hub asla bir harcamayı elle yazmaz, siz de yazmamalısınız.

→ [Harcamalar oluşturma](../spends.md)

## hub `/v1` kontrol düzlemi {#the-hub-v1-control-plane}

REST üzerinden kimlik doğrulama (JWT / OIDC / cihaz eşleştirme), store'lar, alan adları, analitik ve webhook'lar.

→ OpenAPI belgesi için [Makine tarafından okunabilir yüzeyler](../machine-surfaces.md#openapi).

## CI dağıtımı — `dig-network/deploy-action` {#ci-deploy--dig-networkdeploy-action}

Modlar, anahtarsız OIDC, sonuç enum'u ve aşağı akış adımları için `--json` çıktısı.

→ [GitHub Actions'tan dağıtım](../digstore/cli/deploy-from-github-actions.md)

## Makine tarafından okunabilir yüzeyler {#machine-readable-surfaces}

`/openapi.json`, `/openrpc.json`, `/error-codes.json`, `/llms.txt`, `/knowledge-graph.json` — düzyazıyı taramadan keşfedin ve entegre edin.

→ [Makine tarafından okunabilir yüzeyler](../machine-surfaces.md)

## Hata kodları — kodla dallanın {#error-codes--branch-on-the-code}

dig RPC, CLI, DIGHUb, dig yükleyicisi ve SDK genelinde birleştirilmiş tek bir referans.

→ [Hata kodları](../support/error-codes.md)

---

## Daha derine inin: protokol {#go-deeper-the-protocol}

- **"doğrulanmış okumalar"** → [dig RPC (Ağ İçerik Arayüzü)](../rpc/what-is-the-dig-rpc.md) · [Dahil etme ile yürütme kanıtları](../inclusion-vs-execution-proofs.md)
- **"window.chia"** → [normatif sağlayıcı şartnamesi](../protocol/window-chia-provider.md)
- **"retrieval_key & akış"** → [URN'ler & şifreleme](../digstore/format/urns-and-encryption.md#two-values-one-string) · [Akış (Streaming)](../rpc/streaming.md)
- **"bir dağıtım token'ı iptal edilebilir bir yazıcı anahtarıdır"** → [CHIP-0035 harcamaları & delegasyon](../chip-0035-spends-and-delegation.md)
- **Her şey** → [Protokol derinlemesine inceleme](../protocol-deep-dive.md) · [Kavramlar & sözlük](../concepts.md)
