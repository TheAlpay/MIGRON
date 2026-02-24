import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale, Globe } from 'lucide-react';
import { SITE_NAME } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const { t, toggleLanguage, lang } = useLanguage();
    const location = useLocation();

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
        { label: t('nav_projects'), path: '/projeler' },
        { label: t('nav_contact'), path: '/iletisim' },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10" aria-label="Ana navigasyon">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="MIGRON Anasayfa">
                        <div className="bg-[#ccff00] p-1">
                            <Scale className="text-black" size={24} strokeWidth={3} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase italic">
                            {SITE_NAME}
                        </span>
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
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
