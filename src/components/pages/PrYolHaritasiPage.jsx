import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Calculator, ChevronDown } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';
import LiveExperimentBand from '../shared/LiveExperimentBand';

// ── Vize Yolları ─────────────────────────────────────────────────────────────
const PATHWAYS = [
    {
        id: 'whv',
        color: '#ccff00',
        startLabel: { tr: '417 — Working Holiday', en: '417 — Working Holiday' },
        steps: [
            { visa: '417', label: { tr: '1. Yıl', en: 'Year 1' }, desc: { tr: '35 yaş altı, 1 yıl çalışma+seyahat', en: 'Under 35, 1-year work+travel' } },
            { visa: '417 (2. Yıl)', label: { tr: '2. Yıl', en: 'Year 2' }, desc: { tr: 'Bölgesel işte 88 gün → uzatma', en: '88 days regional work → extension' } },
            { visa: '417 (3. Yıl)', label: { tr: '3. Yıl', en: 'Year 3' }, desc: { tr: '179 gün daha → 3. yıl', en: '179 more days → 3rd year' } },
            { visa: '482', label: { tr: 'TSS', en: 'TSS' }, desc: { tr: 'İşveren sponsorluğu', en: 'Employer sponsorship' } },
            { visa: '186', label: { tr: 'PR', en: 'PR' }, desc: { tr: 'Employer Nomination — kalıcı', en: 'Employer Nomination — permanent' }, pr: true },
        ],
    },
    {
        id: 'student',
        color: '#00d4ff',
        startLabel: { tr: '500 — Öğrenci', en: '500 — Student' },
        steps: [
            { visa: '500', label: { tr: 'Öğrenci', en: 'Student' }, desc: { tr: 'CRICOS kayıtlı kurum', en: 'CRICOS registered institution' } },
            { visa: '485', label: { tr: 'Graduate', en: 'Graduate' }, desc: { tr: '2–4 yıl çalışma izni', en: '2–4 year work permit' } },
            { visa: '482', label: { tr: 'TSS', en: 'TSS' }, desc: { tr: 'İşveren sponsorluğu', en: 'Employer sponsorship' } },
            { visa: '186', label: { tr: 'PR', en: 'PR' }, desc: { tr: 'Kalıcı oturum', en: 'Permanent residence' }, pr: true },
        ],
        altSteps: [
            { visa: '189', label: { tr: 'Direkt PR', en: 'Direct PR' }, desc: { tr: 'Puan bazlı — bağımsız', en: 'Points-based — independent' }, pr: true },
            { visa: '190', label: { tr: 'Eyalet PR', en: 'State PR' }, desc: { tr: 'Eyalet nominasyonlu', en: 'State nominated' }, pr: true },
        ],
    },
    {
        id: 'tss',
        color: '#ff9500',
        startLabel: { tr: '482 — TSS', en: '482 — TSS' },
        steps: [
            { visa: '482 Kısa', label: { tr: 'Short-term', en: 'Short-term' }, desc: { tr: '2 yıl — MLTSSL listesi', en: '2 years — MLTSSL list' } },
            { visa: '482 Orta', label: { tr: 'Medium-term', en: 'Medium-term' }, desc: { tr: '4 yıl — STSOL listesi', en: '4 years — STSOL list' } },
            { visa: '186', label: { tr: 'PR', en: 'PR' }, desc: { tr: '2–3 yıl sonra kalıcı oturum', en: 'Permanent after 2–3 years' }, pr: true },
        ],
    },
    {
        id: 'skilled',
        color: '#00ff88',
        startLabel: { tr: '189/190 — Skilled', en: '189/190 — Skilled' },
        steps: [
            { visa: 'EOI', label: { tr: 'SkillSelect', en: 'SkillSelect' }, desc: { tr: 'Expression of Interest gönder', en: 'Submit Expression of Interest' } },
            { visa: '65+', label: { tr: 'Min. Puan', en: 'Min. Points' }, desc: { tr: 'Min. 65 puan gerekli', en: 'Min. 65 points required' }, link: '/puan-hesapla' },
            { visa: '189', label: { tr: 'Direkt PR', en: 'Direct PR' }, desc: { tr: 'Davet al → doğrudan PR', en: 'Receive invitation → direct PR' }, pr: true },
            { visa: '190', label: { tr: 'Eyalet PR', en: 'State PR' }, desc: { tr: 'Eyalet nominasyonu → PR', en: 'State nomination → PR' }, pr: true },
        ],
    },
    {
        id: 'regional',
        color: '#a78bfa',
        startLabel: { tr: '491 — Bölgesel', en: '491 — Regional' },
        steps: [
            { visa: '491', label: { tr: 'Bölgesel', en: 'Regional' }, desc: { tr: '5 yıl bölgesel çalışma', en: '5 years regional work' } },
            { visa: '191', label: { tr: 'Bölgesel PR', en: 'Regional PR' }, desc: { tr: '3 yıl sonra kalıcı', en: 'Permanent after 3 years' }, pr: true },
        ],
    },
];

