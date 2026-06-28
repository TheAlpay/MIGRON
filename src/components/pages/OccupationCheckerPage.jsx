import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ExternalLink, AlertTriangle, TrendingUp, DollarSign, X } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { OCCUPATIONS, CATEGORIES, LIST_VISA_ELIGIBILITY, DEMAND_LEVELS, ASSESSING_BODIES, searchOccupations, slugify } from '../../data/occupations';

const ListBadge = ({ list }) => {
  if (!list) return <span className="text-xs px-2 py-0.5 rounded border border-white/20 text-white/40">Not Listed</span>;
  const cfg = LIST_VISA_ELIGIBILITY[list];
  return (
    <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: cfg.color, color: cfg.textColor }}>
      {cfg.label}
    </span>
  );
};

const DemandBadge = ({ demand }) => {
  const cfg = DEMAND_LEVELS[demand] || DEMAND_LEVELS['Medium'];
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded border" style={{ color: cfg.color, borderColor: cfg.color, background: cfg.bg }}>
      {demand}
    </span>
  );
};

const StateChips = ({ states }) => {
  if (!states?.length) return <span className="text-white/30 text-xs">—</span>;
  const all = ['NSW','VIC','QLD','WA','SA','TAS','NT','ACT'];
  if (states.length === all.length) return <span className="text-xs text-[#ccff00] font-bold">All States</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {states.map(s => (
        <span key={s} className="text-[10px] font-bold px-1.5 py-0.5 bg-white/5 text-white/60 rounded">{s}</span>
      ))}
    </div>
  );
};

