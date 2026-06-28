import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Square, RotateCcw, ClipboardList } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

const VISA_CHECKLISTS = {
  '189': {
    label: 'Skilled Independent (189)',
    color: '#ccff00',
    tag: 'SKILLED',
    items: [
      { id: '189-1', text: 'Skills assessment completed by the relevant assessing body', critical: true },
      { id: '189-2', text: 'At least 65 points achieved in the Points Test', critical: true },
      { id: '189-3', text: 'Expression of Interest (EOI) submitted via SkillSelect', critical: true },
      { id: '189-4', text: 'English language test completed (IELTS / PTE / TOEFL)', critical: true },
      { id: '189-5', text: 'Health examination completed (HAP ID obtained)', critical: true },
      { id: '189-6', text: 'Police clearance obtained for character requirement', critical: true },
      { id: '189-7', text: 'Invitation to Apply (ITA) received from SkillSelect', critical: true },
      { id: '189-8', text: 'Visa application lodged within 60 days of ITA', critical: true },
      { id: '189-9', text: 'Passport validity checked (valid for the full application period)', critical: false },
      { id: '189-10', text: 'Marriage/relationship certificates prepared (if applicable)', critical: false },
      { id: '189-11', text: 'Employment reference letters collected', critical: false },
      { id: '189-12', text: 'Education diplomas and academic transcripts ready', critical: false },
    ],
  },
  '190': {
    label: 'Skilled Nominated (190)',
    color: '#00d4ff',
    tag: 'SKILLED',
    items: [
      { id: '190-1', text: 'Occupation confirmed on the state/territory nomination list', critical: true },
      { id: '190-2', text: 'State/territory nomination application submitted', critical: true },
      { id: '190-3', text: 'Nomination approved (+5 points in SkillSelect)', critical: true },
      { id: '190-4', text: 'Skills assessment completed', critical: true },
      { id: '190-5', text: 'EOI submitted in SkillSelect (minimum 65 + 5 = 70 points)', critical: true },
      { id: '190-6', text: 'English language test completed', critical: true },
      { id: '190-7', text: 'Health examination completed', critical: true },
      { id: '190-8', text: 'Police clearance obtained', critical: true },
      { id: '190-9', text: 'ITA received and application lodged within 60 days', critical: true },
      { id: '190-10', text: '2-year commitment to live in the nominating state understood', critical: false },
      { id: '190-11', text: 'Reference letters and education documents ready', critical: false },
    ],
  },
  '491': {
    label: 'Skilled Work Regional (491)',
    color: '#f59e0b',
    tag: 'REGIONAL',
    items: [
      { id: '491-1', text: 'State/territory or eligible relative nomination application submitted', critical: true },
      { id: '491-2', text: 'Confirmed that your area qualifies as "regional Australia"', critical: true },
      { id: '491-3', text: 'Skills assessment completed', critical: true },
      { id: '491-4', text: 'English language test completed', critical: true },
      { id: '491-5', text: 'EOI submitted with nomination points (+15) — minimum 65 total', critical: true },
      { id: '491-6', text: 'Health examination completed', critical: true },
      { id: '491-7', text: 'Police clearance obtained', critical: true },
      { id: '491-8', text: 'ITA received and application lodged', critical: true },
      { id: '491-9', text: 'Research 191 visa pathway (live and work regionally for 3 years)', critical: false },
      { id: '491-10', text: 'Regional job and housing research completed', critical: false },
    ],
  },
  '482': {
    label: 'Temporary Skill Shortage (482)',
    color: '#ff6b6b',
    tag: 'EMPLOYER',
    items: [
      { id: '482-1', text: 'Australian sponsor employer identified', critical: true },
      { id: '482-2', text: 'Employer confirmed as an Approved Standard Business Sponsor (SBS)', critical: true },
      { id: '482-3', text: 'Nomination application lodged by employer', critical: true },
      { id: '482-4', text: 'Occupation confirmed on MLTSSL (medium-term) or STSOL (short-term)', critical: true },
      { id: '482-5', text: 'At least 2 years relevant work experience demonstrated', critical: true },
      { id: '482-6', text: 'English proficiency requirement met', critical: true },
      { id: '482-7', text: 'Health examination completed', critical: true },
      { id: '482-8', text: 'Police clearance obtained', critical: true },
      { id: '482-9', text: 'Salary meets the Temporary Skilled Migration Income Threshold (TSMIT)', critical: false },
      { id: '482-10', text: 'Researched the 186 visa pathway (for permanent residence)', critical: false },
    ],
  },
  '500': {
    label: 'Student Visa (500)',
    color: '#10b981',
    tag: 'STUDENT',
    items: [
      { id: '500-1', text: 'CRICOS-registered institution selected and Confirmation of Enrolment (CoE) received', critical: true },
      { id: '500-2', text: 'Genuine Temporary Entrant (GTE) statement prepared', critical: true },
      { id: '500-3', text: 'English proficiency demonstrated (IELTS / PTE / TOEFL)', critical: true },
      { id: '500-4', text: 'Financial capacity demonstrated (bank statements / sponsor evidence)', critical: true },
      { id: '500-5', text: 'Overseas Student Health Cover (OSHC) purchased', critical: true },
      { id: '500-6', text: 'Health examination completed', critical: false },
      { id: '500-7', text: 'Character declaration prepared', critical: false },
      { id: '500-8', text: 'Academic certificates and transcripts ready', critical: false },
      { id: '500-9', text: 'Researched the 485 Graduate Temporary visa for after graduation', critical: false },
      { id: '500-10', text: 'Understood the 48-hour-per-fortnight work restriction during semester', critical: false },
    ],
  },
  'partner': {
    label: 'Partner Visa (820/801)',
    color: '#ec4899',
    tag: 'PARTNER',
    items: [
      { id: 'p-1', text: 'Australian sponsor identified (citizen, PR or eligible NZ citizen)', critical: true },
      { id: 'p-2', text: 'Genuine relationship of at least 12 months demonstrated (or engaged)', critical: true },
      { id: 'p-3', text: 'Joint financial evidence collected (joint bank account, shared bills)', critical: true },
      { id: 'p-4', text: 'Cohabitation evidence collected (lease agreement, utility bills)', critical: true },
      { id: 'p-5', text: 'Social evidence collected (photos, statutory declarations from family/friends)', critical: true },
      { id: 'p-6', text: 'Health examination completed', critical: true },
      { id: 'p-7', text: 'Police clearance obtained', critical: true },
      { id: 'p-8', text: 'Understood the 801 permanent visa conditions (2 years after 820 grant)', critical: false },
      { id: 'p-9', text: "Sponsor's prior sponsorship history checked (if applicable)", critical: false },
    ],
  },
};

