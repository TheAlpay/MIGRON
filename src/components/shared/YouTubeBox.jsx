import React from 'react';
import { Youtube } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const YouTubeBox = () => {
    const { lang } = useLanguage();
    return (
        <div className="border border-[#ccff00]/30 bg-[#111] p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-[#ccff00]/10 shrink-0">
                <Youtube size={26} className="text-[#ccff00]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ccff00] mb-1">
                    {lang === 'en' ? '📺 WATCH THIS ON VIDEO' : '📺 BU KONUYU VİDEO OLARAK İZLE'}
                </p>
                <p className="text-sm text-white/50 leading-relaxed">
                    {lang === 'en'
                        ? "Alpay is living the Australian immigration process firsthand and sharing it on the ALPAY AU YouTube channel."
                        : "Alpay bu süreci Avustralya'da bizzat yaşıyor ve ALPAY AU YouTube kanalında anlatıyor."}
                </p>
            </div>
            <a
                href="https://youtube.com/@alpay0101"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#ccff00] text-black font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all whitespace-nowrap"
            >
                <Youtube size={13} />
                ALPAY AU
            </a>
        </div>
    );
};

export default YouTubeBox;
