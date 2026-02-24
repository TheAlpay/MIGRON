import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, BookOpen, Users, Briefcase, Mail } from 'lucide-react';
import { SITE_EMAIL } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';

const pageConfig = {
    hukuk: { icon: Scale, accent: '#ccff00', titleKey: 'page_legal_title', subtitleKey: 'page_legal_subtitle', descKey: 'page_legal_desc' },
    egitim: { icon: BookOpen, accent: '#00d4ff', titleKey: 'page_education_title', subtitleKey: 'page_education_subtitle', descKey: 'page_education_desc' },
    sosyal: { icon: Users, accent: '#ff6b6b', titleKey: 'page_social_title', subtitleKey: 'page_social_subtitle', descKey: 'page_social_desc' },
    projeler: { icon: Briefcase, accent: '#a78bfa', titleKey: 'page_projects_title', subtitleKey: 'page_projects_subtitle', descKey: 'page_projects_desc' },
    iletisim: { icon: Mail, accent: '#ccff00', titleKey: 'page_contact_title', subtitleKey: 'page_contact_subtitle', descKey: 'page_contact_desc' },
};

const SubPage = ({ pageId }) => {
    const { t } = useLanguage();
    const config = pageConfig[pageId];

    if (!config) return null;

    const IconComponent = config.icon;

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
            {/* Hero Section */}
            <section className="relative py-32 px-6 border-b border-white/10">
                <div className="max-w-[1200px] mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-sm font-bold uppercase tracking-widest mb-12">
                        <ArrowLeft size={16} /> {t('page_back_home')}
                    </Link>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3" style={{ backgroundColor: config.accent }}>
                            <IconComponent className="text-black" size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic" style={{ color: config.accent }}>
                                {t(config.titleKey)}
                            </h1>
                        </div>
                    </div>

                    <p className="text-sm text-white/40 uppercase font-bold tracking-widest">
                        {t(config.subtitleKey)}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-[1200px] mx-auto px-6 py-24">
                <div className="bg-[#111] border border-white/5 p-12">
                    <p className="text-xl text-white/60 leading-relaxed mb-12">
                        {t(config.descKey)}
                    </p>

                    {pageId === 'iletisim' ? (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: config.accent }}>
                                    {t('page_email_label')}
                                </h3>
                                <a href={`mailto:${SITE_EMAIL}`} className="text-2xl font-black italic tracking-tight underline decoration-[#ccff00] hover:text-[#ccff00] transition-colors">
                                    {SITE_EMAIL}
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="border-t border-white/10 pt-8">
                            <p className="text-white/30 uppercase text-sm font-bold tracking-widest">
                                {t('page_coming_soon')}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SubPage;
