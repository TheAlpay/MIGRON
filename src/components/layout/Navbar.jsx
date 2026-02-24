import React from 'react';
import { Menu, X, Scale } from 'lucide-react';
import { SITE_NAME, SITE_ACCENT } from '../../config/constants';
import { navItems } from '../../data/content';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-[#ccff00] p-1">
                        <Scale className="text-black" size={24} strokeWidth={3} />
                    </div>
                    <span className="font-black text-2xl tracking-tighter uppercase italic">
                        {SITE_NAME}
                    </span>
                </div>

                <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.2em]">
                    {navItems.map(item => (
                        <a key={item} href="#" className="hover:text-[#ccff00] transition-colors relative group">
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#ccff00] transition-all group-hover:w-full"></span>
                        </a>
                    ))}
                </div>

                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-[#ccff00]">
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
