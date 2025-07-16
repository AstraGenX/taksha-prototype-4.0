import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  category: string;
  series: string;
  price: number;
  originalPrice?: number;
  image: string;
  image2?: string;
  image3?: string;
  image4?: string;
  rating: number;
  reviews: number;
  isNew: boolean;
  isLimited: boolean;
  description?: string;
  features?: string[];
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Gallery images array with fallback to main image
  const productImages = useMemo(() => {
    return [
      product.image,
      product.image2 || product.image,
      product.image3 || product.image,
      product.image4 || product.image,
    ];
  }, [product]);

  // Add to cart handler
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      series: product.series,
      category: product.category,
    });

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });

    onClose();
  };

  // Wishlist toggle handler
  const handleWishlistToggle = () => {
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      series: product.series,
      category: product.category,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(wishlistItem);
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  // Next image in gallery
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  // Previous image in gallery
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      (prev - 1 + productImages.length) % productImages.length
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-walnut-800">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Images with navigation */}
          <div className="space-y-4">
            <div className="relative group aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={productImages[currentImageIndex]}
                alt={`View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                      ? 'border-saffron-500 ring-2 ring-saffron-300'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-saffron-100 text-saffron-800 text-sm font-medium px-2 py-1 rounded-full">
                {product.series}
              </span>
              {product.isNew && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {product.isLimited && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                  Limited Edition
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-saffron-400 text-saffron-400" />
              <span className="text-lg font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-walnut-800">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-muted-foreground">
                {product.description || `Beautiful ${product.name} from the ${product.series} collection.`}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Features</h3>
              <ul className="space-y-1">
                {(product.features || [
                  'Premium quality',
                  'Elegant design',
                  'Perfect for home',
                  'Durable finish',
                ]).map((feature, idx) => (
                  <li key={idx} className="flex items-center text-muted-foreground">
                    <span className="w-2 h-2 bg-saffron-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistToggle}
                className={isInWishlist(product.id) ? 'bg-red-50 border-red-200' : ''}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
