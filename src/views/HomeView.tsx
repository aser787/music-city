import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { BrandIntroSection } from '../components/BrandIntroSection';
import { SignatureCategories } from '../components/SignatureCategories';
import { FeaturedDishes } from '../components/FeaturedDishes';
import { VisualStorytelling } from '../components/VisualStorytelling';
import { SocialSection } from '../components/SocialSection';
import type { Category, Product, SiteContent } from '../types';

interface HomeViewProps {
  content: SiteContent;
  categories: Category[];
  products: Product[];
  onNavigate: (view: string, categoryId?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  content,
  categories,
  products,
  onNavigate,
}) => {
  const handleScrollToDiscover = () => {
    const el = document.getElementById('brand-intro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('about');
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        content={content}
        onExploreMenu={() => onNavigate('menu')}
        onDiscover={handleScrollToDiscover}
      />

      <BrandIntroSection
        content={content}
        onExploreMenu={() => onNavigate('menu')}
      />

      <SignatureCategories
        categories={categories}
        onSelectCategory={catId => onNavigate('menu', catId)}
      />

      <FeaturedDishes
        products={products}
        categories={categories}
        onExploreMenu={() => onNavigate('menu')}
      />

      <VisualStorytelling
        content={content}
        onExploreMenu={() => onNavigate('menu')}
      />

      <SocialSection content={content} />
    </div>
  );
};
