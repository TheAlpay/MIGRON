import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, Calculator, ClipboardList, FileText, Search } from 'lucide-react';
import { SITE_NAME } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';
import SearchModal from '../search/SearchModal';
import Logo from '../../assets/migron.webp';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const { t, toggleLanguage, lang } = useLanguage();
    const location = useLocation();
    const [toolsOpen, setToolsOpen] = useState(false);
    const [sosyalOpen, setSosyalOpen] = useState(false);
    const [egitimOpen, setEgitimOpen] = useState(false);
    const [programOpen, setProgramOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const toolsRef = useRef(null);
    const sosyalRef = useRef(null);
    const egitimRef = useRef(null);
    const programRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
            if (sosyalRef.current && !sosyalRef.current.contains(e.target)) setSosyalOpen(false);
            if (egitimRef.current && !egitimRef.current.contains(e.target)) setEgitimOpen(false);
            if (programRef.current && !programRef.current.contains(e.target)) setProgramOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Ctrl+K to open search
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(o => !o);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        setIsMenuOpen(false);
        setToolsOpen(false);
        setSosyalOpen(false);
        setEgitimOpen(false);
        setProgramOpen(false);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [location.pathname]);

    const isSosyalActive = ['/sosyal', '/ilk-48-saat', '/centrelink', '/maas-rehberi'].includes(location.pathname);
    const isEgitimActive = ['/egitim', '/sertifikalar', '/vergi-ve-super'].includes(location.pathname);
    const isProgramActive = ['/program-turleri', '/pr-yol-haritasi'].includes(location.pathname);

    const closeAll = () => { setToolsOpen(false); setSosyalOpen(false); setEgitimOpen(false); setProgramOpen(false); };

    return (
        <>
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10" aria-label="Ana navigasyon">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" aria-label="MIGRON Anasayfa">
                        <img src={Logo} alt={SITE_NAME} className="h-14 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.2em]">
                        {/* Static nav items */}
                        {[
                            { label: t('nav_home'), path: '/' },
                            { label: t('nav_legal'), path: '/hukuk' },
                        ].map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`hover:text-[#ccff00] transition-colors relative group ${location.pathname === item.path ? 'text-[#ccff00]' : ''}`}
                            >
                                {item.label}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ccff00] transition-all ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        ))}

                        {/* EĞİTİM dropdown */}
                        <div className="relative" ref={egitimRef}>
                            <button
                                onClick={() => { setEgitimOpen(o => !o); closeAll(); setEgitimOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors relative group ${isEgitimActive ? 'text-[#ccff00]' : ''}`}
                            >
                                {t('nav_education')}
                                <ChevronDown size={12} className={`transition-transform ${egitimOpen ? 'rotate-180' : ''}`} />
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ccff00] transition-all ${isEgitimActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </button>
                            {egitimOpen && (
                                <div className="absolute top-full left-0 bg-black border border-white/10 min-w-[220px] shadow-xl z-[100]">
                                    <Link to="/egitim" onClick={() => setEgitimOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] transition-colors border-b border-white/5">
                                        {lang === 'en' ? 'All Articles' : 'Tüm Makaleler'}
                                    </Link>
                                    <Link to="/sertifikalar" onClick={() => setEgitimOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors border-b border-white/5">
                                        {lang === 'en' ? 'Certificates' : 'Sertifikalar'}
                                    </Link>
                                    <Link to="/vergi-ve-super" onClick={() => setEgitimOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors">
                                        {lang === 'en' ? 'Tax & Super' : 'Vergi ve Super'}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* SOSYAL dropdown */}
                        <div className="relative" ref={sosyalRef}>
                            <button
                                onClick={() => { closeAll(); setSosyalOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors relative group ${isSosyalActive ? 'text-[#ccff00]' : ''}`}
                            >
                                {t('nav_social')}
                                <ChevronDown size={12} className={`transition-transform ${sosyalOpen ? 'rotate-180' : ''}`} />
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ccff00] transition-all ${isSosyalActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </button>
                            {sosyalOpen && (
                                <div className="absolute top-full left-0 bg-black border border-white/10 min-w-[220px] shadow-xl z-[100]">
                                    <Link to="/sosyal" onClick={() => setSosyalOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b] transition-colors border-b border-white/5">
                                        {lang === 'en' ? 'All Articles' : 'Tüm Makaleler'}
                                    </Link>
                                    <Link to="/ilk-48-saat" onClick={() => setSosyalOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors border-b border-white/5">
                                        {lang === 'en' ? 'First 48 Hours' : 'İlk 48 Saat'}
                                    </Link>
                                    <Link to="/maas-rehberi" onClick={() => setSosyalOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors border-b border-white/5">
                                        {lang === 'en' ? 'Salary Guide' : 'Maaş Rehberi'}
                                    </Link>
                                    <Link to="/centrelink" onClick={() => setSosyalOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors">
                                        Centrelink
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* PROGRAM TÜRLERİ dropdown */}
                        <div className="relative" ref={programRef}>
                            <button
                                onClick={() => { closeAll(); setProgramOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors relative group ${isProgramActive ? 'text-[#ccff00]' : ''}`}
                            >
                                {t('nav_program')}
                                <ChevronDown size={12} className={`transition-transform ${programOpen ? 'rotate-180' : ''}`} />
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ccff00] transition-all ${isProgramActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </button>
                            {programOpen && (
                                <div className="absolute top-full left-0 bg-black border border-white/10 min-w-[220px] shadow-xl z-[100]">
                                    <Link to="/program-turleri" onClick={() => setProgramOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#a78bfa]/10 hover:text-[#a78bfa] transition-colors border-b border-white/5">
                                        {lang === 'en' ? 'All Visa Programs' : 'Tüm Vize Programları'}
                                    </Link>
                                    <Link to="/pr-yol-haritasi" onClick={() => setProgramOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors">
                                        {lang === 'en' ? 'PR Roadmap' : 'PR Yol Haritası'}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {[
                            { label: t('nav_faq'), path: '/sss' },
                            { label: t('nav_contact'), path: '/iletisim' },
                        ].map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`hover:text-[#ccff00] transition-colors relative group ${location.pathname === item.path ? 'text-[#ccff00]' : ''}`}
                            >
                                {item.label}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ccff00] transition-all ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        ))}

                        {/* Araçlar dropdown */}
                        <div className="relative" ref={toolsRef}>
                            <button
                                onClick={() => { closeAll(); setToolsOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors ${toolsOpen ? 'text-[#ccff00]' : ''}`}
                            >
                                {t('nav_tools')} <ChevronDown size={12} className={`transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {toolsOpen && (
                                <div className="absolute top-full left-0 bg-black border border-white/10 min-w-[240px] shadow-xl z-[100]">
                                    <Link to="/puan-hesapla" onClick={() => setToolsOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors border-b border-white/5">
                                        <Calculator size={16} /> {t('nav_points_calc')}
                                    </Link>
                                    <Link to="/vize-kontrol-listesi" onClick={() => setToolsOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors border-b border-white/5">
                                        <ClipboardList size={16} /> {t('nav_visa_checklist')}
                                    </Link>
                                    <Link to="/belge-sablonlari" onClick={() => setToolsOpen(false)} className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors">
                                        <FileText size={16} /> {lang === 'en' ? 'Document Templates' : 'Belge Şablonları'}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Search button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-[#ccff00]/50 hover:text-[#ccff00] transition-all text-white/50"
                            aria-label={lang === 'en' ? 'Search (Ctrl+K)' : 'Ara (Ctrl+K)'}
                            title="Ctrl+K"
                        >
                            <Search size={13} />
                            <span className="text-[9px] font-mono text-white/25">Ctrl+K</span>
                        </button>

                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:border-[#ccff00] hover:text-[#ccff00] transition-all"
                            aria-label={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
                        >
                            <Globe size={14} />
                            <span>{t('lang_toggle')}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 text-white/50 hover:text-[#ccff00] transition-colors"
                            aria-label="Ara"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            onClick={toggleLanguage}
                            className="p-2 text-[#ccff00]"
                            aria-label={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
                        >
                            <Globe size={20} />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-[#ccff00]"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div
                    id="mobile-menu"
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl pt-24 px-8 lg:hidden overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobil menü"
                >
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-6 right-6 p-2 text-[#ccff00]"
                        aria-label="Menüyü kapat"
                    >
                        <X size={28} />
                    </button>
                    <nav className="flex flex-col gap-4" aria-label="Mobil navigasyon">
                        {[
                            { label: t('nav_home'), path: '/' },
                            { label: t('nav_legal'), path: '/hukuk' },
                        ].map(item => (
                            <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className={`text-2xl font-black uppercase tracking-tight ${location.pathname === item.path ? 'text-[#ccff00]' : 'text-white/70 hover:text-white'} transition-colors`}>
                                {item.label}
                            </Link>
                        ))}

                        {/* EĞİTİM group */}
                        <div className="border-t border-white/5 pt-4">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">{t('nav_education')}</p>
                            <div className="flex flex-col gap-3 pl-2">
                                <Link to="/egitim" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-white transition-colors">{lang === 'en' ? 'All Articles' : 'Tüm Makaleler'}</Link>
                                <Link to="/sertifikalar" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">{lang === 'en' ? 'Certificates' : 'Sertifikalar'}</Link>
                                <Link to="/vergi-ve-super" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">{lang === 'en' ? 'Tax & Super' : 'Vergi ve Super'}</Link>
                            </div>
                        </div>

                        {/* SOSYAL group */}
                        <div className="border-t border-white/5 pt-4">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">{t('nav_social')}</p>
                            <div className="flex flex-col gap-3 pl-2">
                                <Link to="/sosyal" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-white transition-colors">{lang === 'en' ? 'All Articles' : 'Tüm Makaleler'}</Link>
                                <Link to="/ilk-48-saat" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">{lang === 'en' ? 'First 48 Hours' : 'İlk 48 Saat'}</Link>
                                <Link to="/maas-rehberi" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">{lang === 'en' ? 'Salary Guide' : 'Maaş Rehberi'}</Link>
                                <Link to="/centrelink" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">Centrelink</Link>
                            </div>
                        </div>

                        {/* PROGRAM TÜRLERİ group */}
                        <div className="border-t border-white/5 pt-4">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">{t('nav_program')}</p>
                            <div className="flex flex-col gap-3 pl-2">
                                <Link to="/program-turleri" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-white transition-colors">{lang === 'en' ? 'All Visa Programs' : 'Tüm Vize Programları'}</Link>
                                <Link to="/pr-yol-haritasi" onClick={() => setIsMenuOpen(false)} className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">{lang === 'en' ? 'PR Roadmap' : 'PR Yol Haritası'}</Link>
                            </div>
                        </div>

                        {[
                            { label: t('nav_faq'), path: '/sss' },
                            { label: t('nav_contact'), path: '/iletisim' },
                        ].map(item => (
                            <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className={`text-2xl font-black uppercase tracking-tight ${location.pathname === item.path ? 'text-[#ccff00]' : 'text-white/70 hover:text-white'} transition-colors`}>
                                {item.label}
                            </Link>
                        ))}

                        <div className="border-t border-white/10 pt-4 mt-2">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">{t('nav_tools')}</p>
                            <Link to="/puan-hesapla" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors mb-4">
                                <Calculator size={20} /> {t('nav_points_calc')}
                            </Link>
                            <Link to="/vize-kontrol-listesi" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors mb-4">
                                <ClipboardList size={20} /> {t('nav_visa_checklist')}
                            </Link>
                            <Link to="/belge-sablonlari" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">
                                <FileText size={20} /> {lang === 'en' ? 'Document Templates' : 'Belge Şablonları'}
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
