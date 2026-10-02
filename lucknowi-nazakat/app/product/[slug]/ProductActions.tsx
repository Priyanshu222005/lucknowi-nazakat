'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
}

export default function ProductActions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || product.imageUrl || '/images/placeholder.jpg',
      size: selectedSize,
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Size Selection */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Select Size:{' '}
            <span className="text-[#6B1D2F] font-bold">{selectedSize}</span>
          </span>
          <button
            type="button"
            className="text-[11px] text-[#6B1D2F] underline font-semibold cursor-pointer"
          >
            Size Guide
          </button>
        </div>
        <div className="flex gap-2.5">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`w-11 h-11 rounded-lg text-xs font-bold transition flex items-center justify-center border cursor-pointer ${
                selectedSize === size
                  ? 'border-[#6B1D2F] bg-[#6B1D2F] text-white shadow-sm'
                  : 'border-stone-300 text-stone-700 hover:border-stone-800 bg-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={added}
          className={`flex-1 py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow ${
            added
              ? 'bg-green-700 text-white'
              : 'bg-[#6B1D2F] hover:bg-[#521624] text-white'
          }`}
        >
          {added ? '✓ ADDED TO CART' : '+ ADD TO CART'}
        </button>

        <Link
          href="/checkout"
          onClick={handleAddToCart}
          className="flex-1 text-center bg-stone-900 hover:bg-stone-800 text-white py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center shadow"
        >
          BUY IT NOW
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-200 text-center">
        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
          <p className="text-[11px] font-bold text-stone-800">
            100% Handcrafted
          </p>
          <p className="text-[10px] text-stone-500">Authentic Chikankari</p>
        </div>
        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
          <p className="text-[11px] font-bold text-stone-800">
            Express Delivery
          </p>
          <p className="text-[10px] text-stone-500">Dispatched in 24 hrs</p>
        </div>
        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
          <p className="text-[11px] font-bold text-stone-800">Easy Returns</p>
          <p className="text-[10px] text-stone-500">7 Days Return Policy</p>
        </div>
      </div>
    </div>
  );
}