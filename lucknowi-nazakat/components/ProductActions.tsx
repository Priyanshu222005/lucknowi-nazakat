'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [added, setAdded] = useState(false);
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;
  const router = useRouter();

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/images/placeholder.jpg',
        size: 'M',
        quantity: 1,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={handleAddToCart}
        className="flex-1 bg-[#6B1D2F] hover:bg-[#521624] text-white py-3.5 px-6 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md cursor-pointer"
      >
        {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
      </button>

      <button
        type="button"
        onClick={handleBuyNow}
        className="bg-stone-900 hover:bg-black text-white py-3.5 px-6 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer"
      >
        BUY NOW
      </button>
    </div>
  );
}