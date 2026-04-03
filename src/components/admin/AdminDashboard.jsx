import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { LogOut, Plus, Edit3, Trash2, Eye, EyeOff, FileText, HelpCircle, Layers, Image, LayoutGrid, Upload } from 'lucide-react';
import ArticleEditor from './ArticleEditor';
import FAQEditor from './FAQEditor';
import ProgramEditor from './ProgramEditor';
import SliderEditor from './SliderEditor';
import BentoEditor from './BentoEditor';
import ContentEditor from './ContentEditor';

// ── Varsayılan SSS Verileri ──────────────────────────────────────────────────
const DEFAULT_FAQ = [
    { category: 'VİZE & BAŞVURU', accent: '#ccff00', order: 0, question: "Avustralya'ya göç etmek için hangi visa türleri mevcuttur?", answer: "Avustralya'da göçmenlik için birçok vize türü bulunmaktadır: Skilled Independent (189), Skilled Nominated (190), Employer Sponsored (482/186), Partner, Student ve İnsani vizeler bunların başlıcalarıdır. Durumunuza en uygun vizeyi belirlemek için puan hesaplamanızı yapmanız önerilir." },
    { category: 'VİZE & BAŞVURU', accent: '#ccff00', order: 1, question: "Puan testi nedir ve nasıl hesaplanır?", answer: "Point test (puan testi), skilled göçmenlik vizelerinde başvuruculara yaş, İngilizce dil seviyesi, deneyim, eğitim ve diğer faktörlere göre puan verilmesine dayanan bir sistemdir. Skilled Independent (189) vizesi için genellikle 65 puan gereklidir ancak davet puanları çok daha yüksek seyredebilmektedir." },
    { category: 'VİZE & BAŞVURU', accent: '#ccff00', order: 2, question: "EOI (Expression of Interest) nedir?", answer: "EOI, SkillSelect sistemi üzerinden verilen resmi bir ilgi beyanıdır. Puan testine göre havuzda beklediğiniz ve davet beklediğiniz aşamadır. Davet aldıktan sonra 60 gün içinde vize başvurusunu tamamlamanız gerekir." },
    { category: 'VİZE & BAŞVURU', accent: '#ccff00', order: 3, question: "Vize başvurusunun ortalama ne kadar sürdüğü?", answer: "Vize işlem süreleri vize türüne ve bireysel duruma göre büyük farklılıklar göstermektedir. Skilled vizeler için birkaç aydan 2-3 yıla kadar uzayan süreler görülebilmektedir. Partner vizeleri ortalama 12-24 ay sürebilmektedir." },
    { category: 'İNGİLİZCE SINAVI', accent: '#00d4ff', order: 4, question: "IELTS mi, PTE mi tercih etmeliyim?", answer: "Her iki sınav da geçerlidir. PTE Academic genellikle daha hızlı sonuç verir ve tamamen bilgisayar tabanlıdır. IELTS daha yaygın bilinirliğe sahiptir. Güçlü olduğunuz alanlara göre değerlendirme yapmanızı öneririz." },
    { category: 'İNGİLİZCE SINAVI', accent: '#00d4ff', order: 5, question: "Sınav sonucum kaç yıl geçerlidir?", answer: "Vize başvuruları için IELTS ve PTE sonuçları genellikle 3 yıl geçerlidir. Ancak bazı eyalet nominesyon programları için farklı süre koşulları uygulanabilmektedir." },
    { category: 'MESLEK DEĞERLENDİRMESİ', accent: '#ff6b6b', order: 6, question: "Skills Assessment (Meslek Değerlendirmesi) nedir?", answer: "Avustralya'da skilled göçmenlik için mesleğinizin yetkili bir kurum tarafından değerlendirilmesi gerekmektedir. Her mesleğin kendi değerlendirme kurumu vardır (örn: Engineers Australia, VETASSESS, ACS, AHPRA)." },
    { category: 'MESLEK DEĞERLENDİRMESİ', accent: '#ff6b6b', order: 7, question: "Değerlendirme kurumuna hangi belgeler sunulmalıdır?", answer: "Genellikle; diploma/transkript, iş deneyimi referans mektupları, kimlik belgesi ve İngilizce dil sınav sonuçları istenmektedir. Bazı kurumlar ek belge, proje portföyü veya teknik mülakat talep edebilmektedir." },
    { category: 'MESLEK DEĞERLENDİRMESİ', accent: '#ff6b6b', order: 8, question: "Değerlendirme süreci ne kadar sürer?", answer: "Kuruma ve yoğunluğa göre değişmekle birlikte ortalama 3-6 ay arasında sürmektedir. Engineers Australia ve bazı kurumlar için 8-12 aya kadar uzayan sürelere hazırlıklı olunması tavsiye edilir." },
    { category: 'KALICI OTURUM & VATANDAŞLIK', accent: '#a78bfa', order: 9, question: "PR (Permanent Residency) ne zaman verilir?", answer: "Skilled vizelerden PR doğrudan alınabilir (subclass 189, 190, 191). Bazı temporary vizelerden (482 gibi) geçiş yapılabilir. TR'den PR'a geçiş için genellikle belirli bir süre çalışma ve yasal ikamet koşulu aranır." },
    { category: 'KALICI OTURUM & VATANDAŞLIK', accent: '#a78bfa', order: 10, question: "Vatandaşlık başvurusu için ne kadar süre gereklidir?", answer: "Avustralya vatandaşlığı için PR aldıktan sonra 4 yıl boyunca Avustralya'da ikamet etmeniz, son 12 ayını PR olarak geçirmiş olmanız ve belirli yasallık koşullarını sağlamanız gerekmektedir." },
];

