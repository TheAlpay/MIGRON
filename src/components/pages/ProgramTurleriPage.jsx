import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, ArrowUpRight } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

const programCategories = [
    {
        color: "#ccff00",
        tag: "SKILLED",
        title: "Skilled Independent (189)",
        subtitle: "Bağımsız Yetenekli Göçmen Vizesi",
        desc: "Herhangi bir eyalet veya bölgesel sponsor gerektirmeyen, puan testi tabanlı bağımsız göçmenlik vizesi. Australia'da yaşayabilir ve çalışabilirsiniz.",
        requirements: ["Min. 65 EOI puanı", "Geçerli meslek değerlendirmesi", "Competent English", "Pozitif HealthCheck"],
        processingTime: "12-36 ay",
        prDirect: true,
    },
    {
        color: "#00d4ff",
        tag: "SKILLED",
        title: "Skilled Nominated (190)",
        subtitle: "Eyalet Nominasyonlu Vize",
        desc: "Bir eyalet veya bölge tarafından nomine edilmenizi gerektiren, 5 ekstra puan kazandıran skilled göçmenlik vizesi.",
        requirements: ["Min. 65 puan (+ 5 nominasyon bonusu)", "Eyalet nominasyonu", "Meslek değerlendirmesi", "Competent English"],
        processingTime: "6-24 ay",
        prDirect: true,
    },
    {
        color: "#ff6b6b",
        tag: "EMPLOYER",
        title: "Temporary Skill Shortage (482)",
        subtitle: "İşveren Sponsorlu Geçici Vize",
        desc: "Avustralyalı işverenler tarafından sponsor olunan çalışanlar için geçici çalışma vizesi. Belirli koşullar sağlandığında PR'a geçiş mümkündür.",
        requirements: ["Sponsor işveren", "Nominasyon onayı", "2 yıl deneyim", "English yeterliliği"],
        processingTime: "1-6 ay",
        prDirect: false,
    },
    {
        color: "#a78bfa",
        tag: "EMPLOYER",
        title: "Employer Nomination Scheme (186)",
        subtitle: "İşveren Nominasyonu Kalıcı Vize",
        desc: "İşveren tarafından belirli bir pozisyona nomine edilen göçmenler için doğrudan PR imkânı sunan vize.",
        requirements: ["İşveren nominasyonu", "3 yıl deneyim", "Competent English", "Meslek değerlendirmesi"],
        processingTime: "6-24 ay",
        prDirect: true,
    },
    {
        color: "#f59e0b",
        tag: "REGIONAL",
        title: "Skilled Work Regional (491)",
        subtitle: "Bölgesel Çalışma Geçici Vizesi",
        desc: "Bölgesel alanlarda çalışmayı ve yaşamayı gerektiren, 15 bonus puan kazandıran geçici vize. 3 yılın sonunda 191 vizesiyle PR'a geçiş mümkündür.",
        requirements: ["Eyalet/bölge nominasyonu", "Bölgesel Avustralya'da ikamet", "Meslek değerlendirmesi", "Competent English"],
        processingTime: "4-24 ay",
        prDirect: false,
    },
    {
        color: "#10b981",
        tag: "STUDENT",
        title: "Student Visa (500)",
        subtitle: "Öğrenci Vizesi",
        desc: "Avustralya'da CRICOS kayıtlı bir kurumda tam zamanlı öğrenim için vize. Çalışma izni ile birlikte gelir (haftada 48 saat).",
        requirements: ["CRICOS kayıtlı kurum kabulü", "GTE (Genuine Temporary Entrant)", "English yeterliliği", "Mali yeterlilik"],
        processingTime: "1-4 ay",
        prDirect: false,
    },
    {
        color: "#ec4899",
        tag: "PARTNER",
        title: "Partner Visa (820/801)",
        subtitle: "Eş/Partner Vizesi",
        desc: "Avustralya vatandaşı veya PR sahibi biriyle ilişkisi olan kişiler için 2 aşamalı vize. İlk aşamada geçici, ikinci aşamada kalıcı oturum.",
        requirements: ["Avustralyalı sponsor", "İlişkinin kanıtlanması", "Sağlık muayenesi", "Karakter gereksinimi"],
        processingTime: "12-30 ay",
        prDirect: false,
    },
    {
        color: "#6366f1",
        tag: "BUSINESS",
        title: "Business Innovation & Investment (888)",
        subtitle: "İş İnovasyonu ve Yatırım Vizesi",
        desc: "Avustralya'da iş kurma veya yönetme ya da belirli yatırım faaliyetleri yürütme amacıyla verilen kalıcı oturum vizesi.",
        requirements: ["Başarılı iş geçmişi", "Minimum net değer", "Eyalet nominasyonu", "İngilizce gereksinimi yok (bazı akışlar)"],
        processingTime: "12-48 ay",
        prDirect: true,
    },
];

const ProgramTurleriPage = () => {
    return (
        <>
            <SEOHead
                title="Program Türleri"
                description="Avustralya göçmenlik vize türleri: Skilled, Employer Sponsored, Partner, Student ve Business vize programlarının detaylı açıklamaları."
                path="/program-turleri"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> Anasayfaya Dön
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                Vize Kategorileri
                            </p>
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
                                    Avustralya'ya göç için mevcut tüm vize programlarını keşfedin. Her programa ait gereksinimler ve süreçler hakkında bilgi edinin.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Programs Grid */}
                <section className="max-w-[1200px] mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {programCategories.map((program, i) => (
                            <div
                                key={i}
                                className="bg-[#111] border border-white/5 p-8 hover:border-white/20 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="px-2 py-1 text-[9px] font-black uppercase tracking-widest"
                                            style={{ backgroundColor: `${program.color}20`, color: program.color }}
                                        >
                                            {program.tag}
                                        </span>
                                        {program.prDirect && (
                                            <span className="px-2 py-1 text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40">
                                                DOĞRUDAN PR
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                                        ~{program.processingTime}
                                    </span>
                                </div>

                                <h2
                                    className="text-xl font-black uppercase tracking-tight mb-1 group-hover:transition-colors"
                                    style={{ color: program.color }}
                                >
                                    {program.title}
                                </h2>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-4">
                                    {program.subtitle}
                                </p>
                                <p className="text-sm text-white/60 leading-relaxed mb-6">
                                    {program.desc}
                                </p>

                                <div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">Temel Gereksinimler</p>
                                    <ul className="space-y-1">
                                        {program.requirements.map((req, j) => (
                                            <li key={j} className="flex items-center gap-2 text-xs text-white/50">
                                                <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: program.color }}></span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-[#111] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="font-black text-lg uppercase">Hangi program size uygun?</p>
                            <p className="text-white/40 text-sm mt-1">Hukuk sistemi sayfamızda detaylı analizlere ulaşabilirsiniz.</p>
                        </div>
                        <Link
                            to="/hukuk"
                            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all shrink-0"
                        >
                            Hukuk Sistemi <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProgramTurleriPage;
