import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, AlertCircle, Clock, DollarSign, Monitor } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';
import LiveExperimentBand from '../shared/LiveExperimentBand';

const VISA_CONFIG = {
    '417': { color: '#ccff00', bg: '#ccff0020' },
    '462': { color: '#ccff00', bg: '#ccff0020' },
    '500': { color: '#00d4ff', bg: '#00d4ff20' },
    '482': { color: '#ff9500', bg: '#ff950020' },
    '189': { color: '#00ff88', bg: '#00ff8820' },
    '190': { color: '#00ff88', bg: '#00ff8820' },
};

const CATEGORIES = [
    { key: 'yiyecek', label: 'Yiyecek & İçecek', labelEn: 'Food & Beverage', icon: '🍽️' },
    { key: 'insaat', label: 'İnşaat & Saha', labelEn: 'Construction & Site', icon: '🏗️' },
    { key: 'guvenlik', label: 'Güvenlik', labelEn: 'Security', icon: '🛡️' },
    { key: 'cocuk', label: 'Çocuk & Bakım', labelEn: 'Children & Care', icon: '👶' },
    { key: 'it', label: 'IT & Teknoloji', labelEn: 'IT & Technology', icon: '💻' },
    { key: 'saglik', label: 'Sağlık & Yaşlı Bakımı', labelEn: 'Health & Aged Care', icon: '🏥' },
    { key: 'nakliye', label: 'Nakliye & Lojistik', labelEn: 'Transport & Logistics', icon: '🚛' },
];

