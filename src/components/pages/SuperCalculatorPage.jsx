import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ExternalLink, Info, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) => n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtD = (n) => n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Year-by-year super projection using compound growth.
 * Each year:
 *   balance = (balance + employerContrib + voluntaryContrib) * (1 + returnRate)
 * Super earnings taxed at 15% within fund (applied to the growth portion).
 */
const projectSuper = ({
  startBalance,
  currentAge,
  retirementAge,
  annualSalary,
  employerRate,
  voluntaryContrib,
  returnRate,
}) => {
  const years = Math.max(0, retirementAge - currentAge);
  const taxRate = 0.15; // 15% earnings tax within fund
  const netReturnRate = returnRate * (1 - taxRate); // effective after-tax return

  let balance = startBalance;
  let totalEmployer = 0;
  let totalVoluntary = 0;
  let totalEarnings = 0;

  const yearlyData = [];

  for (let y = 1; y <= years; y++) {
    const employer = annualSalary * employerRate;
    const voluntary = voluntaryContrib;
    const earningsBeforeTax = (balance + employer + voluntary) * returnRate;
    const earningsTax = earningsBeforeTax * taxRate;
    const netEarnings = earningsBeforeTax - earningsTax;

    balance = balance + employer + voluntary + netEarnings;
    totalEmployer += employer;
    totalVoluntary += voluntary;
    totalEarnings += netEarnings;

    yearlyData.push({
      year: y,
      age: currentAge + y,
      balance: Math.round(balance),
      employer: Math.round(employer),
      voluntary: Math.round(voluntary),
      earnings: Math.round(netEarnings),
      cumEmployer: Math.round(totalEmployer),
      cumVoluntary: Math.round(totalVoluntary),
      cumEarnings: Math.round(totalEarnings),
    });
  }

  return {
    finalBalance: Math.round(balance),
    totalEmployer: Math.round(totalEmployer),
    totalVoluntary: Math.round(totalVoluntary),
    totalEarnings: Math.round(totalEarnings),
    years,
    yearlyData,
  };
};

// ── Component ─────────────────────────────────────────────────────────────────

