import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SEARCH_INDEX } from '../../data/searchIndex';

const fuse = new Fuse(SEARCH_INDEX, {
    keys: [
        { name: 'title', weight: 0.4 },
        { name: 'titleEn', weight: 0.4 },
        { name: 'desc', weight: 0.3 },
        { name: 'descEn', weight: 0.3 },
        { name: 'category', weight: 0.1 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
});

const CATEGORY_COLORS = {
    'Sayfa': '#00d4ff',
    'Araç': '#ccff00',
    'Rehber': '#a78bfa',
    'Vize': '#ff9500',
    'Sertifika': '#00ff88',
    'Şablon': '#ff6b6b',
};

const SearchModal = ({ open, onClose }) => {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        if (open) {
            setQuery('');
            setResults([]);
            setActive(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const r = fuse.search(query).slice(0, 8).map(r => r.item);
        setResults(r);
        setActive(0);
    }, [query]);

    const go = useCallback((path) => {
        navigate(path);
        onClose();
        setQuery('');
    }, [navigate, onClose]);

    const handleKey = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
        else if (e.key === 'Enter' && results[active]) { go(results[active].path); }
        else if (e.key === 'Escape') { onClose(); }
    };

    // Scroll active item into view
    useEffect(() => {
        if (listRef.current) {
            const el = listRef.current.children[active];
            el?.scrollIntoView({ block: 'nearest' });
        }
    }, [active]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-[600px] bg-[#0a0a0a] border border-[#ccff00]/30 shadow-[0_0_40px_rgba(204,255,0,0.08)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                    <Search size={16} className="text-[#ccff00]/60 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder={lang === 'en' ? 'Search visa, certificate, guide...' : 'Vize, sertifika, rehber ara...'}
                        className="flex-1 bg-transparent text-white text-sm placeholder-white/25 focus:outline-none"
                        aria-label="Arama"
                    />
                    <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1">
                        <X size={14} />
                    </button>
                </div>

                {/* Results */}
                {results.length > 0 && (
                    <ul ref={listRef} className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
                        {results.map((item, i) => {
                            const title = lang === 'en' ? (item.titleEn || item.title) : item.title;
                            const desc = lang === 'en' ? (item.descEn || item.desc) : item.desc;
                            const catColor = CATEGORY_COLORS[item.category] || '#ccff00';
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => go(item.path)}
                                        className={`w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors ${i === active ? 'bg-[#ccff00]/8' : 'hover:bg-white/3'}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span
                                                    className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5"
                                                    style={{ color: catColor, backgroundColor: `${catColor}15` }}
                                                >
                                                    {item.category}
                                                </span>
                                                <span className="text-sm font-bold text-white truncate">{title}</span>
                                            </div>
                                            <p className="text-xs text-white/35 truncate">{desc}</p>
                                        </div>
                                        <ArrowRight size={12} className="text-white/20 shrink-0" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Empty state */}
                {query.trim() && results.length === 0 && (
                    <div className="px-4 py-8 text-center">
                        <p className="text-sm text-white/30 font-medium mb-2">
                            {lang === 'en' ? 'No results found.' : 'Sonuç bulunamadı.'}
                        </p>
                        <a
                            href="mailto:migron@mtive.tech"
                            className="text-xs text-[#ccff00]/50 hover:text-[#ccff00] transition-colors"
                            onClick={onClose}
                        >
                            {lang === 'en' ? 'Contact us at migron@mtive.tech' : 'migron@mtive.tech ile iletişime geç'}
                        </a>
                    </div>
                )}

                {/* Hint */}
                {!query && (
                    <div className="px-4 py-4 flex items-center gap-4 text-[9px] text-white/15 font-mono uppercase tracking-widest">
                        <span>↑↓ {lang === 'en' ? 'navigate' : 'gezin'}</span>
                        <span>↵ {lang === 'en' ? 'open' : 'aç'}</span>
                        <span>ESC {lang === 'en' ? 'close' : 'kapat'}</span>
                        <span className="ml-auto">Ctrl+K</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;
