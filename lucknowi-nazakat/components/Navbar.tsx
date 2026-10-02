'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const cartContext = useCart();
  const cart = cartContext?.cart || [];

  // Total items quantity count calculate karna
  const totalItemsCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  return (
    <header className="bg-[#6B1D2F] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-lg sm:text-2xl font-bold tracking-wide">
            LUCKNOWI NAZAKAT
          </span>
          <span className="text-[10px] sm:text-xs tracking-widest text-stone-300 uppercase">
            Authentic Chikankari
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-semibold uppercase tracking-wider">
          <Link href="/" className="hover:text-amber-200 transition">Home</Link>
          <Link href="/shop" className="hover:text-amber-200 transition">Shop All</Link>
          <Link href="/shop?category=Kurtis" className="hover:text-amber-200 transition">Women</Link>
          <Link href="/shop?category=Sarees" className="hover:text-amber-200 transition">Sarees</Link>
          <Link href="/admin" className="hover:text-amber-200 transition">Admin Panel</Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            href="/checkout"
            className="bg-white text-[#6B1D2F] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase flex items-center gap-1.5 shadow hover:bg-stone-100 transition"
          >
            <span>CART</span>
            {totalItemsCount > 0 && (
              <span className="bg-[#6B1D2F] text-white rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center text-[11px] font-bold leading-none">
                {totalItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="md:hidden bg-[#521624] px-4 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider overflow-x-auto whitespace-nowrap space-x-4 border-t border-[#7d2238]">
        <Link href="/" className="hover:text-amber-200">Home</Link>
        <Link href="/shop" className="hover:text-amber-200">Shop All</Link>
        <Link href="/shop?category=Kurtis" className="hover:text-amber-200">Women</Link>
        <Link href="/shop?category=Sarees" className="hover:text-amber-200">Sarees</Link>
        <Link href="/admin" className="hover:text-amber-200">Admin</Link>
      </div>
    </header>
  );
}