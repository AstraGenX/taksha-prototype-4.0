import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Phone, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  name: string;
  category: string;
  series: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  isLimited: boolean;
  description?: string;
  features?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const productImages = [
    product.image,
    product.image.replace('w=400', 'w=500'),
    product.image.replace('w=400', 'w=600'),
    product.image.replace('auto=format', 'auto=format&sat=-20'),
  ];

  const seriesColors = {
    'Epoch Series': 'bg-teak-100 text-teak-800',
    'TakshaVerse': 'bg-walnut-100 text-walnut-800',
    'Ark Series': 'bg-mahogany-100 text-mahogany-800',
    'Moments+': 'bg-saffron-100 text-saffron-800',
    'Spiritual Collection': 'bg-purple-100 text-purple-800',
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      series: product.series,
      category: product.category
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      series: product.series,
      category: product.category
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(wishlistItem);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleEyeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowImageGallery(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <>
      <Card className="group overflow-hidden hover-scale bg-card/80 backdrop-blur-sm border-walnut-200 hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
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

          {/* Quick Actions removed (Heart and Eye icons) */}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              className="bg-saffron-600 hover:bg-saffron-700 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${seriesColors[product.series as keyof typeof seriesColors] || 'bg-gray-100 text-gray-800'}`}>
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
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-saffron-400 text-saffron-400" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
              <span className="ml-1 text-sm text-muted-foreground">({product.reviews})</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-walnut-800">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-walnut-300 hover:bg-walnut-50"
              onClick={() => setShowModal(true)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-square">
              <img
                src={productImages[currentImageIndex]}
                alt={`${product.name} - View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-200"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-200"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-serif font-bold text-xl text-walnut-800 mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-walnut-800">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                        ? 'border-saffron-500 ring-2 ring-saffron-200'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ProductModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ProductCard;
