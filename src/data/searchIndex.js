// ── Site Geneli Arama İndeksi ────────────────────────────────────────────────
// Fuse.js tarafından kullanılır. Her öğe: { title, titleEn, desc, descEn, path, category }

export const SEARCH_INDEX = [
    // ── Sayfalar ──────────────────────────────────────────────────────────────
    { id: 'home', title: 'Anasayfa', titleEn: 'Home', desc: 'MIGRON ana sayfa — döviz kurları, haberler, harita', descEn: 'MIGRON home — currency rates, news, map', path: '/', category: 'Sayfa' },
    { id: 'hukuk', title: 'Hukuk Makaleleri', titleEn: 'Legal Articles', desc: 'Avustralya göçmenlik hukuku makaleleri', descEn: 'Australian immigration law articles', path: '/hukuk', category: 'Sayfa' },
    { id: 'egitim', title: 'Eğitim Makaleleri', titleEn: 'Education Articles', desc: 'Avustralya eğitim sistemi ve fırsatları', descEn: 'Australian education system and opportunities', path: '/egitim', category: 'Sayfa' },
    { id: 'sosyal', title: 'Sosyal Yaşam', titleEn: 'Social Life', desc: 'Avustralya\'da yaşam, kira, alışveriş', descEn: 'Life in Australia, rent, shopping', path: '/sosyal', category: 'Sayfa' },
    { id: 'sss', title: 'Sıkça Sorulan Sorular', titleEn: 'FAQ', desc: 'Vize, İngilizce, meslek değerlendirmesi, PR soruları', descEn: 'Visa, English, skills assessment, PR questions', path: '/sss', category: 'Sayfa' },
    { id: 'iletisim', title: 'İletişim', titleEn: 'Contact', desc: 'Bize ulaşın', descEn: 'Get in touch', path: '/iletisim', category: 'Sayfa' },

    // ── Araçlar & Rehberler ───────────────────────────────────────────────────
    { id: 'puan', title: 'Puan Hesaplayıcı', titleEn: 'Points Calculator', desc: 'Skilled göçmenlik puanını hesapla — 189, 190, 491', descEn: 'Calculate your skilled migration points — 189, 190, 491', path: '/puan-hesapla', category: 'Araç' },
    { id: 'vize-list', title: 'Vize Kontrol Listesi', titleEn: 'Visa Checklist', desc: 'Vize başvurusu için gerekli belgeler listesi', descEn: 'Required documents list for visa application', path: '/vize-kontrol-listesi', category: 'Araç' },
    { id: 'belge', title: 'Belge Şablonları', titleEn: 'Document Templates', desc: 'GTE beyan mektubu, 482 sponsor mektubu, CV, kapak mektubu', descEn: 'GTE statement, 482 sponsor letter, CV, cover letter', path: '/belge-sablonlari', category: 'Araç' },
    { id: 'ilk48', title: 'İlk 48 Saat', titleEn: 'First 48 Hours', desc: 'Avustralya\'ya varışta ilk 48 saatte yapılacaklar listesi', descEn: 'Step-by-step checklist for your first 48 hours in Australia', path: '/ilk-48-saat', category: 'Rehber' },
    { id: 'maas', title: 'Maaş Rehberi', titleEn: 'Salary Guide', desc: 'Avustralya\'da sektör bazlı maaş rehberi 2026', descEn: 'Sector-by-sector salary guide Australia 2026', path: '/maas-rehberi', category: 'Rehber' },
    { id: 'pr', title: 'PR Yol Haritası', titleEn: 'PR Roadmap', desc: 'Avustralya kalıcı oturuma geçiş yolları — 189, 190, 186, 482', descEn: 'Pathways to Australian permanent residence — 189, 190, 186, 482', path: '/pr-yol-haritasi', category: 'Rehber' },
    { id: 'sertifikalar', title: 'Sertifikalar Rehberi', titleEn: 'Certificates Guide', desc: 'RSA, White Card, forklift, güvenlik lisansı, first aid', descEn: 'RSA, White Card, forklift, security licence, first aid', path: '/sertifikalar', category: 'Rehber' },
    { id: 'vergi', title: 'Vergi ve Super', titleEn: 'Tax & Super', desc: 'Avustralya\'da vergi, TFN, süperannuation rehberi', descEn: 'Tax, TFN, superannuation guide in Australia', path: '/vergi-ve-super', category: 'Rehber' },
    { id: 'centrelink', title: 'Centrelink', titleEn: 'Centrelink', desc: 'Avustralya sosyal yardım sistemi rehberi', descEn: 'Australian social security system guide', path: '/centrelink', category: 'Rehber' },

    // ── Vize Programları ──────────────────────────────────────────────────────
    { id: 'program-turleri', title: 'Program Türleri', titleEn: 'Visa Programs', desc: '189, 190, 482, 186, 491, 500, Partner, Business vizeler', descEn: '189, 190, 482, 186, 491, 500, Partner, Business visas', path: '/program-turleri', category: 'Vize' },
    { id: 'v189', title: 'Visa 189 — Skilled Independent', titleEn: 'Visa 189 — Skilled Independent', desc: 'Bağımsız skilled göçmenlik vizesi, doğrudan PR', descEn: 'Independent skilled migration visa, direct PR', path: '/program-turleri', category: 'Vize' },
    { id: 'v190', title: 'Visa 190 — Skilled Nominated', titleEn: 'Visa 190 — Skilled Nominated', desc: 'Eyalet nominasyonlu skilled vize, +5 puan, PR', descEn: 'State nominated skilled visa, +5 points, PR', path: '/program-turleri', category: 'Vize' },
    { id: 'v482', title: 'Visa 482 — Skills in Demand (SID)', titleEn: 'Visa 482 — Skills in Demand (SID)', desc: 'İşveren sponsorlu 4 yıllık çalışma vizesi — Core Skills, Specialist Skills, Labour Agreement', descEn: 'Employer sponsored 4-year work visa — Core Skills, Specialist Skills, Labour Agreement', path: '/program-turleri', category: 'Vize' },
    { id: 'v186', title: 'Visa 186 — Employer Nomination Scheme', titleEn: 'Visa 186 — ENS', desc: 'İşveren nominasyonlu kalıcı vize', descEn: 'Employer nomination permanent visa', path: '/program-turleri', category: 'Vize' },
    { id: 'v491', title: 'Visa 491 — Skilled Work Regional', titleEn: 'Visa 491 — Regional', desc: 'Bölgesel çalışma geçici vizesi, +15 puan', descEn: 'Regional work temporary visa, +15 points', path: '/program-turleri', category: 'Vize' },
    { id: 'v500', title: 'Visa 500 — Öğrenci Vizesi', titleEn: 'Visa 500 — Student Visa', desc: 'CRICOS kayıtlı okul için öğrenci vizesi, çalışma izni', descEn: 'Student visa for CRICOS registered institution, work rights', path: '/program-turleri', category: 'Vize' },
    { id: 'v417', title: 'Visa 417 — Working Holiday', titleEn: 'Visa 417 — Working Holiday', desc: '35 yaş altı Working Holiday Visa, 1 yıl', descEn: 'Working Holiday Visa for under 35, 1 year', path: '/program-turleri', category: 'Vize' },

    // ── Sertifikalar ──────────────────────────────────────────────────────────
    { id: 'cert-rsa', title: 'RSA — Responsible Service of Alcohol', titleEn: 'RSA — Responsible Service of Alcohol', desc: 'Bar, kafe, restoran için alkol servis sertifikası', descEn: 'Alcohol service certificate for bar, cafe, restaurant', path: '/sertifikalar', category: 'Sertifika' },
    { id: 'cert-white', title: 'White Card — Yapı İş Güvenliği', titleEn: 'White Card — Construction Safety', desc: 'İnşaat sektörü giriş kartı, zorunlu', descEn: 'Construction industry entry card, mandatory', path: '/sertifikalar', category: 'Sertifika' },
    { id: 'cert-forklift', title: 'Forklift Lisansı (LF)', titleEn: 'Forklift Licence (LF)', desc: 'Depo ve lojistik sektörü için forklift operatör lisansı', descEn: 'Forklift operator licence for warehouse and logistics', path: '/sertifikalar', category: 'Sertifika' },
    { id: 'cert-security', title: 'Güvenlik Lisansı (CPL)', titleEn: 'Security Licence (CPL)', desc: 'Güvenlik görevlisi lisansı, eyalete göre değişir', descEn: 'Security guard licence, varies by state', path: '/sertifikalar', category: 'Sertifika' },
    { id: 'cert-firstaid', title: 'First Aid (HLTAID011)', titleEn: 'First Aid (HLTAID011)', desc: 'İlk yardım sertifikası, birçok sektörde şart', descEn: 'First aid certificate, required in many sectors', path: '/sertifikalar', category: 'Sertifika' },
    { id: 'cert-tfood', title: 'Food Safety Supervisor', titleEn: 'Food Safety Supervisor', desc: 'Gıda güvenliği denetçisi sertifikası, kafe ve restoran', descEn: 'Food safety supervisor certificate, cafe and restaurant', path: '/sertifikalar', category: 'Sertifika' },
    { id: 'cert-ndis', title: 'NDIS Orientation Module', titleEn: 'NDIS Orientation Module', desc: 'Engelli destek çalışanı zorunlu modül', descEn: 'Mandatory module for disability support workers', path: '/sertifikalar', category: 'Sertifika' },
    { id: 'cert-wwcc', title: 'WWCC — Working With Children Check', titleEn: 'WWCC — Working With Children Check', desc: 'Çocukla çalışma izni, kreş ve eğitim sektörü', descEn: 'Check to work with children, childcare and education', path: '/sertifikalar', category: 'Sertifika' },

    // ── Belge Şablonları ──────────────────────────────────────────────────────
    { id: 'doc-gte', title: 'GTE Beyan Mektubu Şablonu', titleEn: 'GTE Statement Template', desc: 'Öğrenci vizesi için Genuine Temporary Entrant beyan mektubu', descEn: 'Genuine Temporary Entrant statement for student visa', path: '/belge-sablonlari', category: 'Şablon' },
    { id: 'doc-482', title: '482 Sponsor Mektubu Şablonu', titleEn: '482 Sponsor Letter Template', desc: 'İşveren için TSS vize sponsor destek mektubu', descEn: 'TSS visa employer sponsorship support letter', path: '/belge-sablonlari', category: 'Şablon' },
    { id: 'doc-cv', title: 'Avustralya CV Şablonu', titleEn: 'Australian CV Template', desc: 'Avustralya iş başvuruları için CV formatı', descEn: 'CV format for Australian job applications', path: '/belge-sablonlari', category: 'Şablon' },
    { id: 'doc-cover', title: 'Kapak Mektubu Şablonu', titleEn: 'Cover Letter Template', desc: 'İngilizce iş başvuru kapak mektubu', descEn: 'English job application cover letter', path: '/belge-sablonlari', category: 'Şablon' },
    { id: 'doc-ref', title: 'Referans Mektubu Şablonu', titleEn: 'Reference Letter Template', desc: 'İşveren referans mektubu', descEn: 'Employer reference letter', path: '/belge-sablonlari', category: 'Şablon' },
];
