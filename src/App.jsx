import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSlider from './components/home/HeroSlider';
import BentoGrid from './components/home/BentoGrid';
import AiTerminal from './components/chat/AiTerminal';
import SubPage from './components/pages/SubPage';

const HomePage = () => (
  <main className="pt-20">
    <HeroSlider />
    <BentoGrid />
  </main>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#ccff00] selection:text-black">
          <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hukuk" element={<SubPage pageId="hukuk" />} />
            <Route path="/egitim" element={<SubPage pageId="egitim" />} />
            <Route path="/sosyal" element={<SubPage pageId="sosyal" />} />
            <Route path="/projeler" element={<SubPage pageId="projeler" />} />
            <Route path="/iletisim" element={<SubPage pageId="iletisim" />} />
          </Routes>

          <AiTerminal />
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
