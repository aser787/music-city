import React from 'react';
import { ChefHat, Flame, Coffee, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { SiteContent } from '../types';

interface BrandIntroSectionProps {
  content: SiteContent;
  onExploreMenu: () => void;
}

export const BrandIntroSection: React.FC<BrandIntroSectionProps> = ({ content, onExploreMenu }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const pillars = [
    {
      icon: Flame,
      title_ar: 'مشويات على الفحم',
      title_en: 'Charcoal Grills',
      desc_ar: 'لحوم ضاني وبقري طازجة متبلة بخلطتنا الأصيلة ومشوية على الفحم الطبيعي.',
      desc_en: 'Fresh prime meats seasoned with heritage spices and grilled over live coals.',
    },
    {
      icon: ChefHat,
      title_ar: 'أطباق وطواجن شرقية',
      title_en: 'Authentic Casseroles',
      desc_ar: 'طواجن فخار مسبكة بعناية، كوارع، عكاوي، فته موزه، وحمام بالفريك.',
      desc_en: 'Clay pot delicacies, oxtail, lamb shank fattah, and artisanal stuffed squab.',
    },
    {
      icon: Coffee,
      title_ar: 'قهوة وحلويات فاخرة',
      title_en: 'Coffee & Pastries',
      desc_ar: 'اسبرسو إيطالي، قهوة تركية، كابتشينو، وتشكيلة حلويات غربية وتيراميسو.',
      desc_en: 'Italian espresso, Turkish coffee brews, and handcrafted delicate European sweets.',
    },
    {
      icon: HeartHandshake,
      title_ar: 'كرم الضيافة بأسيوط',
      title_en: 'Assiut Hospitality',
      desc_ar: 'أجواء عائلية راقية وخدمة محترفة ترحب بكم وبضيوفكم الكرام طوال اليوم.',
      desc_en: 'An elegant welcoming ambiance and refined service for you and your family.',
    },
  ];

  return (
    <section id="brand-intro" className="py-20 bg-[#F4EFE5] text-[#24211E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left / Top Editorial Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FCFAF6]">
              <img
                src={content.about_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85'}
                alt="Music City Ambiance"
                className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211B17]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-sm font-light">
                <span className="font-serif text-lg font-bold block text-[#B99A62]">
                  MUSIC CITY • ASSIUT
                </span>
                <span>{isAr ? 'حيث يلتقي الشغف بالطهي مع الرقي في كل تفصيلة' : 'Where culinary art meets hospitality'}</span>
              </div>
            </div>
            {/* Decorative Gold Accent Badge */}
            <div className="hidden sm:block absolute -bottom-5 -right-5 bg-[#211B17] text-[#B99A62] border border-[#B99A62]/30 p-4 rounded-xl shadow-xl">
              <span className="block text-2xl font-serif font-bold text-center">100%</span>
              <span className="text-[11px] uppercase tracking-wider text-white/80 block">
                {isAr ? 'مكونات طازجة يومياً' : 'Fresh Daily Ingredients'}
              </span>
            </div>
          </div>

          {/* Right Editorial Text & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#B99A62]/15 text-[#687052] border border-[#B99A62]/30 text-xs font-bold uppercase tracking-wider">
              {isAr ? 'عن ميوزيك سيتي' : 'About Music City'}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211B17] leading-tight">
              {isAr ? content.about_title_ar : content.about_title_en}
            </h2>

            <p className="text-base sm:text-lg text-[#24211E]/80 leading-relaxed font-light">
              {isAr ? content.about_text_ar : content.about_text_en}
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FCFAF6] border border-[#E7DDCD] shadow-sm hover:border-[#B99A62] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#B99A62]/15 text-[#B99A62] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#211B17] mb-1">
                      {isAr ? item.title_ar : item.title_en}
                    </h3>
                    <p className="text-xs text-[#24211E]/70 leading-relaxed font-light">
                      {isAr ? item.desc_ar : item.desc_en}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3 rounded-full bg-[#687052] hover:bg-[#586043] text-[#FCFAF6] font-semibold text-sm tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {isAr ? 'تصفح قائمة الطعام كاملة' : 'Browse Full Restaurant Menu'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
