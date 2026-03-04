import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, Calculator, ClipboardList } from 'lucide-react';
import { SITE_NAME } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';
import Logo from '../../assets/migron.webp';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const { t, toggleLanguage, lang } = useLanguage();
    const location = useLocation();
    const [toolsOpen, setToolsOpen] = useState(false);
    const toolsRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const navItems = [
        { label: t('nav_home'), path: '/' },
        { label: t('nav_legal'), path: '/hukuk' },
        { label: t('nav_education'), path: '/egitim' },
        { label: t('nav_social'), path: '/sosyal' },
        { label: t('nav_program'), path: '/program-turleri' },
        { label: t('nav_faq'), path: '/sss' },
        { label: t('nav_contact'), path: '/iletisim' },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10" aria-label="Ana navigasyon">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" aria-label="MIGRON Anasayfa">
                        <img src={Logo} alt={SITE_NAME} className="h-14 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.2em]">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`hover:text-[#ccff00] transition-colors relative group ${location.pathname === item.path ? 'text-[#ccff00]' : ''}`}
                            >
                                {item.label}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ccff00] transition-all ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        ))}

                        {/* Araçlar dropdown — click based */}
                        <div className="relative" ref={toolsRef}>
                            <button
                                onClick={() => setToolsOpen(o => !o)}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors ${toolsOpen ? 'text-[#ccff00]' : ''}`}
                            >
                                {t('nav_tools')} <ChevronDown size={12} className={`transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {toolsOpen && (
                                <div className="absolute top-full left-0 bg-black border border-white/10 min-w-[220px] shadow-xl z-[100]">
                                    <Link
                                        to="/puan-hesapla"
                                        onClick={() => setToolsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors border-b border-white/5"
                                    >
                                        <Calculator size={16} /> {t('nav_points_calc')}
                                    </Link>
                                    <Link
                                        to="/vize-kontrol-listesi"
                                        onClick={() => setToolsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-4 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors"
                                    >
                                        <ClipboardList size={16} /> {t('nav_visa_checklist')}
                                    </Link>
                                </div>
                            )}
                        </div>

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
                    {/* Close button at top right */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-6 right-6 p-2 text-[#ccff00]"
                        aria-label="Menüyü kapat"
                    >
                        <X size={28} />
                    </button>
                    <nav className="flex flex-col gap-6" aria-label="Mobil navigasyon">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-2xl font-black uppercase tracking-tight ${location.pathname === item.path ? 'text-[#ccff00]' : 'text-white/70 hover:text-white'} transition-colors`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="border-t border-white/10 pt-6 mt-2">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">{t('nav_tools')}</p>
                            <Link to="/puan-hesapla" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors mb-4">
                                <Calculator size={20} /> {t('nav_points_calc')}
                            </Link>
                            <Link to="/vize-kontrol-listesi" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-black uppercase text-white/70 hover:text-[#ccff00] transition-colors">
                                <ClipboardList size={20} /> {t('nav_visa_checklist')}
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
