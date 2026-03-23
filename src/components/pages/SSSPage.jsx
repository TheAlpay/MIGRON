import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLanguage } from '../../i18n/LanguageContext';
import SEOHead from '../seo/SEOHead';
import YouTubeBox from '../shared/YouTubeBox';

// ── Varsayılan Veriler (Firebase boşsa bunlar gösterilir) ────────────────────
const defaultFaqDataTr = [
    {
        category: "VİZE & BAŞVURU",
        accent: "#ccff00",
        questions: [
            {
                q: "Avustralya'ya göç etmek için hangi visa türleri mevcuttur?",
                a: "Avustralya'da göçmenlik için birçok vize türü bulunmaktadır: Skilled Independent (189), Skilled Nominated (190), Employer Sponsored (482/186), Partner, Student ve İnsani vizeler bunların başlıcalarıdır. Durumunuza en uygun vizeyi belirlemek için puan hesaplamanızı yapmanız önerilir."
            },
            {
                q: "Puan testi nedir ve nasıl hesaplanır?",
                a: "Point test (puan testi), skilled göçmenlik vizelerinde başvuruculara yaş, İngilizce dil seviyesi, deneyim, eğitim ve diğer faktörlere göre puan verilmesine dayanan bir sistemdir. Skilled Independent (189) vizesi için genellikle 65 puan gereklidir ancak davet puanları çok daha yüksek seyredebilmektedir."
            },
            {
                q: "EOI (Expression of Interest) nedir?",
                a: "EOI, SkillSelect sistemi üzerinden verilen resmi bir ilgi beyanıdır. Puan testine göre havuzda beklediğiniz ve davet beklediğiniz aşamadır. Davet aldıktan sonra 60 gün içinde vize başvurusunu tamamlamanız gerekir."
            },
            {
                q: "Vize başvurusunun ortalama ne kadar sürdüğü?",
                a: "Vize işlem süreleri vize türüne ve bireysel duruma göre büyük farklılıklar göstermektedir. Skilled vizeler için birkaç aydan 2-3 yıla kadar uzayan süreler görülebilmektedir. Partner vizeleri ortalama 12-24 ay sürebilmektedir."
            }
        ]
    },
    {
        category: "İNGİLİZCE SINAVI",
        accent: "#00d4ff",
        questions: [
            {
                q: "IELTS mi, PTE mi tercih etmeliyim?",
                a: "Her iki sınav da geçerlidir. PTE Academic genellikle daha hızlı sonuç verir ve tamamen bilgisayar tabanlıdır. IELTS daha yaygın bilinirliğe sahiptir. Güçlü olduğunuz alanlara göre değerlendirme yapmanızı öneririz. Bazı meslek grupları için Skilled vizede 'Competent English' (IELTS 6.0) yeterli olurken, Extra Points için 'Superior English' (IELTS 8.0) gerekebilir."
            },
            {
                q: "Sınav sonucum kaç yıl geçerlidir?",
                a: "Vize başvuruları için IELTS ve PTE sonuçları genellikle 3 yıl geçerlidir. Ancak bazı eyalet nominesyon programları için farklı süre koşulları uygulanabilmektedir."
            }
        ]
    },
    {
        category: "MESLEK DEĞERLENDİRMESİ",
        accent: "#ff6b6b",
        questions: [
            {
                q: "Skills Assessment (Meslek Değerlendirmesi) nedir?",
                a: "Avustralya'da skilled göçmenlik için mesleğinizin yetkili bir kurum tarafından değerlendirilmesi gerekmektedir. Her mesleğin kendi değerlendirme kurumu vardır (örn: Engineers Australia, VETASSESS, ACS, AHPRA). Bu değerlendirme, Avustralya standartlarına uygunluğunuzu teyit eder."
            },
            {
                q: "Değerlendirme kurumuna hangi belgeler sunulmalıdır?",
                a: "Genellikle; diploma/transkript, iş deneyimi referans mektupları, kimlik belgesi ve İngilizce dil sınav sonuçları istenmektedir. Bazı kurumlar ek belge, proje portföyü veya teknik mülakat talep edebilmektedir."
            },
            {
                q: "Değerlendirme süreci ne kadar sürer?",
                a: "Kuruma ve yoğunluğa göre değişmekle birlikte ortalama 3-6 ay arasında sürmektedir. Engineers Australia ve bazı kurumlar için 8-12 aya kadar uzayan sürelere hazırlıklı olunması tavsiye edilir."
            }
        ]
    },
    {
        category: "KALICI OTURUM & VATANDAŞLIK",
        accent: "#a78bfa",
        questions: [
            {
                q: "PR (Permanent Residency) ne zaman verilir?",
                a: "Skilled vizelerden PR doğrudan alınabilir (subclass 189, 190, 191). Bazı temporary vizelerden (482 gibi) geçiş yapılabilir. TR'den PR'a geçiş için genellikle belirli bir süre çalışma ve yasal ikamet koşulu aranır."
            },
            {
                q: "Vatandaşlık başvurusu için ne kadar süre gereklidir?",
                a: "Avustralya vatandaşlığı için PR aldıktan sonra 4 yıl boyunca Avustralya'da ikamet etmeniz, son 12 ayını PR olarak geçirmiş olmanız ve belirli yasallık koşullarını sağlamanız gerekmektedir."
            }
        ]
    },
    {
        category: "ÇALIŞMA & GÜNLÜK HAYAT",
        accent: "#00ff88",
        questions: [
            {
                q: "Öğrenci vizesiyle Avustralya'da çalışabilir miyim?",
                a: "Evet. 2023 değişikliğiyle haftada 48 saate kadar çalışılabiliyor. Eski limit haftada 40 saatti. Çalışma hakkın vize izin belgeni (grant notice) kontrol ederek öğrenebilirsin."
            },
            {
                q: "TFN olmadan çalışmaya başlayabilir miyim?",
                a: "Yasal olarak başlayabilirsin ama işveren %47 vergi keser. TFN başvurusunu hemen yap — ato.gov.au üzerinden online, posta ile 1-2 haftada geliyor. Gelene kadar işverenle koordineli ol."
            },
            {
                q: "Avustralya'da yeni biri için en kolay iş hangi sektörde bulunur?",
                a: "Hospitality (kafe/restoran), inşaat yardımcılığı, temizlik ve lojistik. RSA + White Card + Barista sertifikasıyla ilk haftada iş bulmak mümkün. Sertifikalar sayfamıza göz at."
            },
            {
                q: "Brisbane mi, Sydney mi, Melbourne mi — yeni gelen için hangisi daha iyi?",
                a: "Brisbane: Daha düşük kira, 2032 Olimpiyatları nedeniyle büyüyen ekonomi, daha az kalabalık. Sydney: Daha fazla iş imkânı ama çok yüksek yaşam maliyeti. Melbourne: Kültür ve eğitim merkezi, orta maliyet. Yeni gelen ve bütçe odaklı biri için Brisbane öne çıkıyor."
            },
            {
                q: "Dil okulu bittikten sonra ne yapabilirim?",
                a: "Başka bir kursa (TAFE, üniversite) kayıt olarak vize uzatabilirsin. İş deneyimi kazandıktan sonra employer sponsorluğu (482) arayabilirsin. PR yolculuğu için puan hesaplama aracımızı kullanabilirsin."
            },
            {
                q: "Avustralya'da en çok hangi meslekler aranıyor?",
                a: "İnşaat mühendisi, hemşire, elektrikçi, yazılım geliştirici, kaynak ustası en çok aranan meslekler arasında. Şehre göre farklılık var — haritamızdan şehir bazlı talepleri görebilirsin."
            }
        ]
    }
];