// ── Varsayılan PR Süre Tablosu ─────────────────────────────────────────────
const DEFAULT_PR_TABLE = [
    { path: { tr: '482 → 186', en: '482 → 186' }, time: { tr: '3–5 yıl', en: '3–5 years' }, difficulty: { tr: 'Orta', en: 'Medium' }, color: '#ff9500' },
    { path: { tr: '500 → 485 → 189', en: '500 → 485 → 189' }, time: { tr: '4–6 yıl', en: '4–6 years' }, difficulty: { tr: 'Orta-Zor', en: 'Medium-Hard' }, color: '#00d4ff' },
    { path: { tr: '189 Direkt', en: '189 Direct' }, time: { tr: '1–2 yıl (davet bekleme)', en: '1–2 years (invitation wait)' }, difficulty: { tr: 'Zor', en: 'Hard' }, color: '#00ff88' },
    { path: { tr: '190 Eyalet', en: '190 State' }, time: { tr: '1–3 yıl', en: '1–3 years' }, difficulty: { tr: 'Orta', en: 'Medium' }, color: '#00ff88' },
    { path: { tr: '491 → 191', en: '491 → 191' }, time: { tr: '5–6 yıl', en: '5–6 years' }, difficulty: { tr: 'Kolay (bölgesel şart)', en: 'Easy (regional req.)' }, color: '#a78bfa' },
];

const DIFFICULTY_COLOR = {
    'Kolay': '#00ff88', 'Easy': '#00ff88',
    'Orta': '#ccff00', 'Medium': '#ccff00',
    'Orta-Zor': '#ff9500', 'Medium-Hard': '#ff9500',
    'Zor': '#ff6b6b', 'Hard': '#ff6b6b',
};

// ── Step Node component ─────────────────────────────────────────────────────
const StepNode = ({ step, color, lang }) => {
    const label = lang === 'en' ? step.label.en : step.label.tr;
    const desc = lang === 'en' ? step.desc.en : step.desc.tr;

    const inner = (
        <div
            className={`relative flex flex-col items-center text-center px-3 py-2.5 min-w-[90px] border transition-all ${step.pr
                ? 'border-[2px] bg-black'
                : 'border bg-[#111] hover:bg-[#1a1a1a]'
                }`}
            style={{
                borderColor: step.pr ? color : `${color}40`,
                boxShadow: step.pr ? `0 0 12px ${color}30` : 'none',
            }}
        >
            {step.pr && <CheckCircle2 size={12} style={{ color }} className="mb-1" />}
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color }}>
                {step.visa}
            </span>
            <span className="text-[9px] font-bold text-white/40 mt-0.5 leading-tight">{label}</span>
            <span className="text-[8px] text-white/25 mt-1 leading-tight max-w-[100px]">{desc}</span>
        </div>
    );

    if (step.link) {
        return <Link to={step.link}>{inner}</Link>;
    }
    return inner;
};

