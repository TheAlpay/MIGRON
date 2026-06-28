import React, { useState, useMemo } from 'react';
import { DollarSign, Calculator, Info, ExternalLink, Clock } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { AWARDS, NATIONAL_MINIMUM, CASUAL_LOADING, OVERTIME_RATES, LEAVE_ENTITLEMENTS, computeSalary } from '../../data/salaryAwards';

const fmt = (n) => n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n) => `$${(n / 1000).toFixed(1)}k`;

const SalaryCalculatorPage = () => {
  const [awardId,       setAwardId]       = useState('hospitality');
  const [levelIndex,    setLevelIndex]    = useState(0);
  const [casual,        setCasual]        = useState(false);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(38);
  const [overtimeHours, setOvertimeHours] = useState(0);

  const award = AWARDS.find(a => a.id === awardId) || AWARDS[0];
  const classification = award.classifications[levelIndex] || award.classifications[0];

  const result = useMemo(() => computeSalary(classification.hourly, {
    hoursPerWeek,
    casual,
    overtime: overtimeHours,
  }), [classification.hourly, hoursPerWeek, casual, overtimeHours]);

  const saturdayRate = classification.hourly * (casual ? 1 + CASUAL_LOADING : 1) * 1.25;
  const sundayRate   = classification.hourly * (casual ? 1 + CASUAL_LOADING : 1) * 2.0;
  const phRate       = classification.hourly * (casual ? 1 + CASUAL_LOADING : 1) * 2.5;

  return (
    <>
      <SEOHead
        title="Australian Salary & Award Rate Calculator — Fair Work 2026"
        description="Calculate your Australian wage based on the current Fair Work Modern Awards. Includes casual loading, overtime rates, and penalty rates for all major industries."
        path="/salary-calculator"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'MIGRON Australian Salary & Award Calculator',
        applicationCategory: 'FinanceApplication',
        description: 'Calculate Australian wages, award rates, overtime and casual loading based on current Fair Work Modern Awards.',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
      })}} />

      <main id="main-content" className="pt-24 pb-20 min-h-screen bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={14} className="text-[#ccff00]" />
              <span className="text-[#ccff00] text-xs font-black uppercase tracking-widest">Fair Work Award Calculator</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-3">
              CALCULATE YOUR<br />
              <span className="text-[#ccff00]">AUSTRALIAN WAGE</span>
            </h1>
            <p className="text-white/50 max-w-2xl">
              Based on Fair Work Modern Award rates effective <strong className="text-white/70">1 July 2026</strong>.
              Includes casual loading, overtime, Saturday/Sunday penalty rates and public holidays.
            </p>
          </div>

          {/* National Minimum Wage Banner */}
          <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#ccff00]/70 mb-1">National Minimum Wage — effective 1 July 2026</p>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-black text-[#ccff00]">${NATIONAL_MINIMUM.hourly}/hr</p>
                <p className="text-white/50">or ${NATIONAL_MINIMUM.weekly.toFixed(2)}/week</p>
              </div>
            </div>
            <a href="https://www.fairwork.gov.au/pay-and-wages/minimum-wages" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#ccff00] hover:underline">
              Fair Work <ExternalLink size={10} />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT — Calculator inputs */}
            <div className="space-y-5">
              {/* Award selection */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                <h2 className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Select Your Award</h2>
                <div className="space-y-1.5">
                  {AWARDS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => { setAwardId(a.id); setLevelIndex(0); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                        awardId === a.id
                          ? 'bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] font-bold'
                          : 'text-white/50 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {a.shortName}
                    </button>
                  ))}
                </div>
                <p className="text-white/30 text-xs mt-3 leading-relaxed">{award.description}</p>
              </div>

              {/* Classification */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                <h2 className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Classification Level</h2>
                <div className="space-y-1.5">
                  {award.classifications.map((cl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLevelIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex justify-between items-center ${
                        levelIndex === idx
                          ? 'bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00]'
                          : 'text-white/50 hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="flex-1 mr-3">{cl.level}</span>
                      <span className="font-black flex-shrink-0">${cl.hourly.toFixed(2)}/hr</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-white/50">Work Arrangement</h2>

                {/* Casual toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-bold">Casual Employee</p>
                    <p className="text-white/30 text-xs">Adds 25% casual loading to base rate</p>
                  </div>
                  <button
                    onClick={() => setCasual(!casual)}
                    className={`w-12 h-6 rounded-full transition-all relative ${casual ? 'bg-[#ccff00]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${casual ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {/* Hours per week */}
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm font-bold">Hours per Week</p>
                    <p className="text-[#ccff00] font-black text-sm">{hoursPerWeek} hrs</p>
                  </div>
                  <input
                    type="range" min="1" max="60" value={hoursPerWeek}
                    onChange={e => setHoursPerWeek(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                  <div className="flex justify-between text-white/20 text-xs mt-0.5">
                    <span>Part-time (1)</span><span>Standard (38)</span><span>Full (60)</span>
                  </div>
                </div>

                {/* Overtime hours */}
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm font-bold">Overtime Hours / Week</p>
                    <p className="text-[#ccff00] font-black text-sm">{overtimeHours} hrs</p>
                  </div>
                  <input
                    type="range" min="0" max="20" value={overtimeHours}
                    onChange={e => setOvertimeHours(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                  <p className="text-white/30 text-xs mt-0.5">First 2hrs: 1.5×, after: 2×</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Results */}
            <div className="space-y-5">
              {/* Main results card */}
              <div className="bg-[#0a0a0a] border border-[#ccff00]/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator size={14} className="text-[#ccff00]" />
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">Your Calculation</span>
                </div>

                <div className="text-center mb-5 pb-5 border-b border-white/10">
                  <p className="text-white/40 text-xs mb-1">Effective Hourly Rate</p>
                  <p className="text-[#ccff00] font-black text-5xl">${fmt(result.hourly)}</p>
                  <p className="text-white/30 text-sm mt-1">per hour</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Weekly (base)',     value: `$${fmt(result.weeklyBase)}`,   note: `${hoursPerWeek} hrs × $${fmt(result.hourly)}/hr` },
                    { label: 'Weekly (with OT)',  value: `$${fmt(result.weeklyWithOT)}`, note: overtimeHours > 0 ? `+${overtimeHours} overtime hrs` : '—' },
                    { label: 'Annual (base)',      value: fmtK(result.annualBase),        note: '52 weeks' },
                    { label: 'Annual (with leave loading)', value: fmtK(result.annualWithLeave), note: '~4 wks leave loading' },
                    { label: 'Annual (with OT)',   value: fmtK(result.annualWithOT),      note: 'OT every week' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-white/70 text-sm">{row.label}</p>
                        <p className="text-white/30 text-xs">{row.note}</p>
                      </div>
                      <p className="text-white font-black">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalty rates */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Penalty Rates</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Saturday',       rate: saturdayRate, multiplier: '1.25×' },
                    { label: 'Sunday',         rate: sundayRate,   multiplier: '2.0×'  },
                    { label: 'Public Holiday', rate: phRate,       multiplier: '2.5×'  },
                    { label: 'Overtime 1st 2h',rate: result.hourly * OVERTIME_RATES.first2hrs, multiplier: '1.5×' },
                    { label: 'Overtime after', rate: result.hourly * OVERTIME_RATES.after2hrs, multiplier: '2.0×' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-white/30 text-xs">{r.multiplier}</span>
                        <span className="text-white/70 text-sm">{r.label}</span>
                      </div>
                      <span className="text-[#ccff00] font-black text-sm">${fmt(r.rate)}/hr</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave entitlements */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={12} className="text-white/40" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Leave Entitlements</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(LEAVE_ENTITLEMENTS).map(([key, val]) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-[#ccff00] text-xs mt-0.5 flex-shrink-0">›</span>
                      <span className="text-white/50 text-xs">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Award notes */}
              {award.notes && (
                <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <Info size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-300/80 text-xs">{award.notes}</p>
                </div>
              )}

              <a
                href="https://www.fairwork.gov.au/pay-and-wages/minimum-wages"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-white/10 rounded-lg text-white/50 hover:text-white hover:border-white/30 text-sm transition-all"
              >
                Verify on Fair Work website <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SalaryCalculatorPage;
