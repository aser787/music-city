import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Category, Product, SiteContent, DashboardStats } from '../src/types';
import { initialCategories, initialProducts, initialSiteContent } from './seedData';
import { isEmailAuthorized, safeReassignProducts } from '../src/utils/menuLogic';

interface AdminAccount {
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  role: 'owner' | 'admin';
}

interface StoredData {
  categories: Category[];
  products: Product[];
  siteContent: SiteContent;
  admins: Record<string, AdminAccount>;
  sessions: Record<string, { email: string; expiresAt: number }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'music_city.json');

class Database {
  private data: StoredData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoredData {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          categories: parsed.categories || initialCategories,
          products: parsed.products || initialProducts,
          siteContent: parsed.siteContent ? { ...initialSiteContent, ...parsed.siteContent } : initialSiteContent,
          admins: parsed.admins || {},
          sessions: parsed.sessions || {},
        };
      } catch (err) {
        console.error('Failed to parse database file, recovering with initial seed:', err);
      }
    }

    const initial: StoredData = {
      categories: initialCategories,
      products: initialProducts,
      siteContent: initialSiteContent,
      admins: {},
      sessions: {},
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: StoredData = this.data): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DATA_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- STATS ---
  public getStats(): DashboardStats {
    const totalProducts = this.data.products.length;
    const activeProducts = this.data.products.filter(p => p.is_active).length;
    const hiddenProducts = this.data.products.filter(p => !p.is_active).length;
    const totalCategories = this.data.categories.length;
    const needsReviewProducts = this.data.products.filter(p => p.needs_review).length;
    const featuredProducts = this.data.products.filter(p => p.is_featured).length;

    return {
      totalProducts,
      activeProducts,
      hiddenProducts,
      totalCategories,
      needsReviewProducts,
      featuredProducts,
    };
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.sort_order - b.sort_order);
  }

  public getCategory(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id || c.slug === id);
  }

  public createCategory(cat: Omit<Category, 'id'> & { id?: string }): Category {
    const id = cat.id || `cat-${Date.now()}`;
    const newCat: Category = {
      ...cat,
      id,
      sort_order: cat.sort_order ?? this.data.categories.length + 1,
      is_active: cat.is_active ?? true,
    };
    this.data.categories.push(newCat);
    this.saveData();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;

    this.data.categories[idx] = {
      ...this.data.categories[idx],
      ...updates,
    };
    this.saveData();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string, reassignToId?: string): { success: boolean; reassignedCount: number } {
    const targetCat = this.data.categories.find(c => c.id === id);
    if (!targetCat) return { success: false, reassignedCount: 0 };

    let count = 0;
    if (reassignToId && this.data.categories.some(c => c.id === reassignToId)) {
      this.data.products = safeReassignProducts(this.data.products, id, reassignToId);
      count = this.data.products.filter(p => p.category_id === reassignToId).length;
    } else {
      // If not reassigned, flag products needing review instead of deleting
      this.data.products = this.data.products.map(p => {
        if (p.category_id === id) {
          count++;
          return {
            ...p,
            is_active: false,
            needs_review: true,
            review_reason: `Category "${targetCat.name_ar}" was deleted. Needs new category assignment.`,
          };
        }
        return p;
      });
    }

    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.saveData();
    return { success: true, reassignedCount: count };
  }

  // --- PRODUCTS ---
  public getProducts(options?: {
    categoryId?: string;
    isActiveOnly?: boolean;
    isFeaturedOnly?: boolean;
    needsReviewOnly?: boolean;
  }): Product[] {
    let result = [...this.data.products];

    if (options?.categoryId) {
      const cat = this.getCategory(options.categoryId);
      const catId = cat ? cat.id : options.categoryId;
      result = result.filter(p => p.category_id === catId);
    }

    if (options?.isActiveOnly) {
      result = result.filter(p => p.is_active && !p.needs_review);
    }

    if (options?.isFeaturedOnly) {
      result = result.filter(p => p.is_featured);
    }

    if (options?.needsReviewOnly) {
      result = result.filter(p => p.needs_review);
    }

    return result.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }

  public getProduct(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(prod: Omit<Product, 'id'> & { id?: string }): Product {
    const id = prod.id || `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prod,
      id,
      is_active: prod.is_active ?? true,
      is_featured: prod.is_featured ?? false,
      needs_review: prod.needs_review ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.saveData();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const lenBefore = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== lenBefore) {
      this.saveData();
      return true;
    }
    return false;
  }

  // --- SITE CONTENT ---
  public getSiteContent(): SiteContent {
    return { ...this.data.siteContent };
  }

  public updateSiteContent(updates: Partial<SiteContent>): SiteContent {
    this.data.siteContent = {
      ...this.data.siteContent,
      ...updates,
    };
    this.saveData();
    return this.data.siteContent;
  }

  // --- AUTHENTICATION & SESSIONS ---
  public hasAdminAccount(email: string): boolean {
    const clean = email.trim().toLowerCase();
    return !!this.data.admins[clean];
  }

  public registerAdminPassword(email: string, passwordPlain: string): { success: boolean; message: string } {
    const clean = email.trim().toLowerCase();
    const allowlist = process.env.MUSIC_CITY_ADMIN_EMAILS || 'asercr7777@gmail.com,admin@musiccity.eg';

    if (!isEmailAuthorized(clean, allowlist)) {
      return { success: false, message: 'This email is not authorized in MUSIC_CITY_ADMIN_EMAILS allowlist.' };
    }

    if (!passwordPlain || passwordPlain.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(passwordPlain, salt, 1000, 64, 'sha512').toString('hex');

    this.data.admins[clean] = {
      email: clean,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
      role: 'owner',
    };
    this.saveData();
    return { success: true, message: 'Password configured successfully.' };
  }

  public verifyAdminCredentials(email: string, passwordPlain: string): boolean {
    const clean = email.trim().toLowerCase();
    const account = this.data.admins[clean];
    if (!account) return false;

    const hash = crypto.pbkdf2Sync(passwordPlain, account.salt, 1000, 64, 'sha512').toString('hex');
    return hash === account.passwordHash;
  }

  public createSession(email: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.data.sessions[token] = {
      email: email.trim().toLowerCase(),
      expiresAt,
    };
    this.saveData();
    return token;
  }

  public validateSession(token: string): { email: string } | null {
    if (!token) return null;
    const session = this.data.sessions[token];
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.saveData();
      return null;
    }

    // Double check email is still in allowlist
    const allowlist = process.env.MUSIC_CITY_ADMIN_EMAILS || 'asercr7777@gmail.com,admin@musiccity.eg';
    if (!isEmailAuthorized(session.email, allowlist)) {
      delete this.data.sessions[token];
      this.saveData();
      return null;
    }

    return { email: session.email };
  }

  public deleteSession(token: string): void {
    if (token && this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.saveData();
    }
  }
}

export const db = new Database();
