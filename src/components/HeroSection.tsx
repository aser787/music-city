import React from 'react';
import { ArrowLeft, ArrowRight, Utensils, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { SiteContent } from '../types';

interface HeroSectionProps {
  content: SiteContent;
  onExploreMenu: () => void;
  onDiscover: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content, onExploreMenu, onDiscover }) => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#211B17]">
      {/* Background Hero Image with Art-directed Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.hero_image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=85'}
          alt="Music City Gastronomy"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[8000ms]"
        />
        {/* Layered dark gradients for editorial depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211B17] via-[#211B17]/75 to-[#211B17]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211B17]/80 via-transparent to-[#211B17]/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B99A62]/15 border border-[#B99A62]/30 text-[#B99A62] text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? content.contact_city_ar : 'Fine Dining & Specialty Café • Assiut'}</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FCFAF6] tracking-tight leading-[1.15] mb-6 drop-shadow-md">
          {isAr ? content.hero_title_ar : content.hero_title_en}
        </h1>

        {/* Supporting description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#FCFAF6]/80 font-light leading-relaxed mb-10">
          {isAr ? content.hero_subtitle_ar : content.hero_subtitle_en}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#B99A62] text-[#211B17] font-bold text-base tracking-wide hover:bg-[#c9aa70] hover:shadow-xl hover:shadow-[#B99A62]/25 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Utensils className="w-5 h-5 text-[#211B17]" />
            <span>{t('hero.cta_menu')}</span>
            {isAr ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          <button
            onClick={onDiscover}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-[#FCFAF6] border border-[#E7DDCD]/30 font-medium text-base tracking-wide hover:border-[#B99A62] active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
          >
            {t('hero.cta_discover')}
          </button>
        </div>

        {/* Notice of Authenticity */}
        <div className="mt-12 text-xs text-[#B99A62]/80 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
          <span>{isAr ? 'المنيو الرسمي والأسعار المعتمدة — أطباق تحضر طازجة يومياً' : 'Official Menu & Verified Prices — Prepared Fresh Daily'}</span>
        </div>
      </div>
    </section>
  );
};
