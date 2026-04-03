import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, cutType?: string) => void;
  removeFromCart: (id: string, cutType?: string) => void;
  updateQuantity: (id: string, cutType: string | undefined, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryCharge: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

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
          const newQuantity = Math.max(0.25, item.quantity + delta); // Minimum 0.25 for chicken, but eggs might need different logic.
          // Actually, let's just make it simple: if it's chicken, use 0.25 steps? 
          // Or just use the delta provided.
          return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const DELIVERY_FEE = 20;
  const deliveryCharge = cart.length > 0 ? DELIVERY_FEE : 0;
  const cartTotal = subtotal + deliveryCharge;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, deliveryCharge, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
