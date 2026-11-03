import type { Product, Language } from '../types';

/**
 * Normalizes text for robust Arabic and English searching.
 * Removes Arabic diacritics, normalizes alef variants and ta marbuta.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    // Remove Arabic diacritics
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alef variants (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Ta Marbuta (ة -> ه)
    .replace(/ة/g, 'ه')
    // Normalize Ya (ى -> ي)
    .replace(/ى/g, 'ي');
}

/**
 * Determines whether a product matches a user search query in either Arabic or English.
 */
export function productMatchesSearch(product: Product, query: string): boolean {
  if (!query || !query.trim()) return true;
  const normalizedQuery = normalizeSearchText(query);
  const nameAr = normalizeSearchText(product.name_ar || '');
  const nameEn = normalizeSearchText(product.name_en || '');
  const descAr = normalizeSearchText(product.description_ar || '');
  const descEn = normalizeSearchText(product.description_en || '');

  return (
    nameAr.includes(normalizedQuery) ||
    nameEn.includes(normalizedQuery) ||
    descAr.includes(normalizedQuery) ||
    descEn.includes(normalizedQuery)
  );
}

/**
 * Formats price in Egyptian Pounds according to the chosen language.
 */
export function formatPrice(price: number, lang: Language = 'ar'): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return lang === 'ar' ? '0 ج.م' : '0 LE';
  }
  const formatted = price.toLocaleString('en-US');
  return lang === 'ar' ? `${formatted} ج.م` : `${formatted} LE`;
}

/**
 * Calculates the total with dine-in hall service fee (12% as printed on official menu).
 */
export function calculateTotalWithHallService(
  subtotal: number,
  servicePercentage: number = 12
): { subtotal: number; serviceFee: number; total: number } {
  const safeSubtotal = Math.max(0, subtotal || 0);
  const serviceFee = Math.round((safeSubtotal * (servicePercentage / 100)) * 100) / 100;
  const total = safeSubtotal + serviceFee;
  return {
    subtotal: safeSubtotal,
    serviceFee,
    total,
  };
}

/**
 * Checks if an email is present in the admin allowlist.
 */
export function isEmailAuthorized(email: string, allowlistStr: string = ''): boolean {
  if (!email || !email.trim()) return false;
  const cleanEmail = email.trim().toLowerCase();
  const allowed = allowlistStr
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(cleanEmail);
}

/**
 * Validates product creation and editing.
 * Rejects missing names, negative or zero prices, or missing category.
 */
export function validateProductData(data: Partial<Product>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name_ar || !data.name_ar.trim()) {
    errors.push('Arabic name is required');
  }
  if (!data.category_id || !data.category_id.trim()) {
    errors.push('Category is required');
  }
  if (typeof data.price !== 'number' || isNaN(data.price) || data.price <= 0) {
    errors.push('Price must be a valid positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Reassigns products belonging to one category to another category when deleting.
 */
export function safeReassignProducts(
  products: Product[],
  fromCategoryId: string,
  toCategoryId: string
): Product[] {
  return products.map(product => {
    if (product.category_id === fromCategoryId) {
      return {
        ...product,
        category_id: toCategoryId,
        updated_at: new Date().toISOString(),
      };
    }
    return product;
  });
}
