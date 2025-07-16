import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Grid, List, Star, ChevronDown, Heart, ShoppingCart } from 'lucide-react';
import { productsAPI } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const ShopByCategory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 12;

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll(),
    retry: 1,
    retryDelay: 1000,
  });

  // Fallback mock data for development
  const mockProducts = [
    {
      id: 1,
      name: 'Executive Diary Set',
      category: 'corporate',
      series: 'TakshaVerse',
      price: 1299,
      originalPrice: 1599,
      image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 24,
      isNew: true,
      description: 'Premium executive diary with elegant design and quality materials.',
      stock: 10,
    },
    {
      id: 2,
      name: 'Wooden Pen Drive Casing',
      category: 'corporate',
      series: 'TakshaVerse',
      price: 899,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 18,
      isNew: false,
      description: 'Elegant wooden casing for pen drives, perfect for corporate gifts.',
      stock: 15,
    },
    {
      id: 3,
      name: 'Customized Photo Frame',
      category: 'custom',
      series: 'Moments+',
      price: 599,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 32,
      isNew: true,
      description: 'Personalized photo frames for your precious memories.',
      stock: 25,
    },
    {
      id: 4,
      name: 'Decorative Wall Art',
      category: 'home',
      series: 'Garden+',
      price: 1899,
      originalPrice: 2299,
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 15,
      isNew: false,
      description: 'Beautiful wall art to transform your living space.',
      stock: 8,
    },
    {
      id: 5,
      name: 'Personalized Jewelry Box',
      category: 'personal',
      series: 'TakshaVerse',
      price: 799,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 28,
      isNew: true,
      description: 'Elegant jewelry box with personalized engraving.',
      stock: 12,
    },
    {
      id: 6,
      name: 'Spiritual Meditation Set',
      category: 'spiritual',
      series: 'Spiritual Collection',
      price: 1499,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1604909052434-1c5adf2c787d?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 22,
      isNew: false,
      description: 'Sacred meditation set for spiritual practice.',
      stock: 6,
    },
  ];

  const products = productsData?.products || mockProducts;

  const categories = [
    {
      id: 'all',
      name: 'All Products',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
      count: products.length,
      description: 'Explore our complete collection',
    },
    {
      id: 'corporate',
      name: 'Corporate Gifting Kits',
      image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=400&q=80',
      count: products.filter(p => p.category === 'corporate').length,
      description: 'Professional gifts for business relationships',
    },
    {
      id: 'custom',
      name: 'Customized Giftings',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80',
      count: products.filter(p => p.category === 'custom').length,
      description: 'Personalized creations for special moments',
    },
    {
      id: 'home',
      name: 'Home Decors',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80',
      count: products.filter(p => p.category === 'home').length,
      description: 'Transform your living spaces with style',
    },
    {
      id: 'personal',
      name: 'Personal Giftings',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&q=80',
      count: products.filter(p => p.category === 'personal').length,
      description: 'Thoughtful gifts for loved ones',
    },
    {
      id: 'new',
      name: 'New Products',
      image: 'https://images.unsplash.com/photo-1580910051073-99b1e9c5645b?auto=format&fit=crop&w=400&q=80',
      count: products.filter(p => p.isNew).length,
      description: 'Explore our latest arrivals and fresh launches',
    },
    {
      id: 'spiritual',
      name: 'Spiritual Collection',
      image: 'https://images.unsplash.com/photo-1604909052434-1c5adf2c787d?auto=format&fit=crop&w=400&q=80',
      count: products.filter(p => p.category === 'spiritual').length,
      description: 'Sacred gifts to nourish the soul',
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedCategory !== 'all' && selectedCategory !== 'new' && product.category !== selectedCategory)
      return false;
    if (selectedCategory === 'new' && !product.isNew) return false;
    if (selectedSeries !== 'all' && product.series !== selectedSeries) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (!matchesSearch) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.isNew - a.isNew;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Error loading products. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by <span className="text-orange-600">Category</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections of traditional and modern gifts
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    {category.count}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Series</option>
              <option value="TakshaVerse">TakshaVerse</option>
              <option value="Moments+">Moments+</option>
              <option value="Garden+">Garden+</option>
              <option value="Spiritual Collection">Spiritual Collection</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {currentProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 bg-green-500">New</Badge>
                  )}
                  {product.isLimited && (
                    <Badge className="absolute top-2 right-2 bg-red-500">Limited</Badge>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleWishlistToggle(product)}
                        variant="secondary"
                        className="h-8 w-8 p-0"
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="h-8 w-8 p-0"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.reviews || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-orange-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.series}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByCategory;