import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, MessageCircle, Info, Sparkles, Filter, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { productMatchesSearch, formatPrice, calculateTotalWithHallService } from '../utils/menuLogic';
import type { Category, Product, SiteContent } from '../types';

interface MenuViewProps {
  categories: Category[];
  products: Product[];
  initialCategoryId?: string;
  content: SiteContent;
}

export const MenuView: React.FC<MenuViewProps> = ({
  categories,
  products,
  initialCategoryId,
  content,
}) => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Sync category selection if prop changes
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

  // Filter products by selected category and search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Must be active and not needing review for public display
      if (!product.is_active || product.needs_review) return false;

      // Category filter
      if (selectedCategoryId !== 'all') {
        const cat = categoryMap.get(selectedCategoryId);
        const matchId = cat ? cat.id : selectedCategoryId;
        if (product.category_id !== matchId) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        return productMatchesSearch(product, searchQuery);
      }

      return true;
    });
  }, [products, selectedCategoryId, searchQuery, categoryMap]);

  const activeCategory = categoryMap.get(selectedCategoryId);

  return (
    <div className="min-h-screen bg-[#F4EFE5] text-[#24211E] pt-24 pb-20">
      {/* Top Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-[#211B17] text-[#FCFAF6] rounded-3xl p-8 sm:p-12 border border-[#B99A62]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#B99A62]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A62]/20 text-[#B99A62] text-xs font-bold uppercase tracking-wider mb-4 border border-[#B99A62]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'المنيو الرقمي الرسمي' : 'Official Digital Menu'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FCFAF6] mb-3">
              {t('menu.title')}
            </h1>
            <p className="text-sm sm:text-base text-[#FCFAF6]/75 font-light leading-relaxed mb-6">
              {t('menu.subtitle')}
            </p>

            {/* Official VAT & Service Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#302720] border border-[#B99A62]/20 text-xs text-[#B99A62]">
              <Info className="w-4 h-4 shrink-0" />
              <span>{isAr ? content.vat_note_ar : content.vat_note_en}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-3.5 w-4 h-4 text-[#24211E]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('menu.search_placeholder')}
              className="w-full pl-4 pr-10 py-3 rounded-full bg-[#FCFAF6] border border-[#E7DDCD] focus:border-[#B99A62] focus:ring-2 focus:ring-[#B99A62]/20 text-sm outline-none transition-all placeholder:text-[#24211E]/40 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 left-3 p-1 rounded-full hover:bg-black/5 text-[#24211E]/40"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-[#24211E]/70 font-medium self-end sm:self-auto">
            {isAr ? (
              <span>يتم عرض <strong className="text-[#211B17] font-bold">{filteredProducts.length}</strong> صنفاً</span>
            ) : (
              <span>Showing <strong className="text-[#211B17] font-bold">{filteredProducts.length}</strong> items</span>
            )}
          </div>
        </div>

        {/* Category Navigation Pills (Horizontally Scrollable) */}
        <div className="mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            {/* All Items Pill */}
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                selectedCategoryId === 'all'
                  ? 'bg-[#211B17] text-[#B99A62] shadow-md scale-105'
                  : 'bg-[#FCFAF6] text-[#24211E]/80 border border-[#E7DDCD] hover:border-[#B99A62]'
              }`}
            >
              {t('menu.all')} ({products.filter(p => p.is_active && !p.needs_review).length})
            </button>

            {/* Dynamic Categories */}
            {categories.map(cat => {
              const isActive = selectedCategoryId === cat.id;
              const count = products.filter(
                p => p.category_id === cat.id && p.is_active && !p.needs_review
              ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#211B17] text-[#B99A62] shadow-md scale-105'
                      : 'bg-[#FCFAF6] text-[#24211E]/80 border border-[#E7DDCD] hover:border-[#B99A62]'
                  }`}
                >
                  <span>{isAr ? cat.name_ar : cat.name_en}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#B99A62]/20 text-[#B99A62]' : 'bg-[#E7DDCD] text-[#24211E]/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Description Header if selected */}
        {activeCategory && selectedCategoryId !== 'all' && (
          <div className="mb-8 p-6 rounded-2xl bg-[#FCFAF6] border border-[#E7DDCD] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#211B17]">
                {isAr ? activeCategory.name_ar : activeCategory.name_en}
              </h2>
              {(activeCategory.description_ar || activeCategory.description_en) && (
                <p className="text-xs text-[#24211E]/70 font-light max-w-2xl">
                  {isAr ? activeCategory.description_ar : activeCategory.description_en}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedCategoryId('all')}
              className="text-xs text-[#687052] hover:underline font-bold"
            >
              {isAr ? 'عرض كل الأقسام' : 'Show All Categories'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="bg-[#FCFAF6] rounded-3xl p-12 text-center border border-[#E7DDCD] max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#B99A62]/10 text-[#B99A62] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#211B17]">
              {t('menu.no_results')}
            </h3>
            <p className="text-xs text-[#24211E]/70 leading-relaxed font-light">
              {t('menu.no_results_sub')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryId('all');
                }}
                className="px-5 py-2 rounded-full bg-[#687052] text-white text-xs font-bold hover:bg-[#586043]"
              >
                {isAr ? 'إعادة تعيين البحث والأقسام' : 'Reset Filters'}
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(dish => {
            const cat = categoryMap.get(dish.category_id);
            const displayImage =
              dish.image ||
              cat?.image ||
              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';

            const waText = encodeURIComponent(
              `مرحباً مطعم ميوزيك سيتي، أود طلب: ${dish.name_ar} (${formatPrice(dish.price, 'ar')})`
            );

            return (
              <div
                key={dish.id}
                className="bg-[#FCFAF6] rounded-2xl overflow-hidden border border-[#E7DDCD] hover:border-[#B99A62] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Surface with Aspect Ratio */}
                  <div
                    className="relative h-52 overflow-hidden bg-[#211B17]/10 cursor-pointer"
                    onClick={() => setActiveModalProduct(dish)}
                  >
                    <img
                      src={displayImage}
                      alt={isAr ? dish.name_ar : dish.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Category badge */}
                    {cat && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#211B17]/80 backdrop-blur-md text-[10px] font-semibold text-[#B99A62] border border-[#B99A62]/30">
                        {isAr ? cat.name_ar : cat.name_en}
                      </div>
                    )}

                    {/* Price in Antique Gold */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-[#211B17] text-[#B99A62] border border-[#B99A62]/40 font-serif font-bold text-sm shadow-md">
                      {formatPrice(dish.price, lang)}
                    </div>

                    {dish.is_featured && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#B99A62] text-[#211B17] text-[10px] font-bold uppercase tracking-wider">
                        {isAr ? 'مميز' : 'Featured'}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => setActiveModalProduct(dish)}
                        className="font-serif text-lg font-bold text-[#211B17] group-hover:text-[#687052] transition-colors leading-snug cursor-pointer"
                      >
                        {isAr ? dish.name_ar : dish.name_en}
                      </h3>
                    </div>

                    {dish.name_en && dish.name_ar && (
                      <p className="text-[11px] text-[#687052] font-medium tracking-wide">
                        {isAr ? dish.name_en : dish.name_ar}
                      </p>
                    )}

                    {(dish.description_ar || dish.description_en) && (
                      <p className="text-xs text-[#24211E]/75 line-clamp-2 leading-relaxed font-light">
                        {isAr ? dish.description_ar : dish.description_en || dish.description_ar}
                      </p>
                    )}

                    {/* Sides or Options note if specified in menu */}
                    {dish.sides_note_ar && (
                      <div className="mt-2 p-2 rounded-lg bg-[#B99A62]/10 border border-[#B99A62]/20 text-[10px] text-[#211B17] leading-relaxed">
                        <span className="font-bold text-[#B99A62] block mb-0.5">
                          {t('menu.sides_included')}
                        </span>
                        <span>{isAr ? dish.sides_note_ar : dish.sides_note_en || dish.sides_note_ar}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-[#E7DDCD]/60 flex items-center gap-2">
                    <a
                      href={`https://wa.me/201550760124?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t('menu.order_whatsapp')}</span>
                    </a>

                    <button
                      onClick={() => setActiveModalProduct(dish)}
                      className="p-2 rounded-lg border border-[#E7DDCD] hover:border-[#B99A62] text-[#24211E]/70 hover:text-[#B99A62] text-xs font-medium cursor-pointer"
                      title={isAr ? 'عرض التفاصيل' : 'Details'}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dish Details Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FCFAF6] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#B99A62]/30 relative animate-scaleUp">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-[#211B17]/80 text-[#FCFAF6] flex items-center justify-center hover:bg-[#211B17] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-64 relative bg-[#211B17]/10">
              <img
                src={
                  activeModalProduct.image ||
                  categoryMap.get(activeModalProduct.category_id)?.image ||
                  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85'
                }
                alt={isAr ? activeModalProduct.name_ar : activeModalProduct.name_en}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211B17]/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 px-4 py-1.5 rounded-xl bg-[#211B17] text-[#B99A62] border border-[#B99A62]/40 font-serif font-bold text-lg">
                {formatPrice(activeModalProduct.price, lang)}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#211B17]">
                  {isAr ? activeModalProduct.name_ar : activeModalProduct.name_en}
                </h3>
                {activeModalProduct.name_en && (
                  <p className="text-xs text-[#687052] font-medium tracking-wide">
                    {isAr ? activeModalProduct.name_en : activeModalProduct.name_ar}
                  </p>
                )}
              </div>

              {(activeModalProduct.description_ar || activeModalProduct.description_en) && (
                <div className="p-3 rounded-xl bg-[#F4EFE5] border border-[#E7DDCD] text-sm text-[#24211E]/80 leading-relaxed font-light">
                  {isAr ? activeModalProduct.description_ar : activeModalProduct.description_en || activeModalProduct.description_ar}
                </div>
              )}

              {activeModalProduct.sides_note_ar && (
                <div className="p-3 rounded-xl bg-[#B99A62]/10 border border-[#B99A62]/30 text-xs text-[#211B17] space-y-1">
                  <div className="font-bold text-[#B99A62]">
                    {t('menu.sides_included')}
                  </div>
                  <div>
                    {isAr ? activeModalProduct.sides_note_ar : activeModalProduct.sides_note_en || activeModalProduct.sides_note_ar}
                  </div>
                </div>
              )}

              {/* Hall Dine-in calculation hint */}
              <div className="pt-2 text-xs text-[#24211E]/60 flex items-center justify-between border-t border-[#E7DDCD]">
                <span>
                  {isAr ? 'السعر داخل الصالة شامل الخدمة (12%):' : 'Dine-in total including 12% service:'}
                </span>
                <span className="font-bold text-[#211B17]">
                  {formatPrice(calculateTotalWithHallService(activeModalProduct.price, 12).total, lang)}
                </span>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/201550760124?text=${encodeURIComponent(
                    `مرحباً ميوزيك سيتي، أود طلب: ${activeModalProduct.name_ar} (${formatPrice(activeModalProduct.price, 'ar')})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] shadow-lg shadow-[#25D366]/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('menu.order_whatsapp')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
