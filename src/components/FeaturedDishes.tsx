import React from 'react';
import { Star, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/menuLogic';
import type { Product, Category } from '../types';

interface FeaturedDishesProps {
  products: Product[];
  categories: Category[];
  onExploreMenu: () => void;
  onOpenProduct?: (product: Product) => void;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({
  products,
  categories,
  onExploreMenu,
  onOpenProduct,
}) => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  // Take top featured items
  const featured = products.filter(p => p.is_featured && p.is_active && !p.needs_review).slice(0, 6);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#F4EFE5] text-[#24211E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B99A62]/15 text-[#687052] border border-[#B99A62]/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-[#B99A62] text-[#B99A62]" />
              <span>{t('featured.title')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211B17] tracking-tight">
              {isAr ? 'أطباق مختارة من إبداع شيف ميوزيك سيتي' : 'Signature Chef Creations'}
            </h2>
            <p className="mt-2 text-[#24211E]/70 text-base max-w-xl font-light">
              {t('featured.subtitle')}
            </p>
          </div>

          <button
            onClick={onExploreMenu}
            className="self-start md:self-auto inline-flex items-center gap-2 text-sm font-bold text-[#687052] hover:text-[#211B17] transition-colors cursor-pointer group"
          >
            <span>{isAr ? 'عرض جميع أصناف المنيو' : 'View Full Menu'}</span>
            {isAr ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map(dish => {
            const cat = categoryMap.get(dish.category_id);
            const categoryName = isAr ? cat?.name_ar : cat?.name_en;
            const waText = encodeURIComponent(
              `مرحباً ميوزيك سيتي، أود الاستفسار والطلب لطبق: ${dish.name_ar} (${formatPrice(dish.price, 'ar')})`
            );

            return (
              <div
                key={dish.id}
                className="bg-[#FCFAF6] rounded-2xl overflow-hidden border border-[#E7DDCD] hover:border-[#B99A62] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Card Top Image */}
                <div className="relative h-60 overflow-hidden bg-[#211B17]/10">
                  <img
                    src={
                      dish.image ||
                      cat?.image ||
                      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={isAr ? dish.name_ar : dish.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category Pill Tag */}
                  {categoryName && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#211B17]/80 backdrop-blur-md text-[11px] font-semibold text-[#B99A62] border border-[#B99A62]/30">
                      {categoryName}
                    </div>
                  )}

                  {/* Price Tag in Gold */}
                  <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-[#211B17] text-[#B99A62] border border-[#B99A62]/40 font-serif font-bold text-base shadow-lg">
                    {formatPrice(dish.price, lang)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-xl font-bold text-[#211B17] group-hover:text-[#687052] transition-colors leading-snug">
                        {isAr ? dish.name_ar : dish.name_en}
                      </h3>
                    </div>

                    {dish.name_en && dish.name_ar && (
                      <p className="text-xs text-[#687052] font-medium tracking-wide">
                        {isAr ? dish.name_en : dish.name_ar}
                      </p>
                    )}

                    {(dish.description_ar || dish.description_en) && (
                      <p className="text-xs text-[#24211E]/75 line-clamp-2 leading-relaxed font-light">
                        {isAr ? dish.description_ar : dish.description_en || dish.description_ar}
                      </p>
                    )}

                    {dish.sides_note_ar && (
                      <p className="text-[11px] text-[#B99A62] bg-[#B99A62]/10 p-2 rounded-lg leading-tight font-medium">
                        {isAr ? dish.sides_note_ar : dish.sides_note_en || dish.sides_note_ar}
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-2 border-t border-[#E7DDCD]/70 flex items-center justify-between gap-3">
                    <a
                      href={`https://wa.me/201550760124?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      title="Order on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t('menu.order_whatsapp')}</span>
                    </a>

                    <button
                      onClick={onExploreMenu}
                      className="py-2 px-3 rounded-lg border border-[#E7DDCD] hover:border-[#B99A62] hover:text-[#B99A62] text-xs font-medium text-[#24211E]/70 transition-colors cursor-pointer"
                    >
                      {isAr ? 'عرض في المنيو' : 'In Menu'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
