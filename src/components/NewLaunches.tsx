import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Phone, Loader2 } from 'lucide-react';
import { productsAPI } from '@/services/api';
import ProductModal from '@/components/ProductModal';

const NewLaunches = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewProducts();
  }, []);

  const loadNewProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        limit: 6,
        isNew: true,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setNewProducts(response.products || []);
    } catch (error) {
      console.error('Error loading new products:', error);
      // Fallback to static data if API fails
      setNewProducts([
        {
          _id: '1',
          name: 'Festival Gift Collection',
          series: 'TakshaVerse',
          price: 5999,
          originalPrice: 7499,
          images: [
            { url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80' },
            { url: 'https://images.unsplash.com/photo-1618160702440-2f0b49eade7c?auto=format&fit=crop&w=600&q=80' }
          ],
          description: 'A curated collection celebrating the spirit of festivals with traditional craftsmanship',
          isLimited: true,
          category: 'custom',
          rating: 4.8,
          reviews: 15,
          isNew: true,
          features: ['Festival themed items', 'Traditional craftsmanship', 'Premium packaging', 'Multiple pieces included']
        },
        {
          _id: '2',
          name: 'Executive Desk Set',
          series: 'Epoch Series',
          price: 8999,
          images: [
            { url: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=600&q=80' }
          ],
          description: 'Sophisticated workspace essentials crafted for the modern leader',
          isLimited: false,
          category: 'corporate',
          rating: 4.9,
          reviews: 22,
          isNew: true,
          features: ['Executive quality', 'Multiple desk accessories', 'Premium materials', 'Professional design']
        },
        {
          _id: '3',
          name: 'Artisan Memory Collection',
          series: 'Moments+',
          price: 4299,
          originalPrice: 5199,
          images: [
            { url: 'https://images.unsplash.com/photo-1565620551738-42e66656dc5c?auto=format&fit=crop&w=600&q=80' }
          ],
          description: 'Preserve your precious memories with this handcrafted collection',
          isLimited: true,
          category: 'personal',
          rating: 4.6,
          reviews: 33,
          isNew: true,
          features: ['Customizable options', 'Premium photo quality', 'Handcrafted frames', 'Gift ready packaging']
        },
        {
          _id: '4',
          name: 'Heritage Home Decor Set',
          series: 'Garden+',
          price: 3799,
          images: [
            { url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80' }
          ],
          description: 'Transform your living space with this thoughtfully designed collection',
          isLimited: true,
          category: 'home',
          rating: 4.7,
          reviews: 18,
          isNew: true,
          features: ['Three piece set', 'Artisan crafted', 'Home decoration', 'Elegant design']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExploreNow = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleViewAllNewArrivals = () => {
    navigate('/products?isNew=true');
  };

  const getProductImage = (product) => {
    return product.images?.[0]?.url || product.image || 'https://via.placeholder.com/400x400';
  };

  if (loading) {
    return (
      <section className="py-20 bg-walnut-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-saffron-600" />
            <p className="text-lg text-muted-foreground">Loading new arrivals...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-walnut-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-lg font-serif italic text-saffron-600 mb-2">Nūtana sākṣāt</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-walnut-800 mb-4">Fresh Arrivals</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be among the first to experience our latest creations, where innovation meets timeless tradition
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="block lg:hidden">
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
              {newProducts.map((product) => (
                <Card
                  key={product._id}
                  className="flex-shrink-0 w-80 snap-start group overflow-hidden bg-card/90 backdrop-blur-sm border-walnut-200 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        className="w-full bg-white/90 text-walnut-800 hover:bg-white hover:text-walnut-900 backdrop-blur-sm"
                        onClick={() => handleExploreNow(product)}
                      >
                        Explore Now
                      </Button>
                    </div>
                    {product.isLimited && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-mahogany-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          Limited Edition
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <span className="bg-saffron-100 text-saffron-800 text-xs font-medium px-2 py-1 rounded-full">
                        {product.series}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-walnut-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="bg-gradient-to-r from-saffron-50 to-orange-50 border border-saffron-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-saffron-600 flex-shrink-0" />
                        <p className="text-xs text-saffron-700 font-medium">
                          We'll call you for customization options!
                        </p>
                      </div>
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
                      <span className="text-xs text-saffron-600 bg-saffron-50 px-2 py-1 rounded-full">
                        New Launch
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProducts.map((product) => (
              <Card
                key={product._id}
                className="group overflow-hidden bg-card/90 backdrop-blur-sm border-walnut-200 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      className="w-full bg-white/90 text-walnut-800 hover:bg-white hover:text-walnut-900 backdrop-blur-sm"
                      onClick={() => handleExploreNow(product)}
                    >
                      Explore Now
                    </Button>
                  </div>
                  {product.isLimited && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-mahogany-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Limited Edition
                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="bg-saffron-100 text-saffron-800 text-xs font-medium px-2 py-1 rounded-full">
                      {product.series}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-walnut-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="bg-gradient-to-r from-saffron-50 to-orange-50 border border-saffron-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-saffron-600 flex-shrink-0" />
                      <p className="text-xs text-saffron-700 font-medium">
                        We'll call you for customization options!
                      </p>
                    </div>
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
                    <span className="text-xs text-saffron-600 bg-saffron-50 px-2 py-1 rounded-full">
                      New Launch
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Button
              onClick={handleViewAllNewArrivals}
              className="bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All New Arrivals
            </Button>
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

export default NewLaunches;