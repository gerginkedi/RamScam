# RamScam

**run** - kullanıcıcı çiplerini almak için RAM miktarını girdiği andan batana kadar olan sürece bir "run" denir.

Kullanıcı sisteme mail ve şifresi ile girer. Şifre kodlanmış (hashed) şekilde tutulacak, isteğe bağlı olarak mail de kodlanmış şekilde saklanabilir.

### Başlangıç ve Mekanik
Kullanıcı sisteme girdiğinde toplam RAM miktarını girmesi istenecek. Daha sonra bu oyun için feda etmek istediği (chip olarak kullanacağı) RAM miktarını girecek. Kullanıcının çip olarak kullanacağı RAM miktarını anında bir JavaScript scripti ile bellekte dolduracak bir program olacak; bu sayede kullanıcının hile yapıp yapmadığı kontrol edilecek.

### Oyun ve İstatistikler
Ana menüde oynanabilecek oyunlar görülecek. Herhangi birine girildiğinde oyun kısaca anlatılıp başlanacak.
* **İstatistik Takibi:** Kullanıcı hesabı ilk açıldığında 0 olan statlar, oynanan oyuna göre artacak (Örn: 10 kere Coin Flip oynandıysa CF sütunu 10 olacak).
* **Winrate:** Her oyun için galibiyet oranı tutulacak (Örn: 20 el Blackjack, 12 galibiyet = 12/20 winrate).
* **MMR Sistemi:** Kazanılacak para sabit olmayacak. Winrate ne kadar yüksekse kazanç o kadar artacak (LoL MMR sistemine benzer). Bu MMR, oyuncu battığında (run sonunda) sıfırlanacak.
* **Rogue-like Deneyimi:** Kazanılan paralarla özel yetenekli eşyalar satın alınabilecek.

### Teknik Detaylar
Esnekliği ve eğlenceyi artırmak için her run bir **seed** değerine sahip olacak.

#### Veritabanında Tutulacak Global Değerler:
* Mail ve Şifre
* Oyun bazlı istatistikler (A, B, C oyunları için):
    * Oynanma sayısı
    * Kazanma/Kaybetme sayısı
    * Beraberlik (0 kazanç) sayısı

#### Run Bazlı İşlemler:
* Oyuna girildiği anda ilgili oyunun oynanma sayısı 1 artacak.
* Sonuca göre (kazanç/kayıp) veritabanındaki kullanıcı statları güncellenecek.
* Sitenin hızı ve mobil uyumluluğu için sürekli değişen veriler browser tarafında (client-side) tutulacak, böylece frontend geliştiricisi zorlanmayacak.

---

### Gorseller
![wow](Images\292578.jpg)
![floppa](Images\floppa.jpg)
![tool](Images\292578.jpg)

### Database Diagram
![Database diagram](Images\DbScheme.png)


