import React from 'react';
import { Shield, Zap, ArrowUpRight } from 'lucide-react';
import { blogPosts } from '../../data/content';

const BentoGrid = () => {
    return (
        <section className="max-w-[1600px] mx-auto px-6 py-24">
            <div className="flex items-end justify-between mb-16">
                <div>
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-[#ccff00] uppercase mb-4">Sistem Akışı</h3>
                    <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">GÜNCEL ANALİZLER</h4>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-loose">
                        VERİ KAYNAĞI: AU FEDERAL COURTS<br />
                        GÜNCELLEME: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Bento Item 1 - Large */}
                <div className="md:col-span-2 md:row-span-2 bg-[#111] p-10 border border-white/5 hover:border-[#ccff00]/50 transition-all group flex flex-col justify-between min-h-[400px]">
                    <div>
                        <div className="flex justify-between items-start mb-12">
                            <Shield className="text-[#ccff00]" size={40} />
                            <span className="text-[10px] font-bold text-white/40">GÜVENLİ VERİ</span>
                        </div>
                        <h5 className="text-3xl font-black uppercase leading-tight group-hover:text-[#ccff00] transition-colors italic">Sektörel Sponsorluklarda <br /> Hukuki Risk Analizi</h5>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-sm text-white/40 max-w-[250px] uppercase font-bold tracking-tight">İşveren sponsorluğu vizelerinde dolandırıcılık tespiti ve iptal protokolleri.</p>
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-all">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>

                {/* Bento Item 2 - Status */}
                <div className="md:col-span-2 bg-[#ccff00] text-black p-10 flex flex-col justify-center relative overflow-hidden">
                    <Zap className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12" />
                    <h5 className="text-4xl font-black italic tracking-tighter uppercase mb-4">AVUSTRALYA PROJESİ</h5>
                    <div className="flex gap-8 mt-4">
                        <div>
                            <div className="text-2xl font-black">%98</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest">VERİ DOĞRULUĞU</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black">7/24</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest">HUKUKİ TAKİP</div>
                        </div>
                    </div>
                </div>

                {/* Bento Items - Blog posts */}
                {blogPosts.slice(1).map((post, idx) => (
                    <div key={idx} className="bg-[#111] p-8 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group">
                        <div className="flex justify-between text-[10px] font-bold text-white/40 mb-8 uppercase tracking-widest">
                            <span>{post.category}</span>
                            <span>{post.date}</span>
                        </div>
                        <h6 className="text-xl font-black uppercase leading-none group-hover:text-[#ccff00]">{post.title}</h6>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BentoGrid;
