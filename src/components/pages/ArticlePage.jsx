import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ArrowLeft, Clock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEOHead from '../seo/SEOHead';

// Custom markdown renderers — no @tailwindcss/typography needed
const MD_COMPONENTS = {
    h1: ({ children }) => (
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-6 mt-10 leading-tight">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-xl font-black uppercase tracking-tight text-[#ccff00] mt-10 mb-4 leading-snug">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-base font-black uppercase tracking-tight text-white/80 mt-8 mb-3">
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="text-white/70 font-medium leading-relaxed mb-4 text-base">
            {children}
        </p>
    ),
    hr: () => <hr className="border-white/10 my-8" />,
    strong: ({ children }) => (
        <strong className="text-white font-black">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="text-white/50 italic">{children}</em>
    ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-[#ccff00] pl-5 py-1 my-6 text-white/50 italic">
            {children}
        </blockquote>
    ),
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ccff00] underline underline-offset-2 hover:text-white transition-colors"
        >
            {children}
        </a>
    ),
    ul: ({ children }) => (
        <ul className="list-disc list-inside space-y-1 mb-4 text-white/70 text-base">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-inside space-y-1 mb-4 text-white/70 text-base">
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li className="leading-relaxed">{children}</li>
    ),
    code: ({ inline, children }) =>
        inline ? (
            <code className="text-[#ccff00] bg-white/5 px-1.5 py-0.5 text-sm font-mono rounded">
                {children}
            </code>
        ) : (
            <pre className="bg-white/5 border border-white/10 rounded p-4 my-6 overflow-x-auto">
                <code className="text-[#ccff00] text-sm font-mono">{children}</code>
            </pre>
        ),
    img: ({ src, alt }) => (
        <img
            src={src}
            alt={alt}
            className="w-full my-6 object-cover"
            onError={(e) => e.target.style.display = 'none'}
        />
    ),
};

const ArticlePage = () => {
    const { slug } = useParams();
    const { t } = useLanguage();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const normalizeSlug = (s) =>
            s.toLowerCase()
             .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
             .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
             .replace(/[^a-z0-9\s-]/g, '')
             .replace(/\s+/g, '-')
             .replace(/-+/g, '-')
             .trim();

        const fetchArticle = async () => {
            try {
                // Try exact slug match first, then normalized slug
                const slugsToTry = [...new Set([slug, normalizeSlug(slug)])];
                let found = null;

                for (const s of slugsToTry) {
                    // Try published first, then any status
                    const queries = [
                        query(collection(db, 'articles'), where('slug', '==', s), where('status', '==', 'published')),
                        query(collection(db, 'articles'), where('slug', '==', s)),
                    ];
                    for (const q of queries) {
                        const snapshot = await getDocs(q);
                        if (!snapshot.empty) {
                            found = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
                            break;
                        }
                    }
                    if (found) break;
                }

                setArticle(found);
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
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-black mb-4">Makale Bulunamadı</h1>
                    <Link to="/" className="text-[#ccff00] hover:underline">{t('page_back_home')}</Link>
                </div>
            </div>
        );
    }

    const categoryPaths  = { hukuk: '/hukuk', egitim: '/egitim', sosyal: '/sosyal', sss: '/sss', 'program-turleri': '/program-turleri' };
    const categoryLabels = { hukuk: 'Hukuk Sistemi', egitim: 'Eğitim', sosyal: 'Sosyal', sss: 'SSS', 'program-turleri': 'Program Türleri' };
    const categoryColors = { hukuk: '#ccff00', egitim: '#00d4ff', sosyal: '#ff6b6b', sss: '#ccff00', 'program-turleri': '#a78bfa' };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const catColor = categoryColors[article.category] || '#ccff00';

    return (
        <>
            <SEOHead
                title={article.title}
                description={article.excerpt || article.title}
                path={`/makale/${slug}`}
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero image — full width with bottom fade */}
                {article.coverImage && (
                    <div className="relative w-full h-64 md:h-96 overflow-hidden">
                        <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.parentElement.style.display = 'none'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
                    </div>
                )}

                <article className="max-w-3xl mx-auto px-6 pb-24" style={{ marginTop: article.coverImage ? '-4rem' : '4rem' }}>

                    {/* Back link */}
                    <Link
                        to={categoryPaths[article.category] || '/'}
                        className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-xs font-black uppercase tracking-widest mb-8"
                    >
                        <ArrowLeft size={14} /> {categoryLabels[article.category] || t('page_back_home')}
                    </Link>

                    {/* Category + date */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span
                            className="px-3 py-1 text-black text-[10px] font-black uppercase tracking-widest"
                            style={{ backgroundColor: catColor }}
                        >
                            {categoryLabels[article.category] || article.category}
                        </span>
                        {article.createdAt && (
                            <span className="flex items-center gap-1 text-white/30 text-xs">
                                <Clock size={11} /> {formatDate(article.createdAt)}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-tight mb-6 text-white">
                        {article.title}
                    </h1>

                    {/* Excerpt / lead */}
                    {article.excerpt && (
                        <p className="text-lg text-white/50 border-l-4 border-[#ccff00] pl-6 mb-10 font-medium leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Divider */}
                    <hr className="border-white/10 mb-10" />

                    {/* Markdown body */}
                    <div>
                        <Markdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                            {article.content}
                        </Markdown>
                    </div>

                </article>
            </div>
        </>
    );
};

export default ArticlePage;
