import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, X, Eye } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const categories = [
    { value: 'hukuk', label: 'Hukuk Sistemi' },
    { value: 'egitim', label: 'Eğitim' },
    { value: 'sosyal', label: 'Sosyal' },
    { value: 'projeler', label: 'Projeler' },
];

const ArticleEditor = ({ article, onSave, onCancel }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [slug, setSlug] = useState(article?.slug || '');
    const [excerpt, setExcerpt] = useState(article?.excerpt || '');
    const [content, setContent] = useState(article?.content || '');
    const [category, setCategory] = useState(article?.category || 'hukuk');
    const [lang, setLang] = useState(article?.lang || 'tr');
    const [status, setStatus] = useState(article?.status || 'draft');
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
            .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (value) => {
        setTitle(value);
        if (!article) {
            setSlug(generateSlug(value));
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Başlık ve içerik zorunludur.');
            return;
        }

        setSaving(true);
        try {
            const articleData = {
                title,
                slug: slug || generateSlug(title),
                excerpt,
                content,
                category,
                lang,
                status,
                updatedAt: serverTimestamp(),
            };

            if (article?.id) {
                await updateDoc(doc(db, 'articles', article.id), articleData);
            } else {
                articleData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'articles'), articleData);
            }

            onSave();
        } catch (err) {
            console.error('Error saving article:', err);
            alert('Kaydetme hatası: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-8 px-6">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                        {article ? 'Makale Düzenle' : 'Yeni Makale'}
                    </h2>
                    <div className="flex gap-3">
                        <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 hover:border-[#ccff00] hover:text-[#ccff00] transition-all text-sm font-bold">
                            <Eye size={16} /> {showPreview ? 'Editör' : 'Önizleme'}
                        </button>
                        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/40 hover:text-white transition-all text-sm font-bold">
                            <X size={16} /> İptal
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#ccff00] text-black font-black uppercase text-sm hover:brightness-110 disabled:opacity-50">
                            <Save size={16} /> {saving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                        </button>
                    </div>
                </div>

                {/* Meta fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Başlık</label>
                        <input
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] transition-colors"
                            placeholder="Makale başlığı..."
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Kategori</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        >
                            {categories.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Dil</label>
                            <select
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                            >
                                <option value="tr">Türkçe</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Durum</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                            >
                                <option value="draft">Taslak</option>
                                <option value="published">Yayında</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">URL Slug</label>
                    <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white/60 outline-none focus:border-[#ccff00] text-sm font-mono"
                        placeholder="makale-url-slug"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Kısa Özet</label>
                    <input
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        placeholder="Makale kısaca ne hakkında..."
                    />
                </div>

                {/* Content Editor / Preview */}
                {showPreview ? (
                    <div className="bg-[#111] border border-white/10 p-8 min-h-[500px] prose prose-invert prose-headings:text-[#ccff00] prose-a:text-[#ccff00] prose-strong:text-white max-w-none">
                        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    </div>
                ) : (
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                            İçerik (Markdown destekler)
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-4 text-white outline-none focus:border-[#ccff00] font-mono text-sm leading-relaxed min-h-[500px] resize-y"
                            placeholder="Makale içeriğini buraya yazın... Markdown formatı desteklenir.

# Başlık
## Alt Başlık

**Kalın metin**, *italik metin*

- Liste öğesi 1
- Liste öğesi 2

> Alıntı bloğu"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleEditor;