const DEFAULT_PROGRAMS = [
    { order: 0, color: '#ccff00', tag: 'SKILLED', title: 'Skilled Independent (189)', subtitle: 'Bağımsız Yetenekli Göçmen Vizesi', desc: 'Herhangi bir eyalet veya bölgesel sponsor gerektirmeyen, puan testi tabanlı bağımsız göçmenlik vizesi. Avustralya\'nın herhangi bir yerinde yaşayabilir ve çalışabilirsiniz.', requirements: ['Min. 65 EOI puanı', 'Geçerli meslek değerlendirmesi', 'Competent English (IELTS 6.0)', 'Sağlık muayenesi'], processingTime: '12-36 ay', prDirect: true, details: '189 vizesi, herhangi bir Avustralyalı işveren veya eyalet tarafından sponsor olmaksızın başvurulabilen bir skilled göçmenlik vizesidir.' },
    { order: 1, color: '#00d4ff', tag: 'SKILLED', title: 'Skilled Nominated (190)', subtitle: 'Eyalet Nominasyonlu Vize', desc: 'Bir eyalet veya bölge tarafından nomine edilmenizi gerektiren, 5 ekstra puan kazandıran skilled göçmenlik vizesi.', requirements: ['Min. 65 puan (+ 5 nominasyon bonusu)', 'Eyalet nominasyonu', 'Meslek değerlendirmesi', 'Competent English'], processingTime: '6-24 ay', prDirect: true, details: '190 vizesi, state/territory nominasyonu ile 5 ek puan kazandıran ve bu nedenle daha ulaşılabilir bir skilled vize seçeneğidir.' },
    { order: 2, color: '#ff6b6b', tag: 'EMPLOYER', title: 'Temporary Skill Shortage (482)', subtitle: 'İşveren Sponsorlu Geçici Vize', desc: 'Avustralyalı işverenler tarafından sponsor olunan çalışanlar için geçici çalışma vizesi.', requirements: ['Sponsor işveren', 'Nominasyon onayı', '2 yıl deneyim', 'English yeterliliği'], processingTime: '1-6 ay', prDirect: false, details: '482 vizesi (TSS), short-term stream (2 yıl) ve medium-term stream (4 yıl) olmak üzere iki akıştan oluşur.' },
    { order: 3, color: '#a78bfa', tag: 'EMPLOYER', title: 'Employer Nomination Scheme (186)', subtitle: 'İşveren Nominasyonu Kalıcı Vize', desc: 'İşveren tarafından belirli bir pozisyona nomine edilen göçmenler için doğrudan PR imkânı sunan vize.', requirements: ['İşveren nominasyonu', '3 yıl deneyim', 'Competent English', 'Meslek değerlendirmesi'], processingTime: '6-24 ay', prDirect: true, details: '186 vizesi, direct entry stream ve transition stream olmak üzere iki akışa sahiptir.' },
    { order: 4, color: '#f59e0b', tag: 'REGIONAL', title: 'Skilled Work Regional (491)', subtitle: 'Bölgesel Çalışma Geçici Vizesi', desc: 'Bölgesel alanlarda çalışmayı ve yaşamayı gerektiren, 15 bonus puan kazandıran geçici vize.', requirements: ['Eyalet/bölge nominasyonu', 'Bölgesel Avustralya\'da ikamet', 'Meslek değerlendirmesi', 'Competent English'], processingTime: '4-24 ay', prDirect: false, details: '491 vizesi, regional Avustralya\'da yaşamak ve çalışmak isteyenler için 15 ek puan sunar.' },
    { order: 5, color: '#10b981', tag: 'STUDENT', title: 'Student Visa (500)', subtitle: 'Öğrenci Vizesi', desc: 'Avustralya\'da CRICOS kayıtlı bir kurumda tam zamanlı öğrenim için vize. Çalışma izni ile birlikte gelir.', requirements: ['CRICOS kayıtlı kurum kabulü', 'GTE (Genuine Temporary Entrant)', 'English yeterliliği', 'Mali yeterlilik'], processingTime: '1-4 ay', prDirect: false, details: '500 vizesi, Avustralya\'daki eğitim sonrası 485 (Graduate Visa) vizesi için kapı açan önemli bir adımdır.' },
    { order: 6, color: '#ec4899', tag: 'PARTNER', title: 'Partner Visa (820/801)', subtitle: 'Eş/Partner Vizesi', desc: 'Avustralya vatandaşı veya PR sahibi biriyle ilişkisi olan kişiler için 2 aşamalı vize.', requirements: ['Avustralyalı sponsor', 'İlişkinin kanıtlanması', 'Sağlık muayenesi', 'Karakter gereksinimi'], processingTime: '12-30 ay', prDirect: false, details: '820 (onshore) ya da 309 (offshore) geçici partner vizesi ile başlayan süreç, 2 yıl sonra 801/100 kalıcı partner vizesiyle tamamlanır.' },
    { order: 7, color: '#6366f1', tag: 'BUSINESS', title: 'Business Innovation & Investment (888)', subtitle: 'İş İnovasyonu ve Yatırım Vizesi', desc: 'Avustralya\'da iş kurma veya yönetme ya da belirli yatırım faaliyetleri yürütme amacıyla verilen kalıcı oturum vizesi.', requirements: ['Başarılı iş geçmişi', 'Minimum net değer', 'Eyalet nominasyonu', 'İngilizce gereksinimi yok (bazı akışlar)'], processingTime: '12-48 ay', prDirect: true, details: '888 vizesi, genellikle 188 geçici iş vizesini tamamlayanlar için kalıcı oturum yoludur.' },
];

const AdminDashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('articles');
    const [articles, setArticles] = useState([]);
    const [faqItems, setFaqItems] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [sliders, setSliders] = useState([]);
    const [bentoCards, setBentoCards] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null);
    const [editingFAQ, setEditingFAQ] = useState(null);
    const [editingProgram, setEditingProgram] = useState(null);
    const [editingSlider, setEditingSlider] = useState(null);
    const [editingBento, setEditingBento] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [artSnap, faqSnap, progSnap, sliderSnap, bentoSnap] = await Promise.all([
                getDocs(collection(db, 'articles')),
                getDocs(collection(db, 'faqItems')),
                getDocs(collection(db, 'programs')),
                getDocs(collection(db, 'sliders')),
                getDocs(collection(db, 'bentoCards')),
            ]);

            const arts = artSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            arts.sort((a, b) => (b.createdAt?.toDate?.() || new Date(0)) - (a.createdAt?.toDate?.() || new Date(0)));
            setArticles(arts);

            const faqs = faqSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            faqs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setFaqItems(faqs);

            const progs = progSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            progs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setPrograms(progs);

            const slides = sliderSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            slides.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setSliders(slides);

            const bentos = bentoSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const defaultBentos = [
                { id: 'bento-risk', label: 'Risk Analizi Kartı', desc: 'Sektörel Sponsorluklarda Hukuki Risk Analizi' },
                { id: 'bento-australia', label: 'Avustralya İstatistik Kartı', desc: '%98 / 7/24' },
            ];
            setBentoCards(defaultBentos.map(def => {
                const fromDB = bentos.find(b => b.id === def.id);
                return fromDB ? { ...def, ...fromDB } : def;
            }));
        } catch (err) {
            console.error('Error fetching data:', err);
        }
        setLoading(false);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchAll(); }, []);

    // ── Seed functions ─────────────────────────────────────────────────────────
    const seedFAQ = async () => {
        if (!window.confirm('Varsayılan 11 SSS sorusu Firebase\'e yüklenecek. Devam edilsin mi?')) return;
        setSeeding(true);
        try {
            for (const item of DEFAULT_FAQ) {
                await addDoc(collection(db, 'faqItems'), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            }
            await fetchAll();
            alert('✅ Varsayılan SSS soruları başarıyla yüklendi! Artık düzenleyebilirsin.');
        } catch (err) {
            alert('Hata: ' + err.message);
        }
        setSeeding(false);
    };

    const seedPrograms = async () => {
        if (!window.confirm('Varsayılan 8 program Firebase\'e yüklenecek. Devam edilsin mi?')) return;
        setSeeding(true);
        try {
            for (const prog of DEFAULT_PROGRAMS) {
                await addDoc(collection(db, 'programs'), { ...prog, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
            }
            await fetchAll();
            alert('✅ Varsayılan programlar başarıyla yüklendi! Artık düzenleyebilirsin.');
        } catch (err) {
            alert('Hata: ' + err.message);
        }
        setSeeding(false);
    };

    // ──────────────────────────────────────────────────────────────────────────
    const handleLogout = async () => { await signOut(auth); onLogout(); };

    const handleDelete = async (collectionName, id, setter) => {
        if (!window.confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, collectionName, id));
            setter(prev => prev.filter(a => a.id !== id));
        } catch (err) { console.error('Delete error:', err); }
    };

    const togglePublish = async (article) => {
        const newStatus = article.status === 'published' ? 'draft' : 'published';
        try {
            await updateDoc(doc(db, 'articles', article.id), { status: newStatus });
            setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
        } catch (err) { console.error(err); }
    };

    // Show editors
    if (isCreating || editingArticle) return <ArticleEditor article={editingArticle} onSave={() => { setEditingArticle(null); setIsCreating(false); fetchAll(); }} onCancel={() => { setEditingArticle(null); setIsCreating(false); }} />;
    if (editingFAQ !== null) return <FAQEditor item={editingFAQ === 'new' ? null : editingFAQ} onSave={() => { setEditingFAQ(null); fetchAll(); }} onCancel={() => setEditingFAQ(null)} />;
    if (editingProgram !== null) return <ProgramEditor program={editingProgram === 'new' ? null : editingProgram} onSave={() => { setEditingProgram(null); fetchAll(); }} onCancel={() => setEditingProgram(null)} />;
    if (editingSlider !== null) return <SliderEditor slide={editingSlider === 'new' ? null : editingSlider} onSave={() => { setEditingSlider(null); fetchAll(); }} onCancel={() => setEditingSlider(null)} />;
    if (editingBento !== null) return <BentoEditor card={editingBento} onSave={() => { setEditingBento(null); fetchAll(); }} onCancel={() => setEditingBento(null)} />;

    const tabs = [
        { id: 'articles', label: 'Makaleler', icon: FileText, count: articles.length },
        { id: 'faq', label: 'SSS', icon: HelpCircle, count: faqItems.length },
        { id: 'programs', label: 'Programlar', icon: Layers, count: programs.length },
        { id: 'sliders', label: 'Slider', icon: Image, count: sliders.length },
        { id: 'bento', label: 'Bento', icon: LayoutGrid, count: 2 },
        { id: 'icerik', label: 'İçerik', icon: Edit3, count: null },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-8 px-6">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-[#ccff00]">Admin Panel</h1>
                        <p className="text-xs text-white/40 mt-1">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-sm font-bold">
                        <LogOut size={16} /> Çıkış
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-white/10 overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-wider transition-all border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === tab.id ? 'border-[#ccff00] text-[#ccff00]' : 'border-transparent text-white/40 hover:text-white'}`}
                            >
                                <Icon size={15} /> {tab.label}
                                {tab.count !== null && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 font-bold">{tab.count}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* ── Makaleler ── */}
                {activeTab === 'articles' && (
                    <>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setIsCreating(true)} className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 flex items-center gap-2"><Plus size={18} /> Yeni Makale</button>
                        </div>
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2"><FileText size={18} className="text-[#ccff00]" /><h3 className="font-black uppercase text-sm tracking-wider">Makaleler ({articles.length})</h3></div>
                            {loading ? <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                                : articles.length === 0 ? <div className="p-12 text-center text-white/30"><p className="text-lg font-bold mb-2">Henüz makale yok</p></div>
                                    : <div className="divide-y divide-white/5">{articles.map(article => (
                                        <div key={article.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{article.status === 'published' ? 'YAYINDA' : 'TASLAK'}</span>
                                                    <span className="text-[10px] text-white/30 uppercase tracking-wider">{article.category}</span>
                                                </div>
                                                <h4 className="font-bold text-white">{article.title}</h4>
                                                {article.excerpt && <p className="text-xs text-white/40 mt-1">{article.excerpt}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => togglePublish(article)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors" title={article.status === 'published' ? 'Taslağa Çevir' : 'Yayınla'}>{article.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                                <button onClick={() => setEditingArticle(article)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete('articles', article.id, setArticles)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}</div>}
                        </div>
                    </>
                )}

                {/* ── SSS ── */}
                {activeTab === 'faq' && (
                    <>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <button onClick={() => setEditingFAQ('new')} className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 flex items-center gap-2"><Plus size={18} /> Yeni Soru</button>
                            {faqItems.length === 0 && (
                                <button
                                    onClick={seedFAQ}
                                    disabled={seeding}
                                    className="border border-[#ccff00]/40 text-[#ccff00] px-6 py-3 font-black uppercase text-sm hover:bg-[#ccff00]/10 flex items-center gap-2 disabled:opacity-40"
                                >
                                    <Upload size={16} /> {seeding ? 'Yükleniyor...' : 'Varsayılanları Yükle (11 Soru)'}
                                </button>
                            )}
                        </div>
                        {faqItems.length === 0 && (
                            <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 p-4 mb-4 text-sm text-[#ccff00]/70 font-bold">
                                💡 Sitede şu an varsayılan 11 soru görünüyor. "Varsayılanları Yükle" ile onları Firebase'e taşıyabilir, ardından düzenleyip silebilirsin.
                            </div>
                        )}
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2"><HelpCircle size={18} className="text-[#ccff00]" /><h3 className="font-black uppercase text-sm tracking-wider">SSS Soruları ({faqItems.length})</h3></div>
                            {loading ? <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                                : faqItems.length === 0 ? <div className="p-8 text-center text-white/20 text-sm">Henüz Firebase'de soru yok.</div>
                                    : <div className="divide-y divide-white/5">{faqItems.map(item => (
                                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1"><span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: `${item.accent || '#ccff00'}20`, color: item.accent || '#ccff00' }}>{item.category}</span><span className="text-[10px] text-white/30">Sıra: {item.order ?? 0}</span></div>
                                                <h4 className="font-bold text-white">{item.question}</h4>
                                                <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{item.answer}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => setEditingFAQ(item)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors" title="Düzenle"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete('faqItems', item.id, setFaqItems)} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Sil"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}</div>}
                        </div>
                    </>
                )}

                {/* ── Programlar ── */}
                {activeTab === 'programs' && (
                    <>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <button onClick={() => setEditingProgram('new')} className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 flex items-center gap-2"><Plus size={18} /> Yeni Program</button>
                            {programs.length === 0 && (
                                <button
                                    onClick={seedPrograms}
                                    disabled={seeding}
                                    className="border border-[#ccff00]/40 text-[#ccff00] px-6 py-3 font-black uppercase text-sm hover:bg-[#ccff00]/10 flex items-center gap-2 disabled:opacity-40"
                                >
                                    <Upload size={16} /> {seeding ? 'Yükleniyor...' : 'Varsayılanları Yükle (8 Program)'}
                                </button>
                            )}
                        </div>
                        {programs.length === 0 && (
                            <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 p-4 mb-4 text-sm text-[#ccff00]/70 font-bold">
                                💡 Sitede şu an varsayılan 8 program görünüyor. "Varsayılanları Yükle" ile onları Firebase'e taşıyabilir, ardından düzenleyip silebilirsin.
                            </div>
                        )}
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2"><Layers size={18} className="text-[#ccff00]" /><h3 className="font-black uppercase text-sm tracking-wider">Program Türleri ({programs.length})</h3></div>
                            {loading ? <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                                : programs.length === 0 ? <div className="p-8 text-center text-white/20 text-sm">Henüz Firebase'de program yok.</div>
                                    : <div className="divide-y divide-white/5">{programs.map(prog => (
                                        <div key={prog.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1"><span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: `${prog.color || '#ccff00'}20`, color: prog.color || '#ccff00' }}>{prog.tag}</span><span className="text-[10px] text-white/30">Sıra: {prog.order ?? 0}</span>{prog.prDirect && <span className="text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 font-bold uppercase">PR</span>}</div>
                                                <h4 className="font-bold text-white">{prog.title}</h4>
                                                <p className="text-xs text-white/30 mt-0.5">{prog.subtitle}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => setEditingProgram(prog)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors" title="Düzenle"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete('programs', prog.id, setPrograms)} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Sil"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}</div>}
                        </div>
                    </>
                )}

                {/* ── Slider ── */}
                {activeTab === 'sliders' && (
                    <>
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => setEditingSlider('new')} className="bg-[#ccff00] text-black px-6 py-3 font-black uppercase text-sm hover:brightness-110 flex items-center gap-2"><Plus size={18} /> Yeni Slide</button>
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/5 p-4 mb-4 text-xs text-white/30 font-bold uppercase tracking-widest">
                            💡 Firebase'de slide varsa onlar gösterilir. Yoksa kodda tanımlı 3 varsayılan slide görünür.
                        </div>
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2"><Image size={18} className="text-[#ccff00]" /><h3 className="font-black uppercase text-sm tracking-wider">Slider Kartları ({sliders.length})</h3></div>
                            {loading ? <div className="p-8 text-center text-white/40">Yükleniyor...</div>
                                : sliders.length === 0 ? <div className="p-8 text-center text-white/20 text-sm">Henüz Firebase'de slide yok. Varsayılan 3 slide sitede görünüyor.</div>
                                    : <div className="divide-y divide-white/5">{sliders.map(slide => (
                                        <div key={slide.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4 flex-1">
                                                {slide.image && <img src={slide.image} className="w-20 h-14 object-cover opacity-60 shrink-0" onError={e => e.target.style.display = 'none'} alt="" />}
                                                <div>
                                                    <div className="flex gap-2 mb-1">{slide.tags?.map(t => <span key={t} className="px-1.5 py-0.5 bg-[#ccff00] text-black text-[9px] font-black uppercase">{t}</span>)}</div>
                                                    <h4 className="font-bold text-white text-sm">{slide.title}</h4>
                                                    <p className="text-xs text-white/30">Sıra: {slide.order ?? 0}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => setEditingSlider(slide)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDelete('sliders', slide.id, setSliders)} className="p-2 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}</div>}
                        </div>
                    </>
                )}

                {/* ── Bento ── */}
                {activeTab === 'bento' && (
                    <>
                        <div className="bg-[#0a0a0a] border border-white/5 p-4 mb-4 text-xs text-white/30 font-bold uppercase tracking-widest">
                            💡 Anasayfadaki 2 statik kart. Değişiklikler kaydedilince Firebase'den gelir.
                        </div>
                        <div className="bg-[#111] border border-white/5">
                            <div className="p-4 border-b border-white/10 flex items-center gap-2"><LayoutGrid size={18} className="text-[#ccff00]" /><h3 className="font-black uppercase text-sm tracking-wider">Bento Kartları (2)</h3></div>
                            <div className="divide-y divide-white/5">
                                {bentoCards.map(card => (
                                    <div key={card.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white">{card.label}</h4>
                                            <p className="text-xs text-white/40 mt-1">{card.desc}</p>
                                        </div>
                                        <button onClick={() => setEditingBento(card)} className="p-2 text-white/40 hover:text-[#ccff00] transition-colors ml-4" title="Düzenle"><Edit3 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ── İçerik Yönetimi ── */}
                {activeTab === 'icerik' && <ContentEditor />}

            </div>
        </div>
    );
};

export default AdminDashboard;
