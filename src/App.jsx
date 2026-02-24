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
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

const HomePage = () => (
  <main className="pt-20">
    <HeroSlider />
    <BentoGrid />
  </main>
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
                <Route path="/projeler" element={<SubPage pageId="projeler" />} />
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
