import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Star, ShoppingCart, Search, Filter, Grid, List, Loader2, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { productsAPI } from '@/services/api';
import ProductModal from '@/components/ProductModal';

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    series: searchParams.get('series') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, [filters, searchTerm]);

  // Fallback mock data
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

  const loadProducts = async () => {
    try {
      setLoading(true);
      const queryParams = {
        ...filters,
        search: searchTerm,
        limit: 20
      };
      
      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const response = await productsAPI.getAll(queryParams);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      console.log('Using fallback mock data');
      // Use fallback mock data when API fails
      setProducts(mockProducts);
      toast({
        title: "Using Demo Data",
        description: "Backend not connected. Showing sample products.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '',
        series: product.series || '',
        category: product.category || '',
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddToWishlist = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToWishlist({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '',
        series: product.series || '',
        category: product.category || '',
      });
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getProductImage = (product: any) => {
    return product.images?.[0]?.url || 'https://via.placeholder.com/400x400';
  };

  const updateFilters = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-walnut-800 mb-2">
            Product Catalog
          </h1>
          <p className="text-muted-foreground">
            Discover our handcrafted collection of premium products
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filters.category} onValueChange={(value) => updateFilters('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.series} onValueChange={(value) => updateFilters('series', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Series</SelectItem>
                <SelectItem value="TakshaVerse">TakshaVerse</SelectItem>
                <SelectItem value="Moments+">Moments+</SelectItem>
                <SelectItem value="Garden+">Garden+</SelectItem>
                <SelectItem value="CorporateEdition">Corporate Edition</SelectItem>
                <SelectItem value="Epoch Series">Epoch Series</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortOrder }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            
            <div className="text-sm text-muted-foreground">
              {products.length} products found
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-saffron-600 mr-2" />
            <span>Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {products.map((product) => (
              <Card
                key={product._id}
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}
                onClick={() => openProductModal(product)}
              >
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'
                }`}>
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="bg-saffron-500 text-white text-xs">New</Badge>
                    )}
                    {product.isLimited && (
                      <Badge className="bg-mahogany-500 text-white text-xs">Limited</Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-8 h-8 p-0"
                      onClick={(e) => handleAddToWishlist(product, e)}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product._id) ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>

                  {/* Add to Cart Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      className="bg-saffron-600 hover:bg-saffron-700 text-white"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <CardContent className={`${viewMode === 'list' ? 'flex-1' : ''} p-4`}>
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.series}
                    </Badge>
                  </div>
                  
                  <h3 className="font-serif font-semibold text-lg text-walnut-800 mb-2 group-hover:text-saffron-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 fill-saffron-400 text-saffron-400" />
                    <span className="ml-1 text-sm font-medium">{product.rating || 4.5}</span>
                    <span className="ml-1 text-sm text-muted-foreground">({product.reviews || 0})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-walnut-800">
                        ₹{product.price?.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductCatalog;