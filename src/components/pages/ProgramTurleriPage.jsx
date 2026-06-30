import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, ArrowUpRight, X, ChevronRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SEOHead from '../seo/SEOHead';

// ── Default Program Data ──────────────────────────────────────────────────────
const defaultPrograms = [
    {
        id: 'default-1', color: "#ccff00", tag: "SKILLED",
        title: "Skilled Independent (189)",
        subtitle: "Independent Skilled Migrant Visa",
        desc: "A points-based independent migration visa that requires no state or regional sponsorship. You can live and work anywhere in Australia.",
        requirements: ["Min. 65 EOI points", "Valid skills assessment", "Competent English (IELTS 6.0)", "Health examination"],
        processingTime: "12–36 months", prDirect: true,
        details: "The 189 visa is a skilled migration visa that can be applied for without sponsorship from an Australian employer or state government. An Expression of Interest (EOI) must be submitted through the SkillSelect system, after which you wait for an invitation. Invitation cut-offs are typically well above 65 points, so maximising your score is critical."
    },
    {
        id: 'default-2', color: "#00d4ff", tag: "SKILLED",
        title: "Skilled Nominated (190)",
        subtitle: "State Nominated Visa",
        desc: "A skilled migration visa that requires nomination by a state or territory and awards an additional 5 points.",
        requirements: ["Min. 65 points (+ 5 nomination bonus)", "State nomination", "Skills assessment", "Competent English"],
        processingTime: "6–24 months", prDirect: true,
        details: "The 190 visa earns an additional 5 points through state/territory nomination, making it a more accessible skilled visa option. Each state has its own nomination criteria and quotas. After receiving state nomination, you are required to live and work in that state for 2 years."
    },
    {
        id: 'default-3', color: "#ff6b6b", tag: "EMPLOYER",
        title: "Skills in Demand / SID (482)",
        subtitle: "Employer-Sponsored Skills Visa",
        desc: "Since 7 December 2024, the SID visa replaces the 482 TSS visa with three streams: Core Skills, Specialist Skills and Labour Agreement — all valid for 4 years with a direct PR pathway via ENS 186.",
        requirements: ["Sponsoring employer", "Nomination approval", "1 year's experience (within last 5 years)", "IELTS 5.0+ (Core Skills) or income threshold (Specialist)"],
        processingTime: "1–4 months", prDirect: false,
        details: "The Skills in Demand (SID) visa has 3 streams: Core Skills (occupations on the CSOL list, min. $73,150 annual salary), Specialist Skills (no occupation list required, min. $141,210 — processed in 7 days), and Labour Agreement (sector-specific agreements). All streams are valid for 4 years. PR via the ENS 186 visa is possible after 2 years. A new nomination is required when changing employers; 180 days are granted if you lose your job."
    },
    {
        id: 'default-4', color: "#a78bfa", tag: "EMPLOYER",
        title: "Employer Nomination Scheme (186)",
        subtitle: "Employer Nomination Permanent Visa",
        desc: "A visa offering direct PR to migrants nominated by an employer for a specific position.",
        requirements: ["Employer nomination", "3 years' experience", "Competent English", "Skills assessment"],
        processingTime: "6–24 months", prDirect: true,
        details: "The 186 visa has two streams: Direct Entry and Transition. The Transition stream is for those who have worked with the same employer on a 457 or 482 visa for at least 2 years. The Direct Entry stream allows application directly through employer nomination."
    },
    {
        id: 'default-5', color: "#f59e0b", tag: "REGIONAL",
        title: "Skilled Work Regional (491)",
        subtitle: "Skilled Work Regional Temporary Visa",
        desc: "A temporary visa requiring work and residence in regional areas that earns 15 bonus points. Transition to PR via the 191 visa is possible after 3 years.",
        requirements: ["State/territory nomination", "Residence in regional Australia", "Skills assessment", "Competent English"],
        processingTime: "4–24 months", prDirect: false,
        details: "The 491 visa offers 15 additional points for those willing to live and work in regional Australia. After 3 years of regional work and meeting the regional income threshold, transition to permanent residency is possible through the 191 (Permanent Residence via Regional) visa."
    },
    {
        id: 'default-6', color: "#10b981", tag: "STUDENT",
        title: "Student Visa (500)",
        subtitle: "Student Visa",
        desc: "A visa for full-time study at a CRICOS-registered institution in Australia. Includes work rights (48 hours per fortnight during study periods).",
        requirements: ["Acceptance from a CRICOS-registered institution", "GTE (Genuine Temporary Entrant)", "English proficiency", "Financial capacity"],
        processingTime: "1–4 months", prDirect: false,
        details: "The 500 visa is an important stepping stone towards the 485 (Graduate Visa) after studying in Australia. Meeting the GTE (Genuine Temporary Entrant) requirement is critical. The 48-hour per fortnight work allowance provides students with significant income opportunities."
    },
    {
        id: 'default-7', color: "#ec4899", tag: "PARTNER",
        title: "Partner Visa (820/801)",
        subtitle: "Partner Visa",
        desc: "A two-stage visa for those in a relationship with an Australian citizen or permanent resident. Temporary residency in the first stage, permanent in the second.",
        requirements: ["Australian sponsor", "Proof of relationship", "Health examination", "Character requirement"],
        processingTime: "12–30 months", prDirect: false,
        details: "The process begins with a temporary partner visa (820 onshore or 309 offshore) and is completed 2 years later with a permanent partner visa (801/100). The genuineness of the relationship is evidenced by joint bank accounts, lease agreements, family and friend references, and photographs."
    },
    {
        id: 'default-8', color: "#6366f1", tag: "BUSINESS",
        title: "Business Innovation & Investment (888)",
        subtitle: "Business Innovation and Investment Visa",
        desc: "A permanent residency visa granted for the purpose of establishing or managing a business in Australia or conducting specified investment activities.",
        requirements: ["Successful business background", "Minimum net assets", "State nomination", "No English requirement (some streams)"],
        processingTime: "12–48 months", prDirect: true,
        details: "The 888 visa is typically the permanent residency pathway for those who have completed the 188 temporary business visa. It includes different streams: Business Innovation stream (turnover and business requirements), Investor stream (investment amount requirements) and Significant Investor stream (5M AUD+)."
    },
];

