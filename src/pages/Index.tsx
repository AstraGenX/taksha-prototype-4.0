
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import NewLaunches from '@/components/NewLaunches';
import ActionButtonStrip from '@/components/ActionButtonStrip';
import PortfolioPreview from '@/components/PortfolioPreview';
import Footer from '@/components/Footer';

const Index = () => {


  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <NewLaunches />
      <ActionButtonStrip />
      <PortfolioPreview />
      <Footer />
    </div>
  );
};

export default Index;
