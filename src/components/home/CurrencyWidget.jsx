import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const PAIRS = [
    { key: 'TRY', label: 'TRY', flag: '🇹🇷', color: '#ccff00' },
    { key: 'USD', label: 'USD', flag: '🇺🇸', color: '#00d4ff' },
    { key: 'EUR', label: 'EUR', flag: '🇪🇺', color: '#a78bfa' },
];

const CurrencyWidget = () => {
    const [rates, setRates] = useState(null);
    const [prev, setPrev] = useState(null);
    const [updatedAt, setUpdatedAt] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRates = async () => {
        try {
            const res = await fetch('https://api.frankfurter.app/latest?from=AUD&to=TRY,USD,EUR');
            if (!res.ok) return;
            const data = await res.json();
            setPrev(rates);
            setRates(data.rates);
            setUpdatedAt(new Date());
        } catch { /* silent */ }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchRates();
        const id = setInterval(fetchRates, 30 * 60 * 1000);
        return () => clearInterval(id);
    }, []);

    const trend = (key) => {
        if (!prev || !rates) return null;
        if (rates[key] > prev[key]) return 'up';
        if (rates[key] < prev[key]) return 'down';
        return null;
    };

    return (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col">
            {/* Header tab */}
            <div className="bg-[#ccff00] px-3 py-1.5 writing-mode-vertical">
                <span className="text-black font-black text-[9px] uppercase tracking-[0.25em]">1 AUD</span>
            </div>

            {/* Rate cards */}
            {PAIRS.map(pair => {
                const rate = rates?.[pair.key];
                const dir = trend(pair.key);
                return (
                    <div
                        key={pair.key}
                        className="border-b border-white/5 bg-[#050505]/95 backdrop-blur-sm px-3 py-2.5 min-w-[90px]"
                        style={{ borderLeft: `3px solid ${pair.color}` }}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: pair.color }}>
                                {pair.flag} {pair.label}
                            </span>
                            {dir === 'up' && <TrendingUp size={8} className="text-green-400" />}
                            {dir === 'down' && <TrendingDown size={8} className="text-red-400" />}
                        </div>
                        <div className="text-sm font-black text-white mt-0.5">
                            {loading ? '...' : rate ? rate.toFixed(pair.key === 'TRY' ? 2 : 4) : '—'}
                        </div>
                    </div>
                );
            })}

            {/* Update time */}
            <div className="bg-black/80 px-3 py-1.5">
                <div className="flex items-center gap-1">
                    <RefreshCw size={7} className="text-white/20" />
                    <span className="text-[8px] text-white/20 font-mono">
                        {updatedAt ? updatedAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CurrencyWidget;
