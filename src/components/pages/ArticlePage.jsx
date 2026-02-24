import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ArticlePage = () => {
    const { slug } = useParams();
    const { t, lang } = useLanguage();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const q = query(
                    collection(db, 'articles'),
                    where('slug', '==', slug),
                    where('status', '==', 'published')
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setArticle({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                }
            } catch (err) {
                console.error('Error fetching article:', err);
            }
            setLoading(false);
        };
        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-32 flex items-center justify-center">
                <div className="text-[#ccff00] animate-pulse font-bold tracking-widest">YÜKLENİYOR...</div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-32 px-6">
                <div className="max-w-[800px] mx-auto text-center">
                    <h1 className="text-4xl font-black mb-4">Makale Bulunamadı</h1>
                    <Link to="/" className="text-[#ccff00] hover:underline">{t('page_back_home')}</Link>
                </div>
            </div>
        );
    }

    const categoryPaths = { hukuk: '/hukuk', egitim: '/egitim', sosyal: '/sosyal', projeler: '/projeler' };
    const categoryLabels = { hukuk: 'Hukuk Sistemi', egitim: 'Eğitim', sosyal: 'Sosyal', projeler: 'Projeler' };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
            <article className="max-w-[800px] mx-auto px-6 py-16">
                <Link to={categoryPaths[article.category] || '/'} className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-sm font-bold uppercase tracking-widest mb-8">
                    <ArrowLeft size={16} /> {categoryLabels[article.category] || t('page_back_home')}
                </Link>

                <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-widest">
                        {categoryLabels[article.category]}
                    </span>
                    {article.createdAt && (
                        <span className="flex items-center gap-1 text-white/30 text-xs">
                            <Clock size={12} /> {formatDate(article.createdAt)}
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-tight mb-6">
                    {article.title}
                </h1>

                {article.excerpt && (
                    <p className="text-lg text-white/50 border-l-4 border-[#ccff00] pl-6 mb-12 font-medium">
                        {article.excerpt}
                    </p>
                )}

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[#ccff00] prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#ccff00] prose-strong:text-white prose-blockquote:border-[#ccff00] prose-code:text-[#ccff00]">
                    <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
                </div>
            </article>
        </div>
    );
};

export default ArticlePage;
