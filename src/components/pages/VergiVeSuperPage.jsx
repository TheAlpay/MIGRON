import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

const AccordionItem = ({ title, children, accent }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/5 mb-2 overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors group"
            >
                <span className="font-black uppercase tracking-tight text-base group-hover:text-white text-white/80 pr-4">
                    {title}
                </span>
                {open
                    ? <ChevronUp size={18} className="shrink-0" style={{ color: accent }} />
                    : <ChevronDown size={18} className="shrink-0 text-white/20" />}
            </button>
            {open && (
                <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-wrap items-baseline gap-2 py-2.5 border-b border-white/5 last:border-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/30 w-40 shrink-0">
            {label}
        </span>
        <span className="text-sm text-white/70">{value}</span>
    </div>
);

const VergiVeSuperPage = () => {
    return (
        <>
            <SEOHead
                title="Tax & Superannuation in Australia — Complete Migrant Guide"
                description="Complete guide to Australian tax for migrants — TFN, myTax, tax rates, superannuation (super), how to choose a super fund and claim your super when leaving."
                path="/vergi-ve-super"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} />
                                Back to Home
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                EDUCATION — FINANCE
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 bg-[#ccff00]">
                                <DollarSign className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    TAX &amp; SUPER
                                </h1>
                                <p className="text-sm text-white/40 font-medium mt-1">
                                    Don't leave money on the table
                                </p>
                            </div>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium max-w-2xl">
                            Tax Return and Superannuation — the two most missed opportunities in Australia. Here's what you need to know.
                        </p>
                    </div>
                </section>

                <div className="max-w-[1200px] mx-auto px-6 py-10">

                    {/* ── Tax Return ── */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[9px] font-black tracking-[0.3em] uppercase px-2 py-1 bg-[#ccff00]/10 text-[#ccff00]">
                                PART 1
                            </span>
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                TAX RETURN — WHAT IS IT &amp; HOW?
                            </h2>
                        </div>

                        {/* Key info cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#ccff00] mb-1">1 Jul – 31 Oct</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    Filing period
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#ccff00] mb-1">$1,000–2,500</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    Average refund (AUD)
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#ccff00] mb-1">$0</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    Cost via myTax
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 p-6 mb-4">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                HOW IT WORKS
                            </p>
                            <div className="space-y-1">
                                <InfoRow
                                    label="What"
                                    value="Everyone who works in Australia files an annual tax return."
                                />
                                <InfoRow
                                    label="How to do it"
                                    value="myGov → ATO → myTax"
                                />
                                <InfoRow
                                    label="Cost"
                                    value="Free (myTax). Tax agents charge 10–15%."
                                />
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="border border-[#ccff00]/20 bg-[#ccff00]/5 p-4 flex items-start gap-3">
                            <AlertTriangle size={16} className="text-[#ccff00] shrink-0 mt-0.5" />
                            <p className="text-sm text-white/60">
                                myTax is free and easy enough. You don't need a tax agent for a standard return. The average fee is $150–300 AUD — money you don't need to spend.
                            </p>
                        </div>

                        {/* Step by step */}
                        <div className="mt-6">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                STEP-BY-STEP: myTAX
                            </p>
                            <div className="space-y-2">
                                {[
                                    "Log in to myGov (mygov.gov.au) — create an account if you don't have one",
                                    "Link your ATO service (requires your TFN)",
                                    "Navigate to ATO → Tax → Lodge a return",
                                    "Most information is pre-filled — check your income, deductions, bank details",
                                    "Add any work-related expenses (uniform, tools, travel for work, etc.)",
                                    "Review and submit — refund typically arrives within 2 weeks",
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-[#111] border border-white/5 p-4">
                                        <span className="text-[#ccff00] font-black text-sm w-5 shrink-0">{i + 1}.</span>
                                        <p className="text-sm text-white/60">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Superannuation ── */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[9px] font-black tracking-[0.3em] uppercase px-2 py-1 bg-[#a78bfa]/10 text-[#a78bfa]">
                                PART 2
                            </span>
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                SUPERANNUATION
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#a78bfa] mb-1">12%</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    Employer contribution
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-xl font-black text-[#a78bfa] mb-1">DASP</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    Claim when you leave
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-xl font-black text-[#a78bfa] mb-1">myGov</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    Track your balance
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 p-6 mb-4">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                KEY FACTS
                            </p>
                            <div className="space-y-1">
                                <InfoRow
                                    label="What?"
                                    value="Your employer is legally required to contribute 12% of your salary to your retirement fund (from 1 July 2025)."
                                />
                                <InfoRow
                                    label="Tracking"
                                    value="myGov → ATO → Your super accounts are visible there."
                                />
                                <InfoRow
                                    label="Multiple jobs"
                                    value="If you work multiple jobs, each may open a separate super fund. Consolidate them — don't let money go to waste."
                                />
                                <InfoRow
                                    label="Leaving Australia"
                                    value="When you permanently leave Australia, you can claim it back — this is called DASP (Departing Australia Superannuation Payment)."
                                />
                                <InfoRow
                                    label="Popular funds"
                                    value="Australian Super, Hostplus are the most common."
                                />
                            </div>
                        </div>

                        {/* DASP steps */}
                        <div className="mt-6">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                DASP — HOW TO CLAIM WHEN LEAVING
                            </p>
                            <div className="space-y-2">
                                {[
                                    "Leave Australia permanently (or let your visa expire)",
                                    "Apply via the ATO DASP portal (ato.gov.au/dasp)",
                                    "Provide your super fund details, TFN and passport",
                                    "Payment is processed within a few weeks — note: there's a 65% tax applied to working holiday makers",
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-[#111] border border-white/5 p-4">
                                        <span className="text-[#a78bfa] font-black text-sm w-5 shrink-0">{i + 1}.</span>
                                        <p className="text-sm text-white/60">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related links */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                            USEFUL LINKS
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: 'myGov', url: 'https://my.gov.au' },
                                { label: 'ATO — myTax', url: 'https://ato.gov.au' },
                                { label: 'ATO — DASP', url: 'https://ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/temporary-residents-and-super/temporary-resident-departing-australia-superannuation-payment' },
                            ].map(link => (
                                <a
                                    key={link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 border border-white/5 hover:border-[#ccff00]/30 hover:text-[#ccff00] transition-all group"
                                >
                                    <span className="text-sm font-bold text-white/60 group-hover:text-[#ccff00]">{link.label}</span>
                                    <ExternalLink size={13} className="text-white/20 group-hover:text-[#ccff00]" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VergiVeSuperPage;
