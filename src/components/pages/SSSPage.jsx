import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import SEOHead from '../seo/SEOHead';

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const faqData = [
    {
        category: "SKILLSELECT & POINTS TEST",
        accent: "#ccff00",
        questions: [
            {
                q: "What is SkillSelect and how does it work?",
                a: "SkillSelect is the Australian Government's online immigration management system used for skilled migration visas. You submit an Expression of Interest (EOI) detailing your skills, qualifications and work experience. Based on your points score, you enter a pool and wait for an invitation to apply for a visa. Invitations are issued in rounds, typically every two weeks, to the highest-scoring candidates."
            },
            {
                q: "How many points do I need for skilled migration?",
                a: "The minimum threshold to submit an EOI is 65 points. However, invitation cut-off scores are almost always higher — often 80 to 95+ points depending on the occupation and visa subclass. Factors that earn points include age (25–32 is maximum), English proficiency, skilled work experience, educational qualifications, Australian study, partner skills, NAATI credentials, and state/territory nomination (190 = 5 pts; 491 = 15 pts)."
            },
            {
                q: "What is the difference between the 189, 190, and 491 visa?",
                a: "The 189 (Skilled Independent) requires no sponsorship and lets you live anywhere in Australia — but cut-off scores are highest. The 190 (Skilled Nominated) gives 5 bonus points in exchange for a state/territory nomination and an obligation to live in that state for 2 years — it is a permanent residence visa. The 491 (Skilled Work Regional) gives 15 bonus points but requires you to live and work in a regional area for 3 years before transitioning to the 191 permanent visa."
            },
            {
                q: "What is an EOI (Expression of Interest)?",
                a: "An EOI is a formal profile submitted through the SkillSelect portal. It is not a visa application — it is an expression of your interest in migrating. Your EOI is scored and ranked against other candidates. If your occupation is in demand and your score is competitive, the Department of Home Affairs or a state government will invite you to apply for a visa. Once invited, you have 60 days to lodge the full visa application."
            },
            {
                q: "How long does visa processing take?",
                a: "Processing times vary significantly. The 189 and 190 skilled visas typically take 6 months to 3 years depending on the occupation and caseload. The 482/SID employer-sponsored visa usually takes 1–4 months. Partner visas (820/801) average 12–30 months. The 491 regional visa ranges from 4–24 months. Always check the current processing times on the Department of Home Affairs website as they are updated regularly."
            }
        ]
    },
    {
        category: "SKILLS ASSESSMENT",
        accent: "#ff6b6b",
        questions: [
            {
                q: "What is a skills assessment and which body assesses my occupation?",
                a: "A skills assessment is a mandatory evaluation of your qualifications and work experience against Australian standards. Each occupation is assessed by a specific body: Engineers Australia (engineering), ACS — Australian Computer Society (ICT), VETASSESS (a wide range of professional occupations), AHPRA (health professionals including nurses and doctors), TRA — Trades Recognition Australia (trade occupations), ACWA (social work), and others. You can find your occupation's assessing body via the official ANZSCO search on the Department of Home Affairs website."
            },
            {
                q: "What documents do I need to submit to the assessing body?",
                a: "Requirements vary by body but typically include: academic transcripts and degree certificates, detailed employment reference letters (on company letterhead, specifying duties, hours, and dates), identity documents (passport), and English language test results. Some bodies — especially Engineers Australia and ACS — may also require a competency demonstration report (CDR) or a technical portfolio."
            },
            {
                q: "How long does a skills assessment take?",
                a: "Most bodies take 3–6 months under standard processing. Engineers Australia can take 8–12 months for a CDR-based assessment. ACS typically takes 4–8 weeks. AHPRA for nurses can take 3–6 months. Priority processing is available for some bodies at an additional cost. Start your skills assessment early — it is one of the longest steps in the PR journey."
            }
        ]
    },
    {
        category: "ENGLISH REQUIREMENTS",
        accent: "#00d4ff",
        questions: [
            {
                q: "Do I need IELTS for a 189/190 visa?",
                a: "Yes, English proficiency is mandatory for skilled visas. IELTS Academic or General, PTE Academic, TOEFL iBT, OET, and Cambridge C1 Advanced are all accepted. The minimum requirement is 'Competent English' — IELTS 6.0 in each band (Listening, Reading, Writing, Speaking). To earn maximum points (20 pts) you need 'Superior English' — IELTS 8.0 in each band. 'Proficient English' (IELTS 7.0 each band) earns 10 points."
            },
            {
                q: "Should I take IELTS or PTE?",
                a: "Both are equally valid. PTE Academic delivers results faster (usually within 5 business days vs 13 for IELTS), is entirely computer-based, and is considered more consistent in scoring. IELTS Academic has broader global recognition and is preferred by some assessing bodies (e.g. AHPRA). Choose based on your strengths — PTE tends to favour those strong in speaking and listening; IELTS Academic is more familiar if you have practised traditional exam formats."
            },
            {
                q: "How long are my English test results valid?",
                a: "For skilled visa applications, IELTS, PTE, and TOEFL results are valid for 3 years from the date of the test. For some state nomination programs, results must be current within 3 years of the nomination application date. Check the specific requirements of the state you are applying to."
            }
        ]
    },
    {
        category: "PERMANENT RESIDENCY & CITIZENSHIP",
        accent: "#a78bfa",
        questions: [
            {
                q: "What is the NARWP for Centrelink?",
                a: "The NARWP (Newly Arrived Resident's Waiting Period) is a mandatory waiting period before most newly arrived migrants can access certain social security payments (Centrelink). The standard NARWP is 4 years for most welfare payments including JobSeeker, Youth Allowance (job seekers), and Parenting Payment. Some payments such as Family Tax Benefit have a 1-year or 2-year NARWP. Humanitarian visa holders and some other categories are exempt."
            },
            {
                q: "Can I bring my family on a skilled visa?",
                a: "Yes. When you apply for a skilled visa (189, 190, 491), you can include your spouse/de facto partner and dependent children in the same application. They receive the same visa and rights as the primary applicant. Your partner's English level and employment history can also contribute points to your EOI if they have a skilled occupation assessment."
            },
            {
                q: "How does superannuation work?",
                a: "Superannuation (super) is Australia's compulsory retirement savings system. Employers must contribute 11.5% (rising to 12% from 1 July 2025) of your ordinary time earnings into a super fund on your behalf. You cannot normally access this money until you reach preservation age (generally 60). If you leave Australia permanently and your visa has expired (and you are not an Australian or NZ citizen or PR), you can apply to claim your super as a Departing Australia Superannuation Payment (DASP) — though a withholding tax applies."
            },
            {
                q: "When can I apply for Australian citizenship?",
                a: "To apply for Australian citizenship by conferral, you must have been lawfully resident in Australia for 4 years immediately before your application, including the last 12 months as a permanent resident. You must also meet the character requirement, pass a citizenship test (about Australian values, history, and government), and be present at a citizenship ceremony."
            }
        ]
    },
    {
        category: "WORK & DAILY LIFE",
        accent: "#00ff88",
        questions: [
            {
                q: "Can I work while on a bridging visa?",
                a: "It depends on the conditions of your bridging visa. A Bridging Visa A (BVA) or B (BVB) generally carries the same work rights as your substantive visa had — so if your substantive visa allowed unlimited work, your bridging visa does too. A Bridging Visa C (BVC) typically does not allow work unless you applied for work rights and demonstrated financial hardship. Always check the VEVO system (visa.homeaffairs.gov.au) to confirm your exact conditions."
            },
            {
                q: "Can I work in Australia on a student visa?",
                a: "Yes. Student visa (subclass 500) holders can work up to 48 hours per fortnight during study periods, and unlimited hours during official course breaks. This was updated in 2023 — the previous cap was 40 hours per fortnight. Check your visa grant notice in VEVO to confirm your specific work conditions."
            },
            {
                q: "Can I start work without a TFN?",
                a: "You can legally start work without a Tax File Number (TFN), but your employer must withhold 47% (the top marginal rate) from your wages until you provide one. Apply for your TFN as soon as you arrive via ato.gov.au — the online application takes 20 minutes and your TFN arrives by post within 1–2 weeks. Link it to your myGov account and provide it to your employer promptly."
            },
            {
                q: "Which sectors are easiest for newcomers to find work in Australia?",
                a: "Hospitality (cafe, restaurant, bar), construction labouring, cleaning, warehousing, and aged care are the fastest sectors to enter without local experience. Certifications that dramatically improve your hiring chances within days: RSA (Responsible Service of Alcohol), White Card (construction induction), and a Barista course. These can typically be completed in 1–3 days online or in person for under $200 total."
            },
            {
                q: "Brisbane, Sydney or Melbourne — which city is best for a newcomer?",
                a: "Brisbane offers lower rent (median ~$2,200/month for a 1BR vs $2,600+ in Sydney), a rapidly growing economy driven by the 2032 Olympics infrastructure pipeline, and a less crowded lifestyle. Sydney has the most job opportunities — especially in finance, tech, and professional services — but the cost of living is significantly higher. Melbourne is the cultural and education capital with a strong arts and food scene, moderate living costs, and excellent public transport. For newcomers on a budget prioritising employment, Brisbane currently stands out. For career advancement in a specific field, choose based on where that industry concentrates."
            }
        ]
    }
];

