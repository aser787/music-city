import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  dir: 'rtl' | 'ltr';
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.menu': 'المنيو الرقمي',
    'nav.about': 'عن ميوزيك سيتي',
    'nav.contact': 'تواصل معنا',
    'nav.view_menu': 'استعراض المنيو',
    'nav.admin': 'لوحة الإدارة',
    'nav.logout': 'تسجيل الخروج',
    'brand.subtitle': 'مطعم وكافيه راقي — أسيوط',

    // Hero
    'hero.cta_menu': 'استكشف قائمتنا الكاملة',
    'hero.cta_discover': 'تعرف على ميوزيك سيتي',
    'hero.badge': 'تجربة ضيافة استثنائية في قلب أسيوط',

    // Signature categories
    'sig.title': 'الأقسام المميزة',
    'sig.subtitle': 'رحلة عبر أشهى المطابخ العالمية والشرقية والقهوة الفاخرة',
    'sig.view_category': 'استعراض القسم',
    'sig.pizza_pasta': 'بيتزا وباستا',
    'sig.coffee': 'قهوة ومشروبات',
    'sig.eastern': 'شرقي وطواجن',
    'sig.grills': 'مشويات وجريل',

    // Featured section
    'featured.title': 'أطباق مختارة خصيصاً لك',
    'featured.subtitle': 'أكثر الأطباق طلباً وإشادة من ضيوفنا الكرام',
    'featured.add_note': 'جميع الأطباق تحضر طازجة يومياً بأيدي أمهر الطهاة',

    // Menu view
    'menu.title': 'المنيو الرقمي الكامل',
    'menu.subtitle': 'قائمة أطباق ومشروبات مطعم ميوزيك سيتي بأسيوط — أسعار معتمدة ومحدثة',
    'menu.all': 'جميع الأصناف',
    'menu.search_placeholder': 'ابحث عن طبق، باستا، مشروب، أو مكونات...',
    'menu.no_results': 'لم نعثر على أي أصناف مطابقة لبحثك',
    'menu.no_results_sub': 'يرجى تجربة كلمات بحث أخرى أو اختيار قسم مختلف من القائمة أعلاه',
    'menu.empty_category': 'هذا القسم لا يحتوي على منتجات حالياً',
    'menu.sides_included': 'يقدم مع الطبق:',
    'menu.order_whatsapp': 'اطلب عبر واتساب',
    'menu.vat_notice': 'جميع الأسعار تشمل ضريبة القيمة المضافة — يضاف 12% خدمة داخل الصالة',
    'menu.currency': 'ج.م',

    // About & Story
    'about.story_badge': 'أصالة وحداثة',
    'about.experience_title': 'ضيافة تليق بكم',
    'about.experience_desc': 'في ميوزيك سيتي، نحرص على تقديم تجربة متكاملة تجمع بين دقة الطهي، كرم الضيافة المصري، والأجواء الأنيقة الهادئة.',

    // Contact & Social
    'contact.title': 'تواصل مع ميوزيك سيتي',
    'contact.subtitle': 'نسعد دائماً باستقبالكم والرد على استفساراتكم وطلباتكم',
    'contact.whatsapp_btn': 'محادثة مباشرة عبر واتساب',
    'contact.phone_btn': 'اتصال هاتفي',
    'contact.location_title': 'موقعنا',
    'contact.location_value': 'أسيوط، جمهورية مصر العربية',
    'contact.social_title': 'تابعنا على منصات التواصل',

    // Footer
    'footer.rights': 'جميع الحقوق محفوظة لمطعم ميوزيك سيتي',
    'footer.developed_notice': 'مطعم وكافيه ميوزيك سيتي — أسيوط، مصر',
    'footer.quick_links': 'روابط سريعة',
    'footer.direct_contact': 'تواصل فوري',

    // Admin
    'admin.portal_title': 'بوابة إدارة ميوزيك سيتي',
    'admin.portal_subtitle': 'تسجيل الدخول المخصص لإدارة المنيو والمحتوى',
    'admin.email_label': 'البريد الإلكتروني المعتمد',
    'admin.password_label': 'كلمة المرور',
    'admin.login_btn': 'تسجيل الدخول',
    'admin.setup_btn': 'تفعيل كلمة المرور والدخول',
    'admin.dashboard': 'لوحة تحكم المطعم',
    'admin.tab_overview': 'نظرة عامة',
    'admin.tab_products': 'إدارة الأصناف',
    'admin.tab_categories': 'إدارة الأقسام',
    'admin.tab_content': 'محتوى الموقع',
    'admin.tab_settings': 'الإعدادات والصلاحيات',
    'admin.stat_total_products': 'إجمالي الأصناف',
    'admin.stat_active_products': 'أصناف معروضة',
    'admin.stat_hidden_products': 'أصناف مخفية',
    'admin.stat_categories': 'إجمالي الأقسام',
    'admin.stat_needs_review': 'أصناف تحتاج مراجعة',
    'admin.stat_featured': 'أصناف مميزة',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Digital Menu',
    'nav.about': 'About Music City',
    'nav.contact': 'Contact Us',
    'nav.view_menu': 'View Menu',
    'nav.admin': 'Admin Portal',
    'nav.logout': 'Sign Out',
    'brand.subtitle': 'Fine Dining & Specialty Café — Assiut',

    // Hero
    'hero.cta_menu': 'Explore Full Menu',
    'hero.cta_discover': 'Discover Music City',
    'hero.badge': 'Assiut’s Finest Dining Destination',

    // Signature categories
    'sig.title': 'Signature Categories',
    'sig.subtitle': 'A culinary journey across stone-baked pizzas, prime charcoal grills, oriental clay pots & specialty coffee',
    'sig.view_category': 'Browse Category',
    'sig.pizza_pasta': 'Pizza & Pasta',
    'sig.coffee': 'Specialty Coffee',
    'sig.eastern': 'Oriental Casseroles',
    'sig.grills': 'Charcoal Grills',

    // Featured section
    'featured.title': 'Chef’s Recommended Dishes',
    'featured.subtitle': 'Our most celebrated creations loved by our guests',
    'featured.add_note': 'All dishes are freshly prepared daily by expert culinary chefs',

    // Menu view
    'menu.title': 'Full Digital Menu',
    'menu.subtitle': 'Official menu and pricing for Music City restaurant in Assiut — 100% verified',
    'menu.all': 'All Items',
    'menu.search_placeholder': 'Search by dish name, pasta, drink, or ingredient...',
    'menu.no_results': 'No matching menu items found',
    'menu.no_results_sub': 'Try searching with different keywords or select another category above',
    'menu.empty_category': 'There are currently no items in this category',
    'menu.sides_included': 'Served with:',
    'menu.order_whatsapp': 'Order via WhatsApp',
    'menu.vat_notice': 'All prices include VAT — 12% hall service fee applies for dine-in',
    'menu.currency': 'LE',

    // About & Story
    'about.story_badge': 'Heritage & Modernity',
    'about.experience_title': 'Hospitality Tailored for You',
    'about.experience_desc': 'At Music City, every dining occasion is an artful celebration of authentic culinary heritage, flawless preparation, and warm hospitality.',

    // Contact & Social
    'contact.title': 'Get In Touch with Music City',
    'contact.subtitle': 'We are delighted to welcome you and assist with inquiries and reservations',
    'contact.whatsapp_btn': 'Chat on WhatsApp',
    'contact.phone_btn': 'Call Directly',
    'contact.location_title': 'Location',
    'contact.location_value': 'Assiut, Egypt',
    'contact.social_title': 'Follow Our Social Channels',

    // Footer
    'footer.rights': 'All rights reserved to Music City Restaurant',
    'footer.developed_notice': 'Music City Restaurant & Café — Assiut, Egypt',
    'footer.quick_links': 'Quick Links',
    'footer.direct_contact': 'Direct Inquiries',

    // Admin
    'admin.portal_title': 'Music City Administration',
    'admin.portal_subtitle': 'Secure management portal for digital menu and content',
    'admin.email_label': 'Authorized Admin Email',
    'admin.password_label': 'Password',
    'admin.login_btn': 'Sign In',
    'admin.setup_btn': 'Set Password & Access',
    'admin.dashboard': 'Restaurant Management Dashboard',
    'admin.tab_overview': 'Overview',
    'admin.tab_products': 'Products',
    'admin.tab_categories': 'Categories',
    'admin.tab_content': 'Site Content',
    'admin.tab_settings': 'Settings & Security',
    'admin.stat_total_products': 'Total Products',
    'admin.stat_active_products': 'Active Products',
    'admin.stat_hidden_products': 'Hidden Products',
    'admin.stat_categories': 'Total Categories',
    'admin.stat_needs_review': 'Needs Review',
    'admin.stat_featured': 'Featured Dishes',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('music_city_lang');
    return saved === 'en' ? 'en' : 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('music_city_lang', lang);
  }, [lang, dir]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations['ar'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
