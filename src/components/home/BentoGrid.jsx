import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const BentoGrid = () => {
    const { t } = useLanguage();

    const blogPosts = [
        { id: 2, category: t('blog2_cat'), title: t('blog2_title'), date: t('time_5h'), path: '/egitim' },
        { id: 3, category: t('blog3_cat'), title: t('blog3_title'), date: t('time_12h'), path: '/sosyal' },
        { id: 4, category: t('blog4_cat'), title: t('blog4_title'), date: t('time_1d'), path: '/projeler' },
        { id: 5, category: t('blog5_cat'), title: t('blog5_title'), date: t('time_2d'), path: '/hukuk' },
    ];

    return (
        <section className="max-w-[1600px] mx-auto px-6 py-24">
            <div className="flex items-end justify-between mb-16">
                <div>
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-[#ccff00] uppercase mb-4">{t('section_flow')}</h3>
                    <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{t('section_analyses')}</h4>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-loose">
                        {t('data_source')}<br />
                        {t('data_update')}: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Bento Item 1 - Large */}
                <Link to="/hukuk" className="md:col-span-2 md:row-span-2 bg-[#111] p-10 border border-white/5 hover:border-[#ccff00]/50 transition-all group flex flex-col justify-between min-h-[400px]">
                    <div>
                        <div className="flex justify-between items-start mb-12">
                            <Shield className="text-[#ccff00]" size={40} />
                            <span className="text-[10px] font-bold text-white/40">{t('safe_data')}</span>
                        </div>
                        <h5 className="text-3xl font-black uppercase leading-tight group-hover:text-[#ccff00] transition-colors italic">{t('bento_title')}</h5>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-sm text-white/40 max-w-[250px] uppercase font-bold tracking-tight">{t('bento_desc')}</p>
                        <div className="w-12 h-12 bg-white/5 flex items-center justify-center group-hover:bg-[#ccff00] group-hover:text-black transition-all">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </Link>

                {/* Bento Item 2 - Australia Status */}
                <Link to="/hukuk" className="md:col-span-2 bg-[#ccff00] text-black p-10 flex flex-col justify-center relative overflow-hidden hover:brightness-110 transition-all">
                    <Zap className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 rotate-12" />
                    <h5 className="text-4xl font-black italic tracking-tighter uppercase mb-4">{t('australia')}</h5>
                    <div className="flex gap-8 mt-4">
                        <div>
                            <div className="text-2xl font-black">%98</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest">{t('data_accuracy')}</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black">7/24</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest">{t('legal_tracking')}</div>
                        </div>
                    </div>
                </Link>

                {/* Bento Items - Blog posts */}
                {blogPosts.map((post) => (
                    <Link to={post.path} key={post.id} className="bg-[#111] p-8 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group">
                        <div className="flex justify-between text-[10px] font-bold text-white/40 mb-8 uppercase tracking-widest">
                            <span>{post.category}</span>
                            <span>{post.date}</span>
                        </div>
                        <h6 className="text-xl font-black uppercase leading-none group-hover:text-[#ccff00]">{post.title}</h6>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default BentoGrid;
