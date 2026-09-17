'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Women', href: '/women' },
    { name: 'Men', href: '/men' },
    { name: 'Kids', href: '/kids' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Sale', href: '/sale', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#2D2D2D] focus:outline-none p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl md:text-3xl tracking-widest text-[#6B1D2F] font-bold block uppercase">
                Lucknowi Nazakat
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] block font-medium uppercase -mt-1">
                Elegance Woven in Tradition
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wide font-medium transition-colors hover:text-[#6B1D2F] ${
                  link.highlight ? 'text-[#6B1D2F] font-semibold' : 'text-[#2D2D2D]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/shop?search=true" className="text-[#2D2D2D] p-1" aria-label="Search">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link href="/wishlist" className="text-[#2D2D2D] p-1 relative" aria-label="Wishlist">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link href="/account" className="text-[#2D2D2D] p-1" aria-label="Account">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link href="/cart" className="text-[#2D2D2D] p-1 relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}