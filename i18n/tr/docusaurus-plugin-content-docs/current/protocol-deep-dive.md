---
sidebar_position: 1
title: "Protokol: Genel Bakış"
description: "Normatif ve uygulamaya bağlı olarak yedi alttan üste katman şeklinde DIG Protokolü. capsule (storeId:rootHash) temel birimdir; host kördür ve okuyucu zincire karşı doğrular. Bu, yetkili protokol referansıdır."
keywords:
  - DIG protocol
  - seven-layer model
  - capsule
  - blind host
  - client-side verification
  - implementation source of truth
tags:
  - capsule
  - dig-rpc
  - chia-protocol
  - merkle-proof
  - anchoring
---

# Protokol: Genel Bakış {#protocol-overview}

Bu, DIG Protokolünün **normatif şartnamesidir**, alttan üste **yedi katman** olarak tanımlanmıştır. Her katman, normatif referans olarak kendi **kanonik crate/dosyasını** adlandırır.

:::info Bu, yetkili protokol referansıdır
Bu bölüm, ağın ne yaptığının kaynağıdır. Protokolü, kanonik uygulamaya `dosya:satır` alıntılarıyla fiilen çalıştığı şekliyle belgeler.
:::

## Temel birim: capsule {#the-fundamental-unit-the-capsule}

