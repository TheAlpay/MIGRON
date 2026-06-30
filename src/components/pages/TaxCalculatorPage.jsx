import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, ExternalLink, Info, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

// ── 2025-26 Tax constants ─────────────────────────────────────────────────────

const RESIDENT_BRACKETS = [
  { min: 0,       max: 18200,   base: 0,      rate: 0,     label: '$0 – $18,200' },
  { min: 18201,   max: 45000,   base: 0,      rate: 0.19,  label: '$18,201 – $45,000' },
  { min: 45001,   max: 120000,  base: 5092,   rate: 0.325, label: '$45,001 – $120,000' },
  { min: 120001,  max: 180000,  base: 29467,  rate: 0.37,  label: '$120,001 – $180,000' },
  { min: 180001,  max: Infinity, base: 51667, rate: 0.45,  label: '$180,001+' },
];

const NON_RESIDENT_BRACKETS = [
  { min: 0,      max: 120000,  base: 0,      rate: 0.325, label: '$0 – $120,000' },
  { min: 120001, max: 180000,  base: 39000,  rate: 0.37,  label: '$120,001 – $180,000' },
  { min: 180001, max: Infinity, base: 61200, rate: 0.45,  label: '$180,001+' },
];

const WHM_BRACKETS = [
  { min: 0,      max: 45000,   base: 0,      rate: 0.15,  label: '$0 – $45,000' },
  { min: 45001,  max: 120000,  base: 6750,   rate: 0.325, label: '$45,001 – $120,000' },
  { min: 120001, max: 180000,  base: 31125,  rate: 0.37,  label: '$120,001 – $180,000' },
  { min: 180001, max: Infinity, base: 53325, rate: 0.45,  label: '$180,001+' },
];

// Low Income Tax Offset (LITO) 2025-26
const calcLITO = (income) => {
  if (income <= 37500) return 700;
  if (income <= 45000) return 700 - ((income - 37500) * 0.05);
  if (income <= 66667) return 325 - ((income - 45000) * 0.015);
  return 0;
};

// HECS/HELP repayment thresholds 2025-26
const HECS_THRESHOLDS = [
  { min: 0,      max: 54435,   rate: 0 },
  { min: 54435,  max: 62850,   rate: 0.01 },
  { min: 62851,  max: 66620,   rate: 0.02 },
  { min: 66621,  max: 70618,   rate: 0.025 },
  { min: 70619,  max: 74855,   rate: 0.03 },
  { min: 74856,  max: 79346,   rate: 0.035 },
  { min: 79347,  max: 84108,   rate: 0.04 },
  { min: 84109,  max: 89154,   rate: 0.045 },
  { min: 89155,  max: 94504,   rate: 0.05 },
  { min: 94505,  max: Infinity, rate: 0.055 },
];

const calcTax = (income, residency) => {
  const brackets = residency === 'resident' ? RESIDENT_BRACKETS
    : residency === 'non-resident' ? NON_RESIDENT_BRACKETS
    : WHM_BRACKETS;

  let tax = 0;
  for (const b of brackets) {
    if (income > b.min - 1) {
      const taxable = Math.min(income, b.max === Infinity ? income : b.max) - (b.min - 1);
      tax = b.base + Math.max(0, taxable) * b.rate;
    }
  }
  return Math.max(0, tax);
};

const calcBracketBreakdown = (income, residency) => {
  const brackets = residency === 'resident' ? RESIDENT_BRACKETS
    : residency === 'non-resident' ? NON_RESIDENT_BRACKETS
    : WHM_BRACKETS;

  return brackets.map(b => {
    const lower = b.min - 1;
    if (income <= lower) return { ...b, amount: 0, taxableSlice: 0 };
    const upper = b.max === Infinity ? income : b.max;
    const taxableSlice = Math.min(income, upper) - lower;
    return { ...b, amount: taxableSlice * b.rate, taxableSlice };
  });
};

const calcHECS = (income) => {
  for (const t of HECS_THRESHOLDS) {
    if (income <= (t.max === Infinity ? Infinity : t.max) && income >= t.min) {
      return income * t.rate;
    }
  }
  return 0;
};

