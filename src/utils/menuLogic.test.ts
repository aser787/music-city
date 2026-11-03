import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeSearchText,
  productMatchesSearch,
  formatPrice,
  calculateTotalWithHallService,
  isEmailAuthorized,
  validateProductData,
  safeReassignProducts,
} from './menuLogic';
import type { Product } from '../types';

const mockProduct: Product = {
  id: 'prod-1',
  category_id: 'cat-pizza',
  name_ar: 'بيتزا مارجريتا',
  name_en: 'Pizza Margherita',
  description_ar: 'صوص طماطم بالريحان مع الجبن الموتزاريلا والزعتر',
  description_en: 'Tomato sauce with fresh basil and mozzarella cheese',
  price: 175,
  is_featured: true,
  is_active: true,
};

test('normalizeSearchText strips Arabic diacritics and normalizes letter forms', () => {
  assert.equal(normalizeSearchText('بَيْتزَا أومليت'), 'بيتزا اومليت');
  assert.equal(normalizeSearchText('إسكندراني'), 'اسكندراني');
  assert.equal(normalizeSearchText('طعمية كفتة'), 'طعميه كفته');
  assert.equal(normalizeSearchText('PIZZA Margherita  '), 'pizza margherita');
});

test('productMatchesSearch matches Arabic and English names and descriptions', () => {
  assert.equal(productMatchesSearch(mockProduct, 'مارجريتا'), true);
  assert.equal(productMatchesSearch(mockProduct, 'Margherita'), true);
  assert.equal(productMatchesSearch(mockProduct, 'ريحان'), true);
  assert.equal(productMatchesSearch(mockProduct, 'basil'), true);
  assert.equal(productMatchesSearch(mockProduct, 'برجر'), false);
  assert.equal(productMatchesSearch(mockProduct, ''), true);
});

test('formatPrice formats currencies correctly in AR and EN', () => {
  assert.equal(formatPrice(175, 'ar'), '175 ج.م');
  assert.equal(formatPrice(175, 'en'), '175 LE');
  assert.equal(formatPrice(1750, 'en'), '1,750 LE');
  assert.equal(formatPrice(0, 'ar'), '0 ج.م');
});

test('calculateTotalWithHallService correctly computes 12% dine-in service fee', () => {
  const result = calculateTotalWithHallService(100, 12);
  assert.equal(result.subtotal, 100);
  assert.equal(result.serviceFee, 12);
  assert.equal(result.total, 112);

  const complex = calculateTotalWithHallService(570, 12);
  assert.equal(complex.serviceFee, 68.4);
  assert.equal(complex.total, 638.4);
});

test('isEmailAuthorized checks case-insensitive and trims allowlist', () => {
  const allowlist = 'asercr7777@gmail.com, admin@musiccity.eg, owner@musiccity.eg ';
  assert.equal(isEmailAuthorized('asercr7777@gmail.com', allowlist), true);
  assert.equal(isEmailAuthorized('ASERCR7777@GMAIL.COM', allowlist), true);
  assert.equal(isEmailAuthorized('admin@musiccity.eg', allowlist), true);
  assert.equal(isEmailAuthorized('hacker@unknown.com', allowlist), false);
  assert.equal(isEmailAuthorized('', allowlist), false);
});

test('validateProductData enforces required fields and positive pricing', () => {
  const valid = validateProductData({
    name_ar: 'كفتة ضاني',
    category_id: 'cat-grills',
    price: 405,
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);

  const invalid = validateProductData({
    name_ar: '',
    category_id: '',
    price: -10,
  });
  assert.equal(invalid.isValid, false);
  assert.equal(invalid.errors.length, 3);
});

test('safeReassignProducts reassigns products from deleted category to target category', () => {
  const products: Product[] = [
    { ...mockProduct, id: 'p1', category_id: 'old-cat' },
    { ...mockProduct, id: 'p2', category_id: 'keep-cat' },
  ];
  const updated = safeReassignProducts(products, 'old-cat', 'new-cat');
  assert.equal(updated.find(p => p.id === 'p1')?.category_id, 'new-cat');
  assert.equal(updated.find(p => p.id === 'p2')?.category_id, 'keep-cat');
});