const defaultFaqDataEn = [
    {
        category: "VISA & APPLICATION",
        accent: "#ccff00",
        questions: [
            {
                q: "What visa types are available to migrate to Australia?",
                a: "There are many visa options for migration to Australia: Skilled Independent (189), Skilled Nominated (190), Employer Sponsored (482/186), Partner, Student and Humanitarian visas are the main ones. It is recommended that you calculate your points score to determine which visa best suits your situation."
            },
            {
                q: "What is the points test and how is it calculated?",
                a: "The points test is a system used for skilled migration visas where applicants are awarded points based on factors such as age, English language level, work experience, education and other criteria. For the Skilled Independent (189) visa, a minimum of 65 points is typically required; however, invitation cut-offs are often much higher."
            },
            {
                q: "What is an EOI (Expression of Interest)?",
                a: "An EOI is a formal expression of interest submitted through the SkillSelect system. It is the stage where you enter the pool based on your points score and wait for an invitation. Once invited, you have 60 days to complete your visa application."
            },
            {
                q: "How long does a visa application typically take?",
                a: "Visa processing times vary significantly depending on the visa type and individual circumstances. For skilled visas, processing times can range from a few months to 2–3 years. Partner visas typically take around 12–24 months on average."
            }
        ]
    },
    {
        category: "ENGLISH TESTING",
        accent: "#00d4ff",
        questions: [
            {
                q: "Should I take IELTS or PTE?",
                a: "Both exams are accepted. PTE Academic generally delivers results faster and is entirely computer-based. IELTS is more widely recognised. We recommend choosing based on your strengths. For skilled visas, 'Competent English' (IELTS 6.0) may be sufficient for some occupations, while 'Superior English' (IELTS 8.0) may be required for extra points."
            },
            {
                q: "How long are my test results valid for?",
                a: "For visa applications, IELTS and PTE results are generally valid for 3 years. However, some state nomination programs may have different validity requirements."
            }
        ]
    },
    {
        category: "SKILLS ASSESSMENT",
        accent: "#ff6b6b",
        questions: [
            {
                q: "What is a Skills Assessment?",
                a: "For skilled migration to Australia, your occupation must be assessed by a relevant assessing authority. Each occupation has its own assessing body (e.g. Engineers Australia, VETASSESS, ACS, AHPRA). This assessment confirms that your skills and qualifications meet Australian standards."
            },
            {
                q: "What documents do I need to submit to the assessing body?",
                a: "Typically required documents include: your degree/transcripts, employment reference letters, identity documents and English language test results. Some bodies may also request additional documentation, a project portfolio or a technical interview."
            },
            {
                q: "How long does the assessment process take?",
                a: "Processing times vary depending on the body and their current workload, but are generally between 3–6 months. For Engineers Australia and some other bodies, it is advisable to be prepared for timelines of up to 8–12 months."
            }
        ]
    },
    {
        category: "PERMANENT RESIDENCY & CITIZENSHIP",
        accent: "#a78bfa",
        questions: [
            {
                q: "When is PR (Permanent Residency) granted?",
                a: "PR can be obtained directly from skilled visas (subclass 189, 190, 191). Some temporary visas (such as the 482) can lead to PR through a pathway. Transitioning from a temporary visa to PR generally requires a period of employment and lawful residence."
            },
            {
                q: "How long do I need to wait to apply for citizenship?",
                a: "For Australian citizenship, you must have lived in Australia for 4 years after receiving PR, with the last 12 months spent as a permanent resident, and must meet certain lawful residence requirements."
            }
        ]
    },
    {
        category: "WORK & DAILY LIFE",
        accent: "#00ff88",
        questions: [
            {
                q: "Can I work in Australia on a student visa?",
                a: "Yes. As of 2023, you can work up to 48 hours per week. The previous limit was 40 hours. Check your visa grant notice to confirm your specific work conditions."
            },
            {
                q: "Can I start work without a TFN?",
                a: "Legally, yes — but your employer must withhold 47% tax. Apply for a TFN immediately at ato.gov.au (online, arrives by post in 1–2 weeks). Coordinate with your employer in the meantime."
            },
            {
                q: "Which sector is easiest for a newcomer to find work in Australia?",
                a: "Hospitality (café/restaurant), construction labour, cleaning and logistics. With RSA + White Card + Barista certificate, finding work in the first week is very achievable. Check our Certificates page."
            },
            {
                q: "Brisbane, Sydney or Melbourne — which is better for a newcomer?",
                a: "Brisbane: Lower rent, growing economy due to the 2032 Olympics, less crowded. Sydney: More job opportunities but very high cost of living. Melbourne: Cultural and education hub, moderate cost. For newcomers on a budget, Brisbane stands out."
            },
            {
                q: "What can I do after my language school finishes?",
                a: "You can extend your visa by enrolling in another course (TAFE, university). After gaining work experience, you can look for employer sponsorship (482). Use our points calculator to plan your PR journey."
            },
            {
                q: "Which occupations are most in demand in Australia?",
                a: "Civil engineers, nurses, electricians, software developers, and welders are among the most in-demand. Demand varies by city — check the interactive map on our homepage for city-specific data."
            }
        ]
    }
];

