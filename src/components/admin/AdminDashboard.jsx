import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { LogOut, Plus, Edit3, Trash2, Eye, EyeOff, FileText, HelpCircle, Layers } from 'lucide-react';
import ArticleEditor from './ArticleEditor';
import FAQEditor from './FAQEditor';
import ProgramEditor from './ProgramEditor';

const AdminDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('articles');
    const [articles, setArticles] = useState([]);
    const [faqItems, setFaqItems] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);
    const [editingFAQ, setEditingFAQ] = useState(null);
    const [editingProgram, setEditingProgram] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        setLoading(true);
        try {
            // Articles
            const artSnap = await getDocs(collection(db, 'articles'));
            const arts = artSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            arts.sort((a, b) => (b.createdAt?.toDate?.() || new Date(0)) - (a.createdAt?.toDate?.() || new Date(0)));
            setArticles(arts);

            // FAQ
            const faqSnap = await getDocs(collection(db, 'faqItems'));
            const faqs = faqSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            faqs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setFaqItems(faqs);

            // Programs
            const progSnap = await getDocs(collection(db, 'programs'));
            const progs = progSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            progs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setPrograms(progs);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const handleLogout = async () => { await signOut(auth); onLogout(); };

    const handleDelete = async (collectionName, id, setter) => {
        if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, collectionName, id));
            setter(prev => prev.filter(a => a.id !== id));
        } catch (err) { console.error('Delete error:', err); }
    };

    const togglePublish = async (article) => {
        const newStatus = article.status === 'published' ? 'draft' : 'published';
        try {
            await updateDoc(doc(db, 'articles', article.id), { status: newStatus });
            setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
        } catch (err) { console.error(err); }
    };

    // Show editors when creating/editing
    if (isCreating || editingArticle) {
        return <ArticleEditor article={editingArticle} onSave={() => { setEditingArticle(null); setIsCreating(false); fetchAll(); }} onCancel={() => { setEditingArticle(null); setIsCreating(false); }} />;
    }
    if (editingFAQ !== null) {
        return <FAQEditor item={editingFAQ === 'new' ? null : editingFAQ} onSave={() => { setEditingFAQ(null); fetchAll(); }} onCancel={() => setEditingFAQ(null)} />;
    }
    if (editingProgram !== null) {
        return <ProgramEditor program={editingProgram === 'new' ? null : editingProgram} onSave={() => { setEditingProgram(null); fetchAll(); }} onCancel={() => setEditingProgram(null)} />;
    }

    const tabs = [
        { id: 'articles', label: 'Makaleler', icon: FileText, count: articles.length },
        { id: 'faq', label: 'SSS', icon: HelpCircle, count: faqItems.length },
        { id: 'programs', label: 'Programlar', icon: Layers, count: programs.length },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-8 px-6">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-[#ccff00]">Admin Panel</h1>
                        <p className="text-xs text-white/40 mt-1">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-sm font-bold">
                        <LogOut size={16} /> Çıkış
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/10">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-black uppercase tracking-wider transition-all border-b-2 -mb-[2px] ${activeTab === tab.id
                                        ? 'border-[#ccff00] text-[#ccff00]'
                                        : 'border-transparent text-white/40 hover:text-white'
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 font-bold">{tab.count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab: Makaleler */}
                {activeTab === 'articles' && (
                    <>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setIsCreating(true)} className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all flex items-center gap-2">
                                <Plus size={18} /> Yeni Makale
                            </button>
                        </div>
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                <FileText size={18} className="text-[#ccff00]" />
                                <h3 className="font-black uppercase text-sm tracking-wider">Makaleler ({articles.length})</h3>
                            </div>
                            {loading ? <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                                : articles.length === 0 ? <div className="p-12 text-center text-white/30"><p className="text-lg font-bold mb-2">Henüz makale yok</p></div>
                                    : <div className="divide-y divide-white/5">
                                        {articles.map(article => (
                                            <div key={article.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                            {article.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                                                        </span>
                                                        <span className="text-[10px] text-white/30 uppercase tracking-wider">{article.category}</span>
                                                    </div>
                                                    <h4 className="font-bold text-white">{article.title}</h4>
                                                    {article.excerpt && <p className="text-xs text-white/40 mt-1">{article.excerpt}</p>}
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button onClick={() => togglePublish(article)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors" title={article.status === 'published' ? 'Taslağa Çevir' : 'Yayınla'}>
                                                        {article.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button onClick={() => setEditingArticle(article)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors"><Edit3 size={16} /></button>
                                                    <button onClick={() => handleDelete('articles', article.id, setArticles)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                            }
                        </div>
                    </>
                )}

                {/* Tab: SSS */}
                {activeTab === 'faq' && (
                    <>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setEditingFAQ('new')} className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all flex items-center gap-2">
                                <Plus size={18} /> Yeni Soru
                            </button>
                        </div>
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                <HelpCircle size={18} className="text-[#ccff00]" />
                                <h3 className="font-black uppercase text-sm tracking-wider">SSS Soruları ({faqItems.length})</h3>
                            </div>
                            {loading ? <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                                : faqItems.length === 0 ? (
                                    <div className="p-12 text-center text-white/30">
                                        <p className="text-lg font-bold mb-2">Henüz soru yok</p>
                                        <p className="text-sm">Yukarıdaki "Yeni Soru" butonuyla soru ekleyin.</p>
                                    </div>
                                ) : <div className="divide-y divide-white/5">
                                    {faqItems.map(item => (
                                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: `${item.accent || '#ccff00'}20`, color: item.accent || '#ccff00' }}>
                                                        {item.category}
                                                    </span>
                                                    <span className="text-[10px] text-white/30">Sıra: {item.order ?? 0}</span>
                                                </div>
                                                <h4 className="font-bold text-white">{item.question}</h4>
                                                <p className="text-xs text-white/40 mt-1 line-clamp-1">{item.answer}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => setEditingFAQ(item)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete('faqItems', item.id, setFaqItems)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </>
                )}

                {/* Tab: Programlar */}
                {activeTab === 'programs' && (
                    <>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setEditingProgram('new')} className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all flex items-center gap-2">
                                <Plus size={18} /> Yeni Program
                            </button>
                        </div>
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                <Layers size={18} className="text-[#ccff00]" />
                                <h3 className="font-black uppercase text-sm tracking-wider">Program Türleri ({programs.length})</h3>
                            </div>
                            {loading ? <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                                : programs.length === 0 ? (
                                    <div className="p-12 text-center text-white/30">
                                        <p className="text-lg font-bold mb-2">Henüz program yok</p>
                                        <p className="text-sm">Yukarıdaki "Yeni Program" butonuyla program ekleyin.</p>
                                    </div>
                                ) : <div className="divide-y divide-white/5">
                                    {programs.map(prog => (
                                        <div key={prog.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: `${prog.color || '#ccff00'}20`, color: prog.color || '#ccff00' }}>
                                                        {prog.tag}
                                                    </span>
                                                    <span className="text-[10px] text-white/30">Sıra: {prog.order ?? 0}</span>
                                                    {prog.prDirect && <span className="text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 font-bold uppercase">PR</span>}
                                                </div>
                                                <h4 className="font-bold text-white">{prog.title}</h4>
                                                <p className="text-xs text-white/40 mt-1">{prog.subtitle}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => setEditingProgram(prog)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete('programs', prog.id, setPrograms)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
