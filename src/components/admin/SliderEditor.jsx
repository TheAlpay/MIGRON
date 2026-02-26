import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, X } from 'lucide-react';

const SliderEditor = ({ slide, onSave, onCancel }) => {
    const [title, setTitle] = useState(slide?.title || '');
    const [tag1, setTag1] = useState(slide?.tags?.[0] || '');
    const [tag2, setTag2] = useState(slide?.tags?.[1] || '');
    const [description, setDescription] = useState(slide?.description || '');
    const [image, setImage] = useState(slide?.image || '');
    const [order, setOrder] = useState(slide?.order ?? 0);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) { alert('Başlık zorunludur.'); return; }
        setSaving(true);
        try {
            const data = {
                title: title.trim(),
                tags: [tag1.trim(), tag2.trim()].filter(Boolean),
                description: description.trim(),
                image: image.trim(),
                order: Number(order),
                updatedAt: serverTimestamp(),
            };
            if (slide?.id) {
                await updateDoc(doc(db, 'sliders', slide.id), data);
            } else {
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, 'sliders'), data);
            }
            onSave();
        } catch (err) {
            console.error('Error saving slider:', err);
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
                        {slide ? 'Slider Düzenle' : 'Yeni Slider'}
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

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Başlık</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] font-black uppercase tracking-tight"
                        placeholder="AVUSTRALYA: 2026 GÖÇ REFORMU"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Etiket 1</label>
                        <input
                            value={tag1}
                            onChange={e => setTag1(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] uppercase"
                            placeholder="HUKUK"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Etiket 2</label>
                        <input
                            value={tag2}
                            onChange={e => setTag2(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] uppercase"
                            placeholder="KRİTİK"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Açıklama</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] text-sm leading-relaxed min-h-[80px] resize-y"
                        placeholder="Slide açıklaması..."
                    />
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Arka Plan Görseli URL</label>
                    <input
                        value={image}
                        onChange={e => setImage(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white/60 outline-none focus:border-[#ccff00] text-sm font-mono"
                        placeholder="https://images.unsplash.com/..."
                    />
                    {image && (
                        <div className="mt-2">
                            <img src={image} alt="Önizleme" className="w-full max-h-32 object-cover opacity-50" onError={e => e.target.style.display = 'none'} />
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Sıra</label>
                    <input
                        type="number"
                        value={order}
                        onChange={e => setOrder(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                    />
                </div>

                {/* Preview */}
                {title && (
                    <div className="relative h-48 bg-black overflow-hidden border border-white/10">
                        {image && <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" onError={e => e.target.style.display = 'none'} alt="" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <div className="flex gap-2 mb-2">
                                {[tag1, tag2].filter(Boolean).map(t => (
                                    <span key={t} className="px-2 py-0.5 bg-[#ccff00] text-black text-[9px] font-black uppercase">{t}</span>
                                ))}
                            </div>
                            <p className="text-xl font-black uppercase tracking-tighter italic">{title}</p>
                            {description && <p className="text-xs text-white/60 mt-1 max-w-xs">{description}</p>}
                        </div>
                        <span className="absolute top-2 right-2 text-[9px] text-white/30 font-bold uppercase">Önizleme</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SliderEditor;
