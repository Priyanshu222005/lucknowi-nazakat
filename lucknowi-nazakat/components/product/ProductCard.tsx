'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  image,
  category,
  rating = 4.9,
  isNew = false,
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      slug,
      price,
      image,
      size: 'M',
    });
  };

  return (
    <div className="group relative bg-white border border-[#6B1D2F]/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#F4EBE1] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <span className="bg-[#6B1D2F] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              New
            </span>
          )}
          {originalPrice && originalPrice > price && (
            <span className="bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-[#6B1D2F] rounded-full transition-colors">
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 bg-[#6B1D2F] text-white py-2.5 px-4 rounded font-medium text-xs tracking-wider uppercase flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-[#521624]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Bag</span>
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 space-y-1">
        <span className="text-[11px] font-semibold tracking-wider text-[#D4AF37] uppercase">
          {category}
        </span>

        <Link href={`/product/${slug}`}>
          <h3 className="font-serif text-sm font-semibold text-[#2D2D2D] hover:text-[#6B1D2F] transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 pt-1">
          <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
          <span className="text-xs font-semibold text-gray-700">{rating}</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 pt-1">
          <span className="text-base font-bold text-[#6B1D2F]">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}