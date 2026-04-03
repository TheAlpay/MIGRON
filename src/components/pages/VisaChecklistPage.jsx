import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Square, RotateCcw, ClipboardList } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

const VISA_CHECKLISTS = {
    '189': {
        label: 'Skilled Independent (189)',
        color: '#ccff00',
        tag: 'SKILLED',
        items: [
            { id: '189-1', text: 'Mesleki değerlendirme (Skills Assessment) tamamlandı', critical: true },
            { id: '189-2', text: "EOI'de en az 65 puan sağlandı", critical: true },
            { id: '189-3', text: "SkillSelect'te EOI gönderildi", critical: true },
            { id: '189-4', text: 'İngilizce sınavı tamamlandı (IELTS/PTE/TOEFL)', critical: true },
            { id: '189-5', text: 'Sağlık muayenesi (HAP ID ile) tamamlandı', critical: true },
            { id: '189-6', text: 'Karakter değerlendirmesi (Police Clearance) alındı', critical: true },
            { id: '189-7', text: 'Davet (ITA) alındı', critical: true },
            { id: '189-8', text: 'Vize başvurusu 60 gün içinde yapıldı', critical: true },
            { id: '189-9', text: 'Pasaport geçerlilik tarihi kontrol edildi', critical: false },
            { id: '189-10', text: 'Medeni durum belgeleri hazırlandı (evlenme cüzdanı vb.)', critical: false },
            { id: '189-11', text: 'Çalışma referans mektupları toplandı', critical: false },
            { id: '189-12', text: 'Eğitim diplomaları ve transkriptler hazır', critical: false },
        ]
    },
    '190': {
        label: 'Skilled Nominated (190)',
        color: '#00d4ff',
        tag: 'SKILLED',
        items: [
            { id: '190-1', text: 'Eyalet nominasyon listesinde mesleğiniz var mı kontrol edildi', critical: true },
            { id: '190-2', text: 'Eyalet/bölge nominasyon başvurusu yapıldı', critical: true },
            { id: '190-3', text: 'Nominasyon onayı alındı (+5 puan)', critical: true },
            { id: '190-4', text: 'Skills Assessment tamamlandı', critical: true },
            { id: '190-5', text: "SkillSelect'te EOI gönderildi (min. 65+5=70 puan)", critical: true },
            { id: '190-6', text: 'İngilizce sınavı tamamlandı', critical: true },
            { id: '190-7', text: 'Sağlık muayenesi yapıldı', critical: true },
            { id: '190-8', text: 'Karakter değerlendirmesi alındı', critical: true },
            { id: '190-9', text: 'Davet (ITA) alındı ve 60 gün içinde başvuruldu', critical: true },
            { id: '190-10', text: 'Eyalette 2 yıl yaşama taahhüdü anlaşıldı', critical: false },
            { id: '190-11', text: 'Referans mektupları ve eğitim belgeleri hazır', critical: false },
        ]
    },
    '491': {
        label: 'Skilled Work Regional (491)',
        color: '#f59e0b',
        tag: 'REGIONAL',
        items: [
            { id: '491-1', text: 'Eyalet/bölge veya akraba sponsoru nominasyon başvurusu yapıldı', critical: true },
            { id: '491-2', text: 'Bölgesel Avustralya tanımı kontrol edildi (hangi bölgeler sayılıyor)', critical: true },
            { id: '491-3', text: 'Skills Assessment tamamlandı', critical: true },
            { id: '491-4', text: 'İngilizce sınavı tamamlandı', critical: true },
            { id: '491-5', text: "SkillSelect EOI'de nominasyon puanı (+15) dahil min. 65 puan sağlandı", critical: true },
            { id: '491-6', text: 'Sağlık muayenesi yapıldı', critical: true },
            { id: '491-7', text: 'Karakter değerlendirmesi alındı', critical: true },
            { id: '491-8', text: 'Davet (ITA) alındı', critical: true },
            { id: '491-9', text: "PR için 191 vizesi koşulları araştırıldı (3 yıl bölgede çalışma)", critical: false },
            { id: '491-10', text: 'Bölgesel alanda iş/yaşam araştırması yapıldı', critical: false },
        ]
    },
    '482': {
        label: 'Temporary Skill Shortage (482)',
        color: '#ff6b6b',
        tag: 'EMPLOYER',
        items: [
            { id: '482-1', text: 'Avustralyalı sponsor işveren bulundu', critical: true },
            { id: '482-2', text: "İşveren'in Standard Business Sponsor (SBS) onayı var mı kontrol edildi", critical: true },
            { id: '482-3', text: 'Nominasyon başvurusu işveren tarafından yapıldı', critical: true },
            { id: '482-4', text: 'Meslek medium-term stream listesinde mi kontrol edildi', critical: true },
            { id: '482-5', text: 'En az 2 yıl deneyim kanıtlandı', critical: true },
            { id: '482-6', text: 'İngilizce yeterliliği gösterildi', critical: true },
            { id: '482-7', text: 'Sağlık muayenesi yapıldı', critical: true },
            { id: '482-8', text: 'Karakter değerlendirmesi alındı', critical: true },
            { id: '482-9', text: 'Market salary rate koşulları karşılandı', critical: false },
            { id: '482-10', text: "186 vize yolu araştırıldı (PR geçişi için)", critical: false },
        ]
    },
    '500': {
        label: 'Student Visa (500)',
        color: '#10b981',
        tag: 'STUDENT',
        items: [
            { id: '500-1', text: 'CRICOS kayıtlı kurum seçildi ve kabul mektubu alındı', critical: true },
            { id: '500-2', text: 'GTE (Genuine Temporary Entrant) ifadesi hazırlandı', critical: true },
            { id: '500-3', text: 'İngilizce yeterliliği gösterildi (IELTS/PTE)', critical: true },
            { id: '500-4', text: 'Mali yeterlilik gösterildi (banka hesabı/sponsor)', critical: true },
            { id: '500-5', text: 'Sağlık sigortası (OSHC) satın alındı', critical: true },
            { id: '500-6', text: 'Sağlık muayenesi yapıldı', critical: false },
            { id: '500-7', text: 'Karakter mektubu/beyanı hazırlandı', critical: false },
            { id: '500-8', text: 'Diploma ve transkriptler hazır', critical: false },
            { id: '500-9', text: "Mezuniyet sonrası 485 (Graduate) vizesi araştırıldı", critical: false },
            { id: '500-10', text: 'Haftalık 48 saat çalışma kuralı öğrenildi', critical: false },
        ]
    },
    'partner': {
        label: 'Partner Visa (820/801)',
        color: '#ec4899',
        tag: 'PARTNER',
        items: [
            { id: 'p-1', text: 'Avustralyalı sponsor (PR veya vatandaş) belirlendi', critical: true },
            { id: 'p-2', text: 'İlişki en az 12 ay sürdüğü kanıtlandı (veya nişanlı)', critical: true },
            { id: 'p-3', text: 'Ortak finansal kanıtlar toplandı (ortak hesap, fatura vb.)', critical: true },
            { id: 'p-4', text: 'Ortak ikamet kanıtları toplandı (kira sözleşmesi vb.)', critical: true },
            { id: 'p-5', text: 'Sosyal kanıtlar toplandı (fotoğraflar, aile beyanı)', critical: true },
            { id: 'p-6', text: 'Sağlık muayenesi yapıldı', critical: true },
            { id: 'p-7', text: 'Karakter değerlendirmesi alındı', critical: true },
            { id: 'p-8', text: '2 yıl sonraki kalıcı vize (801) koşulları öğrenildi', critical: false },
            { id: 'p-9', text: 'Sponsor geçmişi (varsa eski sponsorluk) kontrol edildi', critical: false },
        ]
    },
};

