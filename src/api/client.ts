import type { Category, Product, SiteContent, DashboardStats } from '../types';

export const api = {
  // Public
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getProducts(params?: { category_id?: string; featured?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category_id) query.set('category_id', params.category_id);
    if (params?.featured) query.set('featured', 'true');

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getSiteContent(): Promise<SiteContent> {
    const res = await fetch('/api/content');
    if (!res.ok) throw new Error('Failed to fetch site content');
    return res.json();
  },

  // Auth
  async checkAuthStatus(email: string): Promise<{ allowed: boolean; hasPassword: boolean; message: string }> {
    const res = await fetch('/api/auth/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async login(email: string, password?: string): Promise<{ success: boolean; token?: string; user?: any; error?: string; needsSetup?: boolean }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async setupPassword(email: string, password: string): Promise<{ success: boolean; token?: string; user?: any; error?: string; message?: string }> {
    const res = await fetch('/api/auth/setup-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getMe(token: string): Promise<{ email: string; role: string }> {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async logout(token: string): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Protected Admin
  async getAdminStats(token: string): Promise<DashboardStats> {
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load dashboard stats');
    return res.json();
  },

  async getAdminCategories(token: string): Promise<Category[]> {
    const res = await fetch('/api/admin/categories', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  async createAdminCategory(token: string, category: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create category');
    }
    return res.json();
  },

  async updateAdminCategory(token: string, id: string, updates: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update category');
    }
    return res.json();
  },

  async deleteAdminCategory(token: string, id: string, reassignToId?: string): Promise<{ success: boolean; reassignedCount: number }> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reassignToId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete category');
    }
    return res.json();
  },

  async getAdminProducts(token: string, params?: { category_id?: string; needs_review?: boolean }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category_id) query.set('category_id', params.category_id);
    if (params?.needs_review) query.set('needs_review', 'true');

    const res = await fetch(`/api/admin/products?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load admin products');
    return res.json();
  },

  async createAdminProduct(token: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  async updateAdminProduct(token: string, id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    return res.json();
  },

  async deleteAdminProduct(token: string, id: string): Promise<void> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product');
    }
  },

  async updateAdminContent(token: string, content: Partial<SiteContent>): Promise<SiteContent> {
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update content');
    }
    return res.json();
  },

  async uploadImage(token: string, filename: string, base64Data: string): Promise<string> {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ filename, base64Data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Image upload failed');
    }
    const data = await res.json();
    return data.url;
  },
};
