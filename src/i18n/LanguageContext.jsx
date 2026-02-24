import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
    tr: {
        // Navbar
        nav_home: "ANASAYFA",
        nav_legal: "HUKUK SİSTEMİ",
        nav_education: "EĞİTİM",
        nav_social: "SOSYAL",
        nav_projects: "PROJELER",
        nav_contact: "İLETİŞİM",
        lang_toggle: "EN",

        // Hero Slider
        slide1_title: "AVUSTRALYA: 2026 GÖÇ REFORMU",
        slide1_tag1: "HUKUK",
        slide1_tag2: "KRİTİK",
        slide1_desc: "Vize başvurularında %30'luk bir daralma kapıda. Yasal boşluklar kapanıyor.",
        slide2_title: "KİRA KRİZİ VE HAKLARINIZ",
        slide2_tag1: "SOSYAL",
        slide2_tag2: "KONUT",
        slide2_desc: "Sydney'de ev sahibi-kiracı uyuşmazlıklarında yeni mahkeme kararları.",
        slide3_title: "STUDENT-TO-PR PATHWAY",
        slide3_tag1: "EĞİTİM",
        slide3_tag2: "STRATEJİ",
        slide3_desc: "Eğitim sonrası kalıcı oturum için en güvenilir 5 eyalet rotası.",
        btn_open_file: "Dosyayı Aç",

        // Bento Grid
        section_flow: "Sistem Akışı",
        section_analyses: "GÜNCEL ANALİZLER",
        data_source: "VERİ KAYNAĞI: AU FEDERAL COURTS",
        data_update: "GÜNCELLEME",
        safe_data: "GÜVENLİ VERİ",
        bento_title: "Sektörel Sponsorluklarda Hukuki Risk Analizi",
        bento_desc: "İşveren sponsorluğu vizelerinde dolandırıcılık tespiti ve iptal protokolleri.",
        australia: "AVUSTRALYA",
        data_accuracy: "VERİ DOĞRULUĞU",
        legal_tracking: "HUKUKİ TAKİP",

        // Blog posts
        blog1_title: "Sektörel Sponsorluklarda Risk Analizi",
        blog1_cat: "Hukuk",
        blog2_title: "GTE Değişiklikleri",
        blog2_cat: "Eğitim",
        blog3_title: "Melbourne Acı Reçete",
        blog3_cat: "Sosyal",
        blog4_title: "Marka Bilinirliği Analizi",
        blog4_cat: "PR",
        blog5_title: "MRT İtiraz Süreçleri",
        blog5_cat: "Hukuk",
        time_2h: "2S ÖNCE",
        time_5h: "5S ÖNCE",
        time_12h: "12S ÖNCE",
        time_1d: "1G ÖNCE",
        time_2d: "2G ÖNCE",

        // Footer
        footer_nav: "Navigasyon",
        footer_legal_title: "Yasal",
        footer_legal_text: "Sunulan tüm analizler resmi mahkeme kayıtları ve bakanlık genelgeleri temel alınarak oluşturulmuştur. Bireysel danışmanlık değildir.",
        footer_contact: "İletişim",
        footer_tagline: "Hukuki veriyi teknolojiyle birleştiren radikal göçmenlik platformu.",
        footer_slogan: "STAY RADICAL / STAY LEGAL",
        footer_nav_legal: "HUKUK SİSTEMİ",
        footer_nav_australia: "AVUSTRALYA DOSYASI",
        footer_nav_data: "VERİ AKIŞI",

        // Chat
        chat_title: "MIGRON AI TERMINAL v2.5",
        chat_welcome: "Sistem aktif. Avustralya hukuku ve göç prosedürleri hakkında teknik veri sağlayabilirim. Ne sormak istersin?",
        chat_placeholder: "KOMUT GİRİN...",
        chat_processing: "SİSTEM İŞLENİYOR...",
        chat_error: "Bağlantı kesildi. Lütfen tekrar deneyin.",

        // Sub pages
        page_legal_title: "HUKUK SİSTEMİ",
        page_legal_subtitle: "Avustralya Göçmenlik Hukuku",
        page_legal_desc: "Avustralya göçmenlik hukuku, vize başvuruları, yasal süreçler ve mahkeme kararları hakkında güncel analizler ve rehberler.",
        page_education_title: "EĞİTİM",
        page_education_subtitle: "Avustralya Eğitim Sistemi",
        page_education_desc: "Avustralya'da eğitim fırsatları, burs programları, GTE gereksinimleri ve öğrenci vizesi süreçleri hakkında kapsamlı bilgiler.",
        page_social_title: "SOSYAL",
        page_social_subtitle: "Toplumsal Yaşam & Haklar",
        page_social_desc: "Avustralya'da kiracı hakları, işçi hakları, sağlık sistemi ve toplumsal entegrasyon hakkında güncel bilgiler.",
        page_projects_title: "PROJELER",
        page_projects_subtitle: "Migron Projeleri",
        page_projects_desc: "Avustralya'daki Türk diasporası için geliştirilen teknoloji projeleri, araçlar ve platformlar.",
        page_contact_title: "İLETİŞİM",
        page_contact_subtitle: "Bize Ulaşın",
        page_contact_desc: "Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçebilirsiniz.",
        page_coming_soon: "İçerik yakında eklenecek.",
        page_back_home: "Anasayfaya Dön",
        page_email_label: "E-posta",
    },
    en: {
        // Navbar
        nav_home: "HOME",
        nav_legal: "LEGAL SYSTEM",
        nav_education: "EDUCATION",
        nav_social: "SOCIAL",
        nav_projects: "PROJECTS",
        nav_contact: "CONTACT",
        lang_toggle: "TR",

        // Hero Slider
        slide1_title: "AUSTRALIA: 2026 IMMIGRATION REFORM",
        slide1_tag1: "LEGAL",
        slide1_tag2: "CRITICAL",
        slide1_desc: "A 30% contraction in visa applications is imminent. Legal loopholes are closing.",
        slide2_title: "RENTAL CRISIS & YOUR RIGHTS",
        slide2_tag1: "SOCIAL",
        slide2_tag2: "HOUSING",
        slide2_desc: "New court decisions in landlord-tenant disputes in Sydney.",
        slide3_title: "STUDENT-TO-PR PATHWAY",
        slide3_tag1: "EDUCATION",
        slide3_tag2: "STRATEGY",
        slide3_desc: "The 5 most reliable state routes for permanent residency after education.",
        btn_open_file: "Open File",

        // Bento Grid
        section_flow: "System Flow",
        section_analyses: "LATEST ANALYSES",
        data_source: "DATA SOURCE: AU FEDERAL COURTS",
        data_update: "LAST UPDATE",
        safe_data: "SECURE DATA",
        bento_title: "Legal Risk Analysis in Sector Sponsorships",
        bento_desc: "Fraud detection and cancellation protocols in employer-sponsored visas.",
        australia: "AUSTRALIA",
        data_accuracy: "DATA ACCURACY",
        legal_tracking: "LEGAL TRACKING",

        // Blog posts
        blog1_title: "Risk Analysis in Sector Sponsorships",
        blog1_cat: "Legal",
        blog2_title: "GTE Policy Changes",
        blog2_cat: "Education",
        blog3_title: "Melbourne's Bitter Pill",
        blog3_cat: "Social",
        blog4_title: "Brand Awareness Analysis",
        blog4_cat: "PR",
        blog5_title: "MRT Appeal Processes",
        blog5_cat: "Legal",
        time_2h: "2H AGO",
        time_5h: "5H AGO",
        time_12h: "12H AGO",
        time_1d: "1D AGO",
        time_2d: "2D AGO",

        // Footer
        footer_nav: "Navigation",
        footer_legal_title: "Legal",
        footer_legal_text: "All analyses are based on official court records and ministry circulars. This is not individual legal advice.",
        footer_contact: "Contact",
        footer_tagline: "A radical immigration platform merging legal data with technology.",
        footer_slogan: "STAY RADICAL / STAY LEGAL",
        footer_nav_legal: "LEGAL SYSTEM",
        footer_nav_australia: "AUSTRALIA FILE",
        footer_nav_data: "DATA FLOW",

        // Chat
        chat_title: "MIGRON AI TERMINAL v2.5",
        chat_welcome: "System active. I can provide technical data about Australian law and immigration procedures. What would you like to ask?",
        chat_placeholder: "ENTER COMMAND...",
        chat_processing: "SYSTEM PROCESSING...",
        chat_error: "Connection lost. Please try again.",

        // Sub pages
        page_legal_title: "LEGAL SYSTEM",
        page_legal_subtitle: "Australian Immigration Law",
        page_legal_desc: "Up-to-date analyses and guides on Australian immigration law, visa applications, legal processes and court decisions.",
        page_education_title: "EDUCATION",
        page_education_subtitle: "Australian Education System",
        page_education_desc: "Comprehensive information about education opportunities in Australia, scholarship programs, GTE requirements and student visa processes.",
        page_social_title: "SOCIAL",
        page_social_subtitle: "Community Life & Rights",
        page_social_desc: "Current information about tenant rights, worker rights, healthcare system and community integration in Australia.",
        page_projects_title: "PROJECTS",
        page_projects_subtitle: "Migron Projects",
        page_projects_desc: "Technology projects, tools and platforms developed for the Turkish diaspora in Australia.",
        page_contact_title: "CONTACT",
        page_contact_subtitle: "Get in Touch",
        page_contact_desc: "Feel free to contact us for your questions, suggestions or collaboration proposals.",
        page_coming_soon: "Content coming soon.",
        page_back_home: "Back to Home",
        page_email_label: "Email",
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('tr');

    const t = (key) => translations[lang]?.[key] || translations['tr']?.[key] || key;

    const toggleLanguage = () => {
        setLang(prev => prev === 'tr' ? 'en' : 'tr');
    };

    return (
        <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
