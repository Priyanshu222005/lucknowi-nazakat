'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image?: string;
    images?: string[];
    category: string;
    isNew?: boolean;
    isBestSeller?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Safe price fallback
  const price = Number(product?.price) || 0;
  const originalPrice = product?.originalPrice ? Number(product.originalPrice) : null;

  // Safe image fallback
  let imageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80';
  if (product?.image) {
    imageUrl = product.image;
  } else if (product?.images && product.images.length > 0) {
    imageUrl = product.images[0];
  }

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product?.name || 'Lucknowi Chikankari Apparel'}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product?.isNew && (
            <span className="bg-[#6B1D2F] text-[#D4AF37] text-[10px] uppercase font-semibold px-2.5 py-1 rounded shadow-sm tracking-wider">
              New
            </span>
          )}
          {product?.isBestSeller && (
            <span className="bg-[#D4AF37] text-[#6B1D2F] text-[10px] uppercase font-bold px-2.5 py-1 rounded shadow-sm tracking-wider">
              Bestseller
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
            {product?.category || 'Chikankari'}
          </p>
          <Link href={`/product/${product?.slug || product?.id}`}>
            <h3 className="font-serif font-medium text-stone-900 group-hover:text-[#6B1D2F] transition-colors line-clamp-2">
              {product?.name || 'Chikankari Product'}
            </h3>
          </Link>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline space-x-2 pt-3">
          <span className="text-lg font-bold text-[#6B1D2F]">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-stone-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}