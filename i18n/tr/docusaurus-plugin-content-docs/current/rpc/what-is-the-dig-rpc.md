---
sidebar_position: 1
title: dig RPC nedir?
description: "DigStore capsule'leri için JSON-RPC 2.0 üzerinden ağ genelinde okuma arayüzü; tasarım gereği kör, güvenmeden doğrulanabilir ve her boyutta akıtılabilir."
keywords:
  - dig RPC
  - JSON-RPC 2.0
  - blind serving
  - capsule
  - retrieval key
  - inclusion proof
tags:
  - dig-rpc
  - capsule
  - retrieval-key
  - merkle-proof
  - streaming
  - store
  - chip-0035
---

# dig RPC nedir? {#what-is-the-dig-rpc}

:::info Normatif şartname
Bu, yönelim sayfasıdır. Yetkili makine arayüzü şartnamesi — metotlar, chunk tel (wire) nesnesi, düğüm profili ve OpenRPC belgeleri — [Protokol · dig RPC](../protocol/dig-rpc.md)'de bulunur.
:::

**dig RPC, barındırılan DigStore `.dig` capsule'lerinden doğrudan içerik okumak için ağ genelindeki arayüzdür.** HTTPS `POST` üzerinden konuşulan bir [JSON-RPC 2.0](https://www.jsonrpc.org/specification) hizmetidir.

capsule'leri barındıran her düğüm — `https://rpc.dig.net`'teki referans düğüm veya herhangi bir üçüncü taraf düğüm — **aynı semantiklere sahip aynı metotları** açığa çıkarır. Bu arayüze karşı yazılmış bir istemci, tek bir uç nokta üzerinden tüm ağdan okur. Bir CDN yoktur; DIG üzerindeki tüm içerik sunumu dig RPC aracılığıyladır.

Üç şeyi sunar:

