import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';

const AccordionItem = ({ title, titleEn, children, accent, lang }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/5 mb-2 overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors group"
            >
                <span className="font-black uppercase tracking-tight text-base group-hover:text-white text-white/80 pr-4">
                    {lang === 'en' ? titleEn : title}
                </span>
                {open
                    ? <ChevronUp size={18} className="shrink-0" style={{ color: accent }} />
                    : <ChevronDown size={18} className="shrink-0 text-white/20" />}
            </button>
            {open && (
                <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const InfoRow = ({ label, labelEn, value, lang }) => (
    <div className="flex flex-wrap items-baseline gap-2 py-2.5 border-b border-white/5 last:border-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/30 w-40 shrink-0">
            {lang === 'en' ? labelEn : label}
        </span>
        <span className="text-sm text-white/70">{value}</span>
    </div>
);

const VergiVeSuperPage = () => {
    const { lang } = useLanguage();

    return (
        <>
            <SEOHead
                title={lang === 'en' ? "Tax Return & Superannuation" : "Vergi İadesi ve Superannuation"}
                description={lang === 'en'
                    ? "Tax returns and superannuation — the two most missed opportunities in Australia."
                    : "Vergi iadesi ve superannuation — Avustralya'da en çok kaçırılan iki fırsat."}
                path="/vergi-ve-super"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} />
                                {lang === 'en' ? 'Back to Home' : 'Anasayfaya Dön'}
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                {lang === 'en' ? 'EDUCATION — FINANCE' : 'EĞİTİM — FİNANS'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 bg-[#ccff00]">
                                <DollarSign className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    {lang === 'en' ? 'TAX & SUPER' : 'VERGİ VE SUPER'}
                                </h1>
                                <p className="text-sm text-white/40 font-medium mt-1">
                                    {lang === 'en'
                                        ? 'Don\'t leave money on the table'
                                        : 'Para bırakma masada'}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium max-w-2xl">
                            {lang === 'en'
                                ? "Tax Return and Superannuation — the two most missed opportunities in Australia. Here's what you need to know."
                                : "Vergi İadesi ve Superannuation — Avustralya'da en çok kaçırılan iki fırsat. İşte bilmen gerekenler."}
                        </p>
                    </div>
                </section>

                <div className="max-w-[1200px] mx-auto px-6 py-10">

                    {/* ── Tax Return ── */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[9px] font-black tracking-[0.3em] uppercase px-2 py-1 bg-[#ccff00]/10 text-[#ccff00]">
                                {lang === 'en' ? 'PART 1' : 'BÖLÜM 1'}
                            </span>
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                {lang === 'en' ? 'TAX RETURN — WHAT IS IT & HOW?' : 'TAX RETURN — NEDİR, NASIL YAPILIR?'}
                            </h2>
                        </div>

                        {/* Key info cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#ccff00] mb-1">1 Jul – 31 Oct</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    {lang === 'en' ? 'Filing period' : 'Beyanname dönemi'}
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#ccff00] mb-1">$1,000–2,500</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    {lang === 'en' ? 'Average refund (AUD)' : 'Ortalama iade (AUD)'}
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#ccff00] mb-1">%0</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    {lang === 'en' ? 'Cost via myTax' : 'myTax ücreti'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 p-6 mb-4">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                {lang === 'en' ? 'HOW IT WORKS' : 'NASIL ÇALIŞIR'}
                            </p>
                            <div className="space-y-1">
                                <InfoRow
                                    label="Nedir" labelEn="What"
                                    value={lang === 'en'
                                        ? "Everyone who works in Australia files an annual tax return."
                                        : "Avustralya'da çalışan herkes yılda bir kez vergi beyannamesi verir."}
                                    lang={lang}
                                />
                                <InfoRow
                                    label="Nasıl yapılır" labelEn="How to do it"
                                    value="myGov → ATO → myTax"
                                    lang={lang}
                                />
                                <InfoRow
                                    label="Ücret" labelEn="Cost"
                                    value={lang === 'en' ? "Free (myTax). Tax agents charge 10–15%." : "Ücretsiz (myTax). Tax agent kullanırsan %10–15 komisyon alır."}
                                    lang={lang}
                                />
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="border border-[#ccff00]/20 bg-[#ccff00]/5 p-4 flex items-start gap-3">
                            <AlertTriangle size={16} className="text-[#ccff00] shrink-0 mt-0.5" />
                            <p className="text-sm text-white/60">
                                {lang === 'en'
                                    ? "myTax is free and easy enough. You don't need a tax agent for a standard return. The average fee is $150–300 AUD — money you don't need to spend."
                                    : "myTax ücretsiz ve yeterince kolay. Standart beyanname için tax agent'e ihtiyacın yok. Ortalama ücret $150–300 AUD — harcamana gerek yok."}
                            </p>
                        </div>

                        {/* Step by step */}
                        <div className="mt-6">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                {lang === 'en' ? 'STEP-BY-STEP: myTAX' : 'ADIM ADIM: myTAX'}
                            </p>
                            <div className="space-y-2">
                                {(lang === 'en' ? [
                                    "Log in to myGov (mygov.gov.au) — create an account if you don't have one",
                                    "Link your ATO service (requires your TFN)",
                                    "Navigate to ATO → Tax → Lodge a return",
                                    "Most information is pre-filled — check your income, deductions, bank details",
                                    "Add any work-related expenses (uniform, tools, travel for work, etc.)",
                                    "Review and submit — refund typically arrives within 2 weeks",
                                ] : [
                                    "myGov'a giriş yap (mygov.gov.au) — yoksa hesap oluştur",
                                    "ATO hizmetini bağla (TFN gerekiyor)",
                                    "ATO → Tax → Lodge a return yolunu izle",
                                    "Çoğu bilgi önceden doldurulmuş gelir — gelir, kesintiler, banka bilgilerini kontrol et",
                                    "İşle ilgili masrafları ekle (üniforma, araç-gereç, iş seyahati vb.)",
                                    "İncele ve gönder — iade genellikle 2 hafta içinde gelir",
                                ]).map((step, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-[#111] border border-white/5 p-4">
                                        <span className="text-[#ccff00] font-black text-sm w-5 shrink-0">{i + 1}.</span>
                                        <p className="text-sm text-white/60">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Superannuation ── */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[9px] font-black tracking-[0.3em] uppercase px-2 py-1 bg-[#a78bfa]/10 text-[#a78bfa]">
                                {lang === 'en' ? 'PART 2' : 'BÖLÜM 2'}
                            </span>
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                {lang === 'en' ? 'SUPERANNUATION' : 'SUPERANNUATION NEDİR?'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-2xl font-black text-[#a78bfa] mb-1">%12</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    {lang === 'en' ? 'Employer contribution' : 'İşveren katkısı'}
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-xl font-black text-[#a78bfa] mb-1">DASP</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    {lang === 'en' ? 'Claim when you leave' : 'Ayrılınca geri al'}
                                </p>
                            </div>
                            <div className="bg-[#111] border border-white/5 p-5 text-center">
                                <p className="text-xl font-black text-[#a78bfa] mb-1">myGov</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">
                                    {lang === 'en' ? 'Track your balance' : 'Bakiyeni takip et'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#111] border border-white/5 p-6 mb-4">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                {lang === 'en' ? 'KEY FACTS' : 'TEMEL BİLGİLER'}
                            </p>
                            <div className="space-y-1">
                                <InfoRow
                                    label="Ne?" labelEn="What?"
                                    value={lang === 'en'
                                        ? "Your employer is legally required to contribute 12% of your salary to your retirement fund (from 1 July 2025)."
                                        : "İşverenin maaşının %12'sini senin emeklilik fonuna yatırması yasal zorunluluk (1 Temmuz 2025'ten itibaren)."}
                                    lang={lang}
                                />
                                <InfoRow
                                    label="Takip" labelEn="Tracking"
                                    value={lang === 'en'
                                        ? "myGov → ATO → Your super accounts are visible there."
                                        : "myGov → ATO → Super hesabın görünür."}
                                    lang={lang}
                                />
                                <InfoRow
                                    label="Birden fazla iş" labelEn="Multiple jobs"
                                    value={lang === 'en'
                                        ? "If you work multiple jobs, each may open a separate super fund. Consolidate them — don't let money go to waste."
                                        : "Birden fazla işte çalışırsan her biri ayrı super fonu açabilir. Bunları birleştir, para boşa gitmesin."}
                                    lang={lang}
                                />
                                <InfoRow
                                    label="Avustralya'yı terk et" labelEn="Leaving Australia"
                                    value={lang === 'en'
                                        ? "When you permanently leave Australia, you can claim it back — this is called DASP (Departing Australia Superannuation Payment)."
                                        : "Avustralya'yı kalıcı olarak terk edersen geri alabilirsin — buna DASP (Departing Australia Superannuation Payment) deniyor."}
                                    lang={lang}
                                />
                                <InfoRow
                                    label="Popüler fonlar" labelEn="Popular funds"
                                    value={lang === 'en'
                                        ? "Australian Super, Hostplus are the most common."
                                        : "Australian Super, Hostplus en yaygın."}
                                    lang={lang}
                                />
                            </div>
                        </div>

                        {/* DASP steps */}
                        <div className="mt-6">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 mb-4">
                                {lang === 'en' ? 'DASP — HOW TO CLAIM WHEN LEAVING' : 'DASP — ÇIKARKEN GERİ NASIL ALINIR'}
                            </p>
                            <div className="space-y-2">
                                {(lang === 'en' ? [
                                    "Leave Australia permanently (or let your visa expire)",
                                    "Apply via the ATO DASP portal (ato.gov.au/dasp)",
                                    "Provide your super fund details, TFN and passport",
                                    "Payment is processed within a few weeks — note: there's a 65% tax applied to working holiday makers",
                                ] : [
                                    "Avustralya'yı kalıcı olarak terk et (veya vizen dolsun)",
                                    "ATO DASP portalından başvur (ato.gov.au/dasp)",
                                    "Super fon bilgilerini, TFN ve pasaportununu gir",
                                    "Ödeme birkaç hafta içinde işleniyor — not: working holiday vizesiyle çalışanlara %65 vergi uygulanıyor",
                                ]).map((step, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-[#111] border border-white/5 p-4">
                                        <span className="text-[#a78bfa] font-black text-sm w-5 shrink-0">{i + 1}.</span>
                                        <p className="text-sm text-white/60">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related links */}
                    <div className="bg-[#111] border border-white/5 p-6 mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                            {lang === 'en' ? 'USEFUL LINKS' : 'YARARLI LİNKLER'}
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: 'myGov', url: 'https://my.gov.au' },
                                { label: 'ATO — myTax', url: 'https://ato.gov.au' },
                                { label: 'ATO — DASP', url: 'https://ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/temporary-residents-and-super/temporary-resident-departing-australia-superannuation-payment' },
                            ].map(link => (
                                <a
                                    key={link.url}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 border border-white/5 hover:border-[#ccff00]/30 hover:text-[#ccff00] transition-all group"
                                >
                                    <span className="text-sm font-bold text-white/60 group-hover:text-[#ccff00]">{link.label}</span>
                                    <ExternalLink size={13} className="text-white/20 group-hover:text-[#ccff00]" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default VergiVeSuperPage;
