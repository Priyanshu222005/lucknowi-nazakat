'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Directly pass quantity as 1
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || product.imageUrl || '/images/placeholder.jpg',
      size: 'M',
      quantity: 1,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  const imageSrc = product.image || product.imageUrl || '/images/placeholder.jpg';

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        <div className="relative w-full h-64 bg-stone-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="p-4">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#6B1D2F] text-white px-2 py-0.5 rounded inline-block mb-2">
            {product.category || 'Chikankari'}
          </span>

          <h3 className="font-serif font-bold text-stone-900 text-lg leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            {product.description || 'Good Quality'}
          </p>

          <p className="text-lg font-bold text-[#6B1D2F] mt-2">
            ₹{product.price}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
        <Link
          href={`/product/${product.id}`}
          className="text-center border border-stone-800 text-stone-800 hover:bg-stone-900 hover:text-white py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center"
        >
          VIEW DETAILS
        </Link>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center cursor-pointer ${
            added
              ? 'bg-green-700 text-white'
              : 'bg-[#6B1D2F] hover:bg-[#521624] text-white shadow'
          }`}
        >
          {added ? '✓ ADDED' : '+ ADD TO CART'}
        </button>
      </div>
    </div>
  );
}