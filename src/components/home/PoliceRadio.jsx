import React, { useState, useEffect, useRef } from 'react';
import { Radio, Play, Pause, Volume2, VolumeX, AlertTriangle, Wifi } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// ── Feed definitions ─────────────────────────────────────────────────────────
// Direct Broadcastify MP3 streams — no proxy needed
const STATES = [
    {
        id: 'NSW',
        label: 'NSW',
        full: 'New South Wales',
        channels: [
            {
                id:   'nsw-1',
                name: 'NSW Primary Emergency Services',
                url:  'https://broadcastify.cdnstream1.com/34010',
            },
            {
                id:   'nsw-2',
                name: 'NSW Greater Sydney (GRN)',
                url:  'https://broadcastify.cdnstream1.com/12349',
            },
        ],
    },
    {
        id: 'QLD',
        label: 'QLD',
        full: 'Queensland',
        channels: [
            {
                id:   'qld-1',
                name: 'QLD South West Police',
                url:  'https://broadcastify.cdnstream1.com/43562',
            },
            {
                id:   'qld-2',
                name: 'QLD Rockhampton Dispatch',
                url:  'https://broadcastify.cdnstream1.com/40865',
            },
        ],
    },
    {
        id: 'WA',
        label: 'WA',
        full: 'Western Australia',
        channels: [
            {
                id:   'wa-1',
                name: 'Perth Railways Police',
                url:  'https://broadcastify.cdnstream1.com/4708',
            },
        ],
    },
    {
        id:   'VIC',
        label: 'VIC Emergency',
        full: 'Victoria',
        // VIC Police feeds are digitally encrypted — fire/ambulance only
        note: true,
        channels: [
            {
                id:   'vic-1',
                name: 'Northern Victoria (CFA / SES)',
                url:  'https://broadcastify.cdnstream1.com/7333',
            },
            {
                id:   'vic-2',
                name: 'South West Victoria (FRV / CFA)',
                url:  'https://broadcastify.cdnstream1.com/43710',
            },
        ],
    },
];

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

