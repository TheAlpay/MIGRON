import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

// ── Şehir listesi (harita ile senkron) ───────────────────────────────────────
const CITY_IDS = ['darwin', 'perth', 'adelaide', 'melbourne', 'canberra', 'sydney', 'brisbane', 'hobart'];
const CITY_NAMES = {
    darwin: 'Darwin (NT)', perth: 'Perth (WA)', adelaide: 'Adelaide (SA)',
    melbourne: 'Melbourne (VIC)', canberra: 'Canberra (ACT)', sydney: 'Sydney (NSW)',
    brisbane: 'Brisbane (QLD)', hobart: 'Hobart (TAS)',
};
const CITY_DEFAULTS = {
    darwin:    { rent: '$1,600/mo', salary: '$2,200/wk' },
    perth:     { rent: '$1,750/mo', salary: '$2,050/wk' },
    adelaide:  { rent: '$1,500/mo', salary: '$1,800/wk' },
    melbourne: { rent: '$1,900/mo', salary: '$2,000/wk' },
    canberra:  { rent: '$1,900/mo', salary: '$2,300/wk' },
    sydney:    { rent: '$2,200/mo', salary: '$2,100/wk' },
    brisbane:  { rent: '$1,850/mo', salary: '$1,850/wk' },
    hobart:    { rent: '$1,500/mo', salary: '$1,750/wk' },
};

const DEFAULT_FAIR_WORK = { hourly: '$24.10', weekly: '$915.90', effective_date: '1 Temmuz 2024', effective_date_en: '1 July 2024' };

const DEFAULT_PR_ROWS = [
    { path_tr: '482 → 186', path_en: '482 → 186', time_tr: '3–5 yıl', time_en: '3–5 years', difficulty_tr: 'Orta', difficulty_en: 'Medium' },
    { path_tr: '500 → 485 → 189', path_en: '500 → 485 → 189', time_tr: '4–6 yıl', time_en: '4–6 years', difficulty_tr: 'Orta-Zor', difficulty_en: 'Medium-Hard' },
    { path_tr: '189 Direkt', path_en: '189 Direct', time_tr: '1–2 yıl', time_en: '1–2 years', difficulty_tr: 'Zor', difficulty_en: 'Hard' },
    { path_tr: '190 Eyalet', path_en: '190 State', time_tr: '1–3 yıl', time_en: '1–3 years', difficulty_tr: 'Orta', difficulty_en: 'Medium' },
    { path_tr: '491 → 191', path_en: '491 → 191', time_tr: '5–6 yıl', time_en: '5–6 years', difficulty_tr: 'Kolay', difficulty_en: 'Easy' },
];