const certificates = [
    // Yiyecek & İçecek
    {
        id: 'rsa',
        category: 'yiyecek',
        name: 'RSA — Responsible Service of Alcohol',
        nameEn: 'RSA — Responsible Service of Alcohol',
        code: 'SITHFAB021',
        sectors: ['Bar', 'Restoran', 'Kafe', 'Etkinlik'],
        sectorsEn: ['Bar', 'Restaurant', 'Café', 'Events'],
        sektorSarti: true,
        cost: '$50–80 AUD',
        duration: '4–6 saat',
        durationEn: '4–6 hours',
        how: 'Online',
        howEn: 'Online',
        visas: ['417', '462', '500', '482', '189', '190'],
        tafe: false,
        note: "Alkol servisi yapılan tüm mekânlarda yasal zorunluluk. Avustralya'da en hızlı iş kapısı açan sertifika.",
        noteEn: "A legal requirement at all venues serving alcohol. Australia's fastest door-opening certificate.",
    },
    {
        id: 'foodsafety_supervisor',
        category: 'yiyecek',
        name: 'Food Safety Supervisor Certificate',
        nameEn: 'Food Safety Supervisor Certificate',
        code: 'SITXFSA005 + SITXFSA006',
        sectors: ['Mutfak', 'Kafe', 'Fast Food', 'Catering', 'Hastane'],
        sectorsEn: ['Kitchen', 'Café', 'Fast Food', 'Catering', 'Hospital'],
        sektorSarti: true,
        cost: '$80–150 AUD',
        duration: '1 gün',
        durationEn: '1 day',
        how: 'Online veya yüz yüze',
        howEn: 'Online or in-person',
        visas: ['417', '462', '500', '482'],
        tafe: false,
        note: 'Gıda güvenliği denetimi yapacak kişiler için zorunlu. Food Handler\'dan bir üst seviye.',
        noteEn: 'Required for those supervising food safety. One level above Food Handler.',
    },
    {
        id: 'food_handler',
        category: 'yiyecek',
        name: 'Food Handler Certificate',
        nameEn: 'Food Handler Certificate',
        code: null,
        sectors: ['Mutfak', 'Kafe', 'Fast Food', 'Catering'],
        sectorsEn: ['Kitchen', 'Café', 'Fast Food', 'Catering'],
        sektorSarti: false,
        cost: '$20–50 AUD',
        duration: '2–3 saat',
        durationEn: '2–3 hours',
        how: 'Online',
        howEn: 'Online',
        visas: ['417', '462', '500'],
        tafe: false,
        note: 'Temel gıda hijyeni sertifikası. Düşük maliyetiyle mutfak sektörüne giriş için ilk adım.',
        noteEn: 'Basic food hygiene certificate. Low-cost first step into kitchen work.',
    },
    {
        id: 'barista',
        category: 'yiyecek',
        name: 'Barista Sertifikası',
        nameEn: 'Barista Certificate',
        code: null,
        sectors: ['Kafe', 'Restoran', 'Otel', 'Catering'],
        sectorsEn: ['Café', 'Restaurant', 'Hotel', 'Catering'],
        sektorSarti: false,
        cost: '$150–200 AUD',
        duration: '1 gün',
        durationEn: '1 day',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '500', '482'],
        tafe: false,
        note: "Avustralya'da kahve kültürü son derece güçlü. Kafe iş görüşmelerinde pratik kahve bilgisi doğrudan sorgulanır.",
        noteEn: 'Coffee culture is huge in Australia. Practical coffee skills are directly tested in café interviews.',
    },
    {
        id: 'rsg',
        category: 'yiyecek',
        name: 'RSG — Responsible Service of Gambling',
        nameEn: 'RSG — Responsible Service of Gambling',
        code: null,
        sectors: ['Casino', 'TAB', 'Slot Makinesi Olan Mekanlar'],
        sectorsEn: ['Casino', 'TAB', 'Venues with Gaming Machines'],
        sektorSarti: true,
        cost: '$30–50 AUD',
        duration: '2–3 saat',
        durationEn: '2–3 hours',
        how: 'Online',
        howEn: 'Online',
        visas: ['417', '462', '500', '482'],
        tafe: false,
        note: 'RSA ile birlikte alındığında hospitality sektöründe tam paket oluşturur.',
        noteEn: 'Combined with RSA, creates a full package for the hospitality sector.',
    },

    // İnşaat & Saha
    {
        id: 'whitecard',
        category: 'insaat',
        name: 'White Card — Construction Induction',
        nameEn: 'White Card — Construction Induction',
        code: null,
        sectors: ['İnşaat', 'Peyzaj', 'Tadilat', 'Yol Çalışması'],
        sectorsEn: ['Construction', 'Landscaping', 'Renovation', 'Roadworks'],
        sektorSarti: true,
        cost: '$60–100 AUD',
        duration: 'Yarım gün',
        durationEn: 'Half day',
        how: 'Online veya yüz yüze',
        howEn: 'Online or in-person',
        visas: ['417', '462', '500', '482', '189', '190'],
        tafe: false,
        note: 'Herhangi bir inşaat sahasına girmek için yasal zorunluluk. Avustralya genelinde geçerli.',
        noteEn: 'A legal requirement to enter any construction site. Valid across all of Australia.',
    },
    {
        id: 'traffic',
        category: 'insaat',
        name: 'Traffic Controller — Boom Gate Operatörü',
        nameEn: 'Traffic Controller — Boom Gate Operator',
        code: null,
        sectors: ['İnşaat', 'Yol Çalışması', 'Etkinlik'],
        sectorsEn: ['Construction', 'Roadworks', 'Events'],
        sektorSarti: false,
        cost: '$200–350 AUD',
        duration: '1–2 gün',
        durationEn: '1–2 days',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '482'],
        tafe: false,
        note: 'White Card ile birlikte alındığında saha iş imkânlarını önemli ölçüde genişletir.',
        noteEn: 'Combined with White Card, significantly expands opportunities in site work.',
    },
    {
        id: 'forklift',
        category: 'insaat',
        name: 'Forklift Licence — LF',
        nameEn: 'Forklift Licence — LF',
        code: null,
        sectors: ['Depo', 'Fabrika', 'Lojistik', 'İnşaat'],
        sectorsEn: ['Warehouse', 'Factory', 'Logistics', 'Construction'],
        sektorSarti: false,
        cost: '$300–500 AUD',
        duration: '1–2 gün',
        durationEn: '1–2 days',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '482', '189'],
        tafe: false,
        note: 'Lojistik ve depo sektöründe geniş iş imkânı sunar.',
        noteEn: 'Offers wide job opportunities in logistics and warehouse work.',
    },
    {
        id: 'ewp',
        category: 'insaat',
        name: 'EWP Licence — Elevated Work Platform',
        nameEn: 'EWP Licence — Elevated Work Platform',
        code: null,
        sectors: ['İnşaat', 'Bakım-Onarım', 'Telekomünikasyon'],
        sectorsEn: ['Construction', 'Maintenance', 'Telecommunications'],
        sektorSarti: false,
        cost: '$200–400 AUD',
        duration: '1 gün',
        durationEn: '1 day',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '482'],
        tafe: false,
        note: 'Kiralık platform veya vinç sepeti kullanımı için gerekli. İnşaat sektöründe ek iş kapısı açar.',
        noteEn: 'Required for operating elevated work platforms. Opens additional doors in construction.',
    },
    {
        id: 'dogman',
        category: 'insaat',
        name: 'Dogman Licence',
        nameEn: 'Dogman Licence',
        code: null,
        sectors: ['İnşaat', 'Vinç Operasyonu'],
        sectorsEn: ['Construction', 'Crane Operations'],
        sektorSarti: true,
        cost: '$400–700 AUD',
        duration: '2–3 gün',
        durationEn: '2–3 days',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '482', '189'],
        tafe: false,
        note: 'Vinç yükleme ve boşaltma operasyonlarını yönetmek için zorunlu lisans. İnşaat sektöründe yüksek ücretli pozisyon.',
        noteEn: 'Mandatory licence for managing crane loading operations. A high-paying position in construction.',
    },

    // Güvenlik
    {
        id: 'security',
        category: 'guvenlik',
        name: 'Security Licence — CPP20218',
        nameEn: 'Security Licence — CPP20218',
        code: 'Certificate II in Security Operations',
        sectors: ['Güvenlik', 'Etkinlik', 'AVM', 'Gece Kulübü', 'Hastane'],
        sectorsEn: ['Security', 'Events', 'Shopping Centre', 'Nightclub', 'Hospital'],
        sektorSarti: true,
        cost: '$500–800 AUD',
        duration: '3–5 gün + background check',
        durationEn: '3–5 days + background check',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '482', '189', '190'],
        tafe: true,
        note: 'Güvenlik sektöründe çalışmak için zorunlu lisans. Hafta sonu ve gece vardiyalarında saatlik ücret ortalamanın üzerinde.',
        noteEn: 'Mandatory licence to work in security. Hourly rates above average for weekend and night shifts.',
    },
    {
        id: 'firstaid',
        category: 'guvenlik',
        name: 'First Aid Certificate — HLTAID011',
        nameEn: 'First Aid Certificate — HLTAID011',
        code: null,
        sectors: ['Güvenlik', 'Çocuk Bakımı', 'Spor Tesisleri', 'Hastane', 'Tüm Sektörler'],
        sectorsEn: ['Security', 'Childcare', 'Sports Facilities', 'Hospital', 'All Sectors'],
        sektorSarti: false,
        cost: '$100–150 AUD',
        duration: '1 gün',
        durationEn: '1 day',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '500', '482', '189', '190'],
        tafe: false,
        note: "Neredeyse her sektörde işveren tarafından tercih edilen ek nitelik. CV'de her zaman olumlu etki yaratır.",
        noteEn: 'A preferred additional qualification in nearly every sector. Always makes a positive impression on your CV.',
    },
    {
        id: 'cpr',
        category: 'guvenlik',
        name: 'CPR Sertifikası — HLTAID009',
        nameEn: 'CPR Certificate — HLTAID009',
        code: null,
        sectors: ['Tüm Sektörler'],
        sectorsEn: ['All Sectors'],
        sektorSarti: false,
        cost: '$50–80 AUD',
        duration: 'Yarım gün',
        durationEn: 'Half day',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '500', '482'],
        tafe: false,
        note: 'First Aid sertifikasının daha kısa ve ucuz versiyonu. Temel yaşam desteği için yeterli.',
        noteEn: 'A shorter, cheaper version of First Aid. Sufficient for basic life support.',
    },

    // Çocuk & Bakım
    {
        id: 'wwc',
        category: 'cocuk',
        name: 'Working with Children Check — WWC',
        nameEn: 'Working with Children Check — WWC',
        code: null,
        sectors: ['Çocuk Bakımı', 'Eğitim', 'Spor Kulüpleri', 'Gönüllü Çalışma'],
        sectorsEn: ['Childcare', 'Education', 'Sports Clubs', 'Volunteer Work'],
        sektorSarti: true,
        cost: 'Ücretsiz (gönüllüler) / $118 AUD (ücretli)',
        costEn: 'Free (volunteers) / $118 AUD (paid workers)',
        duration: 'Online başvuru, 1–4 hafta',
        durationEn: 'Online application, 1–4 weeks',
        how: 'Online',
        howEn: 'Online',
        visas: ['417', '462', '500', '482', '189', '190'],
        tafe: false,
        note: '18 yaş altı bireylerle çalışan herkes için zorunlu. Avustralya\'da çocukla temas eden her pozisyonda şart.',
        noteEn: 'Mandatory for anyone working with people under 18. Required for every position involving contact with children in Australia.',
    },
    {
        id: 'ece',
        category: 'cocuk',
        name: 'Certificate III in Early Childhood Education — CHC30121',
        nameEn: 'Certificate III in Early Childhood Education — CHC30121',
        code: null,
        sectors: ['Kreş', 'Anaokulu', 'Aile Bakım Evi'],
        sectorsEn: ['Childcare Centre', 'Kindergarten', 'Family Day Care'],
        sektorSarti: true,
        cost: "$1.500–3.000 AUD (TAFE'de indirimli)",
        costEn: '$1,500–3,000 AUD (discounted at TAFE)',
        duration: '6–12 ay',
        durationEn: '6–12 months',
        how: 'Yüz yüze veya karma',
        howEn: 'In-person or blended',
        visas: ['500', '482', '189', '190'],
        tafe: true,
        note: "Avustralya'da erken çocukluk eğitimi sektörü ciddi personel açığı yaşıyor. PR yolculuğu için değerli meslek listesinde.",
        noteEn: "Australia's early childhood sector faces a serious staffing shortage. Listed as a valued occupation for the PR pathway.",
    },

    // IT & Teknoloji
    {
        id: 'comptia_a',
        category: 'it',
        name: 'CompTIA A+',
        nameEn: 'CompTIA A+',
        code: null,
        sectors: ['IT Destek', 'Teknik Servis'],
        sectorsEn: ['IT Support', 'Tech Service'],
        sektorSarti: false,
        cost: '$230 USD (sınav ücreti)',
        costEn: '$230 USD (exam fee)',
        duration: 'Kendi hızında + online sınav',
        durationEn: 'Self-paced + online exam',
        how: 'Online sınav',
        howEn: 'Online exam',
        visas: ['500', '482', '189', '190'],
        tafe: false,
        note: "Uluslararası tanınan temel IT sertifikası. Yurt dışındaki IT deneyimini belgelemenin en yaygın yolu.",
        noteEn: 'Internationally recognised foundational IT certificate. The most common way to document IT experience from abroad.',
    },
    {
        id: 'comptia_n',
        category: 'it',
        name: 'CompTIA Network+',
        nameEn: 'CompTIA Network+',
        code: null,
        sectors: ['Ağ Yönetimi', 'IT Altyapısı'],
        sectorsEn: ['Network Management', 'IT Infrastructure'],
        sektorSarti: false,
        cost: '$230 USD (sınav ücreti)',
        costEn: '$230 USD (exam fee)',
        duration: 'Kendi hızında + online sınav',
        durationEn: 'Self-paced + online exam',
        how: 'Online sınav',
        howEn: 'Online exam',
        visas: ['500', '482', '189', '190'],
        tafe: false,
        note: "A+'dan sonra mantıklı adım. Ağ altyapısı pozisyonlarına geçiş için.",
        noteEn: 'A logical next step after A+. For transitioning into network infrastructure roles.',
    },
    {
        id: 'comptia_s',
        category: 'it',
        name: 'CompTIA Security+',
        nameEn: 'CompTIA Security+',
        code: null,
        sectors: ['Siber Güvenlik', 'IT Altyapısı'],
        sectorsEn: ['Cybersecurity', 'IT Infrastructure'],
        sektorSarti: false,
        cost: '$370 USD (sınav ücreti)',
        costEn: '$370 USD (exam fee)',
        duration: 'Kendi hızında + online sınav',
        durationEn: 'Self-paced + online exam',
        how: 'Online sınav',
        howEn: 'Online exam',
        visas: ['482', '189', '190'],
        tafe: false,
        note: "Siber güvenlik alanında uluslararası standart sertifika. Avustralya'da IT sektöründe talep görüyor.",
        noteEn: "International standard certificate in cybersecurity. In demand in Australia's IT sector.",
    },
    {
        id: 'aws_cp',
        category: 'it',
        name: 'AWS Certified Cloud Practitioner',
        nameEn: 'AWS Certified Cloud Practitioner',
        code: null,
        sectors: ['Bulut Teknolojileri', 'IT'],
        sectorsEn: ['Cloud Technologies', 'IT'],
        sektorSarti: false,
        cost: '$100 USD (sınav ücreti)',
        costEn: '$100 USD (exam fee)',
        duration: 'Kendi hızında + online sınav',
        durationEn: 'Self-paced + online exam',
        how: 'Online sınav',
        howEn: 'Online exam',
        visas: ['482', '189', '190'],
        tafe: false,
        note: "Bulut teknolojilerine giriş için en yaygın başlangıç sertifikası. IT sektöründe hızla artan talep.",
        noteEn: "The most common entry-level certificate for cloud technologies. Rapidly growing demand in Australia's IT sector.",
    },

    // Sağlık & Yaşlı Bakımı
    {
        id: 'cert3_support',
        category: 'saglik',
        name: 'Certificate III in Individual Support — CHC33021',
        nameEn: 'Certificate III in Individual Support — CHC33021',
        code: null,
        sectors: ['Yaşlı Bakımı', 'Engelli Bakımı', 'Toplum Hizmetleri'],
        sectorsEn: ['Aged Care', 'Disability Care', 'Community Services'],
        sektorSarti: true,
        cost: "$800–2.000 AUD (TAFE'de indirimli)",
        costEn: '$800–2,000 AUD (discounted at TAFE)',
        duration: '6–12 ay',
        durationEn: '6–12 months',
        how: 'Karma (online + uygulamalı)',
        howEn: 'Blended (online + practical)',
        visas: ['500', '482', '189', '190'],
        tafe: true,
        note: "Avustralya'da yaşlı bakımı sektörü kritik personel açığı yaşıyor. PR yolculuğu için öncelikli meslek listesinde.",
        noteEn: "Australia's aged care sector faces a critical staffing shortage. Listed as a priority occupation for the PR pathway.",
    },
    {
        id: 'ndis',
        category: 'saglik',
        name: 'NDIS Worker Screening Check',
        nameEn: 'NDIS Worker Screening Check',
        code: null,
        sectors: ['Engelli Destek Hizmetleri', 'NDIS'],
        sectorsEn: ['Disability Support Services', 'NDIS'],
        sektorSarti: true,
        cost: '$128 AUD',
        duration: 'Online başvuru, 1–4 hafta',
        durationEn: 'Online application, 1–4 weeks',
        how: 'Online',
        howEn: 'Online',
        visas: ['417', '462', '482', '189', '190'],
        tafe: false,
        note: 'NDIS (Ulusal Engellilik Sigorta Planı) kapsamındaki işlerde çalışmak için zorunlu tarama. Sektör hızla büyüyor.',
        noteEn: 'Mandatory screening to work in NDIS (National Disability Insurance Scheme) roles. Sector is growing fast.',
    },

    // Nakliye & Lojistik
    {
        id: 'hr_licence',
        category: 'nakliye',
        name: 'Heavy Rigid (HR) Ehliyet',
        nameEn: 'Heavy Rigid (HR) Licence',
        code: null,
        sectors: ['Uzun Yol Nakliye', 'Şehir İçi Taşımacılık', 'İnşaat'],
        sectorsEn: ['Long Haul Transport', 'Urban Transport', 'Construction'],
        sektorSarti: true,
        cost: '$300–600 AUD',
        duration: '1–2 gün sınav + pratik',
        durationEn: '1–2 days + practical',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '482', '189'],
        tafe: false,
        note: "Avustralya'da kamyon sürücüsüne talep yüksek. Şehirlerarası nakliyede uzun vadeli istihdam imkânı.",
        noteEn: 'High demand for truck drivers in Australia. Long-term employment opportunity in interstate transport.',
    },
    {
        id: 'dg',
        category: 'nakliye',
        name: 'Dangerous Goods — DG Sertifikası',
        nameEn: 'Dangerous Goods — DG Certificate',
        code: null,
        sectors: ['Lojistik', 'Depo', 'Kimyasal Taşımacılık'],
        sectorsEn: ['Logistics', 'Warehouse', 'Chemical Transport'],
        sektorSarti: true,
        cost: '$150–300 AUD',
        duration: '1 gün',
        durationEn: '1 day',
        how: 'Yüz yüze',
        howEn: 'In-person',
        visas: ['417', '462', '482'],
        tafe: false,
        note: 'Tehlikeli madde taşıyan sektörlerde zorunlu. Lojistik sektöründe maaş üstü ek ödeme getirir.',
        noteEn: 'Required in sectors handling hazardous materials. Comes with a pay premium in the logistics sector.',
    },
];

