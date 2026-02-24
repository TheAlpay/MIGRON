import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const HeroSlider = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const { t } = useLanguage();

    const slides = [
        {
            title: t('slide1_title'),
            tags: [t('slide1_tag1'), t('slide1_tag2')],
            description: t('slide1_desc'),
            image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=1000"
        },
        {
            title: t('slide2_title'),
            tags: [t('slide2_tag1'), t('slide2_tag2')],
            description: t('slide2_desc'),
            image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1000"
        },
        {
            title: t('slide3_title'),
            tags: [t('slide3_tag1'), t('slide3_tag2')],
            description: t('slide3_desc'),
            image: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&q=80&w=1000"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section className="relative h-[80vh] min-h-[600px] bg-black overflow-hidden border-b border-white/10">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${activeSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                    <img src={slide.image} className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-700" alt={slide.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 max-w-[1200px]">
                        <div className="flex gap-2 mb-6">
                            {slide.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-widest">{tag}</span>
                            ))}
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6 uppercase italic">
                            {slide.title}
                        </h2>
                        <p className="text-xl text-white/60 max-w-xl mb-8 font-medium border-l-4 border-[#ccff00] pl-6 uppercase tracking-tight">
                            {slide.description}
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-white text-black px-10 py-4 font-black uppercase text-sm hover:bg-[#ccff00] transition-colors flex items-center gap-2 group">
                                {t('btn_open_file')} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="absolute bottom-12 right-12 flex gap-4 z-20">
                <button onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)} className="w-14 h-14 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={() => setActiveSlide((activeSlide + 1) % slides.length)} className="w-14 h-14 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <ChevronRight size={32} />
                </button>
            </div>
        </section>
    );
};

export default HeroSlider;