// ── FAQ Item Component ────────────────────────────────────────────────────────
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

// ── Page Component ────────────────────────────────────────────────────────────
const SSSPage = () => {
    // Inject FAQPage JSON-LD structured data
    useEffect(() => {
        const allQA = faqData.flatMap(section => section.questions);
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
    }, []);

    return (
        <>
            <SEOHead
                title="Frequently Asked Questions — Australian Immigration & Migration | MIGRON"
                description="Answers to the most common questions about Australian immigration — SkillSelect, points test, skills assessment, processing times, bridging visas, superannuation and permanent residency."
                path="/sss"
            />
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
                <section className="relative pt-8 pb-6 px-6 border-b border-white/10">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                                <ArrowLeft size={14} /> Back to Home
                            </Link>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">IMMIGRATION GUIDE</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-[#ccff00]">
                                    <HelpCircle className="text-black" size={28} strokeWidth={3} />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-[#ccff00]">FAQ</h1>
                            </div>
                            <div className="max-w-xl">
                                <p className="text-sm md:text-base text-white/50 leading-relaxed font-medium">
                                    Answers to the most frequently asked questions about the Australian immigration process. Up-to-date and accurate information.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

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
                                <FAQItem key={i} question={item.q} answer={item.a} accent={section.accent} />
                            ))}
                        </div>
                    ))}

                    <div className="bg-[#111] border border-white/5 p-8 mt-8 text-center">
                        <p className="text-white/30 text-sm font-bold uppercase tracking-widest mb-3">Can't find your question?</p>
                        <a href="mailto:migron@mtive.tech" className="inline-flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 transition-all">
                            Contact Us
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
};

export default SSSPage;
