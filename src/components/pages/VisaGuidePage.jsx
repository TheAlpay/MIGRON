import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, DollarSign, Briefcase, ExternalLink, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { VISA_LIST, getVisaByCode } from '../../data/visaSubclasses';
import { env } from '../../lib/env.ts';

// ── Visa Hub (listing all subclasses) ────────────────────────────────────

const VisaHubPage = () => (
  <>
    <SEOHead
      title="Australian Visa Subclass Guide — All Visa Types Explained"
      description="Complete guide to every Australian visa subclass. Compare requirements, processing times, fees and pathways for skilled, employer, student and family visas."
      path="/visa"
    />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Australian Visa Subclass Guide',
      description: 'Complete guide to all major Australian visa subclasses with requirements, fees and processing times.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: VISA_LIST.map((v, i) => ({
          '@type': 'ListItem', position: i + 1,
          name: `Visa ${v.code} — ${v.name}`,
          url: `${env.VITE_SITE_URL}/visa/${v.code}`,
        })),
      },
    })}} />

    <main id="main-content" className="pt-24 pb-20 min-h-screen bg-[#050505]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10">
          <span className="text-[#ccff00] text-xs font-black uppercase tracking-widest">Visa Guide</span>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white mt-2 mb-3">
            AUSTRALIAN VISA<br /><span className="text-[#ccff00]">SUBCLASS GUIDE</span>
          </h1>
          <p className="text-white/50 max-w-2xl">
            Every major Australian visa subclass explained — requirements, processing times, fees and PR pathways.
          </p>
        </div>

        {/* Permanent visas */}
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/10">Permanent Residence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISA_LIST.filter(v => v.tag === 'PERMANENT').map(v => (
              <VisaCard key={v.code} visa={v} />
            ))}
          </div>
        </section>

        {/* Provisional */}
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/10">Provisional → Permanent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISA_LIST.filter(v => v.tag === 'PROVISIONAL').map(v => (
              <VisaCard key={v.code} visa={v} />
            ))}
          </div>
        </section>

        {/* Temporary */}
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/10">Temporary Visas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISA_LIST.filter(v => v.tag === 'TEMPORARY').map(v => (
              <VisaCard key={v.code} visa={v} />
            ))}
          </div>
        </section>

        {/* Closed / Replaced */}
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 pb-2 border-b border-white/10">Closed / No Longer Accepting Applications</h2>
          <p className="text-white/30 text-xs mb-4">These visa subclasses are closed to new applications. Listed here for reference and for applicants with existing applications in the queue.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VISA_LIST.filter(v => v.tag === 'CLOSED').map(v => (
              <VisaCard key={v.code} visa={v} />
            ))}
          </div>
        </section>
      </div>
    </main>
  </>
);

const VisaCard = ({ visa }) => (
  <Link to={`/visa/${visa.code}`}
    className="block bg-[#0a0a0a] border border-white/10 hover:border-white/25 rounded-xl p-5 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{visa.icon}</span>
        <div>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: visa.tagColor, color: ['#888', '#666'].includes(visa.tagColor) ? '#fff' : '#000' }}>
            {visa.tag}
          </span>
        </div>
      </div>
      <span className="text-[#ccff00] font-black text-xl">{visa.code}</span>
    </div>
    <h3 className="text-white font-black uppercase tracking-tight mb-1 group-hover:text-[#ccff00] transition-colors">{visa.name}</h3>
    <p className="text-white/40 text-sm line-clamp-2 mb-3">{visa.description}</p>
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-1 text-white/30">
        <Clock size={10} />
        <span>{visa.processingTime}</span>
      </div>
      <span className="text-[#ccff00] flex items-center gap-1 font-bold">
        Full details <ArrowRight size={10} />
      </span>
    </div>
  </Link>
);

// ── Individual Visa Subclass Page ─────────────────────────────────────────

