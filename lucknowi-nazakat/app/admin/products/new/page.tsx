import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  imageUrl?: string;
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      category: p.category || 'Chikankari',
      image: p.imageUrl || p.image || '/images/placeholder.jpg',
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  const categories = [
    {
      name: "Georgette & Cotton Kurtis",
      sub: "Women Collection",
      image: '/images/placeholder.jpg',
      href: '/shop?cat=kurtis',
    },
    {
      name: "Modal Silk & Pure Drapings",
      sub: "Saree Specials",
      image: '/images/placeholder.jpg',
      href: '/shop?cat=sarees',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900">
      {/* Announcement Bar */}
      <div className="bg-[#521624] text-amber-100 text-[11px] font-bold py-2 text-center tracking-widest uppercase border-b border-amber-900/40">
        ✨ Festival Special: Free Shipping Across India On Orders Above ₹1999 ✨
      </div>

      {/* Hero Banner Section */}
      <section className="bg-[#6B1D2F] text-white py-12 md:py-16 px-4 text-center border-b border-stone-200">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-amber-200 font-bold bg-white/10 px-3 py-1 rounded-full inline-block">
            Handcrafted Elegance From Lucknow
          </span>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 leading-tight">
            Timeless Chikankari Luxury
          </h1>

          <p className="text-stone-200 text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Discover exquisite hand-embroidered Kurtis and Sarees crafted by master artisans with authentic Lucknowi heritage.
          </p>

          <div className="pt-2">
            <Link
              href="/shop"
              className="bg-[#FAF7F2] text-[#6B1D2F] hover:bg-white font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-lg shadow transition inline-block"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#6B1D2F]">
              Featured Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-[#6B1D2F] uppercase tracking-wider hover:underline"
          >
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={cat.href}
              className="group relative h-48 md:h-56 rounded-xl overflow-hidden shadow-sm border border-stone-200 block"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#521624] via-[#521624]/60 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 mb-1">
                  {cat.sub}
                </span>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-6xl mx-auto py-6 px-4 sm:px-6 mb-12">
        <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#6B1D2F]">
              Trending Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-[#6B1D2F] uppercase tracking-wider hover:underline"
          >
            SHOP ALL →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <Link href={`/product/${product.id}`} className="block relative group">
                  <div className="relative w-full h-52 sm:h-64 bg-stone-100 overflow-hidden">
                    <Image
                      src={product.image || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B1D2F] bg-stone-100 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <h3 className="text-xs md:text-sm font-semibold text-stone-800 line-clamp-1 mt-1.5">
                      {product.name}
                    </h3>
                    <p className="text-sm md:text-base font-bold text-[#6B1D2F] mt-1">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>

                <div className="p-3 pt-0">
                  <Link
                    href={`/product/${product.id}`}
                    className="w-full block text-center bg-[#6B1D2F] hover:bg-[#521624] text-white text-[11px] font-bold uppercase tracking-wider py-2 rounded transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl border border-stone-200">
            <p className="text-stone-500 text-xs">Products available directly in shop section.</p>
            <Link
              href="/shop"
              className="mt-3 inline-block bg-[#6B1D2F] text-white text-xs font-bold px-6 py-2 rounded"
            >
              Go To Shop
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}