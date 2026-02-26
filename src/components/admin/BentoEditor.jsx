import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, X } from 'lucide-react';

// There are 2 fixed bento cards (IDs: 'bento-risk', 'bento-australia')
const BentoEditor = ({ card, onSave, onCancel }) => {
    const isAustralia = card?.id === 'bento-australia';

    // Shared
    const [saving, setSaving] = useState(false);

    // Risk card fields
    const [bentoTitle, setBentoTitle] = useState(card?.title || '');
    const [bentoDesc, setBentoDesc] = useState(card?.desc || '');
    const [safeData, setSafeData] = useState(card?.safeData || 'GÜVENLİ VERİ');

    // Australia card fields
    const [auTitle, setAuTitle] = useState(card?.auTitle || 'AVUSTRALYA');
    const [stat1Value, setStat1Value] = useState(card?.stat1Value || '%98');
    const [stat1Label, setStat1Label] = useState(card?.stat1Label || 'VERİ DOĞRULUĞU');
    const [stat2Value, setStat2Value] = useState(card?.stat2Value || '7/24');
    const [stat2Label, setStat2Label] = useState(card?.stat2Label || 'HUKUKİ TAKİP');

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = isAustralia
                ? { id: 'bento-australia', auTitle, stat1Value, stat1Label, stat2Value, stat2Label, updatedAt: serverTimestamp() }
                : { id: 'bento-risk', title: bentoTitle, desc: bentoDesc, safeData, updatedAt: serverTimestamp() };

            await setDoc(doc(db, 'bentoCards', data.id), data);
            onSave();
        } catch (err) {
            console.error('Error saving bento card:', err);
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
                        {isAustralia ? 'Avustralya Bento Kartı' : 'Risk Analizi Bento Kartı'}
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

                {isAustralia ? (
                    <>
                        <div className="mb-6">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Başlık</label>
                            <input value={auTitle} onChange={e => setAuTitle(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] font-black uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest">İstatistik 1</p>
                                <div>
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Değer</label>
                                    <input value={stat1Value} onChange={e => setStat1Value(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] font-black text-2xl" placeholder="%98" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Etiket</label>
                                    <input value={stat1Label} onChange={e => setStat1Label(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] uppercase text-sm" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-[#ccff00] uppercase tracking-widest">İstatistik 2</p>
                                <div>
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Değer</label>
                                    <input value={stat2Value} onChange={e => setStat2Value(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] font-black text-2xl" placeholder="7/24" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Etiket</label>
                                    <input value={stat2Label} onChange={e => setStat2Label(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] uppercase text-sm" />
                                </div>
                            </div>
                        </div>
                        {/* Preview */}
                        <div className="bg-[#ccff00] text-black p-8 max-w-sm">
                            <p className="text-3xl font-black italic tracking-tighter uppercase mb-4">{auTitle}</p>
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-2xl font-black">{stat1Value}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest">{stat1Label}</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black">{stat2Value}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest">{stat2Label}</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Başlık</label>
                            <textarea
                                value={bentoTitle}
                                onChange={e => setBentoTitle(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] font-black uppercase tracking-tight text-xl min-h-[80px] resize-y"
                                placeholder="Sektörel Sponsorluklarda Hukuki Risk Analizi"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Açıklama</label>
                            <textarea
                                value={bentoDesc}
                                onChange={e => setBentoDesc(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] text-sm leading-relaxed min-h-[80px] resize-y"
                                placeholder="İşveren sponsorluğu vizelerinde dolandırıcılık tespiti ve iptal protokolleri."
                            />
                        </div>
                        <div className="mb-6">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Sağ Üst Etiket</label>
                            <input value={safeData} onChange={e => setSafeData(e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-white outline-none focus:border-[#ccff00] uppercase text-sm" />
                        </div>
                        {/* Preview */}
                        {bentoTitle && (
                            <div className="bg-[#111] border border-white/5 p-8 max-w-sm min-h-[200px] flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-10 h-10 bg-[#ccff00] flex items-center justify-center text-black font-black text-lg">⚡</div>
                                        <span className="text-[10px] font-bold text-white/40">{safeData}</span>
                                    </div>
                                    <p className="text-xl font-black uppercase leading-tight italic">{bentoTitle}</p>
                                </div>
                                <p className="text-xs text-white/40 uppercase font-bold tracking-tight mt-4">{bentoDesc}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BentoEditor;
