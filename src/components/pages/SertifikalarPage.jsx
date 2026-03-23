import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, AlertCircle, MapPin, Clock, DollarSign, Monitor, Users } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';
import LiveExperimentBand from '../shared/LiveExperimentBand';

const PRIORITY_CONFIG = {
    'ACİL': { label: 'ACİL', labelEn: 'URGENT', color: '#00ff88', bg: '#00ff8815' },
    'İLK AY': { label: 'İLK AY', labelEn: 'FIRST MONTH', color: '#ccff00', bg: '#ccff0015' },
    'İLERİDE': { label: 'İLERİDE', labelEn: 'LATER', color: '#666', bg: '#66666615' },
};

const certificates = [
    {
        id: 'rsa',
        name: 'RSA — Responsible Service of Alcohol',
        nameEn: 'RSA — Responsible Service of Alcohol',
        code: 'SITHFAB021',
        sectors: ['bar', 'restoran', 'kafe', 'etkinlik'],
        sectorsEn: ['bar', 'restaurant', 'café', 'events'],
        mandatory: true,
        cost: '$50–80',
        duration: '4–6 saat',
        durationEn: '4–6 hours',
        how: 'Online',
        howEn: 'Online',
        where: "Queensland'da SITHFAB021 koduyla akredite kurumlar",
        whereEn: 'Accredited providers in Queensland — search SITHFAB021',
        tafe: true,
        note: "Avustralya'daki en ucuz ve en çok kapı açan sertifika. İlk iş başvurularında neredeyse şart.",
        noteEn: "Australia's cheapest and most door-opening certificate. Almost essential for first job applications.",
        priority: 'ACİL',
    },
    {
        id: 'whitecard',
        name: 'White Card — Construction Induction',
        nameEn: 'White Card — Construction Induction',
        sectors: ['inşaat', 'peyzaj', 'tadilat', 'yol çalışması'],
        sectorsEn: ['construction', 'landscaping', 'renovation', 'roadworks'],
        mandatory: true,
        cost: '$60–100',
        duration: 'Yarım gün',
        durationEn: 'Half day',
        how: 'Online veya yüz yüze',
        howEn: 'Online or in-person',
        where: "Brisbane'de akredite iş güvenliği kursları — 'White Card course Brisbane' diye ara",
        whereEn: "Accredited work safety courses in Brisbane — search 'White Card course Brisbane'",
        tafe: true,
        note: 'İnşaat sahasına adım atmak için yasal zorunluluk.',
        noteEn: 'A legal requirement to set foot on any construction site.',
        priority: 'ACİL',
    },
    {
        id: 'barista',
        name: 'Barista Sertifikası',
        nameEn: 'Barista Certificate',
        sectors: ['kafe', 'restoran', 'otel', 'catering'],
        sectorsEn: ['café', 'restaurant', 'hotel', 'catering'],
        mandatory: false,
        cost: '$150–200',
        duration: '1 gün',
        durationEn: '1 day',
        how: 'Yüz yüze',
        howEn: 'In-person',
        where: "Brisbane akredite barista okulları, TAFE Queensland",
        whereEn: 'Accredited barista schools in Brisbane, TAFE Queensland',
        tafe: true,
        note: "Avustralya'da kahve kültürü son derece güçlü. İş görüşmelerinde 'flat white yapabilir misin?' sorusu gerçek bir soru. Bu sertifika olmadan kafe işi bulmak ciddi şekilde zorlaşıyor.",
        noteEn: "Coffee culture is huge in Australia. 'Can you make a flat white?' is a real interview question. Getting café work without this certificate is seriously difficult.",
        priority: 'ACİL',
    },
    {
        id: 'foodsafety',
        name: 'Food Safety Certificate — Food Handler',
        nameEn: 'Food Safety Certificate — Food Handler',
        sectors: ['mutfak', 'kafe', 'fast food', 'catering'],
        sectorsEn: ['kitchen', 'café', 'fast food', 'catering'],
        mandatory: false,
        cost: '$20–50',
        duration: '2–3 saat',
        durationEn: '2–3 hours',
        how: 'Online',
        howEn: 'Online',
        where: "'Food Handler Certificate Queensland' diye ara",
        whereEn: "Search 'Food Handler Certificate Queensland'",
        tafe: true,
        note: 'Neredeyse bedava, mutfakla ilgili her kapıyı açar.',
        noteEn: 'Almost free — opens every door in food and kitchen work.',
        priority: 'ACİL',
    },
    {
        id: 'firstaid',
        name: 'First Aid Certificate — HLTAID011',
        nameEn: 'First Aid Certificate — HLTAID011',
        sectors: ['güvenlik', 'çocuk bakımı', 'spor tesisleri', 'hastane', 'neredeyse her sektör'],
        sectorsEn: ['security', 'childcare', 'sports facilities', 'hospital', 'almost every sector'],
        mandatory: false,
        cost: '$100–150',
        duration: '1 gün',
        durationEn: '1 day',
        how: 'Yüz yüze',
        howEn: 'In-person',
        where: 'St John Ambulance Brisbane',
        whereEn: 'St John Ambulance Brisbane',
        tafe: true,
        note: "Her sektörde artı puan. CV'de her zaman olumlu etki yaratır.",
        noteEn: "A plus point in every sector. Always makes a positive impression on your CV.",
        priority: 'İLK AY',
    },
    {
        id: 'rsg',
        name: 'RSG — Responsible Service of Gambling',
        nameEn: 'RSG — Responsible Service of Gambling',
        sectors: ['casino', 'TAB', 'slot makinesi olan mekanlar'],
        sectorsEn: ['casino', 'TAB', 'venues with gaming machines'],
        mandatory: true,
        cost: '$30–50',
        duration: '2–3 saat',
        durationEn: '2–3 hours',
        how: 'Online',
        howEn: 'Online',
        where: 'Queensland akredite platformlar',
        whereEn: 'Queensland accredited platforms',
        tafe: false,
        note: "RSA aldıktan sonra RSG de alırsan hospitality sektöründe 'full package' olursun.",
        noteEn: "If you get RSG after RSA, you become a 'full package' candidate in hospitality.",
        priority: 'İLK AY',
    },
    {
        id: 'security',
        name: 'Security Licence — CPP20218',
        nameEn: 'Security Licence — CPP20218',
        fullName: 'Certificate II in Security Operations',
        sectors: ['güvenlik', 'etkinlik', 'AVM', 'gece kulübü', 'hastane'],
        sectorsEn: ['security', 'events', 'shopping centre', 'nightclub', 'hospital'],
        mandatory: true,
        cost: '$500–800',
        duration: '3–5 gün + background check',
        durationEn: '3–5 days + background check',
        how: 'Yüz yüze',
        howEn: 'In-person',
        where: 'TAFE Queensland veya akredite özel kurumlar',
        whereEn: 'TAFE Queensland or accredited private providers',
        tafe: true,
        note: "Pahalı ve süreçli ama Avustralya'da güvenlik sektörü sürekli eleman arıyor. Hafta sonu çalışılabiliyor, saatlik ücret yüksek. Uzun vadede çok iyi yatırım.",
        noteEn: "Expensive and process-heavy, but Australia's security industry is constantly hiring. Weekend work available, hourly rate is high. A great long-term investment.",
        priority: 'İLK AY',
    },
    {
        id: 'traffic',
        name: 'Traffic Controller — Boom Gate Operatörü',
        nameEn: 'Traffic Controller — Boom Gate Operator',
        sectors: ['inşaat', 'yol çalışması', 'etkinlik'],
        sectorsEn: ['construction', 'roadworks', 'events'],
        mandatory: false,
        cost: '$200–350',
        duration: '1–2 gün',
        durationEn: '1–2 days',
        how: 'Yüz yüze',
        howEn: 'In-person',
        where: 'TAFE Queensland, özel iş güvenliği kursları',
        whereEn: 'TAFE Queensland, private work safety courses',
        tafe: true,
        note: "White Card ile birlikte alınırsa inşaat sektöründe çok daha fazla kapı açar.",
        noteEn: "Combined with White Card, opens far more doors in the construction sector.",
        priority: 'İLK AY',
    },
    {
        id: 'forklift',
        name: 'Forklift Licence — LF',
        nameEn: 'Forklift Licence — LF',
        sectors: ['depo', 'fabrika', 'lojistik'],
        sectorsEn: ['warehouse', 'factory', 'logistics'],
        mandatory: false,
        cost: '$300–500',
        duration: '1–2 gün',
        durationEn: '1–2 days',
        how: 'Yüz yüze',
        howEn: 'In-person',
        where: 'TAFE Queensland, akredite forklift kursları',
        whereEn: 'TAFE Queensland, accredited forklift courses',
        tafe: true,
        note: 'Biraz yatırım ama lojistik sektöründe karşılığını hızlı verir.',
        noteEn: 'A bit of investment, but pays off quickly in the logistics sector.',
        priority: 'İLK AY',
    },
    {
        id: 'comptia_a',
        name: 'CompTIA A+',
        nameEn: 'CompTIA A+',
        sectors: ['IT destek', 'teknik servis'],
        sectorsEn: ['IT support', 'tech service'],
        mandatory: false,
        cost: '$230 USD (sınav ücreti)',
        costEn: '$230 USD (exam fee)',
        duration: 'Kendi hızında + online sınav',
        durationEn: 'Self-paced + online exam',
        how: 'Online sınav',
        howEn: 'Online exam',
        where: 'comptia.org',
        whereEn: 'comptia.org',
        tafe: false,
        note: "Uluslararası tanınan temel IT sertifikası. Türkiye'deki IT deneyimini kağıda döker.",
        noteEn: "Internationally recognised foundational IT certificate. Puts your Turkish IT experience on paper.",
        priority: 'İLERİDE',
    },
    {
        id: 'comptia_n',
        name: 'CompTIA Network+',
        nameEn: 'CompTIA Network+',
        sectors: ['ağ yönetimi', 'IT altyapısı'],
        sectorsEn: ['network management', 'IT infrastructure'],
        mandatory: false,
        cost: '$230 USD (sınav ücreti)',
        costEn: '$230 USD (exam fee)',
        duration: 'Kendi hızında + online sınav',
        durationEn: 'Self-paced + online exam',
        how: 'Online sınav',
        howEn: 'Online exam',
        where: 'comptia.org',
        whereEn: 'comptia.org',
        tafe: false,
        note: "A+'dan sonra mantıklı adım.",
        noteEn: "A logical next step after A+.",
        priority: 'İLERİDE',
    },
];