const VisaDetailPage = ({ visa }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [openStep, setOpenStep] = useState(null);

  return (
    <>
      <SEOHead
        title={`Visa ${visa.code} — ${visa.name}: Requirements, Fees & Processing Time`}
        description={`Complete guide to Australian Visa ${visa.code} (${visa.name}). Requirements, fees ($${visa.visaFee.split(' ')[0].replace('AUD ','').replace('$','')}), processing time (${visa.processingTime}), and step-by-step application guide.`}
        path={`/visa/${visa.code}`}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: visa.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to Apply for Australian Visa ${visa.code} — ${visa.name}`,
        description: visa.description,
        step: visa.stepsToApply.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          text: s,
        })),
      })}} />

      <main id="main-content" className="pt-24 pb-20 min-h-screen bg-[#050505]">
        <div className="max-w-5xl mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/visa" className="hover:text-white transition-colors">Visa Guide</Link>
            <span>/</span>
            <span className="text-white/60">Visa {visa.code}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{visa.icon}</span>
              <span className="text-xs font-black px-2 py-1 rounded" style={{ background: visa.tagColor, color: ['#888', '#666'].includes(visa.tagColor) ? '#fff' : '#000' }}>
                {visa.tag}
              </span>
              <span className="text-white/30 text-sm font-mono">Subclass {visa.code}</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
              {visa.name}
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">{visa.description}</p>
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: <Clock size={14}/>,     label: 'Processing Time', value: visa.processingTime },
              { icon: <DollarSign size={14}/>, label: 'Application Fee', value: visa.visaFee },
              { icon: <Briefcase size={14}/>,  label: 'Work Rights',     value: visa.workRights    },
              { icon: <CheckCircle size={14}/>,label: 'Validity',        value: visa.validity      },
            ].map(s => (
              <div key={s.label} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-white/40 mb-2">{s.icon}<span className="text-xs uppercase tracking-widest">{s.label}</span></div>
                <p className="text-white font-bold text-sm leading-tight">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT — Requirements + Steps */}
            <div className="lg:col-span-2 space-y-6">

              {/* Requirements */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">Key Requirements</h2>
                <ul className="space-y-2">
                  {visa.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={14} className="text-[#ccff00] flex-shrink-0 mt-0.5" />
                      <span className="text-white/70 text-sm">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">How to Apply — Step by Step</h2>
                <ol className="space-y-2">
                  {visa.stepsToApply.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#ccff00] font-black text-sm flex-shrink-0 w-5">{i + 1}.</span>
                      <span className="text-white/70 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* FAQ */}
              {visa.faqs?.length > 0 && (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-2">
                    {visa.faqs.map((faq, i) => (
                      <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full text-left px-4 py-3 flex items-center justify-between gap-2"
                        >
                          <span className="text-white/80 text-sm font-bold">{faq.q}</span>
                          {openFaq === i ? <ChevronUp size={14} className="text-white/40 flex-shrink-0" /> : <ChevronDown size={14} className="text-white/40 flex-shrink-0" />}
                        </button>
                        {openFaq === i && (
                          <div className="px-4 pb-4 text-white/50 text-sm leading-relaxed">{faq.a}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — sidebar */}
            <div className="space-y-4">
              {/* Pathway to */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Pathway To</h3>
                <p className="text-white font-bold text-sm">{visa.pathwayTo}</p>
              </div>

              {/* List required */}
              {visa.listRequired && (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Occupation List</h3>
                  <p className="text-[#ccff00] font-bold text-sm">{visa.listRequired}</p>
                  <Link to="/occupation" className="text-xs text-white/40 hover:text-white mt-1 block">
                    Check your occupation →
                  </Link>
                </div>
              )}

              {/* Min points */}
              {visa.minPoints && (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Minimum Points</h3>
                  <p className="text-[#ccff00] font-black text-3xl">{visa.minPoints}</p>
                  <Link to="/points-calculator" className="text-xs text-white/40 hover:text-white mt-1 block">
                    Calculate your points →
                  </Link>
                </div>
              )}

              {/* Official link */}
              <a href={visa.officialUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-[#0a0a0a] border border-white/10 hover:border-[#ccff00]/30 rounded-xl p-5 group transition-all">
                <div>
                  <p className="text-xs text-white/40 mb-0.5">Official Source</p>
                  <p className="text-white text-sm font-bold group-hover:text-[#ccff00] transition-colors">Home Affairs Website</p>
                </div>
                <ExternalLink size={14} className="text-white/30 group-hover:text-[#ccff00] transition-colors" />
              </a>

              {/* Related tools */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">Related Tools</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Points Calculator',    path: '/points-calculator' },
                    { label: 'Occupation Checker',   path: '/occupation'        },
                    { label: 'Visa Checklist',        path: '/visa-checklist'   },
                    { label: 'Salary Calculator',     path: '/salary-calculator'},
                  ].map(t => (
                    <Link key={t.path} to={t.path}
                      className="flex items-center justify-between text-sm text-white/50 hover:text-[#ccff00] transition-colors">
                      {t.label}
                      <ArrowRight size={12} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

// ── Router component — hub or detail ─────────────────────────────────────

const VisaGuidePage = () => {
  const { code } = useParams();

  if (!code) return <VisaHubPage />;

  const visa = getVisaByCode(code);
  if (!visa) {
    return (
      <main className="pt-24 pb-20 min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ccff00] font-black text-6xl mb-4">404</p>
          <p className="text-white font-bold text-xl mb-2">Visa subclass not found</p>
          <Link to="/visa" className="text-white/50 hover:text-white text-sm">← Back to Visa Guide</Link>
        </div>
      </main>
    );
  }

  return <VisaDetailPage visa={visa} />;
};

export default VisaGuidePage;
