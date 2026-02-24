import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSlider from './components/home/HeroSlider';
import BentoGrid from './components/home/BentoGrid';
import AiTerminal from './components/chat/AiTerminal';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#ccff00] selection:text-black">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="pt-20">
        <HeroSlider />
        <BentoGrid />
      </main>

      <AiTerminal />
      <Footer />
    </div>
  );
};

export default App;