const priorityOrder = [
    { sira: 1, cert: 'RSA', certEn: 'RSA', reason: 'En ucuz, en çok iş açar', reasonEn: 'Cheapest, opens the most jobs' },
    { sira: 2, cert: 'White Card', certEn: 'White Card', reason: 'Fiziksel iş için yasal zorunluluk', reasonEn: 'Legal requirement for physical work' },
    { sira: 3, cert: 'Barista', certEn: 'Barista', reason: 'Kafe sektörü için kritik, çok hızlı iş bulduruyor', reasonEn: 'Critical for cafés, gets you hired fast' },
    { sira: 4, cert: 'Food Safety', certEn: 'Food Safety', reason: 'Neredeyse bedava, mutfak kapısı açar', reasonEn: 'Almost free — opens kitchen doors' },
    { sira: 5, cert: 'First Aid', certEn: 'First Aid', reason: 'Her sektörde artı puan', reasonEn: 'A plus point in every sector' },
    { sira: 6, cert: 'RSG', certEn: 'RSG', reason: 'RSA aldıktan sonra mantıklı adım', reasonEn: 'Logical next step after RSA' },
    { sira: 7, cert: 'Security Licence', certEn: 'Security Licence', reason: 'Yatırım gerektirir ama yüksek getiri', reasonEn: 'Requires investment but high returns' },
    { sira: 8, cert: 'Forklift', certEn: 'Forklift', reason: 'Lojistik ve depo sektörü için', reasonEn: 'For logistics and warehouse work' },
];

