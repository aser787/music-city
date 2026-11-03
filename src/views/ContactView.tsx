import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Send, ExternalLink, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { SiteContent } from '../types';

interface ContactViewProps {
  content: SiteContent;
}

export const ContactView: React.FC<ContactViewProps> = ({ content }) => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  const [senderName, setSenderName] = useState('');
  const [inquiryType, setInquiryType] = useState('order');
  const [message, setMessage] = useState('');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = inquiryType === 'order' ? 'طلب طعام' : inquiryType === 'table' ? 'حجز طاولة' : 'استفسار عام';
    const text = encodeURIComponent(
      `مرحباً ميوزيك سيتي 🎶\nالاسم: ${senderName || 'زائر كريم'}\nنوع الطلب: ${typeLabel}\nالرسالة: ${message || 'أود الاستفسار عن المنيو وخدمة التوصيل/الصالة.'}`
    );
    window.open(`https://wa.me/201550760124?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F4EFE5] text-[#24211E] pt-24 pb-20">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#211B17] text-[#FCFAF6] rounded-3xl p-8 sm:p-14 border border-[#B99A62]/30 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A62]/20 text-[#B99A62] text-xs font-bold uppercase tracking-wider mb-4 border border-[#B99A62]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'خدمة الضيوف والطلبات' : 'Guest Service & Inquiries'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FCFAF6] mb-4">
              {t('contact.title')}
            </h1>
            <p className="text-base sm:text-lg text-[#FCFAF6]/80 font-light leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct WhatsApp Interactive Form */}
          <div className="lg:col-span-7 bg-[#FCFAF6] p-8 sm:p-10 rounded-3xl border border-[#E7DDCD] shadow-sm">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/10 text-[#25D366] text-xs font-bold mb-2">
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'إرسال رسالة مباشرة إلى واتساب المطعم' : 'Direct WhatsApp Concierge'}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#211B17]">
                {isAr ? 'أرسل طلبك أو استفسارك فوراً' : 'Send Your Order or Inquiry'}
              </h2>
              <p className="text-xs text-[#24211E]/70 font-light mt-1">
                {isAr
                  ? 'سيتم توجيه رسالتك مباشرة إلى فريق استقبال ميوزيك سيتي على الواتساب'
                  : 'Your request connects directly to our Music City reception on WhatsApp'}
              </p>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#211B17] mb-1.5">
                  {isAr ? 'اسمك الكريم' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. John Doe'}
                  className="w-full px-4 py-3 rounded-xl bg-[#F4EFE5] border border-[#E7DDCD] focus:border-[#B99A62] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#211B17] mb-1.5">
                  {isAr ? 'نوع الطلب' : 'Inquiry Type'}
                </label>
                <select
                  value={inquiryType}
                  onChange={e => setInquiryType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F4EFE5] border border-[#E7DDCD] focus:border-[#B99A62] outline-none text-sm cursor-pointer"
                >
                  <option value="order">{isAr ? 'طلب أوردر من المنيو' : 'Food Order from Menu'}</option>
                  <option value="table">{isAr ? 'حجز طاولة بالصالة' : 'Table Reservation'}</option>
                  <option value="general">{isAr ? 'استفسار عام أو اقتراح' : 'General Inquiry'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#211B17] mb-1.5">
                  {isAr ? 'تفاصيل الطلب أو الملاحظات' : 'Order Details or Notes'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={
                    isAr
                      ? 'اكتب الأصناف التي ترغب بطلبها أو موعد الحجز وعدد الأفراد...'
                      : 'Specify the items you wish to order or your booking time...'
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#F4EFE5] border border-[#E7DDCD] focus:border-[#B99A62] outline-none text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{isAr ? 'متابعة الطلب عبر واتساب (+20 15 50760124)' : 'Continue to WhatsApp (+20 15 50760124)'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Confirmed Contact Info & Official Links */}
          <div className="lg:col-span-5 space-y-6">
            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#E7DDCD] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B99A62]/15 text-[#B99A62] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#211B17]">
                    {isAr ? 'الهاتف المباشر' : 'Direct Phone'}
                  </h3>
                  <a
                    href="tel:+201550760124"
                    className="text-sm font-bold text-[#687052] hover:underline dir-ltr block"
                  >
                    +20 15 50760124
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#E7DDCD] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B99A62]/15 text-[#B99A62] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#211B17]">
                    {t('contact.location_title')}
                  </h3>
                  <p className="text-sm text-[#24211E]/80 font-medium">
                    {isAr ? content.contact_city_ar : content.contact_city_en}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Channels List */}
            <div className="p-6 rounded-2xl bg-[#211B17] text-[#FCFAF6] border border-[#B99A62]/30 space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#FCFAF6]">
                {t('contact.social_title')}
              </h3>

              <div className="space-y-2.5">
                <a
                  href={content.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#302720] hover:bg-[#3d3229] border border-[#B99A62]/20 text-xs font-semibold text-[#FCFAF6] transition-all"
                >
                  <span>صفحة الفيسبوك الرسمية</span>
                  <ExternalLink className="w-4 h-4 text-[#B99A62]" />
                </a>

                <a
                  href={content.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#302720] hover:bg-[#3d3229] border border-[#B99A62]/20 text-xs font-semibold text-[#FCFAF6] transition-all"
                >
                  <span>حساب الإنستغرام @music_city_egypt</span>
                  <ExternalLink className="w-4 h-4 text-[#B99A62]" />
                </a>

                <a
                  href={content.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#302720] hover:bg-[#3d3229] border border-[#B99A62]/20 text-xs font-semibold text-[#FCFAF6] transition-all"
                >
                  <span>قناة التيك توك @music.city.eg</span>
                  <ExternalLink className="w-4 h-4 text-[#B99A62]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
