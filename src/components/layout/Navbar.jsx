import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scale, Globe } from 'lucide-react';
import { SITE_NAME } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const { t, toggleLanguage, lang } = useLanguage();
    const location = useLocation();

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
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
                        >
                            <Globe size={14} />
                            <span>{t('lang_toggle')}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 text-[#ccff00]"
                        >
                            <Globe size={20} />
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-[#ccff00]">
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-8 lg:hidden">
                    <div className="flex flex-col gap-6">
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
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
