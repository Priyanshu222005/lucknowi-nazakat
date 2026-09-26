'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: any }) {
  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;

  const productId = product.id || product._id || product.slug || '1';

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="relative w-full h-56 sm:h-72 bg-stone-100 overflow-hidden">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
            }}
          />
        </div>

        <div className="p-4 space-y-2">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-[#6B1D2F] text-white px-2.5 py-1 rounded">
            {product.category || 'Kurtis'}
          </span>

          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 line-clamp-1 pt-1">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2">
            {product.description || 'Authentic Chikankari Collection'}
          </p>

          <p className="text-base sm:text-lg font-bold text-[#6B1D2F]">
            ₹{product.price}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Link
          href={`/products/${encodeURIComponent(productId)}`}
          className="w-full text-center border border-[#6B1D2F] text-[#6B1D2F] py-2.5 rounded text-xs sm:text-sm font-bold uppercase hover:bg-stone-50 transition flex items-center justify-center"
        >
          View Details
        </Link>

        <button
          type="button"
          onClick={() => addToCart && addToCart(product)}
          className="w-full bg-[#6B1D2F] text-white py-2.5 rounded text-xs sm:text-sm font-bold uppercase hover:bg-[#521624] transition flex items-center justify-center"
        >
          + Add To Cart
        </button>
      </div>
    </div>
  );
}