'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams?.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');

  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products || [];

        const found = list.find((p: any) =>
          String(p.id) === String(productId) ||
          String(p._id) === String(productId) ||
          String(p.name) === decodeURIComponent(String(productId))
        );

        setProduct(found || null);
      } catch (err) {
        console.error('Fetch product detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20 text-xs font-semibold text-stone-500">
            Loading Product Details...
          </div>
        ) : !product ? (
          <div className="text-center py-20 space-y-4">
            <h2 className="text-xl font-bold text-stone-800">Product Details Not Found</h2>
            <p className="text-xs text-stone-500">Ye product details available nahi hain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-lg border border-stone-200 shadow-sm">
            <div className="w-full h-80 md:h-[450px] bg-stone-100 rounded overflow-hidden">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
                }}
              />
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-wider uppercase bg-[#6B1D2F] text-white px-3 py-1 rounded inline-block">
                  {product.category || 'Kurtis'}
                </span>

                <h1 className="font-serif text-2xl md:text-3xl font-bold text-stone-900">
                  {product.name}
                </h1>

                <p className="text-2xl font-bold text-[#6B1D2F]">
                  ₹{product.price}
                </p>

                <p className="text-xs md:text-sm text-stone-600 leading-relaxed pt-2">
                  {product.description || 'Authentic Chikankari Collection. Handcrafted embroidery work.'}
                </p>

                <div className="pt-4">
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-2">Select Size</label>
                  <div className="flex gap-3">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded text-xs font-bold border transition ${
                          selectedSize === size
                            ? 'border-[#6B1D2F] bg-[#6B1D2F] text-white'
                            : 'border-stone-300 text-stone-800 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => addToCart && addToCart({ ...product, size: selectedSize })}
                className="w-full bg-[#6B1D2F] text-white py-4 rounded text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-[#521624] transition shadow cursor-pointer"
              >
                + Add To Cart
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}