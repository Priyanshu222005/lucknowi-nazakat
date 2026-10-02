import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`API response failed with status ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product in SSR:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Fallback defaults agar DB mein specific data null ho
  const productName =
    product?.name || "Handcrafted Lucknowi Chikankari Women's Kurti";
  const productCategory = product?.category || "Women's Collection";
  const productPrice =
    product?.price && Number(product.price) > 0 ? Number(product.price) : 2499;
  const imageSrc =
    product?.image || product?.imageUrl || '/images/placeholder.jpg';
  const productDescription =
    product?.description ||
    'Exquisite hand-embroidered Lucknowi Chikankari Kurti crafted for women with pure georgette/cotton fabric, delicate shadow work, and royal elegance.';

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
          {/* Product Image */}
          <div className="md:col-span-6">
            <div className="relative w-full h-[420px] md:h-[520px] bg-stone-100 rounded-xl overflow-hidden border border-stone-200/60 shadow-inner">
              <Image
                src={imageSrc}
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
                className="object-cover hover:scale-105 transition duration-500"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#6B1D2F] text-white px-2.5 py-1 rounded inline-block mb-3">
                {productCategory}
              </span>

              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-snug">
                {productName}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl md:text-3xl font-bold text-[#6B1D2F]">
                  ₹{productPrice}
                </span>
                <span className="text-xs text-stone-500">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            <p className="text-stone-600 text-xs md:text-sm leading-relaxed border-t border-b border-stone-100 py-4">
              {productDescription}
            </p>

            <div className="space-y-2 text-xs text-stone-700 font-medium">
              <p>
                <span className="text-stone-400 font-normal">Fabric:</span> Pure
                Cotton / Premium Georgette
              </p>
              <p>
                <span className="text-stone-400 font-normal">Craft:</span> Hand
                Embroidered Lucknowi Chikankari
              </p>
              <p>
                <span className="text-stone-400 font-normal">Fit Type:</span>{' '}
                Regular / Comfort Elegant Fit
              </p>
            </div>

            <ProductActions
              product={{
                id: product?.id || slug,
                name: productName,
                price: productPrice,
                image: imageSrc,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}