const SECTOR_PATHWAYS = [
    { icon: '☕', label: 'Kafe & Restoran', labelEn: 'Café & Restaurant', path: 'RSA → Barista → Food Safety Supervisor' },
    { icon: '🏗️', label: 'İnşaat & Saha', labelEn: 'Construction & Site', path: 'White Card → Traffic Controller → Forklift veya EWP' },
    { icon: '🛡️', label: 'Güvenlik', labelEn: 'Security', path: 'First Aid → Security Licence → CPR' },
    { icon: '💻', label: 'IT', labelEn: 'IT', path: 'CompTIA A+ → Network+ → Security+ veya AWS' },
    { icon: '🤝', label: 'Bakım Hizmetleri', labelEn: 'Care Services', path: 'WWC Check → Cert III Individual Support → NDIS' },
    { icon: '🚛', label: 'Lojistik', labelEn: 'Logistics', path: 'Forklift LF → HR Ehliyet → Dangerous Goods' },
];

const VisaBadge = ({ visa }) => {
    const cfg = VISA_CONFIG[visa];
    return (
        <span
            className="text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider"
            style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}40` }}
        >
            {visa}
        </span>
    );
};

const CertCard = ({ cert, lang }) => {
    const sectors = lang === 'en' ? cert.sectorsEn : cert.sectors;
    const cost = (lang === 'en' && cert.costEn) ? cert.costEn : cert.cost;

    return (
        <div className="bg-[#111] border border-white/5 p-6 flex flex-col gap-4 hover:border-white/15 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h3 className="text-base font-black uppercase tracking-tight text-white leading-snug mb-1">
                        {lang === 'en' ? cert.nameEn : cert.name}
                    </h3>
                    {cert.code && (
                        <span className="text-[10px] text-white/30 font-mono">{cert.code}</span>
                    )}
                </div>
                {cert.sektorSarti && (
                    <div className="shrink-0 flex items-center gap-1 px-2 py-1" style={{ backgroundColor: '#ff6b6b20' }}>
                        <AlertCircle size={10} className="text-[#ff6b6b]" />
                        <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[#ff6b6b]">
                            {lang === 'en' ? 'Sector Req.' : 'Sektör Şartı'}
                        </span>
                    </div>
                )}
            </div>

            {/* Sectors */}
            <div className="flex flex-wrap gap-1.5">
                {sectors.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-white/5 text-white/40 uppercase tracking-wider">
                        {s}
                    </span>
                ))}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                    <DollarSign size={13} className="text-white/20 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                            {lang === 'en' ? 'Cost' : 'Maliyet'}
                        </p>
                        <p className="text-white/70 font-bold">{cost}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <Clock size={13} className="text-white/20 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                            {lang === 'en' ? 'Duration' : 'Süre'}
                        </p>
                        <p className="text-white/70 font-bold">{lang === 'en' ? cert.durationEn : cert.duration}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2 col-span-2">
                    <Monitor size={13} className="text-white/20 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                            {lang === 'en' ? 'How' : 'Nasıl'}
                        </p>
                        <p className="text-white/70 font-bold">{lang === 'en' ? cert.howEn : cert.how}</p>
                    </div>
                </div>
            </div>

            {/* Visa badges */}
            <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] text-white/25 uppercase tracking-wider mr-1">
                    {lang === 'en' ? 'Visa:' : 'Vize:'}
                </span>
                {cert.visas.map(v => (
                    <VisaBadge key={v} visa={v} />
                ))}
            </div>

            {/* TAFE badge */}
            {cert.tafe && (
                <div className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-[#00d4ff]" />
                    <span className="text-[10px] text-[#00d4ff] font-bold">
                        TAFE {lang === 'en' ? '(varies by state)' : '(eyaletinize göre)'}
                    </span>
                </div>
            )}

            {/* Note */}
            <p className="text-xs text-white/40 leading-relaxed border-t border-white/5 pt-3 italic">
                {lang === 'en' ? cert.noteEn : cert.note}
            </p>
        </div>
    );
};

const SertifikalarPage = () => {
    const { lang } = useLanguage();
    const [activeFilter, setActiveFilter] = useState('TÜMÜ');

    const activeCategoryData = CATEGORIES.find(c => c.key === activeFilter);

    return (
        <>
            <SEOHead
                title={lang === 'en' ? 'Certificates Guide — Australia' : "Avustralya'da İşine Yarayacak Sertifikalar"}
                description={lang === 'en'
                    ? 'All certificates that make it easier to find work in Australia, grouped by sector.'
                    : "Avustralya'da iş bulmayı kolaylaştıran, sektöre göre gruplandırılmış tüm sertifikalar."}
                path="/sertifikalar"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} />
                                {lang === 'en' ? 'Back to Home' : 'Anasayfaya Dön'}
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                {lang === 'en' ? 'EDUCATION — CERTIFICATIONS' : 'EĞİTİM — SERTİFİKALAR'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <Award className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                {lang === 'en' ? 'CERTIFICATES' : 'SERTİFİKALAR'}
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium max-w-2xl">
                            {lang === 'en'
                                ? 'All certificates that make it easier to find work in Australia, grouped by sector.'
                                : "Avustralya'da iş bulmayı kolaylaştıran, sektöre göre gruplandırılmış tüm sertifikalar."}
                        </p>
                    </div>
                </section>

                <div className="max-w-[1200px] mx-auto px-6 py-8">

                    {/* TAFE Info Box */}
                    <div className="border border-[#ccff00]/40 bg-[#ccff00]/5 p-5 mb-8 flex items-start gap-4">
                        <div className="text-2xl shrink-0">🎓</div>
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-2">
                                {lang === 'en' ? 'ARE YOU A STUDENT?' : 'ÖĞRENCİ MİSİN?'}
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                {lang === 'en'
                                    ? 'TAFE (varies by state) offers discounts on many certificate courses to people with a valid student visa. Always check before enrolling — take your student card with you, the discount is not applied automatically, you need to mention it yourself.'
                                    : 'TAFE (eyaletinize göre değişir), geçerli öğrenci vizesine sahip kişilere birçok sertifika kursunda indirim sunuyor. Kayıt olmadan önce mutlaka kontrol et — öğrenci kartını yanında götür, indirim otomatik uygulanmıyor, kendin belirtmen gerekiyor.'}
                            </p>
                        </div>
                    </div>

                    <LiveExperimentBand />

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-8 mt-6">
                        <button
                            onClick={() => setActiveFilter('TÜMÜ')}
                            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${activeFilter === 'TÜMÜ'
                                ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'}`}
                        >
                            {lang === 'en' ? 'ALL' : 'TÜMÜ'}
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveFilter(cat.key)}
                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${activeFilter === cat.key
                                    ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'}`}
                            >
                                {cat.icon} {lang === 'en' ? cat.labelEn : cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Certificate Grid */}
                    {activeFilter === 'TÜMÜ' ? (
                        <div className="space-y-10 mb-12">
                            {CATEGORIES.map(cat => {
                                const catCerts = certificates.filter(c => c.category === cat.key);
                                return (
                                    <div key={cat.key}>
                                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase mb-4 flex items-center gap-2"
                                            style={{ color: '#ccff00' }}>
                                            <span>{cat.icon}</span>
                                            <span>{lang === 'en' ? cat.labelEn : cat.label}</span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {catCerts.map(cert => (
                                                <CertCard key={cert.id} cert={cert} lang={lang} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mb-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {certificates.filter(c => c.category === activeFilter).map(cert => (
                                    <CertCard key={cert.id} cert={cert} lang={lang} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sector Pathway Section */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-8">
                        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-2">
                            {lang === 'en' ? 'WHERE SHOULD I START?' : 'HANGİ SERTİFİKADAN BAŞLAMALIYIMi?'}
                        </h2>
                        <p className="text-[11px] text-white/40 mb-5 uppercase tracking-wider">
                            {lang === 'en'
                                ? 'Choose your starting point based on your target sector'
                                : 'Hedef sektörüne göre başlangıç noktanı seç'}
                        </p>
                        <div className="space-y-3">
                            {SECTOR_PATHWAYS.map((p, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="text-base shrink-0">{p.icon}</span>
                                    <div className="flex-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                        <span className="font-black text-sm text-white uppercase">
                                            {lang === 'en' ? p.labelEn : p.label}
                                        </span>
                                        <span className="text-xs text-white/40">→ {p.path}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default SertifikalarPage;
