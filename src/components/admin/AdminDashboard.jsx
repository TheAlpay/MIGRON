import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { LogOut, Plus, Edit3, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
import ArticleEditor from './ArticleEditor';

const AdminDashboard = ({ user, onLogout }) => {
    const [articles, setArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error('Error fetching articles:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, 'articles', id));
            setArticles(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    const togglePublish = async (article) => {
        const newStatus = article.status === 'published' ? 'draft' : 'published';
        try {
            await updateDoc(doc(db, 'articles', article.id), { status: newStatus });
            setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        onLogout();
    };

    const handleSave = () => {
        setEditingArticle(null);
        setIsCreating(false);
        fetchArticles();
    };

    // Show editor
    if (isCreating || editingArticle) {
        return (
            <ArticleEditor
                article={editingArticle}
                onSave={handleSave}
                onCancel={() => { setEditingArticle(null); setIsCreating(false); }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-8 px-6">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                            Admin Panel
                        </h1>
                        <p className="text-xs text-white/40 mt-1">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-sm font-bold">
                        <LogOut size={16} /> Çıkış
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Yeni Makale
                    </button>
                </div>

                {/* Articles List */}
                <div className="bg-[#111] border border-white/5">
                    <div className="p-4 border-b border-white/10 flex items-center gap-2">
                        <FileText size={18} className="text-[#ccff00]" />
                        <h3 className="font-black uppercase text-sm tracking-wider">Makaleler ({articles.length})</h3>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                    ) : articles.length === 0 ? (
                        <div className="p-12 text-center text-white/30">
                            <p className="text-lg font-bold mb-2">Henüz makale yok</p>
                            <p className="text-sm">Yukarıdaki "Yeni Makale" butonuna tıklayarak ilk makalenizi oluşturun.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {articles.map(article => (
                                <div key={article.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {article.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                                            </span>
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">{article.category}</span>
                                            <span className="text-[10px] text-white/20">{article.lang?.toUpperCase()}</span>
                                        </div>
                                        <h4 className="font-bold text-white">{article.title}</h4>
                                        {article.excerpt && <p className="text-xs text-white/40 mt-1">{article.excerpt}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button onClick={() => togglePublish(article)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors" title={article.status === 'published' ? 'Taslağa Çevir' : 'Yayınla'}>
                                            {article.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button onClick={() => setEditingArticle(article)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(article.id)} className="p-2 text-white/40 hover:text-red-400 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
