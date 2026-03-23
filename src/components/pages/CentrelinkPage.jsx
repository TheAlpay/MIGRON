import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, XCircle, Minus } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';

const visaRights = [
    {
        visa: 'Permanent Resident (PR)',
        visaEn: 'Permanent Resident (PR)',
        right: 'Evet',
        rightEn: 'Yes',
        status: 'yes',
    },
    {
        visa: 'Partner Vizesi',
        visaEn: 'Partner Visa',
        right: 'Kısıtlı — koşullara bağlı',
        rightEn: 'Limited — subject to conditions',
        status: 'partial',
    },
    {
        visa: 'Bridging Vize',
        visaEn: 'Bridging Visa',
        right: 'Vize türüne göre değişiyor',
        rightEn: 'Varies by visa subclass',
        status: 'partial',
    },
    {
        visa: 'Working Holiday (417/462)',
        visaEn: 'Working Holiday (417/462)',
        right: 'Hayır',
        rightEn: 'No',
        status: 'no',
    },
    {
        visa: 'Öğrenci Vizesi (500)',
        visaEn: 'Student Visa (500)',
        right: 'Hayır',
        rightEn: 'No',
        status: 'no',
    },
];

const StatusIcon = ({ status }) => {
    if (status === 'yes') return <CheckCircle2 size={16} className="text-[#00ff88] shrink-0" />;
    if (status === 'no') return <XCircle size={16} className="text-[#ff6b6b] shrink-0" />;
    return <Minus size={16} className="text-[#ccff00] shrink-0" />;
};

const CentrelinkPage = () => {
    const { lang } = useLanguage();

    return (
        <>
            <SEOHead
                title={lang === 'en' ? "Centrelink: Who Can Apply?" : "Centrelink: Kim Başvurabilir?"}
                description={lang === 'en'
                    ? "Clear information about Centrelink eligibility by visa type. Don't apply without checking your rights."
                    : "Vize türüne göre Centrelink hakları. Hakkın olmadan başvurma."}
                path="/centrelink"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} />
                                {lang === 'en' ? 'Back to Home' : 'Anasayfaya Dön'}
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                {lang === 'en' ? 'SOCIAL — WELFARE' : 'SOSYAL — YARDIMLAR'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 bg-[#ff6b6b]">
                                <Shield className="text-white" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ff6b6b]">
                                CENTRELINK
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium max-w-2xl">
                            {lang === 'en'
                                ? "Australia's social welfare system. Clear information about who can apply — and who can't."
                                : "Avustralya'nın sosyal yardım sistemi. Kim başvurabilir, kim başvuramaz — net bilgi."}
                        </p>
                    </div>
                </section>

                <div className="max-w-[1000px] mx-auto px-6 py-10">

                    {/* What is Centrelink */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-6">
                        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff6b6b] mb-3">
                            {lang === 'en' ? 'WHAT IS CENTRELINK?' : 'CENTRELİNK NEDİR?'}
                        </p>
                        <p className="text-sm text-white/60 leading-relaxed">
                            {lang === 'en'
                                ? "Centrelink is Australia's social welfare system. It covers unemployment benefits, rent assistance, family payments and other government support. It is managed by Services Australia."
                                : "Centrelink, Avustralya'nın sosyal yardım sistemi. İşsizlik yardımı, kira yardımı, aile yardımı gibi destekleri kapsıyor. Services Australia tarafından yönetiliyor."}
                        </p>
                    </div>

                    {/* Student visa callout */}
                    <div className="border border-[#ff6b6b]/40 bg-[#ff6b6b]/5 p-5 mb-6 flex items-start gap-4">
                        <div className="text-2xl shrink-0">🚫</div>
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff6b6b] mb-2">
                                {lang === 'en' ? 'STUDENT VISA (500) HOLDERS — READ THIS' : 'ÖĞRENCİ VİZESİYLE (500) BAŞVURABİLİR MİYİM?'}
                            </p>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">
                                {lang === 'en'
                                    ? "No. With a 500 visa you cannot apply for Centrelink. There is a lot of incorrect information circulating online about this."
                                    : "Hayır. 500 vizesiyle Centrelink'e başvuramazsın. Bu konuda internette çok yanlış bilgi dolaşıyor."}
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mb-8">
                        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                            {lang === 'en' ? 'CENTRELINK RIGHTS BY VISA TYPE' : 'VİZE TÜRÜNE GÖRE CENTRELİNK HAKLARI'}
                        </p>
                        <div className="border border-white/5 overflow-hidden">
                            {/* Header */}
                            <div className="grid grid-cols-2 bg-white/3 border-b border-white/5">
                                <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                    {lang === 'en' ? 'VISA TYPE' : 'VİZE TÜRÜ'}
                                </div>
                                <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                    {lang === 'en' ? 'CENTRELINK RIGHT' : 'CENTRELİNK HAKKI'}
                                </div>
                            </div>
                            {visaRights.map((row, i) => (
                                <div key={i} className="grid grid-cols-2 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                                    <div className="p-4 text-sm font-bold text-white/70">
                                        {lang === 'en' ? row.visaEn : row.visa}
                                    </div>
                                    <div className="p-4 flex items-center gap-2">
                                        <StatusIcon status={row.status} />
                                        <span className={`text-sm font-bold ${row.status === 'yes' ? 'text-[#00ff88]' : row.status === 'no' ? 'text-[#ff6b6b]' : 'text-[#ccff00]'}`}>
                                            {lang === 'en' ? row.rightEn : row.right}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="border border-[#ff6b6b]/30 bg-[#ff6b6b]/5 p-5 mb-8 flex items-start gap-3">
                        <AlertTriangle size={16} className="text-[#ff6b6b] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#ff6b6b] mb-2">
                                {lang === 'en' ? 'WARNING' : 'UYARI'}
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed">
                                {lang === 'en'
                                    ? "Applying for Centrelink without eligibility can have serious legal consequences and may affect your visa status. If you're unsure, don't apply. Send your questions to "
                                    : "Hakkın olmadan Centrelink'e başvurmak ciddi hukuki sonuç doğurabilir ve vize durumunu etkileyebilir. Emin değilsen başvurma. Sorularını "}
                                <a href="mailto:migron@mtive.tech" className="text-[#ccff00] underline hover:brightness-125 transition-all">
                                    migron@mtive.tech
                                </a>
                                {lang === 'en' ? " adresine iletebilirsin." : " adresine iletebilirsin."}
                            </p>
                        </div>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default CentrelinkPage;
