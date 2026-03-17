# MIGRON

**Avustralya göçmenlik hukuku ve danışmanlık platformu.**
Hukuki veriyi teknolojiyle birleştiren radikal göçmenlik platformu.

---

## İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Klasör Yapısı](#klasör-yapısı)
- [Kurulum](#kurulum)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Sayfalar ve Rotalar](#sayfalar-ve-rotalar)
- [Bileşenler](#bileşenler)
- [API Rotaları](#api-rotaları)
- [Firebase Koleksiyonları](#firebase-koleksiyonları)
- [Çok Dil Desteği](#çok-dil-desteği)
- [Admin Paneli](#admin-paneli)
- [Tasarım Sistemi](#tasarım-sistemi)
- [Dağıtım (Vercel)](#dağıtım-vercel)

---

## Proje Hakkında

MIGRON, Avustralya'ya göçü düşünen Türkçe konuşan kullanıcılar için geliştirilmiş bir dijital platformdur. Platform şunları sunar:

- Avustralya vize programları ve göçmenlik hukuku rehberliği
- Groq LLM (llama-3.3-70b) destekli yapay zeka hukuk asistanı
- Canlı Avustralya haberleri (ABC News, The Guardian, SBS)
- Gerçek zamanlı döviz kurları (AUD → TRY / USD / EUR)
- İnteraktif Avustralya haritası (7 şehir, kira/maaş verileri)
- Becerili göçmen puan hesaplayıcısı
- Vize kontrol listesi
- Firebase CMS ile yönetilebilir içerik

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 19.2.0 |
| Build | Vite 7.3.1 |
| Stil | Tailwind CSS 4.2.1 (`@tailwindcss/vite`) |
| Routing | React Router DOM 7.13.1 |
| Backend | Vercel Serverless Functions (Node.js) |
| Veritabanı | Firebase Firestore |
| Auth | Firebase Authentication |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Döviz | Frankfurter API (ücretsiz) |
| Kripto / Metaller | CoinGecko API + Gold-API |
| Haberler | RSS (ABC News, The Guardian, SBS) |
| İkonlar | Lucide React 0.575.0 |
| Markdown | react-markdown + remark-gfm |

---

## Klasör Yapısı

```
migron/
├── api/                        # Vercel Serverless Functions
│   ├── chat.js                 # Groq AI chat endpoint
│   ├── australia-news.js       # RSS haber aggregatörü
│
├── src/
│   ├── components/
│   │   ├── home/               # Ana sayfa bileşenleri
│   │   │   ├── HeroSlider.jsx
│   │   │   ├── LiveTicker.jsx
│   │   │   ├── AustraliaNewsSlider.jsx
│   │   │   ├── BentoGrid.jsx
│   │   │   │   │   ├── AustraliaMap.jsx
│   │   │   └── CurrencyWidget.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── SubPage.jsx
│   │   │   ├── ArticlePage.jsx
│   │   │   ├── SSSPage.jsx
│   │   │   ├── ProgramTurleriPage.jsx
│   │   │   ├── PointsCalculatorPage.jsx
│   │   │   └── VisaChecklistPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ArticleEditor.jsx
│   │   │   ├── FAQEditor.jsx
│   │   │   ├── ProgramEditor.jsx
│   │   │   ├── SliderEditor.jsx
│   │   │   └── BentoEditor.jsx
│   │   ├── chat/
│   │   │   └── AiTerminal.jsx
│   │   └── seo/
│   │       └── SEOHead.jsx
│   ├── config/
│   │   ├── firebase.js         # Firebase bağlantı yapılandırması
│   │   └── constants.js        # Site geneli sabitler
│   ├── i18n/
│   │   └── LanguageContext.jsx # TR/EN dil sistemi (React Context)
│   ├── data/
│   │   └── content.js          # Firebase fallback statik veriler
│   ├── App.jsx                 # Root bileşen, rotalar
│   ├── main.jsx
│   └── index.css               # Tailwind import
│
├── public/
├── .env                        # Ortam değişkenleri (git'e eklenmemeli)
├── .env.example
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (Vercel CLI ile API'lar dahil)
npx vercel dev

# Sadece frontend (API'lar olmadan)
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

> **Not:** API route'larını lokal test etmek için `vercel dev` komutunu kullanın. `npm run dev` ile sadece frontend çalışır, `/api/*` endpoint'lerine erişilemez.

---

## Ortam Değişkenleri

`.env.example` dosyasını kopyalayarak `.env` oluşturun:

```bash
cp .env.example .env
```

| Değişken | Açıklama | Gerekli |
|----------|----------|---------|
| `GROQ_API_KEY` | Groq API anahtarı (sunucu tarafı, `/api/chat.js`) | Evet |
| `VITE_GROQ_API_KEY` | Aynı anahtar, geliştirme fallback'i için (istemci) | Hayır |

> **Güvenlik:** `GROQ_API_KEY` yalnızca sunucu tarafında kullanılmalıdır. `VITE_` prefix'li değişkenler production build'e dahil olur; production'da bu değişkeni tanımlamayın.

---

## Sayfalar ve Rotalar

| Rota | Bileşen | Açıklama |
|------|---------|----------|
| `/` | `HomePage` | Ana sayfa — tüm home bileşenleri |
| `/hukuk` | `SubPage` | Hukuk kategorisi makaleleri |
| `/egitim` | `SubPage` | Eğitim kategorisi makaleleri |
| `/sosyal` | `SubPage` | Sosyal yaşam makaleleri |
| `/program-turleri` | `ProgramTurleriPage` | 8 vize programı |
| `/sss` | `SSSPage` | Sıkça sorulan sorular |
| `/puan-hesapla` | `PointsCalculatorPage` | Becerili göçmen puan hesaplayıcısı |
| `/vize-kontrol-listesi` | `VisaChecklistPage` | Vize başvuru kontrol listesi |
| `/iletisim` | `SubPage` | İletişim sayfası |
| `/makale/:slug` | `ArticlePage` | Tekil makale görünümü |
| `/admin` | `AdminPage` | CMS admin paneli (auth korumalı) |

---

## Bileşenler

### Ana Sayfa Bileşenleri (`src/components/home/`)

#### HeroSlider
- Firebase `sliders` koleksiyonundan içerik çeker (fallback: statik veri)
- 3 slayt, 6 saniyede bir otomatik geçiş
- Tag badge'leri, başlık, açıklama, CTA butonu
- Elle ileri/geri navigasyon

#### LiveTicker
- Yatay kayan yaşam maliyeti bantı
- 15 veri kalemi: kira (4 şehir), market, benzin, ulaşım, yemek, faturalar, asgari ücret, maaş, kahve, bira, gym, üniversite
- Gerçek zamanlı döviz kurları (Frankfurter API, 30 dk'da bir yenilenir)
- Bitcoin, Ethereum, Solana fiyatları (CoinGecko)
- Altın ve gümüş fiyatları (Gold-API)
- Hover'da durur, sekme gizlenince duraklar
- Kaynak: ABS + Numbeo

#### AustraliaNewsSlider
- 3 sütunlu haber kartı carousel'i (mobilde 1)
- `/api/australia-news` endpoint'inden veri çeker
- Kaynaklar: ABC News (turuncu), The Guardian (mavi), SBS (mor)
- Saatte bir otomatik yenileme, 6 saniyede bir slayt geçişi
- CSS `@keyframes` progress bar animasyonu
- Karta tıklama → `window.open` ile yeni sekmede açılır
- Hata ve boş durum yönetimi

#### BentoGrid
- Masonry-stil kart gridi (1–4 sütun)
- 2 statik kart: Risk Analizi, Avustralya İstatistikleri
- Firestore'dan dinamik makale kartları (en fazla 20)
- Kategori renkleri: hukuk (lime), eğitim (cyan), sosyal (kırmızı), program-turleri (mor)

#### AustraliaMap
- Etkileşimli SVG Avustralya haritası
- 7 şehir: Darwin, Perth, Adelaide, Melbourne, Canberra, Sydney, Brisbane
- Her şehir için: nüfus, ortalama kira, ortalama maaş, yaşam maliyeti endeksi, iklim, top 5 meslek
- Tıklama ile modal popup

#### CurrencyWidget
- Sol kenarda sabit sidebar (mobilde gizli)
- AUD → TRY, USD, EUR anlık kurlar
- Yükselen/düşen trend okları (yeşil/kırmızı)
- Frankfurter API, 30 dk'da bir güncellenir

### Layout (`src/components/layout/`)

#### Navbar
- Sayfa üstüne sabitlenmiş, blur arka plan
- Logo (migron.webp)
- 7 navigasyon öğesi
- "Araçlar" dropdown menüsü (Puan Hesaplayıcı, Vize Kontrol Listesi)
- TR/EN dil değiştirici
- Mobil hamburger menü, rota değişiminde kapanır

#### Footer
- 8px lime üst kenarlık
- 3 sütun: logo + tagline, site linkleri, araçlar + iletişim
- Slogan: "STAY RADICAL / STAY LEGAL"

### Yapay Zeka Sohbet (`src/components/chat/`)

#### AiTerminal
- Sağ altta yüzen chat widget (360×520px)
- Model: Groq `llama-3.3-70b-versatile`
- Sistem rolü: Türkçe Avustralya göçmenlik hukuku uzmanı
- Çift fallback: önce `/api/chat`, sonra doğrudan Groq API (geliştirme modu)
- Enter ile gönder, Shift+Enter ile yeni satır
- Otomatik scroll, mesaj geçmişi

### SEO (`src/components/seo/`)

#### SEOHead
- `document.title` dinamik güncelleme
- Meta etiketleri: description, Open Graph (og:title/description/url/image/type/locale), Twitter Card
- Canonical URL oluşturma: `https://migron.mtive.tech`
- DOM çıktısı yok (null döndürür)

---

## API Rotaları

Tüm API route'ları `api/` klasöründe Vercel Serverless Function olarak çalışır.

### `POST /api/chat`

Groq AI ile sohbet endpoint'i.

**İstek:**
```json
{ "message": "string (max 500 karakter)" }
```

**Yanıt:**
```json
{ "text": "AI yanıtı..." }
```

- Model: `llama-3.3-70b-versatile`
- Temperature: 0.7 | Max Tokens: 800
- Sistem prompt: Türkçe Avustralya göçmenlik hukuku uzmanı

---

### `GET /api/australia-news`

Avustralya haber RSS feed'lerini server-side çeker ve parse eder.

**Yanıt:**
```json
{
  "articles": [...],
  "fetchedAt": "ISO timestamp",
  "count": 15
}
```

- Cache: `s-maxage=3600, stale-while-revalidate=600`
- Kaynaklar: ABC News, The Guardian Australia, SBS News
- XML/CDATA parse (harici paket kullanılmaz)
- Görsel çıkarma: `media:thumbnail`, `media:content`, `<enclosure>`, `<img>`
- En yeni 15 makale döndürülür

---

## Firebase Koleksiyonları

Firebase projesi: `migron-32348`

| Koleksiyon | İçerik | Alan Adları |
|------------|--------|-------------|
| `articles` | Makaleler | title, slug, content (markdown), category, status, createdAt |
| `faqItems` | SSS soruları | category, question, answer, order |
| `programs` | Vize programları | title, subtitle, description, requirements, processingTime, prDirect |
| `sliders` | Hero slaytları | title, tags, description, imageUrl, order |
| `bentoCards` | Bento kart içerikleri | id, fields (değişken) |

### Vize Programları

| Vize | Ad |
|------|----|
| 189 | Skilled Independent |
| 190 | Skilled Nominated |
| 482 | Temporary Skill Shortage |
| 186 | Employer Nomination Scheme |
| 491 | Skilled Work Regional |
| 500 | Student Visa |
| 820/801 | Partner Visa |
| 888 | Business Innovation |

### Admin Seed Verileri

Admin dashboard'dan "Seed" butonuyla şu veriler varsayılan olarak yüklenir:
- 11 adet SSS sorusu (VİZE, İNGİLİZCE, MESLEK, KALICI OTURUM kategorilerinde)
- 8 vize programı
- 2 bento kartı

---

## Çok Dil Desteği

**Dosya:** `src/i18n/LanguageContext.jsx`

- React Context API tabanlı
- Desteklenen diller: Türkçe (`tr`) — varsayılan, İngilizce (`en`)
- 250+ çeviri anahtarı
- Navbar'daki butonla anlık dil geçişi
- `useLanguage()` hook'u ile her bileşenden erişilir:

```jsx
const { lang, t } = useLanguage();

// Doğrudan karşılaştırma
{lang === 'tr' ? 'Türkçe metin' : 'English text'}

// t() fonksiyonu ile anahtar bazlı çeviri
{t('hero_subtitle')}
```

---

## Admin Paneli

**Rota:** `/admin`
**Auth:** Firebase Email/Password

### Sekmeler

| Sekme | Koleksiyon | İşlemler |
|-------|------------|----------|
| Makaleler | `articles` | Oluştur, düzenle, sil, yayınla/taslağa al |
| SSS | `faqItems` | Oluştur, düzenle, sil, sırala |
| Programlar | `programs` | Oluştur, düzenle, sil |
| Slaytlar | `sliders` | Oluştur, düzenle, sil, sırala |
| Bento Kartlar | `bentoCards` | İçerik düzenle |

### Makale Editörü
- Başlık, slug (URL), içerik (Markdown), kategori, durum (taslak/yayında)
- Kategori seçenekleri: hukuk, egitim, sosyal, program-turleri, iletisim

---

## Tasarım Sistemi

### Renk Paleti

| Değişken | HEX | Kullanım |
|----------|-----|---------|
| Accent / Lime | `#ccff00` | Birincil vurgu, başlıklar, butonlar |
| Cyan | `#00d4ff` | USD kuru, eğitim kategorisi |
| Kırmızı | `#ff6b6b` | Sosyal kategori |
| Mor | `#a78bfa` | Programlar, EUR kuru |
| Amber | `#f59e0b` | Uyarılar |
| ABC Turuncu | `#ff6b35` | ABC News badge |
| Guardian Mavi | `#05A0E8` | The Guardian badge |
| SBS Mor | `#8b5cf6` | SBS News badge |

### Arka Plan Hiyerarşisi

```
#050505 → Sayfa arka planı
#060606 → Section arka planı
#080808 → Kart arka planı
#0a0a0a → İkincil kart / footer panel
#111111 → Görsel arka planı
```

### Tipografi Kuralları

- Başlıklar: `font-black uppercase tracking-tighter italic`
- Etiketler: `font-black uppercase tracking-widest text-[9px]`
- Gövde: `font-medium text-white/70`
- Kenarlık: `border-white/5` (ince), `border-white/10` (orta), `border-white/20` (belirgin)

### Bileşen Stilleri

- Kart kenarlıkları: 1px `white/5` → hover `white/20`
- Aktif durum: `border-l-2 border-l-[#ccff00]` + `bg-[#ccff00]/5`
- Buton stili: `border border-white/10 hover:border-white/30`
- Gölge (floating): `6px 6px 0px rgba(0,0,0,0.5)`

---

## Dağıtım (Vercel)

### vercel.json

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)",     "destination": "/" }
  ]
}
```

- `/api/*` → Serverless functions
- Diğer tüm rotalar → `index.html` (SPA fallback)

### Dağıtım Adımları

1. [Vercel Dashboard](https://vercel.com)'a git ve bu repository'yi bağla
2. **Environment Variables** bölümüne ekle:
   - `GROQ_API_KEY` → Groq console'dan alınan API anahtarı
3. Deploy et — Vercel otomatik olarak `npm run build` çalıştırır

### Production URL

```
https://migron.mtive.tech
```

### Vercel Logs ile Hata Ayıklama

API route'larından detaylı loglara ulaşmak için:
```
Vercel Dashboard → Project → Functions → Log Drains
```

`australia-news.js` ve `chat.js` her adımda `console.log` yazar; haber kaynaklarının durumu buradan izlenebilir.

---

## Lisans

© 2025 MIGRON — MTIVE TECH LEGAL. Tüm hakları saklıdır.