const fmt = (n) => n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtD = (n) => n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;

const BRACKET_COLORS = ['#334155', '#475569', '#16a34a', '#f59e0b', '#ef4444', '#dc2626'];

// ── Component ─────────────────────────────────────────────────────────────────

const TaxCalculatorPage = () => {
  const [income, setIncome] = useState(80000);
  const [residency, setResidency] = useState('resident');
  const [includeSuper, setIncludeSuper] = useState(false);
  const [includeHECS, setIncludeHECS] = useState(false);
  const [showBrackets, setShowBrackets] = useState(true);

  const SGC_RATE = 0.115; // 11.5% for 2025-26

  const calc = useMemo(() => {
    // If includeSuper, the salary entered is the package (salary + super),
    // so base = salary / (1 + SGC_RATE). Otherwise salary IS the taxable income.
    const grossIncome = includeSuper ? income / (1 + SGC_RATE) : income;
    const superAmount = grossIncome * SGC_RATE;

    const incomeTax = calcTax(grossIncome, residency);
    const lito = residency === 'resident' ? calcLITO(grossIncome) : 0;
    const taxAfterLITO = Math.max(0, incomeTax - lito);
    const medicare = residency === 'resident' ? grossIncome * 0.02 : 0;
    const hecs = includeHECS ? calcHECS(grossIncome) : 0;

    const totalDeductions = taxAfterLITO + medicare + hecs;
    const netAnnual = grossIncome - totalDeductions;

    const brackets = calcBracketBreakdown(grossIncome, residency);
    const maxBracketAmount = Math.max(...brackets.map(b => b.amount), 1);

    return {
      grossIncome,
      superAmount,
      incomeTax: taxAfterLITO,
      lito,
      medicare,
      hecs,
      totalDeductions,
      netAnnual,
      netMonthly: netAnnual / 12,
      netFortnightly: netAnnual / 26,
      netWeekly: netAnnual / 52,
      effectiveRate: grossIncome > 0 ? totalDeductions / grossIncome : 0,
      brackets,
      maxBracketAmount,
    };
  }, [income, residency, includeSuper, includeHECS]);

  const RESIDENCY_OPTIONS = [
    { value: 'resident',     label: 'Australian Resident',     desc: 'Tax resident, Medicare applies' },
    { value: 'non-resident', label: 'Non-Resident',            desc: 'No LITO, no Medicare' },
    { value: 'whm',          label: 'Working Holiday (417/462)', desc: '15% on first $45k' },
  ];

  return (
    <>
      <SEOHead
        title="Australian Income Tax Calculator 2025-26 | MIGRON"
        description="Calculate your Australian take-home pay. Covers income tax, Medicare levy, superannuation and HECS/HELP repayments for residents, non-residents and working holiday makers."
        path="/tax-calculator"
      />

      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

        {/* Header section */}
        <section className="pt-8 pb-6 px-6 border-b border-white/10">
          <div className="max-w-[960px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                <ArrowLeft size={14} /> Back to Home
              </Link>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                Tools — Tax
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#ccff00]">
                <Calculator className="text-black" size={28} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                  Income Tax Calculator
                </h1>
                <p className="text-sm text-white/40 mt-1">2025–26 Australian Tax Year · ATO Rates</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[960px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── LEFT: Inputs ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Income input */}
              <div className="bg-[#111] border border-white/5 p-5">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Annual Income (AUD)</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-white/40 text-xl font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    max={500000}
                    step={1000}
                    value={income}
                    onChange={e => setIncome(Math.max(0, Math.min(500000, Number(e.target.value))))}
                    className="bg-transparent text-[#ccff00] font-black text-3xl w-full outline-none border-b border-white/10 focus:border-[#ccff00] transition-colors pb-1"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={income}
                  onChange={e => setIncome(Number(e.target.value))}
                  className="w-full accent-[#ccff00]"
                />
                <div className="flex justify-between text-white/20 text-xs mt-1">
                  <span>$0</span><span>$250k</span><span>$500k</span>
                </div>
              </div>

              {/* Residency status */}
              <div className="bg-[#111] border border-white/5 p-5">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Residency Status</h2>
                <div className="space-y-2">
                  {RESIDENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setResidency(opt.value)}
                      className={`w-full text-left px-3 py-3 border transition-all rounded-sm ${
                        residency === opt.value
                          ? 'border-[#ccff00]/40 bg-[#ccff00]/8 text-[#ccff00]'
                          : 'border-white/5 text-white/50 hover:border-white/20 hover:text-white/80'
                      }`}
                    >
                      <span className="font-bold text-sm block">{opt.label}</span>
                      <span className="text-xs opacity-60">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-[#111] border border-white/5 p-5 space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Options</h2>

                {/* Super toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-bold">Salary includes Super</p>
                    <p className="text-white/30 text-xs">Salary package = base + 11.5% SGC</p>
                  </div>
                  <button
                    onClick={() => setIncludeSuper(!includeSuper)}
                    className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${includeSuper ? 'bg-[#ccff00]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${includeSuper ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {/* HECS toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-bold">HECS/HELP Debt</p>
                    <p className="text-white/30 text-xs">Show student loan repayment</p>
                  </div>
                  <button
                    onClick={() => setIncludeHECS(!includeHECS)}
                    className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${includeHECS ? 'bg-[#ccff00]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${includeHECS ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Results ── */}
            <div className="lg:col-span-3 space-y-5">

              {/* Take-home hero */}
              <div className="bg-[#111] border border-[#ccff00]/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Take-Home Pay</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Weekly',       value: calc.netWeekly },
                    { label: 'Fortnightly',  value: calc.netFortnightly },
                    { label: 'Monthly',      value: calc.netMonthly },
                    { label: 'Annual',       value: calc.netAnnual },
                  ].map(item => (
                    <div key={item.label} className="bg-[#0a0a0a] border border-white/5 p-3 text-center">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-[#ccff00] font-black text-lg leading-tight">${fmt(item.value)}</p>
                    </div>
                  ))}
                </div>

                {/* Breakdown rows */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-white/60 text-sm">Gross Income</span>
                    <span className="text-white font-bold">${fmt(calc.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-t border-white/5">
                    <span className="text-white/60 text-sm">Income Tax</span>
                    <span className="text-red-400 font-bold">− ${fmt(calc.incomeTax)}</span>
                  </div>
                  {calc.lito > 0 && (
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-white/40 text-xs pl-2">Low Income Tax Offset (LITO)</span>
                      <span className="text-green-400 text-sm font-bold">+ ${fmt(calc.lito)}</span>
                    </div>
                  )}
                  {calc.medicare > 0 && (
                    <div className="flex justify-between items-center py-1.5 border-t border-white/5">
                      <span className="text-white/60 text-sm">Medicare Levy (2%)</span>
                      <span className="text-red-400 font-bold">− ${fmt(calc.medicare)}</span>
                    </div>
                  )}
                  {includeHECS && (
                    <div className="flex justify-between items-center py-1.5 border-t border-white/5">
                      <span className="text-white/60 text-sm">HECS/HELP Repayment</span>
                      <span className="text-orange-400 font-bold">− ${fmt(calc.hecs)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-1.5 border-t border-white/5">
                    <span className="text-white/60 text-sm">Super Guarantee (11.5%)</span>
                    <span className="text-blue-400 font-bold">+ ${fmt(calc.superAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-[#ccff00]/20 mt-2">
                    <span className="text-white font-black uppercase tracking-wide text-sm">Net Take-Home</span>
                    <span className="text-[#ccff00] font-black text-xl">${fmt(calc.netAnnual)}</span>
                  </div>
                </div>
              </div>

              {/* What you keep vs what you pay */}
              <div className="bg-[#111] border border-white/5 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">What You Keep vs What You Pay</p>
                <div className="flex h-8 overflow-hidden rounded-sm mb-3">
                  <div
                    className="bg-[#ccff00] transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${((calc.netAnnual / calc.grossIncome) * 100).toFixed(1)}%` }}
                  >
                    {calc.netAnnual / calc.grossIncome > 0.2 && (
                      <span className="text-black font-black text-xs px-2 truncate">
                        {fmtPct(calc.netAnnual / calc.grossIncome)} Keep
                      </span>
                    )}
                  </div>
                  <div
                    className="bg-red-500/60 transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${(calc.effectiveRate * 100).toFixed(1)}%` }}
                  >
                    {calc.effectiveRate > 0.1 && (
                      <span className="text-white font-black text-xs px-2 truncate">
                        {fmtPct(calc.effectiveRate)} Tax
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Effective tax rate: <strong className="text-white/60">{fmtPct(calc.effectiveRate)}</strong></span>
                  <span>You keep: <strong className="text-[#ccff00]">{fmtPct(calc.netAnnual / calc.grossIncome)}</strong></span>
                </div>
              </div>

              {/* Tax bracket breakdown */}
              <div className="bg-[#111] border border-white/5 p-5">
                <button
                  onClick={() => setShowBrackets(!showBrackets)}
                  className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3"
                >
                  <span>Tax Bracket Breakdown</span>
                  {showBrackets ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showBrackets && (
                  <div className="space-y-3">
                    {calc.brackets.map((b, i) => {
                      const pct = calc.maxBracketAmount > 0 ? (b.amount / calc.maxBracketAmount) * 100 : 0;
                      const isActive = b.taxableSlice > 0;
                      return (
                        <div key={i} className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/60">{b.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-white/30">{fmtPct(b.rate)} rate</span>
                              <span className="text-white font-bold w-20 text-right">${fmt(b.amount)}</span>
                            </div>
                          </div>
                          <div className="h-3 bg-white/5 overflow-hidden rounded-sm">
                            <div
                              className="h-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: BRACKET_COLORS[i] || '#ccff00',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-white/20 text-xs mt-2 pt-2 border-t border-white/5">
                      Australia uses a progressive (marginal) tax system — you only pay each rate on the income within that bracket.
                    </p>
                  </div>
                )}
              </div>

              {/* ATO link */}
              <a
                href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-widest transition-all"
              >
                Rates sourced from ATO — ato.gov.au <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* ── Explanation cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[
              {
                title: 'Income Tax',
                body: 'Australia uses marginal (progressive) tax rates. You pay 0% on the first $18,200, then increasingly higher rates on each slice above. You never lose money by earning more — a higher bracket only applies to income above that threshold.',
              },
              {
                title: 'Medicare Levy',
                body: 'Australian tax residents pay 2% of their taxable income as the Medicare Levy. This funds the public health system (Medicare). Non-residents and working holiday makers are not subject to Medicare Levy.',
              },
              {
                title: 'Superannuation (SGC)',
                body: 'Your employer must pay 11.5% of your ordinary earnings on top of your salary into your super fund. This money is locked until you reach preservation age (generally 60). Super is taxed at 15% within the fund.',
              },
              {
                title: 'LITO — Low Income Tax Offset',
                body: 'If you earn under $66,667, you receive a tax offset of up to $700 which reduces the amount of tax you owe. It is automatically applied when you lodge your tax return.',
              },
              {
                title: 'HECS/HELP Repayment',
                body: 'If you have a student loan from studying at an Australian university, compulsory repayments are made through the tax system once your income exceeds $54,435. The repayment rate rises gradually with income.',
              },
              {
                title: 'Non-Residents & WHM',
                body: 'Non-residents pay 32.5% from the first dollar with no tax-free threshold or offsets. Working Holiday Makers (visa 417/462) pay 15% on the first $45,000, then standard non-resident rates apply above that.',
              },
            ].map(card => (
              <div key={card.title} className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={12} className="text-[#ccff00] flex-shrink-0" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/70">{card.title}</h3>
                </div>
                <p className="text-white/40 text-xs leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-[#111] border border-white/5 p-4 text-xs text-white/30 leading-relaxed">
            <Info size={12} className="inline mr-1.5" />
            This calculator provides estimates only and does not constitute tax advice. Figures are based on 2025–26 ATO rates.
            Individual circumstances may vary. Always consult a registered tax agent or visit{' '}
            <a href="https://www.ato.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">
              ato.gov.au
            </a>{' '}
            for official guidance.
          </div>
        </section>
      </div>
    </>
  );
};

export default TaxCalculatorPage;
