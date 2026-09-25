'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const defaultFallbackImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';

  useEffect(() => {
    if (slug) {
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.product) {
            setProduct(data.product);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-xs font-semibold text-stone-500 py-20">
          Loading Lucknowi Collection Details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20 text-center">
          <h2 className="font-serif text-2xl font-bold text-[#6B1D2F] mb-2">Product Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">Yeh product available nahi hai ya remove kar diya gaya hai.</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-[#6B1D2F] text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition cursor-pointer"
          >
            Back To Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse images securely
  let images: string[] = [];
  try {
    if (product.images) {
      images = JSON.parse(product.images);
    }
  } catch (e) {
    images = [];
  }

  if (!images.length && product.image) {
    images = [product.image];
  }

  if (!images.length) {
    images = [defaultFallbackImage];
  }

  const mainImage = images[activeImageIndex] || defaultFallbackImage;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      size: selectedSize,
      quantity: quantity,
    });
    alert(`✅ ${product.name} (Size: ${selectedSize}) Cart mein add ho gaya!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-stone-500 mb-8 uppercase tracking-wider">
          <span className="cursor-pointer hover:underline" onClick={() => router.push('/')}>Home</span> / 
          <span className="cursor-pointer hover:underline ml-1" onClick={() => router.push('/shop')}>Shop</span> / 
          <span className="text-[#6B1D2F] font-bold ml-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-[520px] object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== defaultFallbackImage) {
                    target.src = defaultFallbackImage;
                  }
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`border-2 rounded overflow-hidden w-20 h-20 transition flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-[#6B1D2F]' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultFallbackImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F3E5AB] bg-[#6B1D2F] px-2.5 py-1 rounded">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mt-3">{product.name}</h1>
              <div className="flex items-center space-x-3 mt-3">
                <span className="text-2xl font-bold text-[#6B1D2F]">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed border-t border-b py-4 border-stone-200">
              {product.description || 'Handcrafted Chikankari apparel direct from Lucknow artisans.'}
            </p>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">Select Size</label>
              <div className="flex space-x-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded border text-xs font-bold uppercase transition cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#6B1D2F] text-white border-[#6B1D2F] shadow-sm'
                        : 'bg-white text-stone-800 border-stone-300 hover:border-[#6B1D2F]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded bg-stone-200 text-stone-800 font-bold hover:bg-stone-300 transition cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-bold w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded bg-stone-200 text-stone-800 font-bold hover:bg-stone-300 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#6B1D2F] text-white py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#521624] transition shadow cursor-pointer"
              >
                + Add To Cart
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  router.push('/checkout');
                }}
                className="flex-1 bg-[#F3E5AB] text-[#6B1D2F] py-3.5 rounded text-xs font-bold uppercase tracking-wider hover:bg-amber-200 transition border border-[#6B1D2F] shadow cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}