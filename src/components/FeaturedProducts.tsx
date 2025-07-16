import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Phone, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { productsAPI } from '@/services/api';
import ProductModal from './ProductModal';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        limit: 8,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setFeaturedProducts(response.products || []);
    } catch (error) {
      console.error('Error loading featured products:', error);
      // Fallback to static data if API fails
      setFeaturedProducts([
        {
          _id: '101',
          name: 'Executive Wooden Desk Organizer',
          series: 'TakshaVerse',
          price: 2499,
          originalPrice: 2999,
          images: [
            { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80' },
            { url: 'https://images.unsplash.com/photo-1590080877777-bb3d7c80ae72?auto=format&fit=crop&w=600&q=80' }
          ],
          rating: 4.8,
          reviews: 124,
          description: 'Premium handcrafted wooden desk organizer perfect for modern offices',
          isNew: false,
          isLimited: true,
          category: 'corporate',
          features: ['Premium wood finish', 'Multiple compartments', 'Pen holder', 'Business card slot'],
        },
        {
          _id: '102',
          name: 'Artisan Memory Photo Frame',
          series: 'Moments+',
          price: 1299,
          images: [
            { url: 'https://images.unsplash.com/photo-1565620551738-42e66656dc5c?auto=format&fit=crop&w=600&q=80' }
          ],
          rating: 4.9,
          reviews: 89,
          description: 'Capture your precious memories in this beautifully crafted wooden frame',
          isNew: true,
          isLimited: false,
          category: 'personal',
          features: ['Photo customization', 'Engraving options', 'Multiple sizes', 'Gift packaging'],
        },
        {
          _id: '103',
          name: 'Rustic Garden Planter Set',
          series: 'Garden+',
          price: 1799,
          originalPrice: 2199,
          images: [
            { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80' }
          ],
          rating: 4.6,
          reviews: 67,
          description: 'Beautiful set of handcrafted wooden planters for your garden',
          isNew: false,
          isLimited: false,
          category: 'home',
          features: ['Weather resistant', 'Drainage holes', 'Set of 3', 'Natural wood'],
        },
        {
          _id: '104',
          name: 'Corporate Gift Box Collection',
          series: 'CorporateEdition',
          price: 3999,
          originalPrice: 4999,
          images: [
            { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80' }
          ],
          rating: 4.7,
          reviews: 43,
          description: 'Premium corporate gift collection with multiple customizable items',
          isNew: true,
          isLimited: false,
          category: 'corporate',
          features: ['Custom branding', 'Multiple items', 'Premium packaging', 'Corporate quality'],
        }
      ]);
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
        image: product.images?.[0]?.url || product.image || '',
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
        variant: "destructive",
      });
    }
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getProductImage = (product: any) => {
    return product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400x400';
  };

  const getProductRating = (product: any) => {
    return product.rating || 4.5;
  };

  const getProductReviews = (product: any) => {
    return product.reviews || 0;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-walnut-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
            <p className="text-lg text-muted-foreground">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-background to-walnut-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-lg font-serif italic text-saffron-600 mb-2">
              Viśeṣa saṅgraha
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-walnut-800 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked masterpieces that embody the essence of our craftsmanship and tradition
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="block lg:hidden">
            <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory">
              {featuredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="flex-shrink-0 w-80 snap-start group overflow-hidden hover-scale bg-card/80 backdrop-blur-sm border-walnut-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => openProductModal(product)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-saffron-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          Nūtana
                        </span>
                      )}
                      {product.isLimited && (
                        <span className="bg-mahogany-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          Pratiyogitā-samayaḥ
                        </span>
                      )}
                    </div>
                    {/* Hover Overlay */}
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
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <span className="bg-walnut-100 text-walnut-800 text-xs font-medium px-2 py-1 rounded-full">
                        {product.series}
                      </span>
                    </div>
                    <h3 className="font-serif font-semibold text-lg text-walnut-800 mb-2 group-hover:text-saffron-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="bg-gradient-to-r from-saffron-50 to-orange-50 border border-saffron-200 rounded-lg p-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-saffron-600 flex-shrink-0" />
                        <p className="text-xs text-saffron-700 font-medium">
                          We'll call you for customization options!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 fill-saffron-400 text-saffron-400" />
                      <span className="ml-1 text-sm font-medium">{getProductRating(product)}</span>
                      <span className="ml-1 text-sm text-muted-foreground">({getProductReviews(product)})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-walnut-800">₹{product.price?.toLocaleString()}</span>
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
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product._id}
                className="group overflow-hidden hover-scale bg-card/80 backdrop-blur-sm border-walnut-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openProductModal(product)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-saffron-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Nūtana
                      </span>
                    )}
                    {product.isLimited && (
                      <span className="bg-mahogany-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Pratiyogitā-samayaḥ
                      </span>
                    )}
                  </div>
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
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="bg-walnut-100 text-walnut-800 text-xs font-medium px-2 py-1 rounded-full">
                      {product.series}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-walnut-800 mb-2 group-hover:text-saffron-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="bg-gradient-to-r from-saffron-50 to-orange-50 border border-saffron-200 rounded-lg p-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-saffron-600 flex-shrink-0" />
                      <p className="text-xs text-saffron-700 font-medium">
                        We'll call you for customization options!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 fill-saffron-400 text-saffron-400" />
                    <span className="ml-1 text-sm font-medium">{getProductRating(product)}</span>
                    <span className="ml-1 text-sm text-muted-foreground">({getProductReviews(product)})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-walnut-800">₹{product.price?.toLocaleString()}</span>
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
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default FeaturedProducts;