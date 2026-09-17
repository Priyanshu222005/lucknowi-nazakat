
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { toggleCart, getTotalItems } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#6B1D2F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-[#2D2D2D] hover:text-[#6B1D2F]">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center">
            <span className="font-serif text-2xl md:text-3xl font-bold tracking-wider text-[#6B1D2F]">
              LUCKNOWI NAZAKAT
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
              Elegance Woven in Tradition
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
            <Link href="/shop" className="hover:text-[#6B1D2F] transition-colors">Shop All</Link>
            <Link href="/women" className="hover:text-[#6B1D2F] transition-colors">Women</Link>
            <Link href="/men" className="hover:text-[#6B1D2F] transition-colors">Men</Link>
            <Link href="/new-arrivals" className="hover:text-[#6B1D2F] transition-colors">New Arrivals</Link>
            <Link href="/sale" className="text-[#6B1D2F] font-semibold hover:underline">Sale</Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-[#2D2D2D] hover:text-[#6B1D2F] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#2D2D2D] hover:text-[#6B1D2F] transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleCart}
              className="p-2 text-[#2D2D2D] hover:text-[#6B1D2F] transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {isMounted && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6B1D2F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}