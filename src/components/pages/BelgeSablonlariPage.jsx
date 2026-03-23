import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, Download, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';

const templates = [
    {
        id: 'gte',
        title: 'GTE Kişisel Beyan Mektubu',
        titleEn: 'GTE Personal Statement Letter',
        desc: 'Genuine Temporary Entrant — öğrenci vizesi (500) başvurusunda Avustralya\'ya gerçekten eğitim amaçlı geldiğini kanıtlayan mektup.',
        descEn: 'Genuine Temporary Entrant — a letter proving you are genuinely coming to Australia for education purposes in a student visa (500) application.',
        docxFile: 'gte-beyan-mektubu.docx',
        warning: 'Bu şablonu kopyala-yapıştır yapma. Kendi cümlelerinle yaz. GTE reddi çok yaygın ve en sık sebebi kopyalanmış metinler.',
        warningEn: 'Do NOT copy-paste this template. Write it in your own words. GTE refusals are very common and the most frequent cause is copied text.',
        sections: [
            {
                heading: 'Neden bu okulu/programı seçtim',
                headingEn: 'Why I chose this school/program',
                content: `[Program adı] programını seçmemin temel nedeni, [kariyer hedefin] doğrultusunda [okulun sunduğu özel katkı]'dan yararlanmak istememdir. Bu program, Türkiye'de edindiğim [mevcut deneyim/eğitim] üzerine inşa ederek [belirli beceri/bilgi]'yi geliştirmeme olanak tanıyacak.`,
                contentEn: `The primary reason I chose the [program name] is to benefit from [what the school offers] in line with my career goal of [career goal]. This program will allow me to build on my existing [experience/education from Turkey] and develop [specific skill/knowledge].`,
            },
            {
                heading: 'Neden Avustralya\'yı seçtim',
                headingEn: 'Why I chose Australia',
                content: `Avustralya'yı seçmemin nedenleri: [eğitim kalitesi, program içeriği, çalışma imkânı, güvenli ortam gibi somut gerekçeler]. Bu destinasyonun [spesifik avantajı] benim için belirleyici oldu.`,
                contentEn: `My reasons for choosing Australia include: [specific reasons such as education quality, course content, work opportunities, safe environment]. [Specific advantage] of this destination was decisive for me.`,
            },
            {
                heading: 'Türkiye\'ye dönüş niyetim',
                headingEn: 'My intention to return to Turkey',
                content: `Avustralya'ya gelişim tamamen eğitim amaçlıdır. Programı tamamladıktan sonra Türkiye'ye dönüp [edindiğim bilgileri/sertifikaları] kullanarak [kariyer planı] gerçekleştirmeyi planlıyorum. Türkiye'deki bağlarım: [aile, mülk, iş fırsatı gibi somut bağlar].`,
                contentEn: `My visit to Australia is entirely for educational purposes. After completing the program, I plan to return to Turkey and use my [acquired knowledge/qualifications] to [career plan]. My ties to Turkey include: [family, property, job opportunity or other tangible ties].`,
            },
            {
                heading: 'Kariyer hedeflerim',
                headingEn: 'My career goals',
                content: `Bu eğitim sayesinde [belirli meslek alanı]'nda ilerlemek istiyorum. Avustralya'da edineceğim [özellikle ne] bilgisi/deneyimi, Türkiye'deki [sektör/alan]'da rekabetçi olmamı sağlayacak.`,
                contentEn: `Through this education, I aim to advance in the field of [specific profession]. The [specific knowledge/experience] I gain in Australia will make me competitive in the [sector/field] in Turkey.`,
            },
        ],
    },
    {
        id: '482',
        title: 'İşveren Sponsor Mektubu — 482 Vizesi',
        titleEn: 'Employer Sponsorship Letter — 482 Visa',
        desc: 'TSS (482) vize başvurusunda işverenden alınması gereken sponsorluk mektubu şablonu.',
        descEn: 'Template for the employer sponsorship letter required for a TSS (482) visa application.',
        docxFile: '482-sponsor-mektubu.docx',
        warning: null,
        sections: [
            {
                heading: 'Mektupta Bulunması Gerekenler',
                headingEn: 'What Must Be in the Letter',
                content: `• İşin tam tanımı ve ANZSCO kodu\n• Teklif edilen maaş ve çalışma saatleri\n• Neden Avustralyalı çalışan bulunamadığı (labor market testing belgesi)\n• İşverenin Standard Business Sponsorship (SBS) akreditasyon numarası\n• İşyeri adresi ve iletişim bilgileri\n• İmza ve kaşe`,
                contentEn: `• Full job description and ANZSCO code\n• Offered salary and working hours\n• Why an Australian worker could not be found (labor market testing documentation)\n• Employer's Standard Business Sponsorship (SBS) accreditation number\n• Workplace address and contact details\n• Signature and company seal`,
            },
            {
                heading: 'Labor Market Testing Nedir?',
                headingEn: 'What is Labor Market Testing?',
                content: `İşveren, seni sponsorlamadan önce en az 4 hafta süreyle Avustralyalı çalışan aradığını kanıtlamalıdır. Bu kanıt olmadan başvuru reddedilir. Seek.com.au, LinkedIn ve Indeed ilanlarının ekran görüntüleri ve yanıt kayıtları bu sürecin parçasıdır.`,
                contentEn: `Before sponsoring you, the employer must prove they advertised for an Australian worker for at least 4 weeks. Without this proof, the application will be refused. Screenshots of Seek.com.au, LinkedIn and Indeed ads, along with response records, form part of this process.`,
            },
        ],
    },
    {
        id: 'cv',
        title: 'Avustralya CV Formatı',
        titleEn: 'Australian CV Format',
        desc: 'Avustralya\'da CV formatı Türkiye\'den farklı. Fotoğraf eklenmez, kişisel bilgiler minimumda tutulur.',
        descEn: 'CV format in Australia differs from Turkey. No photo, personal details are kept to a minimum.',
        docxFile: 'avustralya-cv.docx',
        warning: 'Avustralya CV\'sine fotoğraf, doğum tarihi, medeni durum veya milliyet yazma. Bu bilgiler HR tarafından olumsuz karşılanır.',
        warningEn: 'Do NOT include a photo, date of birth, marital status, or nationality in an Australian CV. These details are viewed negatively by HR.',
        sections: [
            {
                heading: 'CV Yapısı',
                headingEn: 'CV Structure',
                content: `[AD SOYAD]\n[Şehir, Eyalet] | [Telefon] | [E-posta] | [LinkedIn — varsa]\n\nPROFESSIONAL SUMMARY\n[2–3 cümlelik özet]\n\nWORK EXPERIENCE\n[Pozisyon] — [Şirket], [Şehir] | [Tarih aralığı]\n- [Sorumluluk/başarı]\n\nEDUCATION\n[Derece] — [Kurum] | [Tarih]\n\nSKILLS\n[Beceri 1] | [Beceri 2] | [Beceri 3]\n\nREFERENCES\nAvailable upon request.`,
                contentEn: `[FULL NAME]\n[City, State] | [Phone] | [Email] | [LinkedIn — if available]\n\nPROFESSIONAL SUMMARY\n[2–3 sentence summary]\n\nWORK EXPERIENCE\n[Position] — [Company], [City] | [Date range]\n- [Responsibility/achievement]\n\nEDUCATION\n[Degree] — [Institution] | [Date]\n\nSKILLS\n[Skill 1] | [Skill 2] | [Skill 3]\n\nREFERENCES\nAvailable upon request.`,
            },
            {
                heading: 'Avustralya CV Kuralları',
                headingEn: 'Australian CV Rules',
                content: `✗ Fotoğraf ekleme\n✗ Doğum tarihi yazma\n✗ Medeni durum, milliyet, din yazma\n✓ Maksimum 2 sayfa (deneyimliysen 3)\n✓ İngilizce yaz\n✓ Başarıları rakamla destekle ("X% artış sağladım")\n✓ Her başvuruya göre özelleştir\n✓ 2 referans hazır tut, istendiğinde ver`,
                contentEn: `✗ No photo\n✗ No date of birth\n✗ No marital status, nationality or religion\n✓ Maximum 2 pages (3 if experienced)\n✓ Write in English\n✓ Support achievements with numbers ("achieved X% increase")\n✓ Tailor for each application\n✓ Have 2 references ready, provide when asked`,
            },
        ],
    },
    {
        id: 'coverletter',
        title: 'Cover Letter (Ön Yazı) Şablonu',
        titleEn: 'Cover Letter Template',
        desc: 'Avustralya iş başvurularında CV\'ye eklenen kısa tanıtım mektubu. İşverene göre özelleştirilmeli.',
        descEn: 'A short introduction letter attached to your CV in Australian job applications. Must be tailored for each employer.',
        docxFile: 'cover-letter.docx',
        warning: null,
        sections: [
            {
                heading: 'Cover Letter Şablonu',
                headingEn: 'Cover Letter Template',
                content: `[TARİH]\n\n[İŞVEREN / İK YETKİLİSİ ADI varsa]\n[ŞİRKET ADI]\n[ADRES]\n\nRe: Application for [POZİSYON ADI] — [İLAN REFERANS KODU varsa]\n\nDear [İsim varsa / Dear Hiring Manager],\n\nI am writing to express my interest in the [POZİSYON ADI] position advertised on [PLATFORM]. With [X years] of experience in [sektör/alan], I am confident that my skills in [beceri 1] and [beceri 2] make me a strong candidate for this role.\n\nIn my previous role at [ŞİRKET], I [spesifik bir başarı veya sorumluluk — rakamla destekle]. This experience has equipped me with [bu pozisyon için değerli bir beceri].\n\nI am particularly drawn to [ŞİRKET ADI] because [şirkete neden ilgi duyduğunuzu kısaca belirtin — araştır, samimi ol].\n\nI would welcome the opportunity to discuss how my experience aligns with your team's needs. Please find my resume attached for your consideration.\n\nThank you for your time.\n\nYours sincerely,\n[AD SOYAD]\n[TELEFON]\n[E-POSTA]`,
                contentEn: `[DATE]\n\n[EMPLOYER / HR CONTACT NAME if available]\n[COMPANY NAME]\n[ADDRESS]\n\nRe: Application for [POSITION NAME] — [AD REFERENCE NUMBER if available]\n\nDear [Name if available / Dear Hiring Manager],\n\nI am writing to express my interest in the [POSITION NAME] position advertised on [PLATFORM]. With [X years] of experience in [industry/field], I am confident that my skills in [skill 1] and [skill 2] make me a strong candidate for this role.\n\nIn my previous role at [COMPANY], I [specific achievement or responsibility — support with numbers]. This experience has equipped me with [a skill valuable for this position].\n\nI am particularly drawn to [COMPANY NAME] because [briefly state why you are interested — research it, be genuine].\n\nI would welcome the opportunity to discuss how my experience aligns with your team's needs. Please find my resume attached for your consideration.\n\nThank you for your time.\n\nYours sincerely,\n[FULL NAME]\n[PHONE]\n[EMAIL]`,
            },
        ],
    },
    {
        id: 'referans',
        title: 'Referans Mektubu Şablonu',
        titleEn: 'Reference Letter Template',
        desc: 'Avustralya\'da iş başvurularında referans mektubu beklentisi yüksek. Önceki işverenden istenecek şablon.',
        descEn: 'Reference letters are highly expected in Australian job applications. A template to request from a previous employer.',
        docxFile: 'referans-mektubu.docx',
        warning: null,
        sections: [
            {
                heading: 'Referans Mektubu Şablonu',
                headingEn: 'Reference Letter Template',
                content: `[TARİH]\n\nTo Whom It May Concern,\n\nI am writing to recommend [ÇALIŞANIN ADI] who worked with us at [ŞİRKET ADI] as a [POZİSYON] from [BAŞLAMA TARİHİ] to [BIRAKMA TARİHİ].\n\nDuring their time with us, [AD] consistently demonstrated [özellik 1] and [özellik 2]. Key contributions included:\n\n- [Başarı veya sorumluluk 1]\n- [Başarı veya sorumluluk 2]\n\n[AD] was a reliable, punctual and positive team member. I would not hesitate to recommend them for a similar role.\n\nPlease feel free to contact me for further information.\n\nYours sincerely,\n\n[YETKİLİ KİŞİ AD SOYAD]\n[ÜNVAN]\n[ŞİRKET]\n[E-POSTA]\n[TELEFON]`,
                contentEn: `[DATE]\n\nTo Whom It May Concern,\n\nI am writing to recommend [EMPLOYEE NAME] who worked with us at [COMPANY NAME] as a [POSITION] from [START DATE] to [END DATE].\n\nDuring their time with us, [NAME] consistently demonstrated [quality 1] and [quality 2]. Key contributions included:\n\n- [Achievement or responsibility 1]\n- [Achievement or responsibility 2]\n\n[NAME] was a reliable, punctual and positive team member. I would not hesitate to recommend them for a similar role.\n\nPlease feel free to contact me for further information.\n\nYours sincerely,\n\n[AUTHORISED PERSON FULL NAME]\n[TITLE]\n[COMPANY]\n[EMAIL]\n[PHONE]`,
            },
        ],
    },
    {
        id: 'kira',
        title: 'Kira Sözleşmesi — Nelere Dikkat Et',
        titleEn: 'Rental Agreement — What to Watch Out For',
        desc: 'Avustralya\'da kira sözleşmesi imzalamadan önce bilmen gereken temel maddeler. Her eyaletin resmi formu farklı.',
        descEn: 'Key clauses you need to know before signing a rental agreement in Australia. Each state has its own official form.',
        warning: null,
        stateLinks: [
            { state: 'QLD', org: 'RTA', url: 'https://www.rta.qld.gov.au/forms-resources/forms' },
            { state: 'NSW', org: 'NSW Fair Trading', url: 'https://www.fairtrading.nsw.gov.au/housing-and-property/renting' },
            { state: 'VIC', org: 'Consumer Affairs Victoria', url: 'https://www.consumer.vic.gov.au/housing/renting' },
            { state: 'WA', org: 'Tenancy WA', url: 'https://www.tenancywa.org.au' },
        ],
        sections: [
            {
                heading: 'Bond (Depozito)',
                headingEn: 'Bond (Security Deposit)',
                content: `Genellikle 4 haftalık kira tutarı. İlgili eyalet kiracılık kurumuna (QLD'da RTA, NSW'de Fair Trading gibi) yasal güvence altındadır. Bond, kiralama sona erene kadar bu kurumda tutulur ve ev sahibi doğrudan alamaz.`,
                contentEn: `Usually 4 weeks' rent. Legally protected through the relevant state tenancy authority (RTA in QLD, Fair Trading in NSW, etc.). The bond is held by this authority until the tenancy ends — the landlord cannot access it directly.`,
            },
            {
                heading: 'Entry Condition Report',
                headingEn: 'Entry Condition Report',
                content: `Evin durumunu giriş günü belgele, her odayı fotoğrafla. Bu raporu doldur, imzalı kopyasını sakla. Çıkarken sorun yaşamamak için şart.`,
                contentEn: `Document the condition of the property on move-in day, photograph every room. Fill in the report and keep a signed copy. Essential to avoid disputes when you leave.`,
            },
            {
                heading: 'Notice Period',
                headingEn: 'Notice Period',
                content: `Erken çıkmak istersen genellikle 2–4 hafta önceden yazılı bildirim zorunlu. Sözleşmeyi erken feshedersen reletting fee ödeyebilirsin. Eyalete göre değişir.`,
                contentEn: `If you want to leave early, written notice is generally required 2–4 weeks in advance. Breaking the lease early may incur a reletting fee. Varies by state.`,
            },
            {
                heading: 'Flatmate Farkı',
                headingEn: 'Flatmate vs Tenant',
                content: `Flatmate olarak giriyorsan resmi kiracı değilsin, hakların farklı. Master kiracı ile arandaki ilişki devlet güvencesi kapsamında olmayabilir. Dikkat et.`,
                contentEn: `If you're a flatmate, you are not an official tenant — your rights are different. The relationship between you and the master tenant may not be covered by state tenancy protections. Be careful.`,
            },
        ],
    },
    {
        id: 'banka',
        title: 'Banka Hesabı Açılışı İçin Gerekli Evrak',
        titleEn: 'Documents Required to Open a Bank Account',
        desc: 'Avustralya\'da ilk kez banka hesabı açarken ihtiyacın olan belgeler.',
        descEn: 'Documents you need when opening your first bank account in Australia.',
        warning: null,
        sections: [
            {
                heading: 'Zorunlu Belgeler',
                headingEn: 'Required Documents',
                content: `• Pasaport (zorunlu)\n• Avustralya adresi (konakladığın yer yeterli — hotel veya hostel de olabilir)\n• Avustralya telefon numarası (şart değil ama olması iyi)\n• TFN (zorunlu değil ama olmadan %47 stopaj kesilir — en kısa sürede ekle)`,
                contentEn: `• Passport (mandatory)\n• Australian address (your accommodation is fine — hotel or hostel works)\n• Australian phone number (not mandatory but helpful)\n• TFN (not mandatory but without it a 47% tax is withheld — add it as soon as possible)`,
            },
            {
                heading: 'Önerilen Bankalar',
                headingEn: 'Recommended Banks',
                content: `CommBank, NAB, Westpac büyük bankalardır. Online başvuru mümkün ama ilk kez açıyorsan şubeye gitmen daha güvenli. CommBank öğrenci hesabı için ek avantaj sunabilir.`,
                contentEn: `CommBank, NAB, and Westpac are the major banks. Online applications are possible, but for a first-time account, visiting a branch is safer. CommBank may offer extra benefits for student accounts.`,
            },
        ],
    },
    {
        id: 'tfn',
        title: 'TFN (Tax File Number) Başvuru Rehberi',
        titleEn: 'TFN (Tax File Number) Application Guide',
        desc: 'Avustralya\'da çalışmak için şart olan vergi numarası nasıl alınır.',
        descEn: 'How to get the tax number required to work in Australia.',
        warning: null,
        sections: [
            {
                heading: 'Başvuru Süreci',
                headingEn: 'Application Process',
                content: `1. ato.gov.au adresine git\n2. "Apply for a TFN" bölümüne tıkla\n3. Online formu doldur (pasaport ve vize bilgileri gerekiyor)\n4. Onay e-postasını kaydet\n5. TFN posta ile geliyor — 1–2 hafta bekle`,
                contentEn: `1. Go to ato.gov.au\n2. Click on "Apply for a TFN"\n3. Complete the online form (passport and visa details required)\n4. Save your confirmation email\n5. TFN arrives by post — allow 1–2 weeks`,
            },
            {
                heading: 'Önemli Notlar',
                headingEn: 'Important Notes',
                content: `• TFN olmadan çalışmak yasak değil ama işveren %47 vergi keser\n• TFN numaranı asla başkasıyla paylaşma\n• TFN'yi myGov hesabına bağla\n• Birden fazla TFN alamazsın — kaybolursa ATO'dan sorgula`,
                contentEn: `• Working without a TFN is not illegal but your employer must withhold 47% tax\n• Never share your TFN with others\n• Link your TFN to your myGov account\n• You cannot have more than one TFN — if lost, query through the ATO`,
            },
        ],
    },
];

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border transition-all ${copied
                ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/10'
                : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'}`}
        >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
        </button>
    );
};

