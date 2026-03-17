import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Radio, MapPin, Shield, Activity, Eye, RefreshCw, Camera } from 'lucide-react';

const STATES = [
    { id: 'NSW', label: 'New South Wales', timeZone: 'Australia/Sydney'    },
    { id: 'QLD', label: 'Queensland',      timeZone: 'Australia/Brisbane'  },
    { id: 'WA',  label: 'Western Australia', timeZone: 'Australia/Perth'   },
];

// YouTube fallbacks per state if no live API cameras are available
const YT_FALLBACK = {
    NSW: { videoId: '_zZ9u92S864', label: 'SYDNEY HARBOUR'    },
    QLD: { videoId: 'P03v_9WOfXo', label: 'BRISBANE CBD'      },
    WA:  { videoId: '8nN7FqfJ6X0', label: 'PERTH WATERFRONT'  },
};

// ── Main Component ────────────────────────────────────────────────────────────
const LiveCamera = () => {
    const [cameras,       setCameras]       = useState([]);
    const [selectedState, setSelectedState] = useState('NSW');
    const [selectedCity,  setSelectedCity]  = useState(null);
    const [activeCam,     setActiveCam]     = useState(null);
    const [apiLoading,    setApiLoading]    = useState(true);
    const [imgFailed,     setImgFailed]     = useState(false);
    const [imgKey,        setImgKey]        = useState(0);   // forces image refresh
    const [localTime,     setLocalTime]     = useState('');

    // ── Fetch camera list ─────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setApiLoading(true);
            try {
                const res = await fetch('/api/traffic-cameras');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!cancelled) setCameras(data.cameras ?? []);
            } catch (err) {
                console.warn('[LiveCamera] API unreachable:', err.message);
                if (!cancelled) setCameras([]);
            } finally {
                if (!cancelled) setApiLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    // ── Derive cities for selected state ──────────────────────────────────────
    const citiesForState = useMemo(() => {
        const seen = new Set();
        const result = [];
        for (const c of cameras) {
            if (c.state === selectedState && c.city && !seen.has(c.city)) {
                seen.add(c.city);
                result.push(c.city);
            }
        }
        return result.sort();
    }, [cameras, selectedState]);

    // ── Auto-select first city when state or city list changes ────────────────
    useEffect(() => {
        if (citiesForState.length > 0 && !citiesForState.includes(selectedCity)) {
            setSelectedCity(citiesForState[0]);
        } else if (citiesForState.length === 0) {
            setSelectedCity(null);
        }
    }, [citiesForState]);

    // ── Cameras for selected city ─────────────────────────────────────────────
    const cityCameras = useMemo(() =>
        cameras.filter(c => c.state === selectedState && c.city === selectedCity),
    [cameras, selectedState, selectedCity]);

    // ── Auto-select first camera when city changes ────────────────────────────
    useEffect(() => {
        if (cityCameras.length > 0) {
            setActiveCam(cityCameras[0]);
            setImgFailed(false);
        } else {
            setActiveCam(null);
        }
    }, [cityCameras]);

    // ── Reset img error when active cam changes ───────────────────────────────
    useEffect(() => { setImgFailed(false); }, [activeCam]);

    // ── Local time clock ──────────────────────────────────────────────────────
    useEffect(() => {
        const tz = STATES.find(s => s.id === selectedState)?.timeZone ?? 'Australia/Sydney';
        const tick = () =>
            setLocalTime(new Intl.DateTimeFormat('tr-TR', {
                timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit',
            }).format(new Date()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [selectedState]);

    // ── Auto-refresh camera image every 60 s ─────────────────────────────────
    useEffect(() => {
        const id = setInterval(() => { setImgKey(k => k + 1); setImgFailed(false); }, 60_000);
        return () => clearInterval(id);
    }, []);

    const handleStateChange = useCallback((stateId) => {
        setSelectedState(stateId);
        setSelectedCity(null);
        setActiveCam(null);
    }, []);

    const handleCamClick = useCallback((cam) => {
        setActiveCam(cam);
        setImgFailed(false);
    }, []);

    // ── Determine what to show in the main viewport ───────────────────────────
    const useYTFallback = !apiLoading && (!activeCam?.imageUrl || imgFailed);
    const fallback = YT_FALLBACK[selectedState];

    return (
        <section className="max-w-[1600px] mx-auto px-6 py-12 md:py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ccff00]/5 rounded-full blur-[150px] pointer-events-none" />

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 relative z-10 gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#ccff00] px-2 py-0.5">
                            <Shield size={10} className="text-black" />
                            <span className="text-[9px] font-black text-black tracking-widest uppercase">
                                MIGRON INTELLIGENCE HUB
                            </span>
                        </div>
                        <div className="h-px w-12 bg-white/20" />
                        <p className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">
                            TRAFFIC_FEEDS: LIVE
                        </p>
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mt-4 leading-[0.9]">
                        LIVE <span className="text-[#ccff00] italic">CAMERAS</span>
                    </h2>
                </div>

                {/* State tabs */}
                <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/5 backdrop-blur-sm">
                    {STATES.map(s => (
                        <button
                            key={s.id}
                            onClick={() => handleStateChange(s.id)}
                            className={`px-5 py-2.5 text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
                                selectedState === s.id
                                    ? 'bg-[#ccff00] text-black'
                                    : 'text-white/40 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {s.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── City tabs (only if we have real camera data) ──────────────── */}
            {citiesForState.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    {citiesForState.map(city => {
                        const count = cameras.filter(
                            c => c.state === selectedState && c.city === city
                        ).length;
                        return (
                            <button
                                key={city}
                                onClick={() => setSelectedCity(city)}
                                className={`flex items-center gap-2 px-4 py-1.5 text-[9px] font-black tracking-[0.12em] uppercase border transition-all ${
                                    selectedCity === city
                                        ? 'border-[#ccff00]/60 bg-[#ccff00]/10 text-[#ccff00]'
                                        : 'border-white/10 text-white/30 hover:text-white hover:border-white/20'
                                }`}
                            >
                                <MapPin size={8} />
                                {city}
                                <span className="text-current/40 ml-0.5 opacity-40">{count}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── Main layout: large view + sidebar grid ────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3 relative z-10">

                {/* Main viewport */}
                <div className="relative aspect-[16/9] bg-[#050505] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)]">

                    {/* Loading state */}
                    {apiLoading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050505]">
                            <div className="flex flex-col items-center gap-5">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 border border-[#ccff00]/20 rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Shield size={22} className="text-[#ccff00] animate-pulse" />
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono text-white/40 tracking-[0.4em] uppercase animate-pulse">
                                    AUTHORIZING GOV FEEDS...
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Live traffic camera image */}
                    {!apiLoading && activeCam?.imageUrl && !imgFailed && (
                        <img
                            key={`main-${activeCam.id}-${imgKey}`}
                            src={activeCam.imageUrl}
                            alt={activeCam.name}
                            className="w-full h-full object-cover brightness-75 contrast-125"
                            onError={() => setImgFailed(true)}
                        />
                    )}

                    {/* YouTube fallback — no cameras or image failed */}
                    {!apiLoading && useYTFallback && fallback && (
                        <iframe
                            key={`yt-${selectedState}`}
                            className="w-full h-full scale-[1.05] brightness-75 contrast-125 grayscale-[0.15]"
                            src={`https://www.youtube.com/embed/${fallback.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${fallback.videoId}&playsinline=1&modestbranding=1&rel=0&showinfo=0`}
                            title="Live Traffic Feed"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                        />
                    )}

                    {/* No camera at all */}
                    {!apiLoading && !activeCam && !fallback && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Camera size={32} className="text-white/10" />
                        </div>
                    )}

                    {/* ── HUD Overlay ───────────────────────────────────────── */}
                    {!apiLoading && (
                        <div className="absolute inset-0 pointer-events-none select-none">
                            {/* Vignette */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

                            {/* Top-left: source tag */}
                            <div className="absolute top-4 left-4 border-l-2 border-[#ccff00] pl-3 font-mono">
                                <div className="flex items-center gap-2">
                                    <Radio size={9} className="text-[#ccff00]" />
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">
                                        {activeCam
                                            ? `${activeCam.state}_CAM_LIVE`
                                            : `${selectedState}_YT_STREAM`}
                                    </span>
                                </div>
                                <div className="text-[8px] text-white/40 tracking-widest mt-0.5 flex items-center gap-1">
                                    <Activity size={8} />
                                    {activeCam
                                        ? `${activeCam.lat?.toFixed(4)}, ${activeCam.lon?.toFixed(4)}`
                                        : 'GOV_STREAM_FALLBACK'}
                                </div>
                            </div>

                            {/* Top-right: live dot + time */}
                            <div className="absolute top-4 right-4 text-right">
                                <div className="flex items-center gap-2 justify-end mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                                    <span className="text-[9px] text-white/60 font-mono uppercase tracking-widest">
                                        LIVE
                                    </span>
                                </div>
                                <span className="text-2xl md:text-3xl font-black text-[#ccff00] tracking-tighter tabular-nums">
                                    {localTime}
                                </span>
                            </div>

                            {/* Bottom-left: camera name */}
                            <div className="absolute bottom-4 left-4">
                                <p className="text-[9px] text-white/40 font-mono uppercase tracking-widest mb-0.5">
                                    {activeCam?.city ?? (selectedState === 'NSW' ? 'Sydney' : selectedState === 'QLD' ? 'Brisbane' : 'Perth')}
                                </p>
                                <p className="text-sm md:text-base font-black text-white uppercase tracking-tight">
                                    {activeCam?.name ?? fallback?.label ?? 'LIVE FEED'}
                                </p>
                            </div>

                            {/* Bottom-right: refresh timer */}
                            {activeCam?.imageUrl && !imgFailed && (
                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
                                        60s REFRESH
                                    </span>
                                    <RefreshCw size={9} className="text-white/20 animate-spin" style={{ animationDuration: '4s' }} />
                                </div>
                            )}

                            {/* Scan line */}
                            <div className="absolute inset-0 overflow-hidden opacity-[0.12]">
                                <div className="absolute left-0 w-full h-0.5 bg-[#ccff00]/60 animate-[scan_5s_linear_infinite]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar: camera thumbnails ────────────────────────────── */}
                <div className="flex flex-col gap-1.5 lg:max-h-[calc(56.25vw*(1/(1+260/100)))] overflow-y-auto overflow-x-hidden">
                    {!apiLoading && cityCameras.length > 0 ? (
                        cityCameras.slice(0, 14).map(cam => (
                            <CamThumb
                                key={cam.id}
                                cam={cam}
                                isActive={activeCam?.id === cam.id}
                                imgKey={imgKey}
                                onClick={handleCamClick}
                            />
                        ))
                    ) : !apiLoading ? (
                        <div className="flex items-center justify-center h-24 border border-white/5">
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                                {cameras.length ? 'SELECT A CITY' : 'USING STREAM FALLBACK'}
                            </span>
                        </div>
                    ) : (
                        // Loading skeletons
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="aspect-video bg-white/5 animate-pulse" />
                        ))
                    )}
                </div>
            </div>

            {/* ── Footer bar ───────────────────────────────────────────────── */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono relative z-10">
                <div className="text-[9px] text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Eye size={10} /> PROTOCOL: OFFICIAL_GOV_GATEWAY
                </div>
                <div className="text-center text-[9px] text-white/30 uppercase tracking-[0.1em]">
                    REAL-TIME TRAFFIC FEEDS · AUTO-REFRESH 60s
                </div>
                <div className="text-right text-[9px] text-white/20 uppercase tracking-[0.2em]">
                    {cityCameras.length > 0
                        ? `${selectedState}_INTEL_NET · ${cityCameras.length} CAMS`
                        : `${selectedState}_STREAM_NODE`}
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    from { top: -2px; }
                    to   { top: 100%; }
                }
            `}</style>
        </section>
    );
};

// ── Thumbnail ─────────────────────────────────────────────────────────────────
const CamThumb = React.memo(({ cam, isActive, imgKey, onClick }) => {
    const [failed, setFailed] = useState(false);

    useEffect(() => { setFailed(false); }, [imgKey]);

    return (
        <button
            onClick={() => onClick(cam)}
            className={`relative flex-shrink-0 aspect-video bg-[#080808] border overflow-hidden transition-all group ${
                isActive ? 'border-[#ccff00]/50' : 'border-white/5 hover:border-white/20'
            }`}
        >
            {cam.imageUrl && !failed ? (
                <img
                    key={`thumb-${cam.id}-${imgKey}`}
                    src={cam.imageUrl}
                    alt={cam.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    onError={() => setFailed(true)}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            )}

            {/* Camera name */}
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-1.5">
                <p className="text-[7px] text-white/70 font-mono uppercase tracking-wider leading-tight line-clamp-1">
                    {cam.name}
                </p>
            </div>
        </button>
    );
});

export default LiveCamera;
