import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';
import LiveExperimentBand from '../shared/LiveExperimentBand';

const CHECKLIST_KEY = 'migron_48h_checklist';

const sections = [
    {
        id: 's1',
        timeLabel: '0 — 2. SAAT',
        timeLabelEn: 'HOUR 0 — 2',
        title: 'Havalimanından Çıkar Çıkmaz',
        titleEn: 'Right Out of the Airport',
        color: '#ccff00',
        steps: [
            {
                id: 'sim',
                text: 'Avustralya SIM kartı al — Woolworths Mobile önerilir (en ucuz, Telstra altyapısı). ~$10–30 AUD, 28 günlük plan al. Havalimanında Optus ve Vodafone da var.',
                textEn: 'Get an Australian SIM card — Woolworths Mobile recommended (cheapest, Telstra network). ~$10–30 AUD, get a 28-day plan. Optus and Vodafone also available at the airport.',
            },
            {
                id: 'cash',
                text: 'Para çek veya kur kontrol et — havalimanı ATM\'leri komisyon alır. Şehir merkezine kadar dayanabilirsen daha iyi kur alırsın.',
                textEn: 'Withdraw cash or check exchange rates — airport ATMs charge fees. You\'ll get a better rate if you can wait until the city centre.',
            },
            {
                id: 'address',
                text: 'Konaklama adresini telefona kaydet — ilk geceyi önceden ayarlamış olman gerekiyor. Yoksa havalimanındaki tourist info\'ya git.',
                textEn: 'Save your accommodation address on your phone — you should have your first night sorted already. If not, head to the airport tourist info desk.',
            },
        ],
    },
    {
        id: 's2',
        timeLabel: '2 — 4. SAAT',
        timeLabelEn: 'HOUR 2 — 4',
        title: 'Şehre Ulaş',
        titleEn: 'Get to the City',
        color: '#00d4ff',
        steps: [
            {
                id: 'airtrain',
                text: 'Havalimanından şehre ulaşım — her şehrin havalimanı treni veya ekspres otobüsü var. Bilet fiyatları şehre göre değişir, havalimanı ulaşım tabelalarını takip et. Büyük şehirlerde genellikle $10–25 AUD arası.',
                textEn: 'Airport to city transport — every major city has an airport train or express bus. Prices vary by city, follow airport transport signs. Generally $10–25 AUD in major cities.',
            },
            {
                id: 'gocard',
                text: 'Şehrin ulaşım kartını al — her eyaletin kendine özgü toplu taşıma kartı var (Opal kart — NSW, Myki — VIC, Go Card — QLD, SmartRider — WA). Havalimanı veya yakın istasyondan temin edilebilir. Nakit yerine kart kullanmak %20–30 daha ucuz.',
                textEn: 'Get your city\'s transit card — each state has its own public transport card (Opal — NSW, Myki — VIC, Go Card — QLD, SmartRider — WA). Available at the airport or nearby stations. Using a card is 20–30% cheaper than paying cash.',
            },
        ],
    },
    {
        id: 's3',
        timeLabel: '1. GÜN',
        timeLabelEn: 'DAY 1',
        title: 'Banka ve Kimlik',
        titleEn: 'Bank & Identity',
        color: '#a78bfa',
        steps: [
            {
                id: 'tfn',
                text: 'TFN (Tax File Number) başvurusu yap — ato.gov.au üzerinden online. Posta ile geliyor, 1–2 hafta sürüyor. Çalışmaya başlamadan önce şart.',
                textEn: 'Apply for a TFN (Tax File Number) — online at ato.gov.au. Arrives by post in 1–2 weeks. Required before you start working.',
            },
            {
                id: 'bank',
                text: 'Banka hesabı aç — CommBank veya NAB önerilir. Pasaportunla şubeye git. Gerekli: pasaport + Avustralya adresi (konakladığın yer yeterli).',
                textEn: 'Open a bank account — CommBank or NAB recommended. Go to a branch with your passport. Required: passport + Australian address (your accommodation is fine).',
            },
            {
                id: 'bankphone',
                text: 'Avustralya telefon numaranı bankaya kaydet.',
                textEn: 'Register your Australian phone number with the bank.',
            },
        ],
    },
    {
        id: 's4',
        timeLabel: '2 — 7. GÜN',
        timeLabelEn: 'DAY 2 — 7',
        title: 'İlk Hafta',
        titleEn: 'First Week',
        color: '#ff6b6b',
        steps: [
            {
                id: 'medicare',
                text: 'Medicare durumunu öğren — Türkiye ile Medicare ikili anlaşması yok. Öğrenci vizesiyle tam Medicare hakkın yok. OSHC (Overseas Student Health Cover) vize şartı olarak zaten alınmış olmalı — bunu kontrol et.',
                textEn: 'Check your Medicare status — there\'s no Medicare bilateral agreement between Turkey and Australia. With a student visa you don\'t have full Medicare access. OSHC (Overseas Student Health Cover) should already be in place as a visa requirement — check this.',
            },
            {
                id: 'mygov',
                text: 'myGov hesabı oluştur — mygov.gov.au. TFN gelince bağla. Vergi iadesi, Centrelink, Medicare hepsi buradan yönetiliyor.',
                textEn: 'Create a myGov account — mygov.gov.au. Link your TFN once it arrives. Tax returns, Centrelink, Medicare are all managed from here.',
            },
            {
                id: 'postaladdress',
                text: 'Kalıcı adresini netleştir — TFN ve banka kartın bu adrese geliyor. Posta yönlendirmesi ayarla.',
                textEn: 'Confirm your permanent address — your TFN and bank card will be sent here. Set up mail forwarding if needed.',
            },
            {
                id: 'super',
                text: 'Superannuation hakkında bilgi edin — işe girince işveren hangi super fonunu kullandığını soracak. Australian Super veya Hostplus en yaygın. Maaşının %11\'i işveren tarafından senin adına yatırılıyor. Avustralya\'yı terk edersen geri alınabiliyor.',
                textEn: 'Learn about Superannuation — when you start work, your employer will ask which super fund you use. Australian Super or Hostplus are the most common. Your employer contributes 11% of your salary into your super fund. You can claim it back when you permanently leave Australia.',
            },
        ],
    },
];

