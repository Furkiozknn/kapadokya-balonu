# Değişiklik günlüğü

## v2.1 · Kasım 2026

Oyunun adresi, kayıt anahtarları ve oynanış değişmedi; eski kayıtlarla olduğu gibi açılır.

### Düzeltmeler
- Telefonda (dar ekranda) üst çubuktaki yıldızlar ekranın dışına taşıyordu; "Yakıt" yazısı çok dar ekranda gizlenip boşluklar daraltıldı, yıldızlar sığıyor.
- Sayfa açıklaması İngilizceydi; Türkçeye çevrildi. Paylaşım kartına (Twitter/X) başlık, açıklama ve görsel eklendi.
- Tarayıcı sekmesi için simge ve `theme-color` eklendi; yoktu.
- Var olmayan bir adres artık oyunun kendi 404 sayfasını gösteriyor (oyuna ve diğer oyunlara dönüş bağlantılarıyla).
- Ana menüdeki küçük bağlantıların dokunma alanı 44 px'e çıkarıldı.

### Yenilikler
- **Pilot Karnesi:** 12 uçuşun her biri için yıldız, en iyi skor, en kısa süre ve kalan yakıt tek tabloda; üstte toplam yıldız, biten uçuş, günlük en iyi ve defter notu sayısı. Veriler yereldir.
- **Başarımlar (10 adet):** ilk iniş, üç yıldız, üç bölge turu, vadinin pilotu, kusursuz sezon, tasarruflu pilot, günün pilotu, vadi bilgini. Kayıtlı ilerlemeden hesaplanır; eski kayıtların açtıkları ilk açılışta sessizce işlenir, yenileri iniş sonrası bildirimle görünür.
- **Yenilikler penceresi ve sürüm etiketi:** ana menüde "v2.1 · Kasım 2026" ve "Yenilikler" düğmesi.
- **Diğer oyunlar** bağlantısı ana menüde (https://furkiozknn.github.io/).

### Teknik
- Kayıt şeması geriye uyumlu genişledi: `best[i].bt` (en kısa süre) ve `ach` (açılan başarımlar) isteğe bağlı alanlardır.
- `tools/duman.mjs`: bağımlılıksız duman testi (sayfa açılışı, konsol hatası, oyun başlangıcı, etkileşim, telefonda taşma, yeni pencereler).
