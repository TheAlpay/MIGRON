import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, BookOpen, Users, Briefcase, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SITE_EMAIL } from '../../config/constants';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';

const pageConfig = {
    hukuk: { icon: Scale, accent: '#ccff00', titleKey: 'page_legal_title', subtitleKey: 'page_legal_subtitle', descKey: 'page_legal_desc', category: 'hukuk' },
    egitim: { icon: BookOpen, accent: '#00d4ff', titleKey: 'page_education_title', subtitleKey: 'page_education_subtitle', descKey: 'page_education_desc', category: 'egitim' },
    sosyal: { icon: Users, accent: '#ff6b6b', titleKey: 'page_social_title', subtitleKey: 'page_social_subtitle', descKey: 'page_social_desc', category: 'sosyal' },
    projeler: { icon: Briefcase, accent: '#a78bfa', titleKey: 'page_projects_title', subtitleKey: 'page_projects_subtitle', descKey: 'page_projects_desc', category: 'projeler' },
    iletisim: { icon: Mail, accent: '#ccff00', titleKey: 'page_contact_title', subtitleKey: 'page_contact_subtitle', descKey: 'page_contact_desc', category: null },
};

const SubPage = ({ pageId }) => {
    const { t, lang } = useLanguage();
    const config = pageConfig[pageId];
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!config?.category) {
            setLoading(false);
            return;
        }

        const fetchArticles = async () => {
            try {
                // Simple query without orderBy to avoid needing a composite index
                const q = query(
                    collection(db, 'articles'),
                    where('category', '==', config.category),
                    where('status', '==', 'published')
                );
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort client-side by createdAt descending
                fetched.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(0);
                    const dateB = b.createdAt?.toDate?.() || new Date(0);
                    return dateB - dateA;
                });
                setArticles(fetched);
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
            setLoading(false);
        };
        fetchArticles();
    }, [config?.category]);

    if (!config) return null;

    const IconComponent = config.icon;

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <>
            <SEOHead
                title={t(config.titleKey)}
                description={t(config.descKey)}
                path={`/${pageId}`}
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                {/* Hero Section - Radical Compact */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> {t('page_back_home')}
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                {t(config.subtitleKey)}
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5" style={{ backgroundColor: config.accent }}>
                                    <IconComponent className="text-black" size={28} strokeWidth={3} />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic" style={{ color: config.accent }}>
                                    {t(config.titleKey)}
                                </h1>
                            </div>

                            <div className="max-w-xl">
                                <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                                    {t(config.descKey)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="max-w-[1200px] mx-auto px-6 py-8">

                    {pageId === 'iletisim' ? (
                        <div className="bg-[#111] border border-white/5 p-12">
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: config.accent }}>
                                {t('page_email_label')}
                            </h3>
                            <a href={`mailto:${SITE_EMAIL}`} className="text-2xl font-black italic tracking-tight underline decoration-[#ccff00] hover:text-[#ccff00] transition-colors">
                                {SITE_EMAIL}
                            </a>
                        </div>
                    ) : (
                        <>
                            {loading ? (
                                <div className="text-center text-white/40 py-12 animate-pulse">Yükleniyor...</div>
                            ) : articles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {articles.map(article => (
                                        <Link
                                            key={article.id}
                                            to={`/makale/${article.slug}`}
                                            className="bg-[#111] border border-white/5 p-8 hover:border-[#ccff00]/30 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: `${config.accent}20`, color: config.accent }}>
                                                    {article.category}
                                                </span>
                                                {article.createdAt && (
                                                    <span className="flex items-center gap-1 text-white/20 text-[10px]">
                                                        <Clock size={10} /> {formatDate(article.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[#ccff00] transition-colors mb-3">
                                                {article.title}
                                            </h3>
                                            {article.excerpt && (
                                                <p className="text-sm text-white/40">{article.excerpt}</p>
                                            )}
                                            <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: config.accent }}>
                                                Devamını Oku <ArrowUpRight size={14} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#111] border border-white/5 p-12 text-center">
                                    <p className="text-white/30 uppercase text-sm font-bold tracking-widest">
                                        {t('page_coming_soon')}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </>
    );
};

export default SubPage;
