---
sidebar_position: 1.5
title: Kavramlar & sözlük
description: "Temel DIG Network varlıklarının tek sayfalık dizini — capsule, store, generation, URN, alma anahtarı, dig RPC, chia:// protokolü ve zincir üzeri sabitleme — her biri bir kez tanımlanmış ve derinlemesine belgesine bağlanmış."
schema_type: DefinedTerm
keywords:
  - DIG Network glossary
  - capsule
  - store
  - generation
  - URN
  - retrieval key
  - dig RPC
  - chia protocol
  - on-chain anchoring
tags:
  - capsule
  - store
  - generation
  - urn
  - retrieval-key
  - dig-rpc
  - chia-protocol
  - window-chia
  - provider-spec
  - digstore-cli
  - dig-toml
  - create-dig-app
  - deploy-action
  - dig-sdk
  - anchoring
  - dig-payment
  - merkle-proof
  - chip-0035
---

# Kavramlar & sözlük {#concepts--glossary}

Bu sayfa, her temel DIG Network varlığını **bir kez**, sade bir dille tanımlar ve her birini derinlemesine giden
belgeye bağlar. Bu, dokümantasyonun insan tarafından okunabilir omurgasıdır — ve her terim aynı zamanda
makine tarafından okunabilir yapılandırılmış veri olarak da yayınlandığından, bir ajanın (agent) ağın
kelime dağarcığını öğrenmek için tarayabileceği haritadır. Yönelmek için göz atın; derine inmek için bir bağlantıyı izleyin.

## capsule {#capsule}