// ── Toast helper ─────────────────────────────────────────────────────────────
const Toast = ({ msg, type }) => (
    <div className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold ${type === 'success' ? 'bg-[#ccff00] text-black' : 'bg-red-500 text-white'}`}>
        {type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
        {msg}
    </div>
);

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
    <div className="bg-[#111] border border-white/5 mb-6">
        <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#ccff00]">{title}</h3>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const InputField = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1.5">{label}</label>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-black border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#ccff00]/50 placeholder-white/20"
        />
    </div>
);

const SaveBtn = ({ onClick, saving }) => (
    <button
        onClick={onClick}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-[#ccff00] text-black font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
    >
        {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
    </button>
);

// ═══════════════════════════════════════════════════════════════════════
// Şehir Verileri Bölümü
// ═══════════════════════════════════════════════════════════════════════
const CitySection = ({ toast }) => {
    const [cities, setCities] = useState({});
    const [saving, setSaving] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const result = {};
            await Promise.all(CITY_IDS.map(async id => {
                try {
                    const snap = await getDoc(doc(db, 'cities', id));
                    result[id] = snap.exists() ? snap.data() : { ...CITY_DEFAULTS[id] };
                } catch {
                    result[id] = { ...CITY_DEFAULTS[id] };
                }
            }));
            setCities(result);
            setLoading(false);
        };
        load();
    }, []);

    const update = (cityId, field, val) => {
        setCities(prev => ({ ...prev, [cityId]: { ...prev[cityId], [field]: val } }));
    };

    const save = async (cityId) => {
        setSaving(cityId);
        try {
            await setDoc(doc(db, 'cities', cityId), {
                ...cities[cityId],
                updatedAt: serverTimestamp(),
            }, { merge: true });
            toast('Kaydedildi: ' + CITY_NAMES[cityId], 'success');
        } catch (e) {
            toast('Hata: ' + e.message, 'error');
        }
        setSaving(null);
    };

    if (loading) return <p className="text-white/30 text-sm">Yükleniyor...</p>;

    return (
        <div className="space-y-4">
            {CITY_IDS.map(cityId => {
                const c = cities[cityId] || {};
                return (
                    <div key={cityId} className="bg-black/30 border border-white/5 p-4">
                        <p className="text-sm font-black uppercase tracking-wider text-white mb-3">{CITY_NAMES[cityId]}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <InputField label="Kira (1+1)" value={c.rent || ''} onChange={v => update(cityId, 'rent', v)} placeholder="$1,800/mo" />
                            <InputField label="Ort. Haftalık Maaş" value={c.salary || ''} onChange={v => update(cityId, 'salary', v)} placeholder="$2,000/wk" />
                        </div>
                        {c.updatedAt && (
                            <p className="text-[9px] text-white/20 mb-2">
                                Son güncelleme: {c.updatedAt.toDate ? c.updatedAt.toDate().toLocaleDateString('tr-TR') : '—'}
                            </p>
                        )}
                        <SaveBtn onClick={() => save(cityId)} saving={saving === cityId} />
                    </div>
                );
            })}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// Fair Work Bölümü
// ═══════════════════════════════════════════════════════════════════════
const FairWorkSection = ({ toast }) => {
    const [data, setData] = useState(DEFAULT_FAIR_WORK);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDoc(doc(db, 'fairwork', 'minimum_wage'));
                if (snap.exists()) setData({ ...DEFAULT_FAIR_WORK, ...snap.data() });
            } catch { }
            setLoading(false);
        };
        load();
    }, []);

    const save = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'fairwork', 'minimum_wage'), {
                ...data,
                updatedAt: serverTimestamp(),
            });
            toast('Fair Work verisi kaydedildi', 'success');
        } catch (e) {
            toast('Hata: ' + e.message, 'error');
        }
        setSaving(false);
    };

    if (loading) return <p className="text-white/30 text-sm">Yükleniyor...</p>;

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField label="Saatlik Tutar" value={data.hourly} onChange={v => setData(d => ({ ...d, hourly: v }))} placeholder="$24.10" />
                <InputField label="Haftalık Tutar" value={data.weekly} onChange={v => setData(d => ({ ...d, weekly: v }))} placeholder="$915.90" />
                <InputField label="Geçerlilik Tarihi (TR)" value={data.effective_date} onChange={v => setData(d => ({ ...d, effective_date: v }))} placeholder="1 Temmuz 2024" />
                <InputField label="Geçerlilik Tarihi (EN)" value={data.effective_date_en} onChange={v => setData(d => ({ ...d, effective_date_en: v }))} placeholder="1 July 2024" />
            </div>
            <p className="text-[9px] text-white/25">Her Temmuz'da Fair Work tarafından güncellenir. <a href="https://www.fairwork.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#ccff00]/50 hover:text-[#ccff00]">fairwork.gov.au</a></p>
            <SaveBtn onClick={save} saving={saving} />
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// PR Süre Tablosu Bölümü
// ═══════════════════════════════════════════════════════════════════════
const PrTableSection = ({ toast }) => {
    const [rows, setRows] = useState(DEFAULT_PR_ROWS);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDoc(doc(db, 'pr_yollari', 'sureler'));
                if (snap.exists() && snap.data().rows) setRows(snap.data().rows);
            } catch { }
            setLoading(false);
        };
        load();
    }, []);

    const updateRow = (i, field, val) => {
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
    };

    const addRow = () => setRows(prev => [...prev, { path_tr: '', path_en: '', time_tr: '', time_en: '', difficulty_tr: '', difficulty_en: '' }]);
    const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

    const save = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'pr_yollari', 'sureler'), { rows, updatedAt: serverTimestamp() });
            toast('PR tablosu kaydedildi', 'success');
        } catch (e) {
            toast('Hata: ' + e.message, 'error');
        }
        setSaving(false);
    };

    if (loading) return <p className="text-white/30 text-sm">Yükleniyor...</p>;

    return (
        <div>
            <div className="space-y-3 mb-4">
                {rows.map((row, i) => (
                    <div key={i} className="bg-black/30 border border-white/5 p-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                            <InputField label="Yol (TR)" value={row.path_tr} onChange={v => updateRow(i, 'path_tr', v)} placeholder="482 → 186" />
                            <InputField label="Yol (EN)" value={row.path_en} onChange={v => updateRow(i, 'path_en', v)} placeholder="482 → 186" />
                            <InputField label="Süre (TR)" value={row.time_tr} onChange={v => updateRow(i, 'time_tr', v)} placeholder="3–5 yıl" />
                            <InputField label="Süre (EN)" value={row.time_en} onChange={v => updateRow(i, 'time_en', v)} placeholder="3–5 years" />
                            <InputField label="Zorluk (TR)" value={row.difficulty_tr} onChange={v => updateRow(i, 'difficulty_tr', v)} placeholder="Orta" />
                            <InputField label="Zorluk (EN)" value={row.difficulty_en} onChange={v => updateRow(i, 'difficulty_en', v)} placeholder="Medium" />
                        </div>
                        <button onClick={() => removeRow(i)} className="flex items-center gap-1 text-[9px] text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-wider font-bold">
                            <Trash2 size={10} /> Satırı Sil
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-3">
                <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-2 border border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 transition-colors text-[10px] font-black uppercase tracking-wider">
                    <Plus size={12} /> Satır Ekle
                </button>
                <SaveBtn onClick={save} saving={saving} />
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// Ana ContentEditor
// ═══════════════════════════════════════════════════════════════════════
const ContentEditor = () => {
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToastMsg({ msg, type });
        setTimeout(() => setToastMsg(null), 3000);
    };

    return (
        <div className="relative">
            {/* Toast */}
            {toastMsg && (
                <div className="fixed top-6 right-6 z-[200]">
                    <Toast msg={toastMsg.msg} type={toastMsg.type} />
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-xl font-black uppercase tracking-widest text-white mb-1">İçerik Yönetimi</h2>
                <p className="text-xs text-white/30">Şehir kira/maaş verileri, Fair Work asgari ücret ve PR süre tablosunu buradan güncelleyin.</p>
            </div>

            <Section title="Şehir Kira & Maaş Verileri">
                <p className="text-[10px] text-white/30 mb-4">Güncelleme tarihi harita kartında kullanıcıya da gösterilir. 3 ayda bir güncellemeniz önerilir.</p>
                <CitySection toast={showToast} />
            </Section>

            <Section title="Fair Work Minimum Ücret">
                <FairWorkSection toast={showToast} />
            </Section>

            <Section title="PR Yol Haritası — Süre Tablosu">
                <PrTableSection toast={showToast} />
            </Section>
        </div>
    );
};

export default ContentEditor;