const Arrow = ({ color }) => (
    <div className="flex items-center shrink-0 mx-1">
        <div className="h-px w-4" style={{ backgroundColor: `${color}40` }} />
        <ArrowRight size={10} style={{ color: `${color}60` }} />
    </div>
);

const PathwayRow = ({ pathway, lang }) => {
    const [open, setOpen] = useState(true);
    const label = lang === 'en' ? pathway.startLabel.en : pathway.startLabel.tr;

    return (
        <div className="bg-[#111] border border-white/5 overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/2 transition-colors"
            >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pathway.color }} />
                <span className="text-sm font-black uppercase tracking-tight text-white">{label}</span>
                <ChevronDown size={14} className={`ml-auto text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                    {/* Main path */}
                    <div className="flex flex-wrap items-center gap-y-3">
                        {pathway.steps.map((step, i) => (
                            <React.Fragment key={step.visa + i}>
                                <StepNode step={step} color={pathway.color} lang={lang} />
                                {i < pathway.steps.length - 1 && <Arrow color={pathway.color} />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Alt yol (öğrenci vizesi) */}
                    {pathway.altSteps && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">
                                {lang === 'en' ? 'ALTERNATIVE PATH (POINTS-BASED)' : 'ALTERNATİF YOL (PUAN BAZLI)'}
                            </p>
                            <div className="flex flex-wrap items-center gap-y-3">
                                <div
                                    className="flex flex-col items-center text-center px-3 py-2 min-w-[90px] border bg-[#111]"
                                    style={{ borderColor: `${pathway.color}30` }}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: pathway.color }}>485</span>
                                    <span className="text-[8px] text-white/25 mt-1">{lang === 'en' ? 'Graduate' : 'Graduate'}</span>
                                </div>
                                <Arrow color={pathway.color} />
                                {pathway.altSteps.map((step, i) => (
                                    <React.Fragment key={step.visa + i}>
                                        <StepNode step={step} color={pathway.color} lang={lang} />
                                        {i < pathway.altSteps.length - 1 && <Arrow color={pathway.color} />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PR legend */}
                    <div className="mt-4 flex items-center gap-2">
                        <CheckCircle2 size={10} style={{ color: pathway.color }} />
                        <span className="text-[9px] text-white/25">
                            {lang === 'en' ? 'Permanent Residence (PR)' : 'Kalıcı Oturum (PR)'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

const PrYolHaritasiPage = () => {
    const { lang } = useLanguage();
    const [prTable, setPrTable] = useState(DEFAULT_PR_TABLE);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'pr_yollari', 'sureler'));
                if (snap.exists()) {
                    const d = snap.data();
                    if (d.rows && Array.isArray(d.rows)) setPrTable(d.rows);
                    if (d.updatedAt) setLastUpdated(d.updatedAt.toDate ? d.updatedAt.toDate() : new Date(d.updatedAt));
                }
            } catch { /* fallback */ }
        };
        fetchData();
    }, []);

    return (
        <>
            <SEOHead
                title={lang === 'en' ? 'PR Roadmap — Pathway to Australian Permanent Residence' : 'PR Yol Haritası — Avustralya Kalıcı Oturuma Geçiş'}
                description={lang === 'en'
                    ? 'Step-by-step visual guide to Australian permanent residence pathways. From Working Holiday to skilled migration.'
                    : 'Avustralya\'da kalıcı oturuma geçiş yolları. Working Holiday\'dan skilled göçe adım adım görsel rehber.'}
                path="/pr-yol-haritasi"
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
                                {lang === 'en' ? 'PROGRAM TYPES' : 'PROGRAM TÜRLERİ'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <ArrowRight className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                {lang === 'en' ? 'PR ROADMAP' : 'PR YOL HARİTASI'}
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                            {lang === 'en'
                                ? 'Which visa leads to permanent residence — and how. Click each pathway to expand.'
                                : 'Hangi vizeden kalıcı oturuma nasıl geçilir — adım adım. Her yolu açmak için tıkla.'}
                        </p>
                    </div>
                </section>

                <div className="max-w-[900px] mx-auto px-6 py-8">

                    <LiveExperimentBand />

                    {/* Pathway flowcharts */}
                    <div className="space-y-4 mb-10">
                        {PATHWAYS.map(pathway => (
                            <PathwayRow key={pathway.id} pathway={pathway} lang={lang} />
                        ))}
                    </div>

                    {/* PR Süre Tablosu */}
                    <div className="bg-[#111] border border-white/5 mb-8">
                        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                {lang === 'en' ? 'ESTIMATED TIME TO PR' : 'TAHMINI PR SÜRELERİ'}
                            </p>
                            {lastUpdated && (
                                <p className="text-[9px] text-white/20">
                                    {lang === 'en' ? 'Updated:' : 'Güncellendi:'} {lastUpdated.toLocaleDateString(lang === 'en' ? 'en-AU' : 'tr-TR', { month: 'short', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                            {lang === 'en' ? 'Pathway' : 'Yol'}
                                        </th>
                                        <th className="text-left px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                            {lang === 'en' ? 'Est. Time' : 'Tahmini Süre'}
                                        </th>
                                        <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                            {lang === 'en' ? 'Difficulty' : 'Zorluk'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prTable.map((row, i) => {
                                        const pathLabel = typeof row.path === 'string' ? row.path : (lang === 'en' ? row.path.en : row.path.tr);
                                        const timeLabel = typeof row.time === 'string' ? row.time : (lang === 'en' ? row.time.en : row.time.tr);
                                        const diffLabel = typeof row.difficulty === 'string' ? row.difficulty : (lang === 'en' ? row.difficulty.en : row.difficulty.tr);
                                        const diffColor = DIFFICULTY_COLOR[diffLabel] || '#ccff00';
                                        return (
                                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                                                <td className="px-5 py-3">
                                                    <span className="text-sm font-black text-white" style={{ color: row.color }}>{pathLabel}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-sm text-white/70">{timeLabel}</span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span
                                                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border"
                                                        style={{ color: diffColor, borderColor: `${diffColor}40`, backgroundColor: `${diffColor}10` }}
                                                    >
                                                        {diffLabel}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-[#111] border border-[#ccff00]/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] mb-1">
                                {lang === 'en' ? '🎯 KNOW YOUR POINTS' : '🎯 PUANINI BİL'}
                            </p>
                            <p className="text-sm text-white/50">
                                {lang === 'en'
                                    ? 'Many PR pathways require 65+ points. Calculate yours now.'
                                    : 'Pek çok PR yolu 65+ puan gerektirir. Şimdi hesapla.'}
                            </p>
                        </div>
                        <Link
                            to="/puan-hesapla"
                            className="shrink-0 flex items-center gap-2 px-5 py-3 bg-[#ccff00] text-black font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
                        >
                            <Calculator size={14} />
                            {lang === 'en' ? 'Calculate Points' : 'Puanını Hesapla'}
                        </Link>
                    </div>

                    {/* Related */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                            {lang === 'en' ? "WHAT'S NEXT?" : 'SIRA NE?'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/program-turleri"
                                className="flex-1 px-4 py-3 border border-[#ccff00]/30 text-[#ccff00] text-xs font-black uppercase tracking-wider hover:bg-[#ccff00]/10 transition-all text-center"
                            >
                                {lang === 'en' ? 'All Visa Programs →' : 'Tüm Vize Programları →'}
                            </Link>
                            <Link
                                to="/vize-kontrol-listesi"
                                className="flex-1 px-4 py-3 border border-white/10 text-white/50 text-xs font-black uppercase tracking-wider hover:border-white/30 hover:text-white/70 transition-all text-center"
                            >
                                {lang === 'en' ? 'Visa Checklist →' : 'Vize Kontrol Listesi →'}
                            </Link>
                        </div>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default PrYolHaritasiPage;
