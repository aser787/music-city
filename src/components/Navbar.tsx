import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Shield, UtensilsCrossed, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, categoryId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { lang, toggleLang, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'menu', label: t('nav.menu') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#211B17]/95 backdrop-blur-md shadow-lg shadow-black/20 py-3.5 border-b border-[#B99A62]/20'
          : 'bg-gradient-to-b from-[#211B17]/90 via-[#211B17]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            aria-label="Music City Home"
          >
            <div className="w-10 h-10 rounded-full bg-[#B99A62]/15 border border-[#B99A62]/40 flex items-center justify-center text-[#B99A62] group-hover:bg-[#B99A62] group-hover:text-[#211B17] transition-all duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#FCFAF6] group-hover:text-[#B99A62] transition-colors">
                MUSIC CITY
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-[#B99A62] uppercase">
                {lang === 'ar' ? 'ميوزيك سيتي • أسيوط' : 'Restaurant & Café • Assiut'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 cursor-pointer focus:outline-none ${
                    isActive ? 'text-[#B99A62] font-semibold' : 'text-[#FCFAF6]/80 hover:text-[#FCFAF6]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B99A62] rounded-full animate-fadeIn" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#B99A62]/30 text-xs font-semibold text-[#FCFAF6] hover:bg-[#B99A62]/10 hover:border-[#B99A62] transition-all cursor-pointer"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#B99A62]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => onNavigate(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className={`p-2 rounded-full border transition-all cursor-pointer relative ${
                currentView.startsWith('admin')
                  ? 'border-[#B99A62] bg-[#B99A62] text-[#211B17]'
                  : 'border-[#E7DDCD]/20 text-[#FCFAF6]/70 hover:text-[#B99A62] hover:border-[#B99A62]/50'
              }`}
              title={t('nav.admin')}
              aria-label={t('nav.admin')}
            >
              <Shield className="w-4 h-4" />
              {isAuthenticated && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#211B17]" />
              )}
            </button>

            {/* View Menu Primary CTA */}
            <button
              onClick={() => onNavigate('menu')}
              className="px-5 py-2 rounded-full bg-[#B99A62] text-[#211B17] font-semibold text-sm tracking-wide hover:bg-[#c9aa70] hover:shadow-lg hover:shadow-[#B99A62]/20 active:scale-95 transition-all cursor-pointer"
            >
              {t('nav.view_menu')}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLang}
              className="p-2 rounded-full border border-[#B99A62]/30 text-xs font-semibold text-[#FCFAF6]"
              aria-label="Toggle Language"
            >
              <span className="text-xs font-bold text-[#B99A62]">{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#FCFAF6] hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#211B17] border-b border-[#B99A62]/20 px-6 py-6 space-y-4 animate-fadeIn shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-right py-2 text-base font-medium transition-colors ${
                  currentView === link.id ? 'text-[#B99A62] font-bold' : 'text-[#FCFAF6]/90'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                onNavigate(isAuthenticated ? 'admin-dashboard' : 'admin-login');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 text-sm text-[#B99A62] font-medium"
            >
              <Shield className="w-4 h-4" />
              <span>{t('nav.admin')}</span>
              {isAuthenticated && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Active</span>}
            </button>

            <button
              onClick={() => {
                onNavigate('menu');
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-3 rounded-xl bg-[#B99A62] text-[#211B17] font-bold text-center shadow-md active:scale-95 transition-all"
            >
              {t('nav.view_menu')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
