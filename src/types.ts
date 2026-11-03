export type Language = 'ar' | 'en';

export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  image: string;
  sort_order: number;
  is_active: boolean;
  is_signature?: boolean;
  signature_key?: 'pizza-pasta' | 'coffee' | 'eastern' | 'grills';
}

export interface ProductOption {
  name_ar: string;
  name_en: string;
  price_modifier?: number;
  choices?: string[];
}

export interface Product {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  image?: string;
  is_featured: boolean;
  is_active: boolean;
  needs_review?: boolean;
  review_reason?: string;
  sides_note_ar?: string;
  sides_note_en?: string;
  options?: ProductOption[];
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SiteContent {
  hero_title_ar: string;
  hero_title_en: string;
  hero_subtitle_ar: string;
  hero_subtitle_en: string;
  hero_image: string;
  about_title_ar: string;
  about_title_en: string;
  about_text_ar: string;
  about_text_en: string;
  about_image: string;
  story_title_ar: string;
  story_title_en: string;
  story_text_ar: string;
  story_text_en: string;
  story_image: string;
  contact_whatsapp: string;
  contact_phone: string;
  contact_city_ar: string;
  contact_city_en: string;
  social_facebook: string;
  social_instagram: string;
  social_tiktok: string;
  hall_service_fee: number; // 12%
  vat_note_ar: string;
  vat_note_en: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  hiddenProducts: number;
  totalCategories: number;
  needsReviewProducts: number;
  featuredProducts: number;
}

export interface AdminUser {
  email: string;
  role: 'admin' | 'owner';
  created_at: string;
}
