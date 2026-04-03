import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, X, Eye, EyeOff, Bold, Italic, List, ListOrdered, Quote, Minus, Undo2, Redo2, Link2, Image, Table } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Table as TiptapTable, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';

const categories = [
    { value: 'hukuk', label: 'Hukuk Sistemi' },
    { value: 'egitim', label: 'Eğitim' },
    { value: 'sosyal', label: 'Sosyal' },
    { value: 'sss', label: 'SSS (Sık Sorulan Sorular)' },
    { value: 'program-turleri', label: 'Program Türleri' },
];

const ToolbarBtn = ({ onClick, active, title, children, danger }) => (
    <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        title={title}
        className={`px-2 py-1.5 text-xs font-bold transition-all border ${
            active
                ? 'bg-[#ccff00] text-black border-[#ccff00]'
                : danger
                ? 'border-white/10 text-red-400 hover:border-red-400 hover:text-red-300'
                : 'border-white/10 text-white/60 hover:border-[#ccff00] hover:text-[#ccff00]'
        }`}
    >
        {children}
    </button>
);

const Divider = () => <span className="w-px h-5 bg-white/10 mx-1 self-center" />;

const Toolbar = ({ editor }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('Link URL:');
        if (url) editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
    };

    const addImage = () => {
        const url = window.prompt('Görsel URL:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0a0a0a] border border-white/10 border-b-0">
            {/* History */}
            <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Geri al (Ctrl+Z)">
                <Undo2 size={13} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Yinele (Ctrl+Y)">
                <Redo2 size={13} />
            </ToolbarBtn>

            <Divider />

            {/* Text style */}
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Kalın (Ctrl+B)">
                <Bold size={13} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="İtalik (Ctrl+I)">
                <Italic size={13} />
            </ToolbarBtn>

            <Divider />

            {/* Headings */}
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Başlık 1">
                H1
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Başlık 2">
                H2
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Başlık 3">
                H3
            </ToolbarBtn>

            <Divider />

            {/* Lists */}
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Madde listesi">
                <List size={13} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numaralı liste">
                <ListOrdered size={13} />
            </ToolbarBtn>

            <Divider />

            {/* Block */}
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Alıntı">
                <Quote size={13} />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Kod (satır içi)">
                {'</>'}
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Kod bloğu">
                {'{ }'}
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Yatay çizgi">
                <Minus size={13} />
            </ToolbarBtn>

            <Divider />

            {/* Link & Image */}
            <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Link ekle">
                <Link2 size={13} />
            </ToolbarBtn>
            <ToolbarBtn onClick={addImage} title="Görsel ekle (URL)">
                <Image size={13} />
            </ToolbarBtn>

            <Divider />

            {/* Table */}
            <ToolbarBtn onClick={insertTable} title="Tablo ekle (3x3)">
                <Table size={13} />
            </ToolbarBtn>
            {editor.isActive('table') && (
                <>
                    <ToolbarBtn onClick={() => editor.chain().focus().addColumnBefore().run()} title="Sütun ekle (sol)">↤S</ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Sütun ekle (sağ)">S↦</ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().deleteColumn().run()} title="Sütun sil" danger>-S</ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().addRowBefore().run()} title="Satır ekle (üst)">↤R</ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().addRowAfter().run()} title="Satır ekle (alt)">R↦</ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().deleteRow().run()} title="Satır sil" danger>-R</ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().deleteTable().run()} title="Tabloyu sil" danger>
                        Tablo Sil
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().toggleHeaderRow().run()} title="Başlık satırı">
                        Başlık
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().mergeCells().run()} title="Hücre birleştir">
                        Birleştir
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor.chain().focus().splitCell().run()} title="Hücre böl">
                        Böl
                    </ToolbarBtn>
                </>
            )}
        </div>
    );
};