const FILTERS = [
    { key: 'TÜMÜ', labelEn: 'ALL' },
    { key: 'ACİL', labelEn: 'URGENT' },
    { key: 'İLK AY', labelEn: 'FIRST MONTH' },
    { key: 'İLERİDE', labelEn: 'LATER' },
];

const CertCard = ({ cert, lang }) => {
    const p = PRIORITY_CONFIG[cert.priority];
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
                <span
                    className="shrink-0 text-[9px] font-black tracking-[0.2em] uppercase px-2.5 py-1"
                    style={{ backgroundColor: p.bg, color: p.color }}
                >
                    {lang === 'en' ? p.labelEn : p.label}
                </span>
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
                <div className="flex items-start gap-2">
                    <Monitor size={13} className="text-white/20 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                            {lang === 'en' ? 'How' : 'Nasıl'}
                        </p>
                        <p className="text-white/70 font-bold">{lang === 'en' ? cert.howEn : cert.how}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-white/20 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">
                            {lang === 'en' ? 'Where' : 'Nerede'}
                        </p>
                        <p className="text-white/70 font-bold">{lang === 'en' ? cert.whereEn : cert.where}</p>
                    </div>
                </div>
            </div>

            {/* TAFE badge */}
            {cert.tafe && (
                <div className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-[#00d4ff]" />
                    <span className="text-[10px] text-[#00d4ff] font-bold">TAFE Queensland</span>
                </div>
            )}

            {/* Note */}
            <p className="text-xs text-white/40 leading-relaxed border-t border-white/5 pt-3 italic">
                {lang === 'en' ? cert.noteEn : cert.note}
            </p>

            {/* Mandatory badge */}
            {cert.mandatory && (
                <div className="flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-[#ff6b6b]" />
                    <span className="text-[10px] text-[#ff6b6b] font-bold uppercase tracking-wider">
                        {lang === 'en' ? 'Mandatory for this sector' : 'Bu sektörde zorunlu'}
                    </span>
                </div>
            )}
        </div>
    );
};

