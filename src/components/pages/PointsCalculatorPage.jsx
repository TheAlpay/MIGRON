import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, CheckCircle, AlertCircle, Info } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { useLanguage } from '../../i18n/LanguageContext';

// ── Official Australian Skilled Migration Points Table ─────────────────────
const AGE_POINTS = [
    { label: '18–24', points: 25 },
    { label: '25–32', points: 30 },
    { label: '33–39', points: 25 },
    { label: '40–44', points: 15 },
    { label: '45+', points: 0, note: 'Not eligible for skilled visas' },
];
const ENGLISH_POINTS = [
    { label: 'Competent (IELTS 6.0)', points: 0 },
    { label: 'Proficient (IELTS 7.0)', points: 10 },
    { label: 'Superior (IELTS 8.0)', points: 20 },
];
const AUS_EXP_POINTS = [
    { label: 'None', points: 0 },
    { label: '1–2 years', points: 5 },
    { label: '3–4 years', points: 10 },
    { label: '5–7 years', points: 15 },
    { label: '8+ years', points: 20 },
];
const OS_EXP_POINTS = [
    { label: 'None', points: 0 },
    { label: '3–4 years', points: 5 },
    { label: '5–7 years', points: 10 },
    { label: '8+ years', points: 15 },
];
const EDUCATION_POINTS = [
    { label: 'None / High School', points: 0 },
    { label: 'Diploma / Associate Degree', points: 10 },
    { label: 'Bachelor or Master\'s Degree', points: 15 },
    { label: 'Doctorate (PhD)', points: 20 },
];
const PARTNER_POINTS = [
    { label: 'No partner / Single', points: 0 },
    { label: 'Partner — not skilled', points: 0 },
    { label: 'Partner — skilled + Competent English', points: 5 },
    { label: 'No partner (single applicant)', points: 10 },
];
const NOMINATION = [
    { label: 'No nomination', points: 0 },
    { label: 'State nomination (190)', points: 5 },
    { label: 'Regional nomination (491)', points: 15 },
];
const AUS_STUDY = [
    { label: 'None', points: 0 },
    { label: '2 years of university study in Australia', points: 5 },
];
const NAATI = [
    { label: 'None', points: 0 },
    { label: 'NAATI community language certificate', points: 5 },
];
const PROF_YEAR = [
    { label: 'None', points: 0 },
    { label: 'Professional Year completed', points: 5 },
];

const SECTION_KEYS = [
    { key: 'age', tKey: 'points_sec_age', options: AGE_POINTS, icon: '🎂' },
    { key: 'english', tKey: 'points_sec_english', options: ENGLISH_POINTS, icon: '🗣️' },
    { key: 'ausExp', tKey: 'points_sec_aus_exp', options: AUS_EXP_POINTS, icon: '🦘' },
    { key: 'osExp', tKey: 'points_sec_os_exp', options: OS_EXP_POINTS, icon: '🌍' },
    { key: 'education', tKey: 'points_sec_education', options: EDUCATION_POINTS, icon: '🎓' },
    { key: 'partner', tKey: 'points_sec_partner', options: PARTNER_POINTS, icon: '💑' },
    { key: 'nomination', tKey: 'points_sec_nomination', options: NOMINATION, icon: '📋' },
    { key: 'ausStudy', tKey: 'points_sec_aus_study', options: AUS_STUDY, icon: '📚' },
    { key: 'naati', tKey: 'points_sec_naati', options: NAATI, icon: '🌐' },
    { key: 'profYear', tKey: 'points_sec_prof_year', options: PROF_YEAR, icon: '💼' },
];

const PointsCalculatorPage = () => {
    const { t } = useLanguage();
    const [selected, setSelected] = useState({
        age: 0, english: 0, ausExp: 0, osExp: 0, education: 0,
        partner: 0, nomination: 0, ausStudy: 0, naati: 0, profYear: 0,
    });
    const [showResult, setShowResult] = useState(false);

    const total = Object.values(selected).reduce((a, b) => a + b, 0);

    const getResult = (pts) => {
        if (pts >= 80) return { label: t('points_result_excellent'), color: '#ccff00', desc: t('points_result_excellent_desc') };
        if (pts >= 70) return { label: t('points_result_strong'), color: '#10b981', desc: t('points_result_strong_desc') };
        if (pts >= 65) return { label: t('points_result_ok'), color: '#f59e0b', desc: t('points_result_ok_desc') };
        if (pts >= 55) return { label: t('points_result_insufficient'), color: '#ff6b6b', desc: t('points_result_insufficient_desc') };
        return { label: t('points_result_low'), color: '#ef4444', desc: t('points_result_low_desc') };
    };

    const SECTIONS = SECTION_KEYS.map(s => ({ ...s, label: t(s.tKey) }));
    const result = getResult(total);

    const handleSelect = (key, points) => {
        setSelected(prev => ({ ...prev, [key]: points }));
        setShowResult(false);
    };

    return (
        <>
            <SEOHead
                title="Australian Points Calculator — Skilled Migration Points Test 2026"
                description="Calculate your Australian skilled migration points score. Age, English, work experience, education and more — based on the official Department of Home Affairs points table."
                path="/points-calculator"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                <section className="pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[900px] mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> {t('page_back_home')}
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <Calculator className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    {t('points_page_title')}
                                </h1>
                                <p className="text-sm text-white/40 mt-1">{t('points_page_subtitle')}</p>
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
                                <p className="text-xs text-white/40 uppercase font-bold tracking-widest">{t('points_total_score')}</p>
                                <p className="text-sm font-black" style={{ color: getResult(total).color }}>{getResult(total).label}</p>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] text-white/30 uppercase font-bold">{t('points_min_threshold')}</p>
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
                            {t('points_see_result')}
                        </button>
                    </div>

                    {/* Result panel */}
                    {showResult && (
                        <div className="mb-8 p-6 border-2" style={{ borderColor: result.color, backgroundColor: `${result.color}08` }}>
                            <div className="flex items-start gap-4">
                                {total >= 65 ? <CheckCircle size={24} style={{ color: result.color }} className="shrink-0" /> : <AlertCircle size={24} style={{ color: result.color }} className="shrink-0" />}
                                <div>
                                    <p className="font-black text-xl uppercase" style={{ color: result.color }}>{result.label} · {total} Points</p>
                                    <p className="text-sm text-white/60 mt-2 leading-relaxed">{result.desc}</p>
                                    {total >= 65 && (
                                        <div className="mt-4 flex gap-3">
                                            <Link to="/program-turleri" className="text-xs font-black uppercase text-black px-4 py-2 hover:brightness-110" style={{ backgroundColor: result.color }}>
                                                {t('points_see_visa_types')}
                                            </Link>
                                            <Link to="/visa-checklist" className="text-xs font-black uppercase border px-4 py-2 hover:bg-white/5 transition-colors" style={{ borderColor: result.color, color: result.color }}>
                                                {t('points_checklist')}
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
                        {t('points_disclaimer')}{' '}
                        <a href="https://immi.homeaffairs.gov.au/points-test" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">
                            {t('points_official_site')}
                        </a>
                        {t('points_disclaimer_suffix')}
                    </div>
                </section>
            </div>
        </>
    );
};

export default PointsCalculatorPage;
