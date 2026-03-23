import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSlider from './components/home/HeroSlider';
import BentoGrid from './components/home/BentoGrid';
import LiveTicker from './components/home/LiveTicker';
import AustraliaMap from './components/home/AustraliaMap';
import AustraliaNewsSlider from './components/home/AustraliaNewsSlider';
import CurrencyWidget from './components/home/CurrencyWidget';
import AiTerminal from './components/chat/AiTerminal';
import SubPage from './components/pages/SubPage';
import ArticlePage from './components/pages/ArticlePage';
import SSSPage from './components/pages/SSSPage';
import ProgramTurleriPage from './components/pages/ProgramTurleriPage';
import PointsCalculatorPage from './components/pages/PointsCalculatorPage';
import VisaChecklistPage from './components/pages/VisaChecklistPage';
import Ilk48SaatPage from './components/pages/Ilk48SaatPage';
import SertifikalarPage from './components/pages/SertifikalarPage';
import VergiVeSuperPage from './components/pages/VergiVeSuperPage';
import BelgeSablonlariPage from './components/pages/BelgeSablonlariPage';
import CentrelinkPage from './components/pages/CentrelinkPage';
import MaasRehberiPage from './components/pages/MaasRehberiPage';
import PrYolHaritasiPage from './components/pages/PrYolHaritasiPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import SEOHead from './components/seo/SEOHead';

const HomePage = () => (
  <>
    <SEOHead
      title="Anasayfa"
      description="MIGRON — Avustralya göçmenlik hukuku ve danışmanlık platformu. Güncel analizler, canlı kur ve hukuki rehberlik."
    />
    <main id="main-content" className="pt-20">
      <HeroSlider />
      <LiveTicker />
      <AustraliaNewsSlider />
      <BentoGrid />
      <AustraliaMap />
    </main>
  </>
);

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#ccff00] animate-pulse font-bold tracking-widest">YÜKLENİYOR...</div>
      </div>
    );
  }

  if (!user) return <AdminLogin onLogin={setUser} />;
  return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
    <LanguageProvider>
      <BrowserRouter>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#ccff00] focus:text-black focus:px-4 focus:py-2 focus:font-black focus:uppercase"
        >
          İçeriğe Atla
        </a>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#ccff00] selection:text-black">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <CurrencyWidget />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hukuk" element={<SubPage pageId="hukuk" />} />
                <Route path="/egitim" element={<SubPage pageId="egitim" />} />
                <Route path="/sosyal" element={<SubPage pageId="sosyal" />} />
                <Route path="/sss" element={<SSSPage />} />
                <Route path="/program-turleri" element={<ProgramTurleriPage />} />
                <Route path="/puan-hesapla" element={<PointsCalculatorPage />} />
                <Route path="/vize-kontrol-listesi" element={<VisaChecklistPage />} />
                <Route path="/iletisim" element={<SubPage pageId="iletisim" />} />
                <Route path="/ilk-48-saat" element={<Ilk48SaatPage />} />
                <Route path="/sertifikalar" element={<SertifikalarPage />} />
                <Route path="/vergi-ve-super" element={<VergiVeSuperPage />} />
                <Route path="/belge-sablonlari" element={<BelgeSablonlariPage />} />
                <Route path="/centrelink" element={<CentrelinkPage />} />
                <Route path="/maas-rehberi" element={<MaasRehberiPage />} />
                <Route path="/pr-yol-haritasi" element={<PrYolHaritasiPage />} />
                <Route path="/makale/:slug" element={<ArticlePage />} />
              </Routes>
              <AiTerminal />
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
