
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { cartAPI } from '@/services/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  series: string;
  quantity: number;
  category: string;
  variant?: any;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem('taksha_cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [user]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('taksha_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const refreshCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setItems(response.cart?.items || []);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    if (user) {
      try {
        setLoading(true);
        const response = await cartAPI.add(product.productId, 1, product.variant);
        setItems(response.cart?.items || []);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - use localStorage
      setItems(prev => {
        const existingItem = prev.find(item => item.productId === product.productId);
        if (existingItem) {
          return prev.map(item =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        setLoading(true);
        const response = await cartAPI.remove(productId);
        setItems(response.cart?.items || []);
      } catch (error) {
        console.error('Error removing from cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - use localStorage
      setItems(prev => prev.filter(item => item.productId !== productId));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        setLoading(true);
        const response = await cartAPI.update(productId, quantity);
        setItems(response.cart?.items || []);
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - use localStorage
      setItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        setLoading(true);
        await cartAPI.clear();
        setItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest user - clear localStorage
      setItems([]);
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
