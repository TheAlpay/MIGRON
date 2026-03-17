import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, CheckCircle, AlertCircle, Info } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

// ── Official Australian Skilled Migration Points Table ─────────────────────
const AGE_POINTS = [
    { label: '18–24', points: 25 },
    { label: '25–32', points: 30 },
    { label: '33–39', points: 25 },
    { label: '40–44', points: 15 },
    { label: '45+', points: 0, note: 'Skilled vize için uygun değil' },
];
const ENGLISH_POINTS = [
    { label: 'Competent (IELTS 6.0)', points: 0 },
    { label: 'Proficient (IELTS 7.0)', points: 10 },
    { label: 'Superior (IELTS 8.0)', points: 20 },
];
const AUS_EXP_POINTS = [
    { label: 'Yok', points: 0 },
    { label: '1–2 yıl', points: 5 },
    { label: '3–4 yıl', points: 10 },
    { label: '5–7 yıl', points: 15 },
    { label: '8+ yıl', points: 20 },
];
const OS_EXP_POINTS = [
    { label: 'Yok', points: 0 },
    { label: '3–4 yıl', points: 5 },
    { label: '5–7 yıl', points: 10 },
    { label: '8+ yıl', points: 15 },
];
const EDUCATION_POINTS = [
    { label: 'Yok / Lise', points: 0 },
    { label: 'Diploma / Ön Lisans', points: 10 },
    { label: 'Lisans veya Yüksek Lisans', points: 15 },
    { label: 'Doktora', points: 20 },
];
const PARTNER_POINTS = [
    { label: 'Yok / Bekâr', points: 0 },
    { label: "Partner var, skilled değil", points: 0 },
    { label: "Partner var, skilled + competent English", points: 5 },
    { label: 'Partner yok (single applicant)', points: 10 },
];
const NOMINATION = [
    { label: 'Nominasyon yok', points: 0 },
    { label: 'Eyalet nominasyonu (190)', points: 5 },
    { label: 'Bölgesel nominasyon (491)', points: 15 },
];
const AUS_STUDY = [
    { label: 'Yok', points: 0 },
    { label: "Avustralya'da 2 yıl üniversite okudum", points: 5 },
];
const NAATI = [
    { label: 'Yok', points: 0 },
    { label: 'NAATI topluluk dili sertifikası', points: 5 },
];
const PROF_YEAR = [
    { label: 'Yok', points: 0 },
    { label: 'Professional Year tamamlandı', points: 5 },
];

const SECTIONS = [
    { key: 'age', label: 'Yaş', options: AGE_POINTS, icon: '🎂' },
    { key: 'english', label: 'İngilizce Seviyesi', options: ENGLISH_POINTS, icon: '🗣️' },
    { key: 'ausExp', label: "Avustralya'da İş Deneyimi", options: AUS_EXP_POINTS, icon: '🦘' },
    { key: 'osExp', label: 'Yurt Dışı İş Deneyimi', options: OS_EXP_POINTS, icon: '🌍' },
    { key: 'education', label: 'Eğitim Seviyesi', options: EDUCATION_POINTS, icon: '🎓' },
    { key: 'partner', label: 'Partner Durumu', options: PARTNER_POINTS, icon: '💑' },
    { key: 'nomination', label: 'Nominasyon', options: NOMINATION, icon: '📋' },
    { key: 'ausStudy', label: "Avustralya'da Eğitim", options: AUS_STUDY, icon: '📚' },
    { key: 'naati', label: 'NAATI Sertifikası', options: NAATI, icon: '🌐' },
    { key: 'profYear', label: 'Professional Year', options: PROF_YEAR, icon: '💼' },
];

const getResult = (total) => {
    if (total >= 80) return { label: 'Mükemmel', color: '#ccff00', desc: 'Davet alma olasılığınız çok yüksek. Çoğu vize kategorisinde önceliklisiniz.' };
    if (total >= 70) return { label: 'Güçlü', color: '#10b981', desc: '70+ puan ile davet alma olasılığınız yüksek. Özellikle 190/491 için uygunsunuz.' };
    if (total >= 65) return { label: 'Yeterli', color: '#f59e0b', desc: '65 minimum eşiği karşılıyorsunuz. EOI açabilirsiniz ancak davet bekleme süresi uzun olabilir.' };
    if (total >= 55) return { label: 'Yetersiz', color: '#ff6b6b', desc: "65 puana ulaşmak için ek puan almanız gerekiyor. İngilizce veya Avustralya deneyimi artırın." };
    return { label: 'Düşük', color: '#ef4444', desc: 'Skilled göçmenlik için önce puan artırıcı adımlar atmanız gerekiyor.' };
};

