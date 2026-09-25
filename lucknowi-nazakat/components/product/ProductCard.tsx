'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  // Fallback high quality Chikankari image URL
  const defaultImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';

  // Helper to validate image URL
  const getImageSrc = () => {
    if (!product.image || product.image.trim() === '') return defaultImage;
    return product.image;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="relative w-full h-64 bg-stone-100 overflow-hidden">
          <img
            src={getImageSrc()}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== defaultImage) {
                target.src = defaultImage;
              }
            }}
          />
        </div>

        <div className="p-4">
          <span className="text-[10px] font-bold uppercase bg-[#6B1D2F] text-white px-2 py-0.5 rounded">
            {product.category}
          </span>
          <h3 className="font-serif font-bold text-stone-800 mt-2 text-base line-clamp-1">
            {product.name}
          </h3>
          <p className="text-stone-500 text-xs mt-1 line-clamp-2">
            {product.description}
          </p>
          <p className="text-[#6B1D2F] font-bold text-lg mt-2">
            ₹{product.price}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
        <Link
          href={`/product/${product.id}`}
          className="text-center border border-stone-300 text-stone-700 py-2 rounded text-xs font-bold uppercase hover:bg-stone-50 transition"
        >
          View Details
        </Link>
        <button
          onClick={() => addToCart({ ...product, quantity: 1, size: 'M' })}
          className="bg-[#6B1D2F] text-white py-2 rounded text-xs font-bold uppercase hover:bg-[#521624] transition cursor-pointer"
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
}