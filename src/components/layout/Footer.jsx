import React from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { SITE_NAME, SITE_EMAIL } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    const footerLinks = [
        { label: t('footer_nav_legal'), path: '/hukuk' },
        { label: t('footer_nav_australia'), path: '/hukuk' },
        { label: t('footer_nav_data'), path: '/projeler' },
    ];

    return (
        <footer className="bg-black border-t-8 border-[#ccff00] py-24 px-6">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    <div className="md:col-span-5">
                        <Link to="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
                            <div className="bg-[#ccff00] w-8 h-8 flex items-center justify-center">
                                <Scale size={18} className="text-black" />
                            </div>
                            <span className="font-black text-4xl tracking-tighter italic uppercase">{SITE_NAME}</span>
                        </Link>
                        <p className="text-lg text-white/40 uppercase font-black tracking-tight leading-tight">
                            {t('footer_tagline')}
                        </p>
                    </div>
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h5 className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.3em] mb-6">{t('footer_nav')}</h5>
                            <ul className="space-y-4 text-xs font-bold text-white/60">
                                {footerLinks.map(item => (
                                    <li key={item.label}>
                                        <Link to={item.path} className="hover:text-white transition-colors tracking-widest">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.3em] mb-6">{t('footer_legal_title')}</h5>
                            <p className="text-[9px] text-white/30 uppercase leading-relaxed font-bold tracking-tight">
                                {t('footer_legal_text')}
                            </p>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.3em] mb-6">{t('footer_contact')}</h5>
                            <a href={`mailto:${SITE_EMAIL}`} className="text-xs font-black italic tracking-widest underline decoration-[#ccff00] hover:text-[#ccff00] transition-colors">
                                {SITE_EMAIL}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-[0.5em] text-white/20 uppercase">
                    <span>© {new Date().getFullYear()} MIGRON SUBSIDIARY</span>
                    <span className="mt-4 md:mt-0 italic">{t('footer_slogan')}</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