// ── Channel row ───────────────────────────────────────────────────────────────
const ChannelRow = ({ channel, isPlaying, isError, onToggle, lang }) => (
    <div
        className={`
            flex items-center gap-4 px-5 py-4 border-b border-white/5
            transition-colors group cursor-pointer
            ${isPlaying
                ? 'bg-[#ccff00]/5 border-l-2 border-l-[#ccff00]'
                : 'hover:bg-white/[0.03]'}
        `}
        onClick={() => onToggle(channel.id, channel.url)}
    >
        {/* Play / Pause button */}
        <button
            className={`
                w-9 h-9 flex items-center justify-center flex-shrink-0 border transition-all
                ${isError
                    ? 'border-red-500/30 text-red-400/50 cursor-not-allowed'
                    : isPlaying
                        ? 'border-[#ccff00] text-[#ccff00] bg-[#ccff00]/10'
                        : 'border-white/15 text-white/50 group-hover:border-white/40 group-hover:text-white/80'}
            `}
            aria-label={isPlaying ? (lang === 'tr' ? 'Duraklat' : 'Pause') : (lang === 'tr' ? 'Oynat' : 'Play')}
        >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Waveform (only when playing) */}
        {isPlaying && <Waveform active />}

        {/* Channel name */}
        <div className="flex-1 min-w-0">
            <span className={`
                text-[11px] font-bold uppercase tracking-tight block truncate transition-colors
                ${isPlaying ? 'text-[#ccff00]' : isError ? 'text-white/25' : 'text-white/70 group-hover:text-white/90'}
            `}>
                {channel.name}
            </span>
            {isError && (
                <span className="text-[9px] text-red-400/70 font-medium mt-0.5 block">
                    {lang === 'tr'
                        ? 'Bu yayın Premium üyelik gerektirebilir'
                        : 'This stream may require a Premium subscription'}
                </span>
            )}
        </div>

        {/* Live badge */}
        {isPlaying ? (
            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#ccff00] flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                LIVE
            </span>
        ) : (
            <span className="text-[9px] font-black uppercase tracking-widest text-white/15 flex-shrink-0 flex items-center gap-1">
                <Wifi size={9} />
                {lang === 'tr' ? 'STREAM' : 'STREAM'}
            </span>
        )}
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const PoliceRadio = () => {
    const { lang }              = useLanguage();
    const [activeState, setActiveState] = useState('NSW');
    const [playingId, setPlayingId]     = useState(null);
    const [errors, setErrors]           = useState({});   // { [channelId]: true }
    const [muted, setMuted]             = useState(false);
    const audioRef = useRef(null);

    const currentState = STATES.find(s => s.id === activeState) || STATES[0];
    const playingChannel = STATES.flatMap(s => s.channels).find(c => c.id === playingId) || null;

    // ── Audio control ─────────────────────────────────────────────────────────
    const toggle = (channelId, url) => {
        // If same channel → stop
        if (playingId === channelId) {
            stopAudio();
            return;
        }

        // Stop previous stream
        stopAudio();

        // Start new stream
        const audio = new Audio(url);
        audio.muted = muted;

        audio.addEventListener('error', (e) => {
            console.warn('[PoliceRadio] Stream error for', channelId, e);
            setErrors(prev => ({ ...prev, [channelId]: true }));
            setPlayingId(null);
        });

        audio.addEventListener('playing', () => {
            // Clear any previous error for this channel on successful play
            setErrors(prev => {
                if (!prev[channelId]) return prev;
                const next = { ...prev };
                delete next[channelId];
                return next;
            });
        });

        audio.play().catch(err => {
            console.warn('[PoliceRadio] play() rejected for', channelId, err);
            setErrors(prev => ({ ...prev, [channelId]: true }));
            setPlayingId(null);
        });

        audioRef.current = audio;
        setPlayingId(channelId);
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }
        setPlayingId(null);
    };

    // Sync mute state to active audio element
    useEffect(() => {
        if (audioRef.current) audioRef.current.muted = muted;
    }, [muted]);

    // Stop playback when changing state tab
    const switchState = (stateId) => {
        if (stateId === activeState) return;
        stopAudio();
        setActiveState(stateId);
    };

    // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => { stopAudio(); }, []);

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
                            Australia
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
                {/* ── State tabs ──────────────────────────────────────────── */}
                <div className="flex overflow-x-auto border-b border-white/5">
                    {STATES.map(state => (
                        <button
                            key={state.id}
                            onClick={() => switchState(state.id)}
                            className={`
                                flex-shrink-0 px-6 py-4 text-[10px] font-black uppercase tracking-widest
                                border-r border-white/5 transition-all
                                ${activeState === state.id
                                    ? 'bg-[#ccff00] text-black'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'}
                            `}
                        >
                            {state.label}
                        </button>
                    ))}
                </div>

                {/* VIC note */}
                {currentState.note && (
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500/5 border-b border-yellow-500/10">
                        <AlertTriangle size={11} className="text-yellow-400/60 flex-shrink-0" />
                        <span className="text-[10px] text-yellow-400/60">
                            {lang === 'tr'
                                ? 'VIC Polis telsizleri şifreli. Yalnızca itfaiye ve acil servis yayınları gösteriliyor.'
                                : 'VIC Police feeds are digitally encrypted. Showing fire & emergency services only.'}
                        </span>
                    </div>
                )}

                {/* ── Channel list ─────────────────────────────────────────── */}
                <div>
                    {currentState.channels.map(channel => (
                        <ChannelRow
                            key={channel.id}
                            channel={channel}
                            isPlaying={playingId === channel.id}
                            isError={!!errors[channel.id]}
                            onToggle={toggle}
                            lang={lang}
                        />
                    ))}
                </div>

                {/* ── Now-playing bar ──────────────────────────────────────── */}
                {playingId && playingChannel && (
                    <div className="border-t border-[#ccff00]/20 bg-[#0a0a0a] px-5 py-3.5 flex items-center gap-4">
                        <Waveform active />

                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] truncate block">
                                {playingChannel.name}
                            </span>
                            <span className="text-[9px] text-white/20 font-mono">
                                {STATES.find(s => s.channels.some(c => c.id === playingId))?.full}
                            </span>
                        </div>

                        {/* Mute on now-playing bar */}
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
