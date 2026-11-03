import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  FileText,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Upload,
  AlertTriangle,
  CheckCircle,
  Search,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Image as ImageIcon,
  Save,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatPrice } from '../utils/menuLogic';
import type { Category, Product, SiteContent, DashboardStats } from '../types';

interface AdminDashboardViewProps {
  onBackToSite: () => void;
  onRefreshPublicData: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onBackToSite,
  onRefreshPublicData,
}) => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';
  const { token, user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'content' | 'settings'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters & search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [showOnlyReview, setShowOnlyReview] = useState(false);

  // Modals
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [reassignTargetCatId, setReassignTargetCatId] = useState<string>('');

  // Image Upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadAllData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [fetchedStats, fetchedCats, fetchedProds, fetchedContent] = await Promise.all([
        api.getAdminStats(token),
        api.getAdminCategories(token),
        api.getAdminProducts(token),
        api.getSiteContent(),
      ]);
      setStats(fetchedStats);
      setCategories(fetchedCats);
      setProducts(fetchedProds);
      setContent(fetchedContent);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [token]);

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProduct) return;

    if (!editingProduct.name_ar || !editingProduct.name_ar.trim()) {
      showNotification('error', 'Arabic dish name is required');
      return;
    }
    if (!editingProduct.category_id) {
      showNotification('error', 'Category assignment is required');
      return;
    }
    if (!editingProduct.price || editingProduct.price <= 0) {
      showNotification('error', 'Price must be a valid positive number');
      return;
    }

    try {
      if (editingProduct.id) {
        await api.updateAdminProduct(token, editingProduct.id, editingProduct);
        showNotification('success', isAr ? 'تم تعديل الصنف بنجاح' : 'Product updated successfully');
      } else {
        await api.createAdminProduct(token, editingProduct);
        showNotification('success', isAr ? 'تمت إضافة الصنف بنجاح' : 'Product created successfully');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await loadAllData();
      onRefreshPublicData();
    } catch (err: any) {
      showNotification('error', err.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!token) return;
    try {
      await api.deleteAdminProduct(token, id);
      showNotification('success', isAr ? 'تم حذف الصنف بنجاح' : 'Product deleted successfully');
      setDeletingProductId(null);
      await loadAllData();
      onRefreshPublicData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete product');
    }
  };

  const handleToggleProductActive = async (product: Product) => {
    if (!token) return;
    try {
      await api.updateAdminProduct(token, product.id, { is_active: !product.is_active });
      await loadAllData();
      onRefreshPublicData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle status');
    }
  };

  const handleToggleProductFeatured = async (product: Product) => {
    if (!token) return;
    try {
      await api.updateAdminProduct(token, product.id, { is_featured: !product.is_featured });
      await loadAllData();
      onRefreshPublicData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to toggle featured state');
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingCategory) return;

    if (!editingCategory.name_ar || !editingCategory.name_ar.trim()) {
      showNotification('error', 'Arabic category name is required');
      return;
    }

    try {
      if (editingCategory.id) {
        await api.updateAdminCategory(token, editingCategory.id, editingCategory);
        showNotification('success', isAr ? 'تم تعديل القسم بنجاح' : 'Category updated successfully');
      } else {
        await api.createAdminCategory(token, editingCategory);
        showNotification('success', isAr ? 'تمت إضافة القسم بنجاح' : 'Category created successfully');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      await loadAllData();
      onRefreshPublicData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!token || !deletingCategory) return;
    try {
      const res = await api.deleteAdminCategory(token, deletingCategory.id, reassignTargetCatId || undefined);
      showNotification(
        'success',
        isAr
          ? `تم حذف القسم بأمان وتعديل ${res.reassignedCount} صنفاً`
          : `Category deleted safely; ${res.reassignedCount} products reassigned/reviewed.`
      );
      setDeletingCategory(null);
      setReassignTargetCatId('');
      await loadAllData();
      onRefreshPublicData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete category');
    }
  };

  // Content Save
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !content) return;
    try {
      await api.updateAdminContent(token, content);
      showNotification('success', isAr ? 'تم حفظ محتوى الموقع بنجاح' : 'Site content saved successfully');
      onRefreshPublicData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save content');
    }
  };

  // Image Upload helper
  const handleFileUpload = async (file: File, onUrlReady: (url: string) => void) => {
    if (!token) return;
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadedUrl = await api.uploadImage(token, file.name, base64);
        onUrlReady(uploadedUrl);
        showNotification('success', isAr ? 'تم رفع الصورة وحفظها بنجاح' : 'Image uploaded successfully');
      } catch (err: any) {
        showNotification('error', err.message || 'Upload failed');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered products list for table
  const filteredProducts = products.filter(p => {
    if (showOnlyReview && !p.needs_review) return false;
    if (productCategoryFilter !== 'all' && p.category_id !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      return (
        p.name_ar.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        (p.description_ar && p.description_ar.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#211B17] text-[#FCFAF6] flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#302720] border-b border-[#B99A62]/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B99A62]/20 border border-[#B99A62]/40 text-[#B99A62] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-[#FCFAF6]">
              {t('admin.dashboard')}
            </h1>
            <span className="text-xs text-[#B99A62]">
              {user?.email} • {isAr ? 'حساب مدير معتمد' : 'Authorized Administrator'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#B99A62]/30 text-xs font-semibold text-[#FCFAF6] hover:bg-white/5 transition-all cursor-pointer"
          >
            <span>{isAr ? 'معاينة الموقع العام' : 'View Public Site'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B99A62]" />
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 text-xs font-semibold text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {feedback && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              : 'bg-red-950/90 text-red-200 border-red-500/50'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Admin Container with Sidebar Tabs */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-6">
        {/* Navigation Tabs */}
        <aside className="w-full md:w-60 bg-[#302720] border border-[#B99A62]/20 rounded-2xl p-3 flex md:flex-col gap-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#B99A62] text-[#211B17]'
                : 'text-[#FCFAF6]/80 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('admin.tab_overview')}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#B99A62] text-[#211B17]'
                : 'text-[#FCFAF6]/80 hover:bg-white/5'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>{t('admin.tab_products')}</span>
            {stats && stats.needsReviewProducts > 0 && (
              <span className="bg-amber-500 text-black text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {stats.needsReviewProducts}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#B99A62] text-[#211B17]'
                : 'text-[#FCFAF6]/80 hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('admin.tab_categories')}</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right whitespace-nowrap cursor-pointer ${
              activeTab === 'content'
                ? 'bg-[#B99A62] text-[#211B17]'
                : 'text-[#FCFAF6]/80 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('admin.tab_content')}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-right whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#B99A62] text-[#211B17]'
                : 'text-[#FCFAF6]/80 hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t('admin.tab_settings')}</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#302720] border border-[#B99A62]/20 rounded-2xl p-6 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-[#B99A62] text-sm">
              {isAr ? 'جارِ تحميل بيانات لوحة التحكم...' : 'Loading dashboard...'}
            </div>
          ) : (
            <>
              {/* --- TAB 1: OVERVIEW STATS --- */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#FCFAF6]">
                      {t('admin.tab_overview')}
                    </h2>
                    <p className="text-xs text-[#FCFAF6]/70 mt-1 font-light">
                      {isAr
                        ? 'إحصائيات الأصناف والأقسام المعتمدة في قاعدة بيانات ميوزيك سيتي'
                        : 'Live database metrics for Music City restaurant and café.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-1">
                      <span className="text-xs text-[#FCFAF6]/70 block font-light">
                        {t('admin.stat_total_products')}
                      </span>
                      <span className="font-serif text-3xl font-bold text-[#B99A62]">
                        {stats.totalProducts}
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-1">
                      <span className="text-xs text-[#FCFAF6]/70 block font-light">
                        {t('admin.stat_active_products')}
                      </span>
                      <span className="font-serif text-3xl font-bold text-emerald-400">
                        {stats.activeProducts}
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-1">
                      <span className="text-xs text-[#FCFAF6]/70 block font-light">
                        {t('admin.stat_categories')}
                      </span>
                      <span className="font-serif text-3xl font-bold text-[#B99A62]">
                        {stats.totalCategories}
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-1">
                      <span className="text-xs text-[#FCFAF6]/70 block font-light">
                        {t('admin.stat_featured')}
                      </span>
                      <span className="font-serif text-3xl font-bold text-amber-400">
                        {stats.featuredProducts}
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-1">
                      <span className="text-xs text-[#FCFAF6]/70 block font-light">
                        {t('admin.stat_hidden_products')}
                      </span>
                      <span className="font-serif text-3xl font-bold text-gray-400">
                        {stats.hiddenProducts}
                      </span>
                    </div>

                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-1">
                      <span className="text-xs text-[#FCFAF6]/70 block font-light">
                        {t('admin.stat_needs_review')}
                      </span>
                      <span className="font-serif text-3xl font-bold text-red-400">
                        {stats.needsReviewProducts}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Cards */}
                  <div className="pt-4 border-t border-[#B99A62]/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setEditingProduct({ is_active: true, is_featured: false, price: 100 });
                        setIsProductModalOpen(true);
                      }}
                      className="p-4 rounded-xl bg-[#B99A62]/10 hover:bg-[#B99A62]/20 border border-[#B99A62]/30 flex items-center gap-3 transition-all text-right cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#B99A62] text-[#211B17] flex items-center justify-center font-bold">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#FCFAF6] block">
                          {isAr ? 'إضافة طبق أو مشروب جديد' : 'Add New Menu Item'}
                        </span>
                        <span className="text-xs text-[#FCFAF6]/60">
                          {isAr ? 'تحديد الاسم والسعر والقسم والصورة' : 'Specify name, price, category & photo'}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setEditingCategory({ is_active: true, sort_order: categories.length + 1 });
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-4 rounded-xl bg-[#687052]/20 hover:bg-[#687052]/30 border border-[#687052]/40 flex items-center gap-3 transition-all text-right cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#687052] text-white flex items-center justify-center font-bold">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#FCFAF6] block">
                          {isAr ? 'إضافة قسم جديد للمنيو' : 'Add New Category'}
                        </span>
                        <span className="text-xs text-[#FCFAF6]/60">
                          {isAr ? 'إنشاء قسم جديد للوجبات أو المشروبات' : 'Create new menu section'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* --- TAB 2: PRODUCTS MANAGEMENT --- */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#FCFAF6]">
                        {t('admin.tab_products')} ({filteredProducts.length})
                      </h2>
                      <p className="text-xs text-[#FCFAF6]/70 mt-0.5">
                        {isAr
                          ? 'إدارة أسعار وأسماء وأوصاف وصور أطباق ميوزيك سيتي'
                          : 'Manage dish pricing, names, images and availability'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct({
                          is_active: true,
                          is_featured: false,
                          price: 150,
                          category_id: categories[0]?.id,
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#B99A62] text-[#211B17] font-bold text-xs flex items-center gap-2 hover:bg-[#c9aa70] transition-all shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'صنف جديد' : 'New Dish'}</span>
                    </button>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-[#B99A62]" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        placeholder={isAr ? 'بحث بالاسم...' : 'Search dish...'}
                        className="w-full pl-3 pr-9 py-2 rounded-xl bg-[#211B17] border border-[#B99A62]/30 text-xs text-[#FCFAF6] outline-none"
                      />
                    </div>

                    <select
                      value={productCategoryFilter}
                      onChange={e => setProductCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-[#211B17] border border-[#B99A62]/30 text-xs text-[#FCFAF6] outline-none cursor-pointer"
                    >
                      <option value="all">{isAr ? 'كل الأقسام' : 'All Categories'}</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {isAr ? c.name_ar : c.name_en}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setShowOnlyReview(!showOnlyReview)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        showOnlyReview
                          ? 'bg-red-950 border-red-500 text-red-200'
                          : 'bg-[#211B17] border-[#B99A62]/30 text-[#FCFAF6]/80 hover:border-[#B99A62]'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'أصناف تحتاج مراجعة فقط' : 'Needs Review Only'}</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="border border-[#B99A62]/20 rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-[#211B17] text-[#B99A62] font-semibold border-b border-[#B99A62]/20">
                        <tr>
                          <th className="p-3">{isAr ? 'الطبق' : 'Dish'}</th>
                          <th className="p-3">{isAr ? 'القسم' : 'Category'}</th>
                          <th className="p-3">{isAr ? 'السعر' : 'Price'}</th>
                          <th className="p-3 text-center">{isAr ? 'العرض' : 'Active'}</th>
                          <th className="p-3 text-center">{isAr ? 'مميز' : 'Featured'}</th>
                          <th className="p-3 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#B99A62]/10 bg-[#302720]">
                        {filteredProducts.map(p => {
                          const cat = categories.find(c => c.id === p.category_id);
                          return (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      p.image ||
                                      cat?.image ||
                                      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80'
                                    }
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-black/40"
                                  />
                                  <div>
                                    <span className="font-bold text-[#FCFAF6] block">
                                      {p.name_ar}
                                    </span>
                                    {p.name_en && (
                                      <span className="text-[10px] text-[#B99A62]">
                                        {p.name_en}
                                      </span>
                                    )}
                                    {p.needs_review && (
                                      <span className="inline-block mt-0.5 text-[9px] bg-red-900/60 text-red-200 px-1.5 py-0.2 rounded font-bold">
                                        {p.review_reason || 'Needs Review'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-[#FCFAF6]/80 font-medium">
                                {isAr ? cat?.name_ar : cat?.name_en}
                              </td>
                              <td className="p-3 font-serif font-bold text-[#B99A62] text-sm whitespace-nowrap">
                                {formatPrice(p.price, lang)}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleToggleProductActive(p)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    p.is_active
                                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                                      : 'bg-gray-800 border-gray-600 text-gray-400'
                                  }`}
                                  title={p.is_active ? 'Visible' : 'Hidden'}
                                >
                                  {p.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleToggleProductFeatured(p)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    p.is_featured
                                      ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                                      : 'bg-gray-800 border-gray-600 text-gray-500'
                                  }`}
                                  title="Toggle Featured"
                                >
                                  <Star className={`w-4 h-4 ${p.is_featured ? 'fill-amber-400' : ''}`} />
                                </button>
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setEditingProduct(p);
                                      setIsProductModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-blue-950/50 hover:bg-blue-900 border border-blue-500/30 text-blue-300 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingProductId(p.id)}
                                    className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/30 text-red-300 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- TAB 3: CATEGORIES MANAGEMENT --- */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#FCFAF6]">
                        {t('admin.tab_categories')} ({categories.length})
                      </h2>
                      <p className="text-xs text-[#FCFAF6]/70 mt-0.5">
                        {isAr
                          ? 'تنظيم الأقسام وصورها وترتيب ظهورها في المنيو'
                          : 'Organize menu categories and sort sequence'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCategory({ is_active: true, sort_order: categories.length + 1 });
                        setIsCategoryModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#B99A62] text-[#211B17] font-bold text-xs flex items-center gap-2 hover:bg-[#c9aa70] transition-all cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'قسم جديد' : 'New Category'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => {
                      const count = products.filter(p => p.category_id === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className="p-4 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="h-32 rounded-lg overflow-hidden relative">
                              <img
                                src={cat.image}
                                alt={cat.name_ar}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#211B17]/80 text-[10px] text-[#B99A62] border border-[#B99A62]/30">
                                #{cat.sort_order}
                              </div>
                              {cat.is_signature && (
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#B99A62] text-[#211B17] text-[10px] font-bold">
                                  {isAr ? 'قسم مميز' : 'Signature'}
                                </div>
                              )}
                            </div>

                            <div>
                              <h3 className="font-serif text-base font-bold text-[#FCFAF6]">
                                {cat.name_ar}
                              </h3>
                              <p className="text-xs text-[#B99A62] font-medium">{cat.name_en}</p>
                            </div>

                            <div className="text-[11px] text-[#FCFAF6]/60">
                              {count} {isAr ? 'أصناف مرتبطة' : 'items linked'}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#B99A62]/15 flex items-center justify-between">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setIsCategoryModalOpen(true);
                              }}
                              className="text-xs text-[#B99A62] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>{isAr ? 'تعديل' : 'Edit'}</span>
                            </button>

                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className="text-xs text-red-400 hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isAr ? 'حذف آمن' : 'Safe Delete'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- TAB 4: CONTENT MANAGEMENT --- */}
              {activeTab === 'content' && content && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#FCFAF6]">
                      {t('admin.tab_content')}
                    </h2>
                    <p className="text-xs text-[#FCFAF6]/70 mt-0.5 font-light">
                      {isAr
                        ? 'تعديل النصوص والصور وروابط التواصل الاجتماعي والأسعار التوضيحية'
                        : 'Manage website copy, banner images and social links'}
                    </p>
                  </div>

                  <form onSubmit={handleSaveContent} className="space-y-6">
                    {/* Hero Section Copy */}
                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-4">
                      <h3 className="text-sm font-bold text-[#B99A62] uppercase tracking-wider">
                        {isAr ? 'القسم الافتتاحي (Hero)' : 'Hero Section'}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            العنوان بالعربية
                          </label>
                          <input
                            type="text"
                            value={content.hero_title_ar}
                            onChange={e => setContent({ ...content, hero_title_ar: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            English Headline
                          </label>
                          <input
                            type="text"
                            value={content.hero_title_en}
                            onChange={e => setContent({ ...content, hero_title_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            الوصف المختصر بالعربية
                          </label>
                          <textarea
                            rows={2}
                            value={content.hero_subtitle_ar}
                            onChange={e => setContent({ ...content, hero_subtitle_ar: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            English Subtitle
                          </label>
                          <textarea
                            rows={2}
                            value={content.hero_subtitle_en}
                            onChange={e => setContent({ ...content, hero_subtitle_en: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                          رابط صورة الخلفية الرئيسية
                        </label>
                        <input
                          type="text"
                          value={content.hero_image}
                          onChange={e => setContent({ ...content, hero_image: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Social & Contact */}
                    <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-4">
                      <h3 className="text-sm font-bold text-[#B99A62] uppercase tracking-wider">
                        {isAr ? 'أرقام التواصل والشبكات الاجتماعية' : 'Contact & Social Links'}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            رقم واتساب المطعم الرسمي
                          </label>
                          <input
                            type="text"
                            value={content.contact_whatsapp}
                            onChange={e => setContent({ ...content, contact_whatsapp: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            رابط فيسبوك
                          </label>
                          <input
                            type="text"
                            value={content.social_facebook}
                            onChange={e => setContent({ ...content, social_facebook: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            رابط إنستغرام
                          </label>
                          <input
                            type="text"
                            value={content.social_instagram}
                            onChange={e => setContent({ ...content, social_instagram: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                            رابط تيك توك
                          </label>
                          <input
                            type="text"
                            value={content.social_tiktok}
                            onChange={e => setContent({ ...content, social_tiktok: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#302720] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#B99A62] text-[#211B17] font-bold text-xs flex items-center gap-2 hover:bg-[#c9aa70] transition-all cursor-pointer shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAr ? 'حفظ التعديلات' : 'Save Content Changes'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* --- TAB 5: SETTINGS & SECURITY --- */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#FCFAF6]">
                      {t('admin.tab_settings')}
                    </h2>
                    <p className="text-xs text-[#FCFAF6]/70 mt-0.5 font-light">
                      {isAr
                        ? 'إعدادات الحماية وصلاحيات الحسابات وتفاصيل الضرائب والخدمة'
                        : 'System security, authorized email allowlist, and tax configuration.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#FCFAF6]">
                          {isAr ? 'قائمة البريد المعتمدة (MUSIC_CITY_ADMIN_EMAILS)' : 'Authorized Admin Emails'}
                        </h3>
                        <p className="text-xs text-[#FCFAF6]/60">
                          {isAr
                            ? 'يتم التحقق من كل طلب تسجيل دخول وإجراء إداري على الخادم مباشرة'
                            : 'Every admin action is verified server-side against this allowlist.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#302720] border border-[#B99A62]/20 font-mono text-xs text-[#B99A62]">
                      asercr7777@gmail.com, admin@musiccity.eg
                    </div>

                    <div className="text-xs text-[#FCFAF6]/70 leading-relaxed font-light space-y-2">
                      <p>
                        {isAr
                          ? 'لتعديل قائمة المديرين في بيئة الاستضافة، يتم تحديث متغير النظام MUSIC_CITY_ADMIN_EMAILS بقائمة العناوين مفصولة بفاصلة.'
                          : 'To authorize new admin accounts, update the MUSIC_CITY_ADMIN_EMAILS environment variable with comma-separated emails.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#211B17] border border-[#B99A62]/20 space-y-3">
                    <h3 className="font-bold text-sm text-[#FCFAF6]">
                      {isAr ? 'الضرائب والخدمة داخل الصالة' : 'Dine-In Hall Fees & VAT'}
                    </h3>
                    <p className="text-xs text-[#FCFAF6]/70">
                      {isAr
                        ? 'الأسعار مطابقة للمنيو الأصلي المعتمد (تشمل ضريبة القيمة المضافة + 12% خدمة داخل الصالة).'
                        : 'All item prices reflect official menu standards (inclusive of VAT, 12% dine-in service applies).'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- MODAL: CREATE / EDIT PRODUCT --- */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#302720] border border-[#B99A62]/30 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-scaleUp">
            <h3 className="font-serif text-xl font-bold text-[#FCFAF6]">
              {editingProduct.id
                ? isAr
                  ? 'تعديل صنف'
                  : 'Edit Product'
                : isAr
                ? 'إضافة صنف جديد للمنيو'
                : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-right">
              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'اسم الطبق بالعربية *' : 'Arabic Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name_ar || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'الاسم بالإنجليزية' : 'English Name'}
                </label>
                <input
                  type="text"
                  value={editingProduct.name_en || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                    {isAr ? 'السعر (ج.م) *' : 'Price (LE) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                    {isAr ? 'القسم *' : 'Category *'}
                  </label>
                  <select
                    required
                    value={editingProduct.category_id || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white cursor-pointer"
                  >
                    <option value="">{isAr ? 'اختر القسم...' : 'Select Category...'}</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'الوصف بالعربية' : 'Arabic Description'}
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description_ar || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'ملاحظة الأطباق الجانبية (يقدم مع الطبق...)' : 'Sides / Inclusions Note'}
                </label>
                <input
                  type="text"
                  value={editingProduct.sides_note_ar || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, sides_note_ar: e.target.value })}
                  placeholder={isAr ? 'مثال: يقدم مع 2 ارز خلطه - 4 سلاط مشكل - 4 عيش' : 'e.g. Served with spiced rice and salads'}
                  className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white"
                />
              </div>

              {/* Image upload / URL */}
              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'صورة الطبق' : 'Dish Image'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                  />
                  <label className="px-3 py-2 rounded-lg bg-[#B99A62]/20 hover:bg-[#B99A62]/30 border border-[#B99A62]/40 text-xs text-[#B99A62] font-semibold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : isAr ? 'رفع' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, url => {
                            setEditingProduct(prev => (prev ? { ...prev, image: url } : null));
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active ?? true}
                    onChange={e => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="rounded border-[#B99A62] text-[#B99A62]"
                  />
                  <span>{isAr ? 'نشط ومعروض للجمهور' : 'Active and visible'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={e => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="rounded border-[#B99A62] text-[#B99A62]"
                  />
                  <span>{isAr ? 'صنف مميز (في الصفحة الرئيسية)' : 'Featured dish'}</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#B99A62]/20">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-xs text-gray-300 hover:bg-white/5"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#B99A62] text-[#211B17] font-bold text-xs hover:bg-[#c9aa70]"
                >
                  {isAr ? 'حفظ الصنف' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: DELETE PRODUCT CONFIRMATION --- */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#302720] border border-red-500/40 rounded-2xl max-w-sm w-full p-6 space-y-4 animate-scaleUp text-right">
            <div className="w-12 h-12 rounded-full bg-red-950 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-center text-[#FCFAF6]">
              {isAr ? 'تأكيد حذف الصنف' : 'Confirm Dish Deletion'}
            </h3>
            <p className="text-xs text-[#FCFAF6]/75 text-center leading-relaxed font-light">
              {isAr
                ? 'هل أنت متأكد من رغبتك في حذف هذا الصنف نهائياً من قاعدة البيانات؟'
                : 'Are you sure you want to permanently delete this dish?'}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-600 text-xs text-gray-300 hover:bg-white/5"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingProductId)}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                {isAr ? 'تأكيد الحذف' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE / EDIT CATEGORY --- */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#302720] border border-[#B99A62]/30 rounded-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp text-right">
            <h3 className="font-serif text-xl font-bold text-[#FCFAF6]">
              {editingCategory.id ? (isAr ? 'تعديل القسم' : 'Edit Category') : isAr ? 'إضافة قسم جديد' : 'New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'اسم القسم بالعربية *' : 'Arabic Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_ar || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'الاسم بالإنجليزية' : 'English Name'}
                </label>
                <input
                  type="text"
                  value={editingCategory.name_en || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'صورة القسم' : 'Category Image'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCategory.image || ''}
                    onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white dir-ltr text-right"
                  />
                  <label className="px-3 py-2 rounded-lg bg-[#B99A62]/20 hover:bg-[#B99A62]/30 border border-[#B99A62]/40 text-xs text-[#B99A62] font-semibold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : isAr ? 'رفع' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, url => {
                            setEditingCategory(prev => (prev ? { ...prev, image: url } : null));
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#FCFAF6]/80 mb-1">
                  {isAr ? 'ترتيب الظهور' : 'Sort Order'}
                </label>
                <input
                  type="number"
                  value={editingCategory.sort_order ?? 1}
                  onChange={e => setEditingCategory({ ...editingCategory, sort_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#B99A62]/20">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-xs text-gray-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#B99A62] text-[#211B17] font-bold text-xs hover:bg-[#c9aa70]"
                >
                  {isAr ? 'حفظ القسم' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: SAFE DELETE CATEGORY WITH REASSIGNMENT FLOW --- */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#302720] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 animate-scaleUp text-right">
            <div className="w-12 h-12 rounded-full bg-amber-950 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-center text-[#FCFAF6]">
              {isAr ? 'الحذف الآمن للقسم' : 'Safe Category Deletion'}
            </h3>
            <p className="text-xs text-[#FCFAF6]/75 text-center leading-relaxed font-light">
              {isAr
                ? `أنت على وشك حذف قسم "${deletingCategory.name_ar}". لحماية أصناف المنيو من الحذف الصامت، يُرجى تحديد قسم بديل لنقل الأصناف إليه:`
                : `Deleting "${deletingCategory.name_en}". To prevent orphaned products, choose a target category to reassign its items:`}
            </p>

            <div>
              <label className="block text-xs text-[#B99A62] font-semibold mb-1">
                {isAr ? 'إعادة تعيين الأصناف إلى قسم بديل:' : 'Reassign products to:'}
              </label>
              <select
                value={reassignTargetCatId}
                onChange={e => setReassignTargetCatId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#211B17] border border-[#B99A62]/30 text-xs text-white cursor-pointer"
              >
                <option value="">{isAr ? '-- بدون إعادة تعيين (تعليم الأصناف للمراجعة) --' : '-- Mark as Needs Review --'}</option>
                {categories
                  .filter(c => c.id !== deletingCategory.id)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name_ar} ({c.name_en})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2 pt-3 border-t border-[#B99A62]/20">
              <button
                onClick={() => {
                  setDeletingCategory(null);
                  setReassignTargetCatId('');
                }}
                className="flex-1 py-2.5 rounded-lg border border-gray-600 text-xs text-gray-300"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteCategory}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                {isAr ? 'تنفيذ الحذف الآمن' : 'Confirm Safe Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
