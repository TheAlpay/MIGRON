import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, ArrowUpRight, Clock } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLanguage } from '../../i18n/LanguageContext';

const BentoGrid = () => {
    const { t } = useLanguage();
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const q = query(
                    collection(db, 'articles'),
                    where('status', '==', 'published')
                );
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort by createdAt descending, limit to 20
                fetched.sort((a, b) => {
                    const dateA = a.createdAt?.toDate?.() || new Date(0);
                    const dateB = b.createdAt?.toDate?.() || new Date(0);
                    return dateB - dateA;
                });
                setArticles(fetched.slice(0, 20));
            } catch (err) {
                console.error('Error fetching articles:', err);
            }
        };
        fetchArticles();
    }, []);

    const categoryColors = {
        hukuk: '#ccff00',
        egitim: '#00d4ff',
        sosyal: '#ff6b6b',
        projeler: '#a78bfa',
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (hours < 1) return 'Az önce';
        if (hours < 24) return `${hours}s önce`;
        if (days < 7) return `${days}g önce`;
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    return (
        <section className="max-w-[1600px] mx-auto px-6 py-24">
            <div className="flex items-end justify-between mb-16">
                <div>
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-[#ccff00] uppercase mb-4">{t('section_flow')}</h3>
                    <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{t('section_analyses')}</h4>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-loose">
                        {t('data_source')}<br />
                        {t('data_update')}: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Bento Item 1 - Hukuki Risk Analizi (NOT clickable) */}
                <div className="md:col-span-2 md:row-span-2 bg-[#111] p-10 border border-white/5 flex flex-col justify-between min-h-[400px]">
                    <div>
                        <div className="flex justify-between items-start mb-12">
                            <Shield className="text-[#ccff00]" size={40} />
                            <span className="text-[10px] font-bold text-white/40">{t('safe_data')}</span>
                        </div>
                        <h5 className="text-3xl font-black uppercase leading-tight italic">{t('bento_title')}</h5>
                    </div>
                    <div className="mt-8">
                        <p className="text-sm text-white/40 max-w-[250px] uppercase font-bold tracking-tight">{t('bento_desc')}</p>
                    </div>
                </div>

                {/* Bento Item 2 - Australia Status (NOT clickable) */}
                <div className="md:col-span-2 bg-[#ccff00] text-black p-10 flex flex-col justify-center relative overflow-hidden">
                    <Zap className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12" />
                    <h5 className="text-4xl font-black italic tracking-tighter uppercase mb-4">{t('australia')}</h5>
                    <div className="flex gap-8 mt-4">
                        <div>
                            <div className="text-2xl font-black">%98</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest">{t('data_accuracy')}</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black">7/24</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest">{t('legal_tracking')}</div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Article Blocks from Firestore */}
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <Link
                            to={`/makale/${article.slug}`}
                            key={article.id}
                            className="bg-[#111] p-8 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
                        >
                            <div className="flex justify-between text-[10px] font-bold text-white/40 mb-8 uppercase tracking-widest">
                                <span style={{ color: categoryColors[article.category] || '#ccff00' }}>
                                    {article.category}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatDate(article.createdAt)}
                                </span>
                            </div>
                            <h6 className="text-xl font-black uppercase leading-none group-hover:text-[#ccff00] transition-colors">
                                {article.title}
                            </h6>
                        </Link>
                    ))
                ) : (
                    <div className="md:col-span-2 bg-[#111] p-8 border border-white/5 flex items-center justify-center">
                        <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
                            {t('page_coming_soon')}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BentoGrid;
