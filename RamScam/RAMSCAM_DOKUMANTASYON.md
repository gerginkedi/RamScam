# RamScam UI & Gameplay Modernizasyon Dökümantasyonu

Bu döküman, RamScam platformuna eklenen yeni nesil arayüz geliştirmelerini, oyun mekaniklerini ve teknik detayları içermektedir.

---

## 1. Tasarım Sistemi (Design System)
Proje, eski turuncu temasından arındırılarak modern bir **Cyberpunk / Gaming Portal** estetiğine kavuşturulmuştur.

*   **Renk Paleti:**
    *   **Ana Renk:** Neon Cyan (`#00D2FF`)
    *   **Arka Plan:** Deep Space Navy (`#080A0F`)
    *   **Vurgular:** Glass Panel (Yarı şeffaf buzlu cam efekti).
*   **Tipografi:** `Outfit` ve `Exo 2` fontları standartlaştırılarak oyun içi okunabilirlik artırılmıştır.
*   **Glassmorphism:** Tüm paneller, modal ekranlar ve sidebar bileşenleri `backdrop-filter: blur(12px)` ile şeffaf ve derinlikli hale getirilmiştir.

---

## 2. RAM Tahsis Sistemi (Rogue-like Başlangıç)
Kullanıcılar oyuna başlamadan önce bir "Oturum Hazırlığı" ekranı ile karşılaşır.

*   **Mekanik:** Kullanıcı, oturum süresince kullanacağı RAM miktarını bir slider (sürgü) ile seçer.
*   **Maliyet:** Seçilen RAM miktarı arttıkça kullanıcıdan bir miktar "Chip" düşülür.
*   **Görsel:** RAM seçim ekranı, neon parlamalar ve anlık maliyet hesaplayıcısı içeren premium bir "Portal" arayüzü olarak tasarlanmıştır.

---

## 3. Şans Kartları (Artifact Sistemi)
RamScam'in en özgün "Rogue-like" mekaniği olan Şans Kartları, her oyun oturumu başında kullanıcıya stratejik avantajlar sunar.

*   **Seçim Ekranı:** RAM tahsisinden hemen sonra açılan, "Artifact Selection" ekranı ile kullanıcıya rastgele 3 şans kartı sunulur.
*   **Mekanik:** Her kartın kendine has bir pasif özelliği vardır (Örn: RAM tüketimini azaltma, kazanma şansını artırma, Chip ödüllerini katlama).
*   **Görsel:** Kartlar, parlayan kenar efektleri (neon borders) ve yüksek çözünürlüklü hologram ikonlar ile modern bir kutu açılışı (unboxing) havasında sunulur.

---

## 4. Taş Kağıt Makas Modernizasyonu
Klasik çocukluk oyunu, fütüristik bir strateji oyununa dönüştürüldü.

*   **Arayüz:** "Blackjack" oyununun yüksek kaliteli düzenine sadık kalınarak yeniden tasarlandı. Oyun alanı ekranın ortasında, devasa başlıklar ve cam paneller ile desteklenmiştir.
*   **Holografik Semboller:** Seçim butonları (Taş, Kağıt, Makas) artık düz metin değil, her biri kendi neon rengine ve holografik ikonuna sahip interaktif butonlardır.
*   **Animasyonlar:** Kazandığınızda veya kaybettiğinizdeki geri bildirimler, ekranın ortasında parlayan şık bildirim balonları (Toasts) ile modernize edilmiştir.

---

## 5. Yeni Oyun: "Kim Karamsar Olmak İster?"
Bu oyun, platformun en özgün ve atmosferik deneyimini sunar.

*   **Oyun Yapısı:** 10 adet felsefi ve zorlayıcı soru içerir.
*   **GPU Zorlama (Ekran Kartımı Kullan):** Soruların altında yer alan bu özel buton, kullanıcının "Ekran Kartını Zorlayarak" soruyu geçmesini / işlem yapmasını simüle eder.
*   **Dinamik Kararma:** Her GPU butonuna basıldığında tüm ekranın parlaklığı %10 oranında azalır. Üst barda bulunan "Parlaklık: %X" göstergesi ile anlık takip edilebilir.
*   **Overthink Modu:** 10. sorunun sonunda (veya her soruda GPU zorlandığında) site %100 karanlığa gömülür.
    *   **Görsel:** "ŞİMDİ OVERTHINK ZAMANI" yazısı belirir.
    *   **İşitsel:** Arka planda hüzünlü ve derin bir melodi (YouTube altyapılı) 70. saniyeden itibaren başlar.
    *   **Navigasyon:** Ekran karardığında ekrana herhangi bir yere tıklanması kullanıcıyı tekrar Ana Sayfaya döndürür.

---

## 4. Logo ve Varlık (Asset) Modernizasyonu
Eski ve düşük çözünürlüklü turuncu görseller, yapay zeka destekli yüksek kaliteli tasarımlarla değiştirilmiştir.

*   **Coinflip:** Neon parlayan fütüristik jeton tasarımı.
*   **Blackjack:** Şeffaf cam efektli holografik kart tasarımı.
*   **Taş Kağıt Makas:** Üç sembolün holografik birleşiminden oluşan yeni ikon.
*   **Kim Karamsar Olmak İster?:** Soru işaretli, parlayan bir beyin/kafa silüeti.

---

## 5. Teknik Geliştirmeler (Developer Notes)
*   **Global Filtreler:** Sitedeki tüm görsellerin (beyaz arka planlar dahil) otomatik olarak temayla uyumlu mavi tonlara çekilmesi için `hue-rotate` ve `invert` filtreleri optimize edilmiştir.
*   **Cache Management:** Görsel güncellemelerinin anında yansıması için `?v=2` sürüm etiketleri (query components) sisteme dahil edilmiştir.
*   **Event Sync:** Oyun içindeki parlaklık durumu gibi yerel state verileri, `CustomEvent` yapısı ile Global Header (Üst Bar) ile senkronize edilmiştir.


