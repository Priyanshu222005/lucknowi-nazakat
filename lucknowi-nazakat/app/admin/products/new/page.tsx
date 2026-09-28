'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
  stock: number;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const cartContext = useCart();
  const addToCart = cartContext?.addToCart;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Product fetch error:', err);
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  // Multi-image support: images array first, single image as fallback
  const gallery: string[] = product
    ? (product.images && product.images.length > 0
        ? product.images
        : [product.image || FALLBACK_IMAGE]
      ).filter(Boolean)
    : [];

  const handleAddToCart = () => {
    if (!product || !addToCart) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: gallery[0] || FALLBACK_IMAGE,
      category: product.category,
      size,
      quantity,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full">
        {loading ? (
          <div className="py-24 text-center text-xs font-bold text-stone-500">
            Loading product...
          </div>
        ) : notFound || !product ? (
          <div className="py-24 text-center space-y-4">
            <h1 className="font-serif text-2xl font-bold text-[#6B1D2F]">Product Not Found</h1>
            <p className="text-xs text-stone-500">Ye product ab available nahi hai.</p>
            <Link
              href="/shop"
              className="inline-block bg-[#6B1D2F] text-white px-6 py-2.5 rounded text-xs font-bold uppercase hover:bg-[#521624] transition"
            >
              Back to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="bg-white border border-stone-200 rounded-lg p-3 shadow-sm">
                <img
                  src={gallery[activeImage] || FALLBACK_IMAGE}
                  alt={product.name}
                  className="w-full h-[480px] object-cover rounded"
                />
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-3">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded border-2 overflow-hidden cursor-pointer transition ${
                        activeImage === idx ? 'border-[#6B1D2F]' : 'border-stone-200'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <span className="text-[10px] font-bold uppercase text-[#F3E5AB] bg-[#6B1D2F] px-2 py-0.5 rounded">
                {product.category}
              </span>

              <h1 className="font-serif text-3xl font-bold text-stone-900">{product.name}</h1>

              <p className="text-2xl font-bold text-[#6B1D2F]">₹{product.price}</p>

              {product.description && (
                <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
              )}

              <span
                className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded ${
                  product.stock > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>

              {/* Size Selector */}
              <div>
                <p className="text-xs font-bold uppercase text-stone-700 mb-2">Select Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`w-12 h-10 rounded border text-xs font-bold cursor-pointer transition ${
                        size === s
                          ? 'bg-[#6B1D2F] text-white border-[#6B1D2F]'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#6B1D2F]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-xs font-bold uppercase text-stone-700 mb-2">Quantity</p>
                <div className="inline-flex items-center border border-stone-300 rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-sm font-bold hover:bg-stone-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 text-sm font-bold hover:bg-stone-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-[#6B1D2F] text-white py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition disabled:opacity-50 cursor-pointer shadow"
                >
                  {product.stock > 0 ? '+ Add To Cart' : 'Out of Stock'}
                </button>
                <Link
                  href="/shop"
                  className="px-6 py-3.5 border border-[#6B1D2F] text-[#6B1D2F] rounded text-xs font-bold uppercase text-center hover:bg-stone-50 transition"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}