import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Globe, ChevronDown,
  Calculator, ClipboardList, FileText, Search,
  Briefcase, DollarSign, MapPin, Clock, TrendingUp, PiggyBank,
} from 'lucide-react';
import { SITE_NAME } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';
import SearchModal from '../search/SearchModal';
import Logo from '../../assets/migron.webp';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const { t, toggleLanguage, lang } = useLanguage();
    const location = useLocation();
    const [toolsOpen,   setToolsOpen]   = useState(false);
    const [visaOpen,    setVisaOpen]    = useState(false);
    const [settleOpen,  setSettleOpen]  = useState(false);
    const [resourceOpen,setResourceOpen]= useState(false);
    const [searchOpen,  setSearchOpen]  = useState(false);
    const toolsRef    = useRef(null);
    const visaRef     = useRef(null);
    const settleRef   = useRef(null);
    const resourceRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (toolsRef.current    && !toolsRef.current.contains(e.target))    setToolsOpen(false);
            if (visaRef.current     && !visaRef.current.contains(e.target))     setVisaOpen(false);
            if (settleRef.current   && !settleRef.current.contains(e.target))   setSettleOpen(false);
            if (resourceRef.current && !resourceRef.current.contains(e.target)) setResourceOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
        setToolsOpen(false);
        setVisaOpen(false);
        setSettleOpen(false);
        setResourceOpen(false);
    }, [location.pathname]);

    const closeAll = () => {
        setToolsOpen(false);
        setVisaOpen(false);
        setSettleOpen(false);
        setResourceOpen(false);
    };

    const isToolsActive   = ['/occupation', '/salary-calculator', '/points-calculator', '/puan-hesapla', '/visa-checklist', '/vize-kontrol-listesi', '/belge-sablonlari', '/tax-calculator', '/super-calculator'].includes(location.pathname);
    const isVisaActive    = ['/visa', '/program-turleri', '/pr-yol-haritasi'].some(p => location.pathname.startsWith(p));
    const isSettleActive  = ['/sosyal', '/centrelink', '/traffic'].includes(location.pathname);
    const isResourceActive= ['/hukuk', '/egitim', '/sertifikalar', '/vergi-ve-super'].includes(location.pathname);

    const DropItem = ({ to, icon, label, onClick }) => (
        <Link to={to} onClick={onClick}
            className="flex items-center gap-3 px-4 py-3.5 text-[11px] font-bold tracking-wider hover:bg-[#ccff00]/10 hover:text-[#ccff00] transition-colors border-b border-white/5 last:border-0">
            {icon && React.cloneElement(icon, { size: 14, className: 'text-[#ccff00]/70 flex-shrink-0' })}
            {label}
        </Link>
    );

    return (
        <>
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10" aria-label="Main navigation">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" aria-label="MIGRON Home">
                        <img src={Logo} alt={SITE_NAME} className="h-14 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em]">

                        {/* TOOLS dropdown */}
                        <div className="relative" ref={toolsRef}>
                            <button onClick={() => { closeAll(); setToolsOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors ${isToolsActive || toolsOpen ? 'text-[#ccff00]' : ''}`}>
                                TOOLS <ChevronDown size={12} className={`transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {toolsOpen && (
                                <div className="absolute top-full left-0 bg-[#0a0a0a] border border-white/10 min-w-[260px] shadow-2xl z-[100]">
                                    <DropItem to="/occupation"        icon={<Briefcase/>}     label="Occupation Checker"   onClick={() => setToolsOpen(false)} />
                                    <DropItem to="/salary-calculator" icon={<DollarSign/>}    label="Salary Calculator"    onClick={() => setToolsOpen(false)} />
                                    <DropItem to="/tax-calculator"    icon={<TrendingUp/>}    label="Tax Calculator"       onClick={() => setToolsOpen(false)} />
                                    <DropItem to="/super-calculator"  icon={<PiggyBank/>}     label="Super Calculator"     onClick={() => setToolsOpen(false)} />
                                    <DropItem to="/points-calculator" icon={<Calculator/>}    label="Points Calculator"    onClick={() => setToolsOpen(false)} />
                                    <DropItem to="/visa-checklist"    icon={<ClipboardList/>} label="Visa Checklist"       onClick={() => setToolsOpen(false)} />
                                    <DropItem to="/suburb"            icon={<MapPin/>}        label="Suburb Explorer"      onClick={() => setToolsOpen(false)} />
                                    <DropItem to="/belge-sablonlari"  icon={<FileText/>}      label="Document Templates"   onClick={() => setToolsOpen(false)} />
                                </div>
                            )}
                        </div>

                        {/* VISA PROGRAMS dropdown */}
                        <div className="relative" ref={visaRef}>
                            <button onClick={() => { closeAll(); setVisaOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors ${isVisaActive || visaOpen ? 'text-[#ccff00]' : ''}`}>
                                VISA PROGRAMS <ChevronDown size={12} className={`transition-transform ${visaOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {visaOpen && (
                                <div className="absolute top-full left-0 bg-[#0a0a0a] border border-white/10 min-w-[240px] shadow-2xl z-[100]">
                                    <DropItem to="/visa"           label="All Visa Subclasses"  onClick={() => setVisaOpen(false)} />
                                    <DropItem to="/visa/189"       label="Subclass 189 — Skilled Independent" onClick={() => setVisaOpen(false)} />
                                    <DropItem to="/visa/190"       label="Subclass 190 — Skilled Nominated"   onClick={() => setVisaOpen(false)} />
                                    <DropItem to="/visa/491"       label="Subclass 491 — Regional"            onClick={() => setVisaOpen(false)} />
                                    <DropItem to="/visa/482"       label="Subclass 482 — TSS"                 onClick={() => setVisaOpen(false)} />
                                    <DropItem to="/program-turleri"  label="Program Overview"   onClick={() => setVisaOpen(false)} />
                                    <DropItem to="/pr-yol-haritasi"  label="PR Roadmap"         onClick={() => setVisaOpen(false)} />
                                    <DropItem to="/processing-times" label="Processing Times"   icon={<Clock/>} onClick={() => setVisaOpen(false)} />
                                </div>
                            )}
                        </div>

                        {/* SETTLEMENT dropdown */}
                        <div className="relative" ref={settleRef}>
                            <button onClick={() => { closeAll(); setSettleOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors ${isSettleActive || settleOpen ? 'text-[#ccff00]' : ''}`}>
                                SETTLEMENT <ChevronDown size={12} className={`transition-transform ${settleOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {settleOpen && (
                                <div className="absolute top-full left-0 bg-[#0a0a0a] border border-white/10 min-w-[220px] shadow-2xl z-[100]">
                                    <DropItem to="/sosyal"    icon={<MapPin/>} label="Settlement Guide"  onClick={() => setSettleOpen(false)} />
                                    <DropItem to="/centrelink"               label="Centrelink Guide"   onClick={() => setSettleOpen(false)} />
                                    <DropItem to="/vergi-ve-super"           label="Tax & Super"        onClick={() => setSettleOpen(false)} />
                                    <DropItem to="/traffic"                  label="Live Traffic"       onClick={() => setSettleOpen(false)} />
                                </div>
                            )}
                        </div>

                        {/* RESOURCES dropdown */}
                        <div className="relative" ref={resourceRef}>
                            <button onClick={() => { closeAll(); setResourceOpen(o => !o); }}
                                className={`flex items-center gap-1 hover:text-[#ccff00] transition-colors ${isResourceActive || resourceOpen ? 'text-[#ccff00]' : ''}`}>
                                RESOURCES <ChevronDown size={12} className={`transition-transform ${resourceOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {resourceOpen && (
                                <div className="absolute top-full left-0 bg-[#0a0a0a] border border-white/10 min-w-[220px] shadow-2xl z-[100]">
                                    <DropItem to="/hukuk"        label="Legal System"    onClick={() => setResourceOpen(false)} />
                                    <DropItem to="/egitim"       label="Education"       onClick={() => setResourceOpen(false)} />
                                    <DropItem to="/sertifikalar" label="Certificates"    onClick={() => setResourceOpen(false)} />
                                    <DropItem to="/vergi-ve-super" label="Tax & Super"   onClick={() => setResourceOpen(false)} />
                                </div>
                            )}
                        </div>

                        {/* Static links */}
                        {[
                            { label: 'FAQ',     path: '/sss'      },
                            { label: 'CONTACT', path: '/iletisim' },
                        ].map(item => (
                            <Link key={item.path} to={item.path}
                                className={`hover:text-[#ccff00] transition-colors relative group ${location.pathname === item.path ? 'text-[#ccff00]' : ''}`}>
                                {item.label}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ccff00] transition-all ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </Link>
                        ))}

                        {/* Search */}
                        <button onClick={() => setSearchOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-[#ccff00]/50 hover:text-[#ccff00] transition-all text-white/50"
                            aria-label="Search (Ctrl+K)" title="Ctrl+K">
                            <Search size={13} />
                            <span className="text-[9px] font-mono text-white/25">Ctrl+K</span>
                        </button>

                        {/* Language toggle */}
                        <button onClick={toggleLanguage}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:border-[#ccff00] hover:text-[#ccff00] transition-all"
                            aria-label={lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'}>
                            <Globe size={14} />
                            <span>{t('lang_toggle')}</span>
                        </button>
                    </div>

                    {/* Mobile header */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button onClick={() => setSearchOpen(true)} className="p-2 text-white/50 hover:text-[#ccff00] transition-colors" aria-label="Search">
                            <Search size={20} />
                        </button>
                        <button onClick={toggleLanguage} className="p-2 text-[#ccff00]" aria-label="Toggle language">
                            <Globe size={20} />
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-[#ccff00]"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div id="mobile-menu"
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl pt-24 px-8 lg:hidden overflow-y-auto"
                    role="dialog" aria-modal="true" aria-label="Mobile navigation">
                    <button onClick={() => setIsMenuOpen(false)}
                        className="absolute top-6 right-6 p-2 text-[#ccff00]" aria-label="Close menu">
                        <X size={28} />
                    </button>

                    <nav className="flex flex-col gap-1 pb-16" aria-label="Mobile navigation">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-black uppercase tracking-tight text-white/70 hover:text-white py-3 transition-colors">
                            HOME
                        </Link>

                        {/* TOOLS section */}
                        <div className="border-t border-white/5 pt-4 mt-2">
                            <p className="text-[9px] font-black text-[#ccff00]/50 uppercase tracking-[0.3em] mb-3">Tools</p>
                            <div className="flex flex-col gap-1 pl-2">
                                {[
                                    { label: 'Occupation Checker',  path: '/occupation'        },
                                    { label: 'Salary Calculator',   path: '/salary-calculator' },
                                    { label: 'Tax Calculator',      path: '/tax-calculator'    },
                                    { label: 'Super Calculator',    path: '/super-calculator'  },
                                    { label: 'Points Calculator',   path: '/points-calculator' },
                                    { label: 'Visa Checklist',      path: '/visa-checklist'    },
                                    { label: 'Suburb Explorer',     path: '/suburb'            },
                                    { label: 'Document Templates',  path: '/belge-sablonlari'  },
                                ].map(({ label, path }) => (
                                    <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] py-2 transition-colors">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* VISA PROGRAMS section */}
                        <div className="border-t border-white/5 pt-4 mt-2">
                            <p className="text-[9px] font-black text-[#ccff00]/50 uppercase tracking-[0.3em] mb-3">Visa Programs</p>
                            <div className="flex flex-col gap-1 pl-2">
                                {[
                                    { label: 'All Visa Subclasses', path: '/visa'              },
                                    { label: 'Visa 189 — Skilled Independent', path: '/visa/189' },
                                    { label: 'Visa 190 — Skilled Nominated',   path: '/visa/190' },
                                    { label: 'Visa 491 — Regional',             path: '/visa/491' },
                                    { label: 'Visa 482 — TSS',                  path: '/visa/482' },
                                    { label: 'Program Overview', path: '/program-turleri'       },
                                    { label: 'PR Roadmap',       path: '/pr-yol-haritasi'       },
                                ].map(({ label, path }) => (
                                    <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}
                                        className="text-base font-black uppercase text-white/70 hover:text-[#ccff00] py-1.5 transition-colors">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* SETTLEMENT section */}
                        <div className="border-t border-white/5 pt-4 mt-2">
                            <p className="text-[9px] font-black text-[#ccff00]/50 uppercase tracking-[0.3em] mb-3">Settlement</p>
                            <div className="flex flex-col gap-1 pl-2">
                                {[
                                    { label: 'Settlement Guide', path: '/sosyal'        },
                                    { label: 'Centrelink Guide', path: '/centrelink'    },
                                    { label: 'Tax & Super',      path: '/vergi-ve-super'},
                                    { label: 'Live Traffic',     path: '/traffic'       },
                                ].map(({ label, path }) => (
                                    <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] py-2 transition-colors">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* RESOURCES section */}
                        <div className="border-t border-white/5 pt-4 mt-2">
                            <p className="text-[9px] font-black text-[#ccff00]/50 uppercase tracking-[0.3em] mb-3">Resources</p>
                            <div className="flex flex-col gap-1 pl-2">
                                {[
                                    { label: 'Legal System',  path: '/hukuk'         },
                                    { label: 'Education',     path: '/egitim'        },
                                    { label: 'Certificates',  path: '/sertifikalar'  },
                                    { label: 'Tax & Super',   path: '/vergi-ve-super'},
                                ].map(({ label, path }) => (
                                    <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-black uppercase text-white/70 hover:text-[#ccff00] py-2 transition-colors">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Static links */}
                        {[
                            { label: 'FAQ',     path: '/sss'      },
                            { label: 'CONTACT', path: '/iletisim' },
                        ].map(({ label, path }) => (
                            <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}
                                className="text-2xl font-black uppercase tracking-tight text-white/70 hover:text-white py-3 border-t border-white/5 mt-2 transition-colors">
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
};

export default Navbar;
