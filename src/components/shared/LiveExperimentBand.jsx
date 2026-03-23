import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const LiveExperimentBand = () => {
    const { lang } = useLanguage();
    const today = new Date().toLocaleDateString(lang === 'en' ? 'en-AU' : 'tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    return (
        <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-400">
                    {lang === 'en' ? 'LIVE EXPERIMENT' : 'CANLI DENEY'}
                </span>
            </div>
            <p className="text-[11px] text-white/35 leading-relaxed">
                {lang === 'en'
                    ? `Some of this content is written by Alpay as he lives it firsthand in Brisbane. — ${today}`
                    : `Bu içeriklerin bir kısmı Alpay tarafından Brisbane'de bizzat yaşanarak yazılıyor. — ${today}`}
            </p>
        </div>
    );
};

export default LiveExperimentBand;
