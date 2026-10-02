import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductActions from './ProductActions';

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      category: product.category || 'Chikankari',
      description: product.description || '',
      image: product.imageUrl || product.image || '/images/placeholder.jpg',
    };
  } catch (error) {
    console.error('Database fetch error:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-[#6B1D2F] mb-2 font-serif">
          Product Not Found
        </h2>
        <p className="text-stone-600 text-xs mb-6">
          The requested product ID could not be found in the database.
        </p>
        <Link
          href="/shop"
          className="bg-[#6B1D2F] text-white text-xs font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider hover:bg-[#521624] transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const imageSrc = product.image || product.imageUrl || '/images/placeholder.jpg';

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-stone-200/80 p-6 md:p-10 shadow-sm">
        <div className="mb-6">
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-[#6B1D2F] font-bold hover:underline inline-flex items-center gap-1.5"
          >
            ← Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Dynamic Product Image */}
          <div className="md:col-span-6">
            <div className="relative w-full h-[420px] md:h-[520px] bg-stone-100 rounded-xl overflow-hidden border border-stone-200/60 shadow-inner">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition duration-500"
                priority
              />
            </div>
          </div>

          {/* Dynamic Product Details */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#6B1D2F] text-white px-2.5 py-1 rounded inline-block mb-3">
                {product.category || 'Chikankari'}
              </span>

              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl md:text-3xl font-bold text-[#6B1D2F]">
                  ₹{product.price}
                </span>
                <span className="text-xs text-stone-500">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            <p className="text-stone-600 text-xs md:text-sm leading-relaxed border-t border-b border-stone-100 py-4">
              {product.description ||
                'Authentic hand-embroidered Lucknowi Chikankari product crafted with premium fabric for absolute elegance.'}
            </p>

            <div className="space-y-2 text-xs text-stone-700 font-medium">
              <p>
                <span className="text-stone-400 font-normal">Fabric:</span> Pure Cotton / Georgette
              </p>
              <p>
                <span className="text-stone-400 font-normal">Craft:</span> Hand Embroidered Chikankari
              </p>
              <p>
                <span className="text-stone-400 font-normal">Fit Type:</span> Regular / Comfort Fit
              </p>
            </div>

            <ProductActions
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: imageSrc,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}