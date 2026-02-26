import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, ArrowUpRight, X, ChevronRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import SEOHead from '../seo/SEOHead';

// ── Varsayılan Veriler (Firebase boşsa bunlar gösterilir) ────────────────────
const defaultPrograms = [
    {
        id: 'default-1',
        color: "#ccff00",
        tag: "SKILLED",
        title: "Skilled Independent (189)",
        subtitle: "Bağımsız Yetenekli Göçmen Vizesi",
        desc: "Herhangi bir eyalet veya bölgesel sponsor gerektirmeyen, puan testi tabanlı bağımsız göçmenlik vizesi. Avustralya'nın herhangi bir yerinde yaşayabilir ve çalışabilirsiniz.",
        requirements: ["Min. 65 EOI puanı", "Geçerli meslek değerlendirmesi", "Competent English (IELTS 6.0)", "Sağlık muayenesi"],
        processingTime: "12-36 ay",
        prDirect: true,
        details: "189 vizesi, herhangi bir Avustralyalı işveren veya eyalet tarafından sponsor olmaksızın başvurulabilen bir skilled göçmenlik vizesidir. SkillSelect sistemi üzerinden EOI (Expression of Interest) verilmesi ve ardından davet beklenmesi gerekir. Davet puanları genellikle 65'in çok üzerinde seyretmektedir; bu nedenle ek puan toplamak kritik önem taşır."
    },
    {
        id: 'default-2',
        color: "#00d4ff",
        tag: "SKILLED",
        title: "Skilled Nominated (190)",
        subtitle: "Eyalet Nominasyonlu Vize",
        desc: "Bir eyalet veya bölge tarafından nomine edilmenizi gerektiren, 5 ekstra puan kazandıran skilled göçmenlik vizesi.",
        requirements: ["Min. 65 puan (+ 5 nominasyon bonusu)", "Eyalet nominasyonu", "Meslek değerlendirmesi", "Competent English"],
        processingTime: "6-24 ay",
        prDirect: true,
        details: "190 vizesi, state/territory nominasyonu ile 5 ek puan kazandıran ve bu nedenle daha ulaşılabilir bir skilled vize seçeneğidir. Her eyaletin kendi nominasyon kriterleri ve quota'ları vardır. Eyalet nominasyonu aldıktan sonra ise ilgili eyalette 2 yıl yaşama ve çalışma yükümlülüğü bulunmaktadır."
    },
    {
        id: 'default-3',
        color: "#ff6b6b",
        tag: "EMPLOYER",
        title: "Temporary Skill Shortage (482)",
        subtitle: "İşveren Sponsorlu Geçici Vize",
        desc: "Avustralyalı işverenler tarafından sponsor olunan çalışanlar için geçici çalışma vizesi. Belirli koşullar sağlandığında PR'a geçiş mümkündür.",
        requirements: ["Sponsor işveren", "Nominasyon onayı", "2 yıl deneyim", "English yeterliliği"],
        processingTime: "1-6 ay",
        prDirect: false,
        details: "482 vizesi (TSS), short-term stream (2 yıl) ve medium-term stream (4 yıl) olmak üzere iki akıştan oluşur. Medium-term stream sahipleri, belirli koşullar sağlandığında 186 ya da 191 vizesiyle PR başvurusunda bulunabilir. İşveren değişikliği için yeni bir nominasyon gereklidir."
    },
    {
        id: 'default-4',
        color: "#a78bfa",
        tag: "EMPLOYER",
        title: "Employer Nomination Scheme (186)",
        subtitle: "İşveren Nominasyonu Kalıcı Vize",
        desc: "İşveren tarafından belirli bir pozisyona nomine edilen göçmenler için doğrudan PR imkânı sunan vize.",
        requirements: ["İşveren nominasyonu", "3 yıl deneyim", "Competent English", "Meslek değerlendirmesi"],
        processingTime: "6-24 ay",
        prDirect: true,
        details: "186 vizesi, direct entry stream ve transition stream olmak üzere iki akışa sahiptir. Transition stream, en az 2 yıl 457 ya da 482 vizesiyle aynı işverende çalışmış kişiler içindir. Direct entry stream ise doğrudan işveren nominasyonuyla başvuru imkânı sunar."
    },
    {
        id: 'default-5',
        color: "#f59e0b",
        tag: "REGIONAL",
        title: "Skilled Work Regional (491)",
        subtitle: "Bölgesel Çalışma Geçici Vizesi",
        desc: "Bölgesel alanlarda çalışmayı ve yaşamayı gerektiren, 15 bonus puan kazandıran geçici vize. 3 yılın sonunda 191 vizesiyle PR'a geçiş mümkündür.",
        requirements: ["Eyalet/bölge nominasyonu", "Bölgesel Avustralya'da ikamet", "Meslek değerlendirmesi", "Competent English"],
        processingTime: "4-24 ay",
        prDirect: false,
        details: "491 vizesi, regional Avustralya'da yaşamak ve çalışmak isteyenler için 15 ek puan sunar. 3 yıl bölgede çalıştıktan ve bölgesel gelir eşiğini karşıladıktan sonra 191 (Permanent Residence via Regional) vizesiyle kalıcı oturuma geçiş mümkündür."
    },
    {
        id: 'default-6',
        color: "#10b981",
        tag: "STUDENT",
        title: "Student Visa (500)",
        subtitle: "Öğrenci Vizesi",
        desc: "Avustralya'da CRICOS kayıtlı bir kurumda tam zamanlı öğrenim için vize. Çalışma izni ile birlikte gelir (haftada 48 saat).",
        requirements: ["CRICOS kayıtlı kurum kabulü", "GTE (Genuine Temporary Entrant)", "English yeterliliği", "Mali yeterlilik"],
        processingTime: "1-4 ay",
        prDirect: false,
        details: "500 vizesi, Avustralya'daki eğitim sonrası 485 (Graduate Visa) vizesi için kapı açan önemli bir adımdır. GTE (Genuine Temporary Entrant) koşulunu karşılamak kritiktir. 2024 itibarıyla haftada 48 saate çıkan çalışma hakkı, öğrencilere önemli gelir imkânı sunmaktadır."
    },
    {
        id: 'default-7',
        color: "#ec4899",
        tag: "PARTNER",
        title: "Partner Visa (820/801)",
        subtitle: "Eş/Partner Vizesi",
        desc: "Avustralya vatandaşı veya PR sahibi biriyle ilişkisi olan kişiler için 2 aşamalı vize. İlk aşamada geçici, ikinci aşamada kalıcı oturum.",
        requirements: ["Avustralyalı sponsor", "İlişkinin kanıtlanması", "Sağlık muayenesi", "Karakter gereksinimi"],
        processingTime: "12-30 ay",
        prDirect: false,
        details: "820 (onshore) ya da 309 (offshore) geçici partner vizesi ile başlayan süreç, 2 yıl sonra 801/100 kalıcı partner vizesiyle tamamlanır. İlişkinin gerçekliği; ortak banka hesabı, kira sözleşmesi, aile-arkadaş referansları ve fotoğraflar gibi belgelerle kanıtlanır."
    },
    {
        id: 'default-8',
        color: "#6366f1",
        tag: "BUSINESS",
        title: "Business Innovation & Investment (888)",
        subtitle: "İş İnovasyonu ve Yatırım Vizesi",
        desc: "Avustralya'da iş kurma veya yönetme ya da belirli yatırım faaliyetleri yürütme amacıyla verilen kalıcı oturum vizesi.",
        requirements: ["Başarılı iş geçmişi", "Minimum net değer", "Eyalet nominasyonu", "İngilizce gereksinimi yok (bazı akışlar)"],
        processingTime: "12-48 ay",
        prDirect: true,
        details: "888 vizesi, genellikle 188 geçici iş vizesini tamamlayanlar için kalıcı oturum yoludur. Business Innovation stream (ciro ve işletme koşulları), Investor stream (yatırım miktarı koşulları) ve Significant Investor stream (5M AUD+) gibi farklı akışları mevcuttur."
    },
];

