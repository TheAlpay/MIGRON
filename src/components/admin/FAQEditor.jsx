import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, X } from 'lucide-react';

const categoryOptions = [
    { value: 'VİZE & BAŞVURU', label: 'Vize & Başvuru' },
    { value: 'İNGİLİZCE SINAVI', label: 'İngilizce Sınavı' },
    { value: 'MESLEK DEĞERLENDİRMESİ', label: 'Meslek Değerlendirmesi' },
    { value: 'KALICI OTURUM & VATANDAŞLIK', label: 'Kalıcı Oturum & Vatandaşlık' },
    { value: 'GENEL', label: 'Genel' },
];

const categoryAccents = {
    'VİZE & BAŞVURU': '#ccff00',
    'İNGİLİZCE SINAVI': '#00d4ff',
    'MESLEK DEĞERLENDİRMESİ': '#ff6b6b',
    'KALICI OTURUM & VATANDAŞLIK': '#a78bfa',
    'GENEL': '#ccff00',
};

const FAQEditor = ({ item, onSave, onCancel }) => {
    const [question, setQuestion] = useState(item?.question || '');
    const [answer, setAnswer] = useState(item?.answer || '');
    const [category, setCategory] = useState(item?.category || 'VİZE & BAŞVURU');
    const [order, setOrder] = useState(item?.order ?? 0);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!question.trim() || !answer.trim()) {
            alert('Soru ve cevap zorunludur.');
            return;
        }
        setSaving(true);
        try {
            const data = {
                question: question.trim(),
                answer: answer.trim(),
                category,
                accent: categoryAccents[category] || '#ccff00',
                order: Number(order),
                updatedAt: serverTimestamp(),
            };
            if (item?.id) {
                await updateDoc(doc(db, 'faqItems', item.id), data);
            } else {
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, 'faqItems'), data);
            }
            onSave();
        } catch (err) {
            console.error('Error saving FAQ:', err);
            alert('Kaydetme hatası: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-8 px-6">
            <div className="max-w-[900px] mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                        {item ? 'SSS Düzenle' : 'Yeni SSS Sorusu'}
                    </h2>
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/40 hover:text-white transition-all text-sm font-bold">
                            <X size={16} /> İptal
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#ccff00] text-black font-black uppercase text-sm hover:brightness-110 disabled:opacity-50">
                            <Save size={16} /> {saving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Kategori</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        >
                            {categoryOptions.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Sıra (Sayı)</label>
                        <input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Soru</label>
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        placeholder="Soru metnini buraya yazın..."
                    />
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Cevap</label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-4 text-white outline-none focus:border-[#ccff00] text-sm leading-relaxed min-h-[200px] resize-y"
                        placeholder="Cevabı buraya yazın..."
                    />
                </div>

                {question && answer && (
                    <div className="border border-white/10 p-6">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-4">Önizleme</p>
                        <div className="mb-2">
                            <span
                                className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5"
                                style={{ backgroundColor: `${categoryAccents[category]}15`, color: categoryAccents[category] }}
                            >
                                {category}
                            </span>
                        </div>
                        <p className="font-bold text-white mb-3">{question}</p>
                        <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FAQEditor;