const VisaChecklistPage = () => {
  const [selectedVisa, setSelectedVisa] = useState('189');
  const [checked, setChecked]           = useState({});

  const visa          = VISA_CHECKLISTS[selectedVisa];
  const completedCount= visa.items.filter(i => checked[i.id]).length;
  const progress      = Math.round((completedCount / visa.items.length) * 100);

  useEffect(() => {
    const saved = localStorage.getItem('migron_checklist');
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem('migron_checklist', JSON.stringify(next));
  };

  const resetVisa = () => {
    const next = { ...checked };
    visa.items.forEach(i => delete next[i.id]);
    setChecked(next);
    localStorage.setItem('migron_checklist', JSON.stringify(next));
  };

  return (
    <>
      <SEOHead
        title="Australian Visa Application Checklist — Interactive Tracker"
        description="Interactive visa checklist for Australian visa applications. Track your progress for Skilled Independent (189), Skilled Nominated (190), Regional (491), TSS (482), Student (500) and Partner visas."
        path="/visa-checklist"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to Apply for Australian Visa ${selectedVisa} — Checklist`,
        description: `Step-by-step checklist for the ${visa.label} application process.`,
        step: visa.items.filter(i => i.critical).map((item, idx) => ({
          '@type': 'HowToStep', position: idx + 1, text: item.text,
        })),
      })}} />

      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
        {/* Page header */}
        <section className="pt-8 pb-6 px-6 border-b border-white/10">
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                <ArrowLeft size={14} /> Home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#ccff00]">
                <ClipboardList className="text-black" size={28} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                  VISA CHECKLIST
                </h1>
                <p className="text-sm text-white/40 mt-1">Progress saved in your browser</p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[900px] mx-auto px-6 py-10">
          {/* Visa selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(VISA_CHECKLISTS).map(([key, v]) => (
              <button
                key={key}
                onClick={() => setSelectedVisa(key)}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-wider border transition-all"
                style={{
                  borderColor: v.color,
                  backgroundColor: selectedVisa === key ? `${v.color}20` : 'transparent',
                  color: v.color,
                }}
              >
                {key === 'partner' ? 'PARTNER' : key} — {v.tag}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="bg-[#111] border border-white/5 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-black uppercase tracking-tight text-lg" style={{ color: visa.color }}>
                  {visa.label}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">{completedCount}/{visa.items.length} steps completed</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black" style={{ color: visa.color }}>{progress}%</span>
                <button onClick={resetVisa} title="Reset this visa checklist"
                  className="p-2 text-white/30 hover:text-[#ccff00] transition-colors">
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: visa.color }} />
            </div>
            {progress === 100 && (
              <p className="text-center text-sm font-black mt-4" style={{ color: visa.color }}>
                🎉 ALL STEPS COMPLETE — You are ready to apply!
              </p>
            )}
          </div>

          {/* Critical items */}
          <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Critical Steps
            </h3>
            <div className="space-y-2">
              {visa.items.filter(i => i.critical).map(item => (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 border transition-all text-left ${
                    checked[item.id]
                      ? 'bg-[#ccff00]/5 border-[#ccff00]/20'
                      : 'bg-[#111] border-white/5 hover:border-white/15'
                  }`}
                >
                  {checked[item.id]
                    ? <CheckSquare size={18} className="flex-shrink-0 mt-0.5" style={{ color: visa.color }} />
                    : <Square size={18} className="flex-shrink-0 mt-0.5 text-white/20" />
                  }
                  <span className={`text-sm ${checked[item.id] ? 'line-through text-white/30' : 'text-white/80'}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional items */}
          {visa.items.some(i => !i.critical) && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/20" /> Recommended Steps
              </h3>
              <div className="space-y-2">
                {visa.items.filter(i => !i.critical).map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 border transition-all text-left ${
                      checked[item.id]
                        ? 'bg-white/3 border-white/10'
                        : 'bg-[#0d0d0d] border-white/5 hover:border-white/10'
                    }`}
                  >
                    {checked[item.id]
                      ? <CheckSquare size={18} className="flex-shrink-0 mt-0.5 text-white/30" />
                      : <Square size={18} className="flex-shrink-0 mt-0.5 text-white/15" />
                    }
                    <span className={`text-sm ${checked[item.id] ? 'line-through text-white/20' : 'text-white/50'}`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related links */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Related Tools</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Visa Guide',        path: '/visa'              },
                { label: 'Points Calculator', path: '/points-calculator' },
                { label: 'Occupation Checker',path: '/occupation'        },
                { label: 'Salary Calculator', path: '/salary-calculator' },
              ].map(l => (
                <Link key={l.path} to={l.path}
                  className="border border-white/10 hover:border-[#ccff00]/30 p-3 text-center text-xs font-bold text-white/40 hover:text-[#ccff00] transition-all">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VisaChecklistPage;