const OccupationDetailPanel = ({ occ, onClose }) => {
  if (!occ) return null;
  const listInfo = occ.list ? LIST_VISA_ELIGIBILITY[occ.list] : null;
  const assessBody = ASSESSING_BODIES[occ.assessing];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ListBadge list={occ.list} />
              <DemandBadge demand={occ.demand} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{occ.title}</h2>
            <p className="text-white/40 text-sm font-mono mt-0.5">ANZSCO {occ.id}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors flex-shrink-0 mt-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Description */}
          <p className="text-white/70 leading-relaxed">{occ.description}</p>
          {occ.altTitles?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {occ.altTitles.map(t => (
                <span key={t} className="text-xs px-2 py-0.5 bg-white/5 text-white/50 rounded">{t}</span>
              ))}
            </div>
          )}

          {/* Salary */}
          <div className="border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={14} className="text-[#ccff00]" />
              <span className="text-xs font-black uppercase tracking-widest text-white/60">Salary Range (AUD, Annual)</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-white/40 text-xs mb-1">Minimum</p><p className="text-white font-black">${(occ.salary.min/1000).toFixed(0)}k</p></div>
              <div className="border-x border-white/10">
                <p className="text-white/40 text-xs mb-1">Median</p>
                <p className="text-[#ccff00] font-black text-lg">${(occ.salary.median/1000).toFixed(0)}k</p>
              </div>
              <div><p className="text-white/40 text-xs mb-1">Maximum</p><p className="text-white font-black">${(occ.salary.max/1000).toFixed(0)}k</p></div>
            </div>
          </div>

          {/* Visa Eligibility */}
          {listInfo && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Visa Eligibility</h3>
              <p className="text-white/50 text-sm mb-2">{listInfo.desc}</p>
              <div className="flex flex-wrap gap-2">
                {listInfo.visas.map(v => (
                  <span key={v} className="text-xs font-bold px-2 py-1 rounded" style={{ background: `${listInfo.color}20`, color: listInfo.color, border: `1px solid ${listInfo.color}40` }}>
                    Visa {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* State Nomination */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">State Nomination Availability</h3>
            <StateChips states={occ.stateNomination} />
            <p className="text-white/30 text-xs mt-2">Availability changes with each state nomination round. Always check current state lists.</p>
          </div>

          {/* Skills Assessment */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Skills Assessment Authority</h3>
            {assessBody ? (
              <a href={assessBody.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#ccff00] hover:underline text-sm font-bold">
                {assessBody.name} <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-white/50 text-sm">{occ.assessing}</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-300/80 text-xs leading-relaxed">
              Occupation lists change periodically. Always verify the current status at{' '}
              <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" target="_blank" rel="noopener noreferrer" className="underline">
                immi.homeaffairs.gov.au
              </a>{' '}
              before lodging an EOI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OccupationCheckerPage = () => {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('all');
  const [listFilter, setListFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => {
    let filtered = searchOccupations(query, category);
    if (listFilter !== 'all') filtered = filtered.filter(o => o.list === listFilter);
    return filtered;
  }, [query, category, listFilter]);

  const totalMltssl = OCCUPATIONS.filter(o => o.list === 'MLTSSL').length;
  const totalStsol  = OCCUPATIONS.filter(o => o.list === 'STSOL').length;
  const totalPmsol  = OCCUPATIONS.filter(o => o.list === 'PMSOL').length;

  return (
    <>
      <SEOHead
        title="Occupation Demand Checker — MLTSSL, STSOL & PMSOL"
        description="Check if your occupation is on the Australian skilled occupation lists (MLTSSL, STSOL, PMSOL). Find which visas you qualify for, salary ranges, and state nomination availability."
        path="/occupation"
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'MIGRON Occupation Demand Checker',
        applicationCategory: 'UtilitiesApplication',
        description: 'Check Australian skilled occupation lists — MLTSSL, STSOL and PMSOL — with visa eligibility, salary data and state nomination availability.',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
        featureList: 'MLTSSL check, STSOL check, PMSOL check, State nomination, Salary range, Visa eligibility',
      })}} />

      <main id="main-content" className="pt-24 pb-20 min-h-screen bg-[#050505]">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-[#ccff00]" />
              <span className="text-[#ccff00] text-xs font-black uppercase tracking-widest">Occupation Demand Checker</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-3">
              IS YOUR OCCUPATION<br />
              <span className="text-[#ccff00]">ON THE SKILLED LIST?</span>
            </h1>
            <p className="text-white/50 text-base max-w-2xl">
              Search {OCCUPATIONS.length}+ occupations across MLTSSL, STSOL and PMSOL. Instantly see which Australian visas you qualify for, typical salary ranges and state nomination availability.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'MLTSSL occupations', value: totalMltssl, color: '#ccff00' },
              { label: 'STSOL occupations',  value: totalStsol,  color: '#00d4ff' },
              { label: 'PMSOL occupations',  value: totalPmsol,  color: '#ff6b6b' },
            ].map(s => (
              <div key={s.label} className="border border-white/10 rounded-lg p-3 text-center">
                <p className="font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search + filters */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 mb-6 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search occupation title, ANZSCO code, or keyword…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#ccff00]/50 text-sm"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${
                    category === cat.id
                      ? 'bg-[#ccff00] text-black'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List filter */}
            <div className="flex gap-2">
              {[
                { id: 'all',    label: 'All Lists',  color: null     },
                { id: 'MLTSSL', label: 'MLTSSL',     color: '#ccff00' },
                { id: 'STSOL',  label: 'STSOL',      color: '#00d4ff' },
                { id: 'PMSOL',  label: 'PMSOL',      color: '#ff6b6b' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setListFilter(f.id)}
                  className={`text-xs font-black px-3 py-1.5 rounded transition-all border ${
                    listFilter === f.id
                      ? 'border-transparent'
                      : 'border-white/10 text-white/40 hover:border-white/20'
                  }`}
                  style={listFilter === f.id && f.color
                    ? { background: f.color, color: '#000', borderColor: f.color }
                    : listFilter === f.id
                    ? { background: 'rgba(255,255,255,0.1)', color: '#fff' }
                    : {}
                  }
                >
                  {f.label}
                </button>
              ))}
              <span className="ml-auto text-white/30 text-xs self-center">{results.length} results</span>
            </div>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <Search size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold">No occupations found</p>
              <p className="text-sm mt-1">Try a different search term or category</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map(occ => (
                <button
                  key={occ.id}
                  onClick={() => setSelected(occ)}
                  className="w-full text-left bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-lg p-4 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* ANZSCO + title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs text-white/30">{occ.id}</span>
                        <ListBadge list={occ.list} />
                        <DemandBadge demand={occ.demand} />
                      </div>
                      <h3 className="font-black text-white uppercase tracking-tight text-sm truncate group-hover:text-[#ccff00] transition-colors">
                        {occ.title}
                      </h3>
                      {occ.altTitles?.length > 0 && (
                        <p className="text-white/30 text-xs mt-0.5 truncate">{occ.altTitles.join(' · ')}</p>
                      )}
                    </div>

                    {/* Salary */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[#ccff00] font-black text-sm">${(occ.salary.median/1000).toFixed(0)}k</p>
                      <p className="text-white/30 text-xs">median salary</p>
                    </div>

                    {/* State nom */}
                    <div className="flex-shrink-0 hidden md:block">
                      <StateChips states={occ.stateNomination} />
                    </div>

                    <ChevronRight size={14} className="text-white/20 flex-shrink-0 group-hover:text-[#ccff00] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* List legend */}
          <div className="mt-8 border border-white/10 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Occupation List Guide</h3>
              {Object.values(LIST_VISA_ELIGIBILITY).map(l => (
                <div key={l.label} className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: l.color, color: l.textColor }}>{l.label}</span>
                    <span className="text-white/50 text-xs">{l.full}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pl-2">
                    {l.visas.map(v => (
                      <span key={v} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-white/40 rounded">Visa {v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t md:border-t-0 md:border-l border-white/10 md:pl-4 pt-4 md:pt-0">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-3">Demand Levels</h3>
              {Object.entries(DEMAND_LEVELS).map(([level, cfg]) => (
                <div key={level} className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                  <span className="text-white/60 text-xs">{level}</span>
                </div>
              ))}
              <div className="mt-4 flex items-start gap-2">
                <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/30 text-xs leading-relaxed">
                  Occupation lists and demand data are reviewed periodically. Verify at{' '}
                  <a href="https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">
                    immi.homeaffairs.gov.au
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selected && <OccupationDetailPanel occ={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default OccupationCheckerPage;