const PointsCalculatorPage = () => {
    const [selected, setSelected] = useState({
        age: 0, english: 0, ausExp: 0, osExp: 0, education: 0,
        partner: 0, nomination: 0, ausStudy: 0, naati: 0, profYear: 0,
    });
    const [showResult, setShowResult] = useState(false);

    const total = Object.values(selected).reduce((a, b) => a + b, 0);
    const result = getResult(total);

    const handleSelect = (key, points) => {
        setSelected(prev => ({ ...prev, [key]: points }));
        setShowResult(false);
    };

    return (
        <>
            <SEOHead
                title="Puan Hesaplama Aracı"
                description="Avustralya Skilled Migration puan testini hesaplayın. Yaş, İngilizce, deneyim ve eğitime göre puanınızı öğrenin."
                path="/puan-hesapla"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                <section className="pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[900px] mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> Anasayfa
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <Calculator className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    PUAN HESAPLA
                                </h1>
                                <p className="text-sm text-white/40 mt-1">Avustralya Skilled Migration — Resmi Points Test</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-[900px] mx-auto px-6 py-10">
                    {/* Live score banner */}
                    <div className="sticky top-20 z-10 mb-8 bg-[#0a0a0a] border border-white/10 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black" style={{ color: getResult(total).color }}>{total}</span>
                            <div>
                                <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Toplam Puan</p>
                                <p className="text-sm font-black" style={{ color: getResult(total).color }}>{getResult(total).label}</p>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] text-white/30 uppercase font-bold">Minimum Eşik</p>
                            <p className="text-2xl font-black text-white/20">65</p>
                        </div>
                        {/* Progress bar */}
                        <div className="hidden sm:block flex-1 mx-6">
                            <div className="h-2 bg-white/5 overflow-hidden">
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{ width: `${Math.min(total, 100)}%`, backgroundColor: getResult(total).color }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setShowResult(true)}
                            className="bg-[#ccff00] text-black px-5 py-2 font-black uppercase text-xs hover:brightness-110 transition-all"
                        >
                            Sonucu Gör
                        </button>
                    </div>

                    {/* Result panel */}
                    {showResult && (
                        <div className="mb-8 p-6 border-2" style={{ borderColor: result.color, backgroundColor: `${result.color}08` }}>
                            <div className="flex items-start gap-4">
                                {total >= 65 ? <CheckCircle size={24} style={{ color: result.color }} className="shrink-0" /> : <AlertCircle size={24} style={{ color: result.color }} className="shrink-0" />}
                                <div>
                                    <p className="font-black text-xl uppercase" style={{ color: result.color }}>{result.label} · {total} Puan</p>
                                    <p className="text-sm text-white/60 mt-2 leading-relaxed">{result.desc}</p>
                                    {total >= 65 && (
                                        <div className="mt-4 flex gap-3">
                                            <Link to="/program-turleri" className="text-xs font-black uppercase text-black px-4 py-2 hover:brightness-110" style={{ backgroundColor: result.color }}>
                                                Vize Türlerini Gör
                                            </Link>
                                            <Link to="/vize-kontrol-listesi" className="text-xs font-black uppercase border px-4 py-2 hover:bg-white/5 transition-colors" style={{ borderColor: result.color, color: result.color }}>
                                                Kontrol Listesi
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Criteria */}
                    <div className="space-y-6">
                        {SECTIONS.map(section => (
                            <div key={section.key} className="bg-[#111] border border-white/5 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{section.icon}</span>
                                    <h3 className="font-black uppercase tracking-tight text-white">{section.label}</h3>
                                    {selected[section.key] > 0 && (
                                        <span className="ml-auto text-[#ccff00] font-black text-lg">+{selected[section.key]}</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {section.options.map(opt => (
                                        <button
                                            key={opt.label}
                                            onClick={() => handleSelect(section.key, opt.points)}
                                            className={`px-4 py-2 text-xs font-bold border transition-all text-left ${selected[section.key] === opt.points
                                                    ? 'border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]'
                                                    : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                                                }`}
                                        >
                                            {opt.label}
                                            <span className={`ml-2 font-black ${opt.points > 0 ? 'text-[#ccff00]' : 'text-white/30'}`}>
                                                {opt.points > 0 ? `+${opt.points}` : '0'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {section.options.find(o => o.label === section.options.find(o2 => o2.points === selected[section.key])?.label)?.note && (
                                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                        <Info size={12} /> {section.options.find(o => o.points === selected[section.key])?.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-[#111] border border-white/5 p-4 text-xs text-white/30 leading-relaxed">
                        <Info size={12} className="inline mr-1" />
                        Bu hesaplama, Avustralya İçişleri Bakanlığı'nın resmi puan tablosuna dayanmaktadır. Son doğrulama için{' '}
                        <a href="https://immi.homeaffairs.gov.au/points-test" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">
                            resmi siteyi
                        </a>{' '}
                        ziyaret edin.
                    </div>
                </section>
            </div>
        </>
    );
};

export default PointsCalculatorPage;
