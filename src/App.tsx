import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { MenuView } from './views/MenuView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminLoginView } from './views/AdminLoginView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { api } from './api/client';
import { initialSiteContent } from '../server/seedData';
import type { Category, Product, SiteContent } from './types';

function MainApp() {
  const { lang } = useLanguage();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<SiteContent>(initialSiteContent);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Sync hash routing on mount
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash.startsWith('menu/')) {
          const catId = hash.replace('menu/', '');
          setSelectedCategory(catId);
          setCurrentView('menu');
        } else if (['home', 'menu', 'about', 'contact', 'admin-login', 'admin-dashboard'].includes(hash)) {
          setCurrentView(hash);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const loadData = async () => {
    try {
      const [cats, prods, siteContent] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getSiteContent(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setContent(siteContent);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (view: string, categoryId?: string) => {
    if (categoryId) {
      setSelectedCategory(categoryId);
      window.location.hash = `menu/${categoryId}`;
    } else {
      window.location.hash = view;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render view router
  const renderView = () => {
    if (currentView === 'admin-dashboard') {
      if (!isAuthenticated && !isAuthLoading) {
        return (
          <AdminLoginView
            onSuccess={() => {
              setCurrentView('admin-dashboard');
              window.location.hash = 'admin-dashboard';
            }}
            onBackToSite={() => handleNavigate('home')}
          />
        );
      }
      return (
        <AdminDashboardView
          onBackToSite={() => handleNavigate('home')}
          onRefreshPublicData={loadData}
        />
      );
    }

    if (currentView === 'admin-login') {
      if (isAuthenticated) {
        return (
          <AdminDashboardView
            onBackToSite={() => handleNavigate('home')}
            onRefreshPublicData={loadData}
          />
        );
      }
      return (
        <AdminLoginView
          onSuccess={() => {
            setCurrentView('admin-dashboard');
            window.location.hash = 'admin-dashboard';
          }}
          onBackToSite={() => handleNavigate('home')}
        />
      );
    }

    if (currentView === 'menu') {
      return (
        <MenuView
          categories={categories}
          products={products}
          initialCategoryId={selectedCategory}
          content={content}
        />
      );
    }

    if (currentView === 'about') {
      return (
        <AboutView
          content={content}
          onExploreMenu={() => handleNavigate('menu')}
        />
      );
    }

    if (currentView === 'contact') {
      return <ContactView content={content} />;
    }

    // Default: HomeView
    return (
      <HomeView
        content={content}
        categories={categories}
        products={products}
        onNavigate={handleNavigate}
      />
    );
  };

  const isAdminView = currentView.startsWith('admin');

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#B99A62]/30 selection:text-[#211B17]">
      {!isAdminView && (
        <Navbar currentView={currentView} onNavigate={handleNavigate} />
      )}

      <div className="flex-1">{renderView()}</div>

      {!isAdminView && (
        <Footer content={content} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
