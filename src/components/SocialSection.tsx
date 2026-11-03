import React from 'react';
import { MessageCircle, ExternalLink, Instagram, Facebook, Video, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { SiteContent } from '../types';

interface SocialSectionProps {
  content: SiteContent;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ content }) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      handle: content.contact_whatsapp,
      url: `https://wa.me/201550760124`,
      desc_ar: 'الطلبات المباشرة والاستفسارات اليومية وحجز الطاولات',
      desc_en: 'Direct orders, daily inquiries & table bookings',
      bgColor: 'bg-[#25D366]/10 hover:bg-[#25D366]/20',
      borderColor: 'border-[#25D366]/30 hover:border-[#25D366]',
      textColor: 'text-[#25D366]',
      icon: MessageCircle,
      cta_ar: 'تواصل الآن',
      cta_en: 'Chat Now',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@music_city_egypt',
      url: content.social_instagram,
      desc_ar: 'شاهد أحدث صور أطباقنا وأجواء الصالة وكواليس التحضير',
      desc_en: 'Explore food stories, behind-the-scenes & dining ambience',
      bgColor: 'bg-[#E1306C]/10 hover:bg-[#E1306C]/20',
      borderColor: 'border-[#E1306C]/30 hover:border-[#E1306C]',
      textColor: 'text-[#E1306C]',
      icon: Instagram,
      cta_ar: 'متابعة الحساب',
      cta_en: 'Follow Page',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'Music City Restaurant',
      url: content.social_facebook,
      desc_ar: 'تابع عروضنا الموسمية ومشاركات الزوار وتقييمات الأطباق',
      desc_en: 'Follow our official updates, seasonal specials & community',
      bgColor: 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20',
      borderColor: 'border-[#1877F2]/30 hover:border-[#1877F2]',
      textColor: 'text-[#1877F2]',
      icon: Facebook,
      cta_ar: 'زيارة الصفحة',
      cta_en: 'Visit Page',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@music.city.eg',
      url: content.social_tiktok,
      desc_ar: 'فيديوهات تفاعلية للمشويات والبيتزا والحلويات وطشة الملوخية',
      desc_en: 'Engaging short reels showcasing our live kitchen and sizzle',
      bgColor: 'bg-[#FE2C55]/10 hover:bg-[#FE2C55]/20',
      borderColor: 'border-[#FE2C55]/30 hover:border-[#FE2C55]',
      textColor: 'text-[#FE2C55]',
      icon: Video,
      cta_ar: 'مشاهدة المقاطع',
      cta_en: 'Watch Videos',
    },
  ];

  return (
    <section className="py-20 bg-[#F4EFE5] text-[#24211E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B99A62]/15 text-[#687052] border border-[#B99A62]/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Share2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'مجتمع ميوزيك سيتي' : 'Music City Community'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211B17]">
            {isAr ? 'تواصل معنا وشاركنا لحظاتك' : 'Connect With Us on Social Media'}
          </h2>
          <p className="mt-2 text-[#24211E]/70 text-sm sm:text-base font-light">
            {isAr
              ? 'تابع قنواتنا الرسمية للبقاء على اطلاع دائم بجديد مطعم وكافيه ميوزيك سيتي بأسيوط'
              : 'Follow our verified accounts for new creations, updates and instant contact'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map(channel => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.id}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-6 rounded-2xl bg-[#FCFAF6] border ${channel.borderColor} shadow-sm transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${channel.bgColor} ${channel.textColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#211B17] mb-0.5">
                    {channel.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#B99A62] dir-ltr inline-block mb-3">
                    {channel.handle}
                  </p>
                  <p className="text-xs text-[#24211E]/70 font-light leading-relaxed">
                    {isAr ? channel.desc_ar : channel.desc_en}
                  </p>
                </div>

                <div className={`mt-6 pt-4 border-t border-[#E7DDCD] flex items-center justify-between text-xs font-bold ${channel.textColor}`}>
                  <span>{isAr ? channel.cta_ar : channel.cta_en}</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
