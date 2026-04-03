import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Newspaper } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour
const SLIDE_INTERVAL   = 6000;           // 6 seconds auto-advance
const FALLBACK_IMAGE   = 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=600';

const SOURCE_COLORS = {
    'ABC News':     '#ff6b35',
    'The Guardian': '#05A0E8',
    'SBS News':     '#8b5cf6',
};

function timeAgo(dateStr, lang) {
    if (!dateStr) return '';
    try {
        const diff = Date.now() - new Date(dateStr).getTime();
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (lang === 'tr') {
            if (m < 2)  return 'Az önce';
            if (h < 1)  return `${m} dk önce`;
            if (d < 1)  return `${h} saat önce`;
            return `${d} gün önce`;
        }
        if (m < 2)  return 'Just now';
        if (h < 1)  return `${m}m ago`;
        if (d < 1)  return `${h}h ago`;
        return `${d}d ago`;
    } catch { return ''; }
}

// ── Card ─────────────────────────────────────────────────────────────────────
const NewsCard = React.memo(({ article, isActive, onClick }) => {
    const { lang } = useLanguage();
    const color = SOURCE_COLORS[article.source] || '#ccff00';

    return (
        <article
            onClick={() => {
                window.open(article.link, '_blank', 'noopener,noreferrer');
                if (onClick) onClick();
            }}
            className={`
                flex-shrink-0 w-full md:w-[calc(33.333%-11px)] cursor-pointer
                border transition-all duration-500 group
                ${isActive
                    ? 'border-[#ccff00]/60 bg-[#0f0f0f]'
                    : 'border-white/5 bg-[#080808] hover:border-white/20 hover:bg-[#0f0f0f]'}
            `}
        >
            {/* Thumbnail */}
            <div className="relative h-40 overflow-hidden bg-[#111]">
                <img
                    src={article.image || FALLBACK_IMAGE}
                    alt={article.title}
                    className={`
                        w-full h-full object-cover transition-all duration-700
                        grayscale group-hover:grayscale-0
                        ${isActive ? 'grayscale-0' : ''}
                    `}
                    onError={e => { e.target.src = FALLBACK_IMAGE; }}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                {/* Source badge */}
                <div
                    className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
                    style={{ backgroundColor: color, color: '#000' }}
                >
                    {article.source}
                </div>
                {/* Time */}
                {article.pubDate && (
                    <div className="absolute top-3 right-3 text-[9px] text-white/50 font-mono bg-black/60 px-1.5 py-0.5">
                        {timeAgo(article.pubDate, lang)}
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="p-4">
                {article.category && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/25 mb-1.5 block">
                        {article.category}
                    </span>
                )}
                <h3 className="text-sm font-bold leading-tight text-white group-hover:text-[#ccff00] transition-colors line-clamp-3 mb-2 uppercase tracking-tight">
                    {article.title}
                </h3>
                {article.description && (
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">
                        {article.description}
                    </p>
                )}
                <span className="inline-flex items-center gap-1 mt-3 text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-[#ccff00] transition-colors">
                    {lang === 'tr' ? 'OKU' : 'READ'} <ExternalLink size={9} />
                </span>
            </div>
        </article>
    );
});

// ── Main component ────────────────────────────────────────────────────────────
const AustraliaNewsSlider = () => {
    const { lang }      = useLanguage();
    const langRef       = useRef(lang);
    useEffect(() => { langRef.current = lang; }, [lang]);

    const [articles, setArticles]       = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [lastFetch, setLastFetch]     = useState(null);
    const [refreshing, setRefreshing]   = useState(false);
    // FIX: use an incrementing key so progress bar always restarts (even when index wraps 0→0)
    const [progressKey, setProgressKey] = useState(0);
    const slideTimerRef = useRef(null);

    // FIX: removed `lang` from dependency array to avoid resetting hourly timer on language switch
    const fetchNews = useCallback(async (manual = false) => {
        if (manual) setRefreshing(true);
        try {
            setError(null);
            const res  = await fetch('/api/australia-news');
            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

            if (data.articles?.length > 0) {
                setArticles(data.articles);
                setLastFetch(new Date());
                setActiveIndex(0);
                setProgressKey(k => k + 1);
            } else {
                setError(langRef.current === 'tr'
                    ? 'Şu anda haber bulunamadı.'
                    : 'No articles available right now.');
            }
        } catch {
            setError(langRef.current === 'tr' ? 'Haberler yüklenemedi.' : 'Could not load news.');
        } finally {
            setLoading(false);
            if (manual) setRefreshing(false);
        }
    }, []); // ← no lang dependency

    // Initial fetch + hourly refresh — stable (fetchNews never changes)
    useEffect(() => {
        fetchNews();
        const hourly = setInterval(() => fetchNews(), REFRESH_INTERVAL);
        return () => clearInterval(hourly);
    }, [fetchNews]);

    useEffect(() => {
        if (articles.length < 2) return;
        clearInterval(slideTimerRef.current);
        slideTimerRef.current = setInterval(() => {
            setActiveIndex(prev => {
                const next = (prev + 1) % articles.length;
                setProgressKey(k => k + 1);
                return next;
            });
        }, SLIDE_INTERVAL);
        return () => clearInterval(slideTimerRef.current);
    }, [articles.length]);

    const prev = () => {
        clearInterval(slideTimerRef.current);
        setActiveIndex(i => {
            const next = (i - 1 + articles.length) % articles.length;
            setProgressKey(k => k + 1);
            return next;
        });
    };

    const next = () => {
        clearInterval(slideTimerRef.current);
        setActiveIndex(i => {
            const next = (i + 1) % articles.length;
            setProgressKey(k => k + 1);
            return next;
        });
    };

    // Desktop: show prev, current, next (3 cards)
    const getVisible = () => {
        if (articles.length === 0) return [];
        if (articles.length <= 3) return articles.map((a, i) => ({ article: a, origIndex: i }));
        return [-1, 0, 1].map(offset => {
            const i = (activeIndex + offset + articles.length) % articles.length;
            return { article: articles[i], origIndex: i };
        });
    };

    const visible = getVisible();

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <section className="bg-[#050505] border-b border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                            {lang === 'tr' ? 'Haberler yükleniyor…' : 'Loading news…'}
                        </span>
                    </div>
                    <div className="hidden md:flex gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-1 h-64 bg-white/5 animate-pulse" />
                        ))}
                    </div>
                    <div className="md:hidden h-64 bg-white/5 animate-pulse" />
                </div>
            </section>
        );
    }

    // ── Error / empty state ───────────────────────────────────────────────────
    if (error && articles.length === 0) {
        return (
            <section className="bg-[#050505] border-b border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-4 text-white/30">
                    <Newspaper size={18} />
                    <span className="text-sm">{error}</span>
                    <button
                        onClick={() => fetchNews(true)}
                        className="text-[#ccff00] hover:underline text-sm font-bold ml-2"
                    >
                        {lang === 'tr' ? 'Tekrar dene' : 'Retry'}
                    </button>
                </div>
            </section>
        );
    }

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <section
            className="bg-[#050505] border-b border-white/5 py-10 overflow-hidden"
            aria-label={lang === 'tr' ? 'Avustralya Haber Slaydı' : 'Australia News Slider'}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ccff00]">
                                {lang === 'tr' ? '● CANLI HABERLER' : '● LIVE NEWS'}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white italic">
                            {lang === 'tr' ? 'AVUSTRALYA' : 'AUSTRALIA'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {lastFetch && (
                            <span className="hidden md:block text-[9px] text-white/20 font-mono">
                                {lang === 'tr' ? 'Son: ' : 'Updated: '}
                                {lastFetch.toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-AU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                        <button
                            onClick={() => { clearInterval(slideTimerRef.current); fetchNews(true); }}
                            disabled={refreshing}
                            className="p-2 border border-white/10 hover:border-[#ccff00]/50 hover:text-[#ccff00] transition-all text-white/40 disabled:opacity-30"
                            aria-label={lang === 'tr' ? 'Yenile' : 'Refresh'}
                        >
                            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={prev}
                            className="w-9 h-9 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white/60"
                            aria-label={lang === 'tr' ? 'Önceki' : 'Previous'}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={next}
                            className="w-9 h-9 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-white/60"
                            aria-label={lang === 'tr' ? 'Sonraki' : 'Next'}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="flex gap-4">
                    {/* Mobile: active card only */}
                    <div className="flex md:hidden w-full">
                        {articles[activeIndex] && (
                            <NewsCard article={articles[activeIndex]} isActive onClick={() => {}} />
                        )}
                    </div>

                    {/* Desktop: 3 cards */}
                    <div className="hidden md:flex gap-4 w-full">
                        {visible.map(({ article, origIndex }) => (
                            <NewsCard
                                key={origIndex}
                                article={article}
                                isActive={origIndex === activeIndex}
                                onClick={() => {
                                    clearInterval(slideTimerRef.current);
                                    setActiveIndex(origIndex);
                                    setProgressKey(k => k + 1);
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Dot indicators */}
                {articles.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6" role="tablist">
                        {articles.map((_, i) => (
                            <button
                                key={i}
                                role="tab"
                                aria-selected={i === activeIndex}
                                onClick={() => {
                                    clearInterval(slideTimerRef.current);
                                    setActiveIndex(i);
                                    setProgressKey(k => k + 1);
                                }}
                                className={`transition-all duration-300 ${
                                    i === activeIndex
                                        ? 'w-6 h-1.5 bg-[#ccff00]'
                                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Progress bar — FIX: key=progressKey always restarts animation */}
                <div className="mt-4 h-px bg-white/5 overflow-hidden">
                    <div
                        key={progressKey}
                        className="h-full bg-[#ccff00]/40"
                        style={{ animation: `news-progress ${SLIDE_INTERVAL}ms linear forwards` }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes news-progress {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
            `}</style>
        </section>
    );
};

export default AustraliaNewsSlider;
