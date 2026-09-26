'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  size?: string;
  quantity: number;
}

interface AddToCartInput {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  size?: string;
  quantity?: number;
}

export interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  totalAmount: number;
  setIsOpen: (isOpen: boolean) => void;
  addToCart: (product: AddToCartInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('lucknowi_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lucknowi_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const totalAmount = cart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const addToCart = (product: AddToCartInput) => {
    setCart((prevCart) => {
      const id = product.id || product._id || String(Date.now());
      const size = product.size || 'M';
      const existing = prevCart.find((item) => item.id === id && item.size === size);

      if (existing) {
        return prevCart.map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image,
          category: product.category,
          size,
          quantity: product.quantity || 1,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        totalAmount,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}