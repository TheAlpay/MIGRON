import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, RefreshCw, ExternalLink } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';

// ── Varsayılan Sektör Verileri (Firestore fallback) ──────────────────────────
const DEFAULT_SECTORS = [
    {
        id: 'yiyecek', icon: '🍽️',
        name: { tr: 'Yiyecek & İçecek', en: 'Food & Beverage' },
        positions: [
            { tr: 'Kafe Görevlisi / Barista', en: 'Cafe Worker / Barista', hourly: '$25–31', weekly: '$950–1,150' },
            { tr: 'Restoran Garson', en: 'Restaurant Waiter', hourly: '$25–32', weekly: '$950–1,200' },
            { tr: 'Aşçı Yardımcısı', en: 'Kitchen Hand', hourly: '$26–32', weekly: '$980–1,200' },
            { tr: 'Sous Chef', en: 'Sous Chef', hourly: '$32–40', weekly: '$1,200–1,500' },
            { tr: 'Head Chef', en: 'Head Chef', hourly: '$40–55', weekly: '$1,500–2,100' },
        ],
    },
    {
        id: 'insaat', icon: '🏗️',
        name: { tr: 'İnşaat & Saha', en: 'Construction & Site' },
        positions: [
            { tr: 'Genel İşçi', en: 'General Labourer', hourly: '$30–38', weekly: '$1,100–1,450' },
            { tr: 'Forklift Operatörü', en: 'Forklift Operator', hourly: '$32–42', weekly: '$1,200–1,600' },
            { tr: 'Traffic Controller', en: 'Traffic Controller', hourly: '$38–50', weekly: '$1,450–1,900' },
            { tr: 'Elektrikçi', en: 'Electrician', hourly: '$48–70', weekly: '$1,800–2,650', note: { tr: 'En çok aranan meslek', en: 'Most in-demand trade' } },
            { tr: 'İnşaat Mühendisi', en: 'Civil Engineer', hourly: '$55–80', weekly: '$2,100–3,050' },
        ],
    },
    {
        id: 'guvenlik', icon: '🛡️',
        name: { tr: 'Güvenlik', en: 'Security' },
        positions: [
            { tr: 'Güvenlik Görevlisi', en: 'Security Guard', hourly: '$30–38', weekly: '$1,100–1,450' },
            { tr: 'Gece Kulübü Güvenliği', en: 'Crowd Controller', hourly: '$38–50', weekly: '$1,450–1,900' },
            { tr: 'Güvenlik Süpervizörü', en: 'Security Supervisor', hourly: '$42–55', weekly: '$1,600–2,100' },
        ],
    },
    {
        id: 'it', icon: '💻',
        name: { tr: 'IT & Teknoloji', en: 'IT & Technology' },
        positions: [
            { tr: 'IT Destek', en: 'IT Support', hourly: '$38–50', weekly: '$1,450–1,900' },
            { tr: 'Yazılım Geliştirici (Junior)', en: 'Software Developer (Junior)', hourly: '$48–65', weekly: '$1,800–2,500' },
            { tr: 'Yazılım Geliştirici (Mid)', en: 'Software Developer (Mid)', hourly: '$65–90', weekly: '$2,500–3,400' },
            { tr: 'Veri Analisti', en: 'Data Analyst', hourly: '$55–78', weekly: '$2,100–3,000' },
            { tr: 'Siber Güvenlik Uzmanı', en: 'Cybersecurity Specialist', hourly: '$70–100', weekly: '$2,650–3,800' },
        ],
    },
    {
        id: 'saglik', icon: '🏥',
        name: { tr: 'Sağlık & Bakım', en: 'Health & Care' },
        positions: [
            { tr: 'Yaşlı Bakım Görevlisi', en: 'Aged Care Worker', hourly: '$30–40', weekly: '$1,100–1,500' },
            { tr: 'NDIS Destek Görevlisi', en: 'NDIS Support Worker', hourly: '$32–45', weekly: '$1,200–1,700' },
            { tr: 'Hemşire (RN)', en: 'Registered Nurse', hourly: '$43–65', weekly: '$1,650–2,500' },
        ],
    },
    {
        id: 'nakliye', icon: '🚛',
        name: { tr: 'Nakliye & Lojistik', en: 'Transport & Logistics' },
        positions: [
            { tr: 'Depo Görevlisi', en: 'Warehouse Worker', hourly: '$30–38', weekly: '$1,100–1,450' },
            { tr: 'Kamyon Sürücüsü (HR)', en: 'Truck Driver (HR)', hourly: '$38–55', weekly: '$1,450–2,100' },
            { tr: 'Uzun Yol Sürücüsü', en: 'Long-Haul Driver', hourly: '$42–60', weekly: '$1,600–2,300' },
        ],
    },
    {
        id: 'temizlik', icon: '🧹',
        name: { tr: 'Temizlik', en: 'Cleaning' },
        positions: [
            { tr: 'Temizlik Görevlisi', en: 'Cleaner', hourly: '$30–36', weekly: '$1,000–1,350' },
            { tr: 'Endüstriyel Temizlik', en: 'Industrial Cleaner', hourly: '$36–48', weekly: '$1,350–1,800' },
        ],
    },
    {
        id: 'cocuk', icon: '👶',
        name: { tr: 'Çocuk & Eğitim', en: 'Childcare & Education' },
        positions: [
            { tr: 'Çocuk Bakıcısı', en: 'Nanny / Babysitter', hourly: '$26–38', weekly: '$980–1,450' },
            { tr: 'Kreş Görevlisi', en: 'Childcare Worker', hourly: '$30–42', weekly: '$1,100–1,600' },
            { tr: 'İlkokul Öğretmeni', en: 'Primary School Teacher', hourly: '$42–60', weekly: '$1,600–2,280' },
        ],
    },
];

