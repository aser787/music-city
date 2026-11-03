import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { SiteContent } from '../types';

interface VisualStorytellingProps {
  content: SiteContent;
  onExploreMenu: () => void;
}

export const VisualStorytelling: React.FC<VisualStorytellingProps> = ({ content, onExploreMenu }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <section className="py-24 bg-[#302720] text-[#FCFAF6] relative overflow-hidden">
      {/* Texture background */}
      <div className="absolute inset-0 bg-[radial-gradient(#B99A62_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#B99A62]/20 text-[#B99A62] border border-[#B99A62]/40 text-xs font-bold uppercase tracking-wider">
              {isAr ? 'تجربة فريدة في أسيوط' : 'Distinctive Dining Experience'}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FCFAF6] leading-tight">
              {isAr ? content.story_title_ar : content.story_title_en}
            </h2>

            <p className="text-base sm:text-lg text-[#FCFAF6]/80 leading-relaxed font-light">
              {isAr ? content.story_text_ar : content.story_text_en}
            </p>

            {/* Atmosphere Highlights */}
            <div className="pt-4 border-t border-[#B99A62]/20 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-[#211B17]/60 border border-[#B99A62]/15">
                <span className="block font-serif text-2xl font-bold text-[#B99A62]">15+</span>
                <span className="text-[11px] text-[#FCFAF6]/70">
                  {isAr ? 'قسماً متنوعاً' : 'Menu Sections'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#211B17]/60 border border-[#B99A62]/15">
                <span className="block font-serif text-2xl font-bold text-[#B99A62]">150+</span>
                <span className="text-[11px] text-[#FCFAF6]/70">
                  {isAr ? 'طبقاً ومشروباً' : 'Dishes & Drinks'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#211B17]/60 border border-[#B99A62]/15">
                <span className="block font-serif text-2xl font-bold text-[#B99A62]">100%</span>
                <span className="text-[11px] text-[#FCFAF6]/70">
                  {isAr ? 'لحوم طازجة' : 'Fresh Meats'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onExploreMenu}
                className="px-7 py-3.5 rounded-full bg-[#B99A62] hover:bg-[#c9aa70] text-[#211B17] font-bold text-sm tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                {isAr ? 'استكشف قائمة الطعام والأسعار' : 'Explore Dishes & Prices'}
              </button>
            </div>
          </div>

          {/* Asymmetric Photography Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#B99A62]/20 h-56">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
                  alt="Fine Steaks and Beef"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#B99A62]/20 h-44">
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80"
                  alt="Specialty Coffee"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#B99A62]/20 h-44">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
                  alt="Artisan Pizza"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#B99A62]/20 h-56">
                <img
                  src={content.story_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80'}
                  alt="Atmospheric Dining Space"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