const SuperCalculatorPage = () => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentAge, setCurrentAge] = useState(30);
  const [annualSalary, setAnnualSalary] = useState(80000);
  const [employerRate, setEmployerRate] = useState(11.5);
  const [voluntaryContrib, setVoluntaryContrib] = useState(0);
  const [returnRate, setReturnRate] = useState(7);
  const [retirementAge, setRetirementAge] = useState(60);
  const [showAllYears, setShowAllYears] = useState(false);
  const [showTable, setShowTable] = useState(true);

  const result = useMemo(() => {
    if (currentAge >= retirementAge) {
      return {
        finalBalance: currentBalance,
        totalEmployer: 0,
        totalVoluntary: 0,
        totalEarnings: 0,
        years: 0,
        yearlyData: [],
      };
    }
    return projectSuper({
      startBalance: currentBalance,
      currentAge,
      retirementAge,
      annualSalary,
      employerRate: employerRate / 100,
      voluntaryContrib,
      returnRate: returnRate / 100,
    });
  }, [currentBalance, currentAge, annualSalary, employerRate, voluntaryContrib, returnRate, retirementAge]);

  // Monthly drawdown over 20 years in retirement (0% tax in retirement phase)
  const monthlyRetirementIncome = useMemo(() => {
    if (result.finalBalance <= 0 || result.years <= 0) return 0;
    // Annuity-style: balance draws down over 240 months at 4% p.a. real return
    const r = 0.04 / 12;
    const n = 240; // 20 years × 12
    if (r === 0) return result.finalBalance / n;
    return (result.finalBalance * r) / (1 - Math.pow(1 + r, -n));
  }, [result.finalBalance, result.years]);

  // Stacked bar segments as % of final balance
  const startPct = result.finalBalance > 0 ? (currentBalance / result.finalBalance) * 100 : 0;
  const empPct   = result.finalBalance > 0 ? (result.totalEmployer / result.finalBalance) * 100 : 0;
  const volPct   = result.finalBalance > 0 ? (result.totalVoluntary / result.finalBalance) * 100 : 0;
  const earnPct  = result.finalBalance > 0 ? (result.totalEarnings / result.finalBalance) * 100 : 0;

  const displayedRows = showAllYears
    ? result.yearlyData
    : result.yearlyData.slice(0, 10);

  return (
    <>
      <SEOHead
        title="Superannuation Calculator — Project Your Retirement Savings | MIGRON"
        description="Calculate your superannuation balance at retirement. See the impact of your salary, employer contributions and voluntary super on your retirement savings."
        path="/super-calculator"
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
                Tools — Super
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#ccff00]">
                <TrendingUp className="text-black" size={28} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                  Super Calculator
                </h1>
                <p className="text-sm text-white/40 mt-1">Superannuation Retirement Savings Projector · 2025–26</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[960px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── LEFT: Inputs ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Current super balance */}
              <div className="bg-[#111] border border-white/5 p-5">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Current Super Balance</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-white/40 text-xl font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    max={5000000}
                    step={1000}
                    value={currentBalance}
                    onChange={e => setCurrentBalance(Math.max(0, Number(e.target.value)))}
                    className="bg-transparent text-[#ccff00] font-black text-3xl w-full outline-none border-b border-white/10 focus:border-[#ccff00] transition-colors pb-1"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={Math.min(currentBalance, 500000)}
                  onChange={e => setCurrentBalance(Number(e.target.value))}
                  className="w-full accent-[#ccff00]"
                />
                <div className="flex justify-between text-white/20 text-xs mt-1">
                  <span>$0</span><span>$250k</span><span>$500k+</span>
                </div>
              </div>

              {/* Annual salary */}
              <div className="bg-[#111] border border-white/5 p-5">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Annual Salary (AUD)</h2>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-white/40 text-xl font-bold">$</span>
                  <input
                    type="number"
                    min={0}
                    max={500000}
                    step={1000}
                    value={annualSalary}
                    onChange={e => setAnnualSalary(Math.max(0, Math.min(500000, Number(e.target.value))))}
                    className="bg-transparent text-[#ccff00] font-black text-3xl w-full outline-none border-b border-white/10 focus:border-[#ccff00] transition-colors pb-1"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={5000}
                  value={Math.min(annualSalary, 300000)}
                  onChange={e => setAnnualSalary(Number(e.target.value))}
                  className="w-full accent-[#ccff00]"
                />
              </div>

              {/* Age inputs */}
              <div className="bg-[#111] border border-white/5 p-5 space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Age</h2>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm font-bold">Current Age</p>
                    <p className="text-[#ccff00] font-black text-sm">{currentAge} yrs</p>
                  </div>
                  <input
                    type="range" min={18} max={64}
                    value={currentAge}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setCurrentAge(v);
                      if (v >= retirementAge) setRetirementAge(Math.min(v + 1, 75));
                    }}
                    className="w-full accent-[#ccff00]"
                  />
                  <div className="flex justify-between text-white/20 text-xs mt-0.5">
                    <span>18</span><span>64</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm font-bold">Retirement Age</p>
                    <p className="text-[#ccff00] font-black text-sm">{retirementAge} yrs</p>
                  </div>
                  <input
                    type="range" min={Math.max(currentAge + 1, 50)} max={75}
                    value={retirementAge}
                    onChange={e => setRetirementAge(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                  <div className="flex justify-between text-white/20 text-xs mt-0.5">
                    <span>{Math.max(currentAge + 1, 50)}</span><span>75</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">Preservation age is generally 60</p>
                </div>
              </div>

              {/* Rates */}
              <div className="bg-[#111] border border-white/5 p-5 space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Contribution Rates</h2>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm font-bold">Employer SGC Rate</p>
                    <p className="text-[#ccff00] font-black text-sm">{employerRate}%</p>
                  </div>
                  <input
                    type="range" min={9} max={15} step={0.5}
                    value={employerRate}
                    onChange={e => setEmployerRate(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                  <p className="text-white/30 text-xs mt-0.5">Current SGC rate is 11.5% (rises to 12% from 1 July 2025)</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm font-bold">Extra Voluntary / Year</p>
                    <p className="text-[#ccff00] font-black text-sm">${fmt(voluntaryContrib)}</p>
                  </div>
                  <input
                    type="range" min={0} max={30000} step={500}
                    value={voluntaryContrib}
                    onChange={e => setVoluntaryContrib(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                  <p className="text-white/30 text-xs mt-0.5">Concessional cap: $30,000/year (employer + voluntary pre-tax)</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm font-bold">Investment Return Rate</p>
                    <p className="text-[#ccff00] font-black text-sm">{returnRate}% p.a.</p>
                  </div>
                  <input
                    type="range" min={4} max={12} step={0.5}
                    value={returnRate}
                    onChange={e => setReturnRate(Number(e.target.value))}
                    className="w-full accent-[#ccff00]"
                  />
                  <div className="flex justify-between text-white/20 text-xs mt-0.5">
                    <span>Conservative (4%)</span><span>Default (7%)</span><span>High (12%)</span>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">Earnings taxed at 15% within the fund (applied automatically)</p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Results ── */}
            <div className="lg:col-span-3 space-y-5">

              {result.years <= 0 ? (
                <div className="bg-[#111] border border-white/5 p-6 text-center">
                  <p className="text-white/40 text-sm">Set your current age below your retirement age to see a projection.</p>
                </div>
              ) : (
                <>
                  {/* Hero result */}
                  <div className="bg-[#111] border border-[#ccff00]/20 p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Projected Balance at Retirement</p>
                    <p className="text-[#ccff00] font-black text-5xl mb-1">${fmt(result.finalBalance)}</p>
                    <p className="text-white/30 text-sm">at age {retirementAge} · over {result.years} year{result.years !== 1 ? 's' : ''}</p>

                    {/* Stacked composition bar */}
                    <div className="mt-4 h-5 flex overflow-hidden rounded-sm">
                      {currentBalance > 0 && (
                        <div className="bg-white/20 transition-all duration-500" style={{ width: `${startPct}%` }} title={`Starting balance: $${fmt(currentBalance)}`} />
                      )}
                      <div className="bg-blue-500 transition-all duration-500" style={{ width: `${empPct}%` }} title={`Employer: $${fmt(result.totalEmployer)}`} />
                      {voluntaryContrib > 0 && (
                        <div className="bg-purple-500 transition-all duration-500" style={{ width: `${volPct}%` }} title={`Voluntary: $${fmt(result.totalVoluntary)}`} />
                      )}
                      <div className="bg-[#ccff00] transition-all duration-500" style={{ width: `${earnPct}%` }} title={`Earnings: $${fmt(result.totalEarnings)}`} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                      {currentBalance > 0 && <span className="flex items-center gap-1 text-white/40"><span className="w-2 h-2 rounded-sm bg-white/20 inline-block" />Starting ${fmt(currentBalance)}</span>}
                      <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-sm bg-blue-500 inline-block" />Employer ${fmt(result.totalEmployer)}</span>
                      {voluntaryContrib > 0 && <span className="flex items-center gap-1 text-purple-400"><span className="w-2 h-2 rounded-sm bg-purple-500 inline-block" />Voluntary ${fmt(result.totalVoluntary)}</span>}
                      <span className="flex items-center gap-1 text-[#ccff00]"><span className="w-2 h-2 rounded-sm bg-[#ccff00] inline-block" />Earnings ${fmt(result.totalEarnings)}</span>
                    </div>
                  </div>

                  {/* Summary breakdown */}
                  <div className="bg-[#111] border border-white/5 p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Contribution Breakdown</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Starting Balance',           value: currentBalance,          color: 'text-white/60' },
                        { label: 'Total Employer Contributions', value: result.totalEmployer,  color: 'text-blue-400' },
                        { label: 'Total Voluntary Contributions', value: result.totalVoluntary, color: 'text-purple-400' },
                        { label: 'Total Investment Earnings (after 15% fund tax)', value: result.totalEarnings, color: 'text-[#ccff00]' },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                          <span className="text-white/50 text-sm flex-1 mr-4">{row.label}</span>
                          <span className={`font-black ${row.color}`}>${fmt(row.value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-white font-black uppercase tracking-wide text-sm">Total at Retirement</span>
                        <span className="text-[#ccff00] font-black text-xl">${fmt(result.finalBalance)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Retirement income estimate */}
                  <div className="bg-[#111] border border-white/5 p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Estimated Monthly Retirement Income</p>
                    <p className="text-[#ccff00] font-black text-4xl mb-1">${fmt(monthlyRetirementIncome)}</p>
                    <p className="text-white/30 text-xs">Per month if drawn down over 20 years · 4% p.a. return in retirement phase · 0% tax</p>
                  </div>

                  {/* Year-by-year table */}
                  <div className="bg-[#111] border border-white/5 p-5">
                    <button
                      onClick={() => setShowTable(!showTable)}
                      className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-3"
                    >
                      <span>Year-by-Year Projection</span>
                      {showTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showTable && (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left text-white/30 font-bold py-2 pr-3">Year</th>
                                <th className="text-left text-white/30 font-bold py-2 pr-3">Age</th>
                                <th className="text-right text-white/30 font-bold py-2 pr-3">Employer</th>
                                <th className="text-right text-white/30 font-bold py-2 pr-3">Earnings</th>
                                <th className="text-right text-[#ccff00] font-bold py-2">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayedRows.map(row => (
                                <tr key={row.year} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                  <td className="text-white/40 py-2 pr-3">{row.year}</td>
                                  <td className="text-white/60 py-2 pr-3">{row.age}</td>
                                  <td className="text-blue-400 py-2 pr-3 text-right">${fmt(row.employer)}</td>
                                  <td className="text-[#ccff00]/70 py-2 pr-3 text-right">${fmt(row.earnings)}</td>
                                  <td className="text-white font-bold py-2 text-right">${fmt(row.balance)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {result.yearlyData.length > 10 && (
                          <button
                            onClick={() => setShowAllYears(!showAllYears)}
                            className="mt-3 w-full py-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-widest transition-all"
                          >
                            {showAllYears ? `Show less` : `Show all ${result.yearlyData.length} years`}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}

              {/* ATO link */}
              <a
                href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-xs font-bold uppercase tracking-widest transition-all"
              >
                Rates sourced from ATO — ato.gov.au <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* ── Key information cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[
              {
                title: 'Super Guarantee (SGC)',
                body: 'Your employer must contribute 11.5% of your ordinary time earnings into your super fund (rising to 12% from 1 July 2025). This is on top of your salary — not taken from it — unless your contract states otherwise.',
              },
              {
                title: 'Tax Inside the Fund',
                body: 'Investment earnings inside a super fund are taxed at 15% — far lower than personal income tax rates. Once you retire and move money into a "retirement phase" account, earnings are taxed at 0%.',
              },
              {
                title: 'Preservation Age',
                body: 'You generally cannot access your super until you reach preservation age and satisfy a condition of release (such as retirement). Preservation age is 60 for anyone born after June 1964.',
              },
              {
                title: 'Concessional Cap',
                body: 'Pre-tax (concessional) contributions — including employer SGC and salary-sacrifice — are capped at $30,000 per year. Contributions beyond the cap are taxed at your marginal rate.',
              },
              {
                title: 'Non-Concessional Cap',
                body: 'After-tax (non-concessional) voluntary contributions are capped at $120,000 per year. You may be able to bring-forward up to 3 years of contributions in a single year under certain conditions.',
              },
              {
                title: 'Low Income Super Tax Offset',
                body: 'If your taxable income is $37,000 or below, the ATO may refund up to $500 in tax into your super fund to offset the 15% contributions tax — effectively making super contributions tax-free for low earners.',
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
            This calculator provides projections only and does not constitute financial advice. Results assume a constant salary and return rate over the projection period. Actual returns will vary.
            Visit{' '}
            <a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">
              ato.gov.au/super
            </a>{' '}
            or consult a licensed financial adviser for personalised guidance.
          </div>
        </section>
      </div>
    </>
  );
};

export default SuperCalculatorPage;
