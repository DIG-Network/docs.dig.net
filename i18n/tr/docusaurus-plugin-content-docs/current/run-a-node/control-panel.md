---
sidebar_position: 8
title: dig-node Kontrol Paneli
description: "DIG Chrome extension'ın Kontrol Paneli'nden yerel dig-node'unuzu yönetin: ayrılmış .dig önbellek alanı ve LRU tahliyesi, üst kaynak, barındırılan depolar, senkronizasyon, eşler, canlı durum ve kontrol jetonu eşleştirmesi."
keywords:
  - dig-node kontrol paneli
  - dig önbelleği
  - LRU tahliyesi
  - ayrılmış önbellek alanı
  - kontrol jetonu eşleştirmesi
  - barındırılan depolar
  - düğüm senkronizasyonu
  - düğüm eşleri
tags:
  - dig-node
  - browser
  - dig-rpc
---

# dig-node Kontrol Paneli

DIG Chrome extension, yerel dig-node'unuz için bir **Kontrol Paneli** içerir. Buradan düğümün canlı durumunu görebilir, önbelleğe alınan içerik için ne kadar disk alanı ayıracağınıza karar verebilir ve — tek seferlik bir eşleştirme adımından sonra — düğümün üst kaynağını, barındırdığı depoları, senkronizasyonunu ve eşlerini yönetebilirsiniz. Günlük kullanım için komut satırına gerek yoktur.

Kontrol Paneli, DIG Browser'ın düğüm yönetimi ekranının uzantı içine gömülmüş karşılığıdır: kendi makinenizde çalışan düğümle konuşur, bu yüzden her şey yerel kalır.

## Açma

1. Uzantıyı açın.
2. **Network** (Ağ) sekmesine gidin ve **Control**'ü (Kontrol) seçin. (Kompakt açılır pencere yalnızca bir özet gösterir; her bölümü tam ekran görmek için **Kontrol panelini aç**'ı kullanın.)

Panel, düğümü otomatik olarak algılar:

- **Düğüm çalışıyor** → yönetim görünümünü görürsünüz.
- **Düğüm bulunamadı** → nasıl bir tane kurulacağını anlatan kısa bir sayfa görürsünüz. Tarama yine de normal şekilde çalışır — içerik okumaları genel ağa geri döner; bir düğüm yalnızca aşağıdaki yönetim görünümü için gereklidir.

## Canlı durum

Üstte, canlı bir gösterge düğümünüzün **Bağlı**, **Bağlanıyor** veya **Bağlantısı Kesik** olup olmadığını, adresi ve sürümüyle birlikte gösterir. Kendiliğinden güncellenir — düğümü başlatın veya durdurun, gösterge birkaç saniye içinde değişir; paneli yeniden açmanıza veya sayfayı yenilemenize gerek kalmaz.

## Önbelleğe alınan içerik için disk alanı ayırma (önbellek ve LRU)

Düğümünüz, getirdiği içeriğin yerel bir önbelleğini tutar; böylece tekrar ziyaretler anında gerçekleşir ve siz de o içeriğin sunulmasına yardımcı olursunuz. Önbelleğin **ayrılmış bir boyutu** vardır — kullanabileceği disk alanının üst sınırı. Önbellek bu sınırı aştığında, düğüm otomatik olarak önce **en uzun süredir kullanılmayan** öğeleri kaldırır ("LRU" politikası); böylece ayırdığınız alan hiçbir zaman aşılmaz ve gerçekten kullandığınız içerik önbellekte kalmaya devam eder.

Bu bölüm hemen kullanılabilir — eşleştirme gerektirmez.

**Ne kadar kullanıldığını görün.** Bir çubuk, kullanılan alanı ayrılmış üst sınıra göre gösterir; ayrıca birkaç canlı rakam da sunar: önbellekte kaç öğe olduğu, toplam boyutları, düğüm başladığından beri ne kadarının tahliye edildiği ve önbellek isabet/ıskalama sayıları.

**Ayrılmış üst sınırı belirleyin.** Yeni bir boyut girip uygulayın. Minimum **64 MiB**'dir; daha küçük bir değer bu tabana yükseltilir. Üst sınırı mevcut kullanımın altına düşürmek, kullanım sığana kadar en eski öğelerin tahliyesini tetikler.

**Önbellekteki öğeleri inceleyin ve kaldırın.** Önbellek listesi her öğeyi boyutu, en son ne zaman kullanıldığı ve **tahliye sırası** (`0` konumu bir sonraki kaldırılacak öğedir) ile birlikte gösterir. Şunları yapabilirsiniz:

