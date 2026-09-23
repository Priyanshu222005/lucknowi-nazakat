'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';

export default function AdminProductDetailPage({ product }: { product?: Product }) {
  const [imgSrc, setImgSrc] = useState<string>(
    product?.image || DEFAULT_IMAGE
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow-sm bg-gray-100">
          <Image
            src={imgSrc}
            alt={product?.name || 'Lucknowi Chikankari Product'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-lg"
            priority
            onError={() => {
              setImgSrc(DEFAULT_IMAGE);
            }}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
            {product?.category || 'Chikankari Collection'}
          </span>
          <h1 className="text-3xl font-serif text-gray-900 font-bold">
            {product?.name || 'Lucknowi Nazakat Kurti'}
          </h1>
          <p className="text-2xl font-semibold text-gray-800">
            ₹{product?.price ? product.price.toLocaleString('en-IN') : '2,499'}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product?.description ||
              'Authentic hand-embroidered Lucknowi Chikankari craftsmanship crafted with fine fabric.'}
          </p>
        </div>
      </div>
    </div>
  );
}