import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// ── Bilingual cost of living data (ABS + Numbeo sourced) ─────────────────
const COST_ITEMS = {
    tr: [
        { label: 'Sydney Kira (1+1)', value: '~$2.200/ay', city: 'SYD' },
        { label: 'Melbourne Kira (1+1)', value: '~$1.900/ay', city: 'MEL' },
        { label: 'Brisbane Kira (1+1)', value: '~$1.850/ay', city: 'BNE' },
        { label: 'Perth Kira (1+1)', value: '~$1.750/ay', city: 'PER' },
        { label: 'Haftalık Market (2 kişi)', value: '$180–220', city: 'AUS' },
        { label: 'Benzin (unleaded)', value: '~$1.82/L', city: 'AUS' },
        { label: 'Ulaşım (aylık)', value: '~$165', city: 'SYD' },
        { label: 'Restoran (2 kişi)', value: '~$90–120', city: 'AUS' },
        { label: 'Elektrik+Su (aylık)', value: '~$200–280', city: 'AUS' },
        { label: 'Asgari Ücret', value: '$24.10/saat', city: 'AUS' },
        { label: 'Ort. Tam Zamanlı Maaş', value: '~$1.900/hafta', city: 'AUS' },
        { label: 'Kahve (flat white)', value: '$5–6', city: 'AUS' },
        { label: 'Bira (400ml pub)', value: '~$10–12', city: 'AUS' },
        { label: 'Gym Üyeliği (aylık)', value: '~$50–80', city: 'AUS' },
        { label: 'Üniversite (yıllık)', value: '$20.000–50.000', city: 'AUS' },
    ],
    en: [
        { label: 'Sydney Rent (1BR)', value: '~$2,200/mo', city: 'SYD' },
        { label: 'Melbourne Rent (1BR)', value: '~$1,900/mo', city: 'MEL' },
        { label: 'Brisbane Rent (1BR)', value: '~$1,850/mo', city: 'BNE' },
        { label: 'Perth Rent (1BR)', value: '~$1,750/mo', city: 'PER' },
        { label: 'Weekly Groceries (2 ppl)', value: '$180–220', city: 'AUS' },
        { label: 'Petrol (unleaded)', value: '~$1.82/L', city: 'AUS' },
        { label: 'Public Transport (mo)', value: '~$165', city: 'SYD' },
        { label: 'Restaurant (2 people)', value: '~$90–120', city: 'AUS' },
        { label: 'Electricity+Water (mo)', value: '~$200–280', city: 'AUS' },
        { label: 'Minimum Wage', value: '$24.10/hr', city: 'AUS' },
        { label: 'Avg. Full-Time Salary', value: '~$1,900/wk', city: 'AUS' },
        { label: 'Coffee (flat white)', value: '$5–6', city: 'AUS' },
        { label: 'Beer (400ml pub)', value: '~$10–12', city: 'AUS' },
        { label: 'Gym Membership (mo)', value: '~$50–80', city: 'AUS' },
        { label: 'University (annual)', value: '$20,000–50,000', city: 'AUS' },
    ],
};

const fetchRates = async () => {
    try {
        const res = await fetch('https://api.frankfurter.app/latest?from=AUD&to=TRY,USD,EUR');
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        return data.rates;
    } catch {
        return null;
    }
};

const LiveTicker = () => {
    const { t, lang } = useLanguage();
    const [rates, setRates] = useState(null);
    const [prevRates, setPrevRates] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const tickerRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            const r = await fetchRates();
            if (r) {
                setPrevRates(rates);
                setRates(r);
                setLastUpdated(new Date());
            }
        };
        load();
        const interval = setInterval(load, 30 * 60 * 1000); // every 30 min
        return () => clearInterval(interval);
    }, []);

    // Pause on hover
    useEffect(() => {
        const el = tickerRef.current;
        if (!el) return;
        const pause = () => el.style.animationPlayState = 'paused';
        const resume = () => el.style.animationPlayState = 'running';
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', resume);
        return () => { el.removeEventListener('mouseenter', pause); el.removeEventListener('mouseleave', resume); };
    }, []);

    // Pause when tab is hidden
    useEffect(() => {
        const handle = () => {
            if (tickerRef.current) {
                tickerRef.current.style.animationPlayState = document.hidden ? 'paused' : 'running';
            }
        };
        document.addEventListener('visibilitychange', handle);
        return () => document.removeEventListener('visibilitychange', handle);
    }, []);

    const trend = (key) => {
        if (!prevRates || !rates) return null;
        if (rates[key] > prevRates[key]) return 'up';
        if (rates[key] < prevRates[key]) return 'down';
        return 'same';
    };

    const TrendIcon = ({ dir }) => {
        if (dir === 'up') return <TrendingUp size={10} className="text-green-400 inline ml-1" />;
        if (dir === 'down') return <TrendingDown size={10} className="text-red-400 inline ml-1" />;
        return null;
    };

    const costItems = COST_ITEMS[lang] || COST_ITEMS.tr;
    const rateItems = rates ? [
        { key: 'TRY', label: '1 AUD → TRY', value: rates.TRY?.toFixed(2), trend: trend('TRY'), live: true, color: '#ccff00' },
        { key: 'USD', label: '1 AUD → USD', value: rates.USD?.toFixed(4), trend: trend('USD'), live: true, color: '#00d4ff' },
        { key: 'EUR', label: '1 AUD → EUR', value: rates.EUR?.toFixed(4), trend: trend('EUR'), live: true, color: '#a78bfa' },
    ] : [];

    const allItems = [
        ...rateItems,
        ...costItems.map(i => ({ ...i, live: false, color: '#ffffff' })),
    ];

    // Double the items for seamless loop
    const doubled = [...allItems, ...allItems];

    return (
        <div className="bg-[#0a0a0a] border-y border-white/5 overflow-hidden relative">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            {/* Left label */}
            <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-3 bg-[#ccff00]">
                <span className="text-black font-black text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">
                    {rates ? `● ${t('ticker_live')}` : '● AUS'}
                </span>
            </div>

            <div
                ref={tickerRef}
                className="flex items-center gap-0 py-2.5 pl-24"
                style={{ animation: 'ticker-scroll 80s linear infinite', width: 'max-content' }}
            >
                {doubled.map((item, i) => (
                    <div key={i} className="flex items-center shrink-0">
                        <div className="flex items-center gap-2 px-6">
                            {item.live && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 uppercase tracking-widest"
                                    style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                                    {t('ticker_live')}
                                </span>
                            )}
                            {item.city && !item.live && (
                                <span className="text-[9px] font-black text-white/20 uppercase">{item.city}</span>
                            )}
                            <span className="text-[11px] text-white/50 font-medium">{item.label}</span>
                            <span className="text-[11px] font-black" style={{ color: item.live ? item.color : 'rgba(255,255,255,0.8)' }}>
                                {item.value}
                                {item.trend && <TrendIcon dir={item.trend} />}
                            </span>
                        </div>
                        <span className="text-white/10 text-xs">|</span>
                    </div>
                ))}
            </div>

            {lastUpdated && (
                <div className="absolute right-4 top-0 bottom-0 z-20 hidden md:flex items-center">
                    <span className="text-[9px] text-white/20 font-mono">
                        {lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )}

            <style>{`
                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default LiveTicker;