// ── Modal Component ───────────────────────────────────────────────────────────
const ProgramModal = ({ program, onClose }) => {
    if (!program) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div
                className="relative bg-[#111] border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                style={{ borderTop: `3px solid ${program.color || '#ccff00'}` }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <span
                        className="px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                        style={{ backgroundColor: `${program.color}20`, color: program.color }}
                    >
                        {program.tag}
                    </span>
                    {program.prDirect && (
                        <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40">DIRECT PR</span>
                    )}
                    {program.processingTime && (
                        <span className="text-[10px] text-white/30 font-bold ml-auto">~{program.processingTime}</span>
                    )}
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1" style={{ color: program.color }}>
                    {program.title}
                </h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">{program.subtitle}</p>

                <p className="text-base text-white/70 leading-relaxed mb-6">{program.desc}</p>

                {program.details && (
                    <div className="bg-black/30 border border-white/5 p-5 mb-6">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">DETAILED INFORMATION</p>
                        <p className="text-sm text-white/60 leading-relaxed">{program.details}</p>
                    </div>
                )}

                {program.requirements?.length > 0 && (
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-3">KEY REQUIREMENTS</p>
                        <ul className="space-y-2">
                            {program.requirements.map((req, j) => (
                                <li key={j} className="flex items-center gap-3 text-sm text-white/60">
                                    <span className="w-2 h-2 shrink-0" style={{ backgroundColor: program.color }}></span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10">
                    <a
                        href="mailto:migron@mtive.tech"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-5 py-2.5 font-black uppercase text-sm hover:brightness-110 transition-all"
                    >
                        Get in Touch <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};

const ProgramTurleriPage = () => {
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    // Always use English defaults — Firestore data is Turkish-only
    const programs = defaultPrograms;

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'programs'));
                // Firestore data is Turkish-only; ignore it and use English defaults
                if (!snapshot.empty) {
                    // No-op: we intentionally skip Turkish Firestore data
                }
            } catch (err) {
                console.error('Error fetching programs:', err);
            }
            setLoading(false);
        };
        fetchPrograms();
    }, []);

    return (
        <>
            <SEOHead
                title="Australian Visa Programs — Complete Overview | MIGRON"
                description="Overview of all Australian immigration pathways — skilled migration, employer-sponsored, regional, student, partner and family visa programs explained."
                path="/program-turleri"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> Back to Home
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">VISA CATEGORIES</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#ccff00]">
                                    <Layers className="text-black" size={28} strokeWidth={3} />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    VISA PROGRAMS
                                </h1>
                            </div>
                            <div className="max-w-xl">
                                <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                                    Explore all visa programs available for migrating to Australia. Click on a card for details.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-[1200px] mx-auto px-6 py-12">
                    {loading ? (
                        <div className="text-center text-white/40 py-12 animate-pulse">LOADING...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {programs.map((program) => (
                                <button
                                    key={program.id}
                                    onClick={() => setSelected(program)}
                                    className="bg-[#111] border border-white/5 p-8 hover:border-white/30 transition-all group text-left w-full"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                                                style={{ backgroundColor: `${program.color || '#ccff00'}20`, color: program.color || '#ccff00' }}
                                            >
                                                {program.tag}
                                            </span>
                                            {program.prDirect && (
                                                <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40">DIRECT PR</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                                            {program.processingTime ? `~${program.processingTime}` : ''}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-black uppercase tracking-tight mb-1 group-hover:transition-colors" style={{ color: program.color || '#ccff00' }}>
                                        {program.title}
                                    </h2>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">{program.subtitle}</p>
                                    <p className="text-sm text-white/60 leading-relaxed mb-6">{program.desc}</p>

                                    {program.requirements?.length > 0 && (
                                        <ul className="space-y-1 mb-4">
                                            {program.requirements.map((req, j) => (
                                                <li key={j} className="flex items-center gap-2 text-xs text-white/50">
                                                    <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: program.color || '#ccff00' }}></span>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity mt-2" style={{ color: program.color || '#ccff00' }}>
                                        View Details <ChevronRight size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 bg-[#111] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-black text-lg uppercase">Which program suits you?</p>
                            <p className="text-white/40 text-sm mt-1">Get in touch with us directly for your questions.</p>
                        </div>
                        <a
                            href="mailto:migron@mtive.tech"
                            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all shrink-0"
                        >
                            Get in Touch <ArrowUpRight size={16} />
                        </a>
                    </div>
                </section>
            </div>

            {selected && <ProgramModal program={selected} onClose={() => setSelected(null)} />}
        </>
    );
};

export default ProgramTurleriPage;
