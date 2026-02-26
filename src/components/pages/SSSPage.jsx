import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

const faqData = [
    {
        category: "VİZE & BAŞVURU",
        accent: "#ccff00",
        questions: [
            {
                q: "Avustralya'ya göç etmek için hangi visa türleri mevcuttur?",
                a: "Avustralya'da göçmenlik için birçok vize türü bulunmaktadır: Skilled Independent (189), Skilled Nominated (190), Employer Sponsored (482/186), Partner, Student ve İnsani vizeler bunların başlıcalarıdır. Durumunuza en uygun vizeyi belirlemek için puan hesaplamanızı yapmanız önerilir."
            },
            {
                q: "Poinst testi nedir ve nasıl hesaplanır?",
                a: "Point test (puan testi), skilled göçmenlik vizelerinde başvuruculara yaş, İngilizce dil seviyesi, deneyim, eğitim ve diğer faktörlere göre puan verilmesine dayanan bir sistemdir. Skilled Independent (189) vizesi için genellikle 65 puan required'dır ancak davet puanları çok daha yüksek seyredebilmektedir."
            },
            {
                q: "EOI (Expression of Interest) nedir?",
                a: "EOI, SkillSelect sistemi üzerinden verilen resmi bir ilgi beyanıdır. Puan testine göre havuzda beklediğiniz ve davet beklediğiniz aşamadır. Davet aldıktan sonra 60 gün içinde vize başvurusunu tamamlamanız gerekir."
            },
            {
                q: "Vize başvurusunun ortalama ne kadar sürmektedir?",
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
                <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/5" style={{ borderColor: `${accent}20` }}>
                    <p className="pt-4">{answer}</p>
                </div>
            )}
        </div>
    );
};

const SSSPage = () => {
    return (
        <>
            <SEOHead
                title="Sık Sorulan Sorular"
                description="Avustralya göçmenliği, vize süreçleri ve yasal prosedürler hakkında en sık sorulan sorular ve cevapları."
                path="/sss"
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
                                Göçmenlik Rehberi
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#ccff00]">
                                    <HelpCircle className="text-black" size={28} strokeWidth={3} />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                                    SSS
                                </h1>
                            </div>
                            <div className="max-w-xl">
                                <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                                    Avustralya göçmenlik süreci hakkında en sık sorulan soruların cevapları. Güncel ve doğru bilgiye ulaşın.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Content */}
                <section className="max-w-[1200px] mx-auto px-6 py-12">
                    {faqData.map((section) => (
                        <div key={section.category} className="mb-10">
                            <h2
                                className="text-[10px] font-black tracking-[0.3em] uppercase mb-4 inline-block px-3 py-1"
                                style={{ backgroundColor: `${section.accent}15`, color: section.accent }}
                            >
                                {section.category}
                            </h2>
                            {section.questions.map((item, i) => (
                                <FAQItem
                                    key={i}
                                    question={item.q}
                                    answer={item.a}
                                    accent={section.accent}
                                />
                            ))}
                        </div>
                    ))}

                    <div className="bg-[#111] border border-white/5 p-8 mt-8 text-center">
                        <p className="text-white/30 text-sm font-bold uppercase tracking-widest mb-3">
                            Sorunuz burada yok mu?
                        </p>
                        <Link
                            to="/iletisim"
                            className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all"
                        >
                            Bize Ulaşın
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
};

export default SSSPage;
