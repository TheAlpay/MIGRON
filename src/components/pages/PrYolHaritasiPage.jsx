import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Calculator, ChevronDown } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SEOHead from '../seo/SEOHead';
import LiveExperimentBand from '../shared/LiveExperimentBand';

// ── Visa Pathways ─────────────────────────────────────────────────────────────
const PATHWAYS = [
    {
        id: 'whv',
        color: '#ccff00',
        startLabel: '417 — Working Holiday',
        steps: [
            { visa: '417', label: 'Year 1', desc: 'Under 35, 1-year work+travel' },
            { visa: '417 (2nd Year)', label: 'Year 2', desc: '88 days regional work → extension' },
            { visa: '417 (3rd Year)', label: 'Year 3', desc: '179 more days → 3rd year' },
            { visa: '482', label: 'TSS', desc: 'Employer sponsorship' },
            { visa: '186', label: 'PR', desc: 'Employer Nomination — permanent', pr: true },
        ],
    },
    {
        id: 'student',
        color: '#00d4ff',
        startLabel: '500 — Student',
        steps: [
            { visa: '500', label: 'Student', desc: 'CRICOS registered institution' },
            { visa: '485', label: 'Graduate', desc: '2–4 year work permit' },
            { visa: '482', label: 'TSS', desc: 'Employer sponsorship' },
            { visa: '186', label: 'PR', desc: 'Permanent residence', pr: true },
        ],
        altSteps: [
            { visa: '189', label: 'Direct PR', desc: 'Points-based — independent', pr: true },
            { visa: '190', label: 'State PR', desc: 'State nominated', pr: true },
        ],
    },
    {
        id: 'tss',
        color: '#ff9500',
        startLabel: '482 — Skills in Demand (SID)',
        steps: [
            { visa: 'Core Skills', label: 'Core Skills', desc: '4 years — CSOL list, min. $73,150' },
            { visa: 'Specialist', label: 'Specialist', desc: '4 years — no list, min. $141,210' },
            { visa: '186', label: 'PR', desc: 'Permanent after 2 years', pr: true },
        ],
    },
    {
        id: 'skilled',
        color: '#00ff88',
        startLabel: '189/190 — Skilled',
        steps: [
            { visa: 'EOI', label: 'SkillSelect', desc: 'Submit Expression of Interest' },
            { visa: '65+', label: 'Min. Points', desc: 'Min. 65 points required', link: '/points-calculator' },
            { visa: '189', label: 'Direct PR', desc: 'Receive invitation → direct PR', pr: true },
            { visa: '190', label: 'State PR', desc: 'State nomination → PR', pr: true },
        ],
    },
    {
        id: 'regional',
        color: '#a78bfa',
        startLabel: '491 — Regional',
        steps: [
            { visa: '491', label: 'Regional', desc: '5 years regional work' },
            { visa: '191', label: 'Regional PR', desc: 'Permanent after 3 years', pr: true },
        ],
    },
];

// ── Default PR Timeline Table ──────────────────────────────────────────────
const DEFAULT_PR_TABLE = [
    { path: '482 → 186', time: '3–5 years', difficulty: 'Medium', color: '#ff9500' },
    { path: '500 → 485 → 189', time: '4–6 years', difficulty: 'Medium-Hard', color: '#00d4ff' },
    { path: '189 Direct', time: '1–2 years (invitation wait)', difficulty: 'Hard', color: '#00ff88' },
    { path: '190 State', time: '1–3 years', difficulty: 'Medium', color: '#00ff88' },
    { path: '491 → 191', time: '5–6 years', difficulty: 'Easy (regional req.)', color: '#a78bfa' },
];

const DIFFICULTY_COLOR = {
    'Easy': '#00ff88',
    'Medium': '#ccff00',
    'Medium-Hard': '#ff9500',
    'Hard': '#ff6b6b',
};