Her katmanda geçen bir kavram var: **[capsule](./concepts.md#capsule)** = `(store_id, root_hash)`, kanonik olarak `storeId:rootHash`. Bir **store**, capsule'lerin sıralı bir dizisidir (eskiden yeniye), her commit için bir tane; kimliği `store_id`, Chia üzerinde bir CHIP-0035 DataLayer singleton başlatıcı (launcher) id'sinin *ta kendisidir*. Kimlik, derleme, fiyatlandırma, alma, önbellekleme ve köken kanıtının hepsi **capsule başına** tanımlanır.

## Tez: kör host, istemci tarafında doğrulama, zincire sabitlenmiş kök {#the-thesis-blind-host-client-side-verify-chain-anchored-root}

- **Kör host.** Bir host yalnızca karmalarla anahtarlanmış opak şifreli metin tutar. Ne URN ne de anahtar tutar, capsule'ün kendi çıktısını olduğu gibi aktarır ve bir isabeti bir kaçırmadan ayırt edemez. Tel üzerinde bir `decoy` alanı ve bir CDN yoktur — içerik yalnızca [dig RPC](./protocol/dig-rpc.md) üzerinden sunulur.
- **İstemci tarafında doğrulama.** Her bayt, okuyucunun cihazında, kaynak-başına bir merkle dahil etme kanıtıyla zincir üzeri bir köke karşı kontrol edilir, ardından kimlik doğrulamalı olarak şifresi çözülür. Güven asla sunum kaynağına dayanmaz.
- **Zincire sabitlenmiş kök.** Güvenilen kök **yalnızca** Chia üzerindeki CHIP-0035 singleton'ından gelir (coinset.org üzerinden çözülür), asla sunulan "en son"dan değil.

## Yedi katman {#the-seven-layers}

| # | Katman | Tanımladığı şey | Kanonik referans |
|---|---|---|---|
| 0 | [Kimlik & adlandırma](./protocol/identity-and-naming.md) | store, capsule, generation; `store_id` = başlatıcı id | `digstore-core::capsule`, `::urn` |
| 0 | [URN & adresleme](./protocol/urn-and-addressing.md) | `urn:dig:chia:…` grameri; köksüz `retrieval_key` | `digstore-core::urn`, `lib.rs` |
| 1 | [Kriptografi](./protocol/cryptography.md) | HKDF KDF; AES-256-GCM-SIV mühürleme | `digstore-core::crypto` |
| 1 | [Merkle dahil etme kanıtları](./protocol/merkle-proofs.md) | D5 kaynak-başına yaprak; NODE_TAG katlama | `digstore-core::merkle` |
| 1 | [BLS imzaları & DST'ler](./protocol/bls-signatures.md) | Chia AugScheme; beş rol DST'si | `digstore-crypto::bls` |
| 2 | [capsule formatı](./protocol/capsule-format.md) | DIGS veri bölümü (BINDING D1) | `digstore-core::datasection` |
| 2 | [Kendini savunan modül](./protocol/self-defending-module.md) | sabit boyutlu gizleme; sunum guest'i | `digstore-compiler`, `digstore-guest` |
| 4 | [Zincir üzeri sabitleme](./protocol/on-chain-anchoring.md) | store = singleton; capsule = kök-ilerletme | `chip35_dl_coin`, `digstore-chain` |
| 4 | [DIG CAT ödemesi & fiyatlandırma](./protocol/dig-cat-payment.md) | capsule başına, dinamik, USD-endeksli | `chip35_dl_coin::dig` |
| 6 | [dig RPC](./protocol/dig-rpc.md) | makine arayüzü (JSON-RPC 2.0) | hub `retrieval`, `dig-node` |
| 5 | [§21 aktarım & push](./protocol/transport-and-push.md) | `dig://` konumlandırıcı, REST, push v1 | `digstore-remote` |
| 7 | [DIG Node eş ağı](./protocol/peer-network.md) | mTLS eş kimliği, NAT geçişi, STUN, tanıtıcı (introducer), relay teli, eş RPC'si | `dig-gossip`, `dig-relay`, `dig-nat`, `dig-node` |
| 6 | [Doğrulama & köken kanıtı](./protocol/verification-and-provenance.md) | dört sıralı bütünlük geçidi | `digstore-core::merkle`, `dig-node` |
| 6 | [Kör host modeli](./protocol/blind-host-model.md) | sağlayıcı-körlüğü; çözücü; `/v1` kontrol düzlemi | hub `retrieval`/`resolver`/`api` |
| — | [Uygunluk & eşitlik](./protocol/conformance-and-parity.md) | çapraz-uygulama eşitlik disiplini | dondurulmuş goldenlar, OpenRPC diff'i |

(3. katman ve §21 aktarımı okuma yoluyla iç içe geçer; tablo bunları bir okuyucunun onlarla karşılaştığı yerde gruplar. Tam katman numaralandırması her sayfada verilmiştir.)

## Bir capsule katmanlardan nasıl akar {#how-a-capsule-flows-through-the-layers}

Bir yayıncı içeriği **parçalar + şifreler** (K1) bir **capsule formatına** (K2) dönüştürür, bu da **kendini sunar** (K3), zincir üzerinde **sabitlenir** (K4) ve §21 aktarımı üzerinden **push edilir** (K5). Herhangi bir istemci, onu dig RPC üzerinden **okur** ve tamamen istemci tarafında zincire sabitlenmiş köke karşı **doğrular** (K6). Her kriptografik sabit, üretici, host ve doğrulayıcı arasında paylaşılan **tek** bir tanıma sahiptir — [C8 eşitlik değişmezi](./protocol/conformance-and-parity.md).

## Terminoloji {#terminology}

- **`chia://`** — ağın **içerik** adresi (bir tarayıcının açtığı şey).
- **`dig://`** — §21 **aktarım** konumlandırıcısı (CLI/eş düzlemi) *ve* DIG Browser'ın dahili sayfa şeması — iki ayrı kullanım, asla içerik adresi değil.
- **`urn:dig:`** — her ikisinin de türediği URN ad alanı.
- **store / capsule** — kimlik ve onun değişmez generation'ı.
- **$DIG** — capsule başına ödenen CAT; **dig-store** — store formatı.

## İlgili {#related}

- [Kavramlar & sözlük](./concepts.md) — bir kez tanımlanan her varlık
- [Kimlik & adlandırma](./protocol/identity-and-naming.md) — şartnamenin başladığı Katman 0
- [dig RPC](./protocol/dig-rpc.md) — protokolün makine arayüzü
- [DIG Node eş ağı](./protocol/peer-network.md) — düğümlerin birbirini nasıl bulup ulaştığı (mTLS, NAT geçişi, relay)
- [Uygunluk & eşitlik](./protocol/conformance-and-parity.md) — çapraz-uygulama eşitlik disiplini
