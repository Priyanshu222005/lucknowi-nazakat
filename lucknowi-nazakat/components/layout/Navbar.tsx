'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const { items, toggleCart } = useCartStore();

  const totalCartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-[#6B1D2F] text-[#D4AF37] text-xs py-1.5 text-center font-medium tracking-wider">
        ✨ FREE SHIPPING ON ORDERS ABOVE ₹2,999 | HANDCRAFTED IN LUCKNOW ✨
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#6B1D2F] tracking-wider">
            LUCKNOWI NAZAKAT
          </span>
          <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.25em] font-medium -mt-1">
            Elegance Woven In Tradition
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-700">
          <Link href="/shop" className="hover:text-[#6B1D2F] transition">
            Shop All
          </Link>
          <Link href="/shop?category=women" className="hover:text-[#6B1D2F] transition">
            Women
          </Link>
          <Link href="/shop?category=men" className="hover:text-[#6B1D2F] transition">
            Men
          </Link>
          <Link href="/shop?filter=sale" className="text-[#6B1D2F] font-bold hover:opacity-80 transition">
            Sale
          </Link>
        </div>

        {/* Shopping Cart Icon */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleCart}
            className="relative p-2 text-stone-700 hover:text-[#6B1D2F] transition"
            aria-label="Shopping Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
              />
            </svg>

            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#6B1D2F] text-[#D4AF37] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}