import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, Home, DollarSign, Users, X, RefreshCw } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLanguage } from '../../i18n/LanguageContext';

// SVG coordinate mapping: viewBox "0 0 100 83"
// x = (lng - 113) / 41 * 100
// y = (|lat| - 10) / 34 * 83
const CITIES = [
    {
        id: 'darwin', name: 'Darwin', state: 'NT',
        svgX: 43.5, svgY: 6, labelDx: 1.5, labelDy: -1,
        color: '#10b981', population: '150,000',
        avgRent: '$1,600/mo', avgSalary: '$2,200/wk',
        costIndex: { tr: 'Orta', en: 'Moderate' },
        climate: { tr: 'Tropikal', en: 'Tropical' },
        occupations: {
            tr: [
                { title: 'Sağlık Çalışanı', demand: 98 }, { title: 'İnşaat Uzmanı', demand: 94 },
                { title: 'Öğretmen', demand: 90 }, { title: 'Mühendis', demand: 87 }, { title: 'Sosyal Hizmet', demand: 85 },
            ],
            en: [
                { title: 'Healthcare Worker', demand: 98 }, { title: 'Construction Specialist', demand: 94 },
                { title: 'Teacher', demand: 90 }, { title: 'Engineer', demand: 87 }, { title: 'Social Services', demand: 85 },
            ],
        },
        desc: { tr: 'Uzak bölge bonuslarıyla en yüksek maaş imkânı. 491 bölgesel vizesi için ideal.', en: 'Remote area bonuses with highest salary opportunities. Ideal for the 491 regional visa.' },
    },
    {
        id: 'perth', name: 'Perth', state: 'WA',
        svgX: 7, svgY: 53.5, labelDx: 1.5, labelDy: -1,
        color: '#f59e0b', population: '2.1M',
        avgRent: '$1,750/mo', avgSalary: '$2,050/wk',
        costIndex: { tr: 'Orta', en: 'Moderate' },
        climate: { tr: 'Akdeniz', en: 'Mediterranean' },
        occupations: {
            tr: [
                { title: 'Maden Mühendisi', demand: 99 }, { title: 'Jeolog', demand: 96 },
                { title: 'Makine Mühendisi', demand: 92 }, { title: 'Kaynak Uzmanı', demand: 88 }, { title: 'Hemşire', demand: 87 },
            ],
            en: [
                { title: 'Mining Engineer', demand: 99 }, { title: 'Geologist', demand: 96 },
                { title: 'Mechanical Engineer', demand: 92 }, { title: 'Welding Specialist', demand: 88 }, { title: 'Nurse', demand: 87 },
            ],
        },
        desc: { tr: 'Madencilik başkenti. En yüksek maaşlarla en izole büyük şehir.', en: 'The mining capital. Highest salaries in the most isolated major city.' },
    },
    {
        id: 'adelaide', name: 'Adelaide', state: 'SA',
        svgX: 62.4, svgY: 60.9, labelDx: 1.5, labelDy: -1,
        color: '#a78bfa', population: '1.4M',
        avgRent: '$1,500/mo', avgSalary: '$1,800/wk',
        costIndex: { tr: 'Düşük-Orta', en: 'Low-Mod' },
        climate: { tr: 'Akdeniz', en: 'Mediterranean' },
        occupations: {
            tr: [
                { title: 'Savunma/Defence', demand: 95 }, { title: 'Hemşire', demand: 92 },
                { title: 'Yazılım Geliştirici', demand: 86 }, { title: 'Öğretmen', demand: 83 }, { title: 'Gıda Teknolojisti', demand: 78 },
            ],
            en: [
                { title: 'Defence Industry', demand: 95 }, { title: 'Nurse', demand: 92 },
                { title: 'Software Developer', demand: 86 }, { title: 'Teacher', demand: 83 }, { title: 'Food Technologist', demand: 78 },
            ],
        },
        desc: { tr: 'Yaşam kalitesinin en yüksek şehri. Savunma sanayii ve tarım sektörü güçlü.', en: 'Best quality of life. Strong defence industry and agriculture sector.' },
    },
    {
        id: 'melbourne', name: 'Melbourne', state: 'VIC',
        svgX: 77.9, svgY: 67.5, labelDx: -12, labelDy: -1.5,
        color: '#00d4ff', population: '5.1M',
        avgRent: '$1,900/mo', avgSalary: '$2,000/wk',
        costIndex: { tr: 'Orta-Yüksek', en: 'Mod-High' },
        climate: { tr: 'Dört Mevsim', en: 'Four Seasons' },
        occupations: {
            tr: [
                { title: 'Mühendis', demand: 96 }, { title: 'Hemşire', demand: 94 },
                { title: 'Öğretmen', demand: 90 }, { title: 'Veri Analisti', demand: 87 }, { title: 'Mimar', demand: 80 },
            ],
            en: [
                { title: 'Engineer', demand: 96 }, { title: 'Nurse', demand: 94 },
                { title: 'Teacher', demand: 90 }, { title: 'Data Analyst', demand: 87 }, { title: 'Architect', demand: 80 },
            ],
        },
        desc: { tr: 'Kültür, sanat ve eğitim merkezi. İkinci büyük şehir, düşük yaşam maliyetiyle öne çıkıyor.', en: 'Culture, arts and education hub. Second largest city, known for lower cost of living.' },
    },
    {
        id: 'canberra', name: 'Canberra', state: 'ACT',
        svgX: 88.1, svgY: 61.9, labelDx: -12, labelDy: -1.5,
        color: '#ec4899', population: '460,000',
        avgRent: '$1,900/mo', avgSalary: '$2,300/wk',
        costIndex: { tr: 'Orta-Yüksek', en: 'Mod-High' },
        climate: { tr: 'Karasal', en: 'Continental' },
        occupations: {
            tr: [
                { title: 'Kamu Görevlisi', demand: 99 }, { title: 'Bilişim Uzmanı', demand: 95 },
                { title: 'Politika Analisti', demand: 90 }, { title: 'Mühendis', demand: 85 }, { title: 'Araştırmacı', demand: 82 },
            ],
            en: [
                { title: 'Civil Servant', demand: 99 }, { title: 'IT Specialist', demand: 95 },
                { title: 'Policy Analyst', demand: 90 }, { title: 'Engineer', demand: 85 }, { title: 'Researcher', demand: 82 },
            ],
        },
        desc: { tr: "Avustralya'nın başkenti. En yüksek ortalama maaş, güvenli ve planlı şehir.", en: "Australia's capital. Highest average salary, safe and planned city." },
    },
    {
        id: 'sydney', name: 'Sydney', state: 'NSW',
        svgX: 93.2, svgY: 58.4, labelDx: 1.5, labelDy: -1,
        color: '#ccff00', population: '5.3M',
        avgRent: '$2,200/mo', avgSalary: '$2,100/wk',
        costIndex: { tr: 'Yüksek', en: 'High' },
        climate: { tr: 'Ilıman', en: 'Temperate' },
        occupations: {
            tr: [
                { title: 'Yazılım Geliştirici', demand: 98 }, { title: 'Hemşire', demand: 95 },
                { title: 'Muhasebeci', demand: 88 }, { title: 'İnşaat Mühendisi', demand: 85 }, { title: 'Öğretmen', demand: 82 },
            ],
            en: [
                { title: 'Software Developer', demand: 98 }, { title: 'Nurse', demand: 95 },
                { title: 'Accountant', demand: 88 }, { title: 'Civil Engineer', demand: 85 }, { title: 'Teacher', demand: 82 },
            ],
        },
        desc: { tr: "Avustralya'nın en büyük şehri. Finans, teknoloji ve hizmet sektörü dominant.", en: "Australia's largest city. Finance, technology and services sector dominant." },
    },
    {
        id: 'brisbane', name: 'Brisbane', state: 'QLD',
        svgX: 97.6, svgY: 42.6, labelDx: -12, labelDy: -1.5,
        color: '#ff6b6b', population: '2.6M',
        avgRent: '$1,850/mo', avgSalary: '$1,850/wk',
        costIndex: { tr: 'Orta', en: 'Moderate' },
        climate: { tr: 'Subtropikal', en: 'Subtropical' },
        occupations: {
            tr: [
                { title: 'İnşaat Mühendisi', demand: 97 }, { title: 'Hemşire', demand: 93 },
                { title: 'Maden Mühendisi', demand: 88 }, { title: 'Elektrikçi', demand: 85 }, { title: 'Yazılım Geliştirici', demand: 82 },
            ],
            en: [
                { title: 'Civil Engineer', demand: 97 }, { title: 'Nurse', demand: 93 },
                { title: 'Mining Engineer', demand: 88 }, { title: 'Electrician', demand: 85 }, { title: 'Software Developer', demand: 82 },
            ],
        },
        desc: { tr: '2032 Olimpiyat şehri. İnşaat patlaması, güneşli iklim ve büyüyen ekonomi.', en: '2032 Olympic city. Construction boom, sunny climate and growing economy.' },
    },
    {
        id: 'hobart', name: 'Hobart', state: 'TAS',
        svgX: 83.7, svgY: 80.3, labelDx: 1.5, labelDy: -1,
        color: '#6366f1', population: '240,000',
        avgRent: '$1,500/mo', avgSalary: '$1,750/wk',
        costIndex: { tr: 'Düşük', en: 'Low' },
        climate: { tr: 'Serin', en: 'Cool' },
        occupations: {
            tr: [
                { title: 'Hemşire', demand: 96 }, { title: 'Öğretmen', demand: 92 },
                { title: 'İnşaat Uzmanı', demand: 88 }, { title: 'Turizm Çalışanı', demand: 82 }, { title: 'Tarım Uzmanı', demand: 79 },
            ],
            en: [
                { title: 'Nurse', demand: 96 }, { title: 'Teacher', demand: 92 },
                { title: 'Construction Specialist', demand: 88 }, { title: 'Tourism Worker', demand: 82 }, { title: 'Agriculture Specialist', demand: 79 },
            ],
        },
        desc: { tr: 'En düşük yaşam maliyeti. 491/190 vizesi için kolaylık. Doğa ve sakinlik.', en: 'Lowest cost of living. Easy pathway for 491/190 visa. Nature and tranquility.' },
    },
];

