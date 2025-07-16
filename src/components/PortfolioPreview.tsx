
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioPreview = () => {
  const navigate = useNavigate();

  const collections = [
    {
      id: 1,
      title: 'TakshaVerse',
      subtitle: 'Corporate Excellence',
      description: 'Premium corporate gifting solutions with sophisticated design',
      image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=500&q=80',
      itemCount: 24,
      category: 'corporate',
      series: 'TakshaVerse'
    },
    {
      id: 2,
      title: 'Ark Series',
      subtitle: 'Sacred Craftsmanship',
      description: 'Traditional spiritual art forms in contemporary expressions',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=500&q=80',
      itemCount: 18,
      category: 'home',
      series: 'Ark Series'
    },
    {
      id: 3,
      title: 'Moments+',
      subtitle: 'Celebration Collection',
      description: 'Special occasion pieces that make memories unforgettable',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80',
      itemCount: 32,
      category: 'personal',
      series: 'Moments+'
    },
    {
      id: 4,
      title: 'Epoch Series',
      subtitle: 'Heritage Reimagined',
      description: 'Timeless traditional techniques for modern living',
      image: 'https://images.unsplash.com/photo-1608746019631-54a1e8b0b01b?auto=format&fit=crop&w=500&q=80',
      itemCount: 28,
      category: 'home',
      series: 'Epoch Series'
    }
  ];

  const handleViewCollection = (collection: any) => {
    // Navigate to shop page with specific series filter
    navigate(`/shop?series=${encodeURIComponent(collection.series)}`);
    // Add a delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const productsSection = document.querySelector('[data-section="products"]');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handleBrowseCatalogue = () => {
    navigate('/portfolio');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-walnut-50/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-lg font-serif italic text-saffron-600 mb-4">
            Saṃgrahasya darśanam
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-walnut-800 mb-6">
            Complete Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our diverse collections, each telling a unique story of craftsmanship, 
            tradition, and innovation across multiple product categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {collections.map((collection) => (
            <Card 
              key={collection.id} 
              className="group overflow-hidden hover-scale bg-card/80 backdrop-blur-sm border-walnut-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                    {collection.itemCount} Items
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-xl text-walnut-800 mb-2 group-hover:text-saffron-600 transition-colors">
                  {collection.title}
                </h3>
                <p className="font-medium text-saffron-600 text-sm mb-3">
                  {collection.subtitle}
                </p>
                <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                  {collection.description}
                </p>
                <Button 
                  onClick={() => handleViewCollection(collection)}
                  variant="outline" 
                  className="w-full border-walnut-300 hover:bg-walnut-50 group"
                >
                  View Collection
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleBrowseCatalogue}
            size="lg" 
            className="bg-saffron-600 hover:bg-saffron-700 text-white px-12 py-4 text-lg font-medium group"
          >
            Browse Complete Catalogue
            <Eye className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
