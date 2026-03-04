import React, { useState } from 'react';
import { MapPin, Briefcase, Home, DollarSign, Users, X } from 'lucide-react';

// Cities positioned as a % within a 600×400 container
// Based on approximate lat/lng mapped to SVG space
const CITIES = [
    {
        id: 'sydney',
        name: 'Sydney',
        state: 'NSW',
        x: 88, y: 66,
        color: '#ccff00',
        population: '5.3 milyon',
        avgRent: '$2.200/ay',
        avgSalary: '$2.100/hafta',
        costIndex: 'Yüksek',
        climate: 'Ilıman',
        occupations: [
            { title: 'Yazılım Geliştirici', demand: 98 },
            { title: 'Hemşire', demand: 95 },
            { title: 'Muhasebeci', demand: 88 },
            { title: 'İnşaat Mühendisi', demand: 85 },
            { title: 'Öğretmen', demand: 82 },
        ],
        desc: "Avustralya'nın en büyük şehri. Finans, teknoloji ve hizmet sektörü dominant.",
    },
    {
        id: 'melbourne',
        name: 'Melbourne',
        state: 'VIC',
        x: 76, y: 80,
        color: '#00d4ff',
        population: '5.1 milyon',
        avgRent: '$1.900/ay',
        avgSalary: '$2.000/hafta',
        costIndex: 'Orta-Yüksek',
        climate: 'Dört Mevsim',
        occupations: [
            { title: 'Mühendis', demand: 96 },
            { title: 'Hemşire+Sağlık', demand: 94 },
            { title: 'Öğretmen', demand: 90 },
            { title: 'Veri Analisti', demand: 87 },
            { title: 'Mimar', demand: 80 },
        ],
        desc: "Kültür, sanat ve eğitim merkezi. İkinci büyük şehir, düşük yaşam maliyetiyle öne çıkıyor.",
    },
    {
        id: 'brisbane',
        name: 'Brisbane',
        state: 'QLD',
        x: 90, y: 45,
        color: '#ff6b6b',
        population: '2.6 milyon',
        avgRent: '$1.850/ay',
        avgSalary: '$1.850/hafta',
        costIndex: 'Orta',
        climate: 'Subtropikal',
        occupations: [
            { title: 'İnşaat Mühendisi', demand: 97 },
            { title: 'Hemşire', demand: 93 },
            { title: 'Maden Mühendisi', demand: 88 },
            { title: 'Elektrikçi', demand: 85 },
            { title: 'Yazılım Geliştirici', demand: 82 },
        ],
        desc: "2032 Olimpiyat şehri. İnşaat patlaması, güneşli iklim ve büyüyen ekonomi.",
    },
    {
        id: 'perth',
        name: 'Perth',
        state: 'WA',
        x: 14, y: 60,
        color: '#f59e0b',
        population: '2.1 milyon',
        avgRent: '$1.750/ay',
        avgSalary: '$2.050/hafta',
        costIndex: 'Orta',
        climate: 'Akdeniz',
        occupations: [
            { title: 'Maden Mühendisi', demand: 99 },
            { title: 'Jeolog', demand: 96 },
            { title: 'Makine Mühendisi', demand: 92 },
            { title: 'Kaynak Uzmanı', demand: 88 },
            { title: 'Hemşire', demand: 87 },
        ],
        desc: "Madencilik başkenti. En yüksek maaşlarla en izole büyük şehir.",
    },
    {
        id: 'adelaide',
        name: 'Adelaide',
        state: 'SA',
        x: 60, y: 70,
        color: '#a78bfa',
        population: '1.4 milyon',
        avgRent: '$1.500/ay',
        avgSalary: '$1.800/hafta',
        costIndex: 'Düşük-Orta',
        climate: 'Akdeniz',
        occupations: [
            { title: 'Savunma/Defence', demand: 95 },
            { title: 'Hemşire', demand: 92 },
            { title: 'Yazılım Geliştirici', demand: 86 },
            { title: 'Öğretmen', demand: 83 },
            { title: 'Gıda Teknolojisti', demand: 78 },
        ],
        desc: "Yaşam kalitesinin en yüksek şehri. Savunma sanayii ve tarım sektörü güçlü.",
    },
    {
        id: 'darwin',
        name: 'Darwin',
        state: 'NT',
        x: 44, y: 8,
        color: '#10b981',
        population: '150.000',
        avgRent: '$1.600/ay',
        avgSalary: '$2.200/hafta',
        costIndex: 'Orta',
        climate: 'Tropikal',
        occupations: [
            { title: 'Sağlık Çalışanı', demand: 98 },
            { title: 'İnşaat Uzmanı', demand: 94 },
            { title: 'Öğretmen', demand: 90 },
            { title: 'Mühendis', demand: 87 },
            { title: 'Sosyal Hizmet', demand: 85 },
        ],
        desc: "Uzak bölge bonuslarıyla en yüksek maaş imkânı. 491 bölgesel vizesi için ideal.",
    },
    {
        id: 'canberra',
        name: 'Canberra',
        state: 'ACT',
        x: 83, y: 72,
        color: '#ec4899',
        population: '460.000',
        avgRent: '$1.900/ay',
        avgSalary: '$2.300/hafta',
        costIndex: 'Orta-Yüksek',
        climate: 'Karasal',
        occupations: [
            { title: 'Kamu Görevlisi', demand: 99 },
            { title: 'Bilişim Uzmanı', demand: 95 },
            { title: 'Politika Analisti', demand: 90 },
            { title: 'Mühendis', demand: 85 },
            { title: 'Araştırmacı', demand: 82 },
        ],
        desc: "Avustralya'nın başkenti. En yüksek ortalama maaş, güvenli ve planlı şehir.",
    },
    {
        id: 'hobart',
        name: 'Hobart',
        state: 'TAS',
        x: 79, y: 93,
        color: '#6366f1',
        population: '240.000',
        avgRent: '$1.500/ay',
        avgSalary: '$1.750/hafta',
        costIndex: 'Düşük',
        climate: 'Serin',
        occupations: [
            { title: 'Hemşire', demand: 96 },
            { title: 'Öğretmen', demand: 92 },
            { title: 'İnşaat Uzmanı', demand: 88 },
            { title: 'Turizm Çalışanı', demand: 82 },
            { title: 'Tarım Uzmanı', demand: 79 },
        ],
        desc: "En düşük yaşam maliyeti. 491/190 vizesi için colonisationkolaylığı. Doğa ve sakinlik.",
    },
];

