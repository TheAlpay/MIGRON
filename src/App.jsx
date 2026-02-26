import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSlider from './components/home/HeroSlider';
import BentoGrid from './components/home/BentoGrid';
import AiTerminal from './components/chat/AiTerminal';
import SubPage from './components/pages/SubPage';
import ArticlePage from './components/pages/ArticlePage';
import SSSPage from './components/pages/SSSPage';
import ProgramTurleriPage from './components/pages/ProgramTurleriPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import SEOHead from './components/seo/SEOHead';

const HomePage = () => (
  <>
    <SEOHead
      title="Anasayfa"
      description="MIGRON — Avustralya göçmenlik hukuku ve danışmanlık platformu. Güncel analizler ve hukuki rehberlik."
    />
    <main id="main-content" className="pt-20">
      <HeroSlider />
      <BentoGrid />
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

  if (!user) {
    return <AdminLogin onLogin={setUser} />;
  }

  return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#ccff00] focus:text-black focus:px-4 focus:py-2 focus:font-black focus:uppercase"
        >
          İçeriğe Atla
        </a>
        <Routes>
          {/* Admin Route — no navbar/footer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Public Routes */}
          <Route path="*" element={
            <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#ccff00] selection:text-black">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hukuk" element={<SubPage pageId="hukuk" />} />
                <Route path="/egitim" element={<SubPage pageId="egitim" />} />
                <Route path="/sosyal" element={<SubPage pageId="sosyal" />} />
                <Route path="/sss" element={<SSSPage />} />
                <Route path="/program-turleri" element={<ProgramTurleriPage />} />
                <Route path="/iletisim" element={<SubPage pageId="iletisim" />} />
                <Route path="/makale/:slug" element={<ArticlePage />} />
              </Routes>

              <AiTerminal />
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