Bir **capsule**, tek bir değişmez store nesli (generation)'dir: `(storeId, rootHash)` çifti, kanonik olarak
`storeId:rootHash` şeklinde yazılır. Ağın atomik birimidir — derlemenin (tek sabit boyutlu WASM modülü),
[fiyatlandırmanın](./digstore/cli/onchain-anchoring.md) (mint veya commit için $DIG cinsinden ödenen capsule başına
tek tip bir fiyat), almanın (bir [URN](#urn) bir capsule'ü adlandırır), önbelleklemenin ve köken kanıtının. Bir
[store](#store) *capsule dizisidir* — her commit için bir tane. Bu tanım dig-store, dig RPC ve DIG
Browser genelinde aynıdır. → [capsule, tam olarak](./intro.md#the-capsule)

## Store {#store}

Bir **store**, bir kimlik artı içeriği ve geçmişidir: [capsule](#capsule)'lerin bir dizisi, her commit için
bir tane. Kimliği, 64 karakterlik onaltılık bir **store id**'dir; bu, zincir üzerindeki Chia singleton
başlatıcı (launcher) id'sinin *ta kendisidir* — zincir singleton'ı, store'un güncel kökü için otoritedir. Bir store, DIG'in
web sitesi karşılığıdır. → [Store yapısı](./digstore/format/store-structure.md)

## Generation {#generation}

Bir **generation**, bir [store](#store)'un tek bir commit edilmiş durumudur, bir **kök karma (root hash)** ile
tanımlanır (generation'ın kaynak-başına yapraklarının bir Merkle kökü). Her `commit`, mevcut içeriği yeni,
yalnızca-ekleme yapılabilen bir generation'a mühürler — [capsule](#capsule)'ün adlandırdığı aynı şeydir. Generation'lar
Git geçmişi gibi monoton olarak büyür. → [Generation'lar & kök karmalar](./digstore/format/store-structure.md#generations-and-root-hashes)

## URN {#urn}

Bir **URN**, dig-store'un adresi *ve* anahtarını tek bir dizede birleştirir:
`urn:dig:chia:<storeId>[:<rootHash>][/<resource>]`. Hem bir kaynağı **konumlandırır** hem de **şifresini çözecek
anahtarı türetir** — bir URN'e sahip olmak, genel bir kaynağı okumak için gerekli ve yeterlidir.
Tarayıcıya yönelik kısa yol [`chia://` protokolüdür](#chia-protocol). → [URN'ler & Şifreleme](./digstore/format/urns-and-encryption.md)

## Alma anahtarı (Retrieval key) {#retrieval-key}

**Alma anahtarı**, `SHA-256(canonical_urn)`'dir — istemciden ayrılan tek adrestir. Bir
kaynağın şifreli metnini, yolunu veya [URN](#urn)'ini ifşa etmeden konumlandırır. *Kökten
bağımsızdır*, bu yüzden aynı anahtar [generation](#generation)'lar genelinde bir kaynağı bulur; sunulan
baytlar ardından doğru köke karşı [Merkle ile doğrulanır](#merkle-proof). Ayrı
**şifre çözme anahtarı**, aynı URN'den yerel olarak (HKDF) türetilir ve asla gönderilmez. → [Tek dizede iki değer](./digstore/format/urns-and-encryption.md#two-values-one-string)

## Merkle kanıtı {#merkle-proof}

Her [generation](#generation), kaynak başına bir yaprak ile, sunulan tam *şifreli metin* baytlarına
bağlanan bir Merkle ağacı inşa eder. Sunulan bir kaynağa tek bir **dahil etme kanıtı (inclusion proof)** eşlik eder ve
bu baytların tam olarak o köke ait olduğunu kanıtlar — böylece içerik hiç şifresi çözülmeden doğrulanır,
ve bir düğüme asla gerçek baytları döndürdüğüne güvenilmez. → [Merkle kanıtları](./digstore/format/proofs-and-security.md)

## Zincir üzeri sabitleme (On-chain anchoring) {#anchoring}

Her store, Chia mainnet üzerinde bir **singleton**'dır. `dig-store init` bunu basar (başlatıcı id'si
store id *olur*) ve her `dig-store commit`, bir CHIP-0035 singleton güncellemesi olarak yeni bir
[generation](#generation) kökünü zincir üzerinde sabitler. İkisi de onaylanana kadar bloklar ve gerçek fon harcar. Zincir, bir
store'un en son kökü için otoritedir. → [Zincir üzeri sabitleme](./digstore/cli/onchain-anchoring.md)

## DIG ödemesi {#dig-payment}

**$DIG**, DIG Network token'ıdır (bir Chia CAT'i). Bir [capsule](#capsule) basmak (`init`) veya commit etmek,
sabitleme ile **aynı zincir üzeri harcamaya atomik olarak dahil edilen**, $DIG cinsinden **capsule başına tek tip bir
fiyata** mal olur — ayrı bir işlem yoktur ve memo store id'yi taşır. → [Maliyetler](./digstore/cli/onchain-anchoring.md#costs)

## dig-store CLI {#digstore-cli}

`dig-store`, store'ları oluşturan, commit eden, paylaşan ve okuyan komut satırı aracıdır — şifrelenmiş,
zincir üzeri store formatı üzerinde Git şekilli bir iş akışı (`init`, `add`, `commit`, `log`, `clone`, `push`, `pull`).
→ [Komut referansı](./digstore/cli/command-reference.md) · [CLI eğitimi](./digstore/cli/quickstart.md)

## dig.toml {#dig-toml}

`dig.toml`, bir projenin kökündeki **commit edilebilir proje manifestosudur** — `store-id`, `output-dir`,
`build-command` ve `dig-store dev`, `dig-store deploy` ile iskeleleme şablonları tarafından paylaşılan diğer proje
yapılandırması. **Hiçbir sır içermez** (bunlar ortamdan gelir), bu yüzden commit etmek güvenlidir.
→ [Proje yapılandırması & derleme zamanı değerleri](./digstore/cli/configuration.md)

## create-dig-app {#create-dig-app}

`create-dig-app` (`npm create dig-app`), bir DIG projesine başlamak için **JS ön kapısıdır**: beş
şablondan birinden (`static`, `vite-react`, `next-static`, `nft-drop`, `dapp-window-chia`) çalıştırılabilir bir
başlangıç projesi — bir uygulama, bir [`dig.toml`](#dig-toml) ve (cüzdan şablonları için) bağlanmış [DIG SDK](#dig-sdk) —
iskeleler. İskeleleme **ücretsizdir** — mint yok, zincir yok, harcama yok; yalnızca bir [capsule](#capsule) yayınladığınızda
tek tip capsule fiyatını ödersiniz. Rust CLI'ın `dig-store new`'inin npm tarafındaki eşdeğeridir.
→ [Bir uygulama iskeleleyin](./build-a-dapp/scaffold.md)

## GitHub dağıtım Action'ı {#deploy-action}

`dig-network/deploy-action`, **git-push-ile-dağıtım** GitHub Action'ıdır: runner üzerine
[`dig-store` CLI](#digstore-cli)'ı kurar, store'unuzu ilerletmek için `dig-store deploy` çalıştırır (asla
mint yapmaz) ve yayınlanan [capsule](#capsule) + URL'ler + maliyeti adım çıktıları, bir PR
yorumu, bir GitHub Deployment'ı ve bir commit durumu olarak geri bildirir. `if-changed` (varsayılan) ile, bayt-özdeş bir
build hiçbir işlem yapmaz — harcama yok. → [GitHub Actions'tan dağıtım](./digstore/cli/deploy-from-github-actions.md)

## DIG SDK {#dig-sdk}

**DIG SDK** (`@dignetwork/dig-sdk`), entegre eden geliştiriciler için tipli npm paketidir: bir
`ChiaProvider` (enjekte edilen [`window.chia`](#window-chia)'yı tercih eder, WalletConnect → Sage'e geri döner),
bir `DigClient` ([dig RPC](#dig-rpc) üzerinden doğrulanmış, şifrelenmiş içerik okur), bir `Paywall`
(sağlayıcıyı harcama oluşturucusuyla birleştiren yüksek seviyeli bir öde-ve-aç / NFT-korumalı-erişim yardımcısı)
ve `/spend` alt yolunda yeniden dışa aktarılan kanonik CHIP-0035 harcama oluşturucusu.
→ [Chia üzerinde bir dapp inşa edin](./build-a-dapp/tutorial.md)

## dig RPC {#dig-rpc}

**dig RPC**, ağ genelindeki okuma arayüzüdür: her barındırma düğümünün aynı şekilde konuştuğu, HTTPS
`POST` üzerinden bir JSON-RPC 2.0 hizmeti. [Alma anahtarına](#merkle-proof) göre şifreli metin + [dahil etme
kanıtları](#retrieval-key), `(storeId, root)` ile bütün [capsule](#capsule)'ler ve keşif
meta verilerini sunar — tasarım gereği kördür, istemci tarafında doğrulanır ve şifresi çözülür. **Bu, evrensel okuma
yoludur**: yayınlanan her capsule, zincir üzerinde onaylandığı anda burada [URN](#urn)'i / [`chia://`](#chia-protocol) adresiyle
okunabilir — kayıt yok ve capsule'ü yayınlamanın ötesinde ödeme yok. İsteğe bağlı, insan dostu
[`*.on.dig.net` handle'ı](#on-dig-net), bunun *üzerine* bir ön kapıdır; dig RPC'nin
kendisi her zaman kullanılabilirdir. → [dig RPC nedir?](./rpc/what-is-the-dig-rpc.md)

## chia:// protokolü {#chia-protocol}

`chia://`, DIG Browser'ın yerel içerik adresi şemasıdır — [`urn:dig:` URN](#urn)'in
yazılabilir ön yüzü. Bir `chia://<storeId>/` bağlantısı yapıştırın ve tarayıcı içeriği
doğrudan ağdan, içerik adresli ve kriptografik olarak doğrulanmış şekilde getirir. → [chia:// protokolü](./browser/chia-protocol.md)

## window.chia {#window-chia}

`window.chia`, **DIG Browser**'ın her sayfaya enjekte ettiği Chia cüzdan sağlayıcısıdır.
[CHIP-0002](https://github.com/Chia-Network/chips/blob/main/CHIPs/chip-0002.md)'yi konuşur, bu yüzden bir web
uygulaması WalletConnect kurulumu olmadan kullanıcının adresini, imzalarını ve harcamalarını talep edebilir — zaten
CHIP-0002 konuşan uygulamalar için doğrudan bir alternatif. → [window.chia kullanımı](./browser/using-window-chia.md)
· [window.chia sağlayıcı şartnamesi](./protocol/window-chia-provider.md) (normatif, sürümlenmiş)

## DIGHUb {#dighub}

**DIGHUb** ([hub.dig.net](https://hub.dig.net)), CLI olmadan [capsule](#capsule) yayınlamak ve yönetmek için
web uygulamasıdır — tarayıcıda bir capsule oluşturun, bir ön yüz dağıtın ve store'larınızı görüntüleyin.
Ayrıca pahalı ZK yürütme kanıtı işlerini bütçeleyen korumalı kontrol düzlemidir de.

## dig-node {#dig-node}

Bir **dig-node**, ağın içerik **sunucusudur** — arz tarafıdır. [capsule](#capsule)'leri barındırır, yerel bir
`.dig` önbelleği tutar ve `rpc.dig.net` ile aynı şekilde [dig RPC](#dig-rpc)'yi konuşur. DIG içeriğini okumak için
buna **ihtiyacınız yoktur** (tüketiciler `rpc.dig.net`'e geri döner); bir tane çalıştırmak okumaları yerel öncelikli yapar ve
sunum kapasitesine katkıda bulunur. Host **kördür** — yalnızca şifreli metin + kanıtları aktarır.
→ [Bir düğüm çalıştırın](./run-a-node/index.md)

## on.dig.net handle'ı {#on-dig-net}

Bir **on.dig.net handle'ı**, bir [store](#store) için *isteğe bağlı, ücretli* insan dostu bir web adresidir:
`<adınız>.on.dig.net`. Bir store bunu otomatik olarak **almaz** — handle'ı (bir [DIGHUb](#dighub)'da
ücretli CHIP-54 / `on.dig.net` kaydı) siz kaydedersiniz ve bu kayıt store'u o
isme sabitler. Kayıt olmaması, `*.on.dig.net` adresi olmaması anlamına gelir. Bu tamamen bir kolaylık ön kapısıdır:
store, bir handle olsun olmasın, zaten [dig RPC](#dig-rpc) üzerinden [URN](#urn)'i / [`chia://`](#chia-protocol) adresiyle
okunabilir durumdadır. (Hesap handle'ları ve store kısa adları (slug) ayrı ad alanlarıdır ve
otomatik olarak bir alt alan adı açığa çıkarmazlar.) → [Bir `*.on.dig.net` adresi alabilir miyim?](./support/faq.md#can-i-use-my-own-domain)

## İlgili {#related}

- [DIG Network genel bakış](./intro.md) — bir bakışta temel bileşenler
- [Hızlı başlangıç](./quickstart.md) — ücretsiz inşa edin ve önizleyin, sonunda bir capsule yayınlayın
- [Chia üzerinde bir dapp inşa edin](./build-a-dapp/tutorial.md) — tek bir yayınlanmış dapp'e dikilen her temel bileşen
- [dig-store nedir?](./digstore/what-is-digstore.md) — tek dosyalık store formatı
- [dig RPC nedir?](./rpc/what-is-the-dig-rpc.md) — ağ okuma yolu
- [chia:// protokolü](./browser/chia-protocol.md) — tarayıcıda içerik adresleme
- [Yardım alın](./support/get-help.md) — topluluk kanalları ve rapor nasıl verilir

## Ajanlar & LLM'ler için {#for-agents--llms}

Bu dokümantasyon makine tarafından çıkarılabilir. Her sayfa schema.org JSON-LD taşır (bu sayfa bir
`DefinedTerm` kümesi olarak) ve site kökünde iki özenle hazırlanmış harita bulunur:

- [`/llms.txt`](pathname:///llms.txt) — dokümantasyonun bağlantı zengini bir markdown haritası ([llms.txt kuralı](https://llmstxt.org/)).
- [`/knowledge-graph.json`](pathname:///knowledge-graph.json) — varlıklar (kavramlar + belgeler) ve tipli kenarlar (`defines`, `part-of`, `requires`, `see-also`).
