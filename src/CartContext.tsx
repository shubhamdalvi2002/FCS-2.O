import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { CartItem, Product } from './types';

interface ShopSettings {
  deliveryCharge: number;
  codEnabled: boolean;
  shopOpen: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, cutType?: string) => void;
  removeFromCart: (id: string, cutType?: string) => void;
  updateQuantity: (id: string, cutType: string | undefined, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryCharge: number;
  cartTotal: number;
  settings: ShopSettings;
  isShopOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({
    deliveryCharge: 20,
    codEnabled: true,
    shopOpen: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const addToCart = (product: Product, quantity: number, cutType?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.cutType === cutType);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.cutType === cutType
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * product.price }
            : item
        );
      }
      return [...prev, { ...product, quantity, cutType, totalPrice: quantity * product.price }];
    });
  };

  const removeFromCart = (id: string, cutType?: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.cutType === cutType)));
  };

  const updateQuantity = (id: string, cutType: string | undefined, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id && item.cutType === cutType) {
          const newQuantity = Math.max(0.25, item.quantity + delta);
          return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryCharge = cart.length > 0 ? settings.deliveryCharge : 0;
  const cartTotal = subtotal + deliveryCharge;

  const isShopOpen = React.useMemo(() => {
    if (!settings.shopOpen) return false;
    const now = new Date();
    const hours = now.getHours();
    // Still keep the 8 AM to 9 PM logic as a secondary check if needed, 
    // or just rely on the manual toggle. Let's combine them for safety.
    return hours >= 8 && hours < 21;
  }, [settings.shopOpen]);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      subtotal, deliveryCharge, cartTotal, settings, isShopOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
