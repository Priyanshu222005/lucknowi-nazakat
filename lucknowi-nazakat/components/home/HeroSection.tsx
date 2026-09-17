import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-[#F4EBE1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold border-b border-[#D4AF37] pb-1">
            Handcrafted Lakhnavi Craftsmanship
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#6B1D2F] leading-tight">
            Elegance Woven in Tradition
          </h1>
          <p className="text-[#2D2D2D]/80 text-base sm:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
            Discover timeless Indian ethnic couture crafted with delicate Chikankari embroidery, designed for modern grace and royalty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#6B1D2F] text-[#FAF7F2] text-xs font-bold tracking-widest uppercase hover:bg-[#521523] transition-colors text-center"
            >
              SHOP COLLECTION
            </Link>
            <Link
              href="/new-arrivals"
              className="w-full sm:w-auto px-8 py-3.5 border border-[#6B1D2F] text-[#6B1D2F] text-xs font-bold tracking-widest uppercase hover:bg-[#6B1D2F] hover:text-white transition-colors text-center"
            >
              EXPLORE NEW ARRIVALS
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-10 md:mt-0 relative">
          <div className="relative aspect-[4/5] max-w-md mx-auto shadow-2xl overflow-hidden border-8 border-white">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
              alt="Lucknowi Nazakat Collection"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}