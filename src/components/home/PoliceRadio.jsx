import React, { useState, useEffect } from 'react';
import { Radio, Wifi } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const PLAYER_URL  = 'https://www.broadcastify.com/webPlayer/40865';
const LOAD_TIMEOUT = 12000; // ms before showing error fallback

const PoliceRadio = () => {
    const { lang } = useLanguage();
    // 'loading' | 'loaded' | 'error'
    const [status, setStatus] = useState('loading');

    // If onLoad never fires within LOAD_TIMEOUT, assume the embed failed
    useEffect(() => {
        const t = setTimeout(() => {
            setStatus(s => (s === 'loading' ? 'error' : s));
        }, LOAD_TIMEOUT);
        return () => clearTimeout(t);
    }, []);

    return (
        <section
            className="bg-[#060606] border-b border-white/5"
            aria-label={lang === 'tr' ? 'Avustralya Polis Telsizi' : 'Australia Police Radio'}
        >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="border-b border-white/5 px-6 md:px-12 py-5">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400">
                            ● {lang === 'tr' ? 'CANLI' : 'LIVE'}
                        </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white italic flex items-center gap-3">
                        <Radio size={18} className="text-white/30" />
                        {lang === 'tr' ? 'POLİS TELSİZİ' : 'POLICE RADIO'}
                    </h2>
                    <span className="hidden md:block text-[10px] text-white/20 uppercase tracking-widest border border-white/10 px-2 py-0.5">
                        Australia
                    </span>
                </div>
            </div>

            {/* ── Player ──────────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
                {status === 'error' ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-white/25">
                        <Wifi size={14} />
                        <span className="text-[11px] uppercase tracking-widest font-bold">
                            {lang === 'tr'
                                ? 'Şu an aktif yayın bulunamadı'
                                : 'No active broadcast available right now'}
                        </span>
                    </div>
                ) : (
                    <div className="relative bg-[#0a0a0a] border border-white/5">
                        {/* Loading overlay */}
                        {status === 'loading' && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0a0a0a]">
                                <span className="text-[11px] text-white/30 uppercase tracking-widest font-bold animate-pulse">
                                    {lang === 'tr' ? 'Yükleniyor…' : 'Loading…'}
                                </span>
                            </div>
                        )}
                        <iframe
                            src={PLAYER_URL}
                            width="100%"
                            height="130"
                            frameBorder="0"
                            scrolling="no"
                            title="Broadcastify QLD Rockhampton"
                            onLoad={() => setStatus('loaded')}
                            className="block"
                        />
                    </div>
                )}

                {/* Note */}
                <p className="mt-3 text-[10px] text-white/20 uppercase tracking-widest">
                    QLD Rockhampton {lang === 'tr' ? 'Bölgesi' : 'Region'} —{' '}
                    Broadcastify {lang === 'tr' ? 'üzerinden canlı yayın' : 'live stream'}
                </p>
            </div>
        </section>
    );
};

export default PoliceRadio;
