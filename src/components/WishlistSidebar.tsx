import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, X, ShoppingCart } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const WishlistSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromWishlist, getTotalItems } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      series: item.series,
      category: item.category
    });
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleRemoveFromWishlist = (id: number, name: string) => {
    removeFromWishlist(id);
    toast({
      title: "Removed from Wishlist",
      description: `${name} has been removed from your wishlist.`,
      duration: 2000,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-walnut-50 relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
          <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-saffron-600" />
              Your Wishlist ({getTotalItems()})
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Your wishlist is empty</p>
              <p className="text-sm text-gray-400">Add items you love to your wishlist</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{item.series}</p>
                    <p className="text-sm font-semibold text-saffron-600">₹{item.price}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4">
            <Button 
              className="w-full bg-saffron-600 hover:bg-saffron-700"
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistSidebar;