// Australia SVG outline (viewBox 0 0 100 83)
const AUSTRALIA_PATH = "M 0.5,39 L 13.7,25 L 22.4,19 L 33.5,11 L 43.5,6 L 41,14 L 43,16 L 49,12 L 55,16 L 57,14 L 65,8 L 79.5,1.5 L 80,17 L 82.2,22.5 L 88.2,27 L 97.6,42.6 L 93.2,58.4 L 90.2,66.6 L 81.5,71.2 L 74.4,70.7 L 67.3,68.5 L 39,57 L 24.9,58 L 11.9,61 L 5,59.6 Z";
const TAS_PATH = "M 83,77 L 86,76 L 88,79 L 86,82 L 83,82 Z";

const AustraliaMap = () => {
    const [selected, setSelected] = useState(null);
    const [cityOverrides, setCityOverrides] = useState({});
    const { t, lang } = useLanguage();

    // Firestore'dan kira/maaş verilerini çek (24h cache via sessionStorage)
    useEffect(() => {
        const CACHE_KEY = 'migron_city_data';
        const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 saat
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, ts } = JSON.parse(cached);
                if (Date.now() - ts < CACHE_TTL) { setCityOverrides(data); return; }
            }
        } catch { }
        const fetch = async () => {
            try {
                const snap = await getDocs(collection(db, 'cities'));
                const data = {};
                snap.forEach(d => { data[d.id] = d.data(); });
                if (Object.keys(data).length > 0) {
                    setCityOverrides(data);
                    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch { }
                }
            } catch { /* Firestore yoksa hardcoded veriler kullanılır */ }
        };
        fetch();
    }, []);

    return (
        <section className="max-w-[1600px] mx-auto px-6 py-24">
            <div className="mb-12">
                <p className="text-[10px] font-black tracking-[0.4em] text-[#ccff00] uppercase mb-4">{t('map_section_label')}</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                        {t('map_title_bold')} <span className="text-[#ccff00] italic">{t('map_title_italic')}</span>
                    </h2>
                    <p className="text-sm text-white/40 max-w-sm">{t('map_subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Map */}
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-4">
                    <p className="text-[9px] text-white/20 font-mono uppercase tracking-widest mb-3">
                        {t('map_source')}
                    </p>
                    <svg
                        viewBox="-2 -2 106 87"
                        className="w-full"
                        style={{ aspectRatio: '106/87' }}
                        aria-label="Australia interactive map"
                    >
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
                            </pattern>
                        </defs>
                        <rect x="-2" y="-2" width="110" height="91" fill="url(#grid)" />

                        {/* Australia mainland outline */}
                        <path
                            d={AUSTRALIA_PATH}
                            fill="#ccff00"
                            fillOpacity="0.04"
                            stroke="#ccff00"
                            strokeWidth="0.35"
                            strokeOpacity="0.35"
                            strokeLinejoin="round"
                        />
                        {/* Tasmania */}
                        <path
                            d={TAS_PATH}
                            fill="#ccff00"
                            fillOpacity="0.04"
                            stroke="#ccff00"
                            strokeWidth="0.35"
                            strokeOpacity="0.25"
                        />

                        {/* City dots + labels */}
                        {CITIES.map(city => {
                            const isSelected = selected?.id === city.id;
                            return (
                                <g
                                    key={city.id}
                                    onClick={() => setSelected(isSelected ? null : city)}
                                    style={{ cursor: 'pointer' }}
                                    role="button"
                                    aria-label={city.name}
                                >
                                    <circle cx={city.svgX} cy={city.svgY} r="2.5" fill={city.color} fillOpacity="0.15">
                                        <animate attributeName="r" values="1.5;3.5;1.5" dur="2.5s" repeatCount="indefinite" />
                                        <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
                                    </circle>
                                    <circle
                                        cx={city.svgX} cy={city.svgY}
                                        r={isSelected ? 2 : 1.5}
                                        fill={isSelected ? city.color : '#050505'}
                                        stroke={city.color}
                                        strokeWidth="0.6"
                                    />
                                    <text
                                        x={city.svgX + city.labelDx}
                                        y={city.svgY + city.labelDy}
                                        fontSize="2.2"
                                        fontWeight="900"
                                        fill={city.color}
                                        fontFamily="Arial, sans-serif"
                                        style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}
                                    >
                                        {city.name}
                                    </text>
                                    <text
                                        x={city.svgX + city.labelDx}
                                        y={city.svgY + city.labelDy + 2.4}
                                        fontSize="1.6"
                                        fill={city.color}
                                        fillOpacity="0.45"
                                        fontFamily="Arial, sans-serif"
                                        fontWeight="bold"
                                    >
                                        {city.state}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                    <div className="text-right mt-1">
                        <span className="text-[8px] text-white/15 font-mono">{CITIES.length} {t('map_legend')}</span>
                    </div>
                </div>

                {/* City detail panel */}
                <div className="lg:col-span-1">
                    {selected ? (
                        <div className="bg-[#111] border border-white/5 h-full p-6" style={{ borderTop: `3px solid ${selected.color}` }}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: selected.color }}>
                                        {selected.name}
                                    </h3>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                        {selected.state} · {selected.climate[lang] || selected.climate.en}
                                    </p>
                                </div>
                                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white p-1">
                                    <X size={16} />
                                </button>
                            </div>
                            <p className="text-sm text-white/50 mb-6 leading-relaxed">
                                {selected.desc[lang] || selected.desc.en}
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {(() => {
                                    const ov = cityOverrides[selected.id] || {};
                                    return [
                                        { icon: Users, label: t('map_stat_population'), value: selected.population },
                                        { icon: Home, label: t('map_stat_rent'), value: ov.rent || selected.avgRent },
                                        { icon: DollarSign, label: t('map_stat_salary'), value: ov.salary || selected.avgSalary },
                                        { icon: MapPin, label: t('map_stat_cost'), value: selected.costIndex[lang] || selected.costIndex.en },
                                    ];
                                })().map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-black/30 p-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Icon size={10} style={{ color: selected.color }} />
                                            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{label}</span>
                                        </div>
                                        <p className="text-sm font-black text-white">{value}</p>
                                    </div>
                                ))}
                            </div>
                            {cityOverrides[selected.id]?.updatedAt && (
                                <p className="text-[8px] text-white/15 flex items-center gap-1 mb-4">
                                    <RefreshCw size={7} />
                                    {lang === 'en' ? 'Data updated:' : 'Veri güncellendi:'}{' '}
                                    {(() => {
                                        const ts = cityOverrides[selected.id].updatedAt;
                                        const d = ts?.toDate ? ts.toDate() : new Date(ts);
                                        return d.toLocaleDateString(lang === 'en' ? 'en-AU' : 'tr-TR', { month: 'short', year: 'numeric' });
                                    })()}
                                </p>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Briefcase size={12} style={{ color: selected.color }} />
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{t('map_occupations_label')}</p>
                                </div>
                                <div className="space-y-2">
                                    {(selected.occupations[lang] || selected.occupations.en).map((occ, i) => (
                                        <div key={occ.title}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white/70 font-medium">{i + 1}. {occ.title}</span>
                                                <span className="font-black" style={{ color: selected.color }}>{occ.demand}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 overflow-hidden">
                                                <div className="h-full transition-all duration-700" style={{ width: `${occ.demand}%`, backgroundColor: selected.color, opacity: 0.7 }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#111] border border-white/5 h-full p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
                            <MapPin size={32} className="text-white/10 mb-4" />
                            <p className="text-white/20 font-black uppercase tracking-widest text-sm">{t('map_placeholder_title')}</p>
                            <p className="text-white/10 text-xs mt-2">{t('map_placeholder_desc')}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AustraliaMap;
