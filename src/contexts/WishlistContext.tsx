
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { wishlistAPI } from '@/services/api';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  series: string;
  category: string;
  isNew?: boolean;
  isLimited?: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load wishlist from backend when user is authenticated
  useEffect(() => {
    if (user) {
      refreshWishlist();
    } else {
      // Load from localStorage for guest users
      const savedWishlist = localStorage.getItem('taksha_wishlist');
      if (savedWishlist) {
        try {
          setItems(JSON.parse(savedWishlist));
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
    }
  }, [user]);

  // Save wishlist to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('taksha_wishlist', JSON.stringify(items));
    }
  }, [items, user]);

  const refreshWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setItems(response.wishlist?.items || []);
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: WishlistItem) => {
    if (user) {
      try {
        setLoading(true);
        const response = await wishlistAPI.add(product.productId);
        setItems(response.wishlist?.items || []);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - use localStorage
      setItems(prev => {
        const exists = prev.find(item => item.productId === product.productId);
        if (exists) return prev;
        return [...prev, product];
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      try {
        setLoading(true);
        const response = await wishlistAPI.remove(productId);
        setItems(response.wishlist?.items || []);
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - use localStorage
      setItems(prev => prev.filter(item => item.productId !== productId));
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (user) {
      try {
        setLoading(true);
        const response = await wishlistAPI.toggle(productId);
        setItems(response.wishlist?.items || []);
      } catch (error) {
        console.error('Error toggling wishlist:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - use localStorage
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        console.warn('Guest user toggle requires full item data');
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const getTotalItems = () => {
    return items.length;
  };

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      getTotalItems,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