const CheckItem = ({ step, checked, onToggle, lang }) => {
    const text = lang === 'en' ? step.textEn : step.text;
    return (
        <button
            onClick={() => onToggle(step.id)}
            className={`w-full flex items-start gap-4 p-4 text-left transition-all border-b border-white/5 last:border-0 group ${checked ? 'opacity-60' : 'hover:bg-white/3'}`}
        >
            <div className="mt-0.5 shrink-0 transition-transform group-active:scale-90">
                {checked
                    ? <CheckCircle2 size={20} className="text-[#ccff00]" />
                    : <Circle size={20} className="text-white/20 group-hover:text-white/40 transition-colors" />}
            </div>
            <p className={`text-sm leading-relaxed ${checked ? 'line-through text-white/30' : 'text-white/70'}`}>
                {text}
            </p>
        </button>
    );
};

const Ilk48SaatPage = () => {
    const { lang } = useLanguage();

    const [checked, setChecked] = useState(() => {
        try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY)) || {}; } catch { return {}; }
    });

    const toggle = (id) => {
        setChecked(prev => {
            const next = { ...prev, [id]: !prev[id] };
            try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next)); } catch {}
            return next;
        });
    };

    const totalSteps = sections.reduce((acc, s) => acc + s.steps.length, 0);
    const doneCount = sections.reduce((acc, s) => acc + s.steps.filter(step => checked[step.id]).length, 0);
    const progress = Math.round((doneCount / totalSteps) * 100);

    const resetAll = () => {
        setChecked({});
        try { localStorage.removeItem(CHECKLIST_KEY); } catch {}
    };

    return (
        <>
            <SEOHead
                title={lang === 'en' ? "First 48 Hours in Australia — Arrival Guide" : "Avustralya'ya İndim, Şimdi Ne Yapacağım?"}
                description={lang === 'en'
                    ? "Step-by-step checklist for your first 48 hours in Australia. Follow along on your phone."
                    : "Avustralya'ya yeni gelen birinin ilk 48 saatte adım adım yapması gerekenler. Telefona bakarak takip et."}
                path="/ilk-48-saat"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

                {/* Hero */}
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[800px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} />
                                {lang === 'en' ? 'Back to Home' : 'Anasayfaya Dön'}
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
                                {lang === 'en' ? 'ARRIVAL GUIDE' : 'VARIŞREHBERI'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2.5 bg-[#ccff00]">
                                <Clock className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                {lang === 'en' ? "FIRST 48 HOURS" : "İLK 48 SAAT"}
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                            {lang === 'en'
                                ? "Just landed in Australia? Follow this step-by-step checklist on your phone. Tap each item as you complete it."
                                : "Avustralya'ya yeni indin mi? Bu listeyi telefona bakarak adım adım takip et. Her adımı tamamladıkça işaretle."}
                        </p>
                    </div>
                </section>

                <div className="max-w-[800px] mx-auto px-6 py-8">

                    <LiveExperimentBand />

                    {/* Progress */}
                    <div className="bg-[#111] border border-white/5 p-5 mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                {lang === 'en' ? 'YOUR PROGRESS' : 'İLERLEMEN'}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-[#ccff00]">{doneCount}/{totalSteps}</span>
                                {doneCount > 0 && (
                                    <button
                                        onClick={resetAll}
                                        className="flex items-center gap-1 text-[10px] text-white/20 hover:text-white/50 transition-colors uppercase tracking-wider"
                                    >
                                        <RotateCcw size={10} />
                                        {lang === 'en' ? 'Reset' : 'Sıfırla'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#ccff00] transition-all duration-500 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {progress === 100 && (
                            <p className="text-xs font-black text-[#ccff00] uppercase tracking-widest mt-3 text-center">
                                {lang === 'en' ? '🎉 All done! Welcome to Australia.' : '🎉 Tamamlandı! Avustralya\'ya hoş geldin.'}
                            </p>
                        )}
                    </div>

                    {/* Sections */}
                    {sections.map(section => {
                        const sectionDone = section.steps.every(s => checked[s.id]);
                        return (
                            <div key={section.id} className="mb-6">
                                {/* Section header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <span
                                        className="text-[9px] font-black tracking-[0.3em] uppercase px-2 py-1"
                                        style={{ backgroundColor: `${section.color}15`, color: section.color }}
                                    >
                                        {lang === 'en' ? section.timeLabelEn : section.timeLabel}
                                    </span>
                                    <h2 className="text-sm font-black uppercase tracking-tight text-white/80">
                                        {lang === 'en' ? section.titleEn : section.title}
                                    </h2>
                                    {sectionDone && (
                                        <CheckCircle2 size={14} className="text-[#ccff00] ml-auto" />
                                    )}
                                </div>

                                {/* Steps */}
                                <div className="bg-[#111] border border-white/5 overflow-hidden">
                                    {section.steps.map(step => (
                                        <CheckItem
                                            key={step.id}
                                            step={step}
                                            checked={!!checked[step.id]}
                                            onToggle={toggle}
                                            lang={lang}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Related links */}
                    <div className="bg-[#111] border border-white/5 p-6 mt-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">
                            {lang === 'en' ? 'WHAT\'S NEXT?' : 'SIRA NE?'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/sertifikalar"
                                className="flex-1 px-4 py-3 border border-[#ccff00]/30 text-[#ccff00] text-xs font-black uppercase tracking-wider hover:bg-[#ccff00]/10 transition-all text-center"
                            >
                                {lang === 'en' ? 'Certificates Guide →' : 'Sertifikalar Rehberi →'}
                            </Link>
                            <Link
                                to="/vergi-ve-super"
                                className="flex-1 px-4 py-3 border border-white/10 text-white/50 text-xs font-black uppercase tracking-wider hover:border-white/30 hover:text-white/70 transition-all text-center"
                            >
                                {lang === 'en' ? 'Tax & Super →' : 'Vergi ve Super →'}
                            </Link>
                        </div>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default Ilk48SaatPage;
