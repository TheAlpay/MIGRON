import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, X, Plus, Trash2 } from 'lucide-react';

const tagOptions = ['SKILLED', 'EMPLOYER', 'REGIONAL', 'STUDENT', 'PARTNER', 'BUSINESS', 'DIĞER'];
const colorOptions = [
    { label: 'Sarı-Yeşil', value: '#ccff00' },
    { label: 'Mavi', value: '#00d4ff' },
    { label: 'Kırmızı', value: '#ff6b6b' },
    { label: 'Mor', value: '#a78bfa' },
    { label: 'Turuncu', value: '#f59e0b' },
    { label: 'Yeşil', value: '#10b981' },
    { label: 'Pembe', value: '#ec4899' },
    { label: 'İndigo', value: '#6366f1' },
];

const ProgramEditor = ({ program, onSave, onCancel }) => {
    const [title, setTitle] = useState(program?.title || '');
    const [subtitle, setSubtitle] = useState(program?.subtitle || '');
    const [tag, setTag] = useState(program?.tag || 'SKILLED');
    const [color, setColor] = useState(program?.color || '#ccff00');
    const [desc, setDesc] = useState(program?.desc || '');
    const [requirements, setRequirements] = useState(program?.requirements || ['']);
    const [processingTime, setProcessingTime] = useState(program?.processingTime || '');
    const [prDirect, setPrDirect] = useState(program?.prDirect ?? false);
    const [order, setOrder] = useState(program?.order ?? 0);
    const [saving, setSaving] = useState(false);

    const addRequirement = () => setRequirements(prev => [...prev, '']);
    const removeRequirement = (i) => setRequirements(prev => prev.filter((_, idx) => idx !== i));
    const updateRequirement = (i, val) => setRequirements(prev => prev.map((r, idx) => idx === i ? val : r));

    const handleSave = async () => {
        if (!title.trim() || !desc.trim()) {
            alert('Başlık ve açıklama zorunludur.');
            return;
        }
        setSaving(true);
        try {
            const data = {
                title: title.trim(),
                subtitle: subtitle.trim(),
                tag,
                color,
                desc: desc.trim(),
                requirements: requirements.filter(r => r.trim()),
                processingTime: processingTime.trim(),
                prDirect,
                order: Number(order),
                updatedAt: serverTimestamp(),
            };
            if (program?.id) {
                await updateDoc(doc(db, 'programs', program.id), data);
            } else {
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, 'programs'), data);
            }
            onSave();
        } catch (err) {
            console.error('Error saving program:', err);
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
                        {program ? 'Program Düzenle' : 'Yeni Program'}
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Program Başlığı</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                            placeholder="örn: Skilled Independent (189)"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Etiket (Tag)</label>
                        <select
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        >
                            {tagOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Renk</label>
                        <select
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        >
                            {colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Alt Başlık</label>
                    <input
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        placeholder="örn: Bağımsız Yetenekli Göçmen Vizesi"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Açıklama</label>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 p-4 text-white outline-none focus:border-[#ccff00] text-sm leading-relaxed min-h-[120px] resize-y"
                        placeholder="Program hakkında kısa açıklama..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">İşlem Süresi</label>
                        <input
                            value={processingTime}
                            onChange={(e) => setProcessingTime(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                            placeholder="örn: 12-24 ay"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Sıra</label>
                        <input
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00]"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <input
                            type="checkbox"
                            id="prDirect"
                            checked={prDirect}
                            onChange={(e) => setPrDirect(e.target.checked)}
                            className="accent-[#ccff00] w-4 h-4"
                        />
                        <label htmlFor="prDirect" className="text-sm font-bold text-white/60 cursor-pointer">Doğrudan PR (Permanent Residency) imkânı var</label>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Temel Gereksinimler</label>
                        <button onClick={addRequirement} className="flex items-center gap-1 text-[#ccff00] text-xs font-bold hover:brightness-110">
                            <Plus size={14} /> Ekle
                        </button>
                    </div>
                    <div className="space-y-2">
                        {requirements.map((req, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    value={req}
                                    onChange={(e) => updateRequirement(i, e.target.value)}
                                    className="flex-1 bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] text-sm"
                                    placeholder={`Gereksinim ${i + 1}`}
                                />
                                <button onClick={() => removeRequirement(i)} className="p-3 text-white/30 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                {title && (
                    <div className="border p-6 mt-4" style={{ borderColor: `${color}30` }}>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-4">Kart Önizleme</p>
                        <div className="flex items-start justify-between mb-4">
                            <span className="px-2 py-1 text-[9px] font-black uppercase" style={{ backgroundColor: `${color}20`, color }}>{tag}</span>
                            {prDirect && <span className="px-2 py-1 text-[9px] font-black uppercase bg-white/5 text-white/40">DOĞRUDAN PR</span>}
                        </div>
                        <p className="text-lg font-black uppercase" style={{ color }}>{title}</p>
                        {subtitle && <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{subtitle}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramEditor;
