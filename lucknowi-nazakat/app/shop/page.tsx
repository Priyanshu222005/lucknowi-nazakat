'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 w-full">
        <h1 className="font-serif text-3xl font-bold text-[#6B1D2F] mb-8 text-center">
          Our Lucknowi Collection
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => {
            const images = JSON.parse(p.images || '[]');
            const imgSrc = images[0] || '/images/placeholder.jpg';

            return (
              <div key={p.id} className="bg-white rounded-lg border border-stone-200 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <img
                    src={imgSrc}
                    alt={p.name}
                    className="w-full h-80 object-cover rounded mb-4"
                  />
                  <span className="text-[10px] font-bold uppercase text-[#F3E5AB] bg-[#6B1D2F] px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-800 mt-2">{p.name}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 my-2">{p.description}</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-[#6B1D2F] text-base">₹{p.price}</p>
                    {p.originalPrice && (
                      <p className="text-xs text-stone-400 line-through">₹{p.originalPrice}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    addToCart({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      image: imgSrc,
                      size: 'M',
                      quantity: 1,
                    })
                  }
                  className="mt-4 w-full bg-[#6B1D2F] text-white py-2.5 rounded text-xs font-bold uppercase hover:bg-[#521624] transition cursor-pointer"
                >
                  + Add To Cart
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}