// Modal bileşeni
const ProgramModal = ({ program, onClose }) => {
    if (!program) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div
                className="relative bg-[#111] border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                style={{ borderTop: `3px solid ${program.color || '#ccff00'}` }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <span
                        className="px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                        style={{ backgroundColor: `${program.color}20`, color: program.color }}
                    >
                        {program.tag}
                    </span>
                    {program.prDirect && (
                        <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40">DOĞRUDAN PR</span>
                    )}
                    {program.processingTime && (
                        <span className="text-[10px] text-white/30 font-bold ml-auto">~{program.processingTime}</span>
                    )}
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1" style={{ color: program.color }}>
                    {program.title}
                </h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-6">{program.subtitle}</p>

                <p className="text-base text-white/70 leading-relaxed mb-6">{program.desc}</p>

                {program.details && (
                    <div className="bg-black/30 border border-white/5 p-5 mb-6">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Detaylı Bilgi</p>
                        <p className="text-sm text-white/60 leading-relaxed">{program.details}</p>
                    </div>
                )}

                {program.requirements?.length > 0 && (
                    <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-3">Temel Gereksinimler</p>
                        <ul className="space-y-2">
                            {program.requirements.map((req, j) => (
                                <li key={j} className="flex items-center gap-3 text-sm text-white/60">
                                    <span className="w-2 h-2 shrink-0" style={{ backgroundColor: program.color }}></span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/10">
                    <Link
                        to="/hukuk"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-5 py-2.5 font-black uppercase text-sm hover:brightness-110 transition-all"
                    >
                        Hukuki Analiz <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ProgramTurleriPage = () => {
    const [programs, setPrograms] = useState(defaultPrograms);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'programs'));
                if (!snapshot.empty) {
                    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                    setPrograms(items);
                }
                // If empty, defaultPrograms stays
            } catch (err) {
                console.error('Error fetching programs:', err);
            }
            setLoading(false);
        };
        fetchPrograms();
    }, []);

    return (
        <>
            <SEOHead
                title="Program Türleri"
                description="Avustralya göçmenlik vize türleri: Skilled, Employer Sponsored, Partner, Student ve Business vize programlarının detaylı açıklamaları."
                path="/program-turleri"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> Anasayfaya Dön
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Vize Kategorileri</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#ccff00]">
                                    <Layers className="text-black" size={28} strokeWidth={3} />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    PROGRAM TÜRLERİ
                                </h1>
                            </div>
                            <div className="max-w-xl">
                                <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                                    Avustralya'ya göç için mevcut tüm vize programlarını keşfedin. Detaylar için karta tıklayın.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-[1200px] mx-auto px-6 py-12">
                    {loading ? (
                        <div className="text-center text-white/40 py-12 animate-pulse">Yükleniyor...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {programs.map((program) => (
                                <button
                                    key={program.id}
                                    onClick={() => setSelected(program)}
                                    className="bg-[#111] border border-white/5 p-8 hover:border-white/30 transition-all group text-left w-full"
                                    style={{ '--accent': program.color || '#ccff00' }}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                                                style={{ backgroundColor: `${program.color || '#ccff00'}20`, color: program.color || '#ccff00' }}
                                            >
                                                {program.tag}
                                            </span>
                                            {program.prDirect && (
                                                <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40">DOĞRUDAN PR</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                                            {program.processingTime ? `~${program.processingTime}` : ''}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-black uppercase tracking-tight mb-1 group-hover:transition-colors" style={{ color: program.color || '#ccff00' }}>
                                        {program.title}
                                    </h2>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">{program.subtitle}</p>
                                    <p className="text-sm text-white/60 leading-relaxed mb-6">{program.desc}</p>

                                    {program.requirements?.length > 0 && (
                                        <ul className="space-y-1 mb-4">
                                            {program.requirements.map((req, j) => (
                                                <li key={j} className="flex items-center gap-2 text-xs text-white/50">
                                                    <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: program.color || '#ccff00' }}></span>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity mt-2" style={{ color: program.color || '#ccff00' }}>
                                        Detayları Gör <ChevronRight size={14} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 bg-[#111] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-black text-lg uppercase">Hangi program size uygun?</p>
                            <p className="text-white/40 text-sm mt-1">Hukuk sistemi sayfamızda detaylı analizlere ulaşabilirsiniz.</p>
                        </div>
                        <Link to="/hukuk" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all shrink-0">
                            Hukuk Sistemi <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </section>
            </div>

            {/* Modal */}
            {selected && <ProgramModal program={selected} onClose={() => setSelected(null)} />}
        </>
    );
};

export default ProgramTurleriPage;