const FAQItem = ({ question, answer, accent }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/5 mb-2 overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors group"
            >
                <span className="font-bold text-white group-hover:text-white pr-4 text-base leading-snug">{question}</span>
                {open
                    ? <ChevronUp size={18} className="shrink-0" style={{ color: accent }} />
                    : <ChevronDown size={18} className="shrink-0 text-white/30" />
                }
            </button>
            {open && (
                <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/5">
                    <p className="pt-4">{answer}</p>
                </div>
            )}
        </div>
    );
};

const SSSPage = () => {
    const { t, lang } = useLanguage();
    const [faqData, setFaqData] = useState(null);
    const [loading, setLoading] = useState(true);

    // In English mode always use English defaults (Firestore data is Turkish-only)
    const [firebaseData, setFirebaseData] = useState(null);
    const activeFaqData = lang === 'en'
        ? defaultFaqDataEn
        : (firebaseData || defaultFaqDataTr);

    useEffect(() => {
        if (!loading) {
            const allQA = activeFaqData.flatMap(section => section.questions);
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'faq-jsonld';
            script.textContent = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: allQA.map(item => ({
                    '@type': 'Question',
                    name: item.q,
                    acceptedAnswer: { '@type': 'Answer', text: item.a },
                })),
            });
            document.getElementById('faq-jsonld')?.remove();
            document.head.appendChild(script);
            return () => document.getElementById('faq-jsonld')?.remove();
        }
    }, [activeFaqData, loading]);

    useEffect(() => {
        const fetchFAQ = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'faqItems'));
                if (!snapshot.empty) {
                    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                    const grouped = {};
                    items.forEach(item => {
                        const cat = item.category || 'GENEL';
                        if (!grouped[cat]) grouped[cat] = { category: cat, accent: item.accent || '#ccff00', questions: [] };
                        grouped[cat].questions.push({ q: item.question, a: item.answer });
                    });
                    setFirebaseData(Object.values(grouped));
                }
            } catch (err) {
                console.error('Error fetching FAQ:', err);
            }
            setLoading(false);
        };
        fetchFAQ();
    }, []);

    return (
        <>
            <SEOHead
                title={t('sss_title')}
                description={t('sss_desc')}
                path="/sss"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> {t('page_back_home')}
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">{t('sss_guide')}</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#ccff00]">
                                    <HelpCircle className="text-black" size={28} strokeWidth={3} />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-[#ccff00]">{t('sss_title')}</h1>
                            </div>
                            <div className="max-w-xl">
                                <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                                    {t('sss_desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-[1200px] mx-auto px-6 py-12">
                    {loading ? (
                        <div className="text-center text-white/40 py-12 animate-pulse">{t('loading_text')}</div>
                    ) : (
                        activeFaqData.map((section) => (
                            <div key={section.category} className="mb-10">
                                <h2
                                    className="text-[10px] font-black tracking-[0.3em] uppercase mb-4 inline-block px-3 py-1"
                                    style={{ backgroundColor: `${section.accent}15`, color: section.accent }}
                                >
                                    {section.category}
                                </h2>
                                {section.questions.map((item, i) => (
                                    <FAQItem key={i} question={item.q} answer={item.a} accent={section.accent} />
                                ))}
                            </div>
                        ))
                    )}

                    <div className="bg-[#111] border border-white/5 p-8 mt-8 text-center">
                        <p className="text-white/30 text-sm font-bold uppercase tracking-widest mb-3">{t('sss_question_missing')}</p>
                        <Link to="/iletisim" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all">
                            {t('sss_contact_us')}
                        </Link>
                    </div>

                    <YouTubeBox />
                </section>
            </div>
        </>
    );
};

export default SSSPage;
