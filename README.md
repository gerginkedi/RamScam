# 🚀 RamScam (Geliştirilmiş Sürüm)

Bu proje, orijinal [gerginkedi/RamScam](https://github.com/gerginkedi/RamScam) projesinin üzerine yeni özellikler, optimizasyonlar ve geliştirmeler eklenerek oluşturulmuş güncel versiyonudur.

RamScam, sıradan bir şans oyunu platformu olmanın çok ötesinde, kullanıcıların "gerçek donanım kaynaklarını" (RAM) risk ederek oynadığı, rogue-like mekaniklerine sahip, yapay zeka destekli benzersiz bir web uygulamasıdır.

## ✨ Sonradan Eklenen Değişiklikler ve Yenilikler

*Orijinal projeye kıyasla bu sürümde aşağıdaki geliştirmeler yapılmıştır:*

- **🎮 Yeni oyun: Taş Kağıt Makas** — Blackjack ekranıyla aynı kalitede yeniden tasarlandı; holografik semboller, neon renkli interaktif butonlar ve kazanma/kaybetme anlarında beliren bildirim balonları (toast) eklendi.
- **🎮 Yepyeni oyun: "Kim Karamsar Olmak İster?"** — 10 felsefi soru, "Ekran Kartımı Kullan" butonuyla azalan ekran parlaklığı ve %100 karardığında açılan "Overthink Modu" (melodi + ana sayfaya dönüş) içeren atmosferik yeni bir oyun.
- **🃏 Rogue-like Artifact (Şans Kartı) sistemi eklendi** — Oturum başında RAM tahsis ekranı ve 3 rastgele Artifact arasından seçim yapılabiliyor (Soğuk Bellek, Hız Aşırtma, Hata Düzeltme, Güvenli Mod gibi pasif efektlerle).
- **🗄️ Veritabanı entegrasyonu genişletildi** — Yeni `Artifact` ve `Run` entity'leri, ilgili EF Core migration'ları (`AddArtifacts`, `AddRunsTable`) ve `/api/artifacts/*` endpoint'leri (`random`, `select`, `current`) eklendi.
- **🌱 Otomatik seed data** — Uygulama ilk açıldığında oyunlar (CoinFlip, BlackJack, RockPaperScissors) ve varsayılan Artifact'ler veritabanı boşsa otomatik olarak ekleniyor.
- **🎨 Kullanıcı arayüzü tamamen yenilendi** — Eski turuncu tema kaldırıldı, yerine Neon Cyan (`#00D2FF`) ağırlıklı, Deep Space Navy arka planlı bir Cyberpunk / Gaming Portal estetiği getirildi; tüm panellerde glassmorphism (`backdrop-filter: blur(12px)`) efekti kullanıldı.
- **🖼️ Görsel varlıklar güncellendi** — Tüm oyun logoları (Coinflip, Blackjack, Taş Kağıt Makas, Kim Karamsar Olmak İster) yapay zeka destekli yüksek çözünürlüklü tasarımlarla değiştirildi; global `hue-rotate`/`invert` filtreleriyle görseller temayla uyumlu hale getirildi.
- **⚙️ Performans ve kod yapısı düzenlendi** — İç içe geçmiş `RamScam/RamScam/*` klasör yapısı sadeleştirilerek tek seviyeye (`RamScam/*`) indirildi; `Dockerfile.backend` ve `docker-compose.yml` güncellendi.
- **📄 Teknik dokümantasyon eklendi** — Yapılan tüm UI/gameplay değişikliklerini anlatan ayrı bir `RAMSCAM_DOKUMANTASYON.md` dosyası oluşturuldu.

*(Kaynak: `proje-devir-alma` branch'indeki `5b46f55`, `90d3cbb` ve `27d77b1` commit'leri.)*

## 🛠️ Teknolojiler ve Mimari

* **Backend:** C#, .NET 10, ASP.NET Core Minimal API
* **Veritabanı & ORM:** Microsoft SQL Server, Entity Framework Core (EF Core)
* **Güvenlik:** JWT (JSON Web Token) ile oturum yönetimi, BCrypt ile şifreleme
* **Frontend:** Vite, React, JavaScript, HTML, CSS
* **Otomasyon:** n8n, Azure

## 📦 Kurulum ve Kullanım

Projeyi kendi bilgisayarında çalıştırmak için aşağıdaki adımları izleyebilirsin:

### 1. Bu repoyu bilgisayarına klonla:

> ⚠️ Sonradan eklenen tüm yenilikler `proje-devir-alma` branch'inde bulunuyor. Varsayılan (`main`) branch'i orijinal projeyle aynıdır, bu yüzden klonlarken branch'i mutlaka belirt:

```bash
git clone -b proje-devir-alma https://github.com/ZeyneepArslan/RamScam.git
```

### 2. Backend & Veritabanı Kurulumu

`RamScam.csproj` dosyasının bulunduğu klasörde sırasıyla komutları çalıştır:

```bash
dotnet build
dotnet ef database update
```

* ⚠️ **Önemli Not (Seed Data):** İlk kurulumda `dbo.Games` tablosuna ID = 1, 2, 3 olacak şekilde 3 oyun otomatik olarak eklenir (CoinFlip, BlackJack, RockPaperScissors). Manuel müdahale gerekmez.

Veritabanı hazırlandıktan sonra projeyi ayağa kaldır:

```bash
dotnet run
```

API varsayılan olarak `https://localhost:50793` (http için `http://localhost:50794`) portu üzerinde çalışmaya başlayacaktır.

### 3. Frontend Kurulumu

API arka planda çalışmaya devam ederken yeni bir terminal aç ve ön yüz dizinine geç:

```bash
cd frontend
npm install
npm run dev
```

Vite sunucusu varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

### 4. Docker ile Kurulum

```bash
docker-compose up --build
```

Ardından `http://localhost:3000` adresinden erişilebilir.

### 5. Dış Servisler (n8n Otomasyonu)

Kayıt olan kullanıcılara "Hoş Geldin" e-postası göndermek ve arayüzde rastgele Fun Fact göstermek için n8n otomasyonu kullanılır.

* **Hızlı test için:** n8n altyapısı bir Azure sunucusunda host edildiğinden ekstra kurulum gerekmez.
* **Yerel kurulum (opsiyonel):** Kendi n8n konteynerini Docker ile ayağa kaldırıp `appsettings.json` içindeki Webhook URL'ini `localhost:5678` ile güncelleyebilirsin.

## 👨‍💻 Geliştirici Ekip
Bu proje Sinop Üniversitesi Bilgisayar Mühendisliği öğrencileri tarafından geliştirilmiştir:

 ilk sürüm:Ömer,Süleyman,Erdem tarafından geliştirilmiş.
 ikinci sürüm:Zeynep Sude Arslan,Şevval Uyar tarafından geliştirilmiştir.