const SertifikalarPage = () => {
    const { lang } = useLanguage();
    const [activeFilter, setActiveFilter] = useState('TÜMÜ');

    const filtered = activeFilter === 'TÜMÜ'
        ? certificates
        : certificates.filter(c => c.priority === activeFilter);

    return (
        <>
            <SEOHead
                title={lang === 'en' ? "Certificates Guide — Brisbane" : "Brisbane'de İşine Yarayacak Sertifikalar"}
                description={lang === 'en'
                    ? "All certificates that make it easier to find work in Australia, listed in priority order."
                    : "Avustralya'da iş bulmayı kolaylaştıran, öncelik sırasına göre listelenmiş tüm sertifikalar."}
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
                                ? "All certificates that make it easier to find work in Australia, listed in priority order."
                                : "Avustralya'da iş bulmayı kolaylaştıran, öncelik sırasına göre listelenmiş tüm sertifikalar."}
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
                                    ? "TAFE Queensland offers discounts on many certificate courses to people with a valid student visa. Always check before enrolling: tafe.qld.edu.au — Take your student card with you; the discount isn't applied automatically, you need to mention it yourself."
                                    : "TAFE Queensland, geçerli öğrenci vizesine sahip kişilere birçok sertifika kursunda indirim sunuyor. Kayıt olmadan önce mutlaka kontrol et: tafe.qld.edu.au — Öğrenci kartını yanında götür, indirim otomatik uygulanmıyor, kendin belirtmen gerekiyor."}
                            </p>
                        </div>
                    </div>

                    <LiveExperimentBand />

                    {/* Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${activeFilter === f.key
                                    ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'}`}
                            >
                                {lang === 'en' ? f.labelEn : f.key}
                            </button>
                        ))}
                    </div>

                    {/* Certificate Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {filtered.map(cert => (
                            <CertCard key={cert.id} cert={cert} lang={lang} />
                        ))}
                    </div>

                    {/* Priority Order Section */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-8">
                        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-5">
                            {lang === 'en' ? '💰 IF YOUR BUDGET IS LIMITED — PRIORITY ORDER' : '💰 BÜTÇENİ KISITLIYSA ÖNCELİK SIRASI'}
                        </h2>
                        <div className="space-y-3">
                            {priorityOrder.map(item => (
                                <div key={item.sira} className="flex items-start gap-4">
                                    <span className="text-[#ccff00] font-black text-sm w-5 shrink-0">{item.sira}.</span>
                                    <div className="flex-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        <span className="font-black text-sm text-white uppercase">{lang === 'en' ? item.certEn : item.cert}</span>
                                        <span className="text-xs text-white/40">— {lang === 'en' ? item.reasonEn : item.reason}</span>
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
