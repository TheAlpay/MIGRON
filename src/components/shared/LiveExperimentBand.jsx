import React from 'react';

const LiveExperimentBand = () => {
    const today = new Date().toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    return (
        <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-400">
                    LIVE EXPERIMENT
                </span>
            </div>
            <p className="text-[11px] text-white/35 leading-relaxed">
                {`Some of this content is written by Alpay as he lives the Australian immigration process firsthand. — ${today}`}
            </p>
        </div>
    );
};

export default LiveExperimentBand;
