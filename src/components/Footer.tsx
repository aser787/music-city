import React from 'react';
import { UtensilsCrossed, Phone, MapPin, ExternalLink, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { SiteContent } from '../types';

interface FooterProps {
  content: SiteContent;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onNavigate }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#211B17] text-[#FCFAF6] border-t border-[#B99A62]/20 relative overflow-hidden">
      {/* Decorative subtle texture/gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(#B99A62_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B99A62]/20 border border-[#B99A62]/40 flex items-center justify-center text-[#B99A62]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-widest text-[#FCFAF6]">
                  MUSIC CITY
                </span>
                <span className="block text-[11px] text-[#B99A62] tracking-wider uppercase">
                  {lang === 'ar' ? 'ميوزيك سيتي • أسيوط' : 'Restaurant & Café • Assiut'}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#FCFAF6]/70 leading-relaxed font-light">
              {lang === 'ar'
                ? 'مطعم ميوزيك سيتي — تجربة ضيافة راقية ومذاق استثنائي يجمع بين الفخامة والأصالة في قلب مدينة أسيوط.'
                : 'Music City Restaurant — A refined dining destination blending authentic culinary mastery with warm hospitality in Assiut.'}
            </p>
            <div className="pt-2 text-xs text-[#B99A62] font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-[#B99A62]" />
              <span>{lang === 'ar' ? content.contact_city_ar : content.contact_city_en}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#FCFAF6] tracking-wide border-b border-[#B99A62]/20 pb-2">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FCFAF6]/80 font-light">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#B99A62] transition-colors cursor-pointer"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#B99A62] transition-colors cursor-pointer"
                >
                  {t('nav.menu')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#B99A62] transition-colors cursor-pointer"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#B99A62] transition-colors cursor-pointer"
                >
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="hover:text-[#B99A62] transition-colors flex items-center gap-1.5 text-xs text-[#B99A62]/70 cursor-pointer pt-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('nav.admin')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact & WhatsApp */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#FCFAF6] tracking-wide border-b border-[#B99A62]/20 pb-2">
              {t('footer.direct_contact')}
            </h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/201550760124"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#FCFAF6] hover:bg-[#25D366]/20 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm">
                  WA
                </div>
                <div>
                  <div className="text-xs text-[#25D366] font-semibold">
                    {lang === 'ar' ? 'طلب فوري ومحادثة' : 'Order & Instant Chat'}
                  </div>
                  <div className="text-sm font-bold tracking-wider dir-ltr">
                    {content.contact_whatsapp}
                  </div>
                </div>
              </a>

              <div className="text-xs text-[#FCFAF6]/60 leading-relaxed">
                {lang === 'ar'
                  ? 'نسعد باستقبال طلباتكم وحجوزاتكم اليومية عبر الواتساب أو الهاتف مباشرة.'
                  : 'We are delighted to receive your orders and table reservations via WhatsApp or direct phone.'}
              </div>
            </div>
          </div>

          {/* Col 4: Social Media & Legal Notice */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#FCFAF6] tracking-wide border-b border-[#B99A62]/20 pb-2">
              {t('contact.social_title')}
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href={content.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/20 text-xs font-medium text-[#FCFAF6]/90 hover:border-[#B99A62] hover:text-[#B99A62] transition-all"
              >
                <span>Facebook — صفحتنا على فيسبوك</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={content.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/20 text-xs font-medium text-[#FCFAF6]/90 hover:border-[#B99A62] hover:text-[#B99A62] transition-all"
              >
                <span>Instagram — @music_city_egypt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={content.social_tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/20 text-xs font-medium text-[#FCFAF6]/90 hover:border-[#B99A62] hover:text-[#B99A62] transition-all"
              >
                <span>TikTok — @music.city.eg</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Official Tax & Service Notice from Menu */}
            <div className="p-2.5 rounded-lg bg-[#302720]/60 border border-[#B99A62]/15 text-[11px] text-[#B99A62] font-medium leading-relaxed">
              {lang === 'ar' ? content.vat_note_ar : content.vat_note_en}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-[#302720] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FCFAF6]/50">
          <div>
            © {new Date().getFullYear()} MUSIC CITY. {t('footer.rights')}.
          </div>
          <div className="text-center sm:text-left">
            {t('footer.developed_notice')}
          </div>
        </div>
      </div>
    </footer>
  );
};
