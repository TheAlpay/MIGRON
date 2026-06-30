import { useState, useMemo } from 'react';
import { Clock, ExternalLink, AlertTriangle, ChevronRight, Info, Zap, FileCheck, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';

// ---------------------------------------------------------------------------
// Static data — source: Department of Home Affairs, June 2026
// ---------------------------------------------------------------------------
const PROCESSING_DATA = [
  {
    code: '189', name: 'Skilled Independent', category: 'skilled',
    p75: '17 months', p90: '24 months',
    note: 'High competition — invitation cutoff points have been 85-90+',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '190', name: 'Skilled Nominated', category: 'skilled',
    p75: '9 months', p90: '14 months',
    note: 'State nomination adds ~2-6 months before visa application',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '491', name: 'Skilled Work Regional (Provisional)', category: 'skilled',
    p75: '7 months', p90: '12 months',
    note: 'Requires living and working in regional Australia for 3 years',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '191', name: 'Permanent Residence via Regional', category: 'skilled',
    p75: '14 months', p90: '20 months',
    note: 'Requires 3 years on 491/494 in regional Australia',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '482', name: 'Temporary Skill Shortage', category: 'employer',
    p75: '2 months', p90: '4 months',
    note: 'Specialist Skills stream processed in ~7 days',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '186', name: 'Employer Nomination Scheme (ENS)', category: 'employer',
    p75: '12 months', p90: '18 months',
    note: 'Transition stream (from 482) is typically faster',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '500', name: 'Student Visa', category: 'student',
    p75: '33 days', p90: '53 days',
    note: 'GTE assessment is the main determining factor',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '485', name: 'Graduate Temporary', category: 'student',
    p75: '10 months', p90: '14 months',
    note: 'Apply within 6 months of completing studies',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '820', name: 'Partner Visa (Temporary)', category: 'family',
    p75: '20 months', p90: '31 months',
    note: 'Granted with 801 (permanent). Onshore application only.',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '309', name: 'Partner Visa (Provisional)', category: 'family',
    p75: '25 months', p90: '39 months',
    note: 'Offshore equivalent of 820. Significant wait times.',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '801', name: 'Partner Visa (Permanent)', category: 'family',
    p75: '26 months', p90: '38 months',
    note: 'Follows on from 820. Usually granted 2 years after 820.',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '600', name: 'Visitor Visa', category: 'visitor',
    p75: '16 days', p90: '29 days',
    note: 'Tourist stream. Can be 3, 6 or 12 months.',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
  {
    code: '407', name: 'Training Visa', category: 'other',
    p75: '2 months', p90: '4 months',
    note: 'For occupational training or professional development',
    status: 'active',
    link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times',
  },
];

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------
const CATEGORIES = {
  all:      { label: 'All Visas',          color: '#ccff00' },
  skilled:  { label: 'Skilled Migration',  color: '#ccff00' },
  employer: { label: 'Employer Sponsored', color: '#00d4ff' },
  family:   { label: 'Family Stream',      color: '#ff6b6b' },
  student:  { label: 'Student',            color: '#f59e0b' },
  visitor:  { label: 'Visitor',            color: '#a78bfa' },
  other:    { label: 'Other',              color: '#10b981' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a time string like "17 months", "33 days" to fractional months */
function toMonths(timeStr) {
  if (!timeStr) return 0;
  const lower = timeStr.toLowerCase();
  if (lower.includes('day')) {
    const d = parseFloat(lower);
    return d / 30;
  }
  return parseFloat(lower);
}

/** Speed band → accent color */
function speedColor(months) {
  if (months < 2)  return '#22c55e';
  if (months < 6)  return '#eab308';
  if (months < 12) return '#f97316';
  return '#ef4444';
}

/** Speed band → label */
function speedLabel(months) {
  if (months < 2)  return 'Fast';
  if (months < 6)  return 'Moderate';
  if (months < 12) return 'Slow';
  return 'Very Slow';
}

/** Add N months to a date, return formatted string */
function addMonths(date, months) {
  const result = new Date(date);
  const fractionalMonths = months;
  const wholeMonths = Math.floor(fractionalMonths);
  const days = Math.round((fractionalMonths - wholeMonths) * 30);
  result.setMonth(result.getMonth() + wholeMonths);
  result.setDate(result.getDate() + days);
  return result.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
}

/** Format today as readable */
function formatToday(date) {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TimeBar({ p75Months, p90Months, maxMonths = 42 }) {
  const p75Pct = Math.min((p75Months / maxMonths) * 100, 100);
  const p90Pct = Math.min((p90Months / maxMonths) * 100, 100);
  const barColor = speedColor(p75Months);

  return (
    <div className="relative" style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
      {/* P90 bar (background layer) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${p90Pct}%`,
          background: `${barColor}22`,
          borderRadius: '3px',
          transition: 'width 0.4s ease',
        }}
      />
      {/* P75 bar (foreground layer) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${p75Pct}%`,
          background: barColor,
          borderRadius: '3px',
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}

function SpeedBadge({ months }) {
  const color = speedColor(months);
  const label = speedLabel(months);
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        borderRadius: '3px',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#050505',
        background: color,
      }}
    >
      {label}
    </span>
  );
}

function VisaCard({ visa }) {
  const catColor = CATEGORIES[visa.category]?.color || '#ccff00';
  const p75m = toMonths(visa.p75);
  const p90m = toMonths(visa.p90);

  return (
    <article
      style={{
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: '6px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Code badge */}
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: catColor,
              background: `${catColor}14`,
              border: `1px solid ${catColor}30`,
              borderRadius: '4px',
              padding: '4px 10px',
              lineHeight: 1,
              flexShrink: 0,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {visa.code}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#e0e0e0', lineHeight: 1.3, textWrap: 'balance' }}>
              {visa.name}
            </div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {CATEGORIES[visa.category]?.label}
            </div>
          </div>
        </div>
        <SpeedBadge months={p75m} />
      </div>

      {/* Time metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ background: '#111', borderRadius: '4px', padding: '10px 12px' }}>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            75th percentile
          </div>
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '16px',
              fontWeight: 700,
              color: '#ccff00',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {visa.p75}
          </div>
          <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>75% done by</div>
        </div>
        <div style={{ background: '#111', borderRadius: '4px', padding: '10px 12px' }}>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            90th percentile
          </div>
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '16px',
              fontWeight: 700,
              color: '#888',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {visa.p90}
          </div>
          <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>90% done by</div>
        </div>
      </div>

      {/* Time bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <TimeBar p75Months={p75m} p90Months={p90m} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#444' }}>
          <span>0</span>
          <span style={{ color: '#333' }}>← faster · slower →</span>
          <span>42 mo</span>
        </div>
      </div>

      {/* Note */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <Info size={12} style={{ color: '#444', flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.5, margin: 0 }}>{visa.note}</p>
      </div>

      {/* Link */}
      <a
        href={visa.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          color: '#444',
          textDecoration: 'none',
          borderTop: '1px solid #161616',
          paddingTop: '12px',
          marginTop: 'auto',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#e0e0e0'}
        onMouseLeave={e => e.currentTarget.style.color = '#444'}
      >
        Official source <ExternalLink size={10} />
      </a>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Time Calculator
// ---------------------------------------------------------------------------
function TimeCalculator() {
  const [selectedCode, setSelectedCode] = useState('');
  const today = new Date();

  const selected = PROCESSING_DATA.find(v => v.code === selectedCode);

  let result = null;
  if (selected) {
    const p75m = toMonths(selected.p75);
    const p90m = toMonths(selected.p90);
    result = {
      p75Date: addMonths(today, p75m),
      p90Date: addMonths(today, p90m),
    };
  }

  // Sort options by p75 fastest first
  const sortedOptions = [...PROCESSING_DATA].sort((a, b) => toMonths(a.p75) - toMonths(b.p75));

  return (
    <section
      style={{
        background: '#0a0a0a',
        border: '1px solid #1f1f1f',
        borderRadius: '8px',
        padding: '32px',
        marginTop: '48px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <Zap size={16} style={{ color: '#ccff00' }} />
        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ccff00', margin: 0, fontWeight: 700 }}>
          Time Calculator
        </h2>
      </div>
      <p style={{ fontSize: '15px', color: '#888', marginBottom: '24px' }}>
        If I apply today ({formatToday(today)}), my visa could be ready by…
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 260px' }}>
          <label
            htmlFor="visa-select"
            style={{ display: 'block', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}
          >
            Select a visa subclass
          </label>
          <select
            id="visa-select"
            value={selectedCode}
            onChange={e => setSelectedCode(e.target.value)}
            style={{
              width: '100%',
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              color: '#e0e0e0',
              fontSize: '14px',
              padding: '10px 14px',
              appearance: 'none',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          >
            <option value="">-- Choose a visa --</option>
            {sortedOptions.map(v => (
              <option key={v.code} value={v.code}>
                {v.code} · {v.name} ({v.p75})
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && selected && (
        <div
          style={{
            marginTop: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: '#111',
              border: '1px solid #ccff0022',
              borderRadius: '6px',
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Likely by (P75)
            </div>
            <div
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '22px',
                fontWeight: 800,
                color: '#ccff00',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {result.p75Date}
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>75% of applicants done by this date</div>
          </div>
          <div
            style={{
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Latest estimate (P90)
            </div>
            <div
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '22px',
                fontWeight: 800,
                color: '#888',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {result.p90Date}
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>90% of applicants done by this date</div>
          </div>
          <div
            style={{
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              padding: '20px 24px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              Visa selected
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#e0e0e0' }}>
              Subclass {selected.code}
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{selected.name}</div>
          </div>
        </div>
      )}

      <p style={{ fontSize: '11px', color: '#3a3a3a', marginTop: '20px', lineHeight: 1.6 }}>
        * Estimates are calculated by adding P75/P90 processing times to today's date.
        Actual times vary by individual circumstances. Always check the official DHA website.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Explainer section
// ---------------------------------------------------------------------------
function HowItWorksSection() {
  const items = [
    {
      icon: <HelpCircle size={16} />,
      title: 'What P75 and P90 mean',
      body: 'P75 (75th percentile) means 75% of applications were processed within that time. P90 means 90% were processed within that time. These are rolling 12-month statistics published by the Department of Home Affairs.',
    },
    {
      icon: <Clock size={16} />,
      title: 'Why times vary so much',
      body: 'Processing times depend on the volume of applications received, the complexity of individual cases, health and character checks, and the stream you apply through. Skilled visas with invitation rounds behave very differently to visitor visas.',
    },
    {
      icon: <FileCheck size={16} />,
      title: 'Tips to speed up your application',
      body: null,
      tips: [
        'Submit all documents at time of application — do not wait for requests.',
        'Ensure health examinations are completed before or shortly after lodgement.',
        'Respond to any correspondence from the department within 24–48 hours.',
        'Use a registered migration agent for complex cases.',
        'Check that police clearances from all countries are included and valid.',
        'Avoid offshore travel mid-application for onshore visas.',
      ],
    },
  ];

  return (
    <section style={{ marginTop: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div
          style={{
            width: '3px',
            height: '20px',
            background: '#ccff00',
            borderRadius: '2px',
            flexShrink: 0,
          }}
        />
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e0e0e0', margin: 0 }}>
          How Processing Times Work
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: '#0a0a0a',
              border: '1px solid #1a1a1a',
              borderRadius: '6px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#ccff00' }}>
              {item.icon}
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#e0e0e0', margin: 0 }}>{item.title}</h3>
            </div>
            {item.body && (
              <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
            )}
            {item.tips && (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.tips.map((tip, j) => (
                  <li key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <ChevronRight size={12} style={{ color: '#ccff00', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}


// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function ProcessingTimesPage() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const categoryKeys = ['all', 'skilled', 'employer', 'family', 'student', 'visitor', 'other'];

  const filteredAndSorted = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? PROCESSING_DATA
        : PROCESSING_DATA.filter(v => v.category === activeCategory);
    return [...filtered].sort((a, b) => toMonths(a.p75) - toMonths(b.p75));
  }, [activeCategory]);

  const totalCount = PROCESSING_DATA.length;
  const filteredCount = filteredAndSorted.length;

  return (
    <>
      <SEOHead
        title="Australian Visa Processing Times 2026 — P75 & P90 Data"
        description="Current Australian visa processing times from the Department of Home Affairs. P75 and P90 benchmarks for skilled, employer-sponsored, family, student and visitor visas — updated June 2026."
        path="/processing-times"
      />
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          color: '#e0e0e0',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>

          {/* ---- Header ---- */}
          <header style={{ paddingTop: '56px', paddingBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#444',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ccff00',
                  boxShadow: '0 0 6px #ccff0088',
                }}
              />
              Official Data · Dept of Home Affairs
            </div>

            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#e0e0e0',
                margin: '0 0 12px',
                lineHeight: 1.05,
                textWrap: 'balance',
              }}
            >
              Visa Processing Times
            </h1>
            <p style={{ fontSize: '16px', color: '#555', margin: 0, lineHeight: 1.6, maxWidth: '560px' }}>
              Processing time benchmarks for {totalCount} Australian visa subclasses,
              sourced directly from the Department of Home Affairs.
            </p>
          </header>

          {/* ---- Disclaimer banner ---- */}
          <div
            role="alert"
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              background: '#1a1200',
              border: '1px solid #332400',
              borderRadius: '6px',
              padding: '14px 18px',
              marginBottom: '32px',
            }}
          >
            <AlertTriangle size={15} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '13px', color: '#887750', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: '#b8a060' }}>Important:</strong> Processing times are approximate and based on historical data.
              Your individual application may take shorter or longer depending on your circumstances,
              documentation completeness, and current application volumes.{' '}
              <a
                href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ccaa44', textDecoration: 'underline' }}
              >
                Always verify on the official DHA website
              </a>.
            </p>
          </div>

          {/* ---- Data source bar ---- */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 16px',
              background: '#0a0a0a',
              border: '1px solid #161616',
              borderRadius: '4px',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Updated: <span style={{ color: '#666' }}>June 2026</span>
              </span>
              <span style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Source: <span style={{ color: '#666' }}>Department of Home Affairs</span>
              </span>
              <span style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Visas: <span style={{ color: '#666' }}>{filteredCount} / {totalCount} shown</span>
              </span>
            </div>
            <a
              href="https://immi.homeaffairs.gov.au"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#444',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#888'}
              onMouseLeave={e => e.currentTarget.style.color = '#444'}
            >
              immi.homeaffairs.gov.au <ExternalLink size={9} />
            </a>
          </div>

          {/* ---- Category filter tabs ---- */}
          <div
            role="tablist"
            aria-label="Filter visa categories"
            style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '28px',
            }}
          >
            {categoryKeys.map(key => {
              const cat = CATEGORIES[key];
              const isActive = activeCategory === key;
              const count = key === 'all'
                ? PROCESSING_DATA.length
                : PROCESSING_DATA.filter(v => v.category === key).length;

              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    border: '1px solid',
                    transition: 'all 0.15s',
                    background: isActive ? `${cat.color}18` : 'transparent',
                    borderColor: isActive ? `${cat.color}55` : '#1f1f1f',
                    color: isActive ? cat.color : '#555',
                    outline: 'none',
                  }}
                  onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 2px ${cat.color}44`; }}
                  onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {cat.label}
                  <span
                    style={{
                      fontSize: '10px',
                      color: isActive ? cat.color : '#333',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ---- Visa card grid ---- */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredAndSorted.map(visa => (
              <VisaCard key={visa.code} visa={visa} />
            ))}
          </div>

          {/* ---- Legend ---- */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '24px',
              padding: '12px 16px',
              background: '#0a0a0a',
              border: '1px solid #161616',
              borderRadius: '4px',
            }}
          >
            <span style={{ fontSize: '11px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Speed:
            </span>
            {[
              { label: 'Fast', color: '#22c55e', range: '< 2 months' },
              { label: 'Moderate', color: '#eab308', range: '2 – 6 months' },
              { label: 'Slow', color: '#f97316', range: '6 – 12 months' },
              { label: 'Very Slow', color: '#ef4444', range: '> 12 months' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: item.color,
                  }}
                />
                <span style={{ fontSize: '11px', color: '#555' }}>{item.label}</span>
                <span style={{ fontSize: '10px', color: '#333' }}>({item.range})</span>
              </div>
            ))}
          </div>

          {/* ---- How it works ---- */}
          <HowItWorksSection />

          {/* ---- Time Calculator ---- */}
          <TimeCalculator />

        </div>
      </div>
    </>
  );
}
