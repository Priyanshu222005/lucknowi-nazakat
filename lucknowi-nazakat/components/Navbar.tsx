'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#6B1D2F] text-[#FAF9F6] shadow-md border-b border-[#8B263E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-widest uppercase text-[#F3E5AB]">
              Lucknowi Nazakat
            </span>
            <span className="text-[10px] tracking-[0.25em] text-stone-300 uppercase -mt-1">
              Authentic Chikankari
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider">
            <Link href="/" className="hover:text-[#F3E5AB] transition">Home</Link>
            <Link href="/shop" className="hover:text-[#F3E5AB] transition">Shop All</Link>
            <Link href="/shop?category=women" className="hover:text-[#F3E5AB] transition">Women</Link>
            <Link href="/shop?category=sarees" className="hover:text-[#F3E5AB] transition">Sarees</Link>
            <Link href="/admin/orders" className="text-[#F3E5AB] hover:underline">Admin Panel</Link>
          </nav>

          {/* Cart Icon & Actions */}
          <div className="flex items-center space-x-6">
            <Link href="/checkout" className="relative flex items-center bg-[#521624] px-4 py-2 rounded-full border border-[#8B263E] hover:border-[#F3E5AB] transition">
              <span className="text-xs font-bold mr-2">CART</span>
              <span className="bg-[#F3E5AB] text-[#6B1D2F] text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}