const VisaChecklistPage = () => {
    const [selectedVisa, setSelectedVisa] = useState('189');
    const [checked, setChecked] = useState({});

    const visa = VISA_CHECKLISTS[selectedVisa];
    const completedCount = visa.items.filter(i => checked[i.id]).length;
    const progress = Math.round((completedCount / visa.items.length) * 100);

    // Persist to localStorage
    useEffect(() => {
        const saved = localStorage.getItem('migron_checklist');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (saved) setChecked(JSON.parse(saved));
    }, []);

    const toggle = (id) => {
        const next = { ...checked, [id]: !checked[id] };
        setChecked(next);
        localStorage.setItem('migron_checklist', JSON.stringify(next));
    };

    const resetVisa = () => {
        const next = { ...checked };
        visa.items.forEach(i => delete next[i.id]);
        setChecked(next);
        localStorage.setItem('migron_checklist', JSON.stringify(next));
    };

    return (
        <>
            <SEOHead
                title="Vize Başvuru Kontrol Listesi"
                description="Avustralya vize başvurusu için interaktif kontrol listesi. 189, 190, 491, 482, 500, Partner vizesi hazırlık rehberi."
                path="/vize-kontrol-listesi"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                <section className="pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[900px] mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> Anasayfa
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <ClipboardList className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    KONTROL LİSTESİ
                                </h1>
                                <p className="text-sm text-white/40 mt-1">İlerlemeniz tarayıcınıza kaydedilir</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-[900px] mx-auto px-6 py-10">
                    {/* Visa selector */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {Object.entries(VISA_CHECKLISTS).map(([key, v]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedVisa(key)}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-wider border transition-all"
                                style={{
                                    borderColor: v.color,
                                    backgroundColor: selectedVisa === key ? `${v.color}20` : 'transparent',
                                    color: v.color,
                                }}
                            >
                                {key.toUpperCase()} — {v.tag}
                            </button>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="font-black uppercase tracking-tight text-lg" style={{ color: visa.color }}>
                                    {visa.label}
                                </h2>
                                <p className="text-xs text-white/40 mt-0.5">{completedCount}/{visa.items.length} adım tamamlandı</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-black" style={{ color: visa.color }}>{progress}%</span>
                                <button onClick={resetVisa} className="flex items-center gap-1 text-white/30 hover:text-white/60 text-xs font-bold uppercase">
                                    <RotateCcw size={12} /> Sıfırla
                                </button>
                            </div>
                        </div>
                        <div className="h-2 bg-white/5 overflow-hidden">
                            <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: visa.color }} />
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2">
                        {visa.items.map(item => (
                            <button
                                key={item.id}
                                onClick={() => toggle(item.id)}
                                className="w-full flex items-start gap-4 p-4 bg-[#111] border border-white/5 hover:border-white/20 transition-all text-left group"
                            >
                                {checked[item.id]
                                    ? <CheckSquare size={20} className="shrink-0 mt-0.5" style={{ color: visa.color }} />
                                    : <Square size={20} className="shrink-0 mt-0.5 text-white/20 group-hover:text-white/40 transition-colors" />
                                }
                                <div className="flex-1">
                                    <span className={`text-sm font-medium transition-colors ${checked[item.id] ? 'line-through text-white/30' : 'text-white/80'}`}>
                                        {item.text}
                                    </span>
                                    {item.critical && !checked[item.id] && (
                                        <span className="ml-2 text-[9px] font-black uppercase px-1.5 py-0.5" style={{ backgroundColor: `${visa.color}20`, color: visa.color }}>
                                            KRİTİK
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {progress === 100 && (
                        <div className="mt-8 p-6 border-2 border-[#ccff00] bg-[#ccff00]/10 text-center">
                            <p className="text-2xl font-black uppercase text-[#ccff00]">🎉 Tebrikler!</p>
                            <p className="text-sm text-white/60 mt-2">Tüm adımları tamamladınız. Başvurunuz için hazırsınız!</p>
                            <Link to="/puan-hesapla" className="inline-flex items-center gap-2 mt-4 bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110">
                                Puanınızı Hesaplayın
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-xs text-white/20 text-center">
                        İlerlemeniz otomatik olarak tarayıcınıza kaydedilir. Vize değiştirdiğinizde her birinin ilerleme durumu ayrı saklanır.
                    </div>
                </section>
            </div>
        </>
    );
};

export default VisaChecklistPage;
