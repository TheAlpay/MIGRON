import React from 'react';
import { Scale } from 'lucide-react';
import { SITE_NAME, SITE_EMAIL, SITE_TAGLINE, SITE_FOOTER_TEXT, SITE_COPYRIGHT } from '../../config/constants';
import { footerNav } from '../../data/content';

const Footer = () => {
    return (
        <footer className="bg-black border-t-8 border-[#ccff00] py-24 px-6">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-[#ccff00] w-8 h-8 flex items-center justify-center">
                                <Scale size={18} className="text-black" />
                            </div>
                            <span className="font-black text-4xl tracking-tighter italic uppercase">{SITE_NAME}</span>
                        </div>
                        <p className="text-lg text-white/40 uppercase font-black tracking-tight leading-tight">
                            {SITE_TAGLINE}
                        </p>
                    </div>
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h5 className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.3em] mb-6">Navigasyon</h5>
                            <ul className="space-y-4 text-xs font-bold text-white/60">
                                {footerNav.map(item => (
                                    <li key={item.label} className="hover:text-white cursor-pointer tracking-widest">{item.label}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.3em] mb-6">Yasal</h5>
                            <p className="text-[9px] text-white/30 uppercase leading-relaxed font-bold tracking-tight">
                                Sunulan tüm analizler resmi mahkeme kayıtları ve bakanlık genelgeleri temel alınarak oluşturulmuştur. Bireysel danışmanlık değildir.
                            </p>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black text-[#ccff00] uppercase tracking-[0.3em] mb-6">İletişim</h5>
                            <p className="text-xs font-black italic tracking-widest underline decoration-[#ccff00]">{SITE_EMAIL}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-[0.5em] text-white/20 uppercase">
                    <span>{SITE_COPYRIGHT}</span>
                    <span className="mt-4 md:mt-0 italic">{SITE_FOOTER_TEXT}</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