// Helper: content string → TipTap-compatible HTML
const toEditorContent = (raw) => {
    if (!raw) return '<p></p>';
    if (raw.trim().startsWith('<')) return raw;
    return `<p>${raw.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
};

const ArticleEditor = ({ article, onSave, onCancel }) => {
    const [activeLangTab, setActiveLangTab] = useState('tr'); // 'tr' | 'en'

    // TR fields
    const [titleTr, setTitleTr] = useState(article?.title_tr || article?.title || '');
    const [excerptTr, setExcerptTr] = useState(article?.excerpt_tr || article?.excerpt || '');

    // EN fields
    const [titleEn, setTitleEn] = useState(article?.title_en || '');
    const [excerptEn, setExcerptEn] = useState(article?.excerpt_en || '');

    // Common fields
    const [slug, setSlug] = useState(article?.slug || '');
    const [category, setCategory] = useState(article?.category || 'hukuk');
    const [status, setStatus] = useState(article?.status || 'draft');
    const [coverImage, setCoverImage] = useState(article?.coverImage || '');
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);

    // TR Editor
    const editorTr = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: { languageClassPrefix: 'language-' } }),
            TiptapLink.configure({ openOnClick: false }),
            TiptapImage.configure({ inline: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TiptapTable.configure({ resizable: true }),
            TableRow, TableHeader, TableCell,
        ],
        content: toEditorContent(article?.content_tr || article?.content || ''),
        editorProps: {
            attributes: { class: 'outline-none min-h-[500px] text-white/80 font-medium leading-relaxed' },
        },
    });

    // EN Editor
    const editorEn = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: { languageClassPrefix: 'language-' } }),
            TiptapLink.configure({ openOnClick: false }),
            TiptapImage.configure({ inline: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TiptapTable.configure({ resizable: true }),
            TableRow, TableHeader, TableCell,
        ],
        content: toEditorContent(article?.content_en || ''),
        editorProps: {
            attributes: { class: 'outline-none min-h-[500px] text-white/80 font-medium leading-relaxed' },
        },
    });

    const generateSlug = (text) =>
        text
            .toLowerCase()
            .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
            .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

    const handleTitleTrChange = (value) => {
        setTitleTr(value);
        if (!article) setSlug(generateSlug(value));
    };

    const handleSave = async () => {
        const contentTr = editorTr?.getHTML() || '';
        const contentEn = editorEn?.getHTML() || '';
        if (!titleTr.trim() || !contentTr || contentTr === '<p></p>') {
            alert('Türkçe başlık ve içerik zorunludur.');
            return;
        }
        setSaving(true);
        try {
            const articleData = {
                // Multilingual fields
                title_tr: titleTr,
                title_en: titleEn,
                excerpt_tr: excerptTr,
                excerpt_en: excerptEn,
                content_tr: contentTr,
                content_en: contentEn,
                // Legacy / fallback fields (keep for backward compat & slug)
                title: titleTr,
                excerpt: excerptTr,
                content: contentTr,
                // Common fields
                slug: slug || generateSlug(titleTr),
                category,
                lang: 'tr', // default lang kept for compat
                status,
                coverImage: coverImage.trim() || null,
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

    const _activeEditor = activeLangTab === 'tr' ? editorTr : editorEn; // reserved for future toolbar actions

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
                            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showPreview ? 'Editör' : 'Önizleme'}
                        </button>
                        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/40 hover:text-white transition-all text-sm font-bold">
                            <X size={16} /> İptal
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#ccff00] text-black font-black uppercase text-sm hover:brightness-110 disabled:opacity-50">
                            <Save size={16} /> {saving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                        </button>
                    </div>
                </div>

                {/* Common meta fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Kategori</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]">
                            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Durum</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]">
                            <option value="draft">Taslak</option>
                            <option value="published">Yayında</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">URL Slug</label>
                        <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white/60 outline-none focus:border-[#ccff00] text-sm font-mono" placeholder="makale-url-slug" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Kapak Görseli URL (İsteğe Bağlı)</label>
                    <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white/60 outline-none focus:border-[#ccff00] text-sm font-mono" placeholder="https://images.unsplash.com/..." />
                    {coverImage && (
                        <div className="mt-2">
                            <img src={coverImage} alt="Kapak önizleme" className="w-full max-h-40 object-cover opacity-60" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    )}
                </div>

                {/* Language Tabs */}
                <div className="flex gap-0 mb-0 mt-8">
                    <button
                        onClick={() => setActiveLangTab('tr')}
                        className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest border transition-all ${
                            activeLangTab === 'tr'
                                ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                : 'bg-[#111] text-white/40 border-white/10 hover:text-white hover:border-white/30'
                        }`}
                    >
                        🇹🇷 Türkçe
                    </button>
                    <button
                        onClick={() => setActiveLangTab('en')}
                        className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest border-t border-b border-r transition-all ${
                            activeLangTab === 'en'
                                ? 'bg-[#ccff00] text-black border-[#ccff00]'
                                : 'bg-[#111] text-white/40 border-white/10 hover:text-white hover:border-white/30'
                        }`}
                    >
                        🇬🇧 English
                    </button>
                    <div className="flex-1 border-b border-white/10" />
                </div>

                {/* Tab Content */}
                <div className="border border-t-0 border-white/10 bg-[#0a0a0a] p-6 mb-6">
                    {activeLangTab === 'tr' ? (
                        <>
                            <div className="mb-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Başlık (TR)</label>
                                <input
                                    value={titleTr}
                                    onChange={(e) => handleTitleTrChange(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] transition-colors"
                                    placeholder="Makale başlığı (Türkçe)..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Kısa Özet (TR)</label>
                                <input
                                    value={excerptTr}
                                    onChange={(e) => setExcerptTr(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                                    placeholder="Makale kısaca ne hakkında (Türkçe)..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">İçerik (TR)</label>
                                {showPreview ? (
                                    <div
                                        className="bg-[#111] border border-white/10 p-8 min-h-[500px] article-content"
                                        dangerouslySetInnerHTML={{ __html: editorTr?.getHTML() || '' }}
                                    />
                                ) : (
                                    <div className="border border-white/10 bg-[#0d0d0d]">
                                        <Toolbar editor={editorTr} />
                                        <div className="p-6 tiptap-editor">
                                            <EditorContent editor={editorTr} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-4 p-3 bg-white/5 border border-white/10 text-xs text-white/40">
                                <span>💡</span>
                                <span>İngilizce içerik boş bırakılırsa site İngilizce'ye geçildiğinde Türkçe içerik gösterilmeye devam eder.</span>
                            </div>
                            <div className="mb-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Title (EN)</label>
                                <input
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] transition-colors"
                                    placeholder="Article title (English)..."
                                />
                            </div>
                            <div className="mb-4">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Short Excerpt (EN)</label>
                                <input
                                    value={excerptEn}
                                    onChange={(e) => setExcerptEn(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                                    placeholder="Brief article description (English)..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Content (EN)</label>
                                {showPreview ? (
                                    <div
                                        className="bg-[#111] border border-white/10 p-8 min-h-[500px] article-content"
                                        dangerouslySetInnerHTML={{ __html: editorEn?.getHTML() || '' }}
                                    />
                                ) : (
                                    <div className="border border-white/10 bg-[#0d0d0d]">
                                        <Toolbar editor={editorEn} />
                                        <div className="p-6 tiptap-editor">
                                            <EditorContent editor={editorEn} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleEditor;
