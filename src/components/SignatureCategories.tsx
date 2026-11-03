import React from 'react';
import { ArrowLeft, ArrowRight, Pizza, Coffee, Utensils, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Category } from '../types';

interface SignatureCategoriesProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const SignatureCategories: React.FC<SignatureCategoriesProps> = ({
  categories,
  onSelectCategory,
}) => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  // Specific mapping for the four required signature cards
  const signatureItems = [
    {
      key: 'pizza-pasta',
      targetCategorySlug: 'pizza-pasta',
      title_ar: 'بيتزا وباستا',
      title_en: 'Pizza & Pasta',
      subtitle_ar: 'بيتزا إيطالية مخبوزة على الحجر وباستا ألفريدو ونجرسكو',
      subtitle_en: 'Artisan stone-baked pizzas and velvety creamy pastas',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85',
      icon: Pizza,
    },
    {
      key: 'coffee',
      targetCategorySlug: 'coffee',
      title_ar: 'قهوة ومشروبات',
      title_en: 'Coffee & Brews',
      subtitle_ar: 'اسبرسو مختص، كابتشينو، قهوة تركية، ولاتيه إسباني',
      subtitle_en: 'Specialty espresso, Turkish coffee, cortado & lattes',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=85',
      icon: Coffee,
    },
    {
      key: 'eastern',
      targetCategorySlug: 'eastern',
      title_ar: 'شرقي وطواجن',
      title_en: 'Eastern Casseroles',
      subtitle_ar: 'طواجن فخار باللحم الشمبري، عكاوي، كوارع، وفته موزه ضاني',
      subtitle_en: 'Authentic clay pot casseroles, oxtail, and lamb shank fattah',
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=85',
      icon: Utensils,
    },
    {
      key: 'grills',
      targetCategorySlug: 'grills',
      title_ar: 'مشويات على الفحم',
      title_en: 'Charcoal Grills',
      subtitle_ar: 'كباب وكفتة ضاني، ريش، طرب بيانكو، وشيش طاووق',
      subtitle_en: 'Prime charcoal kebab, lamb kofta, chops & mix grill',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=85',
      icon: Flame,
    },
  ];

  const handleCardClick = (targetSlug: string) => {
    // Find category from real DB categories by slug or id or signature_key
    const matched = categories.find(
      c => c.slug === targetSlug || c.id === `cat-${targetSlug}` || c.signature_key === targetSlug
    );
    if (matched) {
      onSelectCategory(matched.id);
    } else {
      // Fallback to first available category
      onSelectCategory(categories[0]?.id || 'all');
    }
  };

  return (
    <section className="py-20 bg-[#211B17] text-[#FCFAF6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#B99A62]/15 text-[#B99A62] border border-[#B99A62]/30 text-xs font-bold uppercase tracking-wider mb-3">
            {t('sig.title')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FCFAF6] tracking-tight mb-4">
            {isAr ? 'الأقسام المميزة في ميوزيك سيتي' : 'Signature Culinary Collections'}
          </h2>
          <p className="text-[#FCFAF6]/70 text-base sm:text-lg font-light leading-relaxed">
            {t('sig.subtitle')}
          </p>
        </div>

        {/* Four Distinctive Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureItems.map(item => {
            const Icon = item.icon;
            // Lookup category to get real image if admin uploaded one
            const dbCat = categories.find(
              c => c.slug === item.targetCategorySlug || c.signature_key === item.key
            );
            const displayImage = dbCat?.image || item.image;

            return (
              <button
                key={item.key}
                onClick={() => handleCardClick(item.targetCategorySlug)}
                className="group relative h-[420px] rounded-2xl overflow-hidden text-left border border-[#B99A62]/20 hover:border-[#B99A62] shadow-xl transition-all duration-500 flex flex-col justify-end p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B99A62]"
                aria-label={`Open ${item.title_en} category`}
              >
                {/* Background Food Photography */}
                <img
                  src={displayImage}
                  alt={isAr ? item.title_ar : item.title_en}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />

                {/* Controlled Dark Overlay for High Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211B17] via-[#211B17]/65 to-transparent group-hover:via-[#211B17]/50 transition-colors" />

                {/* Top Badge Icon */}
                <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[#211B17]/80 backdrop-blur-md border border-[#B99A62]/40 text-[#B99A62] flex items-center justify-center group-hover:bg-[#B99A62] group-hover:text-[#211B17] transition-all">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Card Content & Typography */}
                <div className="relative z-10 space-y-2">
                  <div className="text-[11px] font-bold text-[#B99A62] uppercase tracking-widest">
                    {isAr ? item.title_en : item.title_ar}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#FCFAF6] group-hover:text-[#B99A62] transition-colors leading-snug">
                    {isAr ? item.title_ar : item.title_en}
                  </h3>

                  <p className="text-xs text-[#FCFAF6]/75 font-light line-clamp-2 leading-relaxed">
                    {isAr ? item.subtitle_ar : item.subtitle_en}
                  </p>

                  {/* Interactive Button Cue */}
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#B99A62] group-hover:translate-x-1 transition-transform">
                    <span>{t('sig.view_category')}</span>
                    {isAr ? (
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
