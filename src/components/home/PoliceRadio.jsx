import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Radio, Play, Pause, Volume2, VolumeX, Wifi } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// ── System definitions ────────────────────────────────────────────────────────
const SYSTEMS = [
    { id: 'NSW', label: 'NSW', shortName: 'nsw-grn',    full: 'New South Wales'   },
    { id: 'QLD', label: 'QLD', shortName: 'qld-police', full: 'Queensland'        },
    { id: 'WA',  label: 'WA',  shortName: 'wa-police',  full: 'Western Australia' },
];

const POLL_INTERVAL = 15000; // 15 seconds

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDuration = (sec) => {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
};

const timeAgo = (unixSec, lang) => {
    const s = Math.floor(Date.now() / 1000 - unixSec);
    if (s < 5)  return lang === 'tr' ? 'Az önce'    : 'Just now';
    if (s < 60) return lang === 'tr' ? `${s} sn önce` : `${s}s ago`;
    const m = Math.floor(s / 60);
    return lang === 'tr' ? `${m} dk önce` : `${m}m ago`;
};

// ── Waveform bars ─────────────────────────────────────────────────────────────
const Waveform = ({ active }) => (
    <div className="flex items-end gap-[2px] h-4 flex-shrink-0">
        {[2, 4, 3, 5, 4, 3, 4, 5, 3, 4].map((h, i) => (
            <div
                key={i}
                className={`w-[2px] bg-[#ccff00] transition-all ${active ? '' : 'opacity-30'}`}
                style={active ? {
                    height: `${h * 15}%`,
                    animation: `radio-bar ${0.4 + (i % 4) * 0.1}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                } : { height: '20%' }}
            />
        ))}
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const PoliceRadio = () => {
    const { lang } = useLanguage();

    const [activeSystem, setActiveSystem]   = useState('NSW');
    const [calls, setCalls]                 = useState({});   // { [systemId]: Call[] }
    const [loading, setLoading]             = useState({});   // { [systemId]: bool }
    const [errors, setErrors]               = useState({});   // { [systemId]: 'no_data' | 'error' | null }
    const [playingCallId, setPlayingCallId] = useState(null);
    const [muted, setMuted]                 = useState(false);

    const audioRef         = useRef(null);
    const pollRef          = useRef(null);
    const lastCallIdRef    = useRef({});  // { [systemId]: latestAutoPlayedId }
    const mutedRef         = useRef(muted);
    const activeSystemRef  = useRef(activeSystem);

    useEffect(() => { mutedRef.current = muted; }, [muted]);
    useEffect(() => { activeSystemRef.current = activeSystem; }, [activeSystem]);

    // ── Audio control ─────────────────────────────────────────────────────────
    const playCall = useCallback((callId, url) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        const audio = new Audio(url);
        audio.muted = mutedRef.current;
        audio.play().catch(err => console.warn('[PoliceRadio] play() failed:', err));
        audio.addEventListener('ended', () => setPlayingCallId(null));
        audioRef.current = audio;
        setPlayingCallId(callId);
    }, []);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }
        setPlayingCallId(null);
    }, []);

    // Sync mute to active audio
    useEffect(() => {
        if (audioRef.current) audioRef.current.muted = muted;
    }, [muted]);

    // ── Fetch latest calls ────────────────────────────────────────────────────
    const fetchCalls = useCallback(async (systemId) => {
        const sys = SYSTEMS.find(s => s.id === systemId);
        if (!sys) return;

        try {
            const r    = await fetch(`/api/openmhz?shortName=${sys.shortName}`);
            const data = await r.json();

            if (!r.ok || !data.success) {
                setErrors(prev => ({ ...prev, [systemId]: 'no_data' }));
                return;
            }

            const incoming = (data.calls || []).filter(c => c.url);

            if (incoming.length === 0) {
                setErrors(prev => ({ ...prev, [systemId]: 'no_data' }));
            } else {
                setErrors(prev => ({ ...prev, [systemId]: null }));
                setCalls(prev => ({ ...prev, [systemId]: incoming }));
            }
        } catch (err) {
            console.error('[PoliceRadio] fetch error:', err);
            setErrors(prev => ({ ...prev, [systemId]: 'error' }));
        } finally {
            setLoading(prev => ({ ...prev, [systemId]: false }));
        }
    }, []);

    // ── Auto-play newest call when data updates ───────────────────────────────
    useEffect(() => {
        const sysCalls = calls[activeSystem] || [];
        if (sysCalls.length === 0) return;
        const newest = sysCalls[0];
        if (newest.url && newest._id !== lastCallIdRef.current[activeSystem]) {
            lastCallIdRef.current[activeSystem] = newest._id;
            playCall(newest._id, newest.url);
        }
    }, [calls, activeSystem, playCall]);

    // ── Polling: restart when active system changes ───────────────────────────
    useEffect(() => {
        clearInterval(pollRef.current);
        setLoading(prev => ({ ...prev, [activeSystem]: true }));
        fetchCalls(activeSystem);
        pollRef.current = setInterval(() => fetchCalls(activeSystem), POLL_INTERVAL);
        return () => clearInterval(pollRef.current);
    }, [activeSystem, fetchCalls]);

    // Cleanup on unmount
    useEffect(() => () => { stopAudio(); clearInterval(pollRef.current); }, [stopAudio]);

    // ── Tab switch ────────────────────────────────────────────────────────────
    const switchSystem = (id) => {
        if (id === activeSystem) return;
        stopAudio();
        setActiveSystem(id);
    };

    const toggleCall = (call) => {
        if (playingCallId === call._id) stopAudio();
        else playCall(call._id, call.url);
    };

    const system     = SYSTEMS.find(s => s.id === activeSystem) || SYSTEMS[0];
    const sysCalls   = calls[activeSystem] || [];
    const isLoading  = !!loading[activeSystem] && sysCalls.length === 0;
    const hasNoData  = !isLoading && (!!errors[activeSystem] || sysCalls.length === 0);
    const playingCall = sysCalls.find(c => c._id === playingCallId) || null;

    return (
        <section
            className="bg-[#060606] border-b border-white/5"
            aria-label={lang === 'tr' ? 'Avustralya Polis Telsizi' : 'Australia Police Radio'}
        >
            {/* ── Section header ──────────────────────────────────────────── */}
            <div className="border-b border-white/5 px-6 md:px-12 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
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
                            OpenMHz
                        </span>
                    </div>

                    {/* Mute toggle */}
                    <button
                        onClick={() => setMuted(m => !m)}
                        className="p-2 border border-white/10 hover:border-white/30 transition-all text-white/40 hover:text-white/70"
                        aria-label={muted
                            ? (lang === 'tr' ? 'Sesi aç' : 'Unmute')
                            : (lang === 'tr' ? 'Sesi kapat' : 'Mute')}
                    >
                        {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* ── System tabs ─────────────────────────────────────────── */}
                <div className="flex overflow-x-auto border-b border-white/5">
                    {SYSTEMS.map(sys => (
                        <button
                            key={sys.id}
                            onClick={() => switchSystem(sys.id)}
                            className={`
                                flex-shrink-0 px-6 py-4 text-[10px] font-black uppercase tracking-widest
                                border-r border-white/5 transition-all
                                ${activeSystem === sys.id
                                    ? 'bg-[#ccff00] text-black'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'}
                            `}
                        >
                            {sys.label}
                        </button>
                    ))}
                </div>

                {/* ── Content ─────────────────────────────────────────────── */}
                {isLoading ? (
                    <div className="px-5 py-10 flex items-center justify-center gap-2 text-white/30">
                        <Wifi size={14} className="animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                            {lang === 'tr' ? 'Bağlanıyor…' : 'Connecting…'}
                        </span>
                    </div>
                ) : hasNoData ? (
                    <div className="px-5 py-10 flex items-center justify-center">
                        <span className="text-[11px] text-white/25 font-medium uppercase tracking-widest">
                            {lang === 'tr'
                                ? 'Bu bölgede aktif yayın yok'
                                : 'No active broadcasts in this region'}
                        </span>
                    </div>
                ) : (
                    <div>
                        {sysCalls.slice(0, 10).map((call) => {
                            const isPlaying = playingCallId === call._id;
                            const talkgroup = call.talkgroupTag || String(call.talkgroupNum) || '—';
                            const ago       = timeAgo(call.time, lang);
                            const dur       = fmtDuration(call.len);

                            return (
                                <div
                                    key={call._id}
                                    className={`
                                        flex items-center gap-4 px-5 py-4 border-b border-white/5
                                        transition-colors group cursor-pointer
                                        ${isPlaying
                                            ? 'bg-[#ccff00]/5 border-l-2 border-l-[#ccff00]'
                                            : 'hover:bg-white/[0.03]'}
                                    `}
                                    onClick={() => toggleCall(call)}
                                >
                                    {/* Play / Pause */}
                                    <button
                                        className={`
                                            w-9 h-9 flex items-center justify-center flex-shrink-0 border transition-all
                                            ${isPlaying
                                                ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10'
                                                : 'border-white/15 text-white/50 group-hover:border-white/40 group-hover:text-white/80'}
                                        `}
                                        aria-label={isPlaying
                                            ? (lang === 'tr' ? 'Duraklat' : 'Pause')
                                            : (lang === 'tr' ? 'Oynat'    : 'Play')}
                                    >
                                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                    </button>

                                    {isPlaying && <Waveform active />}

                                    {/* Talkgroup info */}
                                    <div className="flex-1 min-w-0">
                                        <span className={`
                                            text-[11px] font-bold uppercase tracking-tight block truncate transition-colors
                                            ${isPlaying ? 'text-[#ccff00]' : 'text-white/70 group-hover:text-white/90'}
                                        `}>
                                            {talkgroup}
                                        </span>
                                        <span className="text-[9px] text-white/25 font-mono mt-0.5 block">
                                            {dur} · {ago}
                                        </span>
                                    </div>

                                    {/* Badge */}
                                    {isPlaying ? (
                                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#ccff00] flex-shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                                            LIVE
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-mono text-white/20 flex-shrink-0">{dur}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Now-playing bar ──────────────────────────────────────── */}
                {playingCallId && playingCall && (
                    <div className="border-t border-[#ccff00]/20 bg-[#0a0a0a] px-5 py-3.5 flex items-center gap-4">
                        <Waveform active />

                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] truncate block">
                                {playingCall.talkgroupTag || String(playingCall.talkgroupNum) || '—'}
                            </span>
                            <span className="text-[9px] text-white/20 font-mono">
                                {system.full} · {fmtDuration(playingCall.len)}
                            </span>
                        </div>

                        <button
                            onClick={() => setMuted(m => !m)}
                            className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                        >
                            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>

                        <button
                            onClick={stopAudio}
                            className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors px-3 py-1.5 border border-white/10 hover:border-red-400/40 flex-shrink-0"
                        >
                            {lang === 'tr' ? 'DURDUR' : 'STOP'}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes radio-bar {
                    from { transform: scaleY(0.35); }
                    to   { transform: scaleY(1.0);  }
                }
            `}</style>
        </section>
    );
};

export default PoliceRadio;
