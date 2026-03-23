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
- Kripto ve kıymetli maden fiyatları (Bitcoin, Ethereum, Solana, Altın, Gümüş)
- İnteraktif Avustralya haritası (8 şehir, Firestore'dan güncellenebilir kira/maaş verileri)
- Becerili göçmen puan hesaplayıcısı
- Vize kontrol listesi
- PR Yol Haritası (5 göç yolu, görsel flowchart)
- Maaş Rehberi (8 sektör, 40+ pozisyon, Fair Work minimum ücret)
- Site geneli Fuse.js arama (Ctrl+K)
- İndirilebilir belge şablonları (.docx)
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
| Arama | Fuse.js 7.1.0 (istemci tarafı fuzzy search) |
| Belge Şablonları | docx npm paketi (Node.js script ile üretilir) |
| İkonlar | Lucide React 0.575.0 |
| Markdown | react-markdown + remark-gfm |

---

## Klasör Yapısı

```
migron/
├── api/                          # Vercel Serverless Functions
│   ├── chat.js                   # Groq AI chat endpoint
│   └── australia-news.js         # RSS haber aggregatörü
│
├── public/
│   ├── sitemap.xml               # SEO sitemap (17 URL)
│   └── templates/                # İndirilebilir .docx şablonlar (5 dosya)
│       ├── gte-beyan-mektubu.docx
│       ├── 482-sponsor-mektubu.docx
│       ├── avustralya-cv.docx
│       ├── cover-letter.docx
│       └── referans-mektubu.docx
│
├── scripts/
│   └── generate-templates.mjs    # .docx dosyalarını üretir (npm run generate-templates)
│
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroSlider.jsx
│   │   │   ├── LiveTicker.jsx
│   │   │   ├── AustraliaNewsSlider.jsx
│   │   │   ├── BentoGrid.jsx
│   │   │   ├── AustraliaMap.jsx      # Firestore'dan kira/maaş, 8 şehir
│   │   │   └── CurrencyWidget.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Arama (Ctrl+K), tüm dropdown'lar
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── SubPage.jsx
│   │   │   ├── ArticlePage.jsx
│   │   │   ├── SSSPage.jsx
│   │   │   ├── ProgramTurleriPage.jsx
│   │   │   ├── PointsCalculatorPage.jsx
│   │   │   ├── VisaChecklistPage.jsx
│   │   │   ├── Ilk48SaatPage.jsx
│   │   │   ├── SertifikalarPage.jsx  # 7 kategori, 24 sertifika, vize badge
│   │   │   ├── VergiVeSuperPage.jsx
│   │   │   ├── BelgeSablonlariPage.jsx  # 8 şablon, .docx indirme
│   │   │   ├── CentrelinkPage.jsx
│   │   │   ├── MaasRehberiPage.jsx   # 8 sektör, Firestore fair work
│   │   │   └── PrYolHaritasiPage.jsx # 5 yol flowchart, PR süre tablosu
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ArticleEditor.jsx
│   │   │   ├── FAQEditor.jsx
│   │   │   ├── ProgramEditor.jsx
│   │   │   ├── SliderEditor.jsx
│   │   │   ├── BentoEditor.jsx
│   │   │   └── ContentEditor.jsx     # Şehir kira/maaş, Fair Work, PR süreler
│   │   ├── chat/
│   │   │   └── AiTerminal.jsx
│   │   ├── search/
│   │   │   └── SearchModal.jsx       # Fuse.js modal (Ctrl+K)
│   │   ├── shared/
│   │   │   ├── LiveExperimentBand.jsx
│   │   │   └── YouTubeBox.jsx
│   │   └── seo/
│   │       └── SEOHead.jsx
│   ├── config/
│   │   ├── firebase.js
│   │   └── constants.js
│   ├── i18n/
│   │   └── LanguageContext.jsx       # TR/EN dil sistemi (250+ anahtar)
│   ├── data/
│   │   ├── content.js                # Firebase fallback statik veriler
│   │   └── searchIndex.js            # Fuse.js site geneli arama indeksi (40+ öğe)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
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

# .docx şablonlarını yeniden üret
npm run generate-templates

# Build önizleme
npm run preview
```

> **Not:** API route'larını lokal test etmek için `vercel dev` komutunu kullanın.

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

---

## Sayfalar ve Rotalar

| Rota | Bileşen | Açıklama |
|------|---------|----------|
| `/` | `HomePage` | Ana sayfa — tüm home bileşenleri |
| `/hukuk` | `SubPage` | Hukuk kategorisi makaleleri |
| `/egitim` | `SubPage` | Eğitim kategorisi makaleleri |
| `/sosyal` | `SubPage` | Sosyal yaşam makaleleri |
| `/program-turleri` | `ProgramTurleriPage` | 8 vize programı |
| `/pr-yol-haritasi` | `PrYolHaritasiPage` | PR yol haritası — 5 göç yolu flowchart |
| `/sss` | `SSSPage` | Sıkça sorulan sorular |
| `/puan-hesapla` | `PointsCalculatorPage` | Becerili göçmen puan hesaplayıcısı |
| `/vize-kontrol-listesi` | `VisaChecklistPage` | Vize başvuru kontrol listesi |
| `/ilk-48-saat` | `Ilk48SaatPage` | Avustralya'ya varış rehberi |
| `/sertifikalar` | `SertifikalarPage` | 24 sertifika, 7 kategori, vize badge |
| `/vergi-ve-super` | `VergiVeSuperPage` | Vergi ve süperannuation rehberi |
| `/belge-sablonlari` | `BelgeSablonlariPage` | 8 belge şablonu, .docx indirme |
| `/centrelink` | `CentrelinkPage` | Centrelink rehberi |
| `/maas-rehberi` | `MaasRehberiPage` | 8 sektör maaş rehberi, Fair Work |
| `/iletisim` | `SubPage` | İletişim sayfası |
| `/makale/:slug` | `ArticlePage` | Tekil makale görünümü |
| `/admin` | `AdminPage` | CMS admin paneli (Firebase Auth korumalı) |

---

## Bileşenler

### AustraliaMap
- 8 şehir: Darwin, Perth, Adelaide, Melbourne, Canberra, Sydney, Brisbane, Hobart
- Kira/maaş verileri Firestore `cities/{cityId}` koleksiyonundan çekilir
- 24h sessionStorage cache — her sayfa yüklemesinde Firestore'a gitmez
- Admin paneli `İçerik` sekmesinden güncellenebilir
- Güncelleme tarihi şehir kartında gösterilir
- Firestore boşsa hardcoded fallback veriler kullanılır

### MaasRehberiPage (`/maas-rehberi`)
- 8 sektör, 40+ pozisyon: saatlik ve haftalık ücret aralıkları (2025–2026)
- Sektör filtresi (buton grupları)
- Fair Work minimum ücret: Firestore `fairwork/minimum_wage`'den çekilir, fallback hardcoded
- "Son güncelleme" tarihi gösterimi
- TR/EN tam çeviri

### PrYolHaritasiPage (`/pr-yol-haritasi`)
- 5 göç yolu: WHV 417, Öğrenci 500, TSS 482, Skilled 189/190, Bölgesel 491
- Her yol accordion formatında genişletilebilir flowchart
- PR adımları yeşil ✓ işaretiyle işaretli
- PR süre tablosu: Firestore `pr_yollari/sureler`'den çekilir
- Puan hesaplayıcıya CTA butonu
- TR/EN tam çeviri

### SearchModal (`src/components/search/SearchModal.jsx`)
- Fuse.js 7.1.0 ile fuzzy full-text arama
- Tetikleyici: Navbar'daki Search ikonu veya Ctrl+K
- İndeks: 40+ öğe — sayfalar, vizeler, sertifikalar, belgeler (`src/data/searchIndex.js`)
- Kategori renk badge'leri
- Klavye navigasyonu: ↑↓ gezin, Enter aç, Esc kapat
- Boş durum: migron@mtive.tech yönlendirmesi

### ContentEditor (`src/components/admin/ContentEditor.jsx`)
- **Şehir Verileri:** 8 şehir için kira/maaş → Firestore `cities/{cityId}`
- **Fair Work:** Saatlik/haftalık/tarih → Firestore `fairwork/minimum_wage`
- **PR Süre Tablosu:** Satır ekle/sil → Firestore `pr_yollari/sureler`
- Toast bildirimleri ile kaydetme geri bildirimi
- Admin paneli `İçerik` sekmesinden erişilir

---

## API Rotaları

### `POST /api/chat`
Groq AI ile sohbet.
- Model: `llama-3.3-70b-versatile` · Temperature: 0.7 · Max Tokens: 800

### `GET /api/australia-news`
RSS aggregatör. Cache: `s-maxage=3600`.
- Kaynaklar: ABC News · The Guardian Australia · SBS News

---

## Firebase Koleksiyonları

Firebase projesi: `migron-32348`

| Koleksiyon | İçerik |
|------------|--------|
| `articles` | Makaleler (title, slug, content, category, status) |
| `faqItems` | SSS soruları (category, question, answer, order) |
| `programs` | Vize programları (title, requirements, processingTime) |
| `sliders` | Hero slaytları (title, tags, imageUrl, order) |
| `bentoCards` | Bento kart içerikleri |
| `cities/{cityId}` | Şehir kira/maaş (rent, salary, updatedAt) |
| `fairwork/minimum_wage` | Fair Work asgari ücret (hourly, weekly, effective_date) |
| `pr_yollari/sureler` | PR süre tablosu (rows array, updatedAt) |
| `maas_rehberi/meta` | Maaş rehberi güncelleme tarihi |

**Şehir ID'leri:** `darwin` · `perth` · `adelaide` · `melbourne` · `canberra` · `sydney` · `brisbane` · `hobart`

---

## Çok Dil Desteği

**Dosya:** `src/i18n/LanguageContext.jsx`

- React Context API tabanlı, 250+ çeviri anahtarı
- TR (varsayılan) / EN
- Navbar Globe ikonu ile anlık geçiş
- Tüm yeni sayfalar (MaasRehberi, PrYolHaritasi, SearchModal, ContentEditor) tam TR/EN desteklidir

```jsx
const { lang, t } = useLanguage();
{lang === 'tr' ? 'Türkçe metin' : 'English text'}
{t('hero_subtitle')}
```

---

## Admin Paneli

**Rota:** `/admin` · **Auth:** Firebase Email/Password (tek kullanıcı)

| Sekme | Koleksiyon | İşlemler |
|-------|------------|----------|
| Makaleler | `articles` | CRUD + yayınla/taslak |
| SSS | `faqItems` | CRUD + sırala |
| Programlar | `programs` | CRUD |
| Slider | `sliders` | CRUD + sırala |
| Bento | `bentoCards` | Düzenle |
| **İçerik** | `cities`, `fairwork`, `pr_yollari` | Şehir kira/maaş · Fair Work · PR süreler |

### ContentEditor Kullanımı
- **Şehir Verileri:** Kira + haftalık maaş girip Kaydet. Harita kartında anında güncellenir.
- **Fair Work:** Saatlik, haftalık, geçerlilik tarihi (TR+EN). Her Temmuz güncelle.
- **PR Süre Tablosu:** Satır ekle/sil. `/pr-yol-haritasi` sayfasında gösterilir.

---

## Tasarım Sistemi

### Renk Paleti

| Renk | HEX | Kullanım |
|------|-----|---------|
| Lime / Accent | `#ccff00` | Birincil vurgu, başlıklar, CTA butonlar |
| Cyan | `#00d4ff` | USD kuru, eğitim, 500 vizesi badge |
| Kırmızı | `#ff6b6b` | Sosyal kategori, zorunlu badge |
| Mor | `#a78bfa` | Programlar, EUR kuru |
| Turuncu | `#ff9500` | 482 vizesi badge |
| Yeşil neon | `#00ff88` | 189/190 badge, PR ✓ işareti |
| Amber | `#f59e0b` | Uyarı kutuları |

### Arka Plan Hiyerarşisi

```
#050505 → Sayfa zemin
#111111 → Kart / panel
#0a0a0a → İkincil panel
```

### Tipografi

- Başlık: `font-black uppercase tracking-tighter italic`
- Etiket: `font-black uppercase tracking-widest text-[9px]`
- Gövde: `font-medium text-white/70`

---

## Belge Şablonları

`public/templates/` klasöründe 5 `.docx` dosyası:

| Dosya | Şablon |
|-------|--------|
| `gte-beyan-mektubu.docx` | GTE beyan mektubu (öğrenci vizesi) |
| `482-sponsor-mektubu.docx` | 482 TSS işveren sponsor mektubu |
| `avustralya-cv.docx` | Avustralya CV formatı |
| `cover-letter.docx` | İngilizce kapak mektubu |
| `referans-mektubu.docx` | İşveren referans mektubu |

Şablonları yeniden üretmek:
```bash
npm run generate-templates
```

---

## Dağıtım (Vercel)

### vercel.json
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Adımlar
1. Vercel Dashboard'a git, repository'yi bağla
2. Environment Variables: `GROQ_API_KEY`
3. Deploy — Vercel otomatik `npm run build` çalıştırır

**Production URL:** `https://migron.mtive.tech`

---

## Lisans

© 2025–2026 MIGRON — MTIVE TECH LEGAL. Tüm hakları saklıdır.