const DownloadButton = ({ filename, lang }) => (
    <a
        href={`/templates/${filename}`}
        download
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border border-[#ccff00]/40 text-[#ccff00] hover:bg-[#ccff00]/10 transition-all"
    >
        <Download size={11} />
        {lang === 'en' ? '.docx Download' : '.docx İndir'}
    </a>
);

const TemplateCard = ({ tmpl, lang }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-[#111] border border-white/5 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-start justify-between p-6 text-left hover:bg-white/3 transition-colors group gap-4"
            >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-[#ccff00]/10 shrink-0 mt-0.5">
                        <FileText size={16} className="text-[#ccff00]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black uppercase tracking-tight text-white group-hover:text-[#ccff00] transition-colors leading-snug mb-1">
                            {lang === 'en' ? (tmpl.titleEn || tmpl.title) : tmpl.title}
                        </h3>
                        <p className="text-xs text-white/40 leading-relaxed">
                            {lang === 'en' ? (tmpl.descEn || tmpl.desc) : tmpl.desc}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-1">
                    {tmpl.docxFile && (
                        <DownloadButton filename={tmpl.docxFile} lang={lang} />
                    )}
                    {open
                        ? <ChevronUp size={16} className="text-[#ccff00]" />
                        : <ChevronDown size={16} className="text-white/20" />}
                </div>
            </button>

            {open && (
                <div className="border-t border-white/5 p-6">
                    {/* Warning */}
                    {tmpl.warning && (
                        <div className="flex items-start gap-2 bg-[#ff6b6b]/5 border border-[#ff6b6b]/20 p-4 mb-5">
                            <AlertTriangle size={14} className="text-[#ff6b6b] shrink-0 mt-0.5" />
                            <p className="text-xs text-[#ff6b6b]/80 leading-relaxed font-medium">
                                {lang === 'en' ? (tmpl.warningEn || tmpl.warning) : tmpl.warning}
                            </p>
                        </div>
                    )}

                    {/* Sections */}
                    <div className="space-y-4">
                        {tmpl.sections.map((s, i) => (
                            <div key={i} className="border border-white/5 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-white/3 border-b border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                        {lang === 'en' ? (s.headingEn || s.heading) : s.heading}
                                    </span>
                                    <CopyButton text={lang === 'en' ? (s.contentEn || s.content) : s.content} />
                                </div>
                                <pre className="p-4 text-xs text-white/60 leading-relaxed whitespace-pre-wrap font-sans">
                                    {lang === 'en' ? (s.contentEn || s.content) : s.content}
                                </pre>
                            </div>
                        ))}
                    </div>

                    {/* State Links (for rental agreement) */}
                    {tmpl.stateLinks && (
                        <div className="mt-5 border border-white/5 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
                                {lang === 'en' ? 'OFFICIAL RENTAL FORMS BY STATE' : 'EYALETE GÖRE RESMİ KİRA SÖZLEŞMESİ FORMU'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {tmpl.stateLinks.map(sl => (
                                    <a
                                        key={sl.state}
                                        href={sl.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs border border-white/5 px-3 py-2 hover:border-white/20 transition-colors group"
                                    >
                                        <span className="font-black text-white/50 w-10 shrink-0">{sl.state}</span>
                                        <span className="text-white/30 group-hover:text-white/60 transition-colors flex-1">{sl.org}</span>
                                        <ExternalLink size={11} className="text-white/20 group-hover:text-[#ccff00] transition-colors shrink-0" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const BelgeSablonlariPage = () => {
    const { lang } = useLanguage();

    return (
        <>
            <SEOHead
                title={lang === 'en' ? "Document Templates" : "Belge Şablonları"}
                description={lang === 'en'
                    ? "All document templates you'll need throughout the Australian immigration process. Download as .docx or copy sections."
                    : "Avustralya göç sürecinde ihtiyaç duyacağın tüm belge örnekleri. .docx olarak indir veya kopyala."}
                path="/belge-sablonlari"
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
                                {lang === 'en' ? 'TOOLS — TEMPLATES' : 'ARAÇLAR — ŞABLONLAR'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2.5 bg-[#ccff00]">
                                <FileText className="text-black" size={28} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                {lang === 'en' ? 'DOCUMENT TEMPLATES' : 'BELGE ŞABLONLARI'}
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium max-w-2xl">
                            {lang === 'en'
                                ? "All document templates you'll need throughout the Australian immigration process. Download as .docx or expand to copy sections."
                                : "Avustralya göç sürecinde ihtiyaç duyacağın tüm belge örnekleri. .docx olarak indir veya açıp bölümleri kopyala."}
                        </p>
                    </div>
                </section>

                <div className="max-w-[1000px] mx-auto px-6 py-10">

                    <div className="space-y-3">
                        {templates.map(tmpl => (
                            <TemplateCard key={tmpl.id} tmpl={tmpl} lang={lang} />
                        ))}
                    </div>

                    <div className="mt-8 bg-[#111] border border-white/5 p-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">
                            {lang === 'en' ? 'NEED A SPECIFIC TEMPLATE?' : 'ÖZEL BİR ŞABLONA MI İHTİYACIN VAR?'}
                        </p>
                        <p className="text-sm text-white/50 mb-4">
                            {lang === 'en'
                                ? "If you need a template that isn't listed here, get in touch."
                                : "Burada olmayan bir şablona ihtiyacın varsa, bize ulaş."}
                        </p>
                        <a
                            href="mailto:migron@mtive.tech"
                            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-5 py-2.5 font-black uppercase text-xs hover:brightness-110 transition-all"
                        >
                            migron@mtive.tech
                        </a>
                    </div>

                    <YouTubeBox />
                </div>
            </div>
        </>
    );
};

export default BelgeSablonlariPage;