const DEFAULT_FAIR_WORK = {
    hourly: '$24.95',
    weekly: '$948.10',
    effectiveDate: '1 Temmuz 2025',
    effectiveDateEn: '1 July 2025',
};

const MaasRehberiPage = () => {
    const { lang } = useLanguage();
    const [activeFilter, setActiveFilter] = useState('all');
    const [fairWork, setFairWork] = useState(DEFAULT_FAIR_WORK);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fwSnap = await getDoc(doc(db, 'fairwork', 'minimum_wage'));
                if (fwSnap.exists()) {
                    const d = fwSnap.data();
                    setFairWork({
                        hourly: d.hourly || DEFAULT_FAIR_WORK.hourly,
                        weekly: d.weekly || DEFAULT_FAIR_WORK.weekly,
                        effectiveDate: d.effective_date || DEFAULT_FAIR_WORK.effectiveDate,
                        effectiveDateEn: d.effective_date_en || DEFAULT_FAIR_WORK.effectiveDateEn,
                    });
                }
                const rehberSnap = await getDoc(doc(db, 'maas_rehberi', 'meta'));
                if (rehberSnap.exists() && rehberSnap.data().updatedAt) {
                    const ts = rehberSnap.data().updatedAt;
                    setLastUpdated(ts.toDate ? ts.toDate() : new Date(ts));
                }
            } catch { /* fallback */ }
            setLoading(false);
        };
        fetchData();
    }, []);

    const filters = [
        { id: 'all', label: { tr: 'Tümü', en: 'All' } },
        ...DEFAULT_SECTORS.map(s => ({ id: s.id, label: s.name })),
    ];

    const visibleSectors = activeFilter === 'all'
        ? DEFAULT_SECTORS
        : DEFAULT_SECTORS.filter(s => s.id === activeFilter);

    return (
        <>
            <SEOHead
                title={lang === 'en' ? 'Australia Salary Guide 2026' : 'Avustralya Maaş Rehberi 2026'}
                description={lang === 'en'
                    ? 'Sector-by-sector average wages in Australia. Hourly and weekly rates for 2026.'
                    : 'Avustralya\'da sektör bazlı ortalama ücretler. 2026 saatlik ve haftalık maaş rehberi.'}
                path="/maas-rehberi"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[900px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} />
                                {lang === 'en' ? 'Back to Home' : 'Anasayfaya Dön'}
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                {lang === 'en' ? 'SALARY GUIDE' : 'MAAŞ REHBERİ'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <DollarSign className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                {lang === 'en' ? 'SALARY GUIDE' : 'MAAŞ REHBERİ'}
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                            {lang === 'en'
                                ? 'Sector-by-sector average wages in Australia. Hourly and weekly rates for 2026. All figures are estimates — casual workers receive an additional 25% loading.'
                                : 'Avustralya\'da sektör bazlı ortalama ücretler — 2026. Tüm rakamlar tahmindir. Casual çalışanlar %25 loading alır. Fazla mesai dahil değildir.'}
                        </p>
                        {lastUpdated && (
                            <p className="text-[10px] text-white/25 mt-2 flex items-center gap-1.5">
                                <RefreshCw size={9} />
                                {lang === 'en' ? 'Last updated:' : 'Son güncelleme:'} {lastUpdated.toLocaleDateString(lang === 'en' ? 'en-AU' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        )}
                    </div>
                </section>

                <div className="max-w-[900px] mx-auto px-6 py-8">

                    {/* Fair Work Box */}
                    <div className="border border-[#ccff00]/30 bg-[#ccff00]/5 p-5 mb-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-2">
                                    {lang === 'en' ? '⚖️ FAIR WORK MINIMUM WAGES' : '⚖️ FAIR WORK MİNİMUM ÜCRET'}
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold mb-0.5">
                                            {lang === 'en' ? 'Hourly' : 'Saatlik'}
                                        </p>
                                        <p className="text-2xl font-black text-white">{loading ? '...' : fairWork.hourly}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold mb-0.5">
                                            {lang === 'en' ? 'Weekly' : 'Haftalık'}
                                        </p>
                                        <p className="text-2xl font-black text-white">{loading ? '...' : fairWork.weekly}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold mb-1">
                                    {lang === 'en' ? 'Effective from' : 'Geçerlilik tarihi'}
                                </p>
                                <p className="text-sm font-black text-white/70">
                                    {loading ? '...' : (lang === 'en' ? fairWork.effectiveDateEn : fairWork.effectiveDate)}
                                </p>
                                <a
                                    href="https://www.fairwork.gov.au/pay-and-wages/minimum-wages"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[9px] text-[#ccff00]/60 hover:text-[#ccff00] transition-colors mt-1"
                                >
                                    fairwork.gov.au <ExternalLink size={8} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Sector Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 transition-all border ${activeFilter === f.id
                                    ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                    : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                                    }`}
                            >
                                {typeof f.label === 'string' ? f.label : (lang === 'en' ? f.label.en : f.label.tr)}
                            </button>
                        ))}
                    </div>

                    {/* Sector Tables */}
                    <div className="space-y-6">
                        {visibleSectors.map(sector => (
                            <div key={sector.id} className="bg-[#111] border border-white/5">
                                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
                                    <span className="text-xl">{sector.icon}</span>
                                    <h2 className="text-sm font-black uppercase tracking-wider text-white">
                                        {lang === 'en' ? sector.name.en : sector.name.tr}
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="text-left px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                                    {lang === 'en' ? 'Position' : 'Pozisyon'}
                                                </th>
                                                <th className="text-right px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/25 whitespace-nowrap">
                                                    {lang === 'en' ? 'Hourly' : 'Saatlik'}
                                                </th>
                                                <th className="text-right px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/25 whitespace-nowrap">
                                                    {lang === 'en' ? 'Weekly' : 'Haftalık'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sector.positions.map((pos, i) => (
                                                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                                                    <td className="px-5 py-3">
                                                        <span className="text-sm text-white/70 font-medium">
                                                            {lang === 'en' ? pos.en : pos.tr}
                                                        </span>
                                                        {pos.note && (
                                                            <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-[#ccff00]/70 border border-[#ccff00]/30 px-1.5 py-0.5">
                                                                {lang === 'en' ? pos.note.en : pos.note.tr}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="text-sm font-black text-[#ccff00]">{pos.hourly}</span>
                                                    </td>
                                                    <td className="px-5 py-3 text-right">
                                                        <span className="text-sm font-black text-white">{pos.weekly}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info box */}
                    <div className="border border-white/5 bg-[#111] p-5 mt-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">
                            {lang === 'en' ? 'ℹ️ NOTES' : 'ℹ️ NOTLAR'}
                        </p>
                        <ul className="space-y-1.5">
                            {(lang === 'en' ? [
                                'All figures are 2026 estimates sourced from Fair Work, ABS, and Seek.com.au.',
                                'Casual workers receive an additional 25% casual loading on top of the base rate.',
                                'Overtime rates are not included.',
                                'Rates may vary by state, enterprise agreement, or individual contract.',
                            ] : [
                                'Tüm rakamlar Fair Work, ABS ve Seek.com.au kaynaklı 2026 tahminleridir.',
                                'Casual çalışanlar temel ücrete ek olarak %25 casual loading alır.',
                                'Fazla mesai ücretleri dahil değildir.',
                                'Ücretler eyalete, kurumsal anlaşmaya veya bireysel sözleşmeye göre farklılık gösterebilir.',
                            ]).map((note, i) => (
                                <li key={i} className="text-xs text-white/40 leading-relaxed flex items-start gap-2">
                                    <span className="text-[#ccff00]/40 mt-0.5">—</span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related links */}
                    <div className="bg-[#111] border border-white/5 p-6 mt-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                            {lang === 'en' ? "WHAT'S NEXT?" : 'SIRA NE?'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/pr-yol-haritasi"
                                className="flex-1 px-4 py-3 border border-[#ccff00]/30 text-[#ccff00] text-xs font-black uppercase tracking-wider hover:bg-[#ccff00]/10 transition-all text-center"
                            >
                                {lang === 'en' ? 'PR Roadmap →' : 'PR Yol Haritası →'}
                            </Link>
                            <Link
                                to="/sertifikalar"
                                className="flex-1 px-4 py-3 border border-white/10 text-white/50 text-xs font-black uppercase tracking-wider hover:border-white/30 hover:text-white/70 transition-all text-center"
                            >
                                {lang === 'en' ? 'Certificates Guide →' : 'Sertifikalar Rehberi →'}
                            </Link>
                        </div>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default MaasRehberiPage;