| Elinizde… | Şunu çağırırsınız… | Şunu geri alırsınız… |
|---|---|---|
| Bir kaynağın **alma anahtarı** (`sha256(urn)`) | [`dig.getContent`](./methods.md#diggetcontent) / [`dig.getProof`](./methods.md#diggetproof) | Kaynağın şifreli metni + bir merkle dahil etme kanıtı (ve ZK yürütme kanıtı), parçalar halinde akıtılmış |
| Bir **store id + generation kökü** | [`dig.getCapsule`](./methods.md#diggetcapsule) | O generation için bütün `.dig` capsule'ü, parçalar halinde akıtılmış |
| Bir **store id** | [`dig.getManifest`](./methods.md#diggetmanifest) / [`dig.getMetadata`](./methods.md#diggetmetadata) / [`dig.listCapsules`](./methods.md#diglistcapsules) | Genel keşif manifestosu / store meta veri manifestosu / store'un onaylanmış generation listesi |

## Onu tanımlayan üç özellik {#three-properties-that-define-it}

- **Tasarım gereği kör.** Bir düğüm, bir karma ile anahtarlanmış opak şifreli metin sunar. Asla bir URN, bir şifre çözme anahtarı veya düz metin görmez. Isabet etmeyen bir istek, deterministik, ayırt edilemez bir **decoy (yem)** akışıyla yanıtlanır — asla bir `404` değil — böylece okuma yolu asla bir varlık kâhini (existence oracle) olmaz. Tüm şifre çözme ve tüm kanıt doğrulama istemcide gerçekleşir.
- **Güvenmeden doğrulanabilir.** Her gerçek bayt, zincir üzerindeki generation köküne dayanan bir merkle **dahil etme kanıtıyla** birlikte gelir. İstemci, kanıtı köke katlar ve yalnızca güvendiği bir kökle eşleşirse kabul eder. Düğüme asla gerçek baytları döndürdüğüne güvenilmez.
- **Her boyutta akıtılabilir.** İçerik, açık devam mekanizmasıyla sınırlı, 64 KiB hizalı parçalar (chunk) halinde okunur. Bir kilobaytlık bir kaynak ve yüz megabaytlık bir capsule aynı döngüyle okunur ve hiçbir tek yanıt sınırsız değildir.

## DigStore ile nasıl bir araya geliyor {#how-it-fits-with-digstore}

DigStore size **formatı** verir: URN'in *anahtarın kendisi olduğu* bir URN ile adreslenen, tek, kendini savunan bir `.wasm` capsule'e derlenen, içerik adresli, şifrelenmiş bir store. dig RPC, o capsule'ün host'a güvenmeden ağda nasıl **sunulduğudur**:

1. Bir store'u derler ve zincir üzerinde bir generation'ı sabitlersiniz (bir CHIP-0035 DataLayer singleton'ı). **İçerik kökü** güven çapasıdır.
2. Bir düğüm, capsule'ü barındırır ve onu dig RPC üzerinden açığa çıkarır.
3. Bir okuyucu `retrieval_key = sha256(urn)`'i türetir, `dig.getContent`'i çağırır, akıtılan şifreli metni yeniden birleştirir, **dahil etme kanıtını zincir üzeri köke karşı doğrular** ve **URN'den türetilmiş anahtarla şifresini çözer** — tamamen istemci tarafında.

Düğüm yalnızca bir karma öğrendi; asla ne sunduğunu öğrenmedi.

## Tek çağrıda bir okuma {#a-read-in-one-call}

```json
POST https://rpc.dig.net
Content-Type: application/json

{ "jsonrpc": "2.0", "id": 1, "method": "dig.getContent",
  "params": {
    "store_id": "5b1f…e9",
    "root": "latest",
    "retrieval_key": "9f23…c1"
  } }
```

```json
{ "jsonrpc": "2.0", "id": 1, "result": {
    "ciphertext": "<base64>",
    "total_length": 5242880,
    "offset": 0, "length": 3145728,
    "complete": false, "next_offset": 3145728,
    "inclusion_proof": "<base64>",
    "decoy": false,
    "root": "a07c…4d" } }
```

İstemci, `complete` olana kadar `next_offset` üzerinde döngü kurar, yeniden birleştirilmiş baytlar üzerinde `inclusion_proof`'u `root`'a karşı doğrular, ardından şifreyi çözer. `"decoy": true` olan bir sonuç *bulunamadı* demektir — durun ve bunu böyle raporlayın.

## Bu dokümanları nasıl okumalı {#how-to-read-these-docs}

- **[Metotlar](./methods.md)** — tam metot kümesi (`dig.getContent`, `dig.getProof`, `dig.getProofStatus`, `dig.getCapsule`, `dig.getManifest`, `dig.getMetadata`, `dig.listCapsules`, `dig.health`, `dig.methods`), parametreleri ve sonuçları.
- **[Genel ağ RPC'sini kullanma](./public-network-rpc.md)** — istemcinizi `rpc.dig.net`'e (veya herhangi bir düğüme) yönlendirin, uç noktalar ve kendiniz bir tane işletmek.
- **[Akış (Streaming)](./streaming.md)** — chunk modeli, yeniden birleştirme, kanıt doğrulama ve bir referans istemci döngüsü.
- **[Uygunluk](./conformance.md)** — bir düğümün ağ okuma yolunun üyesi olmak için UYGULAMASI GEREKENLER, artı CORS, hatalar ve kör model tam olarak.

:::note
dig RPC, [DIG Network](https://dig.net)'in bir parçasıdır. Tam normatif şartname [Protokol · dig RPC](../protocol/dig-rpc.md) bölümüdür, ağ içerik arayüzü.
:::

## İlgili {#related}

- [Metotlar](./methods.md) — her dig RPC metodu, parametreleri ve sonuçları
- [Akış (Streaming)](./streaming.md) — chunk modeli, yeniden birleştirme ve kanıt doğrulama
- [Uygunluk & Güvenlik](./conformance.md) — kör model ve bir düğümün uygulaması gerekenler
- [URN'ler & Şifreleme](../digstore/format/urns-and-encryption.md) — her alma anahtarının arkasındaki URN
- [Kavramlar & sözlük](../concepts.md) — dig RPC, capsule ve alma anahtarı tanımlanmış