const AustraliaMap = () => {
    const [selected, setSelected] = useState(null);

    return (
        <section className="max-w-[1600px] mx-auto px-6 py-24">
            {/* Header */}
            <div className="mb-12">
                <p className="text-[10px] font-black tracking-[0.4em] text-[#ccff00] uppercase mb-4">İnteraktif Harita</p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                        AVUSTRALYA <span className="text-[#ccff00] italic">ŞEHİRLERİ</span>
                    </h2>
                    <p className="text-sm text-white/40 max-w-sm">
                        Şehre tıkla: kira, maaş ve o şehirdeki en çok talep edilen meslekleri gör.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className="lg:col-span-2">
                    <div
                        className="relative bg-[#0a0a0a] border border-white/5 overflow-hidden"
                        style={{ paddingTop: '66%' }}
                    >
                        <div className="absolute inset-0">
                            {/* Grid background */}
                            <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#mapgrid)" />
                            </svg>

                            {/* AU rough outline as abstract element */}
                            <div className="absolute inset-4 border border-white/5 rounded-sm" />

                            {/* Label */}
                            <p className="absolute top-3 left-4 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                AVUSTRALYA — 2025 VERİLERİ
                            </p>

                            {/* City dots */}
                            {CITIES.map(city => (
                                <button
                                    key={city.id}
                                    onClick={() => setSelected(selected?.id === city.id ? null : city)}
                                    className="absolute group"
                                    style={{ left: `${city.x}%`, top: `${city.y}%`, transform: 'translate(-50%, -50%)' }}
                                    aria-label={`${city.name} şehir detayları`}
                                >
                                    {/* Ping animation */}
                                    <span className="absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping"
                                        style={{ backgroundColor: city.color }} />
                                    {/* Dot */}
                                    <span
                                        className="relative inline-flex w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-150"
                                        style={{
                                            backgroundColor: selected?.id === city.id ? city.color : 'black',
                                            borderColor: city.color,
                                        }}
                                    />
                                    {/* Label */}
                                    <span
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black whitespace-nowrap uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                        style={{ color: city.color }}
                                    >
                                        {city.name}
                                    </span>
                                </button>
                            ))}

                            {/* Legend */}
                            <div className="absolute bottom-3 right-3 text-[9px] text-white/20 font-mono">
                                {CITIES.length} şehir · Tıkla
                            </div>
                        </div>
                    </div>

                    {/* City list on mobile */}
                    <div className="flex flex-wrap gap-2 mt-4 lg:hidden">
                        {CITIES.map(city => (
                            <button
                                key={city.id}
                                onClick={() => setSelected(selected?.id === city.id ? null : city)}
                                className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border transition-all"
                                style={{
                                    borderColor: city.color,
                                    backgroundColor: selected?.id === city.id ? `${city.color}20` : 'transparent',
                                    color: city.color,
                                }}
                            >
                                {city.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-1">
                    {selected ? (
                        <div className="bg-[#111] border border-white/5 h-full p-6" style={{ borderTop: `3px solid ${selected.color}` }}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: selected.color }}>
                                        {selected.name}
                                    </h3>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{selected.state} · {selected.climate}</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white p-1">
                                    <X size={16} />
                                </button>
                            </div>

                            <p className="text-sm text-white/50 mb-6 leading-relaxed">{selected.desc}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    { icon: Users, label: 'Nüfus', value: selected.population },
                                    { icon: Home, label: 'Kira (1+1)', value: selected.avgRent },
                                    { icon: DollarSign, label: 'Ort. Maaş', value: selected.avgSalary },
                                    { icon: MapPin, label: 'Maliyet', value: selected.costIndex },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-black/30 p-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Icon size={10} style={{ color: selected.color }} />
                                            <span className="text-[9px] text-white/30 uppercase font-bold tracking-widest">{label}</span>
                                        </div>
                                        <p className="text-sm font-black text-white">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Occupation demand */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Briefcase size={12} style={{ color: selected.color }} />
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">En Çok Talep Edilen Meslekler</p>
                                </div>
                                <div className="space-y-2">
                                    {selected.occupations.map((occ, i) => (
                                        <div key={occ.title}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-white/70 font-medium">{i + 1}. {occ.title}</span>
                                                <span className="font-black" style={{ color: selected.color }}>{occ.demand}%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-700"
                                                    style={{ width: `${occ.demand}%`, backgroundColor: selected.color, opacity: 0.7 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#111] border border-white/5 h-full p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
                            <MapPin size={32} className="text-white/10 mb-4" />
                            <p className="text-white/20 font-black uppercase tracking-widest text-sm">
                                Bir şehir seç
                            </p>
                            <p className="text-white/10 text-xs mt-2">
                                Kira, maaş ve meslek talebi bilgilerini görmek için haritadan şehre tıkla
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AustraliaMap;
