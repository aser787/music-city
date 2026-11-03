import React from 'react';
import { ChefHat, Flame, Coffee, HeartHandshake, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { SiteContent } from '../types';

interface AboutViewProps {
  content: SiteContent;
  onExploreMenu: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ content, onExploreMenu }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#F4EFE5] text-[#24211E] pt-24 pb-20">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#211B17] text-[#FCFAF6] rounded-3xl p-8 sm:p-14 border border-[#B99A62]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A62]/20 text-[#B99A62] text-xs font-bold uppercase tracking-wider mb-4 border border-[#B99A62]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'قصة ميوزيك سيتي' : 'The Music City Story'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FCFAF6] mb-4">
              {isAr ? content.about_title_ar : content.about_title_en}
            </h1>
            <p className="text-base sm:text-lg text-[#FCFAF6]/80 font-light leading-relaxed">
              {isAr
                ? 'علامة فارقة في فنون الطهي والضيافة الراقية في مدينة أسيوط، تقدم تجربة طعام استثنائية ترضي كافة الأذواق.'
                : 'A benchmark of culinary mastery and warm hospitality in Assiut, delivering exceptional moments for every guest.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211B17]">
              {isAr ? 'فلسفتنا في فن الطهي' : 'Our Culinary Philosophy'}
            </h2>
            <p className="text-base sm:text-lg text-[#24211E]/80 leading-relaxed font-light">
              {isAr ? content.about_text_ar : content.about_text_en}
            </p>
            <p className="text-base text-[#24211E]/80 leading-relaxed font-light">
              {isAr ? content.story_text_ar : content.story_text_en}
            </p>

            <div className="pt-4 flex items-center gap-3 text-sm text-[#687052] font-semibold">
              <MapPin className="w-5 h-5 text-[#B99A62]" />
              <span>{isAr ? content.contact_city_ar : content.contact_city_en}</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FCFAF6]">
              <img
                src={content.about_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85'}
                alt="Music City Interior and Dining"
                className="w-full h-[450px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Commitment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="p-8 rounded-2xl bg-[#FCFAF6] border border-[#E7DDCD] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#B99A62]/15 text-[#B99A62] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#211B17]">
              {isAr ? 'جودة المكونات' : 'Fresh Ingredients'}
            </h3>
            <p className="text-xs text-[#24211E]/70 leading-relaxed font-light">
              {isAr
                ? 'ننتقي يومياً أجود اللحوم والخضروات الطازجة والتوابل الطبيعية دون أي مساومة على معايير الجودة.'
                : 'We select the freshest local produce, prime meats and natural herbs daily.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#FCFAF6] border border-[#E7DDCD] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#B99A62]/15 text-[#B99A62] flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#211B17]">
              {isAr ? 'شغف الطهي والإتقان' : 'Culinary Craftsmanship'}
            </h3>
            <p className="text-xs text-[#24211E]/70 leading-relaxed font-light">
              {isAr
                ? 'فريق من الطهاة المحترفين يجمع بين التراث المصري الأصيل وأسرار المطبخ الإيطالي والغربي.'
                : 'Our seasoned chefs blend authentic Egyptian heritage with fine Italian and Western craftsmanship.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#FCFAF6] border border-[#E7DDCD] space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#B99A62]/15 text-[#B99A62] flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#211B17]">
              {isAr ? 'قهوة مختصة وأجواء ساحرة' : 'Specialty Coffee & Ambiance'}
            </h3>
            <p className="text-xs text-[#24211E]/70 leading-relaxed font-light">
              {isAr
                ? 'جلسات مريحة وموسيقى هادئة تناسب العائلات والأصدقاء مع تشكيلة واسعة من القهوة والحلويات.'
                : 'An intimate, welcoming setting perfect for families and gatherings with handcrafted coffee.'}
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={onExploreMenu}
            className="px-8 py-3.5 rounded-full bg-[#B99A62] hover:bg-[#c9aa70] text-[#211B17] font-bold text-sm tracking-wide shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            {isAr ? 'استعرض المنيو الرقمي الكامل' : 'Browse Full Digital Menu'}
          </button>
        </div>
      </div>
    </div>
  );
};