// ── Step Node component ─────────────────────────────────────────────────────
const StepNode = ({ step, color }) => {
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
            <span className="text-[9px] font-bold text-white/40 mt-0.5 leading-tight">{step.label}</span>
            <span className="text-[8px] text-white/25 mt-1 leading-tight max-w-[100px]">{step.desc}</span>
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

const PathwayRow = ({ pathway }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="bg-[#111] border border-white/5 overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/2 transition-colors"
            >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pathway.color }} />
                <span className="text-sm font-black uppercase tracking-tight text-white">{pathway.startLabel}</span>
                <ChevronDown size={14} className={`ml-auto text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                    {/* Main path */}
                    <div className="flex flex-wrap items-center gap-y-3">
                        {pathway.steps.map((step, i) => (
                            <React.Fragment key={step.visa + i}>
                                <StepNode step={step} color={pathway.color} />
                                {i < pathway.steps.length - 1 && <Arrow color={pathway.color} />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Alternative path (student visa) */}
                    {pathway.altSteps && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">
                                ALTERNATIVE PATH (POINTS-BASED)
                            </p>
                            <div className="flex flex-wrap items-center gap-y-3">
                                <div
                                    className="flex flex-col items-center text-center px-3 py-2 min-w-[90px] border bg-[#111]"
                                    style={{ borderColor: `${pathway.color}30` }}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: pathway.color }}>485</span>
                                    <span className="text-[8px] text-white/25 mt-1">Graduate</span>
                                </div>
                                <Arrow color={pathway.color} />
                                {pathway.altSteps.map((step, i) => (
                                    <React.Fragment key={step.visa + i}>
                                        <StepNode step={step} color={pathway.color} />
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
                            Permanent Residence (PR)
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

const PrYolHaritasiPage = () => {
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
                title="PR Roadmap — Your Path to Permanent Residency in Australia"
                description="Your complete guide to Australian Permanent Residency. Compare 189, 190, 491 pathways, points requirements, timelines and employer nomination options."
                path="/pr-yol-haritasi"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[900px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} />
                                Back to Home
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                PROGRAM TYPES
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <ArrowRight className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                PR ROADMAP
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                            Which visa leads to permanent residence — and how. Click each pathway to expand.
                        </p>
                    </div>
                </section>

                <div className="max-w-[900px] mx-auto px-6 py-8">

                    <LiveExperimentBand />

                    {/* Pathway flowcharts */}
                    <div className="space-y-4 mb-10">
                        {PATHWAYS.map(pathway => (
                            <PathwayRow key={pathway.id} pathway={pathway} />
                        ))}
                    </div>

                    {/* Estimated Time to PR Table */}
                    <div className="bg-[#111] border border-white/5 mb-8">
                        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                ESTIMATED TIME TO PR
                            </p>
                            {lastUpdated && (
                                <p className="text-[9px] text-white/20">
                                    Updated: {lastUpdated.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
                                </p>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                            Pathway
                                        </th>
                                        <th className="text-left px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                            Est. Time
                                        </th>
                                        <th className="text-left px-5 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                                            Difficulty
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prTable.map((row, i) => {
                                        const pathLabel = typeof row.path === 'string' ? row.path : row.path.en;
                                        const timeLabel = typeof row.time === 'string' ? row.time : row.time.en;
                                        const diffLabel = typeof row.difficulty === 'string' ? row.difficulty : row.difficulty.en;
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
                                KNOW YOUR POINTS
                            </p>
                            <p className="text-sm text-white/50">
                                Many PR pathways require 65+ points. Calculate yours now.
                            </p>
                        </div>
                        <Link
                            to="/points-calculator"
                            className="shrink-0 flex items-center gap-2 px-5 py-3 bg-[#ccff00] text-black font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all"
                        >
                            <Calculator size={14} />
                            Calculate Points
                        </Link>
                    </div>

                    {/* Related */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                            WHAT'S NEXT?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/program-turleri"
                                className="flex-1 px-4 py-3 border border-[#ccff00]/30 text-[#ccff00] text-xs font-black uppercase tracking-wider hover:bg-[#ccff00]/10 transition-all text-center"
                            >
                                All Visa Programs →
                            </Link>
                            <Link
                                to="/vize-kontrol-listesi"
                                className="flex-1 px-4 py-3 border border-white/10 text-white/50 text-xs font-black uppercase tracking-wider hover:border-white/30 hover:text-white/70 transition-all text-center"
                            >
                                Visa Checklist →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrYolHaritasiPage;