- **Tek bir öğeyi tahliye et** — şimdi tek bir önbellek öğesini kaldırın.
- **Tümünü temizle** — önbelleği tamamen boşaltın.

Öğeleri kaldırmak yalnızca yerel disk alanını serbest bırakır; yeniden ziyaret ettiğiniz her şey basitçe yeniden getirilir.

:::tip
Sık tarama yaptığınız bir makinede önbelleğe elinizden geldiğince fazla alan verin — daha büyük bir ayırma, daha az yeniden getirme ve yerel olarak sunulan daha fazla içerik anlamına gelir. Alanı kısıtlı bir makinede daha küçük bir ayırma belirleyin; LRU en yararlı öğeleri tutar ve geri kalanını atar.
:::

## Düğümü yönetme (eşleştirme gerekir)

Kalan bölümler düğümün yapılandırmasını değiştirir, bu yüzden açık izninizi gerektirir. Uzantı tarayıcının sandbox'ı içinde çalıştığından, düğümün yerel izin dosyasını doğrudan okuyamaz — bunun yerine bir kez **eşleştirme** yaparsınız. Eşleştirme, uzantıya kapsamı sınırlı ve iptal edilebilir kendi kimlik bilgisini verir; düğümün ana anahtarını asla açığa çıkarmaz ve yalnızca düğümü çalıştıran bilgisayardan onaylanabilir.

### Uzantıyı düğümünüzle eşleştirme

1. Kontrol Panelinde **Eşleştir**'i seçin. Uzantı bir **6 haneli kod** ve bir eşleştirme kimliği gösterir.
2. Düğümü çalıştıran bilgisayarda, bir terminalde, bekleyen istekleri listelemek için `dig-node pair` komutunu çalıştırın (veya doğrudan `dig-node pair approve <pairing-id>` komutunu çalıştırın).
3. Terminalde gösterilen kodun uzantıdaki kodla **eşleştiğini** doğrulayın, ardından onaylayın. Bu eşleşme sizin güvenceniz: onayladığınızın *tam olarak bu* uzantı olduğunu ve başka hiçbir şey olmadığını garanti eder.
4. Kontrol Paneli otomatik olarak eşleştirilmiş duruma geçer. Kimlik bilgisi yalnızca uzantı tarafından saklanır.

Eşleştirme kodunun **süresi birkaç dakika içinde dolar**; onaylamadan önce süresi dolarsa, yeni bir kod için tekrar **Eşleştir**'i seçin.

Kimlik bilgisini kullanmayı bırakmak için panelde **Eşleştirmeyi Kaldır**'ı seçin (bu, onu yalnızca yerel olarak unutur). Onu düğümün kendisinde iptal etmek için o bilgisayarda `dig-node pair revoke <token-id>` komutunu çalıştırın — panel, bir sonraki işleminde eşleştirilmemiş duruma döner.

:::note
Eşleştirme yalnızca aşağıdaki yönetim bölümleri için gereklidir. Yukarıdaki canlı durum ve önbellek/LRU kontrolleri onsuz da çalışır.
:::

### Üst kaynak

Düğümün içerik getirdiği üst kaynağı görüntüleyin ve farklı bir tane belirleyin. Değiştirilen bir üst kaynak, düğüm bir sonraki başlatıldığında etkili olur.

### Barındırılan depolar

Düğümünüzün tuttuğu ve sabitlediği depoları görün, yeni bir depoyu sabitleyin (böylece düğüm onu tutar ve sunar), birini sabitlemeyi kaldırın ve herhangi bir deponun durumunu kontrol edin. Belirli bir sürümü sabitlemek, sunulmaya hazır olması için onu önceden getirir.

### Senkronizasyon

Kimlik doğrulamalı, depo genelinde senkronizasyonun kullanılabilir olup olmadığını görün ve belirli bir sürüm için düğümün onu getirip önbelleğe almasını sağlayacak bir senkronizasyon başlatın.

### Eşler

Düğümünüzün eş ağı durumunu görün — bir ev yönlendiricisinin arkasında ulaşılabilirlik için rölesine bağlantısını ve bağlı olduğu eşleri.

## İlgili

- [Düğümünüzü yönetin](./manage.md) — `control.*` yönetici eylemleri ve tarayıcının bunları nasıl yürüttüğü
- [Bir tüketiciyi düğümünüze yönlendirin](./point-a-consumer.md) — uzantıyı, tarayıcıyı veya CLI'yi düğümünüzü kullanacak şekilde ayarlayın
- [dig-node'u yapılandırın](./configure.md) — portlar, önbellek üst sınırı ve üst kaynak
